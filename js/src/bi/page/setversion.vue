<template>
  <el-dialog
    title="批量设置版本"
    :visible.sync="dialogVisible"
    width="350px">
    <div class="cnt">
      <sys-type ref="version" code="THC_PRINT_TEMPLATE" v-model="obj" placeholder="请选择版本号" :useObject="true"></sys-type>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveBatchSet()" v-ever-click-once="disabled" :disabled="disabled">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>

export default {
  props: ['visible'],
  data () {
    return {
      obj: {},
      disabled: false
    }
  },
  methods: {
    saveBatchSet () {
      if (this.obj.code) {
        this.$emit('chgVersion', {
          version: {
            versionCode: this.obj.code,
            versionName: this.obj.name,
          },
          batchFlag: true
        })
      } else {
        this.$messageTips(this, 'error', '请选择版本号')
        this.$refs.version.$el.getElementsByTagName('input')[0].focus()
        return
      }
    }
  },
  computed: {
    dialogVisible: {
      set (val) {
        this.$emit('update:visible', val)
      },
      get () {
        return this.visible
      }
    }
  }
}
</script>
