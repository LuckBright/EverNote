<template>
  <div class="visitlist">
    <ever-bread-crumb v-if="isYihu" :name="'返回'" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <div style="height: 96%;border: 0px" class="layout_inner">
      <el-row>
        <el-col :span="20">
          <ever-form2
            :schema="querySchema"
            v-model="queryObj"
            ref="form"
            :inline="true"
            :is-query="true"
            v-ever-bind-enter
            @query="list(true)"
          >
            <template slot="name">
              <el-autocomplete
                v-model="queryObj.name"
                :maxlength="50"
                :fetch-suggestions="fuzzySearch"
                placeholder="请输入任务(表单)名称"
              ></el-autocomplete>
            </template>
            <template slot="dateRange">
              <el-date-picker
                style="width: 260px"
                v-model="dateRange"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </template>
            <template slot="status">
              <el-select :clearable="true" v-model="queryObj.status" placeholder="请选择">
                <el-option
                  v-for="item in queryStatus"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
            <template slot="default">
              <el-form-item>
                <el-button class="mr10" @click="list(true)" type="primary">查询</el-button>
                <el-button @click="clearAll">重置</el-button>
              </el-form-item>
            </template>
          </ever-form2>
        </el-col>
        <el-col :span="4" align="right">
          <el-popover placement="bottom" width="400" title="选择执行人" v-model="visible">
            <dept-cascader v-model="deptInfo" :show-first-dept="false"></dept-cascader>
            <el-select v-model="doctorId" placeholder="请选择医生" clearable>
              <el-option
                v-for="(temp, i) in doctorList"
                :key="i"
                :value="temp.staffId"
                :label="temp.staffName"
              ></el-option>
            </el-select>
            <div style="text-align: right; margin: 10px;">
              <el-button size="mini" type="text" @click="visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="confirmAssign">确定</el-button>
            </div>

            <el-button
              type="primary"
              slot="reference"
              :disabled="selectedIds.length ? false : true"
            >指派</el-button>
          </el-popover>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table
            v-loading.body="loading"
            :data="tableData"
            border
            @selection-change="handleSelectionChange"
            :row-class-name="tableRowClassName"
          >
            <el-table-column type="selection" width="30"></el-table-column>
            <el-table-column label="患者姓名" prop="patientName" :span="3" align="center"></el-table-column>
            <el-table-column label="性别" align="center" :span="1">
              <template slot-scope="scope">
                <sys-value type="GBT.2261.1" :code="scope.row.patientSex"></sys-value>
              </template>
            </el-table-column>
            <el-table-column
              label="出生日期"
              align="center"
              show-overflow-tooltip
              prop="patientBirthday"
              :span="1"
            >
              <template
                slot-scope="scope"
              >{{scope.row.patientBirthday == null ? '--' : $moment(scope.row.patientBirthday).format('YYYY-MM-DD')}}</template>
            </el-table-column>
            <el-table-column
              label="任务(表单)"
              show-overflow-tooltip
              align="center"
              prop="taskName"
              :span="2"
            ></el-table-column>
            <el-table-column label="执行方式" align="center" :span="1">
              <template slot-scope="scope">
                <sys-value type="THC_CC_FOLLOWUP" :code="scope.row.visitWay"></sys-value>
              </template>
            </el-table-column>
            <el-table-column label="任务状态" align="center" :span="2">
              align="center"
              <template slot-scope="scope">
                <span>{{statusText(scope.row.status)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="反馈状态" align="center" :span="1">
              <template slot-scope="scope">
                <span>{{feedbackStatusText(scope.row.feedbackStatus)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="预计执行时间" align="center" :span="1">
              <template
                slot-scope="scope"
              >{{scope.row.visitTime == null ? '--' : $moment(scope.row.visitTime).format('YYYY-MM-DD')}}</template>
            </el-table-column>
            <el-table-column label="实际执行时间" align="center" :span="1">
              <template
                slot-scope="scope"
              >{{scope.row.execTime == null ? '--' : $moment(scope.row.execTime).format('YYYY-MM-DD')}}</template>
            </el-table-column>
            <el-table-column label="执行人" align="center" :span="1">
              <template
                slot-scope="scope"
              >{{scope.row.execDoctorName == null ? '--' : scope.row.execDoctorName}}</template>
            </el-table-column>
            <el-table-column label="操作" align="center" :span="4">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  v-show="scope.row.status === 2"
                  @click="executeTask(scope.row)"
                >详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <ever-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :totalCount="totalCount"
            :current="current"
          ></ever-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import api from '@/crm/store/healthy/followapi'
import doctorApi from '@/arrange/store/appointapi'
import deptCascader from '@/arrange/page/scheduling/deptcascader'
import taskvaluekey from '@/crm/page/healthy/taskvaluekey'
import list from '@/util/list'
import { STAFF_TYPE } from '@/crm/util/common'

const schema = [
  {
    name: 'name',
    label: '任务(表单)名称',
    comp: 'custom'
  },
  {
    name: 'dateRange',
    label: '执行时间',
    comp: 'custom'
  },
  {
    name: 'status',
    label: '任务状态',
    comp: 'custom'
  }
]
export default {
  mixins: [list, taskvaluekey],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      isYihu: false,
      weirdCss: false,
      api: api,
      querySchema: schema,
      queryObj: obj,
      visible: false,
      dateRange: [],
      queryStatus: [
        {
          id: '0',
          name: '待执行'
        },
        {
          id: 1,
          name: '进行中'
        },
        {
          id: 2,
          name: '已完成'
        },
        {
          id: 3,
          name: '已终止'
        },
        {
          id: 5,
          name: '已过期'
        },
        {
          id: 6,
          name: '已取消'
        },
        {
          id: 7,
          name: '未分配'
        }
      ],
      followupId: '',
      dialogVisible: false,
      selectedIds: [],
      deptInfo: '',
      doctorId: '',
      doctorList: [],
      totalCount: 0
    }
  },
  watch: {
    deptInfo (val) {
      this.deptId = val ? val.id : ''
      this.organId = val.organId
      this.getDoctor()
    }
  },
  created () {
    // 为门急诊添加返回按钮
    if (this.$router.currentRoute.path.includes('workspace/allTask')) {
      this.isYihu = true
    }
    // 住院医生工作站 住院护士工作站 样式处理
    if (
      this.$router.currentRoute.path.includes('resident') ||
      this.$router.currentRoute.path.includes('inpatient')
    ) {
      this.weirdCss = true
    }
  },
  methods: {
    handleSelectionChange (items) {
      if (items.length !== 0) {
        items.forEach(element => {
          this.selectedIds.push(element.id)
        })
      } else {
        this.selectedIds = []
      }
    },
    confirmAssign () {
      api
        .assignTask({ ids: this.selectedIds, doctorId: this.doctorId })
        .then(res => {
          if (res.head.errCode === 0) {
            this.list(true)
            this.$messageTips(this, 'success', '指派人', '指派成功')
            this.visible = false
            return
          }
        })
    },
    getDoctor () {
      this.doctorList = []
      this.doctorId = ''
      doctorApi
        .getDoctor({
          deptId: this.deptId,
          clinicId: this.organId,
          staffType: STAFF_TYPE[0].id
        })
        .then(res => {
          if (res.head.errCode === 0 && res.data) {
            this.doctorList = res.data
            return
          }
        })
    },
    clearAll () {
      for (let key in this.queryObj) {
        this.queryObj[key] = ''
      }
      // this.pickDay(7)
      this.dateRange = []
    },
    pickDay (timeRange) {
      const day = new Date()
      const startDay = day.getTime() - 3600 * 1000 * 24 * timeRange
      const endDay = day.getTime()
      this.dateRange = []
      this.dateRange.push(new Date(startDay))
      this.dateRange.push(new Date(endDay))
    },
    list (refresh) {
      if (refresh) {
        this.current = 1
        this.offset = 0
      }
      if (this.dateRange != null && this.dateRange.length !== 0) {
        this.queryObj.startTime = this.$moment(this.dateRange[0]).format(
          'YYYY-MM-DD'
        )
        this.queryObj.endTime = this.$moment(this.dateRange[1]).format(
          'YYYY-MM-DD'
        )
      } else {
        this.queryObj.startTime = null
        this.queryObj.endTime = null
      }
      this.queryObj.pagesize = this.pagesize
      this.queryObj.offset = this.offset
      api.getAlltask(this.queryObj).then(res => {
        if (res.head.errCode === 0 && res.data) {
          this.tableData = res.data.resultList
          this.totalCount = res.data.totalCount
        } else {
          this.tableData = []
          this.totalCount = 0
        }
      })
    },
    fuzzySearch (val, callback) {
      api.searchMarerial({ name: val }).then(rs => {
        rs.data.resultList.map(item => {
          item.value = item.name
          item.id = item.id
        })
        callback(rs.data.resultList)
      })
    },
    executeTask (task) {
      sessionStorage.setItem('executeTask', JSON.stringify(task))
      this.$router.push({
        name: 'executetask',
        path: `executetask`,
        params: { patientId: task.patientId, taskId: task.id }
      })
    },
    tableRowClassName ({ row, rowIndex }) {
      if (row.status === 5) {
        return 'warning-red-text'
      } else {
        return ''
      }
    }
  },
  components: {
    deptCascader
  }
}
</script>
<style scoped lang="scss">
.visitlist {
  /deep/ .el-card__body {
    padding: 10px;
  }
  /deep/ .el-form .el-form-item {
    margin-bottom: 0px;
  }
}
.visitlist .title .el-col {
  height: 36px;
  line-height: 36px;
}
.visitlist .title .el-col strong {
  font-size: 18px;
}
.visitlist .title .el-col span {
  font-size: 12px;
}
.mtop {
  margin-top: 35px;
}
</style>
