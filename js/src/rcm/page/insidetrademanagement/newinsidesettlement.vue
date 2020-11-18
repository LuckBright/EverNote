<template>
  <div>
    <ever-bread-crumb name="新建内部交易结算单"></ever-bread-crumb>
    <div class="layout_inner">
      <div>
        <ever-form2
          :schema="schema"
          v-model="queryObj"
          :inline="true"
          :isQuery="true"
          @query="list"
        ></ever-form2>
        <div class="rightbtns">
          <el-button
            type="primary"
            size="small"
            @click="createSettlement"
            :disabled="btndisabled || selectedArr.length<=0"
          >结算</el-button>
        </div>
        <div class="clearfix"></div>
      </div>
      <div class="flex_col_1_hidden main-wrap">
        <el-table
          ref="table"
          :data="tableData"
          @select-all="handleSelectAll"
          @select="handleRowClick"
          v-loading="loading"
        >
          <el-table-column type="selection" prop lable :selectable="isSelectable"></el-table-column>
          <el-table-column label="发起机构" prop="startOrgName" show-overflow-tooltip></el-table-column>
          <el-table-column label="交易类型" prop="tradeType">
            <template slot-scope="scope">{{scope.row.tradeType | convertTradeType}}</template>
          </el-table-column>
          <el-table-column label="单据号" prop="tradeNo" min-width="110"></el-table-column>
          <el-table-column label="结算项目名称" prop="itemName"></el-table-column>
          <el-table-column label="规格" prop="spec"></el-table-column>
          <el-table-column label="数量" prop="quantity" width="50"></el-table-column>
          <el-table-column label="单价" prop="price" align="right">
            <template slot-scope="scope">
              <el-input
                v-if="scope.row.isSelected"
                v-model="scope.row.price"
                @keyup.native="limitDecimal(scope.row.price,'price', scope.row)"
              ></el-input>
              <template v-else>{{scope.row.price | formatToFinacial}}</template>
            </template>
          </el-table-column>
          <el-table-column label="金额" prop="amount" align="right">
            <template slot-scope="scope">{{scope.row.amount | formatToFinacial}}</template>
          </el-table-column>
          <el-table-column label="业务日期" prop="tradeTime" width="160" :formatter="convertTradetime"></el-table-column>
          <el-table-column label="备注" prop="remark">
            <template slot-scope="scope">
              <template v-if="scope.row.isSelected">
                <el-input v-model="scope.row.remark"></el-input>
              </template>
              <template v-else>{{scope.row.remark}}</template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { getSourceList, createSettle } from '@/rcm/store/insidetradesettlement/insidetradesettlement.js'
import storage from '@/util/storage'
import { floatTool } from '@/util/floattool.js'
import { tradeTypeOptions } from '@/rcm/page/insidetrademanagement/config.js'
let schema = [{
  label: '发起机构',
  name: 'startOrgId',
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
}]
export default {
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      queryObj,
      tableData: [],
      selectedArr: [],
      btndisabled: false,
      loading: false,
      flag: false // 标识当前选中项多了还是少了
    }
  },
  created () {
    this.list()
  },
  filters: {
    convertTradeType (key) {
      return tradeTypeOptions[key] || '未取到交易类型'
    }
  },
  methods: {
    createSettlement () {
      this.btndisabled = true
      let outerParam = this.selectedArr[0]
      let parmas = {
        amount: this.computeTotalFee(),
        clinicId: storage.getLocalStorage('CLINICID'),
        startOrgId: outerParam.startOrgId,
        startOrgName: outerParam.startOrgName,
        tradeTime: this.$moment().format('YYYY-MM-DD hh:mm:ss'),
        tradeType: outerParam.tradeType,
        details: {
          internalSettlementDtl: this.selectedArr
        }
      }
      createSettle(parmas).then(res => {
        if (res.head && res.head.errCode === 0) {
          this.btndisabled = false
          this.$messageTips(this, 'success', '创建结算单成功')
          this.$router.push('/financial/insideTradeManagement/insideSettlement')
        }
      }, error => {
        this.btndisabled = false
        console.log(error)
      })
    },
    list () {
      this.loading = true
      getSourceList(this.queryObj).then(res => {
        this.loading = false
        if (res.head && res.head.errCode === 0) {
          res.data.map(row => {
            row.price = Number(row.price || 0).toFixed(2) // 金额给转一下，保持选中编辑时一致性
            row.amount = row.amount || 0 // 给行金额赋予默认值
            row.canSelect = true  // 表示是否可以选中
            row.isSelected = false // 表示当前是否已经被选中
          })
          this.tableData = res.data
        }
      }).catch(_ => {
        this.loading = false
      })
    },
    handleRowClick (selection, changedRow) {
      this.flag = selection && (selection.length > this.selectedArr.length)
      this.selectedArr = selection
      if (selection.length === 1) {
        this.tableData.map(row => {
          // 不同结算单号的判断发起机构与交易类型是否相当来判断是否能勾选
          // 相同结算单号的，交给handleRowClick来处理他们的同生共死的关系，因为他们需要知道变化的row
          if (row.tradeNo !== selection[0].tradeNo) {
            row.canSelect = (row.startOrgId === selection[0].startOrgId) && (row.tradeType === selection[0].tradeType)
          }
        })
      } else if (selection.length === 0) { // 清空之后
        this.tableData.map(row => {
          row.canSelect = true
          row.isSelected = false
        })
      }
      this.tableData.map(row => {
        if (row.tradeNo === changedRow.tradeNo) {
          row.isSelected = this.flag
          this.$refs.table.toggleRowSelection(row, !!this.flag) // 同一张结算单号的数据同生共死
        }
      })
    },
    isSelectable (row) {
      return row.canSelect
    },
    convertTradetime (row) {
      return this.$moment(row.tradeTime).format('YYYY-MM-DD hh:mm:ss')
    },
    handleSelectAll (selection) {
      if (selection && selection.length > 0) {
        if (!this.checkAll()) {
          this.$refs.table.clearSelection()
        } else {
          this.selectedArr = selection
        }
      }
    },
    checkAll () {
      let target = this.tableData[0]
      let result = this.tableData.some(row => { return (row.startOrgId !== target.startOrgId) || (row.tradeType !== target.tradeType) })
      if (result) {
        this.$messageTips(this, 'error', '表格中有发起机构和交易类型不一致的选项，请手动勾选')
        return false
      }
      return true
    },
    computeTotalFee () {
      return this.selectedArr.reduce((total, curr) => {
        total += floatTool.multiply(curr.quantity, curr.price)
        return total
      }, 0)
    },
    // 限制金额只能两位小数
    limitDecimal (fee, param, row) {
      if (!/^[+-]?\d*\.?\d{0,2}$/.test(fee)) {
        row[param] = fee.substring(0, fee.length - 1)
      }
      row.amount = floatTool.multiply(row.quantity, row.price)
    }
  }
}
</script>
<style scoped>
.el-form {
  float: left;
}
.rightbtns {
  float: right;
}
</style>
