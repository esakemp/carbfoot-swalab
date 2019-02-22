const { mongoose } = require('./db')

const emissionSchema = new mongoose.Schema({
    code: String,
    name: String,
    stats: {
        type: Map,
        of: Number,
    },
})

const Emission = mongoose.model('Emission', emissionSchema)

const getEmissions = async () => Emission.find()

const upsertEmission = async emission => {
    return Emission.findOneAndUpdate({ code: emission.code }, emission, {
        upsert: true,
        new: true,
    })
}

module.exports = {
    getEmissions,
    upsertEmission,
}
