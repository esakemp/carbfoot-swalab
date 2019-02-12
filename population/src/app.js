const express = require('express')
const morgan = require('morgan')
const bodyparser = require('body-parser')
const publisher = require('./publisher')
const cors = require('cors')
const { POPULATION_UPDATED, EMISSION_UPDATED } = require('./events')
const { getPopulations, upsertPopulation, getEmissions, upsertEmission, getCountryStatistics, getCountryStatistic } = require('./db')
const { updateCountryStatsFromEmission, updateCountryStatsFromPopulation } = require('./handlers')
const { dbconnect } = require('./db')
const { PORT } = require('./conf')

const app = express()

publisher.subscribe(EMISSION_UPDATED, updateCountryStatsFromEmission)
publisher.subscribe(POPULATION_UPDATED, updateCountryStatsFromPopulation)

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
    const statistics = await getCountryStatistics()
    res.json(statistics)
})

app.get('/countrystats/:id', async (req, res) => {
    const statistic = await getCountryStatistic(req.params.id)
    res.json(statistic)
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