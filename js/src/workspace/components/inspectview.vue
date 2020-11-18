<template>
  <el-dialog title="检验报告结果" :visible.sync="visibleFlag" class="dialogToday ui_dialog_02">
    <el-table
      width="100%"
      v-loading.body="loading"
      class="rstable lh32"
      :data="inspectDetail"
      empty-text="暂无数据"
      :stripe="false"
    >
      <el-table-column show-overflow-tooltip prop="inspectUnitName" label="项目名称" align="center"></el-table-column>
      <el-table-column show-overflow-tooltip prop="quantityValue" label="测试结果" align="center"></el-table-column>
      <el-table-column show-overflow-tooltip prop="inspectUnitShortName" label="单位" align="center"></el-table-column>
      <el-table-column show-overflow-tooltip prop="refValue" label="参考区间" align="center"></el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import api from '../store/maingeneralapi'
export default {
  props: ['recordId'],
  data () {
    return {
      inspectDetail: [],
      loading: false,
      visibleFlag: false
    }
  },
  methods: {
    onDialogClose () {
      this.visibleFlag = false
    },
    onDialogOpen () {
      this.visibleFlag = true
    }
  },
  created () {

  },
  watch: {
    'recordId': {
      handler (val) {
        api.getInspectRecordDetail(val).then(rs => {
          this.inspectDetail = rs.data
        })
      },
      deep: true
    }
  }
}
</script>
