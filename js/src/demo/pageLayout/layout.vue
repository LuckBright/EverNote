<template>
  <el-container class="oh" style="height: 100%">
    <el-aside width="300px">
      <div class="sidebar">
        <side-bar></side-bar>
      </div>
    </el-aside>
    <el-main class="layout_box" style="background: #fff;">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import sideBar from './sidebar'
import session from '@/util/session'
export default {
  components: {
    sideBar
  },
  mixins: [session],
}
</script>
