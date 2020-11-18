<template>
  <el-popover placement="right" width="680" @show="signChartShow(type)" @hide="signChartHide(type)" trigger="click">
      <sign-chart v-if="config[type]" :chart-config="chartTypeConfig[type]" :patient-id="patientId" :sign-type="type"></sign-chart>
<!--      <i slot="reference" class="icon iconfont icon-quxiantu hoverquxian cRed"></i>-->
      <i slot="reference" class="icon iconfont common-head-icon common-head-icon-chart" :class="useTransparent ? 'icon-PHR-quxiantufanbai': 'icon-PHR-quxiantu'"></i>
  </el-popover>
</template>
<script>
import signChart from '@/components/signchart'
let chartTypeConfig = {
  'HEIGHT': {
    'width': 636,
    'height': 380,
    'chartTitle': '身高（cm）',
    'xAxisName': '',
    'yAxisName': ''
  },
  'WEIGHT': {
    'width': 636,
    'height': 380,
    'chartTitle': '体重（KG）',
    'xAxisName': '',
    'yAxisName': ''
  },
  'BMI': {
    'width': 636,
    'height': 380,
    'chartTitle': 'BMI（kg/㎡）',
    'xAxisName': '',
    'yAxisName': ''
  },
  'BODY_TEMPERATURE': {
    'width': 636,
    'height': 380,
    'chartTitle': '体温（℃）',
    'xAxisName': '',
    'yAxisName': ''
  },
  'PULSE': {
    'width': 636,
    'height': 380,
    'chartTitle': '脉搏（bpm）',
    'xAxisName': '',
    'yAxisName': ''
  },
  'BLOOD_PRESSURE': {
    'width': 636,
    'height': 380,
    'chartTitle': '血压（mmHg）',
    'xAxisName': '',
    'yAxisName': ''
  },
  'BLOOD_OXYGEN': {
    'width': 636,
    'height': 380,
    'chartTitle': '血氧（Sp02%）',
    'xAxisName': '',
    'yAxisName': ''
  },
  'BREATHE': {
    'width': 636,
    'height': 380,
    'chartTitle': '呼吸（次/分）',
    'xAxisName': '',
    'yAxisName': ''
  },
  'HEAD': {
    'width': 636,
    'height': 380,
    'chartTitle': '头围（cm）',
    'xAxisName': '',
    'yAxisName': ''
  }
}
export default {
  props: {
    type: String,
    patientId: String,
    useTransparent: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      config: {
        'WEIGHT': false,
        'HEIGHT': false,
        'BMI': false,
        'BODY_TEMPERATURE': false,
        'PULSE': false,
        'BLOOD_PRESSURE': false,
        'BLOOD_OXYGEN': false,
        'BREATHE': false,
        'HEAD': false
      },
      chartTypeConfig: chartTypeConfig
    }
  },
  computed: {
    // localUseTransparent () {
    //   return this.useTransparent
    // }
  },
  methods: {
    signChartShow (type) {
      this.config[type] = true
    },
    signChartHide (type) {
      this.config[type] = false
    }
  },
  components: {
    signChart
  }
}
</script>

