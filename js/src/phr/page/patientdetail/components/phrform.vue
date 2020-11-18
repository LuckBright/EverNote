<template>
  <ever-form2 :schema="schema" v-model="obj" :rules="rules" :nosubmit="true" :all-disabled="true"></ever-form2>
</template>
<script>
import {request} from '@/util/req'
import {getMixed} from '@/util/formconverter'
export default {
  props: ['dataId', 'templateId'],
  data () {
    return {
      schema: [],
      obj: {},
      rules: {}
    }
  },
  created () {
    // 根据 dataId, templateId分别获取数据和模板
    request('thc-phr/cpoe/phrForm/getPhrFormById', {
      medicalRecordContentId: this.dataId,
      medicalRecordTemplateId: this.templateId
    }).then(result => {
      let {schema, obj, rules} = getMixed(JSON.parse(result.data.formTemplate.frontendSrcValue).element)
      this.schema = schema
      this.obj = obj
      this.rules = rules
      this.$nextTick(function () {
        this.obj = JSON.parse(result.data.formData.formData)
      })
    })
  }
}
</script>

