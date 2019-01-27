const { getPopulationData } = require('./fetcher')
const { upsertPopulation } = require('./db')

const formatRecord = record => {
    const { 'Country Name': name, 'Country Code': code, ...rest } = record
    const populations = Object.entries(rest)
        .filter(([key]) => !isNaN(key))
        .reduce((acc, [k, v]) => ({...acc, [k]: v}), {})
    return { _id: code, name, code, populations }
}

const updatePopulations = async () => {
    const records = await getPopulationData()
    for (let record of records) {
        const population = formatRecord(record)
        await upsertPopulation(population)
    }
}

module.exports = {
    updatePopulations
}