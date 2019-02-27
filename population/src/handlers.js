const publisher = require('./publisher')

const {
  COUNTRYSTATS_UPDATED,
  TOP_EMISSIONS_UPDATED,
  TOP_PER_CAPITA_UPDATED,
} = require('./events')

module.exports = {
  updateCountryStatsFromEmission,
  updateCountryStatsFromPopulation,
  updateTopEmissionsFromCountryStats,
}
