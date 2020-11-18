<template>
<div class='csa'>
  <el-main class="layout_box csa_wrap">
      <router-view ></router-view>
  </el-main>
</div>
</template>

<script>
import session from '@/util/session'

export default {
  mixins: [session],
}
</script>
<style lang="scss" scoped>
 .csa{
   height: 100%;
   .csa_wrap{
     height: 100%;
   }
  
 }
</style>

