
const boostedJoeMCV3Abi = require("../../abi/BoostedJoeMCV3Abi.json") // Get the token ABI for the project. ABIs can be found on the Etherscan page for the contract if the contract has been verified. Otherwise you may need to ask your Solidity dev for it.
const JLPAbi = require("../../abi/JLPAbi.json")
const priceFeedAbi = require("../../abi/PriceFeedAbi.json")
const addresses = require("../../addresses/FarmPool")
const numeral = require("numeral") // NPM package for formatting numbers
const SECONDS_PER_YEAR = 31622400
const apyUtils = require("../apyUtils")
const { ApolloClient, InMemoryCache, gql, HttpLink } = require('@apollo/client/core')
const fetch = require("cross-fetch")

const POOL_FEE = 0.1
const JOE_FEE = 0.6
const PID = 1
// Async function which takes in web3 collection, makes web3 calls to get current on chain data, formats data, and caches formatted data to MongoDB
const getWETHWAVAXAPY = async (web3s, blockNum, timestamp) => {
    // Unpack web3 objects for Ethereum and avax
    const {avax_web3} = web3s
    // // Get Ethereum block number 
    // const blockNumber = await web3.eth.getBlockNumber()
    
    avax_web3.eth.defaultBlock = blockNum
    // Collect addresses in one 'addresses' object
    const {avax_addresses} = addresses
    // Set number formatting default
    numeral.defaultFormat("0,0");

    // Instantiate all smart contract object(s)

    // web3.eth.Contract() creates a smart contract object using the ABI and address of the contract which allows you to call all the smart contract functions listed in the ABI. Since we are not supplying a private key to our web3 object, we can only use it for reading on chain data, not for anything requiring signing - which is all we need for this project.
    // Here we instantiate the Ethereum smart contract object
    let JOEMC = new avax_web3.eth.Contract(boostedJoeMCV3Abi, avax_addresses.BoostedTJMCV3)
    let JOEPriceFeed = new avax_web3.eth.Contract(priceFeedAbi, avax_addresses.JOEPriceFeed)
    let WETHWAVAXPriceFeed = new avax_web3.eth.Contract(priceFeedAbi, avax_addresses.WETHWAVAXJLPPriceFeed)
    let WETHWAVAXJLP = new avax_web3.eth.Contract(JLPAbi, avax_addresses.WETHWAVAXJLP)

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
    const LPStaked = Number(await WETHWAVAXJLP.methods.balanceOf(avax_addresses.BoostedTJMCV3).call())
    
    const WETHWAVAXPrice =  Number(await WETHWAVAXPriceFeed.methods.fetchPrice_v().call())

    const farmPoolLPValue = LPStaked * WETHWAVAXPrice

    const joePerSec = Number(await JOEMC.methods.joePerSec().call())

    const poolInfo = await JOEMC.methods.poolInfo(PID).call()

    const farmPoolAllocPoint = Number(poolInfo[1])


    const totalAllocPoint =  Number(await JOEMC.methods.totalAllocPoint().call())

    const veJoeShareBp = Number(poolInfo[6])

    
    const JOEPrice = Number(await JOEPriceFeed.methods.fetchPrice_v().call())

    const joeAPY = joePerSec * farmPoolAllocPoint * JOEPrice * SECONDS_PER_YEAR * veJoeShareBp / (totalAllocPoint * farmPoolLPValue * 10000) 

/**
 * Calculate Pool APY
 */
    const time = new Date(timestamp * 1000)

    let timeString = time.getDate().toString() + '-' + (time.getMonth() + 1).toString() + '-' + time.getFullYear().toString()

    // console.log(timeString)

    const volumeQuery = `
        query {
            pairDayDatas(first: 1, orderBy: date, orderDirection: desc, where:{date_lt: ${timestamp}, token0_: {id: "${avax_addresses.WETH.toLowerCase()}"}, token1_: {id:  "${avax_addresses.WAVAX.toLowerCase()}"}}) {
                token0 {
                  id
                }
                token1 {
                  id
                }
                date
                volumeToken0
                volumeToken1
                volumeUSD
              }
        }
      `

    const joeAPIURL = 'https://api.thegraph.com/subgraphs/name/traderjoe-xyz/exchange'

    const volumeClient = new ApolloClient({
        link: new HttpLink({ uri: joeAPIURL, fetch }),
        cache: new InMemoryCache(),
    });

    const volumeResult = await volumeClient
        .query({
            query: gql(volumeQuery),
        })
        .then((data) => data)
        .catch((err) => {
            console.log('Error fetching data: ', err)
        })

    const volume = Number(volumeResult.data.pairDayDatas[0].volumeUSD)

    const poolAPY = await apyUtils.calcPoolFeeAPY(`https://api.coingecko.com/api/v3/coins/wrapped-avax/history?date=${timeString}`, 0.0025, WETHWAVAXJLP, WETHWAVAXPrice, avax_addresses.WETH, avax_addresses.WAVAX, tradingVolume = volume)
   
    // Calculate auto Compound APY
    const acJoeAPY = apyUtils.calcAutoCompound(joeAPY, 365)

    const acPoolAPY = apyUtils.calcAutoCompound(poolAPY, 365)

    const totalAPY = acJoeAPY * (1 - JOE_FEE) + acPoolAPY
    APYData.APY.description = "WETH-WAVAX Pool Fee APY"
    APYData.APY.value = totalAPY


    Object.keys(APYData).forEach(key => {
        APYData[key].block = blockNum
        APYData[key].timestamp = new Date(timestamp * 1000)
    })
  
    // Finally after all data has been collected and formatted, we set up our database object and call db.updateYETIData() in order to cache our data in our MongoDB database.

    return APYData
  }

  module.exports = getWETHWAVAXAPY