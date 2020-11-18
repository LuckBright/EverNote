<template>
  <div>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>盘点单信息</h4>
        <ever-form2
          class="mt15 checkst"
          :schema="schema"
          v-model="obj"
          :api="api"
          :rules="rules"
          ref="form"
          labelWidth="120px"
          label-position="right">
          <div slot="default"></div>
        </ever-form2>
        <div class="main-option">
          <h4 class="panel-hr">盘点单明细</h4>
        </div>
        <pl-table
          :data="tableData"
          class="w ever-table nomargin"
          :border="true"
          :height="350"
          ref="plTable"
          use-virtual
          :row-height="50">
          <pl-table-column header-align="center" label="物资名称" prop="name">
            <template slot-scope="scope" slot="header">
              <span style="cursor: pointer;" @click="sortChangeName">
                物资名称
                <span class="sortbox">
                  <i class="top iconfont icon-up" :class="{sortactive: params.orderType == 3}"></i>
                  <i class="down iconfont icon-domn" :class="{sortactive: params.orderType == 4}"></i>
                </span>
              </span>
            </template>
            <template slot-scope="scope">
              <material-select
                :params="queryParams"
                ref="remoteselect"
                v-if="obj.inventoryRange === '2' && scope.$index === tableData.length - 1"
                :needObjFlag="true"
                :apiName="'getStockLocalSettingList'"
                @change="handleSelect">
              </material-select>
              <span v-if="obj.inventoryRange === '1' || (obj.inventoryRange !== '1' && scope.$index !== tableData.length - 1)">
                <material-show-name v-if="scope.row.materialName" :materialName="scope.row.materialName" :icons="scope.row.icons"></material-show-name>
              </span>
            </template>
          </pl-table-column>
          <pl-table-column
            align="center"
            prop="spec"
            width="90"
            label="规格">
            <template slot-scope="scope">
              <span v-if="scope.row.spec">{{scope.row.spec}}</span>
            </template>
          </pl-table-column>
          <pl-table-column
            width="90"
            align="center"
            label="包装单位">
            <template slot-scope="scope">
              <span>
                {{!CHINESE_MEDICINE_TYPE.includes(scope.row.materialType) ? scope.row.unitName : '-'}}
              </span>
            </template>
          </pl-table-column>
          <pl-table-column
            align="center"
            width="100"
            prop="containerCode">
            <template slot-scope="scope" slot="header">
              <span style="cursor: pointer;" @click="sortChangeContainer">
                货位号
                <span class="sortbox">
                  <i class="top iconfont icon-up" :class="{sortactive: params.orderType == 1}"></i>
                  <i class="down iconfont icon-domn" :class="{sortactive: params.orderType == 2}"></i>
                </span>
              </span>
            </template>
            <template slot-scope="scope">
              <span v-html="scope.row.containerCodes ? scope.row.containerCodes.join('<br>') : '-'"></span>
            </template>
          </pl-table-column>
          <pl-table-column
            align="center"
            label="生产批号"
            width="120"
            prop="batchNum">
          </pl-table-column>
          <pl-table-column
            v-if="pricingModel"
            align="center"
            label="系统批号"
            width="150"
            prop="sysBatchCode">
          </pl-table-column>
          <pl-table-column
            align="center"
            label="有效期"
            width="160"
            prop="validityDate">
            <template slot-scope="scope">
              <span v-if="scope.row.validityDate">{{scope.row.validityDate | formatDateByExp('YYYY-MM-DD')}}</span>
              <span v-else>-</span>
            </template>
          </pl-table-column>
          <pl-table-column
            v-if="pricingModel"
            align="right"
            label="采购单价"
            width="100"
            prop="price">
          </pl-table-column>
          <pl-table-column
            v-if="pricingModel"
            align="right"
            label="销售价"
            width="100"
            prop="salePrice">
          </pl-table-column>
          <pl-table-column
            v-if="pricingModel"
            align="right"
            label="批次可用数量"
            width="120"
            prop="usableNum">
          </pl-table-column>
          <pl-table-column
            width="100"
            align="right"
            label="账面数量">
            <template slot-scope="scope">
              {{scope.row.stockNum}}
            </template>
          </pl-table-column>
          <pl-table-column width="150" align="center" label="操作">
            <template slot-scope="scope">
              <i v-if="scope.row.localMaterialId" class="iconfont icon-bingli-shanchu cRed" @click="deleteLocalDdata(scope.row, scope.$index)"></i>
            </template>
          </pl-table-column>
        </pl-table>
        <el-row type="flex" justify="end">
          <div style="flex: 1" class="mt20">
            <el-button type="primary" :disabled="!tableData.length" @click="submitForm('form')">生成盘点</el-button>
          </div>
        </el-row>
      </div>
    </div>
    <loading-cover :loading="loading">
      <h2 slot="title">盘点单系统生成中</h2>
    </loading-cover>
  </div>
</template>
<script>
import api from '@/warehouse/store/drugstocktakingapi'
import { STOCKSTATUS, STOCKRESULT, SPU_SPEC_CODE, debounce, floatTool, PACKAGE_CODE, patch, SPEC_CODE, PRODUCER, INVENTORY_RANGE, CHINESE_MEDICINE_TYPE, CONSUMABLES_TYPE } from '@/util/common'
import sets from '@/util/setstatusname'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import remoteSelect from '../../joinstorage/remoteselect'
import loadingCover from '@/warehouse/page/components/procurement/loadingcover'
import { REMOTE_METHODS_PLACEHOLDER } from '@/warehouse/views/util/constant'
import { PlTable, PlTableColumn } from 'pl-table'
import storage from '@/util/storage'

var schema = [
  {
    name: 'inventoryRange',
    label: '盘点范围',
    comp: 'sys-select',
    props: {
      clearable: false,
      firstDefault: true,
      options: INVENTORY_RANGE
    },
    span: 6
  },
  {
    name: 'checkTime',
    label: '',
    comp: 'custom',
    span: 18
  },
  {
    name: 'description',
    label: '说明',
    comp: 'textarea',
    span: 24
  }
]

export default {
  mixins: [sets, getstorage, storage],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.checkUser = ''
    return {
      PRODUCER,
      schema,
      inventoryResults: false,
      loading: false,
      obj: obj,
      loadingGif: 'static/assets/Loading-120.gif',
      api,
      SPEC_CODE,
      CHINESE_MEDICINE_TYPE,
      SPU_SPEC_CODE,
      PACKAGE_CODE,
      STOCKSTATUS,
      STOCKRESULT,
      tableData: [],
      typeArr: [],
      queryParams: { storageRoomId: '', name: '', pricingModel: Number(storage.getLocalStorage('IS_BATCHPRICE') || 0) },
      params: { 'materialType': '', orderType: 3 },
      offset: 0,
      pagesize: 9999,
      totalCount: 0,
      rules: {},
      floatTool,
      REMOTE_METHODS_PLACEHOLDER,
      submitData: false,
      pricingModel: Number(storage.getLocalStorage('IS_BATCHPRICE') || 0),
      tableLoading: false,
      inventoryRangeArr: [],
      addTableListArr: [],
      deleteTableList: [],
      CONSUMABLES_TYPE,
      countTableData: [],
      thisIndexTableData: 0,
      scrollSwitch: true,
      scrollDirection: ''
    }
  },
  methods: {
    ...patch,
    getByName (row) { // 根据物资类型处理物资名字
      if (CONSUMABLES_TYPE.includes(row.classifyId)) { // 是耗材
        return `${row.name ? `${row.name}` : row.byName}`
      } else {
        return `${row.byName}${row.name ? `${`（${row.name}）`}` : ''}`
      }
    },
    sortChangeName () {
      if (this.params.orderType === 3) {
        this.params.orderType = 4
      } else {
        this.params.orderType = 3
      }
      this.materialSortTableData(this.params.orderType)
    },
    sortChangeContainer () {
      if (this.params.orderType === 1) {
        this.params.orderType = 2
      } else {
        this.params.orderType = 1
      }
      this.materialSortTableData(this.params.orderType)
    },
    materialSortTableData (order) {
      let _this = this
      let thisTableData = JSON.parse(JSON.stringify(this.tableData))
      let lastObject = this.obj.inventoryRange === '2' ? thisTableData.pop() : null
      thisTableData.sort(function (a, b) {
        return _this.arrayCustomSort(a, b, order)
      })
      lastObject && thisTableData.push(lastObject)
      this.tableData = JSON.parse(JSON.stringify(thisTableData))
    },
    arrayCustomSort (item1, item2, order) {
      let cps = []
      if (order === 1 || order === 2) {
        cps.push(this.handleIfSort(item1, item2, order, 'containerCode', 2))
      } else {
        cps.push(this.handleIfSort(item1, item2, order, 'name', order))
      }
      for (var j = 0; j < cps.length; j++) {
        if (cps[j] === 1 || cps[j] === -1) {
          return cps[j]
        }
      }
      return false
    },
    handleIfSort (item1, item2, order, name, num) {
      if (!item1[name]) {
        return order === num ? -1 : 1
      } else {
        if (!item2[name]) {
          return order === num ? 1 : -1
        } else {
          if (item1[name] > item2[name]) {
            return order === num ? 1 : -1
          } else {
            return order === num ? -1 : 1
          }
        }
      }
    },
    // 删除当前行数据
    deleteLocalDdata (data, index) {
      this.deleteTableList.push(data)
      this.tableData.splice(index, 1)
    },
    handleSelect (v) {
      if (v) {
        if (!v.inventoryTakingItemList || !v.inventoryTakingItemList.length) {
          this.$set(this.tableData, this.tableData.length - 1, { iName: '' })
          return this.everWarning('该物资没有可以添加的批号')
        }
        let objectInfo = JSON.parse(JSON.stringify(v))
        delete objectInfo.inventoryTakingItemList
        this.tableData.splice(this.tableData.length - 1, 1)
        let newArr = this.tableData.filter(item => item.localMaterialId !== v.localMaterialId)
        v.inventoryTakingItemList.forEach(item => {
          let {batchNum, stockNum, containerCodes, unit, validityDate, produceDate, price, salePrice, sysBatchCode, sysBatchId, usableNum} = item
          newArr.push(Object.assign({}, objectInfo, {batchNum, containerCodes, stockNum, unit, validityDate, produceDate, price, salePrice, sysBatchCode, sysBatchId, usableNum}))
        })
        this.tableData = newArr
        this.tableData.push({ iName: '' })
      } else {
        this.$set(this.tableData, this.tableData.length - 1, { iName: '' })
        this.addTableListArr = []
      }
      this.$nextTick(() => {
        this.$refs.plTable.scrollBottom()
      })
    },
    getDrugList (refresh) {
      this.tableLoading = true
      let params = Object.assign({}, this.params, { 'storageRoomId': this.storageId })
      if (refresh) {
        this.offset = 0
      }
      for (let key in params) {
        if (params[key] === '') {
          delete params[key]
        }
      }
      params.offset = this.offset
      params.pagesize = this.pagesize
      params.pricingModel = this.pricingModel
      this.queryPageList(params).then(result => {
        let arr = []
        if (this.obj.inventoryRange === '1') {
          result.list && result.list.forEach(item => {
            let isCheck = false
            isCheck = this.deleteTableList.some(child => {
              return child.localMaterialId === item.localMaterialId && child.batchNum === item.batchNum
            })
            if (!isCheck) arr.push(item)
          })
        }
        this.tableData = arr
        this.totalCount = result.totalCount
        this.$nextTick(_ => {
          this.tableLoading = false
        })
      })
    },
    queryPageList (params) {
      return this.api.materialList(params).then(result => {
        return result
      })
    },
    submitForm: debounce(function () {
      if (!this.objId) {
        if ((this.obj.inventoryMethod === 'partialInventory' && this.tableData.length <= 1) || (this.obj.inventoryMethod !== 'partialInventory' && this.tableData.length === 0)) {
          this.$notify({
            title: '提示',
            type: 'warning',
            message: '明细列表不能为空,请添加明细信息'
          })
          return false
        }
      }
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.obj))
          params.storageRoomId = this.storageId
          params.items = this.tableData.filter(item => item.localMaterialId).map(item => {
            const {localMaterialId, num, stockNum, unit, batchNum, price, salePrice, sysBatchCode, sysBatchId, usableNum, validityDate, produceDate} = item
            return {localMaterialId, num, stockNum, unit, batchNum, price, salePrice, sysBatchCode, sysBatchId, usableNum, validityDate, produceDate}
          })
          params.pricingModel = this.pricingModel
          this.api.judgeIsExistInOutStock({storageRoomId: params.storageRoomId, items: params.items.map(dl => dl.localMaterialId)}).then(res => {
            if (res) {
              this.$confirm('系统中存在未处理完成的单据，是否继续盘点？', '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning'
              }).then(() => {
                this.loading = true
                this.api.createOrUpdate(params, this.isWarehouse).then(result => {
                  if (result) {
                    this.loading = false
                    this.$router.replace(`/storages/check/checkstocktaking/${result.id}/${result.status}`)
                  }
                })
              }).catch(() => {

              })
            } else {
              this.loading = true
              this.api.createOrUpdate(params, this.isWarehouse).then(result => {
                if (result) {
                  this.loading = false
                  this.$router.replace(`/storages/check/checkstocktaking/${result.id}/${result.status}`)
                }
              })
            }
          })
        }
      })
    }),
    queryAllDrug () {
      this.tableData = []
      this.totalCount = 0
      this.getDrugList()
    }
  },
  created () {
    this.deleteTableList = []
    this.queryParams.storageRoomId = this.storageId
    this.params.materialType = this.obj.materialType = this.materialType
    this.obj.storageRoomId = this.storageId
  },
  watch: {
    'obj.inventoryRange' (v) {
      this.deleteTableList = []
      if (v === '1') {
        this.num = ''
        this.totalCount = 0
        this.obj.inventoryMethod = 'allInventory'
        this.queryAllDrug()
      } else {
        this.countTableData = []
        this.tableData = [{ iName: '' }]
        this.totalCount = 0
        this.obj.inventoryMethod = 'partialInventory'
      }
    }
  },
  components: {
    remoteSelect,
    PlTable,
    PlTableColumn,
    loadingCover
  }
}
</script>
<style lang="scss" scoped>
.main-option {
  line-height: 36px;
  height: 36px;
}
.main-option h4 {
  margin: 0;
  float: left;
  line-height: 20px;
  height: 20px;
}
.download_export {
  margin-right: 10px;
}
.upload-demo {
  display: inline-block;
}
.checkList {
  position: absolute;
  left: 0;
}
h4 {
  padding: 0;
  padding-left: 10px;
  margin: 0;
  border-left: 3px solid #1c7bef;
  line-height: 18px;
}
.scrollul{
  margin: 0;
  padding-left: 0;
  overflow: scroll;
  height: 300px;
  border: 1px solid #ccc;
  border-top: 0;
}
.noscroll{
  overflow: hidden;
  height: auto;
}
.notabledata{
  margin: 0;
  /deep/ .el-table__body-wrapper{
    display: none
  }
}
.nodata{
  text-align: center;
  font-size: 14px;
  color: #666;
  line-height: 298px;
  border:1px solid #ccc;
  border-bottom: 0;
  border-top: 0;
}
.scrollloading{
  text-align: center;
  border: 1px solid #ccc;
  border-bottom: 0;
  border-top: 0;
  height: 258px;
  padding-top: 40px;
}
.nomargin {
  margin: 0;
  border-top: 0;
  /deep/ .el-table{
    margin: 0;
  }
}
</style>
