<!-- 支付流水查询  -->
<template>
  <div class="settle">
    <div class="layout_inner">
      <div class="main-head">
        <ever-form2 :schema="querySchema" ref="form" :span="6" v-model="queryObj" @query="query">
          <template slot="visitStartDate">
            <ever-range-picker
              width="380px"
              :customWidth="'380px'"
              dateType="daterange"
              :autoWidth="false"
              :clearable="true"
              :start.sync="queryObj.createTimeStart"
              :end.sync="queryObj.createTimeEnd"
              :outformat="`YYYY-MM-DD HH:mm:ss`"
              :default-time="['00:00:00', '23:59:59']"
            ></ever-range-picker>
          </template>
          <template slot="visitStartDatecll">
            <ever-range-picker
              width="380px"
              :customWidth="'380px'"
              dateType="daterange"
              :autoWidth="false"
              :clearable="true"
              :start.sync="queryObj.completeTimeStart"
              :end.sync="queryObj.completeTimeEnd"
              :outformat="`YYYY-MM-DD HH:mm:ss`"
              :default-time="['00:00:00', '23:59:59']"
            ></ever-range-picker>
          </template>
          <template slot="exportbtn">
            <div style="text-align:center">
              <el-button type="primary" size="small" @click="query">查询</el-button>
              <el-button type="primary" size="small" @click="resetForm">重置</el-button>
            </div>
          </template>
          <div></div>
        </ever-form2>
      </div>
      <div class="f14">
        支付流水金额：<b class="cRed mr10" v-if="fee !== ''">{{fee | formatToFinacial}}</b>
        <span v-if="type == 1">支付请求金额：<b class="cRed" v-if="channelRefundFee !== ''">{{channelRefundFee | formatToFinacial}}</b></span>
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
        border
        :data="tableData"
        :columns="tableColumns">
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
import payApi from '@/rcm/store/settlepaymentapi.js'
import list from '@/util/list'
import Vue from 'vue'
import { DOWNLOAD_FILE } from '@/warehouse/views/util/constant'
const filters = Vue.prototype.$filters
let querySchema = [
  {
    name: 'settleCode',
    label: '结算单号'
  },
  {
    name: 'chargeid',
    label: '支付请求号'
  },
  {
    label: '患者姓名',
    name: 'patientId',
    comp: 'ever-patient-select'
  },
  {
    label: '支付类型',
    name: 'payType',
    comp: 'ever-select',
    props: {
      options: [{
        id: '0',
        name: '收费'
      },
      {
        id: '1',
        name: '退费'
      }]
    }
  },
  {
    label: '支付方式',
    name: 'payMethod',
    comp: 'ever-select',
    props: {
      options: []
    }
  },
  {
    label: '支付状态',
    name: 'payState',
    comp: 'ever-select',
    props: {
      options: [
        {id: '0', name: '支付中'},
        {id: '1', name: '支付成功'},
        {id: '2', name: '支付失败'},
        {id: '3', name: '已关闭'},
        {id: '4', name: '转入退款'},
        {id: '5', name: '已撤销(刷卡支付)'},
        {id: '6', name: '退款成功'}
      ]
    }
  },
  {
    name: 'visitStartDate',
    label: '创建时间',
    comp: 'custom',
  },
  {
    name: 'visitStartDatecll',
    label: '完成时间',
    comp: 'custom',
  },
  {
    label: '',
    labelWidth: '15px',
    name: 'exportbtn',
    comp: 'custom',
    span: 24
  }
]
const columns = [
  {
    prop: 'flowNumber',
    label: '支付流水号',
    width: 180
  },
  {
    prop: 'flowFee',
    label: '支付流水金额',
    align: 'right',
    formatter: ({row}) => {
      return filters.formatToFinacial(row.flowFee)
    },
    width: 110
  },
  {
    prop: 'chargeid',
    label: '支付请求号',
    width: 200
  },
  {
    prop: 'channelRefundFee',
    label: '支付请求金额',
    align: 'right',
    mate: 1,
    formatter: ({row}) => {
      return row.channelRefundFee ? filters.formatToFinacial(row.channelRefundFee) : '--'
    },
    width: 110
  },
  {
    prop: 'channelOrder',
    label: '渠道订单号',
    formatter: ({row}) => {
      return row.channelOrder === '0' ? '--' : row.channelOrder
    },
    width: 140
  },
  {
    prop: 'channelBizNo',
    label: '渠道商户号',
    width: 140
  },
  {
    prop: 'payStateName',
    label: '支付状态'
  },
  {
    prop: 'payMethodName',
    label: '支付方式'
  },
  {
    prop: 'payTypeName',
    label: '支付类型'
  },
  {
    prop: 'patientName',
    label: '患者姓名'
  },
  {
    prop: 'sex',
    label: '性别',
    formatter: ({row}) => {
      return filters.formatSex(row.sex)
    },
    mate: 1,
    width: 50
  },
  {
    prop: 'mobile',
    label: '电话',
    width: 110,
    mate: 1
  },
  {
    prop: 'settleCode',
    label: '结算单号',
    width: 160
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 155
  },
  {
    prop: 'completeTime',
    label: '完成时间',
    width: 155
  },
]
export default {
  mixins: [list],
  props: {
    // 区分门诊/住院
    type: {
      type: Number,
      default: 1
    }
  },
  data () {
    var queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.requestSwitch = true
    return {
      querySchema,
      queryObj: Object.assign(queryObj, {type: this.type}),
      columns,
      api,
      listApiName: 'searchPayTradeLog',
      tableData: [],
      fee: '',
      channelRefundFee: ''
    }
  },
  async mounted () {
    // 获取支付方式
    await payApi.payment().then(res => {
      if (res.data && res.data.default) {
        this.$ever.getFieldFromSchema(this.querySchema, 'payMethod').props.options = res.data.default.map(item => {
          return {id: item.value + '', name: item.name}
        })
      }
    })
    this.query()
  },
  computed: {
    tableColumns () {
      return this.type === 2 ? this.columns.filter(item => !item.mate) : this.columns
    }
  },
  methods: {
    query () {
      this.list()
      this.getSumPayTradeLogFee()
    },
    // 导出数据
    downFile () {
      var params = Object.assign({}, this.queryObj)
      for (let key in params) {
        if (params[key] === '') {
          delete params[key]
        }
      }
      this.$refs.childMethodt.loading = true
      api.exportPayTradeLog(params).then(res => {
        if (res) {
          this.$refs.childMethodt.downfile(DOWNLOAD_FILE + res.data.fileName)
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
      this.queryObj.createTimeStart = ''
      this.queryObj.createTimeEnd = ''
      this.queryObj.completeTimeStart = ''
      this.queryObj.completeTimeEnd = ''
      this.fee = ''
      this.channelRefundFee = ''
      this.query()
    },
    // 合计获取
    getSumPayTradeLogFee () {
      var params = Object.assign({}, this.queryObj)
      for (let key in params) {
        if (params[key] === '') {
          delete params[key]
        }
      }
      api.getSumPayTradeLogFee(params).then(res => {
        if (res) {
          this.fee = res.fee
          this.channelRefundFee = res.channelRefundFee
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">

</style>
