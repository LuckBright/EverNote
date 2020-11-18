import ParseDisease from './parsedisease.js'
import ParseAllergy from './parseallergy.js'
export default class ParseHtml {
  constructor (htmlStr) {
    this.oDiv = document.querySelector('#parseHtml')
  }
  createDiv () {
    this.oDiv = document.createElement('div')
    this.oDiv.setAttribute('id', 'parseHtml')
    this.oDiv.style.display = 'none'
    document.body.appendChild(this.oDiv)
  }
  insertHTML (htmlStr) {
    if (!this.oDiv) {
      this.createDiv()
    }
    this.oDiv.innerHTML = null
    this.oDiv.innerHTML = htmlStr
  }
  getData () {
    let arr = []
    // 获取段落
    let parent = document.querySelector('#parseHtml')
    let nodeTypecode3 = parent.querySelectorAll('div[typecode="3"]')
    let nodeTypecode2 = parent.querySelectorAll('div[typecode="2"]')
    let nodes = [...nodeTypecode2, ...nodeTypecode3]
    nodes.forEach((node, index) => {
      if (node.previousElementSibling && node.innerText) {
        arr.push({
          label: node.previousElementSibling.innerText.replace(/：/gi, ''),
          id: node.getAttribute('id'),
          key: node.getAttribute('column'),
          value: node.innerText.replace(/\[|\]|\s/g, ''),
          html: node.innerHTML
        })
      }
    })
    // node.innerText.replace(/\[|\]/gi, ' ').trim()
    // 过敏史数据
    let allgery = new ParseAllergy(parent)
    let allergyData = allgery.getData()
    // 诊断数据
    let disease = new ParseDisease(parent)
    let diseaseData = disease.getData()
    arr.forEach((item, index) => {
      if (item.key === 'DL_GUO_MIN_SHI') { // 获取的是段落
        arr.splice(index, 1, ...allergyData)
      }
      if (item.key === 'ZD_MEN_ZHEN_ZHEN_DUAN') {
        item.html = diseaseData
      }
    })
    return arr
  }
}
