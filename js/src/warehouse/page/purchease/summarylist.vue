<template>
  <div>
    <el-button type="primary" @click="openSummaryDialogs()" size="small">添加申请单</el-button>
    <el-table
      border
      :data="tableData">
      <el-table-column width="60" align="center">
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="采购申请单号"
        width="300">
        <template slot-scope="scope">
          <a @click="handlerRoute(scope.row)">{{scope.row.code}}</a>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="storageRoomName"
        label="收货仓库">
      </el-table-column>
      <el-table-column
        align="center"
        prop="applicantName"
        label="申请人">
      </el-table-column>
      <el-table-column
        align="center"
        prop="applyTime"
        label="申请时间">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="tableData.length > 1" type="text" @click="deleteScopeRow(scope.row, scope.$index)"><i class="iconfont icon-bingli-shanchu"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" size="small" :disabled="!tableData.length" :loading="btnLoading" @click="createSummary">确认汇总</el-button>
    <el-button size="samll" @click="$router.go(-1)">返回</el-button>
    <dialog-summary-search ref="openSummaryDialog" :parentTableData="tableData" @selectSummarylist="selectSummarylist"></dialog-summary-search>
  </div>
</template>

<script>
import storage from '@/util/storage'
import api from '../storages/store/procurementapi'
import dialogSummarySearch from './component/summarysearchselect'
export default {
  data () {
    return {
      tableData: [],
      btnLoading: false
    }
  },
  activated () {
    this.tableData = JSON.parse(storage.getSessionStorage('summaryCheckData'))
  },
  mounted () {
    this.tableData = JSON.parse(storage.getSessionStorage('summaryCheckData'))
  },
  methods: {
    handlerRoute (row) {
      this.$router.push(`/goods/focusprocurementdetail/${row.id}?operation=1`)
    },
    selectSummarylist (val) {
      this.tableData = this.tableData.concat(val)
      storage.setSessionStorage('summaryCheckData', JSON.stringify(this.tableData))
    },
    openSummaryDialogs () {
      this.$refs.openSummaryDialog.open()
    },
    deleteScopeRow (row, index) {
      this.tableData.splice(index, 1)
      storage.setSessionStorage('summaryCheckData', JSON.stringify(this.tableData))
    },
    createSummary () {
      this.btnLoading = true
      api.summaryCreate(this.tableData).then(res => {
        if (res) {
          this.everSuccess('创建汇总单成功')
          this.$router.push(`/goods/summarydetail/${res.id}?status=1`)
        }
        this.btnLoading = false
      })
    }
  },
  components: {
    dialogSummarySearch
  }
}
</script>

