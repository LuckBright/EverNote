<template>
  <div class="tmpChart flex_column_full flex_column_full_hidden">
    <tmp-chart 
    class="flex_col_1_auto"
    :visitId="visitId" 
    :patientId="patientId"></tmp-chart>
  </div>
</template>
<script>
import tmpChart from '@/components/temperature.chart/temperaturechart'
export default {
  name: 'temChart',
  data () {
    return {
      visitId: this.$route.query.hospitalizedNumber,
      patientId: this.$route.query.patientId
    }
  },
  mounted () {
  },
  components: {
    tmpChart
  }
}
</script>
<style lang="scss" scoped>
.tmpChart {
  background: #fff;
  // min-height: 740px;
}
</style>

