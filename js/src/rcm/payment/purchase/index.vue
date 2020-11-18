/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-10-15 11:12:23
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-11-10 18:40:46
 * 采购支付方式 列表 + 设置
 */

<template>
  <div class="layout_inner flex_col_1_auto" v-loading="loading">
    <div class="fr mb10">
      <el-button type="primary" size="small" @click="dialogFormVisible = true">添加支付方式</el-button>
    </div>
    <!-- 表格域 -->
    <el-table
      :cell-style="({row, column}) => {
        if (column.property === 'enable') {
          if (row.enable === 0) {
            return 'color: #fa5555'
          }
          return 'color: #41aa07'
        }
      }"
      :data="tableData">
      <el-table-column
        prop="payMethod"
        align="center"
        label="支付方式">
      </el-table-column>
      <el-table-column
        prop="enable"
        align="center"
        :formatter="formatter"
        label="使用状态">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="{row, $index}">
          <el-button :class="{red: row.enable == 1}" type="text" @click="handleChangeStatus(row, $index)">{{formatter({...row, enable: resetEnable(row)})}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增支付方式弹框 -->
    <el-dialog title="" :visible.sync="dialogFormVisible" width="35%">
      <ever-form2
        :schema="schema"
        v-model="obj"
        ref="form"
        :rules="rules"
        @submit.native.prevent
        style="width: 70%; margin: 5%;">
        <template slot="default">
          <el-col>
            <el-form-item>
              <el-button type="primary" @click="submitForm()" class="w_100">添加</el-button>
            </el-form-item>
          </el-col>
        </template>
      </ever-form2>
    </el-dialog>
  </div>
</template>

<script>
import { getPaymentMethod, addPaymentMethod, setPaymentMethod } from '@/rcm/payment/api/index.js'

const PAYMENT_STATUS = [
  { id: '1', name: '启用' },
  { id: '0', name: '禁用' }
]
export default {
  name: 'PurPaymentMethod', // 支付方式（组件）页面
  data () {
    const schema = [{
      name: 'payMethod',
      label: '付款方式',
    }]
    var obj = this.$ever.createObjFromSchema(schema)
    // 添加支付方式 -- 点击添加，生成支付方式，使用状态默认为启用
    obj.enable = 1
    return {
      tableData: [],
      dialogFormVisible: false,
      loading: true,
      schema,
      obj,
      rules: {
        payMethod: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    getPaymentMethod().then(result => {
      const { data } = result || {}
      if (Array.isArray(data)) {
        this.tableData = data
      }
    }).finally(() => {
      this.loading = false
    })
  },
  methods: {
    // 转换操作展示文案
    resetEnable ({ enable }) {
      return enable === 1 ? 0 : 1
    },
    submitForm () {
      const form = this.$refs.form.$refs.form
      form.validate(valid => {
        if (valid) {
          addPaymentMethod(this.obj).then(result => {
            const { head } = result
            if (head.errCode === 0) {
              this.tableData.push(Object.assign({}, this.obj))
              this.$nextTick(_ => {
                form.resetFields()
                this.dialogFormVisible = false
                this.everSuccess('添加成功')
              })
            }
          })
        }
      })
    },
    formatter (row) {
      return this.$filters.formateValueToFnt(row.enable, { list: PAYMENT_STATUS })
    },
    handleChangeStatus (row, index) {
      const enable = this.resetEnable(row)
      const { payMethod, id } = row
      this.$confirm(`确认要${this.formatter({ enable })}${payMethod}？`)
        .then(_ => {
          setPaymentMethod({ id, enable }).then(result => {
            const { head } = result
            if (head.errCode === 0) {
              this.tableData[index].enable = enable
              this.everSuccess('修改成功')
            }
          })
        })
        .catch()
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
