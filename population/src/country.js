const { mongoose } = require('./db')
const { ObjectId } = mongoose.Schema.Types

const StatisticsSchema = new mongoose.Schema({
  year: String,
  population: Number,
  emissions: Number,
  country: {
    type: ObjectId,
    ref: 'Country'
  }
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
})

StatisticsSchema.virtual('perCapita').get(function () {
  return this.emissions / this.population
})

const CountrySchema = new mongoose.Schema({
  code: String,
  name: String
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
})

CountrySchema.virtual('stats', {
  ref: 'Statistics',
  localField: '_id',
  foreignField: 'country'
})

const Statistics = mongoose.model('Statistics', StatisticsSchema, 'Statistics')
const Country = mongoose.model('Country', CountrySchema, 'Country')

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

const findCountry = async code =>  Country.findOne({ code }).populate('stats').exec()

const findCountries = async () =>  Country.find().exec()

module.exports = {
  Country,
  Statistics,
  upsertCountry,
  upsertCountryStats,
  findCountry,
  findCountries
}
