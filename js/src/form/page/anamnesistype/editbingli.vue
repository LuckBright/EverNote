<template>
  <div>
    <el-dialog
      :visible="visible"
      width="500px"
      class="editDialog"
      :close-on-click-modal="false"
      @update:visible="close">
      <div
        slot="title"
        class="title">
         {{type === 'tech' ? '编辑报告类型' : '编辑病历类型'}}
        <span class="tip">(初始需要先创建一级类型)</span>
      </div>
      <div class="form">
        <el-form
          ref="form"
          :model="value"
          size="small"
          label-width="auto"
          :rules="rules">
          <el-form-item>
            <el-radio
              v-model="value.level"
              label="1" disabled>
              一级类型
            </el-radio>
            <el-radio
              v-model="value.level"
              label="2" disabled>
              二级类型
            </el-radio>
          </el-form-item>
          <el-form-item :label="type === 'tech' ? '报告分类:' :'病历分类:'">
            <el-select
              v-model="value.type"
              disabled>
              <el-option v-for='item in selectOptions' :label="item.name" :value="item.id" :key='item.id'></el-option>
             
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="value.level === '1'"
            label="一级类型名称:"
            required
            prop="name"
            >
            <div class="inline">
              <el-input
                v-model.trim="value.name"
                placeholder="最多三十个字符"
                maxlength="30" disabled></el-input>
            </div>
          </el-form-item>
          <el-form-item
            v-if="value.level === '2'"
            label="一级类型名称:"
            prop="parentId"
            required
            >
            <el-select v-model="value.parentId" disabled>
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="value.level === '2'"
            label="二级类型名称:"
            required
            prop="name" 
            >
            <div class="inline">
              <el-input
                v-model.trim="value.name"
                placeholder="最多三十个字符"
                maxlength="30"
                disabled></el-input>
            </div>
          </el-form-item>
          <el-form-item label="选择图标:" v-if='type !== "tech"'>
            <div class="inline">
              <el-select
                v-model="value.icon"
                filterable
                placeholder="请选择图标">
                <el-option
                  v-for="item in icons"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right">
                    <svg
                      class="icon"
                      aria-hidden="true">
                      <use :xlink:href="`#${item.name}`" />
                    </svg>
                  </span>
                </el-option>
              </el-select>
              <span
                v-if="value.icon"
                :class="{ mr: true }">
                <svg
                  class="icon"
                  aria-hidden="true">
                  <use :xlink:href="`#${value.icon}`" />
                </svg>
              </span>
            </div>
          </el-form-item>
          <el-form-item label="备注信息:">
            <div class="inline">
              <el-input
                v-model="value.comment"
                placeholder="最多三十个字符"
                maxlength="30"></el-input>
            </div>
          </el-form-item>
          <el-form-item :label="type === 'tech' ? '报告属性:' :'病历属性:'">
            <el-radio
              v-model="value.status"
              label="1">
              启用
            </el-radio>
            <el-radio
              v-model="value.status"
              label="0">
              停用
            </el-radio>
          </el-form-item>
          <el-form-item prop="writeCount" label="书写次数:"  v-if='type !== "tech"'>
            <div class="inline">
              <el-input width="60" v-model="value.writeCount" placeholder="次数"></el-input>
            </div>
          </el-form-item>
          <el-form-item class="btns">
            <el-button @click="close">
              关闭
            </el-button>
            <el-button
              type="primary"
              @click="validate">
              确定
            </el-button>
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

  export default {
    name: 'EditBingli',
    props: {
      visible: Boolean,
      form: Object,
      api: Object,
      type: String,
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
          writeCount: [
            { pattern: PARSE_SPECIAL_REG, message: '请输入大于1的整数', trigger: 'change' }
          ]
        },
        value: this.form,
        options: []
      }
    },
    watch: {
      'value.level' (val) {
        if (val === '2') {
          this.searchFirst(this.value.type)
        }
      },
      'value.type' (val) {
        if (this.value.level === '2') {
          // this.searchFirst(val)
        }
      }
    },
    created () {
      this.getIcon()
    },
    methods: {
      selectIcon (name) {
        this.$set(this.value, 'icon', name)
      },
      getIcon () {
        sysvalue.listOnce('THC_EMR_ICON').then(result => {
          this.icons = result
          this.$set(this.value, 'icon', this.form.icon)
        })
      },
      async searchFirst (type) {
        // 获取一级类型
        const data = await this.api.searchFirst({ type: type, level: '1' })
        this.options = data
        if (this.options.length) {
          if (this.value.parentId === '-1') {
            this.value.parentId = this.value.id
          }
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
          id: this.form.id,
          parentId: this.form.parentId,
          type: this.form.type,
          name: this.form.name,
          level: this.form.level,
          status: this.form.status,
          comment: this.form.comment,
          icon: this.form.icon,
          writeCount: this.form.writeCount
        }
      },
      validate () {
        if ((this.value.writeCount && !PARSE_SPECIAL_REG.test(this.value.writeCount)) || (this.value.writeCount === 0)) return
        if (!this.value.name) {
          this.$messageTips(this, 'warning', '请输入类型名称', '提示')
          return
        }
        if (!this.value.parentId) {
          if (this.value.level === '2') {
            this.$messageTips(this, 'warning', '请选择一级类型', '提示')
            return
          } else if (this.value.level === '1') {
            this.value.parentId = '-1'
          }
        }

        this.edit(this.value)
      },
      close () {
        this.$emit('update:visible', false)
      },
      async edit () {
        const msg = await this.api.editBingli(this.value)
        if (msg.id) {
          this.$emit('close')
          this.$messageTips(this, 'success', '更新成功', '提示')
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
  .mr {
    margin: 3px;
  }
  .primary {
    background-color: red;
  }
  .editDialog {
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
