<template>
  <div>
    <ever-form2 :schema="schema" v-model="queryObj" :inline="true" :is-query="false">
      <template slot="date">
        <ever-range-picker
          :start.sync="queryObj.appointmentStartDate"
          :end.sync="queryObj.appointmentEndDate"
        ></ever-range-picker>
      </template>
      <template slot="default">
        <el-button size="small" @click="reset">重置</el-button>
      </template>
    </ever-form2>
    <div>
      <ever-table border ref="table" :columns="columns" :data="tableData"></ever-table>
      <el-row>
        <el-col :span="24" align="right">
          <el-pagination
            v-show="pagesize < count"
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
  </div>
</template>

<script>
import phrapi from '@/workspace/store/component'
import moment from 'moment'
const schema = [
  {
    name: 'visitTypeCode',
    label: '预约类型',
    comp: 'select',
    props: {
      // 1.门诊预约 2.检查预约 3 手术室预约（住院）4.门诊手术预约
      options: [
        {
          id: '1',
          name: '门诊预约'
        },
        {
          id: '2',
          name: '检查预约'
        },
        {
          id: '3',
          name: '手术室预约（住院）'
        },
        {
          id: '4',
          name: '门诊手术预约'
        }
      ]
    }
  },
  {
    name: 'date',
    label: '预约日期',
    comp: 'custom'
  },
  {
    name: 'appointmentOrgId',
    comp: 'ever-org-select',
    label: '机构',
    props: {
      type: 'select',
      fields: 'id',
    }
  },
]
export default {
  props: {
    patientId: String
  },
  data () {
    const queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.pagesize = 20
    queryObj.offset = 0
    queryObj.appointmentStartDate = this.$moment()
      .subtract(14, 'days')
      .format('YYYY-MM-DD')
    queryObj.appointmentEndDate = this.$moment()
      .subtract(0, 'days')
      .format('YYYY-MM-DD')
    this.copyQuery = JSON.parse(JSON.stringify(queryObj))
    return {
      schema,
      queryObj,
      tableData: [],
      currentPage: 1,
      pagesize: 20,
      count: 0,
      columns: [
        {
          prop: 'appointmentVisitDate',
          label: '预约日期',
          formatter ({ value }) {
            return moment(value).format('YYYY-MM-DD')
          },
          width: '100'
        },
        {
          prop: 'appointmentTimeSolt',
          label: '预约时段',
          width: '100'
        },
        {
          prop: 'appointmentDate',
          label: '创建日期',
          formatter ({ value }) {
            return moment(value).format('YYYY-MM-DD')
          },
          width: '100'
        },
        {
          prop: 'appointmentTypeName',
          label: '预约类型'
        },
        {
          prop: 'appointmentTenantSubjectName',
          label: '科室'
        },
        {
          prop: 'appointmentRoomName',
          label: '诊室'
        },
        // {
        //   prop: 'projectName',
        //   label: '项目名称'
        // },
        {
          prop: 'appointmentPatientMobile',
          label: '预约电话',
          width: '120'
        },
        {
          prop: 'appointmentOrgName',
          label: '预约机构',
          width: '130',
          showOverflowTooltip: true
        },
        {
          prop: 'appointmentChannel',
          label: '预约途径'
        },
        {
          prop: 'appointmentComment',
          label: '预约备注'
        },
        {
          prop: 'smsContent',
          label: '短信内容'
        },
        {
          prop: 'creatorName',
          label: '创建人'
        },
        {
          prop: 'signInTime',
          label: '签到时间',
          width: '159'
        }
      ]
    }
  },
  async mounted () {
    this.list()
  },
  watch: {
    queryObj: {
      handler (val) {
        this.currentPage = 1
        this.list()
      },
      deep: true
    },
    patientId () {
      this.reset()
    }
  },
  methods: {
    reset () {
      this.queryObj = JSON.parse(JSON.stringify(this.copyQuery))
      this.pagesize = 20
      this.count = 0
      this.currentPage = 1
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.list()
    },
    async list () {
      if (!this.patientId) return
      const queryObj = Object.assign(
        JSON.parse(JSON.stringify(this.queryObj)),
        {
          pagesize: this.pagesize,
          offset: (this.currentPage - 1) * this.pagesize,
          patientId: this.patientId
        }
      )
      const res = await phrapi.getAppointment(queryObj)
      this.tableData = res.data.resultList ? res.data.resultList : []
      this.count = res.data.totalCount
    }
  }
}
</script>
<style scoped lang="scss">
.mt10 {
  margin-top: 10px;
}
.mr10 {
  margin-right: 10px;
}
</style>

