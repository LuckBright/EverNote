<!--
  药物过敏史：{"type": 1, "code": ["THC_SYS_DRUG_ALLERGEN_PRIMARY", "THC_SYS_DRUG_ALLERGEN_SECONDARY"] }
  非药物过敏史：{"type": 1}
  需要对组件进行检验{"ref": "selfvalidate"}
-->
<template>
  <div class="ever_allergichis_wrap" style="overflow:hidden;padding-right:10px">
    <el-row>
      <el-col :span="24">
        <el-radio-group v-model="obj.isAllergicHis">
          <el-radio :label="true">{{$t('有')}}</el-radio>
          <el-radio :label="false">{{$t('否认')}}</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <template v-if="obj.isAllergicHis">
    <el-form
      v-for="(item, i) in obj.guomin"
      class="el-form--child-comp"
      :key="i"
      :rules="rules"
      :model="item"
      :show-message="false"
      :size="size || 'small'"
      :disabled="disabled"
      ref="form">
      <el-row :gutter="10">
        <el-col :span="11">
          <el-form-item prop="allergen">
            <!-- THC_SYS_ALLERGICORIGIN非药物过敏 -->
            <!-- THC_SYS_DRUG_ALLERGEN 药物过敏史 -->
            <sys-cascader v-if="type === 1" v-model="item.allergen" :clearable="false" :filterable="true" :disabled="!obj.isAllergicHis" :options="allergenOpts" valueObjectKey="id" :firstDefault="true"></sys-cascader>
            <sys-type
              v-else
              :code="code || 'THC_SYS_DRUG_ALLERGEN'"
              placeholder="请选择过敏源"
              filterable="true"
              :clearable="false"
              :disabled="!obj.isAllergicHis"
              :firstDefault="(item.allergen && item.allergen.id) ? false : true"
              :use-object="true"
              :obj-simple="true"
              v-model="item.allergen">
            </sys-type>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="remark">
            <el-input :placeholder="$t('请填写备注')" :disabled="disabled || !obj.isAllergicHis" v-model="item.remark" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2" class="handle_btn">
          <i class="iconfont icon-delete" @click="delAllergyItem(i)" v-if="obj.guomin.length > 1"></i>
          <i class="iconfont icon-tianjia" style="margin-left: 5px;" @click="addAllergyItem(i)" v-if="(obj.guomin.length - 1) === i && obj.isAllergicHis"></i>
        </el-col>
      </el-row>
    </el-form>
    </template>
  </div>
</template>

<script>
  import sysvalue from '@/warehouse/store/sysvalueapi'
  import {OTHER_ALLEREGN_ID} from '@/util/common'
  export default {
    // type 1: 二级过敏史
    props: {
      value: {
        type: [String, Object],
      },
      code: {
        type: [String, Array]
      },
      type: {
        type: Number
      },
      max: {
        type: Number,
        default: 10
      },
      size: {
        type: String,
        default: 'small'
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data () {
      let checkEqual = (rule, value, callback) => {
        if (!value) {
          callback()
          return false
        }
        if (this.obj.guomin && this.obj.guomin.length) {
          let obj = this.obj.guomin.filter((val, index) => {
            if (this.type === 1) {
              if (val && val.allergen && val.allergen.length) {
                // 其他过敏源逻辑判断  jira：W19-2343，朱冉星
                if (val.allergen[0] && value[0] && val.allergen[0].id === value[0].id && val.allergen[0].id === OTHER_ALLEREGN_ID) {
                  let isRepeat = this.obj.guomin.filter((item, sindex) => {
                    return index !== sindex && val.allergen[0] && item.allergen[0] && val.allergen[0].id === item.allergen[0].id && val.allergen[0].id === OTHER_ALLEREGN_ID && (val.remark === item.remark || (!val.remark && !item.remark))
                  })
                  return isRepeat && isRepeat.length
                } else {
                  return ((val.allergen[0] && value[0] && val.allergen[0].id === value[0].id) && ((val.allergen[1] && value[1] && val.allergen[1].id === value[1].id) || (!val.allergen[1] && !value[1])))
                }
              }
            } else {
              return (val && val.allergen && val.allergen.id) === value.id
            }
          })
          if (obj.length > 1) {
            callback(new Error('该项已存在'))
            return false
          }
        }

        callback()
      }
      let emptyObj = {
        isAllergicHis: false,
        guomin: [{allergen: '', remark: ''}]
      }
      if (this.type === 1) {
        emptyObj.guomin = [{allergen: [], remark: ''}]
      }
      return {
        allergenOpts: [],
        emptyObj,
        obj: Object.assign({}, emptyObj),
        cascadeCode: this.code || ['CV05.01.038.FYW1', 'CV05.01.038.FYW2'],
        rules: {
          allergen: [
            {required: true, message: '必填项', trigger: 'change,blur'},
            {validator: checkEqual, trigger: 'change'}
          ]
        },
        maxNum: this.max || 10,
        props: {
          value: 'id'
        }
      }
    },
    created () {
      if (this.type === 1) {
        sysvalue.cascade(this.cascadeCode[0]).then(options => {
          if (options && options.length) {
            options.map(item => {
              item.label = item.name
              item.value = {
                id: item.code,
                name: item.name
              }
              if (item.children && item.children.length) {
                item.children.map(sitem => {
                  sitem.label = sitem.name
                  sitem.value = {
                    id: sitem.code,
                    name: sitem.name
                  }
                  return sitem
                })
              }
              return item
            })
          }
          this.allergenOpts = options
        })
      }
      // if (this.value && typeof this.value === 'object') {
      //   this.obj = this.value
      // }
    },
    methods: {
      initValue () {
        if (this.value && !this.value.isAllergicHis) {
          this.obj = Object.assign({}, JSON.parse(JSON.stringify(this.emptyObj)))
        }
      },
      addAllergyItem () {
        if (this.disabled) return
        let isValid = true
        let tips = false
        this.$refs.form.forEach(item => {
          item.validate(valid => {
            if (!valid) {
              isValid = false
            }
            if (this.obj.guomin && this.obj.guomin.length >= this.maxNum) {
              tips = true
              isValid = false
            }
          })
        })
        if (tips) {
          this.$notify({
            title: '警告',
            message: `最多支持添加${this.maxNum}个项目`,
            type: 'warning'
          })
        }
        if (isValid) this.obj.guomin.push(Object.assign({}, JSON.parse(JSON.stringify(this.emptyObj.guomin[0]))))
      },
      delAllergyItem (i) {
        if (this.disabled) return
        this.obj.guomin.splice(i, 1)
      },
      getStringVal () {
        if (this.obj.isAllergicHis) {
          return this.obj.guomin.map(v => {
            if (Array.isArray(v.allergen)) {
              let str = ''
              if (v.allergen && v.allergen.length) {
                v.allergen.map((sitem, sindex) => {
                  str += sitem.name
                  if (sitem.id === OTHER_ALLEREGN_ID && v.remark) str += `-${v.remark}`
                  str += (sindex === 0 && v.allergen.length > 1) ? '/' : ''
                })
              }
              return str
            } else {
              return v.allergen.name
            }
          }).join(',')
        }
      }
    },
    watch: {
      'value': {
        handler (val) {
          if (this.value && this.value.guomin && this.value.guomin.length) {
            this.obj = this.value
          } else {
            this.obj = Object.assign({}, JSON.parse(JSON.stringify(this.emptyObj)))
          }
        },
        immediate: true,
        deep: true
      },
      'obj': {
        handler (val) {
          this.$emit('input', val)
        },
        deep: true
      },
      'obj.isAllergicHis' (val) {
        if (!val) {
          this.initValue()
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .ever_allergichis_wrap{
    .el-form{
      margin-bottom: 5px;
      /deep/ .el-form-item{
        margin-bottom: 0;
      }
    }
    .handle_btn{
      line-height: 32px;
      white-space: nowrap;
      .iconfont{
        font-size: 14px;
        padding: 5px;
        color: #333;
        &.icon-delete{
          color: #aaa;
        }
        &.icon-tianjia{
          color: #1c7bef;
        }
      }
    }
    .el-col{
      &:nth-last-child(2) {
        padding-right: 5px !important;
      }
    }
  }
</style>
