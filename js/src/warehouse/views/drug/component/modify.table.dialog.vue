<template>
  <el-dialog
    :key="currentRow.id + currentIndex"
    class="ui_dialog_02 dialogVisible"
    :visible.sync="dialogVisible"
    :class="{spe: !isAbnormal}"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :modal-append-to-body="false">
    <!-- 弹框内具体内容 -->
    <modify-hospital
      :obj.sync="obj"
      :current-row="currentRow"
      :parent-index="1"
      :is-udd-package="isUddPackage"
      :is-abnormal.sync='isAbnormal'></modify-hospital>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handlerCloseDialog">取 消</el-button>
      <el-button type="primary" :disabled="submitDisabled" @click="handlerSaveFullSubmit">全部完成</el-button>
    </span>
  </el-dialog>
</template>

<script>
import ModifyHospital from '@/warehouse/views/drug/component/modify.hospital.vue'
export default {
  props: {
    currentRow: {
      type: Object,
      default: () => ({})
    },
    currentIndex: Number,
    isUddPackage: Boolean
  },
  data () {
    return {
      obj: {}, // dialog修改处方发货方式、发货库房、标记异常等数据
      dialogVisible: false,
      isAbnormal: false, // 弹出框是否勾选异常（是：不添加spe, 否： 添加spe）
      exceptionCause: [], // 异常原因标记
    }
  },
  mounted () {
    // 接收添加的异常原因
    this.$bus.$on('hospital:add-exception-cause', (...rest) => {
      const [select, input] = rest
      // 三目运算，防止input为空时，exceptionCause中添加一个空内容['']
      this.exceptionCause = select.concat(input ? [input] : [])
    })
  },
  beforeDestroy () {
    this.$bus.$off('hospital:add-exception-cause')
  },
  computed: {
    submitDisabled () {
      return !this.exceptionCause.length
    }
  },
  methods: {
    handlerSaveFullSubmit () {
      // 派发提交异常原因事件
      this.$bus.$emit('hospital:submit-exception-cause', this.obj, this.exceptionCause, this.currentRow)
    },
    handlerCloseDialog () {
      this.dialogVisible = false
      // 通知父组件， 删除弹框
      this.$emit('close-dialog')
    },
  },
  components: {
    ModifyHospital
  }
}
</script>
