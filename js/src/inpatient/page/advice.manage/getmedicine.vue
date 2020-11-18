<template>
  <div class="advice_get_medicine">
    <div class="layout_inner">
      <el-row class="main-head">
        <el-col :span="18">
          <ever-form2 :schema="querySchema" v-model="queryObj" :inline="true">
            <template slot="termTypes">
              <el-radio-group v-model="queryObj.termTypes">
                <el-radio :label="1">长嘱</el-radio>
                <el-radio :label="0">临嘱</el-radio>
                <el-radio :label="-1">全部</el-radio>
              </el-radio-group>
            </template>
            <div slot="default"></div>
          </ever-form2>
        </el-col>
        <el-col :span="6" class="alg_r">
          <el-button size="small" @click="printEvent(false)" :disabled="!selectData.length">打印领药单</el-button>
          <el-button type="primary" size="small" @click="submitEvent(false)" :disabled="isComfirm|| !selectData.length">批量提交</el-button>
        </el-col>
      </el-row>
      <div class="main-wrap">
        <advice-show-table
          ref="adviceShow"
          :visitType="3"
          :showData="tableData"
          :rowClass="rowClass"
          :columns="columns"
          :configOption="configOption"
          :contextList="contextList"
          :arraySpan="arraySpan"
          :noBorderSpan="noBorderSpan"
          :showCheckbox="true"
          @menu="getMenuList"
          @contextSelect="contextSelect"
          @selectionChange="selectionChange"
        ></advice-show-table>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/inpatient/store/advice/getmedicine'
import sysvalue from '@/warehouse/store/sysvalueapi'
// import list from '@/util/list'
import adviceShowTable from '@/inpatient/components/medical.orders/advice.show.table'
import { HOSPITAL_GETMEDICINE } from '@/util/table-config'
import { objFind } from '@/util/common'
import { singlePrint } from '@/inpatient/components/sendarea.print.js'

export default {
  // mixins: [list],
  props: {
    baseInfo: {
      type: Object,
      default: () => { return {} }
    }
  },
  data () {
    let querySchema = [
      {
        name: 'termTypes',
        label: '',
        comp: 'custom'
      },
      {
        name: 'planTime',
        label: '计划时间',
        comp: 'el-date-picker',
        props: {
          type: 'datetimerange',
          format: 'yyyy-MM-dd HH:mm',
          valueFormat: 'yyyy-MM-dd HH:mm',
          placeholder: ''
        }
      },
      {
        name: 'dispenseStatusList',
        label: '',
        comp: 'sys-select',
        props: {
          options: [],
          placeholder: '出库状态',
          field: {
            multiple: true,
            collapsetags: true
          }
        }
      }
    ]
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.termTypes = -1
    queryObj.planTime = []
    queryObj.dispenseStatusList = []
    return {
      api,
      sysvalue,
      querySchema,
      queryObj,
      tableData: [],
      selectData: [],
      selectIds: [],
      handleVisible: false,
      isComfirm: false,
      columns: [
        {
          prop: 'patientName',
          label: '患者信息',
          showOverflowTooltip: true,
          minWidth: '10%',
          formatter: ({value, row}) => {
            return (row.bedName ? row.bedName + ' ' : '') + value
          }
        },
        {
          prop: 'planTime',
          label: '计划时间',
          showOverflowTooltip: true,
          minWidth: '8%',
          formatter: ({value}) => {
            if (value) {
              return this.$moment(value).format('YYYY-MM-DD HH:mm') || ''
            } else {
              return ''
            }
          }
        },
        {
          prop: 'termType',
          label: '长/临',
          showOverflowTooltip: true,
          minWidth: '5%',
          formatter: ({value}) => {
            return value === 0 ? '临时' : '长期'
          }
        },
        {
          slot: 'doctorAdviceName',
          prop: 'doctorAdviceName',
          label: '名称',
          minWidth: '15%',
          undraggable: true,
          required: true
        },
        {
          prop: 'employName',
          label: '用法',
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          prop: 'measure',
          label: '剂量',
          showOverflowTooltip: true,
          minWidth: '8%',
          formatter: ({value, row}) => {
            return value + row.measureUnitName
          }
        },
        {
          prop: 'useFreqName',
          label: '频次',
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          prop: 'count',
          label: '领量',
          showOverflowTooltip: true,
          minWidth: '8%',
          formatter: ({value, row}) => {
            return value + row.countUnitName
          }
        },
        {
          prop: 'entrust',
          label: '嘱托',
          showOverflowTooltip: true,
          minWidth: '10%'
        },
        {
          prop: 'dispenseStatus',
          label: '出库状态',
          showOverflowTooltip: true,
          minWidth: '8%',
          formatter: ({value}) => {
            return this.sendStatusList[String(value)] || ''
          }
        }
      ],
      configOption: {id: HOSPITAL_GETMEDICINE},
      rowClass: 'getMedicineContextRow',
      arraySpan: ['patientName', 'planTime', 'employName', 'termType', 'useFreqName'],
      noBorderSpan: ['doctorAdviceName', 'measure', 'count', 'entrust', 'dispenseStatus'],
      contextList: [
        { id: '1', name: '提交', disabled: false, methodName: 'submitEvent' },
        { id: '2', name: '取消', disabled: false, methodName: 'cancelEvent' },
        { id: '3', name: '退库', disabled: false, methodName: 'refundEvent' },
        { id: '4', name: '打印', disabled: false, methodName: 'printEvent' }
      ],
      sendStatusList: {
        '3': '待提交',
        '0': '待出库',
        '190': '已出库',
        '70': '出库驳回',
        '150': '退库中',
        '160': '已退库',
        '180': '退库驳回'
      }
    }
  },
  components: {
    adviceShowTable    // 医嘱显示组件
  },
  created () {
  },
  mounted () {
    this.getOptions()
  },
  methods: {
    // 获取出库状态options
    getOptions () {
      let statusList = []
      Object.keys(this.sendStatusList).forEach(v => {
        statusList.push({id: v, name: this.sendStatusList[v]})
      })
      this.$ever.getFieldFromSchema(this.querySchema, 'dispenseStatusList').props.options = statusList
    },
    // 查询列表
    queryList () {
      if (this.queryObj.planTime && this.queryObj.planTime.length) {
        this.queryObj.planTimeFrom = this.queryObj.planTime[0]
        this.queryObj.planTimeEnd = this.queryObj.planTime[1]
      }
      if (this.queryObj.termTypes > -1) {
        this.queryObj.termType = String(this.queryObj.termTypes)
      } else if (this.queryObj.termType) {
        delete this.queryObj.termType
      }
      this.queryObj.hospitalizedNumber = this.baseInfo.hospitalizedNumber
      this.queryObj.patientName = this.baseInfo.patientName
      this.queryEvent()
    },
    async queryEvent () {
      let res = await api.list(this.queryObj)
      if (res && res.list && res.list.length) {
        this.tableData = res.list
      } else {
        this.tableData = []
      }
    },
    // table checkbox 回调事件
    selectionChange (val) {
      this.selectIds = []
      this.selectData = val
      if (val && val.length) {
        val.map(item => {
          this.selectIds.push(item.id)
        })
      }
    },
    // 右键操作按钮列表触发事件回调
    getMenuList ({index}) {
      this.contextList.forEach((v) => {
        v.disabled = !this.getStatusShow(this.fuziData[this.tableData[index].mainGroupId], index, v.id)
      })
      // 动态添加 坚持发药 按钮
      if (String(this.tableData[index].dispenseStatus) === '70') {
        if (!objFind(this.contextList, { id: '5' })) {
          this.contextList.splice(this.contextList.length - 2, 0, {id: '5', name: '坚持发药', disabled: false, methodName: 'insistDispense'})
        }
      } else {
        if (objFind(this.contextList, { id: '5' })) {
          this.contextList.splice(this.contextList.findIndex(val => { return val.id === '5' }), 1)
        }
      }
    },
    // 操作按钮显示判断逻辑
    getStatusShow (data, index, id) {
      // 待提交3、待出库0、已出库190、出库驳回70、退库中150、已退库160、退库驳回180
      if (id === '1') {
        // 待提交，出库驳回的，可提交
        let n1 = 0
        data.forEach(v => {
          if (String(v.dispenseStatus) === '3' || String(v.dispenseStatus) === '2') n1++
        })
        return data.length === n1
      } else if (id === '2') {
        // 已提交待出库的，可取消
        let n2 = 0
        data.forEach(v => {
          if (String(v.dispenseStatus) === '0') n2++
        })
        return data.length === n2
      } else if (id === '3') {
        // 已出库的，可退库
        let n3 = 0
        data.forEach(v => {
          if (String(v.dispenseStatus) === '190') n3++
        })
        return data.length === n3
      } else if (id === '4') {
        // 已提交待出库的，可打印
        let n4 = 0
        data.forEach(v => {
          if (String(v.dispenseStatus) === '0') n4++
        })
        return data.length === n4
      } else if (id === '5') {  // 坚持发药
        return true
      }
    },
    // 右键操作按钮列表点击回调
    contextSelect ({ item, index }) {
      this[item.methodName](this.tableData[index], index)
    },
    // 提交/批量提交
    async submitEvent (item, index) {
      let ids = []
      if (!item) {
        ids = this.selectIds
      } else {
        this.fuziData[item.mainGroupId].forEach(v => {
          ids.push(v.id)
        })
      }
      if (!ids || !ids.length) {
        return this.$messageTips(this, 'warning', '请选择要操作的医嘱', '提示')
      }
      let postdata = {
        ids: ids
      }
      const res = await api.submitMaterials(postdata)
      if (res && res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', '医嘱提交成功', '提示')
        this.queryEvent()
        this.isComfirm = false
      } else {
        this.isComfirm = false
      }
    },
    // 取消
    async cancelEvent (item, index) {
      let postdata = {
        ids: []
      }
      this.fuziData[item.mainGroupId].forEach(v => {
        postdata.ids.push(v.id)
      })
      const res = await api.cancelMaterials(postdata)
      if (res && res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', '医嘱取消成功', '提示')
        this.queryEvent()
      }
    },
    // 退库
    async refundEvent (item, index) {
      let postdata = {
        ids: []
      }
      this.fuziData[item.mainGroupId].forEach(v => {
        postdata.ids.push(v.id)
      })
      const res = await api.returnMaterials(postdata)
      if (res && res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', '医嘱退库成功', '提示')
        this.queryEvent()
      }
    },
    // 坚持发药
    async insistDispense (item, index) {
      let postdata = {
        ids: []
      }
      this.fuziData[item.mainGroupId].forEach(v => {
        postdata.ids.push(v.id)
      })
      const res = await api.confirmMaterials(postdata)
      if (res && res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', '操作成功', '提示')
        this.queryEvent()
        this.insistVisible = false
      } else {
        this.insistVisible = false
      }
    },
    // 打印退库单
    printEvent (item, index) {
      let ids = []
      if (item) {
        this.fuziData[item.mainGroupId].forEach(v => {
          ids.push(v.id)
        })
      } else {
        ids = this.selectIds
      }
      singlePrint('', {ids: ids})
    }
  },
  computed: {
    fuziData () {
      let obj = {}
      this.tableData.forEach(v => {
        if (obj[v.mainGroupId]) {
          obj[v.mainGroupId].push(v)
        } else {
          obj[v.mainGroupId] = [v]
        }
      })
      return obj
    }
  },
  watch: {
    'queryObj': {
      handler (val) {
        this.queryList()
      },
      deep: true
    },
    'baseInfo': {
      handler (val) {
        this.queryList()
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.advice_get_medicine {
  height: 100%;
  .layout_inner {
    padding: 0 0 0 10px;
    background: transparent;
    height: 100%;
    display: flex;
    flex-direction: column;
    .main-head {
      margin-top: 12px;
      /deep/.el-form {
        .el-radio-group {
          .el-radio {
            margin-right: 20px;
          }
        }
        .el-form-item {
          margin: 0 10px 2px 0;
        }
      }
      .alg_r {
        line-height: 30px;
      }
    }
    .main-wrap {
      overflow: auto;
    }
  }
}
</style>
