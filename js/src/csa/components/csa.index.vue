<template>
  <div class="csa_index" @scroll='scroll'>
    <el-form ref="form" :model="form" label-width="90px" :inline="true" size='small' :rules='rules'>
      <el-form-item>
        <!-- <el-button size='small' type="primary" @click="getSurgeryExecuteById">获取</el-button> -->
        <el-button size='small' type="primary" @click="save" :disabled="disabled">保存</el-button>
      </el-form-item>
      <div class="part">
        <p class="title">手术信息</p>
        <p class="line"></p>
        <el-row>
          <el-form-item label="安排时间" prop='appointmentDateStr'>
              <el-input disabled clearable placeholder="安排时间" v-model="form.appointmentDateStr" style="width: 220px;"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="手术间号" prop='surgeryRoomId'>
          <el-select ref='ele_select1' clearable filterable v-model="form.surgeryRoomId" placeholder="手术间号" :disabled="disabled">
            <el-option  v-for='item in surgeryRoomOptions' :label="item.name" :value="item.id" :key='item.id'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手术台次" prop='surgeryNumber'>
          <el-input  @input="countChange"  style="width: 200px;" clearable filterable v-model="form.surgeryNumber" placeholder="手术台次" :disabled="disabled"></el-input>
        </el-form-item>
        </el-row>
        <p class="line"></p>
        <el-row>
          <el-form-item label="手术时间" prop='surgeryStartTime'>
              <el-date-picker :disabled="disabled" type="datetime" placeholder="手术开始时间" v-model="form.surgeryStartTime" style="width: 100%;" format='yyyy-MM-dd HH:mm' value-format='yyyy-MM-dd HH:mm:ss'></el-date-picker>
          </el-form-item>
          <el-form-item label="" prop='surgeryEndTime'>
              <el-date-picker :disabled="disabled" type="datetime" placeholder="手术结束时间" v-model="form.surgeryEndTime" style="width: 100%;"  format='yyyy-MM-dd HH:mm' value-format='yyyy-MM-dd HH:mm:ss'></el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="麻醉时间" prop='anaesthesiaStartTime'>
              <el-date-picker :disabled="disabled" type="datetime" placeholder="麻醉开始时间" v-model="form.anaesthesiaStartTime" style="width: 100%;"  format='yyyy-MM-dd HH:mm' value-format='yyyy-MM-dd HH:mm:ss'></el-date-picker>
          </el-form-item>
          <el-form-item label="" prop='anaesthesiaEndTime'>
              <el-date-picker :disabled="disabled" type="datetime" placeholder="麻醉结束时间" v-model="form.anaesthesiaEndTime" style="width: 100%;"  format='yyyy-MM-dd HH:mm' value-format='yyyy-MM-dd HH:mm:ss'></el-date-picker>
          </el-form-item>
          <el-form-item label="麻醉效果" prop="anaesthesiaEffect">
            <el-select ref='ele_select2' :disabled="disabled" clearable filterable v-model="form.anaesthesiaEffect" placeholder="麻醉效果">
              <el-option label="优" value="1"></el-option>
              <el-option label="佳" value="2"></el-option>
              <el-option label="劣" value="3"></el-option>
              <el-option label="危机" value="4"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <p class="line"></p>
        <el-row>
          <el-form-item label="紧急级别" prop='emergencyLevel'>
            <sys-type ref='sysType1' :disabled="disabled" code="THC_CPOE_SSJJJB"  v-model="form.emergencyLevel" placeholder="紧急级别"></sys-type>
          </el-form-item>
          <el-form-item label="手术性质"  prop='bacteriaType'>
            <el-select ref='ele_select3' :disabled="disabled" clearable filterable v-model="form.bacteriaType" placeholder="请选择手术性质">
              <el-option label="无菌手术" value="1"></el-option>
              <el-option label="有菌手术" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="切口等级" prop='incisionLevel'>
            <sys-type ref='sysType2' :disabled="disabled" code="CV05.10.022" v-model="form.incisionLevel" placeholder="切口等级"></sys-type>
          </el-form-item>
          <el-form-item label="手术等级" prop='surgeryLevel'> 
            <sys-type ref='sysType3' :disabled="disabled" code="CV05.10.024"  v-model="form.surgeryLevel" placeholder="手术等级"></sys-type>
          </el-form-item>
          <el-form-item label="感染手术" prop='infectious'> 
            <el-select ref='ele_select4' :disabled="disabled" clearable filterable v-model="form.infectious" placeholder="请选择感染手术">
              <el-option label="无" value="1"></el-option>
              <el-option label="丙肝" value="2"></el-option>
              <el-option label="艾滋病" value="3"></el-option>
              <el-option label="梅毒" value="4"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <p class="line"></p>
        <el-row>
          <el-form-item label="术前诊断" class="diagnosis">
            <ever-diagnosis  :disabled="disabled" v-model="form.postoperativeDiagnosis" :norule="true" type='1' class="zdd"></ever-diagnosis>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="术后诊断" class="diagnosis">
            <ever-diagnosis :disabled="disabled" v-model="form.preoperativeDiagnosis" :norule="true" type='1' class="zdd"></ever-diagnosis>
          </el-form-item>
        </el-row>
        <p class="line"></p>
        <el-row class="plus">
          <el-form-item label="主手术" prop='serviceName'>
            <el-input style="width:400px" v-model='form.serviceName' disabled></el-input>
          </el-form-item>
        </el-row>
        <el-row class="plus">
          <el-form-item label="手术" prop='surgeryName'>
            <el-select ref='ele_select5' :disabled="disabled" clearable filterable multiple v-model="form.surgeryName" placeholder="手术"  remote :remote-method="queryService" :loading="ssloading">
              <el-option
              v-for="item in ssoptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <p class="line"></p>
        <el-row class="plus">
          <el-form-item label="主麻醉" prop='anaesthesiaTypeMain'>
             <el-select ref='ele_select6' :disabled="disabled" clearable filterable v-model="form.anaesthesiaTypeMain" placeholder="主麻醉">
              <el-option
              v-for="item in anaesthesiaTypeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row class="plus">
          <el-form-item label="麻醉">
             <el-select ref='ele_select7' :disabled="disabled" clearable filterable multiple v-model="form.anaesthesiaTypes" placeholder="麻醉">
              <el-option
              v-for="item in anaesthesiaTypeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </div>
      <div class="part plus">
        <p class="title">人员信息</p>
        <p class="line"></p>
        <el-row>
          <el-form-item  label="主刀医生" prop='operatorDoctorId'>
            <el-select ref='ele_select8' :disabled="disabled" clearable filterable v-model="form.operatorDoctorId" placeholder="主刀医生">
              <el-option :label="item.name" :value="item.id" v-for='item in operatorDoctorIdOptions' :key='item.id'></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="助手医生" prop='assistantDoctors'>
            <el-select ref='ele_select9' :disabled="disabled" clearable filterable multiple v-model="form.assistantDoctors" placeholder="助手医生" style="marginRight:10px">
              <el-option :label="item.name" :value="item.id" v-for='item in assistantDoctorsOptions' :key='item.id'></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="主麻醉医生" prop='anaesthesiaDoctorId'>
            <el-select ref='ele_select10' :disabled="disabled" clearable filterable v-model="form.anaesthesiaDoctorId" placeholder="主麻醉医生">
             <el-option :label="item.name" :value="item.id" v-for='item in anaesthesiaOptions' :key='item.id'></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="辅麻医生" prop='anaesthesiaAssistants'>
            <el-select ref='ele_select11' :disabled="disabled" clearable filterable multiple v-model="form.anaesthesiaAssistants" placeholder="辅麻医生" style="marginRight:10px">
              <el-option :label="item.name" :value="item.id" v-for='item in anaesthesiaOptions' :key='item.id'></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="洗手护士" prop='scrubNurses'> 
            <el-select ref='ele_select12' :disabled="disabled" clearable filterable multiple v-model="form.scrubNurses" placeholder="洗手护士" style="marginRight:10px">
            <el-option :label="item.name" :value="item.id" v-for='item in nurseOptions' :key='item.id'></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="巡回护士" prop='circulateNurses'>
            <el-select ref='ele_select13' :disabled="disabled" clearable filterable multiple v-model="form.circulateNurses" placeholder="巡回护士" style="marginRight:10px">
              <el-option :label="item.name" :value="item.id" v-for='item in nurseOptions' :key='item.id'></el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </div>
    </el-form>
  </div>
</template>
<script>
import api from '@/csa/store/csaapi.js'
import sysvalue from '@/warehouse/store/sysvalueapi'
import { isJsonString } from '@/util/common'
export default {
  data () {
    return {
      api,
      nurseOptions: [],
      operatorDoctorIdOptions: [],
      assistantDoctorsOptions: [],
      anaesthesiaOptions: [],
      ssoptions: [],
      providerId: '',
      providerName: '',
      ssloading: false,
      disabled: false,
      form: {
        surgeryStartTime: '',
        surgeryEndTime: '',
        anaesthesiaStartTime: '',
        anaesthesiaEndTime: '',
        anaesthesiaEffect: '',
        surgeryNumber: '',
        surgeryRoomId: '',
        infectious: '',
        incisionLevel: '',
        postoperativeDiagnosis: [],
        preoperativeDiagnosis: [],
        surgeryName: [],
        bacteriaType: '',
        anaesthesiaTypes: [],
        assistantDoctors: [],
        scrubNurses: [],
        circulateNurses: [],
        anaesthesiaAssistants: [],
        operatorDoctorId: '',
        anaesthesiaDoctorId: '',
        serviceName: '',
        emergencyLevel: '',
        surgeryLevel: '',
        anaesthesiaTypeMain: '',
        surgeryNumber_bak: ''
      },
      rules: {
        // surgeryNumber: [
        //     {required: true, message: '请输入手术台次', trigger: 'change'},
        // ],
        // surgeryRoomId: [
        //     { required: true, message: '请选择手术间号', trigger: 'change', type: 'string' }
        // ],
        // surgeryStartTime: [
        //     { required: true, message: '请选择手术时间', trigger: 'change', type: 'string' }
        // ],
        // emergencyLevel: [
        //     {required: true, message: '请选择紧急级别', trigger: 'change', type: 'string'}
        // ],
        // bacteriaType: [
        //     { required: true, message: '请选择手术性质', trigger: 'change', type: 'string' }
        // ],
        // incisionLevel: [
        //     { required: true, message: '请选择切口等级', trigger: 'change', type: 'string' }
        // ],
        // surgeryLevel: [
        //     {required: true, message: '请选择手术等级', trigger: 'change', type: 'string'}
        // ],
        // infectious: [
        //     { required: true, message: '请选择感染手术', trigger: 'change', type: 'string' }
        // ],
        // serviceName: [
        //     { required: true, message: '请选择主手术', trigger: 'change', type: 'string' }
        // ],
        // anaesthesiaTypeMain: [
        //     { required: true, message: '请选择主麻醉方式', trigger: 'change', type: 'string' }
        // ],
        // operatorDoctorId: [
        //     { required: true, message: '请选择主刀医生', trigger: 'change', type: 'string' }
        // ],
        // assistantDoctors: [
        //       { required: true, message: '请选择助手医生', trigger: 'change', type: 'array' }
        // ],
        // anaesthesiaDoctorId: [
        //     { required: true, message: '请选择麻醉医生', trigger: 'change', type: 'string' }
        // ],
        // anaesthesiaAssistants: [
        //     { required: true, message: '请选择辅麻医生', trigger: 'change', type: 'array' }
        // ],
        // scrubNurses: [
        //     { required: true, message: '请选择手术间号', trigger: 'change', type: 'array' }
        // ],
        // circulateNurses: [
        //     { required: true, message: '请选择巡回护士', trigger: 'change', type: 'array' }
        // ],
      },
      info: {},
      surgeryRoomOptions: [],
      anaesthesiaTypeOptions: []
    }
  },
  watch: {
    'form.surgeryLevel': async function (val) {
      let arr = []
      for (let i = 1; i < 5; i++) {
        if (i >= this.form.surgeryLevel) arr.push(String(i))
      }
      let operatorDoctorId = await this.getDoctors(arr)  // 主刀👨‍⚕️
      this.operatorDoctorIdOptions = operatorDoctorId.data.resultList || []
    }
  },
  mounted () {
    if (this.$route.query.surgeryStatus === 70) {
      this.disabled = true
    }
    if (localStorage.getItem('csa_value')) {
      let obj = JSON.parse(localStorage.getItem('csa_value'))
      this.providerId = obj.id
      this.providerName = obj.name
      this.getSurgeryExecuteById()
      this.getnurseOptions()
      sysvalue.listOnce('CV06.00.103').then(result => {
        this.anaesthesiaTypeOptions = result
      })
    }
  },
  methods: {
    countChange (val, item) {
      let reg = new RegExp(/^[1-9]{1}[0-9]{0,1}$/)
      if (reg.test(val) || val === '') this.surgeryNumber_bak = this.form.surgeryNumber
      else this.form.surgeryNumber = this.surgeryNumber_bak
    },
    scroll (e) {
      for (let i = 1; i < 14; i++) {
        this.$refs[`ele_select${i}`].blur()
      }
      for (let i = 1; i < 4; i++) {
        this.$refs[`sysType${i}`].$refs.systype.blur()
      }
    },
    async queryService (name = '') {
      this.ssloading = true
      let res = await this.api.queryService({
        name,
        filterServiceClassificationList: [],
        serviceClassificationList: ['2125'],
        isAdviceList: [11, 1],
        isValid: 1,
        usePermission: 1,
        offset: 0,
        pagesize: 100}
      )
      this.ssloading = false
      this.ssoptions = res.data
    },
    idArrToObject (ids, options) {
      let arr = []
      if (!Array.isArray(ids)) return ''
      options.forEach(ele => {
        if (ids.includes(ele.id)) arr.push({id: ele.id, name: ele.name})
      })
      return JSON.stringify(arr)
    },
    getName (id, options) {
      let str = ''
      options.forEach(ele => {
        if (ele.id === id) str = ele.name
      })
      return str
    },
    async save () {
      // let validate = await this.$refs.form.validate()
      // .catch(e => {})
      // if (validate === undefined) return

      if (this.form.surgeryEndTime) {
        if (!this.form.surgeryStartTime) {
          this.$notify({
            title: '提示',
            message: '请先填写手术开始时间！',
            type: 'error'
          })
          return
        }
        if (this.$moment(this.form.surgeryEndTime).valueOf() < this.$moment(this.form.surgeryStartTime).valueOf()) {
          this.$notify({
            title: '提示',
            message: '手术结束时间必须大于开始时间！',
            type: 'error'
          })
          return
        }
      }
      if (this.form.anaesthesiaEndTime) {
        if (!this.form.anaesthesiaStartTime) {
          this.$notify({
            title: '提示',
            message: '请先填写麻醉开始时间！',
            type: 'error'
          })
          return
        }
        if (this.$moment(this.form.anaesthesiaEndTime).valueOf() < this.$moment(this.form.anaesthesiaStartTime).valueOf()) {
          this.$notify({
            title: '提示',
            message: '麻醉结束时间必须大于开始时间！',
            type: 'error'
          })
          return
        }
      }
      let obj = JSON.parse(JSON.stringify(this.form))
      obj.postoperativeDiagnosis = JSON.stringify(obj.postoperativeDiagnosis)
      obj.preoperativeDiagnosis = JSON.stringify(obj.preoperativeDiagnosis)
      obj.surgeryName = JSON.stringify(obj.surgeryName)

      obj.actualExecuteOrgName = this.$store.state.currentUser.organizationName
      obj.actualExecuteOrgId = this.$store.state.currentUser.organizationId
      obj.actualExecuteProviderId = this.providerId // 实际执行科室id
      obj.actualExecuteProviderName = this.providerName // 实际执行科室名称

      obj.surgeryRoomName = this.getName(obj.surgeryRoomId, this.surgeryRoomOptions)
      obj.operatorDoctorName = this.getName(obj.operatorDoctorId, this.operatorDoctorIdOptions)
      obj.anaesthesiaDoctorName = this.getName(obj.anaesthesiaDoctorId, this.anaesthesiaOptions)

      let surgeryJson = {}
      surgeryJson.anaesthesiaTypes = this.idArrToObject(obj.anaesthesiaTypes, this.anaesthesiaTypeOptions)
      surgeryJson.assistantDoctors = this.idArrToObject(obj.assistantDoctors, this.assistantDoctorsOptions)
      surgeryJson.anaesthesiaAssistants = this.idArrToObject(obj.anaesthesiaAssistants, this.anaesthesiaOptions)
      surgeryJson.scrubNurses = this.idArrToObject(obj.scrubNurses, this.nurseOptions)
      surgeryJson.circulateNurses = this.idArrToObject(obj.circulateNurses, this.nurseOptions)
      obj.surgeryJson = surgeryJson

      let res = await this.api.updateSurgeryExecuteById({
        ...this.$route.query,
        ...obj
      })
      if (res && res.head && res.head.errCode === 0) {
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success'
        })
        this.getSurgeryExecuteById()
      }
    },
    async getDoctor () {
      let arr = []
      for (let i = 1; i < 5; i++) {
        if (i >= this.form.surgeryLevel) arr.push(String(i))
      }
      let operatorDoctorId = await this.getDoctors(arr)  // 主刀👨‍⚕️
      this.operatorDoctorIdOptions = operatorDoctorId.data.resultList || []
      let assistantDoctors = await this.getDoctors() // 助手👨‍⚕️
      this.assistantDoctorsOptions = assistantDoctors.data.resultList || []
      let mzys = await this.getDoctors(['01.03']) // 麻醉👨‍⚕️ ,需要添加麻醉属性
      this.anaesthesiaOptions = mzys.data.resultList || []
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
    async getRoomListByParam (id) {
      if (!id) return
      let res = await this.api.getRoomListByParam({
        roomPurposeCodeList: ['OPERATION_ROOM'],
        tenantSubjectIds: [id],
        orgIdList: [this.$store.state.currentUser.organizationId + '']
      })
      if (res.data) {
        this.surgeryRoomOptions = res.data
      }
    },
    getnurseOptions () {
      this.api.getStaffListByCondition({
        tenantSubjectIdList: [this.providerId, this.$route.query.providerId], // 再加上患者科室就行了
        orgIdList: [this.$store.state.currentUser.organizationId + ''],
        typeCodeList: ['NURSE']
      }).then(res => {
        if (res.data && res.data.resultList) {
          let arr = res.data.resultList || []
          this.nurseOptions = arr
        }
      })
    },
    async getSurgeryExecuteById () {
      let res = await this.api.getSurgeryExecuteById({
        id: this.$route.query.id
      })
      let info = res.data || {}
      this.getRoomListByParam(info.actualExecuteProviderId)
      this.surgeryNumber_bak = info.surgeryNumber
      if (info.appointmentDate)info.appointmentDateStr = this.$moment(info.appointmentDate).format('YYYY-MM-DD')
      if (info.appointmentTime)info.appointmentDateStr += '  ' + info.appointmentTime
      let json = ['surgeryName', 'postoperativeDiagnosis', 'preoperativeDiagnosis']
      json.forEach(item => {
        info[item] = isJsonString(info[item]) ? JSON.parse(info[item]) : []
      })
      this.queryService()
        // if (element.applyTime)element.applyTime = this.$moment(element.applyTime).format('YYYY-MM-DD HH:mm')
        // if (element.surgeryPlanTime)element.surgeryPlanTime = this.$moment(element.surgeryPlanTime).format('YYYY-MM-DD')
        // if (element.appointmentStartTime)element.appointmentStartTime = this.$moment(element.appointmentStartTime).format('YYYY-MM-DD')
        // if (element.appointmentEndTime)element.appointmentStartTime += ' - ' + this.$moment(element.appointmentEndTime).format('YYYY-MM-DD')
      let surgeryJson = info.surgeryJson || {}
      let array = ['anaesthesiaTypes', 'assistantDoctors', 'anaesthesiaAssistants', 'scrubNurses', 'circulateNurses']
      array.forEach(item => {
        if (isJsonString(surgeryJson[item])) {
          let li = JSON.parse(surgeryJson[item]) || []
          let arr = []
          li.forEach(ele => {
            arr.push(ele.id)
          })
          info[item] = arr
        }
      })
      this.form = Object.assign(this.form, info)
      this.$nextTick(_ => {
        this.getDoctor() // 根据手术等级来做的
        this.$refs.form.clearValidate()
      })
    }
  }
}
</script>
<style lang="scss" scope>
.csa_index {
  flex:1;
  overflow: auto;
  font-size: 14px;;
  p{
    margin:0;
    margin-bottom: 15px;
  }
  p.title{
  }
  p.line{
    height: 1px;
    background: #DADCE0;
  }
  .plus{
    /deep/ .el-select {
      width: 400px;
    }
  }
  .diagnosis{
    width: 100%;
    /deep/ .el-form-item__content{
      // width: calc(70% - 90px);
      .el-form-item ,.el-form-item__content{
        width: 100%;
      }
    }
    .zdd{
      width: 150%;
    }
  }
  .part{
    background: #fff;
    padding:10px 15px;
    margin-bottom: 10px;
    &:last-child{
      margin-bottom: 0px;
    }
  }
  .icons{
    line-height: 32px;
    margin-right: 10px;
    font-size: 14px;
    color:#666;
  }
}
</style>
