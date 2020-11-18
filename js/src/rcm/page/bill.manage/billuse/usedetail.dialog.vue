<template>
  <el-dialog title="使用详情" :visible.sync="v" width="90%" class="use-dialog" :close-on-click-modal="false">
    <ever-form2 :schema="schema" v-model="queryObj" :inline="true" :isQuery="true" @query="query">
      <template slot="dateRange">
        <el-date-picker
          v-model="queryObj.dateRange"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions">
        </el-date-picker>
      </template>
      <template slot="btn">
        <el-button size="small" type="primary" @click="query">查询</el-button>
      </template>
      <div></div>
    </ever-form2>
    <el-table :data="tableData" v-loading="loading" height="350">
      <el-table-column prop="businessName" label="业务名称"></el-table-column>
      <el-table-column prop="name" label="票据名称"></el-table-column>
      <el-table-column prop="requestTypeName" label="请求类别"></el-table-column>
      <el-table-column prop="creater" label="请求人"></el-table-column>
      <el-table-column prop="createTime" label="请求时间"></el-table-column>
      <el-table-column prop="code" label="票据号"></el-table-column>
      <el-table-column prop="billTypeName" label="票据状态"></el-table-column>
      <el-table-column prop="printStatusName" label="打印状态"></el-table-column>
      <el-table-column prop="sourceId" label="请求业务ID"></el-table-column>
      <el-table-column prop="" label="操作">
        <template slot-scope="scope">
          <el-button type="text" :class="{'disable-color': scope.row.billType == 1}" @click="deleteBill(scope.row)" style="color: #f56c6c;">作废</el-button>
        </template>
      </el-table-column>
    </el-table>
    <ever-pagination
      :current="current"
      :page-sizes="pageSizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
    ></ever-pagination>
  </el-dialog>
</template>
<script>
import list from '@/util/list'
import api from '@/rcm/store/bill.manage/bill.use.api'
let schema = [
  {
    name: 'dateRange',
    comp: 'custom'
  },
  {
    label: '结算单ID',
    name: 'sourceId',
  },
  {
    name: 'btn',
    comp: 'custom'
  }
]
export default {
  props: ['visible', 'ownerId'],
  mixins: [list],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    return {
      api,
      schema,
      queryObj,
      tableData: [],
      loading: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  methods: {
    query () {
      this.handleCurrentChange(1)
    },
    list () {
      console.log(this.queryObj)
      this.loading = true
      let params = {
        createBy: this.ownerId,
        page: this.current,
        pagesize: this.pagesize
      }
      if (this.queryObj.sourceId) {
        params.sourceId = this.queryObj.sourceId
      }
      if (this.queryObj.dateRange) {
        params.startTime = this.$moment(this.queryObj.dateRange[0]).format('YYYY-MM-DD') + ' 00:00:00'
        params.endTime = this.$moment(this.queryObj.dateRange[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }
      api.getUsedPage(params).then(rs => {
        if (rs.head && rs.head.errCode === 0) {
          this.tableData = rs.data.list
          this.totalCount = rs.data.total
        }
        this.loading = false
      })
    },
    deleteBill (row) {
      if (row.billType === 1) return
      this.$confirm('确定作废此票据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        api.cancleById({id: row.id, billId: row.billId}).then(rs => {
          if (rs.head && rs.head.errCode === 0) {
            this.$messageTips(this, 'success', '作废成功!')
            this.query()
          }
          this.loading = false
        }, rj => {
          this.loading = false
        })
      })
    }
  },
  computed: {
    v: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    'visible': {
      handler: function (val) {
        if (val) {
          this.list()
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.use-dialog /deep/ .el-dialog__body {
  padding: 15px !important;
}
.disable-color {
  color:#bfcbd9 !important;
}
</style>
