<template>
  <div>
    <ever-bread-crumb name="到货入库" :showTitle="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <div class="hr">
        <h4>基本信息 </h4>
        <div>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-icon-weibiaoti-"></use>
          </svg>
        </div>
        <ever-form2 :schema="schema" v-model="obj" ref="form" :span="12" :rules="rules" :nosubmit="true">
          <template slot="supplierLocalId">
            <ever-remoteMethod
              :disabled="objId ? true : false"
              v-model="obj.supplierLocalId"
              :api="supplierLocalApi"
              showName="supplierObject"
              :placeholder="REMOTE_METHODS_PLACEHOLDER"
              :isSilentQuery="true"></ever-remoteMethod>
          </template>
        </ever-form2>
      </div>
        <h4>入库明细信息</h4>
        <div class="listinfo" v-for="(list, i) in obj.purchaseAcceptanceItemList" :key="i">
          <div class="invoice" v-if="list.item.length">
            <el-form :inline="true" class="demo-form-inline" onsubmit="return false;" size="small">
              <el-form-item label="发票号：" ref="invoiceTitle">
                <el-input
                  v-if="list.invoiceStatus === 0"
                  placeholder="请输入发票号"
                  v-model="list.billNum"
                  size="small"
                  clearable>
                </el-input>
                <span v-if="list.invoiceStatus === 1">发票未到</span>
                <span v-if="list.invoiceStatus === 2">发票随货</span>
                <span v-if="list.invoiceStatus === 3">{{list.billNum}}</span>
              </el-form-item>
              <el-form-item style="width: 200px">
                <div v-if="!objId">
                  <el-button type="text" v-if="list.invoiceStatus === 0" @click="handleSaveInvoice(list.billNum, i)">保存</el-button>
                  <el-button type="text" v-if="list.invoiceStatus !== 0" @click="handleEditInvoice(i)">修改</el-button>
                  <el-button type="text" v-if="list.invoiceStatus === 0" @click="handleNoInvoice(1, i)">发票未到</el-button>
                  <el-button type="text" v-if="list.invoiceStatus === 0" @click="handleNoInvoice(2, i)">发票随货</el-button>
                </div>
              </el-form-item>
              <el-form-item label="当前合计金额：">
                <span class="yellow">¥{{calcTotalPrice(list.item, 'totalPrice') | formatToFinacial(4)}}</span>
              </el-form-item>
            </el-form>
            <div v-if="!objId">
              <el-button v-if="obj.purchaseAcceptanceItemList.length > 1" @click="handleDeleteInvoice(i)" type="text" class="deleteInvoice"><i class="icon iconfont icon-delete"></i> 删除此发票</el-button>
            </div>
          </div>
          <div class="table" id="table_expand">
            <el-table
              :data.sync="list.item"
              style="width: 100%"
              empty-text="请先选择供应商"
              ref="table"
              :row-key="'localMaterialId' + parseInt(Math.random() * 1000)"
              :expand-row-keys="list.entexpands"
              @cell-mouse-enter="rowHover"
              @row-click="rowExpand">
              <el-table-column type="expand" width="1">
                <template slot-scope="scope">
                  <div class="custom_popover pos_re">
                    <span class="pos_ab"></span>
                    <ul v-if="scope.row.purchaseAcceptanceItemDetailList && scope.row.purchaseAcceptanceItemDetailList.length">
                      <li v-for="(item, index) in scope.row.purchaseAcceptanceItemDetailList" :key="index">
                        <span v-if="item.uniqueCode" style="padding-right: 20px">{{item.uniqueCode}}</span>
                        <span v-if="item.ownUniqueCodes" style="padding-right: 20px">{{item.ownUniqueCodes}}</span>
                        <span v-if="!$route.query.look ? true : false" class="btn-del"><el-button type="text" class="red" @click="popoverDelRow(index, scope.$index, i)">删除</el-button></span>
                      </li>
                    </ul>
                    <ul v-else>
                      <li><p class="alg_c">暂无数据</p></li>
                    </ul>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="商品名称">
                <template slot-scope="scope">
                  <span v-if="scope.row.localSettingObject">
                    <wh-code-to-name
                      :isExt="true"
                      :cType="3"
                      :patchObj="{
                        list: scope.row.localSettingObject.materialSkuObject.ext
                      }"
                    ></wh-code-to-name>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="price"
                label="采购单价"
                align="right"
                width="160">
                <template slot-scope="scope">
                  <span style="float: left; width: 90px">
                    <el-input-number
                      size="small"
                      placeholder="采购单价"
                      :precision="4"
                      :controls="false"
                      v-model="scope.row.price"
                      @focus="handleCachePrice(scope.row)"
                      @blur="handlePrice(scope.row, scope.$index, i)">
                    </el-input-number>
                  </span>
                  <span style="float: left; line-height: 36px; padding-left: 5px;" v-if="scope.row.localSettingObject">元/
                    <wh-single-code-to-name
                      :isExt="true"
                      :patchObj="{
                        list: scope.row.localSettingObject.materialSkuObject.ext,
                        code: PACKAGE_CODE
                      }">
                    </wh-single-code-to-name></span>
                </template>
              </el-table-column>
              <el-table-column
                prop="num"
                align="right"
                label="入库数量"
                width="150">
                <template slot-scope="scope">
                  <div v-if="scope.row.localSettingObject && !scope.row.localSettingObject.isManageAlone" class="quantity_input">
                    <el-input
                      size="small"
                      placeholder="入库数量"
                      v-model="scope.row.num"
                      type="number"
                      @blur="handleCalcInboundNum(scope.row, scope.$index, i)">
                    </el-input>
                  </div>
                  <ever-popover v-else-if="scope.row.localSettingObject && scope.row.localSettingObject.isManageAlone" :show="$route.query.look ? true : false" :data="scope.row.purchaseAcceptanceItemDetailList" :index="scope.$index" :i="i" @handleDelRow="popoverDelRow"></ever-popover>
                  <span v-else>{{scope.row.num}}</span>
                  <span v-if="scope.row.localSettingObject && !scope.row.localSettingObject.isManageAlone">
                    <wh-single-code-to-name
                    :isExt="true"
                    :patchObj="{
                      list: scope.row.localSettingObject.materialSkuObject.ext,
                      code: PACKAGE_CODE
                    }">
                  </wh-single-code-to-name></span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip
                prop="totalPrice"
                width="100"
                align="right"
                label="入库金额">
                <template slot-scope="scope">
                  {{scope.row.totalPrice | formatToFinacial(4)}}
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip
                prop="batchNum"
                label="生产批号"
                align="center"
                width="100">
                <template slot-scope="scope">
                  <span v-if="scope.row.localSettingObject && scope.row.localSettingObject.isExpiryDate && scope.row.batchNum">{{scope.row.batchNum || '-'}}</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip
                prop="enableDate"
                align="center"
                width="140"
                label="生产日期">
                <template slot-scope="scope">
                  <span v-if="scope.row.localSettingObject && scope.row.localSettingObject.isExpiryDate && scope.row.enableDate">{{scope.row.enableDate | formatDateByExp('YYYY-MM-DD')}}</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip
                prop="overdueDate"
                align="center"
                width="140"
                label="有效期">
                <template slot-scope="scope">
                  <span v-if="scope.row.localSettingObject && scope.row.localSettingObject.isExpiryDate && scope.row.overdueDate">{{scope.row.overdueDate | formatDateByExp('YYYY-MM-DD')}}</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="id"
                v-if="!objId"
                width="80"
                label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="danger"
                    @click.native.prevent="handleDeleteRow(list.item, scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- <div v-if="!objId">
            <el-button v-if="list.item && list.item.length && i >= obj.purchaseAcceptanceItemList.length - 1" @click="handleAddInvoice(i)" type="text" icon="icon iconfont icon-tianjia">添加发票</el-button>
          </div> -->
        </div>
      </div>
      <div v-if="!objId" class="panel-body">
        <div class="addProduct">
          <add-product :orderType="true" :clear="clear" :queryParams="queryParams" :flag="queryParams.supplierLocalId" :list="obj.purchaseAcceptanceItemList" :id="obj.id" @saveObject="handleSaveAfterObj"></add-product>
        </div>
        <el-button size="small" type="primary" @click="submitForm('form', 31)" :loading="unRepeatedBtn">保存草稿</el-button>
        <el-button size="small" type="primary" @click="submitForm('form', 34)" :loading="unRepeatedBtn">入库完成</el-button>
        <el-button size="small" type="primary" @click="submitForm('form', 34, true)" :loading="unRepeatedBtn">入库完成，继续入库</el-button>
      </div>
    </div>
    <tip-dialog :title="dialogTitle" :content="dialogContent" @click="handleCancle" ref="dialog" :function="dialogFunction" :cancelFun="dialogCanclFun" :isCancel="isCancel" :btn="dialogBtn"></tip-dialog>
    <tip-dialog ref="dialogInvoice" title="删除确认" content="删除发票会连同包含的商品一起删除" :function="confirm"></tip-dialog>
  </div>
</template>
<script>
import api from '../store/enterapi'
import componentsApi from '@/warehouse/page/storages/store/componentsapi'
import supplierLocalApi from '@/warehouse/store/supplierlocalapi'
import getMaterialInfoApi from '@/warehouse/store/getmaterialinfoapi'
import { floatTool, debounce, compare, DRUGTYPE, MATERIALTYPE, patch, parserJSON, PACKAGE_CODE, SPEC_CODE } from '@/util/common'
import setName from '@/util/setstatusname'
import sysvalue from '@/warehouse/store/sysvalueapi'
import tipDialog from '@/warehouse/page/components/tipsdialog'
import remoteSelect from '../../joinstorage/remoteselect'
import addProduct from '@/warehouse/page/components/addproduct'
import everPopover from '@/warehouse/page/components/popover'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import addProductMethods from '@/warehouse/page/storages/util/addproduct'
import tableExpand from '@/warehouse/page/storages/util/tableexpand'
import { REMOTE_METHODS_PLACEHOLDER } from '@/warehouse/views/util/constant'

let schema = [
  {
    name: 'materialType',
    label: '物资类型',
    comp: 'ever-select',
    props: {
      options: [],
      clearable: false
    },
    span: 6
  },
  {
    name: 'supplierLocalId',
    label: '供应商',
    comp: 'custom',
    span: 6
  },
  {
    name: 'description',
    label: '备注',
    span: 6
  }
]
let tableCode = {
  localMaterialId: '',
  name: '',
  iname: '',
  price: undefined,
  oldPrice: undefined,
  num: '',
  totalPrice: undefined,
  batchNum: '',
  enableDate: '',
  unitId: '',
  unitGroupItemObject: {},
  overdueDate: ''
}
export default {
  mixins: [setName, getstorage, addProductMethods, tableExpand],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.purchaseAcceptanceItemList = [{ invoiceStatus: 0, billNum: '', item: [] }]
    return {
      schema,
      obj,
      api,
      SPEC_CODE,
      PACKAGE_CODE,
      getMaterialInfoApi,
      supplierLocalApi,
      tableCode,
      DRAFTP: false,
      clear: false,
      objId: this.$route.params.id,
      dosageFormArr: [],
      REMOTE_METHODS_PLACEHOLDER,
      typeArr: [],
      temSupplierLocalId: '',
      queryParams: { materialType: '', offset: 0, pagesize: 20, storageRoomId: '', orderByClassify: true, splitFlag: 0 },
      rules: {
        materialType: { required: true, message: '必填项', trigger: 'change' },
        supplierLocalId: { required: true, message: '必填项', trigger: 'change' }
      },
      disabled: true,
      isCancel: false,
      dialogBtn: '',
      dialogTitle: '',
      dialogContent: '',
      dialogFunction: '',
      dialogCanclFun: '',
      changeSupplierLocalId: [],
      flag: true,
      currentRows: 0,
      cachePrice: '',
      unRepeatedBtn: false // 控制重复提交
    }
  },
  created () {
    this.$ever.getFieldFromSchema(this.schema, 'materialType').props.options = this.materialTypeArr
    this.obj.materialType = this.materialTypeArr[0].id
    this.getDetail()
    this._info()
    sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE').then(res => {
      if (res) {
        this.typeArr = res
      }
    })
    sysvalue.listOnce('THC_WH_DRUG_FORM').then(res => {
      if (res) {
        this.dosageFormArr = res
      }
    })
  },
  methods: {
    // 采购单价变化时总额跟着变
    handleCachePrice (data) {
      if (data.price !== '' && data.price >= 0) this.cachePrice = data.price
    },
    handlePrice (data, i, index) {
      if (data.price < 0 || data.price === '') {
        this.$messageTips(this, 'warning', '采购单价不能小于0或未输入，请重新录入')
        this.obj.purchaseAcceptanceItemList[index].item[i].price = this.cachePrice
      }
      this.obj.purchaseAcceptanceItemList[index].item[i].totalPrice = floatTool.multiply(this.obj.purchaseAcceptanceItemList[index].item[i].num, data.price)
    },
    rowExpand (row, column, event) {
      if (!row.localSettingObject.isManageAlone) return
      let index = this.obj.purchaseAcceptanceItemList.findIndex(item => {
        return item.billNum === row.billNum || item.billNum === row.invoiceNo
      })
      index = index < 0 ? 0 : index
      let trs = this.$refs.table[index].$el.children[2].getElementsByTagName('tr')
      let tr = this._getTrEle(event.target)
      for (let i = 0; i < trs.length; i++) {
        trs[i].classList.remove('bg_rows')
      }
      if (this.obj.purchaseAcceptanceItemList[index].entexpands.indexOf(row.localMaterialId) < 0) {
        this.obj.purchaseAcceptanceItemList[index].entexpands = []
        this.obj.purchaseAcceptanceItemList[index].entexpands.push(row.localMaterialId)
        tr.classList.add('bg_rows')
      } else {
        this._removed(this.obj.purchaseAcceptanceItemList[index].entexpands, row.localMaterialId)
      }
    },
    popoverDelRow (i, n, m) {
      // i,当前索引； n,父索引； m,祖父索引
      let item = this.obj.purchaseAcceptanceItemList[m].item[n]
      item.purchaseAcceptanceItemDetailList.splice(i, 1)
      item.num--
      item.totalPrice = floatTool.multiply(item.price, item.num)
    },
    handleSaveAfterObj (data) {
      delete data.id
      data.invoiceNo = data.invoiceNo.trim()
      data.invoiceNo = !data.invoiceNo ? '' : data.invoiceNo
      data.oldPrice = data.oldPrice ? data.oldPrice : data.price || ''
      this.clear = false
      data.purchaseAcceptanceItemDetailList = data.inStockItemDetailStockContainerList
      delete data.inStockItemDetailStockContainerList
      data.unitId = data.localSettingObject ? parserJSON({ data: data.localSettingObject.materialSkuObject.ext, property: PACKAGE_CODE, key: 'id' }).trim() : ''
      data.enableDate = data.produceDate
      data.overdueDate = data.validityDate
      if (data.localSettingObject && data.localSettingObject.isManageAlone) data.num = data.purchaseAcceptanceItemDetailList.length
      if (this.obj.purchaseAcceptanceItemList.length === 1 && !this.obj.purchaseAcceptanceItemList[0].item.length) {
        this.obj.purchaseAcceptanceItemList = [{ billNum: data.invoiceNo, invoiceStatus: data.invoiceStatus, item: [data], entexpands: [] }]
        this.clear = true
        return
      }
      // 收集this.obj.purchaseAcceptanceItemList中已存在的当前data.localMaterialId
      let itemListAll = []
      this.obj.purchaseAcceptanceItemList.forEach(list => {
        let arr = list.item.filter(items => {
          return items.localMaterialId === data.localMaterialId
        })
        itemListAll = itemListAll.concat(arr)
      })
      for (let i = 0; i < this.obj.purchaseAcceptanceItemList.length; i++) {
        let list = this.obj.purchaseAcceptanceItemList[i]
        let itemList = list.item.filter(item => {
          return item.localMaterialId === data.localMaterialId
        })
        // 发票号存在，并且发票编号相同
        if (!this._fieldCompare(this.obj.purchaseAcceptanceItemList, 'billNum', data.invoiceNo) && list.billNum === data.invoiceNo) {
          // 验证同一个商品
          if (!this._fieldCompare(list.item, 'localMaterialId', data.localMaterialId)) {
            // 同一个商品 并且是唯一码管理
            if (data.localSettingObject && data.localSettingObject.isManageAlone) {
              if (!this._eachItemListCompare(data.purchaseAcceptanceItemDetailList, itemListAll)) {
                this.$messageTips(this, 'warning', '唯一码或商品自带码已存在，请核对后录入')
                return
              }
              this._pushUniqueCode(data, list, 'purchaseAcceptanceItemDetailList')
              this.obj = JSON.parse(JSON.stringify(this.obj))
              return
            }
            // 同一个商品，并且既不是唯一码管理也不是有效期管理
            if (data.localSettingObject && !data.localSettingObject.isExpiryDate && !data.localSettingObject.isManageAlone) {
              this._resetData(data, list)
              return
            }
            // 同一个商品，并且是有效期管理
            if (data.localSettingObject && data.localSettingObject.isExpiryDate) {
              // 没有同一个批号
              if (this._fieldCompare(itemList, 'batchNum', data.batchNum)) {
                this._modifyData(data, list)
                return
              } else {
                this.$messageTips(this, 'warning', '该发票下已存在该商品批次，请核对后在添加')
                return
              }
            }
          }
          // 验证不同的商品 整个数据列表中都不存在该数据
          if (this._fieldCompare(list.item, 'localMaterialId', data.localMaterialId)) {
            if (data.localSettingObject && data.localSettingObject.isManageAlone) {
              if (!this._eachItemListCompare(data.purchaseAcceptanceItemDetailList, itemListAll)) {
                this.$messageTips(this, 'warning', '唯一码或商品自带码已存在，请核对后录入')
                return
              }
            }
            list.item.push(data)
            this.clear = true
            return
          }
        }
        // 发票不存在
        if (this._fieldCompare(this.obj.purchaseAcceptanceItemList, 'billNum', data.invoiceNo)) {
          if (data.localSettingObject && data.localSettingObject.isManageAlone) {
            if (!this._eachItemListCompare(data.purchaseAcceptanceItemDetailList, itemListAll)) {
              this.$messageTips(this, 'warning', '唯一码或商品自带码已存在，请核对后录入')
              return
            }
          }
          this.obj.purchaseAcceptanceItemList.push({
            billNum: data.invoiceNo,
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
    getDetail () {
      if (this.$route.params.id) {
        this.api.getInfo(this.$route.params.id).then(res => {
          this.handleSetObjtct(res)
        })
      } else {
        this.api.getDRAFT({ materialType: this.obj.materialType, storageRoomId: this.storageId }).then(res => {
          this.handleSetObjtct(res)
        })
      }
    },
    handleSetObjtct (res) {
      if (res && res.id) {
        res.purchaseAcceptanceItemList = res.purchaseAcceptanceItemList
        for (let i = 0; i < res.purchaseAcceptanceItemList.length; i++) {
          if (res.purchaseAcceptanceItemList[i].item[0].invoiceStatus) {
            res.purchaseAcceptanceItemList[i].invoiceStatus = Number(res.purchaseAcceptanceItemList[i].item[0].invoiceStatus)
          } else {
            res.purchaseAcceptanceItemList[i].invoiceStatus = 0
          }
        }
        this.DRAFTP = true
      }
      Object.assign(this.obj, res)
    },
    handleDeleteInvoice (i) {
      this.currentRows = i
      this.$refs.dialogInvoice.open()
    },
    confirm () {
      this.obj.purchaseAcceptanceItemList.splice(this.currentRows, 1)
    },
    submitForm: debounce(function (form, status, refresh) {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          if (!this.obj.purchaseAcceptanceItemList[0].item.length) {
            this.$messageTips(this, 'warning', '入库单中还未添加商品，请先添加商品再提交')
            return
          }
          let params = { status }
          params = Object.assign({}, params, this.obj)
          delete params.purchaseAcceptanceItemList
          params.item = []
          params.status = status
          params.materialType = this.obj.materialType
          for (let i = 0; i < this.obj.purchaseAcceptanceItemList.length; i++) {
            if (this.obj.purchaseAcceptanceItemList[i].invoiceStatus === 0) {
              this.$messageTips(this, 'warning', '还未录入或未保存发票信息，请完成后再提交')
              return
            }
            if (!this.obj.purchaseAcceptanceItemList[i].item.length) {
              this.$messageTips(this, 'warning', '存在没有入库明细的发票，请录入明细或者删除发票后再提交')
              return
            }
            for (let n = 0; n < this.obj.purchaseAcceptanceItemList[i].item.length; n++) {
              let item = this.obj.purchaseAcceptanceItemList[i].item[n]
              if (item.localSettingObject && item.localSettingObject.isManageAlone && (!item.purchaseAcceptanceItemDetailList || (item.purchaseAcceptanceItemDetailList && !item.purchaseAcceptanceItemDetailList.length))) {
                this.$messageTips(this, 'warning', '入库商品唯一码管理，唯一码不能为空，请添加后再提交')
                return
              }
              item.produceDate = item.enableDate ? item.enableDate : item.produceDate
              item.validityDate = item.overdueDate ? item.overdueDate : item.validityDate
              if (item.localSettingObject && item.localSettingObject.isExpiryDate && !item.localSettingObject.isManageAlone && (!item.batchNum || !item.produceDate || !item.validityDate)) {
                this.$messageTips(this, 'warning', '存在商品入库明细生产批号、生产日期或有效期未添加，请添加后再提交')
                return
              }
              if (this.obj.materialType === DRUGTYPE) {
                delete this.obj.purchaseAcceptanceItemList[i].item[n].drugObject
              } else if (this.obj.materialType === MATERIALTYPE) {
                delete this.obj.purchaseAcceptanceItemList[i].item[n].consumptiveMaterialObject
              } else {
                delete this.obj.purchaseAcceptanceItemList[i].item[n].equipmentObject
              }
              for (let j = 0; j < item.purchaseAcceptanceItemDetailList.length; j++) {
                let ownCode = item.purchaseAcceptanceItemDetailList[j]
                if (ownCode.ownUniqueCodes === '') delete ownCode.ownUniqueCodes
              }
              this.obj.purchaseAcceptanceItemList[i].item[n].billNum = this.obj.purchaseAcceptanceItemList[i].billNum
              delete this.obj.purchaseAcceptanceItemList[i].item[n].localSettingObject
              params.item.push(Object.assign({
                materialType: this.obj.materialType,
                storageRoomId: this.storageId
              }, this.obj.purchaseAcceptanceItemList[i].item[n]))
            }
          }
          this.unRepeatedBtn = true
          this.api.createNew(params).then(res => {
            this.unRepeatedBtn = false
            if (res && !res.id) this.$messageTips(this, 'warning', '保存失败，请重新操作')
            if (status === 31) {
              this.getDetail()
              // this.$refs.dialog.open()
              this.handleCancle()
              return
            }
            // 刷新页面
            if (refresh) {
              this.obj = {
                description: '',
                storageRoomId: this.storageId,
                supplierLocalId: '',
                purchaseAcceptanceItemList: []
              }
              this.obj.purchaseAcceptanceItemList = [{ invoiceStatus: 0, billNum: '', item: [], items: [] }]
              this._info()
              return
            }
            if (res.flag) this.$router.push('/storages/entry/entrys/11')
          })
        }
      })
    }, 1000),
    handleCancle (type) {
      if (type === 'supplier') {
        this.dialogTitle = '确认是否修改到货入库供应商'
        this.dialogContent = '到货入库单中已经添加当前供应商的商品，如需修改到货入库供应商，将自动清空已添加的商品'
        this.dialogFunction = this.confirmFormSup
        this.dialogCanclFun = this.cancelFormSup
      } else {
        this.isCancel = true
        this.dialogContent = '当前录入的内容已经保存，您可以稍后继续录入'
        this.dialogBtn = '继续录入'
        this.dialogFunction = this.cancelForm
      }
      this.$refs.dialog.open()
    },
    confirmFormSup: function () {
      for (let i = 0; i < this.obj.purchaseAcceptanceItemList.length; i++) {
        this.obj.purchaseAcceptanceItemList[i].item = []
      }
      // this.obj.purchaseAcceptanceItemList[0].item = []
      this.changeSupplierLocalId = [this.obj.supplierLocalId]
    },
    cancelFormSup: function () {
      this.flag = false
      supplierLocalApi.list({ name: '', offset: 0, pagesize: 20 }).then()
      this.obj.supplierLocalId = this.changeSupplierLocalId[0]
      this.changeSupplierLocalId = [this.changeSupplierLocalId[0]]
    },
    calcInboundNum (data, index) {
      const float = /^(\+)?\d+(\.\d+)?/
      const parse = /^(\+)?\d*$/
      if (data.num <= 0) {
        this.$messageTips(this, 'warning', '入库数量为0或未输入，请重新录入')
        return
      }
      let dataType = data.localSettingObject ? data.localSettingObject.classifyId : ''
      if (dataType === '303' || dataType === '304') {
        if (!float.test(data.num)) {
          this.$messageTips(this, 'warning', '入库数量不能小于0，请重新录入')
          // this.obj.purchaseAcceptanceItemList[index].items[0].num = ''
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
      } else {
        if (!parse.test(data.num)) {
          this.$messageTips(this, 'warning', '入库数量不能有小数，请重新录入')
          // this.obj.purchaseAcceptanceItemList[index].items[0].num = ''
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
      }
      // this.obj.purchaseAcceptanceItemList[index].items[0].totalPrice = floatTool.multiply(this.obj.purchaseAcceptanceItemList[index].items[0].price, data.num)
    },
    handleAddInvoice (i) {
      if (this.obj.purchaseAcceptanceItemList[i].invoiceStatus === 0) {
        this.$messageTips(this, 'warning', '请填写并保存发票号')
        return
      }
      this.obj.purchaseAcceptanceItemList.push({ invoiceStatus: 0, item: [] })
      this.obj = JSON.parse(JSON.stringify(this.obj))
    },
    handleSelect (data, index, index2) {
      for (let key in this.obj.purchaseAcceptanceItemList[index].items[0]) {
        let item = this.obj.purchaseAcceptanceItemList[index].items[0]
        if (data.localMaterialId) {
          if (key === 'enableDate' || key === 'num') {
            item[key] = ''
          } else {
            item[key] = data[key] ? data[key] : ''
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
      if (!data['batchNum'] || !data['enableDate'] || !data['overdueDate'] || !data['num']) {
        this.$messageTips(this, 'warning', '该商品生产批号、生产日期和有效期信息未完成，请完成后再添加')
        return
      }
      for (let n = 0; n < this.obj.purchaseAcceptanceItemList.length; n++) {
        for (let m = 0; m < this.obj.purchaseAcceptanceItemList[n].item.length; m++) {
          if (this.obj.purchaseAcceptanceItemList[n].item[m].localMaterialId === data.localMaterialId && this.obj.purchaseAcceptanceItemList[n].item[m].batchNum === data.batchNum) {
            this.$messageTips(this, 'warning', '该生产批号的商品已经添加，如想修改，请删除后再添加')
            return
          }
        }
      }
      if (data.localMaterialId) {
        this.obj.purchaseAcceptanceItemList[i].item.push(data)
        this.obj = JSON.parse(JSON.stringify(this.obj))
        this.$nextTick(function () {
          let temCode = this.tableCode
          for (let key in temCode) {
            temCode[key] = ''
            if (key === 'price' || key === 'totalPrice') temCode[key] = undefined
          }
          // this.$set(this.obj.purchaseAcceptanceItemList[i].items, 0, temCode)
          this.$refs.remoteselect[i].select = ''
        })
      }
    },
    handleSaveInvoice (data, index) {
      if (data === '') {
        this.$messageTips(this, 'warning', '发票号不能为空，请重新输入')
        return
      }
      for (let i = 0; i < this.obj.purchaseAcceptanceItemList.length; i++) {
        if (i === index) continue
        if (this.obj.purchaseAcceptanceItemList[i].billNum.toString() === data.toString()) {
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
        componentsApi.getBillNum(params).then(res => {
          if (res === -1) {
            this.obj.purchaseAcceptanceItemList[index].invoiceStatus = 3
          } else {
            this.$messageTips(this, 'warning', '您提交的发票号已经存在，请检查后重新录入')
          }
        })
      }
    },
    handleEditInvoice (index) {
      if (this.obj.purchaseAcceptanceItemList[index].invoiceStatus === 1 || this.obj.purchaseAcceptanceItemList[index].invoiceStatus === 2) {
        this.obj.purchaseAcceptanceItemList[index].billNum = ''
      }
    },
    handleNoInvoice (status, index) {
      this.obj.purchaseAcceptanceItemList[index].invoiceStatus = status
      this.obj.purchaseAcceptanceItemList[index].billNum = ''
    },
    handleCalcInboundNum (data, i, index) {
      this.obj.purchaseAcceptanceItemList[index].item[i].totalPrice = floatTool.multiply(this.obj.purchaseAcceptanceItemList[index].item[i].num, this.obj.purchaseAcceptanceItemList[index].item[i].price)
    },
    calcTotalPrice (data, price) {
      let totalPrice = 0
      for (let i = 0; i < data.length; i++) {
        totalPrice = floatTool.add(data[i][price], totalPrice)
      }
      return !isNaN(totalPrice) ? totalPrice : 0.00
    },
    _info () {
      this.queryParams.materialType = this.obj.materialType
      this.obj.storageRoomId = this.storageId
      if (this.obj.materialType === DRUGTYPE) {
        Object.assign(this.tableCode, {
          drugObject: {}
        })
      }
    },
    // arr 当前data
    // itemListAll 页面所有list
    _eachItemListCompare (arr, itemListAll) {
      for (let j = 0; j < itemListAll.length; j++) {
        for (let m = 0; m < itemListAll[j].purchaseAcceptanceItemDetailList.length; m++) {
          let item = itemListAll[j].purchaseAcceptanceItemDetailList[m]
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
    'obj.materialType' (v) {
      this.queryParams.materialType = v
      if (!this.DRAFTP) {
        this.obj.purchaseAcceptanceItemList[0].item = []
      } else {
        this.DRAFTP = false
      }
      this.obj.supplierLocalId = ''
    },
    'obj.supplierLocalId' (val) {
      if (!this.objId) {
        // if (!this.obj.purchaseAcceptanceItemList[0].item[0]) this.changeSupplierLocalId = []
        // if (this.obj.purchaseAcceptanceItemList[0].item.length && (val || !val) && this.flag) {
        //   this.handleCancle('supplier')
        // }
        this.queryParams.supplierLocalId = val
        if (!this.DRAFTP) {
          this.obj.purchaseAcceptanceItemList[0].item = []
        }
        this.queryParams.storageRoomId = this.storageId
        // this.flag = true
        // this.changeSupplierLocalId.push(val)
      }
    }
  },
  components: {
    remoteSelect,
    addProduct,
    everPopover,
    tipDialog
  }
}
</script>
<style lang="scss" scoped>
.layout_box .panel .panel-body{ padding: 20px; }
.addProduct { margin-bottom: 20px}
.el-table__body-wrapper {
  .is-without-controls /deep/ .el-input__inner{
    padding: 0;
    width: 100px;
  }
}
</style>
