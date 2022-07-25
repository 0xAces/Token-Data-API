const express = require('express')
const sleep = require('ko-sleep');
const app = express.Router()
 

app.get('/', (req, res) => {
  console.log('queried here')
  res.json(req.chainData)
})

app.get('/history/:token', (req, res) => {
  console.log('queried here!', req.chainData)
  res.json(req.chainData)
})

// WAVAX

app.get('/WAVAX', (req, res) => {
  res.json(req.chainData.WAVAX)
})

app.get('/WAVAX/APY', (req, res) => {
  res.json(req.chainData.WAVAX.APY.value)
})

// WETH

app.get('/WETH', (req, res) => {
  res.json(req.chainData.WETH)
})

app.get('/WETH/APY', (req, res) => {
  res.json(req.chainData.WETH.APY.value)
})

// WBTC

app.get('/WBTC', (req, res) => {
  res.json(req.chainData.WBTC)
})

app.get('/WBTC/APY', (req, res) => {
  res.json(req.chainData.WBTC.APY.value)
})

// USDC

app.get('/USDC', (req, res) => {
  res.json(req.chainData.USDC)
})

app.get('/USDC/APY', (req, res) => {
  res.json(req.chainData.USDC.APY.value)
})

// av3CRV

app.get('/av3CRV', (req, res) => {
  res.json(req.chainData.av3CRV)
})

app.get('/av3CRV/APY', (req, res) => {
  res.json(req.chainData.av3CRV.APY.value)
})

// sJOE

app.get('/sJOE', (req, res) => {
  res.json(req.chainData.sJOE)
})

app.get('/sJOE/APY', (req, res) => {
  res.json(req.chainData.sJOE.APY.value)
})


app.get('/WETHWAVAXJLP', (req, res) => {
    res.json(req.chainData.WETHWAVAXJLP)
  })

app.get('/WETHWAVAXJLP/APY', (req, res) => {
  res.json(req.chainData.WETHWAVAXJLP.APY.value)
})

app.get('/WETHWAVAXJLP/description', (req, res) => {
    res.json(req.chainData.WETHWAVAXJLP.APY.description)
})

app.get('/AVAXUSDCJLP', (req, res) => {
  res.json(req.chainData.AVAXUSDCJLP)
})

app.get('/AVAXUSDCJLP/APY', (req, res) => {
res.json(req.chainData.AVAXUSDCJLP.APY.value)
})

app.get('/AVAXUSDCJLP/description', (req, res) => {
  res.json(req.chainData.AVAXUSDCJLP.APY.description)
})

app.get('/qiAVAX', (req, res) => {
  res.json(req.chainData.qiAVAX)
})

app.get('/qiAVAX/APY', (req, res) => {
res.json(req.chainData.qiAVAX.APY.value)
})

app.get('/qiAVAX/description', (req, res) => {
  res.json(req.chainData.qiAVAX.APY.description)
})

app.get('/qiBTC', (req, res) => {
  res.json(req.chainData.qiBTC)
})

app.get('/qiBTC/APY', (req, res) => {
res.json(req.chainData.qiBTC.APY.value)
})

app.get('/qiBTC/description', (req, res) => {
  res.json(req.chainData.qiBTC.APY.description)
})

app.get('/qiDAI', (req, res) => {
  res.json(req.chainData.qiDAI)
})

app.get('/qiDAI/APY', (req, res) => {
res.json(req.chainData.qiDAI.APY.value)
})

app.get('/qiDAI/description', (req, res) => {
  res.json(req.chainData.qiDAI.APY.description)
})

app.get('/qiETH', (req, res) => {
  res.json(req.chainData.qiETH)
})

app.get('/qiETH/APY', (req, res) => {
res.json(req.chainData.qiETH.APY.value)
})

app.get('/qiETH/description', (req, res) => {
  res.json(req.chainData.qiETH.APY.description)
})

// qiUSDC

app.get('/qiUSDC', (req, res) => {
  res.json(req.chainData.qiUSDC)
})

app.get('/qiUSDC/APY', (req, res) => {
res.json(req.chainData.qiUSDC.APY.value)
})

app.get('/qiUSDC/description', (req, res) => {
  res.json(req.chainData.qiUSDC.APY.description)
})

// qiUSDCn

app.get('/qiUSDCn', (req, res) => {
  res.json(req.chainData.qiUSDCn)
})

app.get('/qiUSDCn/APY', (req, res) => {
res.json(req.chainData.qiUSDCn.APY.value)
})

app.get('/qiUSDCn/description', (req, res) => {
  res.json(req.chainData.qiUSDCn.APY.description)
})

// qiUSDTn

app.get('/qiUSDTn', (req, res) => {
  res.json(req.chainData.qiUSDTn)
})

app.get('/qiUSDTn/APY', (req, res) => {
res.json(req.chainData.qiUSDTn.APY.value)
})

app.get('/qiUSDTn/description', (req, res) => {
  res.json(req.chainData.qiUSDTn.APY.description)
})

// aUSDC

app.get('/aUSDC', (req, res) => {
  res.json(req.chainData.aUSDC)
})

app.get('/aUSDC/APY', (req, res) => {
res.json(req.chainData.aUSDC.APY.value)
})

app.get('/aUSDC/description', (req, res) => {
  res.json(req.chainData.aUSDC.APY.description)
})

// aWAVAX

app.get('/aWAVAX', (req, res) => {
  res.json(req.chainData.aWAVAX)
})

app.get('/aWAVAX/APY', (req, res) => {
res.json(req.chainData.aWAVAX.APY.value)
})

app.get('/aWAVAX/description', (req, res) => {
  res.json(req.chainData.aWAVAX.APY.description)
})

// aWETH

app.get('/aWETH', (req, res) => {
  res.json(req.chainData.aWAVAX)
})

app.get('/aWETH/APY', (req, res) => {
res.json(req.chainData.aWETH.APY.value)
})

app.get('/aWETH/description', (req, res) => {
  res.json(req.chainData.aWETH.APY.description)
})

// aUSDT

app.get('/aUSDT', (req, res) => {
  res.json(req.chainData.aUSDT)
})

app.get('/aUSDT/APY', (req, res) => {
res.json(req.chainData.aUSDT.APY.value)
})

app.get('/aUSDT/description', (req, res) => {
  res.json(req.chainData.aUSDT.APY.description)
})

// aDAI

app.get('/aDAI', (req, res) => {
  res.json(req.chainData.aDAI)
})

app.get('/aDAI/APY', (req, res) => {
res.json(req.chainData.aDAI.APY.value)
})

app.get('/aDAI/description', (req, res) => {
  res.json(req.chainData.aDAI.APY.description)
})

// sAVAX

app.get('/sAVAX', (req, res) => {
  res.json(req.chainData.sAVAX)
})

app.get('/sAVAX/APY', (req, res) => {
res.json(req.chainData.sAVAX.APY.value)
})


module.exports = app