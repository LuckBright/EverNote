<template>
  <div class="layout_inner flex outer">
    <classification-tree :customApi="api" :customClassifyId="queryObj.materialSpuId"></classification-tree>
  </div>
</template>
<script>
import classificationTree from '@/warehouse/page/components/classificationtree'
import api from '@/warehouse/page/group/store/pharmacologyapi'
import list from '@/util/list'
let querySchema = [
  {
    name: 'materialSpuId',
    label: '',
    comp: 'custom'
  }
]
export default {
  mixins: [list],
  data () {
    let obj = this.$ever.createObjFromSchema(querySchema)
    return {
      api,
      querySchema,
      queryObj: obj
    }
  },
  created () { },
  methods: {},
  watch: {},
  components: {
    classificationTree,
  }
}
</script>
<style lang="scss" scoped>
@import './src/warehouse/page/group/view/organization/index.scss';
</style>
