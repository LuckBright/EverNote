<template>
  <div class="layout_inner">
    <el-table
      border
      v-loading.body="loading"
      :data="tableData">
      <el-table-column
        prop="name"
        label="授权类型">
      </el-table-column>
      <el-table-column
        prop="type"
        label="启用状态">
        <template slot-scope="scope">
          {{scope.row.status | type}}
        </template>
      </el-table-column>
      <el-table-column
        prop="describe"
        label="功能描述">
      </el-table-column>
      <el-table-column
        prop="executionDatetime"
        label="操作">
        <template slot-scope="scope">
          <el-button :disabled="!Boolean(scope.row.status)" @click="modifyType(scope.row)" type="danger">停用</el-button>
          <el-button :disabled="Boolean(scope.row.status)" @click="modifyType(scope.row)" type="primary">启用</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import api from '@/rcm/store/outpatient/auth.manage.api.js'
export default {
  data () {
    return {
      api,
      loading: false,
      tableData: []
    }
  },
  created () {
    this.list()
  },
  methods: {
    modifyType (row) {
      let title = `确定要${row.status ? '停用' : '启用'}${row.name}?`
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          code: row.code,
          status: row.status ? 0 : 1
        }
        api.authChange(params).then(rs => {
          if (!rs.head.errCode) {
            this.$messageTips(this, 'success', '修改状态成功')
            this.list()
          }
        })
      })
    },
    list () {
      api.authList().then(rs => {
        if (!rs.head.errCode) {
          this.tableData = rs.data
        }
      })
    }
  },
  filters: {
    type (val) {
      return val ? '启用' : '停用'
    }
  }
}
</script>

