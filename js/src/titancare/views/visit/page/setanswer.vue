<template>
  <div class="layout_inner h">
    <el-main class="common-el common-no-border-top h">
      <iframe ref="answer" id="RMidanswer" :src="qUrl" frameborder="0" style="width:100%;height:100%;"></iframe>
    </el-main>
  </div>
</template>
<script>
import api from '@/titancare/api/visit/visitapi'
import bus from '@/util/eventbus'
import { routerArr } from './routeconfig'

export default {
  data () {
    return {
      api,
      surveyId: this.$route.params.id,
      categoryId: this.$route.params.categoryId,
      url: '',
      qUrl: '',
      sendData: {},
    }
  },
  beforeCreate () {
    bus.$on('modify', val => {
      bus.modifyData = val
    })
  },
  mounted () {
    this.sendData = bus.modifyData
  },
  created () {
    // api.getapi({ 'tenantId': `${storage.getLocalStorage('TENANTID')}` }).then(rs => {
    //   this.url = 'http://' + rs.data.fullGroupDomainName
    // })
    this.qUrl = this.$ever.host + this.$ever.surveyIndex + '/survey/answer-formwork/' + this.surveyId
    this.bindPostMessage()
  },
  methods: {
    modelpublish () {
      this.sendData.id && api.publish({
        id: this.sendData.id,
        questionId: this.sendData.questionId
      }).then(rs => {
        if (rs.errCode === 0) {
          this.$notify({
            message: '预问诊单发布成功',
            type: 'success'
          })
          this.$router.push({
            name: routerArr[Number(this.categoryId) - 1]
          })
        }
      })
    },
    bindPostMessage () {
      window.addEventListener('message', this.postMessageEvent, false)
    },
    postMessageEvent (e) {
      if (e.data.from === 'Survey' && e.data.type === 'formwork-save-success') {
        this.modelpublish()
        window.removeEventListener('message', this.postMessageEvent, false)
      }
    },
  },
  destroyed () {
    window.removeEventListener('message', this.postMessageEvent, false)
  }
}
</script>
<style scoped>
.h{
  height:100%;
}
</style>
