<template>
  <div>
    <p>基础表单</p>
    <el-button type="primary" @click="toggleCustomForm">切换表格的样式</el-button>
    <div class="pl20">
      <ever-form2
        :class="{'custom-form': customForm}"
        :schema="schema"
        v-model="obj"
        ref="form"
        :span="12"
        :rules="rules"
        :hideRequiredAsterisk="false"
        @submit="submitForm()"
      >
        <template slot="custom">
          <!--        <el-input placeholder="请输入问卷名称、医生等" v-model="obj.prop4">-->
          <!--          <el-button type="primary" slot="append" icon="icon iconfont icon-chaxun"></el-button>-->
          <!--        </el-input>-->
          <el-select v-model="obj.prop4" placeholder="placeholder">
            <el-option
              v-for="item in optionsList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
        <template slot="daterange">
          <ever-range-picker :start.sync="obj.start" :end.sync="obj.end"></ever-range-picker>
        </template>
        <!-- 保存按钮可以不写，用form默认的。 下面的实现方式是自定义保存按钮。 slot="default" 会替换表单默认的保存与重置按钮-->
        <!-- <template slot="default">
        <el-col>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">保存</el-button>
          </el-form-item>
        </el-col>
        </template>-->
      </ever-form2>
    </div>
  </div>
</template>

<script>
// import storage from '@/util/storage'
export default {
  data () {
    // const TOKEN = storage.getStorageByClinic('TOKEN')
    let schema = [
      {
        name: 'testText',
        label: '输入框',
        parentClass: 'ddd1111dd',
        props: {
          maxlength: 3,
          class: 'testsss'
        },
      },
      {
        name: 'testText1',
        label: '多行输入框',
        comp: 'textarea',
        parentClass: 'ddd1111dd',
        props: {
          maxlength: 5,
          class: 'testsss22',
          showWordLimit: true
        },
      },
      {
        name: 'checkboxText',
        label: '多选',
        comp: 'checkbox',
        props: {
          options: [
            {
              label: '北京',
              value: '北京'
            },
            {
              label: '上海',
              value: '上海'
            },
            {
              label: '南京南',
              value: '南京南'
            }
          ]
        },
      },
      {
        name: 'prop.propsub', // name 对应表单 model 的 prop
        label: '时间1',
        comp: 'date-picker',
        parentClass: 'ddd1111dd',
        props: {
          class: 'tests2222ss'
          // disabled: true,
        },
      },
      {
        name: 'prop.propsub', // name 对应表单 model 的 prop
        label: '时间2',
        comp: 'date-picker',
        props: {
          showformat: 'yyyy-MM-dd HH:mm',
          placeholder: '_年_月_日  _时_分',
        },
      },
      {
        name: 'timeSelTest', // name 对应表单 model 的 prop
        label: '时间选择2',
        comp: 'custom',
        props: {
          pickerOptions: {
            start: '00:25',
          },
          placeholder: '_年_月_日  _时_分',
        },
      },
      {
        name: 'prop.testInput', // name 对应表单 model 的 prop
        label: 'input限数值',
        type: 'number',
      },
      {
        name: 'textspan1',
        label: '多行文本输入框',
        span: 24, // 通过 span 控制单个field宽度
        comp: 'textarea',
        placeholder: '我是一个多行文本',
        props: {
          disabled: false,
          placeholder: '我是一个多行文本',
          // maxlength: 5,
        },
      },
      {
        name: 'textspan',
        label: '设置宽度文本框',
        span: 12, // 通过 span 控制单个field宽度
        props: { // vue 组件属性
          ref: 'prop1ref',
          placeholder: '我是一个单行文本',
          maxlength: 1,
        },
      },
      {
        comp: 'div',
        label: '占位div，可以没有label',
        style: {
          height: '36px',
        },
        span: 12,
      },
      {
        name: 'slots',
        label: '带可变slot文本框',
        comp: 'text',
        slots: [ // 组件本身带 slot 时可以使用这种方式，这种方式 slot 不能设置绑定变量
          {
            name: 'append',
            template: '<span>人民币</span>', // slot 内容，如果比较复杂建议使用 custom 类型。这里适合简单的 slot 实现。
          },
        ],
      },
      {
        name: 'systype',
        label: '值级',
        comp: 'sys-type',
        props: {
          code: 'THC_WH_PERSON_CATEGORY',
          // ,
          // useValue: true
        },
      },
      // {
      //   name: 'file1',
      //   label: '上传（返回字符串）',
      //   comp: 'uploadFile',
      //   props: {
      //     uploadApiType: 'ucloud',
      //     dataType: 1,
      //   },
      // },
      // {
      //   name: 'file2',
      //   label: '上传（返回对象）',
      //   comp: 'uploadFile',
      // },
      {
        name: 'custom',
        label: '完全自定义组件',
        comp: 'custom', // 当组件涉及事件监听，动态属性或结合指令使用时最好采用 slot
        span: 24,
      },
      {
        name: 'select',
        label: 'EverSelect',
        comp: 'ever-select',
        props: {
          options: [
            {
              id: 1,
              name: 'option1',
            },
            {
              id: 2,
              name: 'option2',
            },
          ],
        },
      },
      {
        name: 'staffType',
        label: '单选：',
        comp: 'sysSingleMulti',
        props: {
          disabled: true,
          code: 'THC_WH_PERSON_CATEGORY',
          filterable: true,
          placeholder: '单选',
          sum: 5,
        },
        span: 24,
      },
      {
        name: 'serviceLanguageList',
        label: '多选：',
        comp: 'sysSingleMulti',
        props: {
          disabled: true,
          code: 'THC_SYS_LANGUAGE',
          multiple: true,
          filterable: true,
          placeholder: '多选',
          sum: 5,
        },
        span: 24,
      },
      {
        name: 'elselect',
        label: 'EL-Select',
        comp: 'el-select',
        props: {
          options: [ // 这里为了和everselect统一 option 采用 id 代替作为值标识，name 代替 label 作为值标识。本来的 label  value 写法也同时支持
            { // 统一的格式
              id: 1,
              name: 'option1222',
            },
            {
              value: 2, // 为了说明这里支持两种格式
              label: 'option2',
            },
          ],
        },
        style: {
          width: '100%',
        },
      },
      {
        name: 'daterange',
        label: '日期区间startend',
        comp: 'custom', // daterangepicker 涉及到动态属性，用 slot 方式比较好解决动态绑定问题
      },
      {
        name: 'daterangearr',
        label: '日期区间数组格式',
        comp: 'ever-range-picker', // daterangepicker 涉及到动态属性，用 slot 方式比较好解决动态绑定问题
      },
      {
        name: 'everReadonlyItemContent',
        label: '只读内容:',
        comp: 'everReadonlyItemContent',
        props: {
          defaultField: '0',
          slotVal: '人次',
          isValLeft: true,
        },
        span: 8,
      },
    ]
    let obj = this.$ever.createObjFromSchema(schema)
    obj.prop.subprop = 123
    obj.daterangearr = []
    obj.start = '2018-01-01'
    obj.end = '2018-01-05'
    return {
      optionsList: [
        {
          value: 1,
          label: 'a',
        },
        {
          value: 2,
          label: 'b',
        },
      ],
      arr: [1, 2, 34],
      ruleForm: {
        name: '',
      },
      testRule: {
        name: [
          { required: true, message: '请输入内容', trigger: ['change'] },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: ['change'] },
        ],
      },
      schema,
      obj,
      datePicker: '',
      options: [{
        value: 'zhinan',
        name: '指南',
        children: [{
          value: 'shejiyuanze',
          name: '设计原则',
          children: [{
            value: 'yizhi',
            name: '一致',
          }, {
            value: 'fankui',
            name: '反馈',
          }, {
            value: 'xiaolv',
            name: '效率',
          }, {
            value: 'kekong',
            name: '可控',
          }],
        }],
      }],
      content: 'Edit Your Content Here!',
      rules: {
        'prop.subprop': [{ required: true, message: '数值类型', trigger: 'blur', type: 'number' }],
        'staffType': [{ required: true, message: '必填项', trigger: 'blur' }],
        'serviceLanguageList': [{ required: true, message: '必填项', trigger: 'blur' }],
        'daterangearr': [{ required: true, message: '必填项', trigger: 'blur' }],
        'slots': [{ required: true, message: '必填项', trigger: 'blur' }],
        'prop.propsub': [
          { required: true, message: '请输入必填项', trigger: 'blur' },
        ],
        'prop.testInput': [
          { required: true, message: '请输入必填项', trigger: 'blur' },
          { min: 3, message: '最少三位', trigger: 'blur' },
          { max: 5, message: '最大五位', trigger: 'blur' },
        ],
        'timeSelTest': [{ required: true, message: '必填项', trigger: 'blur' }],
        'textspan1': [{ required: true, message: '必填项', trigger: 'change' }, {
          max: 5,
          message: '不能超过5个字符',
          trigger: 'change',
        }],
      },
      customForm: false
    }
  },
  methods: {
    toggleCustomForm () {
      this.customForm = !this.customForm
    }
  }
}
</script>

<style scoped>
</style>
