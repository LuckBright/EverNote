<template>
  <layout :menus="menus"></layout>
</template>

<script>
import Layout from '@/healthinsurance/components/layout'
import menus from './menus.js'
export default {
  name: 'controlInfoQuery',
  components: { Layout },
  data () {
    return {
      menus
    }
  }
}
</script>
