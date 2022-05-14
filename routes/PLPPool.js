const express = require('express')
const sleep = require('ko-sleep');
const app = express.Router()
 

app.get('/', (req, res) => {
  res.json(req.chainData)
})

app.get('/USDC', (req, res) => {
    res.json(req.chainData.USDC)
  })

app.get('/USDC/description', (req, res) => {
    res.json(req.chainData.USDC.description)
})

app.get('USDC/YETI', (req, res) => {
  res.json(req.chainData.USDC.YETI.value)
})

app.get('USDC/PTPBase', (req, res) => {
    res.json(req.chainData.USDC.PTPBase.value)
})

app.get('USDC/TotalBase', (req, res) => {
    res.json(req.chainData.USDC.TotalBase.value)
})


app.get('/YUSD', (req, res) => {
    res.json(req.chainData.YUSD)
  })

app.get('/YUSD/description', (req, res) => {
    res.json(req.chainData.YUSD.description)
})

app.get('YUSD/YETI', (req, res) => {
  res.json(req.chainData.YUSD.value)
})

app.get('YUSD/PTPBase', (req, res) => {
    res.json(req.chainData.YUSD.PTPBase.value)
})

app.get('YUSD/TotalBase', (req, res) => {
    res.json(req.chainData.YUSD.TotalBase.value)
})



module.exports = app