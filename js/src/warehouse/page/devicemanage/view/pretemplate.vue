<template>
  <div id="pretemplate">
    <el-row class="main-head">
      <el-col :span="20">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
      </el-col>
      <el-col class="main-option" :span="4">
        <el-button type="primary" size="small" @click="$router.push({
          name: 'selfhelpmechinecon'
        })">新增自助机</el-button>
      </el-col>
    </el-row>
    <el-table v-loading.body="loading" :data="tableData" style="width: 100%" :border="false">
      <el-table-column align="center" prop="sn" label="自助机编号"></el-table-column>
      <el-table-column min-width="100" prop="name" align="center" label="自助机名称"></el-table-column>
      <el-table-column min-width="100" prop="drawBloodRoom" align="center" label="抽血室"></el-table-column>
      <el-table-column min-width="100" prop="paperType" align="center" label="纸张类型"></el-table-column>
      <el-table-column min-width="100" align="center" label="屏保时间">
        <template slot-scope="scope">{{scope.row.screensaverTime}}s</template>
      </el-table-column>
      <el-table-column min-width="100" prop="location" align="center" label="自助机所在位置"></el-table-column>
      <el-table-column min-width="100" prop="creatorName" align="center" label="配置人"></el-table-column>
      <el-table-column min-width="100" prop="createTime" align="center" label="配置时间"></el-table-column>
      <el-table-column min-width="100" prop="note" align="center" label="备注"></el-table-column>
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
import api from '@/warehouse/page/devicemanage/store/selfmachineapi.js'
import list from '@/util/list'
var querySchema = [
  {
    name: 'sn',
    label: '自助机编号',
    placeholder: '请输入自助机编号'
  },
  {
    name: 'name',
    label: '自助机名称',
    placeholder: '请输入自助机名称'
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
  created () {
    this.list()
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
          selfMachineId: id
        }
        api.delSelfmach(params).then(res => {
          if (res.head.errCode === 0 && res.data > 0) {
            this.$messageTips(this, 'success', '删除成功', '提示')
            this.list()
          }
        })
      })
    },
    // 编辑
    updateTemplate (data, index) {
      this.$router.push({ name: 'selfhelpmechinecon', params: { sn: data.sn } })
    }
  }
}
</script>

