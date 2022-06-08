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
        
        // console.log(`Deleted: YETI Data ${deleteResult.deletedCount}`)
        await collection.insertOne(newChainData)
        console.log("Inserted new YETI Data entries")
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
        
        // console.log(`Deleted: YUSD Data ${deleteResult.deletedCount}`)
        await collection.insertOne(newChainData)
        console.log("Inserted new YUSD Data entries")
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
        
        // console.log(`Deleted: Farm Pool Data ${deleteResult.deletedCount}`)
        await collection.insertOne(newChainData)
        console.log("Inserted new Farm Pool Data entries")
    } 
    catch(err) {
        console.log(err)
    }
}

updateCollateralsData = async (chainData, client) => {
    try {
        const database = client.db('YetiFinance')
        const collection = database.collection('Collaterals')
        chainData.timestamp = Date.now()
        let newChainData = Object.assign({}, chainData)
        newChainData._id = ObjectId()
        
        // console.log(`Deleted: Collaterals Data ${deleteResult.deletedCount}`)
        await collection.insertOne(newChainData)
        console.log("Inserted new Collaterals Data entries")
    } 
    catch(err) {
        console.log(err)
    }
}

updatePLPPoolData = async (chainData, client) => {
    try {
        const database = client.db('YetiFinance')
        const collection = database.collection('PLPPool')
        chainData.timestamp = Date.now()
        let newChainData = Object.assign({}, chainData)
        newChainData._id = ObjectId()
        
        // console.log(`Deleted: PLP Pool Data ${deleteResult.deletedCount}`)
        await collection.insertOne(newChainData)
        console.log("Inserted new PLP Pool Data entries")
    } 
    catch(err) {
        console.log(err)
    }
}

updateCurvePoolData = async (chainData, client) => {
    try {
        const database = client.db('YetiFinance')
        const collection = database.collection('CurvePool')
        chainData.timestamp = Date.now()
        let newChainData = Object.assign({}, chainData)
        newChainData._id = ObjectId()
        await collection.insertOne(newChainData)
        console.log("Inserted new Curve Pool entries")
    } 
    catch(err) {
        console.log(err)
    }
}

updateBoostData = async (chainData, client) => {
    try {
        const database = client.db('YetiFinance')
        const collection = database.collection('Boost')
        chainData.timestamp = Date.now()
        let newChainData = Object.assign({}, chainData)
        newChainData._id = ObjectId()
        
        // console.log(`Deleted: new Boost ${deleteResult.deletedCount}`)
        await collection.insertOne(newChainData)
        console.log("Inserted new Boost entries")
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

getCachedCollateralsData = async (client) => {
    try {
        const database = client.db('YetiFinance')
        const collection = database.collection('Collaterals')
        cachedData = await collection.find().sort({ _id: -1 }).limit(1).toArray()
        cachedData = cachedData[0]
        return cachedData    
    } 
    catch(err) {
        console.log(err)
    }
}

getCachedPLPPoolData = async (client) => {
    try {
        const database = client.db('YetiFinance')
        const collection = database.collection('PLPPool')
        cachedData = await collection.find().sort({ _id: -1 }).limit(1).toArray()
        cachedData = cachedData[0]
        return cachedData    
    } 
    catch(err) {
        console.log(err)
    }
}

getCachedCurvePoolData = async (client) => {
    try {
        const database = client.db('YetiFinance')
        const collection = database.collection('CurvePool')
        cachedData = await collection.find().sort({ _id: -1 }).limit(1).toArray()
        cachedData = cachedData[0]
        return cachedData    
    } 
    catch(err) {
        console.log(err)
    }
}

getCachedBoostData = async (client) => {
    try {
        const database = client.db('YetiFinance')
        const collection = database.collection('Boost')
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
    getCachedFarmPoolData,
    updateCollateralsData,
    getCachedCollateralsData,
    updatePLPPoolData,
    getCachedPLPPoolData,
    updateCurvePoolData,
    getCachedCurvePoolData,
    updateBoostData,
    getCachedBoostData
}

