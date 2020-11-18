<template>
  <div id="pretemplate">
    <el-row class="main-head">
      <el-col :span="20">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
      </el-col>
      <el-col class="main-option" :span="4">
        <router-link :to="{name: 'largescreencon'}">
          <el-button size="small" type="primary">新建大屏</el-button>
        </router-link>
      </el-col>
    </el-row>
    <el-table v-loading.body="loading" :data="tableData" style="width: 100%" :border="false">
      <el-table-column align="center" prop="sn" label="大屏编号"></el-table-column>
      <el-table-column min-width="100" prop="name" align="center" label="大屏显示名称"></el-table-column>
      <el-table-column min-width="100" prop="suitRoom" align="center" label="大屏适用诊间"></el-table-column>
      <el-table-column min-width="100" prop="location" align="center" label="大屏所在位置"></el-table-column>
      <el-table-column min-width="100" prop="creatorName" align="center" label="配置人"></el-table-column>
      <el-table-column min-width="100" prop="createTime" align="center" label="配置时间"></el-table-column>
      <el-table-column min-width="100" prop="description" align="center" label="备注"></el-table-column>
      <el-table-column width="150" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="updateTemplate(scope.row, scope.$index)">编辑</el-button>
          <el-button
            type="danger"
            size="small"
            @click="deleteTemplate(scope.row.id, scope.$index)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </el-row>
  </div>
</template>

<script>
import api from '@/warehouse/page/devicemanage/store/largescreenapi'
import list from '@/util/list'
var querySchema = [
  {
    name: 'sn',
    label: '大屏编号',
    placeholder: '请输入大屏编号'
  },
  {
    name: 'name',
    label: '大屏显示名称',
    placeholder: '请输入大屏显示名称'
  }
]
export default {
  props: ['visitType'],
  mixins: [list],
  data () {
    let obj = this.$ever.createObjFromSchema(querySchema)
    return {
      api,
      querySchema,
      queryObj: Object.assign(obj),
      tableData: []
    }
  },
  watch: {
    'visitType' (val) {
      this.list()
    }
  },
  methods: {
    // 删除
    deleteTemplate (id, index) {
      this.$confirm('您确定要删除此设备信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          id: id
        }
        api.deleteScreen(params).then(res => {
          if (res.head.errCode === 0 && res.data > 0) {
            this.$messageTips(this, 'success', '删除成功', '提示')
            this.list()
          }
        })
      })
    },
    // 编辑
    updateTemplate (data, index) {
      this.$router.push({ name: 'largescreencon', params: { id: data.id } })
    }
  }
}
</script>

