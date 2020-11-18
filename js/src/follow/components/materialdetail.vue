<template>
  <div class="common-box h" style="width: 100%;height: 100%;padding:0px;">
      <div class="common-header">
        <!-- <span>{{acceptData.name}}</span> -->
        <span v-if="acceptData.category === 5 && [3, 4].includes(acceptData.contentType)">【商品】{{acceptData.name}}</span>
        <span v-if="acceptData.category === 5 && 5 === acceptData.contentType">【商品】{{JSON.parse(acceptData.executeExtendJson).tenantDeptName}}-{{acceptData.modifyUserName}}-{{JSON.parse(acceptData.executeExtendJson).serviceName}}</span>
        <span v-if="acceptData.category === 3">【患教】{{acceptData.name}}</span>
        <span v-if="acceptData.category === 4">【问卷/量表】{{acceptData.name}}</span>
        <span v-if="acceptData.category === 1">【通知】{{acceptData.name}}</span>
        <el-button
          v-if="acceptData.name && !templateStatus && $hasPermission('Auth_menu_follow_settings')"
          type="text"
          @click="delTask()"
        >删除本任务</el-button>
      </div>
      <div class="common-content" v-if="taskPanel.pattern" style="height: 100%;">
        <div class="iframebox" v-if="categoryType === 1" style="width: 100%;height: 100%;">
           <el-form :model="acceptData" class="myform" label-position="left" label-width="92px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="任务分类">
                  <label>{{acceptData.category | filterMaterialType}}</label>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="发送通道" prop="sendType">
                  <label>{{acceptData.executeMethod | filterSendType}}</label>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="任务内容">
                  <div v-if="taskPanel.pattern === pattern.VIEW">{{acceptData.executeJson}}</div>
                  <div v-else>
                    <el-input  
                      type="textarea"
                      :rows="2"
                      placeholder="请输入内容"
                      :minlength="2"
                      :maxlength="120"
                      v-model="acceptData.executeJson"
                    >
                    </el-input>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="任务执行">
                  <task-setting :value.sync="taskObj" :status="taskPanel.pattern === pattern.EDIT && !templateStatus"></task-setting>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <template v-if="taskPanel.pattern === pattern.VIEW">
                  <el-button
                    size="small"
                    type="primary"
                    @click="switchBtn"
                    v-if="!templateStatus && $hasPermission('Auth_menu_follow_settings')"
                  >编辑</el-button>
                </template>
                <template v-if="taskPanel.pattern === pattern.EDIT">
                  <el-button size="small" type="primary" @click="saveTask('edc')">保存</el-button>
                  <el-button v-if="!templateStatus" size="small" @click="cancel">取消</el-button>
                </template>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="iframebox" v-if="categoryType === 3" style="width: 100%;height: 100%;">
           <el-form :model="acceptData" class="myform" label-position="left" label-width="92px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="任务分类">
                  <label>{{acceptData.category | filterMaterialType}}</label>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="发送通道" prop="sendType">
                  <label>{{acceptData.executeMethod | filterSendType}}</label>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="任务内容">
                  <img :src="JSON.parse(acceptData.executeExtendJson).coverUrl" class="img-wid">
                  <div v-if="taskPanel.pattern === pattern.VIEW">{{acceptData.executeJson}}</div>
                  <div v-else>
                    <el-input  
                      type="textarea"
                      :rows="2"
                      placeholder="请输入内容"
                      :minlength="2"
                      :maxlength="120"
                      v-model="acceptData.executeJson"
                    >
                    </el-input>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <template v-if="taskPanel.pattern === pattern.VIEW">
                  <el-button
                    size="small"
                    type="primary"
                    @click="switchBtn"
                    v-if="!templateStatus && $hasPermission('Auth_menu_follow_settings')"
                  >编辑</el-button>
                </template>
                <template v-if="taskPanel.pattern === pattern.EDIT">
                  <el-button size="small" type="primary" @click="saveTask('edc')">保存</el-button>
                  <el-button v-if="!templateStatus" size="small" @click="cancel">取消</el-button>
                </template>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="iframebox" v-if="categoryType === 4" style="width: 100%;height: 100%;">
          <el-form :model="acceptData" class="myform" label-position="left" label-width="92px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="任务分类:">
                  <label>{{acceptData.category | filterMaterialType}}</label>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="发送通道:" prop="sendType">
                  <label>{{acceptData.executeMethod | filterSendType}}</label>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="acceptData.executorId">
                <el-form-item label="任务执行人:">
                  <label class="mr10">{{acceptData.executorName}}</label>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="!acceptData.executorId">
                <el-form-item label="推送内容:" prop="title">
                  <label>{{acceptData.executeJson}}</label>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <iframe
            v-if="!iframeBoxLoading"
            :src="`${this.$ever.host}${followMap.preview}${acceptData.executeExtendJson}/1/1/1`"
            width="100%"
            height="100%"
            frameborder="0"
          ></iframe>
        </div>
        <div class="iframebox" v-if="categoryType === 5" style="width: 100%;height: 100%;">
          <el-form :model="acceptData" class="myform" label-position="left" label-width="92px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="任务分类">
                  <label>{{acceptData.category | filterMaterialType}}</label>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="发送通道" prop="sendType">
                  <label>{{acceptData.executeMethod | filterSendType}}</label>
                </el-form-item>
              </el-col>
              <!-- 挂号 -->
              <el-col :span="12" v-if="acceptData.contentType === 5">
                <el-form-item label="任务内容">
                  <template v-if="taskPanel.pattern === pattern.VIEW">
                    <label>{{JSON.parse(acceptData.executeExtendJson).orgName}}</label><br>
                    <label>{{JSON.parse(acceptData.executeExtendJson).tenantDeptName}}</label><br>
                    <label>{{JSON.parse(acceptData.executeExtendJson).serviceName}}</label>
                  </template>
                  <template v-if="taskPanel.pattern === pattern.EDIT">
                    <ever-org-select ref="eos" v-model="orgObj" type="select" @change="changeOrg" placeholder="请选择挂号机构"></ever-org-select>
                    <ever-subject-select v-model="dptObj" :params="params" type="select" :disabled="disabledsubject" placeholder="请选择挂号科室"></ever-subject-select>
                    <el-select
                      v-model="serviceId"
                      popper-class="follow-select-down"
                      placeholder="请选择服务类型"
                      filterable
                      clearable
                      :disabled="disabledsubject"
                      @change="changeService">
                      <el-option
                        v-for="item in serviceList"
                        :value="item.id"
                        :key="item.id"
                        :label="item.name">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
              <!-- 商城商品 -->
              <el-col :span="24" v-if="[3, 4].includes(acceptData.contentType)">
                <el-form-item label="任务内容">
                  <img v-if="acceptData.contentType === 3" :src="JSON.parse(acceptData.executeExtendJson).picture" class="img-wid">
                  <div v-if="taskPanel.pattern === pattern.VIEW">{{acceptData.executeJson}}</div>
                  <div v-else>
                    <el-input  
                      type="textarea"
                      :rows="2"
                      placeholder="请输入内容"
                      :minlength="2"
                      :maxlength="120"
                      v-model="acceptData.executeJson"
                    >
                    </el-input>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <template v-if="taskPanel.pattern === pattern.VIEW">
                  <el-button
                    size="small"
                    type="primary"
                    @click="switchBtn"
                    v-if="!templateStatus && $hasPermission('Auth_menu_follow_settings')"
                  >编辑</el-button>
                </template>
                <template v-if="taskPanel.pattern === pattern.EDIT">
                  <el-button size="small" type="primary" @click="saveTask('goods')">保存</el-button>
                  <el-button v-if="!templateStatus" size="small" @click="cancel">取消</el-button>
                </template>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="iframebox" v-if="categoryType === 6">
          <iframe
            :src="this.$ever.html5Index + '/html5/registerform'"
            width="100%"
            height="100%"
            frameborder="0"
          ></iframe>
        </div>
      </div>
  </div>
</template>
<script>
import { validateSpace } from '@/follow/util/fn'
import { pattern, followMap } from '@/follow/util/model'
import { request } from '@/util/req'
import urlMap from '@/util/urls'
import storage from '@/util/storage'
import selectTaskUser from '@/follow/components/select-task-user.vue'
import taskSetting from '@/follow/components/task-setting.vue'
import '@/follow/util/filters'
import '@/follow/assets/base.less'
import '@/follow/assets/index.less'

export default {
  props: ['isShow', 'subData', 'isEdit', 'templateStatus'],
  data () {
    const formRules = {
      name: [
        { required: true, message: '必填项', trigger: ['blur', 'change'], validator: validateSpace },
        { min: 2, max: 50, message: '请输入2-50个字符', trigger: 'change' },
      ],
      content: [
        { required: true, message: '必填项', trigger: ['blur', 'change'], validator: validateSpace },
        { min: 2, max: 500, message: '请输入2-500个字符', trigger: 'change' },
      ],
    }
    const appointRules = {
      orgObj: [
        { required: true, message: '请选择挂号机构名', trigger: ['blur', 'change'], type: 'object', fields: { id: { required: true, message: '请选择挂号机构名', trigger: ['blur', 'change'] } } }
      ],
      deptObj: [
        { required: true, message: '请选择挂号科室', trigger: ['blur', 'change'], type: 'object', fields: { id: { required: true, message: '请选择挂号科室', trigger: ['blur', 'change'] } } }
      ],
      serviceObj: [
        { required: true, message: '请填选择服务类型', trigger: 'change', type: 'object' }
      ]
    }
    return {
      pattern,
      formRules,
      appointRules,
      categoryType: '',
      taskPanel: {
        pattern: '', // 任务面板当前类别 空时不展示内容，edit view create 分别展示不同内容
      },
      serviceList: [],
      contentType: '',
      token: storage.getStorageByClinic('TOKEN'),
      disabledsubject: true,
      iframeBoxLoading: false,
      params: {},
      displayName: this.$store.state.currentUser.displayName,
      orgData: {},
      deptObj: {},
      followMap,
      edcEdit: false,
      orgObj: {},
      dptObj: {},
      serviceId: '',
      serviceName: '',
      taskObj: {
        isLoop: false,
        cycleDays: '',
        periodFrequency: {
          day: '',
          hour: '',
          minute: '',
        },
        cycleExecuteTimeStr: ''
      },
      acceptData: {},
      rules: {
        optional: [
          {required: false}
        ],
        required: [
          { required: true, message: '必填项', trigger: ['change'] }
        ],
        requiredArray: [
          { required: true, message: '必填项', trigger: ['change'], type: 'array' }
        ]
      }
    }
  },
  watch: {
    'subData': {
      handler (val) {
        this.acceptData = {...val}
        this.iframeBoxLoading = true
        this.getData()
        setTimeout(_ => {
          this.iframeBoxLoading = false
        }, 100)
      },
      deep: true
    },
    'acceptData.executeExtendJson': {
      handler (val) {
        if (this.category === 5) {
          let orgId = val && JSON.parse(val).orgId
          if (orgId) {
            this.disabledsubject = false
          } else {
            this.disabledsubject = true
            this.serviceList = []
          }
        }
      },
      deep: true
    }
  },
  created () {
    this.taskPanel.pattern = this.isEdit
    this.$bus.$on('notsaveSuccess', val => {
      if (val) {
        this.taskPanel.pattern = pattern.VIEW
      }
    })
  },
  methods: {
    /* 点击任务的编辑按钮 */
    switchBtn () {
      // 通知父节点不要进行其他操作
      this.$emit('changeEidt', true)
      this.taskPanel.pattern = pattern.EDIT
       // 记录此时表单的值，点击取消时，恢复表单
      if (this.contentType === 5) {
        this.getServiceList(JSON.parse(this.acceptData.executeExtendJson).orgId)
        this.orgObj = JSON.parse(this.acceptData.executeExtendJson).orgId
        this.dptObj = JSON.parse(this.acceptData.executeExtendJson).tenantDeptId
        this.serviceId = JSON.parse(this.acceptData.executeExtendJson).serviceId
        this.serviceName = JSON.parse(this.acceptData.executeExtendJson).serviceName
      }
    },
    /* 取消保存 */
    cancel () {
      this.$emit('cancel', true)
      if (this.taskPanel.pattern === pattern.EDIT) {
        this.taskPanel.pattern = pattern.VIEW
        if (this.contentType === '4') {
        } else if (this.contentType === '8') {
          this.edcEdit = false
        } else {
          this.taskPanel.pattern = pattern.VIEW
        }
      } else if (this.taskPanel.pattern === pattern.CREATE) {
        this.taskPanel.pattern = ''
      }
    },
    saveTask (type) {
      this.acceptData.activeName = type
      this.acceptData.pattern = 'EDIT'
      if (this.acceptData.category === 5) {
        if (this.acceptData.contentType === 5) {
          let tempObj = {
            orgId: this.orgObj.id,
            orgName: this.orgObj.name,
            tenantDeptId: this.dptObj.id,
            tenantDeptName: this.dptObj.orgSubjectName,
            serviceId: this.serviceId,
            serviceName: this.serviceName,
          }
          this.acceptData.executeExtendJson = JSON.stringify(Object.assign(JSON.parse(this.acceptData.executeExtendJson), tempObj))
        }
      }
      if (this.acceptData.category === 1) {
        let periodFrequency = {
          periodDay: this.taskObj.cycleDays,
          periodFrequency: {
            day: this.taskObj.cycleSeparateDays,
            hour: this.taskObj.cycleExecuteTimeHour,
            minute: this.taskObj.cycleExecuteTimeMin,
          },
          isLoop: this.taskObj.isLoop
        }
        Object.assign(this.acceptData, periodFrequency)
      }
      this.$emit('editData', this.acceptData)
    },
    getData () {
      this.taskPanel.pattern = this.isEdit
      let data = this.acceptData
      this.categoryType = data.category
      this.contentType = data.contentType
      if (data.category === 1) {
        this.taskObj.isLoop = data.isLoop
        this.taskObj.cycleDays = data.periodDay
        if (data.periodFrequency) {
          this.taskObj.cycleExecuteTimeStr = data.periodFrequency.hour + ':' + data.periodFrequency.minute
          this.taskObj.cycleSeparateDays = data.periodFrequency.day
          this.taskObj.cycleExecuteTimeHour = data.periodFrequency.hour
          this.taskObj.cycleExecuteTimeMin = data.periodFrequency.minute
        }
      }
    },
    getServiceList (orgId) {
      request(urlMap.arrangeServiceList, { orgId: orgId, searchType: 2, serviceClassification: '799' }).then(rs => {
        if (rs && rs.data) {
          this.serviceList = rs.data
        } else {
          this.serviceId = ''
          this.serviceList = []
        }
      })
    },
    changeOrg (val) {
      if (val && val.id) {
        this.params = {
          orgIdList: [val.id],
          orgId: val.id
        }
        this.orgName = val.name
        this.disabledsubject = false
        this.getServiceList(val.id)
      } else {
        this.disabledsubject = true
        this.orgName = ''
      }
    },
    changeService (val) {
      this.serviceList.filter(item => {
        if (item.id === this.serviceId) {
          this.serviceName = item.name
        }
        return item
      })
    },
    delTask () {
      this.$emit('delTask', true)
    },
  },
  components: { selectTaskUser, taskSetting }
}
</script>
<style lang="less" scoped>
.w700 {width: 700px;}
.myform /deep/ .el-form-item__label {min-height: 40px; line-height: 40px; font-weight: bold;}
.iframebox {height:100%}
.wid40{width: 60px;}
.img-wid{width:100px; height:100px;}
</style>
