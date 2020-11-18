<template>
  <chart-widget :itemConfig="itemConfig" :itemData="itemData" :useTransparent="false">
    <template slot="unit">Sp02(%)</template>
    <template slot="chart">
      <popover-sign-chart type="BLOOD_OXYGEN" :patientId='itemData.patientId' :useTransparent="useTransparent"></popover-sign-chart>
    </template>
  </chart-widget>
</template>
<script>
  import ChartWidget from '@/inpatient/components/common.head.component/widgets/chart.widget'
  import popoverSignChart from '@/inpatient/components/popover.sign.chart'
  import popoverStandardSignChart from '@/inpatient/components/popover.standard.sign.chart'
  export default {
    components: {
      ChartWidget,
      popoverSignChart,
      popoverStandardSignChart,
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
    },
    computed: {
      useTransparent () {
        return !!this.itemData.rule
      }
    }
  }
</script>
<style></style>
