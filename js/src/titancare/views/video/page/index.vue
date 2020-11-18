<template>
  <div class="wrap">
    <div class="inner">
      <span>会诊功能需使用“智慧医疗”客户端</span>
      <el-button type="primary" @click="goTo">打开智慧医疗客户端</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/titancare/api/video/index'
import storage from '@/util/storage'
import md5 from 'js-md5'

export default {
  data () {
    return {
      md5,
      api,
      storage,
      user: {}
    }
  },
  methods: {
    async goTo () {
      await this.getAccmont()
      await this.addUser()
    },
    getAccmont () {
      return this.api.findStaffListAndAccountByIds({ idList: [this.storage.getLocalStorage('USERID')] }).then(rs => {
        if (rs.errCode === 0 && rs.data && rs.data[0]) {
          Object.assign(this.user, rs.data[0])
        }
      })
    },
    addUser () {
      let ipurl = 'http://jm19801281562.qicp.io:13000'
      let params = {
        userName: this.user.mobile || '',
        password: this.user.mobile || '',
        nickName: this.user.nickName || '',
        sex: this.user.sex === '1' ? 0 : 1, // thc 1 对应 男  就传0
        mobile: this.user.mobile || '',
        userType: 1,
        title: 1,
        departId: 3,
        officeId: 1,
        url: `${ipurl}/api/user/addUser`,
        Authorization: '919159044c9db824cbbdc78a09477b34'
      }
      this.api.meeting(params).then(rs => {
        if (rs.errCode === 0 && rs.data) {
          if (rs.data.statusCode === 402020 || rs.data.statusCode === 200) {
            window.open(`http://jm19801281562.qicp.io:13000/fmWeb/launch/toEnterMeeting.do?userName=${this.user.mobile}&userPwd=${this.user.mobile}&userType=1`)
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.wrap {
  width: 100%;
  height: 100%;
  padding-top: 200px;
  text-align: center;
  .inner {
    span {
      display: inline-block;
    }
    span:nth-of-type(1) {
      margin-right: 10px;
    }
    span:nth-of-type(2) {
      padding: 5px 10px;
      border: 1px solid #333333;
    }
  }
}
</style>
