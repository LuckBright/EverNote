<template>
  <async-comp
    ref="comp"
    :visit-id="visitId"
    :patient-id="patientId"
    :dpt-id="dptId"
    :readonly="readonly"
    :back="back"
    @init="init"
    @success="success"
    @update="update"
  ></async-comp>
</template>

<script>
import api from '@/workspace/store/component'
import Vue from 'vue'
const asyncComp = Vue.component('async-comp', (resolve) => {
  api.getByCode().then(res => {
    if (res.data && res.data.value) {
      if (res.data.value === 'jilin') {
        require(['./jilin/index.vue'], resolve)
      } else if (res.data.value === 'beijing') {
        require(['./beijing/index.vue'], resolve)
      }
    } else {
      // 没有配置 默认加载北京西医
      require(['./beijing/index.vue'], resolve)
    }
  })
})
export default {
  props: {
    visitId: {
      type: String,
      required: true
    },
    patientId: {
      type: String,
      required: true
    },
    dptId: {
      type: String,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    back: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      path: '',
    }
  },
  methods: {
    init (val) {
      this.$emit('init', val)
    },
    success (val) {
      this.$emit('success', val)
    },
    update (val) {
      this.$emit('update', val)
    },
    add () {
      this.$refs.comp.add()
    },
    echoData () {
      this.$refs.comp.echoData()
    },
    print () {
      this.$refs.comp.print()
    }
  },
  components: {
    asyncComp
  }
}
</script>
