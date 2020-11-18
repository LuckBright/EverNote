<template>
  <div class="layout_inner">
    <div class="main-head">
      <ever-form2
        :schema="querySchema"
        v-model="queryObj"
        :inline="true"
        :is-query="true"
        @query="list()">
        <template slot="default">
          <el-button type="primary" size="small" @click="handlerQuery">查询</el-button>
          <el-button type="primary" class="fr" size="small" @click="$router.push(`/storages/business/${isBatch ? 'splitaddbatch' : 'splitadd'}`)">新增拆零</el-button>
        </template>
      </ever-form2>
    </div>
    <el-table v-loading.body="loading" :data="tableData" style="width: 100%" border>
      <el-table-column label="拆零单号" width="200">
        <template slot-scope="scope">
          <span
            class="blue"
            @click="handlerSplit(scope.row)"
          >{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="序号" prop="printCode"  width="100" v-if="printCodeSetting === 1"></el-table-column>
      <el-table-column label="拆零商品">
        <template
          v-if="scope.row.splitNumberItemList[0].beforeObject"
          slot-scope="scope">
          <material-show-name
            v-if="scope.row.splitNumberItemList[0].beforeObject.materialName"
            :materialName="scope.row.splitNumberItemList[0].beforeObject.materialName"
            :icons="scope.row.icons">
          </material-show-name>
        </template>
      </el-table-column>
      <el-table-column width="200" label="包装规格">
        <template
          slot-scope="scope">
          <span>{{scope.row.splitNumberItemList[0].beforeObject.spec || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" align="right" label="拆零数量">
        <template slot-scope="scope">
          <span v-if="scope.row.splitNumberItemList[0].numBefore">
            {{concatSplitNum(scope.row.splitNumberItemList)}}
            {{scope.row.splitNumberItemList[0].beforeObject.unitName}}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column width="120" label="创建人">
        <template slot-scope="scope">
          <span v-if="scope.row.updatedBy">{{scope.row.updatedBy}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" width="160" label="创建时间"></el-table-column>
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
  </div>
</template>
<script>
import api from '../store/splitapi'
import list from '@/util/list'
import sets from '@/util/setstatusname'
import { FULL_STATE, patch, SPEC_CODE, PACKAGE_CODE, floatTool } from '@/util/common'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import { REMOTE_METHODS_WIDTH } from '@/warehouse/views/util/constant'
import storage from '@/util/storage'
import printCodeSettingMixmins from '@/warehouse/page/storages/mixins/printCodeSetting.mixins.js'

let querySchema = [
  {
    name: 'localMaterialId',
    label: '商品名称',
    comp: 'material-select',
    props: {
      params: { materialType: '', filterOverdueRecord: true },
    },
    style: REMOTE_METHODS_WIDTH,
  },
  {
    label: '拆零单号',
    name: 'code'
  },
  {
    label: '序号',
    name: 'printCode',
    style: {
      width: '100px'
    }
  },
]

export default {
  mixins: [list, sets, getstorage, storage, printCodeSettingMixmins],
  data () {
    var obj = this.$ever.createObjFromSchema(querySchema)
    return {
      api,
      SPEC_CODE,
      PACKAGE_CODE,
      querySchema,
      queryObj: obj,
      FULL_STATE,
      isBatch: Number(storage.getStorageByClinic('IS_BATCHPRICE') || ''), // 定价模式
    }
  },
  methods: {
    concatSplitNum (list) {
      return list.reduce((cur, pre) => {
        return floatTool.add(cur, pre.numBefore)
      }, 0)
    },
    handlerSplit (row) {
      const { pricingModel, id } = row
      this.$router.push(`/storages/business/${pricingModel === 1 ? 'splitabatchinfo' : 'splitsee'}/` + id)
    },
    handlerQuery () {
      this.query(this.queryObj)
    },
    _info () {
      this.querySchema[0].props.params.materialType = this.materialType
      this.querySchema[0].props.params.storageRoomId = this.storageId
      this.queryObj.storageRoomId = this.storageId
      this.queryObj.materialType = this.materialType
    },
    ...patch
  },
  created () {
    this.querySchema = this.createdSchema(this.querySchema)
    this._info()
  },
  watch: {
    'queryObj.code': {
      handler (v) {
        this.query(this.queryObj)
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
.layout_inner {
  border: none;
  border-radius: 0;
}

.main-option h4 {
  margin: 0;
  float: left;
  line-height: 36px;
}
</style>
