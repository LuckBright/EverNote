<!-- 住院 支付流水查询  -->
<template>
  <div>
    <payment-flow-query :type="2"></payment-flow-query>
  </div>
</template>
<script>
import paymentFlowQuery from '@/rcm/page/paymentflowquery'
export default {
  components: {
    paymentFlowQuery
  },
  data () {
    return {
    }
  },
  methods: {

  }
}
</script>
<style scoped lang="scss">

</style>
