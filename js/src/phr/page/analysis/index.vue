<template>
  <indexcatalog></indexcatalog>
</template>

<script>
import indexcatalog from '@/bi/page/catalog'
export default {
  name: 'index',
  components: {
    indexcatalog
  },
  methods: {
    back () {
      this.$router.push({path: '/phr/chart'})
    }
  }
}
</script>

<style lang="less" scoped>
.phr—main-container {
  margin-left: 200px;
  background: #fff;
  width: auto;
}
.ml200 {
  margin-left: 200px;
}
</style>
