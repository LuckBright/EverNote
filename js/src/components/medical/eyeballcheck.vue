<template>
  <div>
    <el-form ref="form" :model="obj">
    <el-row>
      <el-col :span="10">
        <el-form-item>
          <el-input v-model="obj.lefttop"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item>
          <el-input v-model="obj.righttop"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="10">
        <el-form-item>
          <el-input v-model="obj.left"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-input v-model="obj.rightt"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="10">
        <el-form-item><el-input v-model="obj.leftbottom"></el-input></el-form-item>

      </el-col>
      <el-col :span="10">
        <el-form-item>
          <el-input v-model="obj.rightbottom"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  </div>
</template>
<script>
  export default {
    props: ['value'],
    data () {
      return {
        obj: {
          lefttop: null,
          righttop: null,
          left: null,
          right: null,
          leftbottom: null,
          rightbottom: null
        }
      }
    },
    methods: {
      init () {
      }
    },
    watch: {
      'obj': {
        handler () {
          console.log('obj change', this.obj)
          this.$emit('input', this.obj)
        },
        deep: true
      },
      'value': {
        handler () {
          Object.assign(this.obj, this.value)
        }
      }
    },
    mounted () {
      this.init()
    }
  }
</script>
<style scoped>
  .el-form .el-row {
    margin-bottom: 10px;
  }
  .el-form .el-row:last-child {
    margin-bottom: 0
  }
  .el-row .el-col:first-child {
    margin-right: 20px;
  }
</style>
