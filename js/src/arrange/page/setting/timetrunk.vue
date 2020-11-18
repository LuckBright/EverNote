<template>
  <div>
    <el-tag :type="isMonth ? status[timetrunk.status].type : 'primary'" :closable="!closable" slot="reference" class="btn ellipsis" @close="delTimeTrunk(timetrunk)">{{timetrunk.timeTrunkName}}</el-tag>
  </div>
</template>
<script>
  import arrangeapi from '@/arrange/store/schedulingapi'
  import api from '@/arrange/store/settingapi'
  export default {
    props: ['timetrunk', 'templetId', 'resource', 'dept', 'isMonth', 'closable'],
    data () {
      return {
        api,
        arrangeapi,
        isSubmit: false,
        visible: false,
        list: [],
        status: {
          '-1': {type: 'danger', text: '删除'},
          '1': {type: 'success', text: '新建'},
          '10': {type: 'primary', text: '已发布'}
        }
      }
    },
    methods: {
      delTimeTrunk (val) {
        if (this.isSubmit) {
          return false
        }
        this.isSubmit = true
        if (this.isMonth) {
          let requeset = val.status === -1 ? this.api.returnArrangeBasesetResource : this.arrangeapi.del
          requeset(val.resourceArrangeId).then(rs => {
            if (rs.head.errCode) {
              return false
            }
            setTimeout(() => {
              this.isSubmit = false
            }, 100)
            this.$emit('del', true)
          })
        } else {
          this.api.delDeptWeekArrange({id: val.id}).then(rs => {
            if (rs.head.errCode) {
              return false
            }
            setTimeout(() => {
              this.isSubmit = false
            }, 100)
            this.$emit('del', true)
          })
        }
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
