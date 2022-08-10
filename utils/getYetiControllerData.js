const priceFeedAbi = require("../abi/PriceFeedAbi.json") // Get the token ABI for the project. ABIs can be found on the Etherscan page for the contract if the contract has been verified. Otherwise you may need to ask your Solidity dev for it.
const yetiVaultAbi = require("../abi/YetiVaultAbi.json")
const yetiControllerMultiCallAbi = require("../abi/YetiControllerMultiCallAbi.json")
const yetiFinance_addresses = require("../addresses/YetiFinance").yetiFinance_addresses
const yetiControllerAbi = require("../abi/yetiControllerAbi.json")
const numeral = require("numeral") // NPM package for formatting numbers
const db = require("./db") // Util for setting up DB and main DB methods
const { tokenDataMappingA } = require("../TokenData/index")

const YETICONTROLLERMULTICALL = "0xd205639402F04baCDa998A3C86367d65fEB393bC"

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
    // let yetiController = new avax_web3.eth.Contract(yetiControllerAbi, yetiFinance_addresses.yetiController)

    let multiCall = new avax_web3.eth.Contract(yetiControllerMultiCallAbi, YETICONTROLLERMULTICALL)

    
    let data = {
        whitelistedCollaterals: {
            value: null,
            description: "List of Collaterals that are/were whitelised in YetiController."
        },
        vaultTokens: {
            value: null,
            description: "List of Collaterals that are vaults in whitelistedCollaterals."
        },
        underlyingTokens: {
            value: null,
            description: "List of underlying for all vaultToknes."
        },
        underlyingDecimals: {
            value: null,
            description: "Mapping of vaultTokens to their underlying decimals."
        },
        underlyingPerReceptRatios: {
            value: null,
            description: "Mappng of vaultTokens to their underlyingPerReceptRatio."
        },
        receiptPerUnderlyingRatios: {
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
        },
        tvls:{
            value: null,
            description: "Mappings of vaultTokens to their TVLs"
        }
    }

    try {
        const yetiControllerData = await multiCall.methods.getYetiControllerData().call()

        const whitelistedCollaterals = yetiControllerData[0]

        data.whitelistedCollaterals.value = whitelistedCollaterals
        data.vaultTokens.value = yetiControllerData[1]
        data.underlyingTokens.value = yetiControllerData[2]
        
        const underlyingDecimals = {}
        const underlyingPerReceptRatios = {}
        const receiptPerUnderlyingRatios = {}
        const prices = {}
        const underlyingPrices = {}
        const tvls = {}

        whitelistedCollaterals.forEach((_, i) => {
            const address = whitelistedCollaterals[i]

            underlyingDecimals[address] = yetiControllerData[3][i]
            underlyingPerReceptRatios[address] = yetiControllerData[4][i]
            receiptPerUnderlyingRatios[address] = yetiControllerData[5][i]
            prices[address] = yetiControllerData[6][i]
            underlyingPrices[address] = yetiControllerData[7][i]
            tvls[address] = yetiControllerData[8][i]
        })

        data.underlyingDecimals.value = underlyingDecimals
        data.underlyingPerReceptRatios.value = underlyingPerReceptRatios
        data.receiptPerUnderlyingRatios.value = receiptPerUnderlyingRatios
        data.prices.value = prices
        data.underlyingPrices.value = underlyingPrices
        data.tvls.value = tvls



        // const whitelistedCollaterals = await yetiController.methods.getValidCollateral().call()
        // data.whitelistedCollaterals.value = whitelistedCollaterals


        // const vaultTokens = []

        // whitelistedCollaterals.forEach(address => {
        //     if (tokenDataMappingA[address].isVault) {
        //         vaultTokens.push(address)
        //       }
        // })
        // data.vaultTokens.value = vaultTokens


        // const underlyingTokens = []

        // vaultTokens.forEach(address => {
        //     underlyingTokens.push(tokenDataMappingA[address].underlying)
        // })
        // data.underlyingTokens.value = underlyingTokens


        // const underlyingDecimals = {}

        // vaultTokens.forEach(address => {
        //     underlyingDecimals[address] = tokenDataMappingA[address].underlyingDecimals
        // })
        // data.underlyingDecimals.value = underlyingDecimals


        // const underlyingPerReceptRatios = {}
        // const receiptPerUnderlying = {}
        // const prices = {}
        // const underlyingPrices = {}

        // for (let i = 0; i < whitelistedCollaterals.length; i++) {
        //     const address = whitelistedCollaterals[i]

        //     const price = await yetiController.methods.getPrice(address).call()

        //     if (vaultTokens.includes(address)) {
        //         let vault = new avax_web3.eth.Contract(yetiVaultAbi, address)

        //         underlyingPerReceptRatios[address] = await vault.methods.underlyingPerReceipt().call()
        //         receiptPerUnderlying[address] = await vault.methods.receiptPerUnderlying().call()

        //         underlyingPrices[address] = receiptPerUnderlying[address] * price / 10 ** (18 - underlyingDecimals[address])
        //     } else {
        //         underlyingPerReceptRatios[address] = 1 ** 18
        //         receiptPerUnderlying[address] = 1 ** 18
        //         underlyingPrices[address] = price
        //     }

        //     prices[address] = price
        // }

        // data.underlyingPerReceptRatios.value = underlyingPerReceptRatios
        // data.receiptPerUnderlying.value = receiptPerUnderlying
        // data.prices.value = prices
        // data.underlyingPrices.value = underlyingPrices
        


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
    } catch(err) {
        console.log("failed to update yetiController data with error ", err)
    }
    
  }

  module.exports = getYetiControllerData