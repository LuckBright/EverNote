<template>
  <div class="common-demo-page">
    <common-title
      t="科室选择器"
      d="需要使用下拉框、级联选择器或者树形选择器进行科室的选择时，可以使用该组件"
    ></common-title>
    <common-demo
      t="单选用法"
      d="通过参数获取科室"
    >
      <template>
        <div class="bf bf-col">
          <div class="block">
            <span class="demo-label">下拉框单选科室</span>
            <ever-subject-select v-model="value1" type="select"></ever-subject-select>
            <common-value :v="value1"></common-value>
          </div>
          <div class="block">
            <span class="demo-label">级联选择框单选科室</span>
            <ever-subject-select v-model="value2"></ever-subject-select>
            <common-value :v="value2"></common-value>
          </div>
          <div class="block">
            <span class="demo-label">树型选择器单选科室</span>
            <ever-subject-select v-model="value3" type="tree"></ever-subject-select>
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
    &lt;span class=&quot;demo-label&quot;&gt;下拉框单选科室&lt;/span&gt;
    &lt;ever-subject-select v-model=&quot;value1&quot; type=&quot;select&quot;&gt;&lt;/ever-subject-select&gt;
  &lt;/div&gt;
  &lt;div class=&quot;block&quot;&gt;
    &lt;span class=&quot;demo-label&quot;&gt;级联选择框单选科室&lt;/span&gt;
    &lt;ever-subject-select v-model=&quot;value2&quot;&gt;&lt;/ever-subject-select&gt;
  &lt;/div&gt;
  &lt;div class=&quot;block&quot;&gt;
    &lt;span class=&quot;demo-label&quot;&gt;树型选择器单选科室&lt;/span&gt;
    &lt;ever-subject-select v-model=&quot;value3&quot; type=&quot;tree&quot;&gt;&lt;/ever-subject-select&gt;
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
      d="通过参数获取科室"
    >
      <template>
        <div class="bf bf-col">
          <div class="block">
            <span class="demo-label">下拉框多选科室</span>
            <ever-subject-select v-model="value4" type="select" multiple></ever-subject-select>
            <common-value :v="value4"></common-value>
          </div>
          <div class="block">
            <span class="demo-label">级联选择框多选科室</span>
            <ever-subject-select v-model="value5" multiple></ever-subject-select>
            <common-value :v="value5"></common-value>
          </div>
          <div class="block">
            <span class="demo-label">树型选择器多选科室</span>
            <ever-subject-select v-model="value6" type="tree" multiple></ever-subject-select>
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
    &lt;span class=&quot;demo-label&quot;&gt;下拉框多选科室&lt;/span&gt;
    &lt;ever-subject-select v-model=&quot;value4&quot; type=&quot;select&quot; multiple&gt;&lt;/ever-subject-select&gt;
  &lt;/div&gt;
  &lt;div class=&quot;block&quot;&gt;
    &lt;span class=&quot;demo-label&quot;&gt;级联选择框多选科室&lt;/span&gt;
    &lt;ever-subject-select v-model=&quot;value5&quot; multiple&gt;&lt;/ever-subject-select&gt;
  &lt;/div&gt;
  &lt;div class=&quot;block&quot;&gt;
    &lt;span class=&quot;demo-label&quot;&gt;树型选择器多选科室&lt;/span&gt;
    &lt;ever-subject-select v-model=&quot;value6&quot; type=&quot;tree&quot; multiple&gt;&lt;/ever-subject-select&gt;
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
          <ever-subject-select v-model="value7" type="tree" :props="treeProps" multiple></ever-subject-select>
          <common-value :v="value7"></common-value>
        </div>
      </template>
      <template slot="code">
        <div class="code-type">html</div>
        <pre v-highlightjs>
          <code class="html">
&lt;div class=&quot;block&quot;&gt;
  &lt;span class=&quot;demo-label&quot;&gt;树型选择器不级联&lt;/span&gt;
  &lt;ever-subject-select v-model=&quot;value7&quot; type=&quot;tree&quot; :props=&quot;treeProps&quot; multiple&gt;&lt;/ever-subject-select&gt;
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
      t="在表单中使用科室选择器"
      d="在表单中使用科室选择器，此示例展示回显用法"
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
const schema = [
  {
    // 不传任何参数：表示查询当前集团下所有可用科室
    name: 'subject',
    label: '选择科室',
    comp: 'ever-subject-select',
  },
  {
    name: 'subjects',
    label: '多选科室',
    comp: 'ever-subject-select',
    props: {
      multiple: true,
      params: {},
    },
  },
]
export default {
  data () {
    const form = this.$ever.createObjFromSchema(schema)
    form.subjects = [
      {
        'orgSubjectId': '5000.00009',
        'orgSubjectCode': '5000.00009',
        'orgSubjectName': 'AA-住院',
        'tenantSubjectCode': '5000.00009',
        'tenantSubjectName': 'AA-住院',
      },
      {
        'orgSubjectId': '5000.0001',
        'orgSubjectCode': '5000.0001',
        'orgSubjectName': '测试科室001',
        'tenantSubjectCode': '5000.0001',
        'tenantSubjectName': '测试科室001',
      },
      {
        'orgSubjectId': '5000.002',
        'orgSubjectCode': '5000.002',
        'orgSubjectName': '儿科2',
        'tenantSubjectCode': '5000.002',
        'tenantSubjectName': '儿科2',
      },
      {
        'orgSubjectId': '5000.A2.01',
        'orgSubjectCode': '5000.A2.01',
        'orgSubjectName': '新生儿科室',
        'tenantSubjectCode': '5000.A2.01',
        'tenantSubjectName': '新生儿科室',
      },
    ]
    return {
      form,
      schema,
    }
  },
}
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
      <el-link type="primary" href="http://yapi.everjiankang.com/project/12/interface/api/14679" target="_blank">
        http://yapi.everjiankang.com/project/12/interface/api/14679
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
      // 不传任何参数：表示查询当前集团下所有可用科室
      name: 'subject',
      label: '选择科室',
      comp: 'ever-subject-select',
    },
    {
      // 不传任何参数：表示查询当前集团下所有可用科室
      name: 'subjects',
      label: '多选科室',
      comp: 'ever-subject-select',
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
      form.subjects = [
        {
          'orgSubjectId': '5000.00009',
          'orgSubjectCode': '5000.00009',
          'orgSubjectName': 'AA-住院',
          'tenantSubjectCode': '5000.00009',
          'tenantSubjectName': 'AA-住院',
        },
        {
          'orgSubjectId': '5000.0001',
          'orgSubjectCode': '5000.0001',
          'orgSubjectName': '测试科室001',
          'tenantSubjectCode': '5000.0001',
          'tenantSubjectName': '测试科室001',
        },
        {
          'orgSubjectId': '5000.002',
          'orgSubjectCode': '5000.002',
          'orgSubjectName': '儿科2',
          'tenantSubjectCode': '5000.002',
          'tenantSubjectName': '儿科2',
        },
        {
          'orgSubjectId': '5000.A2.01',
          'orgSubjectCode': '5000.A2.01',
          'orgSubjectName': '新生儿科室',
          'tenantSubjectCode': '5000.A2.01',
          'tenantSubjectName': '新生儿科室',
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
