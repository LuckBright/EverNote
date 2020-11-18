<template>
  <div class="template_manage flex_column_full_hidden">
    <div class="sidebar_box flex_column_full_hidden row">
      <nav-bar
        ref="template_nav"
        :workshop="workshop"
        :role="role"
        @getBusinessType="getBusinessType"
      ></nav-bar>
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
            v-model="subjectList"
            :params="subjectParams"
            type="select"
            placeholder="请选择一个科室">
          </ever-subject-select>
          <template-tree
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
        <template-doc 
          v-if="designerId===2"
          ref="template_doc"
          :key="docKey"
          :workshop="workshop"
        ></template-doc>
        <template-form
          v-else-if="designerId===1"
          ref="template_form"
          :key="formKey"
          :workshop="workshop"
        >
        </template-form>
        <div
          v-if="showLayer"
          class="layer">
        </div>
      </div>
      <everNoData
        v-else
        tipTxt="请选择一个模版"
      ></everNoData>
    </div>
    <!-- 模板新建和编辑 -->
    <tpl-operation
      :operation.sync="operationCommand"
      :workshop='workshop'
      :checkParams="dialogParams"
      :api="urlMap"
      @close="close"
    ></tpl-operation>
  </div>
</template>
<script>
import { request } from '@/util/req'
import {
  getTemplateList,
  getDialogParams,
  resetEditorObj,
  getUrl,
  handleRoute,
  printCommand,
  levelTwoNames,
  levelThreeNames
  } from '@/emr/config/template.config'
import storage from '@/util/storage'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
import {RecordStrategy} from '@/emr/config/template.record.strategy.js'
import update from '@/emr/mixins/update.js'// vuex存储数据
import beforeunload from '@/emr/mixins/beforeunload.js'// vuex存储数据
import templateTree from '@/emr/page/templatemanage/collapse'
import tplOperation from '@/emr/page/templatemanage/dialog.template.operation'
import navBar from '@/emr/page/templatemanage/template.nav'
import templateDoc from '@/emr/page/templatemanage/template.doc'
import templateForm from '@/emr/page/templatemanage/template.form'
import {commandLog} from '@/phr/mixin/operationLog.js'
import url from '@/manages/page/organization/utils/urls'
// import store from '@/store'
// el,name,functional,components,directives,filters,extends,mixins,props,data,computed,watch,hooks,methods
export default {
  name: 'templatemanage',
  components: {
    templateDoc,
    templateForm,
    templateTree,
    tplOperation,
    navBar
  },
  mixins: [update, beforeunload],
  data () {
    return {
      rootName: '病历管理',
      levelOneName: '病历模版管理',
      role: '',
      templateList: [],
      operationCommand: '', // 对弹框的操作命名
      recordStrategy: null, // 模板操作策略，保存，新建，删除
      docKey: U(), // 更新文档模版
      formKey: U(), // 更新表单模版
      urlMap: null, // url
      subjectParams: {// 科室组件传参
        staffIdList: [storage.getLocalStorage('USERID')]
      },
      subjectList: {}, // 科室组件绑定的参数
      workshop: this.$route.meta.workshopTag, // 工作站标识
      command: '', // 控制编辑模版和新建模版
      templateName: '', // 模版名称
      treeData: {}, // 整个模版树
      dialogParams: {}, // 新建或者编辑模版时需要传给弹框的参数
      showTpl: false, // 控制显示隐藏编辑器（表单+文档）
      businessType: this.$route.query.businessType, // 参考menuList,默认显示集团
    }
  },
  computed: {
    showLayer () { // 非集团工作站，集团模版为只读状态
      return this.businessType === 0 && this.workshop === 'orgSetting'
    },
    designerId () { // 编辑器表示1表单 2文档
      return Number(this.editorObj.designerId)
    },
    treeObj () { // 模版树形结构
      if (this.businessType === 3) {
        return this.treeData[this.subjectList.id]
      } else {
        return this.treeData
      }
    }
  },
  watch: {
    'businessType' (val) {
      this.renderTree(val)
    },
    'templateName' (val) {
      this.renderTree(this.businessType)
    },
    'subjectList': {
      handler (val) {
        this.getTemplateTree([val.id])
      },
      deep: true
    }
  },
  mounted () {
    this.init()
    // 操作上报
    commandLog({
      content: `登录${this.levelOneName}`,
      opModuleOne: `${this.rootName}-${this.levelOneName}`,
      opType: 'LOGIN'
    })
  },
  beforeDestroy () {
    // store.unregisterModule('templateModule')

    // console.log('组件销毁', this.$store.state['templateModule'])
  },
  methods: {
    async getSkillTitle () { // 获取用户职称
      const userId = storage.getLocalStorage('USERID')
      let res = await request(url.staff.getStaffListByIdList, {idList: [userId]})
      if (res.head.errCode === 0) {
        this.role = res.data[0].skillsTitle2Code
        this.templateList = getTemplateList(this.workshop, this.role)
      }
    },
    getFormInfo () {
      printCommand(this.$refs.template_form.getFormInfo(), '表单信息')
      return this.$refs.template_form.getFormInfo()
    },
    getHtml () {
      return this.$refs.template_doc.getHtml()
    },
    getSchema () {
      return this.$refs.template_doc.getSchema()
    },
    getBusinessType (val) {
      this.businessType = Number(val)
    },
    init () {
      this.setCommand('edit')
      // 还需要配置角色815需求//门诊，住院，护士工作站需要角色信息
      this.getSkillTitle()
      this.urlMap = getUrl(this.workshop)
      // this.templateList = getTemplateList(this.workshop, this.role)
      // this.urlMap = getUrl(this.workshop, this.role)
      // this.$refs.template_nav.handleBusinessType(this.$route.query.businessType, this.workshop)
      if (this.$route.query.templateId) {
        this.openTpl()
        this.setAsyncEditor(JSON.parse(storage.getLocalStorage('editorObj')))
      }
      // 初始化时路由的变化
      handleRoute(this, {
        businessType: this.businessType,
        dataId: this.$route.query.formDataId,
        templateId: this.$route.query.templateId,
        name: this.$route.query.name
      })
      this.initTree()
      this.recordStrategy = new RecordStrategy(this)// 初始化病例保存策略
    },
    initTree () {
      if (this.businessType !== 3) {
        this.renderTree(this.businessType)
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
      if (this.designerId === 1) {
        this.formKey = U()
      } else {
        this.docKey = U()
      }
    },
    // 更新模版,修改模版名称和属性
    updateTpl (node) {
      printCommand('右键编辑完毕', node)
      this.setAsyncEditor(resetEditorObj(node))
      this.updateKey()
      this.saveTpl()
    },
    // 新建模版,
    addTpl (node) {
      printCommand('新建填写完毕', node)
      this.setAsyncEditor(resetEditorObj(node))
      this.openTpl()
      this.updateKey()
      commandLog({
        content: `新建${node.name}模版`,
        opModuleOne: `${this.rootName}-${this.levelOneName}-${levelTwoNames[this.editorObj.businessType]}-${levelThreeNames[this.editorObj.type]}-${this.editorObj.categoryName}`,
        opType: 'CLICK_CREATE'
      })
      handleRoute(this, {
        businessType: this.businessType
      })
    },
    // 关闭弹框
    close () {
      printCommand('关闭弹框')
      this.setCommand('edit')
      this.setAsyncChange(false)
    },
    // 保存模版
    saveTpl () {
      let callback = this.editCallback
      let paths = {
        'create': 'saveTpl',
        'edit': 'updateTpl'
      }
      let url = this.urlMap.templateManage[paths[this.command]]
      this.recordStrategy.initDesignerId(this.designerId)
      .requestParams(this.editorObj)
      .save(this.command, url, callback)
    },
    editCallback (res) {
      printCommand('成功回调', res)
      this.setCommand('edit')
      this.setAsyncChange(false)
      this.setAsyncEditor(resetEditorObj(res))
      this.updateKey()
      this.renderTree(this.businessType)
      handleRoute(this, {
        templateId: res.formTemplateId,
        dataId: res.formDataId,
        businessType: res.businessType,
        name: res.name
      })
      commandLog({
        // 保存${obj.title}病例
        content: `保存${res.name}模版`,
        opModuleOne: `${this.rootName}-${this.levelOneName}-${levelTwoNames[this.editorObj.businessType]}-${levelThreeNames[this.editorObj.type]}-${this.editorObj.categoryName}`,
        opType: 'SAVE'
      })
    },
    setCommand (command) {
      this.command = command
    },
    // 树形菜单右键的一系列操作
    contextmenuAdd (node) { // 新建
      printCommand('右键新建', node)
      this.setCommand('create')
      this.setAsyncChange(true)
      this.closeTpl()
      this.operationCommand = (Number(node.type) === 5) ? 'addEntry' : 'addTpl'
      this.dialogParams = getDialogParams('create', node, this.businessType)
    },
    // 刷新
    contextmenuRefresh () {
      printCommand('刷新操作')
      this.renderTree(this.businessType)
    },
    contextmenuEdit (node) { // 编辑模版名称和属性
      printCommand('右键编辑模版', node)
      if (!node.isTemplate) return false
      this.setCommand('edit')
      this.operationCommand = (Number(node.type) === 5) ? 'editEntry' : 'editTpl'
      this.setAsyncEditor(resetEditorObj(node))
      handleRoute(this, {
        templateId: node.formTemplateId,
        dataId: node.formDataId,
        businessType: node.businessType,
        name: node.name
      })
      this.dialogParams = getDialogParams('edit', node)
      this.openTpl()
      commandLog({
        content: `编辑${node.name}模版`,
        opModuleOne: `${this.rootName}-${this.levelOneName}-${levelTwoNames[this.editorObj.businessType]}-${levelThreeNames[this.editorObj.type]}-${this.editorObj.categoryName}`,
        opType: 'CLICK_EDIT'
      })
    },
    // 删除操作
    contextmenuRemove (node) {
      printCommand('删除操作', node)
      let callback = () => {
        if (this.editorObj.id === node.id) {
          this.closeTpl()
          handleRoute(this, {
            businessType: this.businessType
          })
          this.setAsyncChange(false)
          // this.initUpDate()
        }
        this.renderTree(this.businessType)
        commandLog({
          content: `删除${node.name}模版`,
          opModuleOne: `${this.rootName}-${this.levelOneName}-${levelTwoNames[node.businessType]}-${levelThreeNames[node.type]}-${node.categoryName}`,
          opType: 'DELETE'
        })
      }
      let url = this.urlMap.templateManage.delTpl
      this.recordStrategy.initDesignerId(this.designerId).delete(url, node.id, callback)
    },
    async contextmenuUpOrDown (node, direction) { // 这里有bug上移移不动，下移移到底部了
      printCommand('上移下移操作', node, direction)
      const res = await request(this.urlMap.templateManage.upOrDown, {
        id: node.id,
        operationType: direction
      })
      if (res.data) {
        this.renderTree(this.businessType)
      }
    },
    // 左键点击模版进行编辑
    editTpl (node) { // 显示模版，并进行编辑
      if (!node.isTemplate) return false
      printCommand('左键编辑模板', node)
      this.setAsyncEditor(resetEditorObj(node))
      commandLog({
        content: `编辑${node.name}模版`,
        opModuleOne: `${this.rootName}-${this.levelOneName}-${levelTwoNames[this.editorObj.businessType]}-${levelThreeNames[this.editorObj.type]}-${this.editorObj.categoryName}`,
        opType: 'CLICK_EDIT'
      })

      this.updateKey()
        // 路由上标记模版id
      handleRoute(this, {
        templateId: node.formTemplateId,
        dataId: node.formDataId,
        businessType: node.businessType,
        name: node.name
      })
      this.openTpl()
      this.setCommand('edit')
    },
    renderTree (businessType) {
      if (businessType === 3) { // 科室模版
        if (this.subjectList.id) {
          this.getTemplateTree([this.subjectList.id], this.templateName)
        }
        return false
      } else {
        this.getTemplateTree([], this.templateName)
      }
    },
    openTpl () {
      this.showTpl = true
    },
    closeTpl () {
      this.showTpl = false
    }
  }
}
</script>
<style lang="scss" scoped>
@import './css/templatemanage.scss'
</style>
