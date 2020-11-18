<template>
  <layout :menus="totalMenus"></layout>
</template>

<script>
import Layout from '@/healthinsurance/components/layout'
import totalMenus from './menus.js'
export default {
  name: 'operatorInfoManage',
  components: { Layout },
  data () {
    return {
      totalMenus
    }
  }
}
</script>
