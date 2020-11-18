<template>
  <layout :menus="totalMenus"></layout>
</template>

<script>
import Layout from '@/healthinsurance/components/layout'
import totalMenus from './menus.js'
export default {
  name: 'basicinfoquery',
  components: { Layout },
  data () {
    return {
      totalMenus
    }
  }
}
</script>
