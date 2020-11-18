<template>
  <div class="layout_inner">
    <el-row>
      <el-col :span="20">
        <el-form :model="params" :inline="true">
          <el-form-item label="患者姓名">
            <el-input v-model="params.patientName" placeholder="患者姓名" size="small"></el-input>
          </el-form-item>
          <el-form-item label="患者档案号">
            <el-input v-model="params.patientNumber" placeholder="患者档案号" size="small"></el-input>
          </el-form-item>
          <el-form-item :label="categoryCodes[params.visitType].text + '项目'">
            <el-input v-model="params.serviceName" size="small" placeholder="全部"></el-input>
          </el-form-item>
          <el-form-item label="执行机构"> 
            <ever-org-select type="select" size="small" placeholder="请选择执行机构"  :params="{everQueryType: 'isOut', staffIdList: []}" v-model="selectOrgan" :props="{clearable: false, size: 'small'}"></ever-org-select>
          </el-form-item>
          <el-form-item label="执行科室">
            <ever-subject-select v-model="selectDept" placeholder="全部" :params="categoryCodes[params.visitType]" type="select" :props="{clearable: true, size: 'small'}" clearable filterable></ever-subject-select>     
          </el-form-item>
          <el-form-item :label="categoryCodes[params.visitType].text + '室'">
            <ever-room-select v-model="selectRoom" :params="roomParams" placeholder="全部"
             :use-obj="true" :props="{clearable: true, size: 'small'}" filterable></ever-room-select>     
          </el-form-item>
          <el-form-item :label="params.visitType === 4 ? '手术时间' : '预约时间'">
            <el-date-picker
              size="small"
              style="width:300px;"
              v-model="params.dates"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="状态">
            <el-select size="small" v-model="params.appointmentState" clearable placeholder="请选择">
              <el-option
                v-for="item in statusOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label>
            <el-button @click.native="search" size="small">查询</el-button>
            <el-button type="primary" size="small" @click="addInspect">预约{{categoryCodes[params.visitType].text}}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4" align="right">
        <slot></slot>
      </el-col>
    </el-row>
    <el-table
      border
      max-height="680"
      class="mb20"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column width="50" align="center">
        <template slot-scope="scope">
          <span>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="患者姓名">
        <template slot-scope="scope">
          <span>{{scope.row.patientName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="患者档案号" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.patientNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="categoryCodes[params.visitType].text + '项目'">
        <template slot-scope="scope">
          <span>{{scope.row.serviceName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行机构">
        <template slot-scope="scope">
          <span>{{scope.row.organName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="执行科室">
        <template slot-scope="scope">
          <span>{{scope.row.deptName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="categoryCodes[params.visitType].text + '室'">
        <template slot-scope="scope">
          <span>{{scope.row.resourceName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="160" align="center" label="申请时间">
        <template slot-scope="scope">
          <span>{{$moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="120" :label="params.visitType === 4 ? '手术日期' : '预约日期'">
        <template slot-scope="scope">
          <span>{{scope.row.dateStr}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="120" :label="params.visitType === 4 ? '手术时间' : '预约时间'">
        <template slot-scope="scope">
          <span>{{scope.row.startTimeStr}}-{{scope.row.endTimeStr}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80" align="center" label="执行状态">
        <template slot-scope="scope">
          <span v-if="scope.row.adviceExecuteInfo">{{scope.row.adviceExecuteInfo.executeStatusDesc}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column width="80" align="center" label="预约状态">
        <template slot-scope="scope">
          <span>{{scope.row.visitStatusDesc}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" fixed="right" align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="setCurrentData(scope.row)" :disabled="isUpdate(scope.row)">改约</el-button>
          <el-button size="mini" type="danger"  @click="cancelAppoint(scope.row)" :disabled="isCancel(scope.row)">取消</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="24" align="right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[20, 50, 100]"
          :page-size="params.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        ></el-pagination>
      </el-col>
    </el-row>
    <dialog-inspect :show.sync="showAddDialog" :type="params.visitType" :value="currentData" :scene="params.bizScene" @success="getTableData"></dialog-inspect>
  </div>
</template>
<script>
import api from '@/arrange/store/appointmentapi'
import storage from '@/util/storage'
import dialogInspect from '@/arrange/page/appoint/dialog-addinspect.vue'
import { NUMBER_STATUS, REPORT_EXAMINE_STATUS } from '@/util/common'

export default {
  data () {
    return {
      storage,
      api,
      categoryCodes: {
        1: {
          status: 'Y',
          code: 'OUTPATIENT_DOCTOR',
          roomCode: ['CONSULTING_ROOM'],
          text: '门诊',
          type: '',
          orgIdList: [storage.getLocalStorage('CLINICID')],
          type1CodeList: ['01'],
          type2CodeList: ['01.02']
        },
        2: {
          status: 'Y',
          code: 'EXAMINE',
          roomCode: ['EXAMIMATION_ROOM'],
          text: '检查',
          type: '800',
          orgIdList: [storage.getLocalStorage('CLINICID')],
          type1CodeList: ['02'],
          type2CodeList: ['02.01']
        },
        3: {
          status: 'Y',
          code: 'TREATMENT',
          roomCode: ['TREATMENT_ROOM'],
          text: '治疗',
          type: '802',
          orgIdList: [storage.getLocalStorage('CLINICID')],
          type1CodeList: ['02'],
          type2CodeList: ['02.03']
        },
        4: {
          status: 'Y',
          code: 'OUTPATIENT_SURGERY',
          roomCode: ['OPERATION_ROOM'],
          text: '手术',
          type: '2125',
          orgIdList: [storage.getLocalStorage('CLINICID')],
          type1CodeList: ['02'],
          type2CodeList: ['02.04']
        }
      },
      tableData: [],
      totalCount: 0,
      currentClinic: '',
      currentPage: 1,
      currentData: '',
      showAddDialog: false,
      params: {
        id: '', // 医生Id
        bizScene: this.$route.params.scene || 1,
        visitType: this.$route.params.type,
        patientId: '',
        patientName: '',
        patientNumber: '',
        date: '',
        startDate: '',
        endDate: '',
        dates: [],
        visitOrgId: '',
        visitOrgName: '',
        deptId: '',
        serviceName: '',
        resourceId: '',
        pagesize: 20,
        offset: 0
      },
      selectOrgan: '',
      selectDept: '',
      selectRoom: '',
      roomParams: {
        orgIdList: storage.getLocalStorage('CLINICID') ? [storage.getLocalStorage('CLINICID')] : [],
        tenantSubjectIds: [],
        roomPurposeCodeList: []
      },
      stateStyle: NUMBER_STATUS,
      exeStatus: REPORT_EXAMINE_STATUS,
      options: [{ id: 1, name: '全部' }],
      statusOptions: [
        {
          id: 1,
          name: '已预约'
        },
        {
          id: -1,
          name: '已取消'
        },
        {
          id: -2,
          name: '已爽约'
        }
      ]
    }
  },
  watch: {
    'selectRoom' (val) {
      this.params.resourceId = val ? val.id : ''
    },
    'selectOrgan' (val) {
      this.params.visitOrgId = val ? val.id : ''
      this.params.visitOrgName = val ? val.name : ''
      this.categoryCodes[this.params.visitType].orgIdList = val ? [val.id] : []
      this.roomParams.orgIdList = val ? [val.id] : []
      this.selectDept = ''
      this.getTableData()
    },
    'selectDept' (val) {
      this.params.deptId = val ? val.id : ''
      this.selectRoom = ''
      this.roomParams.tenantSubjectIds = val ? [val.orgSubjectCode] : []
      this.roomParams.roomPurposeCodeList = this.categoryCodes[this.params.visitType].roomCode
    },
    'params.dates' (val) {
      if (!val || !val[0]) {
        this.params.startDate = ''
        this.params.endDate = ''
      } else if (val.length === 2) {
        this.params.startDate = val[0] ? this.$moment(val[0]).format('YYYY-MM-DD') : ''
        this.params.endDate = val[1] ? this.$moment(val[1]).format('YYYY-MM-DD') : ''
      }
    },
    'reset' () {
      this.getTableData()
    },
    '$route.params.type' (val) {
      this.selectDept = ''
      this.selectRoom = ''
      this.resetParams()
      this.getTableData()
    },
    '$route.params.scene' (val) {
      this.resetParams()
      this.getTableData()
    },
    '$store.state.currentUser.organizationId' (val) {
      this.selectOrgan = {
        id: val + '',
        code: val + '',
        name: this.$store.state.currentUser.organizationName
      }
    }
  },
  created () {
    this.params.visitType = this.$route.params.type ? parseInt(this.$route.params.type) : 2
    this.params.bizScene = this.$route.params.scene ? parseInt(this.$route.params.scene) : 1
    this.roomParams.roomPurposeCodeList = this.categoryCodes[this.params.visitType].roomCode
    this.getTableData()
  },
  methods: {
    resetParams () {
      this.params = {
        id: '', // 医生Id
        bizScene: this.$route.params.scene ? parseInt(this.$route.params.scene) : 1,
        visitType: this.$route.params.type ? parseInt(this.$route.params.type) : 2,
        patientId: '',
        patientName: '',
        patientNumber: '',
        date: '',
        startDate: '',
        endDate: '',
        dates: [],
        visitOrgId: this.$store.state.currentUser.organizationId,
        visitOrgName: this.$store.state.currentUser.organizationName,
        deptId: '',
        serviceName: '',
        pagesize: 20,
        offset: 0
      }
      this.selectOrgan = {
        id: this.$store.state.currentUser.organizationId + '',
        code: this.$store.state.currentUser.organizationId + '',
        name: this.$store.state.currentUser.organizationName
      }
      this.roomParams.roomPurposeCodeList = this.categoryCodes[this.params.visitType].roomCode
    },
    addInspect () {
      this.currentData = ''
      this.showAddDialog = true
    },
    search () {
      this.params.offset = 0
      this.currentPage = 1
      this.getTableData()
    },
    getTableData () {
      this.api.getExecuteAppoint(this.params).then(rs => {
        this.tableData = rs.data
        this.totalCount = rs.totalCount
      })
    },
    setCurrentData (val) {
      this.currentData = val
      this.showAddDialog = true
    },
    handleSizeChange (val) {
      this.params.pagesize = val
      this.params.offset = (this.currentPage - 1) * this.params.pagesize
      this.getTableData()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.params.offset = (val - 1) * this.params.pagesize || 0
      this.getTableData()
    },
    cancelAppoint (val) {
      this.$confirm('是否取消本次预约?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.api.cancelExecuteAppoint({id: val.id}).then(rs => {
          this.$messageTips(this, 'success', '预约已取消成功', '提示')
          this.getTableData()
        })
      }).catch(() => {
        return false
      })
    },
    isUpdate (val) {
      let _isUpdate = new Date(val.dateStr).getTime() < Date.now() - 8.64e7 || val.visitStatus !== 1 || (val.adviceExecuteStatus && val.adviceExecuteStatus !== 10)
      return _isUpdate
    },
    isCancel (val) {
      let _isCancel = val.visitStatus !== 1 || (val.adviceExecuteStatus && val.adviceExecuteStatus !== 10)
      return _isCancel
    }
  },
  components: {
    dialogInspect
  }
}
</script>
<style scoped>
.el-form-item {margin-bottom: 5px;}
.el-form /deep/.el-form-item__label {line-height: 40px; height: 40px;}
.blue {
  color: #1c7bef;
}
.green {
  color: #61a812;
}
.orange {
  color: #e38748;
}
.violet {
  color: #bd10e0;
}
.gray {
  color: #666666;
}
.deepblue {
  color: #366298;
}
</style>
