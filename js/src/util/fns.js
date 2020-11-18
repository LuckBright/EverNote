
export function deepTrim (obj, filterNone = false, onlyClone = false, trimVue = false) {
  let type = ''
  switch (typeof obj) {
    case 'object':
      if (Array.isArray(obj)) {
        type = 'array'
      } else if (obj) {
        if (obj instanceof Date || obj instanceof RegExp) {
          // 简单对象 如date regexp 等
          type = 'simple'
        } else {
          type = 'object'
        }
      }
      break
    case 'string':
      return onlyClone ? obj : obj.trim()
    default:
      return obj
  }
  const newObj = type === 'array' ? [] : (type === 'object' ? {} : obj)
  if (type === 'array' || type === 'object') {
    for (const i in obj) {
      if (obj.hasOwnProperty(i)) {
        if (trimVue) {
          if (i === '__ob__') {
            continue
          }
        }
        const objValue = obj[i]
        if (filterNone) {
          if ((typeof objValue === 'string' && objValue.trim() === '') || objValue === null || objValue === undefined) {
            continue
          }
        }
        newObj[type === 'array' ? newObj.length : i] = deepTrim(objValue, filterNone, onlyClone)
      }
    }
  }
  return newObj
}

// 深克隆
export function deepClone (obj, trimVue = false) {
  return deepTrim(obj, false, true, trimVue)
}
// 深比较 两对象相同返回 true 不同返回false
export function deepCompare (a, b) {
  if (a && b) {
    const aProps = Object.getOwnPropertyNames(a)
    const bProps = Object.getOwnPropertyNames(b)
    if (aProps.length !== bProps.length) {
      return false
    }
    for (let i = 0; i < aProps.length; i++) {
      const item = aProps[i]
      const aValueItem = a[item]
      const bValueItem = b[item]
      if (typeof aValueItem === 'object') {
        const itemResult = deepCompare(aValueItem, bValueItem)
        if (!itemResult) {
          return false
        }
      } else if (aValueItem !== bValueItem) {
        return false
      }
    }
  } else {
    return !!a === !!b
  }
  return true
}
