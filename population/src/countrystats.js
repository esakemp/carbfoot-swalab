const { mongoose } = require('./db')

const YearlyStatisticSchema = new mongoose.Schema({
    year: String,
    population: Number,
    emissions: Number
})

YearlyStatisticSchema.virtual('normalized').get(function () {
    return (this.emissions / this.population)
})

YearlyStatisticSchema.set('toJSON', { virtuals: true })
YearlyStatisticSchema.set('toObject', { virtuals: true })

const countryStatisticsSchema = new mongoose.Schema({
    code: String,
    name: String,
    stats: {
        type: Map,
        of: YearlyStatisticSchema,
        default: new Map()
    }
})

countryStatisticsSchema.set('toJSON', {
    transform: document => {
        const { code, name, stats } = document.toObject()
        const json = { code, name, stats: [...stats.values()] }
        return json
    }
})

const CountryStatistics = mongoose.model('CountryStatistics', countryStatisticsSchema)

const getAllCountryStatistics = async () => CountryStatistics.find()

const getCountryStatistic = async code => CountryStatistics.findOne({ code })

const upsertCountryStatistics = async (data) => {
    const { stats, ...rest } = data
    const countrystats = await CountryStatistics.findOneAndUpdate({ code: data.code }, rest, { upsert: true, new: true, setDefaultsOnInsert: true })
    stats.forEach(({ year, ...updates }) => {
        const yearstats = countrystats.stats.get(year)
        const old = !yearstats ? {} : yearstats.toObject()
        const stat = { year, ...old, ...updates }
        countrystats.stats.set(year, stat)
    })
    return countrystats.save()
}

const getYearlyStatisticsForCodes = async (codes, year) => {
    const stats = await CountryStatistics.find({
        code: { $in: codes }
    })
    const result = stats.reduce((acc, next) => {
        const { code, name, stats } = next
        const { emissions, population, normalized } = stats.get(year).toObject()
        const entry = { code, name, year, emissions, population, normalized }
        return acc.concat(entry)
    }, [])
    return result
}

module.exports = {
    getAllCountryStatistics,
    getCountryStatistic,
    upsertCountryStatistics,
    getYearlyStatisticsForCodes
}