<template>
  <div class="record_ihsystem">
    <div class="flex_column_full_hidden">
      <el-row class="flex_layout_scroll"
              v-show="!nodata"
              v-loading="loading">
        <el-col :span="24"
                class="rightframe fixLabelWord"
                >
          <div class="kanzhen form"
               >
            <phrform v-if="loaded"
                     :code="code"
                     :visit-id="visitId"
                     :patient-id="patientId"
                     :dpt-id="dptId"
                     :data-id="dataId"
                     v-model="form"
                     ref="form"
                     :nosubmit="true"
                     :schemaId.sync="schemaId"
                     @finished="formFinished"></phrform>
          </div>
        </el-col>
      </el-row>
      <ever-no-data tipTxt="暂无数据"
                    v-show="nodata"></ever-no-data>
      <div class="bottom_wrap"
           v-show="!nodata && !loading">
        <div class="case-footer">
          <el-button type="primary"
                     class="savebtn"
                     @click="savePatientCase()"
                     v-ever-click-once="disabled"
                     :disabled="disabled"
                     >{{$t('保存')}}</el-button>
          
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { debounce } from 'lodash'
import { deepObjectCompile } from '@/util/diff'
import {isJsonString} from '@/util/common'
import urlMap from '@/inpatient/urls'
import { request } from '@/util/req'
import phrapi from '@/form/store/phrapi'
import api from '@/workspace/store/medicalapi'
import ihApi from '../store/advice.js'
import {ZD_MEN_ZHEN_ZHEN_DUAN} from '@/emr/config/uniform.field.js'
import medicalRecordCommon from '@/workspace/page/outpatient/medical.record.common'
import {commandLog} from '@/phr/mixin/operationLog.js'
import storage from '@/util/storage'

// 1=门诊；2=急诊；3=住院；4=体检；5=互联网 visitType
// 判断obj1里面是否包含obj2的任意一项 有则返回true
export default {
  name: 'record_ihsystem',
  mixins: [medicalRecordCommon],
  data () {
    return {
      loaded: false,
      patientId: this.$route.query.patientId,
      patientName: this.$route.query.patientName,
      dptId: this.$route.query.providerId,
      code: 'MEN_ZHEN_FU_ZHEN_BING_LI',
      dataId: '-1',
      categoryName: '',
      levelOneName: '电子病历',
      nodata: false,
      schemaId: null,
      api,
      form: {},
      disabled: false,
      formObjUpdate: false,
      isAutoSaveStatus: false,
      formOldObj: null,
      title: '门诊首次病历',
      designerId: '1',
      loading: false,
      templateScopeId: '',
      tplType: 'clinic_normal',
      hasInfected: false, // 判断有没有传染病
      docObj: {},   // 文档型病历数据，用于判断病历编辑状态还是新建状态
    }
  },
  computed: {
    visitId () {
      return this.$route.query.visitNumber
    },
    medicalUpdate () {
      return this.formObjUpdate
    }
  },
  watch: {
    formObjUpdate (val) {
      this.$bus.$emit('workspace:todaypatient:changbingli', val)
      this.$bus.$emit('workspace:index:changbingli', val)
      // 通知病历更新状态
      this.$bus.$emit('medicalUpdateStatus', val)
    },
    form: {
      handler (val) {
        if (Object.keys(val).length === 0) {
          return
        }
        this.checkChange && this.checkChange(val)
      },
      deep: true
    },
    schemaId (val) {
      if (val) {
        this.$emit('schemaId', val)
      }
    }
  },
  created () {
    commandLog({
      content: '登录门诊病历',
      opModuleOne: `${this.levelOneName}-门诊病历`,
      opType: 'LOGIN',
      visitNumber: this.visitId,
      patientId: this.patientId,
      patientName: this.patientName
    })
    this.init()
  },
  methods: {
    init () {
      // 获取病历的下拉列表
      this.getInstanceList()
      // form 数据是否更新
      this.updateForm()
    },
    updateForm () {
      if (this.designerId === '1') {
        let fn = val => {
          if (val.createUpdate) {
            let valKeys = Object.keys(val)
            delete val.createUpdate
            if (valKeys && valKeys.length > 1) {
              this.formOldObj = JSON.parse(JSON.stringify(val))
            }
          } else {
            this.formObjUpdate = deepObjectCompile(val, this.formOldObj)
          }
        }
        this.checkChange = debounce(fn, 200)
      }
    },
    loadingClose () {
      this.loading = false
    },
    getCategoryName (params, callback) {
      request(urlMap.medicalRecord.getCategoryByCode, {
        code: params.code
      }).then(res => {
        this.categoryName = res.data.name
        callback && callback(res.data.name)
      })
    },
    formFinished (info) {
      this.getCategoryName({code: this.code})
      this.loadingClose()
      this.hasInfected = this.getInfectedArrOfForm()
    },
    getInstanceList () {
      let params = {
        visitId: this.visitId,
        type: '2',
        role: 1,
        order: 'desc',
        dptId: this.dptId
      }
      api.getInstanceList(params).then(async (res) => {
        if (res.head.errCode === 0) {
          if (res.data && res.data.length) {
            this.schemaId = res.data[0].formTemplateId
            this.dataId = res.data[0].id
            this.templateScopeId = res.data[0].templateScopeId
          }
          this.loaded = true
        }
      })
    },
    stopLeaveMedical () {
      this.$messageTips(this, 'warning', '病历正在自动保存中，请稍后切换！')
      this.$nextTick(_ => {
        setTimeout(() => {
          this.$refs.sele.blur()
        }, 400)
      })
      this.loading = false
      return false
    },
    handleConmandEdit (row) {
      this.getCategoryName({code: row.code}, (categoryName) => {
        commandLog({
          content: `编辑${row.label}`,
          opModuleOne: `电子病历-门诊病历-${categoryName}`,
          opType: 'CLICK_EDIT',
          visitNumber: this.visitId,
          patientId: this.patientId,
          patientName: this.patientName
        })
      })
    },
    getInfectedArrOfForm () {
      if (Number(this.designerId) !== 1) return false
      let _hasInfected = false
      if (this.form && this.form[ZD_MEN_ZHEN_ZHEN_DUAN]) {
        _hasInfected = this.form[ZD_MEN_ZHEN_ZHEN_DUAN].some(val => {
          return this.getInfectedArr(val.groupList).length > 0
        })
      }
      return _hasInfected
    },
    getInfectedArrOfDoc () {
      if (Number(this.designerId) !== 2) return false
      let _hasInfected = false
      if (!this.$refs.phrdoc) return false
      let items = this.$refs.phrdoc.getInputFlatData()
      if (items && items.length) {
        items.forEach(item => {
          if (item.type === 2 && item.text && (item.informationConfigCode === ZD_MEN_ZHEN_ZHEN_DUAN)) {
            let diagnose = item.text.data && isJsonString(item.text.data) ? JSON.parse(item.text.data) : []
            if (diagnose) {
              _hasInfected = diagnose.some(diagnoseItem => {
                return this.getInfectedArr(diagnoseItem.groupList).length > 0
              })
            }
          }
        })
      }
      return _hasInfected
    },
    getInfectedArr (arr) {
      if (!arr) return []
      if (!arr.length) return []
      return arr.filter(item => item.name === '传染病')
    },
    checkInfected () {
      // 如果id存在说明属于编辑状态，模版没有发生变化，return false
      if (this.hasInfected) return this.getInfectedArrOfForm() || this.getInfectedArrOfDoc()
      if (this.getInfectedArrOfForm() || this.getInfectedArrOfDoc()) {
        // this.$bus.$emit('menzhen:crg') //互联网医院没有传染病上报卡
      }
      return this.getInfectedArrOfForm() || this.getInfectedArrOfDoc()
    },
    saveLog (name) {
      this.getCategoryName({code: this.code}, (categoryName) => {
        commandLog({
          content: `保存${name}病历`,
          opModuleOne: `电子病历-门诊病历-${categoryName}`,
          opType: 'SAVE',
          visitNumber: this.visitId,
          patientId: this.patientId,
          patientName: this.patientName
        })
      })
    },
    checkPatientConfirm (msg) {
      let orgId = storage.getLocalStorage('CLINICID')
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({
          name: 'ihdetail',
          query: {
            visitType: this.$route.query.visitType,
            visitNumber: this.visitId,
            orgId: orgId
          }
        })
      }).catch(() => {
        this.$router.push({name: 'ihlist'})
      })
    },
    async savePhrForm (isAuto) {
      let checkPass = false
      await ihApi.checkPatientStatus(this.visitId).then(res => {
        if (res.errCode === 0) {
          checkPass = true
        } else {
          this.checkPatientConfirm(res.errMsg)
        }
      })
      if (!checkPass) return false
      this.form.visitType = this.$route.query.visitType
      let params = {
        formTemplateId: this.schemaId,
        data: this.form,
        env: {
          visitId: this.visitId,
          patientId: this.patientId,
          dptId: this.dptId
        },
        code: this.code,
        templateScopeId: this.templateScopeId
      }
      let result = await phrapi.createOrUpdate(params)
      if (this.form[ZD_MEN_ZHEN_ZHEN_DUAN]) {
        // if (!isAuto) this.checkDiagnose(this.form[ZD_MEN_ZHEN_ZHEN_DUAN])
        this.hasInfected = this.checkInfected()
      }
      if (result.id) {
        this.form.id = result.id
        this.formObjUpdate = false
        this.formOldObj = JSON.parse(JSON.stringify(this.form))
        const message = '病历保存成功'
        this.title = result.formTemplateName
        this.saveLog(result.formTemplateName)

        this.$notify({
          title: '',
          message: message,
          type: 'success'
        })
        this.$emit('saveSuccess')
      } else {
        this.$notify.error({
          title: 'error',
          message: '保存失败'
        })
      }
    },
    async checkDiagnose (diagnose) { // 互联网医院不用
      // CPOE检验病历诊断逻辑  甄国勋 张奇峰
      if (!diagnose) return
      let params = {
        visitNumber: this.visitId,
        visitType: 1,
        diagnose
      }
      let res = await api.checkDiagnose(params)
      if (res && res.data && res.data.tipMsg) {
        this.$messageTips(this, 'info', res.data.tipMsg, '提示', 5000)
      }
    }
  }
}
</script>
<style scoped lang='scss'>
.record_ihsystem {
  // height:100%;
  .top_wrap{
    margin: 10px 0px 0px 10px;
    .top_wrap_title{
      padding-left: 0px;margin: 10px 0 10px;font-size: 14px;
    }
  }
  .empty {
    text-align: center;
  }
  .rightframe {
    background: #ffffff;
    padding: 20px 15px;
    &.flex_column_full_hidden {
      padding: 0;
      .kanzhen {
        padding: 0;
      }
      .edit_con_wrap {
        padding-top: 5px;
      }
    }
  }
  span.labeltext {
    color: #999;
    display: block;
  }
  .icon-delete {
    color: #1c7bef;
    font-size: 16px;
    cursor: pointer;
  }
  .kanzhen {
    position: relative;
    padding-bottom: 36px;
  }
  .case-footer {
    border-top: 1px solid #e6e6e6;
    padding: 10px 10px 10px 135px;
  }
  ._tabs {
    padding: 0 20px;
    /deep/ .el-tabs__header {
      margin-bottom: 0;
    }
    /deep/ .el-dialog__body {
      padding: 0px 15px;
    }
  }
  .opration {
    float: right;
    margin-right: 10px;
  }
}
</style>
