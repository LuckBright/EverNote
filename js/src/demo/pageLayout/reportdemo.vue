<template>
  <div class="layout_inner">
    <p>报表渲染组件 by lvjiangtao@everjiankang.com</p>
    <p><b class="cRed">report-view-iframe</b></p>
    <ever-table :columns="columns" :data="tableData" :is-record-url-params="false"></ever-table><hr>
    <report-view-iframe :code="code" :extUrlParams="extUrlParams" currentStyle="width: 100%;border:0;height: calc(100vh - 70px)"></report-view-iframe>
  </div>
</template>

<script>
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
import reportViewIframe from '@/bi/page/report.view.iframe'
import { demoTableColumnArr as columns } from '@/demo/store/config'

export default {
  data () {
    return {
      code: 'thc_workbench_SHOU_SHU_ZHANG_DAN_HUI_ZONG_BIAO_LNN',
      extUrlParams: {
        type: 'haha',
        flag: 'balabala'
      },
      columns,
      tableData: [
        {
          id: U(),
          param: 'code',
          description: '报表code，平台会根据code拿到报表的地址',
          type: 'String',
          required: true,
          default: ''
        },
        {
          id: U(),
          param: 'extUrlParams',
          description: '业务内某些场景需要在多拼接一些参数来展示报表',
          type: 'Object',
          required: false,
          default: '{}'
        },
        {
          id: U(),
          param: 'currentStyle',
          description: '默认的iframe展示方式不合适的情况下可以自定义样式,不传会有默认样式',
          type: 'String',
          required: false,
          default: ''
        },
      ]
    }
  },
  created () {

  },
  methods: {

  },
  mounted () {
  },
  components: {
    reportViewIframe
  }
}
</script>
<style scoped>
hr{margin-bottom:50px;}
</style>
