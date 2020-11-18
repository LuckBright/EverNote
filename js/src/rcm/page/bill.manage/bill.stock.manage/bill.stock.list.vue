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
      <template slot="default">
        <el-form-item>
          <el-button size="small" type="primary" @click="query">查询</el-button>
          <el-button size="small" @click="resetForm">重置</el-button>
        </el-form-item>
        <el-form-item class="querybtnsRight">
          <el-button size="small" type="primary" @click="addBill">增加</el-button>
        </el-form-item>
      </template>
    </ever-form2>
    <div class="flex_col_1_hidden main-wrap">
      <el-table :data="tableData" v-loading="loading">
        <el-table-column label="类型" prop="billType" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.billType === 1 ? '挂号发票' : scope.row.billType === 2 ? '门诊发票' : '住院发票'}}
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="是否发票" prop="isInvoice" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.isInvoice ? '是': '否'}}
          </template>
        </el-table-column>
        <el-table-column label="最大票据号" prop="maxCode" show-overflow-tooltip></el-table-column>
        <el-table-column label="可分配库存" prop="useableNumber" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" @click="seeStock(scope.row)">{{scope.row.useableNumber}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="creater" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="emitBill(scope.row,'view')">详情</el-button>
            <el-button type="text" @click="emitBill(scope.row)">修改</el-button>
            <el-button type="text" :disabled="scope.row.isDelete" @click="delBill(scope.row)" style="color: #f56c6c;">删除</el-button>
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
      <countleft :visible.sync="visible" :paramsObj="dialogInfo" @sureBtn="jumpTo"></countleft>
    </div>
  </div>
</template>
<script>
import list from '@/util/list'
import api from '@/rcm/store/bill.manage/bill.stock.api'
import countleft from '@/rcm/page/bill.manage/bill.stock.manage/countleft.dialog.vue'
let schema = [
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
      loading: false,
      dialogInfo: {
        id: '',
        name: '',
        buttonText: '发放'
      }
    }
  },
  methods: {
    addBill () {
      this.$router.push({ path: '/financial/billstockdetail' })
    },
    emitBill (row, oprate) {
      this.$router.push({ path: '/financial/billstockdetail', query: { id: row.id, op: oprate } })
    },
    async delBill (row) {
      let removeInfo = await api.removeStock({id: row.id})
      if (removeInfo.data) {
        this.delBillInfo(row.id)
      } else {
        this.$messageTips(this, 'error', '请收回已领用票据。确定删除此票据，相关打印功能将无法使用!')
      }
    },
    delBillInfo (id) {
      api.delStock({id: id}).then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '删除成功!')
          this.query()
        }
      })
    },
    seeStock (row) {
      console.log('row', row)
      this.dialogInfo.id = row.id
      this.dialogInfo.name = row.name
      this.visible = true
    },
    jumpTo () {
      this.$router.push({
        path: '/financial/billissuelist',
        query: {
          name: this.dialogInfo.name
        }
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
      if (this.queryObj.nameLike) {
        params.nameLike = this.queryObj.nameLike
      }
      if (this.queryObj.billType) {
        params.billType = this.queryObj.billType
      }
      api.listStock(params).then(rs => {
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
  components: {
    countleft
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
</style>
