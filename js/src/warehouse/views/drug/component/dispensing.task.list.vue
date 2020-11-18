<template>
  <div>
    <div :class="{'dis-plist-item': pageType !== 2}" v-for="(item, index) in listData" :key="index">
      <div class="dis-house-title" v-show="pageType === 1 || pageType === 3">
        {{item.room}}
      </div>
      <!-- pageType 1 去库房 2 摆药单号 -->
      <task-table
        :storage-room-id="pageType == 1 ? item.roomId : item.code"
        :listData="listData"
        @update-all-column="updateAllColumn"
        v-if="totalObj(item.itemList).cancelTotal.length !== item.itemList.length"
        :totalObj = "totalObj(item.itemList)"
        :tableData="item.itemList"
        :currentData="item"
        :pageType="pageType"
        :columns="userColumns"
        :totalcolumns = "userTotalColumns"
        :showCheckbox = "handelShowCheckbox(item.itemList)"
        @resSelect="resSelect"
        @goDispensing="goDispensing"
        @goSend="goSend"
      ></task-table>
    </div>
  </div>
</template>

<script>
import taskTable from './dispensing.task.table'
import { showIconFontHospital } from '@/warehouse/views/util/html'
// import HospitalMethodsMixin from '@/warehouse/views/drug/mixin/hospital.methods.mixin.js'
import HospitalColumns from '@/warehouse/views/drug/columnpool/hospital.column'
import { tableColWidth } from '@/util/table-config'
import { tableDefaultCellValue, EMPLOY_NOT } from '@/warehouse/views/util/constant'
import sysValue from '@/components/sysvalue'
import Vue from 'vue'
import {
  CHINESE_MEDICINE_TYPE
} from '@/warehouse/views/util/constant.js'
import { localToFixed } from '@/warehouse/views/util/index'
const filters = Vue.prototype.$filters
// 获取父组件里面定义好的map数据 component：DispensingTaskTable
// function getData (row, ctx) {
//   const { orderId, localMaterialId } = row
//   const { adviceGroupMap } = componentUpward(ctx, adviceGroupMap, 'DispensingTaskTable')
//   console.log(adviceGroupMap, '3333')
//   const { drugMap } = adviceGroupMap.get(orderId) || {}
//   console.log(drugMap, 'drugMap', orderId)
//   if (!drugMap) return {}
//   return drugMap.get(localMaterialId)
// }
let totalcolumns = [
  {
    prop: 'name',
  },
  {
    prop: 'spec',
  },
  {
    prop: 'batchNum',
  },
  {
    prop: 'sysBatchCode',
  },
  {
    prop: 'validityDate',
  },
  {
    prop: 'price',
  },
  {
    prop: 'num',
    label: '数量',
    slotName: 'num',
    required: true,
    undraggable: true,
    render (h, ctx, row, index, isHiddenTableBatchCol) {
      const { num, packagUnitName, totalNum } = row || {}
      return h('div', [
        localToFixed(isHiddenTableBatchCol ? totalNum : num),
        packagUnitName
      ])
    },
    width: tableColWidth.name3W65
  }
]
let columns = [
  {
    prop: 'choose',
    concatColumn: true,
  },
  {
    prop: 'indexNum',
    label: '',
    required: true,
    undraggable: true,
    concatColumn: true,
    webShowTbaleChinese: true,
    slotName: 'indexNum',
    width: 35,
    render (h, ctx, row, index, isHiddenTableBatchCol, dataMap) {
      const { orderId, localMaterialId, taskType } = row
      const { drugMap } = dataMap.get(orderId) || {}
      if (drugMap && !CHINESE_MEDICINE_TYPE.includes(taskType)) {
        index = drugMap.get(localMaterialId).index
      } else {
        index = index + 1
      }
      return h('div', { style: { 'text-align': 'center' } },
        index || tableDefaultCellValue)
    },
  },
  {
    prop: 'action',
  },
  {
    prop: 'upd',
  },
  {
    prop: 'custom_prop',
    label: '标识',
    required: true,
    webShowTbaleChinese: true,
    undraggable: true,
    concatColumn: true,
    slotName: 'custom_prop',
    width: 91,
    render (h, ctx, row) {
      const { taskType, adviceTypes } = row
      if (adviceTypes !== '0' && !CHINESE_MEDICINE_TYPE.includes(`${taskType}`)) {
        return showIconFontHospital(h, row, [], true)
      } else {
        return showIconFontHospital(h, row, ['dateType'], true)
      }
    }
  },
  {
    prop: 'bedNum',
    notSelectCheckbox: true,
    webShowTbaleChinese: true,
    label: '床号',
    required: true,
    undraggable: true,
    concatColumn: true,
    width: tableColWidth.name3W65
  },
  {
    prop: 'patientName',
    notSelectCheckbox: true,
    label: '患者名',
    required: true,
    undraggable: true,
    concatColumn: true,
    webShowTbaleChinese: true,
    slotName: 'patientName',
    render (h, ctx, row, index) {
      return h('div', [
        row.patientName || tableDefaultCellValue,
        !!row.mqMsg && h('span', {
          class: {
            red: true, f12: true, ml5: true, f_bold: true
          }
        }, 'new')
      ])
    },
    width: tableColWidth.name4W80
  },
  {
    prop: 'name',
  },
  {
    prop: 'spec',
  },
  {
    prop: 'batchNum',
  },
  {
    prop: 'sysBatchCode',
  },
  {
    prop: 'validityDate',
  },
  {
    prop: 'price',
  },
  {
    prop: 'num',
    label: '数量',
    slotName: 'num',
    required: true,
    undraggable: true,
    noChineseMedicine: 1,
    render (h, ctx, row, index, isHiddenTableBatchCol, dataMap) {
      const { num, packagUnitName, orderId, localMaterialId } = row || {}
      const { drugMap } = dataMap.get(orderId) || {}
      if (drugMap) {
        var { num: totalNum } = drugMap.get(localMaterialId)
      }
      return h('div', [
        localToFixed(isHiddenTableBatchCol ? totalNum || '' : num),
        packagUnitName
      ])
    },
    width: tableColWidth.name3W65
  },
  {
    prop: 'implementTime',
    slotName: 'implementTime',
    label: '执行时间',
    undraggable: true,
    concatColumn: true,
    notSelectCheckbox: true,
    noChineseMedicine: 1,
    render (h, ctx, row) {
      const { implementTime, adviceTypes } = row
      return h('div', adviceTypes === '0' ? '立即执行' : filters.formatDateByExp(implementTime, 'YYYY-MM-DD HH:mm'))
    },
    width: 125
  },
  {
    prop: 'executeProviderName',
    label: '执行科室',
    undraggable: true,
    webShowTbaleChinese: true,
    concatColumn: true,
    noChineseMedicine: 1,
    width: 125
  },
  {
    prop: 'channel',
    label: '给药途径',
    undraggable: true,
    concatColumn: true,
    mark: [1, 2, 3, 4, 5],
    notSelectCheckbox: true,
    slotName: 'channel',
    noChineseMedicine: 1,
    width: tableColWidth.name5W90,
    render (h, ctx, row, index) {
      const { employ, dropSpeed } = row
      return employ || dropSpeed ? h('div', [
        employ === '-1' && employ && h('div', EMPLOY_NOT[0].name),
        employ !== '-1' && employ && h(sysValue, {
          props: {
            addOptions: EMPLOY_NOT,
            code: employ,
            type: 'CV06.00.102'
          },
        }),
        dropSpeed && h('div', [dropSpeed && h(sysValue, { // 滴速
          props: {
            code: dropSpeed,
            type: 'THC_CPOE_DropRate'
          },
        })])
      ]) : tableDefaultCellValue
    }
  },
  {
    prop: 'status',
  },
  {
    prop: 'createTime',
  }
  // {
  //   label: '操作',
  //   slot: 'op',
  //   width: 150,
  // }
]
let firstCol = {
  prop: 'indexNum',
  label: '',
  slotName: 'indexNum',
  width: 40,
  render (h, ctx, row, index) {
    return h('div', index || tableDefaultCellValue)
  },
}
let gatherCol = {
  prop: 'indexNum',
  label: '',
  required: true,
  undraggable: true,
  concatColumn: true,
  slotName: 'indexNum',
  width: 35,
  render (h, ctx, row, index, isHiddenTableBatchCol, dataMap) {
    const { orderId, localMaterialId, taskType } = row
    const { drugMap } = dataMap.get(orderId) || {}
    if (drugMap && !CHINESE_MEDICINE_TYPE.includes(taskType)) {
      index = drugMap.get(localMaterialId).index
    } else {
      index = index + 1
    }
    return h('div', { style: { 'text-align': 'center' } },
      index || tableDefaultCellValue)
  },
}

export default {
  name: 'dispensingtasklist',
  components: {
    taskTable
  },
  props: ['listData', 'pageType'],
  data () {
    return {
      userColumns: [],
      userTotalColumns: [],
      name: 'dispensing.task.list',
      tableChecked: []
    }
  },
  created () {
    this.userColumns = this.handelCol(columns)
    this.userTotalColumns = this.handelCol(totalcolumns)
    if (this.pageType === 4) this.userTotalColumns.unshift(gatherCol)
  },
  methods: {
    updateAllColumn () {
      this.$emit('update-all-column')
    },
    totalObj (data) {
      let errTotal = []
      let cancelTotal = []
      data.map((item, index) => {
        if (item.identification || item.shortage === 23) {
          errTotal.push({ ...item })
        }
        if (item.status === 5) {
          cancelTotal.push({ ...item })
        }
      })
      return { errTotal, cancelTotal }
    },
    handelShowCheckbox (data) {
      if (this.pageType === 1) {
        return true
      } else if (this.pageType === 2) {
        let unCheckCol = data.find((item, index) => {
          return (item.identification || item.shortage === 23 || item.status === 5)
        })
        if (unCheckCol) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    getNewCol () {
      if (this.userColumns.length === 0) {
        this.userColumns = this.handelCol(columns)
      }
      this.userColumns[0] = firstCol
      return this.userColumns
    },
    handelCol (columns) {
      let tempCol = []
      columns.forEach((item, index) => {
        let tempitem = HospitalColumns.find((hitem, index) => {
          return hitem.prop === item.prop && !item.render
        })
        if (tempitem) {
          tempCol.push(tempitem)
        } else {
          tempCol.push(item)
        }
      })
      return tempCol
    },
    resSelect (data) {
      this.tableChecked = data
    },
    goDispensing (data, callback) {
      this.$emit('goDispensing', data, callback)
    },
    goSend (data, callback) {
      this.$emit('goSend', data, callback)
    }
  }
}
</script>

<style  lang="less" scoped>
  .dis-plist-item{
    background: #fff;
    padding: 10px;
    border-bottom: solid 1px #ededed;
    /deep/ .el-table{
      margin-top: 0;
    }
    position: relative;
    .dis-house-title{
      position: absolute;
      right:0;
      top: 15px;
      background: #1C7BEF;
      height: 32px;
      line-height: 32px;
      color: #fff;
      border-radius: 100px 0 0 100px;
      font-size: 14px;
      padding: 0 8px;
    }
    .dis-btn-box{
      text-align: center;
    }
  }
</style>
