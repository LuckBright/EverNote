<template>
  <div class='dialog'>
    <div v-if='isDisabled'>
      <span>退费人：</span>
      <span>{{infoObj.refundPeople}}</span>
      <span style='margin-left: 30px'>退费操作时间：</span>
      <span>{{infoObj.refundTime}}</span>
    </div>
    <el-table :data="details">
      <el-table-column property="patientName" label="患者信息" width="150"></el-table-column>
      <el-table-column property="doctorName" label="接诊医生"></el-table-column>
      <el-table-column property="appointmentStateDesc" label="问诊状态"></el-table-column>
      <el-table-column property="dateStr" label="问诊时间"></el-table-column>
      <el-table-column label="问诊金额">
        <template slot-scope="scope">
          <span v-if="scope.row.serviceOrder">￥ {{scope.row.serviceOrder.totalPrice}} 元</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
    </el-table>
    <el-form ref="form" :model="infoObj" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span='7'>
          <el-form-item label='退费金额：' prop='amount'>
            <el-input v-model.number='infoObj.amount' size='mini' :disabled='isDisabled' placeholder='请输入金额'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='15'>
          <el-form-item label='支付类型：' prop='payType'>
            <el-select v-model='infoObj.payType' size='mini' :disabled='isDisabled'>
              <el-option
                v-for='item in accountOption'
                :key='item.id'
                :label='item.name'
                :value='item.id'
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='7'>
          <el-form-item label='收款人：' prop='payee'>
            <el-input v-model.trim='infoObj.payee' size='mini' :disabled='isDisabled' placeholder='请输入收款人姓名'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='17'>
          <el-col :span='10'>
            <el-form-item label='收款账户：' prop='paymentAccount'>
              <el-select v-model='infoObj.paymentAccount' size='mini' :disabled='isDisabled'>
                <el-option
                  v-for='item in accountOption'
                  :key='item.id'
                  :label='item.name'
                  :value='item.id'
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='14'>
            <el-col :span='10' v-if='isShowInput'>
              <el-form-item prop='bank' label-width='0'>
                <el-input v-model.trim='infoObj.bank' size='mini' :disabled='isDisabled' placeholder='请输入银行名称'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='isShowInput ? 13 : 23' :offset='1'>
              <el-form-item prop='bankCard' label-width='0'>
                <el-input v-model.trim='infoObj.bankCard' size='mini' :disabled='isDisabled' placeholder='请输入收款账户'></el-input>
              </el-form-item>
            </el-col>
          </el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='24'>
          <el-form-item label='退费原因：' prop='mark'>
            <el-input type='textarea' v-model.trim='infoObj.mark' :row='2' maxlength="200" placeholder='请输入退费原因' :disabled='isDisabled'></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  props: ['details'],
  data () {
    return {
      infoObj: {
        amount: '',
        payType: '0',
        payee: '',
        paymentAccount: '0',
        bank: '',
        bankCard: ''
      },
      accountOption: [
        { id: '0', name: '微信' },
        { id: '1', name: '支付宝' },
        { id: '2', name: '银行卡' }
      ],
      isShowInput: false,
      isDisabled: false,
      rules: {
        amount: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        payee: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        mark: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        bank: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        bankCard: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // 去掉原来的 disabled 逻辑 4.11.1 by lvjiangtao@everjiankang.com
    // this.isDisabled = this.details[0].serviceOrder && this.details[0].serviceOrder.isPaid === -1
  },
  methods: {
    changeSelect (val) {
      this.isShowInput = val === '2'
      this.infoObj.bank = ''
    }
  },
  watch: {
    infoObj: {
      handler: function (val, old) {
        this.isShowInput = val.paymentAccount === '2'
        // 修改为有id就说明是填写了退费记录，就不允许在修改了。4.11.1 by lvjiangtao@everjiankang.com
        if (val.id) {
          this.isDisabled = true
        } else {
          this.isDisabled = false
        }
      },
      deep: true
    }
  }
}
</script>
<style lang='less' scoped>

</style>
