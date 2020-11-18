<template>
  <div class="layout_inner">
    <ever-form2 ref="form" :schema="schema" v-model="queryObj" :inline="true" :isQuery="true" @query="list(true)">
      <div class="querybtnsLeft">
        <el-button size="small" type="primary" @click="list(true)">查询</el-button>
        <el-button size="small" @click="resetForm">重置</el-button>
      </div>
    </ever-form2>
    <div class="flex_col_1_hidden main-wrap">
      <el-table :data="tableData" v-loading='loading'>
        <el-table-column label="执行机构" prop="clinicName" show-overflow-tooltip></el-table-column>
        <el-table-column label="内部交易类型" prop="tradeType">
          <template slot-scope="scope">
            {{scope.row.tradeType | convertTradeType}}
          </template>
        </el-table-column>
        <el-table-column label="内部结算单号" prop="settlementNo"></el-table-column>
        <el-table-column label="金额" prop="amount" align="right">
          <template slot-scope="scope">
            {{scope.row.amount | formatToFinacial}}
          </template>
        </el-table-column>
        <el-table-column label="结算状态" prop="status">
          <template slot-scope="scope">
            {{scope.row.status | convertSettleStatus}}
          </template>
        </el-table-column>
        <el-table-column label="创建日期" prop="createTime" width="160"></el-table-column>
        <el-table-column label="操作" prop="">
          <template slot-scope="scope">
            <el-button type="primary" @click="toEdit(scope.row.id)">详情</el-button>
            <el-button type="primary" v-if="scope.row.status == 1" @click="updateItemStatus(scope.row,2,2)">审批</el-button>
            <el-button type="primary" v-if="scope.row.status == 2" @click="updateItemStatus(scope.row,2,1)">取消审批</el-button>
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
import {
  getTitleList,
  updateSettlementById,
} from '@/rcm/store/insidetradesettlement/insidetradesettlement.js'
import settlementselect from '@/rcm/page/insidetrademanagement/settlementcodeselect'
import {tradeTypeOptions, settleStatus} from '@/rcm/page/insidetrademanagement/config.js'
import list from '@/util/list'
let schema = [{
  name: 'clinicId',
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
  name: 'settlementNo',
  comp: settlementselect,
  props: {
    name: 'settlementNo',
    api: getTitleList,
    status: [1, 2],
    funcType: 2
  },
  span: 6
}]
export default {
  mixins: [list],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      queryObj,
      tableData: [],
      api: {
        getTitleList
      },
      listApiName: 'getTitleList',
      listParams: {
        status: [1, 2],
        funcType: 2 // 列表后端过滤的
      }
    }
  },
  filters: {
    convertTradeType (key) {
      return tradeTypeOptions[key] || '未取到交易类型'
    },
    convertSettleStatus (key) {
      return settleStatus[key] || '未取到状态'
    }
  },
  methods: {
    resetForm () {
      this.$refs.form.resetForm()
      this.list(true)
    },
    updateItemStatus (row, funcType, statusCode) {
      let params = {
        id: row.id,
        status: statusCode, // 1审批通过，0取消审批
        funcType: funcType,
        details: {
          internalSettlementDtl: []
        }
      }
      updateSettlementById(params).then(res => {
        this.$messageTips(this, 'success', '操作成功')
        this.list()
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
</style>
