<template>
  <div>
    <el-dialog title="创建标签" :visible.sync="dialogVisible" class="ui_dialog_02 spe">
        <ever-form2
        ref="addtag"
        :schema="schema"
        v-model="obj"
        :api="api"
        :rules="rules">
          <div slot="default"></div>
          <template slot="typeId">
            <el-radio v-model="obj.typeId" :label="1">自由标签</el-radio>
            <el-radio v-model="obj.typeId" :label="2">行为标签</el-radio>
          </template>
          <template slot="highFrequency">
            <el-form-item label="是否常用" style="margin-left:-120px;" v-display="displayFlag">
              <el-radio v-model="obj.highFrequency" :label="0">是</el-radio>
              <el-radio v-model="obj.highFrequency" :label="1">否</el-radio>
            </el-form-item>
          </template>
          <template slot="color">
            <div v-show="obj.highFrequency !== 1 && obj.typeId === 1">
              <el-form-item label="颜色：" style="margin-left:-120px;">
                <el-select v-model="obj.color" placeholder="请选择">
                  <el-option v-for="item in colorArr" :key="item.value" :label="item.label" :value="item.value">
                    <span style="float: left">
                      <div :style="'width:22px;height:10px;margin-top: 12px;background-color:' + item.value "></div>
                    </span>
                    <span style="float: right; color: #8492a6; font-size: 13px;">{{ item.label }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
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
    name: 'typeId',
    label: '标签类型：',
    comp: 'custom',
    span: 24
  },
  {
    name: 'name',
    label: '标签名称：',
    props: {
      maxlength: 20,
    },
    span: 24
  },
  {
    name: 'highFrequency',
    comp: 'custom',
    span: 24
  },
  {
    name: 'color',
    comp: 'custom',
    span: 24
  }
]
export default {
  data () {
    return {
      schema,
      obj: {},
      api,
      dialogVisible: false,
      displayFlag: false,
      colorArr,
      rules: {
        typeId: [{ required: true, message: '请选择标签类型', trigger: 'change' }],
        color: [{ required: false, message: '请选择颜色', trigger: 'change' }],
        name: [{ required: true, message: '请填写标签名称', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.initData()
  },
  watch: {
    'obj.typeId': {
      handler (val) {
        this.displayFlag = val === 2
        this.rules.color[0].required = val !== 2
      },
      deep: true
    },
    'obj.highFrequency': {
      handler (val) {
        this.rules.color[0].required = val !== 1
      },
      deep: true
    }
  },
  directives: {
    display: {
      binding: function (el, binding, value) {
        if (binding.value) {
          el.parentNode.parentNode.style = 'display:none'
        } else {
          el.parentNode.parentNode.style = 'display:block'
        }
      },
      update: function (el, binding, value) {
        if (binding.value) {
          el.parentNode.parentNode.style = 'display:none'
        } else {
          el.parentNode.parentNode.style = 'display:block'
        }
      }
    }
  },
  methods: {
    initData () {
      this.obj = this.$ever.createObjFromSchema(this.schema)
      this.obj.typeId = 1
      this.obj.highFrequency = 1
      this.obj.status = 0 // 0 正常，1禁用
    },
    open () {
      this.dialogVisible = true
      this.initData()
    },
    reset () {
      this.$refs.addtag.$refs.form.resetFields()
    },
    close () {
      this.dialogVisible = false
    },
    save () {
      if (!this.obj.name.trim()) this.obj.name = ''
      this.$refs.addtag.$refs.form.validate(valid => {
        if (valid) {
          api.create(this.obj).then(rs => {
            if (rs.head.errCode === 0) {
              this.dialogVisible = false
              this.$emit('update')
            }
          })
        }
      })
    }
  }
}
</script>
<style scoped>
</style>

