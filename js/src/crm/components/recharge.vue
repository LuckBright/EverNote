<template>
  <div class="flex_column_full_hidden">
    <ever-form2
      :nosubmit="true"
      :schema="schema"
      v-model="obj"
      :span="24"
      :api="api"
      :rules="rules"
      @objsaved="afterSave()"
      class="flex_col_1_auto memform"
      label-width="80px">
      <template slot="points" class="mgl40">
        <el-popover placement="right" width="400" trigger="click">
          <el-table :data="gridData">
            <el-table-column width="160" prop="createTime" label="时间"></el-table-column>
            <el-table-column align="center" prop="changeType" label="交易类型">
              <template slot-scope="scope">
                <sys-value type="THC_CARD_MEMBERCARD_TYPE" :code="scope.row.changeType"></sys-value>
              </template>
            </el-table-column>
            <el-table-column width="160" prop="chargeStatement" label="支付流水"></el-table-column>
            <el-table-column align="center" prop="usePatientName" label="消费人">
              <template
                slot-scope="scope"
              >{{scope.row.usePatientName?scope.row.usePatientName:'--'}}</template>
            </el-table-column>
            <el-table-column align="center" prop="changeStoredMoney" label="交易金额"></el-table-column>
            <el-table-column align="center" prop="newStoredMoney" label="账户余额"></el-table-column>
          </el-table>
          <el-pagination
            v-show="totalCount > params.pagesize"
            layout="prev, pager, next"
            small
            :page-size="params.pagesize"
            :total="totalCount"
            @current-change="handleCurrentChange"
          ></el-pagination>
          <el-button type="text" slot="reference" class="mgl40">
            <span>余额 &nbsp;</span>
            <span v-if="obj.givedMoney">
              {{ obj.points ? obj.points + ' (本金' + Number(obj.storedMoney).toFixed(2) + '  赠金' + Number(obj.givedMoney).toFixed(2) + ')' : '0'}}
            </span>
            <span v-else>{{ obj.points ? obj.points: '0' }}</span>
          </el-button>
        </el-popover>
      </template>
      <template slot="type">
        <el-radio v-model="radio" label="1">充值</el-radio>
        <el-radio v-model="radio" label="2">提现</el-radio>
      </template>
      <template slot="money">
        <div class="mgl40" v-if="radio == '1'">
          <span>金额</span>
          <el-input v-model="obj.money" type="number" style="width:42%;" class="ml10"></el-input>
          <el-input v-model="obj.present" type="number" style="width:37%;" class="ml10" placeholder="赠金"></el-input>
        </div>
        <el-form-item class="mgl50" v-if="radio == '2'">
          <span>手续费</span>
          <el-input v-model="obj.charges" type="number" style="width:184px;" class="ml6" max="200"></el-input>
          <el-button type="primary" @click="calc">计算</el-button>
        </el-form-item>
        <el-form-item class="mgl40" v-if="radio == '2'">
          <span>退费</span>
          <el-input v-model="refund" style="width:184px;" class="ml10" disabled></el-input>
        </el-form-item>
      </template>
      <template slot="comment">
        <el-input
          v-model="obj.comment"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 4}"
          :maxlength="100"
        ></el-input>
      </template>
      <template slot="print">
        <div v-if="radio == '1'">
          <el-checkbox v-model="obj.print"></el-checkbox>
          <span>打印小票</span>
        </div>
      </template>
    </ever-form2>
    <div class="form_footer">
      <el-button type="primary" @click="save">保存</el-button>
    </div>
    <paymethodstwo :dialogVisible.sync="paydialogVisible" :obj="payObj" @payStatus="paySuccess"></paymethodstwo>
  </div>
</template>
<script>
import api from '@/crm/store/integralapi'
import giftapi from '@/crm/store/giftapi'

let schema = [
  {
    name: 'points',
    comp: 'custom'
  },
  {
    name: 'type',
    label: '类型',
    comp: 'custom'
  },
  {
    name: 'money',
    comp: 'custom'
  },
  {
    name: 'comment',
    label: '备注',
    comp: 'custom'
  },
  {
    name: 'print',
    comp: 'custom'
  }
]
export default {
  props: ['patientId'],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.print = true
    obj.givedMoney = ''
    obj.money = ''
    obj.present = ''
    obj.charges = ''
    return {
      api,
      obj,
      schema,
      radio: '1',
      money: 0,
      refund: 0,
      paydialogVisible: false,
      payObj: {
        payType: 3
      },
      rules: {},
      gridData: [],
      currentPage: 1,
      totalCount: 0,
      recordId: '',
      params: {
        cardId: '',
        pagesize: 3,
        offset: 0
      }
    }
  },
  watch: {
    patientId (val) {
      if (val) {
        this.getCard()
      } else {
        this.reset()
      }
    },
    radio: {
      handler: function (val) {
        this.getCard()
      },
      immediate: true
    }
  },
  methods: {
    getCard () {
      this.patientId && api.getCard({ patientId: this.patientId }).then(rs => {
        if (rs.head.errCode === 0) {
          this.obj.points = rs.data && Number(rs.data.storedMoney + rs.data.givedMoney).toFixed(2)
          this.obj.money = null
          this.obj.charges = null
          this.refund = 0
          this.obj.comment = ''
          this.obj.present = ''
          this.obj.storedMoney = rs.data && rs.data.storedMoney || 0
          this.obj.givedMoney = rs.data && rs.data.givedMoney || 0
          if (rs.data != null) {
            this.params.cardId = rs.data.id
            this.getGridData(this.params)
          }
        }
      })
    },
    getGridData (params) {
      giftapi.getcardStatement(params).then(rs => {
        this.totalCount = rs.data.totalCount
        this.gridData = rs.data.resultList ? rs.data.resultList : []
      })
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.params.offset = (val - 1) * this.params.pagesize || 0
      this.getGridData(this.params)
    },
    save () {
      this.obj.patientId = this.patientId
      let request = this.radio === '1' ? this.api.createPay : this.api.createCash
      if (this.radio === '2') {
        this.obj.money = this.obj.storedMoney
      }
      request(this.obj).then(rs => {
        if (rs.head.errCode === 0) {
          if (this.radio === '1') {
            this.payObj['isRefund'] = false
            this.payObj['unexefee'] = rs.data.money
          } else {
            this.payObj['isRefund'] = true
            this.payObj['unexefee'] = this.refund
          }
          this.payObj['givedMoneyGH'] = rs.data.present
          this.payObj['id'] = rs.data.settlementBillId
          this.payObj['settleCode'] = rs.data.settlementBillCode
          this.payObj['patientid'] = rs.data.patientId
          this.payObj['paymethodArr'] = []
          this.paydialogVisible = true
          this.recordId = rs.data.id
        }
      })
    },
    paySuccess () {
      this.getCard()
      console.error('帆软打印方法废弃:code:CHU_ZHI_XIAO_PIAO & reg_bachcash_print_szw')
      // if (this.obj.print && this.radio === '1') {
      //   frPrint(this.baseCode, { settlementNo: this.payObj.settleCode })
      // } else {
      //   frPrint('reg_bachcash_print_szw', { id: this.recordId })
      // }
      this.paydialogVisible = false
      this.$messageTips(this, 'success', '操作成功')
      this.$bus.$emit('charge:success', true)
    },
    calc () {
      if (this.obj.storedMoney > 0) {
        this.refund = this.obj.storedMoney - this.obj.charges
      } else {
        this.$messageTips(this, 'warning', '不可提现')
      }
    },
    reset () {
      this.obj.points = ''
      this.radio = '1'
      this.obj.money = ''
      this.obj.present = ''
      this.obj.charges = ''
      this.refund = ''
    }

  }
}
</script>
<style lang="scss" scoped>
  .form_footer{
    padding-top: 10px;;
    padding-left: 80px;
    border-top: 1px solid #eee;
  }
.ml6 {
  margin-left: 6px;
}
.mgl40 {
  margin-left: -40px;
}
.mgl50 {
  margin-left: -50px;
}
.mgl12 {
  margin-left: 120px;
}
.mgl60{margin-left: 60px;}
.pointer {
  cursor: pointer;
}
.memform /deep/ .el-form-item{margin-bottom: 10px;}
</style>

