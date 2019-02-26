const express = require('express')
const morgan = require('morgan')
const bodyparser = require('body-parser')
const publisher = require('./publisher')
const cors = require('cors')
const countries = require('i18n-iso-countries')

const {
  POPULATION_UPDATED,
  EMISSION_UPDATED,
  COUNTRYSTATS_UPDATED,
} = require('./events')
const {
  updateCountryStatsFromEmission,
  updateCountryStatsFromPopulation,
  updateTopEmissionsFromCountryStats,
} = require('./handlers')
const topten = require('./top10')
const {
  upsertAllCountryStats,
  findCountry,
  findCountries
} = require('./country')
const { dbconnect } = require('./db')
const { PORT } = require('./conf')

const app = express()

publisher.subscribe(EMISSION_UPDATED, updateCountryStatsFromEmission)
publisher.subscribe(POPULATION_UPDATED, updateCountryStatsFromPopulation)
publisher.subscribe(COUNTRYSTATS_UPDATED, updateTopEmissionsFromCountryStats)

app.use(morgan('combined'))
app.use(bodyparser.json({ limit: '50mb', extended: true }))
app.use(cors())

app.get('/countrystats', async (req, res) => {
  const statistics = await findCountries()
  res.json(statistics)
})

app.post('/countrystats', async (req, res) => {
  const stats = req.body.filter(({ code }) => countries.isValid(code))
  await upsertAllCountryStats(stats)
  res.status(201).send()
})

app.get('/countrystats/:id', async (req, res) => {
  const statistic = await findCountry(req.params.id)
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

app.get('*', async (req, res) => {
  res.status(404).send()
})

const start = async () => {
  try {
    await dbconnect()
    app.listen(PORT, () =>
      console.log(`Population service listening on port ${PORT}!`)
    )
  } catch (e) {
    throw e
  }
}

module.exports = { start }
