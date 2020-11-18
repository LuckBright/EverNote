<template>
  <div>
    <express-count :typeText="expressObj" type="1"></express-count>
  </div>
</template>

<script>
import expressCount from '../smsrecharge/index'
export default {
  name: 'index',
  components: {
    expressCount
  },
  data () {
    return {
      expressObj: {
        title: '快递账单',
        priceText: '每次查快递单价',
        tableHeadText: '快递查询次数',
        sendTotalText: '查询次数',
        unit: '次',
        type: 3
      }
    }
  }
}
</script>
