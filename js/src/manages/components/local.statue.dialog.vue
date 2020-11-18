<template>
  <el-dialog
    class="dialog"
    title="状态修改"
    :visible.sync="dialogVisible"
    width="30%"
    :show-close="false"
    :close-on-click-modal="false"
    :modal-append-to-body="false">
    <div style="min-height: 90px; overflow-y: auto; line-height: 24px">
      <slot></slot>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirmHandler">确认修改</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    api: {
      required: true,
      type: Object
    },
    params: { // 接口请求参数
      required: true,
      type: [Object, Array]
    },
    apiName: { // 接口名称
      type: String,
      default: 'saveRelation'
    },
    msg: { // 接口请求成功后提示语
      type: String,
      default: ''
    },
    visible: { // 弹框显示隐藏
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
    confirmHandler () {
      this.api[this.apiName](this.params).then(res => {
        if (res && res.finally) {
          this.$messageTips(this, 'success', this.msg)
          this.$emit('changeStatue') // 接口返回成功后， 通知父组件，更改成功
        }
        this.dialogVisible = false
      })
    },
  }
}
</script>
