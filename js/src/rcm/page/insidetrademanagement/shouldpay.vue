<template>
  <div class="layout_inner">
    <ever-form2 ref="form" :schema="schema" v-model="queryObj" :inline="true" :isQuery="true" @query="list(true)">
      <div class="querybtnsLeft">
        <el-button size="small" type="primary" @click="list(true)">查询</el-button>
        <el-button size="small" @click="resetForm">重置</el-button>
      </div>
    </ever-form2>
    <div class="flex_col_1_hidden main-wrap">
      <el-table :data="tableData">
        <el-table-column label="应付单号" prop="payNo" width="200"></el-table-column>
        <el-table-column label="内部交易类型" prop="tradeTypeChn"></el-table-column>
        <el-table-column label="内部结算单号" prop="innerSettleCode"></el-table-column>
        <el-table-column label="金额" prop="amount" align="right">
          <template slot-scope="scope">
            {{scope.row.amount | formatToFinacial}}
          </template>
        </el-table-column>
        <el-table-column label="执行机构" prop="clinicName" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" prop="statusChn"></el-table-column>
        <el-table-column label="审批人" prop="approver" width="90" show-overflow-tooltip></el-table-column>
        <el-table-column label="审批时间" prop="approveTime" width="160"></el-table-column>
        <el-table-column label="操作" prop="">
          <template slot-scope="scope">
            <el-button type="primary" v-if="scope.row.status === 1" @click="approvalItem(scope.row, 2)">审批</el-button>
            <el-button type="primary" v-if="scope.row.status === 2" @click="approvalItem(scope.row, 1)">取消审批</el-button>
          </template>
        </el-table-column>
      </el-table>
      <ever-pagination
          :current="current"
          :page-sizes="pageSizes"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
        >
        </ever-pagination>
    </div>
  </div>
</template>
<script>
import {selectPage, check} from '@/rcm/store/insidetradesettlement/insidetradesettlement.js'
import list from '@/util/list'
import settlementselect from '@/rcm/page/insidetrademanagement/settlementcodeselect'
let schema = [
  {
    name: 'clinicid',
    label: '执行机构',
    comp: 'everOrgSelect',
    props: {
      isOrg: false, // 取所有机构
      clearable: true,
      type: 'select',
      fields: 'id'
    },
    span: 6
  },
  {
    label: '内部交易类型',
    name: 'tradeType',
    comp: 'ever-select',
    props: {
      options: [{
        id: 1,
        name: '跨机构发药'
      },
      {
        id: 2,
        name: '跨机构调拨'
      }]
    },
    span: 6
  },
  {
    label: '内部结算单号',
    name: 'innerSettleCode',
    comp: settlementselect,
    props: {
      name: 'innerSettleCode',
      api: selectPage
    },
    span: 6
  }]
export default {
  mixins: [list],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      api: {
        selectPage,
        check
      },
      queryObj,
      listApiName: 'selectPage',
    }
  },
  methods: {
    resetForm () {
      this.$refs.form.resetForm()
      this.list(true)
    },
    approvalItem (row, type) {
      let params = {
        id: row.id,
        status: type
      }
      check(params).then(rs => {
        this.$messageTips(this, 'success', type === 1 ? '提交' : '取消' + '审批成功')
        this.list()
      }, err => {
        this.$messageTips(this, 'error', '操作失败')
        console.log(err)
      })
    }
  },
  components: {
    settlementselect
  }
}
</script>
<style scoped>
.querybtnsLeft{
  display: inline-block;
}
.querybtnsRight{
  float:right;
}
</style>
