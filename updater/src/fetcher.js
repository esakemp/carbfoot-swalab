const http = require('http')
const fs = require('fs')
const unzip = require('unzip')
const path = require('path')
const tmp = require('tmp')

tmp.setGracefulCleanup()

const downloadZip = (url, filepath) =>
  new Promise(resolve => {
    http.get(url, response => {
      response.on('data', data => {
        fs.appendFileSync(filepath, data)
      })
      response.on('end', () => {
        resolve()
      })
    })
  })

const extractZip = (frompath, topath) =>
  new Promise(resolve => {
    const stream = fs.createReadStream(frompath)
    stream.pipe(unzip.Extract({ path: topath })).on('close', () => {
      fs.unlinkSync(frompath)
      resolve()
    })
  })

const findCsvFilePath = (dirpath, fileprefix) => {
  const files = fs.readdirSync(dirpath)
  const csvfilename = files.find(name => name.startsWith(fileprefix))
  return path.join(dirpath, csvfilename)
}

const fetchDataStream = async (url, fileprefix) => {
  const tmpfile = tmp.fileSync()
  const extractdir = tmp.dirSync()
  const MYPATH = extractdir.name
  await downloadZip(url, tmpfile.name)
  await extractZip(tmpfile.name, MYPATH)
  tmpfile.removeCallback()
  const csvpath = findCsvFilePath(extractdir.name, fileprefix)
  const stream = fs.createReadStream(csvpath)
  stream.on('end', () => {
    const files = fs.readdirSync(MYPATH)
    files.forEach(filename => fs.unlinkSync(path.join(MYPATH, filename)))
    extractdir.removeCallback()
  })
  return stream
}

module.exports = { fetchDataStream }
