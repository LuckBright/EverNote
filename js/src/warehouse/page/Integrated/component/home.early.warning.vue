<template>
  <div id="workToday" class="home home-default">
    <div class="home-heading">
      <p class="opt" v-if="tableData.length">共{{tableData.length}}项</p>
      <h4>证照预警</h4>
    </div>
    <div class="home-body taskWar">
      <div class="noCnt" v-if="!tableData[0]">
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
            prop="name"
            label="供应商"
            width="300">
          </el-table-column>
          <el-table-column
            prop=""
            label="类型">
            <template slot-scope="scope">
              <span>{{scope.row.licenceFlag ? '许可证有效期' : '营业有效期'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            align="right"
            label="有效期">
            <template slot-scope="scope">
              {{type[scope.row.licenceFlag] || type[scope.row.operatingDateFlag]}}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/warehouse/page/Integrated/api/integratedapi.js'
import list from '@/util/list'
const type = { 1: '有效', 2: '过期', 3: '临近有效期' }

export default {
  mixins: [list],
  data () {
    return {
      api,
      type,
      tableData: [],
    }
  },
}
</script>

<style lang="scss" scoped>
  .taskWar {
    height: 260px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .noCnt{height:100%;text-align:center;
    -webkit-box-pack: center;
    -webkit-box-align: center;
    -webkit-box-orient: vertical;
  }
</style>
