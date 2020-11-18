import {listDestValue} from '@/util/common'
import {commonStatusList} from '@/follow/util/model'

const parentNodeKey = '__parent'
let resNode = null // 根据id递归查找node
export const statusFormatter = (v, list = commonStatusList) => {
  return listDestValue(list, v)
}

/**
 * 将数组转换为树
 */
export function convertListToTree (array) {
  const list = []
  for (const item of array) {
    if (isRoot(item, array)) {
      item[parentNodeKey] = null
      const children = getChildren(item, array)
      if (children.length > 0) {
        item.children = children
        item.isLeaf = false
      } else {
        item.isLeaf = true
      }
      list.push(item)
    }
  }
  return list
}

/**
 * 判断节点是否为根
 */
function isRoot (item, array) {
  const parentString = getParentIdStr(item)
  const idString = getIdStr(item)
  if (parentString && item[parentString]) {
    for (const a of array) {
      if (a[idString] === item[parentString]) {
        return false
      }
    }
  }
  return true
}

/**
 * 获取所有的子元素
 */
export function getChildren (item, array) {
  const children = []
  for (const data of array) {
    const parentId = getParentIdStr(data)
    const idString = getIdStr(data)
    if (item[idString] === data[parentId]) {
      data[parentNodeKey] = item
      const _children = getChildren(data, array)
      if (_children.length > 0) {
        data.children = _children
        data.isLeaf = false
      } else {
        data.isLeaf = true
      }
      children.push(data)
    }
  }
  return children
}

/**
 * 根据 value 和 key 获取当前树中的节点
 */
export function getNodeByValue (nodes, value, key = 'id') {
  resNode = null
  reGetNodeByValue(nodes, value, key)
  return resNode
}

function reGetNodeByValue (nodes, value, key = 'id') {
  for (let i = 0, l = nodes.length; i < l; i++) {
    const node = nodes[i]
    if (node[key] === value) {
      resNode = node
      break
    } else {
      if (node.children && node.children.length) {
        reGetNodeByValue(node.children, value, key)
      }
    }
  }
}

/**
 * 根据node获取它所有的父节点
 */
export function getAllParent (node, parentKey = parentNodeKey, parents = []) {
  const parent = node[parentKey]
  if (parent) {
    parents.unshift(parent)
    if (parent[parentKey]) {
      return getAllParent(parent, parentNodeKey, parents)
    }
  }
  return parents
}

/**
 * 获取父id的key
 */
function getParentIdStr (data) {
  const parentIds = ['parentCode', 'pid', 'parentid', 'parentId', 'pId', 'parent_id']
  for (const item of parentIds) {
    if (item in data) {
      return item
    }
  }
}

function getIdStr (data) {
  const ids = ['code', 'id']
  for (const item of ids) {
    if (item in data) {
      return item
    }
  }
}

const yearMilli = 12 * 30 * 24 * 60 * 60 * 1000
const monthMilli = 30 * 24 * 60 * 60 * 1000
const weekMilli = 7 * 24 * 60 * 60 * 1000
const dayMilli = 24 * 60 * 60 * 1000
const hourMilli = 60 * 60 * 1000

/**
 * @Description: 将时间转换为毫秒
 * 如需要将 5年转换为毫秒，则可执行 toMillisecond(5, 'year')
 * unit 的可选值为 year month day hour 注意 这里不是精确换算
 * @author fuyongbo@everjiankang.com
 * @date 2019-05-25
 */
export function toMillisecond (number, unit) {
  if (!number || !unit) {
    return 0
  }
  if (unit === 'date') {
    console.error('请传入unit为day，而不是date')
    return 0
  }
  number = number + 0
  let res
  switch (unit) {
    case 'year':
      res = number * yearMilli
      break
    case 'month':
      res = number * monthMilli
      break
    case 'week':
      res = number * weekMilli
      break
    case 'day':
      res = number * dayMilli
      break
    case 'hour':
      res = number * hourMilli
      break
    default:
      res = 0
      break
  }
  return res
}

/* 将一个形如{year: 1, month: 1, day: 1, hour: 1}的时间对象转换为毫秒 */
export function toMillisecondByTimeObj (obj) {
  return toMillisecond(obj.year, 'year') +
    toMillisecond(obj.month, 'month') +
    toMillisecond(obj.day, 'day') +
    toMillisecond(obj.hour, 'hour')
}

/* 判断是否是闰年 */
export function isRN (year) {
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    return true
  }
  return false
}
/* 将一个毫秒转换为形如{year: 1, month: 1, day: 1, hour: 1}的时间对象 */
export function toTimeObj (millisecond) {
  let res = {
    year: 0,
    month: 0,
    day: 0,
    hour: 0,
  }
  if (!millisecond) {
    return res
  }
  res.year = Math.floor(millisecond / yearMilli)
  res.month = Math.floor((millisecond - (res.year * yearMilli)) / monthMilli)
  res.day = Math.floor((millisecond - (res.year * yearMilli) - (res.month * monthMilli)) / dayMilli)
  res.hour = Math.floor((millisecond - (res.year * yearMilli) - (res.month * monthMilli) - (res.day * dayMilli)) / hourMilli)
  return res
}

/* 将一个毫秒转换为时间文本 */
export function toTimeText (millisecond, prefix = '后') {
  if (!millisecond) {
    return prefix + '立即'
  }
  if (millisecond < 0) {
    prefix = '前'
  }
  const obj = toTimeObj(Math.abs(millisecond))
  // return `${prefix}${obj.year ? `${obj.year}年` : ''}${obj.month ? `${obj.month}个月` : ''}${obj.day ? `${obj.day}天` : ''}${obj.hour ? `${obj.hour}时` : ''}`
  return `${prefix}${obj.year ? `${obj.year}年` : '0年'}${obj.month ? `${obj.month}月` : '0月'}${obj.day ? `${obj.day}天` : '0天'}${obj.hour ? `${obj.hour}时` : '0时'}`
}

/* 将一个毫秒转换为天 */
export function toDayByMillisecond (millisecond, method = 'floor') {
  return Math[method](millisecond / dayMilli)
}
/**
 * @Description: 表单模式切换，传入schema和toView使schema在两种模式下切换
 * 编辑模式和查看模式 toView为true时，将表单转换为查看模式，否则转换为正常模式
 * @author fuyongbo@everjiankang.com
 * @date 2019-05-24
 */
export function transferSchema (_schema, toView = false) {
  return _schema.map(item => ({
    ...item,
    originComp: item.originComp || item.comp || 'NULL',
    comp: toView ? 'readonlyitem' : (item.originComp === 'NULL' ? undefined : (item.originComp || item.comp)),
  }))
}
export function getRootRoute (root = '/manages/') {
  return this.$route.path.includes(root) ? root.slice(0, -1) : ''
}
export function getAgeByMonth (monthNumber) {
  const age = Math.floor(monthNumber / 12)
  if (age >= 5) {
    return age + '岁'
  } else {
    return `${age ? `${age}岁` : ''}${monthNumber % 12 ? `${monthNumber % 12}个月` : ''}`
  }
}
export function getDeptNames (value) {
  if (value) {
    if (value === 'ALL') {
      return '全部科室'
    } else {
      return value
    }
  }
}
export function validateSpace (rule, value, callback) {
  if (!value) {
    callback(new Error('必填项'))
  }
  if (value && value.split(' ').join('').length === 0) {
    return callback(new Error('必填项'))
  } else {
    callback()
  }
  callback()
}
