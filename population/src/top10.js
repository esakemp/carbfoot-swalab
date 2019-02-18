const redis = require('./redis')
const { getYearlyStatisticsForCodes } = require('./countrystats')

const saveTopEmissions = async (code, year, emissions) => {
  const updated = await redis.emissions(year).addScore(code, emissions)
  if (!updated) {
    return false
  }
  const isTop10 = await redis.emissions(year).isTop10(code)
  return isTop10
}

const saveTopEmissionsPerCapita = async (code, year, emissions) => {
  const updated = await redis.emissionsPerCapita(year).addScore(code, emissions)
  if (!updated) {
    return false
  }
  const isTop10 = await redis.emissionsPerCapita(year).isTop10(code)
  return isTop10
}

const getTopTenEmissions = async year => {
  const codes = await redis.emissions(year).getTop10()
  const result = await getYearlyStatisticsForCodes(codes, year)
  return result.sort((r1, r2) => r2.emissions - r1.emissions)
}

const getTopTenEmissionsPerCapita = async year => {
  const codes = await redis.emissionsPerCapita(year).getTop10()
  const result = await getYearlyStatisticsForCodes(codes, year)
  return result.sort((r1, r2) => r2.normalized - r1.normalized)
}

module.exports = {
  saveTopEmissions,
  saveTopEmissionsPerCapita,
  getTopTenEmissions,
  getTopTenEmissionsPerCapita
}
