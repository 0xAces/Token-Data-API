require("dotenv").config()
const express = require('express')
const rateLimit = require("express-rate-limit");
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./utils/db')

const YETIRoutes = require('./routes/YETI')
const YUSDRoutes = require('./routes/YUSD')
const FarmPoolRoutes = require("./routes/FarmPool")
const CollateralsRoutes = require("./routes/Collaterals")
const PLPPoolRoutes = require("./routes/PLPPool")
const CurvePoolRoutes = require("./routes/CurvePool")
const BoostRoutes = require("./routes/Boost")
const VaultRoutes = require("./routes/Vault")
const getChainData = require("./utils/getChainData")
const SortedTrovesRoutes = require("./routes/SortedTroves")
const YetiControllerRoutes = require("./routes/YetiController")
const sleep = require("ko-sleep");
const removeTrailingSlash = require('./middleware/removeTrailingSlash');


const PORT = process.env.PORT || 3001

// Call getChainData here to begin chain data update loop and start caching new data to database
getChainData.getChainData()

const app = express()

// Limit request rate
const limiter = rateLimit({
  windowMs: 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 100 requests per windowMs
});
 
//  apply to all requests
app.use(cors({origin: ['http://localhost:3000', 'https://app.yeti.finance'], methods: ["GET"]}))
app.use(bodyParser.text())


// limit requests
app.use(limiter);

// remove trailing slash
app.use(removeTrailingSlash);


// Logging
app.use(morgan('tiny'))

// Remove trailing slash

// app.all('*', (req, res, next) => {
//   res.header("Access-Control-Allow-Origin", 'https://app.yeti.finance');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Allow-Methods', 'GET');
//   next();
// });

// Routes
app.use(/^\/$/, (req, res, next) => {
  res.send("Welcome to the YetiFinance API!")
  next()
})



// add cached data to req
app.get('/v1/YUSD', async (req, res, next) => {

  const client = db.getClient()
  try {
    await db.getCachedYUSDData(client).then(result => req.chainData = result)
  }
  catch(err){
    console.log("error getting data")
    console.log(err)
  }
  next()
})

// add cached data to req
app.get('/v1/YETI', async (req, res, next) => {
  
  const client = db.getClient()
  try {
    await db.getCachedYETIData(client).then(result => req.chainData = result)
  }
  catch(err){
    console.log("error getting data")
    console.log(err)
  }
  next()
})

app.use('/v1/FarmPool', async (req, res, next) => {
  
  const client = db.getClient()
  try {
    await db.getCachedFarmPoolData(client).then(result => req.chainData = result)
  }
  catch(err){
    console.log("error getting data")
    console.log(err)
  }
  next()
})

app.get('/v1/PLPPool', async (req, res, next) => {
  
  const client = db.getClient()
  try {
    await db.getCachedPLPPoolData(client).then(result => req.chainData = result)
  }
  catch(err){
    console.log("error getting data")
    console.log(err)
  }
  next()
})

app.get('/v1/CurvePool', async (req, res, next) => {
  
  const client = db.getClient()
  try {
    await db.getCachedCurvePoolData(client).then(result => req.chainData = result)
  }
  catch(err){
    console.log("error getting data")
    console.log(err)
  }
  next()
})

app.get('/v1/Collaterals', async (req, res, next) => {
  
  const client = db.getClient()
  try {
    await db.getCachedCollateralsData(client).then(result => req.chainData = result)
  }
  catch(err){
    console.log("error getting data")
    console.log(err)
  }
  next()
})

app.get('/v1/Boost', async (req, res, next) => {
  
  const client = db.getClient()
  try {
    await db.getCachedBoostData(client).then(result => req.chainData = result)
  }
  catch(err){
    console.log("error getting data")
    console.log(err)
  }
  next()
})

app.get('/v1/Vault/:blockNum', async (req, res, next) => {
  const client = db.getClient()
  const database = client.db('YetiFinance')
  const collection = database.collection('Vault')
  cachedData = await collection.find({ "blockNum" : req.params['blockNum']}).sort({ _id: -1 }).limit(1).toArray()
  if (cachedData.length == 0) {
    await getChainData.getPastData('Vault', req.params).then(result => req.chainData = result)
  } else {
    req.chainData = cachedData[0]
  }
  next()
})

app.get('/v1/SortedTroves', async (req, res, next) => {
  
  const client = db.getClient()
  try {
    await db.getCachedSortedTrovesData(client).then(result => req.chainData = result)
  }
  catch(err){
    console.log("error getting data")
    console.log(err)
  }
  next()
})

app.get('/v1/YetiController', async (req, res, next) => {
  
  const client = db.getClient()
  try {
    await db.getCachedYetiControllerData(client).then(result => req.chainData = result)
  }
  catch(err){
    console.log("error getting data")
    console.log(err)
  }
  next()
})

app.use('/v1/YETI', YETIRoutes)
app.use('/v1/YUSD', YUSDRoutes)
app.use('/v1/FarmPool', FarmPoolRoutes)
app.use('/v1/Collaterals', CollateralsRoutes)
app.use('/v1/PLPPool', PLPPoolRoutes)
app.use('/v1/CurvePool', CurvePoolRoutes)
app.use('/v1/Boost', BoostRoutes)
app.use('/v1/Vault', VaultRoutes)
app.use('/v1/Sortedtroves', SortedTrovesRoutes)
app.use('/v1/YetiController', YetiControllerRoutes)

// app.use("\/\/*", (req, res, next) => {
//   console.log("catch")
//   res.redirect("/")
//   next();
// });



app.use((req, res) => {
  // console.log(req)
  res.status(404).json({error: true, message: "Resource not found"})
})

app.listen(PORT)

console.log(`App listening on ${PORT}`)