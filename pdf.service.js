import fs from 'fs'
import PDFDocument from 'pdfkit'

export const pdfService = { buildAnimalsPDF }

const doc = new PDFDocument()

function buildAnimalsPDF(animals, filename = 'SaveTheAnimals.pdf') {
  doc.pipe(fs.createWriteStream(filename))

  const imageWidth = 300
  const imageHeight = 187.5
  const xPosition = (doc.page.width - imageWidth) / 2
  animals.forEach((animal, idx) => {
    doc.fontSize(25).text(`Name: ${animal.name}`, { align: 'center' })
    doc
      .fontSize(20)
      .text(`Count: ${animal.count}`, { align: 'center', stroke: true })
    doc.fontSize(16).text(`${animal.info}`, { align: 'center' })

    animal.paths.forEach((path, idx) => {
      doc.image(path, xPosition, 195 * (idx + 1), {
        width: imageWidth,
        height: imageHeight,
      })
    })
    if (idx !== animals.length - 1) doc.addPage()
  })
  doc.end()
}
