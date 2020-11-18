<template>
  <el-dialog
    class="dialog"
    title="同步数据"
    :visible.sync="dialogVisible"
    width="25%"
    :show-close="false"
    :close-on-click-modal="false"
    :modal-append-to-body="false">
    <div style="min-height: 150px; overflow-y: auto; line-height: 24px">
      <div>正常情况下系统会自动完成数据同步，<br>若当您发现数据更新不及时，也可以通过手动同步数据的方式完成更新。<br><br><span class="cOrange">注：数据同步在后台进行， 不影响你的正常业务操作</span></div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="doRelationDownTreeHandler">同步数据</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import templateApi from '@/manages/api/template'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    dialogVisible: {
      set (newVal) {
        this.$emit('update:visible', newVal)
      },
      get () {
        return this.visible
      }
    }
  },
  methods: {
    doRelationDownTreeHandler () {
      templateApi.doRelationDownTree().then(res => {
        // 偷偷摸摸的同步，不给任何后续提示和操作，直接关闭dialog
        this.dialogVisible = false
      })
    },
  }
}
</script>
