<template>
  <div class="patient-task-list">
    <el-tabs v-model="activeName">
      <el-tab-pane label="本次就诊随访" name="currentFollow"></el-tab-pane>
      <el-tab-pane label="全部随访" name="allFollow"></el-tab-pane>
    </el-tabs>
    <div class="follow-table-warp">
      <ever-table
      ref="table"
      :border="false"
      height="181"
      :columns="columns"
       v-loading.body="loading"
      :url="url"
      :params="params"
      @eventChange="eventChange"
      @update:params="changeParams"
      :table-page-size="5"
      :is-record-url-params="false"
      :beforeList="beforeList"
      :paginationAttr="{
        pagesizes: [5]
      }">
        <template slot="visitNumber" slot-scope="scope">
          <a
          style="color: #217DE3;"
          class="ellipsis"
          :title="scope.row.visitNumber"
          v-if="patientObj &&patientObj.patientId"
          :href="$ever.crmIndex + '/crm/memberinfo/userinfo/memberbaseinfo/' + patientObj.patientId"
          target="_blank"
        >{{scope.row.visitNumber}}</a>
        </template>
      </ever-table>
    </div>
    <dialog-taskdetail ref="taskdetail" :id="id" :dialog-name="dialogName" :isOpen="isOpen"></dialog-taskdetail>
  </div>
</template>
<script>
import urlMap from '@/util/urls'
import dialogTaskdetail from '@/follow/page/template/dialog-taskdetail.vue'
import { tableColWidth } from '@/util/table-config'
import { listDestValue } from '@/util/common'
import { materialStatus } from '@/follow/util/model'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
export default {
  props: ['patientObj', 'isOpen'],
  components: {
    dialogTaskdetail
  },
  data () {
    return {
      loading: false,
      activeName: '',
      tableData: [],
      url: urlMap.follow.task.selectJobListById,
      id: '',
      patientId: this.patientObj.patientId,
      params: {
        currentPage: 1,
        pagesize: 5,
        patientId: this.patientObj.patientId,
        visitNumber: this.patientObj.visitNumber,
        _uuid: U(),
        type: 'currentFollow'
      },
      currentPage: 1,
      pagesize: 5,
      dialogName: '',
      columns: [
        {
          prop: 'name',
          label: '随访计划名称',
          type: 'eventText',
          event: 'goDetail'
        },
        {
          prop: 'creatorName',
          label: '创建人',
          formatter: ({ value }) => {
            if (value === 'system') {
              return '系统'
            } else {
              return value
            }
          },
          width: tableColWidth.name4W80,
        },
        {
          prop: 'createTime',
          label: '创建时间',
        },
        {
          prop: 'deptName',
          label: '创建科室',
        },
        {
          prop: 'orgName',
          label: '创建机构',
        },
        {
          prop: 'status',
          label: '执行状态',
          width: tableColWidth.name4W80,
          formatter: ({ value }) => listDestValue(materialStatus, parseInt(value))
        },
        {
          prop: 'visitNumber',
          label: '就诊详情',
          hidden: true,
          width: tableColWidth.name8W180,
          slot: 'visitNumber',
          showOverflowTooltip: true
        },
        {
          prop: 'deptName',
          label: '就诊科室',
          hidden: true,
        },
      ]
    }
  },
  watch: {
    'activeName': {
      handler (val) {
        if (val === 'currentFollow') {
          this.columns[6].hidden = true
          this.columns[7].hidden = true
          this.params.type = 'currentFollow'
          this.params = {
            currentPage: this.currentPage,
            pagesize: this.pagesize,
            patientId: this.patientObj.patientId,
            visitNumber: this.patientObj.visitNumber,
            _uuid: U(),
            type: 'currentFollow'
          }
          if (this.params.patientId && this.params.visitNumber) {
            this.list(true)
          }
        } else {
          this.params.type = 'allFollow'
          this.columns[6].hidden = false
          this.columns[7].hidden = false
          this.params = {
            currentPage: this.currentPage,
            pagesize: this.pagesize,
            patientId: this.patientObj.patientId,
            _uuid: U(),
            type: 'allFollow'
          }
          if (this.params.patientId) {
            this.list(true)
          }
        }
      }
    },
    'isOpen': {
      handler (val) {
        if (!val) {
          this.activeName = 'currentFollow'
          this.tableData = []
          this.params = {}
          this.patientObj = Object.assign(this.patientObj, {})
        } else {
          this.params = {
            currentPage: 1,
            pagesize: 5,
            patientId: this.patientObj.patientId,
            visitNumber: this.patientObj.visitNumber,
            _uuid: U(),
            type: 'currentFollow'
          }
          if (this.params.patientId && this.params.visitNumber) {
            this.list(true)
          }
        }
      }
    }
  },
  created () {
    this.activeName = 'currentFollow'
  },
  methods: {
    beforeList () {
      if (this.activeName === 'currentFollow') {
        return this.params.patientId && this.params.visitNumber
      } else {
        return this.params.patientId
      }
    },
    list (searchFirstPage = false, type) {},
    changeParams (params) {
      this.list(true)
    },
    eventChange ({ prop, row, col }) {
      if (prop === 'goDetail') {
        this.id = row.id
        this.dialogName = row.name
        if (this.id) {
          this.$refs.taskdetail.open(this.id)
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.patient-task-list {
  .follow-table-warp {
    /deep/ .el-table {
      th {
        background-color: #ffffff;
      }
    }
  }
  .el-tabs {
    /deep/ .el-tabs__header {
      margin: 0px;
    }
  }
}
</style>
