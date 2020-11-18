<template>
  <div>
    <hu-li
      ref="yizhu"
      v-if="showHuli"
      :patient-id="patientId"
      :visit-num="visitNum"
      :quote-type="quoteType"
    ></hu-li>
    <yi-ban
      v-else
      ref="yizhu"
      :patient-id="patientId"
      :visit-num="visitNum"
      :quote-type="quoteType"
    ></yi-ban>
  </div>
</template>
<script>
import yiBan from '@/inpatient/page/quote/component/yibanyizhu'
import huLi from '@/inpatient/page/quote/component/huliyizhu'

export default {
  props: {
    patientId: String,
    visitNum: String,
    quoteType: String,
    curNode: Object
  },
  created () {
    if (this.curNode.code === 'YI_BAN_HU_LI_JI_LU_DAN') {
      this.showHuli = true
    }
  },
  components: {
    yiBan,
    huLi
  },
  data () {
    return {
      showHuli: false
    }
  },
  methods: {
    quote () {
      this.$refs.yizhu.quote(this.curNode.id)
    }
  },
  watch: {}
}
</script>
<style scoped lang="scss"></style>

