<template>
  <div class="ever_bg_01 login_bg">
    <div class="alg_c" style="margin-top: -150px">
      <p><img src="../../assets/upgradetip.png"></p>
      <p class="f18 m40">系统维护中,请稍后重新访问</p>
      <el-button type="primary" round v-ever-click-once="disabled" :disabled="disabled" @click="doRefresh()">　刷　新　</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      disabled: false
    }
  },
  created () {
    // this.doRefresh()
  },
  methods: {
    getInstance () {
      const instance = axios.create()
      // 添加请求拦截器
      instance.interceptors.request.use(function (config) {
        // 在发送请求之前做些什么
        return config
      }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error)
      })
      // 添加响应拦截器
      instance.interceptors.response.use(function (response) {
        // 对响应数据做点什么
        return response
      }, function (error) {
        // 对响应错误做点什么
        return Promise.reject(error)
      })
      return instance
    },
    goLogin () {
      this.$router.push({
        name: 'login'
      })
    },
    doRefresh () {
      const axios = this.getInstance()
      let _url = this.$ever.api + '/thc-platform-core/unify/getEvnId/?tenantId=' + localStorage.getItem('TENANTID')
      axios({
        method: 'get',
        url: _url,
        headers: {
          'x-access-token': localStorage.getItem('TOKEN') || '',
          'x-tenant-id': localStorage.getItem('TENANTID') || '',
          'x-org-id': localStorage.getItem('CLINICID')
        }
      }).then(response => {
        // 111: 维护中，内部访问，前端，动作: 没有特殊动作，只添加app-status头信息
        // 101: 维护中, 外部访问, 前端，动作: 添加app-status头信息，跳到维护页面
        // 110: 维护中，内部访问，后端接口，动作: 没有特殊动作，只添加app-status头信息
        // 100: 维护中，外部访问，后端接口，动作: 添加app-status头信息，所有接口返回 {'errURL':www.baidu.com} (测试数据可以修改)
        let tenStu = response.headers['x-app-status']
        if (tenStu === '000' || tenStu === '111' || tenStu === '110') {
          this.$notify({
            title: '升级完成',
            message: '租户升级完成,可正常使用',
            duration: 1000,
            type: 'success',
            onClose: () => {
              this.$router.push({
                name: 'login'
              })
            }
          })
        } else {
          this.$notify({
            title: '升级中',
            message: '租户升级中,请耐心等待',
            duration: 1000,
            type: 'warning',
          })
        }
      })
    }
  },
}
</script>
