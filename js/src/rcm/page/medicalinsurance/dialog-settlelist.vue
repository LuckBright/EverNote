<!--
 * @Author: renpengfei
 * @Date: 2019-08-06 15:21:27
 * @LastEditors: renpengfei
 * @LastEditTime: 2019-09-10 10:24:10
 -->
<template>
  <div v-loading="loading">
    <ever-form2
      :schema="schema"
      v-model="queryObj"
      @query="getsettle(true)"
      :is-query="true"
      labelWidth="80px"
    >
      <template slot="default">
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" @click="getsettle(true)">查询</el-button>
            <el-button type="primary" plain @click="reset">重置</el-button>
          </el-form-item>
        </el-col>
      </template>
    </ever-form2>
    <h4 class="settle_title">选择{{this.meta===1?'商保':'大客户'}}结算单</h4>
    <div>
      <span>全部应收合计：{{total}}</span>
      <span style="margin-left:20px;">选中应收合计：{{checktotal}}</span>
    </div>
    <el-table
      :data="tableData"
      height="250"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      ref="multipleTable"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="chargeDate" show-overflow-tooltip label="结算日期"></el-table-column>
      <el-table-column prop="clinicName" show-overflow-tooltip label="就诊机构"></el-table-column>
      <el-table-column prop="orderDeptName" show-overflow-tooltip label="就诊科室"></el-table-column>
      <el-table-column prop="orderDoctorName" label="就诊医生"></el-table-column>
      <el-table-column prop="patientCode" show-overflow-tooltip label="患者档案号"></el-table-column>
      <el-table-column prop="patientName" show-overflow-tooltip label="客户姓名"></el-table-column>
      <el-table-column prop="settlementCode" show-overflow-tooltip label="结算单号"></el-table-column>
      <el-table-column prop="totalFee" label="账单总额" align="right">
        <template slot-scope="scope">{{scope.row.totalFee | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column prop="payInsur" label="应收金额" align="right">
        <template slot-scope="scope">{{scope.row.payInsur | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column prop="diagnosis" label="当次诊断"></el-table-column>
      <el-table-column prop="country" label="客户国籍"></el-table-column>
      <el-table-column prop="birthday" show-overflow-tooltip label="出生日期"></el-table-column>
      <el-table-column
        prop="productName"
        show-overflow-tooltip
        :label="this.meta===1?'保险产品':'大客户产品'"
      ></el-table-column>
      <el-table-column prop="insurCardNo" :label="this.meta===1?'保险卡号':'大客户卡号'"></el-table-column>
      <el-table-column prop="groupInsurCompany" label="团险公司名称"></el-table-column>
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
  receivableSettlements,
  getBigCustomerCheckSettlements,
  selectByCustomer,
  getAll,
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
    name: 'patientid',
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
  props: {
    'meta': {
      type: Number,
      default: 1
    },
  },
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    // let queryObj1 = this.$ever.createObjFromSchema(schema1)
    return {
      schema,
      //   schema1,
      queryObj,
      //   queryObj1,
      tableData: [],
      total: 0,
      checktotal: 0,
      loading: false,
      multipleSelection: []
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
    this.getsettle()
  },
  methods: {
    // // 保险名称
    // async getInsuranceName () {
    //   try {
    //     let name = await insuranceName()
    //     name.data.forEach(v => {
    //       v.name = v.insuranceOrgCnName
    //     })
    //     this.$ever.getFieldFromSchema(this.schema, 'insurOrgId').props.options =
    //       name.data
    //   } catch (err) {
    //     console.log(err)
    //   }
    // },
    async getCompanyByMeta () {
      if (this.meta === 1) {
        let data = await insuranceName()
        data.data.forEach(v => { v['name'] = v.insuranceOrgCnName })
        this.$ever.getFieldFromSchema(this.schema, 'insurOrgId').props.options = data.data
      } else {
        try {
          let data = await getAll()
          this.$ever.getFieldFromSchema(this.schema, 'insurOrgId').props.options = data.data
        } catch (err) {

        }
      }
    },
    getsettle () {
      console.log(this.meta)
      if (this.meta === 1) {
        this.getReceivableSettlements()
      } else {
        this.getBigCustomerCheckSettlements()
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
        params.forCheck = 'true'
        let data = await receivableSettlements(params)
        this.loading = false
        if (data && data.data) {
          this.tableData = data.data
          this.total = data.total
        } else {
          this.tableData = []
        }
      } catch (err) {
        this.loading = false
      }
    },
    // 结算单列表
    async getBigCustomerCheckSettlements () {
      this.loading = true
      try {
        let params = {}
        Object.keys(this.queryObj).map(v => {
          params[v] = this.queryObj[v]
        })
        params.forCheck = 'true'
        let data = await getBigCustomerCheckSettlements(params)
        this.loading = false
        if (data && data.data) {
          this.tableData = data.data
          this.total = data.total
        } else {
          this.tableData = []
        }
      } catch (err) {
        this.loading = false
      }
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
    // 重置
    reset () {
      Object.keys(this.queryObj).forEach(v => {
        this.queryObj[v] = ''
      })
      this.getsettle()
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

