<template>
<div class="layout_inner flex_col_1_auto" v-loading="loading">
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
  orgInfoQuery
} from '@/healthinsurance/store/syyb.insurance.js'
import { sysqzyyCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import filters from '@/healthinsurance/components/filters.js'
// let schema = [
//   {
//     name: 'visitNumber',
//     label: '就诊流水号'
//   },
//   {
//     label: '',
//     name: 'btns',
//     labelWidth: '15px',
//     comp: 'custom'
//   }
// ]
export default {
  mixins: [filters],
  data () {
    const infoSchema = [
      {name: 'hospitalOrgCode', label: '定点医疗机构编号:', comp: 'readonlyitem', span: 8},
      {name: 'hospitalOrgName', label: '定点医疗机构名称:', comp: 'readonlyitem', span: 8},
      {name: 'hospitalOrgCategory', label: '医疗机构类别:', comp: 'readonlyitem', span: 8, props: { formatter: this.$options.filters.hospitalOrgCategory }},
      {name: 'hospitalLevel', label: '医院等级:', comp: 'readonlyitem', span: 8, props: { formatter: this.$options.filters.hospitalLevel }},
      {name: 'hospitalFeeLevel', label: '医院收费等级:', comp: 'readonlyitem', span: 8, props: { formatter: this.$options.filters.hospitalFeeLevel }},
      {name: 'actualHospitalLevel', label: '实际医院级别:', comp: 'readonlyitem', span: 8, props: { formatter: this.$options.filters.hospitalFeeLevel }},
      {name: 'adminRegion', label: '所属地行政区代码:', comp: 'readonlyitem', span: 8}
    ]
    const infoObj = this.$ever.createObjFromSchema(infoSchema)
    // const obj = this.$ever.createObjFromSchema(schema)
    return {
      infoSchema,
      infoObj,
      // schema,
      // obj,
      loading: false
    }
  },
  created () {
    this.list()
  },
  methods: {
    list () {
      let params = {
        macId: this.macId,
        insuranceOrgId: sysqzyyCode,
        visitNumber: ''
      }
      this.loading = true
      orgInfoQuery(params).then(rs => {
        if (!rs.head.errCode) {
          this.infoObj = Object.assign(this.infoObj, rs.data.data[0])
        }
        this.loading = false
      }).catch(rj => {
        this.loading = false
      })
    },
    resetForm () {
      this.$refs.form.$refs.form.resetForm()
    }
  }
}
</script>
