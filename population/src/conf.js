const cron = require('node-cron')

const {
    CRONSTRING = '0 0 */12 * * *', // Every 12 hours
    PORT = 8000,
    ZIP_URL = 'http://api.worldbank.org/v2/en/indicator/SP.POP.TOTL?downloadformat=csv',
    FILE_PREFIX = 'API_SP.POP.TOTL_DS2'
} = process.env

const ZIP_PATH = 'assets/tmp/populations.zip'
const EXTRACT_DIR = 'assets/extracted'

cron.validate(CRONSTRING)

module.exports = {
    CRONSTRING, PORT, ZIP_URL, FILE_PREFIX, ZIP_PATH, EXTRACT_DIR
}