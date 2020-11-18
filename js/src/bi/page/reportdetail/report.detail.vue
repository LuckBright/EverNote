<template>
  <div>
    <template v-if="!cleanReport">
      <ever-bread-crumb v-if="showBack" name="统计分析详情" is-custom-back @back="goBack"></ever-bread-crumb>
      <div v-else class="el-page-header ever-page-header">报表详情</div>
    </template>
    <div class="layout_inner flex1 h100 iframe-container">
      <report-view-fanruan v-if="this.type === 'fanruan'" :src="src"></report-view-fanruan>
      <report-view-custom v-else-if="this.type === 'custom'" :hisSubModule="hisSubModule" :key="code" :component-name="componentName"></report-view-custom>
      <report-view-runqian v-else-if="this.type === 'runqian'" :key="code" :rqCode="code"></report-view-runqian>
    </div>
  </div>
</template>
<script>
import reportViewFanruan from './report.view.fanruan'
import reportViewCustom from './report.view.custom'
import reportViewRunqian from './report.view.runqian'
import urlMap from '@/systemset/urls'
import { request } from '@/util/req'

export default {
  props: {
    // 接受另外一种传参方式
    'reportCode': {
      type: String
    },
    // true表示只显示一张报表，把头部的信息的dom都去掉
    'cleanReport': {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      code: '',
      urlParam: {},
      hisReportName: '',
      style: 'width:100%;height:100%;',
      type: '',
      compType: '',
      loading: false,
      src: '',
      hisSubModule: 'purchase',
      componentName: '', // 有些带润乾的报表 可以直接采用写好的组件 hisReportUrl 里传 component|组件名|hacker 即可
    }
  },
  created () {
    if (this.reportCode) {
      this.getReportObj(this.reportCode)
    }
  },
  computed: {
    showBack () {
      return !this.$route.path.includes('reportform')
    }
  },
  watch: {
    'reportCode': {
      handler (val) {
        if (val) {
          this.getReportObj(val)
        }
      },
      deep: true,
      immediate: true
    },
    '$route.query.code': {
      handler (val) {
        if (val) {
          this.getReportObj(val)
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    reportFun (val) {
      this.hisReportName = val.hisReportName
    },
    async getReportObj (code) {
      if (!code) {
        return false
      }
      const result = await request(urlMap.report.getByHisReportCode, { hisReportCode: code })
      if (result.head.errCode === 0 && result.data) {
        this.handleReportData(result.data)
        this.code = code
        this.loading = false
      } else {
        this.$messageTips(this, 'error', '报表不存在', '提示')
      }
    },
    checkComponent (data) {
      if (typeof data.hisReportUrl === 'string') {
        const arr = data.hisReportUrl.split('|')
        if (arr.length && arr[0] === 'component' && arr[1]) {
          this.componentName = arr[1]
        } else {
          this.componentName = ''
        }
      }
    },
    handleReportData (reporObj) {
      // 自定义
      if (reporObj.reportUseType === 3) {
        this.checkComponent(reporObj)
        this.type = 'custom'
        // 供应链下的模块名：warehouse,sales  对应成新的 'hospitalization'，为了适配原来的逻辑和api
        this.hisSubModule = reporObj.hisSubModule.replace('warehouse,', '')
        if (this.hisSubModule === 'sales') {
          this.hisSubModule = 'hospitalization'
        } else if (this.hisSubModule === 'purchase') {
          this.hisSubModule = 'outpatient'
        }
        // 帆软
      } else if (reporObj.reportUseType === 1) {
        this.type = 'fanruan'
        this.src = reporObj.biReportUrlUser
        // 润乾
      } else if (reporObj.reportUseType === 2) {
        this.type = 'runqian'
      }
      this.loading = false
    },
    goBack () {
      if (this.$route.path.includes('/rcm/catalog')) {
        this.$router.push({ path: '/rcm/reportlist/outpatient' })
      } else if (this.$route.path.includes('/systemset/catalog')) {
        this.$router.push({ path: '/systemset/reportlist' })
      } else {
        this.$router.push({ name: 'biindex' })
      }
    }
  },
  components: {
    reportViewFanruan,
    reportViewCustom,
    reportViewRunqian
  },
}
</script>
<style scoped>
/* 表格列较多时，fixed固定列部分滚动条无法正常拖拽解决方案 */
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: auto;
  z-index: 1!important;
}
</style>
