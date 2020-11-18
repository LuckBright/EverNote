<template>
  <div class="layout_inner">
    <el-row>
      <el-col :span="24">
        <h3>使用columns进行渲染，可以单选的列表</h3>
        <pre>组件：<code>&lt;example-table&gt;</code></pre>
        <p>使用slot标签渲染复杂的组件，使用columns配置渲染简单列</p>
        <example-table></example-table>
        <hr>
        <h3>使用columns进行渲染带多选的列表</h3>
        <pre>组件：<code>&lt;multiple-table&gt;</code></pre>
        <p>即使是复杂的内容也可以用columns的配置进行渲染，比如按钮组，比如内容的格式化</p>
        <multiple-table></multiple-table>
        <hr>
<!--        <h3>使用slot和columns配合进行渲染</h3>-->
<!--        <pre>组件：<code>&lt;slot-table&gt;</code></pre>-->
<!--        <p>使用slot标签渲染复杂的组件，使用columns配置渲染简单列</p>-->
<!--        <slot-table></slot-table>-->
<!--        <hr>-->
<!--        <h3>使用slot和columns配合进行渲染，可以使用拖拽修改列的显示顺序</h3>-->
<!--        <pre>组件：<code>&lt;drag-table&gt;</code></pre>-->
<!--        <p>拖拽改变列的显示顺序</p>-->
<!--        <drag-table></drag-table>-->
        <h3>较为复杂的表格，可以配置表格的一些参数</h3>
        <pre>组件：<code>&lt;config-table&gt;</code></pre>
        <p>拖拽改变列的显示顺序，格式化单元格，配置表格参数</p>
        <config-table></config-table>
        <hr>
<!--        <h3>可以请求远程数据第表格，不再向组件传数据，而是传参数和url</h3>-->
<!--        <pre>组件：<code>&lt;remote-table&gt;</code></pre>-->
<!--        <p>向ever-table传url和params，可以自动获取远程数据，满足一般的表格需求</p>-->
<!--        <remote-table></remote-table>-->
<!--        <hr>-->
<!--        <h3>多个表格在同一页面时</h3>-->
<!--        <pre>组件：<code>&lt;many-table&gt;</code></pre>-->
<!--        <p>多个表格在同一页面，且通过多个表单作为查询条件，使用浏览器记录不同的查询条件</p>-->
<!--        <router-link to="/demo/layout/evertabledemo/manytable">跳转到多表格的页面</router-link>-->
<!--        <hr>-->
<!--        <h3>动态切换插槽表格</h3>-->
<!--        <pre>组件：<code>&lt;slot-change-table&gt;</code></pre>-->
<!--        <slot-change-table></slot-change-table>-->
        <hr>
        <h3>只写插槽内容的表格</h3>
        <pre>组件：<code>&lt;slot-content-table&gt;</code></pre>
        <p>支持只写插槽内容，不用写el-table-column标签的插槽</p>
        <slot-content-table></slot-content-table>
        <h3>树表格</h3>
        <pre>组件：<code>&lt;tree-table&gt;</code></pre>
        <p>树状数据</p>
        <tree-table></tree-table>
<!--        <h3>自动查询数据表格</h3>-->
<!--        <pre>组件：<code>&lt;search-auto-table&gt;</code></pre>-->
<!--        <p>-->
<!--          点击进入：<router-link class="cp" to="/demo/layout/evertabledemo/searchautotable">自动查询数据表格</router-link>-->
<!--        </p>-->
<!--        <ul>-->
<!--          <li>1. 初始化页面时会根据浏览器参数给表单赋值</li>-->
<!--          <li>2. 初始化页面时进行一次查询，若浏览器地址没有参数，则会查第一页，否则根据参数查询</li>-->
<!--          <li>3. 改变查询条件之后，立刻进行查询，且查询的是第一页</li>-->
<!--          <li>4. 刷新页面时保持查询所有条件</li>-->
<!--        </ul>-->
<!--        <h3>手动查询数据表格</h3>-->
<!--        <pre>组件：<code>&lt;search-manual-table&gt;</code></pre>-->
<!--        <p>点击进入：<router-link class="cp" to="/demo/layout/evertabledemo/searchmanualtable">手动查询数据表格</router-link></p>-->
<!--        <p>与自动查询表格只有一点差异，即改变查询条件之后，不立即查询，需要点击查询按钮【，或者在任意输入框内按下enter键】</p>-->
<!--        <h3>使用mixin实现上述两种查询</h3>-->
<!--        <pre>组件：<code>&lt;search-mixin-table&gt;</code></pre>-->
<!--        <p>点击进入：<router-link class="cp" to="/demo/layout/evertabledemo/searchmixintable">使用mixin实现上述两种查询</router-link></p>-->
<!--        <p><span class="danger">【推荐】</span>使用mixin，少写点代码，如果mixin不能实现，则在组件内增加定制化代码</p>-->
<!--        <hr>-->
        <h3>【强烈推荐使用该版本】简单的表格查询</h3>
        <pre>组件：<code>&lt;search-simple-table&gt;</code></pre>
        <p>点击进入：<router-link class="cp" to="/demo/layout/evertabledemo/searchsimpletable">使用简单方式实现表格的查询</router-link></p>
        <hr>
        <h3>弹出框表格查询</h3>
        <pre>组件：<code>&lt;search-simple-dialog-table&gt;</code></pre>
        <p>点击进入：<router-link class="cp" to="/demo/layout/evertabledemo/searchsimpledialogtable">实现弹出框的表格的查询</router-link></p>
<!--        <hr>-->
<!--        <h3>ever表格模板，真实使用场景案例</h3>-->
<!--        <p>案例1：<a :href="this.$ever.crmIndex + '/crm/service'" target="_blank">客服工作站-服务看板</a></p>-->
<!--        <p>案例2：<a :href="this.$ever.crmIndex + '/crm/packagesalelist'" target="_blank">客服工作站-套餐下单-个人下单</a></p>-->
        <hr>
<!--        以下是文档部分-->
        <ever-table-doc></ever-table-doc>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import multipleTable from './demo/multipletable.vue'
  import slotTable from './demo/slottable.vue'
  import exampleTable from './demo/exampletable.vue'
  import dragTable from './demo/dragtable.vue'
  import configTable from './demo/configtable.vue'
  import remoteTable from './demo/remotetable.vue'
  import slotChangeTable from './demo/slotchangetable'
  import slotContentTable from './demo/slotcontenttable'
  import treeTable from './demo/treetable.vue'
  import everTableDoc from './demo/evertabledoc.vue'

  export default {
    components: {
      multipleTable,
      slotTable,
      exampleTable,
      dragTable,
      configTable,
      remoteTable,
      slotChangeTable,
      slotContentTable,
      treeTable,
      everTableDoc,
    },
    data () {
      return {
      }
    }
  }
</script>
<style lang="less">
  hr {
    margin: 30px 0;
  }
  .danger {
    color: darkred;
  }
</style>

