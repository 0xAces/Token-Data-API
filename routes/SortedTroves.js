const express = require('express')
const sleep = require('ko-sleep');
const app = express.Router()
 

app.get('/', (req, res) => {
  res.json(req.chainData)
})

app.get('/SortedTroves', (req, res) => {
    res.json(req.chainData.SortedTroves.value)
})

app.get('/SortedAICRs', (req, res) => {
  res.json(req.chainData.SortedAICRs.value)
})

app.get('/SumDebt', (req, res) => {
  res.json(req.chainData.SumDebt.value)
})




module.exports = app