<template>
  <el-radio-group v-model="sex">
    <el-radio :label="option.id" :key="option.id" v-for="option in options">
      {{option.name}}
    </el-radio>
  </el-radio-group>
</template>
<script>
  export default {
    props: ['value'],
    data () {
      return {
        options: [
          {
            id: '男',
            name: '男'
          },
          {
            id: '女',
            name: '女'
          }
        ],
        sex: this.value
      }
    },
    watch: {
      'sex': function () {
        this.$emit('input', this.sex)
      },
      'value': function () {
        this.sex = this.value
      }
    }
  }
</script>
