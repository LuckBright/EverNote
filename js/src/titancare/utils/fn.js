/**
 *
 * @param {*} data      匹配数据
 * @param {*} id        id
 * @param {*} showNew   是否显示新建
 * @param {*} other     取其他key值
 */
export const setName = function (data, id, showNew, other) {
  if (data === undefined) {
    return ''
  }
  let index = data.findIndex(item => {
    if (item.id) {
      if (typeof item.id === 'string') {
        return item.id === id + ''
      } else if (typeof id === 'string') {
        return item.id.toString() === id
      } else {
        return item.id === id
      }
    }
    return item.value === id + ''
  })
  if (index >= 0) {
    return other ? data[index][other] : data[index].name || data[index].label || data[index].value
  }
  if (showNew) {
    return ''
  }
  return '新建'
}
