<template>
  <phr-appoint :patientId="patientId"></phr-appoint>
</template>
<script>
  import PhrAppoint from '@/components/phr/appointment'
  export default {
    data () {
      return {
        patientId: this.$route.params.patientId
      }
    },
    components: {
      PhrAppoint
    }
  }
</script>
<style scoped>
</style>
