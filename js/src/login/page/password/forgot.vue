<template>
  <div class="ever_bg_01 login_bg">
    <div class="ever_box">
      <pwd-form :type="type"></pwd-form>
    </div>
  </div>
</template>
<script>
import pwdForm from '@/login/page/password/form'

export default {
  data () {
    return {
      type: 1
    }
  },
  components: {
    pwdForm
  }
}
</script>
