<!--
 * @Author: by zhangsheng@everjiankang.com.cn
 * @Date: 2020-11-03 19:55:10
 * @LastEditTime: 2020-11-09 12:08:23
 * @LastEditors: by zhangsheng@everjiankang.com.cn
-->
<template>
  <el-table
    border
    v-loading.body="loading"
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
      prop="printCode"
      width="100"
      v-if="printCodeSetting === 1"
      label="序号">
    </el-table-column>
    <el-table-column
      align="center"
      prop="storageRoomName"
      label="收货库房">
    </el-table-column>
    <el-table-column
      align="center"
      prop="applicantName"
      label="申请人">
    </el-table-column>
    <el-table-column
      align="center"
      label="申请时间">
      <template slot-scope="scope">
        <span v-if="scope.row.status !== 812">
          {{scope.row.applyTime}}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      prop="status"
      label="申请单状态">
      <template slot-scope="scope">
        <span>{{FULL_STATE.procurement[scope.row.status]}}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { FULL_STATE } from '@/util/warehouseconfig'
export default {
  props: ['tableData', 'loading', 'path', 'printCodeSetting'],
  data () {
    return {
      FULL_STATE
    }
  },
  methods: {
    handlerRoute (row) {
      this.$router.push(`${this.path}${row.status === 812 ? `${row.id}?status="true"` : row.id}`)
    }
  },
}
</script>

<style lang="less" scoped>
</style>
