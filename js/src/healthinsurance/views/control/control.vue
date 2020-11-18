<template>
  <router-view :key="key"></router-view>
</template>

<script>
export default {
  computed: {
    key () {
      // 当三级菜单没有定义thirdActiveIndex时,取当前路径
      return this.$route.meta.thirdActiveIndex || this.$route.path
    }
  }
}
</script>
