<template>
  <div class="ever_template_quote" style="padding: 20px">
      <tpl-tabs
          :key="designerId+schemaId"
          :patient-id="$route.query.patientId"
          :visit-id="$route.query.visitSn"
          :dpt-id="dptId"
          :designer-id="designerId"
          :template-id="schemaId"
          :code="code"
          scene="clinic"
        ></tpl-tabs>
  </div>
</template>
<script>
import { MEN_ZHEN_BING_LI } from '@/workspace/common/config'
import tplTabs from '@/inpatient/components/tpl.tabs'
import storage from '@/util/storage'
export default {
  props: ['dptId', 'schemaId'],
  data () {
    return {
      id: '',
      designerId: '1',
      code: storage.getLocalStorage('MEN_ZHEN_BING_LI_MU_BAN_CODE') || MEN_ZHEN_BING_LI
    }
  },
  created () {
    this.$bus.$on('MEN_ZHEN_BING_LI_MU_BAN', (code, id) => {
      this.id = String(id)
      this.code = code
      storage.setLocalStorage('MEN_ZHEN_BING_LI_MU_BAN_CODE', this.code)
    })
    this.$bus.$on('menzhenbingli:designerId', val => {
      this.designerId = val
    })
  },
  components: {
    tplTabs
  }
}
</script>
<style lang="scss" scoped>
// .ever_template_quote {
//   .el-tabs--border-card {
//     box-shadow: none;
//   }
// }
</style>

