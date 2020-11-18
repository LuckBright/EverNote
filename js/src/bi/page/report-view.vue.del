<template>
  <div class="reportContainer">
    <ever-bread-crumb name="报表详细" :show-back="true" :have-return="true"></ever-bread-crumb>
    <div class="reportContent">
      <h4 style="margin-top: 0">{{hisReportName}}</h4>
      <report-view-iframe
        style="width:100%;height:100%;"
        :code="code"
        :extUrlParams="urlParam"
        :currentStyle="style"
        @getReportObj="reportFun"
      ></report-view-iframe>
      <!-- <iframe
        :src="obj.biReportUrlUser"
        frameborder="0"
        style="width: 100%;positon: relative; top: 200px;height: calc(100vh - 220px)"
      ></iframe>-->
    </div>
  </div>
</template>
<script>
import reportViewIframe from './report.view.iframe'

export default {
  props: {},
  data () {
    return {
      code: this.$route.params.code, // 'thc_rcm_jxkhbysetlledept_szw',
      urlParam: {},
      hisReportName: '',
      style: 'width:100%;height:100%;'
    }
  },
  created () {
  },
  methods: {
    reportFun (val) {
      this.hisReportName = val.hisReportName
    },
    // 特定的报表需要增加额外参数，在这枚举code
    selfParam (params) { // ZY_CPOE_BING_QU_RI_BAO ZY_CPOE_ZHU_YUAN_LIU_DONG_FEN_XI
      let codes = ['ZY_CPOE_ZHU_YUAN_LIU_DONG_FEN_XI', 'ZY_CPOE_BING_QU_RI_BAO']
      if (codes.includes(this.code)) {
        this.urlParam = Object.assign({}, this.urlParam, params)
      }
    }
  },
  components: {
    reportViewIframe
  },
  watch: {
    '$store.state.currentUser': {
      handler (val) {
        if (!val) return
        this.selfParam({name: val.displayName})
      },
      deep: true
    }
  }
}
</script>
<style scoped>
.reportContainer {
  display: flex;
  flex-direction: column;
}
.reportContainer .reportContent {
  flex: 1;
  padding: 0 20px 20px 20px;
  overflow: scroll;
}
</style>
