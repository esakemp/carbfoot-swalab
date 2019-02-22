const { mongoose } = require('./db')

const populationSchema = new mongoose.Schema({
  code: String,
  name: String,
  stats: {
    type: Map,
    of: Number,
  },
})

const Population = mongoose.model('Population', populationSchema)

const getPopulations = async () => Population.find()

const upsertPopulation = async population => {
  return Population.findOneAndUpdate({ code: population.code }, population, {
    upsert: true,
    new: true,
  })
}

module.exports = {
  getPopulations,
  upsertPopulation,
}
