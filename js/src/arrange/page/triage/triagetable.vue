<template>
  <div class="triageTable">
    <ever-table
      :columns="columns"
      ref="taskTable"
      :data="tableData"
      :is-pagination="true"
      :selectionWidth="30"
      :row-class-name="tableRowClassName"
      :cell-class-name="tableCellClassName"
      :current-page.sync="currentPage"
      border
    >
      <template slot="opCol1">
        <el-table-column prop="patientName" label="患者姓名" align="left" width="120">
          <template slot-scope="scope">
            <div>
              <popoverpatient :data="scope.row"></popoverpatient>
            </div>
          </template>
        </el-table-column>
      </template>
      <template slot="opCol2">
        <el-table-column prop="patientBirth" label="出生日期" align="left" width="95">
          <template slot-scope="scope">
            <div>{{scope.row.patientBirth?$moment(scope.row.patientBirth).format('YYYY-MM-DD'):""}}</div>
          </template>
        </el-table-column>
      </template>
      <template slot="opCol3">
        <el-table-column prop="patientSex" label="性别" align="left" width="60">
          <template slot-scope="scope">
            <div>
              <sys-value type="GBT.2261.1" :code="scope.row.patientSex"></sys-value>
            </div>
          </template>
        </el-table-column>
      </template>
      <template slot="opCol4">
        <el-table-column prop="serviceName" label="服务" align="left">
          <template slot-scope="scope">
            <div>
              <div>{{scope.row.serviceName? scope.row.serviceName : ''}}</div>
            </div>
          </template>
        </el-table-column>
      </template>
      <template slot="opCol5">
        <el-table-column
          show-overflow-tooltip
          prop="crossCount"
          width="80"
          label="过号次数"
          align="left"
        >
          <template slot-scope="scope">
            <div>{{scope.row.crossCount? scope.row.crossCount : ''}}</div>
          </template>
        </el-table-column>
      </template>
      <template slot="opCol6">
        <el-table-column
          show-overflow-tooltip
          prop="reencounterTime"
          label="回诊"
          align="left"
          width="60"
        >
          <template slot-scope="scope">
            <div>{{scope.row.reencounterTime? $moment(scope.row.reencounterTime).format('HH:mm') : ''}}</div>
          </template>
        </el-table-column>
      </template>
      <template slot="opCol7">
        <el-table-column
          show-overflow-tooltip
          prop="appointmentNum"
          label="排队号"
          width="80"
          align="left"
        >
          <template slot-scope="scope">
            <div>{{scope.row.appointmentNum?scope.row.appointmentNum:''}}</div>
          </template>
        </el-table-column>
      </template>
      <template slot="opCol8">
        <el-table-column
          show-overflow-tooltip
          prop="bespokeNum"
          label="预约号"
          width="80"
          align="left"
        >
          <template slot-scope="scope">
            <div>{{scope.row.bespokeNum?scope.row.bespokeNum:''}}</div>
          </template>
        </el-table-column>
      </template>
      <template slot="opCol9">
        <el-table-column
          show-overflow-tooltip
          prop="visitTime"
          label="签到时间"
          align="left"
          width="80"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.makeOff==='1'">已离开</div>
            <div v-else>
              <div>{{scope.row.visitTime?$moment(scope.row.visitTime).format('HH:mm'):""}}</div>
            </div>
          </template>
        </el-table-column>
      </template>
      <template slot="opCol10">
        <el-table-column
          show-overflow-tooltip
          prop="waitingTime"
          label="超时(分钟)"
          width="90"
          align="left"
        >
          <template slot-scope="scope">
            <div>{{scope.row.waitingTime?scope.row.waitingTime:''}}</div>
          </template>
        </el-table-column>
      </template>
      <template slot="opCol11">
        <el-table-column show-overflow-tooltip prop="lagTime" label="迟到时间(分钟)" width="120" align="left">
          <template slot-scope="scope">
            <div>{{scope.row.lagTime?scope.row.lagTime:''}}</div>
          </template>
        </el-table-column>
      </template>
      <template slot="opCol12">
        <el-table-column
          show-overflow-tooltip
          prop="doctorName"
          label="医生"
          align="left"
        >
          <template slot-scope="scope">
            <div>{{scope.row.doctorName?scope.row.doctorName:""}}</div>
          </template>
        </el-table-column>
      </template>
      <template slot="opCol13">
        <el-table-column
          show-overflow-tooltip
          prop="stationName"
          label="诊室"
          align="left"
          width="90"
        >
          <template slot-scope="scope">
            <div>{{scope.row.stationName?scope.row.stationName:""}}</div>
          </template>
        </el-table-column>
      </template>
      <template slot="opCol14">
        <el-table-column
          show-overflow-tooltip
          prop="subsequentVisit "
          label="初复诊"
          align="left"
          width="80"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.subsequentVisit=='-1'">未知</div>
            <div v-if="scope.row.subsequentVisit=='0'">初诊</div>
            <div v-if="scope.row.subsequentVisit=='1'">复诊</div>
            <div v-if="scope.row.subsequentVisit=='2'">转诊</div>
            <div v-if="scope.row.subsequentVisit=='3'">急诊</div>
            <div v-if="scope.row.subsequentVisit=='4'">体检</div>
            <div v-if="scope.row.subsequentVisit=='5'">简易</div>
            <div v-if="scope.row.subsequentVisit=='6'">疫苗</div>
            <div v-if="scope.row.subsequentVisit=='7'">团队体检</div>
          </template>
        </el-table-column>
      </template>
      <template slot="opCol">
        <el-table-column
          show-overflow-tooltip
          prop="date"
          label="操作"
          align="center"
          width="120px"
          fixed="right"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.status!==6">
              <el-button
              type="primary"
              size="small"
              v-if="scope.row.status==1"
              :disabled="isdisabled && isdisabled[scope.row.id]"
              @click="onVisit(scope.row, 'qd')"
              >签到</el-button>
              <el-button
                v-if="(scope.row.status==3 || scope.row.status==5) && scope.row.isTriage"
                type="primary"
                size="small"
                @click="onVisit(scope.row, 'fz')"
              >分诊</el-button>
              <el-button
                v-if="scope.row.status!==1"
                type="primary"
                size="small"
                @click="onVisit(scope.row, 'yj')"
              >预检</el-button>
              <el-button
                type="primary"
                size="small"
                v-if="scope.row.status==4"
                @click="onVisit(scope.row, 'hz')"
              >回诊</el-button>
            </div>
          </template>
        </el-table-column>
      </template>
    </ever-table>
    <ever-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
      :current="current"
    ></ever-pagination>
  </div>
</template>
<script>

import api from '@/arrange/store/triageapi'
import popoverpatient from '@/arrange/page/triage/popoverpatient' // 点击列表患者姓名弹窗
import serviceIconHandler from '@/workspace/page/service.panel/common/service.icon.handler'
import list from '@/util/list'
import storage from '@/util/storage'

export default {
  mixins: [list],
  props: ['queryObj', 'isDaozhen', 'activeName'],
  data () {
    return {
      api,
      loading: false,
      awayFlag: false,
      iconList: ['precheck'],
      currentPage: 1,
      params: { offset: this.offset, pagesize: this.pagesize },
      tableData: [],
      baseInfo: '',
      dataId: '',
      configKey: 'UPDATE_PREVIEW_RULE',
      editPreType: '',
      isdisabled: false,
      today: this.$moment(new Date()).format('YYYY-MM-DD'),
      columns: [
        {
          slotName: 'opCol1'
        },
        {
          slotName: 'opCol2'
        },
        {
          slotName: 'opCol3'
        },
        {
          slotName: 'opCol4'
        },
        {
          slotName: 'opCol5'
        },
        {
          slotName: 'opCol6'
        }, {
          slotName: 'opCol7'
        },
        {
          slotName: 'opCol8'
        },
        {
          slotName: 'opCol9'
        },
        {
          slotName: 'opCol10'
        },
        {
          slotName: 'opCol11'
        },
        {
          slotName: 'opCol12'
        },
        {
          slotName: 'opCol13'
        },
        {
          slotName: 'opCol14'
        }, {
          slotName: 'opCol'
        }
      ],
      defaultRowStatus: true,
      allarr: []
    }
  },
  created () {
    this.$bus.$off('cleardisabled')
    this.$bus.$on('cleardisabled', _ => {
      this.isdisabled = false
    })
    this.$bus.$on('onError', val => {
      this.isdisabled = false
    })
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      let colorFlag = row.status
      if (colorFlag === '4') {
        return 'success-jiezhen'
      } else if (colorFlag === '5') {
        return 'success-daiyujian'
      } else {
        return 'success-other'
      }
    },
    // 超时和迟到标记 - 添加class
    tableCellClassName ({ row, column, rowIndex, columnIndex }) {
      if (row.waitingTime && columnIndex === 9) {
        return 'danger_red'
      } else if (row.lagTime && columnIndex === 10) {
        return 'danger_orange'
      }
    },
    list () {
      this.loading = true
      this.allarr = []
      let copy = Object.assign({}, this.queryObj)
      if (this.queryObj.tenantDeptId !== '') {
        copy.tenantDeptId = [this.queryObj.tenantDeptId]
      } else {
        let arrs = JSON.parse(storage.getLocalStorage('STIAGE_SET_DEPTS'))
        if (!arrs) return false
        arrs.forEach(value => {
          this.allarr.push(value.orgSubjectId)
        })
        copy.tenantDeptId = this.allarr
      }
      this.api.getList(Object.assign(copy, { offset: this.offset, pagesize: this.pagesize })).then(rs => {
        if (rs && rs.data && rs.data.resultList) {
          this.loading = false
          this.isdisabled = false
          this.tableData = rs.data.resultList
          this.totalCount = rs.data.totalCount
        }
      })
    },
    onVisit (val, diff) {
      val.diff = diff
      if (typeof this.isdisabled === 'object') {
        this.isdisabled[val.id] = true
      } else {
        this.isdisabled = {}
        this.isdisabled[val.id] = true
      }
      // this.isdisabled = true
      this.$emit('rowclick', val)
    }
  },
  components: {
    popoverpatient,
    serviceIconHandler
  }
}
</script>
<style scoped>
.triageTable /deep/ .el-table .success-daiyujian {
  background: #fffccc;
}
.triageTable /deep/ .el-table .success-jiezhen {
  background: #eeeeee;
}
.triageTable /deep/ .el-table td.danger_red {
  background-color: #ff999b;
  color: #000;
}
.triageTable /deep/ .el-table td.danger_orange {
  background: #ffdc8a;
  color: #000;
}
.triageTable /deep/ .el-table tr.success-jiezhen td {
  color: #666666;
}
.triageTable /deep/ .el-table tr.success-jiezhen td.danger_red {
  background: #eeeeee;
  color: #666666;
}
.triageTable /deep/ .el-table tr.success-jiezhen td.danger_orange {
  background: #eeeeee;
  color: #666666;
}
.triageTable /deep/ .el-table tr.success-jiezhen.hover-row td.danger_red {
  background: #deeeff;
}
.triageTable /deep/ .el-table tr.success-jiezhen.hover-row td.danger_orange {
  background: #deeeff;
}
.triageTable /deep/ .el-table tr.success-jiezhen.hover-row td a.gray {
  text-decoration: none;
}
.triageTable /deep/ .el-table tr.success-jiezhen td a.gray {
  text-decoration: none;
  display: inline-block;
}
</style>
