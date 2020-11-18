<template>
  <div v-if="input && input.length" class="ever_diagnosis_wrap">
    <el-form
      v-for="(item, i) in input"
      class="el-form--child-comp"
      :key="i"
      :rules="rules"
      :model="item"
      ref="form"
      style="margin-bottom:5px"
      :size="size"
      :show-message="showMessage"
      :disabled="disabled"
    >
      <el-row>
        <el-col v-if="type === 1">
          <el-form-item :prop="'list.' + i + '.diseaseType'" :rules="rules.number">
            <el-select
              :disabled="disabled || inputDisabled"
              v-model.number="item.diseaseType"
              @change="(val) => {changeDiseaseType(val, i)}"
            >
              <el-option :label="$t('中医')" :value="1"></el-option>
              <el-option :label="$t('西医')" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item prop="diseaseName">
            <el-autocomplete
              select-when-unmatched
              v-model.trim="item.value"
              custom-item="custom-item-li"
              :disabled="disabled || inputDisabled"
              :fetch-suggestions="(name, callback) => {querySearchAsync(name, callback, i)}"
              placeholder="请输入诊断内容"
              @select="(val) => diagnoseSelect(val, i)"
            >
              <span
                slot="suffix"
                v-if="item.diseaseName"
                class="el-input__icon cBlue input_suffix_01"
              >{{item.diseaseCode}}</span>
              <template slot-scope="{ item }">
                <div class="disease_warp">
                  <span class="col_333" v-if="item.diseaseCodeCategory">{{item.diseaseCodeCategory}}</span>
                  <span>{{ item.diseaseCode }}</span>
                  <span>{{ item | formatLang('diseaseName', true) }}</span>
                  <span class="col_333" v-if="item.diseaseAlias">{{ item.diseaseAlias }}</span>
                </div>
              </template>
              <el-select
                v-model="item.position"
                filterable
                placeholder="部位"
                slot="append"
                v-if="item.positionData && item.positionData.length > 0"
                style="min-width: 60px;"
              >
                <el-option
                  v-for="opt in item.positionData"
                  :key="opt.id"
                  :label="opt.position"
                  :value="opt.position"
                ></el-option>
              </el-select>
            </el-autocomplete>
          </el-form-item>
          <!-- <div class="tips_txt">{{item.diseaseCode}}</div> -->
        </el-col>
      </el-row>
      <el-row>
        <template v-if="!showType">
          <el-col v-if="!only">
            <el-form-item prop="comment">
              <el-input :placeholder="$t('备注')" v-model="item.comment" :disabled="disabled || inputDisabled"></el-input>
            </el-form-item>
          </el-col>
        </template>
        <template v-else>
          <template v-if="showType === 'pathology'">
            <el-col v-if="!only">
              <el-form-item prop="binglihao">
                <el-input :placeholder="$t('病理号')" v-model="item.binglihao"></el-input>
              </el-form-item>
            </el-col>
          </template>
          <template v-if="showType === 'complex'">
            <el-col v-if="!only">
              <el-form-item prop="comment">
                <el-input :placeholder="$t('备注')" v-model="item.comment" :disabled="disabled || inputDisabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col v-if="!only">
              <el-form-item prop="inphospital">
                <sys-type
                  code="CV05.10.019.1"
                  placeholder="入院情况"
                  filterable="true"
                  v-model="item.inphospital"
                ></sys-type>
              </el-form-item>
            </el-col>
            <el-col v-if="!only">
              <el-form-item prop="treatmentSituation">
                <sys-type
                  code="CV05.10.010"
                  placeholder="治疗效果"
                  filterable="true"
                  v-model="item.treatmentSituation"
                ></sys-type>
              </el-form-item>
            </el-col>
          </template>
        </template>
      </el-row>
      <el-row>
        <el-col :span='10' v-if="check && !only">
          <el-form-item prop="diagnoseType">
            <el-checkbox
              v-model="item.diagnoseType"
              :true-label="2"
              :false-label="1"
              :disabled="disabled || inputDisabled"
            >{{$t('待查')}}</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span='10' class="handle_btn" v-if="!only && !disabled">
          <i class="iconfont icon-delete" v-if="input.length > 1" @click="delItem(i)"></i>
          <i class="iconfont icon-tianjia" :disabled="disabled || inputDisabled" v-if="(input.length - 1) === i" @click="addItem"></i>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import api from '@/workspace/store/medicalapi'
import Vue from 'vue'
Vue.component('custom-item-li', {
  functional: true,
  render: function (h, ctx) {
    let item = ctx.props.item
    return h('li', ctx.data, [
      h('span', { attrs: { class: 'name' } }, [item.value]),
      h('label', { attrs: { class: 'code' } }, [item.diseaseCode])
    ])
  },
  props: {
    item: { type: Object, required: true }
  }
})
export default {
  props: {
    value: {
      type: [String, Array]
    },
    type: {
      type: String,
      default: ''
    },
    check: {
      type: Boolean,
      default: false
    },
    only: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showType: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  data () {
    let checkEqual = (rule, value, callback) => {
      if (!value) {
        callback()
        return false
      }
      let obj = this.input.filter(v => {
        return (v && v.diseaseName) === value
      })
      if (obj.length > 1) {
        callback(new Error('该诊断已存在'))
        return false
      }
      callback()
    }
    let rowSpan = this.check ? [3, 12, 4, 3, 3] : [3, 12, 7, 3]
    if (this.showType === 'complex') {
      rowSpan[1] = 7
    }
    if (this.only) rowSpan = [22]
    let emptyObj = {
      diseaseType: this.type ? parseInt(this.type) : '',
      diseaseCode: '',
      diseaseCodeCategory: '',
      diseaseName: '',
      diseaseNameEn: '',
      diseaseOrigId: '',
      diagnoseType: 1,
      comment: '',
      position: '',
      diagnoseList: [],
      positionData: []
    }
    return {
      api,
      loading: false,
      manulist: [],
      diseaseId: null,
      positionData: [],
      currentDisease: {},
      checkEqual,
      inputDisabled: false,
      showMessage: false,
      rules: {
        diseaseType: [
          { required: true, message: '必填项', trigger: ['blur', 'change'], type: 'number' }
        ],
        diseaseName: [
          { required: true, message: '必填项', trigger: ['blur', 'change'] },
          { validator: checkEqual, trigger: 'change' }
        ]
      },
      emptyObj,
      rowSpan,
      input: this.value && this.value.length ? this.value : [Object.assign({}, JSON.parse(JSON.stringify(emptyObj)))],
      subKeys: ['diseaseType', 'diseaseName', 'diseaseNameEn', 'diseaseCode', 'diseaseCodeCategory', 'diseaseOrigId', 'diagnoseType', 'comment', 'position', 'diagnoseList', 'positionData', 'binglihao', 'inphospital', 'treatmentSituation', 'diseaseAlias', 'groupList', 'value']
    }
  },
  created () {
    if (this.input && this.input.length) {
      this.setPositionData()
      this.input.map(item => {
        if (!item.value) {
          item.value = item.diseaseNameEn ? `${item.diseaseNameEn} ${item.diseaseName}` : item.diseaseName
        }
        return item
      })
    }
  },
  mounted () {
    this.bus_on_diagnostic_aid()
  },
  methods: {
    resetInput () {
      this.input = [Object.assign({}, JSON.parse(JSON.stringify(this.emptyObj)))]
    },
    addItem () {
      this.showMessage = false
      let isValid = true
      if (this.$refs.form) {
        let tips = false
        this.$refs.form.forEach(item => {
          item.validate(valid => {
            if (!valid) {
              isValid = false
              // this.showMessage = true
            }
            if (this.input && this.input.length >= 22) { // 最多22个诊断 2018.11.28
              tips = true
              isValid = false
            }
          })
        })
        if (tips) {
          this.$notify({
            title: '警告',
            message: '最多支持22个诊断',
            type: 'warning'
          })
        }
      }
      this.input = this.input || []
      if (isValid) this.input.push(Object.assign({}, JSON.parse(JSON.stringify(this.emptyObj))))
      this.setPositionData()
    },
    delItem (i) {
      this.input.splice(i, 1)
    },
    remoteMethod (name, index) {
      if (!name) {
        this.manulist = []
      } else {
        this.loading = true
        api.searchDiagnose({
          type: this.input[index].diseaseType || 2,
          origId: this.$store.state.currentUser.organizationId,
          name: name
        }).then(res => {
          this.loading = false
          this.manulist = res.data.resultList
          this.input[index].diseaseOrigId = this.getDiseaseOrigId({ value: name })
        })
      }
    },
    querySearchAsync (name, callback, index) {
      if (this.diseaseNameOld && name !== this.diseaseNameOld) {
        this.input[index].diseaseCode = ''
        this.input[index].diseaseNameEn = ''
        this.input[index].diseaseCodeCategory = ''
        this.input[index].positionData = []
      }
      this.input[index].diseaseName = name
      api.searchDiagnose({
        type: this.input[index].diseaseType || 2,
        origId: this.$store.state.currentUser.organizationId,
        name: name
      }).then(rs => {
        this.loading = false
        let list = rs.data.resultList
        if (list && list.length) {
          list.forEach(item => {
            item.value = item.diseaseName
            if (item.diseaseNameEn) {
              item.value = item.diseaseNameEn + ' ' + item.diseaseName
            }
          })
          this.diagnoseList = list
        }
        if (name) this.input[index].diseaseOrigId = this.getDiseaseOrigId({ value: name })
        callback(list)
      })
    },
    validate (callback) {
      let allValid = true
      this.$refs['resultsForm'].forEach(item => {
        item.validate((valid) => {
          if (!valid) {
            allValid = false
          }
        })
      })
      callback(allValid)
    },
    bus_on_diagnostic_aid () {
      this.$bus.$on('diagnostic_aid', (data) => {
        let quoteData = []
        if (data && data.length) {
          data.forEach((item, index) => {
            quoteData[index] = quoteData[index] || {}
            quoteData[index].position = item.position || ''
            quoteData[index].value = item.diseaseName
            if (item.diseaseNameEn) quoteData[index].value = `${item.diseaseNameEn} ${item.diseaseNameEn}`
            quoteData[index].diseaseName = item.diseaseName
            quoteData[index].diseaseNameEn = item.diseaseNameEn
            quoteData[index].diseaseCode = item.diseaseCode
            quoteData[index].diseaseCodeCategory = item.diseaseCodeCategory
            quoteData[index].diseaseType = item.diseaseType
            quoteData[index].diseaseOrigId = item.id || this.getDiseaseOrigId(item)
            quoteData[index].groupList = item.groupList || []
          })
        }
        let index = this.input.length
        if (this.input[index - 1].diseaseName === '') { // 去除补位空诊断
          this.input.pop()
          index--
        }
        let tips = false
        for (let i = 0; i < quoteData.length; i++) {
          if (this.input.length >= 22) {
            tips = true
            break
          }
          let double = false
          if (!this.input || !this.input.length) {
            this.input.forEach(val => {  // 去重
              if (val.diseaseOrigId === data[i].id) {
                double = true
              }
            })
          }
          if (!double) {
            let emptyObj = {
              status: quoteData[i].status,
              diseaseType: quoteData[i].diseaseType,
              diseaseName: quoteData[i].diseaseName,
              diseaseNameEn: quoteData[i].diseaseNameEn,
              diseaseOrigId: quoteData[i].id,
              diagnoseType: 1,
              diseaseCode: quoteData[i].diseaseCode,
              diseaseCodeCategory: quoteData[i].diseaseCodeCategory,
              comment: quoteData[i].comment,
              position: '',
              groupList: quoteData[i].groupList,
              diagnoseList: [],
              positionData: [],
              value: quoteData[i].diseaseName
            }
            if (quoteData[i].diseaseNameEn) {
              emptyObj.value = `${quoteData[i].diseaseNameEn} ${quoteData[i].diseaseName}`
            }
            this.handleSelect(emptyObj, index, true)
            index++
          }
        }
        if (tips) {
          this.$notify({
            title: '警告',
            message: '最多支持22个诊断',
            type: 'warning'
          })
        }
      })
    },
    async handleSelect (val, index, from) {
      let params = {}
      params.visitNumber = this.$route.query.visitSn
      params.scene = 1
      params.apply = { sn: '100-01', facts: [] }
      params.apply.facts.push({
        diseaseStatus: val.status,
        diseaseName: val.diseaseName,
        diseaseNameEn: val.diseaseNameEn,
        diseaseCode: val.diseaseCode,
        diseaseCodeCategory: val.diseaseCodeCategory
      })
      this.currentDisease[index] = val
      if (from) {
        this.$set(this.input, index, val)
      } else {
        this.input[index].diseaseName = val.diseaseName
        this.input[index].diseaseNameEn = val.diseaseNameEn
        this.input[index].diseaseCode = val.diseaseCode
        this.input[index].diseaseType = val.diseaseType
        this.input[index].diseaseCodeCategory = val.diseaseCodeCategory
        this.input[index].diseaseOrigId = val.id || this.getDiseaseOrigId(val)
        this.input[index].groupList = val.groupList || []
      }
      let data = await this.getPosition(this.input[index].diseaseOrigId)
      if (data && data.length > 0) {
        // this.input[index].positionData = data
        this.$set(this.input[index], 'positionData', data)
      } else {
        // this.input[index].positionData = []
        this.$set(this.input[index], 'positionData', [])
      }
      this.$emit('zhenduanpop', this.input[index])
    },
    getDiseaseOrigId (val) {
      let ids = this.manulist.filter(item => {
        return item.value === val.value
      })
      return ids.length > 0 ? ids[0].id : null
    },
    async getPosition (id) {
      if (!id) return []
      const rs = await api.getDiseaseById({ id })
      let positionList = rs && rs.data && rs.data.positionList && rs.data.positionList.length ? rs.data.positionList : []
      if (positionList.length) {
        positionList.map(item => {
          item.id = item.positionId
          return item
        })
      }
      return positionList
    },
    async setPositionData () {
      if (!this.input || !this.input.length || !Array.isArray(this.input)) return
      this.input.forEach(async item => {
        if (item.diseaseOrigId) {
          let data = await this.getPosition(item.diseaseOrigId)
          this.$set(item, 'positionData', data)
        }
      })
    },
    changeDiseaseType (val, index) {
      if (val === 1) { return false }
      return this.currentDisease[index] && this.handleSelect(this.currentDisease[index], index)
    },
    getStringVal () {
      if (!this.input || !this.input.length) {
        return null
      }
      return this.input.map(v => {
        return v.diseaseName
      }).join(',')
    },
    diagnoseSelect (val, i) {
      this.diseaseNameOld = val.value ? val.value : `${val.diseaseNameEn} ${val.diseaseName}`
      this.handleSelect(val, i)
    }
  },
  watch: {
    'value' (val) {
      if (typeof val === 'string') {
        let emptyObj = JSON.parse(JSON.stringify(this.emptyObj))
        emptyObj.diseaseName = val
        val = [emptyObj]
      }
      if (!val || !val.length) {
        this.addItem()
      } else {
        this.input = val
        this.setPositionData()
      }
      if (val && val.length && val[0].disabled) {
        this.inputDisabled = val[0].disabled
        this.$nextTick(_ => {
          if (this.$refs.form.length) {
            this.$refs.form[0].clearValidate()
          }
        })
      }
    },
    check () {
      this.rowSpan = this.check ? [3, 12, 4, 3, 3] : [3, 12, 7, 3]
      if (this.showType === 'complex') {
        this.rowSpan[1] = 7
      }
    },
    input: {
      handler (val) {
        if (val && val.length) {
          val.map((item, index) => {
            if (!item.diseaseName) { // 如果诊断值为空，清空相关数据，但是会出现诊断值删掉部分的情况该怎么处理
              item.diseaseCode = ''
              item.diseaseCodeCategory = ''
              item.diseaseAlias = ''
              item.diseaseNameEn = ''
            } else {
              for (let sitem in item) {
                if (!this.subKeys.includes(sitem)) {
                  delete item[sitem]
                }
              }
            }
            return item
          })
        }
        this.$emit('input', val)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.col_333 {
  color: #333;
}
.disease_warp {
  span {
    display: inline-block;
    padding: 0 5px;
  }
}
.el-autocomplete-suggestion {
  li {
    &:hover {
      .col_333 {
        color: #fff;
      }
    }
  }
}
.ever_diagnosis_wrap {
  overflow: hidden;
  .el-form {
    margin-bottom: 10px;
    /deep/ .el-form-item {
      margin-bottom: 0;
    }
    /deep/ .input_suffix_01 {
      height: 30px;
      line-height: 30px;
      padding: 0 5px;
      background: #fff;
    }
    /deep/ .el-input-group__append{
      overflow: hidden;
      .el-select{
        margin: -5px -10px;
      }
    }
    .tips_txt {
      line-height: 20px;
      font-size: 12px;
      color: #999;
      padding: 0 10px;
    }
    // .el-col{
    //   margin-right: 5px;
    //   &:nth-last-child(2) {
    //     margin-right: 10px !important;
    //    }
    // }
    &:last-child {
      margin-bottom: 0;
    }
  }
  /deep/ .input_suffix_01 {
    margin-top: 1px;
    height: 30px;
    line-height: 30px;
    padding: 5px 0 5px 5px;
    background: #fff;
  }
  .tips_txt {
    line-height: 20px;
    font-size: 12px;
    color: #999;
    padding: 0 10px;
  }
  .el-col {
    margin-right: 5px;
    &:nth-last-child(2) {
      margin-right: 10px !important;
    }
  }
  &:last-child {
    margin-bottom: 0;
  }
}
.handle_btn {
  line-height: 32px;
  white-space: nowrap;
  .iconfont {
    font-size: 14px;
    padding: 5px;
    color: #333;
    &.icon-delete {
      color: #aaa;
    }
    &.icon-tianjia {
      color: #1c7bef;
    }
  }
}

.el-autocomplete {
  width: 100%;
  /deep/ .el-input-group__append {
    /deep/ .el-input__inner {
      color: #666;
      border-color: transparent !important;
    }
  }
}
</style>
