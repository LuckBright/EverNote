<template>
<div class="common-inner">
    <el-container>
      <el-header class="common-el bgc-fff">
        <div class="common-box">
          <div class="common-header h60">
            <div>
              <el-button size="small" @click="backTo">返回</el-button>
            </div>
            <div>
            </div>
          </div>
        </div>
      </el-header>
      <el-main class="common-el common-no-border-top bgc-fff h">
        <el-container class="h"
        v-loading="loading"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.4)">
          <iframe id="RMid" :src="qUrl" frameborder="0" style="width:100%;"></iframe>
        </el-container>
      </el-main>
    </el-container>
</div>
</template>
<script>
export default {
  data () {
    return {
      surveyId: this.$route.params.id,
      pageType: this.$route.params.type,
      loading: true
    }
  },
  created () {
    let _this = this
    this.$nextTick(_ => {
      document.getElementById('RMid').onload = function () {
        _this.loading = false
      }
    })
  },
  computed: {
    qUrl () {
      return this.$ever.host + this.$ever.surveyIndex + '/survey/preview/' + this.surveyId + '/1/1/1'
    }
  },
  methods: {
    backTo () {
      this.$router.push({path: `/follow/material/questionnaire/${this.pageType}`})
    }
  }
}
</script>
