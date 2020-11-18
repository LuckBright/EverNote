<template>
  <div>
    <ever-bread-crumb
      name="耗材入库"
      :path="obj.status == 10 ? '/goods/consumptiveenterstoragerooms/10' : '/goods/consumptiveenterstoragerooms/11'"
      showTitle="true"
      :pathTo="pathTo"
    ></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>基本信息</h4>
        <ever-form2
          :schema="schema"
          v-model="obj"
          ref="form"
          :span="12"
          :rules="rules"
          :nosubmit="true"
          :class="{readform: objId}"
        ></ever-form2>
        <!-- <div class="hr"></div> -->
        <h4>商品入库明细</h4>
        <div class="listinfo" v-for="(list, i) in obj.inStockItemList" :key="i">
          <div
            class="invoice"
            v-if="(list.items && list.items.length) || list.invoiceNo == '' || list.invoiceNo"
          >
            <el-form
              :inline="true"
              size="small"
              class="demo-form-inline"
              onsubmit="return false;"
              v-if="obj.type == 10"
            >
              <el-form-item label="发票号：" ref="invoiceTitle">
                <el-input
                  v-if="list.invoice == 1 || list.invoice == 3"
                  placeholder="请输入发票号"
                  v-model="list.invoiceNo"
                  size="small"
                  clearable
                ></el-input>
                <span v-if="list.invoice == 2">{{list.invoiceNo}}</span>
                <span
                  v-if="list.invoice == 2 && (list.invoiceNo == ' ' || list.invoiceNo == '')"
                >发票未随货</span>
              </el-form-item>
              <el-form-item style="width: 200px">
                <div v-if="!$route.query.look">
                  <el-button
                    type="text"
                    v-if="list.invoice == 3 || list.invoice == 1"
                    @click="handleSaveInvoice(list.invoiceNo, i)"
                  >保存</el-button>
                  <el-button
                    type="text"
                    v-if="list.invoice == 2 && obj.type == 10"
                    @click="handleEditInvoice(i)"
                  >修改</el-button>
                  <el-button
                    type="text"
                    v-if="list.invoice == 3 || list.invoice == 1"
                    @click="handleNoInvoice(i)"
                  >发票未随货</el-button>
                </div>
              </el-form-item>
              <el-form-item label="当前合计金额：" v-if="obj.type == 10">
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
              border
              empty-text="请先选择供应商和入库库房"
              :stripe="false"
            >
              <el-table-column show-overflow-tooltip prop label width="50">
                <template slot-scope="scope">
                  <span v-if="scope.row.id">{{scope.$index + 1}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="商品名称">
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
              <el-table-column show-overflow-tooltip prop width="100" align="center" label="单位">
                <template slot-scope="scope">
                  <span
                    v-if="scope.row.localSettingObject"
                  >
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
                show-overflow-tooltip
                prop="batchNum"
                label="生产批号"
                align="center"
                width="150"
              >
                <template slot-scope="scope">
                  <span v-if="$route.query.look || obj.type != 10">{{scope.row.batchNum}}</span>
                  <el-input
                    v-if="!$route.query.look && obj.type == 10"
                    placeholder="请输入生产批号"
                    v-model="scope.row.batchNum"
                    clearable
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop width="150" align="center" label="生产日期">
                <template slot-scope="scope">
                  <span
                    v-if="$route.query.look && scope.row.produceDate || obj.type != 10"
                  >{{scope.row.produceDate | formatDateByExp('YYYY-MM-DD')}}</span>
                  <span v-else>-</span>
                  <date-picker
                    v-if="!$route.query.look && obj.type == 10"
                    v-model="scope.row.produceDate"
                    align="right"
                    type="date"
                    placeholder="选择日期"
                    :outformat="'yyyy-MM-dd'"
                  ></date-picker>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop width="150" align="center" label="有效期">
                <template slot-scope="scope">
                  <span
                    v-if="$route.query.look && scope.row.validityDate || obj.type != 10"
                  >{{scope.row.validityDate | formatDateByExp('YYYY-MM-DD')}}</span>
                  <span v-else>-</span>
                  <date-picker
                    v-if="!$route.query.look && obj.type == 10"
                    v-model="scope.row.validityDate"
                    align="right"
                    type="date"
                    placeholder="选择日期"
                    :outformat="'yyyy-MM-dd'"
                  ></date-picker>
                </template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="expectNum"
                v-if="obj.type != 10"
                align="right"
                width="100"
                label="预期数量"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="num"
                label="入库数量"
                align="right"
                width="100"
              >
                <template slot-scope="scope">
                  <el-input
                    v-if="!$route.query.look"
                    placeholder="入库数量"
                    v-model="scope.row.num"
                    type="number"
                    @blur="handleCalcInboundNum(scope.row, scope.$index, i)"
                    clearable
                  ></el-input>
                  <span v-if="$route.query.look">{{scope.row.num}}</span>
                </template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="id"
                v-if="objId && !$route.query.look && obj.type == 10"
                width="100"
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
              <el-table-column show-overflow-tooltip prop v-else width="100" label></el-table-column>
            </el-table>
            <!-- 查询添加商品 -->
            <div v-if="objId">
              <el-table
                v-if="list.items && list.items.length && obj.type == 10"
                ref="additem"
                :class="[list.items && list.item.length ? 'additem2' : 'additem']"
                :data="list.items"
                v-ever-bind-enter="{cycle: false}"
                style="width: 100%"
                border
              >
                <el-table-column show-overflow-tooltip prop label width="50"></el-table-column>
                <el-table-column show-overflow-tooltip prop="name" label="商品名称">
                  <template slot-scope="scope">
                    <remote-select
                      ref="remoteselect"
                      :queryParams="queryParams"
                      apiName="listbuy"
                      showName="consumptiveMaterialObject"
                      :placeholder="REMOTE_METHODS_PLACEHOLDER"
                      :api="getMaterialInfoApi"
                      @selectSave="handleSelect"
                      :value="scope.row.iname"
                      :index="i"
                      :index2="scope.$index"
                    ></remote-select>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop width="100" align="center" label="单位">
                  <template slot-scope="scope">
                    <span
                      v-if="scope.row.localSettingObject"
                    >
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
                <el-table-column show-overflow-tooltip prop label="生产批号" align="center" width="150">
                  <template slot-scope="scope">
                    <el-input placeholder="请输入生产批号" v-model="scope.row.batchNum" clearable></el-input>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop width="150" align="center" label="生产日期">
                  <template slot-scope="scope">
                    <date-picker
                      v-model="scope.row.produceDate"
                      align="right"
                      type="date"
                      placeholder="选择日期"
                      :outformat="'yyyy-MM-dd'"
                    ></date-picker>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop width="150" align="center" label="有效期">
                  <template slot-scope="scope">
                    <date-picker
                      v-model="scope.row.validityDate"
                      align="right"
                      type="date"
                      placeholder="选择日期"
                      :outformat="'yyyy-MM-dd'"
                    ></date-picker>
                  </template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="expectNum"
                  v-if="obj.type != 10"
                  align="right"
                  width="100"
                  label="预期数量"
                ></el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="num"
                  label="入库数量"
                  align="right"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-input
                      placeholder="入库数量"
                      v-model="scope.row.num"
                      type="number"
                      @change="calcInboundNum(scope.row.num, i)"
                      clearable
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="id"
                  width="100"
                  align="center"
                  label="操作"
                >
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
            <span v-if="obj.type == 10">
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
    </div>
    <speed-out-storage ref="outStorageRoom" :data="obj" @handleVisible="handleVisible"></speed-out-storage>
  </div>
</template>
<script>
import api from './getinstockapi'
import supplierLocalApi from '../../store/supplierlocalapi'
import purchaseAcceptApi from '../../store/purchaseacceptapi'
import getMaterialInfoApi from '../../store/getmaterialinfoapi'
import { floatTool, debounce, SPEC_CODE, patch } from '@/util/common'
import { MATERIALTYPE, FULL_STATE, FULL_ORDER_NAME, FULL_IN_OUT_TYPE, PACKAGE_CODE } from '@/util/warehouseconfig'
import setName from '@/util/setstatusname'
import sysvalue from '@/warehouse/store/sysvalueapi'
import remoteSelect from '../joinstorage/remoteselect.vue'
import speedOutStorage from './speedoutstorageroom'
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
    name: 'createTime',
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
  unit: '',
  unitGroupItemObject: {},
  validityDate: ''
}
export default {
  mixins: [setName],
  data () {
    schema = this.createObject().schema
    let obj = this.createObject().obj
    obj.inStockItemList = [{ invoice: 1, invoiceNo: '', item: [], items: [] }]
    return {
      MATERIALTYPE,
      schema,
      obj,
      api,
      SPEC_CODE,
      getMaterialInfoApi,
      supplierLocalApi,
      tableCode,
      FULL_IN_OUT_TYPE,
      PACKAGE_CODE,
      REMOTE_METHODS_PLACEHOLDER,
      FULL_STATE,
      FULL_ORDER_NAME,
      DRAFTP: false,
      pathTo: false,
      sysBatchId: '',
      objId: this.$route.params.id,
      typeArr: [],
      dosageFormArr: [],
      temSupplierLocalId: '',
      queryParams: { materialType: MATERIALTYPE, offset: 0, pagesize: 20, storageRoomId: '' },
      rules: {},
      submitFlag: true
    }
  },
  created () {
    if (this.objId) {
      this.handleGetDetail()
    }
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
    handleGetDetail () {
      this.getDetail().then(res => {
        for (let i = 0; i < res.inStockItemList.length; i++) {
          res.inStockItemList[i].invoice = 2
          res.inStockItemList[i].items = [this.tableCode]
          if (this.$route.query.look) res.inStockItemList[i].items = []
        }
        this.sysBatchId = res.inStockItemList[0].item[0].sysBatchId
        // if (res.type === 10 && !this.$route.query.look) res.inStockItemList = [{invoice: 1, invoiceNo: '', item: [], items: [this.tableCode]}]
        this.obj = Object.assign({}, this.obj, res)
      })
    },
    handleVisible () {
      this.handleGetDetail()
    },
    handleOutStorageRoom () {
      this.$refs.outStorageRoom.open('consumptivestoreapply')
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
          res.inStockTime = res.inDate || ''
          res.statusName = this.setName(FULL_STATE.instock, res.status, true)
          res.typeName = this.setName(FULL_ORDER_NAME.intype, res.type, true)
          res.inStockTypeName = this.setName(FULL_IN_OUT_TYPE.intype, res.type, true)
          res.staffName = res.status === 11 && res.staffObject ? res.staffObject.name : ''
          for (let i = 0; i < res.inStockItemList.length; i++) {
            let itemList = res.inStockItemList[i]
            for (let k = 0; k < itemList.item.length; k++) {
              if (!itemList.item[k].validityDate) itemList.item[k].validityDate = ''
              if (!itemList.item[k].produceDate) itemList.item[k].produceDate = ''
            }
            for (let n = 0; n < res.inStockItemList[i].item.length; n++) {
              for (var j = n + 1; j < res.inStockItemList[i].item.length; j++) {
                if (res.inStockItemList[i].item[n].localMaterialId === res.inStockItemList[i].item[j].localMaterialId) {
                  delete res.inStockItemList[i].item[j].consumptiveMaterialObject
                  delete res.inStockItemList[i].item[j].unitGroupItemObject
                  delete res.inStockItemList[i].item[j].id
                  // delete res.inStockItemList[i].item[j].expectNum
                  // res.inStockItemList[i].item[j].consumptiveMaterialObject = {}
                  // res.inStockItemList[i].item[j].consumptiveMaterialObject.consumptiveType = result.inStockItemList[i].item[j].consumptiveMaterialObject.consumptiveType
                }
              }
            }
          }
          resolve(res)
        })
      })
    },
    handleSetObjtct (res) {
      if (res && res.id) {
        for (let i = 0; i < res.inStockItemList.length; i++) {
          res.inStockItemList[i].invoice = 2
          res.inStockItemList[i].items = []
        }
      }
      Object.assign(this.obj, res)
    },
    handleDeleteInvoice (i) {
      this.obj.inStockItemList.splice(i, 1)
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
          params.itemList = []
          params.status = status
          params.materialType = MATERIALTYPE
          for (let i = 0; i < this.obj.inStockItemList.length; i++) {
            if (this.obj.type !== '11' && this.obj.inStockItemList[i].invoice === 1 || this.obj.inStockItemList[i].invoice === 3) {
              this.$messageTips(this, 'warning', '还未录入或未保存发票信息，请完成后再提交')
              return
            }
            if (!this.obj.inStockItemList[i].item.length) {
              this.$messageTips(this, 'warning', '存在没有入库明细的发票，请录入明细或者删除发票后再提交')
              return
            }
            for (let n = 0; n < this.obj.inStockItemList[i].item.length; n++) {
              let item = this.obj.inStockItemList[i].item[n]
              if (item.num < 0 || !item.batchNum || !item.produceDate || !item.validityDate || item.num === '' || item.num === undefined) {
                this.$messageTips(this, 'warning', '该商品入库明细入库数量小于0，或者生产批次、生产日期、有效期信息未完成，请完成后再提交')
                return
              }
              delete params.consumptiveMaterialObject
              delete this.obj.inStockItemList[i].items
              delete params.localSettingObject
              delete params.unitGroupItemObject
              params.itemList.push(Object.assign({
                materialType: MATERIALTYPE,
                storageRoomId: this.obj.storageRoomId,
                invoiceNo: this.obj.inStockItemList[i].invoiceNo
              }, this.obj.inStockItemList[i].item[n]))
            }
          }
          this.api.createOrUpdate(params).then(res => {
            // if (res && !res.id) this.$messageTips(this, 'warning', '保存失败，请重新操作')
            if (status === 31) {
              this.$messageTips(this, 'success', '当前录入的内容已经保存，您可以稍后继续录入', '保存成功')
              return
            }
            if (res) this.$router.push('/goods/consumptiveenterstorageroomedit/' + this.objId + '?look=' + this.objId)
          })
        }
      })
    }),
    calcInboundNum (num, index) {
      if (num <= 0 && typeof num !== 'number') {
        this.$messageTips(this, 'warning', '入库数量不能小于0，请重新录入')
        return
      }
      this.obj.inStockItemList[index].items[0].totalPrice = floatTool.multiply(this.obj.inStockItemList[index].items[0].price, num)
    },
    handleAddInvoice (i) {
      if (this.obj.inStockItemList[i].invoice === 1) {
        this.$messageTips(this, 'warning', '请填写并保存发票号')
        return
      }
      let table = Object.assign({}, this.obj.inStockItemList[0].item[0], tableCode)
      this.obj.inStockItemList.push({ invoice: 1, item: [], items: [table] })
      this.obj = JSON.parse(JSON.stringify(this.obj))
    },
    handleSelect (data, index, index2) {
      for (let key in this.obj.inStockItemList[index].items[0]) {
        let item = this.obj.inStockItemList[index].items[0]
        if (data.localMaterialId) {
          if (key === 'enableDate' || key === 'num') {
            item[key] = ''
          } else if (key === 'unit') {
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
        this.$messageTips(this, 'warning', '该商品生产批次、生产日期或有效期信息未完成，请完成后再添加')
        return
      }
      for (let n = 0; n < this.obj.inStockItemList.length; n++) {
        for (let m = 0; m < this.obj.inStockItemList[n].item.length; m++) {
          if (this.obj.inStockItemList[n].item[m].localMaterialId === data.localMaterialId && this.obj.inStockItemList[n].item[m].batchNum === data.batchNum) {
            this.$messageTips(this, 'warning', '该生产批次的商品已经添加，如想修改，请删除后再添加')
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
            this.obj.inStockItemList[index].invoice = 2
          } else {
            this.$messageTips(this, 'warning', '您提交的发票号已经存在，请检查后重新录入')
          }
        })
      }
    },
    handleEditInvoice (index) {
      this.obj.inStockItemList[index].invoice = 3
    },
    handleNoInvoice (index) {
      this.obj.inStockItemList[index].invoice = 2
      this.obj.inStockItemList[index].invoiceNo = ''
    },
    handleCalcInboundNum (data, i, index) {
      this.submitFlag = false
      const parse = /^(\+)?\d*$/
      if (!parse.test(data.num)) {
        this.$messageTips(this, 'warning', '入库数量不能小于0并且不能有小数，请重新录入')
        data.num = ''
        this.obj = JSON.parse(JSON.stringify(this.obj))
        return
      }
      if (this.obj.type === 11 || this.obj.type === 12) {
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
    speedOutStorage
  }
}
</script>
