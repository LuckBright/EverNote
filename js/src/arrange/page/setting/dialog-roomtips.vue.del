<template>
  <div id="roomTips">
    <el-dialog
      width="400px"
      :visible.sync="visible"
      title=""
      :show-close="false"
      :close-on-click-modal="false"
      class="ui_dialog_02 spe">
      <h4 class="tc">此诊室已分配医生</h4>
      <span slot="footer" class="dialog-footer tc">
        <el-button @click="close">重新分配诊室</el-button>
        <el-button @click="clickBtn" type="primary">确认共用诊室</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/arrange/store/templateapi'
export default {
  props: ['selectOrgan'],
  data () {
    return {
      api,
      visible: false,
      data: {}
    }
  },
  created () {
  },
  methods: {
    open (val, i) {
      this.visible = true
      this.data = {
        obj: val,
        index: i
      }
    },
    close () {
      this.visible = false
      this.data.type = 1
      this.$emit('clickBtn', this.data)
    },
    clickBtn () {
      this.visible = false
      this.data.type = 2
      this.$emit('clickBtn', this.data)
    }
  },
  components: {
  }
}
</script>
<style scoped>
#roomTips .tc{text-align: center;}
#roomTips .ui_dialog_02 /deep/ .el-dialog .el-dialog__footer{text-align: center!important;}
.el-dialog__footer{text-align: center;}
</style>
