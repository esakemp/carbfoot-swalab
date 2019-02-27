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
  return this.emissions / this.population
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

const Statistics = mongoose.model('Statistics', StatisticsSchema, 'Statistics')
const Country = mongoose.model('Country', CountrySchema, 'Country')

module.exports = { Statistics, Country }
