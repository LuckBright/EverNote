<template>
  <div class="catalog-container" v-loading="loading">
    <catalogtree :load.sync="loading" @change-code="changeCode" @change-size="changeSize"></catalogtree>
    <reportiframe :class="{'ml': showMargin, 'ml10': !showMargin}" ref="reportiframe" :key="code"></reportiframe>
  </div>
  <!-- <el-container>
    <el-aside width="300px">
    </el-aside>
    <el-main class="layout_main_wrap">
    </el-main>
  </el-container> -->
</template>

<script>
import catalogtree from './statistics/catalogtree.vue'
import reportiframe from '@/bi/page/reportdetail/report.detail'
export default {
  props: {},
  data () {
    return {
      code: '',
      showMargin: true,
      loading: false
    }
  },

  components: {
    catalogtree,
    reportiframe
  },

  computed: {},
  watch: {
    // '$route.params.code': {
    //   handler (val) {
    //     if (val) {
    //       if (this.$route.path.includes('/rcm/catalog/')) {
    //         this.$bus.$emit('nav:changeSecActiveHasParam', '/rcm/comins')
    //       } else {
    //         this.$bus.$emit('nav:changeSecActiveHasParam', (this.$route.path.includes('/systemset/') ? '/systemset/reportlist' : '/bi/catalog'))
    //       }
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  created () {
    // this.$nextTick(_ => {
    //   this.$bus.$emit('nav:changeSecActiveHasParam', '/systemset/reportlist')
    //   // this.$bus.$emit('nav:changeThirdActiveHasParam', '/rcm/reportlist/outpatient')
    // })
  },
  methods: {
    changeCode (code) {
      this.code = code
    },
    changeSize (show) {
      this.showMargin = show
    }
  }
}
</script>

<style lang='scss' scoped>
.catalog-container {
  box-sizing: border-box;
  display: flex;
  height: 100%;
  position: relative;
  overflow: hidden;
  .ml {
    margin-left: 320px;
    height: 100%;
    flex: 1
  }
  /deep/ .ml {
    .custom {
       width: calc(100vw - 351px);
    }
  }
  .ml10 {
    margin-left: 10px;
    height: 100%;
    flex: 1
  }
   /deep/ .ml10 {
    .custom {
       width: calc(100vw - 45px);
    }
  }
}
</style>
