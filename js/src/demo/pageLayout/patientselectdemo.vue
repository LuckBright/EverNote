<template>
  <div class="layout_inner">
    <p>患者选择组件 by lvjiangtao@everjiankang.com</p>
    <p>
      <b class="cRed">ever-patient-select</b>
    </p>
    <p>通过匹配患者手机号，患者联系人手机号，就诊卡号，患者id，患者机构编号，患者机构门诊编号，患者机构住院号，患者姓名进行搜索</p>
    <p>
      <b class="cRed">ever-patient-select-query</b>
    </p>
    <p>通过匹配患者id，患者姓名进行搜索，选择之后的结果是患者id</p>
    patientId：{{patientId}}
    <ever-patient-select-query v-model="patientId"></ever-patient-select-query>
    <hr>
    patientId1：{{patientId1}}
    <ever-patient-select v-model="patientId1" :allowCreate="false"></ever-patient-select>
    <ever-table :columns="columns" :data="tableData" :is-record-url-params="false"></ever-table>
    <hr />
    <el-row :gutter="20">
      <el-col :span="12">
        <div>
          <h4>默认使用场景</h4>
          patientObj.name： {{patientObj.name}}<br>
          searchParam：可以附加查询参数
          <ever-patient-select
            v-model="patientObj.name"
            :allowCreate="true"
            :showAttrType="true"
            :hideNo="false"
            :selectIfOnePatient="true"
            :searchParam="searchParam"
            :get-membercard-flag="true"
            :grey-denies-dialog-show="true"
            :notips="false"
            @select="setPatientObj"
            @memberdata="getMemberdata"
          ></ever-patient-select>
          <el-button @click="patientObj.name = ''">清空患者</el-button>
        </div>
        <div>
          <h4>
            :selectIfOnePatient="true"
            <br />(当内容为一条的时候默认帮用户选中)
          </h4>
          <ever-patient-select
            v-model="patientObj1.name"
            @select="setPatientObj1"
            :allowCreate="true"
            :showAttrType="true"
            :hideNo="true"
            :selectIfOnePatient="true"
            :grey-denies-dialog-show="true"
          ></ever-patient-select>
        </div>
        <div>
          <h4>
            患者选择 ever-patient-select :allowCreate="false"
            <br />(多用于搜索条件查询患者)
          </h4>
          patientObj2{{patientObj2}}
          <ever-patient-select
            v-model="patientObj2.name"
            @select="setPatientObj2"
            :allowCreate="false"
            :showAttrType="true"
            :grey-denies-dialog-show="true"
          ></ever-patient-select>
        </div>
      </el-col>
      <el-col :span="12">
        patientObj：
        <br />
        {{patientObj}}
        <hr />queryObj：
        <br />
        {{queryObj}}
        <hr />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import everPatientSelectQuery from '@/components/patientselectquery'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
import { demoTableColumnArr as columns } from '@/demo/store/config'

export default {
  data () {
    return {
      searchParam: {
        patientNumber: 'temporary'
      },
      patientId: 'lLqhwHQljkDvCsfv4VC',
      // patientId: '猪猪病人A之子',
      patientObj: {
        name: 'cmHzFXkDuieyft7iG2o'
      },
      patientObj1: {},
      patientObj2: {
        name: 'cmHzFXkDuieyft7iG2o'
      },
      queryObj: {},
      columns,
      tableData: [
        {
          id: U(),
          param: 'allowCreate',
          description: '以前的参数，是用来区分新增还是只是选择的',
          type: 'Boolean',
          required: false,
          default: 'false'
        },
        {
          id: U(),
          param: 'showAttrType',
          description: '是否显示患者的属性（标签和保险信息）',
          type: 'Boolean',
          required: false,
          default: 'false'
        },
        {
          id: U(),
          param: 'hideNo',
          description: '选中之后右侧要不要显示outpatientNumber',
          type: 'Boolean',
          required: false,
          default: 'false'
        },
        {
          id: U(),
          param: 'placeholder',
          description: '输入框默认值',
          type: 'String',
          required: false,
          default: ''
        },
        {
          id: U(),
          param: 'size',
          description: '输入框大小，默认medium mini large',
          type: 'String',
          required: false,
          default: ''
        },
        {
          id: U(),
          param: 'useText',
          description: '选中之后获取到id还是name，只在allowCreate=false时候生效',
          type: 'Boolean',
          required: false,
          default: 'false'
        },
        {
          id: U(),
          param: 'width',
          description: '输入框组件宽度',
          type: 'String',
          required: false,
          default: ''
        },
        {
          id: U(),
          param: 'storedMoney',
          description: '当日挂号页面自己造出来的参数，他们自己负责维护',
          type: 'String',
          required: false,
          default: ''
        },
        {
          id: U(),
          param: 'stafftips',
          description: 'rcm造出来的参数，判断是否是本院员工，目前的实现方式很奇葩',
          type: 'Boolean',
          required: false,
          default: 'false'
        },
        {
          id: U(),
          param: 'dialogshow',
          description: '用户受限内容弹窗',
          type: 'Boolean',
          required: false,
          default: 'false'
        },
        {
          id: U(),
          param: 'selectIfOnePatient',
          description: '如果返回内容为一条，默认帮用户选择，多用于扫描输入',
          type: 'Boolean',
          required: false,
          default: 'false'
        },
        {
          id: U(),
          param: 'get-membercard-flag',
          description: '是否需要关联出会员卡的信息',
          type: 'Boolean',
          required: false,
          default: 'false'
        },
        {
          id: U(),
          param: 'select（事件）',
          description: '监听点击选中的一行的事件',
          type: 'Function',
          required: false,
          default: ''
        },
        {
          id: U(),
          param: 'memberdata（事件）',
          description: '监听会员接口返回的数据',
          type: 'Function',
          required: false,
          default: ''
        },
        {
          id: U(),
          param: 'notips',
          description: '是否需要超过9个字。。。显示',
          type: 'Boolean',
          required: false,
          default: 'false'
        },
        {
          id: U(),
          param: 'grey-denies-dialog-show',
          description: '如果有greydenies数组，会显示一个灰名单弹窗，通过这个flag控制',
          type: 'Boolean',
          required: false,
          default: 'false'
        },
        //   props: ['value', 'placeholder', 'useText', 'queryObj', 'allowCreate', 'width', 'showAttrType', 'disabled', 'patientName', 'storedMoney', 'size', 'stafftips', 'dialogshow', 'hideNo'],
      ],
      patientId1: ''
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    list (val) {
      // console.log(val)
    },
    getMemberdata (value) {
      console.log(value, 'getmember')
    },
    setPatientObj (value) {
      console.log(value, 'setPatientObj')
      // console.log(value, 'setPatientObj')
      // this.patientObj.name = value.id
    },
    setPatientObj1 (value) {
      this.patientObj1 = value || {}
    },
    setPatientObj2 (value) {
      this.patientObj2 = value || {}
    }
  },
  components: {
    everPatientSelectQuery
  }
}
</script>
