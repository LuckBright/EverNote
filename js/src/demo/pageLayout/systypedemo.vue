<template>
  <div class="layout_inner">
    <p>值集下拉组件 by lvjiangtao@everjiankang.com</p>
    <p>针对thc系统内的值集数据提供下面的通用组件，参数如下：</p>
    <ever-table :columns="columns" :data="tableData" :is-record-url-params="false"></ever-table>
    <el-row :gutter="20">
      <el-col :span="10">
        <p>type=radio sel7:{{sel7}}</p>
        <p>
          <sys-type code="GBT.2261.2" v-model="sel7" type="radio"></sys-type>
        </p>
        <p>type=tag sel0:{{sel0}}</p>
        <p>
          <sys-type code="GBT.2261.2" v-model="sel0" size="middle" type="tag" :needTagName="true"></sys-type>
        </p>
        <p>sel1:{{sel1}}</p>
        <p>
          <sys-type code="THC_WH_OBJECT_SUB_TYPE" v-model="sel1" :multiple="true"></sys-type>
        </p>
        <hr />
        <p>sel2:{{sel2}}</p>
        <p>
          <sys-type code="GBT.2261.2" v-model="sel2" :multiple="true" :filtercodes="filterArr"></sys-type>
        </p>
        <hr />
        <p>sel3:{{sel3}}</p>
        <p>
          <sys-type code="GBT.2261.2" v-model="sel3" type="checkbox"></sys-type>
        </p>
        <hr />
        <p>sel4：{{sel4}}</p>
        <p>
          <sys-type code="THC_WH_OBJECT_TYPE" v-model="sel4" type="cascader"></sys-type>
        </p>
        <p>sel5:{{sel5}}</p>
        <p>
          <sys-type code="GBT.2261.2" v-model="sel5" :useObject="true"></sys-type>
        </p>
        <hr />
        <p>sel6:{{sel6}}</p>
        <p>
          <sys-type code="GBT.2261.2" v-model="sel6" :useObject="true" :objSimple="true"></sys-type>
        </p>
        <hr />
        <p>值集回显（后端传值会转化为string来比对）</p>
        <sys-value type="GBT.2261.2" :code="value"></sys-value><hr />
        <sys-value type="GBT.2261.2" :code="value1"></sys-value><hr />
        <sys-value type="GBT.2261.2" :code="value2"></sys-value><hr />
        <hr />
        <p>对于某些业务内非要拿到返回数据来二次处理的，我们不拦着，可以直接调用后台接口（用统一的api调用）如下：</p>
        options:{{options}}
        <hr>
        options1: {{options1}}
        <hr>
        <sys-type class="w" code="THC_WH_RYZC1" v-model="cascader1" type="cascader" use-object obj-simple @value-change="skillsTitleChange"></sys-type>
        <hr>
        <p>
          值集对应：
          THC_WH_OBJECT_SUB_TYPE：
          <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="301"></sys-value>
          <br />THC_SYS_PERSON_SEX：
          <sys-value type="GBT.2261.1" :code="1"></sys-value>
          <br />THC_PHR_DRUG_FREQUENCY：
          <sys-value type="CV06.00.228" :code="4"></sys-value>
        </p>
        <hr>
        <sys-type v-model="sex" code="GBT.2261.1" :useValue="true" :disabled="disabled"></sys-type>

      </el-col>
    </el-row>
    obj{{obj}}
    <p>校验方式请使用blur，change会导致改了值validate没监听到，样式没改过来，原因是input异步以后就会比change慢</p>
    <ever-form2 :schema="schema" v-model="obj" ref="form" :rules="rules">
    </ever-form2>
  </div>
</template>

<script>
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
import sysvalue from '@/warehouse/store/sysvalueapi'
import { getSysValueName } from '@/util/common'
import { demoTableColumnArr as columns } from '@/demo/store/config'
let schema = [
  {
    name: 'name1',
    label: '姓名',
    placeholder: '请输入姓名'
  },
  {
    name: 'career',
    span: 24,
    label: '职业',
    placeholder: '请选择职业',
    comp: 'sys-type',
    props: {
      code: 'GBT.2261.4',
    }
  },
  {
    name: 'type',
    span: 24,
    label: '分类',
    placeholder: '请选择分类blur',
    comp: 'sys-type',
    props: {
      code: 'THC_WH_OBJECT_TYPE',
      type: 'cascader',
      clearable: true
    }
  },
  {
    name: 'type1',
    span: 24,
    label: '分类',
    placeholder: '请选择分类change',
    comp: 'sys-type',
    props: {
      code: 'THC_WH_OBJECT_TYPE',
      type: 'cascader',
      clearable: true
    }
  },
  {
    name: 'type2',
    span: 24,
    label: '分类',
    placeholder: '请选择分类change',
    comp: 'sys-type',
    props: {
      code: 'THC_WH_OBJECT_TYPE',
      type: 'cascader',
      clearable: true
    }
  },
]
export default {
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      sel7: '20',
      sel0: '',
      disabled: false,
      sex: '2',
      schema,
      obj,
      rules: {
        name1: [
          { required: true, message: '请输入姓名', trigger: 'change' }
        ],
        career: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        type1: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        type2: [
          { required: true, message: '请选择', trigger: ['change', 'blur'] }
        ],
      },
      filterArr: ['23', '20'],
      sel1: '',
      sel2: [],
      sel3: [],
      sel4: [],
      val: '21',
      sel5: {},
      sel6: {},
      country: '',
      sysvalue,
      value: '10',
      value1: '10,20,21',
      value2: ['10', '20', '21'],
      options: [],
      options1: [],
      cascader1: [],
      columns,
      tableData: [
        {
          id: U(),
          param: 'type',
          description: '展示方式："",radio,checkbox,cascader,tag',
          type: 'string',
          required: false,
          default: 'select'
        },
        {
          id: U(),
          param: 'multiple',
          description: '是否多选',
          type: 'boolean',
          required: false,
          default: 'false'
        },
        {
          id: U(),
          param: 'userObject',
          description: '是否富内容',
          type: 'boolean',
          required: false,
          default: 'false'
        },
        {
          id: U(),
          param: 'objSimple',
          description: '是否精简返回值（后端字段太多）',
          type: 'boolean',
          required: false,
          default: 'false'
        },
        {
          id: U(),
          param: 'filtercodes',
          description: '返回数据二次过滤',
          type: 'Array',
          required: false,
          default: '[]'
        },
        {
          id: U(),
          param: 'needTagName',
          description: 'tag情况下只获取name还是获取obj（与type=tag配合使用）',
          type: 'Boolean',
          required: false,
          default: 'true'
        },
      ],
      level1CategoryArr: [],
      level1CategoryObj: {},
      classOptions: []
    }
  },
  async created () {
    // 通过集code和值val获取值name
    let sysname = await getSysValueName('GBT.2261.2', '10')
    console.log('---sysname---', sysname)
    // // 获取一个code对应的值集数据 release
    sysvalue.listOnce('GBT.2261.2').then(res => {
      // console.log(res, 'list full options')
    })
    // // 获取一个code对应的值集数据(过滤一些code出来), true 表示不走缓存，重新从后端请求
    sysvalue.listOnce('GBT.2261.2', ['23', '20']).then(res => {
      // console.log(res, 'list filter options2')
    })
    sysvalue.listOnce('THC_WH_OBJECT_TYPE').then(res => {
      // console.log(res, 'list full options1')
    })
    // 获取一个code对应的值集数据和值集对应的子集数据（父子值集）true 表示是否需要格式化数据结构
    sysvalue.cascade('THC_WH_OBJECT_TYPE').then(res => {
      // console.log(res, 'tree full options')
    })
    // 获取一个code对应的值集数据和值集对应的子集数据（父子值集） 可以过滤一些直接出来 true 表示是否需要格式化数据结构
    sysvalue.cascade('THC_WH_OBJECT_TYPE').then(res => {
      // console.log(res, 'tree full options')
    })
    sysvalue.cascade('THC_WH_OBJECT_TYPE', ['798']).then(res => {
      // console.log(res, 'tree filter options1')
    })
    // 下面写法必须改掉
    // sysvalue.cascade('THC_WH_OBJECT_TYPE', 'THC_WH_OBJECT_SUB_TYPE').then(options => {
    //   console.log(options, '1111111111')
    // })
    // 正确的写法如下：
    // sysvalue.cascade('THC_WH_OBJECT_TYPE').then(options => {
    //   console.log(options, '1111111111')
    // })
  },
  methods: {
    handleChange (value) {
      console.log(value)
    },
    skillsTitleChange (value) {
      console.log(value)
    },
  },
  mounted () {
  },
  components: {
  }
}
</script>
<style scoped>
textarea {
  height: 2em;
  width: 700px;
  text-indent: 0;
  background: #e6b899;
  padding: 5px;
  border-radius: 3px;
  font-size: 12px;
  margin-top: 20px;
}
</style>
