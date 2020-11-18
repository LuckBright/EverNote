<template>
  <div>
    <ever-form2 v-if="tpl.templateId" :schema="schema" v-model="obj"
      ref="form" :span="24"  :label-width="tpl.props.labelWidth" :label-position="tpl.props.labelPosition"
      :gutter="tpl.props.gutter" :rules="rules" :nosubmit="nosubmit" :allDisabled="disabled"
      class="form remote-form">
      <template v-for="name in slotNames" :slot="name">
        <slot :name="name"></slot>
      </template>
    </ever-form2>
  </div>
</template>
<script>

import {getMixed} from '@/util/formconverter'
import formapi from '../store/api'
export default {
  props: ['schemaId', 'id', 'value', 'slotNames', 'env', 'nosubmit', 'disabled', 'changelog'],
  data () {
    return {
      schema: [],
      rules: null,
      api: formapi,
      tpl: {
        props: {}
      }
    }
  },
  created () {

  },
  computed: {
    'obj': {
      get () {
        return this.value || {}
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    validate (cb) {
      this.$refs.form.$refs.form.validate(cb)
    }
  },
  watch: {
    'env' () {
      Object.assign(this.obj, this.env)
    },
    'schemaId': {
      handler (val) {
        formapi.getTpl(val).then(result => {
          this.tpl = result
          let obj = getMixed(this.tpl.element)
          this.schema = obj.schema
          this.rules = obj.rules
          if (!Object.keys(this.obj).length) {
            this.obj = obj.obj
          }
          if (this.id !== '-1' && this.changelog) {
            formapi.getById(this.id).then(result => {
              this.obj = result.data
              this.$emit('update:id', result.id)
            })
          }
        })
      },
      immediate: true
    },
    'id': {
      handler (val) {
        if (this.id !== '-1') {
          formapi.getById(this.id).then(result => {
            this.obj = result.data
            this.$emit('update:id', result.id)
          })
        }
      },
      immediate: true
    }
  }
}
</script>
