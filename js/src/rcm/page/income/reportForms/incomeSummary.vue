<template>
  <div>
    <div class="layout_inner">
      <ever-form2
        :schema="querySchema"
        v-model="queryObj"
        ref="form"
        :inline="true"
        :is-query="true"
        @query="query(true)"
      >
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="query(true)">查询</el-button>
          </el-form-item>
          <el-form-item class="fr">
            <el-button type="primary" @click="exportTable">导出</el-button>
          </el-form-item>
        </template>
      </ever-form2>
      <div class="main-wrap" v-loading.body="loading">
        <el-table
          v-if="tableData && tableData.length"
          :data="tableData"
          style="width: 100%"
          show-summary
          :summary-method="summaryFn"
          border
          id="pTable"
        >
          <el-table-column
            show-overflow-tooltip
            prop="orderDeptName"
            fixed="left"
            min-width="130"
            label="科室/收费类别"
          ></el-table-column>
          <template v-if="dataTitle && dataTitle.length">
            <el-table-column
              v-for="(item,index) in dataTitle"
              :key="index"
              show-overflow-tooltip
              :prop="item"
              :label="item"
              align="right"
              min-width="130"
            >
              <template slot-scope="scope">{{scope.row[item] | formatToFinacial}}</template>
            </el-table-column>
          </template>
          <el-table-column
            show-overflow-tooltip
            prop="total"
            fixed="right"
            label="小计"
            align="right"
            min-width="130"
          >
            <template slot-scope="scope">{{scope.row.total | formatToFinacial}}</template>
          </el-table-column>
        </el-table>
        <ever-no-data v-else></ever-no-data>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/rcm/store/income/reportForms'
import { wrapTable } from '@/util/common'
import 'table2excel'
const querySchema = [
  {
    label: '结算日期',
    name: 'daterange',
    comp: 'ever-range-picker',
    props: {
      outformat: 'YYYY-MM-DD HH:mm:ss',
      dateType: 'datetimerange',
      autoWidth: true,
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(new Date(new Date().toLocaleDateString()).getTime())
              end.setTime(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1000)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    },
    span: 12
  },
]

export default {
  data () {
    let obj = this.$ever.createObjFromSchema(querySchema)
    // 20200810, 将收费类型隐藏，写死成应收
    obj.queryFeeTypeId = '1'
    return {
      tableData: [],
      querySchema: querySchema,
      queryObj: obj,
      api,
      loading: false,
      dialogVisible: false,
      feeTypeOpt: [],
      dataTitle: [],
      wrapTable
    }
  },
  async created () {
    let start = this.$moment().subtract(7, 'd').startOf('day')
    let end = this.$moment().endOf('day')
    this.queryObj.daterange = [start, end]
    await this.getSummaryList()
  },
  methods: {
    formatMoneyTo2 (money, n) {
      if (!n) {
        n = 2
      }
      money = parseFloat(money)
      if (!money) {
        money = 0
      }
      n = n > 0 && n <= 20 ? n : 2
      let absicon = ''
      if (parseFloat(money) !== Math.abs(money) && money !== Math.abs(money) && money !== 0 && money !== '0.00') {
        absicon = '-'
      }
      money = parseFloat((money + '').replace(/[^\d.]/g, '')).toFixed(n) + ''
      var l = money.split('.')[0].split('').reverse()
      var r = money.split('.')[1]
      var t = ''
      for (var i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? '' : '')
      }
      return absicon + t.split('').reverse().join('') + '.' + r
    },
    async query () {
      await this.getSummaryList()
    },
    async getSummaryList () {
      this.loading = true
      let params = this.queryObj
      for (let key in params) {
        if (params[key] === '' || key === 'requestSwitch') {
          delete params[key]
        }
      }
      if (params.daterange.length <= 0) {
        delete params.settleStartDate
        delete params.settleEndDate
      } else {
        params.settleStartDate = this.$moment(this.queryObj.daterange[0]).format('YYYY-MM-DD HH:mm:ss')
        params.settleEndDate = this.$moment(this.queryObj.daterange[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      const result = await api.summaryList(params)
      this.tableData = []
      this.dataTitle = []
      this.loading = false
      if (result && result.head && result.head.errCode === 0 && result.data && result.dataTitle) {
        this.dataTitle = result.dataTitle
        result.data.map(item => {
          item.total = 0
          for (let sitem in item) {
            if (sitem !== 'orderDeptName' && sitem !== 'total') {
              item[sitem] = Number(item[sitem]).toFixed(2)
              item.total = (Number(item.total) + Number(item[sitem])).toFixed(2)
            }
          }
          return item
        })
        this.tableData = result.data
      }
    },
    exportTable () {
      this.wrapTable('pTable')
      const Table2Excel = window.Table2Excel
      const table2Excel = new Table2Excel({ defaultFileName: '门诊收入汇总表' })
      table2Excel.export(document.getElementById('exportTable'))
    },
    summaryFn (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '小计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        sums[index] = values.reduce((prev, curr) => {
          const value = Number(curr)
          if (!isNaN(value)) {
            return prev + curr
          } else {
            return prev
          }
        }, 0)
        sums[index] = this.formatMoneyTo2(sums[index])
      })
      return sums
    }
  }
}
</script>
