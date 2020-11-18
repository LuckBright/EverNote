<template>
  <div id="codiagnosis">
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="(item,i) in tabObj" :label="item.name" :name="item.id" :key="i"></el-tab-pane>
      <diagnosisgroup :deptId="activeName"></diagnosisgroup>
    </el-tabs>
  </div>
</template>
<script>
import api from '@/sob/store/commondiagnosisapi'
import diagnosisgroup from '@/sob/components/diagnosisgroup'
export default {
  data () {
    return {
      api,
      activeName: '',
      tabObj: [
      ]
    }
  },
  created () {
    this.getProvList()
  },
  methods: {
    handleClick (tab, event) {
    },
    getProvList () {
      this.api.getProvList().then(rs => {
        if (rs && rs.data && rs.data[0]) {
          this.tabObj = rs.data.map(v => {
            let obj = {
              id: v.id,
              name: v.name,
              type: 'deptName'
            }
            return obj
          })
        }
        this.tabObj.push(
          {
            id: 'person',
            name: '个人',
            type: 'person'
          }
        )
        this.activeName = rs && rs.data[0] && rs.data[0].id ? rs.data[0].id : 'person'
      })
    }
  },
  components: {
    diagnosisgroup
  }
}
</script>
<style scoped>
#codiagnosis {
  background: #fff;
}
#codiagnosis /deep/ .el-tabs__header.is-top {
  margin: 0 !important;
  border-bottom: 1px solid #cccccc;
  box-shadow: 0 -2px 5px #dddddd;
}
#codiagnosis /deep/ .el-tabs__nav-wrap::after {
  height: 1px !important;
}
#codiagnosis /deep/ .el-tabs__nav.is-top {
  margin-left: 30px;
}
#codiagnosis /deep/ .el-tabs__content {
  background-color: #ffffff;
  border-radius: 4px;
}
#codiagnosis /deep/ .el-tabs__header {
  margin: 0 0 150px !important;
}
#codiagnosis /deep/ .el-tabs__header {
  margin: 0px;
}
</style>

