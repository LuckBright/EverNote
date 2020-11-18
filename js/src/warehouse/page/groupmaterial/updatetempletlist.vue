<template>
  <div class="home home-default">
    <div class="home-heading">
      <p class="opt" v-if="tableData.length">共{{totalCount}}项</p>
      <h4>模版更新</h4>
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
          border
          :show-header="false"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="单号"
            width="200">
            <!-- <template slot-scope="scope">
              <span class="blue" @click="$router.push('/storages/entry/entrysee/' + scope.row.id)">{{scope.row.code}}</span>
            </template> -->
          </el-table-column>
          <el-table-column
            prop="createTime"
            align="right"
            label="创建时间">
            <template slot-scope="scope">
              <span v-if="scope.row.createTime" class="light-gray">{{dateFormat(scope.row.createTime)}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import api from './store/busienssapi'
import { FULL_IN_OUT_TYPE, dateFormat } from '@/util/common'
import setName from '@/util/setstatusname'
export default {
  mixins: [setName],
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
      this.api.list({
        offset: 0,
        pagesize: 100
      }).then(res => {
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
    },
    dateFormat
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
