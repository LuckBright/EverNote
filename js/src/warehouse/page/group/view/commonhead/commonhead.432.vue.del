<template>
  <div class="layout_inner">
    <el-row class="main-head alg_r">
      <el-button type="primary" @click="edit">新建</el-button>
    </el-row>
    <el-table class="ever-table-wrap" :data="tableData" :border="false" empty-text="暂无数据" style="width: 100%">
      <el-table-column prop="code" label="工作站编号"></el-table-column>
      <el-table-column prop="name" label="name"></el-table-column>
      <el-table-column prop="creatorName" label="创建人"></el-table-column>
      <el-table-column prop="createTime" label="生效时间">
        <template slot-scope="scope">{{scope.row.createTime | formatDateByExp('YYYY-MM-DD')}}</template>
      </el-table-column>
      <el-table-column prop="updaterName" label="修改人"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间">
        <template
          slot-scope="scope"
        >{{scope.row.updateTime | formatDateByExp('YYYY-MM-DD')}}</template>
      </el-table-column>
      <el-table-column prop="activeStatus" label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="edit(scope.row)">编辑</el-button>
          <!-- <el-button size="small" type="primary" @click="deleteItem(scope.row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import api from '@/warehouse/page/group/store/common.head'
export default {
  data () {
    return {
      api,
      tableData: []
    }
  },
  async mounted () {
    let res = await this.api.getAllTemplate()
    this.tableData = res.data
  },
  methods: {
    edit (row) {
      this.$router.push({
        path: this.$route.meta.childNavPath,
        query: {
          code: row.code,
          name: row.name,
          id: row.id
        }
      })
    },
    async deleteItem (row) {
      await api.deleteItem(row.id)
      const res = await api.getAllTemplate()
      this.tableData = res.data
    }
  },
  computed: {},
  watch: {}
}
</script>
