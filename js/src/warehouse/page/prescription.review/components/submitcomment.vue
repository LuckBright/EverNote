<template>
  <div>
    <el-form :model="formInline" ref="numberValidateForm" class="demo-form-inline" label-width="130px">
      <el-row>
        <el-form-item label="处方点评：">
          <span v-if="switchShow">{{formInline.status === 1 ? '合理' : '不合理'}}</span>
          <el-radio-group v-else v-model="formInline.status">
            <el-radio :label="1">合理</el-radio>
            <el-radio :label="2">不合理</el-radio>
          </el-radio-group>
          <el-button @click="selectCommentDialog" v-if="formInline.status !== 1 && !switchShow" class="ml20" type="text">不合理原因</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="点评：">
          <span v-if="switchShow">{{formInline.content}}</span>
          <el-input v-else type="textarea" class="textarea_text" maxlength="500" autosize size="medium" resize="none" v-model="formInline.content" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-row>
      <el-row v-if="formInline.status !== 1">
        <el-form-item label="不合理的原因：">
          <div style="line-height: 20px; padding-top: 10px" v-for="(item, index) in formInline.classifyList" :key="index">
            <span class="cGray">{{index + 1}}、</span>
            {{item.contentText}}
          </div>
        </el-form-item>
      </el-row>
      <el-row class="mt15 mb10" v-if="showEditBtn">
        <el-form-item label=" ">
          <span v-if="switchShow">
            <el-button type="primary" @click="switchShow = false">编辑</el-button>
            <el-button type="text" @click="getLogList">操作记录</el-button>
          </span>
          <span v-else>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </span>
        </el-form-item>
      </el-row>
    </el-form>
    <dialogselect-comment ref="selectcomment" :initCheckList.sync="formInline.classifyList" @selectcomment="selectcomment"></dialogselect-comment>
    <!-- 操作记录 -->
    <control-dialog :recordData="controlData" :visible.sync="controlDialogVisible"></control-dialog>
  </div>
</template>

<script>
import dialogselectComment from './dialogselectcomment.vue'
import api from '../util/outpatientcommentapi'
import controlDialog from './controldialog.vue'
export default {
  props: {
    showEditBtn: {
      type: Boolean,
      default: true
    },
    submitData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      formInline: {
        status: 1,
        content: '合理',
        classifyList: []
      },
      controlDialogVisible: false,
      switchShow: false,
      commentInfo: {},
      controlData: []
    }
  },
  created () {
    if (this.submitData.id) {
      this._initData()
      this.switchShow = true
    }
  },
  methods: {
    _initData () {
      api.detail({ id: this.submitData.id }).then(res => {
        if (!res.classifyList) res.classifyList = []
        Object.assign(this.formInline, res)
      })
    },
    getLogList () {
      api.logs({ id: this.submitData.id }).then(res => {
        if (res) {
          this.controlData = res
          this.controlDialogVisible = true
        }
      })
    },
    resetForm () {
      this.formInline = {
        status: 1,
        content: '合理',
        classifyList: []
      }
    },
    onSubmit () {
      if (this.formInline.status === 1) this.formInline.classifyList = []
      this.$emit('submitComment', this.formInline)
      this.switchShow = true
    },
    selectCommentDialog () {
      this.$refs.selectcomment.open()
    },
    selectcomment (v) {
      this.formInline.classifyList = v
    }
  },
  watch: {
    'formInline.status' (v) {
      if (!this.switchShow) {
        if (v === 1) {
          this.formInline.content = '合理'
        } else {
          this.formInline.content = '不合理'
        }
      }
    }
  },
  components: {
    dialogselectComment,
    controlDialog
  }
}
</script>
<style scoped>
.demo-form-inline .el-form-item{
  margin-bottom: 0;
}
.demo-form-inline .el-form-item /deep/ .el-form-item__label{
  padding-right: 20px;
}
.textarea_text /deep/ .el-textarea__inner{
  padding: 5px 10px;
  margin-top: 3px;
  line-height: 28px;
  min-height: 36px!important;
  width: 650px;
}
.demo-form-inline /deep/ .el-radio__input.is-checked+.el-radio__label{
  color: #000 !important;
}
</style>
