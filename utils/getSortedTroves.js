const yetiFinance_address = require("../addresses/YetiFinance").yetiFinance_addresses
const sortedTrovesAbi = require("../abi/SortedTrovesAbi.json") // Get the token ABI for the project. ABIs can be found on the Etherscan page for the contract if the contract has been verified. Otherwise you may need to ask your Solidity dev for it.
const troveManagerAbi = require("../abi/TroveManagerAbi.json")
const multiTroveGetterAbi = require("../abi/MultiTroveGetterAbi.json")

const numeral = require("numeral") // NPM package for formatting numbers
const db = require("./db") // Util for setting up DB and main DB methods
const SECONDS_PER_YEAR = 31622400
const apyUtils = require("./apyUtils")
// Async function which takes in web3 collection, makes web3 calls to get current on chain data, formats data, and caches formatted data to MongoDB
const getSortedTrovesData = async (web3s) => {
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

    // Set number formatting default
    numeral.defaultFormat("0,0");

    // Instantiate all smart contract object(s)


    // web3.eth.Contract() creates a smart contract object using the ABI and address of the contract which allows you to call all the smart contract functions listed in the ABI. Since we are not supplying a private key to our web3 object, we can only use it for reading on chain data, not for anything requiring signing - which is all we need for this project.
    // Here we instantiate the Ethereum smart contract object
    let multiTroveGetter = new avax_web3.eth.Contract(multiTroveGetterAbi, "0xe7d37765C73Cc330fD027A9C4686b25311a21745")

    const allTroves = await multiTroveGetter.methods.getAllTroves().call()

    const numTroves = allTroves.length

    const troves = []
    const sortedAICRs = []

    // sum up debt up to the index. ie index sumDebt[1] = sumbdebt[0] + troves[1].outstandingDebt
    const sumDebt = []

    for (let idx = 0; idx < numTroves; idx++) {
        const tail = allTroves[idx][1]

        const tail_icr = Number(allTroves[idx][2]) / 10 ** 18

        const tail_aicr = Number(allTroves[idx][3]) / 10 ** 18

        const tail_outstandingDebt = Number(allTroves[idx][4]) / 10 ** 18 - 200

        troves.push({
            idx: idx,
            owner: tail,
            icr: tail_icr,
            aicr: tail_aicr,
            outstandingDebt: tail_outstandingDebt
        })

        sortedAICRs.push(tail_aicr)

        sumDebt.push(sumDebt.length === 0 ? tail_outstandingDebt : sumDebt[sumDebt.length - 1] + tail_outstandingDebt)

    }


    // Make tokenData object. This object is used for storing formatted and calculated results from web3 calls from both Ethereum and avax web3 objects. It is divided into 3 sections for data on avax, Ethereum, and aggregate data from both chains in 'combined'.

    let Data = {
        SortedTrovesData: {
            value: troves,
            description: "SortedToves in the Yeti Finance System."
        },
        SortedAICRs: {
            value: sortedAICRs,
            description: "Sorted AICRs from sortedTroves."
        },
        SumDebt: {
            value: sumDebt,
            description: "Sum of debt up to the index. ie index sumDebt[1] = sumbdebt[0] + SortedTroves[1].outstandingDebt"
        }
    }

    Object.keys(Data).forEach(key => {
        Data[key].block = avax_blockNumber
        Data[key].timestamp = Date()
    })

    // Finally after all data has been collected and formatted, we set up our database object and call db.updateYETIData() in order to cache our data in our MongoDB database.

    try {
        const client = db.getClient()
        db.updateSortedTrovesData(Data, client)
    } catch (err) {
        console.log(err)
    }
}

module.exports = getSortedTrovesData