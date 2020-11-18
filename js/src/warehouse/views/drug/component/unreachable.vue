<template>
  <el-dialog
    width="520px"
    class="ui_dialog_02"
    :visible.sync="confirmUnReachable"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :modal-append-to-body="false">
    <template slot="title">
      <div class="f18 pt10 pb10 pl10">缺货处理</div>
    </template>
    <div class="ml10 mr10">
      <div class="f16">请确认该药品已无法到货，需要医生做后续处理？</div>
      <div class="mt40 pb20">
        <el-checkbox v-model="cancelAll" :true-label="1" :false-label="0">同步处理包含该药品的其他任务</el-checkbox>
        <div class="cOrange mt10">注：该操作会将包含此药的全部处方都标记为无法到货，同时也会通知开处方的医生，请谨慎操作。</div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialogHandler">取 消</el-button>
      <el-button type="primary" @click="confirmUnReachableHandler">确认无法到货</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    row: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      cancelAll: 0 // 操作所有的缺货任务 1 是
    }
  },
  methods: {
    confirmUnReachableHandler () {
      this.$bus.$emit('hospital:notify-confirm-unreachable', this.row, this.cancelAll) // 通知无法到货
      this.closeDialogHandler()
    },
    closeDialogHandler () {
      this.confirmUnReachable = false
    }
  },
  computed: {
    confirmUnReachable: {
      set (newVal) {
        this.$emit('update:visible', newVal)
      },
      get () {
        return this.visible
      }
    }
  }
}
</script>
