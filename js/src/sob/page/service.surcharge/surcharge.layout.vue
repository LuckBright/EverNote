<template>
  <div class="layout_inner surcharge">
    <el-tabs v-model="activeName">
      <el-tab-pane label="用法管理" name="usage"></el-tab-pane>
      <el-tab-pane label="煎法管理" name="decoct"></el-tab-pane>
    </el-tabs>
    <component :is="this.$route.query.type" class-name="surcharge-content"></component>
  </div>
</template>
<script>
import usage from '@/sob/page/service.usage/list'
import decoct from './decoct.vue'

export default {
  components: { usage, decoct },
  data () {
    return {
      activeName: this.$route.query.type || 'usage'
    }
  },
  watch: {
    'activeName': {
      handler (val, oldVal) {
        if (val) {
          if (!oldVal) {
            this.$router.push({
              query: Object.assign({}, this.$route.query, {type: val})
            })
            return
          }
          this.$router.push({
            query: Object.assign({}, {type: val})
          })
        }
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
  .surcharge {
    display: flex;
    flex-direction: column;
  }
  .surcharge-content {
    flex: 1;
    overflow: hidden;
  }
</style>
