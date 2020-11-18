<template>
  <chart-widget :itemConfig="itemConfig" :itemData="itemData">
    <template>
      <span :class="['blood-pressure systolic-pressure', 'systolic-pressure-' + itemData.rule.systolicPressure, 'blood-pressure' + (itemData.rule.systolicPressure === 0 ? '' : '-exception')]">
        {{parsedValue.systolicPressure || '--'}}mmHG
        <i v-if="itemData.rule.systolicPressure === 1" class="icon iconfont icon-jiantou1 common-head-exception-icon up"></i>
        <i v-if="itemData.rule.systolicPressure === -1" class="icon iconfont icon-jiantou-xiangxia common-head-exception-icon down"></i>
      </span>
      -
      <span :class="['blood-pressure diastolic-pressure', 'diastolic-pressure-' + itemData.rule.diastolicPressure, 'blood-pressure' + (itemData.rule.diastolicPressure === 0 ? '' : '-exception')]">
        {{parsedValue.diastolicPressure || '--'}}mmHG
        <i v-if="itemData.rule.diastolicPressure === 1" class="icon iconfont icon-jiantou1 common-head-exception-icon up"></i>
        <i v-if="itemData.rule.diastolicPressure === -1" class="icon iconfont icon-jiantou-xiangxia common-head-exception-icon down"></i>
      </span>
    </template>
<!--    <template slot="unit">mmHG</template>-->
    <template slot="chart">
      <popover-sign-chart type="BLOOD_PRESSURE" :patientId='itemData.patientId'></popover-sign-chart>
    </template>
  </chart-widget>
</template>
<script>
  import ChartWidget from '@/inpatient/components/common.head.component/widgets/chart.widget'
  import popoverSignChart from '@/inpatient/components/popover.sign.chart'
  import popoverStandardSignChart from '@/inpatient/components/popover.standard.sign.chart'
  export default {
    // {"systolicPressure":"120","diastolicPressure":"90"}
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
      parsedValue () {
        return this.itemConfig.value ? JSON.parse(this.itemConfig.value) : {}
      },
      rule () {
        return this.itemData.rule || {}
      }
    }
  }
</script>
<style></style>
