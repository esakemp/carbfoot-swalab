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
    toJSON: {
      virtuals: true,
      transform: function(doc, ret, options) {
        const { year, emissions = null, population = null, perCapita } = ret
        return { year, emissions, population, perCapita }
      }
    }
  }
)

StatisticsSchema.virtual('perCapita').get(function() {
  const perCapita = this.emissions / this.population
  return Number.isNaN(perCapita) ? null : perCapita
})

const CountrySchema = new mongoose.Schema({
    code: String,
    name: String
  }, {
    toObject: { virtuals: true },
    toJSON: {
      virtuals: true,
      transform: function(doc, ret, options) {
        const { code, name } = ret
        return { code, name }
      }
    }
  }
)

CountrySchema.virtual('stats', {
  ref: 'Statistics',
  localField: '_id',
  foreignField: 'country'
})

const Top10Schema = new mongoose.Schema({
  year: String,
  perCapita: [{
    emissions: Number,
    perCapita: Number,
    population: Number,
    code: String,
    name: String
  }],
  emissions: [{
    emissions: Number,
    perCapita: Number,
    population: Number,
    code: String,
    name: String
  }]
})

const Statistics = mongoose.model('Statistics', StatisticsSchema, 'Statistics')
const Country = mongoose.model('Country', CountrySchema, 'Country')
const Top10 = mongoose.model('Top10', Top10Schema, 'Top10')

module.exports = { Statistics, Country, Top10 }
