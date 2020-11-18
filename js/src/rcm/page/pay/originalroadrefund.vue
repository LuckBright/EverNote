<template>
  <el-dialog
    :title="isXianJin ? '现金退款' : '原路退款'"
    width="70%"
    :visible.sync="v"
    :modal-append-to-body="true"
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="beforeClose"
  >
    <div class="diy-row">
      <label>应退总额</label>
      <div>{{Number(paramsObj.unexefee || 0).toFixed(2)}} 元</div>
      <div v-if="!isXianJin && schema.length !== 1">
        ( 抹零金额 {{Number(paramsObj.wipeOffFee || 0).toFixed(2)}} ) 
      </div>
    </div>
    <ever-form2 ref="form" :schema="schema" v-model="queryObj" :rules="rules" :span="8">
      <div></div>
    </ever-form2>
    <el-row slot="footer" class="dialog-footer">
      <span class="paymethod_con_label">
        <span>实退总额</span>
        {{Number(paramsObj.unexefee || 0).toFixed(2)}}</span>
      <el-button type="primary" :disabled="isSureLoading" @click="refundBtn">确定</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
import { floatTool } from '@/util/common'
export default {
  props: ['refunddialogVisible', 'paramsObj', 'type'],
  data () {
    let rules = {}
    let len = this.paramsObj.paymethodArr.length
    let paymethodArr = []
    let isXianJin = this.paramsObj.refundMethod === '1'
    if (isXianJin) {
      paymethodArr = [
        {
          flowFee: this.paramsObj.unexefee,
          payMethod: 1,
          payName: '现金'
        }
      ]
    } else {
      paymethodArr = this.paramsObj.paymethodArr
    }
    let schema = paymethodArr.map(item => {
      // 定义规则
      rules[item.payMethod] = [{
        validator: (rule, value, callback) => {
          if (/^\d*\.?\d{0,2}$/.test(value)) {
            if (value > item.flowFee) {
              callback(new Error(`最大输入金额：${item.flowFee}`))
            } else {
              callback()
            }
          } else {
            callback(new Error(`请输入正确的金额格式,两位小数`))
          }
        },
        trigger: 'change'
      }]
      const returnItem = {
        ...item,
        label: item.payName,
        name: `${item.payMethod}`,
        props: {
          placeholder: `最大允许输入金额：${item.flowFee}`,
          clearable: true
        }
      }
      // 如果源单就一种支付方式，直接待退费值输入，输入框禁用
      return returnItem
    })

    let queryObj = this.$ever.createObjFromSchema(schema)
    // 如果全退，就填上金额，全部禁用
    if (!this.paramsObj.partialRefund || isXianJin) {
      Object.keys(queryObj).forEach((key, index) => {
        schema[index].props.disabled = true
        queryObj[schema[index].name] = schema[index].flowFee
      })
    } else {
      if (len === 1) {
        schema[0].props.disabled = true
        queryObj[schema[0].name] = this.paramsObj.unexefee
      }
    }
    return {
      schema,
      rules,
      queryObj,
      isSureLoading: false,
      isXianJin
    }
  },
  computed: {
    v: {
      get () {
        return this.refunddialogVisible
      },
      set (val) {
        this.$emit('update:refunddialogVisible', val)
      }
    }
  },
  methods: {
    refundBtn () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          const totalMoney = Object.keys(this.queryObj).reduce((total, method) => {
            total = floatTool.add(total, Number(this.queryObj[method]))
            return total
          }, 0)
          // 总金额不相等，return false
          if (totalMoney !== this.paramsObj.unexefee) {
            this.$messageTips(this, 'error', '退费金额必须等于实退金额')
            return false
          }
          // todo 退费要的格式
          let feeList = Object.keys(this.queryObj).filter((key) => this.queryObj[key] >= 0).map(key => {
            return {
              payMethod: key,
              flowFee: this.queryObj[key]
            }
          })
          this.$emit('sureRefund', { feeList })
        }
      })
    },
    beforeClose (done) {
      this.$emit('beforeClose')
      done()
    }
  }
}
</script>
<style lang="less" scoped>
  .diy-row {
    height: 32px;
    line-height: 32px;
    margin-bottom: 20px;
    label {
      display: inline-block;
      width: 110px;
      padding-right: 10px;
      text-align: right;
    }
    div {
      display: inline-block;
    }
  }
  .dialog-footer {
    text-align: center;
    position: relative;
    .paymethod_con_label {
      position: absolute; 
      left: 47px; 
      top: 10px;
    }
  }
</style>
