<template>
  <div>
    <el-row>
      <ever-form2 ref="form" :schema="schema" v-model="queryObj" :rules="rules" labelWidth="130px">
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
import { tradeType, medicalType, dischargeStatus } from '@/rcm/otmdiscomponent/config-js/medical-regInfo-config.js'
import medicalDiagnose from '@/rcm/otmdiscomponent/medicaldiagnose.vue'
import { getMedicalRegisterInfo, medicalRegister } from '@/rcm/store/hospital/hospital.js'
import { jlccybCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
let schema = [
  {
    label: '交易类型',
    name: 'tradeType',
    comp: 'ever-select',
    props: {
      options: tradeType,
      disabledOptions: []
    },
    span: 8
  },
  {
    label: '就诊流水号',
    name: 'visitNumber',
    span: 8
  },
  {
    label: '医疗类别',
    name: 'treatType',
    comp: 'ever-select',
    props: {
      options: medicalType
    },
    span: 8
  },
  {
    label: '入院日期',
    name: 'hospitalizedStartDate',
    comp: 'datePicker',
    props: {
      showformat: 'yyyyMMdd',
      outformat: 'yyyyMMdd'
    },
    span: 8
  },
  {
    label: '出院日期',
    name: 'hospitalizedEndDate',
    comp: 'datePicker',
    props: {
      showformat: 'yyyyMMdd',
      outformat: 'yyyyMMdd'
    },
    span: 8
  },
  {
    label: '入院疾病编码',
    name: 'inDiagnosisCode',
    comp: medicalDiagnose,
    props: {
      insuranceOrgId: jlccybCode
    },
    span: 8
  },
  {
    label: '挂号费',
    name: 'registFee',
    comp: 'ever-price',
    props: {
      type: 'number'
    },
    span: 8
  },
  {
    label: '诊查费',
    name: 'examineFee',
    comp: 'ever-price',
    props: {
      type: 'number'
    },
    span: 8
  },
  {
    label: '出院疾病编码',
    name: 'outDiagnosisCode',
    comp: medicalDiagnose,
    props: {
      insuranceOrgId: jlccybCode
    },
    span: 8
  },
  {
    label: '经办人',
    name: 'managerName',
    span: 8
  },
  {
    label: '经办日期',
    name: 'managerDate',
    comp: 'datePicker',
    props: {
      showformat: 'yyyyMMdd',
      outformat: 'yyyyMMdd'
    },
    span: 8
  },
  {
    label: '发票号',
    name: 'feeno',
    span: 8
  },

  {
    label: '出院状态',
    name: 'dischargeStatus',
    comp: 'ever-select',
    props: {
      options: dischargeStatus
    },
    span: 8
  },
  {
    label: '审批人',
    name: 'approver',
    span: 8
  },
  {
    label: '科室名称',
    name: 'sectionName',
    comp: 'everSubjectSelect',
    props: {
      type: 'select',
      fields: ['id', 'orgSubjectCode', 'orgSubjectName']
    },
    span: 8
  },
  {
    label: '病室',
    name: 'diseaseArea',
    span: 8
  },
  {
    label: '床位号',
    name: 'bedno',
    span: 8
  },
  {
    label: '医生姓名',
    name: 'drName',
    comp: 'everStaffSelect',
    props: {
      params: {
        everQueryType: 'out',
        typeCodeList: ['DOCTOR'],
        typeCode: true
      },
      fields: ['id', 'name']
    },
    span: 8
  },
  {
    label: '患者联系方式',
    name: 'patientContact',
    span: 8
  },
  {
    label: '家属联系方式',
    name: 'familyMemberContact',
    span: 8
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
  hospitalizedEndDate: [{
    required: true,
    message: '出院日期不能为空',
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
  managerDate: [{
    required: true,
    message: '经办日期不能为空',
    trigger: 'change'
  }],
  sectionName: [{
    required: true,
    validator: (rule, value, callback) => {
      if (!value || !value.id || !value.orgSubjectCode || !value.orgSubjectName) {
        callback(new Error('科室名称不能为空'))
      } else {
        callback()
      }
    },
    trigger: 'change'
  }],
  drName: [{
    required: true,
    validator: (rule, value, callback) => {
      if (!value || !value.id || !value.name) {
        callback(new Error('医生名称不能为空'))
      } else {
        callback()
      }
    },
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
    // 加限制条件
    let disabledOptions = this.$ever.getFieldFromSchema(schema, 'tradeType').props.disabledOptions
    if (this.paramObj.tradeType === '0') {
      queryObj.tradeType = '3'
      // 出院界面操作，只允许出院登记，其他不允许
      disabledOptions.push({ id: '1' }, { id: '2' }, { id: '-1' })
      // 将出院疾病编号设置为必填项
      rules.outDiagnosisCode = [{
        required: true,
        validator: (rule, value, callback) => {
          if (!value || !value.id || !value.name) {
            callback(new Error('出院疾病编码不能为空'))
          } else {
            callback()
          }
        },
        trigger: '入院疾病编码不能为空'
      }]
    } else if (this.paramObj.tradeType === '3') {
      // 如果当前交易类型是出院登记，只允许选择出院登记和无非退院
      disabledOptions.push({ id: '1' }, { id: '2' })
    }
    return {
      schema,
      queryObj,
      rules,
      sureBtnDis: false,
    }
  },
  methods: {
    // 获取住院登记编号
    getRegisterInfo () {
      let params = {
        visitNumber: this.queryObj.visitNumber
        // visitNumber: 'ZBIP201900000120'
      }
      getMedicalRegisterInfo(params).then(res => {
        let result = res.data && res.data[0]
        // 两个疾病回填
        result.inDiagnosisCode = { id: result.inDiagnosisCode, name: result.inDiagnosisName }
        result.outDiagnosisCode = { id: result.outDiagnosisCode, name: result.outDiagnosisName }
        // 科室回显
        result.sectionName = { id: result.sectionCode, orgSubjectCode: result.sectionCode, orgSubjectName: result.sectionName }
        // 医生姓名回显
        result.drName = { id: result.drCode, name: result.drName }
        this.queryObj = Object.assign({}, this.queryObj, result)
        if (this.paramObj.tradeType === '0') {
          // 出院界面操作，选中值为出院登记
          this.queryObj.tradeType = '3'
        }
      }, err => {
        console.log('err', err)
      })
    },
    // 医保出院登记
    medicalRegister () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          this.sureBtnDis = true
          // 三个与人名有关的值
          let params = JSON.parse(JSON.stringify(this.queryObj))
          // 两个疾病回填
          params.inDiagnosisName = params.inDiagnosisCode.name
          params.inDiagnosisCode = params.inDiagnosisCode.id
          params.outDiagnosisName = params.outDiagnosisCode && params.outDiagnosisCode.name
          params.outDiagnosisCode = params.outDiagnosisCode && params.outDiagnosisCode.id
          // 科室
          params.sectionCode = params.sectionName && params.sectionName.id
          params.sectionName = params.sectionName && params.sectionName.orgSubjectName
          // 医生姓名
          params.drCode = params.drName && params.drName.id
          params.drName = params.drName && params.drName.name
          medicalRegister(params).then(res => {
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
  created () {
    // 调接口获取详情
    this.getRegisterInfo()
  },
  components: {
    medicalDiagnose
  }
}
</script>
