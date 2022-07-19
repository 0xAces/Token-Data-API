const priceFeedAddresses = require("../addresses/priceFeeds").priceFeeds // Get all relevant Ethereum and avax addresses
const priceFeedAbi = require("../abi/PriceFeedAbi.json") // Get the token ABI for the project. ABIs can be found on the Etherscan page for the contract if the contract has been verified. Otherwise you may need to ask your Solidity dev for it.
const numeral = require("numeral") // NPM package for formatting numbers
const db = require("./db") // Util for setting up DB and main DB methods

// Async function which takes in web3 collection, makes web3 calls to get current on chain data, formats data, and caches formatted data to MongoDB
const getPriceData = async (web3s) => {
    // Unpack web3 objects for Ethereum and avax
    const {avax_web3} = web3s

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
    let YETI = new avax_web3.eth.Contract(YETIAbi, avax_addresses.YETIAddress)

    
    // For converting to proper number of decimals. We use this to convert from raw numbers returned from web3 calls to human readable formatted numbers based on the decimals for each token.  
    const convert = (num, decimal) => {
        return Math.round((num / (10*10**(decimal-3))))/100
    }

    // Make tokenData object. This object is used for storing formatted and calculated results from web3 calls from both Ethereum and avax web3 objects. It is divided into 3 sections for data on avax, Ethereum, and aggregate data from both chains in 'combined'.

    let tokenData = {
        combined: {
            totalSupply: {value: null},
            circulatingSupply: {value: null},
        },
        avax: {
            totalSupply: {value: null},
            circulatingSupply: {value: null},
        }
    }
  

    tokenData.avax.totalSupply.value = Number(await YETI.methods.totalSupply().call())

    let teamTotal = 0;
    for (let i = 0; i < avax_addresses.teamLockup.length; i++) {
        teamTotal += Number(await YETI.methods.balanceOf(avax_addresses.teamLockup[i]).call())
    }

    let investorsTotal = 0;
    for (let i = 0; i < avax_addresses.investorsLockup.length; i++) {
        investorsTotal += Number(await YETI.methods.balanceOf(avax_addresses.investorsLockup[i]).call())
    }

    const treasury = Number(await YETI.methods.balanceOf(avax_addresses.treasury).call())

    const teamAllocation = Number(await YETI.methods.balanceOf(avax_addresses.teamAllocation).call())
    const YUSDCurveLPFarm = Number(await YETI.methods.balanceOf(avax_addresses.YUSDCurveLPFarm).call())
    const communityIssuance = Number(await YETI.methods.balanceOf(avax_addresses.communityIssuance).call())
    const pool2Rewarder = Number(await YETI.methods.balanceOf(avax_addresses.pool2Rewarder).call())
    const opsWallet = Number(await YETI.methods.balanceOf(avax_addresses.opsWallet).call())
    // In the following section we perform calculations on base values returned from web3 calls to get the final values we want to return in our API.
    
    tokenData.avax.circulatingSupply.value = tokenData.avax.totalSupply.value - teamTotal - investorsTotal - treasury - teamAllocation - YUSDCurveLPFarm - communityIssuance - pool2Rewarder - opsWallet
  
    
    tokenData.combined.totalSupply.value = tokenData.avax.totalSupply.value
    tokenData.combined.circulatingSupply.value = tokenData.avax.circulatingSupply.value
       
    // Below we add additional information which is not strictly necessary if the API is used only for CG and CMC listing, but may be desired for other purposes such as a token dashboard.

    // Set up descriptions 
    tokenData.avax.totalSupply.description = "Total supply of YETI on AVAX"

  
    tokenData.avax.circulatingSupply.description = "Circulating supply of YETI on AVAX"

  
    tokenData.combined.totalSupply.description = "Total supply of YETI (AVAX)"
    tokenData.combined.circulatingSupply.description = "Circulating supply of YETI (AVAX)"
  
    // Set names
  
    tokenData.avax.totalSupply.name = "Total Supply of YETI on AVAX"
  
    tokenData.avax.circulatingSupply.name = "Circulating Supply of YETI on AVAX"
  
    tokenData.combined.totalSupply.name = "Total Supply of YETI on (AVAX)"
    tokenData.combined.circulatingSupply.name = "Circulating Supply of YETI on (AVAX)"
  
     
    // Set converted and formatted value, block, and timestamp
    const tokendata_avax = tokenData.avax
    const tokendata_combined = tokenData.combined

    // Below we run through each of our tokendata objects for both chains and the combined chain data and convert or format when needed. We als add block number and date.

    Object.keys(tokendata_combined).forEach(key => {
        tokendata_combined[key].value = convert(tokendata_combined[key].value, 18)
        tokendata_combined[key].formattedValue = numeral(tokendata_combined[key].value).format()
        tokendata_combined[key].avax_block = avax_blockNumber
        tokendata_combined[key].timestamp = Date()
    })
  
    Object.keys(tokendata_avax).forEach(key => {
        tokendata_avax[key].value = convert(tokendata_avax[key].value, 18)
        tokendata_avax[key].formattedValue = numeral(tokendata_avax[key].value).format()
        tokendata_avax[key].block = avax_blockNumber
        tokendata_avax[key].timestamp = Date()
    })
  
    // Finally after all data has been collected and formatted, we set up our database object and call db.updateYETIData() in order to cache our data in our MongoDB database.

    try {
      const client = db.getClient()
      db.updateYETIData(tokenData, client) 
    }
    catch(err) {
      console.log(err)
    }
  }

  module.exports = getYETIData