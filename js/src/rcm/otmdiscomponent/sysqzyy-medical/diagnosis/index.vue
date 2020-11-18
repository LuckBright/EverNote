/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-06-24 14:43:48
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-06-28 18:52:04
 */
<script>
import { updateDiagnosis, cancelDiagnosis } from '@/rcm/store/otmdiscomponent/sysqzyy-api.js'
import { schema, rules } from './index.js'
import { sysqzyyCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import { cloneDeep } from 'lodash'
function msgCom (data) {
  const { head: { errCode } } = data
  if (errCode === 0) {
    this.$messageTips(this, 'success', '操作成功')
    this.visible = false
  }
}
export default {
  name: 'diagnosisInfomation',
  props: {
    rowData: {
      type: Object,
      default: _ => ({})
    }, // 就诊登记ID
    dialogShow: {
      type: Boolean,
      default: false
    },
    isMaintain: { // 诊断信息维护：true |诊断信息撤销：false
      type: Boolean,
      default: true
    },
    dialogWidth: {
      type: String,
      default: '800px'
    }
  },
  computed: {
    visible: {
      get: function () {
        return this.dialogShow
      },
      set: function (val) {
        this.$emit('update:dialogShow', val)
      }
    }
  },
  data () {
    return {
      schema: [],
      obj: {},
      rules,
      dynamic: [],
      sysqzyyCode
    }
  },
  created () {
    // 动态获取form表单所需schema，obj
    this.schema = !this.isMaintain ? schema.filter(item => item.isMaintain).map(
      item => {
        if (item.name === 'diagnosisSeq') {
          return ({ ...item, comp: 'input' })
        }
        return { ...item, span: 11 }
      }) : schema.filter(item => !item.isDynamic)
    this.dynamicSchema = schema.filter(item => item.isDynamic)
    this.dynamicObj = this.$ever.createObjFromSchema(this.dynamicSchema)
    this.addDynamicSchema()
    this.obj = this.$ever.createObjFromSchema(this.schema)
    this.obj = Object.assign({}, this.obj, this.rowData)
  },
  methods: {
    close () {
      this.$emit('update:dialogShow', false)
    },
    // 添加诊断form内容
    addDynamicSchema () {
      this.dynamic.push({
        dynamicSchema: cloneDeep(this.dynamicSchema),
        dynamicObj: cloneDeep(this.dynamicObj)
      })
    },
    // 检测诊断信息是否有未填写的字段
    checkDynamicObjIsFalse () {
      const len = this.dynamic.length
      const map = []
      for (let i = 0; i < len; i++) {
        const { dynamicObj } = this.dynamic[i] || {}
        const { diagnosisSeq } = dynamicObj || {}

        // 检查是否顺序重复
        if (map.indexOf(diagnosisSeq) > -1) {
          return true
        } else {
          map.push(diagnosisSeq)
        }
        for (let key in dynamicObj) {
          const value = dynamicObj[key]
          if (!value) return true
        }
      }
      return false
    },
    // 新增诊断信息
    handleAddDiagnosis () {
      if (this.checkDynamicObjIsFalse()) return this.everWarning('请填写诊断信息，诊断日期，诊断顺序，或者检查诊断顺序是否重复')
      this.addDynamicSchema()
    },
    handleDeleteDiagnosis (index) {
      this.dynamic.splice(index, 1)
    },
    submit () {
      const validate = []

      Object.keys(this.$refs).forEach(key => {
        if (key === 'dynamicForm') {
          this.$refs[key].forEach(item => {
            item.$refs.form.validate(valid => {
              validate.push(valid)
            })
          })
        } else {
          this.$refs[key].$refs.form.validate(valid => {
            validate.push(valid)
          })
        }
      })
      if (validate.every(truly => !!truly)) {
        if (this.isMaintain) {
          // 维护操作 拿拼装好的params和后端交互
          const params = []
          this.dynamic.map(item => item.dynamicObj).forEach(item => {
            const { id: diagnosisCode, name: diagnosisName } = item.diagnosisInfomation || {}
            // delete (item.diagnosisInfomation)
            params.push({
              ...item,
              ...this.obj,
              diagnosisName,
              diagnosisCode
            })
          })
          this.handleMaintain(params)
        } else {
          // 撤销操作 拿this.obj 和后端交互
          this.handleUndo(this.obj)
        }
      }
    },
    handleUndo (param) {
      // 撤销操作 拿this.obj 和后端交互
      let params = {
        macId: this.macId,
        insuranceOrgId: this.obj.insuranceOrgId,
        visitNumber: this.obj.visitNumber,
        param: param
      }
      cancelDiagnosis(params).then(res => {
        msgCom.call(this, res)
      })
    },
    handleMaintain (param) {
      // 维护操作 拿拼装好的params和后端交互
      let params = {
        macId: this.macId,
        insuranceOrgId: this.obj.insuranceOrgId,
        visitNumber: this.obj.visitNumber,
        param: param
      }
      updateDiagnosis(params).then(res => {
        msgCom.call(this, res)
      })
    }
  }
}
</script>

<template>
  <el-dialog
    :visible.sync="visible"
    :width="dialogWidth"
    :close-on-click-modal="false"
    :append-to-body="true"
    @close="close"
  >
    <span slot="title">诊断信息{{isMaintain ? '维护' : '撤销'}}</span>
    <div v-if="visible">
      <ever-form2
        :schema="schema"
        v-model="obj"
        ref="form"
        label-width="90px"
        :span="12"
        :rules="rules"
        @submit="submitForm()"
      >
        <template slot="rowCustom">
          <div v-for="(item, index) in dynamic" :key="index" style="margin-left: -90px">
            <ever-form2
              :schema="item.dynamicSchema"
              v-model="item.dynamicObj"
              v-ever-bind-enter
              ref="dynamicForm"
              label-width="90px"
              :span="12"
              :rules="rules"
              @submit="submitForm()"
            >
              <template slot="diagnosisSeq">
                <el-input class="inline-block w50" v-model="item.dynamicObj.diagnosisSeq"></el-input>
                <el-button class="inline-block mr10 fr" type="text">
                  <i
                    v-if="index == dynamic.length - 1"
                    @click="handleAddDiagnosis"
                    class="iconfont icon-tianjia"
                  ></i>
                  <i
                    v-if="dynamic.length > 1"
                    @click="handleDeleteDiagnosis(index)"
                    class="iconfont icon-delete"
                  ></i>
                </el-button>
              </template>
              <template slot="default">
                <el-col></el-col>
              </template>
            </ever-form2>
          </div>
        </template>
        <template slot="default">
          <el-col></el-col>
        </template>
      </ever-form2>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确认</el-button>
      <el-button @click="close">取消</el-button>
    </span>
  </el-dialog>
</template>

<style scoped lang="scss">
.w50 {
  width: 50px;
}
/deep/
  .el-form:not(.custom-form)
  .el-form-item--small.el-form-item:not(.custom-form-item).noMargin {
  margin-bottom: 0 !important;
}
</style>
