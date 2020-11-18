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
        <el-table-column
          sortable
          :sort-method="nameSortMethod"
          label="收费员"
          prop="tollCollectorName"
        ></el-table-column>
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
        <el-table-column sortable label="状态" prop="statusName"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleDetail(scope.row)">详情</el-button>
            <el-button
              type="text"
              size="small"
              v-if="scope.row.status=='2'"
              @click="handlePayment(scope.row)"
            >缴款</el-button>
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
import api from '@/rcm/store/dailypament/dailypament.js'
import list from '@/util/list'
import dailyDetail from '@/rcm/page/dailypament/dailydetail.vue'
let schema = [{
  label: '收费员',
  name: 'tollCollectorId',
  comp: 'ever-staff-select'
},
{
  label: '日期',
  name: 'dailyDate',
  comp: 'everRangePicker',
  props: {
    dateType: 'datetimerange',
    defaultTime: [],
    outformat: 'YYYY-MM-DD HH:mm:ss',
    autoWidth: true
  }
},
{
  label: '状态',
  name: 'status',
  comp: 'everSelect',
  props: {
    options: [],
    clearable: true,
    disabledOptions: [{ id: '3' }]
  }
}]
export default {
  mixins: [list],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.dailyDate = ['', '']
    return {
      schema,
      queryObj,
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
      let params = Object.assign(this.queryObj, { dateTimeStart, dateTimeEnd, pagesize: this.pagesize, offset: this.offset })
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
        path: `/financial/dailyPayment/${this.dailyMap[row.type]}`,
        query: queryObj
      })
      this.dailyShow = true
    },
    handlePayment (row) {
      let params = {
        dailySettlementNo: row.code,
        dailyPaymentAmount: row.dailyCash
      }
      api.payAction(params).then(res => {
        this.$messageTips(this, 'success', '操作成功')
        this.list()
      }, err => {
        console.log('err', err)
        this.$messageTips(this, 'error', '缴款失败，请稍后再试')
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
        // 有时候未日结的单子多，这两个字段一直为空，会给计算
        if (column.property === 'code' || column.property === 'currentDateTime') {
          sums[index] = ''
        } else {
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
    }
  },
  created () {
    api.getStatusList().then(res => {
      this.$ever.getFieldFromSchema(this.schema, 'status').props.options = res.data
    }, err => {
      console.log('err', err)
    })
  },
  components: {
    dailyDetail
  }
}
</script>
