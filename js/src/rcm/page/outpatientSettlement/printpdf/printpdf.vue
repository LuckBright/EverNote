<template>
</template>

<script>
import { leLingPrint } from '@/rcm/store/otmdiscomponent/sdllyb-api.js'
export default {
  data () {
    return {
      pdfSrc: ''
    }
  },
  methods: {
    getPdf (id) {
      let params = { id }
      leLingPrint(params).then(res => {
        const fileId = res.data
        this.pdfSrc = this.$ever.fileUrl2 + fileId
        window.open(this.pdfSrc, '_blank')
      }).catch(err => {
        console.log('err', err)
        this.$messageTips(this, 'error', '获取结算单打印信息失败，请稍后再试')
      })
    },
  }
}
</script>
