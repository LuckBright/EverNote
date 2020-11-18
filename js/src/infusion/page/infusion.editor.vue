<template>
  <div class="infusion_editor">
    <div  v-show='schema.element'>
      <el-row class="operation">
        <el-button type="text"
                  @click="saveRecord">
          <i class="icon iconfont icon-editor-save"></i>保存
        </el-button>
        <el-button type="text"
                  @click="printRecord">
          <i class="icon iconfont icon-editor-print"></i>打印
        </el-button>
        <el-button type="text"
                  @click="submitPrint({preview:true})">
          <i class="icon iconfont icon-editor-preview"></i>打印预览
        </el-button>
        <el-button type="text"
                  @click="saveAsTpl">
          <i class="icon iconfont icon-bingli-muban"></i>另存为模版
        </el-button>
        <el-button type="text"
                  @click="saveAsEntry">
          <i class="icon iconfont icon-bingli-muban"></i>另存为词条
        </el-button>
        <el-button type="text"
                  @click="openWord">
          <i class="icon iconfont icon-yiny"></i>引用词条
        </el-button>
        <el-button type="text"
                  v-if="patient.formDataId"
                  @click="delRecord">
          <i class="icon iconfont"></i>删除报告
        </el-button>
      </el-row>
      <el-row class="flex_col_1_hidden">
        <div class="edit_con_wrap flex_col_1_auto pos_re"
            ref="editContent">
          <evereditor
            :key='key'
            :html="schema.element"
            :page-settings.sync="schema.pageSettings"
            :options="editorOpts"
            :toolbars="toolbars"
            :data-loader="dataLoader"
            ref="evereditor"
            mode="editor"
          >
          </evereditor>

        </div>
        <!--另存为模版和另存为词条-->
                    <!-- :dptId="dptId" -->
        <save-as-tpl v-if="saveTplVisible"
                    :editorInfo="editorInfo"
                    :visible.sync="saveTplVisible"
                    :tplType="tplType"
                    space='tech'
                    @submit="saveAsTplSuccess"></save-as-tpl>
        <!--打印模式-->
        <dialog-print :visible.sync="printVisible"
                      @submitPrint="submitPrint"
                      @submitContinuePrint="printMedicalProcess"></dialog-print>
        <!--词条模板引用-->
                    <!-- :dptId="dptId" -->
        <word-dialog :visible.sync="wordVisible" space='tech'
                    @save="insertWord"></word-dialog>
      </el-row>    </div>
  <everNoData tipTxt="请选择一个模版" v-show='!schema.element'></everNoData>
  </div>
</template>
<script>
import phrapi from '@/form/store/phrapi'
import inpatientapi from '@/inpatient/store/phr'
import { request } from '@/util/req'
import urlMap from '@/infusion/urlsfortech.js'
import { jcpPrintEditor, editorBaseOpts } from '@/util/common'
import saveAsTpl from '@/emr/components/dialog.save.as.tpl'
import dialogPrint from '@/inpatient/page/medicalrecord/dialog.print'
import evereditor from 'evereditor'
import tplQuote from '@/inpatient/page/quote/index'
import wordDialog from '@/inpatient/page/medicalrecord/word.dialog'

export default {
  props: ['patient'],
  data () {
    return {
      readonly: false,
      // editorInfo: {},
      schema: {
        element: '',
        pageSettings: {},
      },
      printVisible: false,
      saveTplVisible: false,
      drawer: false,
      form: {},
      rules: {},
      tpl: {},
      randomKey: 0,
      wordVisible: false,
      tplType: 'hospital_normal',
      toolbars: ['Undo', 'Redo', 'Copy', 'Cut', 'Paste'],
      editorOpts: {
        suggestItems: [],
        templateItems: [],
        customEchoData: {},
        ...editorBaseOpts
      },
      curNode: {},
      templateObj: {},
      key: 0
    }
  },
  created () {
    // let autoConfig = this.$ever.getClinicConfig().AUTO_SAVE_MEDICAL_RECORD
    // let autoSaveTime = autoConfig && autoConfig !== '0' && !isNaN(+autoConfig) ? +autoConfig : 2000
    // this.contentUpdate = debounce(this.saveRecord, autoSaveTime)
  },
  computed: {
    visitId () {
      let no = ''
      switch (Number(this.patient.visitType)) {
        case 1 : // 门诊
        case 2 : // 急诊
        case 5 : // 互联网医院
          no = this.patient.visitNumber
          break
        case 3 :
          no = this.patient.hospitalizedNumber
          break
        default :
          no = this.patient.visitNumber
          break
      }
      return no
    }
  },
  methods: {
    async printMedicalProcess (settings) {
      const postdata = {
        code: this.curNode.code,
        visitId: this.visitId
      }
      let printConfig = {
        printFrom: true,
        ...settings
      }

      try {
        let pageSettings
        const res = await phrapi.getPrintContinueRecords(postdata)
        if (res && res.length) {
          const newDom = document.createElement('div')
          const domArr = []
          let dataIds = []
          res.forEach((item, index) => {
            if (index === 0 || ['SHOU_CI_BING_CHENG_JI_LU_XIN', 'SHOU_CI_BING_CHENG_JI_LU'].includes(item.code)) {
              let pageInfo = (item.structure && item.structure.schema) || {}
              pageSettings = pageInfo.pageSettings
            }
            if (item.data && item.data.data && item.data.data.text) {
              let data = item.data.data
              newDom.innerHTML = data.text
              domArr.push({
                dom: newDom.innerHTML,
                header: data.header || '',
                footer: data.footer || '',
                track: data.track || false,
                anotherRecord: item.anotherRecord || 0,
                anotherPage: item.anotherPage || 0
              })
              dataIds.push(item.data.id)
            }
          })
          jcpPrintEditor(this, printConfig, pageSettings, domArr, () => {
            inpatientapi.modifyPrintState(dataIds).then(res => {
              this.load()
            })
          })
        } else {
          this.$messageTips(this, 'warning', '暂无可打印的数据！', '提示')
        }
      } catch (err) {
        // console.log('---printMedicalProcess--err--', err)
        this.$messageTips(this, 'error', '打印数据有误，请联系管理员处理', '提示')
      }
    },
    dataLoader (columns) {
      return request(urlMap.medicalRecord.getDocEchoDisplay, {
        items: columns,
        params: {
          visitId: this.visitId,
          patientId: this.patient.patientId,
          visitType: this.patient.visitType
        }
      }).then(res => {
        return res.data
      })
    },
    submitPrint (settings) {
      let content = this.$refs.evereditor.getHtml()
      let pageSettings = this.$refs.evereditor.pageSettings
      let printConfig = Object.assign({}, settings)
      jcpPrintEditor(this, printConfig, pageSettings, [{ dom: content }])
    },
    saveAsTpl () {
      this.saveTplVisible = true
      this.tplType = 'hospital_normal'
      // 另存为模版组件内部需要的参数
      this.editorInfo = {
        element: this.$refs.evereditor.getResetHtml(),
        pageSettings: this.$refs.evereditor.pageSettings,
        formTemplateId: this.templateObj.formTemplateId,
        designerId: '2',
        code: this.templateObj.code
      }
    },
    saveAsEntry () {
      let selectionHtml = this.$refs.evereditor.selectionHtml
      if (selectionHtml === '') {
        this.$messageTips(this, 'warning', '请选择需要另存为词条的内容', '提示')
        return false
      }
      this.saveTplVisible = true
      this.tplType = 'hospital_entry'
      // 另存为词条组件内部需要的参数
      this.editorInfo = {
        element: selectionHtml,
        pageSettings: this.$refs.evereditor.pageSettings,
        formTemplateId: this.templateObj.formTemplateId,
        designerId: '2',
        code: this.templateObj.code
      }
    },
    saveAsTplSuccess () {
      this.saveTplVisible = false
      this.$refs.evereditor.selectionHtml = ''
      this.$emit('load_template_list')
    },
    async saveRecord (isAuto) {
      // 文档型获取结构化数据items
      let items = []
      let text = ''
      if (!this.$refs.evereditor) return false
      let obj = this.$refs.evereditor.getSaveData(true)
      if (obj.success) {
        items = obj.data.items
        text = obj.data.text
      } else {
        this.$messageTips(this, 'warning', '文本编辑器校验不通过', '提示')
        return false
      }
      // 文档型
      if (!this.templateObj.categoryId) return
      let dataRequest = {
        ...this.templateObj,
        designerId: '2',
        data: {
          text,
          items,
          visitId: this.visitId,
          patientId: this.patient.patientId,
          operateCode: this.patient.formDataId ? 'EDIT_HANDWRITE_REPORT' : 'CREATE_HANDWRITE_REPORT'
        }
      }
      let res = {}
      res = await request(urlMap.medicalRecord.submitForm, dataRequest)
      if (res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', '保存成功', '提示')
        this.templateObj = Object.assign(this.templateObj, res.data)
        this.$emit('save')
      }
    },
    printRecord () {
      // this.printVisible = true
      this.submitPrint({})
    },
    delRecord () {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request(urlMap.medicalRecord.delete, {
          ...this.templateObj,
          designerId: '2',
          operateCode: 'DEL_HANDWRITE_REPORT'
        }).then(res => {
          if (res.head.errCode === 0) {
            this.$emit('drop')
            this.$messageTips(this, 'success', '删除成功', '提示')
          }
        })
      })
    },
    // 打开词条模板弹窗
    openWord () {
      this.wordVisible = true
    },
    // 保存词条模板
    insertWord (data) {
      this.$refs.evereditor.insert(data, true)
    },
    init (data = {}, type) {
      // this.templateObj = JSON.parse(JSON.stringify(data))
      // delete this.templateObj.id
      // this.editorOpts.customEchoData = this.patient
      this.schema.element = ''
      this.templateObj = {
        adviceId: this.patient.adviceId,
        executeId: this.patient.executeId,
        visitType: this.patient.visitType,
        scenes: this.patient.serviceType === '802' ? 2 : 1,
      }
      if (this.patient && this.patient.formDataId) {
        request(urlMap.templateManage.getFormDataById, {
          id: this.patient.formDataId
        })
        .then(res => {
          let result = this.patient
          this.templateObj = Object.assign(this.templateObj, {
            code: result.templateCode,
            categoryId: result.categoryId,
            templateScopeId: result.templateScopeId,
            formDataId: result.formDataId,
            formTemplateId: result.formTemplateId
          })
          this.schema = res.data
          this.schema.element = this.schema.data.text
          this.getTpl(null)
        })
      }
    },
    getTpl (data) {
      if (data) {
        this.templateObj = Object.assign(this.templateObj, data)
        this.templateObj.templateScopeId = this.templateObj.id // 新建的从模板获取的数据
      }
      request(urlMap.medicalRecord.getDocTpl, {id: this.templateObj.formTemplateId})
      .then(res => {
        if (data) {
          this.schema = res.data.schema
        } else {
          this.schema.pageSettings = res.data.schema.pageSettings
        }
        this.key++
      })
    },
  },
  components: {
    evereditor,
    saveAsTpl,
    dialogPrint,
    tplQuote,
    wordDialog
  }

}
</script>
<style lang="scss" scoped>
.infusion_editor {
  // .icon {
  //   font-size: 14px;
  //   vertical-align: initial;
  // }
  /deep/ .ever__editor.medical .editor_content_wrap {
      max-height: 500px;
  }
  /deep/ .tiptap_menu_bar{
    display: none;
  }
  .operation {
    width: 100%;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    font-size: 14px;
    background: #fff;
    .el-button--text {
      color: #000;
      font-weight: normal;
    }
    .el-button.is-disabled {
      color: #ccc;
    }
  }
  // /deep/.editor {
  //   border: none;
  // }
}
</style>
