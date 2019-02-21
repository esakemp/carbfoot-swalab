const cron = require('node-cron')
const { CRONSTRING } = require('./conf')
const { updateCo2, updatePopulations } = require('./updater')

const update = async () => {
  await updateCo2()
  await updatePopulations()
}

const start = async () => {
  await update()
  cron.schedule(CRONSTRING, update)
}

module.exports = { start }
