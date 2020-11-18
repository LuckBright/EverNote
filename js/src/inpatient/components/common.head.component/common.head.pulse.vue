<template>
  <chart-widget :itemConfig="itemConfig" :itemData="itemData">
    <template>{{parsedValue.pulse || '--'}}</template>
    <template slot="unit">bpm
    <i class="icon iconfont icon-qiboqi" v-if="parsedValue.checked"></i>
    </template>
    <template slot="chart">
      <popover-sign-chart type="PULSE" :patientId='itemData.patientId' :useTransparent="useTransparent"></popover-sign-chart>
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
      return {
      }
    },
    methods: {
    },
    computed: {
      parsedValue () {
        const value = this.itemConfig.value ? JSON.parse(this.itemConfig.value) : ''
        if (value.checked !== undefined) {
          return {
            checked: value.checked,
            pulse: value.pulse,
          }
        } else {
          return {
            checked: false,
            pulse: this.itemConfig.value,
          }
        }
      },
      useTransparent () {
        return !!this.itemData.rule
      }
    }
  }
</script>
<style></style>
