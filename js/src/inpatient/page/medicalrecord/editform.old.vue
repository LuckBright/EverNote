<template>
    <div class="editform flex_column_full flex_column_full_hidden" style="position:relative;">
        <el-row class="operation" v-if="!readonly">
          <el-button type="text" @click="saveRecord" v-if="curNode.status===1">
            <i class="icon iconfont icon-editor-save"></i>暂存
          </el-button>
          <el-button type="text" @click="saveRecord" v-if="curNode.status===2">
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
          <el-button type="text"  @click="saveAsTpl" :disabled="isable">
            <i class="icon iconfont icon-bingli-muban"></i>另存为模版
          </el-button>
          <el-button type="text"  @click="quoteMessage" :disabled="!isable && quoteable">
            <i class="icon iconfont icon-yiny"></i>引用信息
          </el-button>
          <!-- <el-button type="text"  @click="applyEdit" :disabled="isable || editable">
            <i class="icon iconfont icon-bingli-bianji"></i>申请编辑
          </el-button> -->
          <el-button type="text" @click="submitRecord" :disabled="isable||submitable" v-if="showSubmit">
            <i class="icon iconfont icon-tijiao1"></i>提交
          </el-button>
        </el-row>
        <el-row style="border:none;" class="flex_col_1_auto">
            <div ref="editContent">
                <tpl-form
                  ref="tplform"
                  :data-id="dataId"
                  v-model="form"
                  :schema-id="schemaId"
                  @update="docUpdate"
                  @focus="setFocus"
                  :allDisabled="!editMode"
                ></tpl-form>
            </div>
            <tpl-quote
              :visible.sync="drawer"
              :patient-id="patientId"
              :visit-num="visitId"
              :dptId="dptId"
              :curNode="curNode"></tpl-quote>
        </el-row>
        <!--另存为模版-->
        <save-as-tpl
          :curNode="curNode"
          :visible.sync="saveTplVisible"
          @submit="saveAsTplSuccess"
        ></save-as-tpl>
        <!--打印模式-->
        <dialog-print
          :visible.sync="printVisible"
          @submitPrint="submitPrint"
          @submitContinuePrint="printMedicalProcess"
        ></dialog-print>

    </div>
</template>
<script>
import tplForm from '@/form/components/tplform'
import templateManageUrl from '@/emr/urls'
import urlMap from '@/inpatient/urls'
import { request } from '@/util/req'
// import saveAsTpl from '@/inpatient/page/medicalrecord/dialog.save.as.tpl'
import dialogPrint from '@/inpatient/page/medicalrecord/dialog.print'
import storage from '@/util/storage'
import { remove } from 'lodash'
import tplQuote from '@/inpatient/page/quote/index'

export default {
  components: {
    tplForm,
    // saveAsTpl,
    dialogPrint,
    tplQuote
  },
  props: {
    patientId: {
      type: String
    },
    visitId: {
      type: String
    },
    dptId: {
      type: String
    },
    curNode: {
      type: Object
    },
  },
  data () {
    return {
      readonly: false,
      editMode: false,
      schemaId: this.curNode.formTemplateId,
      code: this.curNode.code,
      printVisible: false,
      saveTplVisible: false,
      drawer: false,
      form: {},
      tpl: {},
      editorIsUpdated: true
    }
  },
  computed: {
    dataId () {
      return this.curNode.type === 'bingli' ? this.curNode.id : ''
    },
    isDoc () {
      return this.curNode && this.curNode.designerId === '2'
    },
    printable () {
      // 病历未发生变动
      if (this.curNode.type === 'bingli' && this.editorIsUpdated === false) {
        return false
      } else {
        return true
      }
    },
    delable () {
    },
    saveAsable () {
      // 病历未发生变动
      if (this.curNode.type === 'bingli' && this.editorIsUpdated === false) {
        return false
      } else {
        return true
      }
    },
    quoteable () {
      if (this.curNode.type === 'bingli' && this.editMode) {
        return false
      } else {
        return true
      }
    },
    editable () {
      if (this.curNode.type === 'bingli' && this.editorIsUpdated === false) {
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
      if (this.curNode.type === 'bingli' && this.editorIsUpdated === false) {
        return false
      } else {
        return true
      }
    },
    showSubmit () {
      // 如果已提交则不显示提交按钮1保存2提交
      if ((this.curNode.status !== 2) && (this.curNode.type !== 'tpl')) {
        return true
      } else {
        return false
      }
    },
    isable () {
      // 引用模版
      if (this.curNode.type === 'tpl') {
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
    if (this.curNode.designerId !== '1') return false
    if (this.curNode.type === 'bingli') {
      this.editMode = false
    } else {
      this.editMode = true
    }
    this.$bus.$on('ref:append', (val) => {
      if (this.curNode.designerId !== '1') return false
      if (!this.form[this.focusField]) {
        this.form[this.focusField] = ''
      }
      this.form[this.focusField] = this.form[this.focusField] + val.replace(/<\/p>/g, ';\n').replace(/[<p>|<br>]/g, '')
    })
    if (this.$route.meta && this.$route.meta.prole === 1) { // 医生病历书写
      this.setReadOnly()
    } else if (this.$route.meta && this.$route.meta.prole === 2) { // 护士护理文书
      this.setReadOnly()
    }
  },
  methods: {
    setReadOnly () {
      if (this.curNode && this.curNode.recordType === 1) {
        this.readonly = true
      } else if (this.curNode && this.curNode.recordType === 3) {
        this.readonly = false
      }
    },
    printMedicalProcess () {

    },
    submitPrint () {

    },
    async saveAsTplSuccess (obj) {
      let schema = await request(urlMap.medicalRecord.getDocTpl, {
        id: this.curNode.formTemplateId
      }).then(res => {
        return res.data.schema
      })
      let formTemplateReq = {
        designerId: obj.designerId,
        templateId: this.curNode.formTemplateId,
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
    docUpdate (isUpdate) {
      this.editorIsUpdated = isUpdate
    },
    setFocus (name, obj) {
      this.focusField = name
    },
    setQuoteTemplates () {
      let quoteTemplates = JSON.parse(storage.getLocalStorage('quoteTemplates')) || []
      if (quoteTemplates) {
        remove(quoteTemplates, (formTemplateId) => {
          return formTemplateId === this.curNode.formTemplateId
        })
        storage.setLocalStorage('quoteTemplates', JSON.stringify(quoteTemplates))
      }
    },
    async saveRecord () {
      // 表单型
      let formRequest = {
        id: this.curNode.id,
        formTemplateId: this.curNode.formTemplateId,
        templateScopeId: this.curNode.id,
        code: this.curNode.code,
        meidcalRecordCategoryCode: this.curNode.code,
        formTemplateName: this.curNode.title,
        designerId: '1',
        data: {
          ...this.form,
          dptId: this.dptId,
          visitId: this.visitId,
          patientId: this.patientId
        }
      }

      if (this.curNode.type === 'tpl') { // 类型为tpl,肯定是新建病历，bingli为已有病历保存
        delete formRequest.id
      } else if (this.curNode.type === 'bingli') {
        formRequest.templateScopeId = this.curNode.templateScopeId
      }
      let res = {}
      if (this.curNode.status === 1) {
        res = await request(urlMap.medicalRecord.saveDraftInstance, formRequest)
      } else {
        res = await request(urlMap.medicalRecord.saveSubmitInstance, formRequest)
      }
      if (res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', '保存成功', '提示')
        this.editMode = false
        this.editorIsUpdated = false
        request(urlMap.medicalRecord.getCategoryByCode, {
          code: res.data.code
        }).then(result => {
          let obj = Object.assign({}, this.curNode, {
            id: res.data.id,
            templateScopeId: res.data.templateScopeId,
            categoryId: result.data.id,
            categoryName: result.data.name
          })
          this.setQuoteTemplates()
          this.$emit('saveSuccess', obj)
        })
      }
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
          id: this.curNode.id
        }).then(res => {
          if (res.head.errCode === 0) {
            this.$emit('deleteSuccess', this.curNode.id)
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
        id: this.curNode.id
      }).then(res => {
        if (res.head.errCode === 0) {
          this.editMode = true
        }
      })
    },
    submitRecord () {
      if (this.curNode.type === 'tpl') {
        this.$messageTips(this, 'info', '未保存不能提交病历', '提示')
        return false
      }
      request(urlMap.medicalRecord.submitInstance,
        {
          id: this.curNode.id
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
}
</style>
