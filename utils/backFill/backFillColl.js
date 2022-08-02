const getQiBTCAPY = require("../collaterals/getQiBTCAPY")
const backFillQiBTCAPY = require("./getQiBTCAPY")
const getAPY = require("../collaterals/getJoeAPY")
const backFillAPY = require("./getJoeAPY")

const Web3 = require("web3")
const getJoeAPY = require("../collaterals/getJoeAPY")

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

setupWeb3().then(async (web3_collection) => {
    let apy = await getAPY(web3_collection)
    let backAPY = await backFillAPY(web3_collection, 
      

      14626660 , 1652483548)
    console.log(apy, backAPY)})

