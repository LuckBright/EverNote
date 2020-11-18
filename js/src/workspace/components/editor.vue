<template>
  <div>
    <el-dialog
      v-if="flag"
      :visible="flag"
      width="45%"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :show-close="false"
      @close="close"
    >
      <div slot="title">
        <div class="title">{{titleInfo}}</div>
        <patient-info ref="patient" :obj="obj" :next="true" v-if="flag"></patient-info>
      </div>
      <div class="next">
        <el-button @click="goBack" size="small">返回</el-button>
        <span v-show="update && haveData" class="red">(请保存后再返回，否则会丢失)</span>
        <div class="fr">
          <el-button type="primary" size="small" @click="saveDoc">保存</el-button>
          <el-button
            type="primary"
            size="small"
            @click="print"
            v-show="haveData"
            :disabled="update"
          >打印</el-button>
          <el-popover placement="left" width="160" v-model="visible">
            <p>确定删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" @click="visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="del">确定</el-button>
            </div>
            <el-button t slot="reference" size="small" v-show="haveData" class="ml10">删除</el-button>
          </el-popover>
        </div>
      </div>
      <phrdoc
        v-if="editShow"
        @docUpdate="docUpdate"
        ref="phrdoc"
        :data-id="dataId"
        :dptId="dptId"
        :schema-id="templateId"
        :visit-id="obj.visitSerialNumber || obj.visitId"
        :patient-id="obj.patientId"
        :key="obj.id"
        :editable="true"
        :proof="true"
        :source="1"
      ></phrdoc>
    </el-dialog>
  </div>
</template>
<script>
import patientInfo from './patientinfo'
import phrapi from '@/form/store/phrapi'
import {commandLog, getCategoryNameByCode} from '@/phr/mixin/operationLog.js'
export default {
  name: 'proofEditor',
  components: {
    patientInfo
  },
  computed: {
    haveData () {
      return this.dataId !== '-1'
    }
  },
  created () {
    this.$bus.$on('send:sendTemplateScopeId', (val) => {
      this.templateScopeId = val
    })
  },
  methods: {
    docUpdate (val) {
      this.update = val
    },
    goBack () {
      this.flag = false
      this.editShow = false
      this.close()
    },
    print () {
      getCategoryNameByCode(this.obj.code, (categoryName) => {
        commandLog({
          content: `打印证明记录`,
          opModuleOne: `电子病历-门诊病历-${categoryName}`,
          opType: 'PRINT',
          visitNumber: this.$route.query.visitSn,
          patientId: this.$route.query.patientId,
          patientName: this.$route.query.patientName
        })
      })
      this.$refs.phrdoc.print()
    },
    del () {
      phrapi.del(this.dataId).then(_ => {
        getCategoryNameByCode(this.obj.code, (categoryName) => {
          commandLog({
            content: `删除证明记录`,
            opModuleOne: `电子病历-门诊病历-${categoryName}`,
            opType: 'DELETE',
            visitNumber: this.$route.query.visitSn,
            patientId: this.$route.query.patientId,
            patientName: this.$route.query.patientName
          })
        })
        this.$messageTips(this, 'success', '删除成功', '提示')
        this.$emit('update')
        this.flag = false
        this.visible = false
      })
    },
    saveDoc () {
      const obj = {
        text: this.$refs.phrdoc.getHtml()
      }
      if (this.dataId && this.dataId !== '-1') {
        obj.id = this.dataId
      }
      this.editShow = false
      let allDiagResult = this.obj.allDiagnosis || this.obj.allDiagResult
      const params = {
        formTemplateId: this.templateId,
        code: this.obj.code,
        templateScopeId: this.templateScopeId || this.obj.templateScopeId,
        data: Object.assign(obj, {
          visitId: this.obj.visitSerialNumber || this.obj.visitId,
          patientId: this.obj.patientId,
          dptId: this.obj.dptId || this.obj.deptId,
          visitDate: this.obj.hospitalizedTime || this.obj.treatmentTime,
          allDiagResult: allDiagResult,
          mainDiagCode: this.obj.mainDiagCode ? this.obj.mainDiagCode : '',
        })
      }
      if (this.dataId && this.dataId !== '-1') {
        params.id = this.dataId
      }
      phrapi
        .storeDoc(params)
        .then(result => {
          getCategoryNameByCode(this.obj.code, (categoryName) => {
            commandLog({
              content: `保存证明记录`,
              opModuleOne: `电子病历-门诊病历-${categoryName}`,
              opType: 'SAVE',
              visitNumber: this.$route.query.visitSn,
              patientId: this.$route.query.patientId,
              patientName: this.$route.query.patientName
            })
          })
          this.$messageTips(this, 'success', '保存成功', '提示')
          this.$emit('update')
          this.dataId = result.id
          this.update = false
          this.editShow = true
        })
        .catch(() => {
          this.flag = false
        })
    },
    toggle () {
      this.editShow = true
      this.flag = !this.flag
      this.update = false
      this.dataId = this.obj.dataId || this.obj.medicalRecordId
      this.dptId = this.obj.dptId || this.obj.deptId
      this.templateId = this.schemaId || this.obj.formTemplateId
    },
    close () {
      this.$emit('handle-click')
      this.visible = false
    }
  },
  props: {
    titleInfo: {
      type: String
    },
    obj: {
      type: Object
    },
    schemaId: {
      type: String
    }
  },
  data () {
    return {
      templateScopeId: '',
      flag: false,
      editShow: false,
      update: false,
      dataId: '-1',
      visible: false,
      dptId: '',
      templateId: this.schemaId
    }
  }
}
</script>
<style scoped lang="scss">
.title {
  font-size: 16px;
  color: #333333;
  line-height: 16px;
  margin-top: 6px;
}
.next {
  margin-top: -20px;
  margin-bottom: 10px;
}
.red {
  color: red;
  font-size: 12px;
}
.ml10 {
  margin-left: 10px;
}
</style>
