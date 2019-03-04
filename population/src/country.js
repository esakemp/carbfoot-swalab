const { Country, Statistics, Top10 } = require('./models')

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

const findCountry = async code => {
  const country = await Country.findOne({ code })
    .populate({
      path: 'stats',
      options: {
        sort: { year : -1 }
      }
    }).exec()
  return country
}

const findCountries = async () => Country.find().exec()

const upsertAllCountryStats = async countries => {
  for (let { code, name, stats } of countries) {
    await upsertCountryStats(code, name, stats)
  }
}

const findAllYears = async () => Statistics.find().distinct('year').exec()

const addToTopTen = (top10 = [], id, value) => {
  const entry = { id, value }
  const split = top10.findIndex(elem => elem.value < value)
  console.log(top10, split, value)
  if (top10.length === 0) {
    return [entry]
  } else if (split === -1 && top10.length < 10) {
    return top10.concat(entry)
  } else if (split === -1 && top10.length == 10) {
    return top10
  } else {
    return [ ...top10.slice(0, split), entry, ...top10.slice(split, 9)]
  }
}

const getFormattedStats = async ids => {
  const stats = await Statistics.find({ _id: { $in: ids } }).populate('country').exec()
  return stats.map(({ emissions, population, perCapita, country }) => {
    const { code, name } = country
    return { emissions, perCapita, population, code, name }
  })
}

const top10Emissions = async statistics => {
  const ids = statistics
    .filter(({ emissions }) => !!emissions)
    .reduce((acc, { _id, emissions }) => addToTopTen(acc, _id, emissions), [])
    .map(({ id }) => id)
  const formatted = await getFormattedStats(ids)
  return formatted
}

const top10PerCapita = async statistics => {
  const ids = statistics
    .filter(({ perCapita }) => !!perCapita)
    .reduce((acc, { _id, perCapita }) => addToTopTen(acc, _id, perCapita), [])
    .map(({ id }) => id)
  const formatted = await getFormattedStats(ids)
  return formatted
}

const upsertTop10 = async (year, emissions=[], perCapita=[]) => {
  if (emissions.length > 0) {
    await Top10.findOneAndUpdate({ year }, { year, emissions, perCapita }, { upsert: true })
  }
}

const getTop10 = async year => Top10.findOne({ year }).exec()

const updateTop10StatsForYear = async year => {
  const stats = await Statistics.find({ year }).exec()
  const promises = [top10Emissions(stats), top10PerCapita(stats)]
  const [ emissions, perCapita ] = await Promise.all(promises)
  await upsertTop10(year, emissions, perCapita)
}

const updateTop10Stats = async () => {
  const years = await findAllYears()
  await Promise.all(years.map(year => updateTop10StatsForYear(year)))
}

const getTop10All = async () => Top10.find({}).select({
  'year': 1,
  '_id': 0
}).exec()

module.exports = {
  upsertCountry,
  upsertCountryStats,
  findCountry,
  findCountries,
  upsertAllCountryStats,
  findAllYears,
  updateTop10Stats,
  getTop10,
  getTop10All,
  __private__: {
    addToTopTen
  }
}
