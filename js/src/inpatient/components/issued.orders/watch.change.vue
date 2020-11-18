<template>
</template>
<script>
  function diffProp (a, b) {
    return JSON.stringify(a) !== JSON.stringify(b)
  }
  export default {
    props: {
      watchObj: {
        type: Object,
        default: {}
      },
      value: {
        type: Object,
        default: {}
      },
      pos: {
        type: Number,
        default: 0
      }
    },
    created () {
      this.oldValue = JSON.parse(JSON.stringify(this.value)) || {}
    },
    watch: {
      'value': {
        handler (val) {
          if (!val) {
            return
          }
          if (!this.oldValue) {
            this.oldValue = {}
          }
          for (let i in this.watchObj) {
            if (diffProp(val[i], this.oldValue[i])) {
              if (val[i] === undefined) {
                this.oldValue[i] = undefined
              } else {
                this.oldValue[i] = JSON.parse(JSON.stringify(val[i]))
              }
              this.watchObj[i](val, this.pos)
            }
          }
        },
        deep: true,
        immediate: true
      }
    }
  }
</script>
