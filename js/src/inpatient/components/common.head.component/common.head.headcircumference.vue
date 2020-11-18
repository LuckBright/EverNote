<template>
  <chart-widget :itemConfig="itemConfig" :itemData="itemData">
    <template slot="unit">cm</template>
    <template slot="chart">
      <popover-standard-sign-chart v-if="itemData.age<=60" :age="itemData.age" type="HEAD" :sex="itemData.sex" :birthDay="itemData.birthday | formatDateByExp('YYYY-MM-DD HH:mm:ss')" :patientId='itemData.patientId'></popover-standard-sign-chart>
      <span v-else></span>
    </template>
  </chart-widget>
</template>
<script>
  import ChartWidget from '@/inpatient/components/common.head.component/widgets/chart.widget'
  import popoverStandardSignChart from '@/inpatient/components/popover.standard.sign.chart'
  export default {
    components: {
      ChartWidget,
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
    }
  }
</script>
<style></style>
