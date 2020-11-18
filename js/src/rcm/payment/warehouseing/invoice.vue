/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-10-19 12:14:42
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-11-11 15:50:52
 * 采付结算管理 -- 入库付款 -- 上传发票
 */

<template>
  <el-dialog v-if="dialogVisible" title="上传发票" :visible.sync="dialogVisible" class="ui_dialog_02 spe">
      <div style="min-height:200px;" class="p10 f14">
        <!-- 信息头 -->
        <el-row :gutter="20">
          <el-col v-for="col in initialCols" :key="col.prop" :span="col.span">
            <span class="light-gray">{{col.name}}</span> <strong class="f16">{{totalObj[col.prop]}}</strong>
          </el-col>
        </el-row>

        <!-- 表格域 -->
        <ever-table
          ref="tableList"
          table-default-cell-value="-"
          max-height="200"
          :columns="columns"
          :data="tableData">
        </ever-table>

        <!-- 发票信息录入 -->
        <div class="mt20">
          <template v-for="(form, index) in forms">
            <ever-form2
              :key="index"
              v-model="form.obj"
              ref="form"
              label-width="70px"
              :schema="form.schema"
              :nosubmit="true"
              :rules="form.rules">
              <template slot="operation">
                <div class="f22 blue operation">
                  <i v-if="forms.length > 1" @click="handleRemoveInvoice(index)" class="icon-delete iconfont mr10"></i>
                  <i v-if="index == forms.length - 1" @click="handleAddInvoice" class="icon-tianjiabingli iconfont"></i>
                </div>
              </template>
            </ever-form2>
          </template>
        </div>
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
import Schema from './invoice.schema'
import {
  tableDefaultCellValue
} from '@/warehouse/views/util/constant'
import Vue from 'vue'
const filters = Vue.options.filters
import { uploadInvoice } from '../api/index'
import { floatTool } from '@/util/common'

const columns = [
  {
    prop: 'proNo',
    defaultCellValue: tableDefaultCellValue,
    label: '序号'
  },
  {
    prop: 'paymentNo',
    label: '付款单号',
  },
  {
    prop: 'billAmount',
    label: '付款单金额',
    formatter ({ value }) {
      return filters.formatToFinacial(value)
    },
    align: 'right'
  },
  {
    prop: 'inCode',
    label: '入库单号',
  },
]

const initialCols = [{
  name: '付款单总额',
  prop: 'total',
  span: 12
}, {
  name: '供应商',
  prop: 'supplerName',
  span: 12
}]

const rules = {
  invoiceNo: [
    { required: true, message: '必填项', trigger: 'change' }
  ],
  invoiceAmount: [
    { required: true, message: '必填项', trigger: 'change' }
  ]
}
let initObj = null
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectData: { // 选中的同一供应商列表数据
      type: Array,
      default: () => ({})
    }
  },
  data () {
    initObj = this.$ever.createObjFromSchema(Schema)
    return {
      loading: false,
      initialCols,
      columns,
      forms: [{ schema: [...Schema], obj: { ...initObj }, rules: { ...rules } }],
    }
  },
  methods: {
    handleRemoveInvoice (index) {
      this.forms.splice(index, 1)
    },
    handleAddInvoice () {
      if (this.formValidateAll()) {
        this.forms.push({ schema: [...Schema], obj: { ...initObj }, rules: { ...rules } })
      }
    },
    formValidateAll () {
      const validates = []
      this.$refs.form.forEach(form => {
        form.$refs.form.validate(valid => {
          validates.push(valid)
        })
      })
      return validates.every(valid => valid === true)
    },
    submit () {
      // 上传发票
      if (this.formValidateAll()) {
        this.loading = true
        uploadInvoice({
          paymentId: this.selectData.map(item => item.id),
          invoiceInfoS: this.forms.map(({ obj }) => ({
            invoiceNo: obj.invoiceNo,
            invoiceAmount: obj.invoiceAmount,
            url: obj.url
          }))
        }).then(result => {
          const { head } = result
          if (head.errCode === 0) {
            this.$emit('update:visible', false)
            this.$emit('notifyReload') // 通知父组件更新列报表
            this.everSuccess('发票上传成功')
          }
        }).finally(() => {
          this.loading = false
        })
      }
    }
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible
      },
      set (v) {
        this.$emit('update:visible', v)
      }
    },
    tableData () {
      return this.selectData
    },
    totalObj () {
      const { supplerName } = this.selectData[0] || {}
      return {
        supplerName,
        total: this.$filters.formatToFinacial(this.selectData.reduce((pre, cur) => {
          return floatTool.add(pre, cur.billAmount)
        }, 0))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .ui_dialog_02 .el-dialog .el-dialog__footer {
  text-align: center
}
.operation i:hover {
  font-weight: bold;
}
</style>
