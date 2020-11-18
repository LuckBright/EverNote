<template>
  <!-- <dis-see></dis-see> -->
  <div>
    <ever-bread-crumb :name="breadCrumbName" :path="path" showTitle="true" :pathTo="true"></ever-bread-crumb>
    <wh-material-form
      class="flex_col_1_auto"
      :systemType="enumConfig.STENCIL_TYPE[0].id"
      :customType="enumConfig.STENCIL_TYPE[0].name"
      :isClinic="true"
      :isSearch="true"
      :isEdit="true"
      :isLocalPrice="true"
      :backListRoute="path">
    </wh-material-form>
  </div>
</template>
<script>
// import disSee from '@/warehouse/page/groupmaterial/dictionarysee.vue'
import whMaterialForm from '@/manages/components/whmaterialform.vue'
import * as enumConfig from '@/util/common'
export default {
  data () {
    return {
      enumConfig,
      breadCrumbName: `查看${enumConfig.STENCIL_TYPE[0].name}`,
      path: ''
    }
  },
  created () {
    if (this.$route.path.indexOf('workspace') > -1) {
      this.path = '/workspace/druglist'
      return
    }
    if (enumConfig.getFirstRoutePath(this.$route.path, 1) === 'group') {
      this.path = '/group/materials'
    } else if (enumConfig.getFirstRoutePath(this.$route.path, 1) === 'warehouse' && this.$route.query.source === 'local') {
      this.path = '/warehouse/relationmaterial'
    } else {
      this.path = '/warehouse/materiallists'
    }
  },
  components: {
    whMaterialForm
  }
}
</script>

