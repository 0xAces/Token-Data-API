const numeral = require("numeral") // NPM package for formatting numbers
const db = require("./db") // Util for setting up DB and main DB methods
const getWETHWAVAXAPY = require("./collaterals/getWETHWAVAXAPY")
const getAVAXUSDCAPY = require("./collaterals/getAVAXUSDCAPY")
const getQiUSDCAPY = require("./collaterals/getQiUSDCAPY")
const getQiAVAXAPY = require("./collaterals/getQiAVAXAPY")
const getQiETHAPY = require("./collaterals/getQiETHAPY")
const getQiBTCAPY = require("./collaterals/getQiBTCAPY")
const getQiUSDCnAPY = require("./collaterals/getQiUSDCnAPY")
const getQiUSDTnAPY = require("./collaterals/getQiUSDTnAPY")
const getQiDAIAPY = require("./collaterals/getQiDAIAPY")
const getaUSDCAPY = require("./collaterals/getaUSDCAPY")
const getaWAVAXAPY = require("./collaterals/getaWAVAXAPY")
const getaWETHAPY = require("./collaterals/getaWETHAPY")
const getaUSDTAPY = require("./collaterals/getaUSDTAPY")
const getaDAIAPY = require("./collaterals/getaDAIAPY")

// Async function which takes in web3 collection, makes web3 calls to get current on chain data, formats data, and caches formatted data to MongoDB
const getCollateralsData = async (web3s) => {
    
    let collateralsData = {
        WAVAX: {APY: {value: 0}},
        USDC: {APY: {value: 0}},
        WETH: {APY: {value: 0}},
        WBTC: {APY: {value: 0}},
        sJOE: {APY: {value: 0.3826}},
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
    }

    collateralsData.WETHWAVAXJLP = await getWETHWAVAXAPY(web3s)
    collateralsData.AVAXUSDCJLP = await getAVAXUSDCAPY(web3s)
    collateralsData.qiUSDC = await getQiUSDCAPY(web3s)
    collateralsData.qiAVAX = await getQiAVAXAPY(web3s)
    collateralsData.qiETH = await getQiETHAPY(web3s)
    collateralsData.qiBTC = await getQiBTCAPY(web3s)
    collateralsData.qiUSDCn = await getQiUSDCnAPY(web3s)
    collateralsData.qiUSDTn = await getQiUSDTnAPY(web3s)
    collateralsData.qiDAI = await getQiDAIAPY(web3s)
    collateralsData.aUSDC = await getaUSDCAPY(web3s)
    collateralsData.aWAVAX = await getaWAVAXAPY(web3s)
    collateralsData.aWETH = await getaUSDTAPY(web3s)
    collateralsData.aDAI = await getaDAIAPY(web3s)
    collateralsData.aWETH = await getaWETHAPY(web3s)
    
    // Finally after all data has been collected and formatted, we set up our database object and call db.updateYETIData() in order to cache our data in our MongoDB database.

    try {
      const client = db.getClient()
      db.updateCollateralsData(collateralsData, client) 
    }
    catch(err) {
      console.log(err)
    }
  }

  module.exports = getCollateralsData