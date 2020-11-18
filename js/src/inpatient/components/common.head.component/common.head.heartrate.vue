<template>
  <chart-widget :itemConfig="itemConfig" :itemData="itemData">
    <template slot="unit">次/分</template>
    <template slot="chart">
      <span></span>
    </template>
  </chart-widget>
</template>
<script>
  import ChartWidget from '@/inpatient/components/common.head.component/widgets/chart.widget'
  export default {
    components: {
      ChartWidget,
    },
    props: {
      itemConfig: {
        type: Object,
      },
      itemData: {
        type: Object,
        default () {
          return {}
        }
      },
    },
    data () {
      return {}
    },
    methods: {
    }
  }
</script>
<style></style>
