<template>
  <!-- <div v-loading="loading"> -->
  <div class="h100 alg_c f22 df" style="align-items: center;justify-content: center;">
    <div>
      <p>报表code：<span class="cRed">{{code}}</span>, 请用润乾替换，调用新的前端用新的组件替换</p>
      <p>
        <code>
          import reportiframe from '@/bi/page/reportdetail/report.detail'<br>
          &lt;reportiframe ref="reportiframe" :key="code" :reportCode="code" :cleanReport="true"&gt;&lt;/reportiframe&gt;
        </code>
      </p>
      <p>demo: src\rcm\page\income\dailySettlementCollect.vue</p>
    </div>
  </div>
    <!-- <iframe :src="src" :style="defaultStyle" frameborder="0"></iframe> -->
  <!-- </div> -->
</template>
<script>
import urlMap from '@/systemset/urls'
import { request } from '@/util/req'

export default {
  props: {
    code: [String],
    extUrlParams: [Object],
    currentStyle: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      src: '',
      defaultStyle: '',
      loading: true
    }
  },
  created () {
    if (this.currentStyle === '') {
      this.defaultStyle = 'width: 100%;border:0:height: calc(100vh - 220px)'
    } else {
      this.defaultStyle = this.currentStyle
    }
    this.renderUrl()
  },
  watch: {
    'code' (val) {
      if (val) {
        this.renderUrl()
      }
    }
  },
  methods: {
    renderUrl () {
      request(urlMap.report.getByHisReportCode, {
        hisReportCode: this.$route.params.code || this.code
      }).then(res => {
        if (res.head.errCode === 0) {
          this.src = res.data.biReportUrlUser
          if (this.extUrlParams) {
            Object.keys(this.extUrlParams).forEach(val => {
              // remark: 2020-9-2 (1010.yisheng 这种结构按照原逻辑会带上双引号，在杰创会被解析成 %221010.yisheng%22)
              // if (this.extUrlParams[val].includes('.') || this.extUrlParams[val].includes(',')) {
              //   this.src = this.src + ('&' + val + '=' + `"${this.extUrlParams[val]}"`)
              // } else {
              //   this.src = this.src + '&' + val + '=' + `${this.extUrlParams[val]}`
              // }
              this.src = this.src + '&' + val + '=' + `${this.extUrlParams[val]}`
            })
          }
          console.info(this.src, '报表地址')
          this.$emit('getReportObj', res.data)
          this.loading = false
        } else {
          this.loading = false
        }
      })
    }
  }
}
</script>
<style scoped>
iframe{background:#f1f1f1}
</style>
