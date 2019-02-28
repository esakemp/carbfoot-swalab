const {
  PORT = 8000,
  MONGOURL,
  MONGODBNAME,
  NODE_ENV
} = process.env

const isTest = NODE_ENV === 'test'

module.exports = {
  PORT,
  MONGOURL,
  MONGODBNAME: isTest ? 'testdb' : MONGODBNAME
}
