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
    async function getPrice() {
        let response =  await fetch("https://api.coingecko.com/api/v3/coins/joe/market_chart?vs_currency=usd&days=30&interval=daily")
        try {
            let data = await response.json()
            return data.prices
        } catch(err) {
            console.log(err)
        }
        
        return []
    }

    const joePrices = await getPrice()
    stakeAPIURL = "https://api.thegraph.com/subgraphs/id/Qmb9wzRvCXPhFb42Lo3oCvhuy5NiE76c7cSZFBW944FJJm"

    moneyMarketAPIURL = "https://api.thegraph.com/subgraphs/id/QmTQhopZCfQa7Ua2QDDmtwUWxSUYNMiVJFyQ9KPgpYG6NB"

    const stakeQuery = `
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

      const remitterQuery = `
        query($first: Int, $orderBy: BigInt, $orderDirection: String) {
            dayDatas(first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
            date,
            usdRemitted
            }
        }
      `
    
    const stakeClient = new ApolloClient({
        link: new HttpLink({ uri: stakeAPIURL, fetch }),
        cache: new InMemoryCache(),
    });

    const stakeResult = await stakeClient
        .query({
            query: gql(stakeQuery),
            variables: {
                first: 30,
                orderBy: 'dayIndex',
                orderDirection: 'desc',
            },
        })
        .then((data) => data)
        .catch((err) => {
            console.log('Error fetching data: ', err)
        })

    const remitterClient = new ApolloClient({
        link: new HttpLink({ uri: moneyMarketAPIURL, fetch }),
        cache: new InMemoryCache(),
    });

    const remitterResult = await remitterClient
        .query({
            query: gql(remitterQuery),
            variables: {
                first: 30,
                orderBy: 'date',
                orderDirection: 'desc',
            },
        })
        .then((data) => data)
        .catch((err) => {
            console.log('Error fetching data: ', err)
        })

    
    const sevenDayAPRs = []

    for (let i = 0; i < 30; i++) {
        const dayTotalStaked = stakeResult.data.daySnapshots[i].totalStake
        const dayRemitted = stakeResult.data.daySnapshots[i].rewards[0].changeInReward
        const price = joePrices[i][1]
        if (dayTotalStaked && dayRemitted && price) {
            
            const dayilyAPR = Number(dayRemitted) / 10 ** 6 * 365 / (Number(dayTotalStaked) / 10 ** 18 * price)
            sevenDayAPRs.push(dayilyAPR)
            
        }
    }
    const average = sevenDayAPRs.reduce((a, b) => a + b, 0) / sevenDayAPRs.length;

    console.log("average", average)

    APYData.APY.value = average * (1 - .2)


    Object.keys(APYData).forEach(key => {
        APYData[key].block = avax_blockNumber
        APYData[key].timestamp = Date()
    })

    // Finally after all data has been collected and formatted, we set up our database object and call db.updateYETIData() in order to cache our data in our MongoDB database.

    return APYData
}

module.exports = getJoeAPY