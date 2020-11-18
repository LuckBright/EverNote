<template>
  <span @click="readIDCard()">
    <slot>
      <i class="el-input__icon icon iconfont icon-menzhen-shenfenzheng cBlack mr5"></i>
    </slot>
  </span>
</template>
<script>
import iddata from './iddata.json'
import axios from 'axios'

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      idData: {}
    }
  },
  methods: {
    // 身份证
    getLocalIdCardData () {
      return new Promise(resolve => {
        resolve(iddata)
      })
    },
    readIDCard () {
      if (this.disabled) {
        return
      }
      let idcardUrl = this.$ever.getClinicConfig().readICcardUrl || 'http://127.0.0.1:9999/idcard/get'
      // 没有真实数据时候可以用本地数据模拟
      // this.getLocalIdCardData().then(rs => {
      axios.get(idcardUrl, {}).then(rs => {
        if (!rs || (rs.head && rs.head.errCode === 9999)) {
          this.$notify({
            title: '警告',
            message: '请连接身份证读卡器设备并启动读卡识别程序',
            type: 'warning'
          })
          return Promise.reject()
        }
        if (rs.head && rs.head.errCode !== 0) {
          this.$notify({
            title: rs.head.errMsg,
            message: '请将身份证重新放置到读卡器识别',
            type: 'warning'
          })
          return Promise.reject()
        } else if (!rs.data.idCode || !rs.data.name) {
          this.$notify({
            title: '提示',
            message: '没有读取到身份证信息',
            type: 'warning'
          })
          return Promise.reject()
        } else {
          this.idData = rs.data
          this.$emit('getData', this.idData)
        }
      }).catch(() => {
        // this.$notify({
        //   title: '请求失败',
        //   message: '请启动身份证读卡程序',
        //   type: 'warning'
        // })
        return Promise.reject()
      })
    }
  }
}
</script>
<style scoped>
.icon:hover {
  color: #1c7bef;
}
</style>
