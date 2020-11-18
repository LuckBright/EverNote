<template>
  <el-dialog :visible.sync="v">
    <el-table :data="billDetailData">
      <el-table-column label="票据名称" prop="name"></el-table-column>
      <el-table-column label="票据号" prop="code"></el-table-column>
      <el-table-column label="票据状态" prop="status"></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  props: ['visible', 'billDetailData'],
  data () {
    return {
      tableData: []
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
  }
}
</script>
