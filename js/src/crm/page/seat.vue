<template>
  <div class="calllist">
    <div class="el-breadcrumb ever_breadcrumb"></div>
    <div class="bg">
      <div class="settle_inner">
        <el-menu class="settlemenu">
          <el-menu-item class="is-active" index="seat">座席管理</el-menu-item>
          <el-menu-item @click="changeCallPage" index="call">通话记录</el-menu-item>
          <!-- <el-menu-item @click="changeSnsPage" index="sns">
            短信记录
          </el-menu-item>-->
        </el-menu>
      </div>
      <div class="layout_inner">
        <el-row class="main-head">
          <el-col :span="12">
            <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
          </el-col>
          <el-col :span="12" align="right">
            <el-button @click="addSeat()">添加座席</el-button>
          </el-col>
        </el-row>
        <div class="main-wrap">
          <el-table
            v-if="visible"
            @selection-change="handleSelectionChange"
            :data="tableData"
            border
            class="el-td-border"
          >
            <el-table-column prop="sn" label="座席ID" width="120" align="center"></el-table-column>
            <el-table-column label="姓名" width="220" align="center" prop="doctorName"></el-table-column>
            <el-table-column label="手机号" align="center" width="300" prop="doctorMobile"></el-table-column>
            <el-table-column prop="mobile" label="转接手机" align="center" width="300"></el-table-column>
            <el-table-column label="状态" align="center" width="300">
              <template slot-scope="scope">
                <sys-value type="THC_CC_SEAT_STATUS" :code="scope.row.status"></sys-value>
              </template>
            </el-table-column>
            <el-table-column label="状态时长" width="400" align="center">
              <template slot-scope="scope">{{scope.row.duration ? scope.row.duration : 0}} 秒</template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="linkDetailPage(scope.row.id)">编辑</el-button>
                <el-button type="danger" size="small" @click="delById(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
          :current="current"
        ></ever-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../store/seatapi'
import utillist from '../../util/list'
let querySchema = [
  {
    name: 'type',
    type: 'select',
    label: '分类',
    options: [{ id: 0, name: '全部' }, { id: 1, name: '呼入' }, { id: 2, name: '呼出' }],
    span: 3
  }
]
export default {
  mixins: [utillist],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.origId = 1
    queryObj.type = 0
    return {
      api: api,
      querySchema: querySchema,
      visible: true,
      queryObj: queryObj,
      selected: []
    }
  },
  methods: {
    // changeSnsPage () {
    //   this.$router.push({ name: 'sns', path: 'sns' })
    // },
    changeCallPage () {
      this.$router.push({ name: 'call', path: 'call' })
    },
    afterSave () {
      this.$router.push({ name: 'seat', path: 'seat' })
    },
    linkDetailPage (id) {
      this.$router.push({ name: 'addseat', path: 'addseat', query: { id: id } })
    },
    handleSelectionChange (val) {
      this.selected = val.filter(item => {
        item.mobile = item.called
        return item.patientId !== null
      })
    },
    addSeat (id) {
      this.$router.push({ name: 'addseat', path: 'addseat' })
    },
    delById (id) {
      this.$confirm('您确定要删除此座席吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.api.deleteId({ id: id }).then(rs => {
          if (rs.head.errCode === 0) {
            this.api.list(this.queryObj).then(rs => {
              this.tableData = rs.data.resultList
            })
          }
        })
      })
    }
  }
}
</script>
<style scoped>
.bg {
  background-color: #fff;
}
.settle_inner .settlemenu {
  background: #f8f8f8;
  font-family: PingFangSC-Semibold;
  font-size: 16px;
  color: #000;
  line-height: 16px;
  padding: 0 10px;
}
.settlemenu .el-menu-item {
  padding: 0 15px;
}
.settlemenu .el-menu-item {
  height: 50px;
  line-height: 50px;
  border-bottom: 3px solid transparent;
  display: inline-block;
}
.settlemenu .el-menu-item:hover,
.settlemenu .el-menu-item.is-active {
  background-color: #f8f8f8;
  border-bottom: 3px solid #1c7bef;
}
.pdl20 {
  padding-left: 20px;
}
.pd20 {
  padding: 20px;
}
.pdside20 {
  padding: 0px 20px;
}
</style>
