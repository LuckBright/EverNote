<template>
  <div>
    <el-dialog
      :visible="visible"
      width="500px"
      class="addDialog"
      :close-on-click-modal="false"
      @update:visible="close">
      <div
        slot="title"
        class="title">
        添加自动归档配置
      </div>
      <div class="form">
        <el-form
          ref="form"
          :model="value"
          size="small"
          label-width="auto"
          :rules="rules">
          <el-form-item
            v-if="!org"
            label="集团名称:">
            {{ tenantData.name }}
          </el-form-item>
          <el-form-item
            v-if="!org"
            label="机构名称:"
            prop="orgId">
            <ever-org-select
              :is-org="false"
              v-model="value.orgId"></ever-org-select>
          </el-form-item>

          <el-form-item
            label="时效内容(小时):"
            prop="hourContent">
            <el-input
              v-model="value.hourContent"
              placeholder="请输入时效内容(小时)"></el-input>
          </el-form-item>
          <el-form-item
            label="备注信息:"
            prop="remarks">
            <el-input
              v-model="value.remarks"
              placeholder="请输入备注信息"></el-input>
          </el-form-item>

          <el-form-item class="btns">
            <el-button @click="close">
              关闭
            </el-button>
            <el-button
              type="primary"
              @click="validate({name:'自动归档配置'})">
              确定
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import urlMap from '@/form/urls'
  import option from './mixins/option.mixin'
  import { formCheckNonnegativeInt } from '@/util/validate'

  export default {
    props: {
      visible: Boolean,
      org: Boolean,
      pageName: String
    },
    mixins: [option],
    data () {
      return {
        pageType: 'add',
        value: {
          hourContent: '',
          tenantId: '',
          orgId: '',
          remarks: ''
        },

        config: urlMap.autoConfig,
        rules: {
          hourContent: [{ required: true, validator: formCheckNonnegativeInt, minValue: 0, maxValue: 1440, trigger: 'change' }],
        },
      }
    },
    methods: {
      resetData () {
        this.value = {
          hourContent: '',
          tenantId: '',
          orgId: '',
          remarks: ''
        }
      },
      makeSaveData () {
        let data = this.makeCommonData()
        data.list = [{code: 'RECORD_AUTO_LOCK_DAY', value: data.hourContent}]
        delete data.hourContent
        return data
      }
    }
  }
</script>

<style scoped lang="scss">
  .title {
    font-weight: 700;
  }
  .addDialog {
    /deep/ .el-dialog {
      .el-dialog__body {
        padding: 10px 20px;
        /deep/ .el-form {
          .btns {
            text-align: right;
            margin-top: 10px;
          }
        }
      }
    }
  }
</style>
