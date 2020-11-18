<template>
  <div class="ever_allergichis_wrap" style="overflow:hidden;padding-right:10px">
    <el-form v-for="(item, i) in value" :key="i" style="margin-bottom:22px" :rules="rules" :model="item" ref="form">
      <el-row :gutter="10">
        <el-col :span="14">
          <el-form-item prop="mode">
            <sys-type
              code="CV06.00.103"
              placeholder="请选择麻醉方式"
              filterable="true"
              v-model="item.mode">
            </sys-type>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="comment">
            <el-input placeholder="请填写备注" v-model="item.comment" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2" class="handle_btn">
          <i class="iconfont icon-delete" @click="delAllergyItem(i)" v-if="i > 0"></i>
          <i class="iconfont icon-tianjia" @click="addAllergyItem(i)" v-if="(i + 1) === (value.length)"></i>
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
        disabled: true,
        rules: {
          mode: [
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
        if (isValid) this.value.push({mode: '', comment: ''})
      },
      delAllergyItem (i) {
        this.value.splice(i, 1)
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
        &:nth-child(1){
          margin-left: 10px;
         }
      }
    }
  }
</style>
