const express = require('express')
const sleep = require('ko-sleep');
const app = express.Router()
 
app.get('/', (req, res) => {
  res.json(req.chainData)
})

app.get('/liquidity', (req, res) => {
    res.json(req.chainData.liquidity)
  })

module.exports = app