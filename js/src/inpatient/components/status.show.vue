<template>
  <div class="ever_status_wrap">
    <el-row>
      <el-col :span="24">
        <el-radio-group v-model="value.isTrue">
          <el-radio :label="false">否认</el-radio>
          <el-radio :label="true">有</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-form
      v-if="value.isTrue"
      v-for="(item, i) in value.value"
      :key="i"
      :rules="rules"
      :model="item"
      style="margin-bottom:22px"
      ref="form"
      labelWidth="50px"
    >
      <el-row :gutter="10">
        <el-col :span="22">
          <el-form-item prop="txt" label="目的">
            <el-input placeholder="请输入目的" v-model="item.txt"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ['value', 'required'],
  data () {
    return {
      disabled: true,
      rules: {
        txt: [
          { required: true, message: '必填项', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    if (!this.value) {
      this.value = { isTrue: false, value: [{ txt: '', remark: '' }] }
    }
    if (this.value && this.value.value && !this.value.value.length) {
      this.addStatusItem()
    }
  },
  methods: {
    validate () {
      let isValid = true
      if (this.value.isTrue) {
        if (!this.value || !this.value.value || !this.value.value.length || !this.value.value[0].txt) {
          this.value.value = [{ txt: '', remark: '' }]
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
    addStatusItem () {
      let isValid = true
      this.$refs.form.forEach(item => {
        item.validate(valid => {
          if (!valid) {
            isValid = false
          }
        })
      })
      if (isValid) this.value.value.push({ txt: '', remark: '' })
    },
    delStatusItem (i) {
      this.value.value.splice(i, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.ever_status_wrap {
  padding-top: 10px;
  padding-right: 10px;
  .handle_btn {
    white-space: nowrap;
    .iconfont {
      padding: 5px;
      color: #aaa;
    }
  }
  .el-col {
    &:nth-last-child(2) {
      padding-right: 5px !important;
    }
  }
}
</style>
