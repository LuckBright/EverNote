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
            :id="this.templateId"
            :categoryCascaderList="categoryCascaderList"
            :isEdit="templateStatus"
            v-if="!isInterclinic && !isMember"
          ></follow-baseinfo>
          <el-main class="common-el common-no-border common-border-left">
            <el-container class>
              <!-- 中间部分-->
                <!-- :class="isInterclinic?'common-max-height':'common-auto-header-height'" -->
                <!-- var hash = isString(hash) ? hash : isNumber(hash) ? hash.toString() :$location.hash; -->
              <el-aside
                class="no-box-sha common-el common-no-border bgc-gray oi"
                :class="isInterclinic ?'common-max-height': isMember ? 'common-isMember-height':'common-auto-header-height'"
                width="520px"
              >
                <div class="common-box common-border-right mr-1">
                  <div class="common-header">
                    <span>阶段</span>
                    <!--
                    <el-button type="text" @click="createNode" v-if="isShow && !templateStatus && $hasPermission('Auth_menu_follow_settings')">增加阶段</el-button>
                    <el-button type="text" @click="createNode" v-if="!isShow && !templateStatus">增加阶段</el-button>
                    -->
                  </div>
                  <div class="common-content p0">
                    <el-tree
                      class="tree follow-template-tree"
                      ref="tree"
                      :indent="30"
                      :data="treeData"
                      :props="defProps"
                      node-key="_id"
                      :default-expanded-keys="defaultExpandedKeys"
                      :highlight-current="true"
                      :accordion="false"
                      @node-click="handleNodeClick"
                      @node-expand="changeExpandedKeys('expand', $event)"
                      @node-collapse="changeExpandedKeys('collapse', $event)"
                    >
                    <el-row class="tree-node" slot-scope="{node}">
                      <el-col :span="node.data.parentId ==='0' ? 8 : 24" class="clearfix">
                        <span class="fl mr10">
                          <i
                            class="icon iconfont icon-zhuyuan-yizhu-yizhix"
                            v-if="node.data.parentId !=='0' && node.data.executeStatus && (node.data.executeStatus === 3 || node.data.executeStatus === 4)"
                            :style="{color: showStatusColor(node.data.executeStatus)}"
                          ></i>
                          <i
                            class="circle-list"
                            v-if="node.data.parentId !=='0' && node.data.executeStatus && node.data.executeStatus !== 3 && node.data.executeStatus !== 4"
                            :class="showStatusIcon(node.data.executeStatus)"
                          ></i>
                        </span>
                        <span class="fl" v-if="node.data.parentId !=='0'">【{{node.data.category | filterMaterialType}}】</span>
                        <span class="white_line_wrap fz14 fl" :class="{ellipsis: node.data.parentId ==='0'}" v-if="node.data.parentId ==='0'">
                          {{node.data.name}}
                        </span>
                        <span class="white_line_wrap fz14 fl" :class="{ellipsis: node.data.parentId ==='0'}" v-else-if="node.data.contentType === 5">
                          {{JSON.parse(node.data.executeExtendJson).tenantDeptName}}-
                          {{JSON.parse(node.data.executeExtendJson).doctorName}}-
                          {{JSON.parse(node.data.executeExtendJson).serviceName}}
                        </span>
                        <span class="white_line_wrap fz14 fl" :class="{ellipsis: node.data.parentId ==='0'}" v-else>
                          {{node.data.name}}
                        </span>
                      </el-col>
                      <el-col :span="8" style="padding-left: 18px;" v-if="node.data.parentId ==='0'">
                          <span v-if="node.data.runMethod === 0 || node.data.runMethod === 3">{{node.data.runMethod | filterRunMethod}}</span>
                          <span v-else>{{node.data.dependTaskName}}</span>
                      </el-col>
                      <el-col :span="8" style="padding-left: 18px;" v-if="node.data.parentId ==='0'">
                        <span>{{node.data.executeTime ? $moment(node.data.executeTime).format('YYYY-MM-DD HH:mm') : '--'}}</span>
                      </el-col>
                    </el-row>
                    </el-tree>
                  </div>
                </div>
              </el-aside>
              <el-main
              class="common-el common-no-border bgc-fff common-border-left" 
              :class="isInterclinic ?'common-max-height': isMember ? 'common-isMember-height':'common-auto-header-height'">
              <follow-task-detail
                ref="materialDetail"
                :isShow="isShow"
                :subData="subData"
                :isEdit="taskPanel.pattern"
                :templateStatus="templateStatus"
              ></follow-task-detail>
              </el-main>
            </el-container>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import followTaskDetail from '@/follow/components/followtaskdetail.vue'
import followBaseinfo from '@/follow/page/template/followbaseinfo.vue'
import addFollowtemplate from '@/follow/page/template/add-follow-template.vue'
import addFollowmember from '@/follow/page/template/add-follow-member.vue'
import { pattern } from '@/follow/util/model'
import { request } from '@/util/req'
import urlMap from '@/util/urls'
import { debounce1 as debounce } from '@/util/common'
import { convertListToTree, getRootRoute } from '@/follow/util/fn'
import '@/follow/util/filters'
import '@/follow/assets/base.less'
import '@/follow/assets/index.less'
import storage from '@/util/storage'

export default {
  props: ['isInterclinic', 'isOpen', 'id', 'patientObj', 'isMember'],
  components: {
    followBaseinfo,
    addFollowmember,
    addFollowtemplate,
    followTaskDetail
  },
  // todo 如何解决页面先显示可输入状态，后显示不可输入状态的问题
  async created () {
    this.$emit('getTempId', this.templateId)
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
    return {
      patternType: '',
      dialogTitle: '',
      baseInfo: {},
      parentlightId: '', // 获取高亮显示的id阶段的id
      hightlightId: '', // 获取高亮显示的id阶段的id
      chooseId: '', // 当前选择的任务的id
      taskType: '', // 任务类型
      // 从外部引入的值
      pattern,
      // 任务表单
      // 当前页面信息
      pagePattern: pattern.VIEW, // 当前页面的模式
      templateId: '80b60cc4438d44dc81aef53188718918', // 模板id
      treeData: [],
      defProps: { children: 'childs', label: 'name' },
      defaultExpandedKeys: [],
      nodeData: {}, // 当前被选中的阶段数据
      node: {}, // 当前被选中的阶段node
      subData: '', // 当前被选中的任务子项数据
      subNode: '', // 当前被选中的任务子项node
      // 任务面板
      taskPanel: {
        pattern: '', // 任务面板当前类别 空时不展示内容，edit view create 分别展示不同内容
      },
      categoryCascaderList: [], // 分类级联数据
      remindMax: 0, // 提醒最大值
      saveLoading: false,
      categoryListSearched: false, // 分类已请求完成 标识
      templateSearched: false, // 模板已请求完成 标识
      tempOriginTaskFormModel: {}, // 临时存放 任务详情
      hideCancelButton: false,
      requestParams: '',
      templateStatus: 1,
      token: storage.getStorageByClinic('TOKEN'),
      saveType: 0,
      executeTypeId: '',
      nodeLength: 0,
      isShow: false,
      nodeId: ''// 阶段id
    }
  },
  watch: {
    'treeData': {
      handler (val) {
        this.$emit('getTree', val)
      },
      deep: true,
      immediate: true
    },
    'isOpen': {
      handler (val) {
        if (!val) {
          this.defaultExpandedKeys = []
          this.taskType = ''
          this.subData = ''
        } else {
          this.getTemplateId()
        }
      }
    },
    'templateId' (val) {
      this.$emit('getTempId', val)
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
        this.taskType = ''
        this.taskPanel.pattern = ''
        this.search()
      }
      if (!val && (this.isInterclinic || this.isMember)) {
        this.treeData = []
        this.taskPanel.pattern = ''
        this.taskType = ''
      }
    },
    startuse: debounce(function () {
      let params = {
        'categoryId': this.baseInfo.categoryId,
        'deptIsAll': this.baseInfo.deptIsAll,
        'deptList': this.baseInfo.deptList,
        'description': this.baseInfo.description,
        'id': this.treeData.id,
        'isOrg': false,
        'jobCreateTypeId': this.baseInfo.jobCreateTypeId,
        'name': this.baseInfo.name,
        'status': this.templateStatus ? 0 : 1 // 从详情读取到模板状态，没有的话为1
      }
      request(urlMap.follow.template.enable, params).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '保存成功!')
          this.templateStatus = !this.templateStatus
          this.templateStatus = this.templateStatus ? 1 : 0
        }
      })
    }),
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
    async search (type) {
      // const template = await request(urlMap.follow.template.detailById, { id: this.templateId })
      const template = await request(urlMap.follow.template.getByBusinessTemplateId, { businessTemplateId: this.templateId }, 'get')
      if (template.head.errCode === 0) {
        this.treeData = template.data
        // 阶段长度
        this.nodeLength = this.treeData.length || 0
        this.baseInfo = ''
        // 将节点数据改成树状数据
        /*
        this.treeData = this.treeData.map(item => ({
          ...item,
          _id: item.id,
          childs: (item.childs || []).map((task, i) => {
            return {
              ...task,
              _id: task.id,
              sortNo: String.fromCharCode(97 + i),
            }
          }),
          name: item.name
        }))
        */
        // 初始化树
        this.initTree()
        // 新建立任务的时候没有任务id，从阶段的id找到任务的id
        // 高亮
        // 新建的任务：高亮parentlightId（阶段id）的最后一个任务id
        if (type === 1) {
          if (!this.parentlightId) {
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey(this.chooseId)
              this.subNode = this.$refs.tree.getNode(this.chooseId)
              if (this.subNode) {
                this.subData = this.subNode.data
              }
            })
            this.defaultExpandedKeys = [...this.defaultExpandedKeys.filter(item => item !== this.hightlightId), this.hightlightId]
            this.hideCancelButton = true
          } else {
            let array = this.treeData.filter(item => {
              return item.id === this.parentlightId
            })[0]
            if (array && array.childs && array.childs[0]) {
              let nodeObj = array.childs[array.childs.length - 1]
              this.hightlightId = nodeObj.id
              // 回显高亮的任务
              this.taskPanel.pattern = pattern.VIEW
              this.subData = nodeObj
              // 为表单赋值
            }
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey(this.hightlightId)
              this.subNode = this.$refs.tree.getNode(this.hightlightId)
              if (this.subNode) {
                this.subData = this.subNode.data
              }
            })
            this.defaultExpandedKeys = [...this.defaultExpandedKeys.filter(item => item !== this.parentlightId), this.parentlightId]
            this.hideCancelButton = true
          }
        }
        this.templateSearched = true
        // 给表单赋值
        // 模板基本信息
        if (this.isInterclinic || this.isMember) {
          this.templateStatus = 0
        } else {
          this.templateStatus = 1
        }
      }
    },
    /* 点击子节点执行 */
    handleNodeClick (data, node) {
      this.saveType = 0
      // 根据点击的节点信息显示右侧内容
      if (node.isLeaf) {
        this.taskPanel.pattern = pattern.VIEW
        this.node = node.parent
        if (this.node) {
          this.nodeData = node.parent.data
        }
        this.subData = data
        this.subNode = node
      } else {
        this.taskPanel.pattern = ''
      }
    },
    changeExpandedKeys (type, event) {
      if (type === 'expand') {
        // 增加一个节点
        this.defaultExpandedKeys = [...this.defaultExpandedKeys.filter(item => item !== event._id), event._id]
      } else if (type === 'collapse') {
        // 减少一个节点
        this.defaultExpandedKeys = this.defaultExpandedKeys.filter(item => item !== event._id)
      }
    },
    /* 取消保存 */
    cancel () {
      if (this.taskPanel.pattern === pattern.EDIT) {
        this.taskPanel.pattern = pattern.VIEW
      } else if (this.taskPanel.pattern === pattern.CREATE) {
        this.taskPanel.pattern = ''
      }
    },
    initTree () {
      this.treeData = this.treeData.map((item, i) => ({
        ...item,
        sortNo: i + 1,
      }))
    }
  }
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
.tree-node .el-col {
  line-height: 24px;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  width: 140px !important;
}
</style>
