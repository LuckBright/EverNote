<template>
  <div>
    <el-row type="flex" align="middle" justify="start" class="table_title">
      <el-col :span="24">
        <span>处方单号：{{patientData.code}}</span>
        <span class="ml20">{{patientData.createTime}}</span>
        <el-button size="small" type="primary" class="is-plain">标记异常</el-button>
      </el-col>
    </el-row>
    <wast-prescription :patientData="patientData.outpatientDispenseItemList"></wast-prescription>
  </div>
</template>

<script>
import wastPrescription from '../components/west.prescription.vue'
export default {
  props: {
    patientData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
    }
  },
  created () {

  },
  methods: {

  },
  components: {
    wastPrescription
  }
}
</script>
