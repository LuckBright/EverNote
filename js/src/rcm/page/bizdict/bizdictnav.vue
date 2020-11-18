<template>
    <div class="discontainer">
      <div class="title">
        字典列表
      </div>
    <el-menu
      :default-active="activeName"
      :router='true'
      >
      <el-menu-item v-for="(item,i) in menuList" :index="item.url" :key="i">
          <span slot="title">{{item.name}}</span>
      </el-menu-item>
    </el-menu>
    </div>
</template>
<script>
export default {
  data () {
    return {
      activeName: 'discountperson',
      menuList: [{name: '打折人', url: 'discountperson'}, {name: '打折备注', url: 'discountRemark'}, {name: '补费项目列表', url: 'makeupfee'}]
    }
  },
  created () {
    // 修复导航栏刷新选中项丢失问题
    let activeNameArr = this.$route.path.split('/')
    let activeName = activeNameArr[activeNameArr.length - 1]
    this.activeName = activeName
  }
}
</script>
<style scoped>
.discontainer{
  height:100%;
  border:1px solid #ccc;
}
.title{
  font-size:16px;
  line-height:40px;
  background: #ccc;
  text-align: center;
}
.el-menu{
  border-right:none;
}
.el-menu .el-menu-item {
  height:40px;
  line-height: 40px;
}
</style>
