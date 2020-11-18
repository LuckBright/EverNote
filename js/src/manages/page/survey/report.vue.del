<template>
  <iframe :src="surveySrc" class="survey-iframe"></iframe>
</template>
<script>
  import '@/manages/page/survey/style.less'
  import storage from '@/util/storage'
  export default {
    data () {
      return {
        surveySrc: '',
      }
    },
    created () {
      const surveyId = this.$route.params.surveyId
      this.surveySrc = `${this.$ever.api}/survey/sy/user/survey-admin/answer.do?surveyId=${surveyId}&x-access-token=${escape(storage.getStorageByClinic('TOKEN'))}`
      console.log(this.surveySrc)
      // this.surveySrc = `http://localhost:8081/survey/sy/user/survey-admin/answer.do?surveyId=${surveyId}&x-access-token=${escape(storage.getStorageByClinic('TOKEN'))}`
    }
  }
</script>
