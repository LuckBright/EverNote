<template>
  <div class="prescription">
      <div v-if="routeType === 'prescription'|| routeType === 'stack'" class="prescript-list">
        <list @getRowInfo="getServiceId" :route-type="routeType === 'stack' ? 'stack' : 'prescription'" :key='key'></list>
      </div>
      <div v-else class="prescript-list-new">
        <list-concise @getRowInfo="getServiceId" :route-type="routeType === 'stackconcise' ? 'stack' : 'prescription'" :key='key'></list-concise>
      </div>
      <div v-if="routeType === 'stack' || routeType === 'prescription'" class="prescript-content">
        <organization :service-info="serviceInfo" :service-id="serviceId" :route-type="routeType" :key='key'></organization>
      </div>
  </div>
</template>
<script>
// 医嘱字典分为医嘱项管理、组套管理、医嘱项管理（简洁）、组套管理（简洁）根据路由routeType进行区分
import list from './list/index.vue'
import listConcise from './list/index.concise.vue'
import organization from './organization/index.vue'
export default {
  components: { list, organization, listConcise },
  data () {
    return {
      name: '',
      serviceInfo: null,
      serviceId: '',
      routeType: this.$route.meta.routeType,
      key: ''
    }
  },
  methods: {
    getServiceId (info) {
      this.serviceInfo = info
      this.serviceId = info.id
    }
  },
  watch: {
    $route (to) {
      this.routeType = to.path.split('/')[2]
      this.key = new Date() + ''
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
    .prescript-list-new {
      width: 100%;
      border-right: 1px solid #ccc;
      background-color: #f8f9fa;
    }
    .prescript-content {
      flex: 1;
      padding: 20px 30px;
    }
  }
</style>
