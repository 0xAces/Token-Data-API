const qiTokenAbi = require("../../abi/QiTokenAbi.json")
const comptrollerAbi = require("../../abi/ComptrollerAbi.json")
const benqiOracleAbi = require("../../abi/BenqiOracleAbi.json")
const addresses = require("../../addresses/qiTokens")
const numeral = require("numeral") // NPM package for formatting numbers
const SECONDS_PER_YEAR = 31622400
const aprUtils = require("../aprUtils")

const FEE_RATE = .05

const getaDAIAPY = async (web3s) => {
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

    // Make tokenData object. This object is used for storing formatted and calculated results from web3 calls from both Ethereum and avax web3 objects. It is divided into 3 sections for data on avax, Ethereum, and aggregate data from both chains in 'combined'.

    let APRData = {
        APR: {description: null, value: null},
    }



    Object.keys(APRData).forEach(key => {
        APRData[key].block = avax_blockNumber
        APRData[key].timestamp = Date()
    })
  
    // Finally after all data has been collected and formatted, we set up our database object and call db.updateYETIData() in order to cache our data in our MongoDB database.

    return APRData
  }

  module.exports = getaDAIAPY