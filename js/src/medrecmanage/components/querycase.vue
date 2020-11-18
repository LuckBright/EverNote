<template>
  <div id="querycase">
    <ever-form2
      ref="box"
      :schema="schema"
      v-model="obj"
      :gutter="20"
      :rules="rules"
      :is-query="true"
      :inline="true"
      label-position="right"
      @query="query"
    >
      <template slot="name">
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
const schema = [
  {
    name: 'creatorDptName',
    label: '申请科室'
    // comp: 'ever-select',
    // props: {
    //   options: [{
    //     id: 1,
    //     name: 'option1'
    //   },
    //   {
    //     id: 2,
    //     name: 'option2'
    //   }]
    // }
  },
  {
    name: 'creatorName',
    label: '申请医生'
    // comp: 'ever-select',
    // props: {
    //   options: [{
    //     id: 1,
    //     name: 'option1'
    //   },
    //   {
    //     id: 2,
    //     name: 'option2'
    //   }]
    // }
  },
  {
    name: 'patientSn',
    label: '患者档案号',
    span: 24
  },
  {
    name: 'medicalSn',
    label: '住院号',
    span: 24
  },
  {
    name: 'name',
    label: '患者姓名',
    span: 6,
    comp: 'custom'
  }
]
let obj
export default {
  name: 'querycase',
  data () {
    // 只能输入中文，限制10个汉字
    // var inputZh = function (rule, value, callback) {
    //   var reg = /^[\u4e00-\u9fa5]{0,10}$/
    //   if (!reg.test(value)) {
    //     return callback(new Error('最多输入10个汉字'))
    //   }
    // }
    var rules = {
      // codeName: [
      //     { required: true, trigger: 'blur', validator: inputZh }
      // ]
    }
    obj = this.$ever.createObjFromSchema(schema)
    return {
      schema: schema,
      obj: obj,
      rules
    }
  },
  methods: {
    selectPatient (val) {
      this.obj.name = val.name
    },
    query (formName) {
      // this.$refs['box'].$refs['form'].validate((valid) => {
      //   if (valid) {
      //     alert('submit!')
      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
      this.$emit('query', this.obj)
    }
  }
}
</script>
<style scoped>
</style>

