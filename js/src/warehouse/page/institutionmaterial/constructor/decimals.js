import { floatTool } from '@/util/common'
import { config } from '@/manages/components/price.manage/price.config.js'
export function priceChang(val, tdKey = 'bonusRate') {
  val = String(val)
  let price = val
  if (val.length > 16) {
    price = +val.slice(0, 16)
  }
  if (val.indexOf('.') !== -1 && val.split('.')[1].length > config.priceDecimal && tdKey !== 'bonusRate') {
    price = +(val.split('.')[0] + '.' + val.split('.')[1].slice(0, config.priceDecimal))
  }
  if (val.indexOf('.') !== -1 && val.split('.')[1].length > 2 && tdKey === 'bonusRate') {
    let markupPercentage = +(val.split('.')[0] + '.' + val.split('.')[1].slice(0, 3))
    price = +(markupPercentage.toFixed(2))
  }
  return price
}

/**
 * @param {Function} callback 回调函数
 * @param {Number} wait       间隔时间
 * @return {Function} 节流函数
 */
export function throttle(callback, wait = 2000) {
  let timer = null
  let startTime
  return function () {
    const ctx = this
    const args = arguments
    const now = +new Date()
    if (startTime && now < startTime + wait) {
      clearTimeout(timer)
      timer = setTimeout(function () {
        startTime = now
        callback.apply(ctx, args)
      }, wait)
    } else {
      startTime = now
      callback.apply(ctx, args)
    }
  }
}

 // 计算需要合并单元格的物资，记录物资 下标和length old
 /**
  * @param {Array} tableData 元数据
  * @param {Function} fn 装饰器 需要额外执行的操作 提供 3 个值给外界接受使用
  */
export function hanlderItems (tableData, fn) {
  if (!Array.isArray(tableData)) return []
  return tableData.map((item, index) => {
    let firstIndex = tableData.findIndex(child => child.localMaterialId === item.localMaterialId)
    const thisArr = tableData.filter(child => child.localMaterialId === item.localMaterialId)
    // 当前物资第一次出现的下标
    item.thisTableIndex = firstIndex
    // 当前物资存在几条
    item.thisTableCount = thisArr.length
    item.last = index === firstIndex + thisArr.length - 1
    if (fn && typeof fn === 'function') fn(item, thisArr, firstIndex)
    return item
  })
}

export function btnGray (tableData, isBatch = false) {
  if (!Array.isArray(tableData)) return false
  if (tableData.length && tableData.length === 1) {
    const data = tableData[0]
    let { localMaterialId, num, sysBatchCode } = data
    if (localMaterialId && num > 0 && (isBatch ? sysBatchCode : true)) {
      return false
    } else {
      return true
    }
  } else {
    return !tableData.length
  }
}
/**
 * @param {Array} tableData 合并的元数据
 * @param {Array} columnIndes 需要合并的列
 */
export function arraySpanMethod ({ row, column, rowIndex, columnIndex }, tableData, columnIndes) {
  if (columnIndes.includes(columnIndex) && tableData.length > 1) {
    if (((rowIndex - (row.thisTableIndex + row.thisTableCount)) % row.thisTableCount) === 0) {
      return {
        rowspan: row.thisTableCount,
        colspan: 1
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  }
}

// 计算公式
/**
 * @param {String} tdKey 通过条件选择公式
 * @param {Number} purchasePrice 采购单价
 * @param {Number | String} val 当前输基础价 || 当前加成率
 */
export function formula (tdKey, purchasePrice, val) {
  if (tdKey === 'bonusRate') {
    // 通过加成率反算基础价
    return val ? floatTool.multiply(purchasePrice, (1 + floatTool.divide(val, 100))) : purchasePrice
  } else {
    // 通过基础价反算加成率
    // 加成率 = （基础价 / 采购价 - 1 ）* 100
    return floatTool.multiply(floatTool.subtract(floatTool.divide(val, purchasePrice), 1), 100)
  }
}
