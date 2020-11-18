<template>
  <div>
    {{orgList}}
    <ever-org-select ref="eos" v-model="orgList" type="tree" multiple></ever-org-select>
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
      // 保证回显的数据格式必须为：
      this.orgList = ['5000', '5000001']
    },
    mounted () {
    },
    methods: {
    },
  }
</script>
