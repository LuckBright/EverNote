<!--
 * @Author: renpengfei
 * @Date: 2019-08-06 15:21:27
 * @LastEditors: renpengfei
 * @LastEditTime: 2019-08-12 14:48:34
 -->
<template>
  <div>
    <ever-bread-crumb
      v-if="isNew"
      name="新增收款单"
      :path="meta==1?'/financial/creditmanagement':'/financial/creditmanagementcustomer'"
    ></ever-bread-crumb>
    <ever-bread-crumb
      v-else
      name="收款单详情"
      path="/financial/creditmanagement"
      :haveReturn="true"
      :showBack="true"
    ></ever-bread-crumb>
    <div class="layout_inner">
      <div class="main-head">
        <div class="header">
          <strong class="title">收款单基本信息</strong>
        </div>
        <ever-form2
          :schema="querySchema"
          :allDisabled="!isNew"
          :rules="querySchemaRules"
          :nosubmit="true"
          v-model="queryObj"
          ref="form"
        >
          <template slot="receiptFeeReal">
            <el-input type="number" v-model="queryObj.receiptFeeReal" @keyup.native="computedFee"></el-input>
          </template>
        </ever-form2>
      </div>
      <div class="header">
        <strong class="title">回款源单明细</strong>
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
        <el-table-column label="本次支付" prop="payFee">
          <template slot-scope="scope">
            <el-input
              type="number"
              :disabled="!isNew"
              v-model="scope.row.payFee"
              @keyup.native="limitDecimal(scope.row.payFee,'payFee', scope.$index)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="insuranceCompanyName">
          <template slot-scope="scope">
            <el-input :disabled="!isNew" v-model="scope.row.remark"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              :disabled="!isNew"
              type="text"
              size="small"
              @click="handleDelete(scope.$index)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="isNew">
        <el-button type="primary" plain icon="el-icon-plus" @click="addReceipt">添加收款源单</el-button>
      </div>
      <div class="buttons" v-if="isNew">
        <el-button type="primary" plain @click="navigateBack">取消</el-button>
        <el-button type="primary" @click="crateReceipt" :disabled="btndisabled">保存</el-button>
      </div>
      <el-dialog title="选择回款源单" :visible.sync="addReceiptDialogShow" width="70%">
        <dialog-new-receipt @close="getdata"></dialog-new-receipt>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { insuranceName, createReceipt, getReceiptDetail, getAll } from '../../store/medicalinsurance.js'
import dialogNewReceipt from './dialog-newreceipt'
let querySchema = [{
  label: '回款方',
  name: 'insurOrgName',
  comp: 'ever-select',
  props: {
    placeholder: '请选择公司',
    options: []
  },
  span: 6
},
{
  label: '收款单号',
  name: 'receiptCode',
  comp: '',
  props: {
    placeholder: '请输入收款单号',
    disabled: true
  },
  span: 6
},
{
  label: '回款时间',
  name: 'receiptDate',
  comp: 'datePicker',
  props: {
    autoWidth: true
  },
  span: 6,
  style: 'width:100%'
},
{
  label: '实际收款金额',
  name: 'receiptFeeReal',
  comp: 'custom',
  props: {
    placeholder: '请输入实际收款金额'
  },
  span: 6
},
{
  label: '结算单收款合计',
  name: 'receiptFeeSettlement',
  comp: '',
  props: {
    placeholder: '请输入结算单收款',
    disabled: true
  },
  span: 6
},
{
  label: '差异金额',
  name: 'diffFee',
  comp: '',
  props: {
    placeholder: '请输入差异金额',
    disabled: true
  },
  span: 6
},
{
  label: '结算方式',
  name: 'payType',
  comp: '',
  props: {
    placeholder: '请输入结算方式'
  },
  span: 6
},
{
  label: '外币币种',
  name: 'foreignCurrencyType',
  comp: 'sys-type',
  props: {
    placeholder: '请输入外币币种',
    code: 'ISO.4217'
  },
  span: 6
},
{
  label: '外币金额',
  name: 'foreignCurrencyFee',
  comp: '',
  props: {
    placeholder: '请输入外币金额'
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
    const validator = (rule, value, callback) => {
      if (this.isNew) { // 只有新建的情况下校验，否则个人退款的详情也会报错
        if (!/^[+-]?\d*\.?\d{0,2}$/.test(value)) {
          this.queryObj.receiptFeeReal = value.substring(0, value.length - 1)
        } else if (Number(value) < 0) {
          value = 0
          callback(new Error('收款金额必须大于等于0'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    let querySchemaRules = {
      insurOrgName: [
        {
          required: true,
          message: '请选择公司',
          trigger: 'blur'
        }
      ],
      payType: [
        {
          required: true,
          message: '请填写结算方式',
          trigger: 'blur'
        }
      ],
      receiptFeeReal: [{
        validator: validator,
        trigger: 'change'
      }]
    }
    return {
      querySchema: querySchema,
      queryObj: queryObj,
      querySchemaRules: querySchemaRules,
      tableData: [],
      addReceiptDialogShow: false,
      isNew: false,
      loading: false,
      btndisabled: false,
      meta: this.$route.meta.type,
    }
  },
  components: {
    dialogNewReceipt
  },
  created () {
    this.getCompanyByMeta()
  },
  watch: {
    '$route.query.id': {
      handler: function (val) {
        if (val) {
          this.isNew = false
          // 如果有id则根据id获取收款单信息
          this.list(val)
        } else {
          this.isNew = true
        }
      },
      immediate: true
    }
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
    list (val) {
      // 如果有id则根据id获取收款单信息
      let params = {
        id: val
      }
      getReceiptDetail(params).then(res => {
        this.queryObj = Object.assign({}, res.data)
        this.queryObj.insurOrgName = this.$route.query.payer
        this.tableData = res.data.details
        this.computedFee()
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    addReceipt () {
      this.addReceiptDialogShow = true
    },
    // 新建添加数据
    getdata (val) {
      this.addReceiptDialogShow = false
      this.tableData = val
      // 本页数据去重处理
      let obj = {}
      this.tableData = this.tableData.reduce((total, cur) => {
        obj[cur.id]
          ? ''
          : (obj[cur.id] = true && total.push(cur))
        return total
      }, [])
      this.computedFee()
    },
    handleDelete (index) {
      this.tableData.splice(index, 1)
      this.computedFee()
    },
    crateReceipt () {
      if (this.queryObj.diffFee >= 0) {
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            if (this.tableData.length <= 0) {
              this.$messageTips(this, 'error', '至少添加一条应收账单')
              return false
            }
            let details = []
            for (let item of this.tableData) {
              details.push({
                receivableId: item.id,
                payFee: item.payFee,
                remark: item.remark
              })
            }
            let params = {
              receiptType: 2, // 保险公司
              payer: this.queryObj.insurOrgName,
              receiptDate: this.queryObj.receiptDate,
              receiptFeeReal: Number(this.queryObj.receiptFeeReal),
              receiptFeeSettlement: Number(this.queryObj.receiptFeeSettlement),
              diffFee: Number(this.queryObj.diffFee),
              payType: this.queryObj.payType,
              foreignCurrencyType: this.queryObj.foreignCurrencyType,
              foreignCurrencyFee: this.queryObj.foreignCurrencyFee,
              remark: this.queryObj.remark,
              details: details
            }
            params.businessType = this.meta
            this.btndisabled = true
            createReceipt(params).then(res => {
              this.$messageTips(this, 'success', '新建成功')
              if (this.meta === 1) {
                this.$router.push('/financial/creditmanagement')
              } else {
                this.$router.push('/financial/creditmanagementcustomer')
              }
            }).catch(() => {
              this.btndisabled = false
            })
          }
        })
      } else {
        this.$messageTips(this, 'warning', '差异金额不能小于0')
        return false
      }
    },
    computedFee () {
      // 重新计算结算单收款合计
      this.queryObj.receiptFeeSettlement = (this.tableData.reduce((total, cur) => {
        total += Number(cur.payFee)
        return total
      }, 0)).toFixed(2)
      // 重新计算差异金额
      this.queryObj.diffFee = (Number(this.queryObj.receiptFeeReal || 0) - Number(this.queryObj.receiptFeeSettlement || 0)).toFixed(2)
    },
    navigateBack () {
      if (this.meta === 1) {
        this.$router.push('/financial/creditmanagement')
      } else {
        this.$router.push('/financial/creditmanagementcustomer')
      }
    },
    // remainPay (row) {
    //   return Number(row.payInsur || 0) - Number(row.paidInsur || 0)
    // },
    // 限制金额只能两位小数
    limitDecimal (fee, param, index) {
      if (/^[+-]?\d*\.?\d{0,2}$/.test(fee)) {
      } else {
        this.tableData[index][param] = fee.substring(0, fee.length - 1)
      }
      if (this.tableData[index].payFee > (Number(this.tableData[index].payInsur) - Number(this.tableData[index].paidInsur))) {
        this.tableData[index].payFee = 0
        this.$messageTips(this, 'warning', '本次支付金额不能大于待付金额')
      } else if (Number(this.tableData[index].payFee) < 0) {
        this.tableData[index].payFee = 0
        this.$messageTips(this, 'warning', '本次支付金额不能小于0')
      }
      this.computedFee()
    }
  }
}
</script>
<style scoped>
.layout_inner {
  padding: 0 10px 15px 10px;
}
.header strong.title {
  padding-left: 6px;
  border-left: 3px solid #1c7bef;
  font-size: 18px;
  color: #000;
  line-height: 55px;
}
.main-head {
  margin-bottom: 0;
}
.layout_box .main-head .el-form {
  margin-bottom: 0;
}
.el-table {
  margin: 0;
}
.buttons {
  text-align: right;
}
</style>
