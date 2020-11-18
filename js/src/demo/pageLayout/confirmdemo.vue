<template>
  <div class="layout_inner">
    <p>删除二次确认组件 by lvjiangtao@everjiankang.com</p>
    <p><b class="cRed">ever-confirm</b></p>
    <p>表格内的删除二次提醒见表格demo</p>
    <ever-table :columns="columns" :data="tableData" :is-record-url-params="false"></ever-table><hr>
    <hr>
    <ever-confirm
      ref="confirm1"
      :msg="'确定删除 '+name+' ？'"
      action="删除"
      @confirm="handleDelete()"
    ></ever-confirm>
    <hr>
    <ever-confirm
      ref="confirm2"
      :msg="'您确定要删除吗？'"
      @confirm="handleDelete()">
      <template slot="reference">
        <i class="editicon iconfont icon-sales-cuowu"></i>
      </template>
    </ever-confirm>
  </div>
</template>

<script>
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
import { demoTableColumnArr as columns } from '@/demo/store/config'

export default {
  data () {
    return {
      name: '该条数据',
      columns,
      tableData: [
        {
          id: U(),
          param: 'msg',
          description: '拼接出自己想要在弹窗内显示的文案',
          type: 'String',
          required: true,
          default: ''
        },
        {
          id: U(),
          param: 'confirm',
          description: '弹窗内"确定"执行的方法',
          type: 'function',
          required: true,
          default: 'function'
        },
        {
          id: U(),
          param: 'reference',
          description: '点击图标，文字等元素，可以通过这个slot传入的方式',
          type: 'slot',
          required: false,
          default: ''
        },
      ]
    }
  },
  created () {

  },
  methods: {
    handleDelete () {

    }
  },
  mounted () {
  },
  components: {

  }
}
</script>
<style scoped>
hr {
  margin-bottom: 50px;
}
</style>
