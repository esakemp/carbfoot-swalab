const parse = require('csv-parser')
const { fetchDataStream } = require('./fetcher')
const { POP_API_URL, POP_CSV_PREFIX, CO_API_URL, CO_CSV_PREFIX } = require('./conf')

const recordsFromCsvStream = (stream) => new Promise((resolve) => {
    const records = []
    stream
        .pipe(parse({ skipLines: 4 }))
        .on('data', data => {
            const { 'Country Name': name, 'Country Code': code, ...rest } = data
            const stats = Object.entries(rest)
                .filter(([key]) => !isNaN(key))
                .reduce((acc, [k, v]) => ({...acc, [k]: v}), {})
            records.push({ code, name, stats })
        })
        .on('end', () => resolve(records))
})

const updatePopulations = async () => {
    const stream = await fetchDataStream(POP_API_URL, POP_CSV_PREFIX)
    await recordsFromCsvStream(stream)
}

const updateCo2 = async () => {
    const stream = await fetchDataStream(CO_API_URL, CO_CSV_PREFIX)
    await recordsFromCsvStream(stream)
}

module.exports = {
    updatePopulations,
    updateCo2
}