<template>
  <div class="common-demo-page">
    <!--    文章标题-->
    <common-title
      t="人员选择器"
      d="需要使用下拉框选择人员时使用"
    ></common-title>
    <!--    小标题 + 示例-->
    <common-demo
      t="基础用法"
      d="通过参数获取人员"
    >
      <template>
        <div class="bf bf-2">
          <div class="block">
            <span class="demo-label">单选人员</span>
            <ever-staff-select v-model="value1"></ever-staff-select>
            <common-value :v="value1"></common-value>
          </div>
          <div class="block">
            <span class="demo-label">多选人员</span>
            <ever-staff-select v-model="value2" multiple></ever-staff-select>
            <common-value :v="value2"></common-value>
          </div>
        </div>
      </template>
      <template slot="code">
        <div class="code-type">html</div>
        <pre v-highlightjs>
          <code class="html">
&lt;div class=&quot;block&quot;&gt;
  &lt;span class=&quot;demo-label&quot;&gt;单选人员&lt;/span&gt;
  &lt;ever-staff-select v-model=&quot;value1&quot;&gt;&lt;/ever-staff-select&gt;
&lt;/div&gt;
&lt;div class=&quot;block&quot;&gt;
  &lt;span class=&quot;demo-label&quot;&gt;多选人员&lt;/span&gt;
  &lt;ever-staff-select v-model=&quot;value2&quot; multiple&gt;&lt;/ever-staff-select&gt;
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
    }
  },
}
          </code>
        </pre>
      </template>
    </common-demo>
    <common-demo
      t="回显用法"
      d="需要回显时使用，此示例展示查询参数的用法。注：此例使用的id为编写此代码时存在的数据，未来数据有变化时，可能无法显示"
    >
      <template>
        <div class="bf bf-2">
          <div class="block">
            <span class="demo-label">单选医生回显</span>
            <ever-staff-select v-model="value3" :params="params3"></ever-staff-select>
            <common-value :v="value3"></common-value>
          </div>
          <div class="block">
            <span class="demo-label">多选护士回显</span>
            <ever-staff-select v-model="value4" :params="params4" multiple></ever-staff-select>
            <common-value :v="value4"></common-value>
          </div>
        </div>
      </template>
      <template slot="code">
        <div class="code-type">html</div>
        <pre v-highlightjs>
          <code class="html">
&lt;div class=&quot;bf&quot;&gt;
  &lt;div class=&quot;block&quot;&gt;
    &lt;span class=&quot;demo-label&quot;&gt;单选医生回显&lt;/span&gt;
    &lt;ever-staff-select v-model=&quot;value3&quot; :params=&quot;params3&quot;&gt;&lt;/ever-staff-select&gt;
  &lt;/div&gt;
  &lt;div class=&quot;block&quot;&gt;
    &lt;span class=&quot;demo-label&quot;&gt;多选护士回显&lt;/span&gt;
    &lt;ever-staff-select v-model=&quot;value4&quot; :params=&quot;params4&quot; multiple&gt;&lt;/ever-staff-select&gt;
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
      value3: '03263963cd5b4f85af1f11e6beb236f0',
      value4: ['03263963cd5b4f85af1f11e6beb236f0', '043528cd12be45fbb69415206fba849d'],
      params3: {
        everQueryType: 'out',
        typeCodeList: ['DOCTOR'],
      },
      params4: {
        everQueryType: 'out',
        typeCodeList: ['NURSE'],
      },
    }
  },
}
          </code>
        </pre>
      </template>
    </common-demo>
    <common-demo
      t="返回对象，或者对象数组！"
      d="选择人员之后，期望不仅仅返回的时人员id，还需要返回其他信息"
    >
      <template>
        <div class="bf bf-2">
          <div class="block">
            <span class="demo-label">单选医生返回对象</span>
            <ever-staff-select v-model="value5" :params="params5" :fields="['id', 'name']"></ever-staff-select>
            <common-value :v="value5"></common-value>
          </div>
          <div class="block">
            <span class="demo-label">多选护士返回对象</span>
            <ever-staff-select v-model="value6" :params="params6" :fields="['id', 'name']" multiple></ever-staff-select>
            <common-value :v="value6"></common-value>
          </div>
        </div>
      </template>
      <template slot="code">
        <div class="code-type">html</div>
        <pre v-highlightjs>
          <code class="html">
&lt;div class=&quot;bf&quot;&gt;
  &lt;div class=&quot;block&quot;&gt;
    &lt;span class=&quot;demo-label&quot;&gt;单选医生返回对象&lt;/span&gt;
    &lt;ever-staff-select v-model=&quot;value5&quot; :params=&quot;params5&quot; :fields=&quot;[&#x27;id&#x27;, &#x27;name&#x27;]&quot;&gt;&lt;/ever-staff-select&gt;
  &lt;/div&gt;
  &lt;div class=&quot;block&quot;&gt;
    &lt;span class=&quot;demo-label&quot;&gt;多选护士返回对象&lt;/span&gt;
    &lt;ever-staff-select v-model=&quot;value6&quot; :params=&quot;params6&quot; :fields=&quot;[&#x27;id&#x27;, &#x27;name&#x27;]&quot; multiple&gt;&lt;/ever-staff-select&gt;
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
      value5: '',
      value6: [],
      params5: {
        everQueryType: 'out',
        typeCodeList: ['DOCTOR'],
      },
      params6: {
        everQueryType: 'out',
        typeCodeList: ['NURSE'],
      },
    }
  },
}
          </code>
        </pre>
      </template>
    </common-demo>
    <common-demo
      t="返回对象，或者对象数组时进行回显"
      d="选择人员之后，期望不仅仅返回的时人员id，还需要返回其他信息，回显效果"
    >
      <template>
        <div class="bf bf-2">
          <div class="block">
            <span class="demo-label">单选医生返回对象时回显</span>
            <ever-staff-select v-model="value7" :params="params7" :fields="['id', 'name']"></ever-staff-select>
            <common-value :v="value7"></common-value>
          </div>
          <div class="block">
            <span class="demo-label">多选护士返回对象时回显</span>
            <ever-staff-select v-model="value8" :params="params8" :fields="['id', 'name']" multiple></ever-staff-select>
            <common-value :v="value8"></common-value>
          </div>
        </div>
      </template>
      <template slot="code">
        <div class="code-type">html</div>
        <pre v-highlightjs>
          <code class="html">
&lt;div class=&quot;bf&quot;&gt;
  &lt;div class=&quot;block&quot;&gt;
    &lt;span class=&quot;demo-label&quot;&gt;单选医生返回对象时回显&lt;/span&gt;
    &lt;ever-staff-select v-model=&quot;value7&quot; :params=&quot;params7&quot; :fields=&quot;[&#x27;id&#x27;, &#x27;name&#x27;]&quot;&gt;&lt;/ever-staff-select&gt;
  &lt;/div&gt;
  &lt;div class=&quot;block&quot;&gt;
    &lt;span class=&quot;demo-label&quot;&gt;多选护士返回对象时回显&lt;/span&gt;
    &lt;ever-staff-select v-model=&quot;value8&quot; :params=&quot;params8&quot; :fields=&quot;[&#x27;id&#x27;, &#x27;name&#x27;]&quot; multiple&gt;&lt;/ever-staff-select&gt;
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
      value7: {
        'id': 'e541cf740a934448b081fff4254a083a',
        'name': '赵护师5',
      },
      value8: [
        {
          'id': 'e541cf740a934448b081fff4254a083a',
          'name': '赵护师5',
        },
        {
          'id': '043528cd12be45fbb69415206fba849d',
          'name': 'liu666',
        },
      ],
      params7: {
        everQueryType: 'out',
        typeCodeList: [ 'DOCTOR' ],
      },
      params8: {
        everQueryType: 'out',
        typeCodeList: [ 'NURSE' ],
      },
    }
  },
}
          </code>
        </pre>
      </template>
    </common-demo>
    <common-demo
      t="在ever-form2表单中的使用方式"
      d="选择人员在表单中选择人员时的用法，这里模拟了异步取值的情况。"
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
    name: 'doctor',
    label: '选择医生',
    comp: 'ever-staff-select',
    props: {
      params: {
        everQueryType: 'out',
        typeCodeList: [ 'DOCTOR' ],
      },
    },
  },
  {
    name: 'doctorList',
    label: '多选医生',
    comp: 'ever-staff-select',
    props: {
      params: {
        everQueryType: 'out',
        typeCodeList: [ 'DOCTOR' ],
      },
      multiple: true,
    },
  },
  {
    name: 'nurse',
    label: '回显护士',
    comp: 'ever-staff-select',
    props: {
      params: {
        everQueryType: 'out',
        typeCodeList: [ 'NURSE' ],
      },
    },
  },
  {
    name: 'nurseList',
    label: '回显多个护士',
    comp: 'ever-staff-select',
    props: {
      params: {
        everQueryType: 'out',
        typeCodeList: [ 'NURSE' ],
      },
      multiple: true,
    },
  },
  {
    name: 'nurseObj',
    label: '回显护士对象',
    comp: 'ever-staff-select',
    props: {
      params: {
        everQueryType: 'out',
        typeCodeList: [ 'NURSE' ],
      },
      fields: ['id', 'name'],
    },
  },
  {
    name: 'nurseObjList',
    label: '回显多个护士对象',
    comp: 'ever-staff-select',
    props: {
      params: {
        everQueryType: 'out',
        typeCodeList: [ 'NURSE' ],
      },
      multiple: true,
      fields: ['id', 'name'],
    },
  },
]
export default {
  data () {
    const form = this.$ever.createObjFromSchema(schema)
    return {
      form,
      schema,
    }
  },
  created () {
    // 模拟异步情况
    setTimeout(() => {
      this.form.nurse = '4ff00393548f472389fba44050464878'
      this.form.nurseList = [ 'e541cf740a934448b081fff4254a083a', '043528cd12be45fbb69415206fba849d' ]
      this.form.nurseObj = {
        'id': 'e541cf740a934448b081fff4254a083a',
        'name': '赵护师5',
      }
      this.form.nurseObjList = [
        {
          'id': 'e541cf740a934448b081fff4254a083a',
          'name': '赵护师5',
        },
        {
          'id': '043528cd12be45fbb69415206fba849d',
          'name': 'liu666',
        },
      ]
    }, 1000)
  },
}
          </code>
        </pre>
      </template>
    </common-demo>
    <common-demo
      t="多个选择器联动的用法示例"
      d="选择机构后，以该条件查询科室并选择，以该机构和科室条件查询人员并选择。注：机构的选择范围是当前人员可登录的机构，科室为该机构下的科室对应的集团科室"
    >
      <template>
        <div class="block">
          <ever-form2
            labelWidth="170px"
            v-model="form2"
            :schema="schema2"
            :nosubmit="true"
          ></ever-form2>
          <common-value :v="form2"></common-value>
        </div>
      </template>
      <template slot="code">
        <div class="code-type">html</div>
        <pre v-highlightjs>
          <code class="html">
&lt;div class=&quot;block&quot;&gt;
  &lt;ever-form2
    labelWidth=&quot;170px&quot;
    v-model=&quot;form2&quot;
    :schema=&quot;schema2&quot;
    :nosubmit=&quot;true&quot;
  &gt;&lt;/ever-form2&gt;
&lt;/div&gt;
          </code>
        </pre>
        <div class="code-type">js</div>
        <pre v-highlightjs>
          <code class="javascript">
const schema2 = [
    {
      name: 'org',
      label: '查询登录人可登录的机构',
      comp: 'ever-org-select',
      props: {
        params: {
          everQueryType: 'isLogin',
        },
      },
    },
    {
      name: 'subject',
      label: '查询该机构下的集团科室',
      comp: 'ever-subject-select',
      props: {
        disabled: true,
        useOrg: false,
        params: {
        },
      },
    },
    {
      name: 'staff',
      label: '根据条件获取人员',
      comp: 'ever-staff-select',
      props: {
        disabled: true,
        params: {
          everQueryType: 'out'
        },
        multiple: true,
      },
    },
  ]
  export default {
    data () {
      const form2 = this.$ever.createObjFromSchema(schema2)
      return {
        form2,
        schema2,
      }
    },
    watch: {
      'form2.org': {
        handler () {
          const schemaItem = this.schema2.find(item => item.name === 'subject')
          if (this.form2.org) {
            schemaItem.props.disabled = false
            schemaItem.props.params = {...schemaItem.params, orgIdList: [this.form2.org.id]}
          } else {
            schemaItem.props.disabled = true
          }
        }
      },
      'form2.subject': {
        handler () {
          const schemaItem = this.schema2.find(item => item.name === 'staff')
          if (this.form2.subject) {
            schemaItem.props.disabled = false
            schemaItem.props.params = {...schemaItem.params, orgIdList: [this.form2.org.id], tenantSubjectIdList: [this.form2.subject.orgSubjectId]}
          } else {
            schemaItem.props.disabled = true
          }
        }
      },
    },
  }
          </code>
        </pre>
      </template>
    </common-demo>
    <!--    配置列表-->
    <h3>属性</h3>
    <ever-table
      :columns="columns"
      :data="attributeData"
      :is-record-url-params="false"
    ></ever-table>
    <h3>params 属性</h3>
    <p>此处只介绍几个常用属性，更多详情请参考：
      <el-link type="primary" href="http://yapi.everjiankang.com/project/12/interface/api/14689" target="_blank">
        http://yapi.everjiankang.com/project/12/interface/api/14689
      </el-link>
    </p>
    <ever-table
      :columns="columns"
      :data="paramsData"
      :is-record-url-params="false"
    ></ever-table>
    <h3>事件</h3>
    <ever-table
      :columns="columns"
      :data="eventData"
      :is-record-url-params="false"
    ></ever-table>
  </div>
</template>
<script>
  import CommonDemo from '@/demo/component/common-demo/CommonDemo'
  import CommonTitle from '@/demo/component/common-demo/CommonTitle'
  import CommonValue from '@/demo/component/common-demo/CommonValue'
  import { demoTableColumnArr as columns } from '@/demo/store/config'
  import { attributeData, eventData, paramsData } from '@/demo/component/common-demo/model'
  const schema = [
    {
      name: 'doctor',
      label: '选择医生',
      comp: 'ever-staff-select',
      props: {
        params: {
          everQueryType: 'out',
          typeCodeList: [ 'DOCTOR' ],
        },
      },
    },
    {
      name: 'doctorList',
      label: '多选医生',
      comp: 'ever-staff-select',
      props: {
        params: {
          everQueryType: 'out',
          typeCodeList: [ 'DOCTOR' ],
        },
        multiple: true,
      },
    },
    {
      name: 'nurse',
      label: '回显护士',
      comp: 'ever-staff-select',
      props: {
        params: {
          everQueryType: 'out',
          typeCodeList: [ 'NURSE' ],
        },
      },
    },
    {
      name: 'nurseList',
      label: '回显多个护士',
      comp: 'ever-staff-select',
      props: {
        params: {
          everQueryType: 'out',
          typeCodeList: [ 'NURSE' ],
        },
        multiple: true,
      },
    },
    {
      name: 'nurseObj',
      label: '回显护士对象',
      comp: 'ever-staff-select',
      props: {
        params: {
          everQueryType: 'out',
          typeCodeList: [ 'NURSE' ],
        },
        fields: ['id', 'name'],
      },
    },
    {
      name: 'nurseObjList',
      label: '回显多个护士对象',
      comp: 'ever-staff-select',
      props: {
        params: {
          everQueryType: 'out',
          typeCodeList: [ 'NURSE' ],
        },
        multiple: true,
        fields: ['id', 'name'],
      },
    },
  ]
  const schema2 = [
    {
      name: 'org',
      label: '查询登录人可登录的机构',
      comp: 'ever-org-select',
      props: {
        params: {
          everQueryType: 'isLogin',
        },
      },
    },
    {
      name: 'subject',
      label: '查询该机构下的集团科室',
      comp: 'ever-subject-select',
      props: {
        disabled: true,
        useOrg: false,
        params: {
        },
      },
    },
    {
      name: 'staff',
      label: '根据条件获取人员',
      comp: 'ever-staff-select',
      props: {
        disabled: true,
        params: {
          everQueryType: 'out'
        },
        multiple: true,
      },
    },
  ]
  export default {
    components: { CommonDemo, CommonTitle, CommonValue },
    data () {
      const form = this.$ever.createObjFromSchema(schema)
      const form2 = this.$ever.createObjFromSchema(schema2)
      return {
        value1: '',
        value2: [],
        value3: 'adea8a8f559c418d8abfb03f8fa31c49',
        value4: [ 'e541cf740a934448b081fff4254a083a', '043528cd12be45fbb69415206fba849d' ],
        params3: {
          everQueryType: 'out',
          typeCodeList: [ 'DOCTOR' ],
        },
        params4: {
          everQueryType: 'out',
          typeCodeList: [ 'NURSE' ],
        },
        value5: '',
        value6: [],
        params5: {
          everQueryType: 'out',
          typeCodeList: [ 'DOCTOR' ],
        },
        params6: {
          everQueryType: 'out',
          typeCodeList: [ 'NURSE' ],
        },
        value7: {
          'id': 'adea8a8f559c418d8abfb03f8fa31c49',
          'name': '财务经历zxg',
        },
        value8: [
          {
            'id': 'e541cf740a934448b081fff4254a083a',
            'name': '赵护师5',
          },
          {
            'id': '043528cd12be45fbb69415206fba849d',
            'name': 'liu666',
          },
        ],
        params7: {
          everQueryType: 'out',
          typeCodeList: [ 'DOCTOR' ],
        },
        params8: {
          everQueryType: 'out',
          typeCodeList: [ 'NURSE' ],
        },
        form,
        schema,
        form2,
        schema2,
        attributeData,
        eventData,
        paramsData,
        columns,
      }
    },
    created () {
      // 模拟异步情况
      setTimeout(() => {
        this.form.nurse = '4ff00393548f472389fba44050464878'
        this.form.nurseList = [ 'e541cf740a934448b081fff4254a083a', '043528cd12be45fbb69415206fba849d' ]
        this.form.nurseObj = {
          'id': 'e541cf740a934448b081fff4254a083a',
          'name': '赵护师5',
        }
        this.form.nurseObjList = [
          {
            'id': 'e541cf740a934448b081fff4254a083a',
            'name': '赵护师5',
          },
          {
            'id': '043528cd12be45fbb69415206fba849d',
            'name': 'liu666',
          },
        ]
      }, 1000)
    },
    watch: {
      'form2.org': {
        handler () {
          const schemaItem = this.schema2.find(item => item.name === 'subject')
          if (this.form2.org) {
            schemaItem.props.disabled = false
            schemaItem.props.params = {...schemaItem.params, orgIdList: [this.form2.org.id]}
          } else {
            schemaItem.props.disabled = true
          }
        }
      },
      'form2.subject': {
        handler () {
          const schemaItem = this.schema2.find(item => item.name === 'staff')
          if (this.form2.subject) {
            schemaItem.props.disabled = false
            schemaItem.props.params = {...schemaItem.params, orgIdList: [this.form2.org.id], tenantSubjectIdList: [this.form2.subject.orgSubjectId]}
          } else {
            schemaItem.props.disabled = true
          }
        }
      },
    },
  }
</script>
<style scoped lang="less"></style>
