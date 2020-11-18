<template>
  <div class="top-nav">
<!--    <span-->
<!--      v-for="(items, index) in navs"-->
<!--      :key="index"-->
<!--      @click="go(items.url)"-->
<!--      :class="path === items.url ? 'nav-color' : ''"-->
<!--    >{{ items.title }}</span-->
<!--    >-->
  </div>
</template>
<script>
  export default {
    props: {
      navs: {
        type: Array,
      },
      pathUrl: {
        type: String,
        default: '',
      },
    },
    data () {
      return {
        path: this.pathUrl,
      }
    },
    methods: {
      go (path) {
        if (this.path !== path) {
          this.path = path
          this.$router.push({ path })
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  /*.top-nav {*/
  /*  height: 30px;*/
  /*  line-height: 30px;*/
  /*  background: #fff;*/
  /*  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.23);*/

  /*  span {*/
  /*    font-size: 14px;*/
  /*    margin-left: 30px;*/
  /*    cursor: pointer;*/

  /*    &:hover {*/
  /*      color: #1c7bef;*/
  /*    }*/
  /*  }*/

  /*  .nav-color {*/
  /*    color: #1c7bef;*/
  /*  }*/
  /*}*/
</style>
