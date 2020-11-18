<template>
    <div class="flex_layout_full">
    <!-- <ever-bread-crumb name="业务字典" path="/financeistall/bizdict/discountperson" :showBack="true"></ever-bread-crumb> -->
    <div class="layout_inner">
        <el-row>
            <el-col :span="4">
                <bizdictnav></bizdictnav>    
            </el-col>
            <el-col :span="20">
                <router-view></router-view>
            </el-col>
        </el-row>
    </div>
    </div>
</template>
<script>
import bizdictnav from './bizdictnav'
export default {
  components: {
    bizdictnav
  }
}
</script>
<style scoped>
.layout_inner{
    padding:10px;
}
.layout_inner .el-row, .layout_inner .el-row .el-col{
    height:100%;
}
</style>
