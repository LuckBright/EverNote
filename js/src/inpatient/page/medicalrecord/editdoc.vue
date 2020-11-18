<template>
  <div class="editdoc" style="position:relative;">
    <el-row class="operation" v-if="visitType === 1">
      <el-button @click="saveClinic" type="text">
        <i class="icon iconfont icon-editor-save"></i>保存
      </el-button>
      <el-button type="text" @click="delRecord" :disabled="isable">
        <i class="icon iconfont icon-bingli-shanchu"></i>删除
      </el-button>
    </el-row>
    <el-row
      class="operation"
      v-if="!($route.query.readonly === 'true') && !readonly && visitType !== 1"
    >
      <el-button
        type="text"
        @click="saveRecord()"
        v-if="docItem.status === 1"
        :disabled="saveDisabled"
      >
        <i class="icon iconfont icon-editor-save"></i>暂存
      </el-button>
      <el-button
        type="text"
        @click="saveRecord()"
        v-if="docItem.status === 2"
        :disabled="saveDisabled"
      >
        <i class="icon iconfont icon-editor-save"></i>保存
      </el-button>
      <el-button
        type="text"
        @click="printRecord"
        :disabled="authority === 1 || isable || printable"
      >
        <i class="icon iconfont icon-editor-print"></i>打印
      </el-button>
      <el-button
        type="text"
        @click="submitPrint({ preview: true })"
        :disabled="authority === 1 || isable || printable"
      >
        <i class="icon iconfont icon-editor-preview"></i>打印预览
      </el-button>
      <el-button type="text" @click="delRecord" :disabled="delDisabled">
        <i class="icon iconfont icon-bingli-shanchu"></i>删除
      </el-button>
      <el-button type="text" @click="saveAsTpl" :disabled="authority === 1">
        <i class="icon iconfont icon-bingli-muban"></i>另存为模版
      </el-button>
      <el-button type="text" @click="saveAsEntry" :disabled="authority === 1">
        <i class="icon iconfont icon-bingli-muban"></i>另存为词条
      </el-button>
      <el-button
        type="text"
        @click="quoteMessage"
        :disabled="authority === 1 || (!isable && quoteable)"
      >
        <i class="icon iconfont icon-yiny"></i>引用信息
      </el-button>
      <el-button type="text" :disabled="authority === 1" @click="openWord">
        <i class="icon iconfont icon-yiny"></i>引用词条
      </el-button>
      <!-- <el-button type="text"  @click="applyEdit" :disabled="authority===1||isable || editable">
          <i class="icon iconfont icon-bingli-bianji"></i>申请编辑
      </el-button>-->
      <el-button
        type="text"
        @click="submitRecord"
        :disabled="authority === 1 || isable || submitable"
        v-if="showSubmit"
      >
        <i class="icon iconfont icon-tijiao1"></i>提交
      </el-button>
    </el-row>
    <el-row class="flex_col_1_hidden">
      <div
        class="edit_con_wrap flex_column_full_hidden pos_re"
        ref="editContent"
      >
        <tpl-doc
          :key="uuid"
          class="flex_col_1_auto"
          :visit-id="visitId"
          :patient="patient"
          :patient-id="patientId"
          :dpt-id="dptId"
          :data-id="dataId"
          :schema-id="schemaId"
          ref="tpldoc"
          :editable="editable"
          :doctype="doctype"
          :is-updated.sync="editorIsUpdated"
          :code="docItem.code"
          @contentUpdate="contentUpdate"
          @docRendered="docRendered"
        ></tpl-doc>
        <tpl-quote
          :visible.sync="drawer"
          :patient-id="patientId"
          :visit-num="visitId"
          :dptId="dptId"
          :curNode="docItem"
        ></tpl-quote>
      </div>
      <!--另存为模版和另存为词条-->
      <save-as-tpl
        v-if="saveTplVisible"
        :editorInfo="editorInfo"
        :dptId="dptId"
        :page-type="pageType"
        :visible.sync="saveTplVisible"
        :tplType="tplType"
        :visit-id="visitId"
        :patient-id="patientId"
        :patient-name="patientName"
        :level-one-name="levelOneName"
        @submit="saveAsTplSuccess"
      ></save-as-tpl>
      <!--打印模式-->
      <dialog-print
        :visible.sync="printVisible"
        @submitPrint="submitPrint"
        @submitContinuePrint="printMedicalProcess"
      ></dialog-print>
      <!--词条模板引用-->
      <word-dialog
        v-if="wordVisible"
        :visible.sync="wordVisible"
        :dptId="dptId"
        @save="insertWord"
      ></word-dialog>
    </el-row>
  </div>
</template>
<script>
import phrapi from '@/form/store/phrapi'
import inpatientapi from '@/inpatient/store/phr'
import { remove, debounce } from 'lodash'
import urlMap from '@/inpatient/urls'
import { request } from '@/util/req'
import { jcpPrintEditor } from '@/util/common'
import saveAsTpl from '@/emr/components/dialog.save.as.tpl'
import dialogPrint from '@/inpatient/page/medicalrecord/dialog.print'
import tplDoc from '@/form/components/tpldoc'
import storage from '@/util/storage'
import tplQuote from '@/inpatient/page/quote/index'
import wordDialog from '@/inpatient/page/medicalrecord/word.dialog'
import { MedicalRecord } from '@/emr/config/doc.record.operation.js'
import { commandLog } from '@/phr/mixin/operationLog.js'
import lock from './mixins/lock.js'
import uuid from 'uuid/v4'
/*
formTemplateId:模版id
code:模版code
designerId:2  //1表单型，2文档型
status:1,//暂存状态 2已提交状态
type:'bingli'//代表病历  'tpl'代表模版这是自定义的和接口没关系
id:病历id
templateScopeId:模版关联id
title:模版名称
*/

export default {
  mixins: [lock],
  components: {
    tplDoc,
    saveAsTpl,
    dialogPrint,
    tplQuote,
    wordDialog
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
    doctype: {
      // 区分护理文书和病历书写的  1-住院 2-门诊 3-护理
      type: Number
    },
    authority: {
      type: Number
    },
    visitType: {
      type: Number
    },
    docItem: {
      type: Object
    },
    patientName: {
      type: String
    },
    pageType: {
      type: String
    },
    levelOneName: {
      type: String
    },
    patient: {
      type: Object
    }
  },
  data() {
    return {
      uuid: uuid(),
      // docItem: {},
      readonly: false,
      editorInfo: {},
      schemaId: this.docItem.formTemplateId,
      code: this.docItem.code,
      printVisible: false,
      saveTplVisible: false,
      drawer: false,
      form: {},
      rules: {},
      tpl: {},
      editorIsUpdated: false,
      wordVisible: false,
      tplType: 'hospital_normal',
      operateRecord: null,
      updateTime: null,
      lockKey: null,
      isSaving: false,
      lastUpdateTime: null,
      deleted: false
    }
  },
  computed: {
    saveDisabled() {
      let isLock = this.$ever.getClinicConfig().MEDICAL_RECORD_IS_LOCK === '1'
      return (
        this.docItem.type === 'bingli' &&
        ((isLock && !this.lockKey) || this.authority === 1)
      ) || this.isSaving
    },
    delDisabled() {
      if (this.docItem.type === 'tpl') {
        return true
      } else {
        return this.authority === 1
      }
    },
    dataId() {
      return this.docItem.type === 'bingli' ? this.docItem.id : ''
    },
    printable() {
      // 病历未发生变动
      if (this.docItem.type === 'bingli' && this.docItem.isUpdate === undefined || this.docItem.isUpdate === false) {
        return false
      } else {
        return true
      }
    },
    quoteable() {
      if (this.docItem.type === 'bingli') {
        return false
      } else {
        return true
      }
    },
    editable() {
      let originUrls = ['medicalArchive']
      if (this.$route.query.readonly === 'true' || originUrls.includes(this.$route.query.from)) {
        return false
      } else if (!this.readonly && this.authority === 2) {
        return true
      } else {
        return false
      }
    },
    submitable() {
      // 病历未发生变动
      if (this.docItem.type === 'bingli' && this.docItem.isUpdate === false) {
        return false
      } else {
        return true
      }
    },
    showSubmit() {
      // 如果已提交则不显示提交按钮1保存2提交
      if (this.docItem.status !== 2 && this.docItem.type !== 'tpl') {
        return true
      } else {
        return false
      }
    },
    isable() {
      if (this.docItem.type === 'tpl') {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    editorIsUpdated(val) {
      if (val && !this.lockKey) {
        this.$nextTick(_ => {
          setTimeout(_ => {
            this.applyLock()
          }, 800)
        })
      }
      this.$emit('editorIsUpdated', val, this.docItem)
    }
  },
  created() {
    let autoConfig = this.$ever.getClinicConfig().AUTO_SAVE_MEDICAL_RECORD
    let isAutoSave = autoConfig && autoConfig !== '0' && !isNaN(+autoConfig)
    if (isAutoSave) {
      let autoSaveTime = +autoConfig
      if (autoSaveTime < 10000) {
        autoSaveTime = 10000
      }
      this.contentUpdate = debounce(this.saveRecord, autoSaveTime)
    } else {
      this.contentUpdate = function() {}
    }
  },
  mounted() {
    if (this.docItem.designerId !== '2') return false
    this.$bus.$on('ref:append' + this.docItem.id, val => {
      if (this.docItem.designerId !== '2') return false
      commandLog({
        content: `引用信息到${this.docItem.title}`,
        opModuleOne: `${this.levelOneName}-${this.pageType}-${this.docItem.categoryName}`,
        opType: 'REF_INFO',
        patientId: this.patientId,
        visitNumber: this.visitNumber,
        patientName: this.patientName
      })
      if (this.docItem.code === 'YI_BAN_HU_LI_JI_LU_DAN') {
        this.$refs.tpldoc &&
          this.$refs.tpldoc.$refs.editor.insertSelectionCell(val)
      } else {
        val += `<p></p>`
        this.$refs.tpldoc && this.$refs.tpldoc.$refs.editor.insert(val, true)
      }
    })
    if (
      this.docItem &&
      this.docItem.recordType === 1 &&
      this.$route.meta &&
      this.$route.meta.prole === 1
    ) {
      this.readonly = false
      this.setEditable()
    } else if (
      this.docItem &&
      this.docItem.recordType === 3 &&
      this.$route.meta &&
      this.$route.meta.prole === 2
    ) {
      this.readonly = false
      this.setEditable()
    } else if (this.visitType === 1) {
      // 门诊病历
      this.readonly = false
    } else {
      this.readonly = true
    }

    this.$nextTick(() => {
      this.operateRecord = new MedicalRecord(this, this.docItem)
      // 获取文档编辑器的数据
      this.getDocData()
    })
  },
  methods: {
    setEditable() {
      if (this.$route.query.from === 'medicalRecall') {
        if (this.docItem.isRecall === 0) {
          this.readonly = true
        } else if (this.docItem.isRecall === 1) {
          this.readonly = false
        }
      }
    },
    getDocData(callback) {
      if (!this.dataId) return
      request(
        urlMap.medicalRecord.getInstance,
        {
          id: this.dataId
        },
        'get'
      ).then(async res => {
        if (res.head.errCode === 0) {
          let newUpdateTime = res.data.updateTime
          if (!this.updateTime) {
            this.updateTime = res.data.updateTime
          } else {
            if (new Date(this.updateTime) < new Date(newUpdateTime)) {
              this.updateTime = this.newUpdateTime
            }
          }
          callback && callback(this.updateTime)
        }
      })
    },
    addlockKey(key) {
      let localRecordTabs = JSON.parse(storage.getLocalStorage('recordTabs'))
      localRecordTabs.forEach(item => {
        if (item.id === this.docItem.id) {
          this.$set(item, 'lockKey', key)
          // item.lockKey = key
        }
      })
      storage.setLocalStorage('recordTabs', JSON.stringify(localRecordTabs))
    },
    applyLock() {
      // 触发更新时申请解锁
      if (this.editorIsUpdated && this.docItem.type === 'bingli') {
        this.applyMedicalLock(
          { id: this.docItem.id, updateTime: this.updateTime },
          res => {
            if (Number(res.code) === 0) {
              this.addlockKey(res.msg) // 添加加锁状态缓存到本地，方便切换路由解锁用
              this.lockKey = res.msg
            }
          },
          () => {
            this.editorIsUpdated = false // 向上传递状态更新小红点
            this.uuid = uuid() // 刷新编辑器
            // this.getDocData() // 获取病历数据
          }
        )
      }
    },
    docRendered() {
      if (this.docItem.scrollIndex > -1) {
        this.$refs.tpldoc.$refs.editor.scrollToBingCheng(
          this.docItem.scrollIndex
        )
      }
      // this.$refs.tpldoc.$refs.editor.setBingChengAuth(this.$store.state.currentUser.userId, this.$store.state.currentUser.bingChengAuth)
    },
    saveClinic() {
      let docObj = {
        id: this.docItem.type === 'tpl' ? null : this.docItem.id,
        text: this.$refs.tpldoc.getHtml(),
        visitType: this.visitType
      }
      let items = this.$refs.tpldoc.getInputFlatData()
      let params = {
        formTemplateId: this.docItem.formTemplateId,
        data: docObj,
        env: {
          visitId: this.visitId,
          patientId: this.patientId,
          dptId: this.dptId,
          items
        },
        code: this.docItem.code,
        templateScopeId:
          this.docItem.type === 'bingli'
            ? this.docItem.templateScopeId
            : this.docItem.id,
        formTemplateName: this.docItem.title
      }

      phrapi.createOrUpdate(params).then(res => {
        this.saveCallBack(false, res)
      })
    },
    async printMedicalProcess(settings) {
      const postdata = {
        code: this.docItem.code,
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
            if (
              index === 0 ||
              [
                'SHOU_CI_BING_CHENG_JI_LU_XIN',
                'SHOU_CI_BING_CHENG_JI_LU'
              ].includes(item.code)
            ) {
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
        this.$messageTips(
          this,
          'error',
          '打印数据有误，请联系管理员处理',
          '提示'
        )
      }
    },
    submitPrint(settings) {
      // 打印病例

      let content = this.$refs.tpldoc.getHtml()
      let pageSettings = this.$refs.tpldoc.$refs.editor.pageSettings
      let printConfig = Object.assign({}, settings)
      let doc = {
        dom: content,
        header: this.$refs.tpldoc.editorHeader,
        footer: this.$refs.tpldoc.editorFooter,
        track: this.$refs.tpldoc.$refs.editor.trackMode || false,
      }
      jcpPrintEditor(this, printConfig, pageSettings, [doc], () => {
        commandLog({
        // 需要加备注
          content: `打印${this.docItem.title}`,
          opModuleOne: `${this.levelOneName}-${this.pageType}-${this.docItem.categoryName}`,
          opType: 'PRINT',
          patientId: this.patientId,
          patientName: this.patientName,
          visitNumber: this.visitId
        })
      })
    },
    quoteInfo() {
      this.$refs.tpldoc &&
        this.$refs.tpldoc.$refs.editor.insert('引用的信息', true)
    },
    saveAsTpl() {
      this.saveTplVisible = true
      this.tplType = 'hospital_normal'
      // 另存为模版组件内部需要的参数
      this.editorInfo = {
        element: this.$refs.tpldoc.getResetHtml(),
        pageSettings: this.$refs.tpldoc.$refs.editor.pageSettings,
        formTemplateId: this.docItem.formTemplateId,
        designerId: '2',
        code: this.docItem.code,
        categoryName: this.docItem.categoryName,
        name: this.docItem.title
      }
    },
    saveAsEntry() {
      let selectionHtml = this.$refs.tpldoc.selectionHtml()
      if (selectionHtml === '') {
        this.$messageTips(
          this,
          'warning',
          '请选择需要另存为词条的内容',
          '提示'
        )
        return false
      }
      this.saveTplVisible = true
      this.tplType = 'hospital_entry'
      // 另存为词条组件内部需要的参数
      this.editorInfo = {
        element: selectionHtml,
        pageSettings: this.$refs.tpldoc.$refs.editor.pageSettings,
        formTemplateId: this.docItem.formTemplateId,
        designerId: '2',
        code: this.docItem.code,
        categoryName: this.docItem.categoryName,
        name: this.docItem.title
      }
    },
    saveAsTplSuccess() {
      this.saveTplVisible = false
      if (this.tplType === 'hospital_entry') {
        // 清空词条内容
        this.$refs.tpldoc.resetSelectionHtml()
      }
    },
    setQuoteTemplates() {
      let quoteTemplates =
        JSON.parse(storage.getLocalStorage('quoteTemplates')) || []
      if (quoteTemplates) {
        remove(quoteTemplates, formTemplateId => {
          return formTemplateId === this.docItem.formTemplateId
        })
        storage.setLocalStorage(
          'quoteTemplates',
          JSON.stringify(quoteTemplates)
        )
      }
    },
    async saveRecord1(isAuto) {
      // 测试改造中。。。。。。。。。。。
      // 自动保存状态判断
      if (isAuto) this.$bus.$emit('medicalAutoSave', false)
      if (isAuto && this.authority === 1) return
      // 文档型获取结构化数据items
      let items = []
      let text = ''
      // let checked = true
      // if (this.docItem.status === 1) { // 1草稿2提交病历
      //   checked = false // 传true文档编辑器会进行校验
      // }
      // if (!this.$refs.tpldoc) return false
      // if (!this.$refs.tpldoc.$refs.editor) return false
      // let obj = this.$refs.tpldoc.$refs.editor.getSaveData(checked)
      // if (obj.success) {
      //   items = obj.data.items
      //   text = obj.data.text
      // } else {
      //   this.$messageTips(this, 'warning', '文本编辑器校验不通过', '提示')
      //   return false
      // }

      // 文档型
      let dataRequest = {
        id: this.docItem.id,
        formTemplateId: this.docItem.formTemplateId,
        templateScopeId: this.docItem.id,
        code: this.docItem.code,
        formTemplateName: this.docItem.title,
        designerId: '2',
        visitType: this.visitType,
        data: {
          text,
          items,
          dptId: this.dptId,
          visitId: this.visitId,
          patientId: this.patientId
        }
      }
      if (this.docItem.type === 'tpl') {
        // 类型为tpl,肯定是新建病历，bingli为已有病历保存
        delete dataRequest.id
      } else if (this.docItem.type === 'bingli') {
        dataRequest.templateScopeId = this.docItem.templateScopeId
      }
      // saveDraftInstance saveSubmitInstance
      if (this.docItem.status === 1) {
        // 暂存（草稿状态）
        this.operateRecord.add(
          urlMap.medicalRecord.saveDraftInstance,
          dataRequest,
          res => {
            this.saveCallBack(isAuto, res)
          }
        )
      } else {
        // 保存
        this.operateRecord.edit(
          urlMap.medicalRecord.saveSubmitInstance,
          dataRequest,
          res => {
            this.saveCallBack(isAuto, res)
          }
        )
      }
    },
    saveCallBack(isAuto, res) {
      // 测试改造中。。。。。。。。。。。
      let tipsText = isAuto ? '自动保存成功' : '保存成功'
      this.$messageTips(this, 'success', tipsText, '提示')
      this.editorIsUpdated = false
      request(urlMap.medicalRecord.getCategoryByCode, {
        code: res.code
      }).then(result => {
        let obj = Object.assign({}, this.docItem, {
          id: res.id,
          templateScopeId: res.templateScopeId,
          categoryId: result.data.id,
          categoryName: result.data.name,
          isUpdate: this.editorIsUpdated
        })
        this.setQuoteTemplates()
        this.$emit('saveSuccess', obj)
      })
    },
    initSaveState () {
      this.$bus.$emit('medicalAutoSave', false)
      this.isSaving = false
      return false
    },
    async saveRecord(isAuto) {
      // 正在删除的时候禁止保存
      if (this.deleted) return
      // 自动保存触发时如果为新建的病历则不执行自动保存
      if (isAuto && this.docItem.type === 'tpl') return
      const isLock = this.$ever.getClinicConfig().MEDICAL_RECORD_IS_LOCK === '1'
      if ((isLock && !this.lockKey) && this.docItem.type === 'bingli') return
      // 自动保存状态判断
      if (isAuto && this.authority === 1) return
      if (this.isSaving) return false
      this.isSaving = true
      let checked = true
      if (this.docItem.status === 1) {
        // 1草稿2提交病历
        checked = false // 传true文档编辑器会进行校验
      }
      if (!this.$refs.tpldoc) return false
      if (!this.$refs.tpldoc.$refs.editor) return false
      if (isAuto && this.lastUpdateTime && this.lastUpdateTime === this.$refs.tpldoc.lastUpdateTime) return this.initSaveState()

      let obj = this.$refs.tpldoc.$refs.editor.getSaveData(checked)
      if (obj.paginating) {
        this.isSaving = false
        if (!isAuto) this.$messageTips(this, 'warning', '请等待分页完成后再保存！', '提示')
        console.log('编辑器正在分页，无法保存！')
        return
      }
      if (!obj.success) {
        this.initSaveState()
        this.$messageTips(this, 'warning', '文本编辑器校验不通过', '提示')
        return false
      }
      let trackContent = obj.trackContent

      // 文档型
      let dataRequest = {
        lockKey: this.lockKey,
        id: this.docItem.id, // 病历id，编辑病历的时候需要
        formTemplateId: this.docItem.formTemplateId,
        templateScopeId: this.docItem.id, // 新建病历的时候，id就是templateScopeId
        code: this.docItem.code,
        formTemplateName: this.docItem.title,
        designerId: '2',
        visitType: this.visitType,
        data: {
          ...obj.data,
          header: this.$refs.tpldoc.$refs.editor.editorHeader,
          footer: this.$refs.tpldoc.$refs.editor.editorFooter,
          dptId: this.dptId,
          visitId: this.visitId,
          patientId: this.patientId
        }
      }

      if (
        this.docItem.rootCode === 'BING_CHENG_JI_LU' ||
        this.docItem.code === 'BING_CHENG_JI_LU'
      ) {
        let bingcheng = this.$refs.tpldoc.$refs.editor.getBingCheng()
        if (bingcheng) {
          dataRequest.data.anchor = JSON.stringify(bingcheng)
        }
      }
      if (this.docItem.type === 'tpl') {
        // 类型为tpl,肯定是新建病历，bingli为已有病历保存
        delete dataRequest.id
        // 为了标记痕迹归属 新建病历时前端生成病历id传值给后端
        dataRequest.newId = this.$refs.tpldoc.editorOpts.operator.medicalId
      } else if (this.docItem.type === 'bingli') {
        dataRequest.templateScopeId = this.docItem.templateScopeId
      }
      // saveDraftInstance saveSubmitInstance
      let res = {}
      if (this.docItem.status === 1) {
        // 暂存 草稿状态
        res = await request(
          urlMap.medicalRecord.saveDraftInstance,
          dataRequest
        )
      } else {
        // 保存 已提交状态
        res = await request(
          urlMap.medicalRecord.saveSubmitInstance,
          dataRequest
        )
      }
      // let categoryInfo = {}
      let tipsText = '保存成功'
      if (res.head && res.head.errCode === 0) {
        if (!isAuto) this.$messageTips(this, 'success', tipsText, '提示')
        this.editorIsUpdated = false
        request(urlMap.medicalRecord.getCategoryByCode, {
          code: res.data.code
        }).then(result => {
          if (result.head.errCode === 0) {
            let obj = Object.assign({}, this.docItem, {
              id: res.data.id,
              templateScopeId: res.data.templateScopeId,
              categoryId: result.data.id,
              categoryName: result.data.name,
              isUpdate: this.editorIsUpdated,
              trackContent
            })
            this.setQuoteTemplates()
            if (!isAuto) {
              // 非自动保存情况下申请解锁
              if (this.docItem.type === 'bingli') {
                this.applyMedicalUnLock({
                  id: res.data.id,
                  key: this.docItem.lockKey
                }, () => {
                  this.lockKey = null
                })
              }
            }
            this.getDocData()
            this.lastUpdateTime = this.$refs.tpldoc.lastUpdateTime
            setTimeout(() => {
              this.initSaveState()
            }, 1000)
            this.$emit('saveSuccess', obj, this.docItem.type)
          }
        })
      }
    },
    printRecord() {
      // this.printVisible = true
      this.submitPrint({})
    },
    previewRecord() {},
    handleDel() {
      this.deleted = true
      request(urlMap.medicalRecord.deleteInstance, {
        id: this.docItem.id,
        // lockKey: this.lockKey
      }).then(res => {
        if (res.head.errCode === 0) {
          if (res.data.code !== 0) {
            this.$confirm(res.data.msg, '提示', {
              showCancelButton: false,
              showClose: false,
              closeOnClickModal: false,
              type: 'warning'
            })
            this.deleted = false
          } else {
            this.lockKey = null
            this.$emit('deleteSuccess', this.docItem)
            this.$messageTips(this, 'success', '删除成功', '提示')
          }
        }
      })
    },
    delRecord() {
      // this.operateRecord.delete(urlMap.medicalRecord.deleteInstance)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDel()
      })
    },
    quoteMessage() {
      this.drawer = true
    },
    submitRecord() {
      if (this.docItem.type === 'tpl') {
        this.$messageTips(this, 'info', '未保存不能提交病历', '提示')
        return false
      }
      let obj = this.$refs.tpldoc.$refs.editor.getSaveData(true)
      if (obj.success) {
        request(urlMap.medicalRecord.submitInstance, {
          id: this.docItem.id,
          visitType: this.visitType
        }).then(res => {
          if (res.head.errCode === 0) {
            request(urlMap.medicalRecord.getCategoryByCode, {
              code: res.data.code
            }).then(result => {
              let obj = Object.assign({}, this.docItem, {
                id: res.data.id,
                templateScopeId: res.data.templateScopeId,
                categoryId: result.data.id,
                categoryName: result.data.name,
                isUpdate: this.editorIsUpdated
              })
              this.$messageTips(this, 'success', '提交成功', '提示')
              this.$emit('submitRecord', obj)
            })
          }
        })
      }
    },
    // 打开词条模板弹窗
    openWord() {
      this.wordVisible = true
    },
    // 保存词条模板
    insertWord(data) {
      this.$refs.tpldoc.$refs.editor.insert(data, true)
    },
    insertTpl(schemaId, newpage, title) {
      request(urlMap.medicalRecord.getDocTpl, {
        id: schemaId
      }).then(res => {
        let html = res.data.schema.element
        const ele = document.createElement('div')
        ele.innerHTML = html
        let header = ele.querySelector('.editor__header')
        if (header) {
          ele.removeChild(header)
        }
        let footer = ele.querySelector('.editor__footer')
        if (footer) {
          ele.removeChild(footer)
        }
        let inputNode = ele.firstChild.querySelector(
          '[column="JB_JI_LU_SHI_JIAN"] .inputcontent'
        )
        if (inputNode) {
          inputNode.innerText = this.$moment().format('YYYY-MM-DD HH:mm')
        }
        html = ele.innerHTML
        let editor = this.$refs.tpldoc.$refs.editor
        editor.addBingCheng(html, newpage, {
          creater: this.$store.state.currentUser.userId,
          auth: this.$store.state.currentUser.bingChengAuth,
          title
        })
        // editor.scrollToBingCheng(editor.getBingCheng().length - 1)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.editdoc {
  .icon {
    font-size: 14px;
    vertical-align: initial;
  }
  .el-dialog__wrapper {
    position: relative;
    top: initial;
    box-shadow: 0px -2px 4px rgba(0, 0, 0, 0.1);
    /deep/.el-drawer__container {
      height: 285px;
    }
  }
  .el-tabs__header {
    margin: 0;
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
  /deep/.editor {
    border: none;
  }
}
</style>
