<template>
  <div :class="['common-value-box', {'empty': isEmpty(v)}]">
    {{ formatJson(JSON.stringify(v)) }}
  </div>
</template>
<script>
  import { formatJson } from './fns'

  export default {
    props: {
      v: {
        type: [ Number, String, Boolean, Array, Object, Function ],
      },
    },
    data () {
      return {}
    },
    methods: {
      formatJson (v) {
        return formatJson(v)
      },
      isEmpty (v) {
        if (v) {
          if (Array.isArray(v)) {
            if (v.length) {
              return false
            }
          } else if (typeof v === 'object') {
            return JSON.stringify(v) === '{}'
          } else {
            return false
          }
        }
        return true
      }
    },
  }
</script>
<style scoped lang="less"></style>
