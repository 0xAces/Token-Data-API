const numeral = require("numeral") // NPM package for formatting numbers
const db = require("./db") // Util for setting up DB and main DB methods
const getWETHWAVAXAPR = require("./collaterals/getWETHWAVAXAPR")
const getAVAXUSDCAPR = require("./collaterals/getAVAXUSDCAPR")
const getQiUSDCAPR = require("./collaterals/getQiUSDCAPY")
const getQiAVAXAPR = require("./collaterals/getQiAVAXAPY")
const getQiETHAPR = require("./collaterals/getQiETHAPY")
const getQiBTCAPR = require("./collaterals/getQiBTCAPY")
const getQiUSDCnAPR = require("./collaterals/getQiUSDCnAPY")
const getQiUSDTnAPR = require("./collaterals/getQiUSDTnAPY")
const getQiDAIAPR = require("./collaterals/getQiDAIAPY")


// Async function which takes in web3 collection, makes web3 calls to get current on chain data, formats data, and caches formatted data to MongoDB
const getCollateralsData = async (web3s) => {
    
    let collateralsData = {
        WETHWAVAXJLP: null,
        AVAXUSDCJLP: null,
        qiUSDC: null,
        qiAVAX: null,
        qiETH: null,
        qiBTC: null,
        qiUSDCn: null,
        qiUSDTn: null,
        qiDAI: null
    }

    collateralsData.WETHWAVAXJLP = await getWETHWAVAXAPR(web3s)
    collateralsData.AVAXUSDCJLP = await getAVAXUSDCAPR(web3s)
    collateralsData.qiUSDC = await getQiUSDCAPR(web3s)
    collateralsData.qiAVAX = await getQiAVAXAPR(web3s)
    collateralsData.qiETH = await getQiETHAPR(web3s)
    collateralsData.qiBTC = await getQiBTCAPR(web3s)
    collateralsData.qiUSDCn = await getQiUSDCnAPR(web3s)
    collateralsData.qiUSDTn = await getQiUSDTnAPR(web3s)
    collateralsData.qiDAI = await getQiDAIAPR(web3s)
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