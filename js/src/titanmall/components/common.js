// let ever = {}
//
// // 去左右空格;
// function trim (str) {
//   return str.replace(/(^\s*)|(\s*$)/g, '')
// }
//
// let diction = {
//   createObjFromSchema: function (schema, extend) {
//     let obj = {}
//     let self = this
//     for (let field of schema) {
//       self.setProp(obj, field.name, '')
//       if (field.startName || field.endName) {
//         obj[field.startName] = ''
//         obj[field.endName] = ''
//       }
//     }
//     return { ...obj, ...extend }
//   },
//   getFieldFromSchema (schema, name) {
//     let arr = schema.filter(field => {
//       return field.name === name
//     })
//     let field = arr.length ? arr[0] : null
//     return field
//   },
//   setProp: (obj, path, value) => {
//     if (!path) return
//     let pList = path.split(',')
//     let len = pList.length
//     for (var i = 0; i < len - 1; i++) {
//       var elem = pList[i]
//       if (!obj[elem]) obj[elem] = {}
//       obj = obj[elem]
//     }
//     obj[pList[len - 1]] = typeof value === 'string' ? trim(value) : value
//   },
// }
//
// ever.install = function (Vue) {
//   Vue.prototype.$ever = diction
// }
//
// export { diction, ever }
// export default diction
