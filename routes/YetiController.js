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

app.get('/tvls', (req, res) => {
  res.json(req.chainData.tvls.value)
})

app.get('/vaultToName', (req, res) => {
  res.json(req.chainData.vaultToName.value)
})

app.get('/underlyingTokens', (req, res) => {
  res.json(req.chainData.underlyingTokens.value)
})



module.exports = app