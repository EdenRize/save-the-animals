import fs from 'fs'
import fr from 'follow-redirects'
import csv from 'csv-parser'

const { http, https } = fr

export const utilService = {
  readJsonFile,
  download,
  httpGet,
  loadCSV,
}

function readJsonFile(path) {
  const str = fs.readFileSync(path, 'utf8')
  const json = JSON.parse(str)
  return json
}

function download(url, fileName) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(fileName)
    https.get(url, (content) => {
      content.pipe(file)
      file.on('error', reject)
      file.on('finish', () => {
        console.log('finish')
        file.close()
        resolve()
      })
    })
  })
}

// inside util.service:
function httpGet(url) {
  const protocol = url.startsWith('https') ? https : http
  const options = {
    method: 'GET',
  }
  return new Promise((resolve, reject) => {
    const req = protocol.request(url, options, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        resolve(data)
      })
    })
    req.on('error', (err) => {
      reject(err)
    })
    req.end()
  })
}

function loadCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = []

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data)
      })
      .on('end', () => {
        resolve(results)
      })
      .on('error', (error) => {
        reject(error)
      })
  })
}
