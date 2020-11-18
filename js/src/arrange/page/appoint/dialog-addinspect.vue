<template>
  <el-dialog
    :title="'预约' + categoryCodes[type].text"
    :visible.sync="showDialog"
    :close-on-click-modal="false"
    width="55%">
      <el-row style="min-height: 503px">
        <el-col :span="10">
          <el-form :model="form" label-width="92px" label-position="right" ref="form">
            <el-form-item label="姓名：" prop="patientName" :rules="rules.required">
            <label class="text" v-if="value">{{value.patientName}}</label>
            <ever-patient-select
              v-if="showDialog && !value"
              v-model="form.patientName"
              @select="selectPatient"
              :allow-create="true"
              :grey-denies-dialog-show="true"
              :showAttrType="true"
            ></ever-patient-select>
            </el-form-item>
            <el-form-item label="性别：" prop="patient.sex" :rules="rules.required">
              <label class="text" v-if="form.patient.sex">{{form.patient.sex | formatSex}}</label>
              <label class="text" v-else>--</label>
            </el-form-item>
            <el-form-item label="手机号码：" prop="patientMobile">
              <label class="text" v-if="value">{{value.patientMobile}}</label>
              <label class="text" v-else>{{form.patientMobile || '--'}}</label>
            </el-form-item>
            <el-form-item label="出生日期：">
              <label class="text" v-if="form.patient.birthday">
                {{$moment(form.patient.birthday).format('YYYY-MM-DD')}}
              </label>
            </el-form-item>
            <el-form-item :label="categoryCodes[type].text + '项目：'" prop="executeId" :rules="rules.required">
              <label class="text" v-if="value">
                {{value.serviceName}}
              </label>
              <el-select
                v-else
                v-model="selectItem"
                :placeholder="'请选择'+categoryCodes[type].text+'项目'"
                value-key="executeId"
                clearable
                filterable
                style="width:100%">
                <el-option
                  v-for="(item, i) in serviceItemList"
                  :key="i"
                  :value="item"
                  :label="item.serviceName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="执行机构：" prop="visitOrgId" :rules="rules.required">
              <ever-org-select :is-org="false" type="select" placeholder="请选择执行机构" v-model="selectOrgan" :props="{clearable: false}" :disabled="scene === 2 || type === 4"></ever-org-select>
            </el-form-item>
            <el-form-item label="执行科室：" prop="deptId" :rules="rules.required">
              <ever-subject-select placeholder="请选择执行科室" v-model="selectDept" :params="categoryCodes[type]" @after-not-match="errorNotDept" type="select" @change="changeDept" filterable></ever-subject-select>
            </el-form-item>
            <el-form-item :label="categoryCodes[type].text + '室：'" prop="resourceId" :rules="rules.required">
              <ever-room-select v-model="selectRoom" :disabled="!selectDept" :placeholder="'请选择'+categoryCodes[type].text+'室'" :params="roomParams" @change="changeRoom" :use-obj="true"></ever-room-select>
            </el-form-item>
            <el-form-item label="备注：" prop="remark" :rules="{required: false}">
              <el-input v-model="form.remark" type="textarea" :maxlength="100"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="14">
          <div class="pad10">
            <div class="days">
              <i class="iconfont icon-date_lefe" @click="prevWeeks"></i>
              <ul class="clearfix">
                <li class="item" v-for="(item, i) in arrangeDays" :key="i" :class="{today: $moment().format('YYYY-MM-DD') === item.value, on: form.date === item.value}" @click="setArrangeDate(item.value)">
                  {{item.day}} <br>
                  {{item.week}}
                </li>
              </ul>
              <i class="iconfont icon-date_right" @click="nextWeeks"></i>
            </div>
            <div class="noarrange" v-if="!serviceTimeList || !serviceTimeList[0]">今日暂无排班</div>
            <div class="servicetime" v-else>
              <ul class="clearfix">
                <li 
                v-for="(item, i) in serviceTimeList" 
                :key="i" 
                @click="setServiceTime(item)" 
                :class="{on: selectTime && selectTime.startDate === item.startDate && selectTime.endDate === item.endDate, disabled: !(selectTime && selectTime.startDate === item.startDate && selectTime.endDate === item.endDate) && item.stockAmount <= 0}"
                >
                  {{item.startDate}} - {{item.endDate}}
                </li>
              </ul>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row class="mb20">
        <el-col :span="12">
          <el-button style="margin-left: 92px;" type="primary" @click="cancelAppoint" v-if="value">取消预约</el-button>
        </el-col>
        <el-col :span="12" align="right">
          <el-button type="primary" @click="submitAppoint">提交</el-button>
          <el-button type="" @click="showDialog=false">关闭</el-button>
        </el-col>
      </el-row>
  </el-dialog>
</template>
<script>
import api from '@/arrange/store/appointmentapi'
import storage from '@/util/storage'
import { validatePhone } from '@/util/validate'
export default {
  props: ['show', 'type', 'patient', 'value', 'scene'],
  data () {
    return {
      api,
      storage,
      categoryCodes: {
        1: {
          code: 'OUTPATIENT_DOCTOR',
          roomCode: ['CONSULTING_ROOM'],
          text: '门诊',
          type: '',
          status: 'Y',
          orgIdList: [storage.getLocalStorage('CLINICID')],
          type1CodeList: ['01'],
          type2CodeList: ['01.02']
        },
        2: {
          code: 'EXAMINE',
          roomCode: ['EXAMIMATION_ROOM'],
          text: '检查',
          type: '800',
          status: 'Y',
          orgIdList: [storage.getLocalStorage('CLINICID')],
          type1CodeList: ['02'],
          type2CodeList: ['02.01']
        },
        3: {
          code: 'TREATMENT',
          roomCode: ['TREATMENT_ROOM'],
          text: '治疗',
          type: '802',
          status: 'Y',
          orgIdList: [storage.getLocalStorage('CLINICID')],
          type1CodeList: ['02'],
          type2CodeList: ['02.03']
        },
        4: {
          code: 'OUTPATIENT_SURGERY',
          roomCode: ['OPERATION_ROOM'],
          text: '手术',
          type: '2125',
          status: 'Y',
          orgIdList: [storage.getLocalStorage('CLINICID')],
          type1CodeList: ['02'],
          type2CodeList: ['02.04']
        }
      },
      currentDate: this.$moment().format('YYYY-MM-DD'),
      showDialog: false,
      selectOrgan: '',
      selectDept: '',
      selectItem: '',
      selectRoom: '',
      selectTime: '',
      executeItem: '',
      arrangeDays: [],
      serviceTimeList: [],
      serviceItemList: [],
      form: {
        patient: {
          age: '',
          birthday: '',
          sex: '',
          agebirthday: ''
        },
        date: '',
        patientId: '',
        patientName: '',
        patientMobile: '',
        executeId: '',
        doctorAdviceId: '',
        visitOrgId: '',
        visitOrgName: '',
        deptId: '',
        deptName: '',
        resourceId: '',
        resourceName: '',
        serviceId: '',
        serviceName: '',
        startTimeStr: '',
        endTimeStr: '',
        visitType: '',
        bizScene: '',
        remark: ''
      },
      params: {
        name: '',
        serviceClassificationList: ['800', '802'],
        serviceBelongType: 2
      },
      roomParams: {
        orgIdList: storage.getLocalStorage('CLINICID') ? [storage.getLocalStorage('CLINICID')] : [],
        tenantSubjectIds: [],
        roomPurposeCodeList: []
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        required: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        requiredObject: [
          { required: true, message: '必填项', trigger: 'change', type: 'object' }
        ],
        requiredArray: [
          { required: true, message: '必填项', trigger: 'change', type: 'array' }
        ]
      }
    }
  },
  watch: {
    'show' (val) {
      this.resetForm()
      if (val) {
        this.currentDate = this.$moment().format('YYYY-MM-DD')
        this.selectOrgan = {
          id: storage.getLocalStorage('CLINICID'),
          code: storage.getLocalStorage('CLINICID'),
          name: this.$store.state.currentUser.organizationName
        }
        if (this.value) {
          this.getPatient(this.value.patientId)
          this.selectOrgan = {id: this.value.organId, code: this.value.organId, name: this.value.organName}
          this.selectDept = {id: this.value.deptId, orgSubjectCode: this.value.deptId, orgSubjectName: this.value.deptName}
          this.selectRoom = {id: this.value.resourceId, name: this.value.resourceName}
          this.selectTime = {startDate: this.value.startTimeStr, endDate: this.value.endTimeStr}
          this.selectItem = {
            serviceId: this.value.serviceId,
            serviceName: this.value.serviceName,
            executeId: this.value.executeId,
            adviceId: this.value.doctorAdviceId,
            executeProviderId: this.value.deptId,
            executeProviderName: this.value.deptName
          }
          this.form.id = this.value.id
          this.form.date = this.value.dateStr
          this.form.remark = this.value.remark
        }
        if (this.patient && this.patient.id) {
          this.getPatient(this.patient.id)
        }
        this.getArrangeDays()
      } else {
        this.selectItem = ''
        this.selectOrgan = ''
        this.selectDept = ''
        this.selectRoom = ''
        this.selectTime = ''
        this.$refs.form.resetFields()
      }
      this.showDialog = val
    },
    'showDialog' (val) {
      this.$emit('update:show', val)
    },
    'selectOrgan' (val) {
      this.form.visitOrgId = val ? val.id : ''
      this.form.visitOrgName = val ? val.name : ''
      this.categoryCodes[this.type].orgIdList = val ? [val.id] : []
      this.roomParams.orgIdList = val ? [val.id] : []
    },
    'selectDept' (val) {
      this.form.deptId = val ? val.orgSubjectCode : ''
      this.form.deptName = val ? val.orgSubjectName : ''
      this.roomParams.tenantSubjectIds = val ? [val.orgSubjectCode] : []
      this.roomParams.roomPurposeCodeList = this.categoryCodes[this.type].roomCode
    },
    'selectItem' (val) {
      this.form.serviceId = val ? val.serviceId : ''
      this.form.serviceName = val ? val.serviceName : ''
      this.form.executeId = val.executeId
      this.form.doctorAdviceId = val.adviceId
      if (val) {
        this.selectDept = {id: val.executeProviderId, orgSubjectCode: val.executeProviderId, orgSubjectName: val.executeProviderName}
      } else {
        this.selectDept = ''
      }
    },
    'selectRoom' (val) {
      this.form.resourceId = val.id
      this.form.resourceName = val.name
      if (val) {
        this.getServiceTimeList()
      } else {
        this.serviceTimeList = []
      }
    },
    'form.patientId' (val) {
      if (val) {
        this.getExecuteItem()
      } else {
        this.serviceItemList = []
        this.executeItem = ''
      }
    },
    'form.patientName' (val) {
      if (!val) {
        this.serviceItemList = []
        this.executeItem = ''
      }
    },
    'selectTime' (val) {
      this.form.startTimeStr = val ? val.startDate : ''
      this.form.endTimeStr = val ? val.endDate : ''
    }
  },
  created () {
    this.resetForm()
  },
  methods: {
    resetForm () {
      this.form = {
        patient: {
          age: '',
          birthday: '',
          sex: '',
          agebirthday: ''
        },
        date: this.$moment().format('YYYY-MM-DD'),
        patientId: '',
        patientName: '',
        patientMobile: '',
        executeId: '',
        doctorAdviceId: '',
        visitOrgId: '',
        visitOrgName: '',
        deptId: '',
        deptName: '',
        resourceId: '',
        resourceName: '',
        serviceId: '',
        serviceName: '',
        startTimeStr: '',
        endTimeStr: '',
        visitType: this.type ? parseInt(this.type) : 1,
        bizScene: this.scene ? parseInt(this.scene) : 1,
        remark: ''
      }
    },
    getPatient (id) {
      this.api.getPatientInfo({patientId: id}).then(rs => {
        rs.data.agebirthday = {
          age: rs.data.age,
          birthday: rs.data.birthday,
          isDay: rs.data.isDay,
          isMonth: rs.data.isMonth
        }
        this.selectPatient(rs.data)
      })
    },
    selectPatient (val) {
      this.form.patient = val
      this.form.patientId = val.id
      this.form.patientName = val.name
      this.form.patientMobile = val.mobile
    },
    getServiceTimeList () {
      let today = this.$moment().format('YYYY-MM-DD')
      if (new Date(this.form.date).getTime() < new Date(today).getTime()) {
        this.serviceTimeList = []
      } else {
        this.api.getServiceTime({
          orgId: this.form.visitOrgId,
          tenantDeptId: this.form.deptId,
          resourceId: this.form.resourceId,
          arrangeTime: this.form.date,
          categoryCode: this.categoryCodes[this.type].code
        }).then(rs => {
          this.serviceTimeList = rs.data
        })
      }
    },
    getArrangeDays () {
      this.arrangeDays = []
      const weekarray = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
      for (let i = 0; i < 7; i++) {
        let days = this.$moment(this.currentDate).add(i, 'd')
        this.arrangeDays.push({
          week: weekarray[days.weekday()],
          day: days.format('MM/DD'),
          value: days.format('YYYY-MM-DD')
        })
      }
    },
    getExecuteItem () {
      this.api.getArrangeExecuteList({
        visitType: parseInt(this.scene),
        patientId: this.form.patientId,
        serviceTypes: [this.categoryCodes[this.type].type]
      }).then(rs => {
        this.serviceItemList = rs.data.filter(item => {
          return !item.existAppt
        })
      })
    },
    setArrangeDate (val) {
      this.form.date = val
      if (this.selectRoom) {
        this.getServiceTimeList()
      }
    },
    setServiceTime (val) {
      if (!val.stockAmount) {
        return false
      }
      this.selectTime = val
    },
    prevWeeks () {
      this.currentDate = this.$moment(this.currentDate).add(-1, 'w').format('YYYY-MM-DD')
      this.getArrangeDays()
    },
    nextWeeks () {
      this.currentDate = this.$moment(this.currentDate).add(1, 'w').format('YYYY-MM-DD')
      this.getArrangeDays()
    },
    submitAppoint () {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }
        if (!this.form.date) {
          this.$messageTips(this, 'warning', '请选择预约日期')
          return false
        }
        if (!this.form.startTimeStr) {
          this.$messageTips(this, 'warning', '请选择预约时间')
          return false
        }
        if (this.form.id) {
          this.$confirm('您确认修改本次预约吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.api.updateExecuteAppoint(this.form).then(rs => {
              this.$emit('success', rs.data)
              this.$messageTips(this, 'success', this.categoryCodes[this.type].text + '预约成功', '提示')
              this.showDialog = false
            })
          }).catch(() => {
            return false
          })
        } else {
          this.api.createExecuteAppoint(this.form).then(rs => {
            this.$emit('success', rs.data)
            this.$messageTips(this, 'success', this.categoryCodes[this.type].text + '预约成功', '提示')
            this.showDialog = false
          })
        }
      })
    },
    changeDept () {
      this.selectRoom = ''
      this.selectTime = ''
    },
    changeRoom () {
      this.selectTime = ''
    },
    errorNotDept () {
      this.selectDept = ''
      if (this.type !== 4) {
        this.$messageTips(this, 'warning', '医嘱项执行科室错误，请选择其他执行科室！')
      }
    },
    cancelAppoint () {
      this.$confirm('您确定要取消本次预约吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.api.cancelExecuteAppoint({id: this.value.id}).then(rs => {
          this.$messageTips(this, 'success', '预约已取消成功', '提示')
          this.$emit('success', this.value)
          this.showDialog = false
        })
      }).catch(() => {
        return false
      })
    }
  },
}
</script>

<style scoped>
  .pad10 {padding: 0 10px;}
  .days {padding: 0 24px; position: relative; margin-bottom: 20px;}
  .days i {position: absolute; top: 14px;}
  .days i.icon-date_lefe {left: 0;}
  .days i.icon-date_right {right: 0;}
  .days ul {padding: 0; margin: 0; list-style-type: none; display: flex; flex-direction: row; width: 100%;}
  .days li {text-align: center; padding: 0 5px; flex: 1; line-height: 1.5; cursor: pointer;}
  .days li.on {color: #fff; background: #1c7bef;}
  .noarrange {border: 1px dashed #ddd; text-align: center;line-height: 454px; font-size: 20px; color: #999;}
  .servicetime ul {padding: 0; margin: 0; list-style-type: none; width: 100%; height: 415px; overflow: auto;}
  .servicetime ul li {text-align: center; padding: 5px 15px; float: left; line-height: 1.5; cursor: pointer; border: 1px solid #ddd; margin: 0px 10px 10px; width: 86px;}
  .servicetime ul li.on {color: #fff; background: #1c7bef;}
  .servicetime ul li.disabled {background: #f4f4f4; color:#999; text-decoration-line: line-through;}
  .el-form-item label.text {display: block; line-height: 32px; }
</style>
