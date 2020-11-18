<template>
  <el-form :model="obj" class="demo-form-inline" :disabled="disabled">
    <el-row>
      <el-col :span="4">
        <el-form-item>
          <el-input v-model="obj.ds1" style="width: 100"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6" style="text-align:center">
        <el-form-item>
         DS/
        </el-form-item>
      </el-col>

      <el-col :span="4">
        <el-form-item>
          <el-input v-model="obj.ds2"  style="width: 100"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6" style="text-align:center">
        <el-form-item>
         DCX
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item>
          <el-input v-model="obj.dcx"  style="width: 100"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
  export default {
    props: ['value', 'disabled'],
    data () {
      return {
        obj: {
          ds1: null,
          ds2: null,
          dcx: null
        }
      }
    },
    watch: {
      'obj': {
        handler () {
          this.$emit('input', this.obj)
        },
        deep: true
      },
      'value': {
        handler (val) {
          if (val) {
            this.obj = this.value
          }
        }
      }
    }
  }
</script>
<style type="text/css" scoped>
  /*.el-input {
    width: 80px;
  }*/
</style>
