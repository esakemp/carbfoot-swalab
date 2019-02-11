const express = require('express')
const cors = require('cors')

const PORT = 8000
const FILEDIR = './files'

const app = express()
app.use(cors())

app.get('/ping', (_, res) => {
    res.status(200).send('pong')
})

app.get('/v2/en/indicator/SP.POP.TOTL', (req, res) => {
    const filename = 'API_SP.POP.TOTL_DS2_en_csv_v2_10307762.zip'
    res.download(`${FILEDIR}/${filename}`, filename)
})

app.get('/v2/en/indicator/EN.ATM.CO2E.KT', (req, res) => {
    const filename = 'API_EN.ATM.CO2E.KT_DS2_en_csv_v2_10383996.zip'
    res.download(`${FILEDIR}/${filename}`, filename)
})

app.get('*', (_, res) => {
    res.status(404).send()
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))