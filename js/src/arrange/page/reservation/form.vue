<template>
  <div class="body">
    <div class="title">
      <label>{{title}}</label>
      <i class="el-icon-close" @click="closeDialog" v-if="timerange"></i>
    </div>
    <el-form :model="form" label-width="88px" label-position="right" ref="form">
      <el-form-item label="患者姓名" prop="patient.name" :rules="rules.required">
        <ever-patient-select
          v-model="form.patient.name"
          @select="selectPatient"
          :disabled="!!form.id"
          :allow-create="true"
          :grey-denies-dialog-show="true"
          v-if="isShow"
          :showAttrType="true"
        ></ever-patient-select>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="form.patient.sex" :disabled="disabled.sex">
          <el-radio label="1">男</el-radio>
          <el-radio label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="出生日期">
        <el-row :gutter="10" type="flex">
          <el-col>
            <!-- <age v-model="form.patient.agebirthday" :isFlag="false" :disabled="disabled.age"></age> -->
            <age v-model="form.patient.birthday" :disabled="!form.patient.birthday"></age>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="手机号码" prop="patient.mobile" :rules="rules.required">
        <el-input
          :disabled="disabled.mobile"
          v-model="form.patient.mobile"
          placeholder="手机号码"
          v-on:input="inputTrigger"
        ></el-input>
      </el-form-item>
      <el-form-item label="患者来源" prop="patient.source" :rules="rules.required">
        <source-select v-model="form.patient.source" :multiple="false"></source-select>
      </el-form-item>
      <el-row v-if="timerange">
        <el-col :span="12">
          <el-form-item label="看诊科室">
            <deptinfo :id="value.deptId" :name="value.deptName"></deptinfo>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="看诊医生" v-if="timerange">
            <span>{{value.resourceName}}</span>
            <el-tooltip
              v-if="resourceInfo && resourceInfo.reservationPrecautions"
              popper-class="warning"
              effect="light"
              :content="resourceInfo.reservationPrecautions"
              placement="right"
            >
              <i
                class="iconfont icon-gantanhao"
                style="margin-left:10px; color:#ee4433;font-size:14px;"
              ></i>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="看诊科室" prop="deptId" :rules="rules.required" v-if="!timerange">
        <dept-cascader
          @change="changeDept"
          v-model="selectDept"
          :template-type="1"
          :show-first-dept="false"
          style="width:100%"
        ></dept-cascader>
      </el-form-item>
      <el-form-item
        label="看诊医生"
        prop="appointmentResourceId"
        :rules="rules.required"
        v-if="!timerange"
      >
        <el-select
          v-model="selectResource"
          placeholder="请选择医生"
          value-key="resourceId"
          style="width:100%"
        >
          <el-option
            v-for="(item, i) in resourceArrangeList"
            :key="i"
            :value="item"
            :label="item.resourceName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="看诊服务"
        prop="serviceid"
        :rules="rules.required"
        v-if="!isAppointNumber || isHaveService"
      >
        <sys-select v-model="form.serviceid" :options="serviceList"></sys-select>
      </el-form-item>
      <el-form-item label="现场挂号" v-if="timerange && addWay !== 3">
        <el-row>
          <el-col :span="10">
            <el-radio-group v-model="form.isSceneAppoint" style="display:inline-block">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="14" v-if="form.isSceneAppoint === 1">
            <el-checkbox v-model="form.isPhysicalExamination" :true-label="1" :false-label="0">预检</el-checkbox>
            <el-checkbox v-model="form.medicalRecordBook" :true-label="1" :false-label="0">病例本</el-checkbox>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="交叉看诊" v-if="timerange && addWay !== 3">
        <el-radio-group v-model="form.isCrossAppoint" style="display:inline-block">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="开始时间"
            prop="appointmentStarttime"
            :rules="rules.required"
            v-if="timerange && addWay !== 3"
          >
            <el-time-select
              style="width: 100%"
              v-model="form.appointmentStarttime"
              :picker-options="options"
              placeholder="开始时间"
            ></el-time-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="结束时间"
            prop="appointmentEndtime"
            :rules="rules.required"
            v-if="timerange && addWay !== 3"
          >
            <el-time-select
              style="width: 100%"
              v-model="form.appointmentEndtime"
              :picker-options="options"
              placeholder="结束时间"
            ></el-time-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        label="预约日期"
        prop="appointmentDate"
        :rules="rules.required"
        v-if="!timerange && addWay !== 3"
      >
        <el-date-picker
          style="width: 100%"
          v-model="form.appointmentDate"
          type="date"
          :clearable="false"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <!--
      <el-form-item label="看诊时长" prop="timerange" :rules="rules.required" v-if="timerange && addWay !== 3">
        <el-select v-model="form.timerange" placeholder="请输入看诊时长" style="width: 100%">
          <el-option :value="10 * i" :label="(10 * i) + '分钟'" v-for="i of 6" :key="i"></el-option>
        </el-select>
      </el-form-item>
      -->
      <el-form-item
        label="预约时段"
        prop="appointmentStarttime"
        :rules="rules.required"
        v-if="!timerange && addWay !== 3"
      >
        <el-input v-model="form.appointmentStarttime" placeholder="请选择看诊时段" readonly="readonly"></el-input>
        <div class="yb">
          <selectTime
            style="width:100%"
            :reset="isReset"
            :resource-id="selectResource.resourceId"
            :resource-type="selectResource.resourceType"
            :dept-id="form.deptId"
            :service-id="form.serviceid"
            :customer-service="customerService"
            :hide-text="true"
            @select="setTimesliceId"
            :date="form.appointmentDate"
            :arrange="{startTimeStr: form.appointmentStarttime, timesliceId: form.timesliceId}"
          ></selectTime>
        </div>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="初复诊" v-if="!isAppointNumber">
            <el-select v-model="form.subsequentVisit" placeholder="请选择" :disabled="isTijian">
              <el-option label="未知" :value="-1"></el-option>
              <el-option
                v-for="item in visitTypes"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="套餐" v-if="!isAppointNumber">
            <el-select
              v-model="form.shopSetItemId"
              placeholder="套餐信息"
              style="width: 100%"
              @change="choose"
            >
              <el-option :value="-1" label="不使用"></el-option>
              <el-option
                :value="item.setmealOrderDetailId"
                :label="item.setMealName"
                v-for="(item, i) in serviceSetList"
                :key="i"
              ></el-option>
            </el-select>
            <span class="red" v-show="countShow" style="font-size:12px;">剩余次数：{{count}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="预约备注">
        <el-autocomplete
          style="width:100%"
          v-model="form.symptom"
          :maxlength="50"
          :fetch-suggestions="querySearchSymptom"
          placeholder="请输入预约备注"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="预计到达" v-if="addWay === 3">
        <el-input
          v-model="form.distance"
          @change="fixedNumber"
          max="999"
          maxlength="3"
          placeholder="分钟(最大999分钟)"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="爱院科室" v-if="!isAppointNumber">
        <referrer v-model="referrerObject"></referrer>
      </el-form-item>
      <el-form-item label>
        <el-checkbox
          v-model="isSendMessage"
          :disabled="form.isSceneAppoint === 1"
          :true-label="1"
          :false-label="0"
        >发送短信</el-checkbox>
        <el-popover placement="right" width="60" trigger="hover" v-model="visible">
          <el-radio-group v-model="form.type" class="radiobox" @change="changeType">
            <div>
              <el-radio :label="1">手工短信</el-radio>
            </div>
            <div>
              <el-radio :label="2">自动短信</el-radio>
            </div>
          </el-radio-group>
          <span slot="reference">
            <i class="el-icon-setting magl">{{form.type === 1 ? '手工短信' : '自动短信'}}</i>
          </span>
        </el-popover>
      </el-form-item>
    </el-form>
    <el-row class="footer">
      <el-col :span="24" align="center">
        <el-button type="primary" @click="addAppoint" :disabled="isSubmit">提交预约</el-button>
        <el-button type @click="resetAppoint">重置表单</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import api from '@/arrange/store/appointapi'
import sourcedetailapi from '@/arrange/store/sourcedetailapi'
import schedulingapi from '@/arrange/store/schedulingapi'
import age from '@/components/age'
import selectTime from '@/arrange/page/register/selecttime.vue'
import referrer from '@/arrange/page/reservation/appointbest.vue'
import deptCascader from '@/arrange/page/scheduling/deptcascader'
import deptinfo from '@/arrange/page/reservation/deptinfo.vue'
import { validateMobile } from '@/crm/util/common'
import storage from '@/util/storage'
import moment from 'moment'
export default {
  props: [
    'value',
    'initValue',
    'date',
    'organ',
    'title',
    'times',
    'addWay',
    'isShow',
    'timerange',
    'customerService',
    'isTijian',
    'numberList'
  ],
  data () {
    return {
      pickerOptions: this.timelimit(),
      isAppointNumber: this.$ever.getClinicConfig().isAppointNumber,
      isHaveService: this.$ever.getClinicConfig().isHaveService,
      visitTypes: [],
      disabled: {
        sex: false,
        phone: false,
        mobile: false
      },
      allday: '',
      count: 8,
      countShow: false,
      api,
      sourcedetailapi,
      schedulingapi,
      storage,
      visible: false,
      show: false,
      isSubmit: false,
      isSendMessage: 1,
      isReset: '',
      currentArrange: '',
      timelist: '',
      selectDept: '',
      hosName: '',
      selectResource: '',
      referrerObject: '',
      resourceInfo: '',
      form: {
        type: 2,
        timeTrunkType: 1,
        addWay: '',
        appointmentDate: '',
        appointmentResourceId: '',
        appointmentResourceName: '',
        appointmentResourceType: '',
        appointmentStarttime: '',
        appointmentEndtime: '',
        timerange: 10,
        isSmsRemind: 1,
        channelId: 1,
        isTimerange: 0,
        isSceneAppoint: 0,
        subsequentVisit: '',
        appointmentType: 1,
        isMedicalInsurance: 0,
        isCrossAppoint: 0,
        medicalRecordBook: 0,
        isPhysicalExamination: '',
        symptom: '',
        serviceid: '',
        timesliceId: '',
        shopSetItemId: -1,
        organId: '',
        organName: '',
        deptId: '',
        deptName: '',
        patientPhone: '',
        patient: {
          // agebirthday: '',
          name: '',
          sex: '',
          birthday: '',
          // age: '',
          mobile: ''
        },
        distance: '',
        customerService: this.customerService !== false
      },
      serviceList: [],
      resourceArrangeList: [],
      serviceSetList: [],
      options: {
        start: '08:00',
        end: '23:50',
        step: '00:10'
      },
      rules: {
        required: [
          { required: true, message: '必填项', trigger: ['change'] }
        ],
        requiredObject: [
          {
            required: true,
            message: '必填项',
            trigger: ['blur', 'change'],
            type: 'object'
          }
        ],
        requiredArray: [
          {
            required: true,
            message: '必填项',
            trigger: ['blur', 'change'],
            type: 'array'
          }
        ]
      },
      timer: ''
    }
  },
  watch: {
    'form.serviceid' (val, old) {
      if (!val || old) {
        this.form.appointmentStarttime = ''
        this.form.appointmentEndtime = ''
        this.isReset = new Date().getTime()
      }
      this.form.serviceId = val
      this.getPatientServiceSet()
      this.$emit('val', this.form)
    },
    'form.patient' (val) {
      if (!this.form.id) {
        this.form.symptom = val.appointRemark
      }
      this.getPatientServiceSet()
      this.$emit('getpatient', val)
    },
    // 'form.patient.agebirthday' (val) {
    //   if (val) {
    //     this.form.patient.age = val.age
    //     this.form.patient.birthday = val.birthday
    //   }
    // },
    'form.patient.name' (val) {
      if (!val) {
        this.disabled = {
          sex: false,
          phone: false,
          mobile: false
        }
        this.resetPatient()
      }
    },
    'form.appointmentDate' (val, old) {
      this.getResouceList()
      this.$emit('val', this.form)
    },
    'form.isSceneAppoint' (val) {
      this.form.isSmsRemind = !val
    },
    'form.isCrossAppoint' (val) {
      this.options.start = val ? '00:00' : this.value.startTime
    },
    'organ': {
      handler (val) {
        this.form.organId = val.organId
        this.form.organName = val.organName
      },
      deep: true
    },
    selectDept (val) {
      if (val) {
        this.form.deptId = val.deptId
        this.form.deptName = val.deptName
        this.getResouceList()
        this.$emit('val', this.form)
      } else {
        this.form.deptId = ''
        this.form.deptName = ''
        this.selectResource = ''
        this.resourceArrangeList = []
      }
    },
    selectResource (val, old) {
      if (val && val.resourceId) {
        this.form.appointmentResourceId = val.resourceId
        this.form.appointmentResourceName = val.resourceName
        this.form.resourceId = val.resourceId
        this.form.resourceName = val.resourceName
        this.form.appointmentResourceType = val.resourceType
        this.currentArrange = val
        this.isReset = new Date().getTime()
        this.initServiceList()
      } else {
        this.form.appointmentResourceId = ''
        this.form.appointmentResourceName = ''
        this.form.resourceId = ''
        this.form.resourceName = ''
        this.form.appointmentResourceType = ''
        this.form.serviceid = ''
        this.currentArrange = ''
        this.serviceList = []
      }
      this.getArrangeList()
      this.getServiceList()
      if (old && val.timeTrunks) {
        this.form.serviceid = ''
      }
      this.$emit('val', this.form)
    },
    numberList (val) {
      if (val && this.$route.name === 'patientcase') {
        let orderId = this.$route.query.orderId
        this.numberList.map(item => {
          if (orderId === item.orderid) {
            this.form.serviceid = item.serviceid
            this.selectDept = {
              id: item.deptId,
              deptName: item.deptName,
              deptId: item.deptId
            }
          }
        })
      }
    },
    referrerObject (val) {
      Object.assign(this.form, {
        referrer: val ? val.referrer.id : '',
        referrerName: val ? val.referrer.name : '',
        referrerDeptId: val ? val.referrerDept.id : '',
        referrerDeptName: val ? val.referrerDept.name : ''
      })
    },
    value (val) {
      if (!val) {
        return false
      }
      this.form.serviceid = val.serviceId
      this.form.appointmentStarttime = val.startTimeStr
      this.form.timesliceId = val.timesliceId
      this.selectDept = val.deptId
        ? {
          deptId: val.deptId,
          deptName: val.deptName,
          id: val.deptId,
          name: val.deptName
        }
        : ''
      this.selectResource = val.resourceId || val.appointmentResourceId ? {
        resourceId: val.resourceId || val.appointmentResourceId,
        resourceName: val.resourceName || val.appointmentResourceName,
        resourceType: val.resourceType || val.appointmentResourceType
      } : ''
    },
    initValue (val) {
      this.setInitAppoint()
    },
    date (val) {
      this.form.appointmentDate = val
    },
    isShow (val) {
      this.show = this.isShow
    },
    show (val) {
      this.$emit('update:isShow', val)
    }
  },
  created () {
    if (this.isTijian) {
      this.form.subsequentVisit = 4
    }
    if (this.organ) {
      this.form.organId = this.organ.organId
      this.form.organName = this.organ.organName
    }
    this.getOrgList()
    this.form.isSmsRemind = this.form.isSceneAppoint ? 0 : 1
    this.serviceList = []
    if (this.value && this.value.serviceList) {
      this.value.serviceList.map(item => {
        this.serviceList.push({
          id: item.serviceId,
          name: item.serviceName
        })
      })
    } else {
      this.getServiceList()
    }
    this.options.start = this.value.startTime || this.initStartTime
    this.options.end = this.times && this.times[1] ? this.times[1] : '23:50'
    this.options.step = this.step
    this.$bus.$off('onError')
    this.$bus.$on('onError', val => {
      this.isSubmit = false
    })
    this.getResouceInfo()
    this.getVisitTypes()
    this.getAppointSmsType()// 获取短信发送方式配置
    this.setInitAppoint()
  },
  mounted () {
    if (this.$route.name === 'patientcase') {
      this.resourceArrangeList = [{
        resourceId: this.$store.state.currentUser.userId,
        resourceName: this.$store.state.currentUser.name
      }]
      this.selectResource = {
        resourceId: this.$store.state.currentUser.userId,
        resourceName: this.$store.state.currentUser.name
      }
      this.form.subsequentVisit = 1
    }
  },
  methods: {
    timelimit () {
      let self = this
      return {
        disabledDate (time) {
          return !self.allday.includes(moment(new Date(time.getTime())).format('YYYY-MM-DD'))
        }
      }
    },
    getArrangeList () {
      let p = {}
      p.startDate = this.$moment().format('YYYY-MM-DD')
      p.endDate = this.$moment().add(1, 'month').format('YYYY-MM-DD')
      p.resourceName = this.form.appointmentResourceName
      p.deptName = this.form.deptName
      p.deptId = this.form.deptId
      p.timeTrunkType = 1
      p.status = 10
      p.queryScene = 2
      this.schedulingapi.list(p).then(rs => {
        if (rs.head.errCode || !rs.data[0]) {
          return false
        }
        this.timelist = rs.data[0].resourceArrangeResultList[0].timeTrunks ? rs.data[0].resourceArrangeResultList[0].timeTrunks : []
        let newarr1 = []
        rs.data.map(item => {
          item.resourceArrangeResultList.map(val => {
            if (newarr1.length === '') {
              newarr1 = Object.keys(val.timeTrunks).concat()
            } else {
              newarr1 = newarr1.concat(Object.keys(val.timeTrunks))
            }
          })
        })
        this.allday = Array.from(new Set(newarr1))
      })
    },
    choose (val) {
      let item = this.serviceSetList.filter(item => {
        return item.setmealOrderDetailId === val
      })[0]
      if (item) {
        this.count = item.availableNum
        this.countShow = true
      } else {
        this.count = 0
        this.countShow = false
      }
    },
    changeType (v) {
      this.api.setAppointSmsType({ type: v }).then(res => {
        if (res.head.errCode || !res.data) {
          return false
        }
        this.$messageTips(this, 'success', '设置成功', '提示')
      })
    },
    changeDept (val) {
      this.selectResource = ''
    },
    getAppointSmsType () { // 获取短信发送方式配置
      this.api.getAppointSmsType().then(res => {
        if (res.head.errCode || !res.data) {
          return false
        }
        this.form.type = parseInt(res.data)
      })
    },
    getOrgList () {
      let hosId = this.storage.getLocalStorage('CLINICID')
      this.schedulingapi.getOrgList().then(rs => {
        rs.data.map(item => {
          if (Number(item.clinicId) === Number(hosId)) {
            this.hosName = item.clinicName
          }
        })
      })
    },
    setAppointSmsType (parms) {
      this.api.setAppointSmsType(parms).then(res => {
        if (res.head.errCode || !res.data) {
          return false
        }
      })
    },
    fixedNumber (val) {
      if (val.length > 3) {
        const valStr = val + ''
        this.form.distance = Number(valStr.slice(0, 3))
      }
    },
    getVisitTypes () {
      api.getVisitTypes().then(res => {
        if (res.head.errCode || !res.data) {
          return false
        }
        this.visitTypes = res.data
        if (this.$route.name === 'patientcase') {
          this.form.subsequentVisit = 1
        }
      })
    },
    setInitAppoint () {
      // setTimeout(() => {
      if (!this.initValue || Object.keys(this.initValue).length === 0) {
        this.resetAppoint()
        return false
      }
      let val = JSON.parse(JSON.stringify(this.initValue))
      this.form = Object.assign(this.form, val)
      if (!this.form.addWay) {
        this.form.addWay = 1
      }
      if (val.id) {
        // this.form.patient.agebirthday = {
        //   age: this.form.patient.age,
        //   birthday: this.form.patient.birthday
        // }
        this.form.appointmentDate = this.$moment(val.appointmentDate).format(
          'YYYY-MM-DD'
        )
        this.referrerObject = {
          referrerDept: { id: val.referrerDeptId, name: val.referrerDeptName },
          referrer: { id: val.referrer, name: val.referrerName }
        }
      }
      if (val.deptId) {
        const vm = this
        // this.timer = setTimeout(() => {
        vm.selectDept = {
          deptId: val.deptId,
          deptName: val.deptName,
          id: val.deptId,
          name: val.deptName
        }
        // }, 2000)
      }

      if (val.serviceId === '' && this.$route.name === 'patientcase') {
        this.selectResource = ''
      }
      if (val.resourceId || val.appointmentResourceId) {
        this.selectResource = {
          resourceId: val.appointmentResourceId || val.resourceId,
          resourceName: val.appointmentResourceName || val.resourceName,
          resourceType: val.appointmentResourceType || val.resourceType
        }
      } else {
        if (this.$route.name !== 'patientcase') {
          this.selectResource = ''
        }
      }
      // }, 800)
    },
    changePoint () {
      if (this.form.isSmsRemind) {
        this.form.isSmsRemind = 1
      } else {
        this.form.isSmsRemind = 0
      }
      this.form.patient.mobile = this.form.patient.mobile.replace('-', '')
      this.api.changeAppoint(this.form).then(rs => {
        this.isSubmit = false
        if (rs.errCode) {
          return false
        }
        this.$messageTips(this, 'success', '患者' + this.form.patient.name + '已预约成功', '预约成功')
        if (rs.data.rcmId !== '-1' && this.form.addWay === 1) {
          this.$bus.$emit('appoint:settlementId', {
            flag: 'ajax_success',
            settlementId: rs.data.rcmId,
            xianchang: this.form.isSceneAppoint,
            isMedicalInsurance: this.form.isMedicalInsurance
          })
          if (this.form.isSceneAppoint) {
            this.$bus.$emit('appoint:rcmVisible', true)
          }
        }
        this.resetAppoint()
        this.show = false
      })
    },
    addAppoint () {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }
        this.isSubmit = true
        if (this.form._isChange) {
          this.changePoint()
          return
        }
        let api = this.timerange || this.isAppointNumber ? this.api.createAppoint : this.api.addAppointment
        this.form.isSmsRemind = this.form.type === 2 ? this.isSendMessage : 0
        this.form.patient.mobile = this.form.patient.mobile ? this.form.patient.mobile.replace(/-/g, '') : ''
        this.registerValidate(() => {
          api(this.form).then(rs => {
            this.isSubmit = false
            if (rs.errCode) {
              this.form.patient.mobile = validateMobile(this.form.patient.mobile)
              return false
            }
            this.$messageTips(this, 'success', '患者' + this.form.patient.name + '已预约成功', '预约成功')
            if (this.isSendMessage && this.form.type === 1) { // 预约成功发送短信
              let allparams = {}
              allparams.patientName = this.form.patient.name
              allparams.phoneNumber = this.form.patient.mobile
              allparams.docName = this.form.appointmentResourceName // 医生姓名
              allparams.hosName = this.hosName // 医院姓名
              allparams.clinicName = this.form.deptName // 诊室名称
              allparams.appointTime = this.form.appointmentDate // 预约时间
              allparams.visitTime = this.form.appointmentStarttime // 就诊时间
              allparams.appointDate = this.form.appointmentDate // 预约日期
              allparams.appointStartTime = this.form.appointmentStarttime // 预约开始时间
              allparams.appointEndTime = this.form.appointmentEndtime // 预约结束时间
              this.$bus.$emit('form:handMessage', allparams)
            }
            if (rs.data.rcmId !== '-1' && this.form.addWay === 1) {
              this.$bus.$emit('appoint:settlementId', {
                flag: 'ajax_success',
                settlementId: rs.data.rcmId,
                xianchang: this.form.isSceneAppoint,
                isMedicalInsurance: this.form.isMedicalInsurance
              })
              if (this.form.isSceneAppoint) {
                this.$bus.$emit('appoint:rcmVisible', true)
              }
            }
            this.$emit('success', rs.data)
            this.resetAppoint()
            this.show = false
          })
        })
      })
    },
    selectPatient (val) {
      this.form.patient = val
      this.countShow = false
      this.form.shopSetItemId = -1
      // 选择后禁用已经有的项
      // if (val.birthday) {
      //   this.disabled.age = true
      // }
      if (val.sex) {
        this.disabled.sex = true
      }
      if (val.mobile) {
        this.disabled.mobile = true
      }
    },
    resetPatient () {
      this.form.patient = {
        // agebirthday: '',
        sex: '',
        birthday: '',
        // age: '',
        mobile: '',
        name: ''
      }
    },
    resetAppoint () {
      this.referrerObject = ''
      this.selectDept = this.timerange ? { deptId: this.value.deptId, deptName: this.value.deptName, id: this.value.deptId, name: this.value.deptName } : ''
      this.selectResource = this.timerange ? { resourceId: this.value.resourceId, resourceName: this.value.resourceName } : ''
      this.$nextTick(() => {
        return this.$refs.form && this.$refs.form.resetFields()
      })
    },
    getResouceList () {
      this.api
        .getArrangeResourceList({
          timeTrunkType: 1,
          deptId: this.form.deptId,
          startDate:
            this.form.appointmentDate || this.$moment().format('YYYY-MM-DD'),
          endDate:
            this.form.appointmentDate || this.$moment().format('YYYY-MM-DD')
        })
        .then(rs => {
          this.resourceArrangeList = []
          if (rs.head.errCode || !rs.data[0]) {
            return false
          }
          rs.data.map(item => {
            this.resourceArrangeList = this.resourceArrangeList.concat(
              item.resourceArrangeResultList
            )
          })
        })
    },
    initServiceList () {
      this.api
        .listServiceRange({
          timeTrunkType: 1,
          date: this.date || this.form.appointmentDate,
          organId: this.form.organId,
          deptId: this.form.deptId,
          resourceId: this.form.appointmentResourceId
        })
        .then(rs => {
          if (rs.head.errCode || !rs.data[0]) {
            return false
          }
          this.serviceList = rs.data.map(item => {
            return { id: item.serviceId, name: item.serviceName }
          })
          this.$emit('getServiceList', this.serviceList)
        })
    },
    getServiceList () {
      if (!this.form.deptId || !this.form.appointmentResourceId) {
        this.serviceList = []
        this.$emit('getServiceList', '')
        return false
      }
      this.api.listServiceRange({
        timeTrunkType: 1,
        date: this.date || this.form.appointmentDate,
        organId: this.form.organId,
        deptId: this.form.deptId,
        resourceId: this.form.appointmentResourceId
      }).then(rs => {
        if (rs.head.errCode || !rs.data[0]) {
          return false
        }
        this.serviceList = rs.data.map(item => {
          return { id: item.serviceId, name: item.serviceName }
        })
        this.$emit('getServiceList', this.serviceList)
      })
    },
    getPatientServiceSet () {
      this.serviceSetList = []
      if (this.form.patient && this.form.patient.id && this.form.deptId && this.form.serviceid) {
        this.api.getServiceSetList({
          patientId: this.form.patient.id,
          dptId: this.form.deptId,
          serviceId: this.form.serviceid
        }).then(rs => {
          if (rs.head.errCode || !rs.data) {
            this.form.shopSetItemId = -1
            return false
          }
          this.serviceSetList = rs.data
        })
      } else {
        this.form.shopSetItemId = -1
      }
    },
    setTimesliceId (val) {
      this.form.timesliceId = val.timesliceId
      this.form.appointmentStarttime = val.startTimeStr
      this.form.appointmentEndtime = val.endTimeStr
      this.form.addWay = val.isAdd ? 2 : 1
      this.$emit('val', this.form)
    },
    querySearchSymptom (val, callback) {
      this.api.getAppointmentSymptom({ symptom: val }).then(rs => {
        rs.data.map(item => {
          item.value = item.symptom
        })
        callback(rs.data)
      })
    },
    closeDialog () {
      this.$emit('update:isShow', false)
    },
    registerValidate (callback) {
      if (this.form.addWay !== 1) {
        return callback && callback()
      }
      this.api.appointValidate({
        conditionIds: this.form.id ? [6, 8, 10] : [1, 3, 6, 8, 10],
        patient: {
          patientId: this.form.patient.id,
          patientPhone: this.form.patient.mobile,
          patientSex: this.form.patient.sex,
          // patientAge: this.form.patient.age
        },
        info: {
          appointmentDate: this.form.appointmentDate,
          appointmentStarttime: this.form.appointmentStarttime ? this.form.appointmentStarttime + ':00' : null
        },
        dept: this.selectDept
      }).then(rs => {
        if (!rs.data[0]) {
          return callback && callback()
        } else {
          this.$confirm(this.createValidateHtml(rs.data), '警告', {
            customClass: 'appvalidate',
            showConfirmButton: !this.isContinueRegister(rs.data),
            dangerouslyUseHTMLString: true,
            confirmButtonText: '继续提交',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            return callback && callback()
          }).catch(() => {
            this.isSubmit = false
          })
        }
      })
    },
    createValidateHtml (data) {
      let html = []
      html.push('<ol>')
      data.map((item, i) => {
        html.push('<li class="' + (!item.isContinue ? 'red' : 'gray') + '">' + item.message + '</li>')
      })
      html.push('</ol>')
      return html.join('')
    },
    isContinueRegister (data) {
      return data.filter(item => {
        return !item.isContinue
      }).length
    },
    inputTrigger (v) {
      this.$set(this.form.patient, 'mobile', validateMobile(this.form.patient.mobile))
    },
    getResouceInfo () {
      if (this.value && this.value.resourceType === 'STAFF_DOCTOR') {
        this.api.getStaffInfo({ id: this.value.resourceId }).then(rs => {
          this.resourceInfo = rs.data
        })
      }
    }
  },
  components: {
    age,
    selectTime,
    referrer,
    deptCascader,
    deptinfo
  },
  computed: {
    step () {
      if (this.value.startTime && this.value.endTime) {
        let begin = new Date('2000/1/1 ' + this.value.startTime).getTime()
        let end = new Date('2000/1/1 ' + this.value.endTime).getTime()
        return '00:' + Math.floor((end - begin) / 60 / 1000)
      } else {
        return '00:10'
      }
    },
    initStartTime () {
      let date = new Date()
      let datetime = Math.round(date.getMinutes() / 10) * 10
      date.setMinutes(datetime)
      return this.$moment(date).format('HH:mm')
    }
  }
}
</script>
<style scoped>
.magl {
  margin-left: 40px;
}
.radiobox :nth-child(1) {
  margin-left: 7px;
}
.radiobox :nth-child(2) {
  margin-top: 5px;
  margin-left: 7px;
}
.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  position: relative;
}
.title .el-icon-close {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 20px;
  cursor: pointer;
}
.el-form-item {
  margin-bottom: 15px;
}
.footer {
  padding: 15px 0 4px;
  border-top: 1px solid #ddd;
}
.footer .el-button {
  width: 120px;
}
.el-form /deep/ .el-radio + .el-radio,
.el-form /deep/ .el-checkbox + .el-checkbox {
  margin-left: 10px;
}
.red {
  color: #ee4433;
}
.yb {
  position: absolute;
  top: 0;
  left: 10px;
  right: 10px;
  color: #bbb;
}
</style>
