<template>
  <div class="layout_inner flex_col_1_auto" v-loading="loading">
    <ever-form2 ref="queryform" :schema="schema" :rules="rules" v-model="obj">
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
  doctorInfoQuery
} from '@/healthinsurance/store/syyb.insurance.js'
import { sysqzyyCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import filters from '@/healthinsurance/components/filters.js'
let schema = [
  {
    name: 'doctorCode',
    label: '医师编号:',
    span: 6
  },
  {
    name: 'doctorIdNo',
    label: '医师身份证号码:',
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

export default {
  mixins: [filters],
  data () {
    const infoSchema = [
      { name: 'doctorCode', label: '医师编号:', comp: 'readonlyitem', span: 8 },
      { name: 'doctorName', label: '医师姓名:', comp: 'readonlyitem', span: 8 },
      { name: 'prescriptionRight', label: '医保处方权:', comp: 'readonlyitem', span: 8 },
      { name: 'doctorLevel', label: '医师级别:', comp: 'readonlyitem', span: 8, props: { formatter: this.$options.filters.doctorLevel } },
      { name: 'deptName', label: '科室名称:', comp: 'readonlyitem', span: 8 },
      { name: 'title', label: '职称:', comp: 'readonlyitem', span: 8, props: { formatter: this.$options.filters.title } },
      { name: 'administrativePosition', label: '行政职务:', comp: 'readonlyitem', span: 8, props: { formatter: this.$options.filters.administrativePosition } },
      { name: 'academicPosition', label: '学术职务:', comp: 'readonlyitem', span: 8, props: { formatter: this.$options.filters.academicPosition } },
      { name: 'gender', label: '性别:', comp: 'readonlyitem', span: 8, props: { formatter: this.$options.filters.gender } },
      { name: 'contactNumber', label: '联系电话:', comp: 'readonlyitem', span: 8 },
      { name: 'doctorIdNo', label: '医师身份证号码:', comp: 'readonlyitem', span: 8 },
      { name: 'mainDiseaseContent', label: '主治疾病内容:', comp: 'readonlyitem', span: 8 },
      { name: 'diseasesCategory', label: '疾病种类:', comp: 'readonlyitem', span: 8, props: { formatter: this.$options.filters.diseasesCategory } },
      { name: 'occupationCertificateNo', label: '执业证书编号:', comp: 'readonlyitem', span: 8 },
      { name: 'practiceArea', label: '执业范围:', comp: 'readonlyitem', span: 8 },
      { name: 'practiceCrtRegDate', label: '执业证书注册日期:', comp: 'readonlyitem', span: 8 },
      { name: 'doctorCategory', label: '医院人员类别:', comp: 'readonlyitem', span: 8, props: { formatter: this.$options.filters.doctorCategory } },
      { name: 'approvalMark', label: '审批标示:', comp: 'readonlyitem', span: 8 },
      { name: 'operator', label: '经办人:', comp: 'readonlyitem', span: 8 },
      { name: 'operateDate', label: '经办日期:', comp: 'readonlyitem', span: 8 }
    ]
    let validate = (rule, value, callback) => {
      if (!this.obj.doctorCode && !this.obj.doctorIdNo) {
        callback(new Error('查询条件不能为空'))
      } else {
        callback()
      }
    }
    let rules = {
      doctorCode: [
        { validator: validate, trigger: 'change' }
      ],
      doctorIdNo: [
        { validator: validate, trigger: 'change' }
      ]
    }
    const infoObj = this.$ever.createObjFromSchema(infoSchema)
    const obj = this.$ever.createObjFromSchema(schema)
    return {
      infoSchema,
      infoObj,
      schema,
      obj,
      rules,
      loading: false
    }
  },
  created () {
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
            param: {
              doctorCode: this.obj.doctorCode,
              doctorIdNo: this.obj.doctorIdNo
            }
          }
          this.loading = true
          doctorInfoQuery(params).then(rs => {
            if (!rs.head.errCode) {
              this.infoObj = Object.assign(this.infoObj, rs.data.data[0])
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
    }
  }
}
</script>
