/**
 * @Description: 比较字符串的不同点
 * @author fuyongbo@everjiankang.com
 * @date 2019-06-13
*/
// 拆分字符串
function compareString (str) {
  const res = []
  if (!str || typeof str !== 'string') {
    return res
  }
  const l = str.length
  // i为子字符串的长度
  for (let i = 1; i <= l; i++) {
    // 子串长度为 i ，则有 l - (i - 1) 种取法，j 表示子串长为 i 时的取法种数
    for (let k = 0; k < l - (i - 1); k++) {
      // 截取长度为i的，从k到i + k之间到字符串
      res.push(str.slice(k, i + k))
    }
  }
  // 期望返回的顺序是 最长的在前边，再按先后顺序排列
  return res.sort((a, b) => {
    if (a.length > b.length) {
      return -1
    } else if (a.length === b.length) {
      return 0
    } else {
      return 1
    }
  })
}

// 寻找两个字符串的最大公共子串
function findSameStr (str1, str2) {
  const length1 = str1.length
  const length2 = str2.length
  const result1 = compareString(str1)
  const result2 = compareString(str2)
  const minLength = Math.min(length1, length2)
  let sameStr
  for (let i = minLength; i > 0; i--) {
    const filtered1 = result1.filter(item => item.length === i)
    const filtered2 = result2.filter(item => item.length === i)
    // 判断两者中有没有相同的子串
    sameStr = filtered1.find(f1 => filtered2.some(f2 => f1 === f2))
    if (sameStr) {
      break
    }
  }
  return sameStr
}

// 比较两个字符串的最小不同点
/**
 * 比较两个字符串，并返回可以标识不同子字符串颜色的数组
 * @param str1
 * @param str2
 * @returns {{type: string, value: *}[]|*[]|{str1: *, str2: *, type: string}[]}
 * @example 例如 compareStr('北京是顺义区空港融慧园34-2', '北京市顺义区空港融慧园34-2')
 * 返回
 * [
 *    {
 *         type: 'same',
 *         value: '北京',
 *       },
 *    {
 *         type: 'diff',
 *         str1: '是',
 *         str2: '市',
 *       },
 *    {
 *         type: 'same',
 *         value: '顺义区空港融慧园34-2',
 *       },
 *    ]
 */
export function compareStr (str1, str2) {
  str1 = str1 || ''
  str2 = str2 || ''
  if (str1 === str2) {
    return [
      {
        type: 'same',
        value: str1
      }
    ]
  }
  // 递归查找最大公共子串，生成可拼接的list
  let sameStr
  sameStr = findSameStr(str1, str2)
  if (sameStr) {
    const str1Left = str1.slice(0, str1.indexOf(sameStr))
    const str2Left = str2.slice(0, str2.indexOf(sameStr))
    const str1Right = str1.slice(str1.indexOf(sameStr) + sameStr.length, str1.length)
    const str2Right = str2.slice(str2.indexOf(sameStr) + sameStr.length, str2.length)
    return [
      ...(str1Left === str2Left && str1Left === '' ? [] : compareStr(str1Left, str2Left)),
      {type: 'same', value: sameStr},
      ...(str1Right === str2Right && str1Right === '' ? [] : compareStr(str1Right, str2Right))
    ]
  } else {
    return [{
      type: 'diff',
      str1,
      str2,
    }]
  }
}
// test

// const str1 = '北京是顺义区空港融慧园34-2A'
// const str2 = '北京市顺义区空港融慧园34-2B'

// const str1 = '男'
// const str2 = '女'

// const str1 = '年龄32'
// const str2 = '年龄18'

// const str1 = '年龄32'
// const str2 = '年龄12'

// const str1 = '年龄32'
// const str2 = '年龄28'

// const str1 = '年龄32'
// const str2 = '年龄是32'
// const result = findSameStr(str1, str2)
// console.log(`"${str1}"与"${str2}"的最大公共子串为：${result}`)
// const result = compareStr(str1, str2)
// console.log(`"${str1}"与"${str2}"的比较结果为：\n`, result)
