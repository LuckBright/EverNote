import { objGet } from '@/util/common'
function decimalsToFractional (decimals) {
  const formatDecimals = decimals.toFixed(2)
  let denominator = 100 // 初始化分母
  let numerator = formatDecimals * denominator // 初始化分子
  let bigger = 0
  function recursion () {
    bigger = denominator > numerator ? denominator : numerator
    for (let i = bigger; i > 1; i--) {
      if (Number.isInteger(numerator / i) && Number.isInteger(denominator / i)) {
        numerator = numerator / i
        denominator = denominator / i
        recursion()
      }
    }
  }
  recursion()
  return `${numerator}/${denominator}`
}

function calculateDfraction (ste) {
  let str = ste + ''
  let reg = /[.]\d+/g // 验证小数开头
  let result = reg.exec(str)
  if (result && Number(result[0]) > 0) {
    let arr = decimalsToFractional(Number(result[0])).split('/')
    str = str.replace(/^0/, '').replace(result[0], `<span><sup class="sup">${arr[0]}</sup>/<sub class="sub">${arr[1]}</sub></span>`)
    return str
  } else {
    return str
  }
}
// 打印： 根据公式计算每次用量
export function eachTime (obj, unit, measure, spec) {
  const { preparationSpecUnit, patentMedicineUnit, prepareUnitId, prepareUnitText, contentUnitText } = obj.materialVoObject
  let str = ''
  // measureUnit: 剂量单位 preparationSpecUnit: 成分单位
  if (unit === preparationSpecUnit) {
    // 剂量单位=成分单位
    // 计算规则：（开方剂量➗成分规格）+制剂单位
    // （开方剂量➗成分规格=非整数时，采用整数+分数的形式，如：开方剂量为0.625g，成分规格为0.25g，制剂单位为片，标签展示为2½片）
    str = calculateDfraction(measure / spec) + prepareUnitText
  } else if (unit === patentMedicineUnit) {
    // 剂量单位=成药单位
    // 计算规则：开方剂量+剂量单位
    // 例：开药时 开方剂量为160mg，标签展示为 160mg
    str = measure + contentUnitText
  } else if (unit === prepareUnitId) {
    // 剂量单位=制剂单位
    // 计算规则：开方剂量+剂量单位
    // 例：开药时 开方剂量为1粒，标签展示为 1粒
    str = measure + prepareUnitText
  }
  return str
}

export function getData (obj) {
  if (obj.outpatientDispenseItem) {
    return objGet(obj, 'outpatientDispenseItem', {})
  }
  return obj
}
