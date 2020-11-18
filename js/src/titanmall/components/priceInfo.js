/**
 * 格式化价格
 * @param value 当前值
 */
const priceInfo = function (value, isTrue) {
  value = value ? value.toString() : ''
  value = value.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
  value = value.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
  value = value.replace(/^\.*/g, '') // 清除以.开头
  value = value
    .replace('.', '$#$')
    .replace(/\./g, '')
    .replace('$#$', '.')
  if (isTrue) {
    value = value.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
  } else {
    value = value.replace(/^(-)*(\d+)\.(\d\d\d\d\d).*$/, '$1$2.$3')
  }
  // if (value.indexOf(".") < 0 && value != "") {
  //   // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
  //   value = parseFloat(value);
  // }
  return value
}
export default priceInfo
