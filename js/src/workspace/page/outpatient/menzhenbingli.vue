<template>
  <div id="patientcase">
    <div class="flex_column_full_hidden">
      <div class="top_wrap">
        <h1 v-if="!showTitle" class="top_wrap_title">病历信息</h1>
        <el-select v-show="!nodata"
                   v-model="activeFormId"
                   filterable
                   placeholder="请选择"
                   @change="handleTabsClick"
                   ref="sele">
          <el-option v-for="item in bingliOptions"
                     :key="item.key"
                     :label="item.label"
                     :value="item.id"></el-option>
        </el-select>
        <add-record-btn @add="handleAddRecord"
                        v-if="!dis"
                        :obj-update="medicalUpdate" :is-auto-save="isAutoSaveStatus"></add-record-btn>
        <opration-log class="opration"
                      :id="String(formId)"
                      :title="title"
                      :schema-id="schemaId"
                      :need-store="medicalUpdate"
                      v-if="!buildKeyMap[formId]"></opration-log>
      </div>
      <el-row class="flex_layout_scroll"
              v-show="!nodata"
              v-loading="loading">
        <el-col :span="24"
                class="rightframe fixLabelWord"
                :class="{'flex_column_full_hidden': designerId === '2'}">
          <div class="kanzhen form"
               :class="{'flex_column_1_hidden': designerId === '2'}">
            <phrform v-if="designerId === '1'"
                     :auto-save="true"
                     :code="formDataId ? '' : tplCode"
                     :key="formId"
                     :visit-id="visitId"
                     :patient-id="patientId"
                     :dpt-id="dptId"
                     :data-id="dataId"
                     :data-model-id="copyDoc.formDataId"
                     v-model="form"
                     ref="form"
                     :nosubmit="true"
                     :schemaId.sync="schemaId"
                     :all-disabled="dis"
                     @contentUpdate="contentUpdate"
                     @focus="setFocus"
                     @finished="formFinished"></phrform>
            <phrdoc v-if="designerId === '2'"
                    class="edit_con_wrap flex_col_1_hidden"
                    :visit-id="visitId"
                    :patient-id="patientId"
                    :dpt-id="dptId"
                    :data-id="dataId"
                    :schema-id="copyDoc.formTemplateId"
                    :code="tplCode"
                    ref="phrdoc"
                    :editable="!dis"
                    :key="formId"
                    :doc-update.sync="docUpdateStatus"
                    @contentUpdate="contentUpdate"
                    @finished="formFinished"></phrdoc>
          </div>
          <save-as-tpl v-if="showtpl"
                       :editorInfo="editorInfo"
                       page-type="门诊病历"
                       :dptId="dptId"
                       :visible.sync="showtpl"
                       :tplType="tplType"
                       :visit-id="visitId"
                       :patient-id="patientId"
                       :patient-name="patientName"
                       :level-one-name="levelOneName"
                       @submit="saveTpl"></save-as-tpl>
        </el-col>
      </el-row>
      <ever-no-data tipTxt="暂无数据"
                    v-show="nodata"></ever-no-data>
      <div class="bottom_wrap"
           v-show="!nodata && !loading">
        <div class="case-footer">
          <el-button type="primary"
                     class="savebtn"
                     @click="savePatientCase()"
                     v-ever-click-once="disabled"
                     :disabled="disabled || dis"
                     v-if="!dis">{{$t('保存')}}</el-button>
          <el-button :disabled="canSaveTemplate"
                     class="savetempbtn"
                     @click="showTempPop">{{$t('保存模版')}}</el-button>
          <template v-if="designerId === '1'">
            <printbtn v-if="form.printCode"
                      :code="form.printCode"
                      :params="{visitId: form.visitId, visitNumber: form.visitId, patientId: form.patientId, id: form.id,patientName:patientName,title:title,categoryName:categoryName}"
                      :disabled="!form.id || dis"
                      :lang="printLang">{{$t('打印病历')}}</printbtn>
            <el-button @click="del"
                       :disabled="!form.id || dis">{{$t('删除病历')}}</el-button>
          </template>
          <template v-else-if="designerId === '2'">
            <el-button @click="saveAsEntry" :disabled="disabled || dis">{{$t('保存为词条')}}</el-button>
            <el-button @click="printDoc"
                       :disabled="!dataId || dataId === '-1' || dis">{{$t('打印病历')}}</el-button>
            <el-button @click="del"
                       :disabled="!dataId || dataId === '-1' || dis">{{$t('删除病历')}}</el-button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { debounce } from 'lodash'
import { deepObjectCompile } from '@/util/diff'
import {isJsonString, assignment} from '@/util/common'
import urlMap from '@/inpatient/urls'
import { request } from '@/util/req'
import phrapi from '@/form/store/phrapi'
import api from '@/workspace/store/medicalapi'
import {ZD_MEN_ZHEN_ZHEN_DUAN} from '@/emr/config/uniform.field.js'
import medicalRecordCommon from './medical.record.common'
import addtpl from '@/workspace/page/addtpl'
import saveAsTpl from '@/emr/components/dialog.save.as.tpl'
import printbtn from '@/print/components/printbtn'
import oprationLog from './oprationlog'
import addRecordBtn from './addrecordbtn'
import {diseaseParams} from '@/emr/config/medical.record.data.js'
import {commandLog} from '@/phr/mixin/operationLog.js'
// 1=门诊；2=急诊；3=住院；4=体检；5=互联网 visitType
// 判断obj1里面是否包含obj2的任意一项 有则返回true
function include (obj1, obj2) {
  for (let elem of obj2.values()) {
    if (obj1.includes(elem)) {
      return true
    }
  }
  return false
}
export default {
  name: 'menzhenbingli',
  components: {
    addtpl,
    oprationLog,
    addRecordBtn,
    printbtn,
    saveAsTpl
  },
  mixins: [medicalRecordCommon],
  props: ['userinfo', 'showTitle', 'dis'],
  data () {
    return {
      categoryName: '',
      levelOneName: '电子病历',
      editorInfo: {},
      nodata: false,
      buildKey: 0,
      buildKeyMap: [],
      copyDoc: {},
      nodeObj: {},
      schemaId: '',
      tplCode: '',
      api,
      form: {},
      focusField: '',
      showtpl: false,
      tplform: null,
      disabled: false,
      formObjUpdate: false,
      docUpdateStatus: false,
      isAutoSaveStatus: false,
      formOldObj: null,
      bingliOptions: [],
      title: '门诊首次病历',
      formId: '',
      designerId: '1',
      patientId: this.$route.query.patientId,
      patientName: this.$route.query.patientName,
      dptId: this.$route.query.dptId,
      formDataId: '',
      activeFormId: '',
      printLang: '',
      loading: false,
      templateScopeId: '',
      tplType: 'clinic_normal',
      hasInfected: false, // 判断有没有传染病
      docObj: {},   // 文档型病历数据，用于判断病历编辑状态还是新建状态
      formTplInfo: {}//  需要确定保存病历
    }
  },
  computed: {
    visitId () {
      return this.$route.query.visitId || this.$route.query.visitSn || this.$route.query.hospitalizedNumber
    },
    canSaveTemplate () {
      if (this.dis) return this.dis // 超过24小时不能进行保存模版操作
      if (this.designerId === '1') {
        if (this.formTplInfo.props) return !this.formTplInfo.props.isCanTemplate
      }
      return false
    },
    dataId () {
      return this.buildKeyMap[this.formId] ? '-1' : this.formId
    },
    medicalUpdate () {
      return this.formObjUpdate || this.docUpdateStatus
    }
  },
  watch: {
    designerId (val) {
      this.$router.replace({
        path: this.$route.path,
        query: { ...this.$route.query, designerId: this.designerId }
      })
      this.$bus.$emit('menzhenbingli:designerId', val)
      this.$emit('getDesignerId', val)
    },
    formObjUpdate (val) {
      this.$bus.$emit('workspace:todaypatient:changbingli', val)
      this.$bus.$emit('workspace:index:changbingli', val)
      // 通知病历更新状态
      this.$bus.$emit('medicalUpdateStatus', val)
    },
    activeFormId (val, old) {
      this.oldFormId = old
    },
    form: {
      handler (val) {
        if (Object.keys(val).length === 0) {
          return
        }
        this.checkChange && this.checkChange(val)
      },
      deep: true
    },
    schemaId (val) {
      if (val) {
        this.$emit('schemaId', val)
      }
    }
  },
  created () {
    commandLog({
      content: '登录门诊病历',
      opModuleOne: `${this.levelOneName}-门诊病历`,
      opType: 'LOGIN',
      visitNumber: this.visitId,
      patientId: this.patientId,
      patientName: this.patientName
    })
    this.init()
  },
  methods: {
    getInitDesignerId (callback) {
      phrapi.getTemplateByCode('men_zhen_bing_li', this.dptId, this.visitId, this.patientId).then(res => {
        this.designerId = res.designerId
        callback && callback(res)
        if (Number(this.designerId) === 2) {
          this.copyDoc = res
        }
      })
    },
    init () {
      // 通知保存
      this.notifySave()
      // ？
      this.notifyPrintLang()
      // 更新自动保存状态
      this.notifySaveStatus()
      // ?
      this.getAppoint()
      // 获取病历的下拉列表
      this.getInstanceList()
      // form 数据是否更新
      this.updateForm()
      // 将designer传给父级，由父级传给历史记录
      this.$emit('getDesignerId', this.designerId)
      // 诊断录入引入诊断到病历
      this.quoteDiseaseFromInput()
      // 定向引用 (场景：历史就诊记录)
      this.quoteByDirection()
      // 聚焦引用（场景：历史就诊记录，病历速录）
      this.quoteByFocus()
      this.$router.replace({
        path: this.$route.path,
        query: { ...this.$route.query, designerId: this.designerId }
      })
    },
    notifySaveStatus () {
      this.$bus.$off('medicalAutoSave')
      this.$bus.$on('medicalAutoSave', (status) => {
        this.isAutoSaveStatus = status
      })
    },
    notifyPrintLang () {
      this.$bus.$off('global:patientInfo')
      this.$bus.$on('global:patientInfo', patient => {
        if (patient && patient.language) {
          this.printLang = patient.language
        }
      })
    },
    notifySave () { // 通知病历保存
      this.$bus.$off('saveCase:update')
      this.$bus.$on('saveCase:update', val => {
        this.savePatientCase()
      })
    },
    getAppoint () {
      this.api.getAppoint(this.$route.query.visitSn).then(result => {
        this.appoint = result
        this.$emit('appoint', result)
      })
    },
    updateForm () {
      if (this.designerId === '1') {
        let fn = val => {
          if (val.createUpdate) {
            let valKeys = Object.keys(val)
            delete val.createUpdate
            if (valKeys && valKeys.length > 1) {
              this.formOldObj = JSON.parse(JSON.stringify(val))
            }
          } else {
            this.formObjUpdate = deepObjectCompile(val, this.formOldObj)
          }
        }
        this.checkChange = debounce(fn, 200)
      }
    },
    quoteByFocus () { // 聚焦引入数据元到病历
      const recordType = {
        '1': this.insertForm,
        '2': this.insertDoc
      }
      this.$bus.$off('ref:append')
      this.$bus.$on('ref:append', val => {
        this.handleCommandQuote('聚焦引用')
        recordType[this.designerId](val)
      })
    },
    quoteByDirection () { // 定向引入数据元到病历
      this.$bus.$off('quote')
      this.$bus.$on('quote', (val, isAdd) => {
        if (typeof Object.values(val)[0] === 'string') { // 是字符串的就说明具体引用内容
          this.handleCommandQuote(Object.values(val))
        } else {
          this.handleCommandQuote('数据对象')
        }

        // console.log('定向引用', val)
        let form1 = JSON.parse(JSON.stringify(this.form))
        let validKeys = Object.keys(form1).filter(k => {
          if (
          Object.keys(form1).includes(ZD_MEN_ZHEN_ZHEN_DUAN) &&
          form1[ZD_MEN_ZHEN_ZHEN_DUAN][0] &&
          form1[ZD_MEN_ZHEN_ZHEN_DUAN][0].diseaseName === ''
        ) {
            form1[ZD_MEN_ZHEN_ZHEN_DUAN].length = 0
          }
          return form1[k] !== '' && form1[k] !== null && form1[k].length !== 0
        })
        let preForm = validKeys.reduce((acc, curr) => {
          acc[curr] = form1[curr]
          return acc
        }, {})
        if (include(validKeys, Object.keys(val))) {
          if (val[ZD_MEN_ZHEN_ZHEN_DUAN] && val[ZD_MEN_ZHEN_ZHEN_DUAN].length && Array.isArray(val[ZD_MEN_ZHEN_ZHEN_DUAN])) {
            val[ZD_MEN_ZHEN_ZHEN_DUAN].map(item => {
              if (!item.value) {
                if (
                item.diseaseCode &&
                item.diseaseName.indexOf(item.diseaseCode) === -1
              ) {
                  item.value = `${item.diseaseName}（${item.diseaseCode}）`
                } else {
                  item.value = item.diseaseName
                }
              }
              return item
            })
          }
          if (!isAdd) {
            this.$confirm('此操作将替换现有内容, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(res => {
              Object.assign(preForm, val)
              Object.assign(this.form, preForm)
            })
          } else {
          // 追加
            for (let item in val) {
              if (typeof val[item] === 'string') {
                preForm[item] = `${preForm[item]}${val[item]}`
              } else if (typeof val[item] === 'object') {
                if (Array.isArray(val[item])) {
                  if (preForm[item] && Array.isArray(preForm[item])) {
                    preForm[item] = preForm[item].concat(val[item])
                  } else {
                    preForm[item] = val[item]
                  }
                } else {
                  if (val[item].input) {
                    preForm[item].input =
                    preForm[item].input + ' ' + val[item].input
                  } else {
                    preForm[item] = val[item]
                  }
                }
              }
            }
            Object.assign(this.form, preForm)
          }
        } else {
          Object.assign(preForm, val)
          Object.assign(this.form, preForm)
        }
      })
    },
    quoteDiseaseFromInput () { // 从诊断录入处引入诊断到文档
      this.$bus.$on('diagnostic_aid', (data) => {
        if (data && data.length > 0) {
          this.handleCommandQuote('来自诊断录入数据')
          let obj = {}
          obj[ZD_MEN_ZHEN_ZHEN_DUAN] = assignment(diseaseParams, data)
          this.$refs.phrdoc && this.$refs.phrdoc.$refs.editor.insert(obj)
        }
      })
    },
    insertForm (val) {
      // this.handleCommandQuote(val)
      if (this.form[this.focusField] === null) {
        this.form[this.focusField] = ''
      }
      this.form[this.focusField] =
          this.form[this.focusField] +
          val.replace(/<\/p>/g, ';\n').replace(/[<p>|<br>]/g, '')
    },
    handleCommandQuote (val) {
      commandLog({
        content: `引用信息到${this.title}`,
        opModuleOne: `电子病历-门诊病历-${this.categoryName}`,
        opType: 'REF_INFO',
        patientId: this.patientId,
        visitNumber: this.visitNumber,
        patientName: this.patientName
      })
    },
    insertDoc (val) {
      let isHTML = false
      let reg = /^</g
      if (typeof val === 'string' && reg.test(val)) {
        isHTML = true
      }
      this.$refs.phrdoc && this.$refs.phrdoc.$refs.editor.insert(val, isHTML)
    },
    loadingClose () {
      this.loading = false
    },
    getCategoryName (params, callback) {
      request(urlMap.medicalRecord.getCategoryByCode, {
        code: params.code
      }).then(res => {
        this.categoryName = res.data.name
        callback && callback(res.data.name)
      })
    },
    formFinished (info) {
      this.formTplInfo = info
      this.getCategoryName({code: this.tplCode})
      this.loadingClose()
      this.hasInfected = this.getInfectedArrOfDoc() || this.getInfectedArrOfForm()
    },
    del () { // 删除病历
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        phrapi.del(this.formId).then(_ => {
          this.$messageTips(this, 'success', '删除成功', '提示')
          this.getCategoryName({code: this.tplCode}, (categoryName) => {
            commandLog({
              content: `删除${this.title}病历`,
              opModuleOne: `电子病历-门诊病历-${categoryName}`,
              opType: 'DELETE',
              visitNumber: this.visitId,
              patientId: this.patientId,
              patientName: this.patientName
            })
          })

          this.formObjUpdate = false
          this.getInstanceList()
        })
      })
    },
    handleAddRecord (nodeObj) {
      let had
      this.nodeObj = JSON.parse(JSON.stringify(nodeObj))
      this.bingliOptions.forEach(item => {
        if (item.res.id === this.nodeObj.id) {
          this.$messageTips(this, 'success', '不可重复添加!', '提示')
          had = true
        }
      })
      if (had) {
        return
      }
      phrapi
        .addRecordValid({
          visitId: this.visitId,
          code: this.nodeObj.code
        })
        .then(async res => {
          this.buildKeyMap[this.buildKey] = true
          await this.getCategoryName({code: this.nodeObj.code}, (categoryName) => {
            commandLog({
              content: `引用${this.nodeObj.name}模版`,
              opModuleOne: `电子病历-门诊病历-${categoryName}`,
              opType: 'REF_TEMPLATE',
              visitNumber: this.visitId,
              patientId: this.patientId,
              patientName: this.patientName
            })
          })

          const item = {
            code: this.nodeObj.code,
            label: this.nodeObj.name,
            designerId: this.nodeObj.designerId,
            formDataId: this.nodeObj.formDataId,
            res: JSON.parse(JSON.stringify(this.nodeObj)),
            id: this.buildKey
          }
          this.buildKey++
          this.bingliOptions.push(item)
          this.designerId = this.nodeObj.designerId // 1 表单 2文档
          if (Number(this.designerId) === 2) {
            this.copyDoc = JSON.parse(JSON.stringify(this.nodeObj))
          }
          this.tabsAvtiveHandle(item, true)
        })
    },
    getInstanceList () {
      let params = {
        visitId: this.visitId,
        type: '2',
        role: this.$route.matched[0].meta.role,
        order: 'desc',
        dptId: this.dptId
      }
      api.getInstanceList(params).then(async (res) => {
        if (res.data && res.data.length) {
          this.bingliOptions = []
          res.data.map(item => {
            let objparams = ['code', 'id', 'designerId', 'templateScopeId']
            // 参数相同直接赋值操作
            const obj = assignment(objparams, item)
            obj.label = item.formTemplateName
            obj.res = item
            this.bingliOptions.push(obj)
          })
          const id = this.bingliOptions[0].id
          this.activeFormId = id
          this.handleTabsClick(id)
        } else {
          this.getInitDesignerId((res) => {
            this.buildKeyMap[this.buildKey] = true
            this.activeFormId = this.buildKey
            this.bingliOptions = [
              {
                code: 'men_zhen_bing_li',
                label: `${res.name}`,
                id: this.buildKey,
                designerId: res.designerId,
                res: res
              }
            ]
            this.buildKey++
            if (this.dis) { // 对应历史患者超过24小时后，没保存病历的情况显示无病历
              this.nodata = true
            }
            this.handleTabsClick(this.bingliOptions[0].id)
          })
        }
      })
    },
    stopLeaveMedical () {
      this.$messageTips(this, 'warning', '病历正在自动保存中，请稍后切换！')
      this.$nextTick(_ => {
        setTimeout(() => {
          this.formId = this.oldFormId
          this.activeFormId = this.oldFormId
          this.$refs.sele.blur()
        }, 400)
      })
      this.loading = false
      return false
    },
    handleConmandEdit (row) {
      this.getCategoryName({code: row.code}, (categoryName) => {
        commandLog({
          content: `编辑${row.label}`,
          opModuleOne: `电子病历-门诊病历-${categoryName}`,
          opType: 'CLICK_EDIT',
          visitNumber: this.visitId,
          patientId: this.patientId,
          patientName: this.patientName
        })
      })
    },
    handleTabsClick (id) {
      this.loading = true
      let tab
      for (let i = 0; i < this.bingliOptions.length; i++) {
        const item = this.bingliOptions[i]
        if (item.id === id) {
          tab = item
          break
        }
      }
      if (tab && tab.code) {
        // 如果自动保存被触发 则不让切换病历
        if (this.isAutoSaveStatus && (this.formObjUpdate || this.docUpdateStatus)) {
          return this.stopLeaveMedical()
        }
        if (this.formObjUpdate || this.docUpdateStatus) {
          this.$confirm('有未保存数据，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.handleConmandEdit(tab)
              this.tabsAvtiveHandle(tab)
              this.$refs.sele.blur()
            })
            .catch(() => {
              this.formId = this.oldFormId
              this.activeFormId = this.oldFormId
              this.$refs.sele.blur()
              this.loading = false
              return false
            })
        } else {
          this.handleConmandEdit(tab)
          this.tabsAvtiveHandle(tab)
        }
      }
    },
    tabsAvtiveHandle (tab, isCreate = false) {
      // 新建的时候为true
      let flag = isCreate || false
      if (typeof tab.id === 'number') { // 抢救措施，新建的病历id为数字，已有病历都是字符串
        flag = true
      }

      if (flag) {
        this.activeFormId = tab.id
      }
      this.title = tab.label
      this.designerId = tab.designerId
      this.formDataId = tab.res.id
      this.formId = tab.id
      this.copyDoc = tab.res
      this.schemaId = tab.res.formTemplateId
      this.tplCode = tab.code
      this.templateScopeId = flag ? tab.res.id : tab.res.templateScopeId
      this.formOldObj = null
      this.$bus.$emit('MEN_ZHEN_BING_LI_MU_BAN', tab.code, Math.random())
    },
    saveTpl () { // 保存模版成功回调
      this.showtpl = false
      this.$bus.$emit('MEN_ZHEN_BING_LI_MU_BAN', this.tplCode, Math.random())
    },
    setFocus (name, obj) { // 表单聚焦
      this.focusField = name
    },
    saveAsEntry () { // 保存词条需要传入弹框的参数
      let selectionHtml = this.$refs.phrdoc.selectionHtml()
      if (selectionHtml === '') {
        this.$messageTips(this, 'warning', '请选择需要另存为词条的内容', '提示')
        return false
      }
      this.tplType = 'hospital_entry'
      this.showtpl = true
      // 另存为词条组件内部需要的参数
      this.editorInfo = {
        element: selectionHtml,
        pageSettings: this.$refs.phrdoc.$refs.editor.pageSettings,
        formTemplateId: this.schemaId,
        designerId: '2',
        code: this.tplCode,
        name: this.title,
        categoryName: this.categoryName
      }
    },
    showTempPop () { // 保存模版需要传入弹框的参数
      this.showtpl = true
      this.tplType = 'clinic_normal'
      this.editorInfo.formTemplateId = this.schemaId
      this.editorInfo.code = this.tplCode
      this.editorInfo.name = this.title
      this.editorInfo.categoryName = this.categoryName
      if (this.designerId === '2') {
        this.editorInfo.designerId = '2'
        this.editorInfo.element = this.$refs.phrdoc.getResetHtml()
        this.editorInfo.pageSettings = this.$refs.phrdoc.pageSettings
      } else {
        this.editorInfo.designerId = '1'
        this.editorInfo.content = JSON.parse(JSON.stringify(this.$refs.form.value))
        this.editorInfo.element = JSON.parse(JSON.stringify(this.$refs.form.schema))
        this.editorInfo.props = this.$refs.form.tpl.props
      }
    },
    saveFresh (result) {
      if (this.buildKeyMap[this.formId]) {
        // 新增后 切换时需要添加相应的id 修改label
        for (let i = 0; i < this.bingliOptions.length; i++) {
          const item = this.bingliOptions[i]
          if (item.id === this.formId) {
            item.id = result.id
            item.label = result.formTemplateName
            item.res = result
            item.designerId = result.designerId
            this.buildKeyMap[this.formId] = false
            this.formId = result.id
            this.activeFormId = result.id
            this.formObjUpdate = false
            this.schemaId = result.formTemplateId
            return
          }
        }
      }
      // 通知病历更新状态
      this.$bus.$emit('medicalUpdateStatus', false)
    },
    getMedicalId () { // 有id就是编辑状态，没有id就是新增状态
      if (Number(this.designerId) === 1) {
        return this.form.id
      }
      if (Number(this.designerId) === 2) {
        return this.docObj.id
      }
    },
    getInfectedArrOfForm () {
      if (Number(this.designerId) !== 1) return false
      let _hasInfected = false
      if (this.form && this.form[ZD_MEN_ZHEN_ZHEN_DUAN]) {
        _hasInfected = this.form[ZD_MEN_ZHEN_ZHEN_DUAN].some(val => {
          return this.getInfectedArr(val.groupList).length > 0
        })
      }
      return _hasInfected
    },
    getInfectedArrOfDoc () {
      if (Number(this.designerId) !== 2) return false
      let _hasInfected = false
      if (!this.$refs.phrdoc) return false
      let items = this.$refs.phrdoc.getInputFlatData()
      if (items && items.length) {
        items.forEach(item => {
          if (item.type === 2 && item.text && (item.informationConfigCode === ZD_MEN_ZHEN_ZHEN_DUAN)) {
            let diagnose = item.text.data && isJsonString(item.text.data) ? JSON.parse(item.text.data) : []
            if (diagnose) {
              _hasInfected = diagnose.some(diagnoseItem => {
                return this.getInfectedArr(diagnoseItem.groupList).length > 0
              })
            }
          }
        })
      }
      return _hasInfected
    },
    getInfectedArr (arr) {
      if (!arr) return []
      if (!arr.length) return []
      return arr.filter(item => item.name === '传染病')
    },
    checkInfected () {
      // 如果id存在说明属于编辑状态，模版没有发生变化，return false
      if (this.hasInfected) return this.getInfectedArrOfForm() || this.getInfectedArrOfDoc()
      if (this.getInfectedArrOfForm() || this.getInfectedArrOfDoc()) {
        this.$bus.$emit('menzhen:crg')
      }
      return this.getInfectedArrOfForm() || this.getInfectedArrOfDoc()
    },
    saveLog (name) {
      this.getCategoryName({code: this.tplCode}, (categoryName) => {
        commandLog({
          content: `保存${name}病历`,
          opModuleOne: `电子病历-门诊病历-${categoryName}`,
          opType: 'SAVE',
          visitNumber: this.visitId,
          patientId: this.patientId,
          patientName: this.patientName
        })
      })
    },
    async savePhrForm (isAuto) {
      // 新建病历不执行自动保存
      if (isAuto && !this.formId) return
      if (!this.buildKeyMap[this.formId]) {
        this.form.id = this.formId
      } else {
        delete this.form.id
      }
      this.form.visitType = 1
      let params = {
        formTemplateId: this.schemaId,
        data: this.form,
        env: {
          visitId: this.visitId,
          patientId: this.patientId,
          dptId: this.dptId
        },
        code: this.tplCode,
        templateScopeId: this.templateScopeId
      }
      let result = await phrapi.createOrUpdate(params)
      if (this.form[ZD_MEN_ZHEN_ZHEN_DUAN]) {
        if (!isAuto) this.checkDiagnose(this.form[ZD_MEN_ZHEN_ZHEN_DUAN])
        this.hasInfected = this.checkInfected()
      }
      if (result.id) {
        this.form.id = result.id
        this.formObjUpdate = false
        this.formOldObj = JSON.parse(JSON.stringify(this.form))
        const message = this.formId ? '病历保存成功' : '病历新建成功'
        this.title = result.formTemplateName
        this.saveLog(result.formTemplateName)

        this.$notify({
          title: '',
          message: message,
          type: 'success'
        })
        this.$emit('saveSuccess')
        this.saveFresh(result)
      } else {
        this.$notify.error({
          title: 'error',
          message: '保存失败'
        })
      }
    },
    saveDoc (isAuto) {
      // 新建病历不执行自动保存
      if (isAuto && !this.formId) return
      if (!this.$refs.phrdoc) return
      this.docObj = {
        text: this.$refs.phrdoc.getHtml(),
        header: this.$refs.phrdoc.$refs.editor.editorHeader,
        footer: this.$refs.phrdoc.$refs.editor.editorFooter
      }
      const message = this.formId ? '病历保存成功' : '病历新建成功'
      if (!this.buildKeyMap[this.formId]) {
        this.docObj.id = this.formId
      }
      // 获取结构化数据
      let items = this.$refs.phrdoc.getInputFlatData()
      this.docObj.visitType = 1
      let params = {
        formTemplateId: this.copyDoc.formTemplateId,
        data: this.docObj,
        env: {
          visitId: this.visitId,
          patientId: this.patientId,
          dptId: this.dptId,
          items
        },
        code: this.tplCode,
        templateScopeId: this.templateScopeId
      }
      phrapi
        .createOrUpdate(params)
        .then(result => {
          if (!isAuto) {
            let isCheck = false
            let diagnose = []
            if (items && items.length) {
              items.forEach(item => {
                if (item.type === 2 && item.text && (item.informationConfigCode === ZD_MEN_ZHEN_ZHEN_DUAN)) {
                  // 有ZD_MEN_ZHEN_ZHEN_DUAN字段才校验 没有不走校验逻辑
                  isCheck = true
                  this.hasInfected = this.checkInfected()
                }
              })
            }
            if (isCheck) this.checkDiagnose(diagnose)
          }
          this.title = result.formTemplateName
          this.saveLog(result.formTemplateName)
          this.$messageTips(this, 'success', message, '提示')
          this.$emit('saveSuccess')
          this.docUpdateStatus = false
          this.saveFresh(result)
        })
    },
    async checkDiagnose (diagnose) {
      // CPOE检验病历诊断逻辑  甄国勋 张奇峰
      if (!diagnose) return
      let params = {
        visitNumber: this.visitId,
        visitType: 1,
        diagnose
      }
      let res = await api.checkDiagnose(params)
      if (res && res.data && res.data.tipMsg) {
        this.$messageTips(this, 'info', res.data.tipMsg, '提示', 5000)
      }
    },
    printDoc () {
      commandLog({// 需要加备注
        content: `打印${this.title}`,
        opModuleOne: `电子病历-门诊病历-${this.categoryName}`,
        opType: 'PRINT',
        patientId: this.patientId,
        patientName: this.patientName,
        visitNumber: this.visitId
      })
      this.$refs.phrdoc.print()
    }
  }
}
</script>
<style scoped lang='scss'>
#patientcase {
  .top_wrap{
    margin: 10px 0px 0px 10px;
    .top_wrap_title{
      padding-left: 0px;margin: 10px 0 10px;font-size: 14px;
    }
  }
  .empty {
    text-align: center;
  }
  .rightframe {
    background: #ffffff;
    padding: 20px 15px;
    &.flex_column_full_hidden {
      padding: 0;
      .kanzhen {
        padding: 0;
      }
      .edit_con_wrap {
        padding-top: 5px;
      }
    }
  }
  span.labeltext {
    color: #999;
    display: block;
  }
  .icon-delete {
    color: #1c7bef;
    font-size: 16px;
    cursor: pointer;
  }
  .kanzhen {
    position: relative;
    padding-bottom: 36px;
  }
  .case-footer {
    border-top: 1px solid #e6e6e6;
    padding: 10px 10px 10px 135px;
  }
  ._tabs {
    padding: 0 20px;
    /deep/ .el-tabs__header {
      margin-bottom: 0;
    }
    /deep/ .el-dialog__body {
      padding: 0px 15px;
    }
  }
  .opration {
    float: right;
    margin-right: 10px;
  }
}
</style>
