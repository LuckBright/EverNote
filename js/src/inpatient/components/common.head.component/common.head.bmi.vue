<template>
  <chart-widget :itemConfig="itemConfig" :itemData="itemData" :useTransparent="false">
    <template slot="unit"><span></span></template>
    <template slot="chart">
      <popover-sign-chart v-if="itemData.age > 240" type="BMI" :patientId='itemData.patientId' :useTransparent="useTransparent"></popover-sign-chart>
      <popover-standard-sign-chart v-if="itemData.age<=240" :age="itemData.age" type="BMI" :sex="itemData.sex" :birthDay="itemData.birthday | formatDateByExp('YYYY-MM-DD HH:mm:ss')" :patientId='itemData.patientId' :useTransparent="useTransparent"></popover-standard-sign-chart>
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
