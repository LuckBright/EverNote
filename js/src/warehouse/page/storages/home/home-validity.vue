<template>
  <div class="home home-default">
    <div class="home-heading">
      <p class="opt" v-if="tableData.length">共{{totalCount}}项</p>
      <h4>效期预警</h4>
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
          :show-header="false">
          <el-table-column
            label="名称">
            <template slot-scope="scope">
              <material-show-name
                v-if="scope.row.materialName"
                :materialName="scope.row.materialName"
                :icons="scope.row.icons">
              </material-show-name>
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            label="规格">
            <template slot-scope="scope">
              {{scope.row.spec || '-'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            align="right"
            width="130"
            label="创建时间">
            <template slot-scope="scope">
              <span v-if="scope.row.validitySign" class="light-gray">{{_setTIMEName(scope.row.validitySign)}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/warehouse/page/storages/store/validityapi'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import { FULL_IN_OUT_TYPE, dateFormat, SPEC_CODE, patch } from '@/util/common'
import list from '@/util/list'
import setName from '@/util/setstatusname'

const TIME = [{
  id: 1,
  name: '有效期<30天'
},
{
  id: 2,
  name: '有效期<90天'
},
{
  id: 3,
  name: '有效期<180天'
},
{
  id: 4,
  name: '有效期>=180天'
},
{
  id: 5,
  name: '已过期'
},
{
  id: 6,
  name: '全部'
}]
export default {
  mixins: [getstorage, list, setName],
  data () {
    return {
      api,
      SPEC_CODE,
      TIME,
      FULL_IN_OUT_TYPE,
      listParams: { status: 10, validitySign: 3 },
      listApiName: 'warninglist'
    }
  },
  methods: {
    _setTIMEName (id) {
      for (let i = 0; i < this.TIME.length; i++) {
        if (this.TIME[i].id === id) {
          return this.TIME[i].name
        }
      }
      return ''
    },
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
