<template>
  <div class="ever_allergichis_wrap" style="overflow:hidden;padding-right:10px">
    <el-row>
      <el-col :span="24">
        <el-radio-group v-model="obj.isAllergicHis">
          <el-radio :label="true">有</el-radio>
          <el-radio :label="false">否认</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <template v-if="obj.isAllergicHis">
    <el-form class="el-form--child-comp"  v-for="(item, i) in obj.guomin" :key="i" :rules="rules" :model="item" ref="form">
      <el-row :gutter="10">
        <el-col :span="11">
          <el-form-item prop="allergen">
            <!-- THC_SYS_ALLERGICORIGIN非药物过敏 -->
            <!-- THC_SYS_DRUG_ALLERGEN 药物过敏史 -->
            <sys-type
              :code="code || 'THC_SYS_DRUG_ALLERGEN'"
              placeholder="请选择过敏源"
              filterable="true"
              :clearable="false"
              :firstDefault="(item.allergen&&item.allergen.id)?false:true"
              :disabled="!obj.isAllergicHis"
              :use-object="true"
              :obj-simple="true"
              v-model="item.allergen">
            </sys-type>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="remark">
            <el-input placeholder="请填写备注" :disabled="!obj.isAllergicHis" v-model="item.remark" :maxlength="50"></el-input>
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
  export default {
    props: ['value', 'code'],
    data () {
      return {
        val: '',
        obj: {
          isAllergicHis: false,
          guomin: [{allergen: '', remark: ''}]
        },
        rules: {
          allergen: [
            {required: true, message: '必填项', trigger: 'change,blur'}
          ]
        }
      }
    },
    created () {
     // this.initValue()
      if (this.code) {
        this.val = this.code
      } else {
        this.val = 'THC_SYS_DRUG_ALLERGEN'
      }
    },
    methods: {
      initValue () {
        if (this.value && !this.value.isAllergicHis) {
          this.obj = {
            isAllergicHis: false,
            guomin: [{allergen: '', remark: ''}]
          }
        }
      },
      addAllergyItem () {
        let isValid = true
        this.$refs.form.forEach(item => {
          item.validate(valid => {
            if (!valid) {
              isValid = false
            }
          })
        })
        if (isValid) this.obj.guomin.push({allergen: '', remark: ''})
      },
      delAllergyItem (i) {
        this.obj.guomin.splice(i, 1)
      },
      getStringVal () {
        if (this.obj.isAllergicHis) {
          return this.obj.guomin.map(v => {
            return v.allergen.name
          }).join(',')
        }
      }
    },
    watch: {
      'value': {
        handler () {
          if (this.value && this.value.guomin) {
            this.obj = this.value
          } else {
            this.obj = {
              isAllergicHis: false,
              guomin: [{allergen: '', remark: ''}]
            }
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
      margin-bottom: 15px;
      /deep/ .el-form-item{
        margin-bottom: 0;
      }
    }
    .handle_btn{
      line-height: 36px;
      white-space: nowrap;
      .iconfont{
        font-size: 14px;
        padding: 5px;
        color: #333;
        &.icon-delete{
          color: #aaa;
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
