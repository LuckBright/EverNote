<template>
  <div>
    <ever-bread-crumb name="资源管理" path="/auth/resources"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <ever-form
          :schema="schema"
          v-model="obj"
          :api="api"
          :rules="rules"
          @objsaved="afterSave" label-position="right">
        </ever-form>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '@/warehouse/store/api'
  var schema = [
    {
      name: 'name',
      label: '名称'
    }
  ]

  export default {
    data () {
      var obj = this.$ever.createObjFromSchema(schema)
      return {
        schema,
        obj: obj,
        api: api,
        rules: {
          name: [
            { required: true, message: '必填项', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      afterSave () {
        this.$router.push('/auth/resources')
      }
    },
    created () {

    }
  }
</script>
