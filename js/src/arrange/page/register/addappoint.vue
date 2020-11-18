<template>
  <el-dialog
    title
    top="5vh"
    class="appoint"
    :close-on-click-modal="false"
    :visible.sync="showDialog"
    width="1441px"
  >
    <el-row type="flex" :gutter="20">
      <el-col :span="6" class="line">
        <form-content
          :title="init ? '修改预约': '添加预约'"
          :value="currentArrange"
          :numberList="numberList"
          :init-value="currentInit"
          :date="currentDay"
          :add-way="1"
          :is-show="showDialog"
          :is-appoint-number="isAppointNumber"
          :customer-service="customerService"
          :timerange="0"
          :isTijian="isTijian"
          @val="setFormVal"
          @success="appointSuccess"
          @getpatient="getNumberList"
          v-if="showDialog"
          @getServiceList="setServiceList"
        ></form-content>
      </el-col>
      <el-col :span="18">
        <el-row class="header" type="flex">
          <el-col style="width:360px">
            <strong class="title">挂号记录</strong>
          </el-col>
          <el-col></el-col>
          <el-col align="right"></el-col>
        </el-row>
        <el-table
          max-height="160"
          class="mb20"
          :data="numberList"
          highlight-current-row
          @current-change="handleCurrentChange"
          style="width: 100%"
        >
          <el-table-column prop="patientName" label="姓名" width="100"></el-table-column>
          <el-table-column label="性别" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.patientSex | formatSex}}</span>
            </template>
          </el-table-column>
          <el-table-column label="日期" width="120">
            <template slot-scope="scope">
              <span>{{$moment(scope.row.appointmentDate).format('YYYY/MM/DD')}}</span>
            </template>
          </el-table-column>
          <el-table-column label="时段" width="120">
            <template slot-scope="scope">
              <span>{{scope.row.appointmentStarttime}} - {{scope.row.appointmentEndtime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="科室" width="120">
            <template slot-scope="scope">
              <span>{{scope.row.deptName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="医生" width="120">
            <template slot-scope="scope">
              <span>{{scope.row.appointmentResourceName}}</span>
            </template>
          </el-table-column>
          <el-table-column width="160" label="服务" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.serviceName}}</span>
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
                class="blue"
                :class="stateStyle[scope.row.appointmentState].color"
              >{{stateStyle[scope.row.appointmentState].text}}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="科室排班" name="deptPannel">
            <arrange-calendar
              class="deptcalendar"
              :body-height="480"
              :value="params"
              :popover="true"
              :operate="2"
              :appoint-type="2"
              v-if="showDialog"
              @open="getArrangeAppoint"
              @select="setArrangeTrunk"
            ></arrange-calendar>
          </el-tab-pane>
          <el-tab-pane
            :label="item.name"
            :name="item.id"
            v-for="(item, i) in serviceList"
            :key="i + '-' + item.id"
          >
            <time-pannel
              :params="params"
              :service-id="item.id"
              :customer-service="customerService"
              v-if="currentTabIndex === i"
              @select="select"
            ></time-pannel>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import api from '@/arrange/store/appointapi'
import arrangeapi from '@/arrange/store/schedulingapi'
import formContent from '@/arrange/page/reservation/form.vue'
import arrangeCalendar from '@/arrange/page/register/arrange-calendar.vue'
import timePannel from '@/arrange/page/register/timepannel.vue'
import { APPOINT_STATUS } from '@/util/common'

export default {
  props: ['arrange', 'init', 'show', 'isAppointNumber', 'bodyHeight', 'msgType', 'customerService', 'isTijian'],
  data () {
    return {
      api,
      arrangeapi,
      showDialog: false,
      activeName: 'deptPannel',
      currentDay: '',
      currentArrange: '',
      currentInit: {},
      currentTabIndex: 0,
      numberList: [],
      serviceList: [],
      patient: { id: '' },
      params: {
        organId: '',
        deptId: '',
        deptName: '',
        resourceId: '',
        serviceId: ''
      },
      stateStyle: APPOINT_STATUS
    }
  },
  watch: {
    'show' (val) {
      this.showDialog = val
      this.activeName = 'deptPannel'
    },
    'showDialog' (val) {
      if (val) {
        this.currentInit = this.init
        this.getNumberList()
      } else {
        this.currentInit = ''
        this.currentDay = ''
        this.serviceList = []
        this.numberList = []
        this.params = {
          organId: '',
          deptId: '',
          deptName: '',
          resourceId: '',
          serviceId: ''
        }
      }
      this.$emit('update:show', val)
    },
    'init' (val) {
      this.currentInit = val
    },
    'params' (val) {
      this.activeName = val.serviceId ? val.serviceId : 'deptPannel'
      this.currentTabIndex = this.getServiceIndex(val.serviceId)
    },
    'serviceList': {
      handler () {
        this.currentTabIndex = this.getServiceIndex(this.params.serviceId)
      },
      deep: true
    }
  },
  created () {
    this.currentInit = this.init
  },
  methods: {
    select (val) {
      if (val) {
        this.currentInit = Object.assign(this.params, {
          appointmentStarttime: val.startTimeStr,
          appointmentEndtime: val.endTimeStr,
          appointmentResourceName: val.resourceName,
          appointmentResourceType: val.resourceType,
          timerange: '',
          timesliceId: val.timesliceId,
          changeTime: true
        })
        this.currentDay = this.$moment(val.date).format('YYYY-MM-DD')
      }
    },
    getNumberList (patient) {
      if (patient) {
        this.patient = patient
      }
      if (!this.patient || !this.patient.id) {
        return false
      }
      this.api.getNumberList({
        patientId: this.patient.id,
        appointmentType: 1
      }).then(rs => {
        if (rs.head.errCode || !rs.data[0]) {
          this.numberList = []
        } else {
          this.numberList = rs.data
          this.$emit('numberList', this.numberList[0]) // 门急诊医生诊间预约需要的信息
        }
      })
    },
    setFormVal (val) {
      this.params = Object.assign({}, {
        timeTrunkType: 1,
        organId: val.organId,
        deptId: val.deptId,
        deptName: val.deptName,
        resourceId: val.appointmentResourceId || val.resourceId,
        resourceName: val.appointmentResourceName || val.resourceName,
        resourceType: val.appointmentResourceType || val.resourceType,
        serviceId: val.serviceid || val.serviceId,
        date: val.appointmentDate,
        timesliceId: val.timesliceId,
        startTimeStr: val.appointmentStarttime
      })
    },
    appointSuccess (val) {
      this.showDialog = false
      this.$emit('success', val)
    },
    getArrangeAppoint (val) {
      this.currentDay = val.date
      this.currentArrange = val
      this.$emit('open', val)
    },
    handleCurrentChange (val) {
      if (!val) {
        return false
      }
      val.patient.agebirthday = { age: val.patient.age, birthday: val.patient.birthday }
      this.currentInit = Object.assign({}, {
        organId: val.organId,
        organName: val.organName,
        deptId: val.deptId,
        deptName: val.deptName,
        serviceid: val.serviceid,
        serviceName: val.serviceName,
        resourceId: val.appointmentResourceId,
        resourceName: val.appointmentResourceName,
        resourceType: val.appointmentResourceType,
        patient: val.patient
      })
    },
    setServiceList (val) {
      this.serviceList = this.params.resourceId ? val : []
    },
    setArrangeTrunk (val) {
      if (val) {
        delete val.organId
        this.currentDay = val.date
        this.currentInit = val
      }
    },
    handleClick (val) {
      this.currentTabIndex = parseInt(val.index) - 1
      if (val.name !== 'deptPannel') {
        this.currentInit = Object.assign(this.params, { serviceid: val.name, serviceId: val.name })
      } else {
        this.serviceList = []
        this.currentInit = {
          serviceid: '',
          serviceId: '',
          resourceId: '',
          resourceName: '',
          resourceType: '',
          appointmentResourceId: '',
          appointmentResourceName: '',
          appointmentResourceType: ''
        }
      }
    },
    getServiceIndex (id) {
      if (!this.serviceList[0] || !id) {
        return -1
      }
      return this.serviceList.findIndex((val, index, arr) => {
        return val.id + '' === id + ''
      })
    }
  },
  components: {
    formContent,
    arrangeCalendar,
    timePannel
  }
}
</script>

<style scoped>
.appoint /deep/ .el-dialog__body {
  padding-top: 0;
}
.appoint /deep/ .el-table__body {
  cursor: pointer;
}
.appoint /deep/ .el-dialog__header {
  padding-top: 20px;
}
.appoint /deep/ .el-dialog__headerbtn {
  top: 10px;
}
.line {
  border-right: 1px solid #ddd;
}
.header {
  margin: 20px 0;
}
.header strong.title {
  padding-left: 6px;
  border-left: 3px solid #1c7bef;
  font-size: 16px;
  color: #000;
}
</style>
