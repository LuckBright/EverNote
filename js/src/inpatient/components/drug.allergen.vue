<template>
  <div class="ever_allergichis_wrap" style="overflow:hidden;padding-right:10px">
    <el-row>
      <el-col :span="24">
        <el-radio-group v-model="value.isTrue">
          <el-radio :label="false">否认</el-radio>
          <el-radio :label="true">有</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-form v-if="value.isTrue" v-for="(item, i) in value.value" :key="i" :rules="rules" :model="item" style="margin-bottom:22px" ref="form">
      <el-row :gutter="10">
        <el-col :span="22">
          <el-form-item prop="allergen">
            <service-select v-model="item.allergen" :type="301" placeholder="请输入过敏药物" :scene="scene" :providerId="providerId"></service-select>
            <!-- <el-input placeholder="请输入过敏药物" v-model="item.allergen"></el-input> -->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  export default {
    props: ['value', 'required', 'providerId'],
    data () {
      return {
        scene: 3,
        disabled: true,
        rules: {
          allergen: [
            {required: true, message: '必填项', trigger: ['blur', 'change'], type: 'object'}
          ]
        }
      }
    },
    created () {
      if (!this.value) {
        this.value = {isTrue: false, value: [{allergen: '', remark: ''}]}
      }
      if (this.value && this.value.value && !this.value.value.length) {
        this.addAllergyItem()
      }
    },
    methods: {
      validate () {
        let isValid = true
        if (this.value.isTrue) {
          if (!this.value || !this.value.value || !this.value.value.length || !this.value.value[0].allergen || !this.value.value[0].allergen.id) {
            this.value.value = [{allergen: '', remark: ''}]
            isValid = false
          }
        }
        this.$refs.form.forEach(item => {
          item.validate(valid => {
            if (!valid) {
              isValid = false
            }
          })
        })
        return isValid
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
        if (isValid) this.value.value.push({allergen: '', remark: ''})
      },
      delAllergyItem (i) {
        this.value.value.splice(i, 1)
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
