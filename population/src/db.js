const MongoClient = require('mongodb').MongoClient

const MONGOURL = 'mongodb://population-db:27017'

let mongodb

const collection = () => mongodb.collection('Population')

const dbconnect = async () => {
    const client = await MongoClient.connect(MONGOURL)
    mongodb = client.db('population')
}

const getPopulations = async () => {
    const cursor = await collection().find({}).toArray()
    return cursor
}

const upsertPopulation = async (population) => {
    await collection().updateOne({ _id: population._id }, { $set: population }, { upsert: true })
}

module.exports = { dbconnect, getPopulations, upsertPopulation }