<template>
  <el-form :model="obj" ref="form" :size="size || 'small'" class="breath_input">
    <el-row>
      <el-col :span="16">
        <el-form-item prop="breathVal"><el-input v-model.number="obj.breathVal" :placeholder="placeholder" type="number" :disabled="disabled||obj.checked" title=""></el-input></el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item prop="checked">
          <el-checkbox v-model="obj.checked" :disabled="disabled" class="checkbox">使用呼吸机</el-checkbox>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

</template>
<script>
  export default {
    props: ['value', 'type', 'size', 'disabled', 'placeholder'],
    data () {
      return {
        obj: {
          checked: false,
          breathVal: null
        },
        dis: this.disabled || false
      }
    },
    created () {
    },
    watch: {
      value (val) {
        if (val === null) {
          this.obj.checked = false
          this.obj.breathVal = null
        }
        if (val === 'R') {
          this.obj.checked = true
          this.obj.breathVal = null
        } else {
          this.obj.checked = false
          this.obj.breathVal = val
        }
      },
      'obj.breathVal' (val) {
        this.$emit('input', val)
        // if (val || val === 0) {
        //   this.$emit('input', val)
        // }
      },
      'obj.checked' (val) {
        if (val) {
          this.$emit('input', 'R')
        } else {
          this.$emit('input', null)
        }
        // this.obj.breathVal = null
      }
    },
    methods: {
    }
  }
</script>
<style  lang="scss" scoped>
  .breath_input{
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
