<template>
  <el-form :model="obj" ref="form" :size="size || 'small'" class="pulse_input"> 
    <el-row>
      <el-col :span="16">
        <el-form-item prop="pulse"><el-input v-model.number="obj.pulse" :placeholder="placeholder" type="number" :disabled="disabled" title=""></el-input></el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item prop="checked">
          <el-checkbox v-model="obj.checked" :disabled="disabled" class="checkbox">使用起搏器</el-checkbox>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

</template>
<script>
  export default {
    props: ['value', 'size', 'disabled', 'placeholder'],
    data () {
      return {
        obj: {
          pulse: null,
          checked: false
        }
      }
    },
    created () {
    },
    watch: {
      'obj.pulse' (val) {
        this.$emit('input', this.obj)
      },
      'obj.checked' (val) {
        this.$emit('input', this.obj)
      },
      value: {
        handler (val) {
          if (val) {
            Object.assign(this.obj, val)
          } else {
            this.obj = {pulse: null, checked: false}
          }
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
    }
  }
</script>
<style  lang="scss" scoped>
  .pulse_input{
    .el-form-item{
      margin-bottom:0 !important;
    }
    /deep/.el-form-item__content{
      height:33px;
    }
    .checkbox{
      margin-left:20px;
    }
  }
  
</style>
