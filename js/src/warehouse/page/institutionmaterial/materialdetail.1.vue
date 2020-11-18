<template>
  <div>
    <ever-bread-crumb :name="breadCrumbName" :path="path" showTitle="true" :pathTo="true"></ever-bread-crumb>
    <div class="layout_inner">
      <wh-material-form
        v-if="$route.path.indexOf('workspace') > -1"
        :systemType="STENCIL_TYPE[0].id"
        :customApi="materialDictSpuApi"
        :customType="STENCIL_TYPE[0].name"
        :isSearch="true"
        :backListRoute="'/warehouse/materiallists/'"
        :isClinic="true"
      ></wh-material-form>
      <el-tabs class="tabs" v-else v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="物资信息" name="info">
          <wh-material-form
            :systemType="STENCIL_TYPE[0].id"
            :customApi="materialDictSpuApi"
            :customType="STENCIL_TYPE[0].name"
            :isSearch="true"
            :backListRoute="'/warehouse/materiallists/'"
            :isClinic="true"
            :isLocalPrice="true"
          ></wh-material-form>
        </el-tab-pane>
        <el-tab-pane label="应用科室" name="section">
          <wh-material-section :materialSpuId="$route.params.id" :api="materialDictSpuApi"></wh-material-section>
        </el-tab-pane>
        <!-- <el-tab-pane label="过敏设置" name="irritability">
          <wh-material-irritability></wh-material-irritability>
        </el-tab-pane>-->
      </el-tabs>
    </div>
  </div>
</template>
<script>
import materialDictSpuApi from '@/warehouse/page/groupmaterial/store/materialdictspuapi'
// import whMaterialForm from '@/warehouse/page/components/whmaterialform.vue'
import whMaterialForm from '@/manages/components/whmaterialform.vue'
import whMaterialSection from '@/warehouse/page/components/whmaterialsection.vue'
import whMaterialIrritability from '@/warehouse/page/components/wh.material.irritability.vue'
import { STENCIL_TYPE } from '@/util/common'
export default {
  data () {
    return {
      breadCrumbName: this.$route.params.id ? `查看${STENCIL_TYPE[0].name}` : `新建${STENCIL_TYPE[0].name}`,
      materialDictSpuApi,
      STENCIL_TYPE,
      activeName: 'info',
      path: this.$route.path.indexOf('workspace') > -1 ? '/workspace/druglist' : '/warehouse/materiallists'
    }
  },
  methods: {
    // 切换tab
    handleClick () {
    }
  },
  components: {
    whMaterialForm,
    whMaterialSection,
    whMaterialIrritability
  }
}
</script>
