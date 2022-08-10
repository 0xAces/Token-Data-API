const express = require('express')
const app = express.Router()
 

app.get('/:address', (req, res) => {
  res.json(req.chainData)
})

module.exports = app