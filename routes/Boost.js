const express = require('express')
const sleep = require('ko-sleep');
const app = express.Router()
 

app.get('/', (req, res) => {
  res.json(req.chainData)
})

app.get('/BoostFarm', (req, res) => {
    res.json(req.chainData.boostFarm)
})

app.get('/BoostFarm/description', (req, res) => {
    res.json(req.chainData.boostFarm.description)
})

app.get('BoostFarm/MedianAPR', (req, res) => {
  res.json(req.chainData.boostFarm.medianAPR.value)
})

app.get('BoostFarm/MedianAPR/description', (req, res) => {
    res.json(req.chainData.boostFarm.medianAPR.description)
})



module.exports = app