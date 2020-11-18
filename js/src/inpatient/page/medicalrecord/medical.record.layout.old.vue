<template>
  <div class="medical_record_layout flex_layout_full"
       v-if="authority!==0">
    <div class="main_wrap flex_col_1_hidden"
         v-loading="loading">
         <!-- {{tabs}} -->
         <!-- {{tabs[0].id}}-------{{tabs[0].isUpdate}}-----{{tabs[0].title}}<br/>
         {{tabs[1].id}}------{{tabs[1].isUpdate}}---{{tabs[1].title}} -->
      <el-tabs v-if="isMounted"
               class="flex_column_full_hidden tabs"
               v-model="tabsValue"
               type="card"
               :closable="closable"
               @tab-remove="removeTab"
               >
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
                         :authority="authority"
                         :visitId="visitId"
                         :patientId="patientId"
                         :dptId="dptId"
                         :curNode="item"
                         :visitType="visitType"
                         @editorIsUpdated="editorIsUpdated"
                         @getInstanceId="getInstanceId"
                         @saveSuccess="saveSuccess">
          </edit-homepage>
          <!-- 体温单录入 -->
          <temperature-input 
            v-else-if="item.code==='TI_WEN_DAN'"           
            :authority="authority"
            :visit-id="visitId"
            :patient-id="patientId"
            :dpt-id="dptId"
            :curNode="item"
            @saveSuccess="saveSuccess"
            @editorIsUpdated="editorIsUpdated">
          </temperature-input>
          <check-tiwen v-else-if="item.code === 'TI_WEN_JI_LU_DAN'"
                       class="flex_column_full_hidden"
                       :authority="authority"
                       :patient-id="patientId"
                       :visit-id="visitId"></check-tiwen>
          <template v-else>
            <!-- <edit-form v-if="item.designerId === '1'"
                       :readonly="!editable"
                       :patientId="patientId"
                       :visitId="visitId"
                       :dptId="dptId"
                       :curNode="curNode"
                       @editorIsUpdated="editorIsUpdated"
                       @update="update"
                       @saveSuccess="saveSuccess"
                       @deleteSuccess="deleteSuccess"
                       @submitRecord="submitSuccess">
            </edit-form> -->
            <edit-doc v-if="item.designerId === '2'"
                      class="flex_column_full_hidden"
                      :authority="authority"
                      :patientId="patientId"
                      :visitId="visitId"
                      :dptId="dptId"
                      :doc-item="item"
                      :doctype="item.recordType"
                      :visitType="visitType"
                      @editorIsUpdated="editorIsUpdated"
                      @update="update"
                      @saveSuccess="saveSuccess"
                      @deleteSuccess="deleteSuccess"
                      @submitRecord="submitSuccess">
            </edit-doc>
          </template>
          <!-- 信息查看组件 -->
          <template v-if="item.name">
            <check-list
              :check-type="item.name"
              :visit-id="visitId"
              :dept-id="dptId"
              :patient-id="patientId"
            ></check-list>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="sidebar_wrap flex_column_full">
      <msg-tip v-if="showMsgTip"
               :key="uuid"
               :patient-id="patientId"
               :visit-id="visitId"
               @quoteTpl="quoteTpl"
               @menuSelect="menuSelect"></msg-tip>
      <div class="right_nav flex_col_1_auto">
        <record-menu
          :visit-id="visitId"
        ></record-menu>
        <!-- <el-collapse v-model="activeNames">
          <el-collapse-item name="1"
                            class="flex_col_1_auto">
            <template slot="title">
              <svg class="icon"
                   aria-hidden="true">
                <use xlink:href="#icon-xinxichakan"></use>
              </svg><span class="title_text">信息查看<sub class="twinkling" v-if="hasNew"></sub></span>
            </template>
            <div v-for="msg in messageCheckList"
                 :key="msg.name"
                 class="message_item"
                 @click="changeType(msg)">
              <svg class="icon"
                   aria-hidden="true">
                <use :xlink:href="msg.icon"></use>
              </svg>
              {{msg.name}}
              <sub class="twinkling" v-if="msg.hasNew"></sub>
            </div>
          </el-collapse-item>
          <el-collapse-item name="2"
                            class="flex_col_1_auto">
            <template slot="title">
              <svg class="icon"
                   aria-hidden="true">
                <use xlink:href="#icon-huliwenshu"></use>
              </svg><span class="title_text">护理文书</span>
            </template>
            <medical-list :readonly="authority===1||readonly('nurse')"
                          :key="recordKey"
                          :menuList="nursingList"
                          @menuSelect="menuSelect"
                          @quoteTpl="quoteTpl"></medical-list>
          </el-collapse-item>
          <el-collapse-item name="3"
                            class="flex_col_1_auto">
            <template slot="title">
              <svg class="icon"
                   aria-hidden="true">
                <use xlink:href="#icon-binglishuxie"></use>
              </svg><span class="title_text">病历书写</span>
            </template>
            <medical-list :visitId="visitId"
                          :readonly="authority===1||readonly('doctor')"
                          :key="recordKey"
                          :menuList="recordList"
                          @menuSelect="menuSelect"
                          @quoteTpl="quoteTpl"></medical-list>
          </el-collapse-item>
        </el-collapse> -->
      </div>
    </div>
    <!--引用模版-->
    <dialog-quote-tpl :dptId="dptId"
                      :code="code"
                      :visible.sync="quoteTplVisible"
                      @quoteTpl="quoteSuccess">
    </dialog-quote-tpl>
  </div>
  <everNoData tipTxt="您不具有操作此患者病历的权限"
              v-else></everNoData>
</template>
<script>
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
let messageCheckList = [
  {
    id: 'yizhu',
    name: '医嘱信息',
    type: 'yizhu',
    icon: '#icon-linshiyizhu'
  },
  {
    id: 'jianyan',
    name: '检验信息',
    type: 'jianyan',
    icon: '#icon-jianyanwancheng'
  },
  {
    id: 'jiancha',
    name: '检查信息',
    type: 'jiancha',
    icon: '#icon-jianchawancheng1'
  },
  {
    id: 'history',
    name: '既往病历',
    type: 'history',
    icon: '#icon-jiwangbingli'
  }
]
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
    baseroute: {
      type: String
    }
  },
  data () {
    return {
      role: Number(this.$route.matched[0].meta.role), // 1医生，2护士
      uuid: uuidv4(),
      code: '',
      signInfo: {
        id: 'sign',
        title: '体征录入',
        name: 'sign',
        type: 'signentry'
      },
      loading: true,
      isMounted: false, // 控制主要组件加载时机
      authority: null, // 获取权限0:没有读写权限;1有查看病历权限；2有修改病历权限
      closable: true, // 控制tab页的关闭按钮是否可以显示
      binganCode: 'ZHU_YUAN_BING_AN_SHOU_YE',
      quoteTplVisible: false,
      recordList: [], // 病历书写列表
      nursingList: [], // 护理文书列表
      unSaveIds: [], // 编辑未保存的id集合
      curTpl: {}, // 点击+获取到当前点击的节点对象
      tabsValue: '',
      tabs: [],
      curNode: {},
      activeNames: ['3'],
      messageCheckList,
      formTemplateId: '',
      quoteTemplates: [],
      recordKey: uuidv4(),
      visitType: 3,
      // baseroute: this.$route.meta.secActiveIndex,
      res: {},
      isAutoSaveStatus: false,
      hasNew: false,
      timer: '',
      clientId: '',
      tabsValueChange: false
    }
  },
  computed: {
    showMsgTip () {
      let origin = this.$route.query.from
      return this.role === 1 && origin !== 'medicalReview'
    },
    readonly (type) {
      return (type) => {
        if (type === 'doctor') {
          return (this.$route.query.readonly === 'true') || (this.$route.meta && this.$route.meta.prole !== 1)
        } else if (type === 'nurse') {
          return (!this.$route.query.readonly === 'true') || this.$route.meta && this.$route.meta.prole !== 2
        }
      }
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
      this.ctrlRoute(val)
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
    storage.setLocalStorage('quoteTemplates', JSON.stringify(this.quoteTemplates))
    this.tabs = JSON.parse(storage.getLocalStorage('recordTabs')) || []
    // 区分医生和护士默认展开右侧病历树结构
    if (this.$route.meta && this.$route.meta.prole === 2) {
      this.activeNames = ['2']
    }
    this.$bus.$on('medicalLoading', (loading) => {
      this.loading = loading
    })
    this.$bus.$off('medicalAutoSave')
    this.$bus.$on('medicalAutoSave', (status) => {
      this.isAutoSaveStatus = status
    })
    this.getInstanceTree()
    this.getNursingTree()
    // 住院病案首页需要处理的逻辑
    if (!this.$route.query.tabId) {
      this.initTabs()
    } else {
      this.tabsValue = this.$route.query.tabId
      this.tabs.forEach(item => {
        if (item.type === 'tpl') {
          this.quoteTemplates.push(item.formTemplateId)
          storage.setLocalStorage('quoteTemplates', JSON.stringify(this.quoteTemplates))
          this.$set(item, 'isUpdate', true)
        } else {
          this.$set(item, 'isUpdate', false)
        }
      })
      this.curNode = this.tabs.filter(item => {
        return item.id === this.tabsValue
      })[0]
      this.getAuthority(this.curNode)
    }
    this.$nextTick(_ => {
      setTimeout(() => {
        this.isMounted = true
      }, 400)
      setTimeout(() => {
        this.loading = false
      }, 1000)
    })
    if (this.patientId) {
      this.noticeMsg()
    }
  },
  beforeDestroy () {
    this.$bus.$off('medicalLoading')
    if (this.$route.query.tabId) {
      delete this.$route.query.tabId
    }
    clearTimeout(this.timer)
  },
  methods: {
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
      return !this.isAutoSaveStatus ? !0 : !1
    },
    getInstanceId (id) {
      if (this.tabs.length === 0) return false
      if (id) {
        this.$router.replace({
          path: `${this.baseroute}/docs`,
          query: Object.assign({}, this.$route.query, { tabId: id })
        })
        this.tabsValue = id
        this.tabs.forEach(item => {
          if (item.code === this.binganCode) {
            this.$set(item, 'id', id)
          }
        })
        this.tabs = uniqBy(this.tabs, 'id')
        this.curNode = this.tabs.filter(item => {
          return item.id === id
        })[0]
        this.getAuthority(this.curNode)
        storage.setLocalStorage('recordTabs', JSON.stringify(this.tabs))
      } else {
        this.getAuthority(this.curNode)
      }
    },
    async getAuthority (curNode) { // 病历id
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
    updateTree () {
      if (this.$route.meta && this.$route.meta.prole === 1) {
        this.getInstanceTree()
      } else if (this.$route.meta && this.$route.meta.prole === 2) {
        this.getNursingTree()
      }
    },
    ctrlRoute (val) {
      this.curNode = this.tabs.filter(item => {
        return item.id === val
      })[0]

      this.$router.replace({
        path: `${this.baseroute}/docs`,
        query: Object.assign({}, this.$route.query, { tabId: val })
      })
    },
    async initTabs () {
      if (this.$route.meta && this.$route.meta.prole === 1) { // 医生
        this.curNode = {
          code: this.binganCode,
          type: 'bingli',
          id: this.binganCode + this.visitId,
          title: '病案首页',
          isUpdate: false,
          recordType: 1
        }
      } else if (this.$route.meta && this.$route.meta.prole === 2) { // 护士
        this.curNode = {
          code: 'TI_WEN_JI_LU_DAN',
          type: 'signcheck',
          id: 'TI_WEN_JI_LU_DAN',
          title: '体温单',
          isUpdate: false,
          recordType: 3
        }
        this.getAuthority(this.curNode)
      }
      this.tabs = []
      this.tabs.push(this.curNode)
      this.tabs = uniqBy(this.tabs, 'id')
      this.tabsValue = this.curNode.id
      this.$router.replace({
        path: `${this.baseroute}/docs`,
        query: Object.assign({}, this.$route.query, { tabId: this.curNode.id })
      })
      storage.setLocalStorage('recordTabs', JSON.stringify(this.tabs))
    },
    async getNursingTree () { // 护理文书需要的接口
      let res = await request(urlMap.medicalRecord.getInstanceTree, {
        type: '3', // 护理文书
        visitNumber: this.visitId
      })
      if (res && res.head && res.head.errCode === 0) {
        this.nursingList = res.data
        this.recordKey = uuidv4()
      }
    },
    async getInstanceTree () {
      // 电子病历实例树
      let res = await request(urlMap.medicalRecord.getInstanceTree, {
        type: '1', // 1-住院医生 2-门诊 3-护理
        visitNumber: this.visitId
      })
      if (res && res.head && res.head.errCode === 0) {
        this.recordList = res.data
        this.recordKey = uuidv4()
      }
    },
    editorIsUpdated (val, docItem) {
      let saveRecordId = (docItem && docItem.id) || this.tabsValue
      this.tabs.map(item => {
        if (item.id === saveRecordId && item.type !== 'tpl') {
          this.$set(item, 'isUpdate', val)
        }
      })
      storage.setLocalStorage('recordTabs', JSON.stringify(this.tabs))
    },
    quoteTpl (val) {
      // if (this.isAutoSaveStatus) {
      //   return this.$messageTips(this, 'warning', '病历正在自动保存中，请稍后切换！')
      // }
      this.code = val.code
      this.quoteTplVisible = true
    },
    deleteSuccess (id) {
      this.uuid = uuidv4()
      this.updateTree()
      this.setTabRemove(id)
    },
    saveSuccess (obj) {
      this.uuid = uuidv4()
      this.tabs.map(item => {
        // 新建病历
        if ((obj.type === 'tpl') && (obj.type === item.type) && (item.formTemplateId === obj.formTemplateId)) {
          this.$set(item, 'id', obj.id)
          this.$set(item, 'isUpdate', obj.isUpdate)
          this.$set(item, 'type', 'bingli')
          this.$set(item, 'templateScopeId', obj.templateScopeId)
          this.$set(item, 'categoryId', obj.categoryId)
          this.$set(item, 'categoryName', obj.categoryName)
        } else if (item.id === obj.id) {
          this.$set(item, 'isUpdate', obj.isUpdate)
        }
      })
      storage.setLocalStorage('recordTabs', JSON.stringify(this.tabs))
      this.tabsValue = this.curNode.id
      this.$router.push({
        path: `${this.baseroute}/docs`,
        query: Object.assign({}, this.$route.query, { tabId: this.curNode.id })
      })
      this.updateTree()
    },
    submitSuccess (val) {
      this.uuid = uuidv4()
      if (val) {
        this.tabs.forEach(item => {
          if (item.id === this.curNode.id) {
            this.$set(item, 'status', 2)
          }
        })
        storage.setLocalStorage('recordTabs', JSON.stringify(this.tabs))
        this.updateTree()
      }
    },
    quoteSuccess (obj) {
      this.quoteTemplates = JSON.parse(storage.getLocalStorage('quoteTemplates')) || []
      this.quoteTemplates.push(obj.formTemplateId)
      storage.setLocalStorage('quoteTemplates', JSON.stringify(uniq(this.quoteTemplates)))
      this.menuSelect(obj)
    },
    update (val) {
      // 通过id找到当前发生改变的节点
      let curNode = this.getNode(this.recordList, this.tabsValue)
      if (val) { // val为true表示保存了未提交
        this.unSaveIds.push(curNode)
      } else { // 为false需要移除该项
        remove(this.unSaveIds, (item) => {
          return item.id === curNode.id
        })
      }
      // 去重
      this.unSaveIds = uniqBy(this.unSaveIds, 'id')
      this.$set(curNode, 'isSave', val)
    },
    // 病历书写
    menuSelect (curNode) {
      // if (this.isAutoSaveStatus) {
      //   return this.$messageTips(this, 'warning', '病历正在自动保存中，请稍后切换！')
      // }
      this.getAuthority(curNode)
      let obj = JSON.parse(JSON.stringify(curNode))

      this.tabs.push(obj)
      // 去重
      this.tabs = uniqBy(this.tabs, 'id')
      this.tabsValue = obj.id

      storage.setLocalStorage('recordTabs', JSON.stringify(this.tabs))
      this.$router.replace({
        path: `${this.baseroute}/docs`,
        query: Object.assign({}, this.$route.query, { tabId: obj.id })
      })
    },
    // 信息查看
    changeType (msg) {
      if (this.hasNew && msg.id === 'jiancha') this.noticeMsgReq('jc', 'noticeMsgReset')
      if (this.hasNew && msg.id === 'jianyan') this.noticeMsgReq('jy', 'noticeMsgReset')
      msg.hasNew = false
      if (!this.messageCheckList[1].hasNew && !this.messageCheckList[2].hasNew) this.hasNew = false
      this.tabs.push({
        id: msg.id,
        title: msg.name,
        name: msg.type,
        content: '',
        type: 'checkMessage'
      })
      // 去重
      this.tabs = uniqBy(this.tabs, 'id')
      this.tabsValue = msg.id
      storage.setLocalStorage('recordTabs', JSON.stringify(this.tabs))
      this.$router.replace({
        path: `${this.baseroute}/docs`,
        query: Object.assign({}, this.$route.query, { tabId: msg.id })
      })
    },
    setQuoteTemplates (curNode) { // 关闭tab，删除引用模版相对应的id
      this.quoteTemplates = JSON.parse(storage.getLocalStorage('quoteTemplates')) || []
      if (this.quoteTemplates) {
        remove(this.quoteTemplates, (formTemplateId) => {
          return formTemplateId === curNode.formTemplateId
        })
        storage.setLocalStorage('quoteTemplates', JSON.stringify(this.quoteTemplates))
      }
    },
    // 删除tab
    removeTab (targetName) {
      let removeNode = this.getNode(this.tabs, targetName)
      if (removeNode.id === targetName && removeNode.isUpdate) {
        // 表示删除的是当前展示的tab
        this.$confirm('当前病历未保存, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.setTabRemove(targetName)
          if (removeNode.type === 'tpl') {
            this.setQuoteTemplates(removeNode)
          }
        })
      } else {
        this.setTabRemove(targetName)
      }
    },
    setTabRemove (targetName) {
      let tabs = this.tabs
      let activeName = this.tabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.id === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.id
            }
          }
        })
      }
      this.tabsValue = activeName
      this.tabs = tabs.filter(tab => tab.id !== targetName)
      storage.setLocalStorage('recordTabs', JSON.stringify(this.tabs))
      this.$router.replace({
        path: `${this.baseroute}/docs`,
        query: Object.assign({}, this.$route.query, { tabId: activeName })
      })
    },
    getIsUpdate (val) {
      let curNode = this.tabs.filter(item => {
        return item.id === val
      })[0]
      return curNode
    },
    getNode (arr, id) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
          return arr[i]
        }
        if (arr[i].children) {
          var n = this.getNode(arr[i].children, id)
          if (n) {
            return n
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import './medical.record.layout.scss'
</style>
