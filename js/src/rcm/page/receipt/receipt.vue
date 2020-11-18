<template>
  <div>
    <div class="layout_inner settle_inner tab">
      <el-row>
        <el-col :span="24">
          <el-menu mode="horizontal" class="el-menu-demo" :default-active="currentPage" router>
            <el-menu-item :index="'/rcm/receipt/tabs/0'">
              待结算
            </el-menu-item>
            <el-menu-item :index="'/rcm/receipt/tabs/1'">
              结算中
            </el-menu-item>
            <el-menu-item :index="'/rcm/receipt/tabs/2'">
              已完成
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
      <div>
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      currentPage: ''
    }
  },
  created () {
    this.currentPage = this.$route.path
  },
  watch: {
    $route (to, from) {
      this.currentPage = this.$route.path
    }
  }
}
</script>

<style scoped>
.layout_box .layout_inner.settle_inner {
  padding: 0;
  margin:-10px -10px 10px;
}
.layout_box .layout_inner.tab {
  box-shadow: 0 0 0 0;
  background-color: #ebedef;
}
.tab .el-menu {
  background-color: #ebedef;
}
.tab .payStyle {
  background-color: #fff;
}
.tab .el-menu-item:hover{
  background-color: #ebedef;
}
.tab .el-menu-item.is-active {
  background-color: #ebedef;
}
.tab .el-menu.settlemenu.el-menu--horizontal {
  background-color: #ebedef;
}
.tab .settlemenu .el-menu-item[data-v-29862b9e]:hover, .settlemenu .el-menu-item.is-active[data-v-29862b9e]{
  background-color: #ebedef;
}
.settle_inner .settlemenu {
  background: #f8f8f8;
  font-family: PingFangSC-Semibold;
  font-size: 16px;
  color: #000;
  line-height: 16px;
  border-bottom: 1px solid #eee;
  border-radius: 4px 4px 0 0;
}
.settlemenu .el-menu-item {
  padding: 0 15px;
}
.settlemenu .el-menu-item {
  height: 50px;
  line-height: 50px;
  border-bottom: 3px solid transparent;
}
.settlemenu .el-menu-item:hover,
.settlemenu .el-menu-item.is-active {
  background-color: #f8f8f8;
  border-bottom: 3px solid #1c7bef;
}
.layout_box .layout_inner.settle_inner { padding:0; }
  .layout_box .layout_inner.settle_inner { background: none; box-shadow: none; }
  .layout_box .layout_inner.settle_inner /deep/ .settlemenu{ margin-left:20px; border:1px solid #ddd;background: #f8f8f8;float: left;}
  .layout_box .layout_inner.settle_inner /deep/ .settlemenu .el-menu-item{width:100px; text-align:center;height: 43px;line-height: 43px;border-right: 1px solid #ddd;border-bottom: none;}
  #app .layout_box .layout_inner.settle_inner /deep/ .settlemenu .el-menu-item:hover, .layout_box .layout_inner.settle_inner /deep/ .settlemenu .el-menu-item.is-active{border-bottom: none;background: #fff;color: #1C7BEF}
  .layout_box .layout_inner.settle_inner /deep/ .settlemenu .el-menu-item:last-child{border-right: none}
</style>
