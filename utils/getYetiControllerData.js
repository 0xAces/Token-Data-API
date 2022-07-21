const priceFeedAbi = require("../abi/PriceFeedAbi.json") // Get the token ABI for the project. ABIs can be found on the Etherscan page for the contract if the contract has been verified. Otherwise you may need to ask your Solidity dev for it.
const yetiFinance_addresses = require("../addresses/YetiFinance").yetiFinance_addresses
const yetiControllerAbi = require("../abi/yetiControllerAbi.json")
const numeral = require("numeral") // NPM package for formatting numbers
const db = require("./db") // Util for setting up DB and main DB methods


const getYetiControllerData = async (web3s) => {
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

    // Set number formatting default
    numeral.defaultFormat("0,0");

    // Instantiate all smart contract object(s)

    // web3.eth.Contract() creates a smart contract object using the ABI and address of the contract which allows you to call all the smart contract functions listed in the ABI. Since we are not supplying a private key to our web3 object, we can only use it for reading on chain data, not for anything requiring signing - which is all we need for this project.
    // Here we instantiate the Ethereum smart contract object
    let yetiController = new avax_web3.eth.Contract(yetiControllerAbi, yetiFinance_addresses.yetiController)

    
    let data = {
        whitelistedCollaterals: {
            value: null,
            description: "List of Collaterals that are/were whitelised in YetiController."
        },
        vaultTokens: {
            value: null,
            description: "List of Collaterals that are vaults in whitelistedCollaterals."
        },
        underlyingtokens: {
            value: null,
            description: "List of underlying for all vaultToknes."
        },
        underlyingDecimals: {
            value: null,
            description: "Mapping of vaultTokens to their underlying decimals."
        },
        underlyingPerReceptRatios: {
            vaule: null,
            description: "Mappng of vaultTokens to their underlyingPerReceptRatio."
        },
        receptPerUnderlyingRatios: {
            value: null,
            description: "Mappng of vaultTokens to their receptPerUnderlyingRratio."
        },
        prices: {
            value: null,
            description: "Mapping of whitelisted Collaterals to their prices"
        },
        underlyingPrices: {
            value: null,
            description: "Mapping of whitelisted Collaterals to their prices (underlying prices if collateral is a valut token)."
        }
    }

    const whitelistedCollaterals = await yetiController.methods.getValidCollateral().call()
    data.whitelistedCollaterals.value = whitelistedCollaterals

    Object.keys(data).forEach(key => {
        data[key].avax_block = avax_blockNumber
        data[key].timestamp = Date()
    })

    // Finally after all data has been collected and formatted, we set up our database object and call db.updateYETIData() in order to cache our data in our MongoDB database.

    try {
      const client = db.getClient()
      db.updateYetiControllerData(data, client) 
    }
    catch(err) {
      console.log(err)
    }
  }

  module.exports = getYetiControllerData