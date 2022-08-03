const express = require('express')
const sleep = require('ko-sleep');
const app = express.Router()
 

app.get('/', (req, res) => {
    // console.log('here', req.chainData)
  res.json(req.chainData)
})

app.get('/history/:token', (req, res) => {
  res.json(req.chainData)
})

module.exports = app