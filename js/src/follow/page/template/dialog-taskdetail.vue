<template>
  <el-dialog
    :visible.sync="visible"
    class="ui_dialog_0 follow-task-detail"
    width="1200px"
    :close-on-click-modal="false"
    append-to-body
  >
    <template slot="title">
      <i
        data-v-f4a6a122=""
        class="el-icon-arrow-left"
        @click="cancelInner"
      ></i>
      <span class="fz14">{{dialogName || ''}}</span>
    </template>
    <follow-taskdetail
      :id="id"
      :isOpen="visible"
    ></follow-taskdetail>
  </el-dialog>
</template>
<script>
import followTaskdetail from '@/follow/page/task/followtaskdetail.vue'
export default {
  props: ['patientObj', 'dialogName'],
  components: {
    followTaskdetail
  },
  data () {
    return {
      visible: false,
      id: ''
    }
  },
  watch: {
    'visible' (val) {
      if (!val) {
        // 关闭弹窗时清除任务id
        this.id = ''
      }
    }
  },
  methods: {
    open (val) {
      this.visible = true
      this.id = val
    },
    close () {
      this.visible = false
      this.id = ''
    },
    closeDialog () {
      this.close()
    },
    reload () {
      this.close()
      this.$emit('reload')
    },
    cancelInner () {
      this.close()
    }
  },
}
</script>
<style lang="less" scoped>
.follow-task-detail.ui_dialog_0 {
  z-index: 5000 !important;
  /deep/ .el-dialog__body {
    // height: 800px;
    padding-bottom: 30px;
  }
  .fz14 {
    font-size: 14px;
    font-weight: normal;
  }
}
</style>

