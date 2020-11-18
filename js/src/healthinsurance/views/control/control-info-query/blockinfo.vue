
<template>
<div class="layout_inner flex_col_1_auto" v-loading="loading">
  <ever-form2
    ref="queryform"
    :schema="schema"
    :rules="rules"
    v-model="obj"
    label-width="70px"
    >
    <template slot="btns">
      <el-button type="primary" size="small" @click="list(true)">查询</el-button>
      <el-button size="small" @click="resetForm">重置</el-button>
    </template>
    <div></div>
  </ever-form2>
  <ever-form2 :schema="infoSchema" label-width="80px" v-model="infoObj" ref="form" :nosubmit="true" class="readform mt20"></ever-form2>
</div>
</template>

<script>
import {
  blockadeInformationQuery
} from '@/healthinsurance/store/syyb.insurance.js'
import { sysqzyyCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import personno from '@/rcm/otmdiscomponent/personno.vue'
import { treatType } from '@/rcm/otmdiscomponent/config-js/sysqzyy-config.js'
let schema = [
  {
    name: 'companyNo',
    label: '单位编号:',
    span: 4
  },
  {
    label: '个人编号',
    name: 'personalNo',
    comp: personno,
    span: 4,
    props: {
      insuranceOrgId: sysqzyyCode
    }
  },
  {
    name: 'medicalCategory',
    label: '医疗类别:',
    comp: 'el-select',
    props: {
      options: treatType
    },
    span: 4
  },
  {
    label: '判断时间',
    name: 'judgingTime',
    comp: 'datePicker',
    span: 4
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
    name: 'blockadeMark',
    label: '封锁标志:',
    comp: 'readonlyitem'
  },
  {
    name: 'blockadeReason1',
    label: '封锁原因1:',
    comp: 'readonlyitem'
  },
  {
    name: 'blockadeReason2',
    label: '封锁原因2:',
    comp: 'readonlyitem'
  },
  {
    name: 'blockadeReason3',
    label: '封锁原因3:',
    comp: 'readonlyitem'
  }
]
let rules = {
  companyNo: [
    { required: true, message: '单位编号不能为空', trigger: 'change' }
  ],
  personalNo: [
    { required: true, message: '个人编号不能为空', trigger: 'change' }
  ],
  medicalCategory: [
    { required: true, message: '医疗类别不能为空', trigger: 'change' }
  ],
  judgingTime: [
    { required: true, message: '判断时间不能为空', trigger: 'change' }
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
      rules,
      medicalInfo: null,
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
            centerNo: this.medicalInfo.systemId,
            param: {
              companyNo: this.obj.companyNo,
              personalNo: this.obj.personalNo,
              medicalCategory: this.obj.medicalCategory,
              judgingTime: this.obj.judgingTime ? this.$moment(this.obj.judgingTime).format('YYYYMMDD') : ''
            }
          }
          this.loading = true
          blockadeInformationQuery(params).then(rs => {
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
      this.$refs.form.$refs.form.resetForm()
    },
    // 个人编号组件抛出读卡对象，由子组件查找并调用
    getSystemIdfromPersonno (medicalInfo) {
      this.medicalInfo = medicalInfo
    }
  },
  created () {
  }
}
</script>

<style lang="scss" scoped>
</style>
