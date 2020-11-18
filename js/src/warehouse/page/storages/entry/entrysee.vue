<template>
  <div>
    <ever-bread-crumb name="入库" showTitle="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>基础信息</h4>
        <ever-form2
          :schema="schema"
          v-model="obj"
          ref="form"
          :span="12"
          :rules="rules"
          :nosubmit="true"
          :class="[objId ? 'readform' : '']">
          <!-- 审核意见 -->
          <template slot="auditOpinion">
            <tooltip-info :content="obj.auditOpinion"></tooltip-info>
          </template>
          <template v-if="objId" slot="code">
            <span>{{obj.code}}</span>
            <span class="status">{{obj.statusName}}</span>
            <span v-if="!obj.code">无</span>
          </template>
          </ever-form2>
        <h4>物资明细</h4>
        <div class="listinfo" v-for="(list, i) in obj.inStockItemList" :key="i">
          <div
            class="invoice"
            v-if="(list.items && list.items.length) || list.invoiceNo == '' || list.invoiceNo"
          >
            <el-form
              size="small"
              :inline="true"
              class="demo-form-inline"
              onsubmit="return false;"
              v-if="obj.type == 10"
            >
              <el-form-item label="当前合计金额：" v-if="obj.type == 10">
                <span class="yellow">¥{{calcTotalPrice(list.item, 'totalPrice') | formatToFinacial(4)}}</span>
              </el-form-item>
            </el-form>
          </div>
          <div class="table">
            <ever-table 
              ref="table"
              border
              :data="hanlderItems"
              :not-select-checkbox="true"
              :span-method="arraySpanMethod"
              :table-default-cell-value="tableDefaultCellValue"
              :columns="tableColumns">
              <template :slot="column.slotName" v-for="column in renderColumns">
                <el-table-column
                  :key="column.prop"
                  :slot="column.prop"
                  :align="column.align"
                  :label="column.label"
                  :width="column.width"
                  :prop="column.prop">
                  <template slot-scope="scope">
                    <in-and-out-functional 
                      :row="scope.row" 
                      v-if="!column.slot"
                      :index="scope.$index" 
                      :render="column.render" 
                      :td-key="column.prop">
                    </in-and-out-functional>
                  </template>
                </el-table-column>
              </template>
            </ever-table>
          </div>
        </div>
      </div>
      <div class="panel-footer" v-if="objId && storageFlag">
        <el-button type="primary" @click="playOutStock(obj.type)">开始入库</el-button>
      </div>
    </div>
    <tips-dialog ref="dialogInvoice" title="删除确认" content="删除发票会连同包含的物资一起删除" :function="confirm"></tips-dialog>
  </div>
</template>

<script>
import api from '../store/enterapi'
import supplierLocalApi from '@/warehouse/store/supplierlocalapi'
import getMaterialInfoApi from '@/warehouse/store/getmaterialinfoapi'
import { floatTool, FULL_STATE, FULL_ORDER_NAME, PACKAGE_CODE, FULL_IN_OUT_TYPE, DRUGTYPE, MATERIALTYPE, SPEC_CODE, patch } from '@/util/common'
import setName from '@/util/setstatusname'
import sysvalue from '@/warehouse/store/sysvalueapi'
import tipsDialog from '@/warehouse/page/components/tipsdialog'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import accessStorageMixins from '@/warehouse/page/storages/mixins/accessstorage.mixins.js' // 出入库审核系列操作
import outAndInMixins from '@/warehouse/page/storages/mixins/outandin.mixins.js'
import storage from '@/util/storage'

let schema = [
  {
    name: 'code',
    label: '入库任务单号',
    comp: 'custom',
    span: 6
  },
  {
    name: 'inStockTypeName',
    label: '入库类型',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'createDate',
    label: '创建时间',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'billCode',
    label: '来源单号',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'storageRoomObject.name',
    label: '收货库房',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'staffName',
    label: '入库人',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'inStockTime',
    label: '入库时间',
    comp: 'readonlyitem',
    span: 6
  }
]
export default {
  mixins: [setName, getstorage, accessStorageMixins, outAndInMixins, storage],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.inStockItemList = [{ invoiceStatus: 0, invoiceNo: '', item: [], items: [] }]
    return {
      schema,
      obj,
      api,
      SPEC_CODE,
      getMaterialInfoApi,
      supplierLocalApi,
      FULL_IN_OUT_TYPE,
      FULL_STATE,
      PACKAGE_CODE,
      FULL_ORDER_NAME,
      DRAFTP: false,
      objId: this.$route.params.id,
      dosageFormArr: [],
      temSupplierLocalId: '',
      isBatch: Number(storage.getStorageByClinic('IS_BATCHPRICE') || ''), // 定价模式
      queryParams: { materialType: '', offset: 0, pagesize: 20, storageRoomId: '' },
      rules: {},
      storageFlag: false,
      currentRows: 0,
      columnIndes: [0, 1, 2],
      schemaList: [], // 缓存的schema
    }
  },
  created () {
    this._info()
    if (this.objId) {
      this.api.getById(this.objId).then(res => {
        if (res.auditerName && !this.schemaList.find(key => { return key.label === '审核人' }) && ['10', '11', '32', '12', '33'].includes(res.type)) {
          this.schemaList.push(...this.examineSchema)
        }
        if (res.type === '32') {
          this.schemaList.splice(4, 0, ...this.staffSchema)
        }
        this.schema = this.schemaList
        res.createDate = res.createTime
        res.inStockTime = res.inDate || ''
        res.statusName = this.setName(FULL_STATE.instock, res.status, true)
        res.typeName = this.setName(FULL_ORDER_NAME.intype, res.type, true)
        res.inStockTypeName = this.setName(FULL_IN_OUT_TYPE.intype, res.type, true)
        res.staffName = res.createByName ? res.createByName : ''
        for (let i = 0; i < res.inStockItemList.length; i++) {
          res.inStockItemList[i].invoiceStatus = Number(res.inStockItemList[i].item[0].invoiceStatus)
          res.inStockItemList[i].items = []
          for (let n = 0; n < res.inStockItemList[i].item.length; n++) {
            for (var j = n + 1; j < res.inStockItemList[i].item.length; j++) {
              if (res.inStockItemList[i].item[n].localMaterialId === res.inStockItemList[i].item[j].localMaterialId) {
                delete res.inStockItemList[i].item[j].unitGroupItemObject
                if (this.materialType === DRUGTYPE) {
                  delete res.inStockItemList[i].item[j].drugObject
                } else if (this.materialType === MATERIALTYPE) {
                  delete res.inStockItemList[i].item[j].consumptiveMaterialObject
                } else {
                  delete res.inStockItemList[i].item[j].equipmentObject
                }
              }
            }
          }
        }
        if (res.storageRoomObject && this.storageId === res.storageRoomObject.id) {
          this.storageFlag = true
        }
        this.obj = Object.assign({}, this.obj, res)
        this.getColumns(res.type, res.status, res.pricingModel)
      })
    }
    sysvalue.listOnce('THC_WH_DRUG_FORM').then(res => {
      if (res) {
        this.dosageFormArr = res
      }
    })
  },
  methods: {
    getColumns (type, status, pricingModel) {
      let column = JSON.parse(JSON.stringify(this.tableListColumn))
      column.map(col => {
        if (type === '15' && col.prop === 'expectNum') {
          col.show = false
        } else if (col.prop === 'expectNum') {
          col.show = true
        }
      })
      this.tableColumns = column.filter(item => {
        if (pricingModel && type !== '15') {
          return item.isBatch
        } else {
          return item.show ||
          (item.status && item.status.includes(`${status}`) && ['14'].includes(type)) ||
          (item.label === '货位号' && this.commoditylocation) ||
          (item.label === '单位' && !this.commoditylocation)
        }
      })
    },
    _info () {
      this.queryParams.materialType = this.materialType
      this.schemaList = JSON.parse(JSON.stringify(this.schema))
    },
    playOutStock (type) {
      type === '10' ? this.$router.push('/storages/entry/entryold/' + this.objId) : this.$router.push('/storages/entry/entryother/' + this.objId)
    },
    handleDeleteInvoice (i) {
      this.currentRows = i
      this.$refs.dialogInvoice.open()
    },
    confirm () {
      this.obj.inStockItemList.splice(this.currentRows, 1)
    },
    calcTotalPrice (data, price) {
      let totalPrice = 0
      for (let i = 0; i < data.length; i++) {
        totalPrice = floatTool.add(data[i][price], totalPrice)
      }
      return !isNaN(totalPrice) ? totalPrice : 0.00
    },
    ...patch
  },
  components: {
    tipsDialog
  }
}
</script>

<style lang="less" scoped>
.status {
  color: red; margin: 0 0 0 10px;
}
</style>

