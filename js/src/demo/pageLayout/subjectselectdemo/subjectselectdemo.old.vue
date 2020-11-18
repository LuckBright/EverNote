<template>
  <div class="layout_inner">
    <p>科室选择组件 by foyongbo@everjiankang.com</p>
    <p><b class="cRed">ever-subject-select</b></p>
    <ever-table
      :columns="columns"
      :data="tableData"
      :is-record-url-params="false"
      border
    ></ever-table>
    <h3>树状tree用法</h3>
    <base-subject-tree-demo></base-subject-tree-demo>
    <h3>树状tree回显用法</h3>
    <base-subject-tree-review-demo></base-subject-tree-review-demo>
    <p>若有其他需求，请联系平台组</p>
    <h3>基础用法</h3>
    <base-subject-demo></base-subject-demo>
    <hr>
    <h3>回显用法</h3>
    <base-subject-review-demo></base-subject-review-demo>
    <h3>下拉用法</h3>
    <base-subject-select-demo></base-subject-select-demo>
    <h3>下拉回显用法</h3>
    <base-subject-select-review-demo></base-subject-select-review-demo>
  </div>
</template>
<script>
import baseSubjectDemo from './basesubjectselectdemo'
import baseSubjectReviewDemo from './basesubjectselectreviewdemo'
import baseSubjectSelectDemo from './basesubjectselectselectdemo'
import baseSubjectSelectReviewDemo from './basesubjectselectselectreviewdemo'
import baseSubjectTreeDemo from './basesubjecttreedemo'
import baseSubjectTreeReviewDemo from './basesubjecttreereviewdemo'

import { demoTableColumnArr as columns } from '@/demo/store/config'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'

export default {
  components: { baseSubjectDemo, baseSubjectReviewDemo, baseSubjectSelectDemo, baseSubjectSelectReviewDemo, baseSubjectTreeDemo, baseSubjectTreeReviewDemo },
  data () {
    return {
      columns,
      tableData: [
        {
          id: U(),
          param: 'value/v-model',
          description: '绑定值',
          type: 'Array, String, Object, Number',
          required: true,
          default: '',
        },
        {
          id: U(),
          param: 'props',
          description: '？？',
          type: '？？',
          required: false,
          default: '？？',
        },
        {
          id: U(),
          param: 'isOrg',
          description: '显示机构科室还是集团科室，默认是机构科室',
          type: 'Boolean',
          required: false,
          default: 'true',
        },
        {
          id: U(),
          param: 'useOrg',
          description: '默认是集团',
          type: 'Boolean',
          required: false,
          default: 'true',
        },
        {
          id: U(),
          param: 'type',
          description: 'cascader select tree 其中cascader 是默认值',
          type: 'String',
          required: false,
          default: 'cascader',
        },
        {
          id: U(),
          param: 'multiple',
          description: '是否多选',
          type: 'Boolean',
          required: false,
          default: 'false',
        },
        {
          id: U(),
          param: 'params',
          description: '附加查询参数',
          type: 'Object',
          required: false,
          default: '{}',
        },
        {
          id: U(),
          param: 'cascaderProps',
          description: '是否多选',
          type: 'Object',
          required: false,
          default: '{checkStrictly: true,}',
        },
        {
          id: U(),
          param: 'fields',
          description: '下拉内容一行数据中的带有的key',
          type: 'Array, String',
          required: false,
          default: '[ \'id\',\'orgSubjectCode\',\'orgSubjectName\',]',
        },
        {
          id: U(),
          param: 'disabled',
          description: '是否禁用',
          type: 'Boolean',
          required: false,
          default: 'false',
        },
        {
          id: U(),
          param: 'isManage',
          description: '是否是管理员使用，默认为false，为true时，调用的接口为对内的接口',
          type: 'Boolean',
          required: false,
          default: 'false',
        },
        {
          id: U(),
          param: 'placeholder',
          description: '提示文案',
          type: 'String',
          required: false,
          default: '',
        },
        {
          id: U(),
          param: 'afterNotMatch',
          description: '如果没有查询到结果处理逻辑  // \'1\': 抛出有未匹配数据的事件  // \'2\': 直接清除未匹配的数据',
          type: 'String',
          required: false,
          default: '1',
        },
        {
          id: U(),
          param: 'useInput',
          description: '??',
          type: 'Boolean',
          required: false,
          default: 'false',
        },
      ]
    }
  }
}
</script>
