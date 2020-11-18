/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-05-08 11:54:29
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-05-11 14:14:07
 * 省内异地就医发生费用参保地机构信息
 */
<template>
  <el-container v-loading="loading" class="layout_box table-main flex_column_full_hidden">

    <el-container class="page_layout_full_hidden">
      <div class="flex_layout_scroll">
        <el-table
          border
          :data="tableData">
          <el-table-column
            prop="orgNo"
            width="200"
            label="参保地机构编号">
          </el-table-column>
          <el-table-column
            prop="orgName"
            label="参保地机构名称">
          </el-table-column>
        </el-table>
      </div>
    </el-container>
    <!-- <everNoData v-else tipTxt="统计属期"></everNoData> -->
  </el-container>
</template>

<script>
import { medicalCostMouthDifPlacesOrg } from '@/rcm/store/otmdiscomponent/hlj-api.js'
import { hljybCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'

export default {
  data () {
    return {
      loading: false,
      tableData: [],
    }
  },
  created () {
    this.getMedicalCostMouthDifPlacesOrg()
  },
  methods: {
    getMedicalCostMouthDifPlacesOrg () {
      this.loading = true
      medicalCostMouthDifPlacesOrg({
        insuranceOrgId: hljybCode,
        macId: this.macId,
        type: 1
      }).then(res => {
        const { data } = res
        if (data) {
          this.tableData = data
        }
      }).finally(_ => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import url('./index.scss');
</style>

