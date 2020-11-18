/*
 * @Author: by zhangsheng@everjiankang.com.cn
 * @Date: 2020-10-24 18:20:56
 * @LastEditTime: 2020-11-13 14:36:21
 * @LastEditors: by zhangsheng@everjiankang.com.cn
 */
import {
  checkboxWidth,
  IS_REPRINT
} from '@/warehouse/views/util/constant'
import { getColIndexMaps } from '../columnpool/dispensing'
export default {
  data () {
    return {
      checkboxWidth
    }
  },
  computed: {
    mailGroupIds () {
      const obj = new Map()
      if ((this.operateMode === 1)) {
        let prev = 0 // 上一条父子医嘱数据数量
        !(this.pageType === 1 ? this.table : this.metaData.taskDtoList).forEach(task => {
          const { mainGroupId, mainFlag } = task
          // 父子医嘱id + 同状态 + 创建时间 => 同一个医嘱多次撤销 (多次提交)  (多个父子医嘱会被收集为一个同状态的父子医嘱 bug)
          const compose = mainGroupId + task.createTime
          if (mainFlag > 0) {
            if (!obj.has(compose)) {
              obj.set(compose, {
                list: [task],
                prev,
                len: 1
              })
            } else {
              const map = obj.get(compose)
              map.list.push(task)
              map.len = map.list.length
            }
          }
          prev++
        })
        return obj
      }
      return obj
    },
    drugGroupMap () {
      // 存储按一次执行（adviceExecuteId）分组后的数据
      const data = new Map()
      // 记录前一个adviceExecuteId组的数量（用于表格合并行）
      let previousNum = 0
      // 记录药品前一个组（同一个药品）有几条数据
      let previousDrugNum = 0
      // 初始化下标
      let initIndex = 0
      // 同一物资的数量和
      let totalNum = 0
      this.tableData.forEach((task, index) => {
        // 让index从1开始计算
        index++
        const { orderId, num, mainGroupId, otherId } = task
        // 区分同一处方 父子医嘱和非父子医嘱
        const onlyId = mainGroupId + otherId
        if (data.has(orderId)) {
          // 更新结束下标 和 上一个 处方单组的数量
          const adviceData = data.get(orderId)
          const { drugMap } = adviceData
          // 更新当前处方单的结束下标
          adviceData.endIndex = index
          // 更新物资map对象
          if (drugMap.has(onlyId)) {
            totalNum += +num
            // 同一个处方单，相同的药品
            const drugData = drugMap.get(onlyId)
            drugData.endIndex = index
            drugData.num = totalNum
          } else {
            // 每一个新数据就把初始化下标+1
            initIndex++
            totalNum = +num
            // 同一个处方单，不同的药品
            drugMap.set(onlyId, {
              num: totalNum, // 用于表格展示药品合并后的总数量
              index: initIndex, // 重新计算表格行下标
              startIndex: index, // 当前处方单开始的下标
              endIndex: index, // 当前处方单结束的下标
              previousNum: previousDrugNum// 前一个处方单有几条药品明细
            })
          }
        } else {
          // 每一个新数据就把初始化下标+1
          initIndex++
          totalNum = +num
          const drugMap = new Map()
          drugMap.set(onlyId, {
            num: totalNum,
            index: initIndex, // 重新计算表格行下标
            startIndex: index, // 当前处方单开始的下标
            endIndex: index, // 当前处方单结束的下标
            // 当数据为第一条时，默认取初始化的previousDrugNum否则，如果previousDrugNum === 0 则初始胡默认以1条
            previousNum: previousDrugNum // 前一个处方单当前药品有几条明细
          })
          data.set(orderId, {
            startIndex: index, // 当前处方单开始的下标
            endIndex: index, // 当前处方单结束的下标
            drugMap,
            previousNum // 前一个处方单有几条药品明细
          })
        }
        previousNum++
        previousDrugNum++
      })
      return data
    },
    tableColumnsMaps () {
      return getColIndexMaps(this.configColumns, this.showCheckbox)
    }
  },
  methods: {
    // 非批次定价模式的表格合并
    isNotBatchMode ({ row, column, rowIndex, columnIndex }) {
      const { mainFlag, mainGroupId, createTime } = row
      // 父子医嘱id + 同状态 + 创建时间
      const compose = mainGroupId + createTime
      const mapMainGroup = this.mailGroupIds.get(compose)
      let _columns = [0, 1]
      // 发药记录页面自取数据不需要合并前两列（checkobx 、标识）
      if (this.metaData && this.metaData.delivery === 0 && this.pageType === 4) {
        _columns = []
      }
      // 中药和西药操作打印列(补打)所在的columnIndex不一致，获取补打操作的 columnIndex
      if (column.property === IS_REPRINT) {
        _columns = _columns.concat(columnIndex)
      }
      // 审核时， 只有第一列checkbox框需要合并，其他处方明细需要合并checkbox和异常编辑修改列
      // 缺货页面， 不合并表格列
      if (
        this.pageType !== 3 &&
        this.operateMode === 1 &&
        _columns.includes(columnIndex) &&
        mapMainGroup &&
        mainFlag > 0
      ) {
        return this.mainSpan(mapMainGroup, rowIndex)
      }
    },
    // 父子医嘱合并前两列
    mainSpan (mapMainGroup, rowIndex) {
      const { len: adviceLength, prev } = mapMainGroup
      if (adviceLength === 1) return
      if (((rowIndex - prev) % adviceLength) === 0) {
        return {
          rowspan: adviceLength,
          colspan: 1
        }
      } else {
        return {
          rowspan: 0,
          colspan: 0
        }
      }
    },
    // 返回表格合并span
    resolveSpan (index, prev, len) {
      if (((index - prev) % len) === 0) {
        return {
          rowspan: len,
          colspan: 1
        }
      } else {
        return {
          rowspan: 0,
          colspan: 0
        }
      }
    },
    mergeRowsData ({ row, column, rowIndex, columnIndex }) {
      const { orderId, otherId, mainGroupId, createTime, mainFlag } = row
      const { startIndex, endIndex, previousNum, drugMap } = this.drugGroupMap.get(orderId)
      // 当前列(columnIndex)如果能在tableColumnsMaps中找到， 则需要进行合并，checkbox 显示时 tableColumnsMaps 中不包含 则需要进行合并，checkbox 列
      // 父子医嘱合并前两列
      // 父子医嘱id + 同状态 + 创建时间
      const compose = mainGroupId + createTime
      const onlyId = mainGroupId + otherId
      const mapMainGroup = this.mailGroupIds.get(compose)
      let _columns = [0, 1]
      // 当前数据是否父子医嘱
      let isMainGroup = false
      // 发药记录页面自取数据不需要合并前两列（checkobx 、标识）
      if (this.metaData && this.metaData.delivery === 0 && this.pageType === 4) {
        _columns = []
      }
      if (
        this.pageType !== 3 &&
        this.operateMode === 1 &&
        mapMainGroup &&
        mainFlag > 0 &&
        _columns.includes(columnIndex)
        ) {
        // 父子医嘱合并
        isMainGroup = true
        return this.mainSpan(mapMainGroup, rowIndex)
      }
      // 前面是父子医嘱前两 2 列，下面是药品明细 按处方合并
      if ((this.tableColumnsMaps.has(columnIndex) || column.type === 'selection') && (isMainGroup ? !_columns.includes(columnIndex) : true)) {
        // 开始和结束相等， 说明只有一条明细
        if (startIndex === endIndex) return
        // 物资列可能存在多个物资，需要分开合并逻辑
        // checkbox 选择框也跟随药品明细合并(****需要按照药品明细合并的在此处处理)
        if (column.type === 'selection' || ['name', 'num', 'measure', 'rate', 'days', 'channel', 'spec', 'status', 'custom_da', 'custom_prop', 'type'].includes(column.property) || column.label === '改') {
          // 药品标记信息
          const { startIndex: start, endIndex: end, previousNum: prev } = drugMap.get(onlyId)
          // 药品明细数量
          const drugLen = end - start + 1
          return this.resolveSpan(rowIndex, prev, drugLen)
        } else {
          // ****此处是按照处方单号的维度进行合并
          // 执行单明细数量
          const len = endIndex - startIndex + 1
          // 当前行下标和当前处方单号标记结束下标相等
          return this.resolveSpan(rowIndex, previousNum, len)
        }
      }
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      // 缺货页面不合并表格
      if (this.pageType === 3) return
      if (!this.isBatch) return this.isNotBatchMode({ row, column, rowIndex, columnIndex })
      return this.mergeRowsData({ row, column, rowIndex, columnIndex })
    },
  }
}
