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
    res.json(req.chainData.pool.APR.description)
})

app.get('/AVAXUSDCJLP', (req, res) => {
  res.json(req.chainData.AVAXUSDCJLP)
})

app.get('/AVAXUSDCJLP/APR', (req, res) => {
res.json(req.chainData.AVAXUSDCJLP.APR.value)
})

app.get('/AVAXUSDCJLP/description', (req, res) => {
  res.json(req.chainData.pool.APR.description)
})


module.exports = app