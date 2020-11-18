<template>
  <div class="service-detail">
    <el-tabs  v-model="activeName" class="detail-tabs">
      <el-tab-pane label="基本信息" name="1" class="detail-tabs-pannel">
        <service-set-form class="detail-content" :is-router="false" @success="createCb"></service-set-form>
      </el-tab-pane>
      <el-tab-pane label="关联机构" name="2" :disabled="!serviceId" class="detail-tabs-pannel">
        <organization class="detail-org" v-if="serviceId" :service-id="serviceId" route-type="stack"></organization>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import serviceSetForm from '@/sob/page/serviceset.manage/form.vue'
import organization from './organization/index.vue'

export default {
  components: {
    serviceSetForm,
    organization
  },
  data () {
    return {
      activeName: '1',
      serviceId: this.$route.params.id
    }
  },
  methods: {
    createCb (result) {
      if (this.serviceId) {
        let query = this.$route.query
        delete query.rel
        this.$router.push({
          path: this.$route.meta.thirdActiveIndex,
          query
        })
        return
      }
      if (result && result.id) {
        this.$router.push({
          name: 'stackEdit',
          params: {
            id: result.id
          }
        })
      }
    }
  },
  watch: {
    '$route': {
      handler (val) {
        this.serviceId = this.$route.params.id
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .service-detail {
    background-color: #fff;
  }
  .detail-tabs {
    padding-left: 15px;
    height: 100%;
    display: flex;
    flex-direction: column;
    /deep/ .el-tabs__content {
      flex: 1;
    }
  }
  .detail-tabs-pannel {
    height: 100%;
  }
  .detail-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  .detail-org {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    margin-right: 15px;
  }
</style>
