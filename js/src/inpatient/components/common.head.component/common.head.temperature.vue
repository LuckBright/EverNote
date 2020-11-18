<template>
  <chart-widget :itemConfig="itemConfig" :itemData="itemData" :useTransparent="useTransparent">
    <template slot="unit">℃</template>
    <template slot="chart">
      <popover-sign-chart type="BODY_TEMPERATURE" :patientId='itemData.patientId' :useTransparent="useTransparent"></popover-sign-chart>
    </template>
  </chart-widget>
</template>
<script>
  import ChartWidget from '@/inpatient/components/common.head.component/widgets/chart.widget'
  import popoverSignChart from '@/inpatient/components/popover.sign.chart'
  export default {
    components: {
      ChartWidget,
      popoverSignChart,
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
    computed: {
      useTransparent () {
        return !!this.itemData.rule
      }
    },
    data () {
      return {}
    },
    methods: {
    }
  }
</script>
<style></style>
