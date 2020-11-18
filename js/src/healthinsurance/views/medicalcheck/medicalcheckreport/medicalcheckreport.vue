<template>
  <layout :menus="menus"></layout>
</template>

<script>
import Layout from '@/healthinsurance/components/layout'
import totalMenus from '@/healthinsurance/views/medicalcheck/medicalcheckreport/menus.js'
export default {
  name: 'medicalcheck',
  components: { Layout },
  data () {
    return {
      menus: totalMenus
    }
  }
}
</script>
