const qiTokenAbi = require("../../abi/QiTokenAbi.json")
const comptrollerAbi = require("../../abi/ComptrollerAbi.json")
const benqiOracleAbi = require("../../abi/BenqiOracleAbi.json")
const addresses = require("../../addresses/qiTokens")
const numeral = require("numeral") // NPM package for formatting numbers

const apyUtils = require("../apyUtils")

const getQiDAIAPY = async (web3s) => {
    // Unpack web3 objects for Ethereum and avax
    const {avax_web3} = web3s
    // // Get Ethereum block number 
    // const blockNumber = await web3.eth.getBlockNumber()
    
    let avax_blockNumber
    try {
        avax_blockNumber = await avax_web3.eth.getBlockNumber() 
    }
    catch(err) {
        avax_blockNumber = 0
        console.log("CANT GET avax_blockNumber")
        console.log(err)
    }
    // Collect addresses in one 'addresses' object
    const {avax_addresses, fees} = addresses
    // Set number formatting default
    numeral.defaultFormat("0,0");

    // Instantiate all smart contract object(s)

    // web3.eth.Contract() creates a smart contract object using the ABI and address of the contract which allows you to call all the smart contract functions listed in the ABI. Since we are not supplying a private key to our web3 object, we can only use it for reading on chain data, not for anything requiring signing - which is all we need for this project.
    // Here we instantiate the Ethereum smart contract object
    let qiToken = new avax_web3.eth.Contract(qiTokenAbi, avax_addresses.qiDAI)
    let benqiOracle = new avax_web3.eth.Contract(benqiOracleAbi, avax_addresses.BenqiChainLinkOracle)
    let comptroller = new avax_web3.eth.Contract(comptrollerAbi, avax_addresses.Comptroller)
    


    // Make tokenData object. This object is used for storing formatted and calculated results from web3 calls from both Ethereum and avax web3 objects. It is divided into 3 sections for data on avax, Ethereum, and aggregate data from both chains in 'combined'.

    let APYData = {
        APY: {
            description: null, 
            value: null,
            feeRate: fees.qiDAI,
            supplyAPY: null,
            avaxSupplyDistributionAPY: null,
            qiSupplyDistributionAPY: null,
            totalSupplyDistributionAPY: null,
            // acSupplyAPY: null,  
        },
    }

    /**
     * Calculate supplyAPY
     */
    const supplyRate = Number(await qiToken.methods.supplyRatePerTimestamp().call())

    const supplyAPY = apyUtils.calcQiSupplyAPY(supplyRate)
    
    APYData.APY.supplyAPY = supplyAPY

    /**
     * Calculate distribution APY
     */

    const underlyingDecimals = await apyUtils.getUnderlyingDecimals(qiToken, avax_web3)

    const qiTokenTotalSupply = Number(await qiToken.methods.totalSupply().call()) / 10 ** 8


    const qiTokenExchangeRate = Number(await qiToken.methods.exchangeRateStored().call()) / 10 ** (10 + underlyingDecimals)


    const underlyingTotalSupply = qiTokenTotalSupply * qiTokenExchangeRate


    const avaxSupplyRewardSpeed = Number(await comptroller.methods.supplyRewardSpeeds(1, qiToken.options.address).call()) / 10 ** 18
    const qiSupplyRewardSpeed = Number(await comptroller.methods.supplyRewardSpeeds(0, qiToken.options.address).call()) / 10 ** 18


    const avaxPrice = Number(await benqiOracle.methods.getUnderlyingPrice(avax_addresses.qiAVAX).call()) / 10 ** 18
    const qiPrice = Number(await benqiOracle.methods.getUnderlyingPrice(avax_addresses.qiQI).call()) / 10 ** 18
    const underlyingPrice = Number(await benqiOracle.methods.getUnderlyingPrice(qiToken.options.address).call()) / 10 ** (36 - underlyingDecimals)


    const avaxSupplyDistributionAPY = (avaxSupplyRewardSpeed * 86400 * avaxPrice / (underlyingTotalSupply * underlyingPrice) + 1) ** 365 - 1
    const qiSupplyDistributionAPY = (qiSupplyRewardSpeed * 86400 * qiPrice / (underlyingTotalSupply * underlyingPrice) + 1) ** 365 - 1
    const totalSupplyDistributionAPY = avaxSupplyDistributionAPY + qiSupplyDistributionAPY


    APYData.APY.avaxSupplyDistributionAPY = avaxSupplyDistributionAPY
    APYData.APY.qiSupplyDistributionAPY = qiSupplyDistributionAPY
    APYData.APY.totalSupplyDistributionAPY = totalSupplyDistributionAPY

    /**
     * Auto Compound
     */
    // const acSupplyAPY = apyUtils.calcAutoCompound(supplyAPY, 365)

    // APYData.APY.acSupplyAPY = acSupplyAPY
    

    const totalAPY = (supplyAPY + totalSupplyDistributionAPY) * (1 - fees.qiDAI)
    APYData.APY.description = "qiDAI Supply + Distribution APY"
    APYData.APY.value = totalAPY


    Object.keys(APYData).forEach(key => {
        APYData[key].block = avax_blockNumber
        APYData[key].timestamp = Date()
    })
  
    // Finally after all data has been collected and formatted, we set up our database object and call db.updateYETIData() in order to cache our data in our MongoDB database.

    return APYData
  }

  module.exports = getQiDAIAPY