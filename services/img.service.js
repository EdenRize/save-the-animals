import { load } from 'cheerio'
import { utilService } from './util.service.js'
export const imgServices = { suggestImgs }

function suggestImgs(term) {
  const url = `https://www.istockphoto.com/search/2/image?phrase=${term}`
  return utilService.httpGet(url).then((res) => {
    const $ = load(res)
    const topImgs = Array.from($('[class*="yGh0CfFS4AMLWjEE9W7v"]')).splice(
      0,
      3
    )
    const urls = topImgs.map((img) => img.attribs.src)
    return urls
  })
}
