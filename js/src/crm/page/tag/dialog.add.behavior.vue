<template>
  <div>
    <el-dialog title="创建标签" :visible.sync="dialogVisible" class="ui_dialog_02 spe">
        <ever-form2
        ref="form"
        :schema="schema"
        v-model="obj"
        :api="api"
        :rules="rules">
          <div slot="default"></div>
          <template slot="status">
            <el-form-item label="行为生效状态" style="margin-left:-120px;">
              <el-radio v-model="obj.status" :label="2">停止</el-radio>
              <el-radio v-model="obj.status" :label="1">生效</el-radio>
            </el-form-item>
          </template>
          <template slot="color">
            <el-select v-model="obj.color" placeholder="请选择">
              <el-option v-for="item in colorArr" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left">
                  <div :style="'width:22px;height:10px;margin-top: 12px;background-color:' + item.value "></div>
                </span>
                <span style="float: right; color: #8492a6; font-size: 13px;">{{ item.label }}</span>
              </el-option>
            </el-select>
          </template>
        </ever-form2>
        <div slot="footer" class="dialog-footer mt10">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import api from '../../store/tagapi'
import { colorArr } from './tag.config.js'
let schema = [
  {
    name: 'name',
    label: '行为类型名称：',
    span: 24
  },
  {
    name: 'status',
    comp: 'custom',
    span: 24
  },
  {
    name: 'color',
    label: '行为标签：',
    comp: 'custom',
    span: 24
  }
]
export default {
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.status = 1
    obj.typeId = 2
    return {
      schema,
      obj,
      api,
      dialogVisible: false,
      colorArr,
      rules: {
        color: [{ required: true, message: '请选择颜色', trigger: 'change' }],
        name: [{ required: true, message: '请输入行为类型名称', trigger: 'blur' }]
      }
    }
  },
  methods: {
    open () {
      this.dialogVisible = true
      this.$nextTick(_ => {
        this.reset()
      })
    },
    reset () {
      this.$refs.form.$refs.form.resetFields()
    },
    close () {
      this.dialogVisible = false
    },
    save () {
      this.$refs.form.$refs.form.validate(valid => {
        valid && api.create(this.obj).then(rs => {
          if (rs.head.errCode === 0) {
            this.dialogVisible = false
            this.$emit('update')
          }
        })
      })
    }
  }
}
</script>
<style scoped>
</style>

