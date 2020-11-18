<template>
  <div class="layout_inner">
    <el-dialog :title="behaviorData.systemFlag === 0 && !behaviorData.id ? '创建新行为' : '编辑行为'" :visible.sync="dialogVisible" class="ui_dialog_02 spe">
      <ever-form2
        ref="addtag"
        :schema="schema"
        v-model="obj"
        :api="api"
        :info="true"
        :label-width="'140px'"
        :rules="rules"
        :showMessage="false"
      >
        <div slot="default"></div>
        <template slot="name">
          <div v-show="behaviorData.systemFlag === 0">
            <el-input v-model.trim="obj.name" placeholder="行为类型名称" style="width:220px;" maxlength="20"></el-input>
          </div>
          <div v-show="behaviorData.systemFlag === 1">
            <span>{{behaviorData.name}}</span>
          </div>
        </template>
        <template slot="status">
          <el-form-item label="行为生效状态：" style="margin-left:-140px;">
            <el-radio v-model="obj.status" :label="1">生效</el-radio>
            <el-radio v-model="obj.status" :label="0">停止</el-radio>
          </el-form-item>
        </template>
        <template slot="color">
          <el-form-item label="颜色：" style="margin-left:-140px;" v-show="behaviorData.systemFlag === 0">
            <el-select v-model="obj.color" placeholder="请选择">
              <el-option v-for="item in colorArr" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left">
                  <div :style="'width:22px;height:10px;margin-top: 12px;background-color:' + item.value "></div>
                </span>
                <span style="float: right; color: #8492a6; font-size: 13px;">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <template slot="rules">
          <el-form-item label="自动进行标识规则：" style="margin-left:-140px;" v-show="behaviorData.systemFlag === 1">
            客户有欠费未结清
          </el-form-item>
        </template>
        <template slot="canclerules">
          <el-form-item label="自动取消标识规则：" style="margin-left:-140px;" v-show="behaviorData.systemFlag === 1">
            所有欠款已结清
          </el-form-item>
        </template>
      </ever-form2>
      <div slot="footer" class="dialog-footer mt10 ml140">
        <el-button @click="close">取 消</el-button>
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
    label: '行为类型：',
    comp: 'custom',
    span: 6
  },
  {
    name: 'status',
    comp: 'custom',
    span: 24
  },
  // {
  //   name: 'color',
  //   comp: 'custom',
  //   span: 24
  // },
  {
    name: 'rules',
    comp: 'custom',
    span: 24
  },
  {
    name: 'canclerules',
    comp: 'custom',
    span: 24
  }
]
export default {
  props: {
    'behaviorData': {
      type: Object,
      default: () => {}
    },
  },
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.status = 1
    obj.typeId = 2
    obj.systemFlag = null
    return {
      schema,
      obj,
      api,
      colorArr,
      dialogVisible: false,
      rules: {
        // color: [{ required: true, message: '请选择颜色', trigger: 'change' }],
        name: [{ required: true, message: ' ', trigger: 'blur' }]
      }
    }
  },
  methods: {
    open () {
      this.dialogVisible = true
      this.$nextTick(_ => {
        if (this.behaviorData.isNew) {
          this.reset()
          this.obj.systemFlag = 0
          this.obj.id = ''
          this.obj.labelId = ''
        } else {
          this.reset()
          this.obj.id = this.behaviorData.id
          this.obj.labelId = this.behaviorData.labelId
          this.obj.name = this.behaviorData.name
          this.obj.status = this.behaviorData.status
          this.obj.systemFlag = this.behaviorData.systemFlag
          // this.obj.color = this.behaviorData.color ? this.behaviorData.color : ''
          // this.rules.color[0].required = false
        }
      })
    },
    reset () {
      this.$refs.addtag.$refs.form.resetFields()
    },
    close () {
      this.dialogVisible = false
    },
    save () {
      let request = api.creatorModify
      this.$refs.addtag.$refs.form.validate(valid => {
        if (valid) {
          request(this.obj).then(rs => {
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
<style lang="scss" scoped>
  .ml140{margin-left:140px;}
</style>

