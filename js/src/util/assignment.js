/**
 * params:需要解析的参数
 * data:被解析的数据
 * return 解析后的数据
*/
function pasereObj (params, data) {
  let obj = {}
  params.forEach(item => {
    obj[item] = data[item] ? JSON.parse(JSON.stringify(data[item])) : null
  })
  return obj
}
function parseArray (params, data) {
  let arr = []
  data.forEach((item, index) => {
    arr[index] = {}
    params.forEach(subItem => {
      arr[index][subItem] = item[subItem] ? JSON.parse(JSON.stringify(item[subItem])) : null
    })
  })
  return arr
}
export const assignment = function (params, data) {
  if (Array.isArray(data)) {
    return parseArray(params, data)
  } else {
    return pasereObj(params, data)
  }
}

