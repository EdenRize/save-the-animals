import axios from 'axios'
import { pdfService } from './pdf.service.js'
import { imgServices } from './services/img.service.js'
import { utilService } from './services/util.service.js'

utilService
  .loadCSV('./data/rare-animals.csv')
  .then((animals) => {
    const promises = animals.map((animal) => {
      return imgServices
        .suggestImgs(animal.name)
        .then((urls) => ({ ...animal, urls, paths: [] }))
    })
    return Promise.all(promises)
  })
  .then((animalsWithImgUrls) => {
    const promises = animalsWithImgUrls.map((animal) => {
      animal.urls.map((url, idx) => {
        const path = `./animalsImg/${animal.name.replaceAll(
          ' ',
          ''
        )}/${animal.name.replaceAll(' ', '')}${idx}.jpg`

        utilService.download(url, path)
        animal.paths.push(path)
      })
      return axios
        .get(
          `https://en.wikipedia.org/w/api.php?&origin=*&action=query&list=search&
      srsearch=${animal.name}&format=json`
        )
        .then((wikiInfo) => {
          animal.info = removeSpans(wikiInfo.data.query.search[0].snippet)
          return animal
        })
    })

    return Promise.all(promises)
  })
  .then((animalsWithImgs) => {
    pdfService.buildAnimalsPDF(animalsWithImgs)
  })

function removeSpans(inputText) {
  // Use a regular expression to match <span> elements and their content
  const spanRegex = /<span[^>]*>(.*?)<\/span>/gi

  // Replace all occurrences of <span> elements with their content
  const resultText = inputText.replace(spanRegex, '$1')

  return resultText
}
