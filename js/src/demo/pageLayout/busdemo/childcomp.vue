<template>
  <div>我就是个子组件，纯测试而已</div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  created () {
    this.$bus.$emit('demo:testbus', {
      name: 'balabala'
    })
  }
}
</script>
