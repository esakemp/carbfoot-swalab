const express = require('express')
const morgan = require('morgan')
const bodyparser = require('body-parser')
const cors = require('cors')
const countries = require('i18n-iso-countries')
const {
  upsertAllCountryStats,
  findCountry,
  findCountries,
  getTop10,
  getTop10All
} = require('./country')
const { ALL_COUNTRYSTATS_UPDATED } = require('./events')
const publisher = require('./publisher')
const { dbconnect } = require('./db')
const { PORT } = require('./conf')
const { materializeTop10Stats } = require('./handlers')

publisher.subscribe(ALL_COUNTRYSTATS_UPDATED, materializeTop10Stats)

const app = express()

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
  publisher.publish(ALL_COUNTRYSTATS_UPDATED)
  res.status(201).send()
})

app.get('/countrystats/:id', async (req, res) => {
  const statistic = await findCountry(req.params.id)
  res.json(statistic)
})

app.get('/top-10-emissions', async (req, res) => {
  const stats = await getTop10All()
  res.json(stats)
})

app.get('/top-10-emissions/:year', async (req, res) => {
  const top10 = await getTop10(req.params.year)
  res.json(top10)
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
