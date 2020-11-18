<template>
  <div class="layout_inner">
    <el-row>
      <el-col :span="20">
        <ever-form2 :schema="querySchema" v-model="queryObj" ref="form" :inline="true" :is-query="true" @query="list(true)">
        </ever-form2>
      </el-col>
      <el-col :span="4" align="right">
        <el-button type="primary" size="small" @click="createNew()">创建新行为</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table border :data="tableData">
          <el-table-column
            label="行为类型"
            width="160"
            align="center"
            prop="name"
          >
          </el-table-column>
          <el-table-column label="行为生效状态" width="150" align="center">
            <template slot-scope="scope">
                {{scope.row.status ? '生效' : '停止'}}
            </template>
          </el-table-column>
          <el-table-column label="行为标签" align="center" prop="labelName">
            <template slot-scope="scope">
              {{scope.row.labelName || '--'}}
            </template>
          </el-table-column>
          <el-table-column label="标签颜色" align="center" width="120">
            <template slot-scope="scope">
              <div align="center">
                <span v-if="scope.row.color">
                  <div :style="'width:22px;height:10px;background-color:' + scope.row.color "></div>
                </span>
                <span v-else>--</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="160" fixed="right">
            <template slot-scope="scope">
              <el-button size="small" @click="showDialog(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
          :current="current"
        ></ever-pagination>
      </el-col>
    </el-row>
    <dialog-behavior-detail ref="behavior" :behaviorData="behaviorData" @update="() => this.list()"></dialog-behavior-detail>
  </div>
</template>
<script>
import api from '@/crm/store/tagapi'
import utillist from '@/util/list'
import dialogBehaviorDetail from './behavior.detail.vue'
let querySchema = [
  {
    name: 'name',
    label: '行为类型',
    props: {
      placeholder: '输入行为类型名称搜索'
    }
  }
]
export default {
  mixins: [utillist],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.pagesize = 20
    queryObj.offset = 0
    return {
      api,
      queryObj,
      querySchema,
      tableData: [],
      totalCount: 0,
      current: 1,
      behaviorData: {}
    }
  },
  created () {
    this.list()
  },
  methods: {
    list () {
      api.behaviorlist(this.queryObj).then(rs => {
        if (rs.head.errCode === 0) {
          this.tableData = rs.data.resultList
          this.totalCount = rs.data.totalCount
        } else {
          this.tableData = []
          this.totalCount = 0
        }
      })
    },
    showDialog (val) {
      this.behaviorData = val
      this.$refs.behavior.open()
    },
    createNew () {
      this.behaviorData = {
        systemFlag: 0,
        isNew: 1
      }
      this.$refs.behavior.open()
    },
    handleCurrentChange (val) {
      this.current = val
      this.queryObj.offset = (val - 1) * this.queryObj.pagesize || 0
      this.list()
    },
    handleSizeChange (val) {
      this.queryObj.pagesize = val
      this.queryObj.offset = (this.current - 1) * this.queryObj.pagesize
      this.list()
    }
  },
  components: {
    dialogBehaviorDetail
  }
}
</script>

