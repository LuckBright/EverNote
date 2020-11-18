<template>
  <div>
    <el-row>
      <ever-form2
        ref="form"
        :schema="schema"
        v-model="queryObj"
        :rules="rules"
        labelWidth="130px"
        :span="8"
      >
        <div></div>
      </ever-form2>
    </el-row>
    <el-row class="el-dialog__footer">
      <div class="buttons">
        <el-button type="primary" size="small" @click="medicalRegister" :disabled="sureBtnDis">确定</el-button>
        <el-button size="small" @click="cancel">取消</el-button>
      </div>
    </el-row>
  </div>
</template>

<script>
import { tradeType, dischargeStatus } from '@/rcm/otmdiscomponent/config-js/medical-regInfo-config.js'
import { treatType, outReason, injuryType, birthFeeType } from '@/rcm/otmdiscomponent/config-js/sysqzyy-config.js'
import medicalDiagnose from '@/rcm/otmdiscomponent/medicaldiagnose.vue'
import { medicalRegister, updateRegister, cancelRegister, getMedicalRegisterInfo, outRegister } from '@/rcm/store/otmdiscomponent/sysqzyy-api.js'
import { sysqzyyCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'

let schema = [
  {
    label: '交易类型',
    name: 'tradeType',
    comp: 'ever-select',
    props: {
      options: tradeType,
      disabledOptions: []
    }
  },
  {
    label: '就诊流水号',
    name: 'visitNumber'
  },
  {
    label: '医疗类别',
    name: 'treatType',
    comp: 'ever-select',
    props: {
      options: treatType
    }
  },
  {
    label: '入院日期',
    name: 'hospitalizedStartDate',
    comp: 'datePicker',
    props: {
      showformat: 'yyyyMMddHHmmss',
      outformat: 'yyyyMMddHHmmss'
    }
  },
  {
    label: '入院疾病编码',
    name: 'inDiagnosisCode',
    comp: medicalDiagnose,
    props: {
      insuranceOrgId: sysqzyyCode
    }
  },
  {
    label: '出院日期',
    name: 'dischargeDate',
    comp: 'datePicker',
    props: {
      showformat: 'yyyyMMddHHmmss',
      outformat: 'yyyyMMddHHmmss'
    }
  },
  {
    label: '出院疾病编码',
    name: 'dischargeDiagnosisCode',
    comp: medicalDiagnose,
    props: {
      insuranceOrgId: sysqzyyCode
    }
  },
  {
    label: '病历信息',
    name: 'medicalRecord'
  },
  {
    label: '生育日期',
    name: 'birthDate',
    comp: 'datePicker',
    props: {
      showformat: 'yyyyMMddHHmmss',
      outformat: 'yyyyMMddHHmmss'
    }
  },
  {
    label: '生育费用类别',
    name: 'birthFeeCategory',
    comp: 'ever-select',
    props: {
      options: birthFeeType
    }
  },
  {
    label: '生育证号',
    name: 'birthNo'
  },
  {
    label: '出生证号',
    name: 'bornNo'
  },
  {
    label: '配偶身份证号',
    name: 'spouseNo'
  },
  {
    label: '配偶姓名',
    name: 'spouseName'
  },
  {
    label: '工伤类别',
    name: 'workInjuryCategory',
    comp: 'ever-select',
    props: {
      options: injuryType
    }
  },
  {
    label: '主诊断编码一',
    name: 'primaryFirstDiagnosisCode',
    comp: medicalDiagnose,
    props: {
      insuranceOrgId: sysqzyyCode
    }
  },
  {
    label: '主诊断编码二',
    name: 'primarySecondDiagnosisCode',
    comp: medicalDiagnose,
    props: {
      insuranceOrgId: sysqzyyCode
    }
  },
  {
    label: '副诊断疾病名称一',
    name: 'secondaryFirstDiagnosisName'
  },
  {
    label: '副诊断疾病名称二',
    name: 'secondarySecondDiagnosisName'
  },
  {
    label: '副诊断疾病名称三',
    name: 'secondaryThirdDiagnosisName'
  },
  {
    label: '副诊断疾病名称四',
    name: 'secondaryFourthDiagnosisName'
  },
  {
    label: '副诊断疾病名称五',
    name: 'secondaryFifthDiagnosisName'
  },
  {
    label: '副诊断疾病名称六',
    name: 'secondarySixthDiagnosisName'
  },
  {
    label: '经办人',
    name: 'operator'
  },
  {
    label: '出院原因',
    name: 'dischargeReason',
    comp: 'ever-select',
    props: {
      options: outReason
    }
  },
  {
    label: '经办日期',
    name: 'managerDate',
    comp: 'datePicker',
    props: {
      showformat: 'yyyyMMddHHmmss',
      outformat: 'yyyyMMddHHmmss'
    }
  },
  {
    label: '发票号',
    name: 'feeno'
  },

  {
    label: '出院状态',
    name: 'dischargeStatus',
    comp: 'ever-select',
    props: {
      options: dischargeStatus
    }
  },
  {
    label: '科室名称',
    name: 'deptName',
    comp: 'everSubjectSelect',
    props: {
      type: 'select',
      fields: ['id', 'orgSubjectCode', 'orgSubjectName']
    }
  },
  {
    label: '病室',
    name: 'diseaseArea'
  },
  {
    label: '床位号',
    name: 'bedNo'
  },
  {
    label: '医生姓名',
    name: 'doctorName',
    comp: 'everStaffSelect',
    props: {
      params: {
        everQueryType: 'out',
        typeCodeList: ['DOCTOR'],
        typeCode: true
      },
      fields: ['id', 'name', 'jobNumber']
    }
  },
  {
    label: '患者联系方式',
    name: 'patientContact'
  },
  {
    label: '家属联系方式',
    name: 'familyMemberContact'
  }]
let rules = {
  tradeType: [{
    required: true,
    message: '请输入交易类型',
    trigger: 'change'
  }],
  visitNumber: [{
    required: true,
    message: '请输入就诊流水号',
    trigger: 'change'
  }],
  treatType: [{
    required: true,
    message: '请输入医疗类别',
    trigger: 'change'
  }],
  hospitalizedStartDate: [{
    required: true,
    message: '入院日期不能为空',
    trigger: 'change'
  }],
  inDiagnosisCode: [{
    required: true,
    validator: (rule, value, callback) => {
      if (!value || !value.id || !value.name) {
        callback(new Error('入院疾病编码不能为空'))
      } else {
        callback()
      }
    },
    trigger: '入院疾病编码不能为空'
  }],
  primaryFirstDiagnosisCode: [{
    required: true,
    validator: (rule, value, callback) => {
      if (!value || !value.id || !value.name) {
        callback(new Error('主诊断编码一不能为空'))
      } else {
        callback()
      }
    },
    trigger: '主诊断编码一不能为空'
  }],
  managerDate: [{
    required: true,
    message: '经办日期不能为空',
    trigger: 'change'
  }],
  deptName: [{
    required: true,
    validator: (rule, value, callback) => {
      if (!value || !value.id || !value.orgSubjectCode) {
        callback(new Error('科室名称不能为空'))
      } else {
        callback()
      }
    },
    trigger: 'change'
  }],
  doctorName: [{
    required: true,
    validator: (rule, value, callback) => {
      if (!value || !value.id || !value.name) {
        callback(new Error('医生名称不能为空'))
      } else {
        callback()
      }
    },
    trigger: 'change'
  }],
  operator: [{
    required: true,
    message: '经办人不能为空',
    trigger: 'change'
  }]
}
let outHosRules = {
  dischargeDate: [{
    required: true,
    message: '请输入出院日期',
    trigger: 'change'
  }],
  dischargeDiagnosisCode: [{
    required: true,
    validator: (rule, value, callback) => {
      if (!value || !value.id || !value.name) {
        callback(new Error('出院疾病编码不能为空'))
      } else {
        callback()
      }
    },
    trigger: '出院疾病编码不能为空'
  }],
  dischargeReason: [{
    required: true,
    message: '出院原因不能为空',
    trigger: 'change'
  }],
  operator: [{
    required: true,
    message: '经办人不能为空',
    trigger: 'change'
  }]
}
export default {
  props: {
    medicalRegisterInfo: {
      type: [Boolean]
    },
    paramObj: {
      type: [Object],
      default () {
        return {}
      }
    }
  },
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.visitNumber = this.paramObj.ipNo || this.paramObj.visitNumber
    queryObj.treatType = '21'
    // 给交易类型赋默认值
    queryObj.tradeType = this.paramObj.tradeType
    if (this.paramObj.tradeType === '0') {
      queryObj.tradeType = '3'
      let disabledOptions = this.$ever.getFieldFromSchema(schema, 'tradeType').props.disabledOptions
      // 出院界面操作，只允许出院登记，其他不允许
      disabledOptions.push({ id: '1' }, { id: '2' }, { id: '-1' })
      rules = { ...rules, ...outHosRules }
    }
    if (this.paramObj.tradeType === '3') {
      rules = { ...rules, ...outHosRules }
    }
    return {
      schema,
      queryObj,
      rules,
      sureBtnDis: false
    }
  },
  methods: {
    // 获取住院登记编号
    getRegisterInfo () {
      let params = {
        insuranceOrgId: sysqzyyCode,
        visitNumber: this.queryObj.visitNumber
      }
      getMedicalRegisterInfo(params).then(res => {
        let result = res.data
        // 两个疾病回填
        result.inDiagnosisCode = { id: result.inDiagnosisCode, name: result.inDiagnosisName }
        result.dischargeDiagnosisCode = { id: result.dischargeDiagnosisCode, name: result.dischargeDiagnosisName }
        // 两个主诊断疾病回显
        result.primaryFirstDiagnosisCode = {
          id: result.primaryFirstDiagnosisCode,
          name: result.primaryFirstDiagnosisName
        }
        result.primarySecondDiagnosisCode = {
          id: result.primarySecondDiagnosisCode,
          name: result.primarySecondDiagnosisName
        }
        // 科室回显
        result.deptName = { id: result.deptId, orgSubjectCode: result.deptName, orgSubjectName: result.deptName }
        // 医生姓名回显
        result.doctorName = { id: result.doctorId, name: result.doctorName, jobNumber: result.doctorCode }
        // 入院原因和出院原因转换成字符串
        if (result.inReason !== undefined && result.inReason !== null) {
          result.inReason = result.inReason + ''
        }
        if (result.dischargeReason !== undefined && result.dischargeReason !== null) {
          result.dischargeReason = result.dischargeReason + ''
        }
        if (result.dischargeStatus) {
          result.dischargeStatus = +result.dischargeStatus
        }
        this.queryObj = Object.assign({}, this.queryObj, result)
      }, err => {
        console.log('err', err)
      })
    },
    // 医保登记
    medicalRegister () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          this.sureBtnDis = true
          let params = {
            macId: this.macId,
            insuranceOrgId: this.insuranceOrgId,
            visitNumber: this.queryObj.visitNumber
          }
          // 三个与人名有关的值
          let param = JSON.parse(JSON.stringify(this.queryObj))

          // 两个疾病回填
          const { id: inDiagnosisCode, name: inDiagnosisName } = param.inDiagnosisCode || {}
          const { id: dischargeDiagnosisCode, name: dischargeDiagnosisName } = param.dischargeDiagnosisCode || {}
          // 两个主诊断疾病
          const { id: primaryFirstDiagnosisCode, name: primaryFirstDiagnosisName } = param.primaryFirstDiagnosisCode || {}
          const { id: primarySecondDiagnosisCode, name: primarySecondDiagnosisName } = param.primarySecondDiagnosisCode || {}
          // 科室
          const { id: deptId, orgSubjectName: deptName } = param.deptName || {}
          // 医生名
          const { id: doctorId, name: doctorName, jobNumber: doctorCode } = param.doctorName || {}
          param = {
            ...param,
            inDiagnosisName,
            inDiagnosisCode,
            dischargeDiagnosisCode,
            dischargeDiagnosisName,
            primaryFirstDiagnosisCode,
            primaryFirstDiagnosisName,
            primarySecondDiagnosisCode,
            primarySecondDiagnosisName,
            deptId,
            deptName,
            doctorId,
            doctorCode,
            doctorName
          }
          params.param = param
          this.sureMethod(params).then(res => {
            if (res.head && res.head.errCode === 0) {
              this.$messageTips(this, 'success', '操作成功')
              this.$emit('register-success')
              this.sureBtnDis = false
              this.v = false
            } else {
              this.sureBtnDis = false
            }
          }, err => {
            this.sureBtnDis = false
            console.log('err', err)
          })
        }
      })
    },
    // 取消
    cancel () {
      this.$emit('cancel')
    }
  },
  computed: {
    sureMethod: {
      get () {
        switch (this.queryObj.tradeType) {
          case '1':
            return medicalRegister
          case '2':
            return updateRegister
          case '3':
            return outRegister
          case '-1':
            return cancelRegister
          default:
            break
        }
      }
    }
  },
  watch: {
    'queryObj.tradeType': {
      handler: function (val, oldVal) {
        this.$refs.form.$refs.form.clearValidate()
        switch (val) {
          case '1':
          case '2':
            this.rules = rules
            break
          case '3':
            this.rules = { ...rules, ...outHosRules }
            break
          case '-1':
            this.rules = {}
            break
          default:
            break
        }
      }
    }
  },
  created () {
    // 调接口获取详情
    this.getRegisterInfo()
  },
  components: {
    medicalDiagnose
  }
}
</script>
