<template>
  <div>
    <ever-bread-crumb
      name="入库"
      showTitle="true"
    ></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4 class="pos_re">
          基本信息
          <!-- <el-button
            class="pos_ab"
            style="right: 20px;"
            type="text"
            @click="$router.push('/storages/entry/entryedit/' + objId)"
          >切换到新版</el-button> -->
        </h4>
        <ever-form2
          :schema="schema"
          v-model="obj"
          ref="form"
          :span="12"
          :rules="rules"
          :nosubmit="true"
          :class="[objId ? 'readform' : '']"
        ></ever-form2>
        <h4>商品入库明细</h4>
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
              v-if="(obj.type == 10 || obj.type == 19)"
            >
              <el-form-item label="发票号：" ref="invoiceTitle">
                <el-input
                  v-if="list.invoiceStatus === 0"
                  placeholder="请输入发票号"
                  v-model="list.invoiceNo"
                  size="small"
                  clearable
                ></el-input>
                <span v-if="list.invoiceStatus === 1">发票未到</span>
                <span v-if="list.invoiceStatus === 2">发票随货</span>
                <span v-if="list.invoiceStatus === 3">{{list.invoiceNo}}</span>
              </el-form-item>
              <el-form-item style="width: 200px">
                <div v-if="!$route.query.look">
                  <el-button
                    type="text"
                    v-if="list.invoiceStatus === 0"
                    @click="handleSaveInvoice(list.invoiceNo, i)"
                  >保存</el-button>
                  <el-button
                    type="text"
                    v-if="list.invoiceStatus !== 0"
                    @click="handleEditInvoice(i)"
                  >修改</el-button>
                  <el-button
                    type="text"
                    v-if="list.invoiceStatus === 0"
                    @click="handleNoInvoice(1, i)"
                  >发票未到</el-button>
                  <el-button
                    type="text"
                    v-if="list.invoiceStatus === 0"
                    @click="handleNoInvoice(2, i)"
                  >发票随货</el-button>
                </div>
              </el-form-item>
              <el-form-item
                label="当前合计金额："
                v-if="(obj.type == 10 || obj.type == 19) && calcTotalPrice(list.item, 'totalPrice')"
              >
                <span class="yellow">¥{{calcTotalPrice(list.item, 'totalPrice') | formatToFinacial(4)}}</span>
              </el-form-item>
            </el-form>
            <div v-if="objId && !$route.query.look">
              <el-button
                v-if="obj.inStockItemList && obj.inStockItemList.length > 1"
                @click="handleDeleteInvoice(i)"
                type="text"
                class="deleteInvoice"
              >
                <i class="icon iconfont icon-delete"></i> 删除此发票
              </el-button>
            </div>
          </div>
          <div class="table">
            <el-table
              :data.sync="list.item"
              style="width: 100%"
              :class="[list.items && list.items.length ? '' : 'table2']"
              empty-text="请先选择供应商和入库库房"
              :stripe="false"
            >
              <el-table-column prop="name" label="商品名称">
                <template slot-scope="scope">
                  <wh-code-to-name
                    :isExt="true"
                    :cType="3"
                    :patchObj="{
                      list: scope.row.localSettingObject.materialSkuObject.ext
                    }"
                  ></wh-code-to-name>
                </template>
              </el-table-column>
              <el-table-column
                v-if="$hasPermission('Auth_menu_treasury_businessmanagement_commoditylocation')"
                align="center"
                width="120"
                label="货位号"
              >
                <template slot-scope="scope">
                  <span>{{scope.row.freight && scope.row.freight.code ? scope.row.freight.code : '无货位号'}}</span>
                </template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                v-else
                prop
                width="80"
                align="center"
                label="单位"
              >
                <template slot-scope="scope">
                  <wh-single-code-to-name
                    v-if="scope.row.localSettingObject"
                    :isExt="true"
                    :patchObj="{
                      list: scope.row.localSettingObject.materialSkuObject.ext,
                      code: PACKAGE_CODE
                    }">
                  </wh-single-code-to-name>
                </template>
              </el-table-column>
              <el-table-column
                v-if="materialType == 298"
                prop="uniqueCode"
                label="设备唯一编码"
                width="130"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input
                    v-if="!$route.query.look && (obj.type == 10 || obj.type == 19)"
                    placeholder="设备唯一编码"
                    v-model="scope.row.uniqueCode"
                    clearable
                  ></el-input>
                  <span
                    v-if="$route.query.look || (obj.type != 10 && obj.type != 19)"
                  >{{scope.row.uniqueCode || '-'}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="batchNum" label="生产批号" align="center" width="150">
                <template slot-scope="scope">
                  <span
                    v-if="$route.query.look || (obj.type != 10 && obj.type != 19)"
                  >{{scope.row.batchNum}}</span>
                  <el-input
                    v-if="!$route.query.look && (obj.type == 10 || obj.type == 19)"
                    placeholder="请输入生产批号"
                    @input="handlerBatchNum(scope.row, scope.$index, true)"
                    v-model="scope.row.batchNum"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop width="170" align="center" label="生产日期">
                <template slot-scope="scope">
                  <span
                    v-if="($route.query.look || (obj.type != 10 && obj.type != 19)) && scope.row.produceDate"
                  >{{scope.row.produceDate | formatDateByExp('YYYY-MM-DD')}}</span>
                  <span v-else-if="$route.query.look">-</span>
                  <date-picker
                    v-if="!$route.query.look && (obj.type == 10 || obj.type == 19)"
                    v-model="scope.row.produceDate"
                    align="right"
                    type="date"
                    :disabled="scope.row.isbatch && scope.row.isbatch ? true : false"
                    placeholder="选择日期"
                    :outformat="'yyyy-MM-dd'"
                  ></date-picker>
                </template>
              </el-table-column>
              <el-table-column prop width="170" align="center" label="有效期">
                <template slot-scope="scope">
                  <span
                    v-if="($route.query.look || (obj.type != 10 && obj.type != 19)) && scope.row.validityDate"
                  >{{scope.row.validityDate | formatDateByExp('YYYY-MM-DD')}}</span>
                  <span v-else-if="$route.query.look">-</span>
                  <date-picker
                    v-if="!$route.query.look && (obj.type == 10 || obj.type == 19)"
                    v-model="scope.row.validityDate"
                    align="right"
                    type="date"
                    :disabled="scope.row.isbatch && scope.row.isbatch ? true : false"
                    placeholder="选择日期"
                    :outformat="'yyyy-MM-dd'"
                  ></date-picker>
                </template>
              </el-table-column>
              <el-table-column
                prop="expectNum"
                align="right"
                v-if="obj.type != 10 && obj.type != 19"
                width="100"
                label="预期数量"
              ></el-table-column>
              <el-table-column prop="num" label="入库数量" align="center" width="150">
                <template slot-scope="scope">
                  <div class="quantity_input">
                    <el-input-number
                      v-if="!$route.query.look"
                      placeholder="入库数量"
                      v-model="scope.row.num"
                      :controls="false"
                      :precision="CHINESE_MEDICINE_TYPE.includes(scope.row.localSettingObject && scope.row.localSettingObject.classifyId) ? 4 : 0"
                      @blur="handleCalcInboundNum(scope.row, scope.$index, i)"
                      clearable
                    ></el-input-number>
                  </div>
                  <span v-if="$route.query.look">{{scope.row.num}}</span>
                  <wh-single-code-to-name
                    v-if="scope.row.localSettingObject"
                    :isExt="true"
                    :patchObj="{
                      list: scope.row.localSettingObject.materialSkuObject.ext,
                      code: PACKAGE_CODE
                    }">
                  </wh-single-code-to-name>
                </template>
              </el-table-column>
              <el-table-column
                prop
                v-if="objId && !$route.query.look && (obj.type == 10 || obj.type == 19)"
                width="100"
                align="center"
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="obj.type == 10"
                    size="small"
                    type="danger"
                    @click.native.prevent="handleDeleteRow(list.item, scope.$index)"
                  >删除</el-button>
                </template>
              </el-table-column>
              <el-table-column prop v-else width="100" align="center" label></el-table-column>
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
                <el-table-column prop="name" label="商品名称">
                  <template slot-scope="scope">
                    <remote-select
                      ref="remoteselect"
                      :queryParams="queryParams"
                      apiName="purchaseList"
                      :api="getMaterialInfoApi"
                      @selectSave="handleSelect"
                      :placeholder="REMOTE_METHODS_PLACEHOLDER"
                      :islocal="true"
                      :value="scope.row.iname"
                      :index="i"
                      :index2="scope.$index"
                    ></remote-select>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="$hasPermission('Auth_menu_treasury_businessmanagement_commoditylocation')"
                  align="center"
                  width="120"
                  label="货位号"
                >
                  <template slot-scope="scope">
                    <span
                      v-if="scope.row.localMaterialId"
                    >{{scope.row.freight && scope.row.freight.code ? scope.row.freight.code : '无货位号'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  v-else
                  prop
                  width="80"
                  align="center"
                  label="单位"
                >
                  <template slot-scope="scope">
                    <wh-single-code-to-name
                      v-if="scope.row.localSettingObject && scope.row.localSettingObject.materialSkuObject"
                      :isExt="true"
                      :patchObj="{
                        list: scope.row.localSettingObject.materialSkuObject.ext,
                        code: PACKAGE_CODE
                      }">
                    </wh-single-code-to-name>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="materialType == 298"
                  prop="uniqueCode"
                  label="设备唯一编码"
                  width="130"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input placeholder="设备唯一编码" v-model="scope.row.uniqueCode" clearable></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop label="生产批号" align="center" width="150">
                  <template slot-scope="scope">
                    <el-input
                      placeholder="请输入生产批号"
                      v-model="scope.row.batchNum"
                      @input="handlerBatchNum(scope.row, scope.$index)">
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop width="170" align="center" label="生产日期">
                  <template slot-scope="scope">
                    <date-picker
                      v-model="scope.row.produceDate"
                      align="right"
                      type="date"
                      :disabled="scope.row.isbatch && scope.row.isbatch ? true : false"
                      placeholder="选择日期"
                      :outformat="'yyyy-MM-dd'"
                    ></date-picker>
                  </template>
                </el-table-column>
                <el-table-column prop width="170" align="center" label="有效期">
                  <template slot-scope="scope">
                    <date-picker
                      v-model="scope.row.validityDate"
                      align="right"
                      type="date"
                      :disabled="scope.row.isbatch && scope.row.isbatch ? true : false"
                      placeholder="选择日期"
                      :outformat="'yyyy-MM-dd'"
                    ></date-picker>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="expectNum"
                  align="center"
                  v-if="obj.type != 10 && obj.type != 19"
                  width="100"
                  label="预期数量"
                ></el-table-column>
                <el-table-column prop="num" label="入库数量" align="center" width="150">
                  <template slot-scope="scope">
                    <div class="quantity_input">
                      <el-input-number
                        placeholder="入库数量"
                        v-model="scope.row.num"
                        :controls="false"
                        :precision="CHINESE_MEDICINE_TYPE.includes(scope.row.localSettingObject && scope.row.localSettingObject.classifyId) ? 4 : 0"
                        @blur="calcInboundNum(scope.row, i)"
                        clearable
                      ></el-input-number>
                    </div>
                    <wh-single-code-to-name
                      v-if="scope.row.localSettingObject && scope.row.localSettingObject.materialSkuObject"
                      :isExt="true"
                      :patchObj="{
                        list: scope.row.localSettingObject.materialSkuObject.ext,
                        code: PACKAGE_CODE
                      }">
                    </wh-single-code-to-name>
                  </template>
                </el-table-column>
                <el-table-column prop="id" width="100" align="center" label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="small"
                      type="primary"
                      @click.native.prevent="handleAddRow(scope.row, i)"
                    >添加</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div v-if="objId && !$route.query.look">
            <span v-if="obj.type == 10 || obj.type == 19">
              <el-button
                v-if="list.item && list.item.length && i >= obj.inStockItemList.length - 1"
                @click="handleAddInvoice(i)"
                type="text"
                icon="icon iconfont icon-tianjia"
              >添加发票</el-button>
            </span>
          </div>
        </div>
      </div>
      <div class="panel-footer" v-if="objId && storageFlag">
        <el-button
          v-if="obj.status < 12 && !$route.query.look"
          type="primary"
          @click="submitForm('form', 11)"
          :loading="unRepeatedBtn"
        >入库完成</el-button>
        <el-button
          v-if="(obj.type == 10 || obj.type == 19) && $route.query.look && !this.obj.outSign && obj.status != 12 && !isInvented"
          type="primary"
          @click="handleOutStorageRoom"
        >快捷出库</el-button>
      </div>
    </div>
    <speed-out-storage ref="outStorageRoom" :data="obj" @handleVisible="handleVisible"></speed-out-storage>
    <tips-dialog ref="dialogInvoice" title="删除确认" content="删除发票会连同包含的商品一起删除" :function="confirm"></tips-dialog>
  </div>
</template>

<script>
import api from '../store/enterapi'
import freightapi from '@/warehouse/page/storages/store/commoditylocationapi'
import supplierLocalApi from '@/warehouse/store/supplierlocalapi'
import purchaseAcceptApi from '@/warehouse/store/purchaseacceptapi'
import getMaterialInfoApi from '@/warehouse/store/getmaterialinfoapi'
import { floatTool, debounce, parserJSON, CHINESE_MEDICINE_TYPE, PACKAGE_CODE, FULL_STATE, FULL_ORDER_NAME, FULL_IN_OUT_TYPE, SPEC_CODE, patch } from '@/util/common'
import setName from '@/util/setstatusname'
import sysvalue from '@/warehouse/store/sysvalueapi'
import remoteSelect from '../../joinstorage/remoteselect'
import tipsDialog from '@/warehouse/page/components/tipsdialog'
import speedOutStorage from '../../enterstorageroom/speedoutstorageroom'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import { REMOTE_METHODS_PLACEHOLDER, BUSINESS_TYPE_COLLECT } from '@/warehouse/views/util/constant'
import accessStorageMixins from '@/warehouse/page/storages/mixins/accessstorage.mixins.js' // 出入库审核系列操作

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
let tableCode = {
  localMaterialId: '',
  name: '',
  iname: '',
  price: '',
  num: undefined,
  totalPrice: '',
  batchNum: '',
  produceDate: '',
  unitId: '',
  localSettingObject: {},
  validityDate: '',
  freight: {}
}
export default {
  mixins: [setName, getstorage, accessStorageMixins],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.inStockItemList = [{ invoiceStatus: 0, invoiceNo: '', item: [], items: [] }]
    return {
      schema,
      obj,
      api,
      SPEC_CODE,
      parserJSON,
      CHINESE_MEDICINE_TYPE,
      PACKAGE_CODE,
      getMaterialInfoApi,
      supplierLocalApi,
      tableCode,
      REMOTE_METHODS_PLACEHOLDER,
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
      queryParams: { materialType: '', offset: 0, pagesize: 20, orderByClassify: true },
      rules: {},
      examine: false,
      entryexamine: this.$hasPermission('Auth_menu_treasury_businessmanagement_entryexamine'), // 是否有审核按钮权限
      submitFlag: true,
      storageFlag: false,
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
    getExamine () {
      let type = BUSINESS_TYPE_COLLECT.find(type => { return type.id === this.warehousingType })
      if (type) {
        let settingItemLimits = this.processConfig.storageroomSystemConfig && this.processConfig.storageroomSystemConfig.settingItemLimits || []
        settingItemLimits.length && settingItemLimits.forEach(item => {
          if (`${item.orderType}` === type.examine) {
            this.examine = !item.status
          }
        })
      }
    },
    handlerBatchNum (v, index, flag) {
      if (v && v.batchNum && v.localMaterialId) {
        api.getStockBatchNum({ localMaterialId: v.localMaterialId, batchNum: v.batchNum }).then(res => {
          if (res && res.length) {
            if (flag) {
              this.obj.inStockItemList[0].item[index].validityDate = res[0].validityDate
              this.obj.inStockItemList[0].item[index].produceDate = res[0].produceDate
              this.obj.inStockItemList[0].item[index].isbatch = true
            } else {
              this.obj.inStockItemList[0].items[index].validityDate = res[0].validityDate
              this.obj.inStockItemList[0].items[index].produceDate = res[0].produceDate
              this.obj.inStockItemList[0].items[index].isbatch = true
            }
          } else {
            if (flag) {
              this.obj.inStockItemList[0].item[index].validityDate = ''
              this.obj.inStockItemList[0].item[index].produceDate = ''
              this.obj.inStockItemList[0].item[index].isbatch = false
            } else {
              this.obj.inStockItemList[0].items[index].validityDate = ''
              this.obj.inStockItemList[0].items[index].produceDate = ''
              this.obj.inStockItemList[0].items[index].isbatch = false
            }
          }
        })
      }
    },
    _info () {
      this.queryParams.materialType = this.materialType
      this.queryParams.storageRoomId = this.storageId
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
    getDetail (id) {
      return new Promise((resolve, reject) => {
        api.getById(id || this.objId).then(res => {
          // const result = JSON.parse(JSON.stringify(res))
          // 采购&到货入库单增加供应商显示
          let supplierArr = [{ name: 'supplierName', label: '供应商:', comp: 'readonlyitem', span: 8 }]
          if (res.type === FULL_IN_OUT_TYPE.intype[5].id) {
            this.schema = [...this.schema, ...supplierArr]
            Object.assign(this.obj, { supplierName: '' })
            if (res && res.supplierObject && res.supplierObject.name) res.supplierName = res.supplierObject.name
          }
          res.createDate = res.createTime
          res.inStockTime = res.inDate || ''
          res.statusName = this.setName(FULL_STATE.instock, res.status, true)
          res.typeName = this.setName(FULL_ORDER_NAME.intype, res.type, true)
          res.inStockTypeName = this.setName(FULL_IN_OUT_TYPE.intype, res.type, true)
          res.staffName = res.status === 11 && res.staffObject ? res.staffObject.name : ''
          this.queryParams.supplierLocalId = res.supplierLocalId
          if (res.inStockItemList.length) {
            for (let i = 0; i < res.inStockItemList.length; i++) {
              let itemList = res.inStockItemList[i]
              for (let k = 0; k < itemList.item.length; k++) {
                if (!itemList.item[k].validityDate) itemList.item[k].validityDate = ''
                if (!itemList.item[k].produceDate) itemList.item[k].produceDate = ''
              }
              for (let n = 0; n < res.inStockItemList[i].item.length; n++) {
                for (var j = n + 1; j < res.inStockItemList[i].item.length; j++) {
                  if (res.inStockItemList[i].item[n].localMaterialId === res.inStockItemList[i].item[j].localMaterialId) {
                    delete res.inStockItemList[i].item[j].unitGroupItemObject
                    // delete res.inStockItemList[i].item[j].expectNum
                  }
                }
              }
            }
          }
          this.getExamine()
          if (res.storageRoomObject && this.storageId === res.storageRoomObject.id) {
            this.storageFlag = true
          }
          resolve(res)
        })
      })
    },
    handleVisible () {
      this.handleGetDetail()
    },
    handleOutStorageRoom () {
      this.$refs.outStorageRoom.open('business/applybusiness')
    },
    handleDeleteInvoice (i) {
      this.currentRows = i
      this.$refs.dialogInvoice.open()
    },
    confirm () {
      this.obj.inStockItemList.splice(this.currentRows, 1)
    },
    submitForm: debounce(function (form, status) {
      if (!this._checkIsManageAlone()) {
        return
      }
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          if (!this.submitFlag) return
          if (!this.obj.inStockItemList[0].item.length) {
            this.$messageTips(this, 'warning', '入库单中还未添加商品，请先添加商品再提交')
            return
          }
          let materialType = ''
          let supplierLocalId = ''
          let params = JSON.parse(JSON.stringify(this.obj))
          delete params.inStockItemList
          delete params.storageRoomObject
          delete params.staffObject
          params.inStockItemList = []
          params.status = status
          // params.materialType = this.materialType
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
              // 添加物资单位id
              item.unitId = item.localSettingObject ? parserJSON({ data: item.localSettingObject.materialSkuObject.ext, property: PACKAGE_CODE, key: 'id' }) : ''
              if (item.num < 0 || !item.batchNum || !item.produceDate || !item.validityDate || item.num === '' || item.num === undefined) {
                this.$messageTips(this, 'warning', '该商品入库明细入库数量小于0，或者生产批号、生产日期、有效期信息未完成，请完成后再提交')
                return
              }
              materialType = this.obj.inStockItemList[i].item[n].localSettingObject.materialType
              supplierLocalId = this.obj.supplierLocalId
              delete this.obj.inStockItemList[i].items
              delete this.obj.inStockItemList[i].item[n].localSettingObject
              delete params.localSettingObject
              delete params.unitGroupItemObject
              delete params.materialType
              item.inStockId = this.obj.id
              // item.materialType = item.materialType
              params.inStockItemList.push(Object.assign(item, {
                materialType: materialType,
                supplierLocalId: supplierLocalId,
                storageRoomId: this.obj.storageRoomId,
                invoiceNo: this.obj.inStockItemList[i].invoiceNo,
                invoiceStatus: this.obj.inStockItemList[i].invoiceStatus
              }))
            }
          }
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
        if (!parse.test(data.num)) {
          this.$messageTips(this, 'warning', '入库数量不能小于0并且不能有小数，请重新录入')
          this.obj.inStockItemList[index].items[0].num = ''
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
      }
      this.obj.inStockItemList[index].items[0].totalPrice = floatTool.multiply(this.obj.inStockItemList[index].items[0].price, data.num)
    },
    handleAddInvoice (i) {
      if (!this._checkIsManageAlone()) {
        return
      }
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
          item[key] = data[key] ? data[key] : ''
        } else {
          item[key] = ''
        }
        if (key === 'num') item[key] = undefined
      }
      //  为物资单独查询货位号
      let params = {
        localMaterialId: data.localMaterialId,
        materialType: data.materialType,
        offset: 0,
        pagesize: 10,
        storageRoomId: this.storageId
      }
      freightapi.list(params).then(res => {
        if (res && res.list && res.list.length) {
          delete res.list[0].itemList
          this.obj.inStockItemList[index].items[0]['freight'] = res.list[0]
        }
      })
    },
    handleDeleteRow (data, index) {
      if (!this._checkIsManageAlone()) {
        return
      }
      data.splice(index, 1)
      this.obj = JSON.parse(JSON.stringify(this.obj))
    },
    handleAddRow (data, i) {
      if (data.localSettingObject && data.localSettingObject.isManageAlone) {
        this.$messageTips(this, 'warning', '该商品是唯一码管理商品，请点击右上角切换到新版页面操作入库')
        return
      }
      if (!this._checkIsManageAlone()) {
        return
      }
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
          for (let key in this.tableCode) {
            this.tableCode[key] = ''
            if (key === 'num') this.tableCode[key] = undefined
          }
          this.$set(this.obj.inStockItemList[i].items, 0, this.tableCode)
          this.$refs.remoteselect[i].select = ''
        })
      }
    },
    handleSaveInvoice (data, index) {
      if (!this._checkIsManageAlone()) {
        return
      }
      if (!data) return
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
            this.obj.inStockItemList[index].billNum = data
          } else {
            this.$messageTips(this, 'warning', '您提交的发票号已经存在，请检查后重新录入')
          }
        })
      }
    },
    handleEditInvoice (index) {
      if (!this._checkIsManageAlone()) {
        return
      }
      this.obj.inStockItemList[index].invoiceStatus = 0
      this.obj.inStockItemList[index].invoiceNo.trim()
    },
    handleNoInvoice (status, index) {
      if (!this._checkIsManageAlone()) {
        return
      }
      this.obj.inStockItemList[index].invoiceStatus = status
      this.obj.inStockItemList[index].invoiceNo = ''
    },
    handleCalcInboundNum (data, i, index) {
      if (!this._checkIsManageAlone()) {
        return
      }
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
          // 采购入库 不校验预期数量和入库数量
          if (this.obj.type !== '10' && item.expectNum < item.num) {
            this.$messageTips(this, 'warning', '同一个商品入库数量不能大于预期数量')
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
    _checkIsManageAlone () {
      for (let i = 0; i < this.obj.inStockItemList.length; i++) {
        for (let n = 0; n < this.obj.inStockItemList[i].item.length; n++) {
          let item = this.obj.inStockItemList[i].item[n]
          if (item.localSettingObject.isManageAlone) {
            this.$messageTips(this, 'warning', '该入库单存在唯一码管理商品，请点击右上角切换到新版页面操作入库')
            return false
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
    remoteSelect,
    speedOutStorage,
    tipsDialog
  }
}
</script>
<style scoped lang="scss">
.el-table__body-wrapper {
  .is-without-controls /deep/ .el-input__inner{
    padding: 0;
    width: 100px;
  }
}
</style>

