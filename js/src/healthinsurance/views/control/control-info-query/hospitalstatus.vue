
<template>
  <div class="layout_inner flex_col_1_auto" v-loading="loading">
    <ever-form2 ref="queryform" :schema="schema" :rules="rules" v-model="obj" label-width="70px">
      <template slot="btns">
        <el-button type="primary" size="small" @click="list(true)">查询</el-button>
        <el-button size="small" @click="resetForm">重置</el-button>
      </template>
      <div></div>
    </ever-form2>
    <ever-form2
      labelWidth="180px"
      :schema="infoSchema"
      v-model="infoObj"
      :nosubmit="true"
      :span="8"
    ></ever-form2>
  </div>
</template>

<script>
import {
  inHospitalStatusQuery
} from '@/healthinsurance/store/syyb.insurance.js'
import { sysqzyyCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import personno from '@/rcm/otmdiscomponent/personno.vue'
import { formatters } from '@/rcm/otmdiscomponent/sysqzyy-medical/medical-card/sysqzyy-cardinfo.js'
let schema = [
  {
    label: '个人编号',
    name: 'personalNo',
    comp: personno,
    props: {
      insuranceOrgId: sysqzyyCode
    },
    span: 6
  },
  {
    label: '',
    name: 'btns',
    labelWidth: '15px',
    comp: 'custom',
    span: 4
  }
]
const infoSchema = [
  {
    name: 'inHospitalStatus',
    label: '在院状态:',
    comp: 'readonlyitem',
    props: {
      formatter: (status) => {
        switch (status) {
          case '0':
            return '不在院'
          case '1':
            return '在院'
          case '':
            return ''
          default:
            return ''
        }
      }
    }
  },
  { name: 'personalNo', label: '个人编号:', comp: 'readonlyitem' },
  { name: 'orgCode', label: '定点机构编号:', comp: 'readonlyitem' },
  { name: 'orgName', label: '定点机构名称:', comp: 'readonlyitem' },
  { name: 'visitNumber', label: '就诊流水号:', comp: 'readonlyitem' },
  {
    name: 'medicalCategory',
    label: '医疗类别:',
    comp: 'readonlyitem',
    props: {
      formatter: formatters.medicalType
    }
  },
  { name: 'admissionDate', label: '入院日期:', comp: 'readonlyitem', newRow: true },
  { name: 'admissionDiagnosisCode', label: '入院诊断疾病编码:', comp: 'readonlyitem' },
  { name: 'admissionDiagnosisName', label: '入院诊断疾病名称:', comp: 'readonlyitem' },
  { name: 'deptName', label: '科室名称:', comp: 'readonlyitem' },
  { name: 'bedNo', label: '床位号:', comp: 'readonlyitem' },
  { name: 'doctorCode', label: '医生代码:', comp: 'readonlyitem' },
  { name: 'doctorName', label: '医生姓名:', comp: 'readonlyitem' },
  { name: 'hospitalManager', label: '医院经办人:', comp: 'readonlyitem' },
  { name: 'hospitalHandlingDate', label: '医院经办日期:', comp: 'readonlyitem' },
]
let rules = {
  personalNo: [
    { required: true, message: '个人编号不能为空', trigger: 'change' }
  ]
}
export default {
  data () {
    const infoObj = this.$ever.createObjFromSchema(infoSchema)
    const obj = this.$ever.createObjFromSchema(schema)
    return {
      infoSchema,
      infoObj,
      schema,
      obj,
      // 个人编号组件抛出读卡对象
      medicalInfo: null,
      rules,
      loading: false
    }
  },
  methods: {
    list () {
      this.$refs.queryform.$refs.form.validate(valid => {
        if (valid) {
          this.clearInfo()
          let params = {
            macId: this.macId,
            insuranceOrgId: sysqzyyCode,
            visitNumber: this.obj.visitNumber,
            centerNo: this.medicalInfo.systemId,
            param: {
              personalNo: this.obj.personalNo
            }
          }
          this.loading = true
          inHospitalStatusQuery(params).then(rs => {
            if (!rs.head.errCode) {
              this.infoObj = Object.assign(this.infoObj, rs.data.data)
            }
            this.loading = false
          }).catch(rj => {
            this.loading = false
          })
        }
      })
    },
    clearInfo () {
      Object.keys(this.infoObj).forEach(item => {
        this.infoObj[item] = ''
      })
    },
    resetForm () {
      this.$refs.queryform.$refs.form.resetForm()
    },
    // 个人编号组件抛出读卡对象，由子组件查找并调用
    getSystemIdfromPersonno (medicalInfo) {
      this.medicalInfo = medicalInfo
    }
  }
}
</script>
