<template>
  <div>
    <ever-bread-crumb name="收款核销管理" path=""></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <div class="main-head">
          <div class="main-option">
            <!-- <el-button size="small" type="primary" @click.native.prevent="verifaction()">核销</el-button>
            <el-button size="small" type="danger" @click.native.prevent="deleteReceipt()">删除</el-button> -->
          </div>
          <h4>
            收款单基本信息
          </h4>
          <ever-form-model
            :schema="querySchema"
            v-model="queryObj"
            :api="api"
            :span='8'
            ref="form"
            labelWidth="120px"
            label-position="right">
          </ever-form-model>
        </div>
        <h4>
            收款明细
          </h4>
        <el-table
          :data="tableData"
          style="width: 100%"
          >
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center">
          </el-table-column>
          <el-table-column
            prop="insurCode"
            label="保单号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="patientName"
            label="会员姓名"
            align="center">
          </el-table-column>
          <el-table-column
            prop="patientSex"
            label="性别"
            align="center">
            <template slot-scope="scope">
              {{scope.row.patientSex === '1' ? '男' : '女'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="rootorderid"
            label="交易流水号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="billdate"
            label="交易日期"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="orderDeptName"
            label="就诊科室"
            align="center">
          </el-table-column>
          <el-table-column
            prop="doctorName"
            label="就诊医生"
            align="center">
          </el-table-column>
          <el-table-column
            prop="diagnosis"
            label="诊断名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="itemcode"
            label="保险诊疗项目编码"
            align="center">
          </el-table-column>
          <el-table-column
            prop="qtyunit"
            label="规格"
            align="center">
          </el-table-column>
          <el-table-column
            prop="price"
            label="单价"
            align="right">
            <template slot-scope="scope">
              {{scope.row.price | formatToFinacial}}
            </template>
          </el-table-column>
          <el-table-column
            prop="quantity"
            label="数量"
            align="right">
            <template slot-scope="scope">
              {{scope.row.quantity}}
            </template>
          </el-table-column>
          <el-table-column
            prop="totalfee"
            label="项目总金额"
            align="right">
            <template slot-scope="scope">
              {{scope.row.totalfee | formatToFinacial}}
            </template>
          </el-table-column>
          <el-table-column
            prop="insuranceFee"
            label="保险内费用"
            align="right">
            <template slot-scope="scope">
              {{scope.row.insuranceFee | formatToFinacial}}
            </template>
          </el-table-column>
          <el-table-column
            prop="refuseFee"
            label="拒付费用"
            align="right">
            <template slot-scope="scope">
              {{scope.row.refuseFee | formatToFinacial}}
            </template>
          </el-table-column>
          <el-table-column
            prop="fee"
            label="实收金额"
            align="right">
            <template slot-scope="scope">
              {{scope.row.fee | formatToFinacial}}
            </template>
          </el-table-column>
          <el-table-column
            prop="refusereason"
            label="拒付原因"
            align="center">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../store/receiptcodelistapi'
import {isNull} from '@/util/common'

var schema = [
  {
    name: 'receipttype',
    label: '保险类型',
    disabled: true,
    type: 'select',
    options: api.corpTypeStr
  },
  {
    name: 'insureOrgShortName',
    label: '保险公司名称',
    disabled: true
  },
  {
    name: 'receiptcode',
    label: '收款单号',
    disabled: true
  },
  {
    name: 'insuranceFee',
    label: '保险应收金额',
    disabled: true
  },
  {
    name: 'refuseFee',
    label: '拒付费用',
    disabled: true
  },
  {
    name: 'receiptfee',
    label: '实收金额',
    disabled: true
  },
  {
    name: 'payMethod',
    label: '收款方式',
    type: 'select',
    disabled: true,
    options: [
      {id: '0', name: '会员卡'},
      {id: '1', name: '现金'},
      {id: '2', name: '银行转账'},
      {id: '3', name: '微信'},
      {id: '4', name: '支付宝'},
      {id: '5', name: '支票'},
      {id: '6', name: '汇款'},
      {id: '7', name: '挂账'}
    ],
    code: 'THE_RCM_PAYMENT_METHOD'
  },
  {
    name: 'receiptdate',
    label: '收款日期',
    type: 'date',
    disabled: true,
    outformat: 'yyyy-MM-dd'
  },
  {
    name: 'remark',
    disabled: true,
    label: '备注'
  }
]
export default {
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      querySchema: schema,
      queryObj: obj,
      tableData: [],
      listParams: { 'code': this.$route.params.receiptCode },
      receipttype: api.receipttype,
      receiptstatus: api.receipttype,
      isNull
    }
  },
  created () {
    api.list(this.listParams)
      .then(result => {
        result.data.receipttype = result.data.receipttype ? String(result.data.receipttype) : ''
        result.data.payMethod = result.data.payMethod ? String(result.data.payMethod) : ''
        result.data.payStatus = result.data.payStatus ? String(result.data.payStatus) : ''
        Object.assign(this.queryObj, result.data)
        this.tableData = this.queryObj.details
        // this.listTableData = result.data
      })
  },
  methods: {
    verifaction () {
      let id = this.$route.params.id
      api.verifaction(id)
        .then(result => {
          // console.log('xxxxxxx')
        })
    },
    deleteReceipt () {
      let id = this.$route.params.id
      if (this.queryObj.status === 1) {
        api.deleteVerifaction(id)
          .then(result => {
            api.del(id).then(resultData => {
              history.go(-1)
            })
          })
      } else {
        api.del(id)
          .then(result => {
            history.go(-1)
          })
      }
    }
  },
  beforeCreate () {
    this.api = api
  }
}
</script>
