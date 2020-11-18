<template>
  <form-schema
    ref="formSchema"
    :breadHidden="true"
    :saveHidden="true"
    :templateId="editorObj.formTemplateId"
    :formDataId="editorObj.formDataId"
    :templateName="editorObj.name"
    :disabled="disabled"
    @fromTpl="getFromTpl"
    @formObj="getFormObj">
    <template slot="saveBtn">
      <el-button @click="saveTpl"
                  :disabled="disabled"
                  style="float:right">保存模版</el-button>
      <el-button @click="review"
                  v-if="!reviewBtn"
                  style="float:right;margin-right:10px;">{{Number(editorObj.auditStatus) === 2 ? '撤销审核' : '审核'}}</el-button>
    </template>
  </form-schema>
</template>
<script>
import confirm from '@/util/confirm'
import formSchema from '@/form/page/formschema'
import update from '@/emr/mixins/update.js'// vuex存储数据
export default {
  name: 'template_form',
  components: {
    formSchema,
  },
  mixins: [update],
  props: {
    workshop: {
      type: String
    },
    disabled: {
      type: Boolean
    },
    businessType: {
      type: Number
    },
    reviewAble: {
      type: Boolean
    }
  },
  data () {
    return {
      formTpl: {}, // 保存表单模版需要的一坨参数
      formUpdate: false
    }
  },
  computed: {
    reviewBtn () {
      // 机构工作站下集团模板；个人模板；没有审核权限（科室模板）；新建模板； 不显示审核/撤销审核按钮
      return String(this.businessType) === '0' && this.workshop === 'orgSetting' || this.businessType === 2 || !this.reviewAble && String(this.businessType) === '3' || !this.editorObj.auditStatus
    }
  },
  methods: {
    saveTpl () {
      this.$parent.saveTpl()
    },
    review () {
      if (this.templateChange) {
        confirm(this, {
          content: '文档有修改，请先保存再执行审核/撤销审核操作！',
          showCancelButton: true,
          confirmCallBack: () => {
            // this.saveTpl()
          },
          cancelCallBack: () => {
          }
        })
      } else {
        this.$parent.contextmenuReview(this.editorObj)
      }
    },
    getFormInfo () {
      return {
        formTpl: this.formTpl,
        formData: this.$refs.formSchema.obj
      }
    },
    getFromTpl (val, isUpdate) { // 模版发生更新回调
      this.formTpl = val
      console.log('模版更新', isUpdate)
      this.setChange(isUpdate)
    },
    getFormObj (isUpdate) { // 数据发生更新
      console.log('表单数据更新', isUpdate)
      this.setChange(isUpdate)
    }
  }
}
</script>
