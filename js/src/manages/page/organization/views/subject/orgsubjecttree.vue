<template>
  <subject :subject-org-id="subjectOrgId"></subject>
</template>
<script>
  import Subject from './subject'
  import storage from '@/util/storage'
  export default {
    components: {
      Subject,
    },
    data () {
      return {
        subjectOrgId: storage.getStorageByClinic('CLINICID')
      }
    }
  }
</script>
