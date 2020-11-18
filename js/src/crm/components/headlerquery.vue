<template>
  <div id="headerquery">
    <header>
      <template v-if="modifyAvtFlag">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :http-request="postAvatar">
          <img :src="picValue | fixImgSrc">
        </el-upload>
      </template>
      <template v-if="!modifyAvtFlag">
        <img :src="picValue | fixImgSrc">
      </template>
      <el-row class="first">
        <strong>{{patientName}}</strong>
        <span v-if="patientSex === 1 " class="icon"><i class="iconfont icon-Fill1"></i></span>
        <span v-if="patientSex === 2 " class="icon"><i class="iconfont icon-Fill"></i>  </span>
        <span class="mSex">{{patientAge}}岁 | {{sn}}</span>
      </el-row>
    </header>
  </div>
</template>
<script>
  import api from '../../workspace/store/mainheaderapi'
  export default {
    data () {
      return {
        api,
        currentPage: '',
        patientId: '',
        obj: {},
        picValue: '',
        picValue1: '',
        patientID: '',
        sn: '',
        mobileValue: '',
        patientSex: '',
        patientAge: '-',
        patientName: '',
        modifyAvtFlag: false,
        selected: []
      }
    },
    created () {
      this.patientId = this.$route.params.patientId
      this.currentPage = this.$route.path
      this.getUserAvtInfo()
      this.renderMainData()
    },
    watch: {
    },
    methods: {
    }
  }
</script>
<style scoped>
</style>
