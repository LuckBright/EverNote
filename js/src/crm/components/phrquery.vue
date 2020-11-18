<template>
  <div>
      <ever-form2 :schema="querySchema" v-model="queryObj" @query="list(true)" :inline="true" :is-query="true"></ever-form2>
  </div>
</template>
<script>
export default {
  data () {
    let querySchema = [
      {
        name: 'patientId',
        comp: 'ever-patient-select',
        props: {
          placeholder: '按姓名/病案号检索'
        }
      }
    ]
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      // api
      querySchema,
      queryObj
    }
  }
}
</script>

