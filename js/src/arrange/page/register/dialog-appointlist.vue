<template>
  <div class="flex_col_1_auto" id="appointRegister">
    <el-row>
      <el-col :span="24">
        <el-form :model="params" :inline="true" size="small">
          <el-form-item label>
            <el-select v-model="params.type" placeholder="请选择">
              <el-option
                v-for="item in typeData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="机构" v-if="type == 2">
            <el-select v-model="params.organId" placeholder="请选择机构" clearable>
              <el-option
                v-for="(temp, i) in orgItemList"
                :key="i"
                :value="temp.organId"
                :label="temp.organName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="患者" v-if="type == 1">
            <div style="width:360px">
              <ever-patient-select
                v-model="params.queryPatientParam"
                :allow-create="true"
                @select="selectPatient"
              ></ever-patient-select>
            </div>
          </el-form-item>
          <el-form-item label="科室" v-if="type == 1">
            <dept-cascader
              v-model="deptInfo"
              :organ-id="params.organId"
              :template-type="1"
              :show-first-dept="false"
            ></dept-cascader>
          </el-form-item>
          <el-form-item label="医生" v-if="type == 1">
            <el-select v-model="params.appointmentResourceId" placeholder="请选择医生" clearable>
              <el-option
                v-for="(temp, i) in doctorList"
                :key="i"
                :value="temp.staffId"
                :label="temp.staffName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="爱院">
            <appointbest ref="aiyuan"></appointbest>
          </el-form-item>
          <el-form-item label="来源">
            <source-select v-model="params.channelId" :multiple="false"></source-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              v-model="params.date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="渠道" v-if="type == 2">
            <el-select v-model="params.channel" clearable placeholder="请选择">
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="params.appointmentState" clearable placeholder="请选择">
              <el-option
                v-for="item in statusOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label>
            <el-select v-model="params.isUnusualStatus" placeholder="请选择">
              <el-option
                v-for="item in UnusualData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label>
            <el-button @click.native="getTableData" type="primary">查询</el-button>
          </el-form-item>
          <el-form-item class="fr">
            <slot></slot>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-table
      border
      max-height="680"
      class="mb20"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName">
      <el-table-column type="selection" width="55" v-if="type == 2"></el-table-column>
      <el-table-column label="姓名" min-width="103">
        <template slot-scope="scope">
          <span>{{scope.row.patient && scope.row.patient.name ? scope.row.patient.name : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" min-width="50">
        <template slot-scope="scope">
          <sys-value type="GBT.2261.1" :code="scope.row.patient && scope.row.patient.sex ? scope.row.patient && scope.row.patient.sex : ''"></sys-value>
        </template>
      </el-table-column>
      <el-table-column align="center" label="年龄" min-width="50">
        <template slot-scope="scope">
          <span>{{scope.row.patient && scope.row.patient.age ? scope.row.patient.age : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" min-width="109">
        <template slot-scope="scope">
          <span>{{scope.row.patient && scope.row.patient.mobile ? scope.row.patient.mobile : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="来源" min-width="76">
        <template slot-scope="scope">
          <span>{{scope.row.channelName}}</span>
          <!-- <span>{{scope.row.patient && scope.row.patient.sourceName}}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="预约日期" min-width="105px">
        <template slot-scope="scope">
          <span>{{$moment(scope.row.date).format('YYYY/MM/DD')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" min-width="58">
        <template slot-scope="scope">
          <span>{{scope.row.startTimeStr}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="科室" min-width="104">
        <template slot-scope="scope">
          <span>{{scope.row.deptName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="医生" min-width="76">
        <template slot-scope="scope">
          <span>{{scope.row.resourceName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务" min-width="100">
        <template slot-scope="scope">
          <span>{{scope.row.serviceName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="状态" min-width="72">
        <template slot-scope="scope">
          <span
            :class="stateStyle[scope.row.appointmentState].color"
          >{{stateStyle[scope.row.appointmentState].text}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="爱院科室" min-width="104">
        <template slot-scope="scope">
          <span>{{scope.row.referrerDeptName || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="爱院人" min-width="76">
        <template slot-scope="scope">
          <span>{{scope.row.referrerName || '--'}}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="备注" min-width="141">
        <template slot-scope="scope">
          <span v-if="scope.row.appointmentState != -1">{{scope.row.symptom}}</span>
          <span v-else-if="params.type == '1'">{{scope.row.cancelComments}}</span>
          <span v-else-if="params.type == '2'">{{scope.row.cancelReason}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="operator" fixed="right" align="left" label="操作" min-width="164">
        <template slot-scope="scope">
          <div v-if="[0, 1, -2].includes(scope.row.appointmentState) && type == 1">
            <el-button
              v-if="params.type == 1 && scope.row.subsequentVisit != 4"
              type="primary"
              size="small"
              @click="createPatient(scope.row)"
              :disabled="!!scope.row.patientId"
            >建档</el-button>
            <el-button
              v-if="params.type == 1 && scope.row.subsequentVisit != 4"
              type="primary"
              size="small"
              @click="editAppoint(scope.row)"
            >改约</el-button>
            <el-button size="small" @click="cannelAppoint(scope.row)">取消</el-button>
            <el-button
              v-if="isTijian && scope.row.businessDataStatus != 1 && scope.row.patientId"
              type="primary"
              size="small"
              @click="establish(scope.row)"
            >下单</el-button>
            <bindpatient
              :data="scope.row"
              v-if="isTijian && scope.row.businessDataStatus !=1 && !scope.row.patientId"
              @bindpatient="done"
            ></bindpatient>
          </div>
          <div v-if="type==2">
            <service-icon-handler
              :listData="scope.row"
              :show-key-list="iconList"
              @tuihao="appointCancel"
              @done="done()"
            ></service-icon-handler>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="24" align="right">
        <el-pagination
          v-if="params.type == 1"
          v-show="totalCount > 0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[20, 50, 100]"
          :page-size="params.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        ></el-pagination>
        <el-pagination
          v-else
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
    <!-- 下单弹窗 -->
    <establish-package-order
      :dialogVisible.sync="paydialogVisible"
      :initoptions="options1"
      @establishCallback="establishCallback"
      :isMedcenter="true"
      @closePayLogCallback="closePayLogCallback"
      :medcenterInfo="medcenterInfo"
      :patient="medpatientId"
    ></establish-package-order>
  </div>
</template>

<script>
import api from '@/arrange/store/appointapi'
import moment from 'moment'
import deptCascader from '@/arrange/page/scheduling/deptcascader'
import { APPOINT_STATUS, NUMBER_STATUS, APPOINT_STATUS_ARRAY } from '@/util/common'
import serviceIconHandler from '@/workspace/page/service.panel/common/service.icon.handler'
import appointapi from '@/workspace/store/appointapi'
import appointbest from '@/arrange/page/reservation/appointbest'
import establishPackageOrder from '@/crm/page/packagesale/establishpackageorder'
import bindpatient from '@/medcenter/page/bindpatient'
export default {
  props: ['operator', 'reset', 'type', 'isTijian'],
  data () {
    return {
      api,
      showDialog: false,
      tableData: [],
      totalCount: 0,
      currentPage: 1,
      params: {
        appointmentType: 1,
        patientId: '',
        queryPatientParam: '',
        appointmentDate: '',
        pagesize: 20,
        offset: 0,
        isUnusualStatus: null,
        type: this.$route.params.type ? this.$route.params.type : '1',
        date: [],
        appointmentResourceId: '',
        referrerDeptId: '',
        referrer: ''
      },
      patientId: this.$route.params.patientId ? this.$route.params.patientId : null,
      stateStyle: APPOINT_STATUS,
      multipleSelection: [],
      iconList: ['cancelappoint', 'appoint'],
      options: [{ id: 1, name: '全部' }],
      statusOptions: APPOINT_STATUS_ARRAY,
      orgItemList: [],
      UnusualData: [{ id: null, name: '全部' }, { id: 1, name: '异常' }],
      typeData: [{ id: '1', name: '预约' }, { id: '2', name: '挂号' }],
      deptInfo: '',
      doctorList: [],
      paydialogVisible: false,
      options1: {
        zfzt: [
          { id: '', name: '全部' },
          { id: '1', name: '已付' },
          { id: '2', name: '未付' },
          { id: '3', name: '部分支付' }
        ],
        tf: [
          { id: '', name: '全部' },
          { id: '1', name: '未退费' },
          { id: '2', name: '全部退费' },
          { id: '3', name: '部分退费' }
        ],
        xsbm: [],
        xsy: []
      },
      medcenterInfo: {},
      medpatientId: {}
    }
  },
  watch: {
    deptInfo (val) {
      this.params.deptId = val ? val.id : ''
      this.getDoctor()
    },
    'params.date' (val) {
      // 清空日期时触发
      if (val === null) {
        this.params.startDate = ''
        this.params.endDate = ''
        return
      }
      if (this.params.date && this.params.date[0] && this.params.date[1]) {
        this.params.startDate = this.params.date[0] ? moment(this.params.date[0]).format('YYYY-MM-DD') : ''
        this.params.endDate = this.params.date[1] ? moment(this.params.date[1]).format('YYYY-MM-DD') : ''
      }
    },
    'params.queryPatientParam' (val, old) {
      if (!val || val !== old) {
        this.params.patientId = ''
      }
    },
    'params.type' (val) {
      this.params.pagesize = 20
      this.params.offset = 0
      this.currentPage = 1
      this.stateStyle = val === '1' ? APPOINT_STATUS : NUMBER_STATUS
      this.getTableData()
    },
    reset () {
      this.getTableData()
    }
  },
  created () {
    this.params.isUnusualStatus = null
    this.params.channel = 1
    // 选择未来六天
    if (this.type === 1) {
      this.pickDay(6)
    }
    if (this.patientId) {
      this.params.patientId = this.patientId
    }
    this.getTableData()
    // this.getOrgList()
  },
  methods: {
    establish (row) {
      this.medcenterInfo = {
        appointmentId: row.id,
        deptId: row.deptId,
        deptName: row.deptName
      }
      this.medpatientId = {
        id: row.patientId,
        name: row.patientName,
        sex: row.patientSex,
        birthday: row.patient.birthday ? moment(row.patient.birthday).format('YYYY-MM-DD') : '',
        patientNumber: row.patient.patientOrg && row.patient.patientOrg.patientNumber ? row.patient.patientOrg.patientNumber : ''
      }
      this.paydialogVisible = true
    },
    establishCallback (val) {
      if (val) {
        this.getTableData()
      }
    },
    closePayLogCallback () {
      this.getTableData()
    },
    getDoctor () {
      this.doctorList = []
      this.params.appointmentResourceId = ''
      if (this.params.deptId === '' || this.deptInfo === '') {
        return
      }
      api.getDoctor({
        deptId: this.params.deptId,
        clinicId: this.deptInfo.organId,
        staffType: 39
      }).then(res => {
        if (res.head.errCode === 0 && res.data) {
          this.doctorList = res.data
          return
        }
      })
    },
    // 选择几天之间的值
    pickDay (timeRange) {
      const dayTime = new Date()
      const startDay = dayTime
      // const endDay = dayTime.getTime() + 3600 * 1000 * 24 * timeRange
      this.params.date.push(startDay)
      this.params.date.push(dayTime)
    },
    // 直接发请求退号
    async appointCancel (id) {
      const res = await appointapi.cancel(id)
      if (res && res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', '取消成功', '提示')
        this.getTableData()
      }
    },
    tableRowClassName ({ row, rowIndex }) {
      if (row && row.isUnusualStatus === 1) {
        return 'success-isUnusualStatus'
      } else {
        return ''
      }
    },
    done () {
      this.getTableData()
    },
    getOrgList () {
      this.api.getOrgList().then(rs => {
        if (rs && rs.data && rs.data.resultList) {
          rs.data.resultList.map(item => {
            this.orgItemList.push({
              organId: '' + item.clinicId,
              organName: item.clinicName
            })
          })
        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.$emit('getPatient', val)
    },
    confirmAppoint (val) {
      let params = {
        timeTrunkType: '1',
        appointmentId: val.id,
        confirmAppointmentStarttime: val.appointmentStarttime,
        timerange: val.timerange
      }
      this.api.confirmAppoint(params).then(rs => {
        if (rs.head.errCode) {
          return false
        }
        this.$notify({
          type: 'success',
          title: '预约成功',
          message: '预约已确认',
          duration: 3000
        })
        this.show = false
        this.$emit('success', true)
      })
    },
    getTableData () {
      if (this.$refs.aiyuan) {
        this.params.referrerDeptId = this.$refs.aiyuan.bestDept
          ? this.$refs.aiyuan.bestDept.id
          : ''
        this.params.referrer = this.$refs.aiyuan.bestResource.name
          ? this.$refs.aiyuan.bestResource.id
          : ''
      }
      if (this.isTijian) {
        this.params.subsequentVisit = 4
      }
      if (this.params.type === '1') {
        // 预约
        this.api.queryAppointList(this.params).then(rs => {
          if (!rs.head.errCode) {
            this.totalCount = rs.totalCount
            this.tableData = rs.data
          }
        })
      } else {
        // 挂号
        this.api.getNumberList(this.params).then(rs => {
          if (!rs.head.errCode) {
            this.totalCount = rs.totalCount
            this.tableData = rs.data
          }
        })
      }
    },
    selectPatient (val) {
      this.params.queryPatientParam = val.name
      this.params.patientId = val.id
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
    editAppoint (item) {
      this.$emit('edit', item)
    },
    cannelAppoint (item) {
      const h = this.$createElement
      const request =
        this.params.type === '1'
          ? this.api.cannelAppointRecord
          : this.api.cannelAppoint
      this.$prompt('', '备注', {
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
        request({ id: item.id, cancelReason: value }).then(rs => {
          if (!rs.head.errCode) {
            this.$messageTips(
              this,
              'success',
              (this.params.type === '1' ? '预约' : '挂号') + '已取消',
              '取消成功'
            )
            this.getTableData()
          }
        })
      })
    },
    createPatient (val) { // 建档
      this.$router.push({ path: '/crm/HnMemberadd' })
      let tempObj = {
        id: val.id,
        patient: {
          name: val.patient && val.patient.name,
          sex: val.patient && val.patient.sex,
          birthday: val.patient && val.patient.birthday && moment(val.patient.birthday).format('YYYY-MM-DD'),
          mobile: val.patient && val.patient.mobile,
          source: val.patient && val.patient.source
        }
      }
      this.$store.commit('setPatient', tempObj)
    }
  },
  components: {
    serviceIconHandler,
    deptCascader,
    appointbest,
    establishPackageOrder,
    bindpatient
  }
}
</script>
<style>
#appointRegister .el-table .success-isUnusualStatus td {
  background-color: #fddfdf !important;
}
</style>
