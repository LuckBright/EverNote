<template>
  <async-comp
    ref="comp"
    :visit-id="visitId"
    :patient-id="patientId"
    :dpt-id="dptId"
    :readonly="readonly"
    :back="back"
  ></async-comp>
</template>

<script>
import api from '@/workspace/store/component'
import Vue from 'vue'
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
    tenantId: {
      type: String,
      required: true
    },
    orgId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      path: '',
    }
  },
  methods: {
  },
  components: {
  },
  created () {
    Vue.component('async-comp', (resolve) => {
      api.getByCodeAndOrgId({ code: 'HOME_PAGE_TYPE', orgId: this.orgId, tenantId: this.tenantId }).then(res => {
        if (res.data && res.data.value) {
          if (res.data.value === 'jilin') {
            require(['./jilin/phr.vue'], resolve)
          } else if (res.data.value === 'beijing') {
            require(['./beijing/phr.vue'], resolve)
          }
        } else {
          // 没有配置 默认加载西医
          require(['./beijing/phr.vue'], resolve)
        }
      })
    })
  }
}
</script>
