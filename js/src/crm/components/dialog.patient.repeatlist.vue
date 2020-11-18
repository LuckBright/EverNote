<template>
  <el-dialog
    title="疑似重复客户"
    width="50%"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    :before-close="closeEvent"
  >
    <el-table :data="tableData" border @row-click="change">
      <el-table-column width="55" align="center">
        <template slot-scope="scope">
          <el-radio :label="scope.row" v-model="radioed">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column label="姓名" :span="2" prop="name" align="center"></el-table-column>
      <el-table-column label="性别" align="center" :span="1">
        <template slot-scope="scope">
          <sys-value type="GBT.2261.1" :code="scope.row.sex"></sys-value>
        </template>
      </el-table-column>
      <el-table-column label="出生日期" prop="birthday" align="center" :span="2"></el-table-column>
      <el-table-column label="手机号" prop="mobile" align="center" :span="2"></el-table-column>
      <el-table-column label="身份证号" prop="idNo" :span="2"></el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save" :disabled="!selected.id">确 定</el-button>
      <el-button @click="closeEvent">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: ['tableData'],
  data () {
    return {
      dialogVisible: false,
      radioed: '',
      selected: {}
    }
  },
  watch: {
    'visible': {
      handler: function (val) {
        this.dialogVisible = val
      },
      deep: true
    },
    radioed (val) {
      this.selected = val
    }
  },
  methods: {
    closeEvent () {
      this.dialogVisible = false
    },
    save () {
      if (this.selected.id) {
        this.$emit('updateInfo', this.selected)
        this.dialogVisible = false
      }
    },
    change (val) {
      this.selected = val
      this.radioed = val
    }
  }
}
</script>
