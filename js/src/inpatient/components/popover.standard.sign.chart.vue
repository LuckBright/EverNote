<template>
  <el-popover placement="right" width="680" @show="signChartShow(type)" @hide="signChartHide(type)" trigger="click">
    <div class="roll_bar">
      <standard-sign-chart :sex="Number(sex)" :birthDay="birthDay" v-if="config[type]" :patient-id="patientId" :signType="type" :key="type+'WHO'" chartType="WHO"></standard-sign-chart>
      <standard-sign-chart :sex="Number(sex)" :birthDay="birthDay" v-if="config[type]" :patient-id="patientId" :key="type+'CDC'" :signType="type" chartType="CDC"></standard-sign-chart>
    </div>
<!--      <i slot="reference" class="icon iconfont icon-quxiantu hoverquxian cRed"></i>-->
    <i slot="reference" class="icon iconfont common-head-icon common-head-icon-chart" :class="useTransparent ? 'icon-PHR-quxiantufanbai': 'icon-PHR-quxiantu'"></i>
  </el-popover>
</template>
<script>
import standardSignChart from '@/components/standard.sign.chart'
export default {
  props: {
    type: String,
    patientId: String,
    sex: Number,
    birthDay: String,
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
      age: ''
    }
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
    standardSignChart
  }
}
</script>
<style scoped lang='scss'>
.roll_bar {
  height: 400px;
  overflow-y: scroll;
  padding-bottom: 60px;
}
.roll_bar::-webkit-scrollbar {
  -webkit-appearance: none; width: 5px;
}
.roll_bar::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: #e5e5e5;
  }
</style>

