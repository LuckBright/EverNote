<template>
  <div class="layout_inner">
    <el-tabs v-model="activeName">
      <el-tab-pane label="应收款汇总表" name="accountReceivable">
        <report-view-iframe :code="codeObj.yshz" currentStyle="width:100%;border:0;height:calc(100vh - 180px)"></report-view-iframe>
      </el-tab-pane>
      <el-tab-pane label="应收款明细表" name="accountReceiveDetail">
        <report-view-iframe :code="codeObj.ysmx" currentStyle="width:100%;border:0;height:calc(100vh - 180px)"></report-view-iframe>
      </el-tab-pane>
      <el-tab-pane label="应收账龄分析" name="Agnalysis">
        <report-view-iframe :code="codeObj.yszl" currentStyle="width:100%;border:0;height:calc(100vh - 180px)"></report-view-iframe>
      </el-tab-pane>
      <el-tab-pane label="账单管理查询" name="billManage">
        <report-view-iframe :code="codeObj.zdgl" currentStyle="width:100%;border:0;height:calc(100vh - 180px)"></report-view-iframe>
      </el-tab-pane>
      <el-tab-pane label="账单回款记录" name="billCollection">
        <report-view-iframe :code="codeObj.zdhk" currentStyle="width:100%;border:0;height:calc(100vh - 180px)"></report-view-iframe>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import reportViewIframe from '@/bi/page/report.view.iframe'

export default {
  data () {
    return {
      activeName: 'accountReceivable',
      codeObj: {
        yshz: 'thc_rcm.yingshoukuanhuizongbiao2019-2-19', // 应收汇总表
        ysmx: 'thc_rcm.yingshoukuanmingxibiao2019-2-21', // 应收明细表
        yszl: 'thc_rcm.yingshouzhanglingfenxi2019-2-19', // 应收账龄
        zdgl: 'thc_rcm.zhangdanguanlichaxun2019-2-21', // 账单管理表
        zdhk: 'thc_rcm.zhangdanhuikuanjilu2019-2-21' // 账单回款表
      }
    }
  },
  components: {
    reportViewIframe
  }
}
</script>
