const mongoose = require('mongoose')
const { MONGOURL, MONGODBNAME } = require('./conf')

mongoose.set('useFindAndModify', false)

const defaults = { useNewUrlParser: true }
const options = !MONGODBNAME ? defaults: { ...defaults, dbName: MONGODBNAME }

const dbconnect = () =>
  new Promise(async (resolve, reject) => {
    try {
      await mongoose.connect(MONGOURL, options)
      console.log('Connected to Mongo:', options)
      resolve()
    } catch (error) {
      console.error('Error connecting to Mongo', error)
      reject(error)
    }
  })

const dbclose = () => {
  mongoose.connection.close()
}

module.exports = {
  dbconnect,
  mongoose,
  dbclose
}
