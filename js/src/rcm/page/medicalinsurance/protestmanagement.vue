<!--
 * @Author: renpengfei
 * @Date: 2019-08-06 15:21:27
 * @LastEditors: renpengfei
 * @LastEditTime: 2019-09-06 10:57:49
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
          <el-button
            type="primary"
            @click="list()"
            size="small"
            style="margin:2px 0 0 10px;"
            >查询</el-button
          >
          <el-button
            @click="clearquery()"
            size="small"
            style="margin:2px 0 0 0;"
            >重置</el-button
          >
        </ever-form2>
      </div>
      <el-table v-loading="loading" :data="tableData">
        <el-table-column
          type="index"
          label="序号"
          width="50px"
        ></el-table-column>
        <el-table-column
          label="结算日期"
          width="105"
          prop="chargeDate"
        ></el-table-column>
        <el-table-column
          label="就诊机构"
          prop="clinicName"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="结算单号"
          show-overflow-tooltip
          prop="settlementCode"
        ></el-table-column>
        <el-table-column
          label="患者档案号"
          show-overflow-tooltip
          prop="patientCode"
        ></el-table-column>
        <el-table-column label="客户姓名" prop="patientName"></el-table-column>
        <el-table-column
          label="理赔单号"
          show-overflow-tooltip
          prop="claimNumber"
        ></el-table-column>
        <el-table-column
          :label="this.meta === 1 ? '商保应付' : '大客户应付'"
          prop="payInsur"
          align="right"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.payInsur | formatToFinacial }}</span>
          </template>
        </el-table-column>
        <el-table-column label="个人应付" prop="payPerson" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.payPerson | formatToFinacial }}</span>
          </template>
        </el-table-column>
        <el-table-column label="拒付金额" prop="refuseFee" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.refuseFee | formatToFinacial }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="this.meta === 1 ? '商保待付' : '大客户待付'"
          align="right"
        >
          <template slot-scope="scope">
            <span>{{
              (Number(scope.row.payInsur || 0) -
                Number(scope.row.paidInsur || 0))
                | formatToFinacial
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="个人待付" align="right">
          <template slot-scope="scope">
            <span>{{
              (Number(scope.row.payPerson || 0) -
                Number(scope.row.paidPerson || 0))
                | formatToFinacial
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="坏账金额" prop="baddebtFee" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.baddebtFee | formatToFinacial }}</span>
          </template>
        </el-table-column>
        <el-table-column label="调账差异" prop="adjustFee" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.adjustFee | formatToFinacial }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="230px" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleDetail(scope.row)"
              >拒付详情</el-button
            >
            <el-button type="primary" @click="PersonPayBack(scope.row, false)"
              >个人补缴</el-button
            >
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link"
                >更多
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="{ func: 'PersonPayBack', args: [scope.row, true] }"
                >
                  个人退款
                </el-dropdown-item>
                <el-dropdown-item
                  :command="{ func: 'confirmBadDebt', args: [scope.row] }"
                >
                  应付调整
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <ever-pagination
        :page-sizes="pageSizes"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
      ></ever-pagination>
      <div class="totalCount">
        <span class="item">
          全部应收合计：
          <span class="cRed">{{ total | formatToFinacial }}</span>
        </span>
        <span class="item">
          全部拒付金额合计：
          <span class="cRed">{{ totalRefuse | formatToFinacial }}</span>
        </span>
      </div>
      <el-dialog :title="dialogtile" :visible.sync="dialogshow">
        <dialog-protest :obj="obj" @close="dialogClose"></dialog-protest>
      </el-dialog>
      <paymethodstwo
        :obj="PersonPayObj"
        :dialogVisible.sync="PayMethodTwoDialogVisible"
        @cancel="closePaymethodtwo"
        @payStatus="handleSuccess"
      ></paymethodstwo>
    </div>
  </div>
</template>
<script>
import { insuranceName, search, getAll } from '../../store/medicalinsurance.js'
import dialogProtest from './dialog-protest';
('../../../util/common.js')
let querySchema = [
  {
    label: '公司名称',
    name: 'insurOrgId',
    comp: 'ever-select',
    props: {
      placeholder: '请选择公司',
      options: []
    },
    span: 6
  },
  {
    label: '创建时间',
    name: 'receiptTime',
    comp: 'everRangePicker',
    props: {
      autoWidth: true
    },
    span: 6
  },
  {
    label: '患者姓名',
    name: 'patientid',
    comp: 'ever-patient-select',
    props: {
      placeholder: '姓名/手机号'
    },
    span: 6
  },
  {
    label: '结算单号',
    name: 'settlementCode',
    comp: '',
    props: {
      placeholder: '请输入结算单号'
    },
    span: 6
  },
  {
    label: '',
    name: 'refuseFee',
    comp: 'checkbox',
    props: {
      options: [
        { id: '拒付金额为0不显示', label: '拒付金额为0不显示', value: 0 }
      ]
    },
    span: 4
  }
]
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
      dialogtile: '',
      obj: {
        id: '',
        patientName: '',
        totalFee: '',
        chargeDate: '',
        tableData: {}
      },
      dialogshow: false,
      total: '',
      totalRefuse: '',
      PersonPayObj: {
        // 优惠金额（退款展示）
        totalDiscount: 0,
        outpatientrefund: false,
        // 支付历史
        refundReceiptFlows: [],
        // 外层loading
        loading: false,
        // 患者id
        patientid: '',
        // 结算单id
        id: '',
        // 结算单号
        settleCode: '',
        // 还需支付
        unexefee: 0,
        // 已收金额
        exefee: 0,
        // 是否展示支付记录
        obsolete: true,
        // 总额
        totalFee: 0,
        // 4一站式挂号 1门诊 2住院(押金) 3商城(营销)5无处方结算写死的,6商保结算个人回款
        payType: '6',
        // 商保应收退款还是收款,1默认是付款
        sbskType: 1,
        // 支付方式
        paymethodArr: [],
        // 押金是false,费用为true
        isValited: false,
        // 支付记录
        payTradeLog: [{ name: 1 }, { name: 1 }],
        // 是否押金(押金传1)
        isDeposit: 0,
        // 是否退费(退费传true)
        isRefund: false
      },
      PayMethodTwoDialogVisible: false,
      meta: this.$route.meta.type
    }
  },
  components: {
    dialogProtest
  },
  created () {
    this.getCompanyByMeta()
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
          this.$ever.getFieldFromSchema(
        this.querySchema,
        'insurOrgId'
      ).props.options = insuranceComList
        })
      } else {
        try {
          let data = await getAll()
          this.$ever.getFieldFromSchema(
        this.querySchema,
        'insurOrgId'
      ).props.options = data.data
        } catch (err) {

        }
      }
    },
    list () {
      this.loading = true
      this.queryObj.applyBeginDate = this.queryObj.receiptTime && this.queryObj.receiptTime[0]
      this.queryObj.applyEndDate = this.queryObj.receiptTime && this.queryObj.receiptTime[1]
      let params = {}
      // 过滤查询条件，字段为空的不要加进来
      Object.keys(this.queryObj).forEach(v => {
        if (this.queryObj[v] !== '' && v !== 'refuseFee') {
          params[v] = this.queryObj[v]
        }
      })
      if (this.queryObj.refuseFee) {
        params.refuseFee = 0
      }
      params.offset = this.pagesize * (this.pageIndex - 1)
      params.pagesize = this.pagesize
      params.businessType = this.meta
      search(params).then(res => {
        this.loading = false
        this.tableData = res.data
        this.tableData.forEach(v => {
          v.payInsur = v.payInsur ? v.payInsur : 0
          v.paidInsur = v.paidInsur ? v.paidInsur : 0
          v.payPerson = v.payPerson ? v.payPerson : 0
          v.paidPerson = v.paidPerson ? v.paidPerson : 0
          v.refuseFee = v.refuseFee ? v.refuseFee : 0
          v.baddebtFee = v.baddebtFee ? v.baddebtFee : 0
        })
        // 计算总应收
        this.total = res.data
          .reduce((total, cur) => {
            total += cur.payInsur || 0
            return total
          }, 0)
          .toFixed(2)
        // 计算总拒付
        this.totalRefuse = res.data
          .reduce((total, cur) => {
            total += cur.refuseFee || 0
            return total
          }, 0)
          .toFixed(2)
        this.totalCount = res.totalCount
      }).catch(_ => {
        this.loading = false
      })
    },
    clearquery () {
      this.$refs.queryform.resetForm()
    },
    createReceivables () {},
    handleDetail (row) {
      this.$router.push({
        path:
          this.meta === 1
            ? '/financial/protestdetail'
            : '/financial/protestdetailcustomer',
        query: {
          id: row.id,
          insurOrgName: row.insurOrgName,
          patientName: row.patientName,
          patientCode: row.patientCode,
          settlementCode: row.settlementCode,
          refuseFee: row.refuseFee
        }
      })
    },
    // remainPay (row) {
    //   return (Number(row.payInsur || 0) - Number(row.paidInsur || 0)).toFixed(2)
    // },
    // remainPayPerson (row) {
    //   return (Number(row.payPerson || 0) - Number(row.paidPerson || 0)).toFixed(2)
    // },
    handleSizeChange (pagesize) {
      this.pagesize = pagesize
      this.list()
    },
    handleCurrentChange (pageIndex) {
      this.pageIndex = pageIndex
      this.list()
    },
    handleCommand (command) {
      this[command.func].apply(null, command.args)
    },
    PersonPayBack (row, isRefund) {
      this.PersonPayObj.patientid = row.patientid
      this.PersonPayObj.id = row.id
      this.PersonPayObj.settleCode = row.id
      this.PersonPayObj.totalFee = isRefund
        ? Number(row.paidPerson)
        : Number(row.payPerson)
      this.PersonPayObj.exefee = Number(row.paidPerson)
      this.PersonPayObj.unexefee = isRefund
        ? Number(row.paidPerson)
        : Number(row.payPerson) - Number(row.paidPerson)
      this.PersonPayObj.isRefund = isRefund ? 1 : ''
      // 商保个人回款，退款-1，付款1
      this.PersonPayObj.sbskType = isRefund ? '-1' : '1'
      this.PayMethodTwoDialogVisible = true
    },
    confirmBadDebt (row) {
      let tableData = []
      tableData.push({
        serviceProvider: this.meta === 1 ? '商保公司' : '大客户公司',
        pay: row.payInsur,
        paid: row.paidInsur,
        remain: (
          Number(row.payInsur || 0) - Number(row.paidInsur || 0)
        ).toFixed(2)
      })
      tableData.push({
        serviceProvider: '个人',
        pay: row.payPerson,
        paid: row.paidPerson,
        remain: (
          Number(row.payPerson || 0) - Number(row.paidPerson || 0)
        ).toFixed(2)
      })

      Object.assign(this.obj, {
        id: row.id,
        patientName: row.patientName,
        totalFee: row.totalFee,
        shouldPaid: Number(row.payInsur) + Number(row.payPerson),
        chargeDate: row.chargeDate,
        tableData: tableData
      })
      this.dialogtile = '应收调整'
      this.dialogshow = true
    },
    dialogClose () {
      this.dialogshow = false
      this.list()
    },
    handleSuccess () {
      this.$messageTips(this, 'success', '操作成功')
      this.PayMethodTwoDialogVisible = false
      this.list()
    },
    closePaymethodtwo () {
      this.PayMethodTwoDialogVisible = false
      this.list()
    }
  }
}
</script>
<style scoped>
.layout_inner /deep/ .el-dialog {
  min-width: 960px;
}
.totalCount {
  line-height: 50px;
  text-align: right;
}
.totalCount .item {
  margin-left: 30px;
}
</style>
