// js生成uuid
function S4 () {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}
export function GENERATE_UUID () {
  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
}
export function GENERATE_SHORT_UUID () {
  return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4())
}
