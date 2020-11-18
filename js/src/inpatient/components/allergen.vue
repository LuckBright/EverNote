<template>
  <div class="ever_allergichis_wrap" style="overflow:hidden;padding-right:10px">
    <el-row>
      <el-col :span="24">
        <el-radio-group v-model="isAllergicHis">
          <el-radio :label="true">有</el-radio>
          <el-radio :label="false">否认</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-form v-if="isAllergicHis" v-for="(item, i) in value" :key="i" :rules="rules" :model="item" style="margin-bottom:22px" ref="form">
      <el-row :gutter="10">
        <el-col :span="11">
          <el-form-item prop="allergen">
            <sys-type
              code="CV05.01.038"
              placeholder="请选择过敏源"
              filterable="true"
              :disabled="!isAllergicHis"
              v-model="item.allergen">
            </sys-type>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item prop="remark">
            <el-input placeholder="请填写备注" :disabled="!isAllergicHis" v-model="item.remark" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2" class="handle_btn">
          <i class="iconfont icon-delete" @click="delAllergyItem(i)" v-if="value.length > 1"></i>
          <i class="iconfont icon-tianjia" style="margin-left: 10px;" @click="addAllergyItem(i)" v-if="(value.length - 1) === i && isAllergicHis"></i>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  export default {
    props: ['value', 'hasAllergicHis'],
    data () {
      return {
        isAllergicHis: this.hasAllergicHis,
        disabled: true,
        rules: {
          allergen: [
            {required: true, message: '必填项', trigger: ['blur', 'change']}
          ]
        }
      }
    },
    created () {
      if (this.value && !this.value.length) {
        this.addAllergyItem()
      }
    },
    methods: {
      addAllergyItem () {
        let isValid = true
        this.$refs.form.forEach(item => {
          item.validate(valid => {
            if (!valid) {
              isValid = false
            }
          })
        })
        if (isValid) this.value.push({allergen: '', remark: ''})
      },
      delAllergyItem (i) {
        this.value.splice(i, 1)
      }
    },
    watch: {
      'hasAllergicHis' (val) {
        this.isAllergicHis = val
      },
      'isAllergicHis' (val) {
        this.$emit('update:hasAllergicHis', val)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .ever_allergichis_wrap{
    .handle_btn{
      white-space: nowrap;
      .iconfont{
        padding: 5px;
        color: #aaa;
      }
    }
    .el-col{
      &:nth-last-child(2) {
         padding-right: 5px !important;
       }
      }
    }
</style>
