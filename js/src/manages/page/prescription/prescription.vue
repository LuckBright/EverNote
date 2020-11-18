<template>
  <div class="prescription">
    <div class="prescript-list">
      <list @getRowInfo="getServiceId" route-type="prescription"></list>
    </div>
    <div class="prescript-content">
      <organization :service-info="serviceInfo" :service-id="serviceId" route-type="prescription"></organization>
    </div>
  </div>
</template>
<script>
import list from './list/index.vue'
import organization from './organization/index.vue'
export default {
  components: { list, organization },
  data () {
    return {
      name: '',
      serviceInfo: null,
      serviceId: ''
    }
  },
  methods: {
    getServiceId (info) {
      this.serviceInfo = info
      this.serviceId = info.id
    }
  },
}
</script>
<style lang="scss" scoped>
  .prescription {
    background-color: #fff;
    // padding: 10px;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    .prescript-list {
      width: 35%;
      max-width: 500px;
      border-right: 1px solid #ccc;
      background-color: #f8f9fa;
    }
    .prescript-content {
      flex: 1;
      padding: 20px 30px;
    }
  }
</style>
