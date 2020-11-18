<template>
    <div class='peddingSettlemet flex_layout_full'>
      <settlement-list v-if='showDetail'></settlement-list>
      <settle ref="settled" v-if='!showDetail' :key="$route.query.visitNumber"></settle>
    </div>
</template>
<script>
import settle from '@/rcm/page/outpatientSettlement/settle'
import settlementList from '@/rcm/page/outpatientSettlement/settlementList'
export default {
  data () {
    return {
      showDetail: Number(this.$route.query.showDetail)
    }
  },
  watch: {
    '$route.query': {
      handler: function (val, oldval) {
        this.showDetail = Number(val.showDetail)
      }
    }

  },
  components: {
    settle,
    settlementList
  }
}
</script>
