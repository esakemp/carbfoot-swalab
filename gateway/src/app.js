const express = require('express')
const cors = require('cors')

const port = 8000
const app = express()

app.use(cors())

app.get('/', (req, res) => res.send('Hello, Esa!'))

app.get('/ping', (req, res) => res.send('pong'))

app.listen(port, () => console.log(`API gateway listening on port ${port}!`))
