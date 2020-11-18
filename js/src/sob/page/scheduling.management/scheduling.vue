<template>
  <el-dialog
    title="配置规则"
    class="ui_dialog_02 spe"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-table :data="tableData" border style="width: 100%" align="center">
      <el-table-column fixed prop="name" label="班次" align="center"></el-table-column>
      <el-table-column prop="firstClassName" label="时段" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime }}-{{ scope.row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="顺序" align="center">
        <template slot-scope="scope">
          <el-input size="small" v-model="scope.row.orderNum" style="width:50px"></el-input>
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
  props: ['schedu'],
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
        this.searchTimetrunkList({ templateId: this.schedu.templateId })
      } else {
        this.tableData = []
      }
    }
  },
  created () {
  },
  methods: {
    searchTimetrunkList (p) {
      this.api.searchTimetrunkList(p).then(rs => {
        if (rs.head.errCode || !rs.data || rs.data.length === 0) {
          return false
        }
        this.tableData = rs.data
      })
    },
    save () {
      this.api.updateBpmTimeTrunkOrderNum(this.tableData).then(rs => {
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

