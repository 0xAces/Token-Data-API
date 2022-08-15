const boostFarmABI = require("../abi/BoostFarmAbi.json")
const boostAddresses = require("../addresses/boost").boostAddresses
const priceFeedAddresses = require("../addresses/priceFeeds").priceFeeds
const priceFeedAbi = require("../abi/PriceFeedAbi.json")
const { ApolloClient, InMemoryCache, gql, HttpLink } = require('@apollo/client/core')
const fetch = require("cross-fetch")
const db = require("./db")

// Async function which takes in web3 collection, makes web3 calls to get current on chain data, formats data, and caches formatted data to MongoDB
const getBoostData = async (web3s) => {
    
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


    let YETIPriceFeed = new avax_web3.eth.Contract(priceFeedAbi, priceFeedAddresses.YETI)
    const YETIPrice = Number(await YETIPriceFeed.methods.fetchPrice_v().call()) / 10 ** 18

    let boostedAPRList = []

    let BoostFarmContract = new avax_web3.eth.Contract(boostFarmABI, boostAddresses.boostFarmAddress)

    const rewardRate = Number(await BoostFarmContract.methods.rewardRate().call() / 10 ** 18)

    const boostedPartition = Number(await BoostFarmContract.methods.boostedPartition().call())

    const sumOfFactors = Number(await BoostFarmContract.methods.sumOfFactors().call() / 10 ** 18)

    APIURL = "https://api.thegraph.com/subgraphs/name/jinho-shin/yetibeta"

      const userListQuery = `
        query {
            farmOperations (where: {amountOfLP_gt: 0}) {
            user
            }
        }
        `
    
    const client = new ApolloClient({
        link: new HttpLink({ uri: APIURL, fetch }),
        cache: new InMemoryCache(),
    });

    const userListResult = await client
        .query({
            query: gql(userListQuery),
        })
        .then((data) => data)
        .catch((err) => {
            console.log('Error fetching data ', err)
        })

    const userList = []
    
    if (userListResult.data) {
        userListResult.data.farmOperations.map((operation) => {
            if (!userList.includes(operation.user)) {
            userList.push(operation.user)
            }
        })
    }

    




    for (let i in userList) {

        const userID = userList[i]

        const userInfo = await BoostFarmContract.methods.userInfo(userID).call() 

        const userFactor = userInfo.factor / 10 ** 18

        const amountOfLP = userInfo.amount / 10 ** 18

        if (amountOfLP != 0) {
            const annual_boosted_reward = rewardRate * 365 * 86400 * boostedPartition / 1000

            const userBoostedAPR = YETIPrice * annual_boosted_reward / amountOfLP * userFactor / sumOfFactors



            if (userBoostedAPR != 0) {

                boostedAPRList.push(userBoostedAPR)
            
            
            }
        }
           
    }
    boostedAPRList.sort((n1,n2) => n1 - n2);

    const median = boostedAPRList[Math.floor(boostedAPRList.length / 2)]

    const max  = Math.max(...boostedAPRList)

    let Data = {
        boostFarm: {
            medianAPR: {
                value: median,
                description: "The median boosted APR of all YUSD Curve Farmers."
            },
            maxAPR: {
                value: max,
                description: "The max boosted APR of all YUSD Curve Farmers."
            }
        }

    }

    Object.keys(Data).forEach(key => {
        Data[key].block = avax_blockNumber
        Data[key].timestamp = Date()
    })

    // Finally after all data has been collected and formatted, we set up our database object and call db.updateYETIData() in order to cache our data in our MongoDB database.

    try {
        const client = db.getClient()
        
        db.updateBoostData(Data, client)
    } catch (err) {
        console.log(err)
    }

    // Finally after all data has been collected and formatted, we set up our database object and call db.updateYETIData() in order to cache our data in our MongoDB database.

}

module.exports = getBoostData