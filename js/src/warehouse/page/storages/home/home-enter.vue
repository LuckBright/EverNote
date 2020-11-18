<template>
  <div class="home home-default">
    <div class="home-heading">
      <p class="opt" v-if="tableData.length">共{{totalCount}}项</p>
      <h4>待入库的任务</h4>
    </div>
    <div class="home-body taskWar">
      <div class="noCnt" v-if="loading">
        <div class="c">
          <i class="el-icon-loading"></i>
          加载中
        </div>
      </div>
      <div class="noCnt" v-if="emptyData">
        <everNoData tipTxt="暂无入库任务"></everNoData>
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
              <span class="blue" @click="routerLink(scope.row)">{{scope.row.code}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="类型">
            <template slot-scope="scope">
              <span>{{setName(FULL_IN_OUT_TYPE.intype, scope.row.type, true)}}</span>
            </template>
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
import api from '@/warehouse/page/storages/store/enterapi'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import { FULL_IN_OUT_TYPE, dateFormat } from '@/util/common'
import list from '@/util/list'
import setName from '@/util/setstatusname'
export default {
  mixins: [getstorage, list, setName],
  data () {
    return {
      api,
      FULL_IN_OUT_TYPE,
      listParams: { statusList: [9, 10, 13, 100] }
    }
  },
  methods: {
    dateFormat,
    routerLink (data) {
      if (data.type === '10') {
        if (data.status === 9) {
          this.$router.push(`/storages/entry/entryadd/${data.id}`)
        } else if (data.status === 10) {
          if (data.isStaging) {
            this.$router.push(`/storages/entry/purchaseentry/${data.id}`)
          } else {
            this.$router.push(`/storages/entry/purchasesee/${data.id}`)
          }
        } else {
          this.$router.push(`/storages/entry/purchaseentry/${data.id}`)
        }
      } else {
        if (data.status === 10) {
          this.$router.push(`/storages/entry/entrysee/${data.id}`)
        } else if (data.status === 13) {
          this.$router.push(`/storages/entry/entryother/${data.id}`)
        } else {
          this.$router.push(`/storages/entry/entryedit/${data.id}?look=${data.id}`)
        }
      }
    },
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
