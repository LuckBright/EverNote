<template>
  <div class="service-manage">
    <el-radio-group v-model="listType" size="small" class="list-type">
        <el-radio-button :label="0">树形列表</el-radio-button>
        <el-radio-button :label="1">普通列表</el-radio-button>
    </el-radio-group>
    <div class="prescription" v-if="listType === 0">
      <div class="prescript-list">
        <list @getRowInfo="getServiceId" route-type="prescription"></list>
      </div>
      <div class="prescript-content">
        <organization :service-info="serviceInfo" :service-id="serviceId" route-type="prescription"></organization>
      </div>
    </div>
    <list-concise  @getRowInfo="getServiceId" route-type="prescription" v-else-if="listType === 1"></list-concise>
  </div>
</template>
<script>
import list from './list/index.vue'
import organization from './organization/service.org.vue'
import listConcise from './list/index.concise.vue'
import storage from '@/util/storage'

export default {
  components: { list, organization, listConcise },
  data () {
    return {
      name: '',
      serviceInfo: null,
      serviceId: '',
      listType: +storage.getSessionStorage('listType') || 0
    }
  },
  methods: {
    getServiceId (info) {
      this.serviceInfo = info
      this.serviceId = info.id
    }
  },
  watch: {
    'listType' (val) {
      this.$router.push({
        query: {}
      })
      storage.setSessionStorage('listType', val)
    }
  }
}
</script>
<style lang="scss" scoped>
.service-manage {
  position: relative;
  .list-type {
    position: absolute;
    right: 10px;
    top: 10px;
  }
}
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
