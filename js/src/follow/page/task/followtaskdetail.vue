<template>
  <div class="common-inner follow-task-detail">
    <el-container style="overflow-y: auto;min-height: 712px;">
      <el-main class="common-el bgc-fff">
        <el-container class="h">
          <el-aside class="no-box-sha common-el common-no-border h bgc-dark" width="300px">
            <div class="common-box common-no-border-left">
              <div class="common-header">随访任务</div>
              <!-- <div>
                id:
                <br>
                {{this.id}}
                <br>taskID:
                <br>
                {{this.id}}
                <br>transferId:
                <br>
                {{this.id}}
                <br>
              </div>-->
              <div class="common-content patient_base pl20">
                <div class="common-content" v-if="taskObj">
                  <div>{{taskObj.name||''}}</div>
                  <div class="cGray99 mt6">任务生成时间：{{taskObj.createTime || ''}}</div>
                  <div class="mt13">{{taskObj.executeStatus | showStatusText}}</div>
                  <ul class="task_circle">
                    <li v-for="item in circleData" :key="item.id">
                      <i
                        v-if="item === 3 || item === 4"
                        class="icon iconfont icon-zhuyuan-yizhu-yizhix fz14"
                        :style="{color: showStatusColor(item)}"
                      ></i>
                      <i
                        v-else
                        class="circle-list"
                        :class="showStatusIcon(item)"
                        :style="{color: showStatusColor(item)}"
                      ></i>
                    </li>
                    <li>{{materialJbSubCount}} / {{circleData[0] ? circleData.length : 0}}</li>
                  </ul>
                  <div v-if="taskObj.executeStatus === 0">
                      <el-button
                        type="primary"
                        class="w80"
                        @click="startTemplateJobById"
                        v-ever-click-once="startFlag"
                        :disabled="startFlag"
                      >审核通过</el-button>
                      <el-button
                        class="stop_task_btn w100"
                        @click="cancleTemplateJobById"
                        v-ever-click-once="cancleFlag"
                        :disabled="cancleFlag"
                      >审核不通过</el-button>
                  </div>
                  <div v-if="taskObj.executeStatus === 2">
                    <el-button class="stop_task_btn w80" @click="stopTemplateJobById">取消随访</el-button>
                  </div>
                </div>
              </div>
            </div>
            <div class="common-box common-no-border-left">
              <div class="common-header common-border-top">基本信息</div>
              <div class="common-content patient_base">
                <el-row>
                  <el-col :span="6">姓名：</el-col>
                  <el-col :span="16">
                    <el-tooltip
                      class="item"
                      popper-class="task-popper-follow"
                      effect="dark"
                      :content="taskObj.resourceName"
                      placement="top-start"
                    >
                      <a
                        style="color: #217DE3;"
                        class="ellipsis"
                        :href="this.$ever.crmIndex + '/crm/memberinfo/userinfo/memberbaseinfo/' + taskObj.resourceId"
                        target="_blank"
                      >{{taskObj.resourceName}}</a>
                    </el-tooltip>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">年龄：</el-col>
                  <el-col :span="16"><label v-if="taskObj.extendInfo">{{taskObj.extendInfo.age || ''}}</label></el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">性别：</el-col>
                  <el-col :span="16">
                    <sys-value type="GBT.2261.1" v-if="taskObj.extendInfo" :code="taskObj.extendInfo.sex"></sys-value>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">科室：</el-col>
                  <el-col :span="16">{{taskObj.tenantDeptName || '--'}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">电话：</el-col>
                  <el-col :span="16"><label v-if="taskObj.extendInfo">{{taskObj.extendInfo.mobile | filterPhone(taskObj.extendInfo.mobile)}}</label></el-col>
                </el-row>
              </div>
            </div>
          </el-aside>
          <el-main class="common-el common-no-border common-border-left bgc-fff">
            <el-container class="h">
              <el-aside class="no-box-sha common-el common-no-border h bgc-gray oi" width="520px">
                <div class="common-box common-border-right mr-1">
                  <div class="common-header">阶段</div>
                  <div class="common-content p0">
                    <el-tree
                      class="tree follow-template-tree"
                      ref="tree"
                      :indent="20"
                      :data="nodeList"
                      :props="defProps"
                      node-key="id"
                      :default-expanded-keys.sync="defaultExpandedKeys"
                      :expand-on-click-node="true"
                      :highlight-current="true"
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
                        <template v-else>
                          <span class="white_line_wrap fz14 fl" :class="{ellipsis: node.data.parentId ==='0'}" v-if="node.data.contentType === 5">
                            {{getJsonName(node.data.executeExtendJson)}}
                          </span>
                          <span class="white_line_wrap fz14 fl" :class="{ellipsis: node.data.parentId ==='0'}" v-else>
                            {{node.data.name}}
                          </span>
                        </template>
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
              <!-- taskObj:主任务；executeObj:子任务 -->
              <el-main class="common-el common-no-border common-border-left h execute_warp">
                <div class="common-box" style="height:calc(100% - 130px)">
                  <div class="common-header">
                    <span v-if="isShow && !isOpen">{{executeObj.name}}</span>
                    <el-tooltip
                      v-if="isShow && isOpen"
                      popper-class="task-popper-follow"
                      class="item"
                      effect="dark"
                      :content="executeObj.name"
                      placement="top"
                    >
                      <span class="ellipsis">{{executeObj.name}}</span>
                    </el-tooltip>
                    <task-log :id="saveRecordId || recordId" v-if="isShow && id" :value="executeObj.exeInstances"></task-log>
                  </div>
                  <div class="common-content h100 pl20" v-if="isShow">
                    <div class="mb20 clearfix" v-if="isShow && executeObj.executeStatus === 1 && taskObj.executeStatus !== 0">
                      <el-button
                        class="fz14 fl"
                        type="primary"
                        @click="startExecuteMaterialJobById"
                        v-ever-click-once="startExecute"
                        :disabled="startExecute"
                      >
                      执行任务</el-button>
                      <el-button
                        class="stop_task_btn fz14 fl"
                        @click="cancleExecuteMaterialJobById"
                        v-ever-click-once="cancleExecute"
                        :disabled="cancleExecute"
                      >
                        取消任务</el-button>
                    </div>
                    <div class="do_task_content">
                      <el-form :model="executeObj" class="myform" label-width="90px">
                        <el-form-item label="任务类型：">
                          <label>{{executeObj.category | filterMaterialType}}</label>
                        </el-form-item>
                        <el-form-item label="执行方式：">
                          <label>{{executeObj.executeMethod | filterSendType}}</label>
                        </el-form-item>
                        <el-form-item label="发送时间：">
                          <label>{{executeObj.executeTime || '--'}}</label>
                        </el-form-item>
                        <el-form-item label="任务内容：" v-if="executeObj.category !== 4">
                          <label v-if="executeObj.executeJson">{{executeObj.executeJson}}</label>
                          <div v-if="executeObj.executeExtendJson">
                            <p v-if="executeObj.category === 3"><video v-if="JSON.parse(executeObj.executeExtendJson).url" :src="JSON.parse(executeObj.executeExtendJson).url" controls="controls" width="300" height="200"></video></p>
                            <template v-if="executeObj.category === 5">
                              <p v-if="executeObj.contentType === 4"><img v-if="JSON.parse(executeObj.executeExtendJson).picture" :src="JSON.parse(executeObj.executeExtendJson).picture" width="300"/></p>
                              <span v-if="executeObj.contentType === 5">
                                {{JSON.parse(executeObj.executeExtendJson).tenantDeptName}} - 
                                {{JSON.parse(executeObj.executeExtendJson).doctorName}} - 
                                {{JSON.parse(executeObj.executeExtendJson).serviceName}}
                              </span>
                            </template>
                          </div>
                        </el-form-item>
                        <el-form-item label="是否循环：" v-if="executeObj.isLoop">
                          <label>{{executeObj.isLoop ? '是' : '否'}}</label>
                        </el-form-item>
                        <el-form-item label="任务周期：" v-if="executeObj.isLoop">
                          <label>{{executeObj.periodDay}} 天</label>
                        </el-form-item>
                        <el-form-item label="执行时间：" v-if="executeObj.isLoop">
                          <label>{{executeObj.periodFrequency.hour + ':' + executeObj.periodFrequency.minute}}</label>
                        </el-form-item>
                        <el-form-item label="执行频次：" v-if="executeObj.isLoop">
                          <label>每 {{executeObj.periodFrequency.day }} 天 / 次</label>
                        </el-form-item>
                        <el-form-item label="任务执行：" v-if="executeObj.isLoop">
                          <ever-table
                          class="recordslog"
                          :columns="recordsColumns"
                          :is-record-url-params="false"
                          :show-index="false"
                          :data="executeObj.exeInstances"
                          ></ever-table>
                        </el-form-item>
                      </el-form>
                    </div>
                    <!-- 问卷 -->
                    <div v-if="executeObj.category === 4" style="height:100%;">
                      <iframe
                        v-if="!iframeBoxLoading && executeObj && executeObj.executeExtendJson"
                        :src="`${this.$ever.host}${followMap.preview}${executeObj.executeExtendJson}/1/1/1`"
                        width="100%"
                        height="100%"
                        style="min-height:600px;"
                        frameborder="0"
                      ></iframe>
                      <div v-if="executeObj.executeStatus === 4">此任务已取消</div>
                      <!-- <div v-if="executeObj.status===4">此任务已完成</div> -->
                      <!-- 问卷记录 -->
                    </div>
                  </div>
                </div>
              </el-main>
            </el-container>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import ageRangePicker from '@/components/agerangepicker'
import taskLog from '@/follow/page/task/tasklog.vue'
import { listDestValue } from '@/util/common'
import { materialStatus, taskStatus, jobTypeList, followMap } from '@/follow/util/model'
import taskSetting from '@/follow/components/task-setting.vue'
import { request } from '@/util/req'
import urlMap from '@/util/urls'

export default {
  props: ['id', 'isOpen'],
  data () {
    return {
      sendFlag1: false,
      sendFlag2: false,
      finishExecute: false,
      saveExecute: false,
      cancleExecute: false,
      startExecute: false,
      startFlag: false,
      cancleFlag: false,
      iframeWin: null,
      iframeBoxLoading: false,
      executeTypeId: 2,
      today: this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      remark: '',
      followMap,
      url: urlMap.follow.material.detailById,
      materialStatus,
      jobTypeList,
      params: {},
      taskId: '',
      taskObj: {}, // 任务对象
      nodeList: [], // 任务树
      defProps: { children: 'childs', label: 'name', templateNodeId: 'templateNodeId', number: 'number' },
      defaultExpandedKeys: [], // 任务节点 end
      executeRecord: [],
      recordId: '',
      executeObj: {},
      circleData: [],
      materialJbSubList: [],
      materialJbSubParams: {
        materialJobId: '',
        currentPage: 1,
        pagesize: 10,
        status: ''
      },
      materialJbSubCount: 0,
      saveRecordId: '',
      isAllover: true,
      isShow: true,
      stopDisabled: false,
      transferId: '',
      subtaskId: this.$route.query.subtaskId, // 子任务管理传输过来的子任务id
      remarkObj: {
        remark: ''
      },
      rules: {
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' },
          { min: 2, max: 500, message: '长度在 2 到 500 个字符', trigger: 'blur' }
        ]
      },
      recordsColumns: [
        {
          prop: 'executeTime',
          label: '预计任务执行时间',
        },
        /*
        {
          prop: 'executorName',
          label: '执行人',
        },
        {
          prop: 'executeType',
          label: '执行方式',
          formatter: ({ value }) => listDestValue(executeTypeList, value)
        },
        */
        {
          prop: 'executeStatus',
          label: '执行状态',
          formatter: ({ value }) => listDestValue(taskStatus, value)
        }
      ]
    }
  },
  filters: {
    filterPhone: function (value) {
      if (!value) return ''
      value = value.toString().replace(/ /g, '')
      if (value.length === 11) {
        value = value.substr(0, 3) + ' ' + value.substr(3, 4) + ' ' + value.substr(7, 4)
      } else {
        return value
      }
      return value
    },
    showStatusText (value) {
      if (!value) {
        return ''
      }
      let arr = taskStatus.filter(item => {
        return item.id === value
      })
      if (arr[0]) {
        return arr[0].name
      }
    },
    showStatusColor (value) {
      if (!value) {
        return ''
      }
      let arr = taskStatus.filter(item => {
        return item.id === value
      })
      if (arr[0]) {
        return arr[0].color
      }
    },
    showStatusIcon (value) {
      if (!value) {
        return ''
      }
      let arr = taskStatus.filter(item => {
        return item.id === value
      })
      if (arr[0]) {
        return arr[0].icon
      }
    }
  },
  watch: {
    'isOpen' (val) {
      if (!val) {
        this.transferId = ''
        this.taskId = ''
      }
    },
    'id' (val) {
      if (val) {
        this.transferId = val
        this.taskId = val
        this.search(this.transferId)
        this.defaultExpandedKeys = []
        this.recordId = ''
        this.saveRecordId = ''
      }
    }
  },
  mounted () {
    // 监听问卷是否提交成功，一旦提交成功就刷新任务状态
    window.addEventListener('message', this.getListen, false)
  },
  destroyed () {
    window.removeEventListener('message', this.getListen)
  },
  created () {
    this.transferId = this.id
    this.taskId = this.$route.params.id || this.transferId
    this.search(this.taskId)
  },
  methods: {
    getJsonName (val) {
      return val ? JSON.parse(val).tenantDeptName + '-' + JSON.parse(val).doctorName + '-' + JSON.parse(val).serviceName : '--'
    },
    getListen (e) {
      if (e.data && e.data.from === 'Survey' && e.data.type === 'submit-success') {
        // console.log('来自子组件,问卷提交成功的通知')
        this.search(this.taskId)
      }
    },
    async sendMessage () {
      const res = await request(urlMap.follow.material.startExecuteMaterialJobMsgById, { id: this.recordId })
      if (res.head.errCode === 0) {
        this.$messageTips(this, 'success', '发送成功', '提示')
        this.search(this.taskId)
      }
    },
    /*
    isOvertime (followuptime, remindTime) {
      let remindTime1 = this.$moment(Math.abs(remindTime)).format('YYYY-MM-DD HH:mm:ss') // 提醒时间
      let followuptime1 = this.$moment(Math.abs(followuptime)).format('YYYY-MM-DD HH:mm:ss') // 设定时间
      let isRemind = moment(remindTime1).isBefore(this.today) // 取反就是提醒时间
      let isFollow = moment(followuptime1).isBefore(this.today) // 取反就是未到设定时间
      // 计算时间差距
      let ftdays = dateDiff(Math.abs(followuptime), new Date().getTime(), true)
      //  计算颜色
      if (!isRemind) { // 未到提醒时间灰色
        return ['#DEDEDE', '#ffffff', ftdays, isRemind, isFollow]
      } else if (isRemind && !isFollow) {  // 提醒时间已到，未到设定时间，显示为绿色背景。
        return ['#00B636', '#ffffff', ftdays, isRemind, isFollow]
      } else if (isRemind && isFollow && ftdays === 0) { // 提醒时间已到，设定时间与此刻时间相等, 显示为绿色背景。。
        return ['#00B636', '#ffffff', ftdays, isRemind, isFollow]
      } else if (isRemind && isFollow && ftdays <= 7 && ftdays > 0) { // 设定时间已过，不超过7天，显示为黄色背景。
        return ['#FF9C00', '#ffffff', ftdays, isRemind, isFollow]
      } else if (isRemind && isFollow && ftdays > 7) { // 超过7天为红色。
        return ['rgba(238,68,51,0.6)', '#ffffff', ftdays, isRemind, isFollow]
      }
    },
    */
    async search (id) {
      if (!id) return
      this.circleData = []
      this.materialJbSubCount = 0
      const task = await request(urlMap.follow.task.detailById, { businessInstanceId: id }, 'get')
      if (task.head.errCode === 0 && task.data) {
        this.taskObj = task.data
        this.nodeList = task.data.tasks
        if (this.nodeList[0] && this.nodeList[0].childs[0]) {
          if (!this.recordId) {
            this.recordId = this.subtaskId || this.nodeList[0].childs[0].id
          }
          this.nodeList.map(item => {
            item.childs.map(node => {
              if (node.executeStatus === 3) {
                this.materialJbSubCount++
              }
              this.circleData.push(node.executeStatus)
            })
          })
          this.$nextTick(_ => {
            this.getRecord(this.recordId)
            const node = this.$refs.tree.getNode(this.recordId)
            if (node && node.parent && node.parent.data) {
              this.defaultExpandedKeys = [...this.defaultExpandedKeys.filter(item => item !== node.parent.data.id), node.parent.data.id]
            }
            this.$refs.tree.setCurrentKey(this.recordId)
          })
        }
      }
    },
    async getRecord (id) {
      this.executeObjexecuteObj = {}
      this.iframeBoxLoading = true
      const record = await request(urlMap.follow.task.getById, { id: id }, 'get')
      if (record.head.errCode === 0 && record.data) {
        this.executeObj = record.data
        setTimeout(() => {
          this.iframeBoxLoading = false
        }, 100)
      }
    },
    handleNodeClick (data, nodeKey) {
      if (nodeKey.isLeaf) {
        this.isShow = true
        this.recordId = data.id
        this.saveRecordId = data.id
        this.getRecord(this.recordId)
      } else {
        this.isShow = false
      }
    },
    changeExpandedKeys (type, event) {
      if (type === 'expand') {
        // 增加一个节点
        this.defaultExpandedKeys = [...this.defaultExpandedKeys.filter(item => item !== event.id), event.id]
      } else if (type === 'collapse') {
        // 减少一个节点
        this.defaultExpandedKeys = this.defaultExpandedKeys.filter(item => item !== event.id)
      }
    },
    // 审核通过一个任务
    async startTemplateJobById () {
      const res = await request(urlMap.follow.task.checkMaster, { businessInstanceId: this.taskId, isApprove: true })
      if (res.head.errCode === 0) {
        this.$messageTips(this, 'success', '审核成功', '提示')
        this.search(this.taskId)
      }
    },
    async cancleTemplateJobById () {
      const res = await request(urlMap.follow.task.checkMaster, { businessInstanceId: this.taskId, isApprove: false })
      if (res.head.errCode === 0) {
        this.$messageTips(this, 'success', '驳回成功', '提示')
        this.search(this.taskId)
      }
    },
    async stopTemplateJobById () {
      if (this.taskObj.executeStatus === 2) {
        const res = await request(urlMap.follow.task.stopMasterTask, { id: this.taskId })
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '取消成功', '提示')
          this.search(this.taskId)
        }
      }
    },
    // 开始执行
    async startExecuteMaterialJobById () {
      if (this.recordId) {
        const res = await request(urlMap.follow.task.runTask, { id: this.recordId })
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '任务执行成功', '提示')
          this.remarkObj.remark = ''
          this.search(this.taskId)
        }
      }
    },
    // 取消任务
    async cancleExecuteMaterialJobById () {
      if (this.recordId) {
        const res = await request(urlMap.follow.task.stopTask, { id: this.recordId })
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '任务取消成功', '提示')
          this.search(this.taskId)
        }
      }
    },
    showStatusText (value) {
      if (!value) {
        return ''
      }
      let arr = taskStatus.filter(item => {
        return item.id === value
      })
      if (arr[0]) {
        return arr[0].name
      }
    },
    showStatusColor (value) {
      if (!value) {
        return ''
      }
      let arr = taskStatus.filter(item => {
        return item.id === value
      })
      if (arr[0]) {
        return arr[0].color
      }
    },
    showStatusIcon (value) {
      if (!value) {
        return ''
      }
      let arr = taskStatus.filter(item => {
        return item.id === value
      })
      if (arr[0]) {
        return arr[0].icon
      }
    }
  },
  components: { ageRangePicker, taskLog, taskSetting }
}
</script>

<style scoped>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  width: 140px !important;
}
.follow-task-detail .iconfont {
  font-size: 14px;
}
.follow-task-detail /deep/ .el-button .icon {
  vertical-align: inherit;
}
.h100 {
  height: 100%;
}
.mt6 {
  margin-top: 6px;
}
.mt13 {
  margin-top: 13px;
}
.mt15 {
  margin-top: 15px;
}
.mr6 {
  margin-right: 6px;
}
.mr14 {
  margin-right: 14px;
}
.mr10 {
  margin-right: 10px;
}
.mr20 {
  margin-right: 20px;
}
.mb10 {
  margin-bottom: 10px;
}
.pd0 {
  padding: 0px;
}
.pl20 {
  padding-left: 20px !important;
}
.fz14 {
  font-size: 14px;
  vertical-align: middle;
}
.patient_base .el-row {
  height: 36px;
}
.patient_base .el-row .el-col:nth-child(1) {
  color: #999999;
  text-align: right;
}
.patient_base .el-row .el-col:nth-child(2) {
  text-align: left;
}

/*.base_warp{background: #EEEEED;}*/
/*.task_warp{background: #F8F9FA;}*/
.execute_warp {
  background: #ffffff;
}

.bGray {
  background: #dedede !important;
}
.bGreen {
  background: #00b636 !important;
}
.bPink {
  background: #ee4433 !important;
  opacity: 0.6;
}
.bBlue {
  background: #1dbcb6 !important;
}
.bOrange {
  background: #ff9c00 !important;
}
.bRed {
  background: Red !important;
}
.cGray {
  color: #dedede;
} /* 未开始 */
.cGreen {
  color: #00b636;
} /* 执行完成（带icon） */
.cPink {
  color: #ee4433;
  opacity: 0.6;
}
.cBlue {
  color: #1dbcb6;
} /* 取消执行 */
.cOrange {
  color: #ff9c00;
} /* 执行中 */

.task_circle {
  padding: 0px;
}
.task_circle li {
  display: inline-block;
  margin-left: 3px;
}
/* 小圆点样式 */
.circle-list {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 7px;
  font-size: 14px;
  vertical-align: middle;
}

.stop_task_btn {
  background: #fcfdfe;
  border: 1px solid #217de3;
}
.stop_task_btn span {
  color: #217de3;
  border-radius: 2px;
}

.w80 {
  width: 80px;
}
.w100 {
  width: 100px;
}
.w140 {
  width: 140px;
}
.cGray99 {
  color: #999999;
}
.cGrayA5 {
  color: #a5a5a5;
}

.el-tree {
  margin-top: 10px;
}
.tree-node .el-col {
  line-height: 24px;
}
.tree-node .el-col .ellipsis {width:140px !important;}

.el-tree-node__content /deep/ .el-tree-node__expand-icon {
  color: #000000;
}
.el-tree-node__children /deep/ .el-icon-caret-right {
  display: none;
}

.task_stagg_time span:first-child {
  display: inline-block;
  width: 86px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  border-radius: 2px;
  margin-right: 23px;
  color: #ffffff;
}
.el-tree-node__children /deep/ .tree-node {
  margin-left: 35px;
}
.el-tree {
  background: #f8f9fa;
}

.tree /deep/ .el-tree-node__content {
  border-bottom: none;
}
.remark {
  border: 1px solid #c0ccd9;
  border-radius: 2px;
  outline: none;
  width: 360px;
  height: 125px;
  margin-bottom: 18px;
  margin-top: 7px;
}
.remark /deep/ .el-textarea__inner {
  resize: none;
  border: none;
  width: 360px;
  height: 125px;
}
.task_content {
  margin: 12px 0 23px 35px;
}
.do_task_btns {
  margin-top: 10px;
  margin-bottom: 20px;
}
.execute-table /deep/ .el-table {
  border-left: none;
  border-right: none;
  border-top: none;
}
.execute-table /deep/ th {
  background-color: #f0f5fa;
  height: 36px;
}
.execute-table /deep/ .el-table th.is-leaf {
  border: none;
}
.execute-table /deep/ .el-table td {
  border-bottom: 1px solid #d0dbe4;
  height: 35px;
}
.remark-form {
  margin-left: 0;
  width: 360px;
}
.el-button + .el-button {
  margin-left: 6px;
}
.el-form-item {
  margin-bottom: 8px;
}
.el-form:not(.custom-form)
  .el-form-item:not(.custom-form-item)
  .el-form-item__content
  .el-form-item__error {
  margin-top: -11px;
}
.common-box > .common-content {
  padding: 20px 10px 30px 10px;
}
.el-button.el-button--default {
  color: #217de3;
}
.img-wid{width:100px; height:100px;}

.myform /deep/ .el-form-item__label {min-height: 40px; line-height: 40px; font-weight: bold;}
.recordslog {line-height: 24px; width: 723px;}
</style>
