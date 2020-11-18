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
        {{ title }}
      </div>
      <div class="form">
        <el-form
          ref="form"
          :model="value"
          size="small"
          label-width="auto"
          :rules="rules">
          <el-form-item
            label="名称信息:"
            required
            prop="name">
            <el-input
              v-model="value.name"
              maxlength="30"
              placeholder="最多三十个字符"></el-input>
          </el-form-item>
          <el-form-item label="值集信息:">
            <ever-select
              v-model="value.source"
              :options="options"
              :clearable="true"
              placeholder="请选择值集信息"></ever-select>
          </el-form-item>
          <el-form-item label="信息属性:">
            <div>
              是否必填:
              <el-radio
                v-model="value.required"
                :label="true">
                是
              </el-radio>
              <el-radio
                v-model="value.required"
                :label="false">
                否
              </el-radio>
            </div>
            <div>
              是否修改:
              <el-radio
                v-model="value.updated"
                :label="true">
                是
              </el-radio>
              <el-radio
                v-model="value.updated"
                :label="false">
                否
              </el-radio>
            </div>
            <div>
              是否回显:
              <el-radio
                v-model="value.echo"
                :label="true">
                是
              </el-radio>
              <el-radio
                v-model="value.echo"
                :label="false">
                否
              </el-radio>
            </div>
            <div>
              是否统计:
              <el-radio
                v-model="value.statistic"
                :label="true">
                是
              </el-radio>
              <el-radio
                v-model="value.statistic"
                :label="false">
                否
              </el-radio>
            </div>
            <div>
              是否同步:
              <el-radio
                v-model="value.sync"
                :label="true">
                是
              </el-radio>
              <el-radio
                v-model="value.sync"
                :label="false">
                否
              </el-radio>
            </div>
            <div>
              是否启用:
              <el-radio
                v-model="value.status"
                :label="true">
                是
              </el-radio>
              <el-radio
                v-model="value.status"
                :label="false">
                否
              </el-radio>
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
  import api from '@/form/store/api'
  import { request } from '@/util/req'
  import urlMap from '@/util/urls'
  // import operationLog from '@/phr/mixin/operationLog.js'
  import {commandLog} from '@/phr/mixin/operationLog.js'

  export default {
    props: {
      visible: Boolean,
      form: Object,
      title: String,
      editApi: String,
      opType: String,
      opModuleOne: String,
      oneLevelName: {
        type: String
      },
      twoLevelName: {
        type: String
      }
    },
    data () {
      return {
        rules: {
          name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
        },
        value: {},
        options: []
      }
    },
    watch: {
      visible: {
        handler (val) {
          // 第一次打开新增时查询值集
          if (val && this.options.length === 0) {
            request(urlMap.valueSet.getValueSets).then(res => {
              if (res.head.errCode === 0) {
                this.options = res.data.map(item => {
                  return {
                    id: item.setCode,
                    name: item.setName
                  }
                })
              } else {
                this.options = []
              }
            })
          }
        }
      }
    },
    methods: {
      reset () {
        this.value = this.form
        try {
          // 第一次加载报错
          this.$refs.form.resetFields()
        } catch (e) {}
      },
      validate () {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.update(this.value)
          } else {
            return false
          }
        })
      },
      close () {
        this.$emit('update:visible', false)
      },
      async update () {
        const msg = await api[this.editApi](this.value)
        if (msg.id) {
          this.$emit('close')
          this.$messageTips(this, 'success', '更新成功', '提示')
          commandLog({
            content: `保存${this.opModuleOne}的${this.value.name}`,
            opModuleOne: `${this.oneLevelName}-${this.twoLevelName}-${this.opModuleOne}`,
            opType: 'SAVE'})
          // operationLog({content: this.value.name, opModuleOne: this.opModuleOne, opType: Number(this.opType)})
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .title {
    font-weight: 700;
  }
  .editDialog {
    /deep/ .el-dialog {
      .el-dialog__body {
        padding: 10px 20px;
      }
    }
  }
  /deep/ .el-form {
    .btns {
      text-align: right;
    }
  }
</style>
