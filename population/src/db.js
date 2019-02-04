const mongoose = require('mongoose')
const { MONGOURL } = require('./conf')

const dbconnect = () => new Promise(async (resolve, reject) => {
    try {
        await mongoose.connect(MONGOURL)
        console.log('Connected to Mongo')
        resolve()
    } catch (error) {
        console.error('Error connecting to Mongo', err)
        reject(error)
    }
})

const populationSchema = new mongoose.Schema({
    code: String,
    name: String,
    stats: {
        type: Map,
        of: String
    }
})

const Population = mongoose.model('Population', populationSchema)

const getPopulations = async () => {
    const populations = await Population.find()
    return populations
}

const upsertPopulation = async (population) => {
    await Population.findOneAndUpdate({ code: population.code }, population, { upsert: true })
}

module.exports = { dbconnect, getPopulations, upsertPopulation }