<template>
  <child-comp></child-comp>
</template>
<script>
import childComp from './childcomp.vue'

export default {
  data () {
    return {

    }
  },
  created () {
    this.$bus.$on('demo:testbus', val => {
      console.log(val)
    })
  },
  methods: {

  },
  components: {
    childComp
  }
}
</script>
