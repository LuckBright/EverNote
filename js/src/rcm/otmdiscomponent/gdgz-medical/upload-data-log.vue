<template>
  <el-dialog
    :visible.sync="v"
    title="上传结果"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="70%"
    append-to-body
  >
    <div>
      <el-table
        :data="uploadData"
        border
        stripe
        row-key="id"
        class="medicalTable"
        height="400"
        >
        <el-table-column prop="hzxm" label="患者姓名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ybdjh" label="医保登记号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="zyh" label="住院号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="bazt" label="病案状态" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sbyy" label="失败原因" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ksmc" label="科室名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ysxm" label="医生姓名" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <div style="text-align:center; margin-top:20px;">
      <el-button @click="upload">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: [Boolean]
    },
    uploadData: {
      type: [Array],
      default () {
        return []
      }
    }
  },
  data () {
    return {
    }
  },
  computed: {
    v: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    // 取消
    cancel () {
      this.v = false
    },
    upload () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
