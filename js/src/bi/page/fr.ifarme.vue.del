<template>
  <div class='friframe'>
    <iframe :src="url" style="width: 100%;border:0;positon: relative; top: 200px;height: calc(100vh)" id='setIframeStyle'></iframe>
  </div>
</template>
<script>
import {selectUrlMapping} from '@/rcm/store/inpatientSettlement/discount'
export default {
  props: {
    code: {
      type: String,
      required: true
    },
    postParams: {
      type: Object,
      default: function () {
        return {}
      }
    },
    urlParams: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      url: ''
    }
  },
  methods: {
    async geturl () {
      let params = {
        ...this.postParams,
        hisReportCode: this.code // 报告编码
      }
      let data = await selectUrlMapping(params)
      if (data && data.data && data.data.biReportUrl) {
        this.url = data.data.biReportUrl
        Object.keys(this.urlParams).forEach(val => {
          this.url = this.url + '&' + val + '=' + this.urlParams[val]
        })
      }
    }
  },
  created () {
    this.geturl()
  },
  $route (to, from) {
      // 对路由变化作出响应...
    this.geturl()
  }
}
</script>
<style scoped lang='scss'>
#friframe{
  .setIframeStyle  .content-container {
    overflow: inherit
  }
}
</style>
