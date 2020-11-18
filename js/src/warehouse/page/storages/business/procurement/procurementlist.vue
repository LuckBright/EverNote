<template>
  <div>
    <div class="layout_inner">
      <div class="main-head">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query">
        </ever-query-form>
      </div>
      <procurement-list :loading="loading" :tableData="tableData" path="/storages/business/procurement/procurementdetail/"></procurement-list>
      <el-row type="flex" justify="end">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pagesize="pagesize"
          :totalCount="totalCount" :current="current">
        </ever-pagination>
      </el-row>
    </div>
  </div>
</template>

<script>
import api from '../../store/procurementapi'
import getMaterialInfoApi from '@/warehouse/store/getmaterialinfoapi'
import list from '@/util/list'
import sets from '@/util/setstatusname'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import procurementList from '@/warehouse/page/components/procurement/procurementlist'
import { REMOTE_METHODS_PLACEHOLDER, REMOTE_METHODS_WIDTH } from '@/warehouse/views/util/constant'

let querySchema = [
  {
    name: 'localMaterialId',
    label: '商品名称',
    placeholder: REMOTE_METHODS_PLACEHOLDER,
    type: 'remotemethod',
    api: getMaterialInfoApi,
    params: { materialType: '' },
    showKeys: ['byname', 'spec', 'type', 'dosageForm'],
    showName: '',
    apiName: 'listlocal',
    style: REMOTE_METHODS_WIDTH,
  }
]

export default {
  mixins: [list, sets, getstorage],
  data () {
    var obj = this.$ever.createObjFromSchema(querySchema)
    return {
      api,
      querySchema,
      queryObj: obj
    }
  },
  created () {
    this._info()
  },
  methods: {
    _info (refresh) {
      this.querySchema[0].params.materialType = this.materialType
      this.querySchema[0].params.storageRoomId = this.storageId
      this.querySchema[0].showName = this.SHOWNAME
      this.queryObj.storageRoomId = this.storageId
      this.queryObj.materialType = this.materialType
      if (refresh) this.queryObj.localMaterialId = ''
    }
  },
  components: {
    procurementList
  }
}
</script>

<style lang="scss" scoped>
  .layout_inner {border: none; border-radius: 0}
  .main-option h4 { margin: 0;float: left; line-height: 36px; }
</style>
