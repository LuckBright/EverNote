<template>
  <div>
    <el-dialog
      title="供应商价格修改"
      :visible.sync="dialogVisible"
      class="ui_dialog_02">
      <ever-form-model
        :schema="schema"
        v-model="obj"
        :api="api"
        :rules="rules"
        ref="form"
        @objsaved="afterSave" label-position="right">
      </ever-form-model>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false"><i class="iconfont icon-quxiao"></i>取消</el-button>
        <el-button type="primary" @click="submitForm('form')"><i class="iconfont icon-tijiao"></i>保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import api from '../store/supplierpriceapi'
import form from '@/util/form'
import {debounce} from '@/util/common'
import { Notification } from 'element-ui'
var schema = [
  {
    name: 'supplierName',
    type: 'text',
    label: '供应商名称',
    span: 24,
    disabled: true
  },
  {
    name: 'localMaterialName',
    type: 'text',
    label: '商品名',
    span: 24,
    disabled: true
  },
  {
    name: 'description',
    type: 'textarea',
    label: '调价原因',
    span: 24
  },
  {
    name: 'price',
    type: 'number',
    label: '调整后价格',
    span: 24,
    append: '元'
  },
  {
    name: 'tradePrice',
    type: 'number',
    label: '调整后批发价格',
    span: 24,
    append: '元'
  },
  {
    name: 'enableDate',
    type: 'date',
    label: '生效日期',
    span: 24,
    outformat: 'yyyy-MM-dd HH:mm:ss'
  }
]
export default {
  mixins: [form],
  props: ['goodsName', 'handleId', 'supplierName', 'materialType', 'supplierLocalId', 'ID'],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.localMaterialId = ''
    obj.supplierLocalId = ''
    obj.id = ''
    return {
      api,
      schema,
      obj,
      rules: {
        price: [
          { required: true, message: '必填项', trigger: 'blur', type: 'number' }
        ],
        enableDate: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      },
      dialogVisible: false
    }
  },
  created () {
  },
  methods: {
    submitForm: debounce(function () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          delete this.obj.localMaterialName
          delete this.obj.supplierName
          delete this.obj.disableDate
          this.api.createLocal(this.obj, this.isWarehouse).then(result => {
            Notification.success('操作成功')
            this.afterSave('objsaved', result)
          })
        }
      })
    }, 1000),
    open () {
      this.$nextTick(() => {
        this.obj.localMaterialName = this.goodsName
        this.obj.supplierName = this.supplierName
        this.obj.localMaterialId = this.handleId
        this.obj.materialType = this.materialType
        this.obj.id = this.ID
        this.obj.supplierLocalId = this.supplierLocalId
        this.obj = Object.assign({}, this.obj)
        this.dialogVisible = true
      })
    },
    afterSave () {
      this.$emit('afterSaveList')
      this.dialogVisible = false
    }
  },
  watch: {
    'dialogVisible' (v, oV) {
      if (v === false) {
        for (let key in this.obj) {
          this.obj[key] = ''
        }
      }
    }
  }
}
</script>
<style scoped>
/*.footer { padding-left: 120px}*/
</style>
