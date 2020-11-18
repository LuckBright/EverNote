<template>
  <div class="z-order">
    <el-page-header @back="goBack" content="订单详情" class="go-back"></el-page-header>
    <goods-details v-if="!show" :id="id"></goods-details>
    <service-details v-else-if="show" :id="id"></service-details>
  </div>
</template>
<script>
  import GoodsDetails from './goods.details'
  import serviceDetails from './service.details'

  export default {
    components: {
      GoodsDetails,
      serviceDetails,
    },
    data () {
      return {
        show: '',
        id: this.$route.query.id,
      }
    },
    created () {
      this.show = Boolean(Number(this.$route.query.orderType))
    },
    methods: {
      goBack () {
        if (this.$route.query.searchObj) {
          this.$router.push({name: 'manager', query: {searchObj: this.$route.query.searchObj}})
        } else {
          // 跳转分享推广页面
          this.$router.go(-1)
        }
      },
    },
  }
</script>
<style lang="less" scoped>
  .go-back {
    margin-bottom: 20px;
  }
  .z-order {
    margin: 10px;
    overflow: scroll;
  }
</style>
