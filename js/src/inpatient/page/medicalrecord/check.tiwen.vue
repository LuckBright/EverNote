<template>
  <div class="check_tiwen flex_column_full flex_column_full_hidde">
    <temperature-page
      :key="uuid"
      v-if="curPage"
      :total-page="totalPage"
      :cur-page="curPage"
      @query="query"
    >
      <template slot="print">
        <el-button 
          v-if="this.$route.meta && this.$route.meta.prole === 2 && authority !== 1"
          size="mini" 
          type="primary"
          @click="print">打印</el-button>
      </template>
    </temperature-page>
    <div class="flex_col_1_auto">
      <tmp-chart
        ref="temperatureChart"
        :authority="authority"
        :patient-id="patientId"
        :visit-id="visitId"
        :patient-name="patientName"
        @getPageInfo="getPageInfo"
    ></tmp-chart>
    </div>
  </div>
</template>
<script>
import tmpChart from '@/components/temperature.chart/temperaturechart'
import temperaturePage from '@/components/temperature.chart/temperature.page'
import uuidv4 from 'uuid/v4'
export default {
  name: 'check_tiwen',
  components: {
    tmpChart,
    temperaturePage
  },
  props: {
    patientId: {
      type: String
    },
    visitId: {
      type: String
    },
    authority: {
      type: Number,
      default: 2
    },
    patientName: {
      type: String
    }
  },
  data () {
    return {
      uuid: uuidv4(),
      totalPage: null,
      curPage: null
    }
  },
  methods: {
    getPageInfo (obj) {
      this.uuid = uuidv4()
      this.totalPage = obj.totalPage
      this.curPage = obj.currentPage
    },
    query (val) {
      this.$refs.temperatureChart.getChartData(val)
    },
    print () {
      this.$refs.temperatureChart.print()
    }
  }
}
</script>

