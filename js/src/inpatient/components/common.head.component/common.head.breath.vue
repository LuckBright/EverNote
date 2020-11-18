<template>
  <chart-widget :itemConfig="itemConfig" :itemData="itemData">
    <template>
      {{itemConfig.value === 'R' ? '' : (itemConfig.value || '--')}}
    </template>
    <template slot="unit">
      <span v-if="itemConfig.value === 'R'">
        <i class="icon iconfont icon-huxiji"></i>
      </span>
      <span v-else>次/分</span>
    </template>
    <template slot="chart">
      <popover-sign-chart type="BREATHE" :patientId='itemData.patientId' :useTransparent="useTransparent"></popover-sign-chart>
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
