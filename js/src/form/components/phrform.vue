<template>
  <div class="pos_re">
    <el-form
      v-if="tpl.templateId && tpl.props && tpl.props.hasRecordTime"
      :label-width="tpl.props.labelWidth"
      size="small"
    >
      <el-form-item label="记录时间">
        <el-date-picker
          v-model="recordTime"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          type="datetime"
          placeholder="选择记录时间"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <ever-form2
      v-if="tpl.templateId"
      :schema="schema"
      v-model="obj"
      ref="form"
      :span="24"
      :label-width="tpl.props.labelWidth"
      :label-position="tpl.props.labelPosition"
      :gutter="tpl.props.gutter"
      :rules="rules"
      :readonly="readonly"
      @focus="(name, obj) => {this.$emit('focus', name, obj)}"
      @click="(name, obj) => {this.$emit('click', name, obj)}"
      class="form remote-form"
      :nosubmit="nosubmit"
      :allDisabled="allDisabled"
    >
      <template v-for="name in slotNames" :slot="name">
        <slot :name="name"></slot>
      </template>
      <template slot="default">
        <slot>
          <el-col :span="24" slot="default">
            <el-form-item>
              <el-button type="primary" @click="save()">保存</el-button>
            </el-form-item>
          </el-col>
        </slot>
      </template>
    </ever-form2>
    <div class="diabdled_mask" v-if="allDisabled"></div>
  </div>
</template>
<script>
/**
## 两种方式获取schema
1 code 模版编码, dptId 部门ID 需要同时传这两个值确定唯一表单
加载表单schema后会更新 schemaId，后续所有操作根据schemaId进行，比如加载表单数据
2 根据表单schemaId直接获取
*/
// 修改了诊断、血压字段,身高,体重
/**
 * 组件内部的代码处理了记录时间，保存，加载模版和数据的逻辑
 * 计算BMI和表单校验逻辑 ，设置诊断，设置血压数据移到了外面，通过mixins引入
 * dataModelId 加载有数据的表单模式，需要用到
 * 有记录时间时code是必传的
 * value：表单的数据
 * schemaId，表单模版id
 *通过visitid，dptId，patientId，templateId能获取到病历数据
*/
import { getMixed } from '@/util/formconverter'
import api from '../store/api'
import phrapi from '../store/phrapi'
import preinspection from '@/form/util/preinspection.js'
import checkform from '@/form/util/checkform.js'
import {deepObjectCompile} from '@/util/diff'
import storage from '@/util/storage'
import {commandLog, getCategoryNameByCode, clinicCodes, clinicCodeText} from '@/phr/mixin/operationLog.js'
let setLocal = function (obj) {
  storage.setLocalStorage('oldForm', JSON.stringify(obj))
}
let getLocal = function () {
  return JSON.parse(storage.getLocalStorage('oldForm'))
}
export default {
  mixins: [preinspection, checkform],
  props: ['autoSave', 'code', 'visitId', 'patientId', 'slotNames', 'value', 'dptId', 'schemaId', 'nosubmit', 'readonly', 'dataId', 'allDisabled', 'dataModelId', 'loading', 'title', 'dataEcho', 'editorIsUpdated'],
  data () {
    return {
      schema: [],
      rules: null,
      tpl: {
        props: {}
      },
      obj: {},
      recordTime: new Date(),
      initRecordTime: '',
      watchRecordTime: true,
      formDataId: '',
      isCreate: this.dataId === '-1'
    }
  },
  computed: {
    hasRecordTime () {
      return this.tpl.templateId && this.tpl.props && this.tpl.props.hasRecordTime
    }
  },
  watch: {
    obj: {
      handler (val) {
        if (val) {
          if (this.hasRecordTime) {
            this.obj.recordTime = this.recordTime ? this.$moment(this.recordTime).format('YYYY-MM-DD HH:mm:ss') : ''
          }
          this.contentSave()
          this.$emit('input', val)
          let oldForm = getLocal()
          this.$emit('update:editorIsUpdated', deepObjectCompile(oldForm, val))
        }
      },
      deep: true,
      immediate: true
    },
    dataId () {
      this.isCreated = this.dataId === '-1'
    },
    value: {
      handler (val) {
        Object.assign(this.obj, val)
      },
      deep: true
    },
    recordTime (val) {
      if (!this.watchRecordTime) {
        this.watchRecordTime = true
        return
      }
      this.getTempData(val)
    }
  },
  created () {
    this._setFormInitData()
  },
  methods: {
    async _setFormInitData (id) {
      // 传入id时初始化
      if (id) this.obj.id = ''
      let dataId = id || this.dataId
      this.$emit('update:loading', true)
      let promise
      if (this.code) {
        promise = phrapi.getTemplateByCode(this.code, this.dptId, this.visitId, this.patientId)
      } else {
        if (!this.schemaId) return
        promise = phrapi.queryTemplateDetail(this.schemaId)
      }
      try {
        await promise.then(result => {
          this.$emit('update:loading', false)
          if (!result) return
          // 获取数据模版数据 formDataId
          this.formDataId = result.formDataId || ''
          // console.log(result, 'result')
          this.tpl = result
          let obj = getMixed(this.tpl.element)
          // 表单元素出现规则逻辑
          if (result.ruleData) {
            if (result.ruleData.patientInfo) obj.obj.patientInfo = result.ruleData.patientInfo
            if (result.ruleData.metaData) obj.obj.metaData = result.ruleData.metaData
          }
          this.schema = obj.schema
          this.$emit('update:schemaId', this.tpl.templateId)
          this.rules = obj.rules
          if (!this.obj.id) {
            this.obj = obj.obj || {}
            setLocal(obj.obj)
            this.obj.createUpdate = true
            this.setDiagnosisValue(obj.obj)
          }
          return this.tpl.templateId
        }).then(async schemaId => {
          // 获取数据模版数据或者回显数据
          if (!schemaId) {
            this.$emit('fail')
            return this.$messageTips(this, 'warning', '表单数据缺失，请联系管理员配置', '提示')
          }
          let result = null
          // -1为新建模版
          // 点击实例渲染模版
          let params = {
            formTemplateId: schemaId,
            visitId: this.visitId,
            patientId: this.patientId,
            dptId: this.dptId
          }
          if (this.code) params.code = this.code
          if (!dataId) {
            if (this.code) {
              result = await phrapi.getFormData(params)
            }
            this.$emit('update:loading', false)
          } else {
            if (dataId === '-1') {
              // 第一次新建的记录 需要取默认的数据模版数据 回显的数据
              // dataEcho 是否为数据回显 回显时不传参数id
              if (!this.dataEcho) params.id = '-1'
              let formDataId = this.dataModelId || this.formDataId
              let formDataRes = {}
              if (!formDataId && this.code) {
                result = await phrapi.getFormData(params)
              } else {
                // 回显数据优先覆盖数据模版数据
                result = {}
                if (this.code) {
                  let [formData, echoResult] = await Promise.all([
                    api.getById(formDataId),
                    phrapi.getFormData(params)
                  ])
                  result = echoResult
                  formDataRes = formData && formData.data || {}
                  let echoData = result && result.data || null
                  if (echoData) Object.assign(formDataRes, echoData)
                } else {
                  let formData = await api.getById(formDataId)
                  formDataRes = formData && formData.data || {}
                }
                result.data = formDataRes
              }
              this.$emit('update:loading', false)
            } else {
              if (dataId) result = await phrapi.getByRecordId4FormData(dataId)
              this.$emit('update:loading', false)
            }
          }
          if (result && result.code) {
            this.$emit('update:code', result.code)
          }
          if (result === null) return false
          let data
          if (result.data) {
            data = result.data
            data.id = result.id
            data.formDataId = result.formDataId
            data.createUpdate = true
          }
          this.obj = Object.assign({}, this.obj, data)
          setLocal(this.obj)
          // 记录时间逻辑判断
          if (!id && result.recordTime) {
            this.watchRecordTime = false
            this.recordTime = result.recordTime
            this.initRecordTime = result.recordTime
          }

          this.setDiagnosisValue(this.obj)
        })
      } catch (err) {
        console.log('---err---', err)
      }
      this.$emit('finished', this.tpl)
    },
    getTempData (time) {
      let recordTime = time ? this.$moment(time).format('YYYY-MM-DD HH:mm:ss') : ''
      phrapi.getByCodeAndVisitId({
        visitId: this.visitId,
        code: this.code,
        dptId: this.dptId,
        recordTime: recordTime
      }).then(res => {
        let resId = '-1'
        if (res && res.id) {
          resId = res.id
        }
        if (this.isCreate) {
          this._setFormInitData(resId)
        } else {
          if (resId !== '-1') {
            this.$messageTips(this, 'warning', '选定时间已有记录', '提示')
            this.watchRecordTime = false
            this.recordTime = this.initRecordTime
          }
        }
      })
    },
    handleClinicSave () {
      if (clinicCodes.includes(this.code) && this.$route.name === 'patientcase') {
        getCategoryNameByCode(this.code, (categoryName) => {
          commandLog({
            content: `保存${clinicCodeText[this.code]}`,
            opModuleOne: `电子病历-门诊病历-${categoryName}`,
            opType: 'SAVE',
            visitNumber: this.visitId,
            patientId: this.patientId,
            patientName: this.$route.query.patientName
          })
        })
      }
    },
    save ({formTemplateName, templateScopeId} = {}) {
      this.setBlood()
      this.obj.visitId = this.visitId
      this.obj.patientId = this.patientId
      this.obj.dptId = this.dptId
      if (this.hasRecordTime) {
        this.obj.recordTime = this.recordTime ? this.$moment(this.recordTime).format('YYYY-MM-DD HH:mm:ss') : ''
      }

      if (!this.checkForm(this.$refs.form)) {
        this.focusErrorInput()
        return
      }
      this.$refs.form.$refs.form.validate(async valid => {
        if (valid) {
          if (this.obj.id && this.obj.id === '-1' || this.obj.id === null) delete this.obj.id
          let params = {
            formTemplateId: this.schemaId,
            data: this.obj,
            env: {
              visitId: this.visitId,
              patientId: this.patientId,
              dptId: this.dptId
            },
            code: this.code,
            templateScopeId,
            formTemplateName
          }
          let result = await phrapi.createOrUpdate(params)
          this.$emit('update:loading', false)
          let title = this.title || ''
          if (result.id) {
            this.handleClinicSave()
            this.obj = Object.assign({}, this.obj, { id: result.id })
            this.$messageTips(this, 'success', `${title}保存成功`, '提示')
            this.$emit('success', result)
          } else {
            this.$messageTips(this, 'error', `${title}保存失败`, '提示')
          }
        } else {
          this.focusErrorInput()
        }
      })
    },
    contentSave () {
      if (this.autoSave) {
         // 读租户全局配置 是否自动保存
        let autoSaveGonfig = this.$ever.getClinicConfig().AUTO_SAVE_MEDICAL_RECORD
        let isAuto = autoSaveGonfig && autoSaveGonfig !== '0' && !isNaN(+autoSaveGonfig)
        if (isAuto) {
          this.$bus.$emit('medicalAutoSave', true)
          this.$emit('contentUpdate', 'form')
        }
      }
    }
  },

}
</script>
<style lang="scss" scoped>
  .diabdled_mask{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.01);
  }
</style>
