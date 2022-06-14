const vaultAddresses = require("../addresses/vault")

const getVaultPrice = require("./vault/getVaultPrice")

const getUnderlyingPerReceipt = require("./vault/getUnderlyingPerReceipt")

const db = require("./db")

const {vaultOracleAddresses, vaultProxyAddresses} = vaultAddresses
// Async function which takes in web3 collection, makes web3 calls to get current on chain data, formats data, and caches formatted data to MongoDB
const getVaultData = async (web3s, blockNum) => {
    

    let vaultData = {
        price:{
            USDC: null,
            WBTC: null,
            qiUSDC: null,
            qiAVAX: null,
            qiETH: null,
            qiBTC: null,
            qiUSDCn: null,
            WETHWAVAXJLP: null,
            AVAXUSDCJLP: null,
            av3CRV: null,
            avUSDC: null,
            sJOE: null,
            sAVAX: null,
            aUSDC: null,
            aWAVAX: null,
            aWETH: null,
            aUSDT: null,
            aDAI: null,
            qiUSDTn: null,
            qiDAI: null,
            WAVAX: null
        },
        underlyingPerReceipt: {
            USDC: null,
            WBTC: null,
            qiUSDC: null,
            qiAVAX: null,
            qiETH: null,
            qiBTC: null,
            qiUSDCn: null,
            WETHWAVAXJLP: null,
            AVAXUSDCJLP: null,
            av3CRV: null,
            avUSDC: null,
            sJOE: null,
            sAVAX: null,
            aUSDC: null,
            aWAVAX: null,
            aWETH: null,
            aUSDT: null,
            aDAI: null,
            qiUSDTn: null,
            qiDAI: null
        }
    }

    vaultData.price.USDC = await getVaultPrice(web3s, vaultOracleAddresses.USDC, blockNum)
    vaultData.price.WBTC = await getVaultPrice(web3s, vaultOracleAddresses.WBTC, blockNum)
    vaultData.price.qiUSDC = await getVaultPrice(web3s, vaultOracleAddresses.qiUSDC, blockNum)
    vaultData.price.qiAVAX = await getVaultPrice(web3s, vaultOracleAddresses.qiAVAX, blockNum)
    vaultData.price.qiETH = await getVaultPrice(web3s, vaultOracleAddresses.qiETH, blockNum)
    vaultData.price.qiBTC = await getVaultPrice(web3s, vaultOracleAddresses.qiBTC, blockNum)
    vaultData.price.qiUSDCn = await getVaultPrice(web3s, vaultOracleAddresses.qiUSDCn, blockNum)
    vaultData.price.WETHWAVAXJLP = await getVaultPrice(web3s, vaultOracleAddresses.WETHWAVAXJLP, blockNum)
    vaultData.price.AVAXUSDCJLP = await getVaultPrice(web3s, vaultOracleAddresses.AVAXUSDCJLP, blockNum)
    vaultData.price.av3CRV = await getVaultPrice(web3s, vaultOracleAddresses.av3CRV, blockNum)
    vaultData.price.avUSDC = await getVaultPrice(web3s, vaultOracleAddresses.avUSDC, blockNum)
    vaultData.price.sJOE = await getVaultPrice(web3s, vaultOracleAddresses.sJOE, blockNum)
    vaultData.price.sAVAX = await getVaultPrice(web3s, vaultOracleAddresses.sAVAX, blockNum)
    vaultData.price.aUSDC = await getVaultPrice(web3s, vaultOracleAddresses.aUSDC, blockNum)
    vaultData.price.aWAVAX = await getVaultPrice(web3s, vaultOracleAddresses.aWAVAX, blockNum)
    vaultData.price.aWETH = await getVaultPrice(web3s, vaultOracleAddresses.aWETH, blockNum)
    vaultData.price.aUSDT = await getVaultPrice(web3s, vaultOracleAddresses.aUSDT, blockNum)
    vaultData.price.aDAI = await getVaultPrice(web3s, vaultOracleAddresses.aDAI, blockNum)
    vaultData.price.qiUSDTn = await getVaultPrice(web3s, vaultOracleAddresses.qiUSDTn, blockNum)
    vaultData.price.qiDAI = await getVaultPrice(web3s, vaultOracleAddresses.qiDAI, blockNum)
    vaultData.price.WAVAX = await getVaultPrice(web3s, vaultOracleAddresses.WAVAX, blockNum)
    
    vaultData.underlyingPerReceipt.USDC = await getUnderlyingPerReceipt(web3s, vaultProxyAddresses.USDC, blockNum)
    vaultData.underlyingPerReceipt.WBTC = await getUnderlyingPerReceipt(web3s, vaultProxyAddresses.WBTC, blockNum)
    vaultData.underlyingPerReceipt.qiUSDC = await getUnderlyingPerReceipt(web3s, vaultProxyAddresses.qiUSDC, blockNum)
    vaultData.underlyingPerReceipt.qiAVAX = await getUnderlyingPerReceipt(web3s, vaultProxyAddresses.qiAVAX, blockNum)
    vaultData.underlyingPerReceipt.qiETH = await getUnderlyingPerReceipt(web3s, vaultProxyAddresses.qiETH, blockNum)
    vaultData.underlyingPerReceipt.qiBTC = await getUnderlyingPerReceipt(web3s, vaultProxyAddresses.qiBTC, blockNum)
    vaultData.underlyingPerReceipt.qiUSDCn = await getUnderlyingPerReceipt(web3s, vaultProxyAddresses.qiUSDCn, blockNum)
    vaultData.underlyingPerReceipt.WETHWAVAXJLP = await getUnderlyingPerReceipt(web3s, vaultProxyAddresses.WETHWAVAXJLP, blockNum)
    vaultData.underlyingPerReceipt.AVAXUSDCJLP = await getUnderlyingPerReceipt(web3s, vaultProxyAddresses.AVAXUSDCJLP, blockNum)
    vaultData.underlyingPerReceipt.av3CRV = await getUnderlyingPerReceipt(web3s, vaultProxyAddresses.av3CRV, blockNum)
    vaultData.underlyingPerReceipt.avUSDC = await getUnderlyingPerReceipt(web3s, vaultProxyAddresses.avUSDC, blockNum)
    vaultData.underlyingPerReceipt.sJOE = await getUnderlyingPerReceipt(web3s, vaultProxyAddresses.sJOE, blockNum)
    vaultData.underlyingPerReceipt.sAVAX = await getUnderlyingPerReceipt(web3s, vaultProxyAddresses.sAVAX, blockNum)
    vaultData.underlyingPerReceipt.aUSDC = await getUnderlyingPerReceipt(web3s, vaultProxyAddresses.aUSDC, blockNum)
    vaultData.underlyingPerReceipt.aWAVAX = await getUnderlyingPerReceipt(web3s, vaultProxyAddresses.aWAVAX, blockNum)
    vaultData.underlyingPerReceipt.aWETH = await getUnderlyingPerReceipt(web3s, vaultProxyAddresses.aWETH, blockNum)
    vaultData.underlyingPerReceipt.aUSDT = await getUnderlyingPerReceipt(web3s, vaultProxyAddresses.aUSDT, blockNum)
    vaultData.underlyingPerReceipt.aDAI = await getUnderlyingPerReceipt(web3s, vaultProxyAddresses.aDAI, blockNum)
    vaultData.underlyingPerReceipt.qiUSDTn = await getUnderlyingPerReceipt(web3s, vaultProxyAddresses.qiUSDTn, blockNum)
    vaultData.underlyingPerReceipt.qiDAI = await getUnderlyingPerReceipt(web3s, vaultProxyAddresses.qiDAI, blockNum)

    try {
        const client = db.getClient()
        return db.updateVaultData(vaultData, client, blockNum) 
      }
      catch(err) {
        console.log(err)
      }
    }

    // const {avax_web3} = web3s
    
    // let avax_blockNumber

    // try {
    //     avax_blockNumber = await avax_web3.eth.getBlockNumber() 
    // }
    // catch(err) {
    //     avax_blockNumber = 0
    //     console.log("CANT GET avax_blockNumber")
    //     console.log(err)
    // }

    // const getVaultPrice = async (vaultOrcaleAddress) => {
    //     const vaultOrcaleContract = new avax_web3.eth.Contract(vaultOracleABI, vaultOrcaleAddress);

    //     vaultOrcaleContract.defaultBlock = blockNum

    //     const vaultPriceResult = await vaultOrcaleContract.methods.fetchPrice_v().call()

    //     const price = vaultPriceResult / 10 ** 18

    //     return price
    // }

    // const priceMap = new Map();

    // for (let token in tokenDataMappingT) {
    //     const address = vaultMapping.get(token)
    //     if (tokenDataMappingT[token]['isVault']) {
    //         // console.log(token, 'vault price', address, blockNum)
    //         const price = await getVaultPrice(address)
    //             .then((value) => value)
    //             .catch((error) => console.log('Error fetching price', error))
    //         priceMap.set(token, price)
    //         // console.log('success', price)
            
    //     }
    // }   

    // const getUnderlyingPerReceipt = async (vaultProxyAddress) => {
    //     const vaultProxyContract = new avax_web3.eth.Contract(vaultProxyABI, vaultProxyAddress);

    //     vaultProxyContract.defaultBlock = blockNum

    //     const underlyingPerReceiptResult = await vaultProxyContract.methods.underlyingPerReceipt().call()

    //     const underlyingPerReceipt = underlyingPerReceiptResult / 10 ** 18
        
    //     return underlyingPerReceipt
    // }

    // const underlyingPerReceiptMap = new Map();

    // for (let token in tokenDataMappingT) {
    //     if (!['WAVAX', 'WETH'].includes(token)) {
    //         const address = tokenDataMappingT[token].address
    //         // console.log(token, 'underlyingperreceipt')
    //         const underlyingPerReceipt = await getUnderlyingPerReceipt(address)
    //             .then((value) => value)
    //             .catch((error) => console.log('Error fetching underlyingPerReceipt', error))
    //         underlyingPerReceiptMap.set(token, underlyingPerReceipt)
    //         // console.log('successs', underlyingPerReceipt)
    //     }
    // }
    

    // let Data = {
    //     vaultData: {
    //         priceMap: {
    //             value: priceMap,
    //             description: "The map between tokens and their vault prices at this specific block."
    //         },
    //         underlyingPerReceiptMap: {
    //             value: underlyingPerReceiptMap,
    //             description: "The map between tokens and their underlyingPerReceipt at this specific block."
    //         }
    //     }

    // }

    // Object.keys(Data).forEach(key => {
    //     Data[key].blockNum = blockNum
    //     Data[key].timestamp = Date()
    // })

    // // Finally after all data has been collected and formatted, we set up our database object and call db.updateYETIData() in order to cache our data in our MongoDB database.

    // try {
    //     const client = db.getClient()
    //     db.updateVaultData(Data, client)
    // } catch (err) {
    //     console.log(err)
    // }
    // return Data

    // // Finally after all data has been collected and formatted, we set up our database object and call db.updateYETIData() in order to cache our data in our MongoDB database.

// }

module.exports = getVaultData