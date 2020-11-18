/**
 * 功能：解析过敏史数据，用于门诊历史就诊记录展示，并提供引用的结构化数据
 * 数据结构可参考emr/data/allergy.json
*/
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
export default class ParseAllergy {
  constructor (parent) {
    // 过敏结构存在与dom节点typecode=3，下的apicode=allergy中
    this.parent = parent
    this.allgergyElements = this.parent.querySelectorAll('div[typecode="3"] span[apicode="allergy"]')
  }
  getData () {
    let labels = {
      'QT_YAO_WU_GUO_MIN': '药物过敏史',
      'QT_FEI_YAO_WU_GUO_MIN': '非药物过敏史',
    }
    let obj = this.compositePhrData()
    let arr = []
    for (let item in obj) {
      arr.push({
        label: labels[item], // 显示的label
        id: U() + item,
        key: item,
        value: obj[item].formatValue, // 展示的值
        html: obj[item]// 引用是结构化的数据
      })
    }
    return arr
  }
  compositePhrData () { // 组装成表单文档通用的数据结构
    let allergyData = []
    this.allgergyElements.forEach((allgergyElement, index) => {
      let values = this.getValueOfNode(allgergyElement)
      if (!values.length) return
      allergyData[index] = {
        key: allgergyElement.getAttribute('column'),
        value: values
      }
    })
    let obj = {}
    allergyData.forEach(item => {
      let guomin = []
      if (item.value.length > 0) {
        item.value.forEach(val => {
          guomin.push({
            remark: '',
            allergen: val
          })
        })
      }
      if (!obj[item.key]) {
        obj[item.key] = {
          formatValue: this.formatValue(item.value),
          isAllergicHis: item.value.length !== 0,
          guomin: guomin
        }
      } else {
        guomin.length > 0 && obj[item.key]['guomin'].push(...guomin)
        obj[item.key].formatValue += (', ' + this.formatValue(item.value))
      }
    })
    return obj
  }
  getValueOfNode (parent) { // 从dom机构中获取value值
    let nodes = parent.querySelectorAll('.editor__tag')
    let values = []
    nodes.forEach(node => {
      let value = node.getAttribute('value')
      if (!value) return
      let parseVal = JSON.parse(value)
      values.push(parseVal)
    })
    return values
  }
  formatValue (arr) { // 将需要展示的value值用","分开
    if (!arr.length) return null
    let str = []
    arr.forEach(item => {
      let substr = []
      if (Array.isArray(item)) {
        item.forEach((val) => {
          substr.push(val.name)
        })
        str.push(substr.join('/'))
      } else {
        str.push(item.name)
      }
    })
    return str.join('， ')
  }
}
