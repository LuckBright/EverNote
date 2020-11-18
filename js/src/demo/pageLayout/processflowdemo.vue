<template>
  <div class="layout_inner">
    <p>流程审批组件 by lvjiangtao@everjiankang.com</p>
    <p><b class="cRed">approval-flows</b></p>
    <ever-table
      :columns="columns"
      :data="tableData"
      :is-record-url-params="false"
      border
    ></ever-table>
    <p>监听方法</p>
    <ever-table
      :columns="columns"
      :data="tableData1"
      border
    ></ever-table><hr>
    <approval-flows :processInstanceId="processInstanceId" @getProcessObj="getObj" @onSubmit="submitFn"></approval-flows>
  </div>
</template>
<script>
import approvalFlows from '@/message/page/approval.flows.vue'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
import { demoTableColumnArr as columns } from '@/demo/store/config'

export default {
  data () {
    return {
      processInstanceId: 'vVwelA4kLQ5rxiCmkxg',
      columns,
      tableData: [
        {
          id: U(),
          param: 'processInstanceId',
          param1: '',
          param2: '',
          description: '流程实例id',
          type: 'String',
          required: true,
          default: '',
          key: 'top'
        },
      ],
      tableData1: [
        {
          id: U(),
          param: 'getProcessObj',
          param1: '',
          param2: '',
          description: '监听流程基本数据，某些页面要展示',
          type: '',
          required: false,
          default: '',
          key: 'top'
        },
        {
          id: U(),
          param: 'onSubmit',
          param1: '',
          param2: '',
          description: '监听审批通过|驳回之后的动作',
          type: '',
          required: false,
          default: '',
          key: 'top'
        },
      ]
    }
  },
  created () {
  },
  methods: {
    // 根据状态显示不同图标
    getObj: function (val) {
      console.log(val)
    },
    // 审核通过之后的监听方法
    submitFn: function () {
      // window.location.href = ''
      // window.close()
    }
  },
  components: {
    approvalFlows
  }
}
</script>
