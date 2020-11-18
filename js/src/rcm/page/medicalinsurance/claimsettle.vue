<template>
  <div v-loading="loading">
    <ever-form2
      :schema="schema"
      v-model="queryObj"
      @query="getReceivableSettlements(true)"
      :is-query="true"
      labelWidth="80px"
    >
      <template slot="default">
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" @click="getReceivableSettlements(true)">查询</el-button>
            <el-button type="primary" plain @click="reset">重置</el-button>
          </el-form-item>
        </el-col>
      </template>
    </ever-form2>
    <h4 class="settle_title">选择商保结算单</h4>
    <div>
      <span>全部应收合计：{{total | formatToFinacial}}</span>
      <span style="margin-left:20px;">选中应收合计：{{checktotal | formatToFinacial}}</span>
    </div>
    <el-table
      :data="tableData"
      height="250"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      ref="multipleTable"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="settleDate" :formatter="convertTime" label="结算日期"></el-table-column>
      <el-table-column prop="clinicName" label="就诊机构"></el-table-column>
      <el-table-column prop="orderDeptName" label="就诊科室"></el-table-column>
      <el-table-column prop="orderDoctorName" label="就诊医生"></el-table-column>
      <el-table-column prop="patientCode" label="患者档案号"></el-table-column>
      <el-table-column prop="patientName" label="客户姓名"></el-table-column>
      <el-table-column prop="settlementCode" label="结算单号"></el-table-column>
      <el-table-column prop="totalFee" label="账单总额" align="right">
        <template slot-scope="scope">{{scope.row.totalFee | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column prop="payInsur" label="应收金额" align="right">
        <template slot-scope="scope">{{scope.row.payInsur | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column prop="diagnosis" label="当次诊断"></el-table-column>
      <el-table-column prop="country" label="客户国籍"></el-table-column>
      <el-table-column prop="birthday" :formatter="convertBirthday" label="出生日期"></el-table-column>
      <template v-if="meta==1">
        <el-table-column prop="insurProductName" label="保险产品"></el-table-column>
        <el-table-column prop="insurCardNo" label="保险卡号"></el-table-column>
        <el-table-column prop="groupInsurCompany" label="团险公司名称"></el-table-column>
      </template>
      <template v-else>
        <el-table-column prop="insurProductName" label="大客户产品"></el-table-column>
      </template>
    </el-table>
    <div class="textright">
      <el-button type="primary" @click="create(true)">创建所有</el-button>
      <el-button type="primary" @click="create(false)">按选择创建</el-button>
    </div>
  </div>
</template>
<script>
import {
  insuranceName,
  insuranceProduct,
  search4LiPei,
  getAll,
  selectByCustomer
} from '@/rcm/store/medicalinsurance'
import selectInquireList from '@/warehouse/util/selectinquirelist'
let schema = [
  {
    name: 'clinicid',
    label: '就诊机构',
    span: 8,
    comp: 'ever-org-select',
    style: {
      width: '100%'
    },
    props: {
      type: 'select',
      fields: 'id'
    }
  },
  {
    name: 'insurOrgId',
    label: '公司名称',
    span: 8,
    comp: 'el-select',
    style: {
      width: '100%'
    },
    props: {
      options: []
    }
  },
  {
    name: 'insurProductId',
    label: '产品名称',
    span: 8,
    comp: 'el-select',
    props: {
      options: []
    },
    style: {
      width: '100%'
    }
  },
  {
    name: 'patientId',
    label: '患者姓名',
    span: 8,
    comp: 'ever-patient-select',
    props: {
      placeholder: '患者姓名'
    },
    style: {
      width: '100%'
    }
  }
]
export default {
  mixins: [selectInquireList],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      queryObj,
      tableData: [],
      total: 0,
      checktotal: 0,
      loading: false,
      multipleSelection: [],
      meta: this.$route.meta.type // 标识是商保还是大客户
    }
  },
  watch: {
    'queryObj.insurOrgId': {
      handler: function (val, oldval) {
        if (this.meta === 1) {
          this.getInsuranceProduct(val)
        } else {
          this.getSelectByCustomer(val)
        }
      }
    }
  },
  created () {
    // 保险公司
    this.getCompanyByMeta()
    // 结算单列表
    this.getReceivableSettlements()
  },
  methods: {
    // 保险名称
    async getCompanyByMeta () {
      if (this.meta === 1) {
        try {
          let name = await insuranceName()
          name.data.forEach(v => {
            v.name = v.insuranceOrgCnName
          })
          this.$ever.getFieldFromSchema(this.schema, 'insurOrgId').props.options =
            name.data
        } catch (err) {
          console.log(err)
        }
      } else {
        try {
          let data = await getAll()
          this.$ever.getFieldFromSchema(this.schema, 'insurOrgId').props.options = data.data
        } catch (err) {

        }
      }
    },

    // 结算单列表
    async getReceivableSettlements () {
      this.loading = true
      try {
        let params = {}
        Object.keys(this.queryObj).map(v => {
          params[v] = this.queryObj[v]
        })
        // 只拿状态为审批通过的结算单
        params.status = 3
        params.businessType = this.meta // 商保大客户标识
        let data = await search4LiPei(params)
        this.loading = false
        if (data && data.data) {
          this.tableData = data.data
          this.total = data.data.reduce((total, cur) => {
            total += cur.payInsur || 0
            return total
          }, 0).toFixed(2)
        } else {
          this.tableData = []
        }
      } catch (err) {
        this.loading = true
      }
    },
    // 大客户产品
    async getSelectByCustomer (customerId) {
      this.queryObj.insurProductId = ''
      if (!customerId) {
        return
      }
      try {
        let params = { customerId }
        let data = await selectByCustomer(params)
        data.data.forEach(v => {
          v.name = v.productName
        })
        this.$ever.getFieldFromSchema(
          this.schema,
          'insurProductId'
        ).props.options =
          data.data
      } catch (err) { }
    },
    // 保险产品
    async getInsuranceProduct (id) {
      this.queryObj.insurProductId = ''
      try {
        let params = { id }
        let data = await insuranceProduct(params)
        data.data.forEach(v => {
          v.name = v.productName
        })
        this.$ever.getFieldFromSchema(
          this.schema,
          'insurProductId'
        ).props.options =
          data.data
      } catch (err) { }
    },
    // 重置
    reset () {
      Object.keys(this.queryObj).forEach(v => {
        this.queryObj[v] = ''
      })
      this.getReceivableSettlements()
    },
    // 选中创建
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.checktotal = (val.reduce((total, cur) => {
        total += cur.payInsur || 0
        return total
      }, 0)).toFixed(2)
    },
    // 创建
    create (isAll) {
      if (isAll) {
        this.$emit('close', this.tableData)
      } else {
        if (this.multipleSelection <= 0) {
          this.$messageTips(this, 'error', '请选择结算单')
          return false
        }
        this.$emit('close', this.multipleSelection)
      }
      this.$refs.multipleTable.clearSelection()
    },
    convertTime (row) {
      return this.$moment(row.settleDate).format('YYYY-MM-DD')
    },
    convertBirthday (row) {
      return this.$moment(row.birthday).format('YYYY-MM-DD')
    }
  }
}
</script>
<style scoped>
.settle_title {
  height: 16px;
  line-height: 16px;
  padding-left: 10px;
  margin: 0 0 20px 0;
  border-left: 3px solid #1c7bef;
}
.textright {
  text-align: right;
}
</style>

