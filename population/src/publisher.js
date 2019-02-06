const EventEmitter = require('events')

const emitter = new EventEmitter()

const publish = (event, payload) => emitter.emit(event, payload)

const subscribe = (event, callback) => emitter.on(event, callback)

module.exports = { publish, subscribe }