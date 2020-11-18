<template>
  <div class="home home-default">
    <div class="home-heading">
      <p class="opt" v-if="tableData.length">共{{totalCount}}项</p>
      <h4>待我审核的</h4>
    </div>
    <div class="home-body taskWar">
      <div class="noCnt" v-if="loading">
        <div class="c">
          <i class="el-icon-loading"></i>
          加载中
        </div>
      </div>
      <div class="noCnt" v-if="emptyData">
        <everNoData tipTxt="暂无审核内容"></everNoData>
      </div>
      <div class="table" v-if="tableData[0]">
        <el-table
          :data="tableData"
          height="240"
          class="no-border tr-height-40"
          :show-header="false"
          style="width: 100%">
          <el-table-column
            prop=""
            label="单号"
            width="300">
            <template slot-scope="scope">
              <span class="blue" @click="open(scope.row.taskId, scope.row.variables.eventStatus, scope.row.variables.formUrl)">{{scope.row.variables.businessCode}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="类型">
            <template slot-scope="scope">
              <span>{{scope.row.processName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            align="right"
            label="创建时间">
            <template slot-scope="scope">
              <span v-if="scope.row.createTime" class="light-gray">{{scope.row.createTime | formatDateByExp('YYYY-MM-DD HH:mm:ss')}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../store/storagesapi'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import { FULL_IN_OUT_TYPE } from '@/util/common'
export default {
  mixins: [getstorage],
  data () {
    return {
      api,
      tableData: [],
      emptyData: false,
      loading: false,
      FULL_IN_OUT_TYPE,
      listParams: { status: 10 }
    }
  },
  created () {
    try {
      this.loading = true
      this.api.getTaskList().then(res => {
        this.loading = false
        if (res.list && res.list.length > 0) {
          this.tableData = res.list
          this.totalCount = res.totalCount
          return false
        }
        this.tableData = []
        this.totalCount = 0
        this.emptyData = true
      })
    } catch (err) {
      this.loading = false
      this.emptyData = false
    }
  },
  methods: {
    open (id, status, url) {
      if (status === 'RESTART') {
        // url = url.replace('/999', '')
        if (url.split('/')[2] === 'storages') {
          let storagesUrl = url.split('/')
          storagesUrl.splice(1, 1)
          url = storagesUrl.join('/')
        }
        window.location.href = this.$ever.warehouseIndex + url + '?taskId=' + id
        return false
      }
      window.open(this.$ever.warehouseIndex + '/goods/approval' + '?taskId=' + id)
    }
  }
}
</script>
<style lang="scss" scoped>
.noCnt{height:100%;text-align:center;
  -webkit-box-pack: center;
  -webkit-box-align: center;
  -webkit-box-orient: vertical;
}
.taskWar{
  height: 260px;overflow-y: auto;overflow-x: hidden;
}
</style>
