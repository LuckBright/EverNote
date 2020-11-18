<template>
  <div class="layout_inner">
  testagePicker{{testagePicker}}
    <age-picker
      v-model="testagePicker"
      border
      :key="agePickerKey"
      :year-text="'年'"
      :show-day="true"
      :show-hour="true"
      ></age-picker>
    <el-popconfirm
      confirmButtonText='好的'
      cancelButtonText='不用了'
      icon="el-icon-info"
      iconColor="red"
      title="这是一段内容确定删除吗？"
    >
      <el-button slot="reference">删除</el-button>
    </el-popconfirm>
    <el-button @click="testurl()">测试</el-button>
    <div>
      <h4>input验证规则测试</h4>
      <el-form :model="ruleForm" :rules="testRule" ref="ruleForm">
        <el-form-item label="验证" prop="name">
          <el-input v-model="ruleForm.name" type="number" :autofocus="true" @change="change"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="add">加值</el-button>
          <el-button type="primary" @click="submit('ruleForm')">验证</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="panel-body">
      <pre style="float:right;margin: 50px 200px 0 0">{{obj}}
      </pre>
      <div style="width: 80%; padding: 50px">
        <h4>查询表单</h4>
        <ever-form2
          :schema="schema"
          v-model="obj"
          ref="form"
          :inline="true"
          :rules="rules"
          :is-query="true"
          v-ever-bind-enter
          @query="list(true)"
        >
          <template slot="prop4">
            <el-input placeholder="请输入问卷名称、医生等" v-model="obj.prop4">
              <el-button type="primary" slot="append" icon="icon iconfont icon-chaxun"></el-button>
            </el-input>
          </template>

          <template slot="timeSelTest">
            <el-time-select v-model="obj.taskTime" :picker-options="{}"></el-time-select>
          </template>
          <template slot="default">
            <el-form-item>
              <el-button type="primary" @click="list(true)">查询</el-button>
            </el-form-item>
            <el-form-item class="fr">
              <el-button type="primary">添加会员</el-button>
            </el-form-item>
          </template>
        </ever-form2>
        <br />
        <br />
        <br />
        <br />
        <h4>新增，编辑表单</h4>
        <!-- 这里没有指定 api 属性，一般情况下可以指定 form 对应的 api 实现表单的加载与保存-->
        <ever-form2
          :schema="schema"
          v-model="obj"
          ref="form"
          :span="12"
          :rules="rules"
          @submit="submitForm()"
        >
          <template slot="custom">
            <el-input placeholder="请输入问卷名称、医生等" v-model="obj.prop4">
              <el-button type="primary" slot="append" icon="icon iconfont icon-chaxun"></el-button>
            </el-input>
          </template>
          <template slot="daterange">
            <ever-range-picker :start.sync="obj.start" :end.sync="obj.end" startPlaceholder="dddddddddddddd"></ever-range-picker>
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
        <!-- <iphone ref="iphone" :data="callData" :hideicon="false"></iphone> -->
      </div>
    </div>
    <tree-test></tree-test>
  </div>
</template>
<script>
import form from '../util/form'
import list from '@/util/list'
// import storage from '@/util/storage'
// import iphone from '@/crm/page/iphone.vue'
import * as validate from '@/util/validate.js'
import './demo-style.less'
// import { presrciptionPrintConfig } from '@/inpatient/store/prescriptionprintconfig.js'
// import uuid from 'uuid/v1'
import {GENERATE_UUID as U} from '@/bi/util/reportsetuuid'
import { dateDiff } from '@/util/common'
import treeTest from './pageLayout/treetest'
import agePicker from '@/components/agepicker'

var pickerOptions = {
  disabledDate (time) {
    return time.getTime() < Date.now() - 8.64e7
  }
}
export default {
  mixins: [form, list],
  data () {
    /*
      name, label, comp, span 是我们自己定义的参数名
      其余参数见 https://cn.vuejs.org/v2/guide/render-function.html#深入-data-对象
    */
    // const $ever = this.$ever
    // const TOKEN = storage.getStorageByClinic('TOKEN')
    // 关于日期组件，关于placeholder叠加了各种逻辑，已经有些弄不清楚了。
    // 分析了现在的现象 有下面逻辑，date-picker组件（ever封装的)传placeholder不好使
    // rangeSeparator: '~',
    // startPlaceholder: '开始日期```',
    // endPlaceholder: '结束日期1111', 三个属性是好使的。
    // 如果原生 el-date-picker (comp:'date') 上面四个属性都是好使的。
    // 有点混乱，需要有个明确的逻辑之后再整理现在的代码。
    let schema = [
      {
        name: 'validDateStart',
        label: '生效日期自',
        comp: 'date-picker',
        span: 6,
        props: {
          outformat: 'yyyy-MM-dd',
          pickerOptions: pickerOptions,
          placeholder: '大爷的，传了也不好使'
        }
      },
      {
        name: 'dateplaceholdertest',
        label: '测试日期',
        span: 8,
        comp: 'date-picker',
        props: {
          type: 'daterange',
          rangeSeparator: '~',
          startPlaceholder: '开始日期```',
          endPlaceholder: '结束日期1111',
        }
      },
      {
        name: 'dateplaceholdertest1',
        label: '测试日期1',
        span: 8,
        comp: 'date',
        props: {
          type: 'daterange',
          rangeSeparator: '~',
          startPlaceholder: '开始日期```',
          endPlaceholder: '结束日期1111',
        }
      },
      {
        name: 'dateplaceholdertest2',
        label: '测试日期2',
        span: 8,
        comp: 'date',
      },
      {
        name: 'mobiletest',
        label: '手机号',
        span: 4,
      },
      {
        name: 'mobile',
        label: '手机号1',
        props: {
          placeholder: '请输入手机号',
          maxlength: 11
        },
        newRow: true
      },
      {
        name: 'testText',
        label: '输入框',
        props: {
          maxlength: 3
        }
      },
      {
        name: 'testText1',
        label: '多行输入框',
        comp: 'textarea',
        props: {
          maxlength: 5
        }
      },
      {
        name: 'prop.propsub', // name 对应表单 model 的 prop
        label: '时间1',
        comp: 'date-picker',
        props: {
          disabled: true
        }
      },
      {
        name: 'prop.propsub2', // name 对应表单 model 的 prop
        label: '时间2pla',
        comp: 'date-picker',
        props: {
          showformat: 'yyyy-MM-dd HH:mm',
          placeholder: '我是个placeholder'
        }
      },
      {
        name: 'prop.propsub1', // name 对应表单 model 的 prop
        label: '时间2无pla',
        comp: 'date-picker',
        props: {
          showformat: 'yyyy-MM-dd HH:mm',
          // placeholder: '_年_月_日  _时_分'
        }
      },
      {
        name: 'timeSelTest', // name 对应表单 model 的 prop
        label: '时间选择2',
        comp: 'custom',
        props: {
          pickerOptions: {
            start: '00:25'
          },
          placeholder: '_年_月_日  _时_分'
        }
      },
      {
        name: 'prop.propsub3', // name 对应表单 model 的 prop
        label: 'input限数值',
        type: 'number'
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
          maxlength: 5
        }
      },
      {
        name: 'textspan',
        label: '设置宽度文本框',
        span: 12, // 通过 span 控制单个field宽度
        props: { // vue 组件属性
          ref: 'prop1ref',
          placeholder: '我是一个单行文本',
          maxlength: 1
        }
      },
      {
        comp: 'div',
        label: '占位div，可以没有label',
        style: {
          height: '36px'
        },
        span: 12
      },
      {
        name: 'slots',
        label: '带可变slot文本框',
        comp: 'text',
        slots: [ // 组件本身带 slot 时可以使用这种方式，这种方式 slot 不能设置绑定变量
          {
            name: 'append',
            template: '<span>人民币</span>' // slot 内容，如果比较复杂建议使用 custom 类型。这里适合简单的 slot 实现。
          }
        ]
      },
      {
        name: 'systype',
        label: '值级',
        comp: 'sys-type',
        props: {
          code: 'THC_WH_PERSON_CATEGORY'
          // ,
          // useValue: true
        }
      },
      {
        name: 'custom',
        label: '完全自定义组件',
        comp: 'custom', // 当组件涉及事件监听，动态属性或结合指令使用时最好采用 slot
        span: 24
      },
      {
        name: 'select111',
        label: '测试多选',
        comp: 'select',
        props: {
          multiple: true,
          options: [{
            value: '选项1',
            label: '黄金糕'
          }, {
            value: '选项2',
            label: '双皮奶'
          }, {
            value: '选项3',
            label: '蚵仔煎'
          }, {
            value: '选项4',
            label: '龙须面'
          }, {
            value: '选项5',
            label: '北京烤鸭'
          }]
        }
      },
      {
        name: 'select',
        label: 'EverSelect',
        comp: 'ever-select',
        props: {
          options: [{
            id: 1,
            name: 'option1'
          },
          {
            id: 2,
            name: 'option2'
          }]
        }
      },
      {
        name: 'staffType',
        label: '单选：',
        comp: 'sysSingleMulti',
        props: {
          // disabled: true,
          code: 'THC_WH_PERSON_CATEGORY',
          filterable: true,
          placeholder: '单选',
          sum: 5
        },
        span: 24
      },
      {
        name: 'serviceLanguageList',
        label: '多选：',
        comp: 'sysSingleMulti',
        props: {
          // disabled: true,
          code: 'THC_SYS_LANGUAGE',
          multiple: true,
          filterable: true,
          placeholder: '多选',
          sum: 5
        },
        span: 24
      },
      {
        name: 'elselect',
        label: 'EL-Select',
        comp: 'el-select',
        props: {
          options: [ // 这里为了和everselect统一 option 采用 id 代替作为值标识，name 代替 label 作为值标识。本来的 label  value 写法也同时支持
            { // 统一的格式
              id: 1,
              name: 'option1222'
            },
            {
              value: 2, // 为了说明这里支持两种格式
              label: 'option2'
            }
          ]
        },
        style: {
          width: '100%'
        }
      },
      {
        name: 'daterange',
        label: '日期区间startend',
        comp: 'custom' // daterangepicker 涉及到动态属性，用 slot 方式比较好解决动态绑定问题
      },
      {
        name: 'daterangearr',
        label: '日期区间数组格式',
        comp: 'ever-range-picker' // daterangepicker 涉及到动态属性，用 slot 方式比较好解决动态绑定问题
      },
      {
        name: 'everReadonlyItemContent',
        label: '只读内容:',
        comp: 'everReadonlyItemContent',
        props: {
          defaultField: '0',
          slotVal: '人次',
          isValLeft: true
        },
        span: 8
      }
    ]
    let obj = this.$ever.createObjFromSchema(schema)
    // obj.prop.subprop = 123
    obj.daterangearr = []
    obj.start = '2018-01-01'
    obj.end = '2018-01-05'
    return {
      agePickerKey: U(),
      testagePicker: {},
      src: 'DMLxYwAu08Gg61RhRdf',
      // callData: {
      //   mobile: 13245478987,
      //   patientName: '张三',
      //   patientId: '111111111111111'
      // },
      arr: [1, 2, 34],
      ruleForm: {
        name: ''
      },
      testRule: {
        name: [
          { required: true, message: '请输入内容', trigger: ['change'] },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: ['change'] }
        ]
      },
      schema,
      obj,
      options: [{
        value: 'zhinan',
        name: '指南',
        children: [{
          value: 'shejiyuanze',
          name: '设计原则',
          children: [{
            value: 'yizhi',
            name: '一致'
          }, {
            value: 'fankui',
            name: '反馈'
          }, {
            value: 'xiaolv',
            name: '效率'
          }, {
            value: 'kekong',
            name: '可控'
          }]
        }]
      }],
      content: 'Edit Your Content Here!',
      rules: {
        'mobiletest': [{ required: false, validator: validate.validatePhone, trigger: 'change' }],
        'prop.subprop': [{ required: true, message: '数值类型', trigger: 'blur', type: 'number' }],
        'staffType': [{ required: true, message: '必填项', trigger: 'blur' }],
        'serviceLanguageList': [{ required: true, message: '必填项', trigger: 'blur' }],
        'daterangearr': [{ required: true, message: '必填项', trigger: 'blur' }],
        'slots': [{ required: true, message: '必填项', trigger: 'blur' }],
        'prop.propsub': [{ required: true, message: '请输入必填项', trigger: 'blur' }],
        'timeSelTest': [{ required: true, message: '必填项', trigger: 'blur' }],
        'textspan1': [{ required: true, message: '必填项', trigger: 'blur' }]
      },
      GLOBALURL: ''
    }
  },
  methods: {
    openReportDialog () {
      // isPrint参数是判断检查表格是否显示打印 默认不显示
      // appendBody参数是弹窗套弹窗显示有问题时传true
      this.$refs.reportCard.openDialog({
        patientId: '', // 必传 患者id  默认this.$route.query.patientId
        serviceType: '', // 800(检查)  801(检验) 802(治疗) --- 字符串格式  默认 801
        serviceId: '', // 必传
        executeId: '', // 执行单id
        code: '', // 执行单code  第三方回传的报告会用这个code
      }, true) // 第二个参数是 bool 是判断是否显示报告解读
    },
    testurl () {
      window.location.href = this.$ever.crmIndex + 'crm/feedbackhandle?id='
    },
    add () {
      // this.ruleForm.name = ''
    },
    change () {
      console.log('触发change事件')
    },
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('验证通过')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  created () {
    // this.$messageTips(this, 'error', '这是一条不会自动关闭的消息2xxx11222332323xxx11222332323xxx11222332323', '提示', 25000000)
    // this.GLOBALURL = localStorage.getItem('GLOBALURL')
    // console.log(this.$ever.fileUrl, 'his.$ever.fileUrl')
    // console.log(this.GLOBALURL, 'GLOBALURL')
    var time = '2011-03-11 18:12:10'
    // // console.log(dateDiff(time, new Date().getTime()))
    console.log(dateDiff(time))
    // // console.log(dateDiff(time, 'years', true))
    // var a = this.$moment(time)
    // var b = this.$moment(new Date())
    console.log(this.$moment().diff(time), 'dddddddddd')
    console.log(this.$moment().diff(time, 'years'), 'dddddddddd111')
    console.log(this.$moment().diff(time, 'months'), 'dddddddddd')
    console.log(this.$moment().diff(time, 'days'), 'dddddddddd')
    console.log(this.$moment().diff(time, 'hours'), 'dddddddddd')
    // console.log(a.diff(b, 'years', true), 'ddddd')
    // 计算时间差距
    // let time = '2018-08-08 10:10:10'
    // let time1 = '2018-05-09 10:11:10'
    // // console.log(this.dateDiff1(time, time1))
    // var a = this.$moment('2019-09-17 18:12:10')
    // var b = this.$moment(new Date())
    // console.log(b.diff(a, 'days'))
    // console.log(a.diff(b, 'DD/MM/YYYY', true))
    // var m1 = this.$moment('2015-12-18 10:00:20')
    // var m2 = this.$moment('2017-12-18 10:10:00')
    // var du = this.$moment(m2 - m1).format('DD天 H小时m分s秒')
    // console.log(du)
    // console.log(this.$moment)
    // console.log(validate.validateMobile('13222222222'), '111')
    // console.log(this.$validate.validatePhone, '2222')
    // console.log(this.$validate.validatePassConfirm(this, '1111', '2222', function () { }))
    // console.log(this.$filters.formatToFinacial(0.01))
    // console.log(this.$filters.formatToFinacial(0.0026))
    // console.log(this.$filters.fixImgSrc(''))
    // console.log(this.$filters.formatDateByExp('2015-05-05 10:11:12', 'YYYY-MM-DD'))
    // api.diction.formatDate(this.verifyDate)
    // console.log(this.obj, this.schema)
  },
  components: {
    // iphone,
    treeTest,
    agePicker
  }
}
</script>
