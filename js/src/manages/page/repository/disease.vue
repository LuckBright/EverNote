<template>
  <div class="template_manage flex_column_full_hidden">
    <div class="sidebar_box flex_column_full_hidden row" :style="{width: showSelect ? '310px' : '27px'}">
      <nav-bar
        @click.stop=""
        ref="template_nav"
        :menuList="menuList"
        :selectedItem="selectItem"
        @leftNavContentMenu ="leftNavContentMenu"
        @selectLeftTab = "selectLeftTab"
      ></nav-bar>
      <div class="right_menu flex_column_1_hidden" @click.stop="">
        <div class="top_bar search">
          <!-- <el-autocomplete :popper-append-to-body="false" popper-class="repository-autocomplete-popper" class="repository-autocomplete" size="small" @select="handleSelect" :fetch-suggestions="querySearch" v-model="searchText" placeholder="请输入类别名称" clearable prefix-icon="el-icon-search"></el-autocomplete> -->
          <searchbox class="repository-autocomplete" :systematization="selectItem.systematization" @change="handleSelect" @clearKeyword="clearKeyword"></searchbox>
        </div>
        <div class="collapse_wrap">
          <el-tree
            v-show="!isShowSearchTree"
            class="filter-tree"
            node-key="id"
            :props="defaultProps"
            highlight-current
            @node-contextmenu="getNode"
            :filter-node-method="filterNode"
            @node-click="treeNodeClick"
            :load="loadNode"
            :current-node-key="currentSelectTreeNodeKey"
            lazy
            ref="tree">
            <span
              :class="[
                'custom-tree-node',
                {
                  'parent-node': node.level === 1,
                  'line-tree-node': setTreeLine(node)
                },
              ]"
              :style="{ '--left': 14 + 18 * (node.level - 1) + 'px' }"
              slot-scope="{ node, data }"
            >
              <input v-if="optionType.startsWith('rename') && node.id === curNode.id" v-model="renameText" @keyup.enter="reName">
              <span v-else>
                <span>
                  <i v-if="(!data.isDirectory) && node.level !== 1" class="iconfont icon-zhishidian"></i>
                  <span v-else>
                    <svg v-if="(!data.isDirectory) && node.level ===1 && $route.meta.type === 1" class="icon svg-icon directory" aria-hidden="true">
                      <use xlink:href="#icon-jibing"></use>
                    </svg>
                    <svg v-if="(!data.isDirectory) && node.level ===1 && $route.meta.type === 2" class="icon svg-icon directory" aria-hidden="true">
                      <use xlink:href="#icon-zhenliao"></use>
                    </svg>
                    <svg v-if="(!data.isDirectory) && node.level ===1 && $route.meta.type === 3" class="icon svg-icon directory" aria-hidden="true">
                      <use xlink:href="#icon-yaopin"></use>
                    </svg>
                  </span>
                </span>
                <span>
                  <span v-if="node.level === 1">{{node.label}}</span>
                  <span v-else> {{ node.label }}</span>
                </span>
              </span>
            </span>
          </el-tree>
          <el-tree v-show="isShowSearchTree" highlight-current @node-contextmenu="getNode" :data="searchTreeData" :props="searchdefaultProps" @node-click="treeNodeClick" :default-expand-all="true">
            <span
              :class="[
                'custom-tree-node',
                {
                  'parent-node': node.level === 1,
                },
              ]"
              :style="{ '--left': 12 + 18 * (node.level - 1) + 'px' }"
              slot-scope="{ node, data }"
            >
               <input v-if="optionType.startsWith('rename') && node.id === curNode.id" v-model="renameText" @keyup.enter="reName" @blue="hideRename(data)">
              <span v-else>
                <span>
                  <i v-if="(!data.isDirectory) && node.level !== 1" class="iconfont icon-zhishidian"></i>
                  <span v-else >
                    <i v-if="(!data.isDirectory) && node.level ===1 && $route.meta.type === 1" class="iconfont icon-jibing"></i>
                    <i v-if="(!data.isDirectory) && node.level ===1 && $route.meta.type === 2" class="iconfont icon-zhenliao"></i>
                    <i v-if="(!data.isDirectory) && node.level ===1 && $route.meta.type === 3" class="iconfont icon-yaopin"></i>
                  </span>
                </span>
                <span>
                  <span v-if="node.level === 1">{{node.label}}</span>
                  <span v-else> {{ node.label }}</span>
                </span>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
      <div class="fixed-btn" @click="showSelect = !showSelect">
        <i class="iconfont icon-PathCopy" v-show="showSelect"></i>
        <i class="iconfont icon-next" v-show="!showSelect"></i>
      </div>
    </div>
    <div class="main_wrap">
      <el-row class="option-row">
        <el-col :span="24" v-if="currentData.isDirectory">
          <el-button class="option-btn" type="primary" size="small" @click="saveProject">保存</el-button>
          <el-button class="option-btn" type="primary" plain size="small" @click="delProject">删除</el-button>
        </el-col>
      </el-row>
      <section v-show="currentData.isDirectory" style="height: 1px; background: #EEEEEE;margin: 0 20px"></section>
      <evereditor
        v-show="currentData.isDirectory"
        class="editor"
        menu="base"
        v-model="curProj.information"
        :options="editorOpts"
        ref="htmlEditor"
        :editable.sync="editoreditable"
        :is-updated.sync="editorIsUpdated"></evereditor>
    </div>
    <contentMenu :menu="contentMenuList" :class-name="className" @select="handleOperate"></contentMenu>
    <el-dialog
      :title="dialogAddProjDesc[optionType]"
      :visible.sync="dialogVisible"
      width="415px"
      v-if="dialogVisible"
      :before-close="handleClose">
      <el-form :model="baseInfo" label-width="80px" ref="baseForm">
        <addBase :nodeType="1" :curNode="curNode" :type="$route.meta.type" :formData.sync="baseInfo" :optionType="optionType"></addBase>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="showAddCategory">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="this.dialogAddProjDesc[optionType]"
      :visible.sync="addDiseasedialogVisible"
      width="435px"
      v-if="addDiseasedialogVisible"
      :before-close="handleDiseaseClose">
      <el-form :model="baseInfo" label-width="100px" ref="projForm">
        <section class="title">
         <span class="line"></span><b>项目基本信息 （项目的基本信息）</b>
        </section>
        <addBase @standardNumberSelected="standardNumberSelected" :nodeType="1" :curNode="curNode" :type="$route.meta.type" :formData.sync="baseInfo" :optionType="optionType"></addBase>
        <section style="height: 1px; background: #EEEEEE;margin: 15px 0"></section>
        <section class="title">
          <span class="line"></span><b>{{$route.meta.type === 1 ? '分类信息' : '项目别名'}} <span v-if="$route.meta.type === 1">（由于多学科交叉，疾病科隶属多个分类）</span> <span v-if="$route.meta.type !== 1">(其他别名信息)</span></b>
        </section>
        <div v-if="$route.meta.type === 1">
          <!-- <el-form-item label="所属分类:" prop="classOrAlias">
            <el-input disabled class="defaultClassificationId" v-model="diseaseObj.defaultClassificationId" placeholder="自动将默认分类回显"></el-input>
             <i class="el-icon-plus" @click="addOtherClass"></i>
        </el-form-item> -->
          <el-form-item v-for="(item, index) in diseaseObj.classificationIdList" :key="index" label="所属分类:" prop="classificationIdList">
            <el-cascader
              size="small"
              class="cascader-item"
              v-model="item.pinyinCode"
              :show-all-levels="false"
              :props="{emitPath: false, checkStrictly: true}"
              :disabled="index === 0"
              :options="classTreeData">
            </el-cascader>
            <i v-if="index !== 0" class="el-icon-delete" @click="removeOtherClass(index)"></i>
            <i class="el-icon-plus" v-if="index === diseaseObj.classificationIdList.length-1 " @click="addOtherClass"></i>
          </el-form-item>
        </div>
        <div v-if="$route.meta.type === 2 || $route.meta.type === 3">
          <el-form-item v-for="(item, index) in diseaseObj.classList" :key="index" label="项目别名:" prop="classList">
            <el-input size="small" class="add-proj-class-input" v-model="item.aliasName" placeholder="" @input="classNameChange(item,index)"></el-input>
           <span class="pinyincode-title">&nbsp; &nbsp;简码: &nbsp;</span>  <el-input size="small" disabled class="add-proj-class-input-pinyin"
            v-model="item.pinyinCode" placeholder=""></el-input>
            <i class="el-icon-delete" @click="removeClass(index)"></i>
            <i class="el-icon-plus" v-show="diseaseObj.classList.length === index +1" @click="addClass"></i>
          </el-form-item>
        </div>
        <section style="height: 1px; background: #EEEEEE;margin: 15px 0"></section>
        <section class="title">
          <span class="line"></span><b>标准编码（该{{dialogAddProjDesc[curNode.data.type]}}对应的国际或国家标准编码）</b>
        </section>
        <el-form-item :label="convertStandCodeDesc" prop="class">
          <el-input size="small" v-model="diseaseObj.standardNumber" :placeholder="convertStandPlaceholders"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDiseasedialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addDiseaseConfirm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { editorBaseOpts, MEDICAL_EDITOR_OPTIONS } from '@/util/common'
import { request } from '@/util/req'
import storage from '@/util/storage'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
import update from '@/emr/mixins/update.js'// vuex存储数据
import beforeunload from '@/emr/mixins/beforeunload.js'// vuex存储数据
import templateTree from '@/emr/page/templatemanage/collapse'
import tplOperation from '@/emr/page/templatemanage/dialog.template.operation'
import navBar from '@/manages/page/repository/components/left.nav'
import addBase from '@/manages/page/repository/components/addBase.vue'
import addCategory from '@/manages/page/repository/components/addCategory.vue'
import addDrugCategory from '@/manages/page/repository/components/addDrugCategory.vue'
import addDiseaseCategory from '@/manages/page/repository/components/addDiseaseCategory.vue'
import contentMenu from '@/manages/page/repository/components/contentmenu.vue'
import templateDoc from '@/emr/page/templatemanage/template.doc'
import templateForm from '@/emr/page/templatemanage/template.form'
import {convertListToTree, changeToTreeList} from '@/manages/page/organization/utils/fns'
import { convertCharToPinyin } from '@/components/pinyin.js'
import searchbox from '@/manages/page/repository/components/searchbox.vue'

export default {
  name: 'templatemanage',
  components: {
    templateDoc,
    templateForm,
    templateTree,
    tplOperation,
    navBar,
    contentMenu,
    addBase,
    addCategory,
    addDrugCategory,
    addDiseaseCategory,
    searchbox
  },
  mixins: [update, beforeunload],
  data () {
    return {
      currentSelectTreeNodeKey: '', // 当前选中的树节点的key
      contextMenuArea: '', // 用来保存右键操作的区域是左侧菜单还是右侧的树
      classificationIdListRules: [{ required: true, message: '必填项', trigger: 'change' }],
      renameText: '', // 更改名称
      optionType: '', // 右键操作类型
      isShowSearchTree: false, // 是否显示搜索树
      searchTreeData: [], // 搜索结果数据
      searchdefaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'isDirectory'
      },
      searchText: '', // 搜索文字
      curProj: {
        information: ''
      },  // 当前选择的项目
      classTreeData: [],
      dialogAddProjDesc: {
        1: '疾病',
        2: '诊疗',
        3: '药品',
        createclass: '添加类别',
        createproj: '添加项目',
        createchildren: '添加子类别',
        editproj: '修改项目'
      },
      standardCodeLabel: '', // 表单label
      diseaseObj: {
        defaultClassificationId: '',
        standardNumber: '',
        information: '',
        classList: [{aliasName: '', pinyinCode: ''}],
        otherclassList: [],
        classificationIdList: []
      },
      selectItem: {},
      node_had: {},  // 临时对象，存储level=0的节点，用于左侧导航切换更新右侧树结构的数据
      resolve_had: {}, // 同上
      baseInfo: {}, // 添加类别基础表单对象
      showSelect: true, // 侧边栏是否展开
      dialogVisible: false, // 添加类别弹窗提示
      addDiseasedialogVisible: false, // 添加类别弹窗提示
      className: 'el-tree-node__content',
      menuVisible: false, // 右键菜单显示
      curNode: {},
      currentData: {},
      menuList: [],
      html: '',
      editoreditable: true,
      editorIsUpdated: false,
      editorOpts: {
        suggestItems: [],
        templateItems: [],
        // #快捷录入模板数据
        templateApi: {
          url: `${this.$ever.api}/medical-record/doctor/templateScope/getSmallTemplate`,
          params: {
            dptId: this.dptId
          }
        },
        // 图片上传配置
        ...editorBaseOpts,
        // 传入接口配置
        ...MEDICAL_EDITOR_OPTIONS
      },
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: this.isDirectory
      },
      contentMenuList: [
        {
          name: '添加类别',
          id: 'create',
          disabled: false,
          operate: 'create'
        },
        {
          name: '添加子类别',
          id: 'createchildren',
          disabled: false,
          operate: 'createchildren',
        },
        {
          name: '添加项目',
          id: 'addItem',
          disabled: false,
          operate: 'addItem',
          border: true
        },
        {
          name: '上移',
          id: 'up',
          disabled: false,
          border: false,
          operate: 'up'
        },
        {
          name: '下移',
          id: 'down',
          disabled: false,
          border: true,
          operate: 'down',
        },
        {
          name: '修改',
          id: 'edit',
          disabled: false,
          border: false,
          operate: 'edit'
        },
        {
          name: '删除',
          id: 'delete',
          disabled: false,
          border: false,
          operate: 'delete'
        },
        {
          name: '重命名',
          id: 'rename',
          disabled: false,
          border: false,
          operate: 'rename'
        },
      ],
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
    }
  },
  computed: {
    designerId () { // 编辑器表示1表单 2文档
      return Number(this.editorObj.designerId)
    },
    convertStandCodeDesc() {
      if (this.curNode.data.type === 1) {
        if (this.curNode.data.value === '1') {
          return '西医疾病编码'
        } else {
          return '中医疾病编码'
        }
      } else if (this.curNode.data.type === 2) {
        return '诊疗编码'
      } else if (this.curNode.data.type === 3) {
        return '药品编码'
      }
    },
    convertStandPlaceholders() {
      if (this.curNode.data.type === 1) {
        return '自动回显输入项目对应的疾病编码'
      } else if (this.curNode.data.type === 2) {
        return '自动回显输入项目对应的诊疗编码'
      } else {
        return '自动回显输入项目对应的药品编码'
      }
    },
  },
  watch: {
    searchText (val) {
      if (val.length === 0) {
        this.isShowSearchTree = false
      }
    },
    templateName(val) {
      this.$refs.tree.filter(val)
    },
    'subjectList': {
      handler (val) {
        this.getTemplateTree([val.id])
      },
      deep: true
    },
    '$route.meta.type': function (val, oldVal) {
      // this.getTemplateTree()
      this.selectItem = {}
      this.isShowSearchTree = false
      this.node_had.childNodes = []// 把存起来的node的子节点清空，不然会界面会出现重复树！
      this.loadNode(this.node_had, this.resolve_had)// 再次执行懒加载的方法
    }
  },
  mounted () {

  },
  methods: {
    clearKeyword() {
      this.isShowSearchTree = false
    },
    setCurrentKey() {
      this.$refs.tree.setCurrentKey(this.curNode.data.id)
    },
    hideRename(data) {
      this.optionType = ''
      this.renameText = data.name
    },
    isDirectory(data, node) {
      return data.isDirectory ? true : false
    },
    idGenerator(data, node) {
      return data.id
    },
    setTreeLine (node) {
      return !node.data.isDirectory && node.level !== 1
    },
    // 重命名
    reName() {
      if (this.renameText) {
        if (this.curNode.data.isDirectory) {
          request('/platform-extend/project/changeName', {
            id: this.curNode.data.id,
            name: this.renameText,
            pinyinCode: convertCharToPinyin(this.renameText).shoupin.toUpperCase()
          }).then(res => {
            if (res.head.errCode === 0) {
              this.renameText = ''
              this.optionType = ''
              // this.node_had.childNodes = []// 把存起来的node的子节点清空，不然会界面会出现重复树！
              // this.loadNode(this.node_had, this.resolve_had)// 再次执行懒加载的方法
              this.curNode.parent.loaded = false
              this.curNode.parent.expand()
              this.$message({
                type: 'success',
                message: '更新成功!'
              })
            }
          })
        } else {
          request('/platform-extend/classification/changeName', {
            id: this.curNode.data.id,
            name: this.renameText,
            pinyinCode: convertCharToPinyin(this.renameText).shoupin.toUpperCase()
          }).then(res => {
            if (res.head.errCode === 0) {
              this.renameText = ''
              this.optionType = ''
              this.curNode.parent.loaded = false
              this.curNode.parent.expand()
              this.$message({
                type: 'success',
                message: '更新成功!'
              })
            }
          })
        }
      } else {
        this.$message({
          type: 'success',
          message: '名称不能为空!'
        })
      }
    },
    handleSelect(item) { // 搜索输入框下拉列表点击
      request('/platform-extend/project/recursiveQuery', {
        defaultClassificationId: item.defaultClassificationId,
        projectId: item.id,
        systematization: item.systematization
      }).then(res => {
        if (res.head.errCode === 0) {
          this.isShowSearchTree = true
          this.searchTreeData = convertListToTree(changeToTreeList(res.data.filter(item => item.level !== 1), {label: 'name', id: '_id', parentId: 'parentId'}))
        }
      })
    },
    querySearch(queryString, cb) {
      let params = {
        name: queryString,
        type: this.$route.meta.type,
        systematization: this.selectItem.systematization
      }
      request('/platform-extend/project/fuzzyQuery', params).then(res => {
        let cbData = res.data.map(item => {
          return {
            value: item.name,
            id: item.id,
            defaultClassificationId: item.defaultClassificationId,
            systematization: item.systematization
          }
        })
        cb(cbData)
      })
    },
    saveProject() {
      this.$set(this.curProj, 'information', this.$refs.htmlEditor.getHtml())
      request('/platform-extend/project/updateProject', {
        type: this.curProj.type,
        innerReqList: [{...this.curProj}]
      }).then(res => {
        if (res.head.errCode === 0) {
          this.editorIsUpdated = false
          this.html = this.$refs.htmlEditor.getHtml()
          this.setCurrentKey()
          this.$message({
            type: 'success',
            message: '更新成功!'
          })
        }
      })
    },
    delProject() {
      let curNode = this.curNode
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.curProj.information = ''
        let params = {
          type: curNode.data.type,
          innerReqList: [this.curProj]
        }
        request(`/platform-extend/project/updateProject`, params).then(res => {
          if (res.head.errCode === 0) {
            this.addDiseasedialogVisible = false
            this.$refs.htmlEditor.setContent('')
            this.$set(this.curProj, 'information', '')
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      }).catch((e) => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    editorHtmlSubstr(text) {
      var str = text
      var p = document.createElement('p')
      p.innerHTML = str
      return p.innerText
    },
    treeNodeClick(data, node) {
      this.currentData = data
      // this.curNode = node
      if (this.curNode.data && this.curNode.data.id !== data.id) {
        this.optionType = 'nodeclick'
      }
      if (!data.isDirectory) return
      let editorHtml = this.editorHtmlSubstr(this.$refs.htmlEditor.getHtml())

      if (this.html.indexOf('domid')) {
        this.html = this.editorHtmlSubstr(this.html)
      }
      if (this.$refs.htmlEditor && this.html !== editorHtml) {
        this.$confirm('文档有修改, 是否先保存?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '不保存',
          showClose: false,
          closeOnClickModal: false,
          type: 'warning'
        }).then(res => {
          this.saveProject()
        }).catch(() => {
          this.curNode = node
          request('/platform-extend/project/getProject', {
            type: data.type,
            innerReqList: [{id: data.id, defaultClassificationId: data.defaultClassificationId}]
          }).then(res => {
            if (res.head.errCode === 0) {
              this.curProj = res.data
              this.html = res.data.information
              this.$forceUpdate()
            }
          })
        })
      } else {
        request('/platform-extend/project/getProject', {
          type: data.type,
          innerReqList: [{id: data.id, defaultClassificationId: data.defaultClassificationId}]
        }).then(res => {
          this.curNode = node
          if (res.head.errCode === 0) {
            this.curProj = res.data
            this.$refs.htmlEditor.setContent(res.data.information)
            // this.$set(this.curProj, 'information', res.data.information || ' ')
            this.html = res.data.information
            this.$forceUpdate()
          }
        })
      }
      // this.curProj = data
    },
    classNameChange(item, index) {
      item.pinyinCode = convertCharToPinyin(item.aliasName).shoupin.toUpperCase()
      this.$set(this.diseaseObj.classList, index, item)
    },
    standardNumberSelected(item) {
      this.diseaseObj.standardNumber = item.code
    },
    removeClass(delIndex) {
      this.diseaseObj.classList.splice(delIndex, 1)
      this.$forceUpdate()
    },
    addClass() {
      this.diseaseObj.classList.push({aliasName: '', pinyinCode: ''})
      this.$forceUpdate()
    },
    removeOtherClass(delIndex) {
      this.diseaseObj.classificationIdList.splice(delIndex, 1)
      this.$forceUpdate()
    },
    addOtherClass() {
      this.diseaseObj.classificationIdList.push({aliasName: '', pinyinCode: ''})
      this.$forceUpdate()
    },
    addDiseaseConfirm() {
      this.$refs['projForm'].validate((valid) => {
        if (valid) {
          let diseaseObj = JSON.parse(JSON.stringify(this.diseaseObj))
          if (diseaseObj.classificationIdList.some(item => item.pinyinCode.length <= 0)) {
            this.$message({
              type: 'error',
              message: '请输入分类信息'
            })
            return
          }
          // this.diseaseObj.information = ''
          diseaseObj.level = this.curNode.data.level
          if (this.$route.meta.type === 1) {
            delete diseaseObj.classList
            delete this.baseInfo.classList
            diseaseObj.classificationIdList = diseaseObj.classificationIdList.map(item => item.pinyinCode)
          } else {
            delete diseaseObj.classificationIdList
            delete this.baseInfo.classificationIdList
            diseaseObj.classList = diseaseObj.classList.filter(item => item.aliasName.length > 0)
          }
          if (this.optionType === 'editproj') {
            delete diseaseObj.level
          }
          this.baseInfo.updateAlias = 1
          Object.assign(this.baseInfo, diseaseObj)
          let params = {
            parentId: this.curNode.data.id,
            type: this.$route.meta.type,
            innerReqList: [this.baseInfo]
          }
          let url = this.optionType === 'createproj' ? 'project/addProject' : 'project/updateProject'
          request(`/platform-extend/${url}`, params).then(res => {
            if (res.head.errCode === 0) {
              this.addDiseasedialogVisible = false
              if (this.optionType === 'createproj') {
                this.curNode.loaded = false
                this.curNode.expand()
              } else {
                this.curNode.parent.loaded = false
                this.curNode.parent.expand()
              }

              this.$message({
                type: 'success',
                message: '更新成功!'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.node_had = node
        this.resolve_had = resolve
        request('/platform-extend/classification/getDirectory', {
          parentId: 1,
          type: this.$route.meta.type
        }).then(res => {
          if (res.head.errCode === 0) {
            this.menuList = res.data.classificationInnerRespList.filter(item => item.level === 1)
            if (this.selectItem.id) {
              return resolve(res.data.classificationInnerRespList.filter(item => item.parentId === this.selectItem.id))
            } else {
              this.selectItem = this.menuList[0]
              return resolve(res.data.classificationInnerRespList.filter(item => item.parentId === this.menuList[0].id))
            }
          } else {
            this.menuList = []
            return resolve([])
          }
        })
      } else {
        // this.node_had = node
        // this.resolve_had = resolve
        if (!node.data.isDirectory) {
          request('/platform-extend/classification/getDirectory', {
            parentId: node.data.id,
            type: this.$route.meta.type
          }).then(res => {
            return resolve(res.data.classificationInnerRespList)
          })
        }
      }
    },
    selectLeftTab (selectItem) {
      this.selectItem = selectItem
      this.isShowSearchTree = false
      this.node_had.childNodes = []// 把存起来的node的子节点清空，不然会界面会出现重复树！
      this.loadNode(this.node_had, this.resolve_had)// 再次执行懒加载的方法
    },
    leftNavContentMenu(item) {
      this.contextMenuArea = 'leftmenu'
      this.curNode.data = item
      // 左侧分类大于等于7 // 禁止添加类别
      this.contentMenuList[0].disabled = true
      this.contentMenuList[2].disabled = true
      this.contentMenuList[5].disabled = true
      this.contentMenuList[6].disabled = true
      this.contentMenuList[7].disabled = true
      // 如果orderNumber === 1， 禁止上移
      if (item.orderNumber === 1) {
        this.contentMenuList[3].disabled = true
      } else {
        this.contentMenuList[3].disabled = false
      }
      if (item.orderNumber >= this.menuList.length) {
        this.contentMenuList[4].disabled = true
      } else {
        this.contentMenuList[4].disabled = false
      }
    },
    showAddCategory() {
      this.$refs['baseForm'].validate((valid) => {
        if (valid) {
          let levelNum = this.optionType === 'createchildren' ? 1 : 0
          Object.assign(this.baseInfo, {level: this.curNode.data.level + levelNum, systematization: this.curNode.data.systematization})
          let params = {
            type: this.$route.meta.type,
            createId: 1,
            createName: 1111,
            innerReqList: [this.baseInfo]
          }
          if (this.optionType === 'createclass' || this.optionType === 'editclass') {
            params.parentId = this.curNode.data.parentId
          } else {
            params.parentId = this.curNode.data.id
          }
          let url = (this.optionType === 'createclass' || this.optionType === 'createchildren') ? 'classification/addClassification' : 'classification/updateById'
          request(`/platform-extend/${url}`, params).then(res => {
            if (this.optionType === 'createchildren') {
              if (this.contextMenuArea === 'leftmenu') {
                this.node_had.childNodes = []// 把存起来的node的子节点清空，不然会界面会出现重复树！
                this.loadNode(this.node_had, this.resolve_had)// 再次执行懒加载的方法
              } else {
                this.curNode.loaded = false
                this.curNode.expand()
              }
            } else {
              if (this.curNode.level === 1) {
                this.node_had.childNodes = []// 把存起来的node的子节点清空，不然会界面会出现重复树！
                this.loadNode(this.node_had, this.resolve_had)// 再次执行懒加载的方法
              } else {
                this.curNode.parent.loaded = false
                this.curNode.parent.expand()
              }
            }
            this.dialogVisible = false
            this.$message({
              type: 'success',
              message: '更新成功!'
            })
          })
        } else {
          return false
        }
      })
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleDiseaseClose() {
      this.addDiseasedialogVisible = false
    },
    getNode (event, data, node, cur) {
      // 根据当前节点判断右键的禁用状态
      this.contextMenuArea = 'tree'
      for (let index = 0; index < this.contentMenuList.length; index++) {
        this.contentMenuList[index].disabled = false
      }
      if (data.isDirectory) {  // 项目禁止添加类别和子类别
        this.contentMenuList[0].disabled = true
        this.contentMenuList[1].disabled = true
        this.contentMenuList[2].disabled = true
      }
      // 如果orderNumber === 1， 禁止上移
      if (!node.previousSibling) {
        this.contentMenuList[3].disabled = true
      } else {
        this.contentMenuList[3].disabled = false
      }

      if (!node.nextSibling) {
        this.contentMenuList[4].disabled = true
      } else {
        this.contentMenuList[4].disabled = false
      }

      if (node.level > 5) {
        this.contentMenuList[0].disabled = true
        this.contentMenuList[1].disabled = true
      } else {
        this.contentMenuList[0].disabled = false
        this.contentMenuList[1].disabled = false
      }

      this.curNode = node
    },
    handleOperate (obj) {
      let setOperate = (operateType) => {
        const operations = {
          'create': this.contextmenuAdd,
          'createchildren': this.contextmenuAddChildren,
          'addItem': this.contextmenuAddItem,
          'edit': this.contextmenuEdit,
          'delete': this.contextmenuRemove,
          'up': this.contextmenuUp,
          'down': this.contextmenuDown,
          'rename': this.contextmenuRename
        }
        const upDown = {
          'up': 1,
          'down': 2
        }
        operations[operateType](this.curNode, upDown[operateType])
      }

      if (this.templateChange && ['create', 'edit'].includes(obj.operate)) {
        confirm(this, {
          confirmCallBack: () => {
            this.parent.saveTpl()
          },
          cancelCallBack: () => {
            // 调用了父级的initUpdate
            // this.parent.initUpDate()
            this.setAsyncChange(false)
            setOperate(obj.operate)
          }
        })
      } else {
        setOperate(obj.operate)
        return false
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getFormInfo () {
      return this.$refs.template_form.getFormInfo()
    },
    // 获取分类树
    getTemplateTree (parentId = 1, type = 1) {
      request('/platform-extend/classification/getDirectory', {
        parentId: parentId ? parentId : 1,
        type: type
      }).then(res => {
        this.menuList = res.data.classificationInnerRespList.filter(item => item.level === 1)
        // this.selectItem = this.menuList[0]
      })
    },
    // 树形菜单右键的一系列操作
    contextmenuAdd (node) { // 新建类别
      this.baseInfo = {}
      this.curNode = node
      this.optionType = 'createclass'
      this.dialogVisible = true
    },
    // 树形菜单右键的一系列操作
    contextmenuAddChildren (node) { // 新建
      this.baseInfo = {}
      this.curNode = node
      this.optionType = 'createchildren'
      this.dialogVisible = true
    },
    contextmenuAddItem (node) { // 新建
      this.baseInfo = {}
      this.diseaseObj = {
        defaultClassificationId: '',
        standardNumber: '',
        information: '',
        classList: [],
        otherclassList: [],
        classificationIdList: []
      }
      if (this.curNode.data.type === 1) {
        this.diseaseObj.classificationIdList.push({aliasName: '', pinyinCode: node.data.id})
      } else {
        this.diseaseObj.classList.push({aliasName: '', pinyinCode: ''})
      }
      this.curNode = node
      this.optionType = 'createproj'
      this.diseaseObj.defaultClassificationId = this.curNode.data.id
      this.addDiseasedialogVisible = true
      this.getClassification()
    },
    getClassification() { // 查询分类树
      let params = {
        type: this.$route.meta.type,
      }
      request('/platform-extend/classification/getClassification', params).then(res => {
        this.classTreeData = convertListToTree(changeToTreeList(res.data, {label: 'name', id: '_id', parentId: 'parentId'}))
      })
    },
    contextmenuEdit (node) { // 编辑模版名称和属性
      // 判断当前条目是项目or类别做相应处理
      this.baseInfo = node.data
      if (this.curNode.data.isDirectory) {
        this.getClassification()
        this.optionType = 'editproj'
        this.addDiseasedialogVisible = true
        this.diseaseObj.defaultClassificationId = node.data.defaultClassificationId
        this.diseaseObj.standardNumber = node.data.standardNumber
        this.diseaseObj.information = node.data.information
        this.diseaseObj.standardNumber = node.data.standardNumber
        this.diseaseObj.classList = node.data.classList
        if (this.curNode.data.type === 1) {
          this.diseaseObj.classificationIdList = node.data.list.map(item => {
            return {
              pinyinCode: item
            }
          })
        } else {
          if (!this.diseaseObj.classList.length) {
            this.diseaseObj.classList.push({aliasName: '', pinyinCode: ''})
          }
        }
      } else {
        this.optionType = 'editclass'
        this.dialogVisible = true
      }
    },
    contextmenuEditConfirm() {
      if (this.curNode.data.isDirectory) {  // 修改分类
        Object.assign(this.baseInfo, {level: this.curNode.data.level, systematization: this.curNode.data.systematization})
        let params = {
          type: this.$route.meta.type,
          innerReqList: [this.baseInfo]
        }
        request('/platform-extend/classification/updateById', params).then(res => {
          if (res.head.errCode === 0) {
            this.curNode.parent.loaded = false
            this.curNode.parent.expand()
            this.$message({
              type: 'success',
              message: '更新成功!'
            })
          }
        })
      } else {
        this.diseaseObj.information = ''
        this.diseaseObj.level = this.curNode.data.level
        this.diseaseObj.classificationIdList.push(this.diseaseObj.defaultClassificationId)
        Object.assign(this.baseInfo, this.diseaseObj)
        let params = {
          parentId: this.curNode.data.id,
          type: this.$route.meta.type,
          innerReqList: [this.baseInfo]
        }
        request('/platform-extend/project/updateProject', params).then(res => {
          if (res.head.errCode === 0) {
            this.curNode.parent.loaded = false
            this.curNode.parent.expand()
            this.$message({
              type: 'success',
              message: '更新成功!'
            })
          }
        })
      }
    },
    // 删除操作
    contextmenuRemove (node) {
      let curNode = this.curNode
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = node.data.isDirectory ? '/platform-extend/project/deleteProject' : '/platform-extend/classification/deleteById'
        request(url, {
          parentId: curNode.data.id,
          type: node.data.type,
          innerReqList: [{id: node.data.id}]
        }).then(res => {
          if (res.head.errCode === 0) {
            curNode.parent.loaded = false
            curNode.parent.expand()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      }).catch((e) => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    contextmenuUp (node, direction) { //
      let url = this.curNode.data.isDirectory === 0 ? 'classification/changeReorder' : '/project/changeReorder '
      request(`/platform-extend/${url}`, {
        parentId: this.curNode.data.parentId,
        id: this.curNode.data.id,
        numberOrder: this.curNode.data.orderNumber - 1,
        type: this.curNode.data.type
      }).then(res => {
        if (res.head.errCode === 0) {
          if (this.contextMenuArea === 'leftmenu') {
            this.node_had.childNodes = []// 把存起来的node的子节点清空，不然会界面会出现重复树！
            this.loadNode(this.node_had, this.resolve_had)// 再次执行懒加载的方法
          } else {
            this.curNode.parent.loaded = false
            this.curNode.parent.expand()
          }
          this.$message({
            type: 'success',
            message: '上移成功!'
          })
        }
      })
    },
    contextmenuDown (node, direction) { // 这里有bug上移移不动，下移移到底部了
      let url = this.curNode.data.isDirectory === 0 ? 'classification/changeReorder' : '/project/changeReorder '
      request(`/platform-extend/${url}`, {
        parentId: this.curNode.data.parentId,
        id: this.curNode.data.id,
        numberOrder: this.curNode.data.orderNumber + 1,
        type: this.curNode.data.type
      }).then(res => {
        if (res.head.errCode === 0) {
          if (this.contextMenuArea === 'leftmenu') {
            this.node_had.childNodes = []// 把存起来的node的子节点清空，不然会界面会出现重复树！
            this.loadNode(this.node_had, this.resolve_had)// 再次执行懒加载的方法
          } else {
            this.curNode.parent.loaded = false
            this.curNode.parent.expand()
          }
          this.$message({
            type: 'success',
            message: '下移成功!'
          })
        }
      })
    },
    contextmenuRename(node) { // 重命名
      this.renameText = node.data.name
      if (node.data.isDirectory) {
        this.optionType = 'renameproj'
      } else {
        this.optionType = 'renameclass'
      }
    },
  }
}
</script>
<style lang="scss" scoped>
@import './css/templatemanage.scss';
</style>
