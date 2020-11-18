/*
 * @Author: by zhangsheng@everjiankang.com.cn
 * @Date: 2020-11-01 18:01:11
 * @LastEditTime: 2020-11-16 18:59:37
 * @LastEditors: by zhangsheng@everjiankang.com.cn
 */

import { floatTool } from '@/util/common'
var _toSrting = Object.prototype.toString
/**
 * 计算表格内相同物资第一次出现和出现了几次
 * @param {Array} list 需要处理的源数据
 */
export const groupMap = list => {
  const data = new Map()
  list.forEach((task, index) => {
    const { localMaterialId } = task
    // 同一物资再次出现
    if (data.has(localMaterialId)) {
      const { drugMap } = data.get(localMaterialId)
      const { thisTableCount, firstIndex } = drugMap.get(localMaterialId)
      drugMap.set(localMaterialId, {
        firstIndex,
        thisTableCount: thisTableCount + 1 // 更新物资条数
      })
    } else {
      let drugMap = new Map()
      drugMap.set(localMaterialId, {
        firstIndex: index, // 同一物资第一次出现的下标
        thisTableCount: 1 // 该物资一共有多少条
      })
      data.set(localMaterialId, {
        drugMap
      })
    }
  })
  return data
}

/**
 * 查找需要合并的表格的下标
 * @param {Array} config 配置表格列
 * @param {*} showCheckbox 是否开启复选框
 * @returns Map 对象
 */
export const getColIndexMaps = (config, showCheckbox) => {
  const columnsMap = new Map()
  if (!config && Array.isArray(config) && !config.length) return columnsMap
  config.forEach((column, index) => {
    if (column.concatColumn && !column.hidden) {
      // 当前表格存在复选框时 index + 1
      const showIndex = showCheckbox ? index + 1 : index
      columnsMap.set(showIndex, showIndex)
    }
  })
  return columnsMap
}

/**
 * 初始化配置表格列弹窗数据处理
 * @param {Array} config 传递进 ever-table 的 columns 与 配置列弹窗接口查询的接口返回数据合并后数据
 * @param {Array} tableColumns 本地操作列的源数据
 * @returns 一个新数据 初始化后好的数据
 */
export const createdConfigColumns = (config, tableColumns = []) => {
  // 初始化数据 处理 当前配置列的表格是否显示生产批号 不显示则把 数量这一列进行合并
  return config.map(col => {
    // 再次与列表查询的接口合并一次，防止字段丢失
    const columnsObj = tableColumns.find(columns => columns.prop === col.prop)
    if (columnsObj) {
      col = Object.assign({}, columnsObj, col)
    }
    if (col.prop === 'num') {
      const batchCol = config.find(key => key.prop === 'batchNum')
      if (batchCol) col.concatColumn = batchCol.hidden
    }
    return col
  })
}

/**
 * 页面上不显示生产批号的时候就要合并数量列
 * @param {Array} config 传递进 ever-table 的 columns 与 配置列弹窗接口查询的接口返回数据合并后数据
 * @returns Boolean
 */
export const isHidden = config => {
  return !!config.find(col => col.prop === 'batchNum' && col.hidden)
}

/**
 * 计算一个数组中相同物资的数量的和 如果是多个执行单中一个物资相同系统批号序号过滤掉
 * @param {*} aryList 源数据
 * @returns 计算好的数组 是一个新数组
 */
export const computedNum = (aryList) => {
  let tempTotalCount = {}
  let tempTotalCountArr = []
  let tempMap = new Map()
  aryList.forEach(item => {
    const { localMaterialId, sysBatchCode } = item
    // 计算该物资的所有数量和
    if (tempTotalCount[localMaterialId]) {
      tempTotalCount[localMaterialId].totalNum = floatTool.add(tempTotalCount[localMaterialId].totalNum, Number(item.num))
      if (!tempMap.has(sysBatchCode)) {
        tempMap.set(sysBatchCode, {
          num: Number(item.num)
        })
        tempTotalCountArr.push({ ...item })
      } else {
        // 相同系统批号的需要累积数量
        let taskMap = tempMap.get(sysBatchCode)
        taskMap.num = floatTool.add(taskMap.num, Number(item.num))
      }
    } else {
      tempTotalCount[localMaterialId] = {
        totalNum: Number(item.num)
      }
      tempMap.set(sysBatchCode, {
        num: Number(item.num)
      })
      tempTotalCountArr.push({ ...item })
    }
  })
  // 给相同物资赋值上数量的和
  tempTotalCountArr = tempTotalCountArr.map(trmp => {
    const { sysBatchCode, localMaterialId } = trmp
    if (tempMap.has(sysBatchCode)) {
      trmp.num = tempMap.get(sysBatchCode).num
    }
    if (tempTotalCount[localMaterialId]) trmp.totalNum = tempTotalCount[localMaterialId].totalNum
    return trmp
  })
  return tempTotalCountArr
}

/**
 * 从原型上检测该数据的类型
 * @param {*} val 需要检测的值
 * @returns {String} 检测好的类型
 */
export const toRowType = val => {
  return _toSrting.call(val).slice(8, -1)
}

/**
 * 批次定价中药数据处理
 */
export const packSourceData = list => {
  let _taskDtoList = []
  list.forEach(item => {
    // 首先要按处方分方，然后再包装 _sourceData, _sourceData是一个处方里面多批次的药
    const { orderId, localMaterialId } = item
    item.customSelectionValue = true
    if (!_taskDtoList.length) {
      _taskDtoList.push(Object.assign({}, item, { _sourceData: [Object.assign({}, item, { taskItemList: [item] })] }))
    } else {
      // 找到相同处方
      const adviceIndex = _taskDtoList.findIndex(advice => advice.orderId === orderId)
      if (~adviceIndex) {
        // 如果相同明细的话，就把 _sourceData 相同明细的那一条 push 进 taskItemList
        const taskIndex = _taskDtoList[adviceIndex]._sourceData.findIndex(task => task.localMaterialId === localMaterialId)
        if (~taskIndex) {
          _taskDtoList[adviceIndex]._sourceData[taskIndex].taskItemList.push(Object.assign({}, item))
        } else {
          _taskDtoList[adviceIndex]._sourceData.push(Object.assign({}, item, { taskItemList: [item] }))
        }
      } else { // 没有相同处方
        _taskDtoList.push(Object.assign({}, item, { _sourceData: [Object.assign({}, item, { taskItemList: [item] })] }))
      }
    }
  })
  return _taskDtoList
}

/**
 * 中药批次 schema
 */
export const chineseSchema = [
  {
    label: '生产批号',
    prop: 'chineseBatchNum',
    slotName: 'chineseBatchNum',
  }, {
    label: '系统批号',
    prop: 'chineseSysBatchCode',
    slotName: 'chineseSysBatchCode',
  }, {
    label: '有效期',
    prop: 'chineseValidityDate',
    slotName: 'chineseValidityDate',
  }, {
    label: '销售价',
    prop: 'chineseSaleprice',
    slotName: 'chineseSaleprice',
  },
  {
    label: '数量',
    prop: 'chineseNum',
    slotName: 'chineseNum'
  }
]
