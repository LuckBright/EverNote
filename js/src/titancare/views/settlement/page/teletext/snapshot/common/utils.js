// 抖动函数
export function debounce (func, delay) {
  let timer
  delay = delay || 300
  return function (...args) {
    return new Promise((resolve, reject) => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        resolve(func.apply(this, args))
      }, delay)
    })
  }
}

// 解析json字符串
export const jsonParse = (jsonString, reviver) => {
  let jsonObj
  try {
    if (reviver) {
      jsonObj = JSON.parse(jsonString, reviver)
    } else {
      jsonObj = JSON.parse(jsonString, (key, value) => {
        if (typeof value === 'undefined' || (typeof value === 'object' && !value)) {
          return ''
        } else {
          return value
        }
      })
    }
  } catch (error) {
    jsonObj = {}
    console.log('Json解析出错：', error)
  }
  return jsonObj
}

// 转换json字符串
export const jsonStringify = jsonObject => {
  let jsonStr
  try {
    jsonStr = JSON.stringify(jsonObject)
  } catch (error) {
    jsonStr = {}
    console.log('Json转换出错：', error)
  }
  return jsonStr
}
