const express = require('express')
const sleep = require('ko-sleep');
const app = express.Router()
 

app.get('/', (req, res) => {
  res.json(req.chainData)
})

app.get('/:blockNum', (req, res) => {
    res.json(req.chainData)
})

app.get('/:blockNum/price', (req, res) => {
    res.json(req.chainData.price)
})

app.get('/:blockNum/price/USDC', (req, res) => {
    res.json(req.chainData.price.USDC)
})

app.get('/:blockNum/price/WBTC', (req, res) => {
    res.json(req.chainData.price.WBTC)
})

app.get('/:blockNum/price/qiUSDC', (req, res) => {
    res.json(req.chainData.price.qiUSDC)
})

app.get('/:blockNum/price/qiAVAX', (req, res) => {
    res.json(req.chainData.price.qiAVAX)
})

app.get('/:blockNum/price/qiETH', (req, res) => {
    res.json(req.chainData.price.qiETH)
})

app.get('/:blockNum/price/qiBTC', (req, res) => {
    res.json(req.chainData.price.qiBTC)
})

app.get('/:blockNum/price/qiUSDCn', (req, res) => {
    res.json(req.chainData.price.qiUSDCn)
})

app.get('/:blockNum/price/WETHWAVAXJLP', (req, res) => {
    res.json(req.chainData.price.WETHWAVAXJLP)
})

app.get('/:blockNum/price/AVAXUSDCJLP', (req, res) => {
    res.json(req.chainData.price.AVAXUSDCJLP)
})

app.get('/:blockNum/price/av3CRV', (req, res) => {
    res.json(req.chainData.price.av3CRV)
})

app.get('/:blockNum/price/avUSDC', (req, res) => {
    res.json(req.chainData.price.avUSDC)
})

app.get('/:blockNum/price/sJOE', (req, res) => {
    res.json(req.chainData.price.sJOE)
})

app.get('/:blockNum/price/sAVAX', (req, res) => {
    res.json(req.chainData.price.sAVAX)
})

app.get('/:blockNum/price/aUSDC', (req, res) => {
    res.json(req.chainData.price.aUSDC)
})

app.get('/:blockNum/price/aWAVAX', (req, res) => {
    res.json(req.chainData.price.aWAVAX)
})

app.get('/:blockNum/price/aWETH', (req, res) => {
    res.json(req.chainData.price.aWETH)
})

app.get('/:blockNum/price/aUSDT', (req, res) => {
    res.json(req.chainData.price.aUSDT)
})

app.get('/:blockNum/price/aDAI', (req, res) => {
    res.json(req.chainData.price.aDAI)
})

app.get('/:blockNum/price/qiUSDTn', (req, res) => {
    res.json(req.chainData.price.qiUSDTn)
})

app.get('/:blockNum/price/qiDAI', (req, res) => {
    res.json(req.chainData.price.qiDAI)
})

app.get('/:blockNum/price/WAVAX', (req, res) => {
    res.json(req.chainData.price.WAVAX)
})

app.get('/VaultData/description', (req, res) => {
    res.json(req.chainData.description)
})


{/* UNDERLYING */}

app.get('/:blockNum/underlyingPerReceipt', (req, res) => {
    res.json(req.chainData.underlyingPerReceipt)
})

app.get('/:blockNum/underlyingPerReceipt/USDC', (req, res) => {
    res.json(req.chainData.underlyingPerReceipt.USDC)
})

app.get('/:blockNum/underlyingPerReceipt/WBTC', (req, res) => {
    res.json(req.chainData.underlyingPerReceipt.WBTC)
})

app.get('/:blockNum/underlyingPerReceipt/qiUSDC', (req, res) => {
    res.json(req.chainData.underlyingPerReceipt.qiUSDC)
})

app.get('/:blockNum/underlyingPerReceipt/qiAVAX', (req, res) => {
    res.json(req.chainData.underlyingPerReceipt.qiAVAX)
})

app.get('/:blockNum/underlyingPerReceipt/qiETH', (req, res) => {
    res.json(req.chainData.underlyingPerReceipt.qiETH)
})

app.get('/:blockNum/underlyingPerReceipt/qiBTC', (req, res) => {
    res.json(req.chainData.underlyingPerReceipt.qiBTC)
})

app.get('/:blockNum/underlyingPerReceipt/qiUSDCn', (req, res) => {
    res.json(req.chainData.underlyingPerReceipt.qiUSDCn)
})

app.get('/:blockNum/underlyingPerReceipt/WETHWAVAXJLP', (req, res) => {
    res.json(req.chainData.underlyingPerReceipt.WETHWAVAXJLP)
})

app.get('/:blockNum/underlyingPerReceipt/AVAXUSDCJLP', (req, res) => {
    res.json(req.chainData.underlyingPerReceipt.AVAXUSDCJLP)
})

app.get('/:blockNum/underlyingPerReceipt/av3CRV', (req, res) => {
    res.json(req.chainData.underlyingPerReceipt.av3CRV)
})

app.get('/:blockNum/underlyingPerReceipt/avUSDC', (req, res) => {
    res.json(req.chainData.underlyingPerReceipt.avUSDC)
})

app.get('/:blockNum/underlyingPerReceipt/sJOE', (req, res) => {
    res.json(req.chainData.underlyingPerReceipt.sJOE)
})

app.get('/:blockNum/underlyingPerReceipt/sAVAX', (req, res) => {
    res.json(req.chainData.underlyingPerReceipt.sAVAX)
})

app.get('/:blockNum/underlyingPerReceipt/aUSDC', (req, res) => {
    res.json(req.chainData.underlyingPerReceipt.aUSDC)
})

app.get('/:blockNum/underlyingPerReceipt/aWAVAX', (req, res) => {
    res.json(req.chainData.underlyingPerReceipt.aWAVAX)
})

app.get('/:blockNum/underlyingPerReceipt/aWETH', (req, res) => {
    res.json(req.chainData.underlyingPerReceipt.aWETH)
})

app.get('/:blockNum/underlyingPerReceipt/aUSDT', (req, res) => {
    res.json(req.chainData.underlyingPerReceipt.aUSDT)
})

app.get('/:blockNum/underlyingPerReceipt/aDAI', (req, res) => {
    res.json(req.chainData.underlyingPerReceipt.aDAI)
})

app.get('/:blockNum/underlyingPerReceipt/qiUSDTn', (req, res) => {
    res.json(req.chainData.underlyingPerReceipt.qiUSDTn)
})

app.get('/:blockNum/underlyingPerReceipt/qiDAI', (req, res) => {
    res.json(req.chainData.underlyingPerReceipt.qiDAI)
})


module.exports = app