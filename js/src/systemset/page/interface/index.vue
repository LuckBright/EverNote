<template>
  <div class="layout_inner">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="按菜单管理" name="Menu"></el-tab-pane>
      <el-tab-pane label="按接口管理" name="Sys"></el-tab-pane>
    </el-tabs>
    <component :is="view"></component>
  </div>
</template>
<script>
import Sys from './sys'
import Menu from './menu'

export default {
  components: {
    Sys,
    Menu
  },
  data () {
    return {
      activeName: 'Menu',
      view: Menu
    }
  },
  methods: {
    handleClick (tab) {
      this.view = tab.name
    }
  }
}
</script>
