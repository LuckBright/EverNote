<template>
    <div class="groupClassify">
      <el-radio v-model="businessType" label="0">集团</el-radio>
      <el-radio v-model="businessType" label="1">机构</el-radio>
      <el-radio v-model="businessType" label="3">科室</el-radio>
      <el-radio v-model="businessType" label="2">个人</el-radio>
    </div>
</template>
<script>
  export default {
    props: ['val'],
    data () {
      return {
        businessType: ''
      }
    },
    created () {
      this.businessType = this.val
    },
    watch: {
      'businessType' (val) {
        this.$emit('input', val)
        // this.$emit('update:businessType', val)
      }
    },
    computed: {
      // 'businessType': {
      //   set (val) {
      //     this.$emit('input', val)
      //   },
      //   get () {
      //     return this.val
      //   }
      // }
    }
  }
</script>
