<template>
  <div class="hospital_query">
    <ever-form2
      :schema="schema"
      v-model="obj"
      :gutter="20"
      :is-query="true"
      :inline="true" 
      label-position="right"
      @query="search" 
    >
    <template slot="patientId">
      <ever-patient-select
        v-model="obj.patientId"
        @select="selectPatient"
        :showAttrType="false"
      ></ever-patient-select>
    </template>
    </ever-form2>
  </div>
</template>
<script>
var schema = [
  {
    name: 'patientSn',
    label: '患者档案号',
    span: 6
  },
  {
    name: 'patientId',
    label: '患者姓名',
    span: 6,
    comp: 'custom'
  },
  {
    name: 'sex',
    label: '患者性别',
    span: 6,
    comp: 'sys-type',
    props: {
      code: 'GBT.2261.1',
      useValue: true,
      placeholder: '性别'
    }
  },
  {
    name: 'age',
    label: '患者年龄',
    span: 6,
    comp: 'inputrange',
    props: {
      placeholder: '年龄'
    }
  },
  {
    name: 'medicalSn',
    label: '住院病案号',
    span: 24
  }
]
var obj
export default {
  data () {
    // 只能输入中文，限制10个汉字
    // var inputZh = function (rule, value, callback) {
    //   var reg = /^[\u4e00-\u9fa5]{0,10}$/
    //   if (!reg.test(value)) {
    //     return callback(new Error('最多输入10个汉字'))
    //   }
    // }
    // 30个字符
    // var inputStr = function (rule, value, callback) {
    //   var reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]{0,30}$/
    //   if (!reg.test(value)) {
    //     return callback(new Error('最多输入30个字符'))
    //   }
    // }
    // 0-300的整数
    // var inputAge = function (rule, value, callback) {
    //   var reg = /^[0-9]$/
    //   if (!reg.test(value.min) || !reg.test(value.max)) {
    //     return callback(new Error('年龄必须为整数'))
    //   } else if (value.min > value.max) {
    //     return callback(new Error('最大年龄不能低于最小年龄'))
    //   }
    // }
    // var rules = {
    //   codeNum: [
    //       { required: true, trigger: 'change', validator: inputStr }
    //   ],
    //   codeName: [
    //       { required: true, trigger: 'change', validator: inputZh }
    //   ],
    //   age: [
    //       { required: true, validator: inputAge, trigger: 'change' }
    //   ]
    // }
    obj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      obj: obj
    }
  },
  methods: {
    selectPatient (val) {
      this.obj.name = val.name
    },
    search () {
      this.$emit('query', this.obj)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

