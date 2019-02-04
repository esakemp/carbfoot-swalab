const express = require('express')
const bodyparser = require('body-parser')
const { getPopulations, upsertPopulation } = require('./db')
const { dbconnect } = require('./db')
const { PORT } = require('./conf')

const app = express()

app.use(bodyparser.json({ limit: '50mb', extended: true }))

app.get('/populations', async (req, res) => {
    const populations = await getPopulations()
    res.json(populations)
})

app.post('/populations', async (req, res) => {
    for (let population of req.body) {
        await upsertPopulation(population)
    }
    res.status(201).send()
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