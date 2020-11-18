<template>
  <div>
    <div class="layout_inner">
      <div class="main-head">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
        <el-table v-loading.body="loading" :data="tableData">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="supplierCode" label="供应商编码" align="center"></el-table-column>
          <el-table-column prop="supplierName" label="供应商名称" align="center"></el-table-column>
          <el-table-column prop="supplierType" label="供应商类型" align="center">
            <template slot-scope="scope">
              <sys-value type="THC_WH_VENDOR_TYPE" :code="scope.row.supplierType"></sys-value>
            </template>
          </el-table-column>
          <el-table-column prop="illustration" label="预付款说明" align="center"></el-table-column>
          <el-table-column prop="code" label="预付款编号" align="center"></el-table-column>
          <el-table-column prop="paySum" label="预付款金额" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.paySum | formatToFinacial}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="预付款状态" align="center">
            <template slot-scope="scope">
              <sys-value type="THC_RCM_CLAIM_DOC_STATUS" :code="scope.row.status"></sys-value>
            </template>
          </el-table-column>
          <el-table-column prop="docDate" label="申请日期" align="center"></el-table-column>
          <el-table-column prop="payMethod" label="付款方法" align="center">
            <template slot-scope="scope">
              <sys-value type="THC_RCM_PAY_METHOD" :code="scope.row.payMethod"></sys-value>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="业务详述" align="center"></el-table-column>
          <el-table-column prop="agentID" label="经办人姓名" align="center">
            <template
              slot-scope="scope"
            >{{agentNameArr[scope.row.agentID] && agentNameArr[scope.row.agentID].name}}</template>
          </el-table-column>
          <el-table-column prop label="管理" align="center">
            <template slot-scope="scope">
              <router-link :to="'/financial/searchprepayverify/' + scope.row.id">核销管理</router-link>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="end">
          <ever-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :totalCount="totalCount"
            :current="current"
          ></ever-pagination>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../store/apverifactionapi'
import prepaymentApi from '../store/prepaymentapi'
import list from '../../util/list'
import supplierApi from '../store/payableinvoiceapi'

export default {
  mixins: [list],
  data () {
    var obj = this.$ever.createObjFromSchema(prepaymentApi.schema)
    obj.status = '1'
    // obj.clinicID = 1
    prepaymentApi.schema.filter(function (v, i) {
      return v.name === 'status'
    })[0].disabled = true
    return {
      querySchema: prepaymentApi.schema,
      queryObj: obj,
      api,
      agentNameArr: []
    }
  },
  created () {
    prepaymentApi.getPeriod()
      .then(result => {
        result.forEach(function (item) {
          item.name = item.periodName
        })
        this.$ever.getFieldFromSchema(this.querySchema, 'period').options = result
      })
    supplierApi.getSupplierLocalByClinic()
      .then(result => {
        this.$ever.getFieldFromSchema(this.querySchema, 'supplierID').options = result.clinicArr
      })
    prepaymentApi.getStaffList().then(res => {
      let staffList = res.data && res.data.pageList
      this.$ever.getFieldFromSchema(this.querySchema, 'agentID').options = staffList
      this.agentNameArr = staffList
    })
  }
}
</script>
