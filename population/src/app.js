const { dbconnect } = require('./db')
const server = require('./server')

const start = async () => {
    try {
        await dbconnect()
        server.start()
    } catch (e) {
        throw(e)
    }
}

module.exports = { start }