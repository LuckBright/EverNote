<template>
  <div :class="['ever_bg_01 login_bg', curTheme]">
    <div class="ever_box login_war">
      <div class="login_left">
        <el-image :src="loginLogo" fit="fill" v-loading="loading" @load="loadImg" @error="loadImg">
          <div slot="error" class="image-slot">
            加载失败
          </div>
        </el-image>
      </div>
      <div class="login_right">
        <div class="dow">
          <el-tooltip class="item" content="下载中心" placement="top">
            <a href="#/down" target="_blank"><i class="el-icon-download cGray6"></i></a>
          </el-tooltip>
        </div>
        <div class="login-container">
          <h3 class="title">{{ tenantName }}</h3>
          <div class="cusLabel f14 pb10 alg_r">
            <span class="f14 cGray6" style="display:inline-block;height:18px" @click="chgLoginType" v-if="showSms">{{loginTypeMsg}}
              <i class="el-icon-mobile-phone" v-if="loginType === '1'"></i>
              <i class="icon iconfont icon-gerenzhongxin" v-if="loginType === '2'"></i>
            </span>
          </div>
          <component :is="view"></component>
        </div>
      </div>
    </div>
    <el-dialog
      title="系统信息"
      :close-on-click-modal="false"
      :show-close="true"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      width="30%"
      center>
      <el-tree :data="sysData" class="info">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span class="label" :title="data.label">{{ data.label }}</span><span>：{{data.value}}</span>
        </span>
      </el-tree>
    </el-dialog>
    <a class="verHide" href="javascript:void(0)" @dblclick="dialogVisible = true"></a>
  </div>
</template>

<script>
import globalUrlMap from '@/login/store/globalurls'
import { request } from '@/util/req'
import { baseHost } from '@/store/basehost'
import loginFormUsername from '@/login/page/login.form.username'
import loginFormSms from '@/login/page/login.form.sms'
import { configArr } from '@/store/config.base'
import loginLogo from '@img/assets/default/img/loginlogo.png'

export default {
  data () {
    return {
      loginLogo: loginLogo,
      curTheme: 'themeblue',
      loading: true,
      tenantName: '',
      loginType: '1', // 1 用户名密码登录 2 手机号+动态码登录
      loginTypeMsg: '短信动态码登录',
      view: loginFormUsername,
      supportLoginTypes: this.$ever.getClinicConfig().supportLoginTypes,
      dialogVisible: false,
      errMsg: '',
      sysData: {},
    }
  },
  created () {
    // let a = new JSEncrypt()
    sessionStorage.removeItem('x-rid')
    this.getTenantInfo()
    this.getUserIP(function (ip) {
      localStorage.setItem('x-user-ip', ip)
    })
    this.getGlobalId()
  },
  computed: {
    showSms () {
      if (this.supportLoginTypes && this.supportLoginTypes.includes('sms')) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    async getSystemInfo (tenantId) {
      let res = await request(globalUrlMap.tenantData.getByTenantId, {
        tenantId
      }, 'get')
      if (res.head.errCode === 0) {
        try {
          this.sysData = JSON.parse(res.data.configData)
        } catch (err) {
          this.sysData = []
        }
      }
    },
    // 检测环境id 这个接口报错的话，问题就大条了，是配置问题需要赶紧通知技术予以解决
    async getEvnId (tenantId) {
      let res = await request(globalUrlMap.unify.getEvnId, {
        tenantId
      }, 'get')
      if (res.head.errCode === 500 || !res.data) {
        document.getElementById('evnId').innerHTML = res.msg
      } else {
        if (res.data) {
          document.getElementById('evnId').innerHTML = res.data
        }
      }
    },
    // 检测环境连的是哪个全局环境
    async getGlobalId () {
      let res = await request(globalUrlMap.unify.getGlobalHost)
      if (res.head.errCode === 0) {
        document.getElementById('globalUrl').innerHTML = res.data
      }
    },
    // 切换登录方式
    chgLoginType () {
      if (this.loginType === '2') {
        this.loginTypeMsg = '短信动态码登录'
        this.view = loginFormUsername
        this.loginType = '1'
      } else if (this.loginType === '1') {
        this.loginTypeMsg = '用户名密码登录'
        this.view = loginFormSms
        this.loginType = '2'
      }
    },
    // 获取当前环境对应的 登录logo，租户id，租户名称，租户选择皮肤
    async getTenantInfo () {
      // 获取该租户的配置信息（租户id，登录页面logo，租户名称）
      let tenantInfo = await request(globalUrlMap.clinicset.getWebConfig, {
        domainName: baseHost.hostName
      }, 'get')
      if (tenantInfo.head.errCode === 0 && tenantInfo.data.tenantId) {
        localStorage.setItem('TENANTDATA', JSON.stringify(tenantInfo.data))
        document.title = tenantInfo.data.name
        this.tenantName = tenantInfo.data.name
        if (tenantInfo.data.loginLogo) {
          this.loginLogo = this.$ever.fileUrl2 + this.fixDirtyData(tenantInfo.data.loginLogo)
        }
        this.curTheme = tenantInfo.data.theme
        localStorage.setItem('TENANTID', tenantInfo.data.tenantId)
        // 拿着租户id去查租户的其他配置信息（具体的业务配置项）
        this.getTenantConfig(tenantInfo.data.tenantId)
        // 拿着租户id去查环境id
        this.getEvnId(tenantInfo.data.tenantId)
        // 拿着租户id去查环境其他变量
        this.getSystemInfo(tenantInfo.data.tenantId)
      }
    },
    // 兼容老数据
    fixDirtyData (url) {
      if (url && url.indexOf('fileId=') > -1) {
        return url.substr(url.indexOf('fileId=') + 7)
      } else {
        return url
      }
    },
    loadImg () {
      this.loading = false
    },
    // 获取机构的配置键值 写入缓存备用
    async getTenantConfig (tenantId) {
      let _config = {}
      let res = await request(globalUrlMap.clinicset.getKeyValueInfosDetails, {
        keys: configArr,
        tenantId: tenantId,
        isValid: 1
      })
      if (res.head.errCode === 0) {
        localStorage.removeItem('CLINICCONFIG')
        res.data.forEach((item, index) => {
          _config[item.key] = item.value
        })
        localStorage.setItem('CLINICCONFIG', JSON.stringify(_config))
      }
    },
    getUserIP (onNewIP) {
      // onNewIp - your listener function for new IPs
      // compatibility for firefox and chrome
      var Mypeerconnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
      var pc = new Mypeerconnection({
        iceServers: []
      })
      var noop = function () { }
      var localIPs = {}
      var ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g

      function iterateIP (ip) {
        if (!localIPs[ip]) onNewIP(ip)
        localIPs[ip] = true
      }

      // create a bogus data channel
      pc.createDataChannel('')

      // create offer and set local description
      pc.createOffer().then(function (sdp) {
        sdp.sdp.split('\n').forEach(function (line) {
          if (line.indexOf('candidate') < 0) return
          line.match(ipRegex).forEach(iterateIP)
        })
        pc.setLocalDescription(sdp, noop, noop)
      }).catch(function (reason) {
        // An error occurred, so handle the failure to connect
      })

      // sten for candidate events
      pc.onicecandidate = function (ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP)
      }
    }
  },
  components: {
    loginFormUsername,
    loginFormSms
  }
}
</script>

<style lang="less" scoped>
.info{height: 450px;overflow:auto;}
.info li{min-height: 28px;line-height: 28px;}
.verHide{width: 20px;height: 20px; position: fixed; right: 0; bottom: 0;}
.label{font-weight: bold}
</style>
