<template>
  <el-dialog
  v-if="dialogVisible"
  style="width:100%"
  :title="title"
  :close-on-click-modal="false"
  :show-close="false"
  :append-to-body="true"
  :visible.sync="dialogVisible"
  class="ui_dialog_02 spe">
    <el-table
      @current-change="handleCurrentChange"
      highlight-current-row
      :height="180"
      :data="tableData">
        <el-table-column
          prop="name"
          label="姓名"
          width="100">
        </el-table-column>
        <el-table-column
          prop="sex"
          label="性别"
          align="center"
          width="60">
          <template slot-scope="scope">
            <label>{{scope.row.sex === '1' ? '男': '女'}}</label>
          </template>
        </el-table-column>
        <el-table-column
          prop="birthday"
          label="出生日期"
          width="120">
        </el-table-column>
        <el-table-column
          prop="mobile"
          width="120"
          label="手机号">
        </el-table-column>
        <el-table-column
          label="证件号">
          <template slot-scope="scope">
            <label>{{scope.row.idNo || '--'}}</label>
          </template>
        </el-table-column>
    </el-table>
    <div class="footer">
      <el-button @click="handleCurrentChange({name: name, id: ''})">以上都不是</el-button>
    </div>
  </el-dialog>
</template>

<script>
import api from '@/arrange/store/appointmentapi'
export default {
  props: ['name', 'show'],
  data () {
    return {
      api,
      title: '请选择疑似重复的客户',
      tableData: [],
      dialogVisible: false
    }
  },
  watch: {
    show (val) {
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('update:show', val)
    },
    name (val) {
      this.getPaitentRepeats()
    }
  },
  created () {
    this.getPaitentRepeats()
  },
  methods: {
    getPaitentRepeats () {
      if (!this.name) {
        this.dialogVisible = false
        return false
      }
      this.api.getPaitentRepeats({name: this.name}).then(rs => {
        this.tableData = rs.data || []
        if (this.tableData && this.tableData[0]) {
          this.dialogVisible = true
        } else {
          this.handleCurrentChange({name: this.name, id: ''})
        }
      })
    },
    handleCurrentChange (val) {
      this.dialogVisible = false
      this.$emit('select', val)
    }
  }
}
</script>
