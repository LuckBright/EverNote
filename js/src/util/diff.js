const deepObjectCompile = function (first, last) {
  let keys
  if (first === last) {
    return false
  }
  if ((typeof first === 'object' && first !== null) && (typeof last === 'object' && last !== null)) {
    keys = Object.keys(first)
  } else {
    return true
  }
  if (keys.length !== Object.keys(last).length) {
    return true
  }
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i]
    let valF = first[key] === null ? '' : first[key]
    let valL = last[key] === null ? '' : last[key]
    let objTypeF = typeof valF
    let objTypeL = typeof valL
    if (objTypeF !== objTypeL) {
      return true
    }
    if (objTypeF === 'function') {
      if (valF.toString() !== valL.toString()) {
        return true
      }
    } else if (objTypeF === 'object') {
      if (deepObjectCompile(valF, valL)) {
        return true
      }
    } else {
      if (valF !== valL) {
        return true
      }
    }
  }
  return false
}
const compareObj = function (newVal, oldVal) {
  const reg = /null/g // 这个验证是必须的，初始化数据可能为null，输入再撤销会变成“”
  let newStr = JSON.stringify(newVal).trim().replace(reg, '""')
  // console.log('newobj', newStr)
  if (!Object.keys(oldVal).length) return false
  let oldStr = JSON.stringify(oldVal).trim().replace(reg, '""')
  // console.log('oldObj', oldStr)
  return deepObjectCompile(JSON.parse(oldStr), JSON.parse(newStr))
}

export default deepObjectCompile
export {
  deepObjectCompile,
  compareObj
}
