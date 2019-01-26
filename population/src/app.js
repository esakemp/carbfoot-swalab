const express = require('express')
const { getPopulationData } = require('./fetcher')

const port = 8000
const app = express()

app.get('/populations', async (req, res) => {
    const populations = await getPopulationData()
    res.json(populations)
})

app.listen(port, () => console.log(`Population service listening on port ${port}!`))
