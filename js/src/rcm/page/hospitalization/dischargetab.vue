<template>
  <div class="deposite">
    <!-- 押金管理 -->
    <deposit-manage @refresh="refresh"></deposit-manage>
  </div>
</template>
<script>
import depositManage from '@/rcm/page/hospitalization/depositmanage'
export default {
  components: {
    depositManage
  },
  data () {
    return {

    }
  },
  methods: {
    refresh (val) {
      this.$emit('refresh', val)
    }
  }
}
</script>
<style scoped>
.deposite {
  overflow: auto;
}
</style>

