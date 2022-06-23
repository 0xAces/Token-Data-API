const numeral = require("numeral") // NPM package for formatting numbers
const SECONDS_PER_YEAR = 31622400
const priceFeedAbi = require("../../abi/PriceFeedAbi.json")
const priceFeedAddresses = require("../../addresses/priceFeeds").priceFeeds
const apyUtils = require("../apyUtils")
const { ApolloClient, InMemoryCache, gql, HttpLink } = require('@apollo/client/core')
const fetch = require("cross-fetch")

// Async function which takes in web3 collection, makes web3 calls to get current on chain data, formats data, and caches formatted data to MongoDB
const getJoeAPY = async (web3s) => {
    
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

    let APYData = {
        APY: {
            description: null,
            value: null
        },
    }

    let JoePriceFeed = new avax_web3.eth.Contract(priceFeedAbi, priceFeedAddresses.JOE)
    const joePrice = Number(await JoePriceFeed.methods.fetchPrice_v().call()) / 10 ** 18

    APIURL = "https://api.thegraph.com/subgraphs/id/Qmb9wzRvCXPhFb42Lo3oCvhuy5NiE76c7cSZFBW944FJJm"

    const tokensQuery = `
        query($first: Int, $orderBy: BigInt, $orderDirection: String) {
            daySnapshots(first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
            dayIndex,
            totalStake,
            rewards {
                id,
                rewardToken {
                symbol,
                decimals
                }
                changeInReward
            },
            totalFee
            }
        }
      `
    
    const client = new ApolloClient({
        link: new HttpLink({ uri: APIURL, fetch }),
        cache: new InMemoryCache(),
    });

    const result = await client
        .query({
            query: gql(tokensQuery),
            variables: {
                first: 7,
                orderBy: 'dayIndex',
                orderDirection: 'desc',
            },
        })
        .then((data) => data)
        .catch((err) => {
            console.log('Error fetching data: ', err)
        })
    
    const sevenDayAPRs = []

    for (let i = 0; i < 7; i++) {
        const dayData = result.data.daySnapshots[i]
        if (dayData.rewards[0].changeInReward && dayData.totalStake) {
            const USDCReward = Number(dayData.rewards[0].changeInReward) / 10 ** 6
            const totalStaked = Number(dayData.totalStake) / 10 ** 18
            const totalFee = Number(dayData.totalFee) / 10 ** 18
            sevenDayAPRs.push((USDCReward) * 365 / (totalStaked * joePrice))
        }
    }
    const average = sevenDayAPRs.reduce((a, b) => a + b, 0) / sevenDayAPRs.length;

    APYData.APY = apyUtils.calcAutoCompound(average, 365) * (1 - .2)

    Object.keys(APYData).forEach(key => {
        APYData[key].block = avax_blockNumber
        APYData[key].timestamp = Date()
    })

    // Finally after all data has been collected and formatted, we set up our database object and call db.updateYETIData() in order to cache our data in our MongoDB database.

    return APYData
}

module.exports = getJoeAPY