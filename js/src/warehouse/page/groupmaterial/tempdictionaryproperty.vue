<template>
  <div class="flex_column_full_hidden">
    <ever-bread-crumb name="编辑模版" :path="routePath" showTitle="true" :pathTo="true"></ever-bread-crumb>
    <wh-tempdictionary-property :customPathList="this.$route.query.customPathList" :routePath="this.$route.query.routePath" :systemType="this.$route.query.systemType"></wh-tempdictionary-property>
  </div>
</template>
<script>
import whTempdictionaryProperty from '@/warehouse/page/components/whtempdictionaryproperty.vue'
import {getFirstRoutePath} from '@/util/common'
export default {
  data () {
    return {
      routePath: `/${getFirstRoutePath(this.$route.path, 1)}/${this.$route.query.customPathList}`
    }
  },
  created () {},
  methods: {},
  watch: {},
  components: {
    whTempdictionaryProperty
  }
}
</script>

