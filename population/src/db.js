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
        of: Number
    }
})

const emissionSchema = new mongoose.Schema({
    code: String,
    name: String,
    stats: {
        type: Map,
        of: Number
    }
})

const YearlyStatisticSchema = new mongoose.Schema({
    year: String,
    population: Number,
    emissions: Number
})

YearlyStatisticSchema.virtual('normalized').get(function () {
    return (this.emissions / this.population)
})

YearlyStatisticSchema.set('toJSON', { virtuals: true })
YearlyStatisticSchema.set('toObject', { virtuals: true })

const countryStatisticsSchema = new mongoose.Schema({
    code: String,
    name: String,
    stats: {
        type: Map,
        of: YearlyStatisticSchema,
        default: new Map()
    }
})

const Population = mongoose.model('Population', populationSchema)

const Emission = mongoose.model('Emission', emissionSchema)

const CountryStatistics = mongoose.model('CountryStatistics', countryStatisticsSchema)

const getPopulations = async () => Population.find()

const upsertPopulation = async (population) => {
    return Population.findOneAndUpdate({ code: population.code }, population, { upsert: true, new: true })
}

const getEmissions = async () => Emission.find()

const upsertEmission = async (emission) => {
    return Emission.findOneAndUpdate({ code: emission.code }, emission, { upsert: true, new: true })
}

const getCountryStatistics = async () => CountryStatistics.find()

const getCountryStatistic = async code => CountryStatistics.findOne({ code })

const upsertCountryStatistics = async (data) => {
    const { stats, ...rest } = data
    const countrystats = await CountryStatistics.findOneAndUpdate({ code: data.code }, rest, { upsert: true, new: true, setDefaultsOnInsert: true })
    stats.forEach(({ year, ...updates }) => {
        const yearstats = countrystats.stats.get(year)
        const old = !yearstats ? {} : yearstats.toObject()
        const stat = { ...old, ...updates }
        countrystats.stats.set(year, stat)
    })
    return countrystats.save()
}

module.exports = {
    dbconnect,
    getPopulations,
    upsertPopulation,
    getEmissions,
    upsertEmission,
    getCountryStatistic,
    getCountryStatistics,
    upsertCountryStatistics
}