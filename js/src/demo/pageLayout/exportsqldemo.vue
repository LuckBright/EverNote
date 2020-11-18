<template>
  <div class="layout_inner">
    <p>导出sql文件组件 by lvjiangtao@everjiankang.com</p>
    <p><b class="cRed">ever-export-sql</b></p>
    <p>一般需要配合evertable的多选事件来使用，ever-table上绑定 @selection-change="handleSelectExport" 方法构建 selectArr 数组</p>
    <ever-table
      :columns="columns"
      :data="tableData"
      :is-record-url-params="false"
      border
    ></ever-table>
    <ever-export-sql :exp-url="expUrl" :select-arr="selectArr" :exp-params="expParams" file-prefix="值集(值)"></ever-export-sql>
  </div>
</template>
<script>
import urlMap, { prefix } from '@/systemset/urls'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
import { demoTableColumnArr as columns } from '@/demo/store/config'

export default {
  data () {
    return {
      columns,
      tableData: [
        {
          id: U(),
          param: 'expUrl',
          description: '点击导出调用的接口',
          type: 'String',
          required: true,
          default: '',
        },
        {
          id: U(),
          param: 'selectArr',
          description: '选中性导出勾选的id',
          type: 'Array',
          required: false,
          default: '',
        },
        {
          id: U(),
          param: 'expParams',
          description: '点击导出需要附加带过去的参数',
          type: 'Object',
          required: false,
          default: '',
        },
        {
          id: U(),
          param: 'filePrefix',
          description: '导出sql文件的前缀',
          type: 'String',
          required: false,
          default: '',
        },
      ],
      selectArr: [],
      expUrl: prefix.core + urlMap.sys.exportRole.url,
      expParams: {},
    }
  },
  created () {
  },
  methods: {
    // 导出值集选择列表
    handleSelectExport (data) {
      let tmpArr = []
      data.forEach(item => {
        tmpArr.push(item.id)
      })
      this.selectArr = tmpArr
    },
  },
  components: {
  }
}
</script>
