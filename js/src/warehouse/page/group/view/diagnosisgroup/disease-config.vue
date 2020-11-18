<template>
  <div style="display: block; margin:0 auto; max-width: 1000px">
    <disease-config v-if="currentOrgInfo"  @close="closeConfig()" :orgInfo="currentOrgInfo"></disease-config>
  </div>
</template>

<script>
import diseaseConfig from '@/warehouse/page/group/view/diagnosisgroup/disease-config-base'
import storage from '@/util/storage'
export default {
  components: {
    diseaseConfig
  },
  created () {
    this.currentOrgInfo = {
      id: this.$store.state.currentUser.organizationId,
      tenantId: JSON.parse(storage.getLocalStorage('TENANTDATA')).tenantId,
    }
  },
  data () {
    return {
      currentOrgInfo: null
    }
  },
  methods: {
    closeConfig () {}
  }
}
</script>

