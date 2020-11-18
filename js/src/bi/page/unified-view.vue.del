<template>
  <div class="layout_inner">
    <!-- <ever-bread-crumb :name="name" :path="$route.path"></ever-bread-crumb> -->
    <el-row>
      <el-col v-if="oneCatalogShow && twoCatalogList.length > 0">
        <el-tabs v-model="currentPage" @tab-click="activeIndexOne">
          <el-tab-pane
            v-for="(item,i) in twoCatalogList"
            v-if="$hasPermission(item.auth)"
            :label="item.name"
            :name="String(i)"
            :key="i"
          ></el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <div v-if="twoCatalogShow && threeCatalogList.length > 0">
      <el-tabs v-model="currentPage2" @tab-click="activeIndex">
        <el-tab-pane
          v-for="(item,i) in threeCatalogList"
          :label="item.name"
          :name="String(i)"
          :key="i"
        ></el-tab-pane>
      </el-tabs>
    </div>
    <div style="margin:20px 0; text-align:right;">
      <el-button v-if="btns.print">导出</el-button>
      <el-button v-if="btns.export">打印</el-button>
    </div>
    <div v-if="oneCatalogShow && twoCatalogShow" v-loading="loading">
      <iframe
        :src="infoObj.biReportUrlUser"
        frameborder="0"
        style="width: 100%;height: calc(100vh - 80px)"
      ></iframe>
    </div>
  </div>
</template>
<script>
import { obj } from '../router/htmlformation'
import api from '@/bi/store/reportsetapi'
import urlMap from '@/systemset/urls'
import { request } from '@/util/req'

export default {
  data () {
    return {
      obj,
      api,
      name: '',
      oneCatalogShow: true,
      twoCatalogShow: true,
      isEdit: true,
      biroute: this.$route.params.biroute,
      isgroup: false,
      currentPage: '0',
      currentPage2: '0',
      btns: {
        print: false,
        export: false
      },
      twoCatalogList: [],
      threeCatalogList: [],
      infoObj: {},
      loading: false
    }
  },
  created () {
    this.initCatalog()
  },
  methods: {
    initCatalog () {
      let oneCatalog = this.obj[this.$route.params.biroute]
      let code = ''
      if (!oneCatalog) return
      this.name = oneCatalog.name
      if (oneCatalog.children.length > 0) {
        this.twoCatalogList = oneCatalog.children
        if (this.twoCatalogList[0]['children'].length > 0) {
          this.threeCatalogList = oneCatalog.children[0]['children']
          code = this.threeCatalogList[0]['code']
          this.initBtns(this.threeCatalogList[0])
        } else {
          this.threeCatalogList = []
          code = this.twoCatalogList[0].code
          this.initBtns(this.twoCatalogList[0])
        }
      } else {
        code = oneCatalog.code
        this.twoCatalogList = []
        this.threeCatalogList = []
        this.initBtns(oneCatalog)
      }
      this.getIframeUrl(code)
    },
    initBtns (obj) {
      let initObj = {
        print: obj.btns && obj.btns.print ? this.$hasPermission(obj.btns.print) : false,
        export: obj.btns && obj.btns.export ? this.$hasPermission(obj.btns.export) : false
      }
      this.btns = initObj
      // if (obj.btns) {
      //   this.btns = Object.assign(this.btns, obj.btns)
      // } else {
      //   this.btns = Object.assign(this.btns, initObj)
      // }
    },
    activeIndexOne (tab) {
      this.loading = true
      this.currentPage = tab.index
      this.twoCatalogShow = false
      // this.currentPage2 = '0'
      setInterval(_ => {
        this.twoCatalogShow = true
      }, 300)
      let childrenList = this.twoCatalogList[tab.index]
      this.currentPage2 = '0'
      this.infoObj.biReportUrlUser = ''
      if (childrenList.children.length > 0) {
        this.threeCatalogList = childrenList.children
        this.currentPage2 = '0'
        this.getIframeUrl(this.threeCatalogList[0]['code'])
        this.initBtns(this.threeCatalogList[0])
      } else {
        this.threeCatalogList = []
        this.getIframeUrl(childrenList.code)
        this.initBtns(childrenList)
      }
    },
    activeIndex (tab) {
      this.loading = true
      this.currentPage2 = String(tab.index)
      let info = this.threeCatalogList[Number(tab.index)]
      this.initBtns(info)
      this.getIframeUrl(info.code)
    },
    async getIframeUrl (code) {
      this.loading = true
      const result = await request(urlMap.report.getByHisReportCode, { hisReportCode: code })
      if (result.head.errCode === 0 && result.data) {
        this.infoObj = result.data
        this.loading = false
      } else {
        this.$messageTips(this, 'error', '报表不存在', '提示')
      }
    }
  },
  watch: {
    '$route.params.biroute': function (val) {
      if (val) {
        this.currentPage = '0'
        this.currentPage2 = '0'
        this.biroute = val
        document.querySelector('.el-main.layout_main_wrap').scrollTop = 0
        this.twoCatalogList = []
        this.threeCatalogList = []
        this.oneCatalogShow = false
        this.twoCatalogShow = false
        setInterval(_ => {
          this.oneCatalogShow = true
          this.twoCatalogShow = true
        }, 300)
        this.infoObj.biReportUrlUser = ''
        this.initCatalog()
      }
    }
  }
}
</script>
<style scoped>
iframe {
  min-height: 200px;
}
.layout_inner /deep/ .el-tabs__header {
  margin-bottom: 0;
}
</style>
