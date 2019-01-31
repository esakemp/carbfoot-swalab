const axios = require('axios')
const { POPULATION_POST_URL } = require('./conf')

const publishPopulations = async data => {
    try {
        await axios.post(POPULATION_POST_URL, data)
    } catch (e) {
        console.error('Publishing new populations failed', e)
    }
}

const publishEmissions = () => console.log('Carbon emission publishing not implemented!')

module.exports = { publishEmissions, publishPopulations }