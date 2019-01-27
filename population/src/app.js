const cron = require('node-cron')
const { dbconnect } = require('./db')
const server = require('./server')
const { updatePopulations } = require('./updater')
const { CRONSTRING } = require('./conf')

const runUpdate = async () => {
    try {
        console.log('start update')
        await updatePopulations()
        console.log('end update')
    } catch (e) {
        console.error('update failed', e)
    }
}

const start = async () => {
    try {
        await dbconnect()
        await runUpdate()
        cron.schedule(CRONSTRING, runUpdate)
        server.start()
    } catch (e) {
        throw(e)
    }
}

module.exports = { start }