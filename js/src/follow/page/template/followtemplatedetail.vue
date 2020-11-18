<template>
  <div class="common-inner">
    <!-- 模板只有停用了才能编辑 -->
    <el-container>
      <el-header class="common-el bgc-fff common-no-border-bottom" v-if="!isInterclinic && !isMember">
        <div class="common-box">
          <div class="common-header h60">
            <div>
              <el-button size="small" @click="backTo">返回</el-button>
            </div>
            <!-- 启用的模板才能存为个人模板 -->
            <div v-if="isShow">
              <el-button size="small" @click="saveAsPersonal" v-if="templateStatus && $hasPermission('Auth_menu_follow_personaltemplate')">存为个人模版</el-button>
              <el-button size="small" @click="startuse" v-if="templateStatus && $hasPermission('Auth_menu_follow_settings')">停用</el-button>
              <el-button size="small" @click="startuse" v-if="!templateStatus && $hasPermission('Auth_menu_follow_settings')">启用</el-button>
              <el-button size="small" @click="del" v-if="$hasPermission('Auth_menu_follow_settings')">删除模板</el-button>
            </div>
            <div v-if="!isShow">
              <el-button size="small" @click="startuse" v-if="templateStatus">停用</el-button>
              <el-button size="small" @click="startuse" v-if="!templateStatus">启用</el-button>
              <el-button size="small" @click="del">删除模板</el-button>
            </div>
          </div>
        </div>
        <div></div>
      </el-header>
      <el-main class="common-el">
        <el-container class="bgc-fff">
          <!-- 左侧部分-->
          <!-- 诊间预约左侧模板 -->
          <add-followtemplate
            v-if="isInterclinic"
            @getTemplateId="getTemplateId"
            :patientObj="patientObj"
            :isOpen="isOpen"
          ></add-followtemplate>
          <!-- 诊间预约左侧模板 -->
          <add-followmember
            v-if="isMember"
            @getTemplateId="getTemplateId"
            :patientObj="patientObj"
            :isOpen="isOpen"
          ></add-followmember>
          <!-- 模板详情基础信息 -->
          <follow-baseinfo
            :isShow="isShow"
            :id="this.templateObj.id"
            :categoryCascaderList="categoryCascaderList"
            :isEdit="templateStatus"
            v-if="!isInterclinic && !isMember"
            @updateBaseInfo="updateBaseInfo"
          ></follow-baseinfo>
          <el-main class="common-el common-no-border common-border-left">
            <el-container class>
              <el-aside
                class="no-box-sha common-el common-no-border bgc-gray oi"
                :class="isInterclinic ?'common-max-height': isMember ? 'common-isMember-height':'common-auto-header-height'"
                width="450px"
              >
                <div class="common-box common-border-right mr-1">
                  <div class="common-header">
                    <span>阶段</span>
                    <el-button type="text" @click="createNode" v-if="isShow && !templateStatus && $hasPermission('Auth_menu_follow_settings')">增加阶段</el-button>
                    <el-button type="text" @click="createNode" v-if="!isShow && !templateStatus">增加阶段</el-button>
                  </div>
                  <div class="common-content p0">
                    <el-tree
                      class="tree follow-template-tree"
                      ref="tree"
                      :indent="30"
                      :data="treeData"
                      :props="defProps"
                      node-key="id"
                      :default-expanded-keys="defaultExpandedKeys"
                      :highlight-current="true"
                      :accordion="false"
                      @node-click="handleNodeClick"
                      @node-expand="changeExpandedKeys('expand', $event)"
                      @node-collapse="changeExpandedKeys('collapse', $event)"
                    >
                      <span class="tree-node" slot-scope="{node, data}">
                        <span class="pl10" v-if="data.parentId === '0'">
                          <span>{{data.name}}</span>
                          <span v-if="data.runMethod === 0">随计划启动</span>
                          <span v-if="data.runMethod === 1">依赖{{data.dependTaskName}}启动</span>
                          <span>{{data.dependTaskName}}
                            <span class="ml10" v-if="data.dependPeriodJson">{{JSON.parse(data.dependPeriodJson).day}}天{{JSON.parse(data.dependPeriodJson).hour}}时{{JSON.parse(data.dependPeriodJson).minute}}分 以后</span>
                          </span>
                          <span v-if="data.runMethod === 3">自定义</span>
                        </span>
                        <span class="pl10" v-else>
                          <span v-if="data.category === 5 && [3, 4].includes(data.contentType)">【商品】{{data.name}}</span>
                          <span v-if="data.category === 5 && 5 === data.contentType">【商品】{{JSON.parse(data.executeExtendJson).tenantDeptName}}-{{data.modifyUserName}}-{{JSON.parse(data.executeExtendJson).serviceName}}</span>
                          <span v-if="data.category === 3">【患教】{{data.name}}</span>
                          <span v-if="data.category === 4">【问卷/量表】{{data.name}}</span>
                          <span v-if="data.category === 1">【通知】{{data.name}}</span>
                        </span>
                        <span class="fr" v-if="data.parentId === '0' &&!templateStatus">
                          <span class="pr20">{{data.childs.length || 0}}项</span>
                          <el-dropdown trigger="click" v-if="isShow ? $hasPermission('Auth_menu_follow_settings') : true" @command="handleCommand(data, node, $event)">
                            <span class="el-dropdown-link">
                              <i class="icon iconfont icon-shenpi_zhankai cGray"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item command="edit">编辑</el-dropdown-item>
                              <el-dropdown-item command="del">删除</el-dropdown-item>
                              <el-dropdown-item command="addSub">增加任务</el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                        </span>
                      </span>
                    </el-tree>
                  </div>
                </div>
              </el-aside>
              <el-main
              class="common-el common-no-border bgc-fff common-border-left" :class="isInterclinic ?'common-max-height': isMember ? 'common-isMember-height':'common-auto-header-height'">
              <material-detail
              ref="materialDetail"
              :isShow="isShow"
              :subData="subData"
              :isEdit="taskPanel.pattern"
              :templateStatus="templateStatus"
              @editData="sendData"
              @delTask="delTask"
              @changeEidt="changeEidt"
              @cancel="cancelEdit"
              ></material-detail>
              </el-main>
            </el-container>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
    <dialog-addSub ref="addSub" :isShow="isShow" :nodeId="nodeId" @sendData="sendData"></dialog-addSub>
    <dialog-create ref="createStep"
    @update="search"
    :patternType="patternType"
    :title="dialogTitle"
    :nodeLength="nodeLength"
    :previousId="previousId"
    :templateName="baseInfo.name">
    </dialog-create>
  </div>
</template>

<script>
import dialogCreate from '@/follow/components/dialog-create'
import materialDetail from '@/follow/components/materialdetail'
import followBaseinfo from '@/follow/page/template/followbaseinfo.vue'
import dialogAddSub from '@/follow/page/template/dialog-addSub.vue'
import addFollowtemplate from '@/follow/page/template/add-follow-template.vue'
import addFollowmember from '@/follow/page/template/add-follow-member.vue'
import { pattern, pattern2 } from '@/follow/util/model'
import { request } from '@/util/req'
import urlMap from '@/util/urls'
import { debounce1 as debounce } from '@/util/common'
import {
  convertListToTree,
  transferSchema, getRootRoute, validateSpace
} from '@/follow/util/fn'
import '@/follow/util/filters'
import '@/follow/assets/base.less'
import '@/follow/assets/index.less'
import storage from '@/util/storage'

export default {
  props: ['isInterclinic', 'isOpen', 'id', 'patientObj', 'isMember'],
  components: {
    dialogAddSub,
    followBaseinfo,
    addFollowtemplate,
    dialogCreate,
    addFollowmember,
    materialDetail },
  // todo 如何解决页面先显示可输入状态，后显示不可输入状态的问题
  async created () {
    // 如果是个人模板页面，isShow就是false,其他情况都为true（会员、诊间、个人模板）
    if (this.$route.path.includes('follow/personaltemplate/detail')) {
      this.isShow = false
    } else {
      this.isShow = true
    }
    // updatedFollowIsShow
    this.$bus.$off('followup:isShow')
    this.$bus.$on('followup:isShow', val => {
      if (val === '1') {
        this.isShow = false
      } else {
        this.isShow = true
      }
    })
    // 获取模板分类
    request(urlMap.follow.syscode.findByTypeId, { typeId: 5 }).then(res => {
      if (res.head.errCode === 0) {
        this.categoryCascaderList = convertListToTree((res.data || []).map(item => ({
          ...item, value: item.id, label: item.name,
        })))
        this.categoryListSearched = true
      }
    })
    // 模板id从导航中拿或者从父组件传进来
    if (this.isInterclinic || this.isMember) {
      this.getTemplateId()
    } else {
      this.templateId = this.$route.params.id
    }
    if (this.templateId && this.templateId !== '-1') {
      this.pagePattern = pattern.VIEW // 查看
      // 查询模板信息
      this.search()
    } else {
      this.pagePattern = pattern.CREATE // 创建
    }
  },
  data () {
    const taskSchema = [
      {
        label: '任务类型',
        name: 'contentType', // 任务类型ID;当前固定为1，表示事件提醒
        comp: 'readonlyitem',
        props: {
          filter: 'filterJobType',
          filterParams: ['indent'],
        },
      },
      {
        label: '任务名称',
        name: 'name',
        props: {
          filter: 'filterIndentValue',
          placeholder: '请填写任务名称'
        },
      },
      {
        label: '任务内容',
        name: 'content',
        comp: 'textarea',
        props: {
          rows: 4,
          filter: 'filterIndentValue',
          placeholder: '请填写任务内容'
        },
      },
    ]
    const taskRules = {
      name: [
        { required: true, message: '必填项', trigger: ['blur', 'change'], validator: validateSpace },
        { min: 2, max: 50, message: '请输入2-50个字符', trigger: 'change' },
      ],
      content: [
        { required: true, message: '必填项', trigger: ['blur', 'change'], validator: validateSpace },
        { min: 2, max: 500, message: '请输入2-500个字符', trigger: 'change' },
      ],
    }
    const taskFormModel = this.$ever.createObjFromSchema(taskSchema)
    const appointSchema = [
      {
        label: '任务名称',
        name: 'name', // 任务类型ID;当前固定为1，表示事件提醒
        comp: 'custom',
      },
      {
        label: '任务内容',
        name: 'orgId',
        comp: 'custom',
      },
      {
        label: '',
        name: 'deptId',
        comp: 'custom'
      },
      {
        label: '',
        name: 'serviceId',
        comp: 'custom'
      }
    ]
    const appointRules = {
      orgId: [
        { required: true, message: '请选择挂号机构名', trigger: 'change' }
      ],
      deptId: [
        { required: true, message: '请选择挂号科室', trigger: 'change' }
      ],
      serviceId: [
        { required: true, message: '请填选择服务类型', trigger: 'change' }
      ]
    }
    const edcSchema = [
      {
        label: '分类',
        name: 'name', // 任务类型ID;当前固定为1，表示事件提醒
        comp: 'custom',
      },
      {
        label: '商品类型',
        name: 'contentType',
        comp: 'custom'
      },
      {
        label: '发送通道',
        name: 'sendType',
        comp: 'custom'
      },
      {
        name: 'title',
        comp: 'custom'
      }
    ]
    const appointForm = this.$ever.createObjFromSchema(appointSchema)
    const edcForm = this.$ever.createObjFromSchema(edcSchema)
    return {
      patternType: '',
      dialogTitle: '',
      baseInfo: {},
      hightlightId: '', // 获取高亮显示的id阶段的id
      // 从外部引入的值
      pattern,
      // 任务表单
      taskFormModel,
      taskSchema,
      taskRules,
      // 当前页面信息
      pagePattern: pattern.VIEW, // 当前页面的模式
      pagePattern2: pattern2.VIEW, // 当前页面的模式
      templateId: '', // 模板id
      templateObj: {  // 模板对象
        childs: [],
      },
      treeData: [],
      defProps: { children: 'childs', label: 'name' },
      defaultExpandedKeys: [],
      nodeData: {}, // 当前被选中的阶段数据
      node: {}, // 当前被选中的阶段node
      subData: {}, // 当前被选中的任务子项数据
      subNode: {}, // 当前被选中的任务子项node
      // 任务面板
      taskPanel: {
        pattern: '', // 任务面板当前类别 空时不展示内容，edit view create 分别展示不同内容
      },
      categoryCascaderList: [], // 分类级联数据
      remindMax: 0, // 提醒最大值
      saveLoading: false,
      categoryListSearched: false, // 分类已请求完成 标识
      tempOriginTaskFormModel: {}, // 临时存放 任务详情
      activeName: '',
      urlcontent: '',
      urlname: '',
      materialId: '', // 素材id
      templateStatus: 0,
      token: storage.getStorageByClinic('TOKEN'),
      saveType: 0,
      executeTypeId: '',
      nodeLength: 0,
      previousId: '',
      isShow: false,
      appointSchema,
      appointForm,
      appointRules,
      planForm: {},
      edcSchema,
      edcForm,
      contentType: '',
      nodeId: '', // 阶段id
      questionData: {},
      noticeData: {},
    }
  },
  watch: {
    'templateObj': {
      handler (val) {
        this.nodeLength = val.childs.length || 0
        if (val && val.childs && val.childs[0]) {
          this.previousId = val.childs[val.childs.length - 1].id
        }
        this.$emit('getTree', val)
      },
      deep: true,
      immediate: true
    },
    'isOpen': {
      handler (val) {
        if (!val) {
          this.defaultExpandedKeys = []
          this.subData = {}
        } else {
          this.getTemplateId()
        }
      }
    }
  },
  methods: {
    openCreateStep (val) {
      if (val) {
        this.$refs.createStep.open(val)
      } else {
        this.$refs.createStep.open()
      }
    },
    getTemplateId (val) {
      if (val && (this.isInterclinic || this.isMember)) {
        this.templateId = val
        this.taskPanel.pattern = ''
        this.search()
      }
      if (!val && (this.isInterclinic || this.isMember)) {
        this.templateObj = {
          nodeInfoList: []
        }
        this.taskPanel.pattern = ''
      }
    },
    startuse: debounce(function () {
      let params = {
        'id': this.$route.params.id,
        'status': Number(!this.templateStatus)
      }
      request(urlMap.follow.template.enable, params).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '保存成功!')
          this.templateStatus = Number(!this.templateStatus)
        }
      })
    }),
    sendData (val) {
      // console.log('sendData', val)
      this.contentType = val.contentType ? val.contentType : ''
      this.saveType = 1
      this.activeName = val.activeName
      this.taskPanel.pattern = val.pattern
      if (this.activeName === 'questionnaire') {
        Object.assign(this.questionData, val)
        this.saveTask(1)
        return false
      } else if (this.activeName === 'notice') {
        Object.assign(this.noticeData, val)
        this.saveTask(1)
        return false
      }
      if (val.activeName === 'goods') {
        if ([3, 4, 5].includes(val.contentType)) {
          Object.assign(this.planForm, val)
          this.saveTask(1)
        }
        return false
      } else if (val.activeName === 'edc') {
        Object.assign(this.edcForm, val)
        this.saveTask(1)
        return false
      }
    },
    /* 新建或编辑子任务 */
    saveTask (type) {
      // 素材materialId从哪里拿
      // const childUUid = U()
      if (this.activeName === 'questionnaire') { // 问卷(只有创建和删除)
        // 增加阶段 走编辑pattern.EDIT   增加任务时候走创建
        if (this.taskPanel.pattern === pattern.CREATE) {
          this.createTask()
        }
      }
      if (this.activeName === 'notice') { // 通知
        this.createTask()
      }
      if (this.activeName === 'goods') { // 商品
        this.createTask()
      }
      if (this.activeName === 'edc') {
        this.createTask()
      }
    },
    createTask () {
      const params = {
        businessTemplateId: this.templateId,
        businessTemplateName: this.baseInfo.name,
      }
      if (this.activeName === 'questionnaire') {
        Object.assign(params, this.questionData)
      }
      if (this.activeName === 'notice') {
        let tempObj = {
          name: this.noticeData.name,
          parentId: this.noticeData.parentId,
          executeMethod: this.noticeData.sendType,
          executeJson: this.noticeData.content,
          isLoop: this.noticeData.isLoop,
          periodDay: this.noticeData.cycleDays,
          category: 1,
          periodFrequency: {
            hour: this.noticeData.cycleExecuteTimeHour,
            minute: this.noticeData.cycleExecuteTimeMin,
            day: this.noticeData.cycleSeparateDays
          }
        }
        Object.assign(params, tempObj)
      } else if (this.activeName === 'goods') {
        Object.assign(params, this.planForm)
      } else if (this.activeName === 'edc') {
        Object.assign(params, this.edcForm)
      }
      this.saveLoading = true
      params.id ? params.id : delete params.id
      request(urlMap.follow.scheduledtask[params.id ? 'modify' : 'create'], params).then(res => {
        this.saveLoading = false
        if (res.head.errCode === 0) {
          this.templateId = res.data.businessTemplateId
          this.$messageTips(this, 'success', '保存成功!')
          this.taskPanel.pattern = pattern.VIEW
          this.$refs.addSub.close()
          this.$refs.addSub.cancelInner()
        }
        this.$bus.$emit('notsaveSuccess', true)
        this.search(res.data)
      })
    },
    backTo () {
      if (this.pagePattern === pattern.CREATE || this.pagePattern === pattern.EDIT) {
        this.$confirm('您的模板尚未保存，是否确定离开？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.back()
        })
      } else {
        this.back()
      }
    },
    back () {
      if (this.isShow) {
        this.$router.push(getRootRoute.bind(this)() + '/follow/template')
      } else {
        this.$router.push(getRootRoute.bind(this)() + '/follow/personaltemplate')
      }
    },
    del () {
      this.$confirm('模板删除后将无法恢复，是否继续操作？', '提示', {
        confirmButtonText: '继续删除',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        request(urlMap.follow.template.delTemplateById, { id: this.templateId }).then(res => {
          if (res.head.errCode === 0) {
            this.$messageTips(this, 'success', '删除成功!')
            this.back()
          }
        })
      })
    },
    async search (val) {
      const template = await request(urlMap.follow.scheduledtask.getByBusinessTemplateId, { businessTemplateId: this.templateId }, 'get')
      if (template.head.errCode === 0) {
        this.treeData = template.data
        this.nodeLength = template.data && template.data.length || 0
        if (val) {
          this.defaultExpandedKeys = [val.parentId]
          this.$nextTick(_ => {
            this.$refs.tree.setCurrentKey(val.id)
            this.handleNodeClick(val, this.$refs.tree.getNode(val.id))
          })
        }
        if (this.isInterclinic || this.isMember) {
          this.templateStatus = 0
        } else {
          setTimeout(_ => {
            this.templateStatus = this.baseInfo.status
          }, 300)
        }
      }
    },
    updateBaseInfo (val) {
      this.baseInfo = val.baseInfo
    },
    async getDetailById (val) {
      const template = await request(urlMap.follow.template.detailById, { id: this.templateId })
      this.baseInfo = template.data.baseInfo
    },
    /* 点击子节点执行 */
    handleNodeClick (data, node) {
      this.saveType = 0
      // if (this.taskPanel.pattern === pattern.EDIT || this.taskPanel.pattern === pattern.CREATE) {
      //   this.$messageTips(this, 'error', '请先保存任务!')
      //   return false
      // }
      // 根据点击的节点信息显示右侧内容
      if (node.isLeaf) {
        this.subData = data
        this.subNode = node
        this.contentType = data.contentType
        this.taskPanel.pattern = pattern.VIEW
      } else {
        this.taskPanel.pattern = ''
        this.changeExpandedKeys('expand', this.$refs.tree.$event)
      }
    },
    changeExpandedKeys (type, event) {
      if (type === 'expand') {
        this.defaultExpandedKeys = this.defaultExpandedKeys.filter(item => item !== event.id)
      } else if (type === 'collapse') {
        this.defaultExpandedKeys = this.defaultExpandedKeys.filter(item => item !== event.id)
      }
    },
    /* 新增阶段 */
    createNode () {
      if (this.taskPanel.pattern === pattern.EDIT || this.taskPanel.pattern === pattern.CREATE) {
        this.$messageTips(this, 'error', '请先保存任务!')
        return false
      }
      this.patternType = pattern.CREATE
      this.dialogTitle = '新增阶段'
      this.openCreateStep()
      // 此时应该将右侧任务面板置为空
      this.taskPanel.pattern = ''
    },
    /* 操作节点，编辑，删除，增加子任务 */
    handleCommand (data, node, command) {
      // console.log(data, 'data')
      if (this.taskPanel.pattern === pattern.EDIT || this.taskPanel.pattern === pattern.CREATE) {
        this.$messageTips(this, 'error', '请先保存任务!')
        return
      }
      this.nodeData = data
      this.node = node
      if (command === 'edit') {
        this.patternType = pattern.EDIT
        this.dialogTitle = '编辑阶段'
        this.$nextTick(_ => {
          this.openCreateStep(data)
        })
        this.taskPanel.pattern = ''
      } else if (command === 'del') {
        this.$confirm('阶段删除后，阶段下的任务也将一并删除，是否继续操作？', '提示', {
          confirmButtonText: '继续删除',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          if (this.isInterclinic || this.isMember) {
            this.$messageTips(this, 'success', '删除成功', '提示')
          } else {
            request(urlMap.follow.scheduledtask.delete, { id: data.id }).then(res => {
              if (res.head.errCode === 0) {
                this.$messageTips(this, 'success', '删除成功', '提示')
                this.search()
              }
            })
          }
        })
      } else if (command === 'addSub') {
        this.nodeId = data.id
        this.$refs.addSub.open()
        this.taskFormModel.contentType = '1'
        this.taskFormModel.name = ''
        this.taskFormModel.content = ''
      }
    },
    /* 点击任务的编辑按钮 */
    switchBtn () {
      this.taskPanel.pattern = pattern.EDIT
      // 记录此时表单的值，点击取消时，恢复表单
      Object.assign(this.tempOriginTaskFormModel, this.taskFormModel)
      this.tempOriginTaskFormModel.taskUser = {
        executeTypeId: this.taskFormModel.executeTypeId,
        templateNodeMaterialDoctorDtos: this.taskFormModel.templateNodeMaterialDoctorDtos
      }
      this.taskSchema = this.transferSchema(this.taskSchema, 'taskFormModel')
    },
    // 删除当前任务
    delTask () {
      this.$confirm('任务删除后将无法恢复，是否继续操作？', '提示', {
        confirmButtonText: '继续删除',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.taskPanel.pattern = ''
        request(urlMap.follow.scheduledtask.delete, { id: this.subData.id }).then(res => {
          if (res.head.errCode === 0) {
            this.$messageTips(this, 'success', '删除成功!')
            this.subData = {}
            this.getDetailById()
            this.search()
          }
        })
      })
    },
    /* 取消保存 */
    cancel () {
      if (this.taskPanel.pattern === pattern.EDIT) {
        this.taskPanel.pattern = pattern.VIEW
        this.taskSchema = this.transferSchema(this.taskSchema, 'taskFormModel', true)
      } else if (this.taskPanel.pattern === pattern.CREATE) {
        this.taskPanel.pattern = ''
      }
    },
    transferSchema (_schema, formModel, toView = false) {
      if (formModel === 'tplFormModel') {
        const categoryListItem = _schema.find(item => item.name === 'categoryList' || item.originName === 'categoryList')
        categoryListItem.originName = 'categoryList'
        if (toView) {
          categoryListItem.name = 'categoryObjList'
        } else {
          categoryListItem.name = 'categoryList'
        }
      }
      return transferSchema(_schema, toView)
    },
    saveAsPersonal () {
      request(urlMap.follow.template.createPersonal, { id: this.templateId }).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '保存成功!')
        }
      })
    },
    changeEidt () {
      this.taskPanel.pattern = pattern.EDIT
    },
    cancelEdit () {
      this.taskPanel.pattern = pattern.VIEW
    }
  },
}
</script>

<style scoped lang="less">
.searchquestion {
  margin: 20px auto;
  width: 350px;
}
.searchquestion_input {
  width: 260px;
}
.searchquestion el-table {
  margin: 0 auto;
}
.btngroup {
  width: 100%;
  text-align: center;
}
.btnwidth {
  width: 120px;
  margin: 10px;
}
.iframebox {
  // width: 400px;
  height: 700px;
  margin: 0 auto;
}
.el-dropdown-menu {
  z-index: 39999 !important;
}
.el-select-dropdown {
  z-index: 5000 !important;
}
</style>
