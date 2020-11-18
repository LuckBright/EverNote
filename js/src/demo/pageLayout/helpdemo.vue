<template>
  <div class="layout_inner">
    <p>帮助中心飘窗drawer组件 by lvjiangtao@everjiankang.com</p>
    <p><b class="cRed">ever-help</b></p>
    <ever-table
      :columns="columns"
      :data="tableData"
      :is-record-url-params="false"
      border
    ></ever-table>
    <p><b class="cRed">使用步骤</b></p>
    <h4>1：引入第三方包(注意tag号会跟着版本迭代走)</h4>
    <code>
      "ever-comp": "git+ssh://git@gitlab.everjiankang.com:ever/ever-comp.git#v0.0.2",
    </code>
    <h4>2：入口main.js内加载组件，也可以按需加载</h4>
    <code>
      import Vue from 'vue'<br>
      import everComp from 'ever-comp'<br>
      Vue.use(everComp)<br>
    </code>
    <h4>3：引入组件，注册触发方法</h4>
    <code>
      <textarea rows="30" cols="130">
        // 初始化这三个值
        data () {
          return {
            visible: false,
            rid: '',
            helpConfig: {}
          }
        },
        // 引入组件 处理点击事件
        <ever-help ref="help" :visible.sync="visible" :rid="rid" :helpConfig="helpConfig"></ever-help><br>
        <a @click="handleHelp()">帮助中心</a>
        // 具体的处理方法
          methods: {
            handleHelp () {
              this.rid = sessionStorage.getItem('x-rid') // 当前菜单id 结合代码想办法拿到
              this.helpConfig = {
                version: 'v4.5.1',  // 系统版本号
                helpId: '1',  // 项目id 1 thc 2 私域商城 4 互联网医院后台管理
                helpIndex: baseHost.host + this.$ever.helpIndex, // 页面跳转地址的前缀
                actionUrl: {
                  widgetGet: diction.api + '/global-api/global-platform-extend/help/app/widget/get/', // 获取单条帮助内容的数据接口
                  search: diction.api + '/global-api/global-platform-extend/help/app/content/search'  // 输入内容，suggest联想内容的数据接口
                }
              }
              this.visible = true // 点击呼出帮助区域，隐藏的逻辑在组件内，不用处理
            },
          }
      </textarea>
    </code>
    <h4>tips：上述接口请求地址，请根据实际后端地址拼接好。</h4>
  </div>
</template>
<script>
import { demoTableColumnArr as columns } from '@/demo/store/config'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'

export default {
  data () {
    return {
      columns,
      tableData: [
        {
          id: U(),
          param: 'visible',
          description: '是否显示',
          type: 'Boolean',
          required: true,
          default: 'false',
        },
        {
          id: U(),
          param: 'rid',
          description: '菜单id',
          type: 'String',
          required: false,
          default: '',
        },
        {
          id: U(),
          param: 'helpConfig',
          description: '组件需要的数据',
          type: 'Object',
          required: true,
          default: '',
        },
      ],
    }
  },
  mounted () {
  },
  methods: {

  }
}
</script>
