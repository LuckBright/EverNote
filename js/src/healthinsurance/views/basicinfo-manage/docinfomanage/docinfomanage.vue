<template>
  <layout :menus="totalMenus"></layout>
</template>

<script>
import Layout from '@/healthinsurance/components/layout'
import totalMenus from './menus.js'
export default {
  name: 'docinfomanage',
  components: { Layout },
  data () {
    return {
      totalMenus
    }
  }
}
</script>
