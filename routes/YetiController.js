const express = require('express')
const sleep = require('ko-sleep');
const app = express.Router()
 

app.get('/', (req, res) => {
  res.json(req.chainData)
})

app.get('/WhitelistedCollaterals', (req, res) => {
  res.json(req.chainData.whitelistedCollaterals.value)
})

app.get('/Vaults', (req, res) => {
  res.json(req.chainData.vaultTokens.value)
})

app.get('/Prices', (req, res) => {
  res.json(req.chainData.prices.value)
})




module.exports = app