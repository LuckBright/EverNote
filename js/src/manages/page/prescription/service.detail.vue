<template>
  <div class="service-detail">
    <el-tabs  v-model="activeName" class="detail-tabs">
      <el-tab-pane label="基本信息" name="1" class="detail-tabs-pannel">
        <service-manage-create class="detail-content" :is-router="false" v-if="!serviceId" @success="createCb"></service-manage-create>
        <service-manage-edit class="detail-content" :is-router="false" :after-save-callback="afterSaveCallback" @serviceSuccess="getInfo" v-else></service-manage-edit>
      </el-tab-pane>
      <el-tab-pane label="关联机构" name="2" :disabled="!serviceId || !serviceInfo.id" class="detail-tabs-pannel">
        <organization class="detail-org" v-if="serviceId && serviceInfo.id" :is-edit="true" :service-id="serviceId" :service-info="serviceInfo" route-type="prescription"></organization>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import ServiceManageCreate from '@/sob/page/service.manage/create.form'
import ServiceManageEdit from '@/sob/page/service.manage/edit.form'
import organization from './organization/service.org.vue'

export default {
  components: {
    ServiceManageCreate,
    ServiceManageEdit,
    organization
  },
  data () {
    return {
      activeName: this.$route.query.rel || '1',
      serviceId: this.$route.params.id,
      serviceInfo: {}
    }
  },
  methods: {
    createCb (result) {
      if (result && result.id) {
        this.$router.push({
          name: 'prescriptionEdit',
          params: {
            id: result.id
          },
          query: {
            rel: '2'
          }
        })
      }
    },
    getInfo (info) {
      this.serviceInfo = info
      this.activeName = this.$route.query.rel || '1'
    },
    afterSaveCallback () {
      let query = this.$route.query
      delete query.rel
      this.$router.push({
        path: this.$route.meta.thirdActiveIndex,
        query
      })
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
    height: 100%;
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
