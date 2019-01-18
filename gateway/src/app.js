const express = require('express')
const app = express()
const port = 8000

app.get('/', (req, res) => res.send('Hello, Esa!'))

app.listen(port, () => console.log(`API gateway listening on port ${port}!`))
