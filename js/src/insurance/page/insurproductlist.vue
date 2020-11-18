<template>
  <div>
    <div class="layout_inner">
      <div class="main-head">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
        <div class="main-option">
          <router-link :to="'/manages/insurproductadd'">
            <el-button type="primary">新建</el-button>
          </router-link>
        </div>
      </div>
      <el-table v-loading.body="loading" :data="tableData" border>
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column prop="productCode" label="保险产品编号"></el-table-column>
        <el-table-column prop="productName" label="保险产品名称"></el-table-column>
        <el-table-column prop="enterpriseName" label="团检机构全称"></el-table-column>
        <el-table-column prop="insuranceFee" label="保障总额" :formatter="formatMoney"></el-table-column>
        <el-table-column prop="hospitalFee" label="住院及手术金额"></el-table-column>
        <el-table-column prop="clinicFee" label="门诊金额"></el-table-column>
        <el-table-column prop="emergencyFee" label="急诊金额"></el-table-column>
        <el-table-column prop label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="$router.push('/manages/insurproducts/' + scope.row.id)"
            >编辑</el-button>
            <el-button
              type="success"
              size="small"
              @click="$router.push('/manages/insurproductEdit/' + scope.row.id + '/' + scope.row.insuranceOrgID)"
            >管理</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-row type="flex" justify="end">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
        ></ever-pagination>
      </el-row>
    </div>
  </div>
</template>
<script>
import api from '../store/insuranceproductapi'
import list from '../../util/list'

let schema = [
  {
    name: 'productCode',
    label: '保险产品编号'
  },
  {
    name: 'productName',
    label: '保险产品名称'
  }
  // {
  //   name: 'corpType',
  //   label: '保险公司类型',
  //   type: 'systype',
  //   code: 'THC_RCM_INSURANCE_TYPE'
  // }
]
export default {
  mixins: [list],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      querySchema: schema,
      queryObj: obj
    }
  },
  methods: {},
  beforeCreate () {
    this.api = api
  }
}
</script>
