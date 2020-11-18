<template>
  <div class="layout_inner">
    <ever-form2
      v-show="!isReceive"
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
      <div class="querybtnsRight">
        <el-button size="small" type="primary" @click="grantBill">发放</el-button>
      </div>
    </ever-form2>
    <div class="flex_col_1_hidden main-wrap">
      <el-table :data="tableData" v-loading="loading">
        <el-table-column label="类型" prop="billType" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.billType === 1 ? '挂号发票' : scope.row.billType === 2 ? '门诊发票' : '住院发票'}}
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="defineName" show-overflow-tooltip></el-table-column>
        <el-table-column label="票号范围起" prop="startNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="票号范围止" prop="endNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="当前使用号码" prop="currentNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="领用人" prop="applyUserName" show-overflow-tooltip></el-table-column>
        <el-table-column label="发放时间" prop="createTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="发放数量" prop="hopeProvideQty" show-overflow-tooltip></el-table-column>
        <el-table-column label="剩余数量" prop="useableQty" show-overflow-tooltip></el-table-column>
        <el-table-column label="发放人" prop="creater" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" v-if="!isReceive">
          <template slot-scope="scope">
            <a style="cursor: pointer;color: #f56c6c;" :class="{'disable-color': scope.row.usingCount == 0}" @click="takeBackBill(scope.row)">收回</a>
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
  </div>
</template>
<script>
import list from '@/util/list'
import api from '@/rcm/store/bill.manage/bill.issue.api'
let schema = [
  {
    name: 'defineName',
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
  },
  {
    name: 'applyUserId',
    label: '领用人',
    comp: 'ever-staff-select',
    props: {
      fields: 'id'
    }
  }
]
export default {
  mixins: [list],
  props: ['receiveInfo', 'visible'],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    return {
      api,
      schema,
      queryObj,
      tableData: [],
      isReceive: false
    }
  },
  methods: {
    grantBill () {
      this.$router.push({ path: '/financial/billissuedetail' })
    },
    takeBackBill (row) {
      if (row.usingCount === 0) return
      this.$confirm('确定收回此批票据，业务人员没有票据将无法打印！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        api.byProvideId({provideId: row.id}).then(rs => {
          if (rs.head && rs.head.errCode === 0) {
            this.$message({
              type: 'success',
              message: '收回成功!'
            })
            this.query()
          }
          this.loading = false
        }, rj => {
          this.loading = false
        })
      })
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
      if (this.queryObj.defineName) {
        params.defineName = this.queryObj.defineName
      }
      if (this.queryObj.billType) {
        params.billType = this.queryObj.billType
      }
      if (this.queryObj.applyUserId) {
        params.applyUserId = this.queryObj.applyUserId
      }
      api.listIssue(params).then(rs => {
        if (rs.head && rs.head.errCode === 0) {
          this.tableData = rs.data.list
          this.totalCount = rs.data.total
        }
        this.loading = false
      })
    },
    resetForm () {
      this.$refs.form.resetForm()
    }
  },
  created () {
    if (this.$route.query.name) {
      this.queryObj.defineName = this.$route.query.name || ''
      this.query()
    }
  },
  watch: {
    'visible': {
      handler: function (val) {
        if (val) {
          this.isReceive = true
          this.tableData = []
          this.queryObj.defineName = this.receiveInfo.name || ''
          this.queryObj.applyUserId = this.receiveInfo.ownerId || ''
          this.queryObj.billType = Number(this.receiveInfo.billType) || ''
          this.query()
        }
      },
      immediate: true
    }
  }
}
</script>
<style lang="less" scoped>
.main-wrap {
  padding: 5px 5px 0 0;
}
.querybtnsLeft {
  display: inline-block;
}
.querybtnsRight {
  float: right;
  padding-right: 5px;
}
.bill-dialog /deep/ .el-dialog__footer {
  border-top: none;
}
.disable-color {
  color:#bfcbd9 !important;
}
</style>
