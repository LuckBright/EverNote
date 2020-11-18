<template>
  <div>
    <ever-bread-crumb name="入库" showTitle="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <div class="hr">
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
          <template slot="code">
            <span>{{obj.code}}</span>
            <span class="status">{{obj.statusName}}</span>
            <span v-if="!obj.code">无</span>
          </template>
        </ever-form2>
        </div>
        <h4>物资明细</h4>
        <div class="listinfo" v-for="(list, i) in obj.inStockItemList" :key="i">
          <div class="table" id="table_expand">
            <ever-table
            ref="table"
            border
            :data="hanlderItems"
            :not-select-checkbox="true"
            :table-default-cell-value="tableDefaultCellValue"
            :span-method="arraySpanMethod"
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
                  <div v-if="column.slotName === 'inNum'">
                    <div class="quantity_input" v-if="!$route.query.look">
                    <el-input
                      placeholder="入库数量"
                      v-model="scope.row.num"
                      type="number"
                      @input="handleDiversityNum(scope.row, scope.$index)"
                      @blur="handleCalcInboundNum(scope.row, scope.$index, i)"
                      clearable>
                    </el-input>
                    </div>
                    <span v-if="$route.query.look">
                      <span v-if="scope.row.num">
                        {{scope.row.num}}{{scope.row.packagUnitName}}
                      </span>
                      <span v-else>-</span>
                    </span>
                  </div>
                </template>
              </el-table-column>
            </template>
          </ever-table>
          </div>
        </div>
      </div>
      <!-- 按钮组 -->
      <div class="panel-footer" v-if="objId && storageFlag">
        <div class="addProduct" v-if="!$route.query.look">
          <add-product :orderType="true" :clear="clear" :queryParams="queryParams" :flag="queryParams.supplierLocalId" :list="obj.inStockItemList" :id="obj.id" @saveObject="handleSaveAfterObj"></add-product>
        </div>
        <el-button
          v-if="examine && ['13', '10'].includes(`${obj.status}`)"
          type="primary"
          @click="submitForm('form', 100)"
          :loading="unRepeatedBtn">
          提交
        </el-button>
        <el-button
          v-if="!examine && obj.status !== 11"
          type="primary" @click="submitForm('form', 11)"
          :loading="unRepeatedBtn">入库完成</el-button>
          <el-button
          type="primary"
          v-if="entryexamine && obj.status === 100"
          @click="handlerExamine">审核</el-button>
        <el-button
          v-if="(obj.type == 10 || obj.type == 19) && $route.query.look && !this.obj.outSign && obj.status != 12 && !isInvented"
          type="primary"
          @click="handleOutStorageRoom">快捷出库</el-button>
        <!-- gxkf帆软打印入库关闭 需要配置帆软模版code  -->
        <el-button v-if="objId && $route.query.look && obj.status === 11 && showBtn" class="print_btn_01" type="primary" @click="printTable"><i class="iconfont icon-dayinji-"></i> 打印</el-button>
      </div>
    </div>
    <speed-out-storage ref="outStorageRoom" :data="obj" @handleVisible="handleVisible"></speed-out-storage>
    <!-- 审核弹窗 -->
    <examine-dialog :visible.sync="visibleDialog" @handlerConsent="handlerConsent" :loding="unRepeatedBtn"></examine-dialog>
  </div>
</template>
<script>
import api from '../store/enterapi'
import supplierLocalApi from '@/warehouse/store/supplierlocalapi'
import purchaseAcceptApi from '@/warehouse/store/purchaseacceptapi'
import getMaterialInfoApi from '@/warehouse/store/getmaterialinfoapi'
import { floatTool, debounce, FULL_STATE, FULL_ORDER_NAME, PACKAGE_CODE, FULL_IN_OUT_TYPE, compare, dateFormat, patch, SPEC_CODE } from '@/util/common'
import { everprint } from '@/util/print'
import { DECIMAL_FOUR, FLOAT_REG, PARSE_REG } from '@/warehouse/util/reg'
import { BUSINESS_TYPE_COLLECT, COOD_TYPE_INT } from '@/warehouse/views/util/constant'
import setName from '@/util/setstatusname'
import sysvalue from '@/warehouse/store/sysvalueapi'
import speedOutStorage from '../../enterstorageroom/speedoutstorageroom'
import addProduct from '@/warehouse/page/components/addproduct'
import tipsDialog from '@/warehouse/page/components/tipsdialog'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import addProductMethods from '@/warehouse/page/storages/util/addproduct'
import everPopover from '@/warehouse/page/components/popover'
import accessStorageMixins from '@/warehouse/page/storages/mixins/accessstorage.mixins.js' // 出入库审核系列操作
import outAndInMixins from '@/warehouse/page/storages/mixins/outandin.mixins.js'
import storageroomapi from '@/warehouse/store/storageroomapi.js'
import storage from '@/util/storage'

let schema = [
  {
    name: 'code',
    label: '入库任务单',
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
    props: {
      nocGray: true
    },
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'inStockTime',
    label: '入库时间',
    props: {
      nocGray: true
    },
    comp: 'readonlyitem',
    span: 6
  }
]
let tableCode = {
  localMaterialId: '',
  name: '',
  iname: '',
  price: '',
  num: '',
  totalPrice: '',
  batchNum: '',
  produceDate: '',
  unitId: '',
  validityDate: ''
}
export default {
  mixins: [setName, getstorage, addProductMethods, accessStorageMixins, outAndInMixins, storage],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.inStockItemList = [{ invoiceStatus: 0, invoiceNo: '', item: [], items: [] }]
    return {
      schema,
      obj,
      SPEC_CODE,
      api,
      PACKAGE_CODE,
      COOD_TYPE_INT,
      getMaterialInfoApi,
      supplierLocalApi,
      tableCode,
      FULL_IN_OUT_TYPE,
      FULL_STATE,
      FULL_ORDER_NAME,
      DRAFTP: false,
      pathTo: false,
      currentRows: 0,
      sysBatchId: '',
      objId: this.$route.params.id,
      dosageFormArr: [],
      temSupplierLocalId: '',
      isBatch: 0, // 定价模式
      queryParams: { materialType: '', offset: 0, pagesize: 20, storageRoomId: '' },
      rules: {},
      disabled: true,
      submitFlag: true,
      storageFlag: false,
      createDate: '',
      entexpands: [],
      examine: false,
      entryexamine: this.$hasPermission('Auth_menu_treasury_businessmanagement_entryexamine'), // 是否有审核按钮权限
      visibleDialog: false,
      columnIndes: [0, 1, 2],
      printCode: 1,
      schemaList: [], // 缓存的一份schema
      warehousingType: '', // 入库类型type
      unRepeatedBtn: false, // 控制重复提交
    }
  },
  created () {
    this.$route.meta.purchase = 0
    this._info()
    if (this.objId) {
      this.handleGetDetail()
      this.schemaList = JSON.parse(JSON.stringify(this.schema))
    }
    sysvalue.listOnce('THC_WH_DRUG_FORM').then(res => {
      if (res) {
        this.dosageFormArr = res
      }
    })
  },
  computed: {
    showBtn () { // 已配置打印模板的展示打印按钮
      return !!COOD_TYPE_INT[this.printCode][this.warehousingType]
    },
  },
  methods: {
    // 退返数量计算
    handleDiversityNum (row, index) {
      let inDiversityNum = ''
      inDiversityNum = row.num > 0 ? floatTool.subtract(row.expectNum, row.num) : ''
      if (inDiversityNum <= 0) inDiversityNum = ''
      this.$set(row, 'inDiversityNum', inDiversityNum)
    },
    getColumns (type, status, pricingModel) {
      this.tableColumns = this.tableListColumn.filter(item => {
        if (pricingModel && type !== '15') {
          return item.isBatch || item.intBatchEdit || (item.prop === 'inDiversityNum' && item.type && item.type.includes(type))
        } else {
          return item.show ||
          item.inEdit ||
          (item.status && item.status.includes(`${status}`) && type !== '14') ||
          (item.label === '货位号' && this.commoditylocation) ||
          (item.label === '单位' && !this.commoditylocation) ||
          (item.type && item.type.includes(type))
        }
      })
    },
    handlerExamine () { // 审核
      this.visibleDialog = true
    },
    handlerConsent: debounce(function (btn, val) { // 审核 || 驳回
      // btn 1: 审核 0: 驳回
      this.unRepeatedBtn = true
      let params = JSON.parse(JSON.stringify(this.obj))
      delete params.inStorageRoomObject
      delete params.inStockItemList
      delete params.supplierObject
      delete params.user
      params.auditOpinion = val
      params.status = btn ? 11 : 13
      params.id = this.objId
      params.pricingModel = this.isBatch
      api.updateInStockForAudit(params).then(res => {
        if (res) {
          this.getDetail().then((res) => {
            this.everSuccess(`${btn ? '审核' : '驳回'}成功`)
            this.$router.push('/storages/entry/entrys/10')
          })
        }
        setTimeout(() => {
          this.unRepeatedBtn = false
          this.visibleDialog = false
        }, 300)
      })
    }),
    rowHover (row, column, cell, event) {
      event.target.parentNode.classList.add('hover_rows')
    },
    rowExpand (row, column, event) {
      if (!row.isManageAlone) return
      let index = this.obj.inStockItemList.findIndex(item => {
        return item.invoiceNo === row.invoiceNo
      })
      index = index < 0 ? 0 : index
      let trs = this.$refs.table[index].$el.children[2].getElementsByTagName('tr')
      let tr = this._getTrEle(event.target)
      for (let i = 0; i < trs.length; i++) {
        trs[i].classList.remove('bg_rows')
      }
      if (this.obj.inStockItemList[index].entexpands.indexOf(row.localMaterialId) < 0) {
        this.obj.inStockItemList[index].entexpands = []
        this.obj.inStockItemList[index].entexpands.push(row.localMaterialId)
        tr.classList.add('bg_rows')
      } else {
        this._removed(this.obj.inStockItemList[index].entexpands, row.localMaterialId)
      }
    },
    printTable () {
      let code = COOD_TYPE_INT[this.printCode][this.warehousingType]
      everprint(code, { id: this.objId, stockPrint: this.printCode }, {
        preview: true,
        cb: _ => {
          console.log('打印完成')
        }
      })
    },
    popoverDelRow (i, n, m) {
      // i,当前索引； n,父索引； m,祖父索引
      let item = this.obj.inStockItemList[m].item[n]
      item.inStockItemDetailStockContainerList.splice(i, 1)
      item.num--
      item.totalPrice = item.num === 0 ? 0 : floatTool.multiply(item.price, item.num)
    },
    handleSaveAfterObj (data) {
      data && data.id && delete data.id
      data.invoiceNo = data.invoiceNo.trim()
      data.invoiceNo = !data.invoiceNo ? '' : data.invoiceNo
      this.clear = false
      if (data.localMaterialId && data.isManageAlone) data.num = data.inStockItemDetailStockContainerList.length
      if (this.obj.inStockItemList.length === 1 && !this.obj.inStockItemList[0].item.length) {
        this.obj.inStockItemList = [{ invoiceNo: data.invoiceNo, invoiceStatus: data.invoiceStatus, item: [data], entexpands: [] }]
        this.clear = true
        return
      }
      // 收集this.obj.inStockItemList中已存在的当前data.localMaterialId
      let itemListAll = []
      this.obj.inStockItemList.forEach(list => {
        let arr = list.item.filter(items => {
          return items.localMaterialId === data.localMaterialId
        })
        itemListAll = itemListAll.concat(arr)
      })
      for (let i = 0; i < this.obj.inStockItemList.length; i++) {
        let list = this.obj.inStockItemList[i]
        let itemList = list.item.filter(item => {
          return item.localMaterialId === data.localMaterialId
        })
        // 发票号存在，并且发票编号相同
        if (!this._fieldCompare(this.obj.inStockItemList, 'invoiceNo', data.invoiceNo) && list.invoiceNo === data.invoiceNo) {
          // 验证同一个物资
          if (!this._fieldCompare(list.item, 'localMaterialId', data.localMaterialId)) {
            // 同一个物资 并且是唯一码管理
            if (data.localMaterialId && data.isManageAlone) {
              if (!this._eachItemListCompare(data.inStockItemDetailStockContainerList, itemListAll)) {
                this.$messageTips(this, 'warning', '唯一码或物资自带码已存在，请核对后录入')
                return
              }
              this._pushUniqueCode(data, list)
              this.obj = JSON.parse(JSON.stringify(this.obj))
              return
            }
            // 同一个物资，并且既不是唯一码管理也不是有效期管理
            if (data.localMaterialId && !data.isExpiryDate && !data.isManageAlone) {
              this._resetData(data, list)
              return
            }
            // 同一个物资，并且是有效期管理
            if (data.localMaterialId && data.isExpiryDate) {
              // 没有同一个批号
              if (this._fieldCompare(itemList, 'batchNum', data.batchNum)) {
                this._modifyData(data, list)
                return
              } else {
                this.$messageTips(this, 'warning', '该发票下已存在该物资批次，请核对后在添加')
                return
              }
            }
          }
          // 验证不同的物资 整个数据列表中都不存在该数据
          if (this._fieldCompare(list.item, 'localMaterialId', data.localMaterialId)) {
            if (data.localMaterialId && data.isManageAlone) {
              if (!this._eachItemListCompare(data.inStockItemDetailStockContainerList, itemListAll)) {
                this.$messageTips(this, 'warning', '唯一码或物资自带码已存在，请核对后录入')
                return
              }
            }
            list.item.push(data)
            this.clear = true
            return
          }
        }
        // 发票不存在
        if (this._fieldCompare(this.obj.inStockItemList, 'invoiceNo', data.invoiceNo)) {
          if (data.localMaterialId && data.isManageAlone) {
            if (!this._eachItemListCompare(data.inStockItemDetailStockContainerList, itemListAll)) {
              this.$messageTips(this, 'warning', '唯一码或物资自带码已存在，请核对后录入')
              return
            }
          }
          this.obj.inStockItemList.push({
            invoiceNo: data.invoiceNo,
            invoiceStatus: data.invoiceStatus,
            item: [data],
            entexpands: []
          })
          return
        }
        list.item.sort(compare('localMaterialId'))
        this.obj = JSON.parse(JSON.stringify(this.obj))
      }
      setTimeout(() => {
        this.clear = false
      }, 500)
    },
    handleGetDetail () {
      this.getDetail().then(res => {
        for (let i = 0; i < res.inStockItemList.length; i++) {
          if (res.inStockItemList[i].item[0].invoiceStatus) {
            res.inStockItemList[i].invoiceStatus = Number(res.inStockItemList[i].item[0].invoiceStatus)
          } else {
            res.inStockItemList[i].invoiceStatus = 0
          }
          this.sysBatchId = res.inStockItemList[0].item[0].sysBatchId
          if (!this.$route.query.look) {
            res.inStockItemList[i].item = []
          }
        }
        this.obj = Object.assign({}, this.obj, res)
      })
    },
    handleVisible () {
      this.handleGetDetail()
    },
    handleOutStorageRoom () {
      this.$refs.outStorageRoom.open('business/applybusiness')
    },
    async getExamine () {
      let type = BUSINESS_TYPE_COLLECT.find(type => { return type.id === this.warehousingType })
      if (type) {
        let settingItemLimits = []
        await storageroomapi.selectSystemSettingByClinicId().then(res => {
          if (res && res.settingItemLimits) settingItemLimits = res.settingItemLimits
          // 根据出入库打印配置展示
          this.printCode = this.isBatch ? res.stockPrint : 1
        })
        settingItemLimits.length && settingItemLimits.forEach(item => {
          if (`${item.orderType}` === type.examine) {
            this.examine = !item.status
          }
        })
      }
    },
    getDetail (id) {
      return new Promise((resolve, reject) => {
        api.getById(id || this.objId).then(res => {
          if (res.auditerName && !this.schemaList.find(key => { return key.label === '审核人' }) && ['10', '11', '32', '12', '33'].includes(res.type)) {
            this.schemaList.push(...this.examineSchema)
          }
          if (res.type === '32') {
            this.schemaList.splice(4, 0, ...this.staffSchema)
          }
          this.isBatch = res.pricingModel
          this.schema = this.schemaList
          this.warehousingType = res.type
          // 采购&到货入库单增加供应商显示
          let supplierArr = [{ name: 'supplierName', label: '供应商:', comp: 'readonlyitem', span: 8 }]
          if (res.type === FULL_IN_OUT_TYPE.intype[5].id) {
            this.schema = [...this.schema, ...supplierArr]
            Object.assign(this.obj, { supplierName: '' })
            if (res && res.supplierObject && res.supplierObject.name) res.supplierName = res.supplierObject.name
          }
          const result = JSON.parse(JSON.stringify(res))
          res.createDate = res.createTime
          res.inStockTime = res.inDate || ''
          res.statusName = this.setName(FULL_STATE.instock, res.status, true)
          res.inStockTypeName = this.setName(FULL_IN_OUT_TYPE.intype, res.type, true)
          // res.updatedBy = res.updatedBy ? res.updatedBy : ''
          res.staffName = result.createByName && res.status === 11 ? result.createByName : ''
          if (res.inStockItemList.length) {
            for (let i = 0; i < res.inStockItemList.length; i++) {
              let itemList = res.inStockItemList[i]
              res.inStockItemList[i].entexpands = []
              for (let k = 0; k < itemList.item.length; k++) {
                if (!itemList.item[k].validityDate) itemList.item[k].validityDate = ''
                if (!itemList.item[k].produceDate) itemList.item[k].produceDate = ''
              }
              for (let n = 0; n < res.inStockItemList[i].item.length; n++) {
                let setNums = res.inStockItemList[i].item[n]
                // 没有带出入库金额，自己计算
                if (!setNums.totalPrice && setNums.num) {
                  setNums.totalPrice = floatTool.multiply(setNums.num, setNums.price)
                }
                // 唯一码管理，数量为当前物资的唯一码leng
                if (setNums.localMaterialId && setNums.isManageAlone) {
                  setNums.num = setNums.inStockItemDetailStockContainerList && setNums.inStockItemDetailStockContainerList.length || 0
                  setNums.totalPrice = floatTool.multiply(setNums.num, setNums.price)
                }
                let tempParams = {
                  // 物资明细单位信息
                  unitId: result.inStockItemList[i].item[n].unitId || ''
                }
                if (result.inStockItemList[i].item[n].localMaterialId && result.inStockItemList[i].item[n].isManageAlone) {
                  tempParams.batchNum = ''
                  tempParams.validityDate = ''
                } else {
                  tempParams.validityDate = setNums.validityDate ? dateFormat(setNums.validityDate, 'YYYY-MM-DD') : ''
                }
                for (var j = n + 1; j < res.inStockItemList[i].item.length; j++) {
                  if (res.inStockItemList[i].item[n].localMaterialId === res.inStockItemList[i].item[j].localMaterialId) {
                    delete res.inStockItemList[i].item[j].unitGroupItemObject
                  }
                }
                setTimeout(() => {
                  this.$nextTick(() => {
                    this.handleDiversityNum(setNums)
                  }, 200)
                }, 200)
              }
            }
          }
          if (res.storageRoomObject && this.storageId === res.storageRoomObject.id) {
            this.storageFlag = true
          }
          this.queryParams.supplierLocalId = res.supplierLocalId
          this.queryParams.materialType = res.materialType
          resolve(res)
          this.getExamine()
          this.getColumns(res.type, res.status, res.pricingModel)
        })
      })
    },
    handleDeleteInvoice (i) {
      this.currentRows = i
      this.$refs.dialog.open()
    },
    submitForm: debounce(function (form, status) {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid && this.disabled) {
          if (!this.submitFlag) return
          if (!this.obj.inStockItemList[0].item.length) {
            this.$messageTips(this, 'warning', '入库单中还未添加物资，请先添加物资再提交')
            return
          }
          let params = JSON.parse(JSON.stringify(this.obj))
          params.inStockItemList = []
          params.status = status
          params.materialType = this.materialType
          params.pricingModel = this.isBatch
          for (let i = 0; i < this.obj.inStockItemList.length; i++) {
            if ((this.obj.type === '10' || this.obj.type === '19') && this.obj.inStockItemList[i].invoiceStatus === 0) {
              this.$messageTips(this, 'warning', '还未录入或未保存发票信息，请完成后再提交')
              return
            }
            if (!this.obj.inStockItemList[i].item.length) {
              this.$messageTips(this, 'warning', '存在没有入库明细的发票，请录入明细或者删除发票后再提交')
              return
            }
            for (let n = 0; n < this.obj.inStockItemList[i].item.length; n++) {
              let item = this.obj.inStockItemList[i].item[n]
              if (item.num < 0 || item.num === '' || item.num === undefined) {
                this.$messageTips(this, 'warning', '存在物资入库明细入库数量小于0，请完成后再提交')
                return
              }
              if (item.localMaterialId && item.isManageAlone && (!item.inStockItemDetailStockContainerList || (item.inStockItemDetailStockContainerList && !item.inStockItemDetailStockContainerList.length))) {
                this.$messageTips(this, 'warning', '入库物资唯一码管理，唯一码不能为空，请添加后再提交')
                return
              }
              if (item.localMaterialId && item.isExpiryDate && !item.isManageAlone && (!item.batchNum || !item.produceDate || !item.validityDate)) {
                this.$messageTips(this, 'warning', '存在物资入库明细生产批号、生产日期或有效期未添加，请添加后再提交')
                return
              }
              for (let j = 0; j < item.inStockItemDetailStockContainerList.length; j++) {
                let ownCode = item.inStockItemDetailStockContainerList[j]
                if (ownCode.ownUniqueCodes === '') delete ownCode.ownUniqueCodes
              }
              this.obj.inStockItemList[i].item[n].unitId = this.obj.inStockItemList[i].item[n].unitId || ''
              params.inStockItemList.push(Object.assign({
                materialType: this.materialType,
                storageRoomId: this.obj.storageRoomId
              }, this.obj.inStockItemList[i].item[n], { invoiceNo: this.obj.inStockItemList[i].invoiceNo }))
              delete params.inStockItemList[i].items
            }
          }
          params.unitGroupItemObject && delete params.unitGroupItemObject
          params.storageRoomObject && delete params.storageRoomObject
          params.staffObject && delete params.staffObject
          this.unRepeatedBtn = true
          this.api.createOrUpdate(params).then(res => {
            this.disabled = true
            if (status === 31) {
              this.$messageTips(this, 'success', '当前录入的内容已经保存，您可以稍后继续录入', '保存成功')
              return
            }
            if (res) this.$router.push('/storages/entry/entryedit/' + this.objId + '?look=' + this.objId)
            this.unRepeatedBtn = false
          })
        }
      })
    }, 500),
    calcInboundNum (data, index) {
      if (data.num <= 0) {
        this.$messageTips(this, 'warning', '入库数量为0或未输入，请重新录入')
        return
      }
      let dataType = data.classifyId || ''
      if (dataType === '303' || dataType === '304') {
        if (!FLOAT_REG.test(data.num)) {
          this.$messageTips(this, 'warning', '入库数量不能小于0，请重新录入')
          this.obj.inStockItemList[index].items[0].num = ''
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
      } else {
        if (PARSE_REG.test(data.num)) {
          // this.$messageTips(this, 'warning', '入库数量不能小于0并且不能有小数，请重新录入')
          this.obj.inStockItemList[index].items[0].num = ''
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
      }
      this.obj.inStockItemList[index].items[0].totalPrice = floatTool.multiply(this.obj.inStockItemList[index].items[0].price, data.num)
    },
    handleSelect (data, index, index2) {
      for (let key in this.obj.inStockItemList[index].items[0]) {
        let item = this.obj.inStockItemList[index].items[0]
        if (data.localMaterialId) {
          if (key === 'enableDate' || key === 'num') {
            item[key] = ''
          } else if (key === 'unitId') {
            item[key] = data['unitId']
          } else {
            item[key] = data[key] || data[key] === 0 ? data[key] : ''
          }
        } else {
          item[key] = ''
        }
      }
    },
    handleDeleteRow (data, index) {
      data.splice(index, 1)
      this.obj = JSON.parse(JSON.stringify(this.obj))
    },
    handleAddRow (data, i) {
      if (!data['batchNum'] || !data['produceDate'] || !data['validityDate'] || !data['num']) {
        this.$messageTips(this, 'warning', '该物资生产批号、生产日期或有效期信息未完成，请完成后再添加')
        return
      }
      for (let n = 0; n < this.obj.inStockItemList.length; n++) {
        for (let m = 0; m < this.obj.inStockItemList[n].item.length; m++) {
          if (this.obj.inStockItemList[n].item[m].localMaterialId === data.localMaterialId && this.obj.inStockItemList[n].item[m].batchNum === data.batchNum) {
            this.$messageTips(this, 'warning', '该生产批号的物资已经添加，如想修改，请删除后再添加')
            return
          }
        }
      }
      if (data.localMaterialId) {
        data.sysBatchId = this.sysBatchId
        delete data.id
        this.obj.inStockItemList[i].item.push(data)
        this.obj = JSON.parse(JSON.stringify(this.obj))
        this.$nextTick(function () {
          for (let key in this.tableCodeCode) {
            this.tableCode[key] = ''
          }
          this.$set(this.obj.inStockItemList[i].items, 0, this.tableCode)
          this.$refs.remoteselect[i].select = ''
        })
      }
    },
    handleSaveInvoice (data, index) {
      data = data.trim()
      for (let i = 0; i < this.obj.inStockItemList.length; i++) {
        if (i === index) continue
        if (this.obj.inStockItemList[i].invoiceNo.toString().trim() === data.toString().trim()) {
          this.$messageTips(this, 'warning', '您提交的发票号已经在本入库单中填写过，请检查后重新录入')
          return
        }
      }
      if (data) {
        let params = {
          billNum: data
        }
        if (!this.objId && this.obj.id) {
          params = {
            id: this.obj.id,
            billNum: data
          }
        }
        purchaseAcceptApi.getBillNum(params).then(res => {
          if (res === -1) {
            this.obj.inStockItemList[index].invoiceStatus = 3
            this.obj.inStockItemList[index].invoiceNo = data
          } else {
            this.$messageTips(this, 'warning', '您提交的发票号已经存在，请检查后重新录入')
          }
        })
      }
    },
    handleEditInvoice (index) {
      this.obj.inStockItemList[index].invoiceStatus = 0
      this.obj.inStockItemList[index].invoiceNo = this.obj.inStockItemList[index].invoiceNo.trim()
    },
    handleNoInvoice (status, index) {
      this.obj.inStockItemList[index].invoiceStatus = status
      this.obj.inStockItemList[index].invoiceNo = ''
    },
    handleCalcInboundNum (data, i, index) {
      this.submitFlag = false
      if (data.num <= 0) {
        this.$messageTips(this, 'warning', '入库数量为0或未输入，请重新录入')
        return
      }
      let dataType = data.classifyId || ''
      if (dataType === '303' || dataType === '304') {
        if (!FLOAT_REG.test(data.num)) {
          this.$messageTips(this, 'warning', '入库数量不能小于0，请重新录入')
          data.num = ''
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
        if (!DECIMAL_FOUR.test(data.num)) {
          this.$messageTips(this, 'warning', '“中药饮片”和“中药颗粒”最多允许录入4位小数')
          data.num = ''
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
      } else {
        if (!PARSE_REG.test(data.num)) {
          this.$messageTips(this, 'warning', '入库数量不能小于0并且不能有小数，请重新录入')
          data.num = ''
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
      }
      if (this.obj.type === '11' || this.obj.type === '12') {
        if (data.num > data.expectNum) {
          this.$messageTips(this, 'warning', '入库数量不能大于预期数量，请重新录入')
          data.num = ''
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
      }
      this.obj.inStockItemList.forEach(data => {
        data.item.forEach(item => {
          if (item.expectNum < item.num) {
            this.$messageTips(this, 'warning', '同一个物资入库数量不能大于预期数量')
            data.item[i].num = ''
            this.obj = JSON.parse(JSON.stringify(this.obj))
            return
          }
        })
      })
      this.submitFlag = true
      data.totalPrice = floatTool.multiply(data.price, data.num)
      this.obj = JSON.parse(JSON.stringify(this.obj))
    },
    calcTotalPrice (data, price) {
      let totalPrice = 0
      for (let i = 0; i < data.length; i++) {
        totalPrice = floatTool.add(data[i][price], totalPrice)
      }
      return !isNaN(totalPrice) ? totalPrice : 0.00
    },
    _setExpectNum (params) {
      for (let i = 0; i < params.inStockItemList.length; i++) {
        let item = params.inStockItemList[i]
        let expectNum = item.expectNum
        let localMaterialId = item.localMaterialId
        if (expectNum) {
          for (let n = i + 1; n < params.inStockItemList.length; n++) {
            let item2 = params.inStockItemList[n]
            if (localMaterialId === item2.localMaterialId) item2.expectNum = expectNum
          }
        }
      }
      return params
    },
    _getTrEle (el) {
      var parent = el.parentNode
      if (parent && parent.nodeName === 'TR') {
        return parent
      } else if (parent) {
        return this._getTrEle(parent)
      }
    },
    _removed (data, val) {
      let index = data.indexOf(val)
      if (index > -1) {
        data.splice(index, 1)
      }
    },
    _info () {
      this.queryParams.materialType = this.materialType
      this.queryParams.storageRoomId = this.storageId
    },
    _setList (flag) {
      if (flag) {
        for (let key in this.tableCode) {
          this.tableCode[key] = ''
        }
        if (this.$route.query.look) return
        // this.obj.inStockItemList[0].items = [this.tableCode]
      } else {
        this.obj.inStockItemList[0].items = []
      }
    },
    // arr 当前data
    // itemListAll 页面所有list
    _eachItemListCompare (arr, itemListAll) {
      for (let j = 0; j < itemListAll.length; j++) {
        for (let m = 0; m < itemListAll[j].inStockItemDetailStockContainerList.length; m++) {
          let item = itemListAll[j].inStockItemDetailStockContainerList[m]
          item.ownUniqueCodes = item.ownUniqueCodes || ''
          item.uniqueCode = item.uniqueCode || ''
          for (let i = 0; i < arr.length; i++) {
            if (item.uniqueCode === arr[i].uniqueCode || item.ownUniqueCodes === arr[i].ownUniqueCodes) {
              return false
            }
          }
        }
      }
      return true
    },
    ...patch
  },
  watch: {
    '$route' (val) {
      this.objId = val.params.id
      if (this.objId) {
        this.handleGetDetail()
        this.pathTo = true
      }
    }
  },
  components: {
    addProduct,
    tipsDialog,
    everPopover,
    speedOutStorage
  }
}
</script>
<style lang="scss" scoped>
.addProduct { margin-bottom: 20px}
#table_expand /deep/ .el-table__expanded-cell .custom_popover span.pos_ab.left { left: 10px}
.status {
  color: red;
  margin: 0 0 0 10px;
}
.quantity_input /deep/ .el-input .el-input__inner {
  padding-right: 20px;
}
</style>
