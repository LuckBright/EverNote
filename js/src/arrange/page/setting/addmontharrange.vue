<template>
  <el-popover
    v-model="visible"
    placement="right"
    title=""
    width="200"
    @show="visible=true"
    trigger="click">
    <ul class="arrange">
      <li v-for="(item, i) in list" :key="i" @click="setArrange(item)">{{item.name}}</li>
    </ul>
    <i class="el-icon-circle-plus" slot="reference"></i>
  </el-popover>  
</template>
<script>
  import workapi from '@/arrange/store/workapi'
  import api from '@/arrange/store/settingapi'
  export default {
    props: ['organ', 'template', 'dept', 'resource', 'date', 'filters'],
    data () {
      return {
        workapi,
        api,
        visible: false,
        filterData: [],
        list: []
      }
    },
    watch: {
      visible (val) {
        if (val) {
          this.setFilterArr()
          this.getArrangeList()
        }
      }
    },
    methods: {
      setArrange (val) {
        this.api.addMonthArrange({
          date: this.date,
          templetId: this.template.id,
          resource: this.resource,
          dept: this.dept,
          organDto: this.organ,
          timeTrunk: {timeTrunkId: val.id, timeTrunkName: val.name}
        }).then(rs => {
          if (rs.head.errCode) {
            return false
          }
          this.visible = false
          this.$emit('success', true)
        })
      },
      setFilterArr () {
        if (this.filters) {
          this.filterData = this.filters.map(item => {
            return item.timeTrunkId
          })
        }
      },
      getArrangeList () {
        this.workapi.list({
          timeTrunkType: this.template.timeTrunkType,
          organId: this.organ.organId,
          templateId: this.template.id,
          deptIds: [this.dept.deptId],
          resourceId: this.resource.resourceId
        }).then(rs => {
          if (rs.head.errCode) {
            this.arrangeList = []
            return false
          }
          this.list = rs.data.resultList.filter(item => {
            return !this.filterData.includes(item.id)
          })
        })
      }
    }
  }
</script>
<style scoped>
  .el-icon-circle-plus{font-size: 20px; color: #1c7bef; position: absolute; top: 50%; margin-top: -10px; left: 50%; margin-left: -10px;}
  .arrange{padding: 0; margin: 0; list-style: none; height: 400px; overflow: auto;}
  .arrange li {height: 40px; line-height: 40px; border-bottom: 1px solid #ddd; cursor: pointer; padding: 0 10px;}
  .arrange li:hover{background: #efefef;}
  .arrange li:last-child {border-bottom: none;}
</style>
