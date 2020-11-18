<template>
  <div class="layout_inner">
    <el-button type="primary" @click="test1()">张伟东 授权（已开通账户）</el-button>
    <el-button type="primary" @click="test2()">授权（未开通账户）</el-button>
    <br>
    <user-authorize
      :userObj="userObj"
      :key="accountKey"
      :visible.sync="userSelectDialog"
      @success="doSth()"
    ></user-authorize>
  </div>
</template>
<script>
import userAuthorize from '@/auth/components/userauthorize'

export default {
  data () {
    return {
      userObj: {},
      userSelectDialog: false,
      accountKey: ''
    }
  },
  methods: {
    doSth () {
      console.log('balabal')
    },
    test1 () {
      this.accountKey = new Date().getTime()
      this.userObj = {
        // userId: '',
        userId: 'ef65a3ac-ee80-4efc-95d8-582669ac27ce',
        organizationId: '5000001',
        telephoneNumber: '',
        displayName: '张伟东',
        loginName: ''
      }
      this.userSelectDialog = true
    },
    test2 () {
      this.accountKey = new Date().getTime()
      this.userObj = {
        // userId: '',
        userId: '1111',
        organizationId: '5000001',
        telephoneNumber: '13260357718',
        displayName: '',
        loginName: ''
      }
      this.userSelectDialog = true
    }
  },
  components: {
    userAuthorize
  }
}
</script>

