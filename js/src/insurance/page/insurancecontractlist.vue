<template>
  <div>
    <ever-bread-crumb name="保险公司协议管理"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>基本信息</h4>
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
        <h4 class="panel-hr">
          协议列表
          <el-button
            class="fr"
            type="primary"
            size="small"
            @click="$router.push('/manages/insurancecontractadd/' + $route.params.id)"
          >新建</el-button>
        </h4>
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column type="index" label="序号" align="center" width="70"></el-table-column>
          <el-table-column prop="clinicid" label="机构编码"></el-table-column>
          <el-table-column prop="clinicName" label="机构名称"></el-table-column>
          <el-table-column prop="contractName" label="合同名称"></el-table-column>
          <el-table-column prop="contractCode" label="合同编码"></el-table-column>
          <el-table-column prop="beginDate" label="有效期自" :formatter="formatDate"></el-table-column>
          <el-table-column prop="endDate" label="有效期至" :formatter="formatDate"></el-table-column>
          <el-table-column prop="isDirect" label="是否直付" :formatter="formatBoolean"></el-table-column>
          <el-table-column prop="rate" label="保险折扣比率"></el-table-column>
          <el-table-column prop="paymentCycle" label="保险公司付款周期">
            <template
              slot-scope="scope"
            >{{api.paymentCycle[scope.row.paymentCycle] && api.paymentCycle[scope.row.paymentCycle].name}}</template>
          </el-table-column>
          <el-table-column prop="singleFee" label="单次金额"></el-table-column>
          <el-table-column prop="treatTime" label="诊疗次数"></el-table-column>
          <el-table-column prop="salePolicy" label="促销政策">
            <template slot-scope="scope">
              <sys-value type="THC_RCM_INSURANCE_SALEPOLICY" :code="scope.row.salePolicy"></sys-value>
            </template>
          </el-table-column>
          <el-table-column prop label="操作" width="140" align="center">
            <template slot-scope="scope">
              <el-button-group>
                <el-button
                  type="primary"
                  size="small"
                  @click="$router.push('/manages/insuranceContract/' + $route.params.id + '/' + scope.row.id)"
                >编辑</el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button>
              </el-button-group>
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
import api from '../store/insurancecontractapi'
import insuranceapi from '@/insurance/store/insuranceorgapi'
import list from '../../util/list'

let schema = [
  {
    name: 'insureOrgShortName',
    label: '保险公司简称',
    disabled: true
  },
  {
    name: 'insuranceOrgCnName',
    label: '保险公司全称',
    disabled: true
  },
  {
    name: 'corpType',
    type: 'select',
    label: '保险公司类型',
    options: insuranceapi.corpType,
    disabled: true
  },
  // {
  //   name: '',
  //   label: '税务登记号',
  //   disabled: true
  // },
  {
    name: 'insuranceOrgEnName',
    label: '英文名称',
    disabled: true
  }
]

export default {
  mixins: [list],
  created () {
    if (this.$route.params.id) {
      insuranceapi.getById(this.$route.params.id)
        .then(result => {
          Object.assign(this.queryObj, result)
          // this.getSystypeinfo(this.systype.code)
        })
    }
  },
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      querySchema: schema,
      queryObj: obj,
      listParams: { 'insuranceOrgID': this.$route.params.id },
      isDirect: api.isDirect
    }
  },
  methods: {
  },
  beforeCreate () {
    this.api = api
  }
}
</script>
