<template>
  <el-menu class="el-menu-user" mode="horizontal" :default-active="currentPanel" @select="nav">
    <el-menu-item index="CHINA">中药颗粒/饮片</el-menu-item>
    <el-menu-item index="WEST">西药/中成药
    </el-menu-item>
  </el-menu>
</template>
<script>
  export default {
    data () {
      return {
        currentPanel: this.$route.path.indexOf('prescriptionxiyi') > -1 ? 'WEST' : 'CHINA'
      }
    },
    methods: {
      nav (panel) {
        let path = panel === 'CHINA' ? 'prescription' : 'prescriptionxiyi'
        console.log(path)
        this.$router.push({
          path: '/workspace/treatment/' + path,
          query: this.$route.query
        })
      }
    }
  }
</script>
<style scoped>
  .el-menu--horizontal{width:92%;margin:0 auto;background-color: #f8f8f8;border-bottom:1px solid #dddddd;margin-top:16px;}
  .el-menu--horizontal .el-menu-item{width:50%;text-align:center;font-family: PingFangSC-Semibold;font-size: 16px;}
  .el-menu--horizontal > .el-menu-item:hover{border-bottom: 3px solid #1c7bef;color:#1c7bef;}
  .el-menu-item.is-active{border-bottom: 3px solid #1c7bef;}
</style>
