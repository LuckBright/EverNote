<template>
  <div class="ever_bg_01 login_bg">
    <div class="wel"></div>
  </div>
</template>
<script>
  export default {
    created () {
      let num = localStorage.getItem('showNav')
      if (num === '1') {
        this.$router.push('/titanmall/allinfo')
      } else if (num === '2') {
        this.$router.push('/titanmall/openexplain')
      }
    },
  }
</script>
