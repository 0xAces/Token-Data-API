const poolAbi = require("../../abi/AavePoolAbi.json")
const ERC20Abi = require("../../abi/ERC20Abi.json")
const incentivesAbi = require("../../abi/AaveIncentiveAbi.json")
const priceFeedAbi = require("../../abi/PriceFeedAbi.json")
const addresses = require("../../addresses/aTokens")
const priceFeeds = require("../../addresses/priceFeeds")
const underlyingTokens = require("../../addresses/underlyingTokens")
const numeral = require("numeral") // NPM package for formatting numbers
const apyUtils = require("../apyUtils")


const RAY = 10 ** 27
const SECONDS_PER_YEAR = 31536000

const getaWAVAXAPY = async (web3s, blockNum, timestamp) => {
    // Unpack web3 objects for Ethereum and avax
    const {avax_web3} = web3s
    // // Get Ethereum block number 
    // const blockNumber = await web3.eth.getBlockNumber()
    
    avax_web3.eth.defaultBlock = blockNum
    // Collect addresses in one 'addresses' object
    const {avax_addresses, fees} = addresses
    const underlyingTokenAddress = underlyingTokens.avax_addresses
    const priceFeedAddresses = priceFeeds.priceFeeds
    let APYData = {
        APY: {
            description: null, 
            value: null,
            feeRate: fees.aWAVAX,
            supplyAPY: null,
            avaxSupplyDistributionAPY: null,
        },
    }

    let pool = new avax_web3.eth.Contract(poolAbi, avax_addresses.Pool)
    let incentives = new avax_web3.eth.Contract(incentivesAbi, avax_addresses.Incentives)

    /**
     * Supply APY
     */
    const reserveData = await pool.methods.getReserveData(underlyingTokenAddress.WAVAX).call()

    const { liquidityIndex, variableBorrowIndex, currentLiquidityRate, 
        currentVariableBorrowRate, currentStableBorrowRate,
         aTokenAddress, stableDebtTokenAddress, variableDebtTokenAddress} = reserveData
    const depositAPR = +currentLiquidityRate / RAY

    const depositAPY = apyUtils.calcAutoCompound(depositAPR, 365)

    APYData.APY.supplyAPY = depositAPY


    /**
     * Incentive WAVAX APY
     */
    
    let underlyingToken = new avax_web3.eth.Contract(ERC20Abi, underlyingTokenAddress.WAVAX)
    let aToken = new avax_web3.eth.Contract(ERC20Abi, avax_addresses.aWAVAX)
    let underlyingPriceFeed = new avax_web3.eth.Contract(priceFeedAbi, priceFeedAddresses.AVAX)
    let avaxPriceFeed = new avax_web3.eth.Contract(priceFeedAbi, priceFeedAddresses.AVAX)

    const assetData = await incentives.methods.getRewardsData(aTokenAddress, underlyingTokenAddress.WAVAX).call()

    const aEmissionPerYear = +assetData[1] * SECONDS_PER_YEAR
    const avaxPrice = Number(await avaxPriceFeed.methods.fetchPrice_v().call())


    
    const underlyingDecimals = Number(await underlyingToken.methods.decimals().call())

    const totalATokenSupply = Number(await aToken.methods.totalSupply().call())

    const aTokenPrice = Number(await underlyingPriceFeed.methods.fetchPrice_v().call())

    const incentiveDepositAPR = (aEmissionPerYear * avaxPrice ) / 10 ** (18 - underlyingDecimals) /  (totalATokenSupply * aTokenPrice ) 
    const incentiveDepositAPY = apyUtils.calcAutoCompound(incentiveDepositAPR, 365)
    APYData.APY.avaxSupplyDistributionAPY = incentiveDepositAPY
    
    APYData.APY.description = "aWAVAX Supply + Distribution APY"
    APYData.APY.value = (incentiveDepositAPY + depositAPY) * (1 - fees.aWAVAX)
    

    

    Object.keys(APYData).forEach(key => {
        APYData[key].block = blockNum
        APYData[key].timestamp = new Date(timestamp * 1000)
    })
  
    // Finally after all data has been collected and formatted, we set up our database object and call db.updateYETIData() in order to cache our data in our MongoDB database.

    return APYData
  }

  module.exports = getaWAVAXAPY