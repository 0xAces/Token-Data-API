const express = require('express')
const sleep = require('ko-sleep');
const app = express.Router()
 

app.get('/', (req, res) => {
  res.json(req.chainData)
})

app.get('/pool', (req, res) => {
  res.json(req.chainData.pool.value)
})

app.get('/pool/description', (req, res) => {
    res.json(req.chainData.pool.description)
})

app.get('/JOE', (req, res) => {
  res.json(req.chainData.JOE.value)
})

app.get('/JOE/description', (req, res) => {
    res.json(req.chainData.JOE.description)
})

app.get('/YETI', (req, res) => {
    res.json(req.chainData.YETI.value)
})

app.get('/YETI/description', (req, res) => {
    res.json(req.chainData.YETI.description)
})

module.exports = app