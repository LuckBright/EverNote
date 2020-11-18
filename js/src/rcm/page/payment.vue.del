<template>
  <div v-loading="tableLoading">
    <ever-bread-crumb
      name="采购付款"
      path="/financial/payments"
      :pathTo="$route.path.indexOf('payments/invoice')<0?'':'/financial/payments/invoice'"
    ></ever-bread-crumb>
    <div class="layout_inner box_sha_1">
      <div class="panel-body">
        <h4>基本信息</h4>
        <ever-form-model
          :schema="schema"
          v-model="obj"
          :api="api"
          :rules="rules"
          ref="form"
          @objsaved="afterSave"
          label-position="right"
          label-width="160px"
        ></ever-form-model>
        <h4 class="panel-hr">
          付款详细信息
          <span v-if="editable" class="ml10">
            <el-button @click="dialogVisible=true" v-if="obj.payType===1">选择发票</el-button>
            <el-button @click="prePaymentVisible=true" v-if="obj.payType===2">选择预付款申请</el-button>
          </span>
        </h4>
        <el-table v-loading.body="loading" :data="obj.details" style="width: 100%">
          <el-table-column label="供应商编号" prop="supplierCode"></el-table-column>
          <el-table-column label="供应商名称" prop="supplierName"></el-table-column>
          <el-table-column label="发票编号" prop="invoiceNo"></el-table-column>
          <el-table-column label="说明" prop="invoiceDes"></el-table-column>
          <el-table-column label="开票日期" prop="invoiceDate"></el-table-column>
          <el-table-column label="预计付款日期" prop="planPayDate"></el-table-column>
          <el-table-column label="发票入账期间" prop="accountPeriod"></el-table-column>
          <el-table-column label="发票付款状态" prop="payStatus"></el-table-column>
          <el-table-column label="发票金额" prop="invoiceSum" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.invoiceSum | formatToFinacial}}</span>
            </template>
          </el-table-column>
          <el-table-column label="已经支付金额" prop="payedFee" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.payedFee | formatToFinacial}}</span>
            </template>
          </el-table-column>
          <el-table-column label="本次支付金额" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.pay | formatToFinacial}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="delRow(scope.row.$index)" v-if="obj.status===0">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="panel-footer">
        <el-button
          type="primary"
          @click="save('form')"
          v-if="obj.status === 0 || !obj.id || taskId "
        >保存</el-button>
        <el-button type="primary" @click="confirmPay()" v-if="obj.status === 6">付款执行</el-button>
        <el-button
          type="info"
          @click="verify(obj.id)"
          v-if="obj.id && (obj.status === 0 ||(obj.status === 2&&taskId))"
        >提交审核</el-button>
        <el-button type="info" @click="verify(obj.id)" v-if="obj.status===2">审核通过</el-button>
        <el-button type="danger" @click="refuse(obj.id)" v-if="obj.status===2">拒绝</el-button>
      </div>
    </div>
    <el-dialog title="选择发票" :visible.sync="dialogVisible" class="ui_dialog_02">
      <invoice @select="handleSelect" ref="invoice"></invoice>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="$refs.invoice.save()">
          <i class="iconfont icon-tijiao"></i>确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择预付款" :visible.sync="prePaymentVisible" class="ui_dialog_02">
      <prepayment @select="handleSelectPrepayment" ref="prepayment"></prepayment>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="$refs.prepayment.save()">
          <i class="iconfont icon-tijiao"></i>确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import api from '../store/paymentapi'
import invoice from './payment-invoice'
import staffApi from '../store/prepaymentapi'
import prepayment from './payment-prepayment'
import progressapi from '../store/payableinvoiceapi'
export default {
  data () {
    var schema = [
      {
        name: 'applicantId',
        label: '申请人',
        type: 'select',
        options: []
      },
      {
        name: 'batchName',
        label: '付款批名'
      },
      {
        type: 'slice' // 专门用来换行的
      },
      {
        name: 'paySum',
        label: '付款批金额',
        disabled: true
      },
      {
        name: 'payType',
        label: '付款类型',
        options: [
          {
            id: 1,
            name: '采购付款'
          },
          {
            id: 2,
            name: '预付款'
          }
        ],
        type: 'select',
        disabled: true
      }
    ]

    let confirmSchema = [
      {
        name: 'payDate',
        label: '付款日期',
        type: 'date',
        outformat: 'yyyy-MM-dd'
      },
      {
        label: '付款方法',
        options: [],
        name: 'payMethod',
        type: 'systype',
        code: 'THC_RCM_PAYMENT_TYPE',
        useValue: true
      },
      {
        label: '银行名称',
        name: 'bankName'
      },
      {
        label: '银行账号',
        name: 'bankAccount'
      }
    ]
    let rules = {
      payDate: [{
        required: true,
        message: '付款日期不能为空',
        trigger: 'change'
      }]
    }
    var obj = this.$ever.createObjFromSchema(schema)
    obj = Object.assign(obj, this.$ever.createObjFromSchema(confirmSchema))
    obj.details = []
    obj.payType = this.$route.path.indexOf('invoice') > -1 ? 1 : 2
    obj.status = 0
    return {
      schema,
      obj: obj,
      objId: this.$route.params.id === '-1' ? undefined : this.$route.params.id,
      taskId: this.$route.query.taskId,
      api: api,
      tableData: [],
      dialogVisible: false,
      prePaymentVisible: false,
      confirmSchema,
      rules,
      loading: false,
      tableLoading: false
    }
  },
  methods: {
    afterSave () {
      this.$router.push('/financial/payments')
    },
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },
    handleSelect (sels) {
      sels = sels.map(v => {
        v.pay = v.invoiceSum - v.invoicePaidSum
        return v
      })
      this.obj.details = sels
      this.dialogVisible = false
    },
    handleSelectPrepayment (sels) {
      this.obj.details = sels
      this.prePaymentVisible = false
    },
    save () {
      let isOpen = true
      this.obj.details.forEach(v => {
        if (v.pay > v.invoiceSum) {
          this.$message({
            message: '支付金额不能大于发票金额！',
            type: 'warning'
          })
          isOpen = false
        }
      })
      if (isOpen) {
        this.tableLoading = true
        this.api.createOrUpdate(this.obj).then(result => {
          this.tableLoading = false
          if (result && result.data && Object.keys(result.data).length > 0) {
            this.afterSave()
          } else {
            this.$notify({
              message: '保存成功',
              type: 'success'
            })
          }
        }).catch(v => {
          this.tableLoading = false
        })
      }
    },
    verify (id) {
      this.tableLoading = true
      if (this.taskId) {
        progressapi.finish({
          processData: {
            taskId: this.$route.query.taskId,
            amount: parseFloat(this.obj.paySum)
          }
        }).then(result => {
          if (result && result.head && result.head.errCode === 0) {
            this.$notify({
              message: result.head.errMsg || '成功',
              type: 'success'
            })
            window.history.go(-1)
          } else {
            this.$notify({
              message: '审批失败',
              type: 'error'
            })
          }
          this.tableLoading = false
        }).catch(v => {
          this.tableLoading = false
        })
      } else {
        api.verify(id).then(_ => {
          this.tableLoading = false
          this.afterSave()
        }).catch(v => {
          this.tableLoading = false
        })
      }
    },
    getDetail: function (id) {
      return this.api
        .getById(id || this.objId)
        .then(result => {
          if (result && result.id) {
            result.payMethod = result.payMethod
              ? result.payMethod.toString()
              : ''
            Object.assign(this.obj, result)
          }
        })
        .then(_ => {
          if (this.obj.status !== 0) {
            this.schema = JSON.parse(JSON.stringify(this.schema)).map(v => {
              v.disabled = true
              return v
            })
          }

          if (this.obj.status === 6 || this.obj.status === 1) {
            let options = []
            for (let i in api.payMethod) {
              options.push({
                id: i,
                name: api.payMethod[i]
              })
            }
            this.$ever.getFieldFromSchema(
              this.confirmSchema,
              'payMethod'
            ).options = options
            this.schema = [...this.schema, ...this.confirmSchema]
          }
        })
    },
    confirmPay: function () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          api.confirmPay(this.obj).then(_ => {
            this.afterSave()
          })
        }
      })
    },
    refuse: function (id) {
      api.refuse(id).then(_ => {
        history.go(-1)
      })
    },
    delRow: function (index) {
      this.obj.details.splice(index, 1)
    }
  },
  created () {
    staffApi.getStaffList().then(result => {
      this.$ever.getFieldFromSchema(this.schema, 'applicantId').options = result.data && result.data.pageList
    })
    if (this.objId) {
      this.schema.push({
        name: 'docDate',
        label: '申请日期',
        type: 'date',
        disabled: true
      })
      this.getDetail()
    }
  },
  components: {
    invoice,
    prepayment
  },
  watch: {
    obj: {
      handler: function () {
        let sum = 0
        this.obj.details.forEach(v => {
          sum += Number(v.pay || 0)
        })
        this.obj.paySum = sum.toFixed(2)
      },
      deep: true
    },
    $route: function () {
      this.objId =
        this.$route.params.id === '-1' ? undefined : this.$route.params.id
      if (this.objId) {
        this.getDetail()
      }
      this.init && this.init()
    }
  },
  computed: {
    editable: function () {
      let obj = JSON.parse(JSON.stringify(this.obj))
      return !obj.id || obj.status === 0
    }
  }
}
</script>
