<template>
  <!-- 收件信息 -->
  <div>
    <div class="receipt-info" v-if="mailObj.mailFlag && mailObj.mailAddressObject">
    <div class="fl">
      <el-tooltip content="邮寄" placement="top">
      <svg class="icon f18" aria-hidden="true">
        <use xlink:href="#icon-youji"></use>
      </svg>
    </el-tooltip>
    </div>
    <div class="ml20 fl receipt" v-if="mailObj.mailAddressObject.name">
      <span>收件人姓名: </span>
      <span>{{mailObj.mailAddressObject.name}}</span>
    </div>
    <div class="ml20 fl receipt" v-if="mailObj.mailAddressObject.mobile">
      <span>收件人电话: </span><span>{{mailObj.mailAddressObject.mobile}}</span>
    </div>
    <div class="ml20 fl receipt" v-if="mailObj.mailAddressObject.address">
      <span>收件人地址: </span><span>{{mailObj.mailAddressObject._address}}</span>
    </div>
    <div class="ml20 fl receipt" v-if="mailObj.mailAddressObject.comment">
      <span>备注: </span><span>{{mailObj.mailAddressObject.comment}}</span>
    </div>
  </div>
  </div>
  
</template>

<script>
import citys from '@/util/citys'
export default {
  props: ['itemData'],
  data () {
    return {
      citys,
      mailObj: {}
    }
  },
  watch: {
    'itemData': {
      async handler (v) {
        let obj = {}
        let arr = []
        arr = v.outpatientDispenseList ? v.outpatientDispenseList : v
        if (!Array.isArray(arr)) return
        let index = arr.findIndex(item => item.mailAddressObject && item.mailFlag)
        obj = arr[index]
        obj.mailAddressObject._address = await this.citys.getCityName1(obj.mailAddressObject.address)
        this.mailObj = obj
      },
      deep: true,
      immediate: true
    }
  }
}

</script>
<style scoped>
.receipt-info {
  height: 30px;
  line-height: 30px;
  padding: 5px 15px;
}
.receipt {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #000000;
}
.ml6 {
  margin-left: 6px;
}
</style>
