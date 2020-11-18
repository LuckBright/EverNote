<template>
  <div class="flex_column_full_hidden">
    <ever-bread-crumb name="关联模版" path="/manages/materialtemplets" :showTitle="true" :pathTo="true"></ever-bread-crumb>
    <wh-templet-edit-list
      :isShowQuery="true"
      :systemType="STENCIL_TYPE[0].id"
      backListRoute="/manages/materialtemplets"
      :customType="STENCIL_TYPE[0].name"
      customPathsee="tempdictionarysee"
      customPathList="materialtempletedit">
    </wh-templet-edit-list>
  </div>
</template>
<script>
import {STENCIL_TYPE} from '@/util/common'
import whTempletEditList from '@/warehouse/page/components/whtempleteditlist.vue'
export default {
  data () {
    return {
      STENCIL_TYPE
    }
  },
  components: {
    whTempletEditList
  }
}
</script>
<style lang="scss" scoped>
//  @import 'src/drugs/page/things/assets/style';
 .check_all { left: 25px; top: 10px}
</style>

