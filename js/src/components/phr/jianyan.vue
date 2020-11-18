<template>
  <div class="box">
    <ever-form2 :schema="schema" v-model="queryObj" :inline="true">
      <template slot="applydate">
        <ever-range-picker
          date-type="datetimerange"
          :start.sync="queryObj.applicationStartTime"
          :end.sync="queryObj.applicationEndTime"
          start-placeholder="开始日期"
          auto-width="true"
          :outformat="`YYYY-MM-DD HH:mm:ss`"
          :default-time="['00:00:00', '23:59:59']"
        ></ever-range-picker>
      </template>
      <template slot="reportdate">
        <ever-range-picker
          dateType="datetimerange"
          :start.sync="queryObj.reportStartTime"
          :end.sync="queryObj.reportEndTime"
          :outformat="`YYYY-MM-DD HH:mm:ss`"
          :defaultTime="['00:00:00', '23:59:59']"
          autoWidth="true"
        ></ever-range-picker>
      </template>
      <template slot="default">
        <el-button size="small" @click="reset">重置</el-button>
      </template>
    </ever-form2>
    <div>
      <ever-table
        ref="table"
        :columns="columns"
        :data="tableData"
        @eventChange="eventChange"
        border
      >
        <template slot="inspectionServiceName">
          <el-table-column label="检验内容" prop="inspectionServiceName" show-overflow-tooltip>
            <template slot-scope="scope">
                <a
                  @click="showMore(scope.row)"
                  v-if="scope.row.status === '60'"
                  class="pointer"
                >{{scope.row.inspectionServiceName}}</a>
                <span v-else>{{scope.row.inspectionServiceName}}</span>
            </template>
          </el-table-column>
        </template>
      </ever-table>
      <el-row v-show="count > pagesize">
        <el-col :span="24" align="right">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[20, 50, 100]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="count"
          ></el-pagination>
        </el-col>
      </el-row>
    </div>
    <show-box :id.sync="id" :review="doctorReview"></show-box>
    <el-dialog :title="vs.title" :visible.sync="historyVisible" center width="50%">
      近
      <el-select v-model="times" size="small" class="number" @change="changeTimes">
        <el-option :value="5" :label="5"></el-option>
        <el-option :value="10" :label="10"></el-option>
        <el-option :value="15" :label="15"></el-option>
        <el-option v-show="total > 15" :value="total" :label="total"></el-option>
      </el-select>
      次 共{{total}}次
      <ever-table
        @row-click="showChart"
        :row-class-name="rowClass"
        :columns="vs.col"
        :data="vs.data"
      ></ever-table>
    </el-dialog>
    <el-dialog title="曲线图" :visible.sync="chartVisible" center width="50%">
      <vue-chart :row="chartRow" class="margin" :key="chartRow.inspectUnitCode"></vue-chart>
    </el-dialog>
  </div>
</template>
<script>
import phrapi from '@/workspace/store/component'
import vueChart from '@/components/signchart2'
import '@/medrecmanage/assets/table.less'
import showBox from '@/components/phr/jianyandialog'

const schema = [
  {
    name: 'applydate',
    label: '申请日期',
    comp: 'custom'
  },
  {
    name: 'reportdate',
    label: '报告日期',
    comp: 'custom'
  },
  {
    name: 'tenantSubjectId',
    comp: 'ever-subject-select',
    label: '申请科室',
    props: {
      type: 'select',
      fields: 'orgSubjectCode'
    }
  },
  {
    name: 'orgId',
    comp: 'ever-org-select',
    label: '申请机构',
    props: {
      type: 'select',
      fields: 'id'
    }
  },
  {
    name: 'doctorAdviceStatusCode',
    label: '检验状态',
    comp: 'select',
    props: {
      options: [
        {
          id: '1',
          name: '已提交'
        },
        {
          id: '-1',
          name: '执行中'
        },
        {
          id: '60',
          name: '报告已出'
        }
      ]
    }
  }
]
export default {
  props: {
    patientId: {
      type: String
    }
  },
  mounted () {
    this.list()
  },
  components: {
    vueChart,
    showBox
  },
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.applicationStartTime = this.$moment()
      .startOf('day')
      .format('YYYY-MM-DD HH:mm:ss')
    queryObj.applicationEndTime = this.$moment()
      .endOf('day')
      .format('YYYY-MM-DD HH:mm:ss')
    this.copyQuery = JSON.parse(JSON.stringify(queryObj))
    return {
      doctorReview: '',
      total: 0,
      times: 5,
      id: '',
      historyVisible: false,
      chartVisible: false,
      chartRow: {},
      pagesize: 20,
      count: 0,
      currentPage: 1,
      schema,
      queryObj,
      tableData: [],
      vs: {
        col: [],
        data: [],
        title: ''
      },
      columns: [
        {
          prop: 'visitDate',
          label: '就诊时间',
          width: '159'
        },
        {
          prop: 'inspectionServiceName',
          slotName: 'inspectionServiceName'
        },
        {
          prop: 'doctorAdviceStatusName',
          label: '状态'
        },
        {
          prop: 'exceptionStatus',
          label: '异常情况'
        },
        {
          prop: 'criticalContent',
          label: '危急值反馈'
        },
        {
          prop: 'tenantSubjectName',
          label: '申请科室'
        },
        {
          prop: 'orgName',
          label: '申请机构'
        },
        {
          prop: 'applicationDate',
          label: '申请时间',
          width: '159'
        },
        {
          prop: 'inspectionReportDate',
          label: '报告时间',
          width: '159'
        },
        {
          key: 'ever-op',
          type: 'btns',
          label: '历史结果',
          btns ({ row }) {
            let baseBtns = [
              {
                prop: 'history',
                label: '历史对比'
              }
            ]
            if (row.status === '60') {
              return baseBtns
            } else {
              baseBtns[0].disabled = true
              return baseBtns
            }
          }
        }
      ]
    }
  },
  methods: {
    rowClass () {
      return 'pointer'
    },
    reset () {
      this.pagesize = 20
      this.count = 0
      this.currentPage = 1
      this.queryObj = JSON.parse(JSON.stringify(this.copyQuery))
    },
    showMore (row) {
      this.id = row.id
      this.doctorReview = row.doctorReview
    },
    showChart (row) {
      this.chartVisible = true
      this.chartRow = row.row
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.list()
    },
    eventChange ({ prop, row }) {
      this[prop](row)
    },
    async history (row) {
      this.historyVisible = true
      this.vs.title = `${row.inspectionServiceName}历史结果`
      this.historyQueryObj = {
        times: this.times,
        patientId: row.patientId,
        inspectionServiceId: row.inspectionServiceId,
        tenantId: row.tenantId,
        doctorAdviceStatusCode: 60
      }
      const total = await phrapi.getCount(this.historyQueryObj)
      this.total = total.data
      this.getCompareResult()
    },
    async getCompareResult () {
      const res = await phrapi.compareResultDetail(this.historyQueryObj)
      this.vs.col = res.data && res.data.columns ? res.data.columns : []
      this.vs.data = res.data && res.data.data ? res.data.data : []
    },
    changeTimes (val) {
      this.historyQueryObj.times = val
      this.getCompareResult()
    },
    list () {
      if (!this.patientId) return
      const query = Object.assign(JSON.parse(JSON.stringify(this.queryObj)), {
        pagesize: this.pagesize,
        offset: (this.currentPage - 1) * this.pagesize,
        patientId: this.patientId
      })
      phrapi.inspectionSearch(query).then(res => {
        this.tableData = res.data.resultList
        this.count = res.data.totalCount
      })
    }
  },
  watch: {
    queryObj: {
      handler (val) {
        this.currentPage = 1
        this.list()
      },
      deep: true
    },
    patientId (val) {
      this.reset()
    }
  }
}
</script>
<style scoped lang="scss">
.pointer {
  cursor: pointer;
}
.margin {
  margin: 0 auto;
}
.number {
  display: inline-block;
  width: 50px;
}
</style>

