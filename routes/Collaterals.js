const express = require('express')
const sleep = require('ko-sleep');
const app = express.Router()
 

app.get('/', (req, res) => {
  res.json(req.chainData)
})

// WAVAX

app.get('/WAVAX', (req, res) => {
  res.json(req.chainData.WAVAX)
})

app.get('/WAVAX/APR', (req, res) => {
  res.json(req.chainData.WAVAX.APR.value)
})

// WETH

app.get('/WETH', (req, res) => {
  res.json(req.chainData.WETH)
})

app.get('/WETH/APR', (req, res) => {
  res.json(req.chainData.WETH.APR.value)
})

// WBTC

app.get('/WBTC', (req, res) => {
  res.json(req.chainData.WBTC)
})

app.get('/WBTC/APR', (req, res) => {
  res.json(req.chainData.WBTC.APR.value)
})

// USDC

app.get('/USDC', (req, res) => {
  res.json(req.chainData.USDC)
})

app.get('/USDC/APR', (req, res) => {
  res.json(req.chainData.USDC.APR.value)
})

// av3CRV

app.get('/av3CRV', (req, res) => {
  res.json(req.chainData.av3CRV)
})

app.get('/av3CRV/APR', (req, res) => {
  res.json(req.chainData.av3CRV.APR.value)
})

// sJOE

app.get('/sJOE', (req, res) => {
  res.json(req.chainData.sJOE)
})

app.get('/sJOE/APR', (req, res) => {
  res.json(req.chainData.sJOE.APR.value)
})


app.get('/WETHWAVAXJLP', (req, res) => {
    res.json(req.chainData.WETHWAVAXJLP)
  })

app.get('/WETHWAVAXJLP/APR', (req, res) => {
  res.json(req.chainData.WETHWAVAXJLP.APR.value)
})

app.get('/WETHWAVAXJLP/description', (req, res) => {
    res.json(req.chainData.WETHWAVAXJLP.APR.description)
})

app.get('/AVAXUSDCJLP', (req, res) => {
  res.json(req.chainData.AVAXUSDCJLP)
})

app.get('/AVAXUSDCJLP/APR', (req, res) => {
res.json(req.chainData.AVAXUSDCJLP.APR.value)
})

app.get('/AVAXUSDCJLP/description', (req, res) => {
  res.json(req.chainData.AVAXUSDCJLP.APR.description)
})

app.get('/qiAVAX', (req, res) => {
  res.json(req.chainData.qiAVAX)
})

app.get('/qiAVAX/APR', (req, res) => {
res.json(req.chainData.qiAVAX.APR.value)
})

app.get('/qiAVAX/description', (req, res) => {
  res.json(req.chainData.qiAVAX.APR.description)
})

app.get('/qiBTC', (req, res) => {
  res.json(req.chainData.qiBTC)
})

app.get('/qiBTC/APR', (req, res) => {
res.json(req.chainData.qiBTC.APR.value)
})

app.get('/qiBTC/description', (req, res) => {
  res.json(req.chainData.qiBTC.APR.description)
})

app.get('/qiDAI', (req, res) => {
  res.json(req.chainData.qiDAI)
})

app.get('/qiDAI/APR', (req, res) => {
res.json(req.chainData.qiDAI.APR.value)
})

app.get('/qiDAI/description', (req, res) => {
  res.json(req.chainData.qiDAI.APR.description)
})

app.get('/qiETH', (req, res) => {
  res.json(req.chainData.qiETH)
})

app.get('/qiETH/APR', (req, res) => {
res.json(req.chainData.qiETH.APR.value)
})

app.get('/qiETH/description', (req, res) => {
  res.json(req.chainData.qiETH.APR.description)
})

// qiUSDC

app.get('/qiUSDC', (req, res) => {
  res.json(req.chainData.qiUSDC)
})

app.get('/qiUSDC/APR', (req, res) => {
res.json(req.chainData.qiUSDC.APR.value)
})

app.get('/qiUSDC/description', (req, res) => {
  res.json(req.chainData.qiUSDC.APR.description)
})

// qiUSDCn

app.get('/qiUSDCn', (req, res) => {
  res.json(req.chainData.qiUSDCn)
})

app.get('/qiUSDCn/APR', (req, res) => {
res.json(req.chainData.qiUSDCn.APR.value)
})

app.get('/qiUSDCn/description', (req, res) => {
  res.json(req.chainData.qiUSDCn.APR.description)
})

// qiUSDTn

app.get('/qiUSDTn', (req, res) => {
  res.json(req.chainData.qiUSDTn)
})

app.get('/qiUSDTn/APR', (req, res) => {
res.json(req.chainData.qiUSDTn.APR.value)
})

app.get('/qiUSDTn/description', (req, res) => {
  res.json(req.chainData.qiUSDTn.APR.description)
})

// aUSDC

app.get('/aUSDC', (req, res) => {
  res.json(req.chainData.aUSDC)
})

app.get('/aUSDC/APR', (req, res) => {
res.json(req.chainData.aUSDC.APR.value)
})

app.get('/aUSDC/description', (req, res) => {
  res.json(req.chainData.aUSDC.APR.description)
})

// aWAVAX

app.get('/aWAVAX', (req, res) => {
  res.json(req.chainData.aWAVAX)
})

app.get('/aWAVAX/APR', (req, res) => {
res.json(req.chainData.aWAVAX.APR.value)
})

app.get('/aWAVAX/description', (req, res) => {
  res.json(req.chainData.aWAVAX.APR.description)
})

// aWETH

app.get('/aWETH', (req, res) => {
  res.json(req.chainData.aWAVAX)
})

app.get('/aWETH/APR', (req, res) => {
res.json(req.chainData.aWETH.APR.value)
})

app.get('/aWETH/description', (req, res) => {
  res.json(req.chainData.aWETH.APR.description)
})

// aUSDT

app.get('/aUSDT', (req, res) => {
  res.json(req.chainData.aUSDT)
})

app.get('/aUSDT/APR', (req, res) => {
res.json(req.chainData.aUSDT.APR.value)
})

app.get('/aUSDT/description', (req, res) => {
  res.json(req.chainData.aUSDT.APR.description)
})

// aDAI

app.get('/aDAI', (req, res) => {
  res.json(req.chainData.aDAI)
})

app.get('/aDAI/APR', (req, res) => {
res.json(req.chainData.aDAI.APR.value)
})

app.get('/aDAI/description', (req, res) => {
  res.json(req.chainData.aDAI.APR.description)
})

module.exports = app