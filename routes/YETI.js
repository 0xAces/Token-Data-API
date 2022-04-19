const express = require('express')
const sleep = require('ko-sleep');
const app = express.Router()
 

app.get('/', (req, res) => {
  res.json(req.chainData)
})

app.get('/combined', (req, res) => {
  res.json(req.chainData.combined)
})

app.get('/avax', (req, res) => {
  res.json(req.chainData.avax)
})


app.get('/combined/circulating/details', (req, res) => {
  res.json(req.chainData.combined.circulatingSupply)
})

app.get('/combined/circulating/', (req, res) => {
  res.json(req.chainData.combined.circulatingSupply.value)
})

app.get('/combined/total/details', (req, res) => {
  res.json(req.chainData.combined.totalSupply)
})

app.get('/combined/total', (req, res) => {
  res.json(req.chainData.combined.totalSupply.value)
})


// app.get('/eth/circulating/details', (req, res) => {
//   res.json(req.chainData.eth.circulatingSupply)
// })

// app.get('/eth/total/details', (req, res) => {
//   res.json(req.chainData.eth.totalSupply)
// })


app.get('/circulating', (req, res) => {
  res.json(req.chainData.combined.circulatingSupply.value)
})

app.get('/total', (req, res) => {
  res.json(req.chainData.combined.totalSupply.value)
})

// app.get('/eth/circulating', (req, res) => {
//   res.json(req.chainData.eth.circulatingSupply.value)
// })

// app.get('/eth/total', (req, res) => {
//   res.json(req.chainData.eth.totalSupply.value)
// })

app.get('/avax/total', (req, res) => {
  res.json(req.chainData.avax.totalSupply.value)
})

app.get('/avax/circulating', (req, res) => {
  res.json(req.chainData.avax.circulatingSupply.value)
})


app.get('/avax/total/details', (req, res) => {
  res.json(req.chainData.avax.totalSupply)
})
 
app.get('/avax/circulating/details', (req, res) => {
  res.json(req.chainData.avax.circulatingSupply)
})

module.exports = app