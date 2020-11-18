<template>
  <div class="template_manage flex_column_full_hidden">
    <div class="sidebar_box flex_column_full_hidden row">
      <div class="left_menu">
        <div v-for="item in menuList"
             :key="item.businessType"
             class="left_menu_item"
             :class="{'active':item.isActive}"
             @click="handleTab(item)">
          <div>{{item.name}}</div>
        </div>
      </div>
      <div class="right_menu flex_column_1_hidden">
        <div class="top_bar search">
          <el-input placeholder="请输入搜索内容"
                    suffix-icon="el-icon-search"
                    clearable
                    size="small"
                    v-model="templateName">
          </el-input>
        </div>
        <div class="collapse_wrap">
          <ever-subject-select
            v-if="businessType===3"
            v-model="subjectList2"
            :params="params"
            type="select"
            placeholder="请选择一个科室">
          </ever-subject-select>
          <template-tree
            :editorIsUpdated="isUpdate"
            :showTpl.sync="showTpl"
            :collapse='templateList'
            :treeData="treeObj"
            :businessType="businessType"
          >
          </template-tree>
        </div>
      </div>
    </div>
    <div class="main_wrap">
      <div class="grid-content"
          v-if="showTpl"
          @keydown="keyDown">
        <evereditor
          v-if="editorObj.designerId==='2'"
          class="flex_column_full_hidden"
          :html="schema.element"
          :editable.sync="schema.editable"
          :page-settings.sync="schema.pageSettings"
          :options="getEditorOpts(workshop)"
          :key="docKey"
          ref="phrdoc"
          :is-updated.sync="editorIsUpdated">
          <template slot="toolbarPrevItem">
            <!-- 编辑器slot button -->
            <div
              v-for="item in eidtorCommands"
              :key="item.icom"
              class="col"
              @click="handleCommand(item)"
              :title="item.title">
              <label class="label">
                <span class="command_icon"><i class="iconfont" :class="item.icon"></i></span>
              </label>
            </div>
          </template>
        </evereditor>
        <form-schema
          v-else-if="editorObj.designerId==='1'"
          ref="formSchema"
          :breadHidden="true"
          :saveHidden="true"
          :templateId="editorObj.formTemplateId"
          :formDataId="editorObj.formDataId"
          :templateName="editorObj.name"
          :key="formKey"
          @fromTpl="getFromTpl"
          @formObj="getFormObj">
          <template slot="saveBtn">
            <el-button @click="saveTpl"
                       style="float:right">保存模版</el-button>
          </template>
        </form-schema>
        <div
          v-if="Number(businessType)===0&&$route.meta.workshopTag==='orgSetting'"
          class="layer"></div>
      </div>
      <everNoData tipTxt="请选择一个模版"
                  v-else></everNoData>
    </div>
    <!-- 模板新建和编辑 -->
    <tpl-operation
      :operation.sync="operationCommand"
      :workshop='workshop'
      :checkParams="tplObj"
      :api="urlMap"
      @add="addTpl"
      @edit="updateTpl"
      @close="close"
    ></tpl-operation>
    <!--词条模板引用-->
    <word-dialog
      :visible.sync="wordVisible"
      :showRadio="true"
      @save="insertWord"
    ></word-dialog>
  </div>
</template>
<script>
import { request } from '@/util/req'
import evereditor from 'evereditor'
import eidtorCommands from '@/emr/config/editor.command'
import {getMenuList, getTemplateList, getDialogParams, getBaseRoute, resetEditorObj, getUrl, getEditorOpts} from '@/emr/config/template.config'
import { jcpPrintEditor, isJsonString, editorParams } from '@/util/common'
import api from '@/form/store/api'
import storage from '@/util/storage'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
import templateTree from '@/emr/page/templatemanage/collapse'
import tplOperation from '@/emr/page/templatemanage/dialog.template.operation'
import formSchema from '@/form/page/formschema'
import wordDialog from '@/inpatient/page/medicalrecord/word.dialog'
import { MEDICAL_FONT_INFO } from '@/form/util/anamnesistype'
import {RecordStrategy} from '@/emr/config/template.record.strategy.js'
import confirm from '@/util/confirm'
import update from '@/emr/mixins/update.js'
export default {
  name: 'templatemanage',
  mixins: [update],
  beforeRouteLeave (to, from, next) {
    if (this.isUpdate()) {
      confirm(this, {
        confirmCallBack: () => {
          this.noLeave()
          this.saveTpl()
        },
        cancelCallBack: () => {
          this.initUpDate()
          next()
        }
      })
    } else {
      this.initUpDate()
      next()
    }
  },
  data () {
    return {
      eidtorCommands,
      operationCommand: '',
      recordStrategy: null,
      docKey: U(),
      formKey: U(),
      urlMap: null,
      params: {
        staffIdList: [storage.getLocalStorage('USERID')]
      },
      subjectList2: {},
      workshop: this.$route.meta.workshopTag,
      command: '', // 控制编辑模版和新建模版
      templateName: '', // 模版名称
      treeData: {}, // 整个模版树
      tplObj: {}, // 新建或者编辑模版时需要传给弹框的参数
      editorObj: {}, // 保存模版时需要的相关参数
      deptIds: [], // id集合传给后台获取科室对应的模版树   ----这个参数没有用
      editorIsUpdated: false, // 判断模版是否有更新
      showTpl: false, // 控制显示文档编辑器
      editorParams,
      schema: JSON.parse(JSON.stringify(editorParams)),
      formTpl: {}, // 保存表单模版需要的一坨参数
      formUpdate: false,
      dptList: [], // 储存科室列表 ----这个参数没有用
      businessType: Number(this.$route.query.businessType) || 0, // 参考menuList,默认显示集团
      activeNames: [], // 收集展开的collapse，目前没用
      menuList: [],
      // 插入页眉页脚弹窗
      wordVisible: false,
      // 模板类型
      openNodeType: ''
    }
  },
  computed: {
    treeObj () {
      if (this.businessType === 3) {
        return this.treeData[this.subjectList2.id]
      } else {
        return this.treeData
      }
    }
  },
  created () {
    this.init()
    // this.testCode()
  },
  methods: {
    testCode () {
      console.log(this.templateChange, '修改前update')
      this.setChange(true)
      console.log(this.templateChange, '修改后update1')
      this.setAsyncChange(1)
      console.log(this.templateChange, '修改后update2')
    },
    getEditorOpts,
    getDesignerId () {
      return Number(this.editorObj.designerId)
    },
    handleRoute ({templateId, dataId, businessType, name}) {
      let routeConfig = {
        path: getBaseRoute(this.workshop),
        query: {
          name: name,
          templateId: templateId,
          dataId: dataId, // 表单模版会有dataId
          businessType: businessType
        }
      }
      this.$router.replace(routeConfig)
    },
    init () {
      this.setCommand('edit')
      // 还需要配置角色815需求//门诊，住院，护士工作站需要角色信息
      this.menuList = getMenuList(this.workshop)
      this.templateList = getTemplateList(this.workshop)
      this.urlMap = getUrl(this.workshop)
      // this.editorOpts = getEditorOpts(this.workshop)
      if (this.$route.query.templateId) {
        this.openTpl()
        this.editorObj = JSON.parse(storage.getLocalStorage('createOrUpdateTpl'))
        if (this.getDesignerId() === 2) {
          this.getTpl(this.editorObj.formTemplateId)
        }
      }
      // 初始化时路由的变化
      this.handleRoute({
        businessType: this.businessType,
        dataId: this.$route.query.formDataId,
        templateId: this.$route.query.templateId,
        name: this.$route.query.name
      })
      this.initBusinessTab()
      this.recordStrategy = new RecordStrategy(this)// 初始化病例保存策略
      window.addEventListener('beforeunload', this.onbeforeunloadhandler)
      window.addEventListener('unload', this.onbeforeunloadhandler)
      this.globalFontSettings(this.schema)
    },
    handleCommand (item) { // 文档专用
      // savsTpl,print,quote
      if (item.type === 'print-preview') {
        this[item.handle](true)
      }
      this[item.handle]()
    },
    noLeave () {
        // 阻止菜单的active变化
      this.$bus.$emit('nav:preventhirdtActiveChange', true)
    },
    initBusinessTab () {
      if (this.businessType !== 3) {
        this.renderTree(this.businessType)
      }
      this.setMenuActive(Number(this.businessType))
    },
    onbeforeunloadhandler (e) {
      if (this.isUpdate()) { // 有未保存的需要提示
        (e || window.event).returnValue = '有未保存的模版，是否放弃保存'
      }
    },
    keyDown (event) {
      let ev = event || window.event
      let isMac = window.navigator.userAgent.includes('Mac OS')
      let findKeypress = isMac ? (ev.keyCode === 83 && ev.metaKey) : (ev.keyCode === 83 && ev.ctrlKey)
      if (findKeypress) {
        this.saveTpl()
        ev.preventDefault()
      }
    },
    print (preview) { // 文档专用
      console.log(preview)
      let content = this.$refs.phrdoc.getHtml()
      let pageSettings = this.schema.pageSettings
      let printConfig = {}
      if (preview) printConfig.preview = true
      jcpPrintEditor(this, printConfig, pageSettings, [{ dom: content }])
    },
    storeEditorObj () {
      storage.setLocalStorage('createOrUpdateTpl', JSON.stringify(this.editorObj))
    },
    isUpdate () {
      if (this.command === 'create') {
        return true
      } else if (this.getDesignerId() === 1) {
        return this.formUpdate
      } else if (this.getDesignerId() === 2) {
        return this.editorIsUpdated
      }
    },
    initUpDate () {
      this.setCommand('edit')
      this.editorIsUpdated = false
      this.formUpdate = false
    },
    getFromTpl (val, isUpdate) { // 模版发生更新回调
      this.formTpl = val
      this.formUpdate = isUpdate
    },
    getFormObj (isUpdate) { // 数据发生更新
      this.formUpdate = isUpdate
    },
    // 获取所有的模版树，获取科室模版需要传dptIds,所有的时候需要传templateName
    getTemplateTree (deptIds, templateName) {
      request(this.urlMap.templateManage.getTemplateTree, {
        businessType: this.businessType,
        deptIds,
        templateName
      }).then(res => {
        this.treeData = res.data
      })
    },
    updateKey () {
      if (this.getDesignerId() === 1) {
        this.formKey = U()
      } else {
        this.docKey = U()
      }
    },
    // 更新模版,修改模版名称和属性
    updateTpl (obj) {
      console.log('编辑弹框', obj)
      // 编辑完成需要更新编辑器
      this.editorObj = resetEditorObj(obj)
      this.storeEditorObj()
      this.updateKey()
      this.saveTpl()
    },
    // 新建模版,
    addTpl (obj) {
      console.log('新建弹框', obj)
      // 刷新对应的编辑器
      this.editorObj = resetEditorObj(obj)
      this.updateKey()
      this.openTpl()
      this.storeEditorObj()
      if (obj.formTemplateId) { // 有formTemplatedId是复用模版所以需要加载出来被复用的模版
        this.getTpl(obj.formTemplateId)
      } else {
        this.schema.element = ''
        this.schema.templateId = ''
        let fontInfo = this.$ever.getClinicConfig().MEDICAL_FONT_INFO
        if (fontInfo && isJsonString(fontInfo)) {
          fontInfo = JSON.parse(fontInfo)
          MEDICAL_FONT_INFO.forEach(item => {
            this.schema.pageSettings[item] = fontInfo[item]
          })
        }
      }
      this.handleRoute({
        businessType: this.businessType
      })
    },
    // 关闭弹框
    close () {
      this.setCommand('edit')
    },
    // 保存模版
    saveTpl () {
      let callback = null
      let url = null
      if (this.command === 'create') {
        url = this.urlMap.templateManage.saveTpl
        callback = this.addCallback
      } else {
        url = this.urlMap.templateManage.updateTpl
        callback = this.editCallback
      }
      this.recordStrategy.initDesignerId(this.getDesignerId())
      .requestParams(this.editorObj)
      .save(this.command, url, callback)
    },
    // 删除操作
    remove (node) {
      let callback = () => {
        if (this.editorObj.id === node.id) {
          this.closeTpl()
        }
        this.renderTree(this.businessType)
        this.initUpDate()
        this.handleRoute({
          businessType: this.businessType
        })
      }
      let url = this.urlMap.templateManage.delTpl
      this.recordStrategy.initDesignerId(this.getDesignerId()).delete(url, node.id, callback)
    },
    addCallback (res) {
      this.editorObj.id = res.id
      this.editorObj.formTemplateId = res.formTemplateId
      this.editorObj.formDataId = res.formDataId
      this.formTpl.templateId = res.formTemplateId
      this.setCommand('edit')
      this.storeEditorObj()
      this.updateKey()
      if (this.getDesignerId() === 2) {
        this.getTpl(res.formTemplateId)
        this.editorIsUpdated = false// 这个效果待测试，之前是写到外面的
      }
      // this.editorIsUpdated = false
      this.renderTree(this.businessType)
      this.handleRoute({
        templateId: res.formTemplateId,
        dataId: res.formDataId,
        businessType: res.businessType,
        name: res.name
      })
    },
    editCallback (res) {
      // this.editorIsUpdated = false
      this.renderTree(this.businessType)
      this.editorObj.formDataId = res.formDataId
      this.handleRoute({
        templateId: res.formTemplateId,
        dataId: res.formDataId,
        businessType: res.businessType,
        name: res.name
      })
      this.updateKey()
      this.initUpDate()
      if (this.getDesignerId() === 2) { // 文档型有一些属性设置，所以需要重新加载
        this.getTpl(res.formTemplateId)
      }
    },
    // 编辑器设置global环境字体信息
    globalFontSettings (schema) { // 文档专用
      if (this.getDesignerId() === 1) return false
      let fontInfo = this.$ever.getClinicConfig().MEDICAL_FONT_INFO
      if (fontInfo && isJsonString(fontInfo)) {
        fontInfo = JSON.parse(fontInfo)
        MEDICAL_FONT_INFO.forEach(item => {
          if (!schema.pageSettings[item] && fontInfo[item]) {
            // this.isGlobal[item] = true
            schema.pageSettings[item] = fontInfo[item]
          }
        })
      }
      return schema
    },
    // 获取文档编辑器模版
    getTpl (formTemplateId) { // 文档专用
      api.getTpl(formTemplateId).then(result => {
        this.schema = result
        this.globalFontSettings(this.schema)
        this.schema.pageSettings = this.schema.pageSettings || JSON.parse(JSON.stringify(this.editorParams.pageSettings))
      })
    },
    setCommand (command) {
      this.command = command
      storage.setLocalStorage('tplCommand', command)
    },
    // 树形菜单右键的一系列操作
    addNode (node) { // 新建
      console.log('新建node', node)
      this.initUpDate()
      this.setCommand('create')
      if (Number(node.type) === 5) {
        this.operationCommand = 'addEntry'
      } else {
        this.operationCommand = 'addTpl'
      }
      this.tplObj = getDialogParams('create', node, this.businessType)
      console.log('新建', this.tplObj)
      this.openNodeType = node.type
    },
    // 刷新
    refresh () {
      this.renderTree(this.businessType)
    },
    // 右键编辑模版
    contextmenuEdit (node) { // 编辑模版名称和属性
      console.log(node, '右键')
      this.setCommand('edit')
      if (Number(node.type) === 5) { // 用于区分词条模版
        this.operationCommand = 'editEntry'
      } else {
        this.operationCommand = 'editTpl'
      }
      this.openTpl()
      this.schema.formTemplateId = node.formTemplateId
      if (node.isTemplate) {
        this.editorObj = resetEditorObj(node)
      } else {
        this.editorObj.designerId = node.designerId
        this.editorObj.formTemplateId = node.formTemplateId
      }

      if (this.getDesignerId() === 2) {
        this.getTpl(node.formTemplateId)
      }
      // 路由上标记模版id
      this.handleRoute({
        templateId: node.formTemplateId,
        dataId: node.formDataId,
        businessType: node.businessType,
        name: node.name
      })
      this.storeEditorObj()
      this.tplObj = getDialogParams('edit', node)
      console.log('编辑', this.tplObj)
      this.openNodeType = node.type
    },
    // 左键点击模版进行编辑
    editTpl (node) { // 显示模版，并进行编辑
      this.openNodeType = node.type
      if (node.isTemplate) {
        this.editorObj = resetEditorObj(node)
        // 主要通过formTemplateId控制右侧文档编辑器更新
        this.schema.formTemplateId = node.id
        // 路由上标记模版id
        this.handleRoute({
          templateId: node.formTemplateId,
          dataId: node.formDataId,
          businessType: node.businessType,
          name: node.name
        })
        this.storeEditorObj()
        this.openTpl()
        if (this.getDesignerId() === 2) {
          this.getTpl(node.formTemplateId)
        } else {
          this.formKey = U()
        }
        this.setCommand('edit')
      }
    },
    async upOrDown (node, direction) {
      const res = await request(this.urlMap.templateManage.upOrDown, {
        id: node.id,
        operationType: direction
      })
      if (res.data) {
        this.renderTree(this.businessType)
      }
    },
    openTpl () {
      this.showTpl = true
    },
    closeTpl () {
      this.showTpl = false
    },
    setMenuActive (val) {
      this.menuList.forEach(item => {
        if (item.businessType === val) {
          this.$set(item, 'isActive', true)
        } else {
          this.$set(item, 'isActive', false)
        }
      })
    },
    // 切换模版
    handleTab (curItem) {
      console.log(curItem)
      let tab = (val) => {
        this.setMenuActive(val)
        this.closeTpl()
        this.businessType = val
        this.handleRoute({
          businessType: this.businessType
        })
      }
      if (this.isUpdate()) {
        confirm(this, {
          confirmCallBack: () => {
            this.saveTpl()
          },
          cancelCallBack: () => {
            this.initUpDate()
            tab(curItem.businessType)
          }
        })
      } else {
        this.initUpDate()
        tab(curItem.businessType)
      }
    },
    renderTree (businessType) {
      if (Number(businessType) === 3) { // 科室模版
        // this.treeData = []
        let dptIds = []
        if (this.subjectList2.id) {
          dptIds = [this.subjectList2.id]
          this.getTemplateTree(dptIds, this.templateName)
        }

        return false
      } else {
        this.getTemplateTree([], this.templateName)
      }
    },
    // 引用页眉页脚弹窗
    quote () { // 文档专用
      this.wordVisible = true
    },
    // 保存词条模板
    insertWord (data) { // 文档专用
      this.$refs.phrdoc.insert(data, true)
    }
  },
  watch: {
    openNodeType: {
      handler (val) {
        if (Number(val) === 5) {
          this.eidtorCommands = this.eidtorCommands.slice(3)
        } else {
          this.eidtorCommands = eidtorCommands
        }
      }
    },
    'businessType' (val) {
      this.renderTree(val)
    },
    'templateName' (val) {
      this.renderTree(this.businessType)
    },
    'subjectList2': {
      handler (val) {
        this.getTemplateTree([val.id])
      },
      deep: true
    }
  },
  components: {
    templateTree,
    tplOperation,
    evereditor,
    formSchema,
    wordDialog
  }
}
</script>
<style lang="scss" scoped>
@import '../css/templatemanage.scss'
</style>
