// Used to set schedule for calling Infura to update token data
const schedule = require("node-schedule")

// Used for connecting with node endpoints (Ethereum and avax for this project) to get live information about on chain data
const Web3 = require("web3")

// Used to set a time delay between retrying Web3 connections
const sleep = require("ko-sleep");

// Logic for collecting and calculating all data for Yeti
const getBackFillCollateralsData = require("./getBackFillCollateralsData")
// const getPriceData = require("./getPriceData") 

// Function to setup web3 objects for chains to be queried.

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const setupWeb3 = async () => {

  const avax_endpoints = [

    "https://api.avax.network/ext/bc/C/rpc"
    // "https://avax-mainnet.gateway.pokt.network/v1/lb/62c5d1bc976624003a93890f"
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
  let web3 = await setupWeb3()
  {/* Change the condition below to if function == vaultData*/}
  if (true) {
    const data = await getVaultData(web3, params['blockNum']).catch((err) => {
      console.log('vault error', err)
      setupWeb3().then((new_web3_collection) => {web3 = new_web3_collection})
      // await restart(err)
    })
    return data
  }
}

// This function passes the established web3 objects to the getYETIData and getYUSDData functions inside of the schedule functions. The schedule function comes from node-schedule and uses cron syntax which you can experiment with at [https://crontab.guru/.](https://crontab.guru/.) I"ve set it to update every 15 seconds here as it"s useful for testing purposes. A less frequent update schedule is recommended for production.

const fetchBlockNum = async (timestamp) => {
    let url = `https://api.snowtrace.io/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=%22P54YDTVV45TB1WHBIC4HV4K3CCWBQGH6Q3%22`
    let response = await fetch(url)
    try {
        let data = await response.json()
        return data.result       
    } catch(err) {
        console.log(err)
    }
}
const updateData = async (web3_collection) => {
  
  // getPLPPoolData(web3_collection)

  let timestamp = 1667865600
  let SECONDS_PER_DAY = 86400
  for (i = 0; i < 60; i++) {
      let blockNum = await fetchBlockNum(timestamp)
      console.log("backFilling for", new Date(timestamp * 1000), blockNum)
      await getBackFillCollateralsData(web3_collection, blockNum, timestamp)
      timestamp = timestamp - SECONDS_PER_DAY
  }
} 
// Here we define a function to call the async setupWeb3 function and use the resolved promise "web3_collection" as input for updateData which begins the update loop

const getBackFillData = () => {
  console.log('getting backFill Data')
  setupWeb3().then((web3_collection) => updateData(web3_collection))
}

module.exports = getBackFillData