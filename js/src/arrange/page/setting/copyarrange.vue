<template>
  <el-popover
    v-model="visible"
    placement="bottom"
    title=""
    width="500"
    @show="visible=true"
    trigger="click">
    <el-button type="primary" slot="reference">复制排班</el-button>
  </el-popover>
</template>
<script>
  import api from '@/arrange/store/settingapi'
  export default {
    props: ['timetrunk', 'templetId', 'resource', 'dept', 'isMonth'],
    data () {
      return {
        api,
        visible: false,
        form: {
          startDate: '',
          endDate: ''
        }
      }
    },
    methods: {
      copyArragen (val) {
        console.log(val)
      }
    }
  }
</script>
<style scoped>
  .line {border-bottom: 1px solid #ddd;}
  .btn{max-width: 115px; line-height: 32px; margin-right: 5px; position: relative; padding-right: 32px;}
  .el-tag /deep/ .el-icon-close{position: absolute; top: 50%; margin-top: -8px; right: 5px;}
  .iconfont{color: #1C7BEF; cursor: pointer;}
</style>
