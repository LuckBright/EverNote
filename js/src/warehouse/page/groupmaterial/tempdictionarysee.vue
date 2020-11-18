<template>
  <div class="flex_column_full_hidden">
    <ever-bread-crumb name="模版详情" :path="routePath" showTitle="true" :pathTo="true"></ever-bread-crumb>
    <wh-tempdictionary-see :customPathEdit="$route.query.routePath" :systemType="$route.query.systemType" :propertyPath="$route.query.propertyPath" :customPathList="$route.query.customPathList" :customStencilName="stencilName"></wh-tempdictionary-see>
  </div>
</template>
<script>
import {getFirstRoutePath, STENCIL_TYPE} from '@/util/common'
import whTempdictionarySee from '@/warehouse/page/components/whtempdictionarysee.vue'
export default {
  data () {
    return {
      routePath: `/${getFirstRoutePath(this.$route.path, 1)}/${this.$route.query.customPathList}`,
      stencilName: ''
    }
  },
  created () {
    STENCIL_TYPE.forEach(item => {
      if (item.id === Number(this.$route.query.systemType)) {
        this.stencilName = item.name
      }
    })
  },
  methods: {},
  components: {
    whTempdictionarySee
  }
}
</script>

