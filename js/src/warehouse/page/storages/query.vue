<template>
  <div class="ever-tab">
    <div v-if="$route.name == 'queryenter' || $route.name == 'querys' || $route.name == 'commodityflow'" class="settle_inner">
      <el-row>
        <el-col :span="24">
          <el-menu class="settlemenu">
            <el-menu-item v-if="$hasPermission('Auth_menu_material_drug_drugquerys')" @click="$router.push('/storages/query/querys')" :class="$route.name === 'querys' ? 'is-active' : 'is-inactive'" index="inventoryQuery">
              库存查询
            </el-menu-item>
            <el-menu-item v-if="$hasPermission('Auth_menu_material_drug_importandexport')" @click="$router.push('/storages/query/queryenter')" :class="$route.name === 'queryenter' ? 'is-active' : 'is-inactive'" index="enterQuery">
              进销存查询
            </el-menu-item>
            <el-menu-item v-if="$hasPermission('Auth_menu_material_commodityflow')"  @click="$router.push('/storages/query/commodityflow')" :class="$route.name === 'commodityflow' ? 'is-active' : 'is-inactive'" index="commodityflow">
              商品流向查询
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
