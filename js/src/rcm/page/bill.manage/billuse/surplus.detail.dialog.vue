<template>
  <el-dialog :visible.sync="v" width="50%" :close-on-click-modal="false" class="bill-dialog">
    <el-dialog
      width="50%"
      :close-on-click-modal="false" 
      class="bill-dialog"
      :visible.sync="detailVisible"
      append-to-body>
      <el-table :data="detailTableData" style="margin-top:10px;" height="250px" v-loading="loading">
        <el-table-column label="票据号" prop="totalCount" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text">{{scope.row.code}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 10px;">
        <ever-pagination
          :current="current"
          :page-sizes="pageSizes"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
        ></ever-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <el-table :data="tableData" style="margin-top:10px;" height="250px" v-loading="tableLoading">
      <el-table-column label="单据名称" prop="defineName" show-overflow-tooltip></el-table-column>
      <el-table-column label="入库批次" prop="batchCode" show-overflow-tooltip></el-table-column>
      <el-table-column label="剩余数量" prop="totalCount" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text" @click="seeDetails(scope.row)">{{scope.row.totalCount}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <div></div>
    </span>
  </el-dialog>
</template>

<script>
import api from '@/rcm/store/bill.manage/bill.use.api'
import list from '@/util/list'
export default {
  mixins: [list],
  props: ['visible', 'paramsObj'],
  data () {
    return {
      api,
      detailVisible: false,
      loading: false,
      tableLoading: false,
      detailTableData: [],
      tableData: [],
      batchId: ''
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
    sureBtn () {
      this.v = false
      this.$emit('sureBtn')
    },
    seeList () {
      let params = {
        defineId: this.paramsObj.id,
        ownerId: this.paramsObj.ownerId
      }
      this.tableLoading = true
      api.getBatchUsableInfo(params).then(rs => {
        if (rs.head && rs.head.errCode === 0) {
          this.tableData = rs.data
        }
        this.tableLoading = false
      })
    },
    seeDetails (row) {
      this.batchId = row.batchId
      this.detailVisible = true
      this.query()
    },
    list () {
      let params = {
        batchId: this.batchId,
        defineId: this.paramsObj.id,
        ownerId: this.paramsObj.ownerId,
        page: this.current,
        pagesize: this.pagesize
      }
      this.loading = true
      api.getBillCodeByBatchId(params).then(rs => {
        if (rs.head && rs.head.errCode === 0) {
          this.detailTableData = rs.data.list
          this.totalCount = rs.data.total
          this.loading = false
        }
      })
    }
  },
  watch: {
    'visible': {
      handler: function (val) {
        if (val) {
          this.seeList()
        } else {
          this.tableData = []
        }
      },
      immediate: true
    },
    'detailVisible': {
      handler: function (val) {
        if (!val) {
          this.detailTableData = []
          this.offset = 0
          this.totalCount = 0
          this.pagesize = 20
          this.current = 1
        }
      },
      immediate: true
    }
  }
}
</script>
<style lang="less" scoped>
  .bill-dialog /deep/ .el-dialog__footer {
    border-top: none;
  }
</style>
