<template>
  <div class="ever_diagnosis_wrap">
    <div class="add_btn">
      <span @click="addItem"
            :class="{disabled: disabled}">
        <i class="iconfont icon-tianjia"></i>
        <a class="a_ui_02">添加</a>
      </span>
    </div>
    <template v-if="value && value.length">
      <el-form v-for="(item, i) in value"
               class="el-form--child-comp"
               :key="i"
               :rules="rules"
               :model="item"
               ref="form"
               labelWidth="96px"
               style="margin-bottom:22px"
               :show-message="false"
               :disabled="disabled">
        <el-row :gutter="10">
          <el-col :span="rowSpan[0]">
            <div class="item">
              <el-form-item prop="name"
                            label="手术名称">
                <el-autocomplete select-when-unmatched
                                 v-model="item.name"
                                 custom-item="custom-item-li"
                                 :fetch-suggestions="(name, callback) => {querySurgical(name, callback, i)}"
                                 placeholder="请输入手术名称"
                                 @select="(val) => {handleSelect(val, i)}"></el-autocomplete>
              </el-form-item>
            </div>
            <el-row class="item">
              <el-col :span="12">
                <el-form-item prop="date"
                              label="手术日期">
                  <el-date-picker placeholder="请选择手术日期"
                                  v-model="item.date"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="level"
                              label="手术级别">
                  <sys-type code="CV05.10.024"
                            v-model="item.level"
                            :useObject="true"
                            :objSimple="true"
                            :clearable="true"></sys-type>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="item">
              <el-col :span="12">
                <el-form-item prop="operator"
                              label="手术术者">
                  <everStaffSelect v-model="item.operator"
                                   :disabled="disabled"
                                   :params="staffParams"
                                   ref="operator"></everStaffSelect>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="assistant"
                              label="手术助理">
                  <everStaffSelect v-model="item.assistant"
                                   :disabled="disabled"
                                   :multiple-limit="assistantLen"
                                   :params="staffParams"
                                   :multiple="true"
                                   :collapse-tags="true"
                                   ref="assistant"></everStaffSelect>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="item">
              <el-col :span="12">
                <el-form-item prop="anesthesiologist"
                              label="手术麻醉师">
                  <everStaffSelect v-model="item.anesthesiologist"
                                   :disabled="disabled"
                                   :params="staffParams"
                                   ref="anesthesiologist"></everStaffSelect>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="anaes"
                              label="麻醉方式">
                  <sys-type code="CV06.00.103"
                            v-model="item.anaes"
                            :useObject="true"
                            :objSimple="true"
                            :clearable="true"></sys-type>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="item">
              <el-col :span="12">
                <el-form-item prop="incisionLevel"
                              label="切口等级">
                  <sys-type code="PHR_CV05.10.022"
                            v-model="item.incisionLevel"
                            :useObject="true"
                            :objSimple="true"
                            :clearable="true"></sys-type>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="healingCategory"
                              label="愈合类别">
                  <sys-type code="CV05.10.023"
                            v-model="item.healingCategory"
                            :useObject="true"
                            :objSimple="true"
                            :clearable="true"></sys-type>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="rowSpan[1]"
                  class="handle_btn">
            <ever-confirm :msg="'确定删除？'"
                          action="删除"
                          placement="top"
                          @confirm="delItem(i)">
              <template slot="action">
                <i class="iconfont icon-delete fl"></i>
              </template>
            </ever-confirm>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="10"
                  :offset="2"></el-col>
        </el-row>
      </el-form>
    </template>
  </div>
</template>

<script>
import api from '@/inpatient/store/phr'
import medicalapi from '@/workspace/store/medicalapi'
export default {
  props: ['value', 'type', 'check', 'disabled'],
  data () {
    let rowSpan = [22, 2]
    function check (rule, value, callback) {
      callback()
    }
    function checkAssistant (rule, value, callback) {
      if (!value || value.length > 2) {
        callback(new Error('必填项，手术助理最多选择两人'))
      } else {
        callback()
      }
    }
    return {
      api,
      loading: false,
      assistantLen: 2,
      manulist: [],
      staffParams: {
        typeCodeList: ['DOCTOR'],
        everQueryType: 'out',
      },
      rules: {
        name: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        date: [
          { required: true, message: '必填项', trigger: 'change', type: 'object' }
        ],
        level: [
          { required: true, message: '必填项', trigger: ['blur', 'change'], type: 'object' }
        ],
        operator: [
          { validator: check, required: true, trigger: ['blur', 'change'] }
        ],
        assistant: [
          { validator: checkAssistant, required: true, trigger: ['blur', 'change'] }
        ],
        anesthesiologist: [
          { validator: check, required: true, trigger: ['blur', 'change'] }
        ],
        anaes: [
          { required: true, message: '必填项', trigger: ['blur', 'change'], type: 'object' }
        ],
        incisionLevel: [
          { required: true, message: '必填项', trigger: ['blur', 'change'], type: 'object' }
        ],
        healingCategory: [
          { required: true, message: '必填项', trigger: ['blur', 'change'], type: 'object' }
        ]
      },
      rowSpan
    }
  },
  methods: {
    addItem () {
      if (this.disabled) return
      let emptyObj = { name: '', code: '', date: '', level: '', operator: '', assistant: [], anesthesiologist: '', anaes: '', incisionLevel: '', healingCategory: '' }
      let isValid = true
      if (this.$refs.form) {
        isValid = this.validate()
      }
      if (isValid) this.value.push(Object.assign({}, emptyObj))
    },
    delItem (i) {
      this.value.splice(i, 1)
    },
    querySurgical (name, callback, index) {
      if (!name) {
        callback([])
        return false
      }
      medicalapi.searchDiagnose({
        type: 3,
        origId: this.$store.state.currentUser.organizationId,
        name: name
      }).then(data => {
        this.loading = false
        data = data && data.data && data.data.resultList || null
        if (data && data.length) {
          data.map(item => {
            item.value = item.name || item.diseaseName
            return item
          })
          callback(data)
        } else {
          callback([])
        }
      })
    },
    validate () {
      let allValid = true
      if (this.$refs.form) {
        this.$refs.operator.forEach(item => {
          item.$refs.form.validate(valid => {
            if (!valid) {
              allValid = false
            }
          })
        })
        this.$refs.assistant.forEach(item => {
          item.$refs.form.validate(valid => {
            if (!valid) {
              allValid = false
            }
          })
        })
        this.$refs.anesthesiologist.forEach(item => {
          item.$refs.form.validate(valid => {
            if (!valid) {
              allValid = false
            }
          })
        })
        this.$refs.form.forEach(item => {
          item.validate((valid) => {
            if (!valid) {
              allValid = false
            }
          })
        })
      }
      return allValid
    },
    handleSelect (val, index) {
      this.value[index].code = val.code
    },
    getStringVal () {
      if (!this.value || !this.value.length) {
        return null
      }
      return this.value.map(v => {
        return v.name
      }).join(',')
    }
  },
  watch: {
    'check' () {
      this.rowSpan = this.check ? [12, 6, 4, 2] : [14, 8, 2]
    },
    'value': {
      handler (val) {
        if (!val) {
          this.$emit('input', [])
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.ever_diagnosis_wrap {
  overflow: hidden;
  .el-form {
    padding: 10px 0 10px 5px;
    margin-bottom: 10px;
    background: #f4f4f4;
    border-radius: 4px;
    .tips_txt {
      position: absolute;
      left: 0;
      bottom: -18px;
      line-height: 20px;
      font-size: 12px;
      color: #999;
      padding: 0 10px 0 80px;
    }
    .el-col {
      .item {
        position: relative;
        /deep/ .el-date-editor.el-input {
          width: 100%;
        }
        .el-form {
          padding: 0;
          /deep/ .el-form-item {
            margin: 0;
          }
        }
      }
      &:nth-last-child(2) {
        padding-right: 15px !important;
      }
    }
    /deep/ .el-col-22 {
      /deep/ .el-form-item {
        margin: 10px 0;
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  .handle_btn {
    padding: 0;
    white-space: nowrap;
    /deep/ span {
      display: inline-block;
    }
    .iconfont {
      padding: 5px;
      color: #aaa;
    }
  }
  .add_btn {
    font-weight: 500;
    .disabled {
      cursor: not-allowed;
    }
    span {
      cursor: pointer;
    }
    .iconfont {
      color: #1c78ef;
      font-size: 14px;
      margin-right: 5px;
    }
  }
  .el-autocomplete {
    width: 100%;
  }
}
</style>
