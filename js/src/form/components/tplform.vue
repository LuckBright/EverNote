<template>
  <div class="tplform">
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
      @focus="(name, obj) => {this.$emit('focus', name, obj)}"
      @click="(name, obj) => {this.$emit('click', name, obj)}"
      class="form remote-form"
      :nosubmit="true"
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

import { getMixed } from '@/util/formconverter'
/* 新引入的 */
import urlMap from '@/inpatient/urls'
import { request } from '@/util/req'
import storage from '@/util/storage'
import phrapi from '../store/phrapi'
import {deepObjectCompile} from '@/util/diff'

export default {
  props: ['dataId', 'schemaId', 'code', 'visitId', 'patientId', 'slotNames', 'value', 'dptId', 'nosubmit', 'readonly', 'allDisabled', 'lock', 'nodeType', 'dataModelId', 'loading', 'title', 'dataEcho'],
  data () {
    return {
      isUpdate: false,
      schema: [],
      rules: null,
      tpl: {
        props: {}
      },
      initObj: {},
      obj: {},
      recordTime: new Date(),
      initRecordTime: '',
      watchRecordTime: true,
      createUpdate: false,
      isCreate: !this.dataId ? !0 : !1
    }
  },
  created () {
    // console.log('走表单里面了')
    this.initForm()
  },
  computed: {
    hasRecordTime () {
      return this.tpl.templateId && this.tpl.props && this.tpl.props.hasRecordTime
    }
  },
  methods: {
    initForm () {
      if (this.dataId) {
        this.getInstance()
      } else {
        this.getTpl()
      }
    },
    getTpl () {
      request(urlMap.medicalRecord.getDocTpl, {
        id: this.schemaId
      }).then(res => {
        // this.schema = res.data.schema.element
        this.tpl = res.data.schema
        let obj = getMixed(this.tpl.element)
        this.schema = obj.schema
        this.rules = obj.rules
        this.obj = obj.obj
        this.isUpdate = true
        // 把初始化的form数据存储起来，方便改变了发生对比
        storage.setLocalStorage('oldForm', JSON.stringify(obj.obj))
      })
    },
    getInstance (id) {
      request(urlMap.medicalRecord.getInstance, {
        id: id || this.dataId
      }, 'get').then(res => {
        // this.schema = res.data.template.schema.element
        this.tpl = res.data.template.schema
        let obj = getMixed(this.tpl.element)
        this.obj = obj.obj
        this.schema = obj.schema
        this.rules = obj.rules
        setTimeout(_ => {
          this.obj = res.data.data
        }, 500)
        this.isUpdate = true
        this.recordTime = res.data.recordTime
        // 把初始化的form数据存储起来，方便改变了发生对比
        storage.setLocalStorage('oldForm', JSON.stringify(res.data.data))
      })
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
          this.getInstance(resId)
        } else {
          if (resId !== '-1') {
            this.$messageTips(this, 'warning', '选定时间已有记录', '提示')
            this.watchRecordTime = false
            this.recordTime = this.initRecordTime
          }
        }
      })
    },
    save () {
      this.obj.visitId = this.visitId
      this.obj.patientId = this.patientId
      this.obj.dptId = this.dptId
      if (this.hasRecordTime) {
        this.obj.recordTime = this.recordTime ? this.$moment(this.recordTime).format('YYYY-MM-DD HH:mm:ss') : ''
      }
      let isValid = true
      if (this.$refs.form) {
        if (this.$refs.form.$refs.selfvalidate) {
          let comps = this.$refs.form.$refs.selfvalidate
          if (!Array.isArray(comps)) {
            comps = [comps]
          }
          for (let i = 0; i < comps.length; i++) {
            if (comps[i] && comps[i].$refs.form) {
              if (Array.isArray(comps[i].$refs.form)) {
                for (let j = 0; j < comps[i].$refs.form.length; j++) {
                  if (
                    comps[i].$refs.form[j] &&
                    comps[i].$refs.form[j].validate
                  ) {
                    comps[i].$refs.form[j].validate(valid => {
                      if (!valid) {
                        isValid = false
                      }
                    })
                  }
                }
              } else if (comps[i].$refs.form.validate) {
                comps[i].$refs.form.validate(valid => {
                  if (!valid) {
                    isValid = false
                  }
                })
              }
            }
          }
        }
        let toothCheck = true
        if (this.$refs.form.$refs.toothSelect) {
          let comps = this.$refs.form.$refs.toothSelect
          if (!Array.isArray(comps)) {
            comps = [comps]
          }
          for (let i = 0; i < comps.length; i++) {
            if (
              comps[i] &&
              comps[i].toothValue &&
              comps[i].toothValue.toothPick
            ) {
              let isSelect = false
              for (let tooth in comps[i].toothValue.toothPick) {
                if (comps[i].toothValue.toothPick[tooth]) {
                  isSelect = true
                }
              }
              // 当齿科组件选择  input必须有值
              if (isSelect && !comps[i].toothValue.input) {
                isValid = false
                toothCheck = false
              }
            }
          }
        }
        if (!toothCheck) {
          this.$messageTips(
            this,
            'warning',
            '您选择了患者牙位，请填写对应描述！',
            '提示'
          )
        }
      }
      if (!isValid) {
        this.focusErrorInput()
        return
      }
      this.$refs.form.$refs.form.validate(async valid => {
        if (valid) {
          if (this.obj.id && this.obj.id === '-1' || this.obj.id === null) delete this.obj.id
          let result = await phrapi.createOrUpdate(
            this.schemaId,
            this.obj,
            {
              visitId: this.visitId,
              patientId: this.patientId,
              dptId: this.dptId
            },
            this.code
          )
          this.$emit('update:loading', false)
          let title = this.title || ''
          if (result.id) {
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
    validate (cb) {
      this.$refs.form.$refs.form.validate(cb)
    },
    focusErrorInput () {
      this.$nextTick(_ => {
        setTimeout(() => {
          let errorDom = document.querySelectorAll('.is-error')
          if (errorDom && errorDom.length) {
            let input = errorDom[0].querySelector('.el-input__inner')
            input && input.focus()
          }
        }, 300)
      })
    }
  },
  watch: {
    obj: {
      handler (val) {
        if (val) {
          if (this.hasRecordTime) {
            this.obj.recordTime = this.recordTime ? this.$moment(this.recordTime).format('YYYY-MM-DD HH:mm:ss') : ''
          }

          let oldForm = JSON.parse(storage.getLocalStorage('oldForm'))
          if (this.isUpdate) {
            this.$emit('update', deepObjectCompile(oldForm, val))
          }
          this.$emit('input', val)
        }
      },
      deep: true,
      immediate: true
    },
    value: {
      handler (val) {
        Object.assign(this.obj, val)
      },
      deep: true
    },
    recordTime (val, old) {
      if (val !== old) {
        if (!this.watchRecordTime) {
          this.watchRecordTime = true
          return
        }
        // this.getTempData(val)
      }
    }
  }

}
</script>
<style lang="scss" scoped>
  .diabdled_mask{
    position: absolute;
    top: 0;
    left: 0;
    // right: 0;
    // bottom: 0;
    background: rgba(0, 0, 0, 0.01);
    width:100%;
    height:100%;
    z-index:100;
  }
  .tplform{
    // max-height:700px;
    // overflow:auto;
    padding:20px;
    position: relative;
  }
</style>
