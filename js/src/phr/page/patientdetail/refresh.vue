<template>

</template>

<script>
export default {
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$router.replace({
        path: from.path,
        query: from.query
      })
    })
  }
}
</script>

<style lang="less" scoped="">

</style>
