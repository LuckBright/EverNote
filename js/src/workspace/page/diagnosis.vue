<template>
  <div class="phr-box">
    <iframe
      class="phr-iframe"
      ref="phrIframe"
      :src="this.$ever.phrIndex + '/phr/patientdetail?&fromType=crm&patientId=' + this.$route.params.patientId"
    ></iframe>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        patientId: this.$route.params.patientId
      }
    },
    components: {
    }
  }
</script>
<style scoped>
  .phr-box{
    width: 100%;
    height: calc(100vh - 345px);
  }
  .phr-iframe {
    width: 100%;
    height: calc(100vh - 345px);
    border: none;
  }
</style>
