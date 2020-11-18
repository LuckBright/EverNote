<template>
<div class="flex_layout_full">
  <div class="layout_inner">
    <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="召回申请" name="first">
      <recall-apply v-if="activeName==='first'"></recall-apply>
    </el-tab-pane>
    <el-tab-pane label="召回记录" name="second">
      <recall-log v-if="activeName==='second'"></recall-log>
    </el-tab-pane>
  </el-tabs>
  </div>
</div> 
</template>

<script>
  import recallApply from '@/inpatient/page/medicalrecord/recall.apply'
  import recallLog from '@/inpatient/page/medicalrecord/recall.log'
  export default {
    name: 'record_recall',
    components: {
      recallApply,
      recallLog
    },
    data () {
      return {
      }
    },
    computed: {
      activeName: {
        get (val) {
          return this.$store.state.recallType || 'first'
        },
        set (val) {
          this.$store.commit('setRecall', val)
        }
      }
    },
    methods: {
      handleClick (tab, event) {
        this.$store.commit('setRecall', tab.name)
      }
    }
  }
</script>

<style lang="scss" scoped>
.layout_inner{
  width:100%;
}
</style>
