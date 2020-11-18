<template>
  <div>
    <h4 class="title">日志明细</h4>
    <el-table
      border
      stripe
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="createTime"
        label="时间">
      </el-table-column>
      <el-table-column
        prop="createBy"
        label="操作人">
      </el-table-column>
      <el-table-column
        prop="type"
        label="操作类型">
        <template slot-scope="scope">
          {{$setName(APPROVAL_TYPE, scope.row.type, true) || '-'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        label="备注">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { APPROVAL_TYPE } from '@/titancare/utils/enumeration'
export default {
  props: ['tableData'],
  data () {
    return {
      APPROVAL_TYPE
    }
  }
}
</script>

