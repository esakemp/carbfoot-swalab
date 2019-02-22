const cron = require('node-cron')

const {
  CRONSTRING = '*/30 * * * * *', // Every 5 seconds,
  POPULATION_POST_URL,
  EMISSION_POST_URL,
  POP_API_URL = 'http://api.worldbank.org/v2/en/indicator/SP.POP.TOTL?downloadformat=csv',
  CO_API_URL = 'http://api.worldbank.org/v2/en/indicator/EN.ATM.CO2E.KT?downloadformat=csv',
} = process.env

const EXTRACT_DIR = 'assets/extracted'
const POP_CSV_PREFIX = 'API_SP.POP.TOTL_DS2'
const CO_CSV_PREFIX = 'API_EN.ATM.CO2'

cron.validate(CRONSTRING)

module.exports = {
  CRONSTRING,
  EXTRACT_DIR,
  POP_API_URL,
  POP_CSV_PREFIX,
  CO_API_URL,
  CO_CSV_PREFIX,
  POPULATION_POST_URL,
  EMISSION_POST_URL,
}
