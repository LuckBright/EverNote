<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" class="ui_dialog_02" style="padding: 4px 20px">
    <el-table
      :data="diagTable"
      height="250"
      border
      style="width: 100%">
      <el-table-column
        label="诊断类型"
        width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.type === '1'">主要诊断</span>
          <span v-else>次要诊断</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="diagName"
        label="诊断名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="diagCode"
        label="诊断编码">
      </el-table-column>
      <el-table-column
        prop="docName"
        label="诊断医生"
        width="160">
      </el-table-column>
      <el-table-column
        prop="diagDate"
        label="诊断时间"
        width="160">
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
export default {
  props: ['diagTable', 'visible', 'title'],
  data () {
    return {
      dialogVisible: false
    }
  },
  watch: {
    visible (val) {
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('update', val)
    }
  }
}
</script>
