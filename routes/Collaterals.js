const express = require('express')
const sleep = require('ko-sleep');
const app = express.Router()
 

app.get('/', (req, res) => {
  res.json(req.chainData)
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

module.exports = app