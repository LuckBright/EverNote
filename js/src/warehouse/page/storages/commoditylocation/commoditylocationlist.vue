<template>
  <div>
    <div class="layout_inner">
      <div class="main-head pos_re">
        <ever-form2
          :schema="querySchema"
          v-model="queryObj"
          ref="form"
          :inline="true"
          :is-query="true"
          @query="list(queryObj)"
        ></ever-form2>
        <div class="pos_ab head-btn-right">
          <el-button
            type="primary"
            size="small"
            @click="$router.push('/storages/commoditymanage/commoditylocationadd')"
          >创建货位</el-button>
        </div>
      </div>
      <el-table v-loading.body="loading" :data="tableData" style="width: 100%">
        <el-table-column prop label width="10"></el-table-column>
        <el-table-column prop="code" label="货位编号" width="200"></el-table-column>
        <el-table-column prop label="商品名称">
          <template slot-scope="scope">
            <div v-if="scope.row.itemList && scope.row.itemList.length">
              <div v-for="(item, i) of scope.row.itemList" :key="i">
                <material-show-name 
                  v-if="item.materialName" 
                  :materialName="item.materialName" 
                  :icons="item.icons">
                </material-show-name>
              </div>
              <!-- 货位数据非ext数据，暂时无法展示物资icon图片 -->
              <!-- <ever-specialIcons v-if="scope.row.itemList" :iconsData="scope.row.itemList"></ever-specialIcons> -->
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop label="规格" width="120" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.itemList && scope.row.itemList.length">
              <div v-for="(item, i) of scope.row.itemList" :key="i">
                {{item.spec || '-'}}
              </div>
              <!-- 货位数据非ext数据，暂时无法展示物资icon图片 -->
              <!-- <ever-specialIcons v-if="scope.row.itemList" :iconsData="scope.row.itemList"></ever-specialIcons> -->
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" width="240" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="$router.push('/storages/commoditymanage/commoditylocation/' + scope.row.id)"
            >编辑</el-button>
            <el-button type="danger" size="small" @click="handleCancle(scope.row)">删除</el-button>
            <!-- <el-button type="info" size="small" @click="">打印</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <tip-dialog title="操作提示" content="确定删除该货位？" ref="dialog" :function="submitCancel"></tip-dialog>
  </div>
</template>
<script>
import api from '@/warehouse/page/storages/store/commoditylocationapi'
import list from '@/util/list'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import tipDialog from '@/warehouse/page/components/tipsdialog'
import { debounce } from '@/util/common'
let querySchema = [
  {
    name: 'code',
    label: '货位编号',
    comp: 'sys-text',
    props: {
      placeholder: '货位编号',
      clearable: true
    }
  },
  {
    name: 'localMaterialId',
    label: '商品名称',
    comp: 'material-select',
    props: {
      params: { filterOverdueRecord: true }
    },
    style: 'width:350px;'
  }
]
export default {
  mixins: [list, getstorage],
  data () {
    var obj = this.$ever.createObjFromSchema(querySchema)
    return {
      api,
      querySchema,
      queryObj: obj,
      pagesize: 10000
    }
  },
  created () {
    this._info()
  },
  methods: {
    handleCancle (data) {
      this.delObj = data
      this.$refs.dialog.open()
    },
    submitCancel: debounce(function () {
      api.createOrUpdate(Object.assign({}, this.delObj, { isDelete: 1 })).then(res => {
        if (res && res.flag) this.list()
      })
    }),
    _info () {
      this.queryObj.storageRoomId = this.storageId
      this.queryObj.materialType = this.materialType
    }
  },
  components: {
    tipDialog
  }
}
</script>
<style lang="less" scoped>
</style>
