<template>
  <div class="visitlist">
    <ever-bread-crumb v-if="isYihu" :name="'返回'" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <div style="height: 96%;border: 0px" class="layout_inner">
      <el-row>
        <el-col :span="20">
          <ever-form2
            :class="{line55: weirdCss}"
            :schema="querySchema"
            v-model="queryObj"
            :inline="true"
            :is-query="true"
            @query="list"
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
                class="ever-date-picker"
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
            <template>
              <el-button type="primary" :class="{weirdBtn: weirdCss}" @click="searchMarerial">查询</el-button>
              <el-button :class="{weirdBtn: weirdCss}" @click="clearAll">重置</el-button>
            </template>
          </ever-form2>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table
            :data="tableData"
            border
            :row-class-name="tableRowClassName"
            style="margin-top: 0px"
          >
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
              </template>scope
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
            <el-table-column label="原因" align="center" :span="1">
              <template slot-scope="scope">{{scope.row.reason == null ? '--' : scope.row.reason}}</template>
            </el-table-column>
            <el-table-column label="操作" align="center" :span="4">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  v-if="scope.row.status === 0"
                  @click="executeTask(scope.row)"
                >执行</el-button>
                <el-button
                  size="mini"
                  slot="reference"
                  v-if="scope.row.status === 0"
                  @click="cancelTask(scope.row.id)"
                >取消</el-button>
                <el-button
                  size="mini"
                  v-if="scope.row.status === 2"
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
import list from '@/util/list'
import taskvaluekey from '@/crm/page/healthy/taskvaluekey'
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
      ]
    }
  },
  created () {
    // 为门急诊添加返回按钮
    if (this.$router.currentRoute.path.includes('workspace/myTask')) {
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
    cancelTask (id) {
      const h = this.$createElement
      this.$prompt('*取消原因:', {
        message: h('p', null, [
          h('i', { style: 'color: red;margin-right: 3px' }, '*'),
          h('span', null, '取消原因')
        ]),
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请填写取消原因(必填)',
        inputValidator (val) {
          if (val == null) {
            return '不能为空!'
          }
          if (!val.trim()) {
            return '不能为空!'
          }
          if (val.length > 20) {
            return '字符长度不能超过20个！'
          }
        }
      }).then(({ value }) => {
        api.cancelTask({ id: id, reason: value }).then(rs => {
          if (!rs.head.errCode) {
            this.$messageTips(this, 'success', '已取消', '取消成功')
            this.list()
          }
        })
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
    pickDay (timeRange) {
      const day = new Date()
      const startDay = day.getTime() - 3600 * 1000 * 24 * timeRange
      const endDay = day.getTime()
      this.dateRange = []
      this.dateRange.push(new Date(startDay))
      this.dateRange.push(new Date(endDay))
    },
    clearAll () {
      for (let key in this.queryObj) {
        this.queryObj[key] = ''
      }
      // this.pickDay(7)
      this.dateRange = []
    },
    searchMarerial () {
      this.current = 1
      this.offset = 0
      this.list()
    },
    list () {
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
      api.getMytask(this.queryObj).then(res => {
        this.tableData = res.data.resultList
        this.totalCount = res.data.totalCount
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
    tableRowClassName ({ row, rowIndex }) {
      if (row.status === 5) {
        return 'warning-red-text'
      } else {
        return ''
      }
    }
  },
  components: {}
}
</script>
<style scoped lang="scss">
.visitlist {
  /deep/ .el-card__body {
    padding: 10px;
  }
  /deep/ .el-form .el-form-item {
    margin-bottom: 8px;
  }
}
#visitlist .title .el-col {
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
  height: 96.1%;
}
.line55 {
  line-height: 55px;
}
.weirdBtn {
  margin-top: 2px;
  vertical-align: top;
}
</style>
