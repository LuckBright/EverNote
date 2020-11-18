<template>
  <div>
    <ever-bread-crumb name="关联物资" :showTitle="true" path="/warehouse/materiallists" :pathTo="true"></ever-bread-crumb>
    <div class="layout_inner">
      <custom-relation :systemType="STENCIL_TYPE[0].id" :customTypeName="STENCIL_TYPE[0].name" :customApi="api" :cutomNameCode="SPEC_CODE" :customSearchCode="customSearchCode"></custom-relation>
    </div>
  </div>
</template>
<script>
import { STENCIL_TYPE, SPEC_CODE, SEARCH_CODE, MATERILA_PINYIN_CODE } from '@/util/common'
import api from './store/relationmaterialapi'
import customRelation from '@/warehouse/page/components/whcustomrelation'
export default {
  data () {
    return {
      api,
      STENCIL_TYPE,
      SPEC_CODE
    }
  },
  created () {
    this.customSearchCode = [...MATERILA_PINYIN_CODE, ...SEARCH_CODE]
  },
  methods: {},
  watch: {},
  components: {
    customRelation
  }
}
</script>
<style lang="scss" scoped>
</style>

