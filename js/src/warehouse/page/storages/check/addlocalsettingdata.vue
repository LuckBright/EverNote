<template>
  <div class="addbox mt10">
    <div>
      <material-select
        :params="queryParams"
        style="width: 860px; height: 32px"
        ref="remoteselect"
        :needObjFlag="true"
        :apiName="'getStockLocalSettingList'"
        @change="handleSelect">
      </material-select>
    </div>
    <!-- <add-listdata
      v-if="stockContainerList && stockContainerList.length"
      :classifyId="classifyId"
      :dataList="stockContainerList"
      @dataUpdate="selectListData">
    </add-listdata> -->
    <div class="w780">
      <el-table v-if="stockContainerList.length" :data="stockContainerList">
        <el-table-column label="采购入库时间" prop="inDate">
          <template slot-scope="scope">
            <span v-if="scope.row.inDate">{{scope.row.inDate | formatDateByExp('YYYY-MM-DD')}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="生产批号" prop="batchNum"></el-table-column>
        <el-table-column label="系统批号" prop="sysBatchCode"></el-table-column>
        <el-table-column label="生产日期">
          <template slot-scope="scope">
            <span v-if="scope.row.produceDate">{{scope.row.produceDate | formatDateByExp('YYYY-MM-DD')}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="有效期">
          <template slot-scope="scope">
            <span v-if="scope.row.validityDate">{{scope.row.validityDate | formatDateByExp('YYYY-MM-DD')}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="实物数量">
          <template slot-scope="scope">
            <el-input type="number" v-model="scope.row.num"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="mt15">
      <el-button type="primary" :disabled="!stockContainerList || !stockContainerList.length" @click="addThisListData">添加</el-button>
    </div>
    <div class="beCareful">
      {{ inventoryRange === '2' ? '注：按物资盘点单据仅支持添加本次盘点单中收录的物资生产批号，如需添加新的物资请重新创建盘点单。' : '注：全库盘点仅支持添加已存在过入库记录的物资生产批号，新的物资及批次请走正规采购入库流程。'}}
    </div>
  </div>
</template>

<script>
import api from '@/warehouse/store/drugstocktakingapi'
import { debounce } from '@/util/common'
import addListdata from './addlistdata'
import remoteSelect from '../../joinstorage/remoteselect'
import storage from '@/util/storage'
export default {
  props: ['storageRoomId', 'inventoryTakingId', 'inventoryRange', 'patentDataLength'],
  data () {
    return {
      api,
      objss: '',
      stockContainerList: [],
      queryParams: {
        storageRoomId: this.storageRoomId,
        name: '',
        inventoryTakingId: this.inventoryTakingId,
        pricingModel: storage.getLocalStorage('IS_BATCHPRICE'),
        inventoryRange: this.inventoryRange
      },
      pricingModel: storage.getLocalStorage('IS_BATCHPRICE'),
    }
  },
  methods: {
    async handleSelect (v) {
      if (v.localMaterialId) {
        if (!v.inventoryTakingItemList || v.inventoryTakingItemList.length === 0) {
          this.$messageTips(this, 'error', '当前物资没有可以添加的生产批号')
        }
        v.inventoryTakingItemList.forEach(item => {
          item.num = ''
          item.inventoryTakingId = this.inventoryTakingId
        })
        this.stockContainerList = JSON.parse(JSON.stringify(v.inventoryTakingItemList))
      } else {
        this.stockContainerList = []
      }
    },
    addThisListData: debounce(function () {
      if (this.stockContainerList.length) {
        if (this.stockContainerList.filter(item => item.num === '').length) {
          return this.$messageTips(this, 'error', '请输入实物数量')
        }
        // if (this.stockContainerList.some(item => item.num > item.usableNum)) {
        //   return this.$messageTips(this, 'error', '实盘数量不能大于入库数量')
        // }
        let itemList = this.stockContainerList.filter(item => item.num !== '').map((item, index) => {
          item.lineNum = this.patentDataLength + index
          return item
        })
        this.api.addInventoryTakingItem(itemList).then(res => {
          if (!res.length) {
            return this.$messageTips(this, 'error', '当前物资的实物数量不能为0或者为空')
          }
          if (res) {
            this.$emit('addUpdateSuccess', res)
            this.stockContainerList = []
            this.$refs.remoteselect.select = {}
            this.$messageTips(this, 'success', '添加漏盘物资成功')
          }
        })
      } else {
        this.$messageTips(this, 'error', '请先添加物资信息')
      }
    })
  },
  components: {
    remoteSelect,
    addListdata
  }
}
</script>

<style scoped lang="less">
.addbox{
  background: #EEEEEE;
  border-radius: 4px;
  padding: 10px;
  .w780 {
    width: 860px;
  }
}
.beCareful{
  margin-top: 7px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #666666;
}
</style>
