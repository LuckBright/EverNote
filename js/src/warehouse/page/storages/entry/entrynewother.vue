<template>
  <div>
    <ever-bread-crumb name="入库" showTitle="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>基本信息</h4>
        <ever-form2 :schema="schema" v-model="obj" ref="form" :span="12" :rules="rules" :nosubmit="true" :class="[objId ? 'readform' : '']">
        </ever-form2>
        <h4>商品入库明细</h4>
        <div class="listinfo" v-for="(list, i) in obj.inStockItemList" :key="i">
          <div class="invoice" v-if="(list.items && list.items.length) || list.invoiceNo === '' || list.invoiceNo">
            <el-form :inline="true" class="demo-form-inline" onsubmit="return false;" v-if="(obj.type == 10 || obj.type == 19)" size="small">
              <el-form-item label="发票号：" ref="invoiceTitle">
                <el-input
                  v-if="list.invoiceStatus === 0"
                  placeholder="请输入发票号"
                  v-model="list.invoiceNo"
                  size="small"
                  clearable>
                </el-input>
                <span v-if="list.invoiceStatus === 1">发票未到</span>
                <span v-if="list.invoiceStatus === 2">发票随货</span>
                <span v-if="list.invoiceStatus === 3">{{list.invoiceNo}}</span>
              </el-form-item>
              <el-form-item style="width: 200px">
                <div v-if="!$route.query.look">
                  <el-button type="text" v-if="list.invoiceStatus === 0" @click="handleSaveInvoice(list.invoiceNo, i)">保存</el-button>
                  <el-button type="text" v-if="list.invoiceStatus !== 0" @click="handleEditInvoice(i)">修改</el-button>
                  <el-button type="text" v-if="list.invoiceStatus === 0" @click="handleNoInvoice(1, i)">发票未到</el-button>
                  <el-button type="text" v-if="list.invoiceStatus === 0" @click="handleNoInvoice(2, i)">发票随货</el-button>
                </div>
              </el-form-item>
              <el-form-item label="当前合计金额：" v-if="(obj.type == 10 || obj.type == 19) && calcTotalPrice(list.item, 'totalPrice')">
                <span class="yellow">¥{{calcTotalPrice(list.item, 'totalPrice') | formatToFinacial(4)}}</span>
              </el-form-item>
            </el-form>
            <div v-if="objId && !$route.query.look">
              <el-button v-if="obj.inStockItemList && obj.inStockItemList.length > 1" @click="handleDeleteInvoice(i)" type="text" class="deleteInvoice"><i class="icon iconfont icon-delete"></i> 删除此发票</el-button>
            </div>
          </div>
          <div class="table" id="table_expand">
            <el-table
              :data.sync="list.item"
              style="width: 100%"
              :class="[list.items && list.items.length ? '' : 'table2']"
              empty-text="请先选择供应商和入库库房"
              ref="table"
              :row-key="'localMaterialId' + parseInt(Math.random() * 1000)"
              :expand-row-keys="list.entexpands"
              @cell-mouse-enter="rowHover"
              @row-click="rowExpand">
              <el-table-column type="expand" width="1">
                <template slot-scope="scope">
                  <div class="custom_popover pos_re">
                    <span class="pos_ab"></span>
                    <ul v-if="scope.row.inStockItemDetailStockContainerList && scope.row.inStockItemDetailStockContainerList.length">
                      <li v-for="(item, index) in scope.row.inStockItemDetailStockContainerList" :key="index">
                        <span v-if="item.uniqueCode" style="padding-right: 20px">{{item.uniqueCode}}</span>
                        <span v-if="item.ownUniqueCodes" style="padding-right: 20px">{{item.ownUniqueCodes}}</span>
                        <span v-if="!$route.query.look ? true : false" class="btn-del"><el-button type="text" class="red" @click="popoverDelRow(i, scope.$index, index)">删除</el-button></span>
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
                  <wh-code-to-name
                    v-if="scope.row.localSettingObject"
                    :isExt="true"
                    :cType="3"
                    :patchObj="{
                      list: scope.row.localSettingObject.materialSkuObject.ext
                    }">
                  </wh-code-to-name>
                </template>
              </el-table-column>
              <el-table-column prop label="规格" width="120" align="center">
                <template slot-scope="scope">
                  <wh-code-to-name
                    v-if="scope.row.localSettingObject"
                    :isExt="true"
                    :showIcon="false"
                    :patchObj="{
                      code: [[]],
                      standard: true,
                      list: scope.row.localSettingObject.materialSkuObject.ext
                    }"
                  ></wh-code-to-name>
                </template>
              </el-table-column>
              <el-table-column
                v-if="$hasPermission('Auth_menu_treasury_businessmanagement_commoditylocation')"
                align="center"
                width="120"
                label="货位号">
                <template slot-scope="scope">
                  <span>{{scope.row.freight && scope.row.freight.code ? scope.row.freight.code : '无货位号'}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip
                v-else
                prop=""
                width="80"
                align="center"
                label="单位">
                  <template slot-scope="scope">
                    <span v-if="scope.row.localSettingObject.materialSkuObject">
                      <wh-single-code-to-name
                        :isExt="true"
                        :isUnit="true"
                        :patchObj="{
                          list: scope.row.localSettingObject.materialSkuObject.ext,
                          code: PACKAGE_CODE
                        }">
                      </wh-single-code-to-name>
                    </span>
                  </template>
              </el-table-column>
              <el-table-column
                prop="num"
                label="入库数量"
                align="center"
                class="pos_re"
                width="150">
                <template slot-scope="scope">
                  <div class="quantity_input" v-if="!$route.query.look && scope.row.localSettingObject && !scope.row.localSettingObject.isManageAlone">
                    <el-input
                      placeholder="入库数量"
                      v-model="scope.row.num"
                      type="number"
                      @blur="handleCalcInboundNum(scope.row, scope.$index, i)"
                      clearable>
                    </el-input>
                  </div>
                  <ever-popover v-if="scope.row.localSettingObject && scope.row.localSettingObject.isManageAlone" :show="$route.query.look ? true : false" :data="scope.row.inStockItemDetailStockContainerList" :index="scope.$index" :i="i" @handleDelRow="handlePopoverDelRow"></ever-popover>
                  <span v-if="scope.row.localSettingObject">
                    <wh-single-code-to-name
                      :isExt="true"
                      :patchObj="{
                        list: scope.row.localSettingObject.materialSkuObject.ext,
                        code: PACKAGE_CODE
                      }">
                    </wh-single-code-to-name>
                  </span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip
                prop="batchNum"
                label="生产批号"
                align="center"
                width="150">
                <template slot-scope="scope">
                  <span v-if="(scope.row.localSettingObject && scope.row.localSettingObject.isExpiryDate) && !scope.row.localSettingObject.isManageAlone">{{scope.row.batchNum || '-'}}</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip
                prop=""
                width="150"
                align="center"
                label="生产日期">
                <template slot-scope="scope">
                  <span v-if="(scope.row.localSettingObject && scope.row.localSettingObject.isExpiryDate) && !scope.row.localSettingObject.isManageAlone && scope.row.produceDate">{{scope.row.produceDate | formatDateByExp('YYYY-MM-DD')}}</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip
                prop=""
                width="150"
                align="center"
                label="有效期">
                <template slot-scope="scope">
                  <span v-if="(scope.row.localSettingObject && scope.row.localSettingObject.isExpiryDate) && !scope.row.localSettingObject.isManageAlone && scope.row.validityDate">{{scope.row.validityDate | formatDateByExp('YYYY-MM-DD')}}</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip
                prop="expectNum"
                align="right"
                v-if="obj.type != 10 && obj.type != 19"
                width="100"
                label="预期数量">
              </el-table-column>
            </el-table>
            <!-- 查询添加商品 -->
            <div v-if="objId">
              <el-table
                v-if="list.items && list.items.length && (obj.type == 10 || obj.type == 19)"
                ref="additem"
                :class="[list.items && list.item.length ? 'additem2' : 'additem']"
                :data="list.items"
                v-ever-bind-enter="{cycle: false}"
                style="width: 100%">
                <el-table-column show-overflow-tooltip
                  prop=""
                  label=""
                  width="50">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="商品名称">
                  <template slot-scope="scope">
                    <remote-select
                      ref="remoteselect"
                      :placeholder="REMOTE_METHODS_PLACEHOLDER"
                      :queryParams="queryParams"
                      apiName="listbuy"
                      :api="getMaterialInfoApi"
                      @selectSave="handleSelect"
                      :value="scope.row.iname"
                      index="0"
                      :index2="scope.$index">
                    </remote-select>
                  </template>
                </el-table-column>
                <el-table-column prop label="规格" width="120" align="center">
                <template slot-scope="scope">
                  <wh-code-to-name
                    v-if="scope.row.localSettingObject"
                    :isExt="true"
                    :showIcon="false"
                    :patchObj="{
                      code: [[]],
                      standard: true,
                      list: scope.row.localSettingObject.materialSkuObject.ext
                    }"
                  ></wh-code-to-name>
                </template>
              </el-table-column>
                <el-table-column
                  v-if="$hasPermission('Auth_menu_treasury_businessmanagement_commoditylocation')"
                  align="center"
                  width="120"
                  label="货位号">
                  <template slot-scope="scope">
                    <span v-if="scope.row">{{scope.row.freight && scope.row.freight.code ? scope.row.freight.code : '无货位号'}}</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip
                  v-else
                  prop=""
                  width="80"
                  align="center"
                  label="单位">
                    <template slot-scope="scope">
                      <span v-if="scope.row.localSettingObject.materialSkuObject">
                        <wh-single-code-to-name
                          :isExt="true"
                          :isUnit="true"
                          :patchObj="{
                            list: scope.row.localSettingObject.materialSkuObject.ext,
                            code: PACKAGE_CODE
                          }">
                        </wh-single-code-to-name>
                      </span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip
                  prop=""
                  label="生产批号"
                  align="center"
                  width="150">
                  <template slot-scope="scope">
                    <el-input
                      placeholder="请输入生产批号"
                      v-model="scope.row.batchNum"
                      clearable>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  width="150"
                  align="center"
                  label="生产日期">
                  <template slot-scope="scope">
                    <date-picker
                      v-model="scope.row.produceDate"
                      align="right"
                      type="date"
                      placeholder="选择日期"
                      :outformat="'yyyy-MM-dd'">
                    </date-picker>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  width="150"
                  align="center"
                  label="有效期">
                  <template slot-scope="scope">
                    <date-picker
                      v-model="scope.row.validityDate"
                      align="right"
                      type="date"
                      placeholder="选择日期"
                      :outformat="'yyyy-MM-dd'">
                    </date-picker>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip
                  prop="expectNum"
                  align="center"
                  v-if="obj.type != 10 && obj.type != 19"
                  width="100"
                  label="预期数量">
                </el-table-column>
                <el-table-column
                  prop="num"
                  label="入库数量"
                  align="center"
                  width="120">
                  <template slot-scope="scope">
                    <div class="quantity_input">
                      <el-input
                        placeholder="入库数量"
                        v-model="scope.row.num"
                        type="number"
                        @blur="calcInboundNum(scope.row, i)"
                        clearable>
                      </el-input>
                    </div>
                    <span v-if="scope.row.localSettingObject">
                      <wh-single-code-to-name
                        :isExt="true"
                        :patchObj="{
                          list: scope.row.localSettingObject.materialSkuObject.ext,
                          code: PACKAGE_CODE
                        }">
                      </wh-single-code-to-name>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="id"
                  width="100"
                  align="center"
                  label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="small"
                      type="primary"
                      @click.native.prevent="handleAddRow(scope.row, i)">添加</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div v-if="objId && !$route.query.look">
            <span v-if="obj.type == 10 || obj.type == 19">
              <el-button v-if="list.item && list.item.length && i >= obj.inStockItemList.length - 1" @click="handleAddInvoice(i)" type="text" icon="icon iconfont icon-tianjia">添加发票</el-button>
            </span>
          </div>
        </div>
        <div class="addProduct" v-if="!$route.query.look && addProduct">
          <unique-output v-if="addProduct" @deleteAfter="handleDeleteAfter" @queryCodeAfter="handleQueryCodeAfter" :tableData="obj.inStockItemList" :popDeleteCode="popDeleteCode" :billCode="obj.billCode"></unique-output>
        </div>
      </div>
      <div class="panel-footer" v-if="objId && storageFlag">
        <el-button v-if="obj.status < 12 && !$route.query.look" type="primary" @click="submitForm('form', 11)" :loading="unRepeatedBtn">入库完成</el-button>
        <el-button v-if="(obj.type == 10 || obj.type == 19) && $route.query.look && !this.obj.outSign && obj.status != 12 && !isInvented" type="primary" @click="handleOutStorageRoom">快捷出库</el-button>
      </div>
    </div>
    <speed-out-storage ref="outStorageRoom" :data="obj" @handleVisible="handleVisible"></speed-out-storage>
    <tips-dialog ref="dialogInvoice" title="删除确认" content="删除发票会连同包含的商品一起删除" :function="confirm"></tips-dialog>
  </div>
</template>
<script>
import api from '../store/enterapi'
import supplierLocalApi from '@/warehouse/store/supplierlocalapi'
import purchaseAcceptApi from '@/warehouse/store/purchaseacceptapi'
import getMaterialInfoApi from '@/warehouse/store/getmaterialinfoapi'
import uniqueOutput from '@/warehouse/page/components/uniqueoutput'
import { floatTool, debounce, FULL_STATE, FULL_ORDER_NAME, PACKAGE_CODE, FULL_IN_OUT_TYPE, DRUGTYPE, EQUIPMENTTYPE, SPEC_CODE, patch } from '@/util/common'
import setName from '@/util/setstatusname'
import sysvalue from '@/warehouse/store/sysvalueapi'
import remoteSelect from '../../joinstorage/remoteselect'
import tipsDialog from '@/warehouse/page/components/tipsdialog'
import speedOutStorage from '../../enterstorageroom/speedoutstorageroom'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import addProductMethods from '@/warehouse/page/storages/util/addproduct'
import tableExpand from '@/warehouse/page/storages/util/tableexpand'
import everPopover from '@/warehouse/page/components/popover'
import { REMOTE_METHODS_PLACEHOLDER } from '@/warehouse/views/util/constant'

let schema = []
let readSchema = [
  {
    name: 'code',
    label: '入库单号:',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'typeName',
    label: '来源单据:',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'createDate',
    label: '创建时间:',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'inStockTypeName',
    label: '入库类型:',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'billCode',
    label: '来源单号:',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'staffName',
    label: '入库人:',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'statusName',
    label: '入库单状态:',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'storageRoomObject.name',
    label: '入库库房:',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'inStockTime',
    label: '入库时间:',
    comp: 'readonlyitem',
    span: 8
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
  unitGroupItemObject: {},
  validityDate: ''
}
export default {
  mixins: [setName, getstorage, addProductMethods, tableExpand],
  data () {
    schema = this.createObject().schema
    let obj = this.createObject().obj
    obj.inStockItemList = [{ invoiceStatus: 0, invoiceNo: '', item: [], items: [] }]
    return {
      schema,
      obj,
      api,
      SPEC_CODE,
      getMaterialInfoApi,
      REMOTE_METHODS_PLACEHOLDER,
      supplierLocalApi,
      tableCode,
      FULL_IN_OUT_TYPE,
      FULL_STATE,
      PACKAGE_CODE,
      FULL_ORDER_NAME,
      DRAFTP: false,
      pathTo: false,
      sysBatchId: '',
      objId: this.$route.params.id,
      dosageFormArr: [],
      temSupplierLocalId: '',
      queryParams: { materialType: '', offset: 0, pagesize: 20, storageRoomId: '' },
      rules: {},
      submitFlag: true,
      storageFlag: false,
      popDeleteCode: '',
      delTotal: 0,
      addProduct: false,
      currentRows: 0,
      unRepeatedBtn: false // 控制重复提交
    }
  },
  created () {
    this._info()
    if (this.objId) {
      this.handleGetDetail()
    }
    sysvalue.listOnce('THC_WH_DRUG_FORM').then(res => {
      if (res) {
        this.dosageFormArr = res
      }
    })
  },
  methods: {
    rowExpand (row, column, event) {
      if (!row.localSettingObject.isManageAlone) return
      let trs = this.$refs.table[0].$el.children[2].getElementsByTagName('tr')
      let tr = this._getTrEle(event.target)
      for (let i = 0; i < trs.length; i++) {
        trs[i].classList.remove('bg_rows')
      }
      if (this.obj.inStockItemList[0].entexpands.indexOf(row.localMaterialId) < 0) {
        this.obj.inStockItemList[0].entexpands = []
        this.obj.inStockItemList[0].entexpands.push(row.localMaterialId)
        tr.classList.add('bg_rows')
      } else {
        this._removed(this.obj.inStockItemList[0].entexpands, row.localMaterialId)
      }
    },
    handleQueryCodeAfter (data) {
      let localMaterialId = data.stockContainerItemObject.localMaterialId
      let uniqueCode = data.stockContainerItemObject.uniqueCode || data.stockContainerItemObject.ownUniqueCodes
      for (let i = 0; i < this.obj.inStockItemList[0].item.length; i++) {
        let item = this.obj.inStockItemList[0].item[i]
        if ((item.localMaterialId === localMaterialId && !item.inStockItemDetailStockContainerList[0]) || (item.localMaterialId === localMaterialId && item.inStockItemDetailStockContainerList[0] && this._fieldCompare(item.inStockItemDetailStockContainerList, 'uniqueCode', uniqueCode) && this._fieldCompare(item.inStockItemDetailStockContainerList, 'ownUniqueCodes', uniqueCode))) {
          item.inStockItemDetailStockContainerList.push(data.uniqueCodeAllDetailVoObject)
          item.num = item.inStockItemDetailStockContainerList.length
          return
        }
      }
      this.obj = Object.assign({}, this.obj)
    },
    handleDeleteAfter (val) {
      val = val + ''
      this.obj.inStockItemList[0].item.forEach(item => {
        for (let i = 0; i < item.inStockItemDetailStockContainerList.length; i++) {
          let temp = item.inStockItemDetailStockContainerList[i]
          if (temp.uniqueCode + '' === val || temp.ownUniqueCodes + '' === val) {
            item.inStockItemDetailStockContainerList.splice(i, 1)
            item.num = item.inStockItemDetailStockContainerList.length
          }
        }
      })
    },
    handlePopoverDelRow (i, n, m, val) {
      // i,当前索引； n,父索引； m,祖父索引; val,需要删除code的对下岗
      let item = this.obj.inStockItemList[0].item[n]
      let resCode = val.uniqueCode + ',' + val.ownUniqueCodes
      item.inStockItemDetailStockContainerList.splice(i, 1)
      item.num--
      this.popDeleteCode = resCode + ',' + this.delTotal++
      item.totalPrice = floatTool.multiply(item.price, item.num)
    },
    handleGetDetail () {
      this.getDetail().then(res => {
        for (let i = 0; i < res.inStockItemList.length; i++) {
          if (res.inStockItemList[i].item[0].invoiceStatus) {
            res.inStockItemList[i].invoiceStatus = Number(res.inStockItemList[i].item[0].invoiceStatus)
          } else {
            res.inStockItemList[i].invoiceStatus = 0
          }
          res.inStockItemList[i].items = [this.tableCode]
          if (this.$route.query.look) res.inStockItemList[i].items = []
        }
        this.sysBatchId = res.inStockItemList[0].item[0].sysBatchId
        this.obj = Object.assign({}, this.obj, res)
      })
    },
    handleVisible () {
      this.handleGetDetail()
    },
    handleOutStorageRoom () {
      this.$refs.outStorageRoom.open('business/applybusiness')
    },
    createObject () {
      this.$route.params.id ? schema = readSchema : schema = []
      return {
        schema,
        obj: this.$ever.createObjFromSchema(schema)
      }
    },
    getDetail (id) {
      return new Promise((resolve, reject) => {
        api.getById(id || this.objId).then(res => {
          // const result = JSON.parse(JSON.stringify(res))
          res.createDate = res.createTime
          res.inStockTime = res.inDate || ''
          res.statusName = this.setName(FULL_STATE.instock, res.status, true)
          res.typeName = this.setName(FULL_ORDER_NAME.intype, res.type, true)
          res.inStockTypeName = this.setName(FULL_IN_OUT_TYPE.intype, res.type, true)
          res.staffName = res.status === 11 && res.staffObject ? res.staffObject.name : ''
          if (res.inStockItemList.length) {
            for (let i = 0; i < res.inStockItemList.length; i++) {
              res.inStockItemList[i].entexpands = []
              let itemList = res.inStockItemList[i]
              for (let k = 0; k < itemList.item.length; k++) {
                if (!itemList.item[k].validityDate) itemList.item[k].validityDate = ''
                if (!itemList.item[k].produceDate) itemList.item[k].produceDate = ''
                if (itemList.item[k].expectNum && itemList.item[k].localSettingObject && !itemList.item[k].localSettingObject.isManageAlone) itemList.item[k].num = itemList.item[k].expectNum
              }
              for (let n = 0; n < res.inStockItemList[i].item.length; n++) {
                if (res.inStockItemList[i].item[n].localSettingObject && res.inStockItemList[i].item[n].localSettingObject.isManageAlone) this.addProduct = true
                let setNums = res.inStockItemList[i].item[n]
                if (setNums.localSettingObject && setNums.localSettingObject.isManageAlone) {
                  setNums.num = setNums.inStockItemDetailStockContainerList && setNums.inStockItemDetailStockContainerList.length || 0
                  setNums.totalPrice = floatTool.multiply(setNums.num, setNums.price)
                }
                for (var j = n + 1; j < res.inStockItemList[i].item.length; j++) {
                  if (res.inStockItemList[i].item[n].localMaterialId === res.inStockItemList[i].item[j].localMaterialId) {
                    delete res.inStockItemList[i].item[j].unitGroupItemObject
                  }
                }
              }
            }
          }
          this.queryParams.materialType = res.materialType
          if (res.storageRoomObject && this.storageId === res.storageRoomObject.id) {
            this.storageFlag = true
          }
          resolve(res)
        })
      })
    },
    handleDeleteInvoice (i) {
      this.currentRows = i
      this.$refs.dialogInvoice.open()
    },
    confirm () {
      this.obj.inStockItemList.splice(this.currentRows, 1)
    },
    submitForm: debounce(function (form, status) {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          if (!this.submitFlag) return
          if (!this.obj.inStockItemList[0].item.length) {
            this.$messageTips(this, 'warning', '入库单中还未添加商品，请先添加商品再提交')
            return
          }
          let params = JSON.parse(JSON.stringify(this.obj))
          delete params.inStockItemList
          params.inStockItemList = []
          params.status = status
          params.materialType = this.materialType
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
                this.$messageTips(this, 'warning', '存在商品入库明细入库数量小于0，请完成后再提交')
                return
              }
              if (item.localSettingObject && item.localSettingObject.isManageAlone && (!item.inStockItemDetailStockContainerList || (item.inStockItemDetailStockContainerList && !item.inStockItemDetailStockContainerList.length))) {
                this.$messageTips(this, 'warning', '入库商品唯一码管理，唯一码不能为空，请添加后再提交')
                return
              }
              if (item.localSettingObject && item.localSettingObject.isExpiryDate && !item.localSettingObject.isManageAlone && (!item.batchNum || !item.produceDate || !item.validityDate)) {
                this.$messageTips(this, 'warning', '存在商品入库明细生产批号、生产日期或有效期未添加，请添加后再提交')
                return
              }
              delete this.obj.inStockItemList[i].item[n].localSettingObject
              params.inStockItemList.push(Object.assign({
                materialType: this.materialType,
                storageRoomId: this.obj.storageRoomId,
                invoiceNo: this.obj.inStockItemList[i].invoiceNo
              }, this.obj.inStockItemList[i].item[n]))
              params.inStockItemList[i].drugObject && delete params.inStockItemList[i].drugObject
              params.inStockItemList[i].consumptiveMaterialObject && delete params.inStockItemList[i].consumptiveMaterialObject
              params.inStockItemList[i].equipmentObject && delete params.inStockItemList[i].equipmentObject
              params.inStockItemList[i].localSettingObject && delete params.inStockItemList[i].localSettingObject
              params.inStockItemList[i].unitGroupItemObject && delete params.inStockItemList[i].unitGroupItemObject
              params.inStockItemList[i].items && delete params.inStockItemList[i].items
            }
          }
          params.drugObject && delete params.drugObject
          params.consumptiveMaterialObject && delete params.consumptiveMaterialObject
          params.equipmentObject && delete params.equipmentObject
          params.localSettingObject && delete params.localSettingObject
          params.unitGroupItemObject && delete params.unitGroupItemObject
          params.storageRoomObject && delete params.storageRoomObject
          params.staffObject && delete params.staffObject
          this.unRepeatedBtn = true
          this.api.createOrUpdate(params).then(res => {
            this.unRepeatedBtn = false
            // if (res && !res.id) this.$messageTips(this, 'warning', '保存失败，请重新操作')
            if (status === 31) {
              this.$messageTips(this, 'success', '当前录入的内容已经保存，您可以稍后继续录入', '保存成功')
              return
            }
            if (res) this.$router.push('/storages/entry/entryedit/' + this.objId + '?look=' + this.objId)
          })
        }
      })
    }, 1000),
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
          this.obj.inStockItemList[index].items[0].num = ''
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
      } else {
        if (parse.test(data.num)) {
          // this.$messageTips(this, 'warning', '入库数量不能小于0并且不能有小数，请重新录入')
          this.obj.inStockItemList[index].items[0].num = ''
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
      }
      this.obj.inStockItemList[index].items[0].totalPrice = floatTool.multiply(this.obj.inStockItemList[index].items[0].price, data.num)
    },
    handleAddInvoice (i) {
      if (this.obj.inStockItemList[i].invoiceStatus === 0) {
        this.$messageTips(this, 'warning', '请填写并保存发票号')
        return
      }
      let table = Object.assign({}, this.obj.inStockItemList[0].item[0], tableCode)
      this.obj.inStockItemList.push({ invoiceStatus: 0, item: [], items: [table] })
      this.obj = JSON.parse(JSON.stringify(this.obj))
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
        this.$messageTips(this, 'warning', '该商品生产批号、生产日期或有效期信息未完成，请完成后再添加')
        return
      }
      for (let n = 0; n < this.obj.inStockItemList.length; n++) {
        for (let m = 0; m < this.obj.inStockItemList[n].item.length; m++) {
          if (this.obj.inStockItemList[n].item[m].localMaterialId === data.localMaterialId && this.obj.inStockItemList[n].item[m].batchNum === data.batchNum) {
            this.$messageTips(this, 'warning', '该生产批号的商品已经添加，如想修改，请删除后再添加')
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
          } else {
            this.$messageTips(this, 'warning', '您提交的发票号已经存在，请检查后重新录入')
          }
        })
      }
    },
    handleEditInvoice (index) {
      this.obj.inStockItemList[index].invoiceStatus = 0
    },
    handleNoInvoice (status, index) {
      this.obj.inStockItemList[index].invoiceStatus = status
      this.obj.inStockItemList[index].invoiceNo = ''
    },
    handleCalcInboundNum (data, i, index) {
      this.submitFlag = false
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
          data.num = ''
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
      } else {
        if (!parse.test(data.num)) {
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
            this.$messageTips(this, 'warning', '同一个商品入库数量不能大于预期数量')
            data.item[i].num = ''
            this.obj = JSON.parse(JSON.stringify(this.obj))
            return
          }
        })
      })
      this.submitFlag = true
      this.obj = JSON.parse(JSON.stringify(this.obj))
    },
    calcTotalPrice (data, price) {
      let totalPrice = 0
      for (let i = 0; i < data.length; i++) {
        totalPrice = floatTool.add(data[i][price], totalPrice)
      }
      return !isNaN(totalPrice) ? totalPrice : 0.00
    },
    _info () {
      this.queryParams.materialType = this.materialType
      this.queryParams.storageRoomId = this.storageId
      if (this.materialType === DRUGTYPE) {
        this.tableCode.drugObject = {}
      } else if (this.materialType === EQUIPMENTTYPE) {
        this.tableCode.materialCode = ''
      }
    },
    _setList (flag) {
      if (flag) {
        for (let key in this.tableCode) {
          this.tableCode[key] = ''
        }
        if (this.$route.query.look) return
        this.obj.inStockItemList[0].items = [this.tableCode]
      } else {
        this.obj.inStockItemList[0].items = []
      }
    },
    ...patch
  },
  watch: {
    '$route' (val) {
      this.objId = val.params.id
      if (this.objId) {
        this.schema = this.createObject().schema
        this.obj = this.createObject().obj
        this.handleGetDetail()
        this.pathTo = true
      }
    }
  },
  components: {
    remoteSelect,
    uniqueOutput,
    everPopover,
    speedOutStorage,
    tipsDialog
  }
}
</script>
<style lang="scss" scoped>
#table_expand /deep/ .el-table__expanded-cell .custom_popover { background: #fff; width: 35%; float: right; clear: both; margin: 20px; border: 1px solid #e9e9e9; margin-right: 200px}
</style>
