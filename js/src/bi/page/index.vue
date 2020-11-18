<!--  -->
<template>
  <div class="index-container full" v-loading="loading">
    <img src="./img/bgleft.png" class="main-bg" />
    <indextitle ></indextitle>
    <indexcatalog  @load="changeLoading"></indexcatalog>
  </div>
</template>

<script>
import indextitle from '@/bi/page/statistics/indextitle'
import indexcatalog from '@/bi/page/statistics/indexcatalog'
import centeritem from '@/bi/page/statistics/centeritem'
export default {
  props: {},
  data () {
    return {
      loading: false
    }
  },

  components: {
    indextitle,
    indexcatalog,
    centeritem
  },

  computed: {},

  created () { },

  methods: {
    changeLoading (val) {
      this.loading = val
    }
  }
}

</script>
<style lang='scss' scoped>
.index-container {
  height: 100%;
  background-image: url('./img/bg.png');
  background-size: 100% 100%;
  position: relative;
  overflow: auto;
  .main-bg {
    position: absolute;
    right: 0px;
    bottom: 0;
    height: 60%;
    box-sizing: border-box;
  }
}
</style>
