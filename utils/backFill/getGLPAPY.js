const priceFeedAbi = require("../../abi/PriceFeedAbi.json")
const priceFeeds = require("../../addresses/vault").vaultOracleAddresses
const { ApolloClient, InMemoryCache, gql, HttpLink } = require('@apollo/client/core')
const fetch = require("cross-fetch")


const RAY = 10 ** 27
const SECONDS_PER_YEAR = 31536000

const getGLPAPY = async (web3s, blockNum, timestamp) => {
    // Unpack web3 objects for Ethereum and avax
    const {avax_web3} = web3s
    // // Get Ethereum block number 
    // const blockNumber = await web3.eth.getBlockNumber()
    
    avax_web3.eth.defaultBlock = blockNum
    
    // Collect addresses in one 'addresses' object

    let APYData = {
        APY: {
            description: "YETI GLP Vault Daily APR", 
            value: null,
            feeRate: .2,
        },
    }

    const WAVAXPriceFeed = new avax_web3.eth.Contract(priceFeedAbi, priceFeeds.WAVAX)
    const WAVAXPrice = Number(await WAVAXPriceFeed.methods.fetchPrice_v().call()) / 10 ** 18

    const GLPPriceFeed = new avax_web3.eth.Contract(priceFeedAbi, priceFeeds.GLP)
    const GLPPrice = Number(await GLPPriceFeed.methods.fetchPrice_v().call()) / 10 ** 18

    APIURL = "https://api.thegraph.com/subgraphs/name/0xcano/yeti_test"

    const query = `
        query($first: Int, $orderBy: BigInt, $orderDirection: String) {
            glpReinvesteds(first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: {timestamp_lt: ${timestamp}}}) {
            timestamp
            preCompound
            postCompound
            }
        }
      `
    
    const client = new ApolloClient({
        link: new HttpLink({ uri: APIURL, fetch }),
        cache: new InMemoryCache(),
    });

    const result = await client
        .query({
            query: gql(query),
            variables: {
                first: 2,
                orderBy: 'timestamp',
                orderDirection: 'desc',
            },
        })
        .then((data) => data)
        .catch((err) => {
            console.log('Error fetching data: ', err)
        })

    

    const t0 = result.data.glpReinvesteds[1].timestamp
    const t1 = result.data.glpReinvesteds[0].timestamp

    const deltaT = t1 - t0

    const timeMultiplier = SECONDS_PER_YEAR / deltaT

    const a0 = result.data.glpReinvesteds[1].postCompound
    const a1 = result.data.glpReinvesteds[0].preCompound

    const averageA = (Number(a1) + Number(a0)) / 2


    const reward = (result.data.glpReinvesteds[0].postCompound - result.data.glpReinvesteds[0].preCompound)

    const apr = reward * timeMultiplier / averageA
    
    APYData.APY.value = apr

    Object.keys(APYData).forEach(key => {
        APYData[key].block = blockNum
        APYData[key].timestamp = new Date(timestamp * 1000)
    })
  
    // Finally after all data has been collected and formatted, we set up our database object and call db.updateYETIData() in order to cache our data in our MongoDB database.

    console.log("GLP", APYData);
    return APYData
  }

  module.exports = getGLPAPY