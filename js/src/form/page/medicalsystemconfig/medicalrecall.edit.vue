<template>
  <div>
    <el-dialog
      :visible="visible"
      class="recall_edit"
      width="600px"
      title="编辑病历召回配置"
      :close-on-click-modal="false"
      @update:visible="close">
        <el-form ref="form" :model="value" size="small" label-width="auto" :rules="rules">
          <div class="partItem" v-if="!org" style="padding-top:10px;">
            <p class="partTitle">选择机构</p>
            <el-form-item  label="集团名称:" label-width="80px">
              {{ tenantData.name }}
            </el-form-item>
            <el-form-item label="机构名称:" prop="orgId" v-if="showOrg" label-width="80px">
              <ever-org-select :is-org="false" v-model="value.orgId"></ever-org-select>
            </el-form-item>
          </div>
          <div class="partItem">
            <p class="partTitle">选择召回审核流程</p>
            <el-form-item label="" prop="AUDIT_PROCESS" label-width="10px">
              <el-radio  :disabled="getDisabaleByCode('AUDIT_PROCESS')" v-model="value.AUDIT_PROCESS" label="level2">二级召回审核流程</el-radio>
              <recall-step :class="{'active':value.AUDIT_PROCESS==='level2'}"></recall-step>
            </el-form-item>
            <el-form-item label="" prop="AUDIT_PROCESS" label-width="10px">
              <el-radio :disabled="getDisabaleByCode('AUDIT_PROCESS')" v-model="value.AUDIT_PROCESS" label="level3">三级召回审核流程</el-radio>
              <recall-step :step="3" :class="{'active':value.AUDIT_PROCESS==='level3'}"></recall-step>
            </el-form-item>
          </div>
          <div class="partItem">
            <p class="partTitle">召回审核流程时限配置</p>
            <el-form-item label="时限配置:" prop="AUDIT_TIME" label-width="80px">
              <el-input  :disabled="getDisabaleByCode('AUDIT_TIME')" v-model="value.AUDIT_TIME" style="width:80px;" type="number"></el-input>  (天)
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
          <el-button type="primary" size="medium" @click="validate({name:'病历召回配置'})" :disabled="disabled">确定</el-button>
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
    name: 'recallEdit',
    components: {
      recallStep
    },
    props: {
      visible: Boolean,
      form: Object,
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
        pageType: 'edit',
        config: urlMap.recallConfig,
        rules: {
          orgId: [{ required: true, trigger: 'change' }]
        },
        listCodeIndex: {}
      }
    },
    computed: {
      disabled () {
        return !this.value.orgId && this.showOrg
      }
    },
    mounted () {
      if (!this.showOrg) this.rules = {}
    },
    methods: {
      getDisabaleByCode (code) {
        if (!this.value.list) return
        let disabled = false
        this.value.list.forEach(item => {
          if (item.code === code) {
            disabled = item.disabled
          }
        })
        return disabled
      },
      makeSaveData () {
        let data = JSON.parse(JSON.stringify(this.makeCommonData()))
        if (data.list && data.list.length) {
          data.list.map(item => {
            switch (item.code) {
              case 'AUDIT_PROCESS':
                item.value = data['AUDIT_PROCESS']
                break
              case 'AUDIT_TIME':
                item.value = data['AUDIT_TIME']
                break
            }
            return item
          })
        }
        delete data.AUDIT_PROCESS
        delete data.AUDIT_TIME
        return data
      }
    }
  }
</script>

<style lang="scss" scoped>
.recall_edit {
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
    font-size:12px;
    margin:0;
    text-indent: 9px;
  }
}
</style>
