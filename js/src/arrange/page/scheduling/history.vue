<template>
  <div id="history">
    <table style="width:100%" cellpadding="0" cellspacing="0" class="wrap">
      <tr v-for="(item, index) in historyData" :key="index">
        <td width="20%" align="center">{{item.timeTrunkName}}</td>
        <td width="60%">
          <table style="width:100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <span v-for="(v, i) in item.resourceArrangeServiceList" :key="i">{{v.serviceName}}</span>
              </td>
            </tr>
            <tr>
              <td><span v-for="(val, j) in item.resourceArrangeResourceList" :key="j">{{val.resourceName}}</span></td>
            </tr>
            <div v-for="(temp, m) in item.timeRangeList" :key="m">
              <tr v-for="(child, n) in temp.resourceArrangeTimeRangeList" :key="n">
                <td v-if="child.arrangeType=='1'">{{child.startTime}}-{{child.endTime}} {{child.serviceTimeSlice}}分钟/
                  {{child.sliceVolume}}人</td>
                <td v-if="child.arrangeType=='2'">{{child.startTime}}-{{child.endTime}} {{child.totalVolume}}人</td>
              </tr>
            </div>
          </table>
        </td>
        <td width="20%" align="center"><el-button type="text" @click="apply(index)">使用</el-button></td>
      </tr>
    </table>
  </div>
</template>

<script>
  import api from '@/arrange/store/historyapi'
  export default {
    props: ['template', 'organ', 'value', 'add'],
    data () {
      return {
        api,
        historyData: []
      }
    },
    watch: {
      'value' () {
        let obj = {
          templetId: this.value.templetId, // 模版id
          organId: this.value.organId, // 使用机构id
          deptId: this.value.deptId, // 部门id
          resourceId: this.value.resourceId // 竹资源id
        }
        this.getLastTenArrangeList(obj)
      },
      'add' () {
        let obj = {
          templetId: this.template.id, // 模版id
          organId: this.organ.organId, // 使用机构id
          deptId: this.add.resource.deptId, // 部门id
          resourceId: this.add.resource.resourceId // 竹资源id
        }
        this.getLastTenArrangeList(obj)
      }
    },
    created () {
    },
    methods: {
      getLastTenArrangeList (obj) {
        this.api.getLastTenArrangeList(obj).then(rs => {
          if (rs && rs.data && rs.data[0]) {
            this.historyData = rs.data
          }
        })
      },
      apply (val) {
        let i = new Date().getTime()
        this.$emit('apply', {data: this.historyData[val], num: i})
      }
    }
  }
</script>
<style scoped>
  #history {max-height: 200px; overflow: auto;}
  #history table.wrap >  tr > td {padding: 10px; border-bottom: 1px solid #ddd; font-size: 14px;}
  #history table.wrap >  tr > td > table { line-height: 1.5; }
  #history table.wrap >  tr > td > span {margin-right:4px;}
</style>
