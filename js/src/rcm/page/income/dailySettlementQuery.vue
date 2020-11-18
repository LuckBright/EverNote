<template>
  <div class="layout_inner">
    <ever-form2
      :schema="querySchema"
      v-model="queryObj"
      ref="form"
      :inline="true"
      :is-query="true"
      @query="list(true)"
    >
      <template slot="default">
        <el-form-item>
          <el-button type="primary" @click="list(true)">查询</el-button>
        </el-form-item>
        <el-form-item class="fr">
          <!-- <el-button @click="printTable('printWrap')">打印</el-button> -->
          <doc-download
            @downFile="downFile"
            class="docdownload"
            ref="childMethods"
            btnTxt="导出"
            style="float:right;"
          ></doc-download>
        </el-form-item>
      </template>
    </ever-form2>
    <div class="main-wrap">
      <div id="printWrap">
        <el-table
          v-loading.body="loading"
          :data="tableData"
          style="width: 100%"
          show-summary
          :summary-method="getSummaries"
          id="pTable"
        >
          <el-table-column prop="code" label="日结流水号" width="190">
            <template slot-scope="scope">
              <router-link :to="routePath(scope.row)">{{scope.row.code}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop="feeType" label="日结类型">
            <template slot-scope="scope">{{SETTLEMENT_TABLE_TYPE[scope.row.feeType]}}</template>
          </el-table-column>
          <el-table-column prop="operatorName" label="收费员" width="90" show-overflow-tooltip></el-table-column>
          <el-table-column prop="closeTime" label="结账日期" width="160" show-overflow-tooltip></el-table-column>
          <el-table-column prop="docCount" label="结算单数量" align="right" min-width="100"></el-table-column>
          <el-table-column prop="returnCount" label="退费数量" align="right"></el-table-column>
          <template v-if="payTitles && payTitles.length">
            <el-table-column
              v-for="(item,index) in payTitles"
              :key="index"
              show-overflow-tooltip
              :label="item"
              align="right"
              min-width="120"
            >
              <template
                slot-scope="scope"
              >{{(scope.row.payRow && scope.row.payRow[item]) | formatToFinacial}}</template>
            </el-table-column>
          </template>
          <!-- <el-table-column prop="totalFee" label="合计" align="right" min-width="120">
            <template slot-scope="scope">{{scope.row.total | formatToFinacial}}</template>
          </el-table-column>-->
        </el-table>
      </div>
      <el-row type="flex" justify="end">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
          v-if="pageInit"
        ></ever-pagination>
      </el-row>
    </div>
  </div>
</template>

<script>
import api from '@/rcm/store/income/dailySettlementQuery'
import list from '@/util/list'
import { SETTLEMENT_TYPE, wrapTable, SETTLEMENT_TABLE_TYPE } from '@/util/common'
import globalUrlMap from '@/login/store/globalurls'

let querySchema = []
let schemaOR = [
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
  {
    label: '日结类型',
    name: 'feeType',
    comp: 'ever-select',
    props: {
      placeholder: '日结类型',
      options: SETTLEMENT_TYPE
    }
  }
]
let schemaMarketing = [
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
  }
]
export default {
  mixins: [list],
  data () {
    querySchema = this.createObject().querySchema
    let queryObj = this.createObject().queryObj
    let start = this.$moment().subtract(7, 'd').startOf('day')
    let end = this.$moment().endOf('day')
    queryObj.daterange = [start, end]
    queryObj.start = start.format('YYYY-MM-DD HH:mm:ss')
    queryObj.end = end.format('YYYY-MM-DD HH:mm:ss')
    return {
      tableData: [],
      payTitles: [],
      totalCount: 0,
      querySchema,
      queryObj,
      api,
      isMall: this.$route.params.feeType === '7',
      dialogVisible: false,
      feeTypeOpt: [],
      printParams: {
        size: 'A4',
        dir: 'landscape',
        margin: [0.5]
      },
      sums: {},
      pageInit: true,
      SETTLEMENT_TYPE,
      SETTLEMENT_TABLE_TYPE,
      wrapTable
    }
  },
  created () {
    this.$route.params.feeType === '7' ? this.queryObj.feeType = 7 : this.queryObj.feeType = ''
  },
  methods: {
    createObject () { // 初始创建schema&obj
      this.$route.params.feeType === '7' ? querySchema = schemaMarketing : querySchema = schemaOR
      return {
        querySchema,
        queryObj: this.$ever.createObjFromSchema(querySchema)
      }
    },
    getSummaries (params) {
      let that = this
      const columns = params.columns
      const sums = []
      if (columns && columns[0]) {
        columns.forEach(function (v, index) {
          if (index === 0) {
            sums[index] = '总合计'
          } else if (index === 1 || index === 2 || index === 3) {
            sums[index] = '--'
          } else if (index === 4) {
            sums[index] = that.sums.docCount
          } else if (index === 5) {
            sums[index] = that.sums.returnCount
          } else if (v.label === '合计') {
            sums[index] = that.formatMoneyTo2(that.sums.total)
          } else {
            that.payTitles && that.payTitles.forEach(function (item) {
              if (item === v.label) {
                sums[index] = that.formatMoneyTo2(that.sums.payRow[item])
              }
            })
          }
        })
      }
      return sums
    },
    list () {
      let params = {}
      let url = this.isMall ? 'mallList' : 'list'
      params = Object.assign({}, this.queryObj)
      params.offset = this.offset
      params.pagesize = this.pagesize
      this.loading = true
      for (let key in params) {
        if (params[key] === '' || key === 'requestSwitch') {
          delete params[key]
        }
      }
      if (!params.daterange) {
        delete params.start
        delete params.end
      } else {
        params.start = params.daterange.length ? this.$moment(params.daterange[0]).format('YYYY-MM-DD HH:mm:ss') : ''
        params.end = params.daterange.length ? this.$moment(params.daterange[1]).format('YYYY-MM-DD HH:mm:ss') : ''
      }
      api[url](params).then(result => {
        if (result.head.errCode === 0) {
          this.tableData = result.data
          this.payTitles = result.payTitles
          this.sums = Object.assign({}, result.total)
          this.totalCount = result.totalCount
          this.loading = false
        }
      }).catch((reject) => {
        this.loading = false
      })
    },
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
        t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '')
      }
      return absicon + t.split('').reverse().join('') + '.' + r
    },
    async downFile () {
      let params = {}
      let url = this.isMall ? 'mallExportList' : 'exportList'
      params = Object.assign({}, this.queryObj)
      for (let key in params) {
        if (params[key] === '') {
          delete params[key]
        }
      }
      if (!params.daterange) {
        delete params.start
        delete params.end
      } else {
        params.start = this.$moment(params.daterange[0]).format('YYYY-MM-DD HH:mm:ss')
        params.end = this.$moment(params.daterange[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      const result = await api[url](params)
      if (result && result.head && result.head.errCode === 0 && result.data && result.data.fileId) {
        let filename = this.$ever.api + globalUrlMap.phoneMapping.download.url + result.data.fileId
        window.open(filename)
        // this.$refs.childMethods.downfile(filename)
      }
    },
    // (4.11.1) by lvjiangtao@everjiankang.com 打印方法清理，入口不存在方法注释掉
    // printTable (id) {
    //   this.wrapTable(id, true, '日结列表')
    //   doPrint(this, 'exportTable', this.printParams)
    // },
    changeRouter (cur) {
      let start = this.$moment().subtract(7, 'd').startOf('day')
      let end = this.$moment().endOf('day')
      this.queryObj.daterange = [start, end]
      this.queryObj.start = start.format('YYYY-MM-DD HH:mm:ss')
      this.queryObj.end = end.format('YYYY-MM-DD HH:mm:ss')
      this.tableData = []
      this.offset = 0
      this.pagesize = 20
      this.totalCount = 0
      this.pageInit = false
      window.setTimeout(() => {
        this.pageInit = true
      }, 100)
      if (cur.feeType === '7') {
        this.querySchema = [querySchema[0]]
        this.queryObj.feeType = 7
        this.isMall = true
      } else if (cur.feeType !== '7') {
        this.querySchema = querySchema
        this.queryObj.feeType = ''
        this.isMall = false
      }
      this.list()
    },
    routePath (row) {
      if (this.isMall) {
        return `/rcm/daily/rcmSettlement?id=${row.code}&closeId=${row.id}`
      }
      return '/rcm/daily/settlement/' + row.feeType + '?id=' + row.id
    }
  },
  watch: {
    '$route.params': {
      async handler (cur, old) {
        this.changeRouter(cur)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "src/assets/css/spe_table";
</style>
<style scoped>
.main-option .left {
  float: left;
  font-size: 18px;
  font-weight: bold;
  line-height: 36px;
}
.main-option .right {
  float: right;
}
.layout_box .main-head /deep/ .el-form {
  margin-bottom: 0;
  border-bottom: none;
}
.main-head {
  margin-bottom: 0;
}
.main-head /deep/ .form.ever_query_from .el-form-item {
  margin-bottom: 0;
}
</style>

