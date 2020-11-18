<template>
  <layout :menus="menus"></layout>
</template>

<script>
import Layout from '@/healthinsurance/components/layout'
import totalMenus from './menus.js'
export default {
  name: 'settlementreport',
  components: { Layout },
  data () {
    return {
      menus: totalMenus,
    }
  }
}
</script>
