const express = require('express')
const sleep = require('ko-sleep');
const app = express.Router()
 

app.get('/', (req, res) => {
  res.json(req.chainData)
})

app.get('/WhitelistedCollaterals', (req, res) => {
  res.json(req.chainData.whitelistedCollaterals.value)
})




module.exports = app