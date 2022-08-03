const numeral = require("numeral") // NPM package for formatting numbers
const db = require("./db") // Util for setting up DB and main DB methods
const getWETHWAVAXAPY = require("./backFill/getWETHWAVAXAPY")
const getAVAXUSDCAPY = require("./backFill/getAVAXUSDCAPY")
const getQiUSDCAPY = require("./backFill/getQiUSDCAPY")
const getQiAVAXAPY = require("./backFill/getQiAVAXAPY")
const getQiETHAPY = require("./backFill/getQiETHAPY")
const getQiBTCAPY = require("./backFill/getQiBTCAPY")
const getQiUSDCnAPY = require("./backFill/getQiUSDCnAPY")
const getQiUSDTnAPY = require("./backFill/getQiUSDTnAPY")
const getQiDAIAPY = require("./backFill/getQiDAIAPY")
const getaUSDCAPY = require("./backFill/getaUSDCAPY")
const getaWAVAXAPY = require("./backFill/getaWAVAXAPY")
const getaWETHAPY = require("./backFill/getaWETHAPY")
const getaUSDTAPY = require("./backFill/getaUSDTAPY")
const getaDAIAPY = require("./backFill/getaDAIAPY")
const getJoeAPY = require("./backFill/getJoeAPY")

// Async function which takes in web3 collection, makes web3 calls to get current on chain data, formats data, and caches formatted data to MongoDB
const getCollateralsData = async (web3s, blockNum, timestamp) => {
    
    let collateralsData = {
        WAVAX: {APY: {value: 0}},
        USDC: {APY: {value: 0}},
        WETH: {APY: {value: 0}},
        WBTC: {APY: {value: 0}},
        sAVAX: {APY: {value: 0.0576}},
        av3CRV: {APY: {value: 0.0169}},
        WETHWAVAXJLP: null,
        AVAXUSDCJLP: null,
        qiUSDC: null,
        qiAVAX: null,
        qiETH: null,
        qiBTC: null,
        qiUSDCn: null,
        qiUSDTn: null,
        qiDAI: null,
        aUSDC: null,
        aWAVAX: null,
        aWETH: null,
        aUSDT: null,
        aDAI: null,
        aUSDT: null,
        sJOE: null,
    }

    collateralsData.WETHWAVAXJLP = await getWETHWAVAXAPY(web3s, blockNum, timestamp)
    collateralsData.AVAXUSDCJLP = await getAVAXUSDCAPY(web3s, blockNum, timestamp)
    collateralsData.qiUSDC = await getQiUSDCAPY(web3s, blockNum, timestamp)
    collateralsData.qiAVAX = await getQiAVAXAPY(web3s, blockNum, timestamp)
    collateralsData.qiETH = await getQiETHAPY(web3s, blockNum, timestamp)
    collateralsData.qiBTC = await getQiBTCAPY(web3s, blockNum, timestamp)
    collateralsData.qiUSDCn = await getQiUSDCnAPY(web3s, blockNum, timestamp)
    collateralsData.qiUSDTn = await getQiUSDTnAPY(web3s, blockNum, timestamp)
    collateralsData.qiDAI = await getQiDAIAPY(web3s, blockNum, timestamp)
    collateralsData.aUSDC = await getaUSDCAPY(web3s, blockNum, timestamp)
    collateralsData.aWAVAX = await getaWAVAXAPY(web3s, blockNum, timestamp)
    collateralsData.aWETH = await getaUSDTAPY(web3s, blockNum, timestamp)
    collateralsData.aDAI = await getaDAIAPY(web3s, blockNum, timestamp)
    collateralsData.aWETH = await getaWETHAPY(web3s, blockNum, timestamp)
    collateralsData.aUSDT = await getaUSDTAPY(web3s, blockNum, timestamp)
    collateralsData.sJOE = await getJoeAPY(web3s, blockNum, timestamp)
    
    // Finally after all data has been collected and formatted, we set up our database object and call db.updateYETIData() in order to cache our data in our MongoDB database.

    try {
      const client = db.getClient()
      console.log('got backFillCollaterals', timestamp, blockNum)
      db.updateBackFillCollateralsData(collateralsData, client) 
    }
    catch(err) {
      console.log(err)
    }
  }

  module.exports = getCollateralsData