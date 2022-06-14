const boostFarmABI = require("../../abi/BoostFarm.json")
const boostFarmAddress = "0xD8A4AA01D54C8Fdd104EAC28B9C975f0663E75D8"
const { ApolloClient, InMemoryCache, gql, HttpLink } = require('@apollo/client/core')
const fetch = require("cross-fetch")

// Async function which takes in web3 collection, makes web3 calls to get current on chain data, formats data, and caches formatted data to MongoDB
const getMedianBoostedAPR = async (web3s) => {
    
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

    let boostedAPRList = []

    let BoostFarmContract = new avax_web3.eth.Contract(boostFarmABI, boostFarmAddress)

    const rewardRate = Number(await BoostFarmContract.methods.rewardRate().call() / 10 ** 18)

    const boostedPartition = Number(await BoostFarmContract.methods.boostedPartition().call() / 10 ** 18)

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

    const userList = await client
        .query({
            query: gql(tokensQuery),
        })
        .then((data) => data)
        .catch((err) => {
            console.log('Error fetching data ', err)
        })

    const userList = []

    userList.data.farmOperations.map((operation) => {
        if (!userList.includes(operation.user)) {
        userList.push(operation.user)
        }
    })

    console.log('userlist', userList)

    median = 0

    for (let i in userList) {

        const userID = userList[i]

        const userInfo = await BoostFarmContract.methods.userInfo(userID).call() 

        const userFactor = userInfo.factor / 10 ** 18

        const amountOfLP = r.amount / 10 ** 18

        if (amountOfLP != 0) {
            const annual_boosted_reward = format(rewardRate) * 365 * 86400 * boostedPartition

            const userBoostedAPR = 100 * Number(YETIPrice) * annual_boosted_reward / format(amountOfLP) * userFactor / sumOfFactors

            if (userID.toLowerCase() == "0x0657F21492E7F6433e87Cb9746D2De375AC6aEB3".toLowerCase()) {
                console.log('APR calculated', userID, boostedPartition, amountOfLP, userFactor, annual_boosted_reward, userBoostedAPR)
            }

            if (userBoostedAPR != 0) {

            boostedAPRList.push(userBoostedAPR)

            boostedAPRList.sort((n1,n2) => n1 - n2);

            testMap.set(userID, userBoostedAPR)

            console.log('median check inside', boostedAPRList, boostedAPRList[Math.floor(boostedAPRList.length / 2)])

            median = boostedAPRList[Math.floor(boostedAPRList.length / 2)]
            }
        }
           
    }

    // Finally after all data has been collected and formatted, we set up our database object and call db.updateYETIData() in order to cache our data in our MongoDB database.

    return median
}

module.exports = getMedianBoostedAPR