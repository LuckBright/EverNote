<template>
  <div>
    <phrform :data-id="data.dataId" :template-id="data.templateId" v-if="data.designerId=='1'" :key="data.dataId" class="phrform"></phrform>
    <phrdoc :data-id="data.dataId" :template-id="data.templateId" v-if="data.designerId=='2'" :key="data.dataId"></phrdoc>
    <bingan v-if="data.code==code" :org-id="data.item.orgId" :tenant-id="data.item.tenantId" :visit-id="data.item.visitSerialNumber" :dpt-id="data.item.visitInpatientTenantSubjectId" :patient-id="$route.query.patientId"></bingan>
  </div>
</template>
<script>
  import phrdoc from './phrdoc'
  import phrform from './phrform'
  import bingan from '@/components/medicalindex/phrindex'
  export default {
    props: ['data'],
    data () {
      return {
        code: 'ZHU_YUAN_BING_AN_SHOU_YE'
      }
    },
    components: {
      phrdoc,
      phrform,
      bingan
    },
    created () {
    }
  }
</script>
<style scoped>
  .phrform {
    background-color: #fff;
    padding: 20px;
  }
</style>
