// 小数
export const FLOAT_REG = /^(\+)?\d+(\.\d+)?/
// 正整数
export const PARSE_REG = /^(\+)?\d*$/
// 大于0的正整数
export const PARSE_SPECIAL_REG = /^\+?[1-9]\d*$/
// 中药饮片||中药颗粒只允许录入4位小数
export const DECIMAL_FOUR = /^([1-9]\d*|0)(\.\d{1,4})?$/
