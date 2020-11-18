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
        编辑病案首页配置
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
            {{ value.tenantName }}
          </el-form-item>
          <el-form-item
            v-if="showOrg"
            label="机构名称:"
            prop="orgId">
            <ever-org-select
              :is-org="false"
              v-model="value.orgId"></ever-org-select>
          </el-form-item>

          <el-form-item
            label="病案首页类型:"
            prop="homePageType">
            <ever-select
              v-model="value.homePageType"
              :options="homePageTypeOptions"
              placeholder="请选择病案首页类型"></ever-select>
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
              @click="validate({name:'病案首页配置'})">
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

  export default {
    name: 'MedicalEdit',
    props: {
      visible: Boolean,
      form: Object,
      org: Boolean,
      pageName: String
    },
    mixins: [option],
    data () {
      return {
        pageType: 'edit',
        value: {},

        config: urlMap.medicalConfig,
        rules: {
          homePageType: [{ required: true, message: '请选择病案首页类型', trigger: 'blur' }],
        },
        // 病案首页类型
        homePageTypeOptions: [
          { id: 'beijing', name: '住院病案首页' },
          { id: 'jilin', name: '中医住院病案首页' }
        ],
      }
    },
    methods: {
      resetData () {
        // 设置病案首页类型
        if (this.value.list && this.value.list.length === 1) {
          this.value.homePageType = this.value.list[0].value
        } else {
          this.value.homePageType = '1'
        }
        this.value = Object.assign({}, this.value)
      },
      makeSaveData () {
        let data = this.makeCommonData()
        data.list = [{
          id: this.value.list[0].id,
          code: this.value.list[0].code,
          value: data.homePageType
        }]
        delete data.homePageType
        return data
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
