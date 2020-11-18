<template>
  <iframe :src="surveySrc" class="survey-iframe"></iframe>
</template>
<script>
  import '@/manages/page/survey/style.less'
  export default {
    data () {
      return {
        surveySrc: '',
      }
    },
    created () {
      const surveyId = this.$route.params.surveyId
      this.surveySrc = `${this.$ever.api}/survey/response/dwsurvey.do?surveyId=${surveyId}&defaultFlag=true`
      // this.surveySrc = `http://localhost:8081/survey/response/dwsurvey.do?surveyId=${surveyId}`
    }
  }
</script>
