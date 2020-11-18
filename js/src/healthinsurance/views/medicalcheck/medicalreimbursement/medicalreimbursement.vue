<template>
  <layout :menus="totalMenus"></layout>
</template>

<script>
import Layout from '@/healthinsurance/components/layout'
import totalMenus from '@/healthinsurance/views/medicalcheck/medicalreimbursement/menus.js'
export default {
  name: 'medicalcheck',
  components: { Layout },
  data () {
    return {
      totalMenus
    }
  }
}
</script>
