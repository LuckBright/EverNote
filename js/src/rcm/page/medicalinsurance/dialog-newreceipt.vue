<template>
  <div>
    <ever-form2
      :schema="querySchema"
      ref="queryform"
      v-model="queryObj"
      :inline="true"
      :is-query="true"
      @query="list()"
    >
      <el-button type="primary" size="small" @click="list()" style="margin:2px 0 0 10px;">查询</el-button>
    </ever-form2>
    <el-table
      v-loading="loading"
      :data="tableData"
      @selection-change="handleSelectionChange"
      ref="multipleTable"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="结算日期" prop="chargeDate"></el-table-column>
      <el-table-column label="就诊机构" prop="clinicName"></el-table-column>
      <el-table-column label="结算单号" prop="settlementCode" width="100%"></el-table-column>
      <el-table-column label="患者档案号" prop="patientCode"></el-table-column>
      <el-table-column label="客户姓名" prop="patientName"></el-table-column>
      <el-table-column label="理赔单号" prop="claimNumber"></el-table-column>
      <el-table-column label="账单总额" prop="totalFee" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.totalFee | formatToFinacial}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="meta==1?'商保应收':'大客户应收'" prop="payInsur" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.payInsur | formatToFinacial}}</span>
        </template>
      </el-table-column>
      <el-table-column label="未收金额" align="right">
        <template slot-scope="scope">
          <span>{{(Number(scope.row.payInsur || 0) - Number(scope.row.paidInsur || 0)) | formatToFinacial}}</span>
        </template>
      </el-table-column>
      <el-table-column label="当次诊断" prop="diagnosis"></el-table-column>
      <el-table-column label="客户国籍" prop="country"></el-table-column>
      <el-table-column label="出生日期" prop="birthday"></el-table-column>
      <template v-if="meta === 1">
        <el-table-column label="保险产品" prop="productName"></el-table-column>
        <el-table-column label="保险卡号" prop="insurCardNo"></el-table-column>
        <el-table-column label="团险公司名称" prop="groupInsurCompany"></el-table-column>
      </template>
      <template v-else>
        <el-table-column label="大客户产品" prop="productName"></el-table-column>
      </template>
    </el-table>
    <div class="countAll">
      <span class="item">全部应收合计：</span>
      <span class="cRed">{{total | formatToFinacial}}</span>
      <span class="item">选中应收合计：</span>
      <span class="cRed">{{checktotal | formatToFinacial}}</span>
    </div>
    <div>
      <el-button type="primary" @click="create(true)">全部生成收款单</el-button>
      <el-button type="primary" @click="create(false)">按选择生成收款单</el-button>
    </div>
  </div>
</template>
<script>
import { insuranceName, search, getAll } from '../../store/medicalinsurance'
let querySchema = [{
  label: '公司名称',
  name: 'insurOrgName',
  comp: 'ever-select',
  props: {
    placeholder: '请选择公司',
    options: []
  }
},
{
  label: '收费日期',
  name: 'receiptTime',
  comp: 'everRangePicker',
  props: {
    autoWidth: 'true'
  }
},
{
  label: '患者姓名',
  name: 'patientId',
  comp: 'ever-patient-select',
  props: {
    placeholder: '姓名/手机号'
  }
},
{
  label: '理赔单号',
  name: 'claimNumber',
  comp: '',
  props: {
    placeholder: '请输入理赔单号'
  }
}]
export default {
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      querySchema: querySchema,
      queryObj: queryObj,
      tableData: [],
      loading: false,
      total: 0,
      checktotal: 0,
      multipleSelection: [],
      meta: this.$route.meta.type
    }
  },
  created () {
    // 获取商保公司下拉列表
    this.getCompanyByMeta()
    // 获取应收账单列表
    this.list()
  },
  methods: {
    async getCompanyByMeta () {
      if (this.meta === 1) {
        insuranceName().then(res => {
      // console.log(res, '保险公司结果')
          let insuranceComList = []
          res.data.forEach((v, i) => {
            insuranceComList.push({ id: v.id, name: v.insuranceOrgCnName })
          })
          this.$ever.getFieldFromSchema(this.querySchema, 'insurOrgName').props.options = insuranceComList
        })
      } else {
        try {
          let data = await getAll()
          this.$ever.getFieldFromSchema(this.querySchema, 'insurOrgName').props.options = data.data
        } catch (err) {

        }
      }
    },
    list () {
      this.loading = true
      let params = {
        applyBeginDate: this.queryObj.receiptTime && this.queryObj.receiptTime[0],
        applyEndDate: this.queryObj.receiptTime && this.queryObj.receiptTime[1],
        patientid: this.queryObj.patientId,
        insurOrgId: this.queryObj.insurOrgName,
        claimNumber: this.queryObj.claimNumber,
        businessType: this.meta
      }
      if (this.meta === 2) { // 大客户回款源单过滤未收金额为0的单子
        params.filter = true
      }
      search(params).then(res => {
        res.data.forEach((v, i) => {
          v.payFee = ''
          v.remark = ''
        })
        this.tableData = res.data
        this.total = (res.data.reduce((total, cur) => {
          total += cur.payInsur || 0
          return total
        }, 0)).toFixed(2)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 选中创建
    handleSelectionChange (val) {
      // console.log(val, '11111')
      this.multipleSelection = val
      this.checktotal = (val.reduce((total, cur) => {
        total += cur.payInsur || 0
        // console.log(total, cur)
        return total
      }, 0)).toFixed(2)
    },
    // 创建
    create (isAll) {
      if (isAll) {
        // // 获取所有应收账单
        // search({}).then(res => {
        //   this.tableData = res.data
        //   this.total = (res.data.reduce((total, cur) => {
        //     total += cur.payInsur
        //     return total
        //   }, 0)).toFixed(2)
        // })
        this.$emit('close', this.tableData)
      } else {
        if (this.multipleSelection <= 0) {
          this.$messageTips(this, 'error', '请选择应收账单')
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
.countAll {
  text-align: right;
}
.countAll .item {
  margin-left: 20px;
}
</style>
