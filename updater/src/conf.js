const cron = require('node-cron')

const {
    CRONSTRING = '*/5 * * * * *' // Every 5 seconds
} = process.env

cron.validate(CRONSTRING)

module.exports = {
    CRONSTRING
}