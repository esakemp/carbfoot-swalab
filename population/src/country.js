const { mongoose } = require('./db')

const StatisticsSchema = new mongoose.Schema({
  year: String,
  population: Number,
  emissions: Number
})

StatisticsSchema.virtual('perCapita').get(function () {
  return this.emissions / this.population
})

StatisticsSchema.set('toJSON', { virtuals: true })

const countrySchema = new mongoose.Schema({
  code: String,
  name: String,
  stats: [StatisticsSchema]
})

const Country = mongoose.model('Country', countrySchema)

const upsertCountry = async (code, name) => {
  await Country.findOneAndUpdate({ code }, { code, name }, { upsert: true })
}

const findCountry = async code => {
  return Country.findOne({ code }).exec()
}

const upsertCountryStatistic = async (code, statistic) => {
  const { year, emissions, population } = statistic
  const created = await Country.findOneAndUpdate({
    code,
    'stats.year': { $ne: year }
  }, {
    $push: {
      stats: {
        year,
        ...(emissions && { emissions }),
        ...(population && { population })
      }
    } 
  })
  if (!created) {
    await Country.findOneAndUpdate({
      code,
      'stats.year': year
    }, {
      $set: {
        ...(emissions && { 'stats.$.emissions' : emissions }),
        ...(population && { 'stats.$.population': population })
      }
    })
  }
}

const upsertCountryStats = async (code, name, stats) => {
  await upsertCountry(code, name)
  await Promise.all(stats.map(statistic => upsertCountryStatistic(code, statistic)))
}

module.exports = {
  Country,
  upsertCountry,
  findCountry,
  upsertCountryStatistic,
  upsertCountryStats
}
