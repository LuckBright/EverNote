<template>
  <div>
    <ever-bread-crumb name="返回" path="/manages/department" :showTitle="true"></ever-bread-crumb>
    <div class="layout_inner flex_col_1_auto">
        <!-- :isSimpleForm="true" -->
      <el-button @click="appendSchema('add')">append new schema</el-button>
      <form-template
        :multi-column="true"
        :custom-form-schemas="schemas"
        :custom-right-schema="customSchema"
        :custom-local-schema="localSchema"
        :pic-config="picConfig"
        id-key="sectionRecordId"
        :watchKeyCallback="watchKeyCallback"
        :only-read="onlyRead"
        :show-sub-title="true"
        :form-main-title="formMainTitle"
        :ever-hook="everHook"
        :classify-id="classifyId"
        source-key="templetProperties"
        :system-type-object="systemTypeObject"
        form-title="新建科室">
        <template slot="footer">
          <el-button>停用</el-button>
        </template>
      </form-template>
    </div>
  </div>
</template>

<script>
import FormTemplate from '@/manages/components/form.template'
// import api from '@/manages/page/department/deptapi'
import * as enumConfig from '@/util/warehouseconfig'
import { parserJSON } from '@/util/materilconfig'
import { debounce } from '@/util/common'
import autoClassify from '@/manages/mixin/autoclassify'
const NAME_CODE = 'SXX000116' // 科室名称
const ENCODED_CODE = 'SXX000117' // 科室编号
const TYPE_CODE = 'SXX000118' // 科室类别
const CLINICAL_TYPE_CODE = 'SXX190116000017V5Fl' // 临床类别
const PICTRUE_CODE = 'SXX18111600001KO0P' // 科室图片LOGO
const RICH_TEXT_CODE = 'SXX190618000016Kz5O' // 富文本
const schemas = [
  {
    title: '基本信息',
    schema: [NAME_CODE, ENCODED_CODE, TYPE_CODE, CLINICAL_TYPE_CODE, RICH_TEXT_CODE],
  },
  {
    title: '基本信息1',
    schema: [{ name: 'hello1', label: 'world' }],
  },
  {
    title: '基本信息2',
    schema: [{ name: 'hello2', label: 'world1' }, { name: 'ello2', label: 'world2' }],
  }
]
export default {
  components: {
    FormTemplate,
  },
  mixins: [autoClassify],
  data () {
    return {
      picConfig: [
        {
          sortPosition: 2,
          name: PICTRUE_CODE,
          label: '',
          labelWidth: '0',
          parentClass: 'alg_c',
          props: {
            tipMsg: '科室logo'
          }
        }
      ],
      customSchema: [
        { label: 'custom', name: 'custom' },
        { label: '学科科室', name: 'abcd' },
        { label: 'label2', name: 'label2' },
        { label: 'label3', name: 'label3' },
      ],
      localSchema: ['custom', 'label2'], // 本机构属性，添加schema中的name值，会在页面中始终保持可编辑状态
      everHook: {
        beforeFormCreated: this.beforeFormCreated,
        formCreated: this.formCreated,
        formUpdated: this.formUpdated
      },
      // api,
      enumConfig,
      schemas,
      onlyRead: false,
      objId: this.$route.params.id,
      systemTypeObject: enumConfig.STENCIL_TYPE[4],
      watchKeyCallback: [
        { key: 'hello1', cb: this.hello1 }
      ],
      counter: 0, // todo: delete
    }
  },
  created () {
    if (this.objId) this.onlyRead = true
    // this.schemas = JSON.parse(JSON.stringify(this.schemas)) // init [初始化数据,去除其他]
  },
  methods: {
    hello1: debounce(function () {
      this.appendSchema(arguments[0])
      console.log(11111)
    }),
    appendSchema (name) {
      // example：操作schema示例
      this.counter++
      console.log(name, '<======')
      this.schemas[1].schema.splice(1, 0, { name: `counter${this.counter}`, label: `${this.counter}` }) // 新增数据指针，导致组件初始化数据污染
    },
    formMainTitle (obj) {
      const list = [NAME_CODE]
      let str = ''
      list.map(key => {
        str += parserJSON({ data: obj.ext, property: key }) + '-'
      })
      return str.substr(0, str.length - 1)
    },
    formCreated (data) {
      // const _self = this
      // 给科室添加接口统一验证方法
      const validate = function (name, msg) {
        // const id = _self.objId
        return (rule, value, callback) => {
          if (!rule.required && !value) return callback()
          if (value === '') {
            callback(new Error(msg.emplyMsg))
          } else {
            // api.getByName({ [name]: value, id }).then(res => {
            //   res === true ? callback() : callback(new Error(msg.errorMsg))
            // })
          }
        }
      }
      const validateByName = validate('name', { emplyMsg: '请输入科室名称', errorMsg: '当前科室名称已存在，请联系管理员授权' }) // 科室
      const validateBySn = validate('sn', { emplyMsg: '请输入科室编号', errorMsg: '当前科室编号已存在，请修改科室编号' }) // 编码
      const { required: nameRequired } = data.rules[NAME_CODE] || {}
      data.rules[NAME_CODE] = [{
        required: !!nameRequired,
        validator: validateByName,
        trigger: 'blur'
      }]
      data.rules[ENCODED_CODE] = [{
        validator: validateBySn,
        trigger: 'blur'
      }]
      data.rules.custom = [{ required: true, trigger: 'blur' }]
    },
    formUpdated (data) {
      console.log(data)
      // if (data.hello1)
      // this.appendSchema()
    }
  }
}
</script>
