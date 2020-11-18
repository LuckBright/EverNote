<template>
  <div>
    <ever-form2
      ref="queryForm"
      :schema="schema"
      :rules="rules"
      v-model="queryObj"
      :isQuery="true"
      @query="query"
      :inline="true"
    ></ever-form2>
    <ever-form2 :schema="showSchema" v-model="resultData" :span="6" :nosubmit="true"></ever-form2>
  </div>
</template>

<script>
import medicalOrgList from '@/rcm/otmdiscomponent/medicalorgselect.vue'
import { residentsSettlementQuery } from '@/rcm/store/otmdiscomponent/sysqzyy-api.js'
import { sysqzyyCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import { showSchema } from '@/rcm/otmdiscomponent/sysqzyy-medical/report/resident-settle-query.js'
let schema = [{
  label: '保险类别',
  name: 'insuranceOrgId',
  comp: medicalOrgList
},
{
  label: '医院编号',
  name: 'hospitalCode',
},
{
  label: '就诊流水号',
  name: 'visitNumber',
},
{
  label: '结算单ID',
  name: 'settlementId',
}]
let rules = {
  visitNumber: [{
    required: true,
    message: '请填写就诊流水号',
    trigger: 'change'
  }]
}
export default {
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.insuranceOrgId = sysqzyyCode
    let resultData = this.$ever.createObjFromSchema(showSchema)
    return {
      schema,
      rules,
      queryObj,
      showSchema,
      resultData
    }
  },
  methods: {
    query () {
      this.$refs.queryForm.$refs.form.validate(valid => {
        if (valid) {
          let params = {
            macId: this.macId,
            visitNumber: this.queryObj.visitNumber,
            insuranceOrgId: this.queryObj.insuranceOrgId,
            param: this.queryObj
          }
          residentsSettlementQuery(params).then(res => {
            let result = res.data && res.data.data
            this.resultData = Object.assign(this.resultData, result)
          }).catch((err) => {
            console.log('err', err)
          })
        }
      })
    }
  },
  components: {
    medicalOrgList
  }
}
</script>
