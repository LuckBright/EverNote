<template>
  <el-dialog
    :visible.sync="visible"
    :close-on-click-modal="false"
    class="ui_dialog_02 spe add-sub"
    width="1000px"
  >
    <template slot="title"></template>
    <el-dialog
      width="1000px"
      :visible.sync="innerVisible"
      :close-on-click-modal="false"
      class="ui_dialog_02 spe inneradd"
      append-to-body
    >
      <template slot="title">
        <i data-v-f4a6a122 class="el-icon-arrow-left" @click="cancelInner"></i>
        <span>{{"问卷/量表详情"}}</span>
      </template>
      <div class="inner-execute">
        <span v-if="activeName === 'questionnaire'">
          <span>执行方式</span>
          <el-radio v-model="innerExecute" :label="2">患者执行</el-radio>
          <el-radio v-model="innerExecute" :label="1">医护人员执行</el-radio>
        </span>
        <span>
          <el-button type="primary"
          size="small" class="btnwidth"
          v-ever-click-once="disabled"
          :disabled="disabled"
          @click="saveinnerTask">添加</el-button>
          <el-button size="small" plain class="btnwidth" @click="cancelInner">取消</el-button>
        </span>
      </div>
      <!-- 问卷 -->
      <div class="inner-iframebox" v-if="activeName === 'questionnaire'">
        <iframe
          :src="`${this.$ever.host}${followMap.preview}${sendParams.executeExtendJson}/1/1/1`"
          width="100%"
          height="100%"
          frameborder="0"
        ></iframe>
      </div>
    </el-dialog>
    <el-tabs v-model="activeName">
      <el-tab-pane label="问卷/量表" name="questionnaire">
        <el-container class="common-inner">
          <el-aside class="no-box-sha common-el common-no-border mr20" width="200px">
            <short-follow-syscode @nodeClick="shorthandleNodeClick"></short-follow-syscode>
          </el-aside>
          <el-main class="common-el common-no-border">
            <el-row type="flex">
              <el-col :span="8">
                <div class="searchquestion">
                  <el-input size="small" placeholder="请输入问卷/量表名称" v-model="searchcontent">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                  </el-input>
                </div>
              </el-col>
              <el-col :span="8">
                <el-select size="small" v-model="searchType" class="ml10">
                  <el-option label="集团" :value="0"></el-option>
                  <el-option label="个人" :value="1" v-if="$route.name === 'personaltplDetail'"></el-option>
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-button type="primary" size="small" @click="goSearch">查询</el-button>
              </el-col>
            </el-row>
            <el-table
              class="question-table-list"
              :data="tableData"
              border
              :key="reflash"
              v-loading.body="loading"
            >
              <el-table-column prop label align="center" width="50px">
                <template slot-scope="scope">
                  <el-radio v-model="sendParams.materialId" :label="scope.row.id" @change="handleCheck(scope.row)"></el-radio>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="问卷/量表" align="left">
                <template slot-scope="scope">
                  <div class="view" @click="handleCheck(scope.row, 1)">{{scope.row.name}}</div>
                </template>
              </el-table-column>
            </el-table>
            <el-row type="flex" justify="end">
              <el-col :span="24" align="right">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="current"
                  :page-sizes="pagesizes"
                  :page-size="pagesize"
                  layout="total, sizes, prev, pager, next"
                  :total="totalCount">
                </el-pagination>
              </el-col>
            </el-row>
            <el-form :model="sendParams" ref="firstForm" class="mt20" label-position="top" key="firstForm">
              <el-form-item label="任务接收人" prop="doctorId" :rules="messageRules.optional">
                <select-task-user ref="task" :value.sync="taskUser"></select-task-user>
              </el-form-item>
              <el-form-item label="发送通道" v-show="taskUser.executeTypeId === 2">
                <el-radio-group v-model="sendParams.executeMethod">
                  <el-radio :label="1">短信</el-radio>
                  <el-radio :label="2">微信</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item prop="executeJson" :rules="messageRules.content" v-if="taskUser.executeTypeId === 2">
                <el-input type="textarea" :rows="5" v-model.trim="sendParams.executeJson" maxlength="120" minlength="2" placeholder="请填写标题"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" class="btnwidth" v-ever-click-once="disabled" :disabled="disabled" @click="saveTask">添加</el-button>
                <el-button type="primary" size="small" plain class="btnwidth" @click="cancel">取消</el-button>
              </el-form-item>
            </el-form>
          </el-main>
        </el-container>
      </el-tab-pane>
      <el-tab-pane label="商品" name="goods">
        <push-goods ref="goods" :nodeId="nodeId" @update="updateGoods"></push-goods>
        <div class="mb20 mt20">
          <el-button
            type="primary"
            size="small"
            class="btnwidth"
            v-ever-click-once="disabled"
            :disabled="disabled"
            @click="saveTask"
          >添加</el-button>
          <el-button
            type="primary"
            size="small"
            plain
            class="btnwidth"
            @click="cancel"
          >取消</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="通知" name="notice">
        <el-form :model="noticeForm" label-position="top" ref="noticeForm" key="noticeForm">
          <el-form-item label="任务名称" prop="name" :rules="noticeRules.name">
            <el-input v-model="noticeForm.name" placeholder="任务名称"></el-input>
          </el-form-item>
          <el-form-item label="发送通道">
            <el-radio-group v-model="noticeForm.sendType">
              <el-radio :label="1">短信</el-radio>
              <el-radio :label="2">微信</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="短信模板">
            <el-row :gutter="10" style="width:100%">
              <el-col :span="6">
                <ever-subject-select ref="ess" placeholder="请选择科室" v-model="noticeForm.deptId" type="select" fields="orgSubjectCode" :params="objParams"></ever-subject-select>
              </el-col>
              <el-col :span="18">
                <el-select
                  v-model="noticeForm.tempObj"
                  popper-class="follow-select-down"
                  value-key="id"
                  placeholder="请选择短信模板"
                  filterable
                  clearable
                  style="width: 387px"
                >
                  <el-option
                    v-for="item in templateList"
                    :key="item.id"
                    :label="item.name || item.title"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="内容" prop="content" :rules="messageRules.content">
            <el-input type="textarea" :rows="5" v-model.trim="noticeForm.content"></el-input>
          </el-form-item>
          <el-form-item label="任务执行">
            <task-setting :value.sync="noticeForm.taskSettingVal"></task-setting>
          </el-form-item>
          <el-form-item>
            <div class="btngroup btngroup-save">
              <el-button
                v-if="activeName==='notice'"
                size="small"
                type="primary"
                v-ever-click-once="disabled"
                :disabled="disabled"
                @click="saveTask"
              >保存</el-button>
              <el-button size="small" @click="cancel">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="患教内容" name="edc">
        <patient-edc ref="patientedc" :nodeId="nodeId" @update="updateGoods"></patient-edc>
        <div class="mb20 mt20">
          <el-button
            type="primary"
            size="small"
            class="btnwidth"
            v-ever-click-once="disabled"
            :disabled="disabled"
            @click="saveTask"
          >添加</el-button>
          <el-button
            type="primary"
            size="small"
            plain
            class="btnwidth"
            @click="cancel"
          >取消</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
import { request } from '@/util/req'
import urlMap from '@/util/urls'
import shortFollowSyscode from '@/follow/components/shortfollowsyscode'
import storage from '@/util/storage'
import pushGoods from './pushgoods.vue'
import patientEdc from './patienteducation.vue'
import selectTaskUser from '@/follow/components/select-task-user.vue'
import taskSetting from '@/follow/components/task-setting.vue'
import { debounce1 as debounce } from '@/util/common'
import { followMap } from '@/follow/util/model'
import msgUrlMap from '@/msgcenter/store/urls'
import { setTimeout } from 'timers'
import { validateSpace } from '@/follow/util/fn'

export default {
  components: {
    shortFollowSyscode,
    pushGoods,
    patientEdc,
    selectTaskUser,
    taskSetting
  },
  props: {
    'nodeId': {
      type: String,
      default: ''
    },
    'isShow': {
      type: Boolean,
      default: false
    },
    'type': {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      editContentFlag: true,
      innerVisible: false,
      visible: false,
      categoryId: '',
      activeName: 'questionnaire',
      searchcontent: '',
      searchType: '',
      tableData: [],  // 问卷量表table分页
      offset: 0,
      pagesize: 10,
      totalCount: 0,
      pagesizes: [10, 20, 30, 50],
      pageLayout: 'total, sizes, prev, pager, next, jumper',
      current: 1,
      currentPage: 1,
      reflash: '',
      radio: 2,
      loading: false,
      sendParams: {
        executeJson: '',
        executeExtendJson: '',
        executeMethod: 1,
        materialId: '',
        activeName: this.activeName,
        pattern: 'CREATE',
        category: 4,
        parentId: this.nodeId,
        ...this.taskUser
      },
      taskUser: {
        executeTypeId: 2
      },
      noticeForm: {
        jobTypeId: '2',
        content: '',
        tempObj: {},
        title: '',
        taskSettingVal: '',
        executeTypeId: 2,
        sendType: 1,
        deptId: '',
        name: '',
        parentId: ''
      },
      messageRules: {
        optional: [
          {required: false}
        ],
        required: [
         { required: true, message: '必填项', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请填写短信内容', trigger: 'blur' },
          { min: 2, max: 120, message: '请输入2-120个字符', trigger: 'change' },
        ],
        doctorId: [
          { required: true, message: '请选择医生', trigger: 'change', type: 'array' }
        ]
      },
      noticeRules: {
        name: [
         { required: true, message: '必填项', trigger: 'change', validator: validateSpace }
        ],
      },
      innerExecute: 1,
      token: storage.getStorageByClinic('TOKEN'),
      clinicId: storage.getStorageByClinic('CLINICID') || '',
      templateList: [],
      msgType: '113',
      disabled: false,
      params: {},
      disabledsubject: true,
      displayName: this.$store.state.currentUser.displayName,
      serviceList: [],
      orgData: {},
      deptData: {},
      followMap,
      objParams: {orgIdList: [], status: 'Y'},
      taskSettingVal: ''
    }
  },
  watch: {
    'innerVisible' (val) {
      if (!val) {
        this.innerExecute = 1
      }
    },
    'activeName' (val) {
      if (val) {
        this.resetFormData()
        this.tableData = this.tableData.map(v => ({
          ...v, executeTypeId: 1, checked: false
        }))
        if (val === 'goods') this.$refs.goods.resetForm()
      }
    },
    'taskUser': {
      handler (val) {
        if (val.executeTypeId === 2) {
          this.sendParams.executeMethod = 1
        } else {
          this.sendParams.executeMethod = 1
        }
        this.sendParams.sendType = 0
      },
      deep: true
    },
    'sendParams.taskSettingVal' (val) {
      this.sendParams = Object.assign(this.sendParams, val)
    },
    'noticeForm.taskSettingVal' (val) {
      this.noticeForm = Object.assign(this.noticeForm, val)
    },
    'noticeForm.deptId': {
      handler: function (val) {
        if (!val) {
          this.editContentFlag = true
          this.templateList = []
          return false
        }
        this.getTemplateList(val)
        this.noticeForm.tempObj = {}
        this.noticeForm.name = ''
        this.noticeForm.content = ''
        this.editContentFlag = true
      }
    },
    'noticeForm.tempObj': {
      handler: function (val) {
        if (val) {
          this.noticeForm.name = val.name
          this.noticeForm.content = val.content
        } else {
          this.noticeForm.name = ''
          this.noticeForm.content = ''
        }
      },
      deep: true
    }
  },
  created () {
    this.searchType = this.$route.name === 'personaltplDetail' ? 1 : 0
  },
  methods: {
    changeOrg (val) {
      if (val && val.id) {
        this.params = {
          orgIdList: [val.id],
          orgId: val.id
        }
        this.disabledsubject = false
        this.getArrangeServiceList(val.id)
      } else {
        this.disabledsubject = true
      }
      this.appointForm.deptObj = ''
      this.appointForm.serviceObj = ''
    },
    // 下拉选择短信模板内容
    getTemplateList (deptId) {
      request(msgUrlMap.msg.msgTemplate.getTemplateListByDept, {
        deptId,
        tempTypeId: this.msgType || ''
      }).then(res => {
        if (res.data && res.data[0]) {
          this.templateList = res.data
          this.editContentFlag = false
        } else {
          this.templateList = []
          this.editContentFlag = true
        }
      })
    },
    resetFormData () {
      if (this.taskUser.executeTypeId === 1) {
        this.$refs.task.reset()
      }
      this.taskUser = {
        executeTypeId: 2
      }
      this.sendParams = {
        executeJson: '',
        executeExtendJson: '',
        executeMethod: 1,
        materialId: '',
        activeName: this.activeName,
        pattern: 'CREATE',
        category: 4,
        ...this.taskUser
      }
      this.noticeForm = {
        content: '',
        tempObj: {},
        title: '',
        taskSettingVal: '',
        executeTypeId: 2,
        sendType: 1,
        deptId: '',
        name: '',
        parentId: ''
      }
      this.$nextTick(_ => {
        if (this.$refs.noticeForm) {
          this.$refs.noticeForm.clearValidate()
        }
      })
    },
    open (val) {
      this.visible = true
      this.activeName = 'questionnaire'
      this.resetFormData()
      this.searchfindByCriteria() // 获取问卷量表list
    },
    close () {
      this.visible = false
    },
    changeExecute (val) {
      if (val) {
        this.sendParams.executeTypeId = val
      }
    },
    // 多选框实现单选
    handleCheck (row, type) {
      this.tableData.forEach(item => {
        if (item.id !== row.id) {
          item.checked = false
        } else {
          item.checked = true
        }
      })
      if (type) {
        this.innerVisible = true
      }
      this.reflash = new Date().getTime()
      if (row && row.checked) {
        this.sendParams.executeExtendJson = row.thirdQnaireId
        this.sendParams.executeJson = row.name
        this.sendParams.name = row.name
        this.sendParams.parentId = this.nodeId
        this.sendParams.activeName = this.activeName
      } else {
        this.sendParams.executeJson = ''
        this.sendParams.executeExtendJson = ''
        this.sendParams.name = ''
      }
    },
    shorthandleNodeClick (data) {
      this.categoryId = data.id
      this.categoryId = data.id && data.id !== 'all' ? data.id : ''
      this.searchfindByCriteria()
    },
    goSearch () {
      this.currentPage = 1
      this.searchfindByCriteria()
    },
    // 查询问卷列表
    searchfindByCriteria () {
      let params = {
        pagesize: this.pagesize,
        currentPage: this.currentPage,
        offset: this.offset,
        categoryId: this.categoryId,
        name: this.searchcontent,
        type: this.searchType,
        status: 1
      }
      request(urlMap.follow.materialQnaire.findByCriteria, params).then(res => {
        if (res.head.errCode === 0) {
          this.tableData = res.data.resultList.map(v => ({
            ...v, executeTypeId: 1, checked: false
          }))
          this.totalCount = res.data.totalCount
        }
      })
    },
    saveinnerTask () {
      this.sendParams.executeTypeId = this.innerExecute
      this.saveTask()
    },
    saveTask: debounce(function () {
      if (this.activeName === 'questionnaire') {
        if (!this.sendParams.executeExtendJson) {
          this.$messageTips(this, 'error', '请先选择问卷!')
          return false
        }
        if (this.taskUser.executeTypeId === 1 && !this.taskUser.executorId) {
          this.$messageTips(this, 'error', '请选择执行任务的医生!')
          return false
        }
        this.$refs.firstForm.validate(valid => {
          if (!valid) {
            return false
          }
          this.$emit('sendData', Object.assign(this.sendParams, this.taskUser))
          return false
        })
      }
      if (this.activeName === 'goods') {
        if (this.$refs.goods.save()) {
          let sendParams = {
            activeName: this.activeName,
            pattern: 'CREATE',
            ...this.$refs.goods.obj
          }
          setTimeout(_ => {
            this.$emit('sendData', sendParams)
          }, 100)
        }
        return false
      }
      if (this.activeName === 'notice') {
        this.$refs.noticeForm.validate(validate => {
          if (!validate) { return }
          this.noticeForm.activeName = this.activeName
          this.noticeForm.pattern = 'CREATE'
          this.noticeForm.name = this.noticeForm.name
          this.noticeForm.deptId = this.noticeForm.tempObj.deptId || ''
          this.noticeForm.parentId = this.nodeId
          let sendParams = Object.assign(this.noticeForm, this.taskUser)
          this.$emit('sendData', sendParams)
        })
        return false
      }
      if (this.activeName === 'edc') {
        if (this.$refs.patientedc.save()) {
          let sendParams = {
            activeName: this.activeName,
            pattern: 'CREATE',
            ...this.$refs.patientedc.obj
          }
          setTimeout(_ => {
            this.$emit('sendData', sendParams)
          }, 100)
        }
        return false
      }
    }),
    updateGoods () {
      this.close()
    },
    cancel () {
      this.close()
    },
    cancelInner () {
      this.innerVisible = false
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.current = 1 // 切换size时，自动重置current
      this.currentPage = 1
      this.offset = (this.current - 1) * this.pagesize
      this.searchfindByCriteria()
    },
    handleCurrentChange (val) {
      this.current = val
      this.currentPage = val
      this.offset = (val - 1) * this.pagesize || 0
      this.searchfindByCriteria()
    },
    getArrangeServiceList (orgId) {
      request(urlMap.arrangeServiceList, { orgId: orgId, searchType: 2, serviceClassification: '799' }).then(rs => {
        if (rs && rs.data && rs.data[0]) {
          this.serviceList = rs.data.map(v => {
            return {
              serviceId: v.id,
              serviceName: v.name
            }
          })
        } else {
          this.serviceList = []
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.add-sub.ui_dialog_02 {
  /deep/ .el-dialog {
    .el-dialog__body {
      padding: 20px 20px 0 20px !important;
    }
    .el-dialog__header {
      padding: 0px;
    }
    .el-input__icon.el-icon-search {
      color: #000000;
      font-weight: 700;
    }
  }
  .searchquestion {
    margin-bottom: 20px;
    /deep/ .el-input .el-input__inner {
      padding: 0 28px;
      &::placeholder {
        color: #000000;
      }
    }
  }
  .mr20 {
    margin-right: 20px;
  }
  .common-inner {
    background-color: #ffffff;
  }
  .btngroup {
    text-align: right;
    padding: 20px 0;
  }
  .view {
    cursor: pointer;
  }
  .view:hover {
    color: #1c7bef;
    text-decoration: underline;
  }
}
.add-sub /deep/ .inneradd {
  z-index: 5000 !important;
  .el-dialog__header {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    border-bottom: 1px solid#BBBBBB;
  }
  .inner-execute {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    span:nth-child(1) {
      display: inline-block;
      text-align: left;
    }
    span:nth-child(2) {
      display: inline-block;
      text-align: right;
    }
  }
  .inner-iframebox {
    height: 800px;
    max-height: 800px;
  }
}
@media screen and (max-width: 1599px) {
  .add-sub.ui_dialog_02 {
    /deep/ .el-dialog {
      .el-dialog__body {
        max-height: 660px !important;
      }
    }
  }
}
.add-sub.ui_dialog_02 {
  /deep/ .el-dialog {
    .el-dialog__body {
      max-height: 660px !important;
    }
  }
}
.question-table-list {
  max-height: 500px;
  overflow-y: auto;
}
.question-table-list /deep/ .el-table__empty-block{
  border-bottom:1px solid #ccc;
}
.question-table-list /deep/ .el-radio__label {display: none;}
.add-sub.ui_dialog_02 {
  .btngroup-save {
    text-align: left;
    margin-top: 10px;
  }
  .el-table:before {
    left: 0;
    bottom: 0;
    width: 100%;
    height: 0px;
  }
}
</style>

