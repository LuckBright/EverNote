<template>
<div class="temperature_input flex_column_full_hidden">
  <!-- 时间{{recordTime}} -->
  <record-time
    :picker-options="pickerOptions"
    :start-time="startTime"
    v-model="recordTime"
    :is-update.sync="isUpdate"
  >
      <div slot="saveBtn">
        <el-button
          :disabled="disabled"
          type="primary" 
          @click="save" 
          v-if="editable"
        >保 存</el-button>
      </div>
  </record-time>
  <el-divider></el-divider>
  <el-row v-loading="loading" class="form_container flex_col_1_auto">
      <ever-form2
        :key="recordTime"
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
      </ever-form2>
    </el-row>
</div>
</template>
<script>
// timeMode,timePeriodConfig
import { getMixed } from '@/util/formconverter'
import urlMap from '@/emr/urls'
import { request } from '@/util/req'
// import {tmpData} from './data.js'
import {
  blood1,
  blood2,
  readOnlyAll,
  readonlyObj,
  editableObj,
  editableObj2,
  emptyTemp,
  watchTmpData,
  tmpData,
  ztData,
  editableType,
  readonlyType,
  selectTimeRange
  } from '@/emr/config/temperaturedata.js'

import { deepObjectCompile } from '@/util/diff'
import recordTime from '@/emr/components/recordtime'
import {commandLog} from '@/phr/mixin/operationLog.js'

export default{
  name: 'temperature_input',
  components: {
    recordTime
  },
  props: {
    curNode: {
      type: Object
    },
    'visitId': {
      type: String
    },
    'patientId': {
      type: String
    },
    'patientName': {
      type: String
    },
    'dptId': {
      type: String
    },
    'authority': {
      type: Number
    }
  },
  data () {
    return {
      pickerOptions: {},
      startTime: 2, // 获取体温单配置的起始时间点
      selectTimeRange,
      code: 'TI_WEN_DAN',
      ...watchTmpData, // 需要监听的数据，体温测量方式，体温，疼痛评分
      tmpData, // 体温降温升温
      ztData, // 镇痛后评分
      loading: true,
      recordTime: '',
      tpl: {
        props: {}
      },
      oldObj: {},
      obj: {},
      isUpdate: false,
      schema: [],
      rules: null,
      formTemplateId: '',
      instanceId: null,
      leaveTime: null,
      hospitalizedTime: null,
      isLock: null
    }
  },
  computed: {
    disabled () {
      return this.leaveTime ? new Date(this.leaveTime).getTime() <= new Date(this.recordTime).getTime() : false
    },
    editable () { // 判断角色和权限
      // 护士为可编辑状态
      return this.$route.meta && this.$route.meta.prole === 2 && this.authority !== 1 && this.isLock !== 1
    }
  },
  watch: {
    'recordTime' (val) {
      this.searchForm()
    },
    'isUpdate' (val) {
      this.$emit('editorIsUpdated', val, this.curNode)
    },
    obj: {
      handler (val) {
        // 只读权限时,，全部不可编辑
        this.readOnly()
        if (!this.editable) {
          return false
        }
        // 监听更新
        this.isUpdate = deepObjectCompile(this.oldObj, this.obj)
        // 判断需要设置disabled的元素
        this.setDisabled()
      },
      deep: true
    }
  },
  methods: {
    checkData () {
      let isValid = true
      // 先校验简单组件
      this.$refs.form.$refs.form.validate(valid => {
        isValid = valid
      })
      if (!isValid) return false
      // 事件组件
      if (this.$refs.form.$refs.selfvalidate) { // 有自定义校验
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

      return isValid
    },
    async save () { // 保存表单
      if (!this.checkData()) return false
      this.loading = true
      await this.mergeObj()
      let params = {
        id: this.instanceId,
        formTemplateId: this.formTemplateId,
        code: this.code,
        data: this.obj,
        recordTime: this.recordTime,
        visitType: 3// 815新增
      }
      request(urlMap.form.create, params).then(res => {
        this.loading = false
        if (res.head.errCode === 0) {
          commandLog({
            content: '保存体温单',
            opModuleOne: '护理文书-护理文书-体温记录单',
            opType: 'SAVE',
            patientId: this.patientId,
            visitNumber: this.visitId,
            patientName: this.patientName
          })
          this.$messageTips(this, 'success', `体温单保存成功`, '提示')
          this.isUpdate = false
          this.searchForm()
          this.$bus.$emit('cheartView:update')
          request(urlMap.templateManage.getCategoryId, {
            code: this.code
          }).then(result => {
            let obj = Object.assign({}, this.curNode, {
              id: res.data.id,
              templateScopeId: res.data.templateScopeId,
              categoryId: result.data.id,
              categoryName: result.data.name
            })
            this.$emit('saveSuccess', obj)
          })
        }
      })
    },
    emptyObj () {
      this.obj = Object.assign(this.obj, emptyTemp)
    },
    getHostipalRange (obj) {
      let entry = new Date(obj.hospitalizedTime).getTime() - 1000 * 60 * 60 * 24
      let leave = obj.leaveHospitalTime ? new Date(obj.leaveHospitalTime).getTime() : null
      this.pickerOptions = {
        disabledDate (time) {
          if (leave) {
            return time.getTime() <= entry || leave <= time.getTime()
          } else {
            return time.getTime() <= entry
          }
        }
      }
    },
    searchForm (id) { // 根据记录时间查询表单
      this.loading = true
      // 先清空之前的数据
      this.emptyObj()
      let params = {
        visitId: this.visitId,
        code: this.code,
        dptId: this.dptId,
        patientId: this.patientId,
        recordTime: this.recordTime
      }
      request(urlMap.form.getTmpData, params).then(res => {
        if (res.head.errCode === 0) {
          this.loading = false
          this.startTime = Number(JSON.parse(res.data.timePeriodConfig)[0])
          this.getHostipalRange(res.data)
          this.createForm(res.data)
          this.leaveTime = res.data.leaveHospitalTime
          this.hospitalizedTime = res.data.hospitalizedTime
          this.isLock = res.data.lock
          this.readOnly()
        }
      })
    },
    setItemDisabled (data, bollean) { // 设置每个指定元素的diabled的值
      this.schema.forEach((item, index) => {
        if (data.includes(item.name)) {
          this.$set(item.props, 'disabled', bollean)
        }
      })
    },
    setDisabled () { // 对元素进行disabled的逻辑处理
      // 体温测量方式的值
      const tmpTypeVal = this.obj[this.tmpType]
        // 设置可编辑（降温，升温，镇痛后评分除外）
      if (editableType.includes(tmpTypeVal)) {
        this.setItemDisabled(editableObj, false)
        this.setItemDisabled(editableObj2, true)
      }
        // 设置只读（拒测和外出时)
      if (readonlyType.includes(tmpTypeVal)) {
          // 清空数据
        this.obj = Object.assign(this.obj, emptyTemp)
        this.setItemDisabled(readonlyObj, true)
        return false
      }
      // 监听疼痛评分
      if (!this.obj[this.pain]) {
        this.setItemDisabled(this.ztData, true)
        this.emptyData(this.ztData)
      } else {
        this.setItemDisabled(this.ztData, false)
      }
      // 监听体温值
      if (!this.obj[this.tmpNum]) {
        this.setItemDisabled(this.tmpData, true)
        this.emptyData(this.tmpData)
      } else {
        this.setItemDisabled(this.tmpData, false)
      }
    },
    emptyData (data) {
      data.forEach(item => {
        this.obj[item] = null
      })
    },
    mergeObj () { // 保存的时候对obj进行merge操作
      let blood = 'DL_XUE_YA'
      if (this.obj[blood]) {
        if (!this.obj[blood][blood1] && !this.obj[blood][blood2]) {
          this.obj[blood] = null
        }
      }
      this.obj = Object.assign(this.obj, {
        patientId: this.patientId,
        visitId: this.visitId,
        dptId: this.dptId,
        recordTime: this.recordTime,
        formDataId: this.formDataId
      })
    },
    createForm (res) { // 生成表单需要的参数
      this.tpl = res.template.schema
      this.formTemplateId = res.template.schema.templateId
      let obj = getMixed(this.tpl.element)
      this.schema = obj.schema
      this.rules = obj.rules
      this.obj = obj.obj
      this.oldObj = JSON.parse(JSON.stringify(obj.obj))
      if (res.data) {
        this.obj = Object.assign(obj.obj, res.data)
        this.oldObj = JSON.parse(JSON.stringify(this.obj))
      }
      this.instanceId = res.id ? res.id : null
    },
    readOnly () { // 全部设置成只读模式
      // 2020-07-01 15:00:00

      let getTimeStamp = (time) => this.$moment(time ? time.split(' ')[0] : null).valueOf()
      let curTime = getTimeStamp(this.recordTime)
      let enterTime = getTimeStamp(this.hospitalizedTime)
      let leaveTime = this.leaveTime ? getTimeStamp(this.leaveTime) : getTimeStamp('2099-12-31 00:00:00')
      if (enterTime <= curTime && curTime <= leaveTime && this.editable) return false
      // {
      //   if (this.$route.query.from && this.$route.query.from !== 'medicalReview') return false
      // }
      let status = leaveTime < (new Date().getTime()) || false
      if (!this.editable || status) {
        this.setItemDisabled(readOnlyAll, true)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.temperature_input{
  padding:20px;
  .form_container{
    padding-bottom:40px;
    /deep/.el-radio{
      margin-right:14px;
    }
  }
}
</style>
