<template>
  <div class="call">
    <div class="el-breadcrumb ever_breadcrumb"></div>
    <div class="bg">
      <div class="settle_inner">
        <el-row>
          <el-col :span="24">
            <el-menu class="settlemenu">
              <el-menu-item @click="changeSeatPage" index="seat">座席管理</el-menu-item>
              <el-menu-item class="is-active" index="call">通话记录</el-menu-item>
              <!-- <el-menu-item @click="changeSnsPage" index="sns">
                  短信记录
              </el-menu-item>-->
            </el-menu>
          </el-col>
        </el-row>
      </div>
      <el-row class="pd20">
        <el-col :span="12">
          <ever-query-form :schema="querySchema" v-model="queryObj" @query="list(true)"></ever-query-form>
        </el-col>
        <el-col :span="12" align="right"></el-col>
      </el-row>
      <el-row class="pd20">
        <el-col :span="24">
          <el-table v-if="visible" :data="tableData" border class="el-td-border">
            <el-table-column prop="id" label="记录ID" width="80" align="center"></el-table-column>
            <el-table-column label="分类" width="120" align="center">
              <template slot-scope="scope">{{scope.row.type === 1 ? '呼入' : '呼出'}}</template>
            </el-table-column>
            <el-table-column label="客户姓名" align="center" width="150">
              <template slot-scope="scope">
                <label v-if="scope.row.patientName">{{scope.row.patientName}}</label>
                <a
                  v-else
                  :href="$ever.crmIndex + '/crm/page/memberadd' "
                  class="col-red"
                  target="_blank"
                >新用户</a>
              </template>
            </el-table-column>
            <el-table-column prop="calling" label="主叫" align="center" width="180"></el-table-column>
            <el-table-column prop="called" label="被叫" align="center" width="180"></el-table-column>
            <el-table-column prop="createTime" label="通话时间" align="center" width="180"></el-table-column>
            <el-table-column label="通话时长" width="160" align="center">
              <template slot-scope="scope">{{scope.row.duration ? scope.row.duration : 0}} 秒</template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="录音地址" align="center" min-width="180">
              <template slot-scope="scope">
                <span class="col-blue" v-if="scope.row.url && !scope.row.expired">录音已失效</span>
                <a
                  :href="scope.row.url"
                  class="col-blue"
                  target="_blank"
                  v-else-if="scope.row.url"
                >有录音</a>
                <span v-else>无录音</span>
              </template>
            </el-table-column>
            <el-table-column prop="doctorName" label="操作者" align="center" width="120"></el-table-column>
            <el-table-column label="操作" align="center" width="100">
              <template slot-scope="scope">
                <el-button size="small" type="primary" @click="linkDetailPage(scope.row.id)">查看</el-button>
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
    </div>
  </div>
</template>
<script>
import api from '../store/callapi'
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
      allparams: {
        msgType: 110
      }
    }
  },
  methods: {
    changeSeatPage () {
      this.$router.push({ name: 'seat', path: 'seat' })
    },
    linkDetailPage (id) {
      this.$router.push({ name: 'calldetail', path: 'calldetail', query: { id: id } })
    }
  },
  components: {
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
  border-bottom: 1px solid #eee;
  border-radius: 4px 4px 0 0;
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
.pd20 {
  padding: 20px;
}
</style>
