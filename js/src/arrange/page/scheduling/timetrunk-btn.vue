<template>
  <el-button type="primary" :disabled="isDisabled" plain size="medium" class="trunkBtn ellipsis" @click="selectTimeTrunk($event)">{{timetrunk.timeTrunkName}}</el-button>
</template>
<script>
  import api from '@/arrange/store/schedulingapi'

  export default {
    props: ['timetrunk', 'templetId', 'resource', 'dept', 'date', 'operate', 'trunkType', 'appointType'],
    data () {
      return {
        api
      }
    },
    created () {
      console.log(this.appointType)
    },
    methods: {
      selectTimeTrunk () {
        let params = {
          timeTrunkType: !this.templetId ? 1 : this.trunkType,
          templetId: this.templetId,
          resourceId: this.resource.resourceId,
          resourceName: this.resource.resourceName,
          resourceType: 'STAFF_DOCTOR',
          deptId: this.dept.deptId,
          deptName: this.dept.deptName,
          organId: this.timetrunk.organId,
          timeTrunkId: this.timetrunk.timeTrunkId,
          date: this.date
        }
        this.api.getResourceArrange(params).then(rs => {
          params.deptIds = [params.deptId]
          params.timetrunk = this.timetrunk
          params.serviceid = rs.data[0].resourceArrangeServiceList[0].serviceId
          params.serviceId = rs.data[0].resourceArrangeServiceList[0].serviceId
          params.serviceName = rs.data[0].resourceArrangeServiceList[0].serviceName
          this.$emit('select', params)
        })
      }
    },
    computed: {
      isDisabled () {
        return this.date !== this.$moment().format('YYYY-MM-DD') && this.appointType !== 2
      }
    }
  }
</script>
<style scoped>
  .line {border-bottom: 1px solid #ddd;}
  .trunkBtn{margin-bottom: 5px;max-width: 150px; margin-right: 5px; margin-left: 0;}
  .iconfont{color: #1C7BEF; cursor: pointer;}
  .el-button + .el-button {margin-right: 10px; margin-left: 0;}
</style>
