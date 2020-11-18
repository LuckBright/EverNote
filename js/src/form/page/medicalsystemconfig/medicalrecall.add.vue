<template>
  <div>
    <el-dialog
      :visible="visible"
      class="recall_add"
      width="600px"
      title="添加病历召回配置"
      :close-on-click-modal="false"
      @update:visible="close">
        <el-form ref="form" :model="value" size="small" label-width="auto" :rules="rules">
          <div class="partItem" v-if="!org" style="padding-top:10px;">
            <p class="partTitle">选择机构</p>
            <el-form-item  label="集团名称:">
              {{ tenantData.name }}
            </el-form-item>
            <el-form-item label="机构名称:" prop="orgId">
              <ever-org-select :is-org="false" v-model="value.orgId"></ever-org-select>
            </el-form-item>
          </div>
          <div class="partItem">
            <p class="partTitle">选择召回审核流程</p>
            <el-form-item label="" prop="AUDIT_PROCESS" label-width="10px">
              <el-radio v-model="radio" label="level2">二级召回审核流程</el-radio>
              <recall-step :class="{'active':radio==='level2'}"></recall-step>
            </el-form-item>
            <el-form-item label="" prop="AUDIT_PROCESS" label-width="10px">
              <el-radio v-model="radio" label="level3">三级召回审核流程</el-radio>
              <recall-step :step="3" :class="{'active':radio==='level3'}"></recall-step>
            </el-form-item>
          </div>
          <div class="partItem">
            <p class="partTitle">召回审核流程时限配置</p>
            <el-form-item label="时限配置:" prop="AUDIT_TIME" label-width="80px">
              <el-input v-model="value.AUDIT_TIME" style="width:80px;" type="number"></el-input>  (天)
            </el-form-item>
            <p class="comment">备注:审核通过后超出此设置的时间,系统自动回收修改权限</p>
          </div>
          <div class="partItem">
            <el-form-item label="备注信息:" prop="remarks" label-width="80px">
              <el-input v-model="value.remarks"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer">
          <el-button size="medium" @click="close">关闭</el-button>
          <el-button type="primary" size="medium" @click="validate" :disabled="!value.orgId && !org">确定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
  // import { request } from '@/util/req'
  import urlMap from '@/form/urls'
  import option from './mixins/option.mixin'
  import recallStep from '@/emr/components/recall.step'
  export default {
    components: {
      recallStep
    },
    name: 'recallAdd',
    props: {
      visible: Boolean,
      org: Boolean,
      pageName: String
    },
    mixins: [option],
    data () {
      return {
        value: {
          tenantId: '',
          orgId: '',
          AUDIT_PROCESS: 'level2',
          AUDIT_TIME: 1
        },
        pageType: 'add',
        config: urlMap.recallConfig,
        rules: {
          orgId: [{ required: true, trigger: 'change' }]
        }
      }
    },
    computed: {
      'radio': {
        get(value) {
          return this.value.AUDIT_PROCESS
        },
        set(newValue) {
          this.value.AUDIT_PROCESS = newValue
        }
      }
    },
    methods: {
      makeSaveData () {
        let data = JSON.parse(JSON.stringify(this.makeCommonData()))
        data.list = [
          {code: 'AUDIT_PROCESS', value: data.AUDIT_PROCESS},
          {code: 'AUDIT_TIME', value: data.AUDIT_TIME}
        ]
        delete data.AUDIT_PROCESS
        delete data.AUDIT_TIME
        return data
      },
      resetData () {
        this.value = {
          tenantId: '',
          orgId: '',
          AUDIT_PROCESS: 'level2',
          AUDIT_TIME: 1
        }
        if (this.org) {
          this.rules = {}
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.recall_add {
  /deep/.el-dialog__header {
    padding: 10px 20px;
    .el-dialog__header .el-dialog__title {
      font-size: 16px;
      font-weight: 700;
    }
  }
  /deep/.el-dialog__body {
    padding: 0 0 10px;
    .el-form {
      .partItem {
        padding: 0 20px 28px;
        .partTitle {
          color: #333;
          font-weight: 600;
          margin-bottom: 10px;
          margin-top: 0;
          text-indent: 5px;
          font-size: 14px;
          &:before {
            content: '';
            width: 3px;
            background-color: #1c7bef;
            height: 14px;
            float: left;
            border-radius: 3px;
            margin-top: 1px;
          }
        }
        .el-radio {
          margin-bottom:15px;
        }
      }
      /deep/ .el-checkbox-group {
        margin-top: 1px;
        .el-checkbox {
          line-height: 27px;
        }
        .el-checkbox.is-checked {
          .el-checkbox__label {
            color: #000;
          }
        }
      }
    }
  }
  /deep/ .el-dialog__footer {
    border: none;
    padding: 0 15px 15px;
    text-align: right;
    button {
      padding: 9px 15px;
    }
  }
  .comment{
    color:red;
    font-size: 12px;
    margin: 0;
    text-indent: 9px;
  }
}
</style>
