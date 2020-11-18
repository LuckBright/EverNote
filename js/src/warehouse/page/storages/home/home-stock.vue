<template>
  <div class="home home-default">
    <div class="home-heading">
      <p class="opt" v-if="tableData.length">共{{totalCount}}项&nbsp;&nbsp;&nbsp;&nbsp;建议补货数量</p>
      <h4>库存预警</h4>
    </div>
    <div class="home-body taskWar">
      <div class="noCnt" v-if="loading">
        <div class="c">
          <i class="el-icon-loading"></i>
          加载中
        </div>
      </div>
      <div class="noCnt" v-if="emptyData">
        <everNoData tipTxt="暂无预警内容"></everNoData>
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
            label="">
            <template slot-scope="scope">
              <material-show-name
                v-if="scope.row.materialName"
                :materialName="scope.row.materialName"
                :icons="scope.row.icons">
              </material-show-name>
            </template>
          </el-table-column>
          <el-table-column width="100">
            <template slot-scope="scope">
              {{scope.row.spec || '-'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="supplyingNum"
            width="130"
            align="right"
            label="建议补货数量">
            <template slot-scope="scope">
              <span class="pr20 inline-block" v-if="(scope.row.safeNum || scope.row.safeNum == 0) && (scope.row.usableNum || scope.row.usableNum == 0)">{{floatTool.add(floatTool.subtract(scope.row.safeNum, scope.row.usableNum), scope.row.supplyingNum) >= 0 ? floatTool.add(floatTool.subtract(scope.row.safeNum, scope.row.usableNum), scope.row.supplyingNum) : '-'}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
// <script>
import api from '@/warehouse/page/storages/store/storagealertedapi'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import { FULL_IN_OUT_TYPE, dateFormat, floatTool, SPEC_CODE, patch } from '@/util/common'
import list from '@/util/list'
import setName from '@/util/setstatusname'
export default {
  mixins: [getstorage, setName, list],
  data () {
    return {
      api,
      SPEC_CODE,
      floatTool,
      loading: false,
      tableData: [],
      FULL_IN_OUT_TYPE,
      listParams: { status: 10 }
    }
  },
  methods: {
    dateFormat,
    ...patch
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
