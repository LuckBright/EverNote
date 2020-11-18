<template>
  <el-dialog 
    :title="title" 
    :visible="dialog" 
    class="ui_dialog_02 inpatient_base_dialog"
    :close-on-click-modal='false'
    :append-to-body='true'
    :show-close='false'
    width='1200px'>
    <div class="diloag_patient_info clearfix">
      <p class="name">姓名：{{patient.name}}<span></span></p>
      <p>性别：{{patient.sex | formatSex}}</p>
      <p>出生日期：{{ patient.birthday | formatDateByExp("YYYY-MM-DD")}}</p>
      <p>患者档案号：{{patient.patientNumber}}</p>
      <p v-if='row.visitType == "1"'>门诊病案号：{{patientOrg.outpatientNumber}}</p>
      <p v-if='row.visitType == "3"'>住院病案号：{{patientOrg.inpatientNumber}}</p>
    </div>
    <div class="forms clearfix">
      <div class="left">
          <ever-form2
          ref='form1'
          :schema="schema"
          v-model="queryobj"
          :nosubmit="true"
          labelWidth="100px"
          :inline='false'
        ></ever-form2>
      </div>
      <div class="right">
          <ever-form2
          ref='form2'
          :rules='rules'
          :schema="schema2"
          v-model="queryobj2"
          :nosubmit="true"
          labelWidth="100px"
          :inline='false'
        ></ever-form2>
        <el-row style="line-height: 35px;" v-if='expireStr'>
          <span style="width: 90px;padding-right: 10px;text-align: right;display: inline-block;">过期安排时间</span>{{expireStr}}
        </el-row>
      </div>
      <div class="pb">
        <ul class="week clearfix" v-if='week.length > 0'>
          <li style="lineHeight:45px;" @click='setWeek(-1)'>
            <i class="iconfont icon-date_lefe"></i>
          </li>
          <li v-for='(item,index) in week' :key='item + "time"' :class="{active:weekindex === index,disabled:item < $moment().valueOf()  - 3600000 * 24}" @click='setWeek(index,item < $moment().valueOf() - 3600000 * 24 || type === "nav")'>
            <div>{{item | formatDateByExp('MM/DD')}}</div>
            <div>{{item | formatDateByExp('dddd')}}</div>
          </li>
          <li style="lineHeight:45px;" @click='setWeek(-2)'>
            <i class="iconfont icon-date_right"></i>
          </li>
        </ul>
        <div class="inner" v-if='arrangeTimesliceList.length > 0'>
          <template v-for="(arrange, i) in arrangeTimesliceList">
            <template v-for="(times , j) in arrange.timeranges">
              <div :key="i + '-' + j">
                <div class="arrange">
                  <strong>{{arrange.timetrunkName}}</strong>
                  <span>（{{times.timerangeStartDate}}-{{times.timerangeEndDate}}）</span>
                </div>
                <div
                  class="progress"
                  :class="{disabled: times.timeslices[0].stockAmount < 1, on: currentParams.startTimeStr === times.timeslices[0].startDate}"
                    @click="setCurrentTimeslice(times.timeslices[0])">
                  <span :style="{width: (times.timeslices[0].occupyAmount / times.timeslices[0].amount) * 100 +'%'}"></span>
                  <label><em>{{times.timeslices[0].occupyAmount}}</em> / {{times.timeslices[0].amount}}</label>
                </div>
              </div>
            </template>
          </template>
        </div>
        <ever-no-data v-else tipTxt="没有排班信息"></ever-no-data>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button :disabled="type == 'nav'"  @click="cancle" style="float:left" v-if='row.executeStatus == 20 &&(row.surgeryStatus == 10 || !row.surgeryStatus)'>取消安排</el-button>
      <el-button @click="dialog=false">取消</el-button>
      <el-button :disabled="type == 'nav'" type="primary" @click="save"   
        >确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import api from '@/csa/store/csaapi.js'
import sysvalue from '@/warehouse/store/sysvalueapi'
let schema = [
  {
    name: 'executeStatusStr',
    label: '手术状态 ',
    comp: 'el-input',
    props: {
      disabled: true,
      placeholder: '全部状态',
    }
  },
  {
    name: 'origin',
    label: '来源',
    comp: 'el-input',
    props: {
      disabled: true,
      placeholder: '请选择',
    }
  },
  {
    name: 'providerName',
    label: '来源科室',
    comp: 'el-input',
    props: {
      disabled: true,
    }
  },
  {
    name: 'applyTime',
    label: '申请时间',
    comp: 'elDatePicker',
    props: {
      type: 'datetime',
      disabled: true,
      valueFormat: 'yyyy-MM-dd HH:mm',
      format: 'yyyy-MM-dd HH:mm',
      placeholder: '申请时间'
    }
  },
  {
    name: 'doctorName',
    label: '开嘱医生',
    comp: 'el-input',
    props: {
      disabled: true,
    }
  },
  {
    name: 'executeId',
    label: '拟施手术',
    comp: 'ever-select',
    props: {
      placeholder: '拟施手术',
      clearable: true,
      filterable: true,
      options: []
    }
  },
  {
    name: 'anaesthesiaTypeMain',
    label: '拟施麻醉',
    comp: 'sys-type',
    props: {
      code: 'CV06.00.103',
      placeholder: '拟施麻醉',
      clearable: true,
      filterable: true,
    }
  },
  {
    name: 'emergencyLevel',
    label: '紧急',
    comp: 'sys-type',
    props: {
      code: 'THC_CPOE_SSJJJB',
      placeholder: '紧急',
      clearable: true,
      filterable: true,
    }
  },
  {
    name: 'surgeryPlanTime',
    label: '拟手术时间',
    comp: 'elDatePicker',
    props: {
      type: 'datetime',
      disabled: true,
      valueFormat: 'yyyy-MM-dd HH:mm',
      format: 'yyyy-MM-dd HH:mm',
      placeholder: '拟手术时间'
    }
  },
]
let schema2 = [
  {
    name: 'actualExecuteProviderId',
    label: '执行科室',
    comp: 'ever-select',
    props: {
      clearable: true,
      filterable: true,
      placeholder: '执行科室',
      options: [],
    }
  },
  {
    label: '手术间号',
    name: 'surgeryRoomId',
    comp: 'ever-select',
    props: {
      placeholder: '手术间号',
      clearable: true,
      filterable: true,
      options: []
    }
  },
  {
    label: '手术等级',
    name: 'surgeryLevel',
    comp: 'sys-type',
    props: {
      code: 'CV05.10.024',
      placeholder: '手术等级',
      clearable: true,
      filterable: true,
    }
  },
  {
    label: '主刀医生',
    name: 'operatorDoctorId',
    comp: 'ever-select',
    props: {
      placeholder: '主麻医生',
      clearable: true,
      filterable: true,
      options: []
    }
  },
  {
    label: '助手医生',
    name: 'assistantDoctors',
    comp: 'ever-select',
    props: {
      placeholder: '助手医生',
      clearable: true,
      filterable: true,
      multiple: true,
      options: []
    }
  },
  {
    label: '主麻医生',
    name: 'anaesthesiaDoctorId',
    comp: 'ever-select',
    props: {
      placeholder: '主麻医生',
      clearable: true,
      filterable: true,
      options: []
    }
  },
  {
    label: '辅麻医生',
    name: 'anaesthesiaAssistants',
    comp: 'ever-select',
    props: {
      placeholder: '辅麻医生',
      clearable: true,
      filterable: true,
      multiple: true,
      options: []
    }
  },
  {
    label: '洗手护士 ',
    name: 'scrubNurses',
    comp: 'ever-select',
    props: {
      placeholder: '洗手护士',
      clearable: true,
      filterable: true,
      multiple: true,
      options: []
    }
  },
  {
    label: '巡回护士 ',
    name: 'circulateNurses',
    comp: 'ever-select',
    props: {
      placeholder: '巡回护士',
      clearable: true,
      filterable: true,
      multiple: true,
      options: []
    }
  }
]
export default {
  data () {
    let queryobj = this.$ever.createObjFromSchema(schema)
    let queryobj2 = this.$ever.createObjFromSchema(schema2)
    return {
      api,
      dialog: false,
      patient: {},
      patientOrg: {},
      title: '',
      key: '1',
      schema,
      schema2,
      queryobj,
      queryobj2,
      form: {},
      week: [],
      weekOffset: 0,
      weekindex: 0,
      actualExecuteProviderOptions: [],
      surgeryRoomOptions: [],
      arrangeTimesliceList: [],
      currentParams: {
        arrangeId: '',
        arrangeTimerangeId: '',
        startTimeStr: '',
        endTimeStr: ''
      },
      row: {},
      providerId: '',
      nurseOptions: [],
      operatorDoctorIdOptions: [],
      assistantDoctorsOptions: [],
      anaesthesiaOptions: [],
      rules: {
        actualExecuteProviderId: [
            { required: true, message: '请选择执行科室', trigger: 'change', type: 'string' }
        ],
        surgeryRoomId: [
            { required: true, message: '请选择手术室', trigger: 'change', type: 'string' }
        ],
      },
      first: true,
      surveyOptions: [],
      expireStr: '',
      type: ''
    }
  },
  watch: {
    'queryobj2.actualExecuteProviderId': {
      handler (val) {
        if (!this.first) {
          this.queryobj2.surgeryRoomId = ''
          this.surgeryRoomOptions = []
          this.queryobj2.scrubNurses = []
          this.queryobj2.circulateNurses = []
          this.$ever.getFieldFromSchema(this.schema2, 'surgeryRoomId').props.options = []
          this.$ever.getFieldFromSchema(this.schema2, 'scrubNurses').props.options = []
          this.$ever.getFieldFromSchema(this.schema2, 'circulateNurses').props.options = []
          this.setCurrentTimeslice()
        }
        if (val) {
          this.getRoomListByParam()
          this.getnurseOptions()
        }
      },
      immediate: true
    },
    'queryobj.executeId': {
      handler (val) {
        this.surveyOptions.forEach(ele => {
          if (ele.executeId === val) {
            this.open(ele)
          }
        })
      },
    },
    'queryobj2.surgeryRoomId': {
      handler (val) {
        this.searchTimesliceByService()
      },
      immediate: true
    },
    'queryobj2.surgeryLevel': {
      handler (val) {
        if (val) {
          if (!this.first) {
            this.queryobj2.operatorDoctorId = ''
          }
          this.getOperatorDoctor()
        } else {
          this.queryobj2.operatorDoctorId = ''
          this.operatorDoctorIdOptions = []
          this.$ever.getFieldFromSchema(this.schema2, 'operatorDoctorId').props.options = []
        }
      },
      immediate: true
    }
  },
  components: {
  },
  mounted () {
    if (localStorage.getItem('csa_value')) {
      let obj = JSON.parse(localStorage.getItem('csa_value'))
      this.providerId = obj.id
    }
  },
  methods: {
    day(data) {
      let day = data ? this.$moment(data).day() : this.$moment().day()
      return day === 0 ? 6 : day - 1
    },
    async getByPatientId () {
      let res = await this.api.getByPatientId(this.row.patientId)
      this.patient = res.data || {}
      this.patientOrg = this.patient.patientOrg || {}
    },
    setCurrentTimeslice (val) {
      this.currentParams.arrangeId = val ? val.instanceId : ''
      this.currentParams.arrangeTimerangeId = ''
      this.currentParams.startTimeStr = val ? val.startDate : ''
      this.currentParams.endTimeStr = val ? val.endDate : ''
    },
    async searchTimesliceByService () {
      this.arrangeTimesliceList = []
      if (!this.queryobj2.surgeryRoomId) return
      let res = await this.api.searchTimesliceByService({
        orgId: this.$store.state.currentUser.organizationId,
        tenantDeptId: this.queryobj2.actualExecuteProviderId,
        resourceId: this.queryobj2.surgeryRoomId,
        categoryCode: 'OUTPATIENT_SURGERY',
        arrangeTime: this.$moment(this.week[this.weekindex]).format('YYYY-MM-DD')
      })
      this.arrangeTimesliceList = res.data || []
    },
    async getRoomListByParam () {
      if (!this.queryobj2.actualExecuteProviderId) return
      let res = await this.api.getRoomListByParam({
        roomPurposeCodeList: ['OPERATION_ROOM'],
        tenantSubjectIds: [this.queryobj2.actualExecuteProviderId],
        orgIdList: [this.$store.state.currentUser.organizationId + '']
      })
      if (res.data) {
        this.surgeryRoomOptions = res.data
        this.$ever.getFieldFromSchema(this.schema2, 'surgeryRoomId').props.options = this.surgeryRoomOptions
      }
    },
    getTenantSubjectListByCondition () {
      this.api.getTenantSubjectListByCondition({
        type2CodeList: ['02.04'],
        orgIdList: [this.$store.state.currentUser.organizationId + ''],
        status: 'Y',
        usePermissionStatus: 'Y'
      }).then(res => {
        if (res.data && res.data.resultList) {
          let arr = res.data.resultList.map(item => {
            return {
              id: item.tenantSubjectCode,
              name: item.tenantSubjectName
            }
          })
          this.actualExecuteProviderOptions = arr
          this.$ever.getFieldFromSchema(this.schema2, 'actualExecuteProviderId').props.options = arr
        }
      })
    },
    setWeek (index, obj) {
      if (index === undefined || obj === true) return
      obj = obj || {}
      if (index === -1) {
        if (this.$moment(obj.appointmentDate).weekday(this.weekOffset * 7 + 1) < this.$moment().valueOf()) {
          return
        }
        this.weekOffset--
      } else if (index === -2) {
        this.weekOffset++
      } else this.weekindex = index
      if (this.weekOffset === 0 && index === -1) {
        this.weekindex = this.day()
      }
      this.week = []
      if (obj.appointmentDate) {
        for (let i = 0; i < 7; i++) {
          this.week.push(this.$moment(obj.appointmentDate).weekday(this.weekOffset * 7 + i))
        }
        this.currentParams.startTimeStr = obj.appointmentTime.split('~')[0]
        this.currentParams.endTimeStr = obj.appointmentTime.split('~')[1]
      } else {
        for (let i = 0; i < 7; i++) {
          this.week.push(this.$moment().weekday(this.weekOffset * 7 + i))
        }
        this.currentParams.arrangeId = ''
        this.currentParams.arrangeTimerangeId = ''
        this.currentParams.startTimeStr = ''
        this.currentParams.endTimeStr = ''
      }
      this.searchTimesliceByService()
    },
    getName (id, options) {
      let str = ''
      options.forEach(ele => {
        if (ele.id === id) str = ele.name
      })
      return str
    },
    idArrToObject (ids, options) {
      let arr = []
      if (!Array.isArray(ids)) return ''
      options.forEach(ele => {
        if (ids.includes(ele.id)) arr.push({id: ele.id, name: ele.name})
      })
      return JSON.stringify(arr)
    },
    save () {
      this.$refs.form2.$refs.form.validate(async valid => {
        if (!valid || !this.queryobj2.surgeryRoomId) return
        if (!this.currentParams.startTimeStr) {
          this.$notify({
            title: '警告',
            message: '请选择手术排班',
            type: 'warning'
          })
          return
        }
        let obj = JSON.parse(JSON.stringify(Object.assign(this.queryobj, this.queryobj2)))
        obj.actualExecuteOrgName = this.$store.state.currentUser.organizationName
        obj.actualExecuteOrgId = this.$store.state.currentUser.organizationId
        obj.actualExecuteProviderName = this.getName(obj.actualExecuteProviderId, this.actualExecuteProviderOptions)
        obj.surgeryRoomName = this.getName(obj.surgeryRoomId, this.surgeryRoomOptions)
        obj.operatorDoctorName = this.getName(obj.operatorDoctorId, this.operatorDoctorIdOptions)
        obj.anaesthesiaDoctorName = this.getName(obj.anaesthesiaDoctorId, this.anaesthesiaOptions)

        let surgeryJson = {}
        surgeryJson.assistantDoctors = this.idArrToObject(obj.assistantDoctors, this.assistantDoctorsOptions)
        surgeryJson.anaesthesiaAssistants = this.idArrToObject(obj.anaesthesiaAssistants, this.anaesthesiaOptions)
        surgeryJson.scrubNurses = this.idArrToObject(obj.scrubNurses, this.nurseOptions)
        surgeryJson.circulateNurses = this.idArrToObject(obj.circulateNurses, this.nurseOptions)
        surgeryJson.anaesthesiaTypeMainName = await sysvalue.getValByCode('CV06.00.103', obj.anaesthesiaTypeMain + '')
        obj.surgeryJson = surgeryJson

        obj.appointmentStartTime = this.currentParams.startTimeStr
        obj.appointmentEndTime = this.currentParams.endTimeStr
        obj.appointmentDate = this.$moment(this.week[this.weekindex]).format('YYYY-MM-DD')
        let res = await this.api.arrangeSurgery(obj)
        if (res && res.head && res.head.errCode === 0) {
          this.$notify({
            title: '成功',
            message: '手术安排成功',
            type: 'success'
          })
          this.$emit('success')
          this.dialog = false
        }
      })
    },
    async cancle () {
      let res = await this.api.cancelArrangeSurgery({
        executeId: this.row.executeId
      })
      if (res && res.head && res.head.errCode === 0) {
        this.$notify({
          title: '成功',
          message: '取消手术安排成功',
          type: 'success'
        })
        this.dialog = false
        this.$emit('success')
      }
    },
    getnurseOptions () {
      if (!this.queryobj2.actualExecuteProviderId) return
      this.api.getStaffListByCondition({
        tenantSubjectIdList: [this.queryobj2.actualExecuteProviderId, this.row.providerId],
        orgIdList: [this.$store.state.currentUser.organizationId + ''],
        typeCodeList: ['NURSE']
      }).then(res => {
        if (res.data && res.data.resultList) {
          let arr = res.data.resultList || []
          this.nurseOptions = arr
          this.$ever.getFieldFromSchema(this.schema2, 'scrubNurses').props.options = arr
          this.$ever.getFieldFromSchema(this.schema2, 'circulateNurses').props.options = arr
        }
      })
    },
    async getOperatorDoctor () {
      let arr = []
      for (let i = 1; i < 5; i++) {
        if (i >= this.queryobj2.surgeryLevel) arr.push(String(i))
      }
      let operatorDoctorId = await this.getDoctors(arr)  // 主刀👨‍⚕️ ,参数为手术级别 CV05.10.024
      this.operatorDoctorIdOptions = operatorDoctorId.data.resultList || []
      this.$ever.getFieldFromSchema(this.schema2, 'operatorDoctorId').props.options = this.operatorDoctorIdOptions
    },
    async getDoctor () {
      let assistantDoctors = await this.getDoctors() // 助手👨‍⚕️
      this.assistantDoctorsOptions = assistantDoctors.data.resultList || []
      this.$ever.getFieldFromSchema(this.schema2, 'assistantDoctors').props.options = this.assistantDoctorsOptions

      let anaesthesia = await this.getDoctors(['01.03']) // 麻醉👨‍⚕️ ,需要添加麻醉属性
      this.anaesthesiaOptions = anaesthesia.data.resultList || []
      this.$ever.getFieldFromSchema(this.schema2, 'anaesthesiaDoctorId').props.options = this.anaesthesiaOptions
      this.$ever.getFieldFromSchema(this.schema2, 'anaesthesiaAssistants').props.options = this.anaesthesiaOptions
      //
    },
    getDoctors (baseStaffPermission2CodeList) {
      let obj = {
        // tenantSubjectType2CodeList: ['02.04'],
        // orgIdList: [this.$store.state.currentUser.organizationId + ''],
        typeCodeList: ['DOCTOR']
      }
      if (baseStaffPermission2CodeList)obj.baseStaffPermission2CodeList = baseStaffPermission2CodeList
      return this.api.getStaffListByCondition(obj)
    },
    async open (row, type) {
      if (!this.dialog) this.$ever.getFieldFromSchema(this.schema, 'executeId').props.disabled = type !== 'yihu'
      row = JSON.parse(JSON.stringify(row))
      this.dialog = true
      this.first = true
      this.expireStr = ''
      this.type = type
      if (type === 'nav') {
        for (let item of this.schema) {
          this.$ever.getFieldFromSchema(this.schema, item.name).props.disabled = true
        }
        for (let item of this.schema2) {
          this.$ever.getFieldFromSchema(this.schema2, item.name).props.disabled = true
        }
      }
      if (type === 'yihu') {
        let res = await this.api.getSurgeryTaskList({
          patientId: row.patientId,
          executeStatusList: [10],
        })
        this.$nextTick(_ => {
          this.$refs.form1.$refs.form.resetFields()
          this.$refs.form2.$refs.form.resetFields()
          this.arrangeTimesliceList = []
          this.queryobj.origin = '门诊'
          this.row = row
          this.getByPatientId()
          let list = res.data
          let arr = []
          list.forEach((ele, index) => {
            arr.push({
              id: ele.executeId,
              name: ele.serviceName,
              index
            })
          })
          this.surveyOptions = list
          this.$ever.getFieldFromSchema(this.schema, 'executeId').props.options = arr
          this.$nextTick(_ => {
            this.first = false
          })
        })
      } else {
        this.$nextTick(_ => {
          this.$refs.form1.$refs.form.resetFields()
          this.$refs.form2.$refs.form.resetFields()
          this.arrangeTimesliceList = []
          if (row.patientDto) {
            for (let item in row.patientDto) {
              row[item] = row.patientDto[item]
            }
          }
          this.row = row
          this.getByPatientId()
          this.currentParams.arrangeId = ''
          this.currentParams.arrangeTimerangeId = ''
          this.currentParams.startTimeStr = ''
          this.currentParams.endTimeStr = ''

          if (row.executeStatus && row.executeStatus === 10) this.queryobj.executeStatusStr = '待安排'
          else if (row.executeStatus) this.queryobj.executeStatusStr = '已安排'
          this.queryobj.origin = row.visitType === 1 ? '门诊' : row.visitType === 2 ? '急诊' : '住院'
          let arr = ['surgeryStatusNumber', 'executeId', 'providerName', 'doctorName', 'emergencyLevel']
          arr.forEach(ele => {
            if (row[ele]) this.queryobj[ele] = row[ele]
          })
          let arr2 = ['surgeryLevel', 'actualExecuteProviderId', 'surgeryRoomId', 'operatorDoctorId', 'anaesthesiaDoctorId',
            'assistantDoctors', 'anaesthesiaAssistants', 'scrubNurses', 'circulateNurses']
          arr2.forEach(ele => {
            if (row[ele]) this.queryobj2[ele] = row[ele]
          })
          if (row.anaesthesiaType) this.queryobj.anaesthesiaTypeMain = row.anaesthesiaType
          this.queryobj.applyTime = this.$moment(row.applyTime).format('YYYY-MM-DD HH:mm')
          this.queryobj.surgeryPlanTime = this.$moment(row.surgeryPlanTime).format('YYYY-MM-DD HH:mm')
          if (this.surveyOptions.length === 0) {
            this.$ever.getFieldFromSchema(this.schema, 'executeId').props.options = [{
              id: row.executeId,
              name: row.serviceName,
            }]
          }
          this.getnurseOptions()
          this.getDoctor()
          if (this.$moment(row.appointmentDate).isBefore(Date().now, 'day')) {
            this.expireStr = this.$moment(row.appointmentDate).format('YYYY-MM-DD ') + row.appointmentTime
            this.$notify({
              title: '提示',
              message: '手术安排时间已过期，请重新选择安排时间',
              type: 'warning'
            })
            this.weekindex = this.day()
            row.appointmentDate = this.setWeek(this.weekindex)
          } else {
            this.weekindex = row.appointmentDate ? this.day(row.appointmentDate) : this.day()
            row.appointmentDate ? this.setWeek(this.weekindex, row) : this.setWeek(this.weekindex)
          }

          this.getTenantSubjectListByCondition()
          this.$nextTick(_ => {
            this.first = false
          })
        })
      }
    },
    async getSurgeryTask () {
      let obj = {}
      obj.pagesize = this.pagesize
      obj.offset = (this.currentPage - 1) * this.pagesize
      obj.visitNumber = ''
      let res = await this.api.getSurgeryTaskList(obj)
      let list = res.data || []
      list.forEach(element => {

      })
    }
  }
}
</script>
<style lang='scss' scoped>
.inpatient_base_dialog{
  /deep/ .el-dialog__footer{
    border-top:none;
  }
  /deep/ .el-dialog__body,
  /deep/ .el-dialog__header{
    padding:0;
  }
  /deep/ .el-date-editor{
    width: 100%;;
  }
  .forms{
    background: #F5F5F5;
    width: 100%;
    .left,.right{
      float: left;
      width: 30%;
    }
    .pb{
      float: left;
      width: 40%;
      .week{
        width: 100%;
        margin:0;
        padding:5px 0;
        box-sizing: border-box;
        li{
          float: left;
          width:calc( 100% / 9);
          height: 40px;
          text-align: center;
          cursor: pointer;
          div{
            line-height: 20px;
          }
        }
      }
      .no{
        width: 100%;
        margin:0;
        padding:15px;
        box-sizing: border-box;
        li{
          float: left;
          width: calc( calc(100% - 60px) / 6);
          text-align: center;
          line-height: 35px;
          margin: 5px;
          background: #fff;
          cursor: pointer;
        }
        .disabled{
            background: #ddd;
            color: #999;
        }
      }
      .week .active,
      .no .active{
        color:#fff;
        background: #1c7bef;
      }
        .week .disabled,
      .no .disabled{
        color:#333;
        background: #ccc;
      }
    }
  }
  button {
    padding-left: 15px;
    padding-right: 15px;
  }
  .diloag_patient_info{
    padding: 0 15px;
    font-size: 14px;
    color: #2B333D;
    line-height: 36px;
    text-align: center;
    justify-content:space-between;
    p{
      margin: 0;
      float: left;
      padding-left:10px;
      span{
        color: #999;
      }  
    }
    .width{
      max-width: 170px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .name{
      font-weight: 700;
      span{
        float: right;
        width: 1px;
        padding: 8px 0;
        margin-top: 10px;
        margin-left: 10px;
        background-color: #979797;
        opacity: .3;
      }
    }
  }
  
  /deep/ .el-form{
      padding-top:15px;
      .el-form-item{
          margin-bottom: 15px;
      }
      .el-form-item__content{
          line-height: 32px;
          .el-input__inner{
              height: 32px;
              line-height: 32px;
          }
      }

  }
  /deep/ .back{
      padding-left: 15px;
      padding-bottom: 15px;
      span{
          color: #1C7BEF;
          text-decoration: underline;
          cursor: pointer;
          padding-left: 10px;
      }
  }
  /deep/ .wb100{
    width: 100%;
  }
  .inner{
    padding:15px;
  }
  .progress.on {
    border: 2px solid #1C7BEF;
  }
  .progress {
    height: 32px; background: #C2EAAB; position: relative; width: 317px; border: 2px solid #fff; cursor: pointer;
   
    span {
      display: block; position: absolute; left: 0; top: 0; bottom: 0; background: #E3E8EE;
    }
    label {
      position: absolute; right: -48px; top: 7px;
      em {
        color: #1c7bef; font-style: normal;
      }
    }
  }
}
</style>
