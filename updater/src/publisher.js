const axios = require('axios')
const { POPULATION_POST_URL, EMISSION_POST_URL } = require('./conf')

const publishPopulations = async data => {
    try {
        await axios.post(POPULATION_POST_URL, data)
    } catch (e) {
        console.error('Publishing new populations failed', e)
    }
}

const publishEmissions = async data => {
    try {
        await axios.post(EMISSION_POST_URL, data)
    } catch (e) {
        console.error('Publishing new emissions failed', e)
    }
}

module.exports = { publishEmissions, publishPopulations }
