const { Country, Statistics } = require('./models')

const upsertCountry = async (code, name) => {
  return Country.findOneAndUpdate({ code }, { code, name }, { upsert: true, new: true })
}

const upsertStatistic = async (country, statistic) => {
  const { year, ...rest } = statistic
  await Statistics.findOneAndUpdate({ country, year }, { country, year, ...rest }, { upsert: true })
}

const upsertCountryStats = async (code, name, stats) => {
  const { _id: country } = await upsertCountry(code, name)
  const promises = stats.map(statistic => upsertStatistic(country, statistic))
  await Promise.all(promises)
}

const findCountry = async code =>  Country
  .findOne({ code })
  .populate({
    path: 'stats',
    options: {
      sort: { year : -1 }
    }
  }).exec()

const findCountries = async () =>  Country.find().exec()

const upsertAllCountryStats = async countries => {
  for (let { code, name, stats } of countries) {
    await upsertCountryStats(code, name, stats)
  }
}

module.exports = {
  upsertCountry,
  upsertCountryStats,
  findCountry,
  findCountries,
  upsertAllCountryStats
}
