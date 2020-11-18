<template>
  <div class="edithomepage">
    <el-row class="operation"
            v-if="!readonly&& !originUrls.includes(this.$route.query.from)">
      <el-button type="text"
                 @click="saveRecord"
                 :disabled="authority===1">
        <i class="icon iconfont icon-editor-save"></i>保存
      </el-button>
      <el-button type="text"
                 @click="printRecord"
                 :disabled="authority===1||isable||printable || printStatus">
        <i class="icon iconfont icon-editor-print"></i>打印
      </el-button>
      <el-button type="text"
                 @click="submitPrint({preview:true})"
                 :disabled="authority===1||isable||printable || printStatus">
        <i class="icon iconfont icon-editor-preview"></i>打印预览
      </el-button>
      <el-button type="text" @click="back=!back">
        <i class="el-icon-document-checked">正反面</i>
      </el-button>
      <el-popover
        placement="bottom-start"
        width="160"
        v-model="visible">
        <p>同步操作会将填写的数据覆盖，您确定要执行同步操作吗？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="visible = false">取消</el-button>
          <el-button type="primary" size="mini" @click="getLast">确定</el-button>
        </div>
        <el-button
          slot="reference" 
          type="text"
          :disabled="authority===1||this.editorIsUpdated">
          <i class="el-icon-refresh">同步</i>
        </el-button>
      </el-popover>
      
    </el-row>
    <el-row class="operation"
            v-else>
      <el-button type="text"
                 @click="back=!back">
        <i class="el-icon-document-checked">正反面</i>
      </el-button>
    </el-row>
    <el-row style="border:none;"
            class="flex_col_1_auto home_page">
      <medical-index ref="medicalIndex"
                     :patientId="patientId"
                     :visitId="visitId"
                     :dptId="dptId"
                     :readonly="editable"
                     :back="back"
                     @init="getInstanceId"
                     @update="docUpdate"
                     @success="saveMedicalSuccess"></medical-index>
    </el-row>
    <!--打印模式-->
    <dialog-print :visible.sync="printVisible"
                  @submitPrint="submitPrint"
                  @submitContinuePrint="printMedicalProcess"></dialog-print>
  </div>
</template>
<script>
import dialogPrint from '@/inpatient/page/medicalrecord/dialog.print'
import medicalIndex from '@/components/medicalindex/index'
import {commandLog} from '@/phr/mixin/operationLog.js'
import urlMap from '@/emr/urls'
import { request } from '@/util/req'
export default {
  components: {
    dialogPrint,
    medicalIndex
  },
  props: {
    patientName: {
      type: String
    },
    patientId: {
      type: String
    },
    visitId: {
      type: String
    },
    dptId: {
      type: String
    },
    curNode: {
      type: Object
    },
    authority: {
      type: Number
    },
    visitType: {
      type: Number
    }
  },
  data () {
    return {
      readonly: false,
      visible: false,
      homePageId: '',
      homePageCode: 'ZHU_YUAN_BING_AN_SHOU_YE',
      back: false, // true反面，false正面
      // editMode: true,
      printVisible: false,
      editorIsUpdated: false,
      printStatus: true,
      originUrls: ['medicalArchive']
    }
  },
  computed: {
    printable () {
      // 病历未发生变动
      if (this.curNode.type === 'bingli' && this.editorIsUpdated === false) {
        return false
      } else {
        return true
      }
    },
    editable () {
      let originUrls = ['medicalArchive']
      if (this.$route.query.readonly === 'true' || originUrls.includes(this.$route.query.from)) {
        return true
      } else if (this.readonly || this.authority === 1) {
        return true
      } else {
        return false
      }
    },
    submitable () {
      // 病历未发生变动
      if (this.curNode.type === 'bingli' && this.editorIsUpdated === false) {
        return false
      } else {
        return true
      }
    },
    isable () {
      // 引用模版
      if (this.curNode.type === 'tpl') {
        return true
      } else {
        return false
      }
    },
  },
  watch: {
    editorIsUpdated (val) {
      this.$emit('editorIsUpdated', val, this.curNode)
    },
  },
  created () {
    this.$bus.$on('printStatus', status => {
      this.printStatus = status
    })
    if (this.$route.meta && this.$route.meta.prole === 1) { // 医生病历书写
      this.readonly = false
    } else if (this.$route.meta && this.$route.meta.prole === 2) { // 护士护理文书
      this.readonly = true
    }
    if (this.$route.query.from === 'medicalRecall') {
      if (this.curNode.isRecall === 0) {
        this.readonly = true
      } else if (this.curNode.isRecall === 1) {
        this.readonly = false
      }
    }
  },
  methods: {
    getRecordInfo(id) {
      request(urlMap.record.getById, {id}).then(res => {
        if (res.head.errCode === 0) {
          if (res.data.isRecall === 0) {
            this.readonly = true
          } else {
            this.readonly = false
          }
        }
      })
    },
    getLast () {
      this.visible = false
      this.$refs.medicalIndex && this.$refs.medicalIndex.echoData()
    },
    printMedicalProcess () {
      this.$messageTips(this, 'warning', '病案首页不支持续打功能', '提示')
    },
    getInstanceId (id) {
      if (id && this.$route.query.from === 'medicalRecall') {
        this.getRecordInfo(id)
      }
      this.homePageId = id
      this.$emit('getInstanceId', id)
    },
    saveMedicalSuccess (obj) { // 保存病案首页成功
      if (obj.success) {
        this.editorIsUpdated = false
        this.$messageTips(this, 'success', '保存成功', '提示')
        this.homePageId = obj.id
        this.$emit('saveSuccess', Object.assign({}, this.curNode, {
          id: obj.id,
          categoryName: '病案首页'
        }))
      }
    },
    docUpdate (isUpdate) {
      this.editorIsUpdated = isUpdate
    },
    saveRecord () {
      this.$refs.medicalIndex && this.$refs.medicalIndex.add()
    },
    submitPrint (settings) {
      let opModuleOne = this.$route.name === 'case_recordprint' ? '病案管理-病历打印-病案首页' : `电子病历-病历书写-病案首页`
      commandLog({
        content: '打印病案首页',
        opModuleOne: opModuleOne,
        opType: 'PRINT',
        patientId: this.patientId,
        patientName: this.patientName,
        visitNumber: this.visitId
      })
      this.$refs.medicalIndex && this.$refs.medicalIndex.print(settings)
    },
    printRecord () {
      // this.printVisible = true
      this.submitPrint({})
    },
    previewRecord () {
    },
  }
}
</script>
<style lang="scss" scoped>
.edithomepage {
  .icon {
    font-size: 14px;
    vertical-align: initial;
  }
  display: flex;
  flex-direction: column;
  height: 100%;
  .el-dialog__wrapper {
    position: absolute;
    top: initial;
    /deep/.el-drawer__container {
      height: 306px;
    }
  }
  .el-tabs__header {
    margin: 0;
  }
  .operation {
    width: 100%;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    font-size: 14px;
    background: #fff;
    // i{
    //     margin:0 5px;
    //     cursor:pointer;
    //     &:hover{
    //         color:#1c7bef;
    //     }
    // }
    .el-button--text {
      color: #000;
      font-weight: normal;
    }
    .el-button.is-disabled {
      color: #ccc;
    }
  }
  /deep/.editor {
    border: none;
  }
}
</style>
