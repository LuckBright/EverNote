<template>
  <div class="ever-tab">
    <div v-if="routeNameList.includes($route.name)" class="settle_inner">
      <el-row>
        <el-col :span="24">
          <el-menu class="settlemenu">
            <!-- 本期暂停显示采购申请 -->
            <!-- <el-menu-item @click="$router.push('/storages/business/procurement')" :class="$route.name == 'procurementlist' ? 'is-active' : 'is-inactive'" index="procurement">
              采购申请
            </el-menu-item> -->
            <el-menu-item v-if="$hasPermission('Auth_menu_material_drug_drugallotbounds') && !isInvented" @click="$router.push('/storages/business/applybusinesses')" :class="$route.name == 'applybusinesses' ? 'is-active' : 'is-inactive'" index="apply">
              申领
            </el-menu-item>
            <el-menu-item v-if="$hasPermission('Auth_menu_material_drug_storagebacks') && !isInvented" @click="$router.push('/storages/business/retiringbusinesses')" :class="$route.name == 'retiringbusinesses' ? 'is-active' : 'is-inactive'" index="Retiring">
              退库
            </el-menu-item>
            <el-menu-item v-if="$hasPermission('Auth_menu_material_drug_drugbacks')" @click="$router.push('/storages/business/returnbusinesses')" :class="$route.name == 'returnbusinesses' ? 'is-active' : 'is-inactive'" index="return">
              采购退货
            </el-menu-item>
            <el-menu-item v-if="$hasPermission('Auth_menu_material_drug_destroybusinesses')" @click="$router.push('/storages/business/destroybusinesses')" :class="$route.name == 'destroybusinesses' ? 'is-active' : 'is-inactive'" index="destroy">
              销毁报废
            </el-menu-item>
            <el-menu-item v-if="$hasPermission('Auth_menu_material_storageroom_split') && !isInvented" @click="$router.push('/storages/business/splits')" :class="$route.name == 'splits' ? 'is-active' : 'is-inactive'" index="splits">
              物资拆零
            </el-menu-item>
            <el-menu-item v-if="$hasPermission('Auth_menu_material_drug_allocation') && !isInvented" @click="$router.push('/storages/business/allocations')" :class="$route.name == 'allocations' ? 'is-active' : 'is-inactive'" index="allocations">
              调拨
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
      path: this.$route.path,
      routeNameList: ['allocations', 'applybusinesses', 'retiringbusinesses', 'returnbusinesses', 'destroybusinesses', 'splits', 'procurementlist']
    }
  },
  created () {
    if (this.$route.name === 'applybusinesses' && this.isInvented) this.$router.replace('/storages/business/returnbusinesses')
  },
  methods: {},
  watch: {
    '$route' (val) {
      this.path = this.$route.path
      if (this.$route.name === 'applybusinesses' && this.isInvented) this.$router.replace('/storages/business/returnbusinesses')
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
