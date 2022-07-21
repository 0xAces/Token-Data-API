// Used to set schedule for calling Infura to update token data
const schedule = require("node-schedule")

// Used for connecting with node endpoints (Ethereum and avax for this project) to get live information about on chain data
const Web3 = require("web3")

// Used to set a time delay between retrying Web3 connections
const sleep = require("ko-sleep");

// Logic for collecting and calculating all data for Yeti
const getYETIData = require("./getYETIData")

// Logic for collecting and calculating all data for YUSD
const getYUSDData = require("./getYUSDData")

const getTJFarmPoolData = require("./getTJFarmPoolData")

const getCollateralsData = require("./getCollateralsData")

const getPLPPoolData = require("./getPLPPoolData")

const getCurvePoolData = require("./getCurvePoolData")

const getBoostData = require("./getBoostData")

const getVaultData = require("./getVaultData")

const getSortedTrovesData = require("./getSortedTroves")

const getYetiControllerData = require("./getYetiControllerData")
// const getPriceData = require("./getPriceData") 

// Function to setup web3 objects for chains to be queried.

const setupWeb3 = async () => {

  const avax_endpoints = [

    "https://api.avax.network/ext/bc/C/rpc"
  ]

  let avax_web3

  // Run through three provided avax endpoints until a connection is established and a valid web3 object is returned

  while (true) {

    for (i = 0; i < avax_endpoints.length; i++) {

      avax_web3 = await new Web3(new Web3.providers.HttpProvider(avax_endpoints[i]))

      if (avax_web3.currentProvider) break

      await sleep(100)

    }

    if (avax_web3.currentProvider) {
      console.log('got avax web3 endpoints')
      break
    }

  }

  // let web3

  // // Only a single Infura endpoint is provided for the Ethereum web3 object as Infura endpoints are highly stable. Note that WebsocketProvider is used here, if you prefer an HTTP endpoint make sure to change it to HttpProvider.

  // while (true) {

  //   // INFURA_URL is available as an environment variable. It"s recommended to use dotenv for setting env variables in your development environment: [https://www.npmjs.com/package/dotenv](https://www.npmjs.com/package/dotenv)

  //   web3 = await new Web3(new Web3.providers.WebsocketProvider(process.env.INFURA_URL))

  //   if (web3.currentProvider) break

  //   await sleep(100)

  // }

  // // Return all established web3 objects

  return {
    avax_web3
  }

}

const getPastData = async (func = null, params) => {
  {/* Map the function name to the function*/}
  const web3 = await setupWeb3()
  {/* Change the condition below to if function == vaultData*/}
  if (true) {
    const data = await getVaultData(web3, params['blockNum']).catch((err) => {
      console.log('vault error', err)
      // await restart(err)
    })
    return data
  }
}

// This function passes the established web3 objects to the getYETIData and getYUSDData functions inside of the schedule functions. The schedule function comes from node-schedule and uses cron syntax which you can experiment with at [https://crontab.guru/.](https://crontab.guru/.) I"ve set it to update every 15 seconds here as it"s useful for testing purposes. A less frequent update schedule is recommended for production.

const updateData = async (web3_collection) => {

  // getPLPPoolData(web3_collection)

  schedule.scheduleJob({minute: 0, hour: 9}, async () => {

    getYETIData(web3_collection).catch(async (err) => {
      console.log('yeti error', err)
      await sleep(1000)
      web3_collection = await setupWeb3()
      // await restart(err)
    })

    getTJFarmPoolData(web3_collection).catch(async (err) => {
      console.log('farmpool error', err)
      await sleep(1000)
      web3_collection = await setupWeb3()
      // await restart(err)
    })

    getCollateralsData(web3_collection).catch(async (err) => {
      console.log('collaterals error', err)
      await sleep(1000)
      web3_collection = await setupWeb3()
      // await restart(err)
    })

    getPLPPoolData(web3_collection).catch(async (err) => {
      console.log('plp pool error', err)
      await sleep(1000)
      web3_collection = await setupWeb3()
      // await restart(err)
    })

    getCurvePoolData(web3_collection).catch(async (err) => {
      console.log('curve pool error', err)
      await sleep(1000)
      web3_collection = await setupWeb3()
      // await restart(err)
    })
    
  })

  schedule.scheduleJob("*/10,*,*,*,*", async () => {

    getYUSDData(web3_collection).catch(async (err) => {
      console.log('yusd error', err)
      await sleep(1000)
      web3_collection = await setupWeb3()
      // await restart(err)
    })

    getBoostData(web3_collection).catch(async (err) => {
      console.log('boost error', err)
      await sleep(1000)
      web3_collection = await setupWeb3()
      // await restart(err)
    })
    
    getSortedTrovesData(web3_collection).catch(async (err) => {
      console.log('sorted error', err)
      await sleep(1000)
      web3_collection = await setupWeb3()
      // await restart(err)
    })

  })

  schedule.scheduleJob("10,20,30,40,50,59 * * * * *", async () => {
    getYetiControllerData(web3_collection).catch(async (err) => {
        console.log('controller error', err)
        await sleep(1000)
        web3_collection = await setupWeb3()
      })
  })
} 
// Here we define a function to call the async setupWeb3 function and use the resolved promise "web3_collection" as input for updateData which begins the update loop

const getChainData = () => {
  console.log('getting chain Data')
  setupWeb3().then((web3_collection) => updateData(web3_collection))
}

module.exports = {getChainData, getPastData}