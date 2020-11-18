<template>
  <div style="padding: 50px" v-if="tpl">
    <h4
      v-if="tpl.title && tpl.title.template_name"
      :style="'text-align:' + tpl.title.align"
    >{{tpl.title.template_name}}</h4>
    <ever-form2
      :schema="schema"
      v-model="obj"
      ref="form"
      :span="24"
      :rules="rules"
      label-width="150px"
      class="form"
    ></ever-form2>
  </div>
</template>
<script>
import { getMixed, createSchema } from '@/util/formconverter'
export default {
  data () {
    console.log(this.$route.params.formid)
    import('./' + this.$route.params.formid).then(tpl => {
      let obj = getMixed(tpl.element)
      this.schema = obj.schema
      this.rules = obj.rules
      this.obj = obj.obj
      this.tpl = tpl
    })
    return {
      schema: null,
      obj: null,
      rules: null,
      tpl: null
    }
  },
  methods: {
  },
  created () { },
  watch: {
    'obj': {
      handler (newVal) {
        let schema = createSchema(this.tpl.element)
        this.schema = schema.filter(v => {
          if (v.expression) {
            return v.expression(newVal)
          }
          return true
        })
      },
      deep: true
    }
  }
}
</script>
<style scoped>
body #app {
  min-width: 1px !important;
  width: 100% !important;
}
.form /deep/ .el-form-item__label {
  font-weight: bold;
}
</style>
