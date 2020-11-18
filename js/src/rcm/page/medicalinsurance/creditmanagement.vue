<!--
 * @Author: renpengfei
 * @Date: 2019-08-06 15:21:27
 * @LastEditors: renpengfei
 * @LastEditTime: 2019-08-12 14:42:40
 -->
<template>
  <div>
    <div class="layout_inner">
      <div class="main-head">
        <ever-form2
          :schema="querySchema"
          ref="queryform"
          v-model="queryObj"
          :is-query="true"
          @query="list()"
          labelWidth="80px"
        >
          <el-button type="primary" @click="list()" size="small" style="margin:2px 0 0 10px;">查询</el-button>
          <el-button @click="clearquery()" size="small" style="margin:2px 0 0 10px;">重置</el-button>
        </ever-form2>
        <div class="main-option">
          <el-button type="primary" size="small" @click="createReceivables()" style="margin-right:10px;">添加收款单</el-button>
        </div>
      </div>
      <el-table v-loading="loading" :data="tableData">
        <el-table-column type="index" label="序号" width="50px"></el-table-column>
        <el-table-column label="回款方" :formatter="showInsurcomOrPerson"></el-table-column>
        <el-table-column label="收款单号" prop="receiptCode"></el-table-column>
        <el-table-column label="回款日期" prop="receiptDate"></el-table-column>
        <el-table-column label="回款金额" prop="receiptFeeReal" align="right">
          <template slot-scope="scope">
            <span>{{scope.row.receiptFeeReal | formatToFinacial}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="createUser"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleDetail(scope.row)">详情</el-button>
            <ever-confirm
            :msg="'确定要作废该收款单吗？'"
            action="作废"
            @confirm="handleDelete(scope.row)"></ever-confirm>
            <el-button
              type="danger"
              v-if="scope.row.receiptType === 2"
              :disabled="scope.row.receiptFeeReal<0"
              @click="handlePayBack(scope.row)"
            >退款</el-button>
          </template>
        </el-table-column>
      </el-table>
      <ever-pagination
        :page-sizes="pageSizes"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
      ></ever-pagination>
    </div>
  </div>
</template>
<script>
import { insuranceName, getReceiptList, deleteReceipt, getAll } from '../../store/medicalinsurance.js'
let querySchema = [{
  label: '回款时间',
  name: 'receiptTime',
  comp: 'everRangePicker',
  props: {
    customWidth: '100%'
  },
  span: 6
},
{
  label: '收款单号',
  name: 'receiptCode',
  comp: '',
  props: {
    placeholder: '请输入收款单号',
    clearable: true
  },
  span: 6
},
{
  label: '公司名称',
  name: 'comInsur',
  comp: 'ever-select',
  props: {
    placeholder: '请选择公司',
    options: []
  },
  span: 6
},
{
  label: '患者',
  name: 'patientId',
  comp: 'ever-patient-select',
  props: {
    placeholder: '姓名/手机号'
  },
  span: 6
},
{
  label: '备注',
  name: 'remark',
  comp: '',
  props: {
    placeholder: '请输入备注'
  },
  span: 6
}]
export default {
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      querySchema: querySchema,
      queryObj: queryObj,
      tableData: [],
      pageSizes: [5, 10, 15, 20],
      pagesize: 20,
      pageIndex: 1,
      totalCount: 10,
      loading: false,
      meta: this.$route.meta.type,
    }
  },
  created () {
    // 获取保险公司或大客户
    this.getCompanyByMeta()
    this.list()
  },
  methods: {
    async getCompanyByMeta () {
      if (this.meta === 1) {
        let data = await insuranceName()
        data.data.forEach(v => { v['name'] = v.insuranceOrgCnName })
        this.$ever.getFieldFromSchema(this.querySchema, 'comInsur').props.options = data.data
      } else {
        try {
          let data = await getAll()
          this.$ever.getFieldFromSchema(this.querySchema, 'comInsur').props.options = data.data
        } catch (err) {

        }
      }
    },
    list () {
      this.loading = true
      this.queryObj.beginDate = this.queryObj.receiptTime && this.queryObj.receiptTime[0]
      this.queryObj.endDate = this.queryObj.receiptTime && this.queryObj.receiptTime[1]
      let params = {}
      // 过滤查询条件，字段为空的不要加进来
      Object.keys(this.queryObj).forEach(v => {
        if (this.queryObj[v] !== '') {
          params[v] = this.queryObj[v]
        }
      })
      params.offset = this.pagesize * (this.pageIndex - 1)
      params.pagesize = this.pagesize
      params.businessType = this.meta
      getReceiptList(params).then(res => {
        this.loading = false
        this.tableData = res.data
        this.totalCount = res.totalCount
      }).catch(_ => {
        this.loading = false
      })
    },
    clearquery () {
      this.$refs.queryform.resetForm()
    },
    createReceivables () {
      this.$router.push({
        path: this.meta === 1 ? '/financial/creditdetail' : '/financial/creditdetailcustomer'
      })
    },
    handleDetail (row) {
      this.$router.push({
        path: this.meta === 1 ? '/financial/creditdetail' : '/financial/creditdetailcustomer',
        query: { id: row.id, payer: row.receiptType === 1 ? row.patientName : row.insurOrgName }
      })
    },
    handleDelete (row) {
      let params = {
        id: row.id
      }
      deleteReceipt(params).then(res => {
        if (res.head && res.head.errCode === 0) {
          this.$messageTips(this, 'success', '收款单作废成功！')
          this.list()
        }
      })
    },
    handlePayBack (row) {
      this.$router.push({
        path: this.meta === 1 ? '/financial/insurrefund' : '/financial/insurrefundcustomer',
        query: {
          id: row.id,
          receiptCode: row.receiptCode,
          receiptFeeReal: row.receiptFeeReal
        }
      })
    },
    showInsurcomOrPerson (row) {
      return row.receiptType === 1 ? row.patientName : row.insurOrgName
    },
    handleSizeChange (pagesize) {
      this.pagesize = pagesize
      this.list()
    },
    handleCurrentChange (pageIndex) {
      this.pageIndex = pageIndex
      this.list()
    }
  }
}
</script>
<style scoped>
</style>
