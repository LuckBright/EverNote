<template>
  <div class="mtriagetab">
    <ever-form2 :schema="querySchema" v-model="queryObj" @query="list(true)" :is-query="true" :inline="true">
    </ever-form2>
    <div class="flex_col_1_hidden main-wrap">
      <el-table
        height="100%"
        :data="tableData"
        class="table-height-30"
        v-loading.body="loading"
        border
        style="width: 100%"
        :row-class-name="tableRowClassName"
        :cell-class-name="tableCellClassName">
        <el-table-column
          prop="patientName"
          label="姓名"
          width="180"
          align="left">
          <template slot-scope="scope">
            <div>
            <a :class="isDisabled(scope.row.visitTime)?'gray':'cBlue1'">{{scope.row.patientName}}</a>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="patientBirth"
          label="出生日期"
          width="120"
          >
          <template slot-scope="scope">
            <div>
            {{ scope.row.patientBirth | formatDateByExp('YYYY-MM-DD') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="patientSex"
          label="性别"
          >
          <template slot-scope="scope">
            <div>
            <sys-value type="GBT.2261.1" :code="scope.row.patientSex"></sys-value>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="waitingTime"
          label="等待"
          >
          <template slot-scope="scope">
            <div>
            {{scope.row.waitingTime || ''}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="callNumber"
          label="叫号"
          >
          <template slot-scope="scope">
            <div>
            {{scope.row.callNumber || ''}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="queueNum"
          label="排队号"
          >
          <template slot-scope="scope">
            <div>{{scope.row.queueNum?scope.row.queueNum:''}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="bespokeNum"
          label="预约号"
          >
          <template slot-scope="scope">
            <div>{{scope.row.bespokeNum?scope.row.bespokeNum:''}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="visitTime"
          label="签到时间">
          <template slot-scope="scope">
            <div>
            {{ scope.row.visitTime | formatDateByExp('HH:mm') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="overtime"
          label="超时">
          <template slot-scope="scope">
            <div>{{scope.row.overtime || ''}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="comeLate"
          label="迟到时间">
          <template slot-scope="scope">
            <div>{{scope.row.comeLate || ''}}</div>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="stationName"
          label="诊室"
          width="120">
          <template slot-scope="scope">
            <div>
            {{scope.row.stationName || ''}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="操作">
          <template slot-scope="scope">
            <el-button class="disBtn" type="text" size="small" @click="changeroom(scope.row,isDisabled(scope.row.visitTime))" :disabled="isDisabled(scope.row.visitTime)">
              <span :class="isDisabled(scope.row.visitTime)?'gray':'cBlue'">换诊室</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <ever-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :totalCount="totalCount" :current="currentPage">
    </ever-pagination>
    <changeroom ref="changeroom" @reload="reload"></changeroom>
  </div>
</template>
<script>
let querySchema = [
  {
    name: 'stationId',
    label: '诊室',
    comp: 'ever-select',
    props: {
      options: [],
      clearable: true,
      placeholder: '请选择诊室'
    },
    span: 3
  },
  {
    name: 'date',
    label: '日期',
    comp: 'date',
    props: {
      clearable: true,
      outformat: 'YYYY-MM-DD',
      placeholder: '年_月_日'
    }
  }
]
import list from '@/util/list'
import api from '@/arrange/store/medicaltriagetabapi'
import deptCascader from '@/arrange/page/scheduling/deptcascader'
import changeroom from '@/arrange/page/triage/dialog-changeroom'
import triageapi from '@/arrange/store/triageapi'
import moment from 'moment'
export default {
  props: ['diagnosisAreaId', 'form'],
  mixins: [list],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.date = this.$moment(new Date()).format('YYYY-MM-DD')
    queryObj.patientId = ''
    queryObj.deptId = ''
    queryObj.requestSwitch = true
    return {
      api,
      triageapi,
      querySchema,
      queryObj,
      deptOption: [],
      currentPage: 1,
      totalCount: 0,
      tableData: [],
      today: this.$moment(new Date()).format('YYYY-MM-DD'),
      roomOption: [],
      loading: false
    }
  },
  components: {
    deptCascader,
    changeroom
  },
  created () {
  },
  watch: {
    form: {
      handler (val) {
        if (val) {
          if (val.patientId) {
            this.queryObj.patientId = val.patientId
            this.list()
          } else {
            this.queryObj.patientId = ''
            this.list()
          }
        } else {
          this.queryObj.patientId = ''
          this.list()
        }
      },
      deep: true
    },
    'form.deptIdObj': {
      handler (val) {
        if (val) {
          this.queryObj.stationId = ''
          this.queryObj.deptId = ''
          if (val.deptId) {
            this.queryObj.deptId = val.deptId
            this.list()
            this.triageConfigList(val.deptId)
          }
        } else {
          this.queryObj.deptId = ''
          this.queryObj.stationId = ''
        }
      },
      deep: true
    }
  },
  computed: {
  },
  methods: {
    isDisabled (visitTime) {
      let visitTime1 = this.$moment(visitTime).format('YYYY-MM-DD')
      let isPast = moment(visitTime1).isBefore(this.today)
      if (isPast) {
        return true
      } else {
        return false
      }
    },
    tableRowClassName ({ row, rowIndex }) {
      let visitTime = this.$moment(row.visitTime).format('YYYY-MM-DD')
      let isPast = moment(visitTime).isBefore(this.today)
      if (isPast) {
        return 'success-isUnusualStatus'
      } else {
        return ''
      }
    },
    tableCellClassName ({ row, column, rowIndex, columnIndex }) {
      if (row.overtime && row.queueNum && columnIndex === 5) {
        return 'danger_red'
      } else if (row.overtime && row.bespokeNum && columnIndex === 6) {
        return 'danger_red'
      } else if (row.overtime && columnIndex === 8) {
        return 'danger_red'
      } else if (row.overtime && row.bespokeNum && columnIndex === 6) {
        return 'danger_red'
      } else if (row.comeLate && columnIndex === 9) {
        return 'danger_orange'
      }
    },
    reload () {
      this.list()
    },
    changeroom (val, isFlag) {
      if (val && !isFlag) {
        this.$refs.changeroom.open(val)
      }
    },
     // 根据科室获取诊室
    triageConfigList (id) {
      this.api.triageConfigList({deptId: id, resourceType: 'SPACE_CONSULTING_ROOM'}).then(rs => {
        if (rs && rs.data && rs.data.resultList && rs.data.resultList[0]) {
          let data = rs.data.resultList.filter(v => {
            v.id = v.resourceId
            v.name = v.resourceName
            return v.triageType && v.triageType === 1
          })
          this.$ever.getFieldFromSchema(this.querySchema, 'stationId').props.options = data
        } else {
          this.$ever.getFieldFromSchema(this.querySchema, 'stationId').props.options = []
        }
      })
    }
  }
}
</script>
<style scoped>
.mtriagetab /deep/ .el-table .success-isUnusualStatus{background: #EEEEEE;color: #666666;}
.mtriagetab /deep/ .el-table .success-isUnusualStatu.hover-row{background: #1c7bef;color: #FFFFFF;}
.mtriagetab /deep/ .el-table .gray{color: #666666;}
.mtriagetab /deep/ .el-table .cBlue{color: #1c7bef;}
.mtriagetab /deep/ .el-table .cBlue1{color: #1c7bef;}
.mtriagetab /deep/ .el-table td.danger_orange {background: #FFDC8A;color:#000;}
.mtriagetab /deep/ .el-table td.danger_red {background-color: #FF999B;color:#000;}
.mtriagetab /deep/ .el-table tr.success-isUnusualStatus td.danger_red{background:#EEEEEE;color:#666666;}
.mtriagetab /deep/ .el-table tr.success-isUnusualStatus td.danger_orange{background:#EEEEEE;color:#666666;}
.mtriagetab /deep/ .el-table tr.success-isUnusualStatus.hover-row td a{text-decoration: none;}
.mtriagetab /deep/ .el-table tr.success-isUnusualStatus td a{text-decoration: none;}
.mtriagetab /deep/ .el-table .el-button.is-disabled{color: #666666;cursor: not-allowed;background-image: none;
background-color: #EEEEEE!important;border:0 none!important;}
</style>
