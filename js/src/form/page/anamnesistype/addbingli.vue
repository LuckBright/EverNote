<template>
  <div>
    <el-dialog
      class="addDialog"
      :visible="visible"
      @update:visible="close"
      width="500px"
      :close-on-click-modal="false"
    >
      <div slot="title" class="title">
        {{type === 'tech' ? '新增报告类型' : '新增病历类型'}}
        <span class="tip">(初始需要先创建一级类型)</span>
      </div>
      <div class="form">
        <el-form :model="value" size="small" label-width="auto" :rules="rules" ref="form">
          <el-form-item>
            <el-radio v-model="value.level" label="1">一级类型</el-radio>
            <el-radio v-model="value.level" label="2">二级类型</el-radio>
          </el-form-item>
          <el-form-item :label="type === 'tech' ? '报告分类:' :'病历分类:'">
            <el-select v-model="value.type">
              <el-option v-for='item in selectOptions' :label="item.name" :value="item.id" :key='item.id'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="一级类型名称:" v-if="value.level === '1'" required prop="name">
            <div class="inline">
              <el-input v-model.trim="value.name" placeholder="最多三十个字符" maxlength="30"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="一级类型名称:" v-if="value.level === '2'" prop="parentId">
            <el-select v-model="value.parentId">
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="二级类型名称:" v-if="value.level === '2'" required prop="name">
            <div class="inline">
              <el-input
                v-model.trim="value.name"
                placeholder="最多三十个字符"
                maxlength="30"
                :disabled="options.length === 0"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="选择图标:" v-if='type !== "tech"'>
            <div class="inline">
              <el-select v-model="value.icon" filterable placeholder="请选择图标">
                <el-option
                  v-for="item in icons"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                >
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right">
                    <svg class="icon" aria-hidden="true">
                      <use :xlink:href="`#${item.name}`"></use>
                    </svg>
                  </span>
                </el-option>
              </el-select>
              <span v-show="value.icon" :class="{mr: true}">
                 <svg class="icon" aria-hidden="true">
                      <use :xlink:href="`#${value.icon}`"></use>
                 </svg>
              </span>
            </div>
          </el-form-item>
          <el-form-item label="备注信息:">
            <div class="inline">
              <el-input v-model="value.comment" placeholder="最多三十个字符" maxlength="30"></el-input>
            </div>
          </el-form-item>
          <el-form-item :label="type === 'tech' ? '报告属性:' :'病历属性:'">
            <el-radio v-model="value.status" label="1">启用</el-radio>
            <el-radio v-model="value.status" label="0">停用</el-radio>
          </el-form-item>
        <el-form-item prop="writeCount" label="书写次数:" v-if='type !== "tech"'>
            <div class="inline">
              <el-input width="60" v-model="value.writeCount" placeholder="次数"></el-input>
            </div>
          </el-form-item>
          <el-form-item class="btns">
            <el-button @click="close">关闭</el-button>
            <el-button type="primary" @click="validate">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import sysvalue from '@/warehouse/store/sysvalueapi'
import { PARSE_SPECIAL_REG } from '@/warehouse/util/reg'
import {commandLog} from '@/phr/mixin/operationLog.js'

const ZHUYUAN = '1'
const ENABLE = '1'
export default {
  created () {
    this.getIcon()
  },
  props: {
    type: String,
    visible: Boolean,
    api: Object,
    selectOptions: {
      type: Array,
      default: () => [
         {name: '住院', id: '1'},
         {name: '门诊', id: '2'},
         {name: '护理', id: '3'},
         {name: '词条', id: '5'},
      ]
    },
    oneLevelName: {
      type: String
    },
    twoLevelName: {
      type: String
    }
  },
  data () {
    return {
      iconVisible: false,
      icons: [],
      rules: {
        name: [
          { required: true, message: '请输入类型名称', trigger: 'blur' },
          { required: true, message: '请输入类型名称', trigger: 'change' }
        ],
        writeCount: { pattern: PARSE_SPECIAL_REG, message: '请输入整数' }
      },
      value: {
        type: ZHUYUAN,
        level: '1',
        status: ENABLE,
        name: '',
        parentId: '',
        comment: '',
        icon: ''
      },
      options: []
    }
  },
  watch: {
    'value.level' (val) {
      this.$refs.form.resetFields()
      if (val === '1') {
        this.parentId = ''
      }
      if (val === '2') {
        this.searchFirst(this.value.type)
      }
    },
    'value.type' (val) {
      if (this.value.level === '2') {
        this.parentId = ''
        this.searchFirst(val)
      }
    }
  },
  methods: {
    selectIcon (name) {
      this.$set(this.value, 'icon', name)
    },
    getIcon () {
      sysvalue.listOnce('THC_EMR_ICON').then(result => {
        this.icons = result
      })
    },
    async searchFirst (type) {
      // 获取一级类型
      const data = await this.api.searchFirst({ type: type, level: '1' })
      this.options = data
      if (this.options.length) {
        this.value.parentId = this.options[0] && this.options[0].id
      } else {
        this.value.parentId = ''
        this.value.name = ''
        const map = { 1: '住院', 2: '门诊', 3: '护理', 5: '词条' }
        this.$messageTips(
          this,
          'info',
          `${map[type]}暂无一级类型名称，请先创建一级类型名称!`,
          '提示'
        )
      }
    },
    reset () {
      this.value = {
        type: ZHUYUAN,
        level: '1',
        status: ENABLE,
        name: '',
        parentId: '',
        comment: ''
      }
      // 清除提示信息
      try {
        // 第一次加载报错
        this.$refs.form.resetFields()
      } catch (e) { }
    },
    validate () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.add(this.value)
        } else {
          return false
        }
      })
    },
    close () {
      this.$emit('update:visible', false)
    },
    async add () {
      const msg = await this.api.create(this.value)
      if (msg.id) {
        this.$emit('close')
        this.$messageTips(this, 'success', '添加成功', '提示')
        commandLog({
          content: `保存病历类型的${this.value.name}`,
          opModuleOne: `${this.oneLevelName}-${this.twoLevelName}-病历类型`,
          opType: 'SAVE'})
      }
    }
  }
}
</script>
<style scoped lang="scss">
.tip {
  font-size: 12px;
  font-weight: 500;
}
.title {
  font-weight: 700;
}
.primary {
  background-color: red;
}
.mr {
  margin: 3px;
}
.addDialog {
  /deep/ .el-dialog {
    .el-dialog__body {
      padding: 10px 20px;
      /deep/ .el-form {
        .el-input {
          width: 93%;
        }
        .el-select {
          width: 93%;
          .el-input {
            width: 100%;
          }
        }
        .btns {
          text-align: right;
          margin-top: 15px;
        }
      }
    }
  }
}
</style>
