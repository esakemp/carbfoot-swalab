const publisher = require('./publisher')
const topten = require('./top10')
const { upsertCountryStatistics } = require('./countrystats')
const {
  COUNTRYSTATS_UPDATED,
  TOP_EMISSIONS_UPDATED,
  TOP_PER_CAPITA_UPDATED,
} = require('./events')

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

const updateTopEmissionsFromCountryStats = async countrystat => {
  const { code, stats } = countrystat
  for (let [key, value] of [...stats.entries()]) {
    const year = Number.parseInt(key)
    if (year >= 2000) {
      const { emissions, normalized } = value
      const emissionsUpdated = await topten.saveTopEmissions(
        code,
        year,
        emissions
      )
      const capitaUpdated = await topten.saveTopEmissionsPerCapita(
        code,
        year,
        normalized
      )
      emissionsUpdated && publisher.publish(TOP_EMISSIONS_UPDATED, year)
      capitaUpdated && publisher.publish(TOP_PER_CAPITA_UPDATED)
    }
  }
}

module.exports = {
  updateCountryStatsFromEmission,
  updateCountryStatsFromPopulation,
  updateTopEmissionsFromCountryStats,
}
