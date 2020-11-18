<template>
  <div class="layout_inner flex_col_1_hidden main-wrap">
    <ever-form2 ref="form" :schema="schema" v-model="queryObj" :span="6">
      <template slot="btns">
        <el-button type="primary" size="small" @click="query(true)">查询</el-button>
        <el-button type="primary" size="small" @click="reset">重置</el-button>
      </template>
      <div></div>
    </ever-form2>
    <div class="f14 mt10">
        费用总额：<b class="cRed mr10" v-if="fee">{{fee | formatToFinacial}}</b>
    </div>
    <div class="tableContainer">
      <ever-table
        :columns="columns"
        :data="tableData"
        border
        :loading="loading"
        :is-drag-table="true"
        table-default-cell-value=""
        :special-cell-config="specialCellConfig"
        :config-option="configOption"
        :is-record-url-params="false"
      >
        <template slot="operateColumn" slot-scope="scope">
           <el-button type="primary" size="small" @click="showDetail(scope.row)">查看明细</el-button>
        </template>
      </ever-table>
      <div style="margin-top: 20px;">
        <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :pagesize="pagesize"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import list from '@/util/list'
import { settleStatus, settleType } from '@/rcm/page/hospitalization/hospitalization-config.js'
import { searchSettleInfo, searchSumSettleFee } from '@/rcm/store/hospital/hospital.js'
import medicalOrgSelect from '@/rcm/otmdiscomponent/medicalorgselect.vue'
import { HOSPITAL_SETTLE } from '@/util/table-config'

const schema = [{
  label: '患者姓名',
  name: 'patientId',
  comp: 'ever-patient-select-query'
},
{
  label: '住院号',
  name: 'ipNo',
},
{
  label: '结算单号',
  name: 'settleCode',
},
{
  label: '结算类型',
  name: 'settlementType',
  comp: 'ever-select',
  props: {
    options: settleType
  }
},
{
  label: '结算状态',
  name: 'status',
  comp: 'ever-select',
  props: {
    options: settleStatus
  }
},
{
  label: '结算时间',
  name: 'createTime',
  comp: 'everRangePicker',
  props: {
    defaultTime: [],
    outformat: 'YYYY-MM-DD HH:mm:ss',
    autoWidth: true
  }
},
{
  label: '出院时间',
  name: 'ipEndTime',
  comp: 'everRangePicker',
  props: {
    defaultTime: [],
    outformat: 'YYYY-MM-DD HH:mm:ss',
    autoWidth: true
  }
},
{
  label: '',
  name: 'btns',
  labelWidth: '15px',
  comp: 'custom'
}]
export default {
  mixins: [list],
  data () {
    const queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.requestSwitch = true
    return {
      schema,
      queryObj,
      api: {
        list: searchSettleInfo
      },
      columns: [],
      configOption: {
        id: HOSPITAL_SETTLE
      },
      specialCellConfig: {
        prop: 'visitType',
        value: 1,
        className: 'danger',
      },
      fee: 0
    }
  },
  created () {
    this.initColumns()
    this.query()
  },
  methods: {
    // 合计获取
    getSumFeeDetailInfoFee () {
      var params = Object.assign({}, this.queryObj)
      for (let key in params) {
        if (params[key] === '') {
          delete params[key]
        }
      }
      searchSumSettleFee(params).then(res => {
        if (res) {
          this.fee = res.data.fee
        }
      })
    },
    query () {
      this.queryList()
      this.getSumFeeDetailInfoFee()
    },
    queryList (flag) {
      const [createTimeStart, createTimeEnd] = this.queryObj.createTime
      const [ipEndTimeStart, ipEndTimeEnd] = this.queryObj.ipEndTime
      this.queryObj.createTimeStart = createTimeStart && this.$moment(createTimeStart).format('YYYY-MM-DD 00:00:00')
      this.queryObj.createTimeEnd = createTimeEnd && this.$moment(createTimeEnd).format('YYYY-MM-DD 23:59:59')
      this.queryObj.ipEndTimeStart = ipEndTimeStart && this.$moment(ipEndTimeStart).format('YYYY-MM-DD 00:00:00')
      this.queryObj.ipEndTimeEnd = ipEndTimeEnd && this.$moment(ipEndTimeEnd).format('YYYY-MM-DD 23:59:59')
      this.list(flag)
    },
    reset () {
      this.$refs.form.resetForm()
    },
    showDetail (row) {
      let queryParams = {
        patientId: row.patientId,
        ipNo: row.ipNo,
        settlementId: row.id,
        ipStatus: row.ipStatus
      }
      if (row.settlementType === 1) {
        queryParams.source = 'final'
      } else {
        queryParams.source = 'half'
      }
      this.$router.push({
        path: '/adt/hospitalSettle/settlementQuery/detail',
        query: queryParams
      })
    },
    initColumns () {
      this.columns = [
        {
          prop: 'settleCode',
          label: '结算单号',
          width: 160,
          required: true
        },
        {
          prop: 'totalFee',
          label: '费用总额',
          align: 'right',
          formatter: ({ value }) => {
            return this.$filters.formatToFinacial(value)
          },
          width: 130,
          required: true
        },
        {
          prop: 'status',
          label: '结算状态',
          width: 90,
          formatter: ({ value }) => {
            return this.$options.filters.settleStatus(value)
          },
          required: true
        },
        {
          prop: 'settlementType',
          label: '结算类型',
          width: 90,
          formatter: ({ value }) => {
            return this.$options.filters.settleType(value)
          }
        },
        {
          prop: 'ipNo',
          label: '住院号',
          width: 150
        },
        {
          prop: 'patientName',
          label: '患者姓名',
          width: 100,
          showOverflowTooltip: true
        },
        {
          prop: 'insuranceOrgName',
          label: '保险公司'
        },
        {
          prop: 'medPay',
          label: '医保支付',
          align: 'right',
          formatter: ({ value }) => {
            return this.$filters.formatToFinacial(value)
          },
          width: 130
        },
        {
          prop: 'totalDeposit',
          label: '冲预交金',
          align: 'right',
          formatter: ({ value }) => {
            return this.$filters.formatToFinacial(value)
          },
          width: 130
        },
        {
          prop: 'selfPay',
          label: '自付金额',
          align: 'right',
          formatter: ({ value }) => {
            return this.$filters.formatToFinacial(value)
          },
          width: 130
        },
        {
          prop: 'benefitFee',
          label: '优惠金额',
          align: 'right',
          formatter: ({ value }) => {
            return this.$filters.formatToFinacial(value)
          },
          width: 130
        },
        {
          prop: 'diffFee',
          label: '尾差金额',
          align: 'right',
          formatter: ({ value }) => {
            return this.$filters.formatToFinacial(value, 6)
          },
          width: 130
        },
        {
          prop: 'wipeOffFee',
          label: '抹零金额',
          align: 'right',
          formatter: ({ value }) => {
            return this.$filters.formatToFinacial(value)
          },
          width: 130
        },
        {
          prop: 'createByName',
          label: '收费员',
          width: 130
        },
        {
          prop: 'createTime',
          label: '结算时间',
          width: 160,
          required: true
        },
        {
          prop: 'ipEndTime',
          label: '出院时间',
          width: 160
        },
        {
          prop: 'payTime',
          label: '支付时间',
          width: 160
        },
        {
          prop: 'operateColumn',
          label: '操作',
          width: 100,
          undraggable: true,
          slot: 'operateColumn',
          fixed: 'right',
          required: true
        }
      ]
    }
  },
  filters: {
    settleStatus (val) {
      let itemIndex = settleStatus.find(item => item.id === `${val}`)
      return itemIndex && itemIndex.name
    },
    settleType (val) {
      let itemIndex = settleType.find(item => item.id === `${val}`)
      return itemIndex && itemIndex.name
    }
  },
  components: {
    medicalOrgSelect
  }
}
</script>
<style scoped>
.layout_inner {
  display: flex;
  flex-direction: column;
}
.tableContainer {
  margin-top: 20px;
  overflow: auto;
}
</style>
