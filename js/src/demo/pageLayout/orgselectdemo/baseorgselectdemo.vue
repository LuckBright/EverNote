<template>
  <div>
    {{orgList}}
    <ever-org-select ref="eos" v-model="orgList" fields="id"></ever-org-select>
    <el-button @click="clearOrg">清空</el-button>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        orgList: [],
      }
    },
    created () {
    },
    mounted () {
    },
    methods: {
      clearOrg () {
        this.orgList = []
      }
    },
  }
</script>
