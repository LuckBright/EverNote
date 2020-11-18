<template>
  <el-row>
    <el-col :span="12">
      <ever-form2 ref="form" :schema="schema" :rules="rules" v-model="queryObj">
        <template slot="btns">
          <el-button type="primary" size="small" @click="legalPersonReg">法人注册</el-button>
        </template>
        <div></div>
      </ever-form2>
    </el-col>
    <el-col :span="12">
      <ever-form2 ref="form1" :schema="schema1" :rules="rules1" v-model="queryObj1">
        <template slot="btns">
          <el-button type="primary" size="small" @click="hospitalProtocolSign">医院协议签署</el-button>
        </template>
        <div></div>
      </ever-form2>
    </el-col>
  </el-row>
</template>

<script>
import { legalPersonRegister, hospitalProtocolSign } from '@/rcm/store/otmdiscomponent/hlj-api.js'
import { hljybCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
const schema = [{
  label: '身份证号：',
  name: 'idCard',
},
{
  label: '法人姓名：',
  name: 'name',
},
{
  label: '联系电话：',
  name: 'phone',
},
{
  label: '登录密码：',
  name: 'passWord',
},
{
  label: '',
  name: 'btns',
  comp: 'custom'
}]
let rules = {
  idCard: [{
    required: true,
    message: '请填写身份证号',
    trigger: 'change'
  }],
  name: [{
    required: true,
    message: '请填写法人姓名',
    trigger: 'change'
  }],
  phone: [{
    required: true,
    message: '请填写联系电话',
    trigger: 'change'
  }],
  passWord: [{
    required: true,
    message: '请填写登录密码',
    trigger: 'change'
  }]
}
const schema1 = [
  {
    label: '年度',
    name: 'year',
    comp: 'el-date-picker',
    props: {
      type: 'year',
      autoWidth: true
    }
  },
  {
    label: '操作员编号',
    name: 'operatorNo',
  },
  {
    label: '注册操作员密码',
    name: 'passWord',
  },
  {
    label: '',
    name: 'btns',
    comp: 'custom'
  },
]
const rules1 = {
  year: [{
    required: true,
    message: '请填写年份',
    trigger: 'change'
  }],
  operatorNo: [{
    required: true,
    message: '请填写操作员编号',
    trigger: 'change'
  }],
  passWord: [{
    required: true,
    message: '请填写注册操作员密码',
    trigger: 'change'
  }]
}
export default {
  data () {
    const queryObj = this.$ever.createObjFromSchema(schema)
    const queryObj1 = this.$ever.createObjFromSchema(schema1)
    return {
      schema,
      rules,
      queryObj,
      schema1,
      rules1,
      queryObj1,
      hljybCode
    }
  },
  methods: {
    legalPersonReg () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          let params = {
            ...this.queryObj,
            macId: this.macId,
            insuranceOrgId: this.hljybCode
          }
          legalPersonRegister(params).then(res => {
            this.$messageTips(this, 'success', '操作成功')
            this.queryObj1.operatorNo = res.data && res.data.code
          }).catch((err) => {
            console.log('err', err)
          })
        }
      })
    },
    hospitalProtocolSign () {
      this.$refs.form1.$refs.form.validate(valid => {
        if (valid) {
          const params = {
            ...this.queryObj1,
            hosFlag: 1,
            flag: 1,
            macId: this.macId,
            insuranceOrgId: this.hljybCode,
            year: this.queryObj1.year && this.$moment(this.queryObj1.year).format('YYYY')
          }
          hospitalProtocolSign(params).then(res => {
            this.$messageTips(this, 'success', '操作成功')
          }).catch((err) => {
            console.log('err', err)
          })
        }
      })
    }
  },
}
</script>
