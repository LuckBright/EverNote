<template>
</template>
<script>
export default {
  data () {
    let path = this.$route.query.path ? this.$route.query.path : '/storages/home'
    this.$router.replace(path)
    return {}
  }
}
</script>
