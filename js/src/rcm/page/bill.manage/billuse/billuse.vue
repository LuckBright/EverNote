<template>
  <div class="layout_inner">
    <ever-form2
      ref="form"
      :schema="schema"
      v-model="queryObj"
      :inline="true"
      :isQuery="true"
      @query="list(true)"
    >
      <div class="querybtnsLeft">
        <el-button size="small" type="primary" @click="query">查询</el-button>
        <el-button size="small" @click="resetForm">重置</el-button>
      </div>
    </ever-form2>
    <div class="flex_col_1_hidden main-wrap">
      <el-table :data="tableData" v-loading="loading">
        <el-table-column label="类型" prop="billType" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.billType === 1 ? '挂号发票' : scope.row.billType === 2 ? '门诊发票' : '住院发票'}}
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="当前使用号码" prop="currentNo" show-overflow-tooltip></el-table-column>
        <el-table-column label="剩余数量" prop="useableNumber" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" @click="seeStock(scope.row)">{{scope.row.useableNumber}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="领用人" prop="ownerName" show-overflow-tooltip></el-table-column>
        <el-table-column label="是否发票" prop="isInvoice" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.isInvoice ? '是': '否'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250px">
          <template slot-scope="scope">
            <el-button type="text" @click="useDetail(scope.row)">使用详情</el-button>
            <el-button type="text" @click="takeDetail(scope.row)">领用详情</el-button>
            <el-button type="text" :class="{'disable-color': scope.row.useableNumber == 0}" @click="takeBack(scope.row)" style="color: #f56c6c;">退回</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px;">
        <ever-pagination
          :current="current"
          :page-sizes="pageSizes"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
        ></ever-pagination>
      </div>
      
    </div>
    <surplus-detail-dialog :visible.sync="visible" :paramsObj="dialogInfo"></surplus-detail-dialog>
    <use-detail-dialog :visible.sync="useDetailDialogShow" :ownerId='ownerId'></use-detail-dialog>
    <el-dialog
      width="90%"
      :close-on-click-modal="false" 
      class="bill-dialog"
      :visible.sync="receiveInfo.visible"
      append-to-body>
      <bill-issue-dialog ref="billIssue" :receiveInfo="receiveInfo" :visible='receiveInfo.visible'></bill-issue-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="receiveInfo.visible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import list from '@/util/list'
import api from '@/rcm/store/bill.manage/bill.use.api'
import surplusDetailDialog from './surplus.detail.dialog'
import useDetailDialog from '@/rcm/page/bill.manage/billuse/usedetail.dialog'
import billIssueDialog from '@/rcm/page/bill.manage/bill.issue.manage/bill.issue.list'
let schema = [
  {
    name: 'ownerId',
    label: '领用人',
    comp: 'ever-staff-select',
    props: {
      fields: 'id',
      disabled: false
    }
  },
  {
    name: 'nameLike',
    label: '票据名称'
  },
  {
    name: 'billType',
    label: '票据类型',
    comp: 'el-select',
    props: {
      options: [
        {label: '挂号发票', value: 1},
        {label: '门诊发票', value: 2},
        {label: '住院发票', value: 3}
      ]
    }
  }
]
export default {
  mixins: [list],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    return {
      api,
      schema,
      queryObj,
      tableData: [],
      visible: false,
      useDetailDialogShow: false,
      ownerId: '',
      receiveInfo: {
        visible: false,
        name: '',
        billType: '',
        ownerId: ''
      },
      dialogInfo: {
        ownerId: '',
        id: ''
      }
    }
  },
  methods: {
    useDetail (row) {
      this.ownerId = row.ownerId
      this.useDetailDialogShow = true
    },
    takeDetail (row) {
      this.receiveInfo.name = row.name
      this.receiveInfo.billType = row.billType
      this.receiveInfo.ownerId = row.ownerId
      this.receiveInfo.visible = true
    },
    takeBack (row) {
      if (row.useableNumber === 0) {
        return
      }
      this.$confirm('确定退回此票据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        api.byDefineId({defineId: row.id, ownerId: row.ownerId}).then(rs => {
          if (rs.head && rs.head.errCode === 0) {
            this.$messageTips(this, 'success', '退回成功!')
            this.query()
          }
          this.loading = false
        }, rj => {
          this.loading = false
        })
      })
    },
    resetForm () {
      this.$refs.form.resetForm()
    },
    query () {
      this.handleCurrentChange(1)
    },
    list () {
      this.loading = true
      let params = {
        page: this.current,
        pagesize: this.pagesize
      }
      if (this.queryObj.ownerId) {
        params.ownerId = this.queryObj.ownerId
      }
      if (this.queryObj.nameLike) {
        params.nameLike = this.queryObj.nameLike
      }
      if (this.queryObj.billType) {
        params.billType = this.queryObj.billType
      }
      api.listUse(params).then(rs => {
        if (rs.head && rs.head.errCode === 0) {
          this.tableData = rs.data.list
          this.totalCount = rs.data.total
        }
        this.loading = false
      })
    },
    seeStock (row) {
      this.dialogInfo.id = row.id
      this.dialogInfo.ownerId = row.ownerId
      this.visible = true
    }
  },
  created () {
    if (this.$route.meta.disabled) {
      this.queryObj.ownerId = window.localStorage.getItem('USERID')
      this.$ever.getFieldFromSchema(schema, 'ownerId').props.disabled = true
    }
    this.list()
  },
  components: {
    surplusDetailDialog,
    billIssueDialog,
    useDetailDialog
  }
}
</script>
<style scoped>
.querybtnsLeft {
  display: inline-block;
}
.main-wrap {
  padding: 5px 5px 0 0;
}
.bill-dialog /deep/ .el-dialog__footer {
  border-top: none;
}
.disable-color {
  color:#bfcbd9 !important;
}
</style>
