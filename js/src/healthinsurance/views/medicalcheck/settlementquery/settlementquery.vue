<template>
  <layout :menus="menus" :active="activeId"></layout>
</template>

<script>
import Layout from '@/healthinsurance/components/layout'
import totalMenus from '@/healthinsurance/views/medicalcheck/settlementquery/menus.js'
export default {
  name: 'medicalcheck',
  components: { Layout },
  data () {
    return {
      menus: totalMenus,
      activeId: 'outpatientQuery',
      insuranceOrgId: ''
    }
  }
}
</script>
