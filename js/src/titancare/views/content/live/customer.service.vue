<!--  -->
<template>
  <div class="customer-service">
    <div class="list">
      <customer-list @change="changeObj" ref="list"></customer-list>
    </div>
    <div class="im">
      <im-el :obj="obj" @init="getList"></im-el>
    </div>
  </div>
</template>

<script>
import customerList from '@/titancare/views/content/live/customer/list'
import imEl from '@/titancare/views/content/live/customer/im'
export default {
  props: { },
  data () {
    return {
      obj: {}
    }
  },

  components: {
    customerList,
    imEl
  },

  computed: {},

  mounted () {},

  methods: {
    changeObj (obj) {
      this.obj = obj
    },
    getList (account) {
      this.$refs.list.init(account)
    }
  }
}

</script>
<style lang='scss' scoped>
.customer-service {
  display: flex;
  height: calc(100vh - 115px);
  box-sizing: border-box;
  .list {
    width: 320px;
    height: 100%;
  }
  .im {
    flex: 1;
    height: 100%;
  }
}
</style>
