<template>
  <div class="flex_column_full_hidden">
    <ever-bread-crumb :name="objId ? '供应商信息' : '新增供应商'"></ever-bread-crumb>
    <suppler-info :isNew="false" :isClinic="0"></suppler-info>
  </div>
</template>

<script>
import supplerInfo from '@/warehouse/page/supplier.vue'
export default {
  data () {
    return {
      objId: this.$route.params.id,
    }
  },
  components: {
    supplerInfo
  }
}
</script>
