<template>
  <div class="container">
    <div class="upcontainer">
      <div class="btnsLeft">
        <el-button size="small" type="primary" @click="addNewDialog">新增</el-button>
      </div>
      <div class="clearfix"></div>
    </div>
    <div>
      <el-table v-loading="loading" :data="tableData" style="width:100%;">
        <el-table-column label="序号" type="index" width="100px"></el-table-column>
        <el-table-column label="收费项目编号" prop="itemCode"></el-table-column>
        <el-table-column label="收费项目名称" prop="itemName"></el-table-column>
        <el-table-column label="状态" prop="itemName">
          <template slot-scope="scope">
            <span v-if="scope.row.isValid ===1" class="canUse">{{scope.row.isValid | filterStatus}}</span>
            <span v-else class="cannotUse">{{scope.row.isValid | filterStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" plain size="small" @click="deleteItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      class="dialogcontainer"
      :title="'新增补费项目'"
      width="700px"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <div>
        <div class="containerLeft">
          <el-input v-model="name" @keypress.native="handleKeyPress"></el-input>
        </div>
        <el-button size="small" type="primary" @click="querylist" :disabled="diablebtn">查询</el-button>
        <el-button size="small" @click="cancelDialog">取消</el-button>
      </div>
      <el-table
        :data="dialogTableData"
        height="calc(100vh - 400px)"
        v-loading="dialogLoading"
        style="width:100%;"
        empty-text="请输入收费项目名称进行查询"
      >
        <el-table-column label="序号" type="index" width="100px"></el-table-column>
        <el-table-column label="医嘱项目名称" prop="name"></el-table-column>
        <el-table-column prop="serviceClassification" label="物资分类" width="200">
          <template slot-scope="scope">
            <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="scope.row.serviceClassification"></sys-value>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" plain size="small" @click="addNew(scope.row)">添加</el-button>
          </template>
        </el-table-column>
      </el-table>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :pagerCount="5"
        :totalCount="totalCount"
        :small="true"
        :layout="'total, prev, pager, next'"
      ></ever-pagination>
    </el-dialog>
  </div>
</template>
<script>
import { getServiceItem, getServiceList, addServiceItem, deleteServiceItem } from '../../store/bizdict/bizdict'
export default {
  data () {
    return {
      name: '',
      // 默认查询启用
      dialogVisible: false,
      tableData: [],
      dialogTableData: [],
      loading: false,
      dialogLoading: false,
      diablebtn: false,
      isEdit: false,
      pageSizes: [5, 10, 15, 20],
      pagesize: 20,
      pageIndex: 1,
      totalCount: 0
    }
  },
  filters: {
    filterStatus (val) {
      let ret = ''
      switch (val) {
        case 0:
          ret = '禁用'
          break
        case 1:
          ret = '启用'
          break
        case 2:
          ret = '已删除'
          break
        case 3:
          ret = '非收费项'
          break
        default:
          ret = '禁用'
          break
      }
      return ret
    }
  },
  created () {
    this.query()
  },
  methods: {
    addNewDialog () {
      this.dialogVisible = true
      this.querylist()
    },
    cancelDialog () {
      this.empotyObj()
      this.dialogVisible = false
    },
    query () {
      this.loading = true
      // 查询列表接口
      getServiceList().then(res => {
        if (res.head && res.head.errCode === 0) {
          this.tableData = res.data
          this.loading = false
        }
      }).catch(() => {
        this.loading = false
      })
    },
    // 弹窗里模糊查询收费项
    async querylist () {
      this.dialogLoading = true
      let params = {
        name: this.name,
        isAdviceList: [1, 11], // 只要是收费项都可以添加
        pagesize: this.pagesize,
        offset: (this.pageIndex - 1) * this.pagesize
      }
      try {
        let result = await getServiceItem(params)
        this.dialogTableData = result.data
        this.totalCount = result.totalCount
        this.dialogLoading = false
      } catch (err) {
        this.dialogLoading = false
      }
    },
    async addNew (row) {
      let params = {
        itemCode: row.code,
        itemName: row.byname,
        itemId: row.id
      }
      addServiceItem(params).then(res => {
        this.$messageTips(this, 'success', '新增补费项目成功')
        this.query()
      })
    },
    deleteItem (row) {
      deleteServiceItem({ id: row.id }).then(res => {
        this.$messageTips(this, 'success', '删除补费项目成功')
        this.query()
      })
    },
    handleKeyPress (e) {
      if (e.keyCode === 13) {
        this.querylist()
      }
    },
    empotyObj () {
      this.name = ''
      // 将弹窗里的值清空
      this.dialogTableData = []
      this.pagesize = 20
      this.pageIndex = 1
    },
    handleSizeChange (pagesize) {
      this.pagesize = pagesize
      this.querylist()
    },
    handleCurrentChange (pageIndex) {
      this.pageIndex = pageIndex
      this.querylist()
    }
  }
}
</script>
<style scoped>
.container {
  height: 100%;
  padding: 0 10px 10px 10px;
  overflow-y: scroll;
}
.container .upcontainer {
  margin-bottom: 15px;
}
.btnsLeft {
  float: left;
}
.container /deep/ .el-dialog__body {
  padding-top: 0;
}
.containerLeft {
  float: left;
  margin-right: 15px;
}
.containerLeft /deep/ .el-input__inner {
  height: 32px;
  line-height: 32px;
}
.canUse {
  color: green;
}
.cannotUse {
  color: red;
}
</style>
