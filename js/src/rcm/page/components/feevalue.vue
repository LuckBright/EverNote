<template>
  <span>{{customPosition ? (customVal || '') : ''}}&nbsp;{{feeValue | formatToFinacial}}&nbsp;{{!customPosition ? (customVal || '') : ''}}</span>
</template>
<script>
export default {
  name: 'feeValue',
  props: ['value', 'customVal', 'customPosition'],
  data () {
    return {}
  },
  computed: {
    feeValue () {
      let name = ''
      name = this.value && this.value !== undefined ? this.value : ''
      return name
    }
  }
}
</script>

