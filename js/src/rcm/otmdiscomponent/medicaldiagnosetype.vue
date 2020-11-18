<template>
  <ever-select v-model="select" :options="options" :clearable="true"></ever-select>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Object],
      default: ''
    }
  },
  data () {
    return {
      options: [{id: '0', name: '入院'}, {id: '1', name: '出院'}]
    }
  },
  computed: {
    select: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
}
</script>
