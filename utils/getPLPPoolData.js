const addresses = require("../addresses/PLPPool") // Get all relevant Ethereum and avax addresses
const priceFeeds = require("../addresses/priceFeeds").priceFeeds
const MCPV3Abi = require("../abi/MasterPLPV3Abi.json") // Get the token ABI for the project. ABIs can be found on the Etherscan page for the contract if the contract has been verified. Otherwise you may need to ask your Solidity dev for it.
const rewarderAbi = require("../abi/PLPRewarderAbi.json")
const priceFeedAbi = require("../abi/PriceFeedAbi.json")
const ERC20Abi = require("../abi/ERC20Abi.json")
const PLPAssetAbi = require("../abi/PLPAssetAbi.json")
const MCVTXAbi = require("../abi/MasterChefVTXAbi.json")

const numeral = require("numeral") // NPM package for formatting numbers
const db = require("./db") // Util for setting up DB and main DB methods
const SECONDS_PER_YEAR = 31622400
const apyUtils = require("./apyUtils")
// Async function which takes in web3 collection, makes web3 calls to get current on chain data, formats data, and caches formatted data to MongoDB
const getPLPPoolData = async (web3s) => {
    // Unpack web3 objects for Ethereum and avax
    const {
        avax_web3
    } = web3s
    // // Get Ethereum block number 
    // const blockNumber = await web3.eth.getBlockNumber()

    let avax_blockNumber
    try {
        avax_blockNumber = await avax_web3.eth.getBlockNumber()
    } catch (err) {
        avax_blockNumber = 0
        console.log("CANT GET avax_blockNumber")
        console.log(err)
    }
    // Collect addresses in one 'addresses' object
    const {
        PLPAddresses
    } = addresses
    // Set number formatting default
    numeral.defaultFormat("0,0");

    // Instantiate all smart contract object(s)

    // web3.eth.Contract() creates a smart contract object using the ABI and address of the contract which allows you to call all the smart contract functions listed in the ABI. Since we are not supplying a private key to our web3 object, we can only use it for reading on chain data, not for anything requiring signing - which is all we need for this project.
    // Here we instantiate the Ethereum smart contract object
    let MC = new avax_web3.eth.Contract(MCPV3Abi, PLPAddresses.MasterPlatypusV3Address)
    let PTPPriceFeed = new avax_web3.eth.Contract(priceFeedAbi, priceFeeds.PTP)
    let YETIPriceFeed = new avax_web3.eth.Contract(priceFeedAbi, priceFeeds.YETI)
    let YUSDPriceFeed = new avax_web3.eth.Contract(priceFeedAbi, priceFeeds.YUSD)
    let USDCPriceFeed = new avax_web3.eth.Contract(priceFeedAbi, priceFeeds.USDC)
    let VTXPriceFeed = new avax_web3.eth.Contract(priceFeedAbi, priceFeeds.VTX)
    let USDCRewarder = new avax_web3.eth.Contract(rewarderAbi, PLPAddresses.USDCRewarderAddress)
    let YUSDRewarder = new avax_web3.eth.Contract(rewarderAbi, PLPAddresses.YUSDRewarderAddress)
    let YUSDAsset = new avax_web3.eth.Contract(PLPAssetAbi, PLPAddresses.YUSDAssetAddress)
    let USDCAsset = new avax_web3.eth.Contract(PLPAssetAbi, PLPAddresses.USDCAssetAddress)
    let MCVTX = new avax_web3.eth.Contract(MCVTXAbi, PLPAddresses.MasterChefVTXAddress)

    // For converting to proper number of decimals. We use this to convert from raw numbers returned from web3 calls to human readable formatted numbers based on the decimals for each token.  
    const convert = (num, decimal) => {
        return Math.round((num / (10 * 10 ** (decimal - 3)))) / 100
    }

    // Make tokenData object. This object is used for storing formatted and calculated results from web3 calls from both Ethereum and avax web3 objects. It is divided into 3 sections for data on avax, Ethereum, and aggregate data from both chains in 'combined'.

    let APRData = {
        USDC: {
            PTPBase: {
                value: null
            },
            YETI: {
                value: null
            },
            TotalBase: {
                value: null
            },
            Deposits: {
                value: null,
                usd: null
            },
            Vector: {
                PTP: {
                    value: null
                },
                YETI: {
                    value: null
                },
                VTX: {
                    value: null
                }
            }
        },
        YUSD: {
            PTPBase: {
                value: null
            },
            YETI: {
                value: null
            },
            TotalBase: {
                value: null
            },
            Deposits: {
                value: null,
                usd: null
            },
            Vector: {
                PTP: {
                    value: null
                },
                YETI: {
                    value: null
                },
                VTX: {
                    value: null
                }
            }
        }

    }

    const totalAdjustedAllocPoint = Number(await MC.methods.totalAdjustedAllocPoint().call())
    const ptpPerSec = Number(await MC.methods.ptpPerSec().call()) / 10 ** 18
    const dialutingRepartition = Number(await MC.methods.dialutingRepartition().call())

    const VTXTotalAllocPoint = Number(await MCVTX.methods.totalAllocPoint().call())
    const vtxPerSec = Number(await MCVTX.methods.vtxPerSec().call()) / 10 ** 18

    const YETIPrice = Number(await YETIPriceFeed.methods.fetchPrice_v().call()) / 10 ** 18
    const PTPPrice = Number(await PTPPriceFeed.methods.fetchPrice_v().call()) / 10 ** 18
    const YUSDPrice = Number(await YUSDPriceFeed.methods.fetchPrice_v().call()) / 10 ** 18
    const USDCPrice = Number(await USDCPriceFeed.methods.fetchPrice_v().call()) / 10 ** 18
    const VTXPrice = Number(await VTXPriceFeed.methods.fetchPrice_v().call()) / 10 ** 18

    /**
     * USDC rewards
     */

    const USDCCash = Number(await USDCAsset.methods.cash().call())
    const USDCLiability = Number(await USDCAsset.methods.liability().call())
    const USDCRatio = USDCCash / USDCLiability


    const USDCPoolInfo = await MC.methods.poolInfo(PLPAddresses.USDCPID).call()
    const USDCLPTokenAddress = USDCPoolInfo[0]
    const USDCAdjustedAllocPoint = Number(USDCPoolInfo[7])

    let USDCLPToken = new avax_web3.eth.Contract(ERC20Abi, USDCLPTokenAddress)
    let USDCToken = new avax_web3.eth.Contract(ERC20Abi, PLPAddresses.USDCAddress)

    const USDCLPTotalSupply = Number(await USDCLPToken.methods.totalSupply().call()) / 10 ** 18
    const totalUSDCDeposited = Number(await USDCToken.methods.balanceOf(USDCLPTokenAddress).call()) / 10 ** 6

    const USDCLPValue = USDCPrice * totalUSDCDeposited

    const USDCPoolPTPRewardValue = PTPPrice * (USDCAdjustedAllocPoint / totalAdjustedAllocPoint) * SECONDS_PER_YEAR * ptpPerSec

    const USDCPTPBaseAPR = USDCPoolPTPRewardValue / USDCLPValue * dialutingRepartition / 1000 * USDCRatio

    const USDCRewarderTokenPerSec = Number(await USDCRewarder.methods.tokenPerSec().call()) / 10 ** 18

    const USDCYETIRewardValue = YETIPrice * USDCRewarderTokenPerSec * SECONDS_PER_YEAR

    const USDCYETIAPR = USDCYETIRewardValue / USDCLPValue * USDCRatio

    APRData.USDC.PTPBase.value = USDCPTPBaseAPR
    APRData.USDC.YETI.value = USDCYETIAPR
    APRData.USDC.TotalBase.value = USDCYETIAPR + USDCPTPBaseAPR
    APRData.USDC.Deposits.value = totalUSDCDeposited
    APRData.USDC.Deposits.usd = USDCLPValue

    /**
     * Vecotr USDC Rewards
     */

    const vectorUSDCUserInfo = await MC.methods.userInfo(PLPAddresses.USDCPID, PLPAddresses.VectorMainStakingAddress).call()
    const vectorUSDCFactor = Number(vectorUSDCUserInfo[2])

    const USDCPTPBoostTotalAPR = USDCPoolPTPRewardValue / USDCLPValue * (1000 - dialutingRepartition) / 1000 * USDCRatio
    const USDCSumFactors = Number(USDCPoolInfo[5])

    const vecotrUSDCBoostAPR = (USDCPTPBoostTotalAPR * (vectorUSDCFactor / USDCSumFactors) + USDCPTPBaseAPR) * .82
    const USDCVTXPoolInfo = await MCVTX.methods.getPoolInfo(PLPAddresses.VecotrUSDCLPTokenAddress).call()
    const USDCVTXAllocPoint = Number(USDCVTXPoolInfo[1]) 
    const USDCDeposits = Number(USDCVTXPoolInfo[2]) / 10 ** 6

    const USDCVTXPerYear = (USDCVTXAllocPoint / VTXTotalAllocPoint) * vtxPerSec * SECONDS_PER_YEAR

    const USDCVTXAPR = USDCVTXPerYear * VTXPrice / (USDCDeposits * USDCPrice)


    APRData.USDC.Vector.PTP.value = vecotrUSDCBoostAPR
    APRData.USDC.Vector.VTX.value = USDCVTXAPR


    /**
     * YUSD rewards
     */

    const YUSDCash = Number(await YUSDAsset.methods.cash().call())
    const YUSDLiability = Number(await YUSDAsset.methods.liability().call())
    const YUSDRatio = YUSDCash / YUSDLiability

    const YUSDPoolInfo = await MC.methods.poolInfo(PLPAddresses.YUSDPID).call()
    const YUSDLPTokenAddress = YUSDPoolInfo[0]
    const YUSDAdjustedAllocPoint = Number(YUSDPoolInfo[7])

    let YUSDLPToken = new avax_web3.eth.Contract(ERC20Abi, YUSDLPTokenAddress)
    let YUSDToken = new avax_web3.eth.Contract(ERC20Abi, PLPAddresses.YUSDAddress)

    const YUSDLPTotalSupply = Number(await YUSDLPToken.methods.totalSupply().call()) / 10 ** 18
    const totalYUSDDeposited = Number(await YUSDToken.methods.balanceOf(YUSDLPTokenAddress).call()) / 10 ** 18

    const YUSDLPValue = YUSDPrice * totalYUSDDeposited

    const YUSDPoolPTPRewardValue = PTPPrice * (YUSDAdjustedAllocPoint / totalAdjustedAllocPoint) * SECONDS_PER_YEAR * ptpPerSec

    const YUSDPTPBaseAPR = YUSDPoolPTPRewardValue / YUSDLPValue * dialutingRepartition / 1000 * YUSDRatio

    const YUSDRewarderTokenPerSec = Number(await YUSDRewarder.methods.tokenPerSec().call()) / 10 ** 18

    const YUSDYETIRewardValue = YETIPrice * YUSDRewarderTokenPerSec * SECONDS_PER_YEAR

    const YUSDYETIAPR = YUSDYETIRewardValue / YUSDLPValue * YUSDRatio

    APRData.YUSD.PTPBase.value = YUSDPTPBaseAPR
    APRData.YUSD.YETI.value = YUSDYETIAPR
    APRData.YUSD.TotalBase.value = YUSDYETIAPR + YUSDPTPBaseAPR
    APRData.YUSD.Deposits.value = totalYUSDDeposited
    APRData.YUSD.Deposits.usd = YUSDLPValue

    /**
     * Vecotr YUSD Rewards
     */

     const vectorYUSDUserInfo = await MC.methods.userInfo(PLPAddresses.YUSDPID, PLPAddresses.VectorMainStakingAddress).call()
     const vectorYUSDFactor = Number(vectorYUSDUserInfo[2])
 
     const YUSDPTPBoostTotalAPR = YUSDPoolPTPRewardValue / YUSDLPValue * (1000 - dialutingRepartition) / 1000 * YUSDRatio
     const YUSDSumFactors = Number(YUSDPoolInfo[5])
 
     // vector takes
     const vecotrYUSDBoostAPR = YUSDPTPBoostTotalAPR * (vectorYUSDFactor / YUSDSumFactors)

     const YUSDVTXPoolInfo = await MCVTX.methods.getPoolInfo(PLPAddresses.VectorYUSDLPTokenAddress).call()
     const YUSDVTXAllocPoint = Number(YUSDVTXPoolInfo[1]) 
     const YUSDDeposits = Number(YUSDVTXPoolInfo[2]) / 10 ** 18
 
     const YUSDVTXPerYear = (YUSDVTXAllocPoint / VTXTotalAllocPoint) * vtxPerSec * SECONDS_PER_YEAR
 
     const YUSDVTXAPR = YUSDVTXPerYear * VTXPrice / (YUSDDeposits * YUSDPrice)
 
     APRData.YUSD.Vector.PTP.value = vecotrYUSDBoostAPR
     APRData.YUSD.Vector.VTX.value = YUSDVTXAPR

    APRData.USDC.description = "Platypus Pool USDC Data"
    APRData.YUSD.description = "Platypus Pool YUSD Data"

    Object.keys(APRData).forEach(key => {
        APRData[key].block = avax_blockNumber
        APRData[key].timestamp = Date()
    })

    // Finally after all data has been collected and formatted, we set up our database object and call db.updateYETIData() in order to cache our data in our MongoDB database.

    try {
        const client = db.getClient()
        db.updatePLPPoolData(APRData, client)
    } catch (err) {
        console.log(err)
    }
}

module.exports = getPLPPoolData