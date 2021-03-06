const parse = require('csv-parser')
const { fetchDataStream } = require('./fetcher')
const { publishPopulations, publishEmissions } = require('./publisher')
const {
  POP_API_URL,
  POP_CSV_PREFIX,
  CO_API_URL,
  CO_CSV_PREFIX,
} = require('./conf')

const recordsFromCsvStream = (stream, fieldname) =>
  new Promise(resolve => {
    const records = []
    stream
      .pipe(parse({ skipLines: 4 }))
      .on('data', data => {
        const { 'Country Name': name, 'Country Code': code, ...rest } = data
        const stats = Object.entries(rest)
          .filter(([key]) => !isNaN(key))
          .reduce((acc, [year, value]) => acc.concat({ year, [fieldname]: value }), [])
        records.push({ code, name, stats })
      })
      .on('end', () => resolve(records))
  })

const updatePopulations = async () => {
  try {
    const stream = await fetchDataStream(POP_API_URL, POP_CSV_PREFIX)
    const records = await recordsFromCsvStream(stream, 'population')
    await publishPopulations(records)
  } catch (e) {
    console.error('Updating populations failed')
  }
}

const updateCo2 = async () => {
  try {
    const stream = await fetchDataStream(CO_API_URL, CO_CSV_PREFIX)
    const records = await recordsFromCsvStream(stream, 'emissions')
    await publishEmissions(records)
  } catch (e) {
    console.error('Updating emissions failed')
  }
}

module.exports = {
  updatePopulations,
  updateCo2,
}
