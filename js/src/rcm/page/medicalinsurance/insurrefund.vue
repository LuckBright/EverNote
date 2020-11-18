<template>
  <div>
    <!-- <ever-bread-crumb name="商保退款单" path="/financial/insurrefund" :haveReturn="true"></ever-bread-crumb> -->
    <div class="layout_inner">
      <div class="main-head">
        <ever-form2 :schema="querySchema" :rules="querySchemaRules" v-model="queryObj" ref="form">
          <template slot="receiptFeeReal">
            <el-input type="number" v-model="queryObj.receiptFeeReal" :disabled="true" placeholder="请填写大于0的退款金额"></el-input>
          </template>
          <div></div>
        </ever-form2>
      </div>
      <div class="header">
        <strong class="title">退款源单明细</strong>
      </div>
      <el-table v-loading="loading" :data="tableData">
        <el-table-column label="结算单号" show-overflow-tooltip prop="settlementCode" width="100%"></el-table-column>
        <el-table-column label="会员编号" show-overflow-tooltip prop="patientCode"></el-table-column>
        <el-table-column label="会员姓名" prop="patientName"></el-table-column>
        <el-table-column label="理赔单号" show-overflow-tooltip prop="claimNumber"></el-table-column>
        <el-table-column label="就诊日期" prop="chargeDate"></el-table-column>
        <el-table-column :label="this.meta===1?'商保应付':'大客户应付'" prop="payInsur" align="right">
          <template slot-scope="scope">
            <span>{{scope.row.payInsur | formatToFinacial}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="this.meta===1?'商保已付':'大客户已付'" prop="paidInsur" align="right">
          <template slot-scope="scope">
            <span>{{scope.row.paidInsur | formatToFinacial}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="this.meta===1?'商保待付':'大客户待付'" align="right">
          <template slot-scope="scope">
            <span>{{(Number(scope.row.payInsur || 0) - Number(scope.row.paidInsur || 0)) | formatToFinacial}}</span>
          </template>
        </el-table-column>
        <el-table-column label="本次退费" prop="payFee">
          <template slot-scope="scope">
            <el-input
              type="number"
              v-model="scope.row.payFee"
              @keyup.native="limitDecimal(scope.row.payFee,'payFee', scope.$index)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="insuranceCompanyName">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div class="buttons">
        <el-button type="primary" @click="handleInsurRefund">保存</el-button>
        <el-button type="primary" plain @click="backToList">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { insuranceName, createReceipt, getAll, getReceiptDetail } from '../../store/medicalinsurance.js'
const validator = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('退款金额不能为空'))
  } else if (value <= 0) {
    return callback(new Error('退款金额必须大于0'))
  } else {
    callback()
  }
}
let querySchema = [
  {
    label: '退款单号',
    name: '',
    props: {
      placeholder: '退款单号自动生成',
      disabled: true
    },
    span: 8
  },
  {
    label: '收款单位类型',
    name: 'receiptType',
    comp: 'ever-select',
    props: {
      options: [{
        id: 2,
        name: '公司'
      }]
    },
    span: 8
  },
  {
    label: '收款单位',
    name: 'payer',
    comp: 'ever-select',
    props: {
      placeholder: '请选择收款单位',
      options: []
    },
    span: 8
  },
  {
    label: '实退金额',
    name: 'receiptFeeReal',
    comp: 'custom',
    span: 8
  },
  {
    label: '结算方式',
    name: 'payType',
    props: {
      placeholder: '请填写结算方式'
    },
    span: 8
  },
  {
    label: '退款日期',
    name: 'receiptDate',
    comp: 'el-date-picker',
    props: {
      placeholder: '请选择退款日期'
    },
    style: {
      width: '100%'
    },
    span: 8
  },
  {
    label: '源单单号',
    name: 'refundSourceCode',
    props: {
      disabled: true
    },
    span: 8
  },
  {
    label: '备注',
    name: 'remark',
    span: 8
  },
  {
    label: '',
    name: 'buttons',
    comp: 'custom',
    newRow: true
  }
]
let querySchemaRules = {
  payer: [
    {
      required: true,
      message: '请选择商保公司',
      trigger: 'blur'
    }
  ],
  receiptFeeReal: [{
    required: true,
    message: '实退金额不能为空',
    trigger: 'blur'
  }, {
    validator: validator,
    trigger: 'blur'
  }],
  receiptType: [{
    required: true,
    message: '请选择收款单位类型',
    trigger: 'blur'
  }],
  payType: [
    {
      required: true,
      message: '请填写结算方式',
      trigger: 'blur'
    }
  ],
  receiptDate: [
    {
      required: true,
      message: '请选择退款日期',
      trigger: 'blur'
    }
  ]
}
export default {
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    // 源单单号位置显示收款单号
    queryObj.refundSourceCode = this.$route.query.receiptCode
    return {
      querySchema: querySchema,
      queryObj: queryObj,
      querySchemaRules: querySchemaRules,
      // 回款金额，退款之前做校验
      receiptFeeReal: this.$route.query.receiptFeeReal,
      meta: this.$route.meta.type,
      tableData: [],
      loading: false
    }
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
          this.$ever.getFieldFromSchema(this.querySchema, 'payer').props.options = insuranceComList
        })
      } else {
        try {
          let data = await getAll()
          this.$ever.getFieldFromSchema(this.querySchema, 'payer').props.options = data.data
        } catch (err) {

        }
      }
    },
    list () {
      // 如果有id则根据id获取收款单信息
      let params = {
        id: this.$route.query.id
      }
      getReceiptDetail(params).then(res => {
        res.data.details.map(item => {
          item.payFee = ''
          item.remark = ''
        })
        this.tableData = res.data.details
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleInsurRefund () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          if (this.queryObj.receiptFeeReal > this.receiptFeeReal) {
            this.$messageTips(this, 'error', '退款金额不能大于回款金额')
            return false
          }
          let details = []
          for (let item of this.tableData) {
            details.push({
              receivableId: item.receivableId,
              settlementCode: item.settlementCode,
              remark: item.remark, // 备注
              payFee: -item.payFee,
              paidInsur: item.paidInsur // 已付
            })
          }
          let params = Object.assign({}, this.queryObj)
          params.receiptFeeReal = -params.receiptFeeReal
          params.businessType = this.$route.meta.type
          params.details = details
          // console.log(params, '提交参数')
          createReceipt(params).then(res => {
            if (res.head && res.head.errCode === 0) {
              this.$messageTips(this, 'success', '退款成功')
              if (this.meta === 1) {
                this.$router.push('/financial/creditmanagement')
              } else {
                this.$router.push('/financial/creditmanagementcustomer')
              }
            }
          })
        }
      })
    },
    backToList () {
      if (this.meta === 1) {
        this.$router.push('/financial/creditmanagement')
      } else {
        this.$router.push('/financial/creditmanagementcustomer')
      }
    },
    // 限制金额只能两位小数
    limitDecimal (fee, param, index) {
      if (/^[+-]?\d*\.?\d{0,2}$/.test(fee)) {
      } else {
        this.tableData[index][param] = fee.substring(0, fee.length - 1)
      }
      if (Number(this.tableData[index].payFee) > Number(this.tableData[index].paidInsur)) {
        this.tableData[index].payFee = 0
        this.$messageTips(this, 'warning', '本次支付金额不能大于待付金额')
      }
      this.computedFee()
    },
    computedFee () {
      // 重新计算结算单收款合计
      this.queryObj.receiptFeeReal = (this.tableData.reduce((total, cur) => {
        total += Number(cur.payFee)
        return total
      }, 0)).toFixed(2)
    }
  }
}
</script>
<style scoped>
.buttons {
  text-align: right;
}
</style>
