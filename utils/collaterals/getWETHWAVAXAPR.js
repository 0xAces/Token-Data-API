
const MCV3Abi = require("../../abi/MasterChefV3Abi.json") // Get the token ABI for the project. ABIs can be found on the Etherscan page for the contract if the contract has been verified. Otherwise you may need to ask your Solidity dev for it.
const JLPAbi = require("../../abi/JLPAbi.json")
const priceFeedAbi = require("../../abi/PriceFeedAbi.json")
const numeral = require("numeral") // NPM package for formatting numbers
const db = require("../db") // Util for setting up DB and main DB methods
const SECONDS_PER_YEAR = 31622400
const aprUtils = require("../aprUtils")

const WETH_WAVAX_LP_PRICEFEED_ADDRESS = "0x0Cf5f6f4b537256ed4D01725407E1889E386a1fa"
const WETH_WAVAX_LP_TOKEN_ADDRESS = "0xFE15c2695F1F920da45C30AAE47d11dE51007AF9"
// Async function which takes in web3 collection, makes web3 calls to get current on chain data, formats data, and caches formatted data to MongoDB
const getTJFarmPoolData = async (web3s) => {
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
    let JOEMC = new avax_web3.eth.Contract(MCV3Abi, avax_addresses.TJMasterChefV3)
    let WETHWAVAXPriceFeed = new avax_web3.eth.Contract(priceFeedAbi, WETH_WAVAX_LP_PRICEFEED_ADDRESS)
    let WETHWAVAXJLP = new avax_web3.eth.Contract(JLPAbi, WETH_WAVAX_LP_TOKEN_ADDRESS)
    
    // For converting to proper number of decimals. We use this to convert from raw numbers returned from web3 calls to human readable formatted numbers based on the decimals for each token.  
    const convert = (num, decimal) => {
        return Math.round((num / (10*10**(decimal-3))))/100
    }

    // Make tokenData object. This object is used for storing formatted and calculated results from web3 calls from both Ethereum and avax web3 objects. It is divided into 3 sections for data on avax, Ethereum, and aggregate data from both chains in 'combined'.

    let APRData = {
        APR: {description: null, value: null},
    }

    /**
     * Calculate Pool APR
     */

    graphQlUrl = "https://api.thegraph.com/subgraphs/name/traderjoe-xyz/exchange"
    const poolAPR = await aprUtils.calcPoolFeeAPR("https://api.coingecko.com/api/v3/coins/yeti-finance/tickers?exchange_ids=traderjoe", 0.0025, YETIAVAXJLP, YETIAVAXJLPPrice)
    
    APRData.pool.description = "WETH-WAVAX Pool Fee APR"
    APRData.pool.value = poolAPR

    Object.keys(APRData).forEach(key => {
        APRData[key].formattedValue = numeral(APRData[key].value).format()
        APRData[key].block = avax_blockNumber
        APRData[key].timestamp = Date()
    })
  
    // Finally after all data has been collected and formatted, we set up our database object and call db.updateYETIData() in order to cache our data in our MongoDB database.

    try {
      const client = db.getClient()
      db.updateFarmPoolData(APRData, client) 
    }
    catch(err) {
      console.log(err)
    }
  }

  module.exports = getTJFarmPoolData