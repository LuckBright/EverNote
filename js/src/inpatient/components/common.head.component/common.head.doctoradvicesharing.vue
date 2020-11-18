<template>
  <span>
    <span class="common-head-def-label">{{itemConfig.paramValue}}：</span>
    <span class="common-head-def-value">
      <template v-if="shareInfo === 'ON'">
      <i class="iconfont icon-menzhen-jingshi common-head-icon-info"></i>信息共享服务已开启{{min}}分{{sec}}秒
    </template>
    <template v-else-if="shareInfo === 'OFF'">
      <i class="iconfont icon-menzhen-jingshi common-head-icon-info"></i>信息共享服务暂停使用
    </template>
    <template v-else>
      <i class="iconfont icon-menzhen-jingshi common-head-icon-info"></i>未监测到当前医生站是否启用医嘱共享
    </template>
    </span>
  </span>
<!-- <div v-if="shareInfo === 'ON' && show('doctorAdviceSharing')" class="box">
        </div>
        <div v-if="shareInfo === 'OFF'  && show('doctorAdviceSharing')" class="box">
          <i class="iconfont icon-menzhen-jingshi"></i>信息共享服务暂停使用
        </div>
        <div v-else-if="shareInfo === ''  && show('doctorAdviceSharing') && obj.medPersonInfo" class="box">
          <i class="iconfont icon-menzhen-jingshi"></i>未监测到当前医生站是否启用医嘱共享
        </div> -->
</template>
<script>
import api from '@/workspace/store/mainheaderapi'

export default {
  props: {
    icno: {
      type: String,
      default: ''
    },
    itemConfig: {
      type: Object
    },
    itemData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      shareInfo: '',
      timeOut: '',
    }
  },
  watch: {
    'timeOut': function (val) {
      setInterval(() => {
        this.getShareInfo() // zht edit 2018 817
        this.getTimeOut()
      }, 1000 * val * 60)
      const TIME_COUNT = 59
      if (!this.timer) {
        this.sec = TIME_COUNT
        this.min = val - 1
        if (this.min > 0) {
          this.timerSec = setInterval(() => {
            if (this.sec > 0 && this.sec <= TIME_COUNT) {
              this.sec--
            } else {
              this.sec = TIME_COUNT
            }
          }, 1000)
        }
        this.timerMin = setInterval(() => {
          if (this.min > 0 && this.min <= val) {
            this.min--
          } else {
            this.min = val - 1
          }
        }, 60 * 1000)
      }
    }
  },
  methods: {
    getShareInfo () { // 医嘱共享
      api.getShareInfo().then(res => {
        if (res.head.errCode === 0 && res.data.length > 0) {
          if (res.head.errCode !== 0) {
            this.$message.error('未监测到当前医生站是否启用医嘱共享')
          } else if (res.head.errCode === 0 && res.data.length > 0) {
            this.shareInfo = res.data[0].parameterValue
            if (res.data[0].parameterValue === 'ON') {
              this.getClinicList()
            } else if (res.data[0].parameterValue === 'OFF') {
              this.getTradeList('')
            }
          }
        }
      })
    },
    getClinicList () { // 读取社保卡
      api.getClinicList(this.icno).then(result => {
        // 根据返回值修改参数
        var _string = (result.head.errCode === 0) ? result.data : ''
        this.getTradeList(_string)
      }).catch(err => {
        console.log(err, '接口异常，前端捕获')
        this.getTradeList('')
      })
    },
    getTradeList (string) {  // 社保卡保存
      let params = {}
      if (string) {
        params = {
          icNo: this.icno,
          enable: this.shareInfo,
          clinicHistoryTrade: string
        }
      } else {
        params = {
          icNo: this.icno,
          enable: this.shareInfo
        }
      }
      // 方法无用，没有组件内处理这个返回值。重新开发的时候注意这块。
      api.getTradeList(params).then(res => {
        this.$emit('getdata', new Date())
      })
    },
    getTimeOut () {  // 医嘱共享时间
      api.getTimeout().then(res => {
        this.timeOut = (res.data.length > 0 && res.data[0].parameterValue) ? res.data[0].parameterValue : ''
      })
    },
  },
  created () {
    this.getShareInfo()
  }
}
</script>
