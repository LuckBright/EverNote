/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-02-20 12:36:20
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-03-07 10:51:34
 */
<template>
  <!-- 订单录入快递信息组件 -->
  <el-dialog :visible.sync="miniDialog" size="tiny" :custom-class="`ui_dialog_01 ${!isBatch ? 'w_01' : ''}`">
    <div :style="{
      height: isBatch ? '360px' : '160px',
      padding: '20px'
      }">
      <div class="f18">
        <div v-if="isBatch" class="mb10">共选择 {{tableData.length}} 张订单。</div>
        <div v-if="isSend">请录入快递信息，也可发货后补录。</div>
        <div v-else>请录入快递信息：</div>
      </div>

      <!-- 物流公司 -->
      <el-row class="mt20">
        <el-col :span="isBatch ? 12 : 22">
          <ever-form2
            v-model="obj"
            ref="form"
            class="custom-form"
            label-width="70px"
            :rules="rules"
            :schema="schema">
            <template slot="expressCompanyId">
              <el-select
                v-model="obj.expressCompanyId"
                filterable
                remote
                reserve-keyword
                clearable
                placeholder="请输入关键词"
                :remote-method="querySearchAsync"
                :loading="loading">
                <el-option
                  v-for="item in expressOptions"
                  :key="item.id"
                  :label="item.com"
                  :value="item.id  ">
                </el-option>
              </el-select>
            </template>
            <template slot="default">
              <div></div>
            </template>
          </ever-form2>
        </el-col>
      </el-row>

    <!-- 订单表格 -->
    <el-table
      v-if="isBatch"
      :data="orderData"
      height="250"
      border
      style="margin-top: 0">
      <el-table-column
        width="40">
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="orderCode"
        label="订单编号"
        width="300">
      </el-table-column>
      <el-table-column
        prop="logisticsCode"
        label="物流单号">
        <template slot-scope="scope">
          <el-input v-model="scope.row.logisticsCode" placeholder="请输入物流单号"></el-input>
        </template>
      </el-table-column>
    </el-table>

    </div>
    <span slot="footer" class="dialog-footer">
      <el-button class="spe" @click="close">取消</el-button>
      <el-button type="primary" :loading="loading" @click="confirm">{{isSend ? '发货' : '确认'}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { request } from '@/util/req'
import { basePrefix as prefix } from '@/util/urls.base'

const schema = [
  {
    label: '物流公司',
    name: 'expressCompanyId',
    comp: 'custom',
    // props: {
    //   value: '',
    //   apiUrl: '/msg/express/queryCom',
    //   filterable: true,
    //   placeholder: '请选择物流公司',
    //   options: [],
    //   useObject: true,
    //   isInitOptions: true,
    //   clearable: true
    // }
  },
  {
    label: '物流单号',
    name: 'logisticsCode'
  },
]
// const postRules = {
//   expressCompanyId: [
//     {
//       required: true,
//       message: '请选择物流公司',
//       trigger: 'change'
//     }
//   ],
//   logisticsCode: [
//     {
//       required: true,
//       message: '请填写物流单号',
//       trigger: 'blur'
//     }
//   ]
// }
export default {
  props: {
    isSend: { // 是否展示发货按钮
      type: Boolean,
      default: true
    },
    tableData: {
      type: Array,
      default: () => []
    },
    postData: { // 物流信息
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      schema: [],
      obj: {},
      miniDialog: false,
      loading: false,
      isBatch: false,
      isCheckRules: false,
      orderData: [],
      expressOptions: [],
      rules: {}
    }
  },
  created () {
    this.querySearchAsync()
  },
  watch: {
    'obj.expressCompanyId' (v) {
      if (v) {
        const { com, comCode } = this.expressOptions.find(item => item.id === v) || {}
        if (com) {
          this.obj.logisticsName = com
        }
        if (comCode) {
          this.obj.expressCode = comCode
        }
      } else {
        // 当修改物流信息，清空快递公司时，清空快递公司名称
        this.obj.logisticsName = ''
      }
    }
  },
  methods: {
    querySearchAsync (name) {
      //  获取快递公司接口
      request({ url: `${prefix.extend}msg/express/queryCom`, isStatic: false }, { name, offset: 0, pagesize: 20 }).then(res => {
        if (res.data) {
          this.expressOptions = res.data.resultList || []
        }
      })
    },
    resetLoading () {
      this.loading = false
    },
    confirm () {
      this.loading = true
      if (this.isCheckRules) {
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            this.emitData()
          } else {
            this.loading = false
          }
        })
      } else {
        this.emitData()
      }
    },
    emitData () {
      this.$emit('confirm', { obj: this.obj, list: this.orderData, isBatch: this.isBatch })
    },
    close () {
      this.miniDialog = false
    },
    /**
     * 打开邮寄信息弹框
     * @param {Boolean} isBatch 是否批量操作
     * @param {Boolean} isCheckRules 是否检验输入项
    */
    async open (isBatch = false, isCheckRules = false) {
      this.rules = {}
      this.isCheckRules = isCheckRules

      // isBatch: 是否批量发货
      this.isBatch = isBatch
      this.schema = schema.concat([])
      if (this.isBatch) {
        this.schema.splice(1, 1)
      }
      this.obj = this.$ever.createObjFromSchema(this.schema)
      // this.obj.logisticsName = ''
      if (this.postData) {
        const findExpress = this.expressOptions.find(item => item.id === this.postData.expressCompanyId)
        const { expressCompanyId: id, logisticsName: com, expressCode: comCode } = this.postData
        // 已经填写过邮寄信息才push进入快递公司列表
        if (!findExpress && id) this.expressOptions.push({ id, com, comCode })
        this.obj = Object.assign(this.obj, this.postData)
      }
      this.miniDialog = true

      if (isCheckRules) {
        this.$nextTick(_ => {
          this.$refs.form.$refs.form.clearValidate()
        })
        // 不做校验
        // this.rules = postRules
      }
      if (this.tableData.length) {
        this.orderData = this.tableData.map(item => Object.assign({}, item, { logisticsCode: '' }))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
