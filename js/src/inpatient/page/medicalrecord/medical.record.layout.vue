<template>
  <div class="medical_record_layout flex_layout_full"
       v-if="authority!==0">
    <div class="main_wrap flex_col_1_hidden flex_layout_full">
      <div v-loading="loading" v-if="$route.query.tabId" style="width:100%;">
        <el-tabs v-if="isMounted"
                 class="flex_column_full_hidden tabs"
                 v-model="tabsValue"
                 type="card"
                 :closable="closable"
                 @tab-remove="removeTabItem">
          <el-tab-pane :lazy="true"
                       v-for="(item, tindex) in tabs"
                       :key="item.code===binganCode?tindex:item.id"
                       :label="item.title"
                       :name="item.id">
            <span slot="label">
              <el-badge :is-dot="item.isUpdate"
                        class="item">{{item.title}}</el-badge>
            </span>
            <!-- 病历书写组件 -->
            <edit-homepage v-if="item.code === binganCode"
                           class="flex_column_full_hidden"
                           :key="item.id"
                           :authority="authority"
                           :visitId="visitId"
                           :patientId="patientId"
                           :patient-name="patientName"
                           :dptId="dptId"
                           :curNode="item"
                           :visitType="visitType"
                           @editorIsUpdated="editorIsUpdated"
                           @getInstanceId="getInstanceId"
                           @saveSuccess="saveSuccess">
            </edit-homepage>
            <!-- 体温单录入 -->
            <temperature-input v-else-if="item.code==='TI_WEN_DAN'"
                               :authority="authority"
                               :visit-id="visitId"
                               :patient-id="patientId"
                               :patient-name="patientName"
                               :dpt-id="dptId"
                               :curNode="item"
                               @saveSuccess="saveSuccess"
                               @editorIsUpdated="editorIsUpdated">
            </temperature-input>
            <check-tiwen v-else-if="item.code === 'TI_WEN_JI_LU_DAN'"
                         class="flex_column_full_hidden"
                         :authority="authority"
                         :patient-name="patientName"
                         :patient-id="patientId"
                         :visit-id="visitId"></check-tiwen>
            <template v-else>
              <edit-form v-if="item.designerId === '1'"
                         class="flex_column_full_hidden"
                         :authority="authority"
                         :patientId="patientId"
                         :visitId="visitId"
                         :dptId="dptId"
                         :doc-item="item"
                         :visitType="visitType"
                         :space-name="spaceName"
                         @editorIsUpdated="editorIsUpdated"
                         @saveSuccess="saveSuccess"
                         @deleteSuccess="deleteSuccess"
                         @submitRecord="submitSuccess">
              </edit-form>
              <edit-doc v-if="item.designerId === '2'"
                        class="flex_column_full_hidden"
                        ref="editdoc"
                        :authority="authority"
                        :patient="patient"
                        :patientId="patientId"
                        :visitId="visitId"
                        :dptId="dptId"
                        :doc-item="item"
                        :doctype="item.recordType"
                        :visitType="visitType"
                        :patientName="patientName"
                        :page-type="pageType"
                        :level-one-name="levelOneName"
                        @editorIsUpdated="editorIsUpdated"
                        @saveSuccess="saveSuccess"
                        @deleteSuccess="deleteSuccess"
                        @submitRecord="submitSuccess">
              </edit-doc>
            </template>
            <!-- 信息查看组件 -->
            <template v-if="item.name">
              <check-list :check-type="item.name"
                          :visit-id="visitId"
                          :dept-id="dptId"
                          :patient-id="patientId"></check-list>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
      <everNoData tipTxt="请选择一个病历"
                  v-else></everNoData>
    </div>
    <div class="sidebar_wrap flex_column_full">
      <msg-tip v-if="showMsgTip"
               :key="uuid"
               :patient-id="patientId"
               :visit-id="visitId"
               @quoteTpl="quoteTpl"
               @menuSelect="menuSelect"></msg-tip>
      <div class="right_nav flex_col_1_auto">
        <record-menu ref="record_menu"
                     :visit-id="visitId"
                     :patient-id="patientId"
                     :patient-name="patientName"
                     :authority="authority"
                     :space-name="spaceName"
                     :visit-type="visitType">
          <template v-slot:tip>
            <sub class="twinkling"
                 v-if="hasNew"></sub>
          </template>
          <template v-slot:infoCheck>
            <div v-for="msg in messageCheckList"
                 :key="msg.name"
                 class="message_item"
                 @click="changeType(msg)">
              <svg class="icon"
                   aria-hidden="true">
                <use :xlink:href="msg.icon"></use>
              </svg>
              {{msg.name}}
              <sub class="twinkling"
                   v-if="msg.hasNew"></sub>
            </div>
          </template>
        </record-menu>
      </div>
    </div>
    <!--引用模版-->
    <dialog-quote-tpl :root-code="rootCode"
                      :dptId="dptId"
                      :code="code"
                      :visible.sync="quoteTplVisible"
                      @quoteTpl="quoteSuccess">
    </dialog-quote-tpl>
  </div>
  <everNoData tipTxt="您不具有操作此患者病历的权限"
              v-else></everNoData>
</template>
<script>
import headUrlMap from '@/manages/page/commonhead/urls'
import urlMap from '@/inpatient/urls'
import { request } from '@/util/req'
import checkTiwen from '@/inpatient/page/medicalrecord/check.tiwen'
import medicalList from '@/inpatient/page/medicalrecord/medical.list'
import msgTip from '@/inpatient/page/medicalrecord/msgtip'
import dialogQuoteTpl from '@/inpatient/page/medicalrecord/dialog.quote.tpl'
import editForm from '@/inpatient/page/medicalrecord/editform'
import editDoc from '@/inpatient/page/medicalrecord/editdoc'
import editHomepage from '@/inpatient/page/medicalrecord/edithomepage'
import temperatureInput from '@/emr/components/temperature.input'
import api from '@/workspace/store/diagnosisapi'
import { uniqBy, remove, uniq } from 'lodash'
import storage from '@/util/storage'
import uuidv4 from 'uuid/v4'
import checkList from '@/inpatient/page/medicalrecord/checklist'
import recordMenu from '@/inpatient/page/medicalrecord/medical.record.menu'
import { messageCheckList, getNode, getInitCurNode, getActiveTab, createTabItem } from '@/emr/config/medical.record.config.js'// courseCodeOfDisease
import updateTabItem from './mixins/update.tab.item.js'
import lock from './mixins/lock.js'
import url from '@/manages/page/organization/utils/urls'
import { commandLog } from '@/phr/mixin/operationLog.js'
export default {
  components: {
    recordMenu,
    checkList,
    checkTiwen,
    medicalList,
    dialogQuoteTpl,
    msgTip,
    editForm,
    editDoc,
    editHomepage,
    temperatureInput
  },
  mixins: [updateTabItem, lock],
  props: {
    patientName: {
      type: String
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
    baseroute: {
      type: String
    },
    spaceName: {
      type: String
    },
    visitType: {
      type: Number
    }
  },
  data () {
    return {
      pageType: '病历书写',
      rootCode: '',
      role: Number(this.$route.matched[0].meta.role), // 1医生，2护士
      uuid: uuidv4(),
      code: '',
      loading: true,
      isMounted: false, // 控制主要组件加载时机
      authority: null, // 获取权限0:没有读写权限;1有查看病历权限；2有修改病历权限
      closable: true, // 控制tab页的关闭按钮是否可以显示
      binganCode: 'ZHU_YUAN_BING_AN_SHOU_YE',
      quoteTplVisible: false,
      recordList: [], // 病历书写列表
      unSaveIds: [], // 编辑未保存的id集合
      curTpl: {}, // 点击+获取到当前点击的节点对象
      tabsValue: '',
      tabs: JSON.parse(storage.getLocalStorage('recordTabs')) || [],
      curNode: {},
      activeNames: ['3'],
      messageCheckList,
      formTemplateId: '',
      quoteTemplates: [],
      // baseroute: this.$route.meta.secActiveIndex,
      res: {},
      isAutoSaveStatus: false,
      hasNew: false,
      timer: '',
      clientId: '',
      tabsValueChange: false,
      patient: {}
    }
  },
  computed: {
    levelOneName () {
      const doctors = ['resident', 'anesthetist']
      const nurses = ['inpatient', 'nurse']
      if (doctors.includes(this.spaceName)) return '电子病历'
      if (nurses.includes(this.spaceName)) return '护理文书'
      return '未知的一级菜单'
    },
    showMsgTip () {
      let origin = this.$route.query.from

      return this.role === 1 && !['medicalReview', 'medicalRecall', 'medicalBorrow', 'medicalArchive'].includes(origin) && this.spaceName === 'resident'
    }
  },
  watch: {
    tabsValue (val, oldVal) {
      // 解决新建时因为触发自动保存 无法显示tab对应内容问题
      this.tabsValueChange = true
      this.$nextTick(_ => {
        setTimeout(() => {
          this.tabsValueChange = false
        }, 500)
      })
      this.setCurrentNode(val)
      this.handleRoute(val)
    },
    tabs: {
      handler (val) {
        if (this.tabs.length === 0) {
          this.initTabs()
        } else if (this.tabs.length === 1 && (this.tabs[0].code === this.binganCode || this.tabs[0].id === 'tiwen')) {
          this.closable = false
        } else {
          this.closable = true
        }
      },
      deep: true
    }
  },
  created () {
    commandLog({
      content: `登录${this.levelOneName}`,
      opModuleOne: `${this.levelOneName}`,
      opType: 'LOGIN',
      visitNumber: this.visitId,
      patientId: this.patientId,
      patientName: this.patientName
    })
    let localRecordTabs = JSON.parse(storage.getLocalStorage('recordTabs'))
    if (this.visitType === 1 && !localRecordTabs) return false
    this.init()
    // this.getAuth()
  },
  beforeDestroy () {
    this.$bus.$off('medicalLoading')
    if (this.$route.query.tabId) {
      delete this.$route.query.tabId
    }
    clearTimeout(this.timer)
  },
  methods: {
    async getAuth () {
      const userId = this.$store.state.currentUser.userId
      let res = await request(url.staff.getStaffListByIdList, { idList: [userId] })
      if (res.head.errCode === 0) {
        let code = res.data[0].skillsTitle2Code
        let auth = await request('thc-platform-core/valueSetItem/getValueSetItemByCode', {
          'setCode': 'thc_wh_ryzc2',
          'codes': [code]
        })
        if (auth.data.length) {
          this.$store.state.currentUser.bingChengAuth = Number(auth.data[0].attr1)
        }
      }
    },
    async init () {
      storage.setLocalStorage('quoteTemplates', JSON.stringify(this.quoteTemplates))
      this.$bus.$on('medicalLoading', (loading) => {
        this.loading = loading
      })
      await this.searchCUnionPatientInfo()
      this.$bus.$off('medicalAutoSave')
      this.$bus.$on('medicalAutoSave', (status) => {
        this.isAutoSaveStatus = status
      })
      if (!this.$route.query.tabId) {
        this.initTabs()
      } else {
        this.setActiveTab(this.$route.query.tabId)
        this.tabs.forEach(item => {
          if (item.type === 'tpl') {
            this.quoteTemplates.push(item.formTemplateId)
            storage.setLocalStorage('quoteTemplates', JSON.stringify(this.quoteTemplates))
            this.$set(item, 'isUpdate', true)
          } else {
            this.$set(item, 'isUpdate', false)
            // if (item.lockStatus) {
            //   item.lockStatus = null
            // }
          }
        })
        storage.setLocalStorage('recordTabs', JSON.stringify(this.tabs))
        this.setCurrentNode(this.tabsValue)
        // this.getAuthority()
      }
      this.getAuthority()
      this.$nextTick(_ => {
        setTimeout(() => {
          this.isMounted = true
        }, 400)
        setTimeout(() => {
          this.loading = false
        }, 1000)
      })
      this.noticeMsg()
      // if (this.patientId && this.visitType !== 3) { // 住院的不初始化消息提醒
      //   this.noticeMsg()
      // }
    },
    // 检验检查消息轮询通知
    async noticeMsg () {
      let _this = this
      await this.noticeMsgReq('jc', 'noticeMsgGet')
      await this.noticeMsgReq('jy', 'noticeMsgGet')
      this.$bus.$emit('noticeMsg', this.hasNewObj)
      this.timer = setTimeout(() => {
        _this.noticeMsg()
      }, 10000)
    },
    async noticeMsgReq (diff, name) {
      let params = {
        clientId: this.clientId,
        patientId: this.patientId,
        visitId: this.visitId,
        scenesType: 3,
        msgType: diff === 'jy' ? 1 : 2,
        timeOut: 10000
      }
      let res = await api[name](params)
      if (res.head.errCode === 0) {
        this.clientId = res.data.clientId
        if (name === 'noticeMsgGet') {
          if (diff === 'jc') this.$set(this.messageCheckList[2], 'hasNew', res.data.hasNew)
          else this.$set(this.messageCheckList[1], 'hasNew', res.data.hasNew)
          if (this.messageCheckList[2].hasNew || this.messageCheckList[1].hasNew) this.hasNew = true
          else this.hasNew = false
        }
      }
    },
    beforeLeave () {
      if (this.tabsValueChange) {
        this.tabsValueChange = false
        return true
      }
      let state = !this.isAutoSaveStatus ? !0 : !1
      if (!state) this.$messageTips(this, 'warning', '请点击保存按钮后切换病历！')
      return state
    },
    handleRoute (id) {
      this.$router.replace({
        path: `${this.baseroute}/docs`,
        query: Object.assign({}, this.$route.query, { tabId: id })
      })
    },
    setCurrentNode (id) {
      this.curNode = this.tabs.filter(item => {
        return item.id === id
      })[0]
    },
    setActiveTab (id) {
      this.tabsValue = id
    },
    getInstanceId (id) { // 病案首页id
      // if (id) return false
      if (this.tabs.length === 0) return false
      if (id) {
        this.handleRoute(id)
        this.setActiveTab(id)
        this.updateTabItem('getInstance', id)
        this.setCurrentNode(id)
      }
      // this.getAuthority()
    },
    async getAuthority () { // 病历id
      // 手麻医生和护士
      if (this.spaceName === 'anesthetist' || this.spaceName === 'nurse') {
        this.authority = 2
        return false
      }
      if (this.$route.query.from === 'medicalBorrow') { // 病历借阅查看详情为只读
        this.authority = 1
        return false
      }
      if (this.$route.query.from === 'medicalRecall') { // 病历召回查看详情为编辑模式
        this.authority = 2
        return false
      }
      let res = await request(urlMap.medicalRecord.getAuthority, {
        type: this.$route.meta.sceneType,
        visitId: this.visitId,
        visitType: this.visitType
      })
      if (!res.data) {
        this.authority = 0
      }
      if (res.head.errCode === 0) {
        this.authority = res.data
      }
    },
    async initTabs () {
      this.curNode = getInitCurNode(this.role, this.spaceName)
      if (!this.curNode) return false // 手麻工作站没有设置默认打开的病历
      // this.getAuthority()
      this.tabs = []
      this.addTabItem(this.curNode)
      this.setActiveTab(this.curNode.id)
      this.handleRoute(this.curNode.id)
    },
    editorIsUpdated (val, docItem) {
      this.tabs = JSON.parse(storage.getLocalStorage('recordTabs')) || []
      this.updateTabItem('update', val, docItem)
    },
    quoteTpl (val) {
      // console.log('quoteTpl', val, this.$refs.editdoc.length)
      // if (this.isAutoSaveStatus) {
      //   return this.$messageTips(this, 'warning', '病历正在自动保存中，请稍后切换！')
      // }
      this.rootCode = val.rootCode
      this.code = val.code
      this.quoteTplVisible = true
    },
    deleteSuccess (docItem) {
      // 删除${docItem.title}病历
      // console.log(docItem)
      this.pageType = this.getPageType(docItem.recordType)
      commandLog({
        content: `删除${docItem.title}病历`,
        opModuleOne: `${this.levelOneName}-${this.pageType}-${docItem.categoryName}`,
        opType: 'DELETE',
        visitNumber: this.visitId,
        patientId: this.patientId,
        patientName: this.patientName
      })
      this.uuid = uuidv4()
      this.$refs.record_menu.updateTree()
      this.setTabRemove(docItem.id)
    },
    saveSuccess (obj, type) {
      this.pageType = this.getPageType(obj.recordType)
      commandLog({
        // 保存${obj.title}病历
        content: obj.trackContent ? `保存${obj.title}病历，${obj.trackContent}` : `保存${obj.title}病历`,
        opModuleOne: `${this.levelOneName}-${this.pageType}-${obj.categoryName}`,
        opType: 'SAVE',
        visitNumber: this.visitId,
        patientId: this.patientId,
        patientName: this.patientName
      })
      this.uuid = uuidv4()
      this.updateTabItem('save', obj)
      // if (obj.type === 'tpl') {
      //   this.updateTabItem('save', obj)
      // } else {
      //   this.updateTabItem('save', obj)
      // }
      if (obj.type === 'signentry') return // 体温单录入不需要下面的操作

      // 如果为新建病历则刷新侧边目录栏
      if (type === 'tpl') {
        this.setActiveTab(obj.id)
        this.handleRoute(obj.id)
        this.$refs.record_menu.updateTree()
      }
    },
    submitSuccess (obj) {
      // console.log(obj)
      // 提交${res.data.formTemplateName}病历
      this.pageType = this.getPageType(obj.recordType)
      commandLog({
        content: `提交${obj.title}病历`,
        opModuleOne: `${this.levelOneName}-${this.pageType}-${obj.categoryName}`,
        opType: 'SUBMIT',
        visitNumber: this.visitId,
        patientId: this.patientId,
        patientName: this.patientName
      })
      this.uuid = uuidv4()
      this.updateTabItem('submit')
      this.$refs.record_menu.updateTree()
    },
    quoteSuccess (obj) {
      // 引用成功
      this.pageType = this.getPageType(obj.recordType)
      commandLog({
        opModuleOne: `${this.levelOneName}-${this.pageType}-${obj.categoryName}`,
        content: `引用了${obj.formTemplateName}模版`,
        opType: 'REF_TEMPLATE',
        visitNumber: this.visitId,
        patientId: this.patientId,
        patientName: this.patientName
      })
      this.loading = false
      // if (!(courseCodeOfDisease().includes(obj.code))) { // 病程记录模版在未保存的情况下可以重复引用，所以不用管
      let localQuoteTemplates = storage.getLocalStorage('quoteTemplates')
      this.quoteTemplates = localQuoteTemplates ? JSON.parse(localQuoteTemplates) : []
      this.quoteTemplates.push(obj.formTemplateId)
      storage.setLocalStorage('quoteTemplates', JSON.stringify(uniq(this.quoteTemplates)))
      // }

      // console.log(obj, obj.anotherRecord, this.rootCode)
      // console.log(obj, 'obj')
      this.menuSelect(obj)
      // if (obj.anotherRecord !== 1 && this.activeDoc().rootCode === 'BING_CHENG_JI_LU' && obj.rootCode === 'BING_CHENG_JI_LU') {
      //   let docComp = this.activeDocEditor()
      //   // console.log(docComp, index)
      //   docComp.insertTpl(obj.formTemplateId, obj.anotherPage === 1, obj.title)
      // } else {
      //   this.menuSelect(obj)
      // }
    },
    activeDocIndex () {
      let docTabs = this.tabs.filter(v => v.designerId === '2')
      for (let i = 0; i < docTabs.length; i++) {
        if (docTabs[i].id === this.tabsValue) {
          return i
        }
      }
      return -1
    },
    activeDoc () {
      let docTabs = this.tabs.filter(v => v.designerId === '2')
      for (let i = 0; i < docTabs.length; i++) {
        if (docTabs[i].id === this.tabsValue) {
          return docTabs[i]
        }
      }
      return {}
    },
    activeDocEditor () {
      let index = this.activeDocIndex()
      let docTabs = this.tabs.filter(v => v.designerId === '2')
      let editors = this.$refs.editdoc.filter(comp => comp.docItem.id === docTabs[index].id)
      return editors.length ? editors[0] : null
    },
    getPageType (type) {
      let pageTypes = {
        1: '病历书写',
        2: '门诊病历',
        3: '护理文书'
      }
      return pageTypes[type] || ''
    },
    menuSelect (curNode) {
      // if (this.isAutoSaveStatus) {
      //   return this.$messageTips(this, 'warning', '病历正在自动保存中，请稍后切换！')
      // }
      // this.getAuthority()

      this.pageType = this.getPageType(curNode.recordType)
      if (curNode.type === 'bingli') {
        commandLog({
          content: `编辑${curNode.title}`,
          opModuleOne: `${this.levelOneName}-${this.pageType}-${curNode.categoryName}`,
          opType: 'CLICK_EDIT',
          visitNumber: this.visitId,
          patientId: this.patientId,
          patientName: this.patientName
        })
      }

      let obj = JSON.parse(JSON.stringify(curNode))
      this.addTabItem(obj)
      this.setActiveTab(obj.id)
      this.handleRoute(obj.id)
      if (curNode.scrollIndex > -1) {
        let activeDocEditor = this.activeDocEditor()
        // console.log('activeindex ', index)
        if (activeDocEditor) {
          activeDocEditor.$refs.tpldoc.$refs.editor.scrollToBingCheng(Number(curNode.scrollIndex))
        }
      }
    },
    handleHasNew (msg) {
      if (this.hasNew && msg.id === 'jiancha') this.noticeMsgReq('jc', 'noticeMsgReset')
      if (this.hasNew && msg.id === 'jianyan') this.noticeMsgReq('jy', 'noticeMsgReset')
      msg.hasNew = false
      if (!this.messageCheckList[1].hasNew && !this.messageCheckList[2].hasNew) this.hasNew = false
    },
    // 信息查看
    changeType (msg) {
      this.handleHasNew(msg)
      let item = createTabItem(msg)
      this.addTabItem(item)
      this.setActiveTab(msg.id)
      this.handleRoute(msg.id)
    },
    removeQuoteTemplate (curNode) { // 关闭tab，删除引用模版相对应的id
      this.quoteTemplates = JSON.parse(storage.getLocalStorage('quoteTemplates')) || []
      if (this.quoteTemplates) {
        remove(this.quoteTemplates, (formTemplateId) => {
          return formTemplateId === curNode.formTemplateId
        })
        storage.setLocalStorage('quoteTemplates', JSON.stringify(this.quoteTemplates))
      }
    },
    updateTabItem () {
      // type保存save，提交submit，更新update，删除delete，病历首页有实例getInstance
      let [type, arg1, arg2] = arguments
      this[`${type}UpdateTab`](arg1, arg2)// 通过mixins 引入updateTabItem，更新tabItem的不同策略
      storage.setLocalStorage('recordTabs', JSON.stringify(this.tabs))
    },
    addTabItem (item) {
      this.tabs = this.$route.query.tabId ? (JSON.parse(storage.getLocalStorage('recordTabs')) || []) : []
      this.tabs.push(item)
      this.tabs = uniqBy(this.tabs, 'id')
      storage.setLocalStorage('recordTabs', JSON.stringify(this.tabs))
    },
    // 删除tab
    removeTabItem (targetName) {
      this.tabs = JSON.parse(storage.getLocalStorage('recordTabs'))
      let removeNode = getNode(this.tabs, targetName)

      if (removeNode.id === targetName && removeNode.isUpdate) {
        // 表示删除的是当前展示的tab
        this.removeConfirm(removeNode, targetName)
      } else {
        if (removeNode.type === 'bingli' && !['TI_WEN_DAN', 'ZHU_YUAN_BING_AN_SHOU_YE'].includes(removeNode.code) && removeNode.lockKey) {
          this.applyMedicalUnLock({ id: removeNode.id, key: removeNode.lockKey }, () => {
            this.setTabRemove(targetName)
          })
        } else {
          this.setTabRemove(targetName)
        }
      }
    },
    removeConfirm (removeNode, targetName) { // 删除前确认
      let codes = ['TI_WEN_DAN', 'ZHU_YUAN_BING_AN_SHOU_YE']
      this.$confirm('当前病历未保存, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (removeNode.type === 'bingli' && !codes.includes(removeNode.code) && removeNode.lockKey) {
          this.applyMedicalUnLock({ id: removeNode.id, key: removeNode.lockKey }, () => {
            this.setTabRemove(targetName)
          })
        } else {
          this.setTabRemove(targetName)
        }
        if (removeNode.type === 'tpl') {
          this.removeQuoteTemplate(removeNode)
        }
      })
    },
    setTabRemove (targetName) {
      // 设置激活的tab
      let activeName = (this.tabsValue === targetName) ? getActiveTab(this.tabs, targetName) : this.tabsValue
      this.setActiveTab(activeName)
      this.updateTabItem('delete', targetName)
      // 处理路由变化
      this.tabsValue === targetName && this.handleRoute(activeName)
    },
    async searchCUnionPatientInfo () {
      // 显示身高，体重等曲线图时有用到 age sex birthday 等属性，需要从该接口中获取
      let orgId = storage.getStorageByClinic('CLINICID')
      const res = await request(headUrlMap.headInfo['thc-c-union'], {
        patientId: this.patientId,
        orgId,
      })
      // 根据 birthday 计算月龄
      // 根据 sex 映射为 数字
      // console.log(res.data, 'res.data')
      // console.log(this.$moment().diff(res.data.birthday, 'months'))
      let patient = res ? {
        age: this.$moment().diff(res.data.birthday, 'months'),
        ...res.data
      } : {}
      this.patient = patient
    },
  }
}
</script>
<style lang="scss" scoped>
@import "./medical.record.layout.scss";
</style>
