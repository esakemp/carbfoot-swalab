const mongoose = require('mongoose')
const { MONGOURL } = require('./conf')

mongoose.set('useFindAndModify', false)

const dbconnect = () =>
  new Promise(async (resolve, reject) => {
    try {
      await mongoose.connect(MONGOURL, { useNewUrlParser: true })
      console.log('Connected to Mongo')
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
