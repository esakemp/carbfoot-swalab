const mongoose = require('mongoose')
const { MONGOURL } = require('./conf')

const dbconnect = () => new Promise(async (resolve, reject) => {
  try {
    await mongoose.connect(MONGOURL)
    console.log('Connected to Mongo')
    resolve()
  } catch (error) {
    console.error('Error connecting to Mongo', error)
    reject(error)
  }
})

module.exports = {
  dbconnect,
  mongoose
}
