<template>
  <div class="flex_column_full_hidden">
    <ever-bread-crumb :name="pathName" :path="routePath" showTitle="true" :pathTo="true"></ever-bread-crumb>
    <wh-tempdictionary :routePath="$route.query.routePath" :customPathList="$route.query.customPathList" :systemType="$route.query.systemType" :propertyPath="$route.query.propertyPath"></wh-tempdictionary>
  </div>
</template>
<script>
import whTempdictionary from '@/warehouse/page/components/whtempdictionary.vue'
import { STENCIL_TYPE, getFirstRoutePath } from '@/util/common'
export default {
  data () {
    return {
      pathName: '新建模版',
      STENCIL_TYPE,
      routePath: `/${getFirstRoutePath(this.$route.path, 1)}/${this.$route.query.customPathList}`
    }
  },
  created () {
    if (this.$route.params.id) this.pathName = '编辑模版'
  },
  components: {
    whTempdictionary
  }
}
</script>
<style scoped>
</style>

