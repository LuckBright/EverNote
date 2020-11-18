<template>
  <div class="flex_column_full_hidden">
    <ever-bread-crumb name="物资模版" path="/manages/materialtemplets" showTitle="true"></ever-bread-crumb>
    <wh-templet-list :systemType="STENCIL_TYPE[0].id" backEditRoute="/manages/materialtempletedit" :customType="STENCIL_TYPE[0].name" customPath="tempdictionary" propertyPath="tempdictionaryproperty" customPathsee="tempdictionarysee" customPathList="materialtemplets"></wh-templet-list>
  </div>
</template>
<script>
import {STENCIL_TYPE} from '@/util/common'
import whTempletList from '@/warehouse/page/components/whtempletlist.vue'
export default {
  data () {
    return {
      STENCIL_TYPE
    }
  },
  components: {
    whTempletList
  }
}
</script>
<style scoped lang="scss">
.min-high { min-height: 600px}
.right { right: 20px}
.create_template {left: 50%; top: 50%; margin: -44px 0 0 -18px;}
</style>

