<!-- 住院费用明细查询  -->
<template>
  <div class="settle">
    <div class="layout_inner">
      <div class="main-head">
        <ever-form2 ref="form" :schema="querySchema" :span="6" v-model="queryObj" @query="query">
          <template slot="visitStartDate">
            <ever-range-picker
              width="380px"
              :customWidth="'380px'"
              dateType="daterange"
              :autoWidth="false"
              :clearable="true"
              :start.sync="queryObj.settleTimeStart"
              :end.sync="queryObj.settleTimeEnd"
              :outformat="`YYYY-MM-DD HH:mm:ss`"
              :default-time="['00:00:00', '23:59:59']"
            ></ever-range-picker>
          </template>
          <template slot="exportbtn">
            <el-button type="primary" size="small" @click="query">查询</el-button>
            <el-button type="primary" size="small" @click="resetForm">重置</el-button>
          </template>
          <div></div>
        </ever-form2>
      </div>
      <div class="f14 mt10">
        费用总额：<b class="cRed mr10" v-if="fee">{{fee | formatToFinacial}}</b>
        <doc-download
          class="fr mb10"
          :size="'samll'"
          @downFile="downFile"
          @exportStatus="changeStatus"
          ref="childMethodt"
          btnTxt="导出"
        ></doc-download>
      </div>
      <!-- 列表数据 -->
      <ever-table
        :columns="columns"
        :data="tableData"
        border
        :loading="loading"
        :is-drag-table="true"
        table-default-cell-value=""
        :special-cell-config="specialCellConfig"
        :config-option="configOption"
        :is-record-url-params="false">
      </ever-table>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current">
      </ever-pagination>
    </div>
  </div>
</template>
<script>
import api from '@/rcm/store/paymentflowapi.js'
import list from '@/util/list'
import { settleType } from '@/rcm/page/hospitalization/hospitalization-config.js'
import { DOWNLOAD_FILE } from '@/warehouse/views/util/constant'
import { HOSPITAL_EXPENSE_DETAILS } from '@/util/table-config'
import Vue from 'vue'
const filters = Vue.prototype.$filters
let querySchema = [
  {
    name: 'settleCode',
    label: '结算单号'
  },
  {
    label: '患者姓名',
    name: 'patientId',
    comp: 'ever-patient-select'
  },
  {
    name: 'ipNo',
    label: '住院号'
  },
  {
    name: 'itemId',
    label: '项目名称', // 项目名称
  },
  {
    name: 'itemClassId',
    label: '业务分类',
    comp: 'sys-type',
    props: {
      code: 'THC_RCM_FIN_TYPE',
    }
  },
  {
    name: 'orderDeptId',
    label: '开单科室',
    comp: 'ever-subject-select',
    props: {
      params: {
      },
      type: 'select',
      fields: 'id'
    }
  },
  {
    name: 'exeDept',
    label: '执行科室',
    comp: 'ever-subject-select',
    props: {
      params: {
      },
      type: 'select',
      fields: 'id'
    }
  },
  {
    name: 'settlementType',
    label: '结算类型',
    comp: 'ever-select',
    props: {
      options: [...settleType]
    }
  },
  {
    name: 'visitStartDate',
    label: '结算时间',
    comp: 'custom',
  },
  {
    label: '',
    labelWidth: '15px',
    name: 'exportbtn',
    comp: 'custom',
  }
]
const columns = [
  {
    prop: 'settleCode',
    label: '结算单号',
    width: 180,
    required: true
  },
  {
    prop: 'settlementName',
    label: '结算类型'
  },
  {
    prop: 'ipNo',
    label: '住院号',
    width: 180
  },
  {
    prop: 'patientName',
    label: '患者姓名',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'itemClassName',
    label: '业务分类'
  },
  {
    prop: 'itemName',
    label: '项目名称',
    width: 150
  },
  {
    prop: 'unitPrice',
    label: '项目单价',
    align: 'right',
    formatter: ({row}) => {
      return filters.formatToFinacial(row.unitPrice)
    },
    required: true
  },
  {
    prop: 'quantity',
    label: '数量',
    align: 'right',
    required: true
  },
  {
    prop: 'fee',
    label: '项目合计',
    align: 'right',
    formatter: ({row}) => {
      return filters.formatToFinacial(row.fee)
    },
    required: true
  },
  {
    prop: 'orderDeptName',
    label: '开单科室',
    required: true
  },
  {
    prop: 'exeDeptName',
    label: '执行科室'
  },
  {
    prop: 'createName',
    label: '收费员'
  },
  {
    prop: 'settleTime',
    label: '结算时间',
    width: 160
  },
]
export default {
  mixins: [list],
  data () {
    var queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.requestSwitch = true
    return {
      querySchema,
      queryObj,
      columns,
      configOption: {
        id: HOSPITAL_EXPENSE_DETAILS
      },
      specialCellConfig: {
        prop: 'visitType',
        value: 1,
        className: 'danger',
      },
      api,
      listApiName: 'selectFeeDetailInfo',
      tableData: [],
      fee: ''
    }
  },
  methods: {
    // 导出数据
    downFile () {
      var params = Object.assign({}, this.queryObj)
      for (let key in params) {
        if (params[key] === '') {
          delete params[key]
        }
      }
      this.$refs.childMethodt.loading = true
      api.exportFeeDetailInfo(params).then(res => {
        if (res) {
          this.$refs.childMethodt.downfile(DOWNLOAD_FILE + res.fileName)
        }
        this.$refs.childMethodt.loading = false
      })
    },
    // 导出成功
    changeStatus (a) {
      if (a) {
        this.$messageTips(this, 'success', '导出盘点单成功')
      }
    },
    // 重置表单
    resetForm () {
      this.$refs.form.resetForm()
      this.queryObj.settleTimeStart = ''
      this.queryObj.settleTimeEnd = ''
      this.fee = ''
      this.query()
    },
    // 合计获取
    getSumFeeDetailInfoFee () {
      var params = Object.assign({}, this.queryObj)
      for (let key in params) {
        if (params[key] === '') {
          delete params[key]
        }
      }
      api.getSumFeeDetailInfoFee(params).then(res => {
        if (res) {
          this.fee = res.fee
        }
      })
    },
    query () {
      this.list()
      this.getSumFeeDetailInfoFee()
    }
  },
  mounted () {
    this.query()
  }
}
</script>
<style scoped lang="scss">

</style>
