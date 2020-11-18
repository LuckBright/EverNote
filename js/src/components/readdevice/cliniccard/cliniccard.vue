<template>
  <span @click="read()">
    <slot>
      <i class="el-input__icon icon iconfont icon-menzhen-yibaoka cBlack mr5"></i>
    </slot>
  </span>
</template>
<script>
import iddata from './sdata.json'
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
      data: {}
    }
  },
  methods: {
    // 身份证
    getLocalData () {
      return new Promise(resolve => {
        resolve(iddata)
      })
    },
    read () {
      if (this.disabled) {
        return
      }
      // 没有真实数据时候可以用本地数据模拟
      // this.getLocalData().then(rs => {
      axios.get('http://127.0.0.1:9999/mingTech/get', {}).then(rs => {
        // if (!rs || (rs.head && rs.head.errCode === 9999)) {
        //   this.$notify({
        //     title: '警告',
        //     message: '请连接身份证读卡器设备并启动读卡识别程序',
        //     type: 'warning'
        //   })
        //   return Promise.reject()
        // }
        if (rs.head && rs.head.errCode !== 0) {
          this.$notify({
            title: rs.head.errMsg,
            message: '请将就诊卡重新放置到读卡器上',
            type: 'warning'
          })
          return Promise.reject()
        } else {
          this.data = rs.data
          console.log(rs.data, 'rs.datars.datars.datars.data')
          this.$notify({
            title: '读取成功',
            message: rs.data,
            type: 'success'
          })
          this.$emit('getData', this.data)
        }
      }).catch(() => {
        // this.$notify({
        //   title: '请求失败',
        //   message: '请启动就诊卡读卡程序',
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
