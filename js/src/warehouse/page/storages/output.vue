<template>
  <div class="ever-tab">
    <div v-if="materialType == 298" class="layout_inner_reminder">
      <p class="reminder">功能完善中,敬请期待</p>
    </div>
    <div v-else-if="$route.name == 'outputs'" class="settle_inner">
      <el-row>
        <el-col :span="24">
          <el-menu class="settlemenu">
            <el-menu-item @click="$router.push('/storages/output/outputs/20')" :class="$route.params.status != 21 ? 'is-active' : 'is-inactive'" index="t.b.d">
              待出库的任务
            </el-menu-item>
            <el-menu-item @click="$router.push('/storages/output/outputs/21')" :class="$route.params.status == 21 ? 'is-active' : 'is-inactive'" index="completed">
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
import getstorage from '@/warehouse/page/storages/util/getstorage'
export default {
  mixins: [getstorage],
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
.layout_inner_reminder {padding: 20px; margin: 0 20px; border-radius: 4px; background: #fff; box-shadow: 0 0 8px rgba(0, 0, 0, 0.1); width: 90%; height: 80%; position: absolute; background-color: #fff;}
.reminder { position: absolute; left: 40%; top: 40%; font-size: 20px; }
</style>
