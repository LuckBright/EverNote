<template>
    <div class="editform flex_column_full flex_column_full_hidden" style="position:relative;">
        <el-row class="operation" v-if="!readonly">
          <!-- <el-button type="text" @click="saveRecord" v-if="docItem.status===1">
            <i class="icon iconfont icon-editor-save"></i>暂存
          </el-button> -->
          <el-button type="text" @click="saveRecord">
            <i class="icon iconfont icon-editor-save"></i>保存
          </el-button>
          <!-- <el-button type="text" @click="printRecord" :disabled="isable||printable">
            <i class="icon iconfont icon-editor-print"></i>打印
          </el-button>
          <el-button type="text" @click="previewRecord" :disabled="isable||printable">
            <i class="icon iconfont icon-editor-preview"></i>打印预览
          </el-button> -->
          <el-button type="text" @click="delRecord" :disabled="isable">
            <i class="icon iconfont icon-bingli-shanchu"></i>删除
          </el-button>
          <!-- <el-button type="text"  @click="saveAsTpl" :disabled="isable">
            <i class="icon iconfont icon-bingli-muban"></i>另存为模版
          </el-button> -->
          <!-- <el-button type="text"  @click="quoteMessage" :disabled="!isable && quoteable">
            <i class="icon iconfont icon-yiny"></i>引用信息
          </el-button> -->
          <!-- <el-button type="text"  @click="applyEdit" :disabled="isable || editable">
            <i class="icon iconfont icon-bingli-bianji"></i>申请编辑
          </el-button> -->
          <!-- <el-button type="text" @click="submitRecord" :disabled="isable||submitable" v-if="showSubmit">
            <i class="icon iconfont icon-tijiao1"></i>提交
          </el-button> -->
        </el-row>
        <el-row style="border:none;" class="flex_col_1_auto form_box">
            <div ref="editContent">
              <!-- :data-model-id="copyDoc.formDataId" -->
                <phrform
                     :auto-save="true"
                     :code="code"
                     :visit-id="visitId"
                     :patient-id="patientId"
                     :dpt-id="dptId"
                     :data-id="dataId|| '-1'"
                     :editorIsUpdated.sync="editorIsUpdated"
                     v-model="form"
                     ref="form"
                     :nosubmit="true"
                     :schemaId.sync="schemaId"
                     :all-disabled="readonly"
                     @success="saveSuccessCallback"
                     @contentUpdate="contentUpdate"
                     @focus="setFocus"
                     @finished="formFinished"></phrform>
            </div>
            <tpl-quote
              :visible.sync="drawer"
              :patient-id="patientId"
              :visit-num="visitId"
              :dptId="dptId"
              :curNode="docItem"></tpl-quote>
        </el-row>
        <!--另存为模版-->
        <save-as-tpl
          v-if="saveTplVisible"
          :editorInfo="docItem"
          :visible.sync="saveTplVisible"
          @submit="saveAsTplSuccess"
        ></save-as-tpl>
        <!--打印模式-->
        <!-- <dialog-print
          :visible.sync="printVisible"
          @submitPrint="submitPrint"
          @submitContinuePrint="printMedicalProcess"
        ></dialog-print> -->

    </div>
</template>
<script>
import templateManageUrl from '@/emr/urls'
import urlMap from '@/inpatient/urls'
import { request } from '@/util/req'
import saveAsTpl from '@/emr/components/dialog.save.as.tpl'
// import dialogPrint from '@/inpatient/page/medicalrecord/dialog.print'
import storage from '@/util/storage'
import { remove } from 'lodash'
import tplQuote from '@/inpatient/page/quote/index'

export default {
  components: {
    saveAsTpl,
    // dialogPrint,
    tplQuote
  },
  props: {
    authority: {
      type: Number
    },
    patientId: {
      type: String
    },
    visitId: {
      type: String
    },
    dptId: {
      type: String
    },
    docItem: {
      type: Object
    },
    visitType: {
      type: Number
    },
    spaceName: {
      type: String
    }
  },
  data () {
    return {
      readonly: false,
      editMode: false,
      schemaId: this.docItem.formTemplateId,
      code: this.docItem.code,
      printVisible: false,
      saveTplVisible: false,
      drawer: false,
      form: {},
      tpl: {},
      editorIsUpdated: false
    }
  },
  computed: {
    dataId () {
      return this.docItem.type === 'bingli' ? this.docItem.id : ''
    },
    printable () {
      // 病历未发生变动
      if (this.docItem.type === 'bingli' && this.editorIsUpdated === false) {
        return false
      } else {
        return true
      }
    },
    delable () {
    },
    saveAsable () {
      // 病历未发生变动
      if (this.docItem.type === 'bingli' && this.editorIsUpdated === false) {
        return false
      } else {
        return true
      }
    },
    quoteable () {
      if (this.docItem.type === 'bingli' && this.editMode) {
        return false
      } else {
        return true
      }
    },
    editable () {
      if (this.docItem.type === 'bingli' && this.editorIsUpdated === false) {
        if (this.editMode) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    },
    submitable () {
      // 病历未发生变动
      if (this.docItem.type === 'bingli' && this.editorIsUpdated === false) {
        return false
      } else {
        return true
      }
    },
    showSubmit () {
      // 如果已提交则不显示提交按钮1保存2提交
      if ((this.docItem.status !== 2) && (this.docItem.type !== 'tpl')) {
        return true
      } else {
        return false
      }
    },
    isable () {
      // 引用模版
      if (this.docItem.type === 'tpl') {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    editorIsUpdated (val) {
      this.$emit('editorIsUpdated', val)
    }
  },
  mounted () {
    // 如果是tpl引用模版则可以编辑
    if (this.docItem.designerId !== '1') return false
    if (this.docItem.type === 'bingli') {
      this.editMode = false
    } else {
      this.editMode = true
    }
    this.$bus.$on('ref:append', (val) => {
      if (this.docItem.designerId !== '1') return false
      if (!this.form[this.focusField]) {
        this.form[this.focusField] = ''
      }
      this.form[this.focusField] = this.form[this.focusField] + val.replace(/<\/p>/g, ';\n').replace(/[<p>|<br>]/g, '')
    })
    // if (this.$route.meta && this.$route.meta.prole === 1) { // 医生病历书写
    //   this.setReadOnly()
    // } else if (this.$route.meta && this.$route.meta.prole === 2) { // 护士护理文书
    //   this.setReadOnly()
    // }
    this.setReadOnly()
  },
  methods: {
    contentUpdate () {},
    formFinished () {},
    setReadOnly () {
      if (this.authority === 1 || this.spaceName === 'nurse') { // 针对门诊病历
        this.readonly = true
      } else {
        this.readonly = false
      }
      // if (this.docItem && this.docItem.recordType === 1) {
      //   this.readonly = true
      // } else if (this.docItem && this.docItem.recordType === 3) {
      //   this.readonly = false
      // }
    },
    printMedicalProcess () {

    },
    submitPrint () {

    },
    async saveAsTplSuccess (obj) {
      let schema = await request(urlMap.medicalRecord.getDocTpl, {
        id: this.docItem.formTemplateId
      }).then(res => {
        return res.data.schema
      })
      let formTemplateReq = {
        designerId: obj.designerId,
        templateId: this.docItem.formTemplateId,
        schema
      }

      let requestData = Object.assign({}, obj, {
        formTemplateReq
      })
      request(templateManageUrl.templateManage.saveTpl, requestData).then(res => {
        if (res.head.errCode === 0) {
          this.saveTplVisible = false
          this.$messageTips(this, 'success', '另存为模版成功', '提示')
        }
      })
    },
    setFocus (name, obj) {
      this.focusField = name
    },
    setQuoteTemplates () {
      let quoteTemplates = JSON.parse(storage.getLocalStorage('quoteTemplates')) || []
      if (quoteTemplates) {
        remove(quoteTemplates, (formTemplateId) => {
          return formTemplateId === this.docItem.formTemplateId
        })
        storage.setLocalStorage('quoteTemplates', JSON.stringify(quoteTemplates))
      }
    },
    async saveRecord () {
      this.$refs.form.save({
        formTemplateName: this.docItem.title,
        templateScopeId: this.docItem.templateScopeId || this.docItem.id// 病历有scopeId的信息，如果引用模版就会取id
      })
    },
    saveSuccessCallback (res) {
      request(urlMap.medicalRecord.getCategoryByCode, {
        code: res.code
      }).then(result => {
        this.editorIsUpdated = false
        let obj = Object.assign({}, this.docItem, {
          id: res.id,
          templateScopeId: res.templateScopeId,
          categoryId: result.data.id,
          categoryName: result.data.name,
          isUpdate: false
        })
        this.setQuoteTemplates()
        this.$emit('saveSuccess', obj)
      })
      // let obj = Object.assign({}, this.docItem, {
      //   id: res.id,
      //   templateScopeId: res.templateScopeId,
      //   categoryId: res.categoryId,
      //   categoryName: res.formTemplateName,
      //   isUpdate: false
      // })
      // this.$emit('saveSuccess', obj)
    },
    printRecord () {
      this.printVisible = true
    },
    previewRecord () {
    },
    delRecord () {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request(urlMap.medicalRecord.deleteInstance, {
          id: this.docItem.id
        }).then(res => {
          if (res.head.errCode === 0) {
            this.$emit('deleteSuccess', this.docItem.id)
            this.$messageTips(this, 'success', '删除成功', '提示')
          }
        })
      }).catch(() => {
        this.$messageTips(this, 'info', '已取消删除', '提示')
      })
    },
    saveAsTpl () {
      this.saveTplVisible = true
    },
    quoteMessage () {
      this.drawer = true
    },
    applyEdit () {
      request(urlMap.medicalRecord.applyEdit, {
        id: this.docItem.id
      }).then(res => {
        if (res.head.errCode === 0) {
          this.editMode = true
        }
      })
    },
    submitRecord () {
      if (this.docItem.type === 'tpl') {
        this.$messageTips(this, 'info', '未保存不能提交病历', '提示')
        return false
      }
      request(urlMap.medicalRecord.submitInstance,
        {
          id: this.docItem.id
        }
      ).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '提交成功', '提示')
          this.$emit('submitRecord', true)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.editform{
    .icon{
      font-size:14px;
      vertical-align: initial;
    }
    .el-dialog__wrapper{
        position:absolute;
        top: initial;
        /deep/.el-drawer__container{
            height:306px;
        }
    }
    .el-tabs__header{
        margin:0;
    }
    .operation{
        width:100%;
        height:30px;
        line-height:30px;
        padding:0 10px;
        font-size:14px;
        background:#fff;
        .el-button--text{
          color:#000;
          font-weight:normal;
        }
        .el-button.is-disabled{
          color:#ccc;
        }
    }
    /deep/.editor{
      border:none;
    }
    .form_box{
      padding:0 20px;
    }
}
</style>
