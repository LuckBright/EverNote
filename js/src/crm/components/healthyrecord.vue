<template>
  <div>
    <phr-form code="YI_LIAO_BEI_JING" :patientId="patientId" :dpt-id="defaultId" :visitId="defaultId" :schemaId.sync="schemaId"></phr-form>
  </div>
</template>
<script>
  import PhrForm from '@/form/components/phrform'
  export default {
    data () {
      return {
        patientId: this.$route.params.patientId,
        defaultId: '-1',
        schemaId: ''
      }
    },
    created () {},
    components: {
      PhrForm
    }
  }
</script>
<style scoped>
</style>
