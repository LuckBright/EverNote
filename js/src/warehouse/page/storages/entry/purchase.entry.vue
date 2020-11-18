<template>
  <div>
    <ever-bread-crumb name="采购入库" :showTitle="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4 class="pos_re">{{['11', '100', '13'].includes(`${obj.status}`) ? '' : '填写'}}基础信息</h4>
        <ever-form2
          class="readform"
          :schema="schema"
          v-model="obj"
          ref="form"
          :span="12"
          :rules="rules"
          :nosubmit="true">
          <!-- 审核意见 -->
          <template slot="auditOpinion">
            <tooltip-info :content="obj.auditOpinion"></tooltip-info>
          </template>
          <!-- 入库任务单 -->
          <template slot="code">
            <span>{{obj.code}}</span>
            <span class="status">{{obj.statusName}}</span>
            <span v-if="!obj.code">无</span>
          </template>
          <!-- 备注 -->
          <template slot="remarks">
            <el-tooltip placement="top-start">
            <div slot="content" style="max-width: 300px;">
              {{obj.remarks}}
            </div>
            <div class="ellipsis">
              {{obj.remarks}}
            </div>
          </el-tooltip>
          <span v-if="objId && !obj.remarks">无</span>
          </template>
        </ever-form2>
        <h4>{{['11', '100', '13'].includes(`${obj.status}`) ? '物资明细' : '添加物资'}}</h4>
        <div v-if="obj.id">
          <div v-for="(list, i) in obj.purchaseAcceptanceItemList" :key="i">
            <entry-table-sign
              v-if="obj.status === 11 || obj.status === 100 || obj.status == 12"
              class="listinfo"
              ref="tablesign"
              :parentData="obj.purchaseAcceptanceItemList"
              :list="list"
              :is-batch="isBatch"
              :status="status"
              :billCode="obj.billCode"
              :invoiceNos="invoiceNos"
              :description="obj.description"
              :queryParams="queryParams"
              :tableCode="tableCode"
              @updataList="updataList"
              @updataInvoice="updataInvoice"
              @deleteListItem="deleteListItem"
              :itemKey="i">
            </entry-table-sign>
            <entry-table
              v-else
              ref="tablesign"
              :is-batch="isBatch"
              class="listinfo"
              :parentData="obj.purchaseAcceptanceItemList"
              :list="list"
              :billCode="obj.billCode"
              :status="status"
              :invoiceNos="invoiceNos"
              :description="obj.description"
              :queryParams="queryParams"
              :tableCode="tableCode"
              @updataList="updataList"
              @updataInvoice="updataInvoice"
              @deleteListItem="deleteListItem"
              :itemKey="i">
            </entry-table>
            <div v-if="(obj.status === 11) && typeof list.showBtn !== 'undefined'" style="text-align: center" class="mb15">
              <el-button @click="saveEditInvoice" size="small" :loading="unRepeatedBtn" type="primary">保存</el-button>
              <el-button @click="cancelEditInvoice" :loading="unRepeatedBtn" size="small">取消</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="addlist">
        <span class="fr">
          入库总金额：{{totalPrice | formatToFinacial(4)}}
        </span>
      </div>
      <div class="footer" v-if="!['11', '100', '12'].includes(`${status}`)">
        <el-button type="primary"
          :disabled="submitBtnDisabled"
          @click="submitForm('form', examine ? 100 : 11)" :loading="unRepeatedBtn">提交</el-button>
        <el-button type="primary"
          :disabled="submitBtnDisabled"
          @click="submitForm('form', 10)" :loading="unRepeatedBtn">暂存</el-button>
        <el-button @click="retrunParve">返回</el-button>
      </div>
      <div v-else class="footer">
        <el-button
          v-if="(obj.type == 10 || obj.type == 19) && !obj.outSign && !isInvented && obj.status === 11"
          type="primary"
          @click="handleOutStorageRoom">快捷出库</el-button>
          <el-button
          type="primary"
          v-if="entryexamine && obj.status === 100 && examine"
          @click="handlerExamine">审核</el-button>
        <!-- gxkf帆软打印入库关闭 需要配置帆软模版code  -->
        <el-button
          v-if="obj.status === 11"
          class="print_btn_01"
          type="primary"
          @click="printTable(false)"><i class="iconfont icon-dayinji-"></i> 打印</el-button>
        <el-button
          v-if="obj.status === 11 && $hasPermission('Auth_menu_treasury_businessmanagement_acceptance')"
          class="print_btn_01"
          type="primary"
          @click="printTable(true)"><i class="iconfont icon-dayinji-"></i> 打印验收单</el-button>
      </div>
      <!-- 发票新建/选择 -->
      <el-dialog title="" :visible.sync="dialogTableVisible" width="350px">
        <div class="invocieinput">请输入发票号 <el-input size="small" v-model="invoiceNoModel"></el-input></div>
        <div class="invocieinput">或添加一个已有发票</div>
        <div class="invocielist">
          <div v-for="(item, index) in invoiceNos" :key="index" v-if="selectItemKey == null || (selectItemKey != null && item != obj.purchaseAcceptanceItemList[selectItemKey].invoiceNo)" :class="selectThisInvoice == item ? 'selectinvo' : ''" @click="selectThisInvoice = item">{{item}}<i @click.stop="selectThisInvoice = ''" v-if="selectThisInvoice == item"></i></div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="handleAddInvoice(true)" type="primary">保存</el-button>
          <el-button size="small" @click="handleCancelInvoice">取消</el-button>
        </div>
      </el-dialog>
      <!-- 发票号重复提示 -->
      <el-dialog title="提示" :visible.sync="errorInvoiceVisible" width="350px">
        <div class="invocielisterror">
          <div v-html="errorInvoiceHtml"></div>
        </div>
        <div slot="footer" class="dialog-footer" style="text-align:center">
          <el-button size="small" @click="errorInvoiceVisible = !errorInvoiceVisible" type="primary">确认</el-button>
        </div>
      </el-dialog>
    </div>
    <speed-out-storage ref="outStorageRoom" :data="obj" @handleVisible="handleVisible"></speed-out-storage>
    <loading-cover :loading="onloadLoading">
      <h2 slot="title">数据加载中</h2>
    </loading-cover>
    <!-- 审核弹窗 -->
    <examine-dialog :visible.sync="visibleDialog" @handlerConsent="handlerConsent" :loding="unRepeatedBtn"></examine-dialog>
  </div>
</template>
<script>
import api from '../store/enterapi'
import supplierLocalApi from '@/warehouse/store/supplierlocalapi'
import componentsApi from '../store/componentsapi'
import contrctApi from '@/warehouse/page/purchease/contract/api/contrct'
import { floatTool, debounce, patch, PACKAGE_CODE, FULL_IN_OUT_TYPE, FULL_STATE, FULL_ORDER_NAME } from '@/util/common'
import setName from '@/util/setstatusname'
import tipDialog from '@/warehouse/page/components/tipsdialog'
import addProduct from '@/warehouse/page/components/addproduct'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import speedOutStorage from '../../enterstorageroom/speedoutstorageroom'
import entryTable from './entry.table'
import entryTableSign from './entry.table.sign'
import { everprint } from '@/util/print'
import entryCheck from './entrycheck.js'
import { BUSINESS_TYPE_COLLECT, COOD_TYPE_INT } from '@/warehouse/views/util/constant.js'
import loadingCover from '@/warehouse/page/components/procurement/loadingcover'
import accessStorageMixins from '@/warehouse/page/storages/mixins/accessstorage.mixins.js' // 出入库审核系列操作
import storageroomapi from '@/warehouse/store/storageroomapi.js'
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
    name: 'createTime',
    label: '创建时间',
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
    name: 'supplierName',
    label: '供应商',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'contractName',
    label: '合同',
    props: {
      nocGray: true
    },
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'billCode',
    label: '采购单',
    props: {
      nocGray: true
    },
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'applyCode',
    label: '采购申请单',
    props: {
      nocGray: true
    },
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'createByName',
    label: '入库人',
    props: {
      nocGray: true
    },
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'inDate',
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
  oldPrice: '',
  num: '',
  totalPrice: '',
  showTotalPrice: '',
  batchNum: '',
  isExpiryDate: '',
  produceDate: '',
  unitId: '',
  salePrice: '',
  serviceId: '',
  validityDate: ''
}
export default {
  mixins: [setName, getstorage, entryCheck, accessStorageMixins, storage],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.purchaseAcceptanceItemList = [{ invoiceStatus: 0, invoiceNo: '', item: [] }]
    return {
      schema,
      obj,
      newObj: null,
      PACKAGE_CODE,
      api,
      contrctApi,
      supplierLocalApi,
      tableCode,
      errorInvoiceVisible: false,
      dialogTableVisible: false,
      onloadLoading: false,
      objId: this.$route.params.id,
      temSupplierLocalId: '',
      queryParams: { offset: 0, pagesize: 20, storageRoomId: '', splitFlag: 0, state: 0, isNeedFreightCode: true, isNeedSalePrice: true },
      rules: {},
      isCancel: false,
      submitBtnDisabled: true,
      currentRows: 0,
      dialogBtn: '',
      dialogTitle: '',
      dialogContent: '',
      dialogFunction: '',
      dialogCanclFun: '',
      invoiceNoModel: '',
      errorInvoiceHtml: '',
      changeSupplierLocalId: [],
      invoiceNos: [],
      flag: true,
      cachePrice: '',
      unRepeatedBtn: false, // 控制重复提交
      examine: false,
      totalPrice: 0,
      status: 10,
      printCode: 1,
      selectAddInvoice: null,
      selectThisInvoice: null,
      selectItemKey: null,
      defaultContrct: null,
      warehousingType: '',
      isBatch: 0, // 定价模式
      entryexamine: this.$hasPermission('Auth_menu_treasury_businessmanagement_entryexamine'), // 是否有审核按钮权限
      schemaList: [], // 缓存的schema
    }
  },
  created () {
    this.getDetail()
    this._info()
    this.schemaList = JSON.parse(JSON.stringify(this.schema))
  },
  methods: {
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
      delete params.description
      delete params.purchaseAcceptanceItemList
      delete params.storageRoomObject
      params.status = btn ? 11 : 13
      params.auditOpinion = val
      params.id = this.objId
      params.pricingModel = this.isBatch
      api.updateInStockForAudit(params).then(res => {
        if (res) {
          this.everSuccess(`${btn ? '审核' : '驳回'}成功`)
          this.$router.push('/storages/entry/entrys/10')
        }
        setTimeout(() => {
          this.unRepeatedBtn = false
          this.visibleDialog = false
        })
      })
    }),
    cancelEditInvoice () {
      this.getDetail()
    },
    printTable (flag) {
      let code = !flag ? COOD_TYPE_INT[this.printCode][this.warehousingType] : 'WH_PURCHASE_ACCEPTANCE'
      everprint(code, { id: this.objId, stockPrint: this.printCode }, {
        preview: true,
        cb: _ => {
          console.log('打印完成')
        }
      })
    },
    handleOutStorageRoom () {
      this.$refs.outStorageRoom.open('business/applybusiness')
    },
    handleVisible () {
      this.getDetail()
    },
    retrunParve () {
      this.$confirm('您填写的内容尚未提交，是否要离开页面？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.go(-1)
      })
    },
    handleCancelInvoice (clear) {
      // 清除选择的数据
      if (clear && this.$refs.tablesign && this.$refs.tablesign[this.selectItemKey]) {
        this.$refs.tablesign[this.selectItemKey].selectLists = []
      }
      this.invoiceNoModel = ''
      this.selectThisInvoice = null
      this.selectAddInvoice = null
      this.selectItemKey = null
      this.dialogTableVisible = false
    },
    updataObjeList (list, itemKey) {
      list.forEach(data => {
        this.obj.purchaseAcceptanceItemList[itemKey].item = this.obj.purchaseAcceptanceItemList[itemKey].item.filter(check => check.localMaterialId !== data.localMaterialId)
      })
      this.obj = JSON.parse(JSON.stringify(this.obj))
      if (!this.obj.purchaseAcceptanceItemList[itemKey].item.length) this.obj.purchaseAcceptanceItemList.splice(itemKey, 1)
    },
    // 添加到发票/归属到发票未到
    updataInvoice (list, item, itemKey) {
      // 过滤掉本身的发票号
      // this.invoiceNos = this.invoiceNos.filter(invo => { return invo !== this.obj.purchaseAcceptanceItemList[itemKey].invoiceNo })
      if (item.id === '2') {
        // 发票未到操作
        let index = this.obj.purchaseAcceptanceItemList.findIndex(select => select.invoiceStatus === 1)
        if (~index) {
          this.obj.purchaseAcceptanceItemList[index].item = this.obj.purchaseAcceptanceItemList[index].item.concat(list)
          this.updataObjeList(list, itemKey)
        } else { // 如果没有发票未到，则添加一个发票未到
          this.$nextTick(_ => {
            this.updataObjeList(list, itemKey) // 在删除之前进行操作
            if (this.obj.purchaseAcceptanceItemList[0] && this.obj.purchaseAcceptanceItemList[0].more) {
              this.obj.purchaseAcceptanceItemList.splice(1, 0, {
                invoiceNo: '',
                invoiceStatus: 1,
                item: list
              })
            } else { // 添加到发票未到
              this.obj.purchaseAcceptanceItemList.splice(0, 0, { invoiceNo: '', invoiceStatus: 1, item: list, edit: list[0].edit })
            }
          })
        }
      } else {
        this.selectAddInvoice = list
        this.selectItemKey = itemKey
        this.dialogTableVisible = true
      }
    },
    // 右键弹窗操作发票
    handleAddInvoice () {
      if (!this.invoiceNoModel && !this.selectThisInvoice) {
        return this.$messageTips(this, 'warning', '请填写或选择发票号')
      }
      if (this.invoiceNoModel && this.obj.purchaseAcceptanceItemList.some(item => item.invoiceNo === this.invoiceNoModel)) {
        return this.$messageTips(this, 'warning', '发票号与当前单据内的发票号重复')
      }
      if (this.invoiceNoModel && !this.selectThisInvoice) {
        // 如果添加的发票号没有，就新添加一个发票列表
        const index = this.obj.purchaseAcceptanceItemList.findIndex(item => item.invoiceStatus === 1)
        if (~index) {
          // thisInvoiceNo 没有值就说明是一个新的发票列表
          this.updataObjeList(this.selectAddInvoice, this.selectItemKey)
          this.obj.purchaseAcceptanceItemList.splice(index + 1, 0, { invoiceStatus: 3, invoiceNo: this.invoiceNoModel, item: this.selectAddInvoice, edit: this.selectAddInvoice[0].edit })
        } else {
          const more = this.obj.purchaseAcceptanceItemList.some(item => item.more)
          this.updataObjeList(this.selectAddInvoice, this.selectItemKey)
          this.obj.purchaseAcceptanceItemList.splice(more ? 1 : 0, 0, { invoiceStatus: 3, invoiceNo: this.invoiceNoModel, item: this.selectAddInvoice, edit: this.selectAddInvoice[0].edit })
        }
        // 不在下面直接使用是因为删除物资的顺序有所不同
        // this.updataObjeList(this.selectAddInvoice, this.selectItemKey)
        setTimeout(() => {
          this.handleCancelInvoice(true)
        }, 200)
      } else {
        let index = this.obj.purchaseAcceptanceItemList.findIndex(item => item.invoiceNo === this.selectThisInvoice)
        if (~index) this.obj.purchaseAcceptanceItemList[index].item = this.obj.purchaseAcceptanceItemList[index].item.concat(this.selectAddInvoice)
        this.updataObjeList(this.selectAddInvoice, this.selectItemKey)
        setTimeout(() => {
          this.handleCancelInvoice(true)
        }, 200)
      }
    },
    updataList (data, key) {
      this.$set(this.obj.purchaseAcceptanceItemList, key, data)
    },
    // 删除发票及物资
    deleteListItem (i, tip, list, btn) {
      let msg = '删除后发票及物资内容将无法恢复，是否继续删除？'
      if (tip) msg = '发票中物资全部移除后，发票将被删除，是否确认操作。'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (list) {
          this.updataInvoice(list, btn, i)
        } else {
          this.obj.purchaseAcceptanceItemList.splice(i, 1)
          if (!this.obj.purchaseAcceptanceItemList.length) {
            let newTabel = JSON.parse(JSON.stringify(this.tableCode))
            newTabel.price = undefined
            newTabel.addData = 1
            this.obj.purchaseAcceptanceItemList = [{ invoiceStatus: 0, invoiceNo: '', item: [newTabel] }]
          }
        }
      })
    },
    getDetail () {
      if (this.$route.params.id) {
        this.onloadLoading = true
        this.api.getById(this.$route.params.id).then(res => {
          this.handleSetObject(res)
          this.getExamine()
        })
      }
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
    async handleSetObject (res) {
      this.newObj = res
      this.isBatch = res.pricingModel
      this.warehousingType = res.type
      let newObj = JSON.parse(JSON.stringify(res))
      if (newObj && newObj.id) {
        let obj = {}
        let batchNumArr = []
        if (res.type === FULL_IN_OUT_TYPE.intype[5].id) {
          if (res && res.supplierObject && res.supplierObject.name) obj.supplierName = res.supplierObject.name
        }
        // 审核表单只在已完成或者审核过的单据展示
        if (res.auditerName && !this.schemaList.find(key => { return key.label === '审核人' })) {
          this.schemaList.push(...this.examineSchema)
        }
        if (res.status === 11 || res.status === 100 || res.status === 12) { // 入库完成备注不可编辑
          this.schema = [...this.schemaList, {
            name: 'remarks',
            label: '备注',
            comp: 'custom',
            span: 6
          }]
        } else {
          this.schema = [...this.schemaList, {
            name: 'remarks',
            label: '备注',
            span: 6,
            props: {
              maxlength: 100
            }
          }]
        }
        obj.statusName = this.setName(FULL_STATE.instock, res.status, true)
        obj.typeName = this.setName(FULL_ORDER_NAME.intype, res.type, true)
        obj.inStockTypeName = this.setName(FULL_IN_OUT_TYPE.intype, res.type, true)
        obj.remarks = newObj.description
        let arrUnshiftObj = null
        newObj.inStockItemList.forEach(item => {
          item.invoiceNo = item.invoiceNo.trim()
          if (item.item[0].invoiceStatus) {
            item.invoiceStatus = Number(item.item[0].invoiceStatus)
          } else {
            item.invoiceStatus = 0
            if (newObj.status === 10) item.more = true
            if (newObj.status === 12) item.invoiceStatus = 1
          }
          // 入库完成 或者待审核 发票未到数据增加标识  edit = 1
          if (res.status === 11 || res.status === 100) {
            let indexs = []
            item.item.forEach((child, index) => {
              if (item.invoiceStatus === 1) child.edit = 1
              // 给状态为11的增加合并表格的标示
              const findObj = indexs.find(bbs => child.localMaterialId === bbs.localMaterialId)
              if (!findObj) {
                let count = item.item.filter(cr => cr.localMaterialId === child.localMaterialId)
                child.thisCont = count.length
                child.thisIndex = index
                // 计算每个物资的采购金额
                let nums = 0
                count.forEach(numAdd => {
                  nums = nums + parseFloat(numAdd.num)
                })
                child.showTotalPrice = floatTool.multiply(child.price, nums)
                indexs.push({localMaterialId: child.localMaterialId, index: child.thisIndex, count: child.thisCont})
              } else {
                child.thisCont = findObj.count
                child.thisIndex = findObj.index
              }
            })
            if (item.invoiceStatus === 1) {
              item.edit = 0
              arrUnshiftObj = JSON.parse(JSON.stringify(item))
            }
          }
          // 获取发票 ID 和 名字
          obj.description = {id: item.item[0].contractId, purchaseSaleType: item.item[0].supplyMode}
          // ${item.item[0].supplyMode === 1 ? '（购销）' : '（代销）'}
          obj.contractName = item.item[0].contractName ? `${item.item[0].contractName}` : '无'
          // 选出所有的物资ID和批次  然后去系统批次中查询
          item.item.forEach(child => {
            if (child.localMaterialId && child.batchNum && newObj.status === 10) {
              batchNumArr.push({localMaterialId: child.localMaterialId, batchNum: child.batchNum})
            }
            // 赋值加成率
            if (this.isBatch) {
              child.markupPercentage = (!newObj.isStaging ? child.markupPercentage : child.bonusRate) || 0
              child.ceilingPrice = (!newObj.isStaging ? child.highestCeilingPrice : child.ceilingPrice) || 0
            }
          })
        })
        if (arrUnshiftObj) {
          const index = newObj.inStockItemList.findIndex(item => item.invoiceStatus === arrUnshiftObj.invoiceStatus)
          if (~index) {
            newObj.inStockItemList.splice(index, 1)
            newObj.inStockItemList.splice(0, 0, arrUnshiftObj)
          }
        }
        obj.purchaseAcceptanceItemList = newObj.inStockItemList
        obj.supplierLocalId = newObj.supplierLocalId
        obj.totalPrice = newObj.totalPrice
        // 查询当前单据中的物资批次是否存在系统物资批次中
        if (newObj.status === 10 && batchNumArr.length) {
          await this.api.judgeBatchNumIsExist(batchNumArr).then(result => {
            if (result && result.length) {
              result.forEach(item => {
                newObj.inStockItemList.forEach(child => {
                  let findObj = child.item.find(pData => pData.localMaterialId === item.localMaterialId && pData.batchNum === item.batchNum && item.isExist)
                  if (findObj) findObj.isbatch = true
                })
              })
            }
            this.status = res.status
            this.obj = Object.assign({}, this.obj, this.newObj, obj)
          })
        } else {
          this.status = res.status
          this.obj = Object.assign({}, this.obj, this.newObj, obj)
        }
      }
      this.onloadLoading = false
    },
    handleDeleteInvoice (i) {
      this.currentRows = i
      this.$refs.dialogInvoice.open()
    },
    // 提交参数处理
    hanlderParamsData (status) {
      let description = this.obj.description || this.defaultContrct
      // 处理入库总价
      let newTotalPrice = this.$filters.formatToFinacial(this.totalPrice, 4)
      if (newTotalPrice.indexOf(',') > -1) {
        newTotalPrice = parseFloat(newTotalPrice.split(',').join(''))
      } else {
        newTotalPrice = parseFloat(newTotalPrice)
      }
      let params = Object.assign(this.newObj, {
        status: status,
        totalPrice: newTotalPrice,
        supplyMode: description.purchaseSaleType,
        storageRoomId: this.storageId,
        supplierLocalId: this.obj.supplierLocalId,
        description: this.obj.remarks
      })
      params.inStockItemList = []
      if (this.newObj && this.newObj.id) params.id = this.newObj.id
      let listObj = JSON.parse(JSON.stringify(this.obj.purchaseAcceptanceItemList))
      listObj.forEach((list, index) => {
        list.item.forEach((item, itemIndex) => {
          Object.assign(item, {
            supplyMode: description.purchaseSaleType,
            contractId: description.id,
            storageRoomId: this.storageId,
            supplierLocalId: this.obj.supplierLocalId,
          }, description.purchaseSaleType === 1 ? { invoiceStatus: list.invoiceStatus ? list.invoiceStatus : 1, invoiceNo: list.invoiceNo } : {})
          if (this.isBatch) {
            item.bonusRate = item.markupPercentage
            item.priceList = item.priceList ? item.priceList : item.serviceId ? [{ price: item.salePrice, scene: 'base' }] : []
          }
          delete item.addData
          delete item.showTotalPrice
          delete item.iname
          item.freight && delete item.freight
          if (status === 10 && !item.purchaseOrderFlag && this.obj.billCode) {
            let expectData = JSON.parse(JSON.stringify(item))
            delete expectData.expectNum
            params.inStockItemList.push(expectData)
          } else {
            params.inStockItemList.push(item)
          }
        })
      })
      if (this.obj.status === 13 && status === 10) params.status = 13
      return params
    },
    // 入库完成 补录发票
    async saveEditInvoice () {
      this.unRepeatedBtn = true
      let params = {id: this.objId, inStockItemList: []}
      JSON.parse(JSON.stringify(this.obj.purchaseAcceptanceItemList)).forEach(item => {
        if (item.edit && item.invoiceStatus === 3) {
          item.item.forEach(child => {
            params.inStockItemList.push(Object.assign({}, child, {
              invoiceStatus: item.invoiceStatus,
              invoiceNo: item.invoiceNo
            }))
          })
        }
      })
      // 验证发票号是否有重复
      if (this.invoiceNos.length) {
        const res = await componentsApi.getBillNum({invoiceNos: this.invoiceNos}).then(res => {
          return res
        })
        if (res.length) {
          let html = ''
          res.forEach(item => {
            html += '发票' + item + '与系统中已存在发票重复<br>'
          })
          this.errorInvoiceVisible = true
          this.errorInvoiceHtml = html
          this.unRepeatedBtn = false
          return false
        }
      }
      if (params.inStockItemList.length) {
        this.api.updateInStockInvoiceNo(params).then(res => {
          this.unRepeatedBtn = false
          if (res) {
            this.getDetail()
          }
        })
      } else {
        this.$messageTips(this, 'warning', '您没有修改任何内容')
        this.unRepeatedBtn = false
      }
    },
    //  submit提交
    submitForm: debounce(function (form, status, refresh) {
      this.$refs.form.$refs.form.validate(async (valid) => {
        if (valid) {
          if (this.cheListData()) {
            return this.$messageTips(this, 'warning', '入库单中还有未完善的信息，请先完善信息再提交')
          }
          // 验证发票号是否有重复
          if ((status === 11 || status === 100) && this.invoiceNos.length) {
            const res = await componentsApi.getBillNum({invoiceNos: this.invoiceNos}).then(res => {
              return res
            })
            if (res.length) {
              let html = ''
              res.forEach(item => {
                html += '发票' + item + '与系统中已存在发票重复<br>'
              })
              this.errorInvoiceVisible = true
              this.errorInvoiceHtml = html
              return false
            }
          }
          this.unRepeatedBtn = true
          this.api[status === 11 || status === 100 ? 'createOrUpdate' : 'purchase'](this.hanlderParamsData(status)).then(res => {
            let flag
            if (typeof res === 'object') {
              flag = res.flag
            } else {
              flag = res
            }
            this.unRepeatedBtn = false
            if (flag) {
              this.obj.id = ''
              this.$messageTips(this, 'success', status === 11 || status === 100 ? '提交成功' : '暂存成功')
              this.getDetail()
            }
          })
        }
      })
    }, 1000),
    confirmFormSup: function () {
      for (let i = 0; i < this.obj.purchaseAcceptanceItemList.length; i++) {
        this.obj.purchaseAcceptanceItemList[i].item = []
      }
      this.changeSupplierLocalId = [this.obj.supplierLocalId]
    },
    cancelFormSup: function () {
      this.flag = false
      supplierLocalApi.list({ name: '', offset: 0, pagesize: 20 }).then()
      this.obj.supplierLocalId = this.changeSupplierLocalId[0]
      this.changeSupplierLocalId = [this.changeSupplierLocalId[0]]
    },
    _info () {
      this.queryParams.storageRoomId = this.obj.storageRoomId = this.storageId
    },
    // 计算入库总金额
    countTotal (v) {
      let count = 0
      let biji = []
      v.length && v.forEach((item, index) => {
        let newObj = JSON.parse(JSON.stringify(item.item))
        newObj.forEach(row => {
          let price = row.price || 0
          let num = row.num || 0
          count = floatTool.add((price * num) || 0, count)
        })
        if (item.edit) {
          biji.push(index)
          if (item.showBtn) delete item.showBtn
        }
      })
      if (biji.length) {
        v[biji.length - 1].showBtn = true
      }
      this.totalPrice = !isNaN(count) ? count : 0.00
      // 提交按钮是否可以提交
      if ((this.obj.description && this.obj.description.purchaseSaleType === 2) || (this.defaultContrct && this.defaultContrct.defaultContrct === 2)) {
        let len = v[0].item.length
        !len ? this.submitBtnDisabled = true : this.submitBtnDisabled = false
      } else {
        let status = v.find(item => item.invoiceStatus === 0)
        let len = v.find(item => item.item.length)
        if (!len || status) {
          this.submitBtnDisabled = true
        } else {
          this.submitBtnDisabled = false
        }
      }
    },
    // 发票集合
    handlerInvoiceNos (data) {
      let invoiceNos = []
      data.forEach(item => {
        if (item.invoiceNo && item.invoiceStatus === 3) {
          if (this.obj.status === 11) {
            if (item.edit) invoiceNos.push(item.invoiceNo)
          } else {
            invoiceNos.push(item.invoiceNo)
          }
        }
      })
      this.invoiceNos = invoiceNos
    },
    ...patch
  },
  watch: {
    'dialogTableVisible' (v) {
      if (!v) this.handleCancelInvoice()
    },
    // 计算总价
    'obj.purchaseAcceptanceItemList': {
      handler (v) {
        this.countTotal(v)
        this.handlerInvoiceNos(v)
      },
      deep: true,
      immediate: true
    },
    // 供应商选择
    'obj.supplierLocalId' (val) {
      this.queryParams.supplierLocalId = val
    },
    'obj.description': {
      handler (v) {
        if (v) {
          this.queryParams.supplyMode = v.purchaseSaleType
          this.queryParams.contractId = v.id
        } else {
          this.queryParams.supplyMode = this.defaultContrct && this.defaultContrct.purchaseSaleType
          this.queryParams.contractId = this.defaultContrct && this.defaultContrct.id
        }
      },
      deep: true
    },
    'defaultContrct': {
      handler (v) {
        if (v) {
          this.queryParams.supplyMode = v.purchaseSaleType
          this.queryParams.contractId = v.id
        }
      },
      deep: true
    }
  },
  components: {
    addProduct,
    tipDialog,
    entryTable,
    entryTableSign,
    speedOutStorage,
    loadingCover,
  }
}
</script>
<style lang="scss" scoped>
.layout_box .panel .panel-body {
  padding: 20px;
}
.listinfo{
  box-shadow: 0px 2px 8px rgba($color: #000000, $alpha: 0.15);
  padding: 20px 30px;
  border-radius: 4px;
  margin-bottom: 30px;
  overflow: hidden;
  position: relative;
  .invoice{
    margin-top: 0;
  }
  &::after{
    content: '';
    border-left: 8px dotted #efefef;
    height: 110%;
    width: 0;
    left: 10px;
    top: -3px;
    position: absolute;
  }
  &::before{
    content: '';
    border-left: 8px dotted #efefef;
    height: 110%;
    width: 0;
    right: 10px;
    top: -3px;
    position: absolute;
  }
}
.invocieinput {
  font-size: 14px;
  /deep/ .el-input{
    margin: 5px 0;
  }
}
.invocielist{
  height: 200px;
  border:1px solid #ccc;
  overflow-y: scroll;
  margin-top: 5px;
  div{
    line-height: 32px;
    padding: 0 20px;
    cursor: pointer;
    /deep/ .el-icon-close{
      margin-top: 8px;
    }
  }
  div:hover{
    background: #409EFF;
    color: #fff;
  }
  div.selectinvo{
    background: #409EFF;
    color: #fff;
  }
}
.invocielisterror{
  div{
    line-height: 30px;
  }
}
.addlist{
  padding: 10px;
  padding-top: 0;
}
.ellipsis{
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.status {
  color: red;
  margin: 0 0 0 10px;
}
</style>
