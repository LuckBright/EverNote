<template>
  <span>
    <el-link @click="viewPatientInfo">{{itemConfig.value || '--'}}</el-link>
  </span>
</template>
<script>
  export default {
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
      viewPatientInfo () {
        window.open(`${this.$ever.crmIndex}/crm/memberinfo/userinfo/memberbaseinfo/${this.itemData.patientId}`, '_blank')
      },
    }
  }
</script>
<style></style>
