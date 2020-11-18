<template>
  <div class="layout_inner">
    <div class="main-head">
      <ever-form2 :schema="querySchema" v-model="queryObj" :inline="true" ref="form">
        <template slot="sendTime">
          <el-date-picker v-model="queryObj.sendTime" type="date" placeholder="发送时间"></el-date-picker>
        </template>
        <template slot="receiveClient">
          <el-select v-model="queryObj.receiveClient" placeholder="全部" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
        <template slot="default">
          <el-form-item>
            <el-button @click="list(true)" type="primary" plain>查询</el-button>
          </el-form-item>
          <el-form-item class="fr">
            <el-button @click="createNotice()" type="primary">创建通知</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <el-table
      border
      v-loading.body="loading"
      :data="tableData"
      class="ever-table-wrap"
      style="width: 100%"
    >
      <el-table-column prop label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            @click="handleClick(scope.row)"
            class="btn"
            type="text"
            size="small"
          >{{scope.row.status?'查看':'编辑'}}</el-button>
          <el-button @click="del(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="发送状态" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.status?'已发送':'未发送'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sendTime" label="发送时间" align="center"></el-table-column>
      <el-table-column prop="content" label="发送内容" align="center"></el-table-column>
      <el-table-column prop="receiveClient" label="接收客户端" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.receiveClient?'患者端':'医生端'}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :pagesize="pagesize"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </el-row>
    <notice-detail ref="noticedetail" :api="api" @seachList="list()"></notice-detail>
  </div>
</template>

<script>
import api from '@/titancare/api/notice'
import list from '@/titancare/mixins/list'
import noticeDetail from '../components/notice-detail.vue'

export default {
  mixins: [list],
  data () {
    let querySchema = [
      {
        name: 'sendTime',
        label: '发送时间',
        comp: 'custom'
      },
      {
        name: 'receiveClient',
        label: '接收端',
        comp: 'custom'
      }
    ]
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      api,
      querySchema,
      queryObj,
      tableData: [],
      options: [{ value: 0, label: '医生端' }, { value: 1, label: '患者端' }]
    }
  },
  created () {
    this.list(true)
  },
  methods: {
    handleClick (v) { // 查看或编辑
      this.$refs.noticedetail.dialogVisible = true
      this.$refs.noticedetail.open(v)
    },
    del (v) { // 删除
      this.$confirm('此操作将永久删除该文件, 是否继续?', '删除通知', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.api.deleteNotice({ noticeId: v.id }).then(rs => {
          if (rs && rs.errCode === 0) {
            this.$notify({
              message: '删除成功',
              type: 'success'
            })
            this.list()
          }
        })
      }).catch(() => { })
    },
    createNotice () {
      this.$refs.noticedetail.dialogVisible = true
      this.$refs.noticedetail.open('created')
    },
    seachList () {
      this.list()
    },
    list (refresh) {
      this.loading = true
      if (refresh) {
        this.current = 1
        this.offset = 0
      }
      let params = Object.assign({}, this.queryObj)
      params.offset = this.offset
      params.pagesize = this.pagesize
      if (params.sendTime) params.sendTime = this.$moment(params.sendTime).format('YYYY-MM-DD')
      try {
        this.api.getNoticeList(params).then(rs => {
          this.loading = false
          if (rs.data && rs.data.resultList && rs.data.resultList.length) {
            this.tableData = rs.data.resultList
            this.totalCount = rs.data.totalCount
          } else {
            this.tableData = []
          }
        })
      } catch (err) {
        this.loading = false
      }
    }
  },
  components: {
    noticeDetail
  }
}
</script>
