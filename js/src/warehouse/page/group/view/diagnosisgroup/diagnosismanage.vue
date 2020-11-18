<template>
    <div id="group_d" class="oa">
      <!-- 诊断分组管理 -->
       <diagnosisgroup :deptId="'group'"></diagnosisgroup>
    </div>
</template>
<script>
import diagnosisgroup from '@/sob/components/diagnosisgroup'
export default {
  data () {
    return {}
  },
  components: {
    diagnosisgroup
  }
}
</script>
<style scoped>
#group_d{margin-top:10px;}
</style>

