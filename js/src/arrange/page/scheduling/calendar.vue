<template>
  <div id="calender">
    <el-row>
      <el-col class="left">
        <el-radio-group v-model="tabPosition">
          <el-radio-button label="list">列表</el-radio-button>
          <el-radio-button label="week">周</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
    <list-arrange
      v-show="tabPosition === 'list'"
      ref="listarrange"
      :dpt-name="dptName"
      :resource-name="resourceName"
      :category-code="categoryCode"
      :typeCode="this.deptType"
      :resourcePurpose="this.resourcePurpose"
      >
    </list-arrange>
    <el-row v-show="tabPosition === 'week'">
      <el-row class="mb10 mt10" id="search-head">
        <el-col :span="12">
          <el-form :model="params" :inline="true" label-width="10" label-position="right">
            <el-form-item>
              <ever-org-select
                ref="eos"
                v-model="org"
                :isOrg="false"
                :props="{
                  'clearable': false
                }">
              </ever-org-select>
            </el-form-item>
            <el-form-item>
              <ever-subject-select
                ref="ess"
                v-model="params.tenantDeptId"
                fields="orgSubjectCode"
                placeholder="科室"
                :params="subparams">
              </ever-subject-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="params.resourceName" :placeholder="resourceName" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query" icon="el-icon-search">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12" class="right">
          <copy-popover
            :calltype="'dpt'"
            :categoryCode="categoryCode"
            :paramsData="{
              'orgId': params.orgId,
              'tenantDeptId': params.tenantDeptId,
              'resourceName': params.resourceName
              }"
            >
          </copy-popover>
          <el-button type="primary" @click="publish">发布</el-button>
        </el-col>
      </el-row>
      <el-row class="headbg">
        <el-col :span="20" class="changeweek" style="text-align:center;">
          <arrange-week ref="arrangeweek" v-model="changeDate" :begin-day="'Monday'" @update="updateWeek" :pre="'pre'"></arrange-week>
        </el-col>
      </el-row>
      <calendartable
        ref="caltable"
        :resource-name="resourceName"
        :arrange-week="weeks"
        :table-data="tableData"
        :org-name="orgName"
        :doc-name="params.resourceName"
        :changeDate="changeDate && changeDate.substring(8)"
        :category-code="categoryCode"
        @update="showDialog"
        @refresh="refresh"
        @add="(weeks, res) => {addArrange(weeks, res)}"
        @showweek="showWeek"
        @loadmore="loadMore"
      ></calendartable>
    </el-row>
    <dialog-dpt-scheduling ref="dpt" :titleData="titleData" @update="success" :isEdit="isEdit" :instanceId="instanceId" :category-code="categoryCode"></dialog-dpt-scheduling>
    <dialog-week-arrange ref="weekange" :titleData="titleData" :weeks="weeks" :category-code="categoryCode" @success="_ => this.success()"></dialog-week-arrange>
  </div>
</template>
<script>
import api from '@/arrange/store/workapi'
import sapi from '@/arrange/store/settingapi'
import calendartable from '@/arrange/page/scheduling/calendar-table.vue'
import arrangeWeek from '@/warehouse/page/group/view/operationsManagement/personscheduling/arrange.week.vue'
import dialogDptScheduling from './dialog.dpt.scheduling.vue'
import dialogWeekArrange from './dialog.week.arrange.vue'
import copyPopover from '@/warehouse/page/group/view/operationsManagement/organizationscheduling/copy.popover.vue'
import listArrange from './list.arrange.vue'
export default {
  data () {
    return {
      api,
      sapi,
      // orgList: [],
      weeks: [],
      tableData: [],
      params: {
        orgId: '',
        tenantDeptId: '',
        resourceName: ''
      },
      orgName: '',
      org: {},
      titleData: {},
      changeDate: this.$moment().format('YYYY-MM-DD'),
      isEdit: false,
      instanceId: '',
      tabPosition: 'week',
      dptName: '',
      categoryCode: '',
      resourceName: '',
      resourcType: '',
      deptType: [],
      resourcePurpose: '',
      offset: 0,
      pagesize: 20,
      isLoadmore: false,
      noMore: false,
      count: 0
    }
  },
  computed: {
    subparams () {
      return {
        'orgId': this.params.orgId,
        'type2CodeList': this.deptType,
        'status': 'Y',
        'usePermissionStatus': 'Y'
      }
    }
  },
  mounted () {
    this.$bus.$off('showdpt')
    this.$bus.$on('showdpt', (val, data) => {
      this.isEdit = true
      this.instanceId = val
      this.titleData = data
      this.$nextTick(_ => {
        this.$refs.dpt.open()
      })
    })
  },
  created () {
    this.getOrgList()
  },
  watch: {
    '$route': {
      handler (val) {
        this.tabPosition = 'week'
        switch (val.path.split('/')[3]) {
          case 'out':
            this.getByCode('OUTPATIENT_DOCTOR')
            break
          case 'examine':
            this.getByCode('EXAMINE')
            break
          case 'checkout':
            this.getByCode('CHECKOUT')
            break
          case 'treatment':
            this.getByCode('TREATMENT')
            break
          case 'surgery':
            this.getByCode('OUTPATIENT_SURGERY')
            break
          case 'imgtext':
            this.getByCode('INQUIRY_IMAGE_TEXT')
            break
          case 'video':
            this.getByCode('INQUIRY_VIDEO')
            break
          case 'online':
            this.getByCode('CONSULT_ON_LINE')
            break
        }
      },
      deep: true,
      immediate: true
    },
    'org': {
      handler (val) {
        this.params.orgId = val ? val.id : ''
        this.orgName = val ? val.name : ''
      },
      deep: true
    },
    'params.orgId': {
      handler (val) {
        if (val) {
          this.getArrangeList()
          this.params.tenantDeptId = ''
        } else {
          // this.getOrgList()
        }
      },
      deep: true
    },
    'tabPosition': {
      handler (val) {
        this.getOrgList()
        this.changeDate = this.$moment().format('YYYY-MM-DD')
        this.$refs.arrangeweek.getNowWeeks()
        val !== 'list' ? this.query() : this.$refs.listarrange.list()
      },
      deep: true
    }
  },
  methods: {
    loadMore (val) {
      if (!this.params.tenantDeptId) {
        if (this.noMore) {
          this.offset = (this.count - 1) * this.pagesize
          this.$refs.caltable.resetCount()
        } else {
          this.offset = (val - 1) * this.pagesize
        }
        this.getArrangeList(true)
        this.isLoadmore = true
      }
    },
    /*
      门诊排班：OUTPATIENT_DOCTOR
      检查排班：EXAMINE
      检验排班：CHECKOUT
      治疗排班：TREATMENT
      // 门诊手术排班：OUTPATIENT_SURGERY
    */
    getByCode (val) {
      this.offset = 0
      this.params.tenantDeptId = ''
      this.params.resourceName = ''
      // this.org = {}
      this.changeDate = this.$moment().format('YYYY-MM-DD')
      this.api.getByCode({
        code: val
      }).then(rs => {
        if (rs.head.errCode === 0 && rs.data) {
          this.dptName = rs.data.name
          this.deptType = rs.data.deptType ? rs.data.deptType.split(',') : []
          this.resourceName = rs.data.resourceName
          this.resourceType = rs.data.resourceType
          this.resourcePurpose = rs.data.resourcePurpose
          if (this.tabPosition === 'week') {
            this.$refs.arrangeweek.getNowWeeks()
            this.query()
          } else {
            this.$refs.listarrange.list()
          }
        }
      })
      this.categoryCode = val
    },
    publish () {
      let params = {
        startDate: this.weeks[0].date,
        endDate: this.weeks[this.weeks.length - 1].date,
        categoryCode: this.categoryCode,
      }
      Object.assign(this.params, params)
      this.$confirm('', '您是否确认发布当前排班表?', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.api.publishBydpt(this.params).then(rs => {
          if (rs.head.errCode === 0) {
            this.$messageTips(this, 'success', '发布成功')
            this.getArrangeList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    query () {
      // this.pagesize = 20
      if (this.isLoadmore) {
        this.offset = 0
        this.$refs.caltable.resetCount()
      }
      this.$nextTick(_ => {
        this.getArrangeList()
      })
    },
    updateWeek (val, date) {
      if (date) {
        this.$nextTick(_ => {
          this.$refs.caltable.resetCount()
          this.query()
        })
      }
      this.weeks = val
    },
    getOrgList (val) {
      this.api.getAllcliniclist().then(rs => {
        if (rs.head.errCode === 0) {
          // this.orgList = rs.data.resultList
          rs.data.resultList && rs.data.resultList.map(item => {
            if (item.id === this.$store.state.currentUser.organizationId.toString()) {
              this.params.orgId = item.id
              this.orgName = item.name
              this.org = {
                id: item.id,
                name: item.name,
                code: item.code
              }
            }
          })
        }
      })
    },
    showDialog (val) {
      let params = {
        orgId: this.params.orgId,
        orgName: this.orgName
      }
      this.instanceId = ''
      this.titleData = val && Object.assign(params, val)
      this.isEdit = false
      this.$nextTick(_ => {
        this.$refs.dpt.open()
      })
    },
    showWeek (val) {
      let params = {
        orgId: this.params.orgId,
        orgName: this.orgName,
        resourceId: val.doctorId,
        resourceType: this.resourceType
      }
      this.titleData = val && Object.assign(params, val)
      this.$nextTick(_ => {
        this.$refs.weekange.open()
      })
    },
    success (val) {
      if (this.tabPosition === 'list') {
        this.$refs.listarrange.list()
      } else {
        this.instanceId = ''
        this.query()
      }
    },
    refresh () {
      this.getArrangeList()
    },
    getArrangeList (isMore) {
      if (!this.params.orgId) return
      if (this.noMore) this.offset = 0
      let params = {
        categoryCode: this.categoryCode,
        orgId: this.params.orgId,
        tenantDeptId: this.params.tenantDeptId,
        resourceName: this.params.resourceName,
        startDate: this.weeks[0].date,
        endDate: this.weeks[this.weeks.length - 1].date,
        offset: this.offset,
        pagesize: this.pagesize
      }
      this.api.searchBydpt(params).then(rs => { // 科室排班查询
        if (rs.head.errCode === 0) {
          if (!isMore) {
            this.tableData = rs.data.resultList
          } else {
            this.noMore = !rs.data.resultList.length
            if (!rs.data.resultList.length) {
              this.count = this.$refs.caltable.count
            }
            this.tableData = rs.data.resultList ? this.tableData.concat(rs.data.resultList) : this.tableData
            let tempObj = {}
            this.tableData = this.tableData && this.tableData.reduce((cur, next) => {
              tempObj[next.id] ? '' : tempObj[next.id] = true && cur.push(next)
              return cur
            }, [])
          }
        }
      })
    },
    addArrange (week, val) {
      this.$emit('addArrange', { date: week, resource: val })
    },
  },
  components: {
    arrangeWeek,
    calendartable,
    dialogDptScheduling,
    dialogWeekArrange,
    copyPopover,
    listArrange
  }
}
</script>

<style scoped>
#calender {
  padding: 20px;
  background: #fff;
  overflow: hidden;
}
#calender .title {
  line-height: 36px;
}
#calender .changeweek {
  vertical-align: bottom;
}
#calender .changeweek /deep/ .el-button {
  border-radius: 0;
  width: 100px;
  float: left;
}
#calender .changeweek /deep/ .el-button:hover {
  border-color: #dcdfe6;
}
#calender .changeweek /deep/ .el-button + .el-button {
  margin-left: -1px;
}
.right {
  text-align: right;
}
.headbg {
  background-color: #f0f5fa !important;
  border-left: 1px solid #d0dbe4 !important;
  border-top: 1px solid #d0dbe4 !important;
}
</style>
