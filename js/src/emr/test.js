// let data = require('./data/doc.json')
// console.log(data)
// let res = data.data
export let formater = function (res) {
  let obj = {}
  for (let item in res) {
    obj[item] = JSON.parse(res[item])
  }
  return obj
}
export const obj = formater([])
