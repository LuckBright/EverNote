<template>
  <div>
    <el-row>
      <el-col :span="20">
        <el-form :model="params" :inline="true" size="small">
          <el-form-item label="机构">
            <ever-org-select type="select" v-model="selectOrgan" :params="{everQueryType: 'isOut', staffIdList: []}" :props="{clearable: false}"></ever-org-select>
          </el-form-item>
          <el-form-item label="科室">
            <ever-subject-select v-model="deptInfo" type="select" :params="deptParams"></ever-subject-select>
          </el-form-item>
          <el-form-item label="医生">
            <ever-staff-select v-model="params.resourceId" :params="resourceParams"></ever-staff-select>
          </el-form-item>
          <el-form-item label="患者">
            <div style="width:360px">
              <el-input
                size="small"
                v-model="params.queryPatientParam"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              style="width:300px;"
              v-model="params.dates"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="渠道">
            <el-cascader
              clearable
              style="width:100%"
              v-model="params.channelId"
              :props="channelOption"
              :options="channelList">
            </el-cascader>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="params.apptType">
              <el-option label="预约" :value="1"></el-option>
              <el-option label="挂号" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="params.appointmentState" clearable placeholder="请选择">
              <el-option
                v-for="item in statusOptions"
                :key="item.id"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label>
            <el-button @click.native="getTableData('first')">查询</el-button>
            <slot></slot>
            <el-button type class="ml10" size="small" @click="exportAppoint">导出</el-button>
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
    >
      <el-table-column  width="55" label="序号" align="center"><template slot-scope="scope">{{scope.$index + 1}} </template></el-table-column>
      <el-table-column  width="150" label="门诊号" align="center"><template slot-scope="scope">{{scope.row.visitNumber}} </template></el-table-column>
      <el-table-column v-if="operator" width="200" fixed="left" align="center" label="操作">
        <template slot-scope="scope">
          <div v-if="params.apptType === 1">
            <el-button size="small" plain type="primary" :disabled="![0, 1, -2].includes(scope.row.appointmentState) || scope.row.organId !== currentOrganId" @click="appointToRegister(scope.row)">预转挂</el-button>
            <el-button size="small" plain type="primary" @click="editAppoint(scope.row)" :disabled="![0, 1, -2].includes(scope.row.appointmentState) || !!scope.row.orderId || scope.row.organId !== currentOrganId">改约</el-button>
            <el-button size="small" plain @click="cannelAppoint(scope.row)" :disabled="![0, 1, -2, -4].includes(scope.row.appointmentState) || scope.row.organId !== currentOrganId || (scope.row.serviceOrder && !!scope.row.serviceOrder.isPaid)">取消</el-button>
          </div>
          <div v-if="params.apptType === 2">
            <el-button size="small" plain @click="returnRegister(scope.row)" :disabled="![0, 1, -2, -4].includes(scope.row.appointmentState) || scope.row.organId !== currentOrganId">退号</el-button>
            <el-button size="small" plain @click="print(scope.row)" :disabled="![0, 1, -2, -3, 2, 3, 4, 8, 9].includes(scope.row.appointmentState) || scope.row.organId !== currentOrganId">打印号条</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.patient && scope.row.patient.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.patient && scope.row.patient.sex | formatSex }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="年龄" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.patientAgeText}}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.patient && scope.row.patient.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.patient && scope.row.patient.sourceName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="预约日期" width="120">
        <template slot-scope="scope">
          <span>{{$moment(scope.row.date).format('YYYY/MM/DD')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="时段" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.startTimeStr}} - {{scope.row.endTimeStr}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="科室" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.deptName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="医生" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.resourceName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" label="服务">
        <template slot-scope="scope">
          <span>{{scope.row.serviceName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="操作日期">
        <template slot-scope="scope">
          <span>{{$moment(scope.row.modifyTime).format('YYYY-MM-DD')}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" label="挂号类别">
        <template slot-scope="scope">
          <sys-value type="CT05.10.004" :code="scope.row.registerTypeCode"></sys-value>
        </template>
      </el-table-column>
       <el-table-column width="120" label="就诊类型">
        <template slot-scope="scope">
          <span>{{scope.row.registerTypeCode | outVisitType}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" label="预约途径" v-if="params.apptType === 1">
        <template slot-scope="scope">
          <span>{{scope.row.appointWayName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" label="挂号方式" v-if="params.apptType === 2">
        <template slot-scope="scope">
          <span>{{scope.row.registerWayName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">
          <span>{{scope.row.symptom}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" align="left" label="状态">
        <template slot-scope="scope">
          <span
            :class="stateStyle[scope.row.appointmentState] ? stateStyle[scope.row.appointmentState].color : ''"
          >{{scope.row.appointmentStateDesc}}</span>
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
    <paymethodstwo
      :dialogVisible.sync="payVisible"
      :obj="yzsParams"
      @payStatus="payStatus"
      @closedialog="closePayDialog"
    ></paymethodstwo>
    <dialog-register-return :show.sync="isShowReturn" v-model="returnAppoint"></dialog-register-return>
  </div>
</template>
<script>
import api from '@/arrange/store/appointapi'
import apinew from '@/arrange/store/appointmentapi'
import moment from 'moment'
import { NUMBER_STATUS } from '@/util/common'
import dialogRegisterReturn from '@/arrange/page/appoint/dialog-register-return'
import serviceIconHandler from '@/workspace/page/service.panel/common/service.icon.handler'
import appointapi from '@/workspace/store/appointapi'
import { everprint } from '@/util/print'
import storage from '@/util/storage'

export default {
  props: ['operator', 'reset', 'type'],
  data () {
    return {
      everprint,
      storage,
      disabled: true,
      api,
      apinew,
      showDialog: false,
      payVisible: false,
      isShowReturn: false,
      returnAppoint: '',
      tableData: [],
      totalCount: 0,
      currentPage: 1,
      currentClinic: '',
      settlementInfo: '',
      appointmentInfo: '',
      yzsParams: {
        iscallback: true, // 外层loading
        loading: false,
        patientid: '', // 患者id
        id: '', // 结算单id
        orderId: '', // 订单ID
        settleCode: '', // 结算单号
        unexefee: 0, // 还需支付
        exefee: 0, // 已收金额
        totalFee: 0, // 总额
        payType: '4', // 0一站式挂号 1门诊 2住院(押金) 3商城(营销)5无处方结算写死的
        paymethodArr: [], // 支付方式
        isValited: false, // 押金是false,费用为true
        isDeposit: 0, // 是否押金(押金传1)
        isRefund: false,  // 是否退费(退费传true)
        isChange: false,
        visitNumber: '',
        medInsurPubPayFee: '',
        medInsurOwnPayFee: ''
      },
      params: {
        resourceId: '', // 医生Id
        apptType: 1,
        visitType: 1,
        patientId: '',
        queryPatientParam: '',
        date: '',
        dates: [],
        pagesize: 20,
        offset: 0,
        deptId: '',
        organId: '',
        channelId: []
      },
      selectOrgan: '',
      currentOrganId: storage.getLocalStorage('CLINICID'),
      currentOrganName: storage.getLocalStorage('CLINICNAME'),
      deptInfo: '',
      deptParams: {
        status: 'Y',
        orgIdList: [],
        type1CodeList: ['01'],
        type2CodeList: ['01.02', '01.03']
      },
      resourceParams: {
        everQueryType: 'out',
        typeCodeList: ['DOCTOR'],
        tenantSubjectIdList: []
      },
      stateStyle: NUMBER_STATUS,
      multipleSelection: [],
      iconList: ['cancelappoint', 'appoint', 'changepoint'],
      channelList: [],
      channelOption: {value: 'id', label: 'text', emitPath: true},
      statusOptions: []
    }
  },
  watch: {
    'selectOrgan' (val) {
      this.params.organId = val ? val.id : ''
      this.deptParams.orgIdList = val ? [val.id] : [this.storage.getLocalStorage('CLINICID')]
      this.deptInfo = ''
    },
    'deptInfo' (val) {
      this.params.deptId = val ? val.id : ''
      this.resourceParams.tenantSubjectIdList = val ? [val.id] : []
      this.params.resourceId = ''
    },
    'params.apptType': {
      handler () {
        this.getAppointStates()
        this.getTableData('first')
      },
      deep: false
    },
    'params.organId' (val) {
      if (val) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    'params.dates' (val) {
      if (val && val[0] && val[1]) {
        this.params.startDate = this.params.dates[0] ? moment(val[0]).format('YYYY-MM-DD') : ''
        this.params.endDate = val[1] ? moment(val[1]).format('YYYY-MM-DD') : ''
      } else {
        this.params.startDate = ''
        this.params.endDate = ''
      }
    },
    'params.queryPatientParam' (val, old) {
      if (!val || val !== old) {
        this.params.patientId = ''
      }
    },
    'reset' () {
      this.getTableData('first')
    }
  },
  created () {
    this.params.channel = 1
    this.params.dates[0] = this.$moment()
    this.params.dates[1] = this.$moment()
    this.params.startDate = this.$moment().format('YYYY-MM-DD')
    this.params.endDate = this.$moment().format('YYYY-MM-DD')
    this.selectOrgan = this.storage.getLocalStorage('CLINICID') ? {id: this.storage.getLocalStorage('CLINICID'), code: this.storage.getLocalStorage('CLINICID')} : ''
    this.getChannelList()
    this.getAppointStates()
    this.getTableData('first')
    this.$bus.$off('appoint:pay')
    this.$bus.$on('appoint:pay', val => {
      this.yzsParams.orderId = val.orderid || val.orderId
      this.yzsParams.patientid = val.patientid
      this.yzsParams.id = val.id
      this.yzsParams.accountbillId = val.accountbillId
      this.yzsParams.settleCode = val.settleCode
      this.yzsParams.unexefee = val.unexefee
      this.yzsParams.exefee = val.exefee
      this.yzsParams.totalFee = val.totalFee
      this.yzsParams.isRefund = val.isRefund
      this.yzsParams.visitNumber = val.visitNumber
      this.yzsParams.medInsurPubPayFee = val.medInsurPubPayFee
      this.yzsParams.medInsurOwnPayFee = val.medInsurOwnPayFee
      this.payVisible = true
      this.payAction = val.action
    })
    this.$bus.$off('pay:success')
    this.$bus.$on('pay:success', action => {
      if (action === 'toregister') {
        this.appointToRegisterEvent(this.appointmentInfo)
        return false
      }
      this.$bus.$emit('appoint:question', this.appointmentInfo)
      this.$bus.$emit('appoint:success', this.appointmentInfo, action)
    })
    this.$bus.$off('appoint:success')
    this.$bus.$on('appoint:success', (val, action) => {
      if (action === 'toregister' || action === 'add') {
        this.$messageTips(this, 'success', '预转挂已完成', '提示')
        this.getTableData()
      }
      if (action === 'cancel') {
        this.$messageTips(this, 'success', '退号成功', '提示')
        this.getTableData()
      }
    })
  },
  methods: {
    // 直接发请求退号
    async appointCancel (obj) {
      const res = await appointapi.cancel(obj.id)
      if (res && res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', '取消成功', '提示')
        this.getTableData()
      }
    },
    done () {
      this.getTableData()
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
        this.$messageTips(this, 'success', '预约已确认', '预约成功')
        this.show = false
        this.$emit('success', true)
      })
    },
    getTableData (isFirst) {
      if (isFirst) {
        this.params.offset = 0
        this.currentPage = 1
      }
      if (this.type === 1) {
        this.api.queryAppointList(this.params).then(rs => {
          if (!rs.head.errCode) {
            this.totalCount = rs.totalCount
            this.tableData = rs.data
          }
        })
      } else {
        this.api.getNumberList(this.params).then(rs => {
          if (!rs.head.errCode) {
            this.totalCount = rs.totalCount
            this.tableData = rs.data
          }
        })
      }
    },
    exportAppoint () {
      let params = Object.assign({}, this.params)
      /*
      if (!params.startDate) {
        params.startDate = this.$moment().format('YYYY-MM-DD')
      }
      if (!params.endDate) {
        params.endDate = this.$moment().format('YYYY-MM-DD')
      }
      */
      delete params.offset
      delete params.pagesize
      this.api.exportAppointList(params).then(rs => {
        window.open(this.$ever.fileUrl2 + rs.data.fileId, '_blank')
        this.$messageTips(this, 'success', '数据已导出', '提示')
      })
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
    editAppoint (item, isChange = false) {
      if (isChange) {
        item._isChange = isChange
      }
      let pathurl = item.dataSource === '1' ? '/kanban/registerpanel' : '/kanban/appointpanel'
      this.$router.push({
        path: pathurl,
        query: {
          id: item.id
        }
      })
      // this.$emit('edit', item)
    },
    cannelAppoint (item) {
      this.$confirm('您确定要取消预约吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.api.cannelAppoint({ id: item.id, description: '' }).then(rs => {
          if (!rs.head.errCode) {
            this.$messageTips(this, 'success', '预约已取消成功', '提示')
            this.getTableData()
          }
        })
      })
    },
    returnRegister (val) {
      this.returnAppoint = val
      this.isShowReturn = true
    },
    getChannelList () {
      this.apinew.getChannelList().then(rs => {
        this.channelList = rs.data.resultList
      })
    },
    getAppointStates () {
      this.apinew.getAppointStates({apptType: this.params.apptType}).then(rs => {
        this.statusOptions = rs.data
      })
    },
    appointToRegister (val) {
      if (val.serviceOrder && !val.serviceOrder.isPaid) {
        this.apinew.getSettlementInfo({ id: val.id, returnFlag: 0 }).then(rs => {
          this.settlementInfo = rs.data
          this.appointmentInfo = val
          if (this.settlementInfo && Object.keys(this.settlementInfo).length) {
            this.settlementInfo.action = 'toregister'
            this.$bus.$emit('appoint:pay', this.settlementInfo)
            return false
          }
        })
      } else {
        this.appointToRegisterEvent({
          id: val.id,
          patientId: val.patientId,
          isSceneAppoint: val.isSceneAppoint,
          date: val.dateStr,
          startTimeStr: val.startTimeStr,
          endTimeStr: val.endTimeStr,
          organId: val.organId,
          organName: val.organName,
          deptId: val.deptId,
          deptName: val.deptName,
          resourceId: val.resourceId,
          resourceName: val.serviceName,
          serviceId: val.serviceId,
          serviceName: val.serviceName
        })
      }
    },
    appointToRegisterEvent (val) {
      this.apinew.changeAppoint(val).then(rs => {
        if (rs.data.checkResultVO && !rs.data.checkResultVO.passed) {
          this.$messageTips(this, 'warning', rs.data.checkResultVO.message)
          return false
        }
        rs.data.appointmentInfo.patient = {
          id: rs.data.appointmentInfo.patientId,
          name: rs.data.appointmentInfo.patientName,
          mobile: rs.data.appointmentInfo.patientPhone,
          sex: rs.data.appointmentInfo.patientSex
        }
        this.settlementInfo = rs.data.settlementInfo
        this.appointmentInfo = rs.data.appointmentInfo
        if (this.settlementInfo && Object.keys(this.settlementInfo).length) {
          this.settlementInfo.action = 'add'
          this.$bus.$emit('appoint:pay', this.settlementInfo)
          return false
        }
        this.$bus.$emit('appoint:question', this.appointmentInfo)
        this.$bus.$emit('appoint:success', this.appointmentInfo, 'toregister')
      })
    },
    payStatus (val) {
      this.$bus.$emit('pay:success', this.payAction)
    },
    closePayDialog (val) {
      this.payVisible = false
      this.getTableData()
    },
    print (val) {
      let params = {queryApptNum: true}
      this.apinew.getRcmData({orderid: val.orderId}).then(rs => {
        if (val.visitNumber) {
          params.visitNumber = val.visitNumber
        }
        if (val.patientId) {
          params.patientId = val.patientId
        }
        if (rs.data[0]) {
          params.id = rs.data[0].id
        }
        if (val.orderId) {
          params.orderId = val.orderId
        }
        everprint('registform', params, {
          preview: true,
          cb: _ => {
            console.log('打印完成')
          }
        })
      })
    }
  },
  components: {
    serviceIconHandler,
    dialogRegisterReturn
  },
  filters: {
    outVisitType (val) {
      let visitType
      if (['1', '4', '5', '6', '7', '11', '12'].includes(val)) {
        visitType = '门诊'
      }
      if (['2', '21', '22'].includes(val)) {
        visitType = '急诊'
      }
      if (['3', '31', '32', '33'].includes(val)) {
        visitType = '体检'
      }
      if (['99'].includes(val)) {
        visitType = '其他'
      }
      return visitType
    }
  }
}
</script>
<style scoped>
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
