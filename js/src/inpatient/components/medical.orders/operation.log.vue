<template>
  <el-dialog
    title="操作记录"
    :visible.sync="visibleFlag"
    class="logDialog ui_dialog_02"
    width="600px"
    @close="closeDialog"
  >
    <el-table :data="tableData">
      <el-table-column label="操作人" prop="operator" align="center" min-width="30%">
        <template slot-scope="scope">
          <span v-if="scope.row.opByName">{{scope.row.opByName}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="操作类型" align="center" min-width="30%">
        <template slot-scope="scope">
          <span v-if="scope.row.attr4">{{scope.row.attr4}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" prop="operationTime" align="center" min-width="40%">
        <template slot-scope="scope">
          <span v-if="scope.row.opTime">{{$moment(scope.row.opTime).format('YYYY-MM-DD HH:mm')}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import recipeapi from '@/workspace/store/recipeapi'
export default {
  props: ['visible', 'data'],
  data () {
    return {
      recipeapi,                 // 接口所在api文件
      tableData: [],             // 展示的table数据
      visibleFlag: false
    }
  },
  computed: {
    currentData () {
      return this.data
    }
  },
  created () {
  },
  methods: {
    // 获取table数据
    async getLogData () {
      let params = {
        id: this.currentData.id
      }
      let result = await this.recipeapi.getDoctorAdviceOpLog(params)
      if (result.head.errCode === 0 && result.data && result.data.length) {
        this.visibleFlag = this.visible
        this.tableData = result.data
      } else {
        this.tableData = []
        this.closeDialog()
        return this.$messageTips(this, 'warning', '未获取到明细', '提示')
      }
    },
    closeDialog () {
      this.visibleFlag = false
      this.$emit('update:visible', this.visibleFlag)
    }
  },
  watch: {
    'visible' (val) {
      if (val) {
        this.getLogData()
      }
    }
  }
}
</script>
<style scoped lang="scss">
.logDialog {
  padding: 20px;
  /deep/.el-dialog__title {
    font-size: 16px !important;
    line-height: 16px;
    color: #000 !important;
    font-weight: bold;
  }
  /deep/.el-dialog__body {
    .el-table {
      border: 1px solid #ccc;
      .el-table__body-wrapper {
        max-height: 300px;
        overflow-y: auto;
      }
    }
    padding: 0 20px 20px;
  }
}
</style>
