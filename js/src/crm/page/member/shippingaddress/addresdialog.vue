<template>
  <el-row class="addres_class">
    <el-dialog :title="isDel ? '是否删除收货地址？' : (title ? title : '新增收货地址')" :visible.sync="dialogVisible" class="spe" :close-on-click-modal="false" width="28%">
      <div style="height:180px;text-align: center;font-size: 20px">
        <el-row>
          <el-col :span="20">
            <ever-form2
              :schema="schema"
              v-model="obj"
              ref="form"
              :rules="rules"
              :nosubmit="true">
            </ever-form2>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="spe" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="btnLoading">{{isDel ? '确定' : '保存'}}</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
import * as validateObj from '@/util/validate'
let schemaAddEdit = [
  {
    name: 'name',
    label: '收货人姓名',
    props: {
      maxlength: 10,
      clearable: true
    }
  },
  {
    name: 'mobile',
    label: '手机号',
    props: {
      type: 'number',
      clearable: true
    }
  },
  {
    name: 'address',
    label: '收货地址',
    comp: 'ever-address',
    props: {
      layout: '2'
    }
  },
]
let schemaDel = [
  {
    name: 'name',
    label: '收货人姓名:',
    comp: 'readonlyitem'
  },
  {
    name: 'mobile',
    label: '手机号:',
    comp: 'readonlyitem'
  },
  {
    name: 'address',
    label: '收货地址:',
    comp: 'ever-address',
    props: {
      convertToFnt: true,
    }
  },
]
let schema = []
export default {
  props: ['title', 'api', 'patientId'],
  data () {
    return {
      dialogVisible: false,
      schema,
      obj: {},
      cacheObj: {},
      rules: {
        'name': [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
        'mobile': [{ required: true, validator: validateObj.validatePhone, trigger: 'blur' }],
        'address': [{ required: true, message: '请选择省市区', trigger: 'blur' }],
      },
      btnLoading: false,
      isDel: false,
    }
  },
  methods: {
    close (refresh) {
      if (refresh) this.$emit('searchList', true)
      this._emptyData()
      this.dialogVisible = false
    },
    open ({data, flag}) {
      this.isDel = flag
      this._emptyData()
      this.schema = this.createObject(this.isDel).schema
      this.obj = this.createObject(this.isDel).obj
      if (data && data.id) {
        this.obj = data
      } else {
        Object.assign(this.obj, {
          patientId: this.patientId,
          source: 1 // pc客户中心
        })
      }
      this.dialogVisible = true
    },
    handleSubmit () {
      let params = {}
      if (this.isDel) { // 删除
        params.id = this.obj.id
        this.api.del(params).then(res => {
          if (res && res.data) {
            this.$messageTips(this, 'success', '删除成功')
            this.close(true)
          }
        })
      } else { // 新增|修改
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            Object.assign(params, this.obj)
            this.api.createOrUpdate(params).then(res => {
              if (res && res.data) {
                this.$messageTips(this, 'success', '保存成功')
                this.close(true)
              }
            })
          }
        })
      }
    },
    createObject (flag) {
      schema = flag ? schemaDel : schemaAddEdit
      return {
        schema,
        obj: this.$ever.createObjFromSchema(schema),
      }
    },
    _emptyData () {
      this.schema = []
      this.obj = {}
    },
  }
}
</script>
<style scoped>
.addres_class /deep/ .el-form-item__content {
  text-align: left !important;
  line-height: 22px !important;
}
.addres_class /deep/ .el-form-item__label {
  height: 22px !important;
}
</style>
