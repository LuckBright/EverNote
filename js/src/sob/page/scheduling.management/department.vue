<template>
  <el-dialog
    title="配置规则"
    class="ui_dialog_02 spe"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-table :data="tableData" border style="width: 100%" align="center" height="250">
      <el-table-column fixed prop="deptName" label="科室" align="center"></el-table-column>
      <el-table-column prop="supplyLocalSectionName" label="上级科室" align="center"></el-table-column>
      <el-table-column label="顺序" align="center">
        <template slot-scope="scope">
          <el-input size="small" v-model="scope.row.orderNum" style="width:40px"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import api from '../../store/scheduling'
export default {
  data () {
    return {
      api,
      dialogVisible: false,
      tableData: []
    }
  },
  watch: {
    'dialogVisible' (val) {
      if (val) {
        this.queryAll()
      } else {
        this.tableData = []
      }
    }
  },
  created () {

  },
  methods: {
    queryAll () {
      this.api.queryAll().then(rs => {
        if (rs.head.errCode || !rs.data || rs.data.length === 0) {
          return false
        }
        this.tableData = rs.data
      })
    },
    save () {
      this.api.saveArrangeDeptConfig(this.tableData).then(rs => {
        if (rs.head.errCode) {
          return false
        }
        this.$notify({
          type: 'success',
          title: '成功',
          message: '科室配置成功'
        })
        this.dialogVisible = false
      })
    }
  }
}
</script>

