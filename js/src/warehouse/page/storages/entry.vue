<template>
  <div class="ever-tab">
    <div v-if="$route.name == 'entrys'" class="settle_inner">
      <el-row>
        <el-col :span="24">
          <el-menu class="settlemenu">
            <el-menu-item @click="$router.push('/storages/entry/entrys/10')" :class="$route.params.status == 10 ? 'is-active' : 'is-inactive'" index="t.b.d">
              待入库的任务
            </el-menu-item>
            <el-menu-item @click="$router.push('/storages/entry/entrys/11')" :class="$route.params.status == 11 ? 'is-active' : 'is-inactive'" index="completed">
              已经完成的任务
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data () {
    return {
      path: this.$route.path
    }
  },
  methods: {},
  watch: {
    '$route' (val) {
      this.path = this.$route.path
    }
  }
}
</script>
<style lang="scss" scoped>
.settle_inner .settlemenu {background-color: #fff; font-family: PingFangSC-Semibold; font-size: 16px; color: #000; line-height: 16px;  border-bottom: 1px solid #eee; border-radius: 4px 4px 0 0; padding: 0 20px;}
.settlemenu .el-menu-item { padding: 0 15px; background-color: #fff; font-size: 16px;}
.settlemenu .el-menu-item { height: 50px; line-height: 50px; border-bottom: 3px solid transparent;display:inline-block; }
.settlemenu .el-menu-item:hover, .settlemenu .el-menu-item.is-active { border-bottom: 3px solid #1c7bef; }
.settlemenu /deep/ .el-menu-item.is-inactive {border-bottom: none !important;}
</style>
