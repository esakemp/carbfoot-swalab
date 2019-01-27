const express = require('express')
const { getPopulations } = require('./db')
const { PORT } = require('./conf')

const app = express()

app.get('/populations', async (req, res) => {
    const populations = await getPopulations()
    res.json(populations)
})

app.get('*', async(req, res) => {
    res.status(404).send()
})

const start = () => {
    app.listen(PORT, () => console.log(`Population service listening on port ${PORT}!`))
}

module.exports = { start }