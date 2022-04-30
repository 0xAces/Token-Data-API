const { ObjectId } = require('mongodb')
const MongoClient = require('mongodb').MongoClient


const initializeClient = () => {
    try {
        const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@yeti.pukmx.mongodb.net/YetiFinance?retryWrites=true&w=majority`
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  })
        client.connect()
        const getClient = () => client
        return {client, getClient}
    }
    catch(err) {
        console.log(err)
    }
}

const { client, getClient } = initializeClient()

 
updateYETIData = async (chainData, client) => {
    try {
        const database = client.db('YetiFinance')
        const collection = database.collection('YETI')
        chainData.timestamp = Date.now()
        let newChainData = Object.assign({}, chainData)
        newChainData._id = ObjectId()
        let deleteResult = await collection.deleteMany( { timestamp : {"$lt" : Date.now() - 60 * 1000 }}) 
        console.log(`Deleted: ${deleteResult.deletedCount}`)
        await collection.insertOne(newChainData)
        console.log("Inserted new entries")
    } 
    catch(err) {
        console.log(err)
    }
}


updateYUSDData = async (chainData, client) => {
    try {
        const database = client.db('YetiFinance')
        const collection = database.collection('YUSD')
        chainData.timestamp = Date.now()
        let newChainData = Object.assign({}, chainData)
        newChainData._id = ObjectId()
        let deleteResult = await collection.deleteMany( { timestamp : {"$lt" : Date.now() - 60 * 1000 }}) 
        console.log(`Deleted: ${deleteResult.deletedCount}`)
        await collection.insertOne(newChainData)
        console.log("Inserted new entries")
    } 
    catch(err) {
        console.log(err)
    }
}

updateFarmPoolData = async (chainData, client) => {
    try {
        const database = client.db('YetiFinance')
        const collection = database.collection('FarmPool')
        chainData.timestamp = Date.now()
        let newChainData = Object.assign({}, chainData)
        newChainData._id = ObjectId()
        let deleteResult = await collection.deleteMany( { timestamp : {"$lt" : Date.now() - 60 * 1000 }}) 
        console.log(`Deleted: ${deleteResult.deletedCount}`)
        await collection.insertOne(newChainData)
        console.log("Inserted new entries")
    } 
    catch(err) {
        console.log(err)
    }
}

getCachedYETIData = async (client) => {
    try {
        const database = client.db('YetiFinance')
        const collection = database.collection('YETI')
        cachedData = await collection.find().sort({ _id: -1 }).limit(1).toArray()
        cachedData = cachedData[0]
        return cachedData    
    } 
    catch(err) {
        console.log(err)
    }
}


getCachedYUSDData = async (client) => {
    try {
        const database = client.db('YetiFinance')
        const collection = database.collection('YUSD')
        cachedData = await collection.find().sort({ _id: -1 }).limit(1).toArray()
        cachedData = cachedData[0]
        return cachedData    
    } 
    catch(err) {
        console.log(err)
    }
}

getCachedFarmPoolData = async (client) => {
    try {
        const database = client.db('YetiFinance')
        const collection = database.collection('FarmPool')
        cachedData = await collection.find().sort({ _id: -1 }).limit(1).toArray()
        cachedData = cachedData[0]
        return cachedData    
    } 
    catch(err) {
        console.log(err)
    }
}


module.exports = {
    getClient,
    updateYETIData,
    getCachedYETIData,
    updateYUSDData,
    getCachedYUSDData,
    updateFarmPoolData,
    getCachedFarmPoolData
}

