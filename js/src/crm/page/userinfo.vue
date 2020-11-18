<template>
  <div id="userinfo">
    <el-menu class="el-menu-user" mode="horizontal" :default-active="currentPage" router>
      <el-menu-item :index="'/crm/memberinfo/userinfo/memberbaseinfo/' + patientId">基础信息</el-menu-item>
      <el-menu-item :index="'/crm/memberinfo/userinfo/patientidentity/' + patientId">患者身份</el-menu-item>
      <el-menu-item :index="'/crm/memberinfo/userinfo/cardinfo/' + patientId">卡信息</el-menu-item>
      <el-menu-item :index="'/crm/memberinfo/userinfo/accountinfo/' + patientId">账户信息</el-menu-item>
      <el-menu-item :index="'/crm/memberinfo/userinfo/userinsuranceinfo/' + patientId">保险信息</el-menu-item>
      <el-menu-item :index="'/crm/memberinfo/userinfo/signinfo/' + patientId">签约信息</el-menu-item>
      <el-menu-item :index="'/crm/memberinfo/userinfo/correspondinginstitutions/' + patientId">往来机构</el-menu-item>
    </el-menu>
    <router-view></router-view>
  </div>
</template>
<script>
import config from '@/store/config'
export default {
  data () {
    return {
      config,
      currentPage: '',
      patientId: ''
    }
  },
  created () {
    this.patientId = this.$route.params.patientId
    this.currentPage = this.$route.path
  },
  watch: {
    '$route': function (newVal) {
      this.currentPage = newVal.path
    }
  },
  methods: {
    linkDeatil () {
      this.$router.push('/crm/memberinfo/userinfo/memberbaseinfo/' + this.patientId)
    }
  }
}
</script>
<style scoped>
#userinfo {
  background: #fff;
  min-height: calc(100vh);
}
#userinfo .el-menu-user {
  background: none;
  margin-bottom: 30px;
}
#userinfo .el-menu-user .el-menu-item {
  border-bottom: 2px solid transparent;
  color: #000;
}
#userinfo .el-menu-user .el-menu-item:hover,
#userinfo .el-menu-user .el-menu-item.is-active {
  border-bottom: 2px solid #1c7bef;
  background: #fff;
  color: #1c7bef;
}
#userinfo .special {
  margin-left: 45px;
}
</style>
