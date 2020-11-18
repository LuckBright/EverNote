<template>
  <div class="layout_inner">
    <p>省市县地区组件 by lvjiangtao@everjiankang.com</p>
    <p><b class="cRed">ever-address</b></p>
    <ever-table
      :columns="columns"
      :data="tableData"
      :is-record-url-params="false"
      border
    ></ever-table>
    <p>监听方法</p>
    <ever-table
      :columns="columns"
      :data="tableData1"
      border
    ></ever-table><hr>
    <p>demo:</p>
    tableData2{{tableData2}}
    <ever-table
      :show-index="true"
      :columns="columns1"
      :data="tableData2"
      border>
      <template slot="address" slot-scope="scope">
        <ever-address v-model="scope.row.addressString" :convertToFnt="true"></ever-address>
      </template>
    </ever-table>
    <hr>
    <el-row class="el-form" style="background:#fff">
      <el-col :span="14">
        <p>默认地址组件</p>
        {{address1}}
        <br>
        <ever-address v-model="address1"></ever-address>
        <hr>
        <ever-address v-model="address1" layout="2"></ever-address>
      </el-col>
      <el-col :span="14">
        <p>默认地址组件（不带详细地址）:showDetialAddr="false"</p>
        {{address2}}
        <br>
        <ever-address v-model="address2" :showDetialAddr="false" class="star"></ever-address>
      </el-col>
      <el-col :span="14">
        <p>默认地址组件（不带详细地址,只显示省市两级 :leve="2"）</p>
        {{address3}}
        <br>
        <ever-address v-model="address3" :level="2" :showDetialAddr="false"></ever-address>
      </el-col>
      <el-col :span="14">
        <p>默认地址组件（英文）:enMode="true"</p>
        {{address4}}
        <br>
        <ever-address v-model="address4" :enMode="true"></ever-address>
      </el-col>
      <el-col :span="14">
        <p>表单内引用方式</p>
        {{obj}}
        <br>
        <ever-form2 :schema="schema" v-model="obj" ref="form" :rules="rules">
          <template slot="address">
            <ever-address v-model="obj.address" @detail="getDetail"></ever-address>
          </template>
        </ever-form2>
      </el-col>
      <el-col :span="14">
        <p>城市数据code反查对应汉字 需要注意异步请求的写法</p>
        let _tmps = JSON.stringify({ 'addressDetail': '光熙门', 'province': '140000', 'city': '140300', 'county': '140311' })
        <br>citys.getCityName1(_tmps)
      </el-col>
      <el-col :span="14">
        <p>把地址json 转化成对应的 汉字</p>
        <p>
          <ever-address v-model="addrStr" :convertToFnt="true"></ever-address>
          <hr>
          <ever-address :value="addrStr1" :convertToFnt="true" default-empty-str="我是空值默认字符串"></ever-address>
        </p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { demoTableColumnArr as columns } from '@/demo/store/config'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
import citys from '@/util/citys'

let schema = [
  {
    name: 'myname', // name 对应表单 model 的 prop
    label: '姓名',
    comp: 'input'
  },
  {
    name: 'addr', // name 对应表单 model 的 prop
    label: '地址',
    comp: 'ever-address'
  },
  {
    name: 'address', // name 对应表单 model 的 prop
    label: '详细地址',
    comp: 'custom',
  },
  {
    name: 'addr1', // name 对应表单 model 的 prop
    label: '地址回显',
    comp: 'ever-address',
    props: {
      convertToFnt: true,
    }
  },
]

const addObj = { 'province': '140000', 'city': '140300', 'county': '140311', 'addressDetail': '光熙门' }

export default {
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.addr = JSON.stringify(addObj)
    obj.addr1 = JSON.stringify(addObj)
    return {
      columns1: [
        {
          prop: 'addressString',
          label: '地址',
          slot: 'address',
          align: 'right',
        },
      ],
      tableData2: [
        {
          id: U(),
          addressString: JSON.stringify(addObj)
        },
        {
          id: U(),
          addressString: JSON.stringify(addObj)
        },
        {
          id: U(),
          addressString: JSON.stringify(addObj)
        }
      ],
      columns,
      tableData1: [
        {
          id: U(),
          param: 'detail',
          description: '监听选中的值',
          type: 'function',
          required: false,
          default: 'function',
        },
      ],
      tableData: [
        {
          id: U(),
          param: 'value/v-model',
          description: '绑定值',
          type: 'JSON String',
          required: true,
          default: '',
        },
        {
          id: U(),
          param: 'level',
          description: '显示省市县还是省市',
          type: 'String',
          required: false,
          default: '3',
        },
        {
          id: U(),
          param: 'showDetialAddr',
          description: '显示地址',
          type: 'boolean',
          required: true,
          default: 'true',
        },
        {
          id: U(),
          param: 'enMode',
          description: '英文模式',
          type: 'boolean',
          required: false,
          default: 'false',
        },
        {
          id: U(),
          param: 'convertToFnt',
          description: '显示地址',
          type: 'boolean',
          required: true,
          default: 'true',
        },
        {
          id: U(),
          param: 'layout',
          description: '上下结构的展示方式',
          type: 'String',
          required: false,
          default: '',
        },
        {
          id: U(),
          param: 'default-empty-str',
          description: '空值的时候的默认值',
          type: 'String',
          required: false,
          default: '-',
        },
      ],
      schema,
      obj,
      rules: {},
      address1: '',
      address2: '',
      address3: '',
      address4: '',
      addrStr: JSON.stringify(addObj),
      addrStr1: '{}'
    }
  },
  async created () {
    let _tmps = JSON.stringify({ 'addressDetail': '光熙门', 'province': '140000', 'city': '140300', 'county': '140311' })
    let a = await citys.getCityName1(_tmps)
    console.log(a, 'a')
  },
  methods: {
    getDetail (value) {
      console.log('获取详细的值', value)
    },
  },
}
</script>
<style scoped>
.about {
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 3px;
  margin: 10px 0;
  padding: 10px;
  color: #777;
}
.star {
  position: relative;
}
.star::before {
  content: '*';
  color: red;
  position: absolute;
  top: 8px;
  left: -10px;
}
</style>
