<template>
  <div class="layout_inner">
    <manage-comp></manage-comp>
    <!-- <el-tabs v-model="activeName">
      <el-tab-pane label="管理" name="first">
      </el-tab-pane>
    </el-tabs> -->
  </div>
</template>
<script>
import manageComp from './manage.comp'
export default {
  components: {
    manageComp
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!vm.$store.state.im) {
        vm.$store.dispatch('getSig', true)
      }
    })
    next(true)
  },
  created () {
  },
  data () {
    return {
      // activeName: 'first'
    }
  },
}
</script>
