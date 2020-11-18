<template>
  <div class="page_layout_full_hidden drugstore" :class="{autohg: auditData}">
    <page-html
      @notify-receive="notifyReceive"
      :outpaitent="true"
      :wmSprescribe="true"
      :audit-data="auditData"
      :not-current-mark="notCurrentMark"></page-html>
  </div>
</template>

<script>
import pageHtml from '@/warehouse/views/drug/multilibrary/audit/index.vue'
export default {
  props: {
    notCurrentMark: Boolean,
    auditData: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    pageHtml
  },
  methods: {
    notifyReceive () {
      this.$emit('notify-receive')
    }
  }
}
</script>
<style lang="scss" scoped>
.autohg{
  height: auto;
}
</style>
