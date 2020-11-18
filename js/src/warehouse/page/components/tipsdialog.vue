<template>
  <div>
    <el-dialog
      :visible.sync="miniDialog"
      :title="title ? title : '保存成功'"
      width="500px">
        <p v-if="ishtml" style="font-size: 16px;text-align: center;" v-html="content ? content : '提示信息'"></p>
        <p v-else style="font-size: 16px;" :class="!textCenter ? 'alg_c' : ''"><i :class="iconClass"></i>{{content ? content : '提示信息'}}</p>
        <span slot="footer" class="dialog-footer">
          <el-button v-if="!isCancel" @click="close">取消</el-button>
          <el-button @click="clickBtn" type="primary">{{btn ? btn : '确认'}}</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: ['title', 'content', 'btn', 'isCancel', 'function', 'cancelFun', 'ishtml', 'type', 'textCenter'],
  data () {
    return {
      miniDialog: false,
      runCancel: ''
    }
  },
  computed: {
    iconClass () {
      return 'el-icon-' + this.type
    }
  },
  methods: {
    open () {
      this.miniDialog = true
      this.runCancel = false
    },
    close () {
      this.runCancel = true
      this.miniDialog = false
    },
    clickBtn () {
      this.function && this.function()
      this.miniDialog = false
      this.$emit('clickBtn', 1)
    }
  },
  watch: {
    'miniDialog' (val) {
      if (!val && this.runCancel) {
        this.cancelFun && this.cancelFun()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
