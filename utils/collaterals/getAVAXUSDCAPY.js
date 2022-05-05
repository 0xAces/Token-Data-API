
const boostedJoeMCV3Abi = require("../../abi/BoostedJoeMCV3Abi.json") // Get the token ABI for the project. ABIs can be found on the Etherscan page for the contract if the contract has been verified. Otherwise you may need to ask your Solidity dev for it.
const JLPAbi = require("../../abi/JLPAbi.json")
const priceFeedAbi = require("../../abi/PriceFeedAbi.json")
const addresses = require("../../addresses/FarmPool")
const numeral = require("numeral") // NPM package for formatting numbers
const SECONDS_PER_YEAR = 31622400
const apyUtils = require("../apyUtils")

const POOL_FEE = 0.1
const JOE_FEE = 0.6
const PID = 0
// Async function which takes in web3 collection, makes web3 calls to get current on chain data, formats data, and caches formatted data to MongoDB
const getAVAXUSDCAPY = async (web3s) => {
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
    const {avax_addresses} = addresses
    // Set number formatting default
    numeral.defaultFormat("0,0");

    // Instantiate all smart contract object(s)

    // web3.eth.Contract() creates a smart contract object using the ABI and address of the contract which allows you to call all the smart contract functions listed in the ABI. Since we are not supplying a private key to our web3 object, we can only use it for reading on chain data, not for anything requiring signing - which is all we need for this project.
    // Here we instantiate the Ethereum smart contract object
    let JOEMC = new avax_web3.eth.Contract(boostedJoeMCV3Abi, avax_addresses.BoostedTJMCV3)
    let JOEPriceFeed = new avax_web3.eth.Contract(priceFeedAbi, avax_addresses.JOEPriceFeed)
    let AVAXUSDCPriceFeed = new avax_web3.eth.Contract(priceFeedAbi, avax_addresses.AVAXUSDCJLPPriceFeed)
    let AVAXUSDCJLP = new avax_web3.eth.Contract(JLPAbi, avax_addresses.AVAXUSDCJLP)
    
    // For converting to proper number of decimals. We use this to convert from raw numbers returned from web3 calls to human readable formatted numbers based on the decimals for each token.  
    const convert = (num, decimal) => {
        return Math.round((num / (10*10**(decimal-3))))/100
    }

    // Make tokenData object. This object is used for storing formatted and calculated results from web3 calls from both Ethereum and avax web3 objects. It is divided into 3 sections for data on avax, Ethereum, and aggregate data from both chains in 'combined'.

    let APYData = {
        APY: {description: null, value: null},
    }

    /**
     * Calculate JOE APY
     */
    
    const AVAXUSDCPrice =  Number(await AVAXUSDCPriceFeed.methods.fetchPrice_v().call())

    
    
    const joePerSec = Number(await JOEMC.methods.joePerSec().call())

    const poolInfo = await JOEMC.methods.poolInfo(PID).call()

    const LPStaked = Number(poolInfo[8])

    const farmPoolLPValue = LPStaked * AVAXUSDCPrice


    const farmPoolAllocPoint = Number(poolInfo[1])


    const totalAllocPoint =  Number(await JOEMC.methods.totalAllocPoint().call())

    const veJoeShareBp = Number(poolInfo[6])

    
    const JOEPrice = Number(await JOEPriceFeed.methods.fetchPrice_v().call())

    const joeAPY = joePerSec * farmPoolAllocPoint * JOEPrice * SECONDS_PER_YEAR * veJoeShareBp / (totalAllocPoint * farmPoolLPValue * 10000) 
    
    /**
     * Calculate Pool APY
     */

    const poolAPY = await apyUtils.calcPoolFeeAPY("https://api.coingecko.com/api/v3/coins/wrapped-avax/tickers?exchange_ids=traderjoe", 0.0025, AVAXUSDCJLP, AVAXUSDCPrice, avax_addresses.USDC, avax_addresses.WAVAX)
    // console.log(poolAPY)
    // Calculate auto Compound APY
    const acJoeAPY = apyUtils.calcAutoCompound(joeAPY, 365)

    const ajPoolAPY = apyUtils.calcAutoCompound(poolAPY, 365)

    const totalAPY = acJoeAPY * (1 - POOL_FEE) + ajPoolAPY * (1 - JOE_FEE) 
    APYData.APY.description = "AVAX-USDC Pool Fee APY"
    APYData.APY.value = totalAPY


    Object.keys(APYData).forEach(key => {
        APYData[key].block = avax_blockNumber
        APYData[key].timestamp = Date()
    })
  
    // Finally after all data has been collected and formatted, we set up our database object and call db.updateYETIData() in order to cache our data in our MongoDB database.

    return APYData
  }

  module.exports = getAVAXUSDCAPY