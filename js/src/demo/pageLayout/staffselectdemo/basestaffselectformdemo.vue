<template>
  <div>
    <span>表单形式</span>
    <ever-form2 v-model="staffForm" :schema="staffSchema"></ever-form2>
    <div>
      staffForm: {{staffForm}}
    </div>
  </div>
</template>
<script>
  const staffSchema = [
    {
      name: 'doctor',
      label: '医生',
      comp: 'ever-staff-select',
      placeholder: '请选择医生',
      span: 12,
      props: {
        clearable: true,
        // 如果要使用缓存，需要使用slot方式
        // useCache: true,
        params: {
          everQueryType: 'out',
          typeCodeList: ['DOCTOR'],
        }
      },
    }
  ]
  export default {
    data () {
      const staffForm = this.$ever.createObjFromSchema(staffSchema)
      staffForm.doctor = 'adea8a8f559c418d8abfb03f8fa31c49'
      return {
        staffSchema,
        staffForm,
      }
    },

  }
</script>
