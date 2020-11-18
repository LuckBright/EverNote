<template>
  <div class="common-demo-page">
    <common-title
      t="机构选择器"
      d="需要使用下拉框、级联选择器或者树形选择器进行机构的选择时，可以使用该组件"
    ></common-title>
    <common-demo
      t="单选用法"
      d="通过参数获取机构"
    >
      <template>
        <div class="bf bf-col">
          <div class="block">
            <span class="demo-label">下拉框单选机构</span>
            <ever-org-select v-model="value1" type="select"></ever-org-select>
            <common-value :v="value1"></common-value>
          </div>
          <div class="block">
            <span class="demo-label">级联选择框单选机构</span>
            <ever-org-select v-model="value2"></ever-org-select>
            <common-value :v="value2"></common-value>
          </div>
          <div class="block">
            <span class="demo-label">树型选择器单选机构</span>
            <ever-org-select v-model="value3" type="tree"></ever-org-select>
            <common-value :v="value3"></common-value>
          </div>
        </div>
      </template>
      <template slot="code">
        <div class="code-type">html</div>
        <pre v-highlightjs>
          <code class="html">
&lt;div class=&quot;bf bf-col&quot;&gt;
  &lt;div class=&quot;block&quot;&gt;
    &lt;span class=&quot;demo-label&quot;&gt;下拉框单选机构&lt;/span&gt;
    &lt;ever-org-select v-model=&quot;value1&quot; type=&quot;select&quot;&gt;&lt;/ever-org-select&gt;
  &lt;/div&gt;
  &lt;div class=&quot;block&quot;&gt;
    &lt;span class=&quot;demo-label&quot;&gt;级联选择框单选机构&lt;/span&gt;
    &lt;ever-org-select v-model=&quot;value2&quot;&gt;&lt;/ever-org-select&gt;
  &lt;/div&gt;
  &lt;div class=&quot;block&quot;&gt;
    &lt;span class=&quot;demo-label&quot;&gt;树型选择器单选机构&lt;/span&gt;
    &lt;ever-org-select v-model=&quot;value3&quot; type=&quot;tree&quot;&gt;&lt;/ever-org-select&gt;
  &lt;/div&gt;
&lt;/div&gt;
          </code>
        </pre>
        <div class="code-type">js</div>
        <pre v-highlightjs>
          <code class="javascript">
  export default {
    data () {
      return {
        value1: '',
        value2: [],
        value3: [],
      }
    },
  }
          </code>
        </pre>
      </template>
    </common-demo>
    <common-demo
      t="多选用法"
      d="通过参数获取机构"
    >
      <template>
        <div class="bf bf-col">
          <div class="block">
            <span class="demo-label">下拉框多选机构</span>
            <ever-org-select v-model="value4" type="select" multiple></ever-org-select>
            <common-value :v="value4"></common-value>
          </div>
          <div class="block">
            <span class="demo-label">级联选择框多选机构</span>
            <ever-org-select v-model="value5" multiple></ever-org-select>
            <common-value :v="value5"></common-value>
          </div>
          <div class="block">
            <span class="demo-label">树型选择器多选机构</span>
            <ever-org-select v-model="value6" type="tree" multiple></ever-org-select>
            <common-value :v="value6"></common-value>
          </div>
        </div>
      </template>
      <template slot="code">
        <div class="code-type">html</div>
        <pre v-highlightjs>
          <code class="html">
&lt;div class=&quot;bf bf-col&quot;&gt;
  &lt;div class=&quot;block&quot;&gt;
    &lt;span class=&quot;demo-label&quot;&gt;下拉框多选机构&lt;/span&gt;
    &lt;ever-org-select v-model=&quot;value4&quot; type=&quot;select&quot; multiple&gt;&lt;/ever-org-select&gt;
  &lt;/div&gt;
  &lt;div class=&quot;block&quot;&gt;
    &lt;span class=&quot;demo-label&quot;&gt;级联选择框多选机构&lt;/span&gt;
    &lt;ever-org-select v-model=&quot;value5&quot; multiple&gt;&lt;/ever-org-select&gt;
  &lt;/div&gt;
  &lt;div class=&quot;block&quot;&gt;
    &lt;span class=&quot;demo-label&quot;&gt;树型选择器多选机构&lt;/span&gt;
    &lt;ever-org-select v-model=&quot;value6&quot; type=&quot;tree&quot; multiple&gt;&lt;/ever-org-select&gt;
  &lt;/div&gt;
&lt;/div&gt;
          </code>
        </pre>
        <div class="code-type">js</div>
        <pre v-highlightjs>
          <code class="javascript">
  export default {
    data () {
      return {
        value4: [],
        value5: [],
        value6: [],
      }
    },
  }
          </code>
        </pre>
      </template>
    </common-demo>
    <common-demo
      t="树型选择器不级联"
      d="使用树形选择器时，期望上下级不级联选择"
    >
      <template>
        <div class="block">
          <span class="demo-label">树型选择器不级联</span>
          <ever-org-select v-model="value7" type="tree" :props="treeProps" multiple></ever-org-select>
          <common-value :v="value7"></common-value>
        </div>
      </template>
      <template slot="code">
        <div class="code-type">html</div>
        <pre v-highlightjs>
          <code class="html">
&lt;div class=&quot;block&quot;&gt;
  &lt;span class=&quot;demo-label&quot;&gt;树型选择器不级联&lt;/span&gt;
  &lt;ever-org-select v-model=&quot;value7&quot; type=&quot;tree&quot; :props=&quot;treeProps&quot; multiple&gt;&lt;/ever-org-select&gt;
&lt;/div&gt;
          </code>
        </pre>
        <div class="code-type">js</div>
        <pre v-highlightjs>
          <code class="javascript">
export default {
  data () {
    return {
      value7: [],
      treeProps: {'check-strictly': true},
    }
  },
}
          </code>
        </pre>
      </template>
    </common-demo>
    <common-demo
      t="在表单中使用机构选择器"
      d="在表单中使用机构选择器，此示例展示回显用法"
    >
      <template>
        <div class="block">
          <ever-form2
            labelWidth="150px"
            v-model="form"
            :schema="schema"
            :nosubmit="true"
          ></ever-form2>
          <common-value :v="form"></common-value>
        </div>
      </template>
      <template slot="code">
        <div class="code-type">html</div>
        <pre v-highlightjs>
          <code class="html">
&lt;div class=&quot;block&quot;&gt;
  &lt;ever-form2
    labelWidth=&quot;150px&quot;
    v-model=&quot;form&quot;
    :schema=&quot;schema&quot;
    :nosubmit=&quot;true&quot;
  &gt;&lt;/ever-form2&gt;
&lt;/div&gt;
          </code>
        </pre>
        <div class="code-type">js</div>
        <pre v-highlightjs>
          <code class="javascript">
          </code>
        </pre>
      </template>
    </common-demo>
    <h3>属性</h3>
    <ever-table
      :columns="columns"
      :data="tableData"
      :is-record-url-params="false"
    ></ever-table>
    <h3>params属性</h3>
    <p>此处只介绍几个常用属性，更多详情请参考：
      <el-link type="primary" href="http://yapi.everjiankang.com/project/12/interface/api/14649" target="_blank">
        http://yapi.everjiankang.com/project/12/interface/api/14649
      </el-link>
    </p>
    <ever-table
      :columns="columns"
      :data="paramsData"
      :is-record-url-params="false"
    ></ever-table>
  </div>
</template>
<script>
  import CommonDemo from '@/demo/component/common-demo/CommonDemo'
  import CommonTitle from '@/demo/component/common-demo/CommonTitle'
  import CommonValue from '@/demo/component/common-demo/CommonValue'
  import { demoTableColumnArr as columns } from '@/demo/store/config'
  import { tableData, paramsData } from './model'

  const schema = [
    {
      // 不传任何参数：表示查询当前集团下所有可用机构
      name: 'org',
      label: '选择机构',
      comp: 'ever-org-select',
    },
    {
      // 不传任何参数：表示查询当前集团下所有可用机构
      name: 'orgs',
      label: '多选机构',
      comp: 'ever-org-select',
      props: {
        multiple: true,
        params: {},
      },
    },
  ]
  export default {
    components: { CommonDemo, CommonTitle, CommonValue },
    data () {
      const form = this.$ever.createObjFromSchema(schema)
      form.orgs = [
        {
          'id': '5000001',
          'code': '5000001',
          'name': '尚医智信顺义空港医院',
        },
        {
          'id': '5000196',
          'code': '5000196',
          'name': '肝病分院',
        },
        {
          'id': '5000011',
          'code': '5000011',
          'name': '三零一医院',
        },
      ]
      return {
        value1: '',
        value2: [],
        value3: [],
        value4: [],
        value5: [],
        value6: [],
        value7: [],
        treeProps: { 'check-strictly': true },
        form,
        schema,
        columns,
        tableData,
        paramsData,
      }
    },
  }
</script>
