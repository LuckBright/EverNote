<template>
  <div class="layout_inner">
    <ever-form2 ref="form" :schema="schema" v-model="queryObj" :inline="true" :isQuery="true" @query="list(true)">
      <div class="querybtnsLeft">
        <el-button size="small" type="primary" @click="list(true)">查询</el-button>
        <el-button size="small" @click="resetForm">重置</el-button>
      </div>
      <div class="querybtnsRight">
        <el-button size="small" type="primary" @click="approvalList(1,1)" :disabled="selectedArr.length<=0">批量审批</el-button>
        <el-button size="small" type="primary" @click="newSettlement">新建结算</el-button>
      </div>
    </ever-form2>
    <div class="flex_col_1_hidden main-wrap">
      <el-table :data="tableData" @selection-change="handleSelectionChange" v-loading="loading">
        <el-table-column type="selection" :selectable="isSelectable"></el-table-column>
        <el-table-column label="发起机构" prop="startOrgName" show-overflow-tooltip></el-table-column>
        <el-table-column label="内部交易类型" prop="">
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
        <el-table-column label="结算状态" prop="">
          <template slot-scope="scope">
            {{scope.row.status | convertSettleStatus}}
          </template>
        </el-table-column>
        <el-table-column label="创建日期" prop="createTime" width="160"></el-table-column>
        <el-table-column label="操作" prop="">
          <template slot-scope="scope">
            <el-button type="primary" @click="toEdit(scope.row.id)">详情</el-button>
            <el-button type="primary" v-if="scope.row.status == 0" @click="updateItemStatus(scope.row,1,1)">审批</el-button>
            <el-button type="primary" v-if="scope.row.status == 1" @click="updateItemStatus(scope.row,1,0)">取消审批</el-button>
            <ever-confirm
            v-if="scope.row.status == 0" 
            :msg="'确定要删除吗？'"
            @confirm="del(scope.row.id)"></ever-confirm>
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
  approvalList,
  getTitleList,
  updateSettlementById,
  deleteSettlementById
} from '@/rcm/store/insidetradesettlement/insidetradesettlement.js'
import {tradeTypeOptions, settleStatus} from '@/rcm/page/insidetrademanagement/config.js'
import settlementselect from '@/rcm/page/insidetrademanagement/settlementcodeselect'
import list from '@/util/list'
let schema = [
  {
    name: 'startOrgId',
    label: '发起机构',
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
      status: [0, 1, 2],
      funcType: 1
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
      selectedArr: [],
      api: {
        getTitleList
      },
      listApiName: 'getTitleList',
      listParams: {
        status: [0, 1, 2],
        funcType: 1 // 列表后端过滤的
      }
    }
  },
  filters: {
    convertTradeType (key) {
      return tradeTypeOptions[key] || '未取到状态'
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
    handleSelectionChange (selection) {
      this.selectedArr = selection
    },
    newSettlement () {
      this.$router.push('/financial/insideTradeManagement/newInsideSettlement')
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
    },
    approvalList (funcType, statusCode) {
      if (this.selectedArr.length === 0) {
        this.$messageTips(this, 'warning', '请至少选择一行需要审批的数据')
        return false
      } else {
        let params = this.selectedArr.map(item => {
          return {
            id: item.id,
            status: statusCode, // 1审批通过，0取消审批
            funcType: funcType,
            details: {
              internalSettlementDtl: []
            }
          }
        })
        approvalList(params).then(res => {
          this.$messageTips(this, 'success', '操作成功')
          this.list()
        }, err => {
          console.log('err', err)
        })
      }
    },
    del (id) {
      let params = {
        id: id,
        details: {
          internalSettlementDtl: []
        }
      }
      deleteSettlementById(params).then(res => {
        this.$messageTips(this, 'success', '操作成功')
        this.list()
      }, err => { console.log(err) })
    },
    isSelectable (row) {
      return row.status === 0
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
