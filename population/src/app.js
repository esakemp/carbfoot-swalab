const express = require('express')
const morgan = require('morgan')
const bodyparser = require('body-parser')
const publisher = require('./publisher')
const cors = require('cors')
const { POPULATION_UPDATED, EMISSION_UPDATED, COUNTRYSTATS_UPDATED } = require('./events')
const { getPopulations, upsertPopulation,  } = require('./population')
const { getEmissions, upsertEmission } = require('./emissions') 
const { getAllCountryStatistics, getCountryStatistic } = require('./countrystats')
const { updateCountryStatsFromEmission, updateCountryStatsFromPopulation, updateTopEmissionsFromCountryStats } = require('./handlers')
const topten = require('./top10')
const { dbconnect } = require('./db')
const { PORT } = require('./conf')

const app = express()

publisher.subscribe(EMISSION_UPDATED, updateCountryStatsFromEmission)
publisher.subscribe(POPULATION_UPDATED, updateCountryStatsFromPopulation)
publisher.subscribe(COUNTRYSTATS_UPDATED, updateTopEmissionsFromCountryStats)

app.use(morgan('combined'))
app.use(bodyparser.json({ limit: '50mb', extended: true }))
app.use(cors())

app.get('/populations', async (req, res) => {
    const populations = await getPopulations()
    res.json(populations)
})

app.post('/populations', async (req, res) => {
    for (let population of req.body) {
        const updated = await upsertPopulation(population)
        publisher.publish(POPULATION_UPDATED, updated)
    }
    res.status(201).send()
})

app.get('/emissions', async (req, res) => {
    const emissions = await getEmissions()
    res.json(emissions)
})

app.post('/emissions', async (req, res) => {
    for (let emission of req.body) {
        const updated = await upsertEmission(emission)
        publisher.publish(EMISSION_UPDATED, updated)
    }
    res.status(201).send()
})

app.get('/countrystats', async (req, res) => {
    const statistics = await getAllCountryStatistics()
    res.json(statistics)
})

app.get('/countrystats/:id', async (req, res) => {
    const statistic = await getCountryStatistic(req.params.id)
    res.json(statistic)
})

app.get('/top-10-emissions/:year', async (req, res) => {
    const { year } = req.params
    const results = await topten.getTopTenEmissions(year)
    res.json(results)
})

app.get('/top-10-emissions-per-capita/:year', async (req, res) => {
    const { year } = req.params
    const results = await topten.getTopTenEmissionsPerCapita(year)
    res.json(results)
})

app.get('*', async(req, res) => {
    res.status(404).send()
})

const start = async () => {
    try {
        await dbconnect()
        app.listen(PORT, () => console.log(`Population service listening on port ${PORT}!`))
    } catch (e) {
        throw(e)
    }
}

module.exports = { start }