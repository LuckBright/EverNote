<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="80%" :close-on-click-modal="false">
    <div class="head-info">
      <div>姓名：{{obj.patientName}}</div>
      <div>性别：{{obj.patientGender | formatSex}}</div>
      <div>科室：{{obj.deptName}}</div>
      <div>病区：{{obj.inpatientArea}}</div>
    </div>
    <div class="head-info">
      <div>入院诊断：{{obj.admissionDiagnosis}}</div>
    </div>
    <ever-form2
        :schema="schema"
        v-model="obj"
        ref="everform"
        :span="12"
        :rules="rules"
      >
      <div class="main-option">
      </div>
    </ever-form2>
    <div v-if="type === 'approval'" slot="footer">
      <el-button type="primary" size="small" @click="submit">审批</el-button>
      <el-button size="small" @click="dialogVisible=false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  tranSfer,
  getTransferDetail
} from '@/rcm/store/otmdiscomponent/insurance-approval-api'
import medicalDiagnose from '@/rcm/otmdiscomponent/medicaldiagnose.vue'
let schema = [
  {
    label: '个人编号',
    name: 'personno',
    props: {
      disabled: true
    },
    span: 8
  },
  {
    label: '出院诊断',
    name: 'dischargeDiagnosis',
    comp: medicalDiagnose,
    props: {
      insuranceOrgId: '307cb17330944ff5ba1969453eb92f82'
    },
    span: 16
  },
  {
    label: '审批编号',
    name: 'approvalNo',
    props: {
      disabled: true
    },
    span: 8
  },
  {
    label: '开始日期',
    name: 'startDay',
    comp: 'date-picker',
    props: {
      outformat: 'yyyy-MM-dd'
    },
    span: 8
  },
  {
    label: '结束日期',
    name: 'endDay',
    comp: 'date-picker',
    props: {
      outformat: 'yyyy-MM-dd'
    },
    span: 8
  },
  {
    label: '转外原因',
    name: 'reason',
    props: {
      type: 'text'
    },
    span: 24
  },
  {
    label: '诊断医生',
    name: 'doctor',
    span: 12
  },
  {
    label: '审批类别',
    name: 'approveType',
    comp: 'ever-select',
    props: {
      disabled: true,
      options: [
        {name: '转外诊治', id: 13}
      ]
    },
    span: 12
  },
  {
    label: '医保科意见',
    name: 'opinion',
    comp: 'textarea',
    span: 24
  },
  {
    label: '转外医院',
    name: 'hospitalName',
    span: 8
  },
  {
    label: '医院等级',
    name: 'hospitalLevel',
    comp: 'ever-select',
    props: {
      // disabled: true,
      options: [
        {name: '一级甲等', id: 11},
        {name: '一级乙等', id: 12},
        {name: '一级丙等', id: 13},
        {name: '二级甲等', id: 21},
        {name: '二级乙等', id: 22},
        {name: '二级丙等', id: 23},
        {name: '三级甲等', id: 31},
        {name: '三级乙等', id: 32},
        {name: '三级丙等', id: 33}
      ]
    },
    span: 8
  },
  {
    label: '备注',
    name: 'remark',
    comp: 'textarea',
    span: 24
  },
  {
    label: '审批人',
    name: 'approvePersonName',
    span: 8
  },
  {
    label: '审批日期',
    name: 'approvalTime',
    comp: 'date-picker',
    props: {
      outformat: 'yyyy-MM-dd'
    },
    span: 8
  },
  {
    label: '有效标识',
    name: 'isValid',
    comp: 'ever-select',
    props: {
      disabled: true,
      options: [{
        id: 1,
        name: '有效'
      }]
    },
    span: 8
  }
]
let infoObj = {
  patientName: '',
  patientGender: '',
  deptName: '',
  inpatientArea: '',
  admissionDiagnosis: ''
}
export default {
  props: ['type', 'data'],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    Object.assign(obj, infoObj)
    obj.isValid = 1
    obj.approveType = 13
    return {
      obj,
      schema,
      dialogVisible: false,
      title: '转院审批',
      headInfo: {},
      rules: {
        'diseaseName': [{ required: true, message: '必填项', trigger: 'blur' }],
        'dischargeDiagnosis': [{ required: true, message: '出院诊断', trigger: ['blur', 'change'] }]
      },
    }
  },
  methods: {
    submit () {
      this.$refs.everform.$refs.form.validate(valid => {
        if (valid) {
          let params = {
            macId: this.macId,
            insuranceOrgId: '307cb17330944ff5ba1969453eb92f82',
            ...this.obj
          }
          params.visitNumber = this.data.visitNumber
          params.startDay = params.startDay.replace(/-/g, '')
          params.endDay = params.endDay.replace(/-/g, '')
          params.approvalTime = params.approvalTime.replace(/-/g, '')
          params.diseaseCode = params.dischargeDiagnosis.diseaseCode
          tranSfer(params).then(rs => {
            if (!rs.head.errCode) {
              this.$messageTips(this, 'success', '转院审批成功')
              this.dialogVisible = false
              this.$emit('success')
            } else {
              this.$messageTips(this, 'error', '转院审批失败')
            }
          }).catch(rj => {
            this.$messageTips(this, 'error', '转院审批失败')
          })
        }
      })
    },
    getData () {
      let params = {approvalId: this.data.approvalId}
      getTransferDetail(params).then(rs => {
        if (!rs.head.errCode) {
          let timeVale = ['approvalTime', 'endDay', 'startDay']
          for (let key in rs.data) {
            if (timeVale.includes(key)) {
              this.obj[key] = this.$moment(rs.data[key]).format('YYYY-MM')
            } else if (key === 'dischargeDiagnosis') {
              this.obj[key] = JSON.parse(rs.data[key])
            } else {
              this.obj[key] = rs.data[key]
            }
          }
        }
      })
    },
    initData (data) {
      this.obj.patientName = data.personName
      this.obj.deptName = data.sectionName
      this.obj.inpatientArea = data.diseaseArea
      this.obj.admissionDiagnosis = data.inDiagnosisName
      this.obj.personno = data.personNo
    }
  },
  watch: {
    'dialogVisible': {
      handler (val) {
        if (val) {
          this.$nextTick(_ => {
            this.$refs.everform.$refs.form.resetFields()
            if (this.type === 'approval') {
              this.title = '转院审批'
              this.initData(this.data)
            } else {
              this.title = '查看审批详情'
              this.getData()
            }
          })
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .head-info {
    margin:20px 0 20px 50px;
    div {
      display: inline-block;
      margin-right: 20px;
    }
  }
</style>
