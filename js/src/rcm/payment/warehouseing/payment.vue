/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-10-16 10:07:46
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-11-14 11:15:12
 * 付款信息|收款信息弹框
 */
<template>
  <el-dialog v-if="dialogVisible" :title="title" :visible.sync="dialogVisible" class="ui_dialog_02">
      <div style="min-height:200px;" class="f14">
        <!-- 信息头 -->
        <el-row :gutter="20">
          <el-col v-for="col in cols" :key="col.prop" :span="col.span">
            <span class="light-gray">{{col.name}}</span> <strong class="f16">{{totalObj[col.prop]}}</strong>
          </el-col>
        </el-row>
        <!-- 表格域 -->
        <ever-table
          max-height="225"
          table-default-cell-value="-"
          v-if="dialogVisible"
          ref="tableList"
          :columns="columns"
          :data="tableData">
          <template slot="payAmount" slot-scope="{row, $index}">
            <!-- 付款金额 -->
            <el-input @input="handleChange($index)" :disabled="row.offSetAmout === row.unpaidAmount" :class="{error: ((row.payAmount < 0) || row.payAmount > (row.unpaidAmount - row.offSetAmout) || errors[$index])}" size="small" placeholder="付款金额" v-model="row.payAmount" ></el-input>
          </template>
          <template slot="mount" slot-scope="{row}">
            <!-- 收款金额 -->
            <el-input @input="handleChange($index)" :class="{error: ((row.mount < 0) || row.mount > (row.unpaidAmount - row.offSetAmout) || errors[$index])}" size="small" placeholder="收款金额" v-model="row.mount"></el-input>
          </template>
          <template slot="remarks" slot-scope="{row}">
            <!-- 备注 -->
            <el-input v-model="row.remarks" placeholder="备注" size="small"></el-input>
          </template>
        </ever-table>

        <!-- 付款信息 -->
        <strong class="mt5 inline-block">
          {{isEntry ? '付' : '收'}}款总额 <span class="f16">{{billAmount | formatToFinacial}}</span>
        </strong>
        <!-- 支付方式 -->
        <ever-form2
          v-model="obj"
          ref="form"
          label-width="70px"
          class="mt10 pb10"
          :schema="schema"
          :nosubmit="true"
          :rules="rules">
        </ever-form2>
      </div>
      <!-- 弹框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="submit" type="primary" :loading="loading">
          确定
        </el-button>
      </span>
    </el-dialog>
</template>

<script>
import columns from './payment.columns'
import { prePay, pay, receivable } from '../api/index'
import { store } from './observable'
import { floatTool } from '@/util/common'

const entryInfo = [{
  name: '未付总额',
  prop: 'unpaidAmount',
  span: 8
}, {
  name: '可冲抵总额',
  prop: 'totalAmount',
  span: 8
}, {
  name: '供应商',
  prop: 'supplerName',
  span: 8
}]
const backInfo = [{
  name: '未收总额',
  prop: 'unpaidAmount',
  span: 12
}, {
  name: '供应商',
  prop: 'supplerName',
  span: 12
}]
// 支付方式表单校验规则
const rules = {
  paymentMethod: [
    { required: true, message: '必填项', trigger: 'change' }
  ]
}
export default {
  props: {
    isEntry: {
      type: Boolean,
      default: true
    }, // 是否是收款弹框
    title: String,
    visible: {
      type: Boolean,
      default: false
    },
    selectData: { // 选中的同一供应商列表数据
      type: Array,
      default: () => ({})
    },
  },
  data () {
    const schema = [{
      name: 'paymentMethod',
      label: '支付方式',
      comp: 'select',
      style: {
        width: '100%'
      },
      props: {
        options: []
      },
      span: 12
    }]
    const obj = this.$ever.createObjFromSchema(schema)
    return {
      loading: false,
      errors: [],
      schema,
      obj,
      tableData: [],
      totalAmount: this.$filters.formatToFinacial(0), // 付款单可冲抵总额
      rules
    }
  },
  methods: {
    handleChange (index) {
      this.$set(this.errors, index, false)
    },
    // 检查表格数据中收付款金额是否填写
    /**
     * 输入金额 不能大于未付或者未收金额 也不能为空 不能小于 0
     * @param name     收款金额或者付款金额字段
     */
    checkMmount (name, secName) {
      this.errors = []
      for (let i = 0; i < this.tableData.length; i++) {
        const item = this.tableData[i]
        if ((item[name] < 0 || ['', ' ', null, undefined].includes(item[name])) || (item[name] > item.unpaidAmount)) {
          this.errors.push(true)
        } else {
          this.errors.push(false)
        }
      }
      if (this.errors.length) return false
      return true
    },
    submit () {
      if (this.isEntry && !this.checkMmount('payAmount')) {
        return this.everWarning('请检查您是否填写付款金额、或者付款金额大于未付金额')
      } else if (!this.isEntry && !this.checkMmount('mount')) {
        return this.everWarning('请检查您是否填写收款金额、或者收款金额大于未收金额')
      }
      const form = this.$refs.form.$refs.form
      form.validate(valid => {
        if (valid) {
          this.loading = true
          let params = []
          if (this.isEntry) {
            params = this.tableData.map(item => {
              const { id: paymentId,
                paymentNo,
                billAmount,
                unpaidAmount,
                payAmount,
                remarks,
                unPaidInfos
              } = item
              return {
                paymentId,
                paymentNo,
                billAmount,
                unpaidAmount,
                unreceivedAmount: this.offSetAmoutMap[paymentId],
                payAmount,
                remarks,
                unPaidInfos,
                supplerName: this.totalObj.supplerName,
                paymentMethod: this.obj.paymentMethod
              }
            })
          } else {
            params = this.tableData.map(item => {
              const { id,
                paymentNo,
                mount,
                remarks } = item
              return {
                id,
                paymentNo,
                mount,
                remarks,
                paymentMethod: this.obj.paymentMethod
              }
            })
          }
          ~(this.isEntry ? pay : receivable)(params).then(result => {
            const { head } = result
            if (head.errCode === 0) {
              this.$nextTick(_ => {
                form.resetFields()
                this.obj.paymentMethod = ''
                this.$emit('update:visible', false)
                this.$emit('notifyReload') // 通知父组件更新列报表
                this.everSuccess(`${this.isEntry ? '付' : '收'}款成功`)
              })
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
    }
  },
  watch: {
    selectData: {
      handler (v) {
        this.tableData = v.map(item => {
          return {
            ...item,
            // 收款款金额都自动计算带入 = 未收金额
            mount: item.unpaidAmount
          }
        })
      },
      deep: true,
      immediate: true
    },
    visible (v) {
      // 只有付款单需要查询可冲抵总额
      if (v && this.isEntry) {
        prePay({
          payType: 1, // 1 付款单 、 2 收款
          paymentIds: this.selectData.map(item => item.id)
        }).then(result => {
          const { head, data } = result
          const { totalAmount, readeyPayResps } = data
          if (head.errCode === 0 && data && Array.isArray(readeyPayResps)) {
            // this.offSetAmoutMap = {} // 可冲抵金额对象（id：value）
            // readeyPayResps.forEach(item => {
            //   const { paymentId, offSetAmout, unPaidInfos } = item
            //   this.offSetAmoutMap[paymentId] = {
            //     offSetAmout,
            //     unPaidInfos
            //   }
            // })
            this.totalAmount = this.$filters.formatToFinacial(totalAmount)
            this.tableData = readeyPayResps.map(item => {
              const { unPaidAmount, offSetAmout } = item
              // const { offSetAmout, unPaidInfos } = this.offSetAmoutMap[id] || {}
              return {
                ...item,
                // 付款金额 = 未付金额 - 冲抵金额
                payAmount: unPaidAmount - (offSetAmout || 0)
              }
            })
          }
        })
      }
    },
    'paymentMethods': {
      handler () {
        this.$ever.getFieldFromSchema(
          this.schema,
          'paymentMethod'
        ).props.options = this.paymentMethods
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    paymentMethods () {
      return store.paymentMethods // 所有启用的支付方式
    },
    columns () {
      return columns.filter(s => (s.isEntry === this.isEntry || s.isEntry === undefined))
    },
    cols () {
      return this.isEntry ? entryInfo : backInfo
    },
    dialogVisible: {
      get () {
        return this.visible
      },
      set (v) {
        this.$emit('update:visible', v)
      }
    },
    billAmount () {
      return this.tableData.reduce((pre, cur) => {
        const total = floatTool.add(pre, (+cur[this.isEntry ? 'payAmount' : 'mount']))
        if (total === 0) {
          this.rules = null
        } else {
          this.rules = rules
        }
        return total
      }, 0)
    },
    totalObj () {
      const { supplerName } = this.selectData[0] || {}
      let unpaidAmount = 0 // 未付总额 、  未收总额
      this.selectData.forEach(item => {
        unpaidAmount = floatTool.add(unpaidAmount, item.unpaidAmount || 0)
      })
      return {
        supplerName,
        unpaidAmount: this.$filters.formatToFinacial(unpaidAmount), // 未付总额 、  未收总额
        totalAmount: this.totalAmount, // 可冲抵总额
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .ui_dialog_02 .el-dialog .el-dialog__footer {
  text-align: center
}
/deep/ .error .el-input__inner {
  border: 1px solid red;
}
</style>
