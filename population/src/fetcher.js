const http = require('http')
const fs = require('fs')
const parse = require('csv-parser')
const unzip = require('unzip')
const path = require('path')
const { ZIP_URL, FILE_PREFIX, ZIP_PATH, EXTRACT_DIR } = require('./conf')

const downloadZip = (url, filepath) => new Promise((resolve) => {
    http.get(url, response => {
        response.on('data', data => {
            fs.appendFileSync(filepath, data)
        })
        response.on('end', () => {
            resolve()
        })
     })
})

const extractZip = (frompath, topath) => new Promise((resolve) => {
    const stream = fs.createReadStream(frompath)
    stream.pipe(unzip.Extract({ path: topath }))
    stream.on('end', () => {
        fs.unlinkSync(frompath)
        resolve()
    })
})

const findCsvFilePath = () => {
    const files = fs.readdirSync(EXTRACT_DIR)
    const csvfilename = files.find(name => name.startsWith(FILE_PREFIX))
    return path.join(EXTRACT_DIR, csvfilename)
}

const parseCsvToArray = (filepath, parserArgs = {}) => new Promise(resolve => {
    const records = []
    fs.createReadStream(filepath)
        .pipe(parse(parserArgs))
        .on('data', data => {
            records.push({ ...data })
        })
        .on('end', () => {
            resolve(records)
        })
})

const getPopulationData = async () => {
    await downloadZip(ZIP_URL, ZIP_PATH)
    await extractZip(ZIP_PATH, EXTRACT_DIR)
    const filepath = findCsvFilePath()
    const records = await parseCsvToArray(filepath, { skipLines: 4 })
    return records
}

module.exports = { getPopulationData }