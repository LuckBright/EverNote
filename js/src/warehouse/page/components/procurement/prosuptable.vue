<template>
  <div>
    <!-- 标题 -->
    <h4 class="stripTips">
      <i class="fl"></i><span class="fl">{{title || '采购单列表'}}
      </span>
      <doc-download
        size="small"
        class="fr mb10"
        v-if="tableData.length"
        @downFile="exportTable"
        ref="exportProSupTable"
        btnTxt="导出采购单"
      ></doc-download>
    </h4>
    <!-- <h4 class="purchease_list">
      <span class="title">{{title || '采购单列表'}}</span>
    </h4> -->
    <!-- 表格 -->
    <el-table v-loading.body="loading" :data="tableData" style="width: 100%" border>
      <el-table-column width="60" align="center">
        <template slot-scope="scope">{{scope.$index + 1}}</template>
      </el-table-column>
      <el-table-column prop="code" align="center" label="采购单号">
        <template slot-scope="scope">
          <a
            @click="$router.push('/goods/drugpurchease/' + scope.row.id + '?drug=true')"
          >{{scope.row.code}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="supplierName" label="供应商名称" align="center"></el-table-column>
      <el-table-column label="合同" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.contractName">{{scope.row.contractName}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import api from '@/warehouse/page/storages/store/procurementapi'
import { debounce } from '@/util/common'
import { DOWNLOAD_FILE } from '@/warehouse/views/util/constant.js'
export default {
  props: ['title', 'loading', 'tableData'],
  data () {
    return {
    }
  },
  methods: {
    exportTable: debounce(function () {
      let tempArr = []
      this.tableData.forEach(v => {
        tempArr.push(v.id)
      })
      api.exportPurchaseApplyOfOrderList({ orderIds: tempArr }).then(res => {
        if (res && res.fileName) {
          this.$refs.exportProSupTable.downfile(DOWNLOAD_FILE + res.fileName)
          this.$messageTips(this, 'success', '采购单导出成功')
        }
      })
    })
  }
}
</script>

<style lang="less" scoped>
.stripTips {
  height: 14px;
  line-height: 14px;
  color: #333333;
  font-size: 14px;
  // .strip {
  //   width: 3px;
  //   height: 14px;
  //   background: #1C7BEF;
  // }
}
.purchease_list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  margin: 0;
  span.title {
    border-left: 3px solid #1c7bef;
    padding-left: 10px;
  }
}
.hr {
  padding: 0;
  margin: 10px 0 15px;
  border-color: #ddd;
}
</style>
