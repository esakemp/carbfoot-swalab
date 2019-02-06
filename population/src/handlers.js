const publisher = require('./publisher')
const { upsertCountryStatistics } = require('./db')
const { COUNTRYSTATS_UPDATED } = require('./events')

const updateCountryStatsFromEmission = async emission => {
    const { code, name } = emission
    const stats = Array.from(emission.stats.entries())
        .map(([year, emissions]) => ({ year, emissions }))
        .filter(stat => !!stat.emissions)
    const payload = await upsertCountryStatistics({ code, name, stats })
    publisher.publish(COUNTRYSTATS_UPDATED, payload)
}

const updateCountryStatsFromPopulation = async population => {
    const { code, name } = population
    const stats = Array.from(population.stats.entries())
        .map(([year, population]) => ({ year, population }))
        .filter(stat => !!stat.population)
    const payload = await upsertCountryStatistics({ code, name, stats })
    publisher.publish(COUNTRYSTATS_UPDATED, payload)
}

module.exports = { updateCountryStatsFromEmission, updateCountryStatsFromPopulation }
