<template>
  <div class="layout_inner">
    <div class="main_head">
      <ever-form2
        :schema="schema"
        class="input-style"
        v-model="queryObj"
        ref="form"
        :inline="true"
        @query="query(queryObj)"
      >
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="query(queryObj)">查询</el-button>
            <el-button type="default" @click="empty(queryObj)">重置</el-button>
          </el-form-item>
          <el-form-item class="fr">
            <el-button type="default" @click="batcheHandle(2)">批量通过</el-button>
            <el-button type="default" @click="batcheHandle(3)">批量驳回</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <el-table
      v-loading.body="loading"
      :data="tableData"
      class="doctor-table"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
      :cell-class-name="cellClassName"
      :default-sort="{prop: 'date', order: 'descending'}"
      border
      stripe
      :max-height="800"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" prop="groupMerchantId">
        <template slot-scope="scope">
          <el-button type="text" @click="seeDetail(scope.row, scope.$index)">查看资料</el-button>
          <el-button type="text" v-show="scope.row.type === 1" @click="adopt(scope.row)">审核</el-button>
          <el-button
            type="text"
            v-show="scope.row.type === 1"
            class="reject-btn"
            @click="reject(scope.row)"
          >驳回</el-button>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="申请提交医院" prop="tenantName"></el-table-column>
      <el-table-column show-overflow-tooltip label="申请编号" prop="scode"></el-table-column>
      <el-table-column show-overflow-tooltip label="手机号" prop="mobile"></el-table-column>
      <el-table-column show-overflow-tooltip label="用户名" prop="name"></el-table-column>
      <el-table-column show-overflow-tooltip label="申请时间" sortable="custom" prop="applyTime"></el-table-column>
      <el-table-column show-overflow-tooltip label="申请状态" prop="status">
        <template
          slot-scope="scope"
        >{{scope.row.status === 1? '未处理': scope.row.status === 2?'已通过': scope.row.status === 3?'已拒绝':'删除'}}</template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current='current'
        :totalCount="totalCount"
        :pagesize="pagesize"
      ></ever-pagination>
    </el-row>
    <el-dialog
      :title="dialogInfo.title"
      class="dialog-style"
      :close-on-click-modal="false"
      :visible.sync="dialogInfo.dialogVisible"
      width="40%"
    >
      <h3>请确认是否{{dialogInfo.type===2?'通过':'驳回'}}以下账号，批量操作请谨慎！</h3>
      <ul>
        <li
          v-for="(item,index) in dialogInfo.selectionList"
          :key="index"
        >{{`${item.name}(${item.mobile})${index == dialogInfo.selectionList.length-1?'':','}`}}</li>
      </ul>
      <div v-if="dialogInfo.type===3">
        <el-form ref="form" label-width="80px">
          <el-form-item label="拒绝原因:">
            <el-input type="textarea" :rows="4" v-model="dialogInfo.refusedReason" maxlength="50"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogInfo.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="diaConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import list from '@/titancare/mixins/list'
import api from '@/titancare/api/operation'
let schema = [
  {
    name: 'status',
    label: '',
    comp: 'el-select',
    props: {
      options: [
        { id: 1, label: '未处理' },
        { id: 2, label: '已通过' },
        { id: 3, label: '已拒绝' }
      ],
      placeholder: '申请状态'
    }
  },
  {
    name: 'time',
    label: '',
    comp: 'el-date-picker',
    props: {
      type: 'daterange',
      'start-placeholder': '注册开始时间',
      'end-placeholder': '注册结束时间'
    }
  },
  {
    name: 'mobileOrUserName',
    label: '',
    props: {
      placeholder: '请输入注册手机号/用户名'
    }
  }
]
export default {
  mixins: [list],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.requestSwitch = true
    return {
      api,
      queryObj,
      schema,
      loading: false,
      options: {},
      tableData: [],
      checkData: [],
      dialogInfo: {
        dialogVisible: false,
        selectionList: [],
        title: '批量驳回',
        type: 2,
        refusedReason: ''
      },
      obj: {},
      applyTimeArr: 2
    }
  },
  methods: {
    cellClassName ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 7 && row.status === 3) {
        return 'cRed'
      }
    },
    handleSelectionChange (data) {
      this.checkData = data
    },
    sortChange (val) {
      this.applyTimeArr = val.order === 'descending' ? 2 : 1
      this.list()
    },
    seeDetail (row, index) {
      let query = Object.assign({
        id: row.id,
        index: index,
        applyTimeArr: this.applyTimeArr,
        page: (this.offset / this.pagesize) + 1,
        queryObj: JSON.stringify(this.queryObj)
      }, this.obj)
      this.$router.push({ path: '/titancare/operation/doctor/doctordetails', query: query })
    },
    initOptions () {
      this.getRoute()
      this.list()
    },
    empty () {
      for (let key in this.queryObj) {
        if (key !== 'tenantId') {
          this.queryObj[key] = ''
        }
        this.queryObj.requestSwitch = true
      }
      this.query()
    },
    batcheHandle (type) {
      let checkData = this.checkData.filter(item => item.status === 1)
      if (checkData.length === 0) {
        this.$notify({
          message: '请至少选择一个未处理申请',
          type: 'error'
        })
        return
      }
      if (type === 2) {
        this.dialogInfo.title = '批量通过'
      } else {
        this.dialogInfo.title = '批量驳回'
      }
      this.dialogInfo.type = type
      this.dialogInfo.selectionList = checkData
      this.dialogInfo.dialogVisible = true
    },
    diaConfirm () {
      let message = '审核'
      let ids = this.checkData.filter(item => {
        return item.status === 1
      }).map(item => item.id)
      let params = {
        ids: ids,
        status: this.dialogInfo.type
      }
      if (this.dialogInfo.type === 3) {
        message = '驳回'
        params.refusedReason = this.dialogInfo.refusedReason
        if (!params.refusedReason) {
          this.$notify({
            message: '拒绝原因不能为空',
            type: 'error'
          })
          return
        }
      }
      api.checkCertDoctorBatch(params).then(rs => {
        if (!rs.errCode && rs.data.errorList.length > 0) {
          let info = rs.data.errorList.map(item => { return '编号：' + item.scode + ',' + item.reason }).join(',')
          this.$notify({
            message: info + ',' + message + '失败,请重新' + message,
            type: 'error'
          })
        } else if (!rs.errCode && rs.data.errorList.length === 0) {
          this.$notify({
            message: message + '成功',
            type: 'success'
          })
        } else {
          this.$notify({
            message: message + '失败',
            type: 'eorror'
          })
          this.dialogInfo.dialogVisible = false
          return
        }
        this.dialogInfo.dialogVisible = false
        this.query()
      }, rj => {
        this.$notify({
          message: message + '失败',
          type: 'error'
        })
      })
    },
    adopt (row) {
      let params = {
        ids: [row.id],
        status: 2
      }
      this.changeStatus(params, '审核成功')
    },
    reject (row) {
      let params = {
        ids: [row.id],
        status: 3
      }
      this.changeStatus(params, '驳回成功')
    },
    changeStatus (params, message) {
      api.checkCertDoctorBatch(params).then(rs => {
        if (rs && rs.errorList && rs.errorList.length === 0) {
          this.$notify({
            message: message,
            type: 'success'
          })
          this.list()
        }
      })
    },
    query () {
      this.handleCurrentChange(1)
    },
    list () {
      this.loading = true
      this.tableData = []
      let params = Object.assign(
        {
          offset: this.offset,
          pagesize: this.pagesize,
          applyTimeArr: this.applyTimeArr
        },
        this.queryObj
      )
      if (this.queryObj.time && this.queryObj.time[0]) {
        params.applyTimeStart = this.$moment(this.queryObj.time[0]).format('YYYY-MM-DD') + ' 00:00:00'
      }
      if (this.queryObj.time && this.queryObj.time[1]) {
        params.applyTimeEnd = this.$moment(this.queryObj.time[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }
      this.obj = JSON.parse(JSON.stringify(params))
      delete params.time
      api.searchCertDoctor(params).then(rs => {
        if (!rs.errCode) {
          this.totalCount = rs.data.totalCount
          this.tableData = rs.data.resultList
        } else {
          this.totalCount = 0
        }
        this.loading = false
      })
    },
    getRoute () {
      if (this.$route.query && this.$route.query.queryObj) {
        this.queryObj = JSON.parse(this.$route.query.queryObj)
        this.pagesize = Number(this.$route.query.pagesize)
        this.offset = Number(this.$route.query.offset)
        this.queryObj.requestSwitch = this.$route.query.requestSwitch
      }
    }
  },
  created () {
    this.initOptions()
  },
  watch: {
    // 'queryObj.tenantId': {
    //   handler: function (val, oldval) {
    //     if (val) {
    //       console.log(val, '发生改变')
    //       if (this.options.length) {
    //         this.localhost = this.options.find(item => item.id === val).fullGroupDomainName
    //         localStorage.setItem('IHTENANTID', val)
    //       }
    //     }
    //   },
    //   immediate: true
    // },
    'dialogInfo.dialogVisible': {
      handler: function (val, oldval) {
        if (!val) {
          this.dialogInfo.refusedReason = ''
        }
      },
      immediate: true
    }
  }
}
</script>
<style lang="less" scoped>
.live-manager {
  padding: 20px;
}
.input-style /deep/ .el-button {
  padding: 8px 10px;
}
.input-style /deep/ input {
  height: 32px;
  line-height: 32px;
}
.input-style /deep/ .el-date-editor {
  height: 32px;
  padding: 0 10px;
  input {
    height: 30px;
  }
}
.fr {
  float: right;
}
.dialog-style {
  & /deep/ .el-dialog__body {
    padding: 15px 20px 0 20px;
  }
  h3 {
    margin-top: 0;
  }
  ul {
    overflow: hidden;
    padding: 10px;
    li {
      float: left;
      padding: 5px;
    }
  }
}
.reject-btn {
  color: #f56c6c;
}
</style>
