// 解析诊断数据
/**
 * 功能：解析诊断数据，用于门诊历史就诊记录展示，并提供引用的结构化数据
 * 数据结构可参考emr/data/disease.json
*/
export default class ParseDiseaseHTML {
  constructor (parent) {
    this.parent = parent
    this.diseaseElements = this.parent.querySelectorAll('div[typecode="2"] span[apicode="disease"]')
  }
  getData () {
    let obj = this.compositePhrData()
    return obj.value || ''
  }
  compositePhrData () {
    if (!this.diseaseElements.length) return {}
    let parent = this.diseaseElements[0].parentNode.parentNode
    let key = parent.getAttribute('column')
    let obj = {
      key,
      value: []
    }
    this.diseaseElements.forEach(diseaseElement => {
      let value = diseaseElement.getAttribute('value')
      if (!value) return
      let copyValue = JSON.parse(value)

      copyValue.value = copyValue.diseaseName
      obj.value.push(copyValue)
    })

    return obj
  }
}
