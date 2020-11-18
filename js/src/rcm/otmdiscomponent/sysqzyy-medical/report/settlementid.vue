<template>
  <div class="innerContainer">
    <ever-form2
      ref="queryForm"
      :schema="schema"
      :rules="rules"
      v-model="queryObj"
      :isQuery="true"
      :inline="true"
      @query="query"
    ></ever-form2>
    <ever-form2 :schema="showSchema" v-model="resultData" :span="8" :nosubmit="true"></ever-form2>
  </div>
</template>

<script>
import medicalOrgList from '@/rcm/otmdiscomponent/medicalorgselect.vue'
import { sysqzyyCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import { settlementIdQuery } from '@/rcm/store/otmdiscomponent/sysqzyy-api.js'
let schema = [
  {
    label: '保险类别',
    name: 'insuranceOrgId',
    comp: medicalOrgList
  },
  {
    label: '就诊流水号',
    name: 'visitNumber',
  }]
let rules = {
  visitNumber: [{
    required: true,
    message: '请填写就诊流水号',
    trigger: 'change'
  }]
}
let showSchema = [{
  label: '就诊流水ID',
  name: 'visitNumber',
  comp: 'readonlyitem'
},
{
  label: '费用结算ID',
  name: 'settlementId',
  comp: 'readonlyitem'
},
{
  label: '单据号',
  name: 'docNo',
  comp: 'readonlyitem'
}]
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
            param: this.queryObj.visitNumber
          }
          settlementIdQuery(params).then(res => {
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
<style scoped>
.innerContainer {
  width: 100%;
}
</style>
