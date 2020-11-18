<template>
  <div class="survey-box" v-loading="loading">
    <iframe
      id="iframe"
      class="survey-iframe"
      ref="surveyIframe"
      :src="this.$ever.host + this.$ever.surveyIndex + '/survey/list'"
    ></iframe>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        loading: true
      }
    },
    mounted() {
      let that = this
      document.getElementById('iframe').onload = function () {
        that.loading = false
      }
    }
  }
</script>
<style scoped>
  .survey-box{
    width: 100%;
    height: 100%;
  }
  .survey-iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
</style>
