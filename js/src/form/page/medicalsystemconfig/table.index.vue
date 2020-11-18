<template>
  <div class="h">
    <medical-config v-if="type === 'medicalIndex'" :org="org"></medical-config>
    <temperature-config v-if="type === 'temperatureList'" :org="org"></temperature-config>
    <time-config v-if="type === 'timeControl'" :org="org"></time-config>
    <auto-config v-if="type === 'autoArchive'" :org="org"></auto-config>
    <nursing-config v-if="type === 'nursingRecord'" :org="org"></nursing-config>
    <medical-write v-if="type === 'medicalWrite'" :org="org"></medical-write>
    <medical-recall-config v-if="type === 'medicalRecall'" :org="org"></medical-recall-config>
  </div>
</template>

<script>
  import MedicalConfig from './medical.config'
  import TemperatureConfig from './temperature.config'
  import TimeConfig from './time.config'
  import AutoConfig from './auto.config'
  import nursingConfig from './nursing.config'
  import MedicalWrite from './write.config'
  import MedicalRecallConfig from './medicalrecall.config'
  
  export default {
    props: {
      type: {
        type: String,
        default: 'medicalIndex'
      },
      org: {
        type: Boolean,
        default: false
      }
    },
    components: {
      MedicalConfig,
      TemperatureConfig,
      TimeConfig,
      AutoConfig,
      nursingConfig,
      MedicalWrite,
      MedicalRecallConfig
    }
  }
</script>

<style scoped lang="scss">
  .h {
    height: 100%;
  }
</style>
