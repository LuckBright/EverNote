<template>
  <div class="layout_inner">
    <ever-form2
      ref="form"
      :schema="schema"
      v-model="queryObj"
      :inline="true"
      :isQuery="true"
      @query="list(true)"
    >
      <template slot="default">
        <el-button size="small" type="primary" @click="list(true)">查询</el-button>
        <el-button size="small" @click="reset">重置</el-button>
      </template>
    </ever-form2>
    <div class="flex_col_1_hidden main-wrap">
      <el-table
        :data="tableData"
        v-loading="loading"
        :show-summary="true"
        :summary-method="getSummaries"
      >
        <el-table-column sortable label="收费员" prop="tollCollectorName"></el-table-column>
        <el-table-column sortable label="日结类型" prop="typeName"></el-table-column>
        <el-table-column sortable label="日结单号" prop="code"></el-table-column>
        <el-table-column sortable label="日结时间" prop="currentDateTime"></el-table-column>
        <el-table-column
          sortable
          :sort-method="settleCashSortMethod"
          label="结算单现金"
          prop="settlementCash"
          align="right"
        >
          <template slot-scope="scope">{{scope.row.settlementCash | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column
          sortable
          :sort-method="dailyCashSortMethod"
          label="日结现金"
          prop="dailyCash"
          align="right"
        >
          <template slot-scope="scope">{{scope.row.dailyCash | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column
          sortable
          :sort-method="dailyPaymentCashSortMethod"
          label="缴款现金"
          prop="dailyPaymentCash"
          align="right"
        >
          <template slot-scope="scope">{{scope.row.dailyPaymentCash | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column sortable label="状态" prop="statusName"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleDetail(scope.row)">详情</el-button>
            <el-button type="text" size="small" @click="cancelPament(scope.row)">取消缴款</el-button>
          </template>
        </el-table-column>
      </el-table>
      <ever-pagination
        :current="current"
        :page-sizes="pageSizes"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
      ></ever-pagination>
    </div>
    <dailyDetail :visible.sync="dailyShow"></dailyDetail>
  </div>
</template>

<script>
import api from '@/rcm/store/dailypament/dailypamenthistory.js'
import list from '@/util/list'
import dailyDetail from '@/rcm/page/dailypament/dailydetail.vue'
let schema = [{
  label: '收费员',
  name: 'tollCollectorId',
  comp: 'ever-staff-select',
},
{
  label: '日结日期',
  name: 'dailyDate',
  comp: 'everRangePicker',
  props: {
    dateType: 'datetimerange',
    defaultTime: [],
    outformat: 'YYYY-MM-DD HH:mm:ss',
    autoWidth: true
  }
}]

export default {
  mixins: [list],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    let dateNow = Date.now()
    let dateStart = this.$moment(dateNow).format('YYYY-MM-DD 00:00:00')
    let dateEnd = this.$moment(dateNow).format('YYYY-MM-DD 23:59:59')
    queryObj.dailyDate = [dateStart, dateEnd]
    return {
      schema,
      queryObj,
      tableData: [],
      dailyShow: false,
      //  t1("1","门诊"), t2("2","挂号"), t3("3","预交金"), t4("4","住院结算"), t5("5","住院");
      dailyMap: {
        '1': '1',
        '2': '3',
        '3': '0',
        '4': '1',
        '5': ''
      }
    }
  },
  methods: {
    list (flag) {
      this.loading = true
      let [dateTimeStart, dateTimeEnd] = this.queryObj.dailyDate
      if (flag) {
        this.current = 1
        this.offset = 0
      }
      let params = Object.assign(this.queryObj, { dateTimeStart, dateTimeEnd, status: '3', pagesize: this.pagesize, offset: this.offset })
      api.list(params).then(res => {
        this.loading = false
        this.tableData = res.data
        this.totalCount = res.totalCount
      }, err => {
        this.loading = false
        console.log('err', err)
      })
    },
    reset () {
      this.$refs.form.resetForm()
    },
    handleDetail (row) {
      let queryObj = {
        isShowInDialog: true, // 显示在弹窗标识
        dailyType: row.type, // 日结单类型
        id: row.closeId, // 日结单id
        operator: row.tollCollectorName, // 收费员姓名
        operatorId: row.tollCollectorId // 收费员id
      }
      this.$router.replace({
        path: `/financial/dailyPamentHistory/${this.dailyMap[row.type]}`,
        query: queryObj
      })
      this.dailyShow = true
    },
    cancelPament (row) {
      api.cancelPay({ dailySettlementNo: row.code }).then(res => {
        this.$messageTips(this, 'success', '操作成功')
        this.list()
      }, err => {
        console.log('err', err)
      })
    },
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = this.$filters.formatToFinacial(sums[index])
        } else {
          sums[index] = ''
        }
      })

      return sums
    },
    nameSortMethod (a, b) {
      return a.tollCollectorName.localeCompare(b.tollCollectorName)
    },
    settleCashSortMethod (a, b) {
      return a.settlementCash - b.settlementCash
    },
    dailyCashSortMethod (a, b) {
      return a.dailyCash - b.dailyCash
    },
    dailyPaymentCashSortMethod (a, b) {
      return a.dailyPaymentCash - b.dailyPaymentCash
    }
  },
  components: {
    dailyDetail
  }
}
</script>
