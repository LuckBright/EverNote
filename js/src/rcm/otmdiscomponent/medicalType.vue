<!--本组件提供不同医保机构医疗类别的封装-->
<template>
  <div class="medicalType">
    <div class="labelText">医疗类别:</div>
    <ever-select
      :options="MedicalTypeOptions"
      v-model="medicalType"
      @select="handleSelect"
      :disabled="true"
      :width="'120px'"
    ></ever-select>
  </div>
</template>

<script>
// 黑龙江医保
import { medicalType as hljMedicalTypeOptions } from '@/rcm/otmdiscomponent/config-js/hlj-base-config.js'
import { medicalType as jljhMedicalTypeOptions } from '@/rcm/otmdiscomponent/config-js/jljh-regInfo-config.js'
import { hljybCode, jljhCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
export default {
  props: ['value', 'insuranceOrgId'],
  methods: {
    handleSelect (val) {
      this.$emit('input', val)
    }
  },
  computed: {
    medicalType: {
      get () {
        return this.value
      },
      set (newVal, oldValue) {
        if (newVal !== oldValue) {
          this.$emit('input', newVal)
        }
      }
    },
    MedicalTypeOptions: {
      get () {
        switch (this.insuranceOrgId) {
          case hljybCode:
            return hljMedicalTypeOptions
          case jljhCode:
            return jljhMedicalTypeOptions
          default:
            return hljMedicalTypeOptions
        }
      }
    }
  }
}
</script>
<style scoped>
.medicalType {
  float: left;
  line-height: 36px;
  padding: 10px 0;
  margin-left: 15px;
}
.medicalType .labelText {
  display: inline-block;
  font-size: 14px;
}
</style>
