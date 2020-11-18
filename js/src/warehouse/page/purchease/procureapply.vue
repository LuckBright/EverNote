<template>
  <div class="ever-tab">
    <div class="settle_inner">
      <el-row>
        <el-col :span="24" :key="status">
          <el-menu class="settlemenu">
            <el-menu-item @click="status = 1" :class="status == 1 ? 'is-active' : 'is-inactive'" index="t.b.d">
              待审核
            </el-menu-item>
            <el-menu-item @click="status = 2" :class="status == 2 ? 'is-active' : 'is-inactive'" index="completed">
              已审核
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </div>
    <focus-procurement-list ref="focusList" :status="status"></focus-procurement-list>
  </div>
</template>
<script>
import focusProcurementList from '@/warehouse/page/purchease/focusprocurementlist.hz'
export default {
  data () {
    return {
      path: this.$route.path,
      status: 1,
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!['summarydetail', 'summarylist', 'focusprocurementdetails'].includes(from.name)) {
        vm.status = 1
        vm.$refs.focusList.customList()
      } else {
        vm.$refs.focusList.customList()
      }
    })
  },
  components: {
    focusProcurementList
  },
  created () {
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
