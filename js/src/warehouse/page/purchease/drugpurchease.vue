<template>
  <div id="purchease">
    <ever-bread-crumb name="采购单" showTitle="true" path="/goods/drugbuynews" :pathTo="pathTo"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <div v-if="!objId" class="main-head">
          <h4>第一步：物资类型</h4>
          <div class="type">
            <span>物资类型</span>
            <ever-select
              size="small"
              v-model="materialTypeId"
              :options="drugOrMaterialType"
              :clearable="false"
              width="300px"
            ></ever-select>
          </div>
        </div>
        <div class="main-head">
          <h4 v-if="!objId">第二步：基本信息</h4>
          <h4 v-else>基本信息</h4>
          <ever-form2
            :class="[objId ? 'readform' : '']"
            :schema="schema"
            v-model="obj"
            ref="form"
            :span="12"
            :rules="rules"
            :nosubmit="true"
          ></ever-form2>
        </div>
        <div v-if="objId" class="main-head">
          <h4>执行情况</h4>
          <el-form ref="form" label-width="120px">
            <el-form-item label="入库单：">
              <el-button
                v-if="obj.materialType == 296"
                type="text"
                @click="$router.push(obj.arriveStatus == 7 || obj.status == 5 ? `/goods/drugenterstorageroomedit/${obj.inStockId}?look=${obj.inStockId}` : `/goods/drugenterstorageroom/${obj.inStockId}`)"
              >{{obj.inStockCode}}</el-button>
              <el-button
                v-else-if="obj.materialType == 294"
                type="text"
                @click="$router.push(obj.arriveStatus == 7 || obj.status == 5 ? `/goods/consumptiveenterstorageroomedit/${obj.inStockId}?look=${obj.inStockId}` : `/goods/consumptiveenterstorageroom/${obj.inStockId}`)"
              >{{obj.inStockCode}}</el-button>
              <el-button
                v-else-if="obj.materialType == 298"
                type="text"
                @click="$router.push(obj.arriveStatus == 7 || obj.status == 5 ? `/goods/equipmententerstorageroomedit/${obj.inStockId}?look=${obj.inStockId}` : `/goods/equipmententerstorageroom/${obj.inStockId}`)"
              >{{obj.inStockCode}}</el-button>
              <span v-if="obj.status == 5" :class="'unfinish_color'">{{obj.statusName}}</span>
              <span
                v-else-if="obj.status == 4"
                class="finish_color"
              >{{setName(FULL_STATE.purchase, obj.arriveStatus, true)}}</span>
              <span v-else class="ungenerated">未生成</span>
            </el-form-item>
          </el-form>
        </div>
        <h4 v-if="!objId">第三步：添加商品</h4>
        <h4 v-else>采购商品明细</h4>
        <!-- 查询添加商品 -->
        <div class="table">
          <el-table
            :data="obj.purchaseOrderItemList"
            style="width: 100%"
            :class="[(obj.items && obj.items.length) || $route.query.look ? '' : 'table2']"
            empty-text="请先选择供应商和收货库房"
            v-ever-bind-ente="{ cycle: true }"
            :stripe="false"
          >
            <el-table-column prop label width="10"></el-table-column>
            <el-table-column prop label width="50">
              <template slot-scope="scope">
                <span>{{scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="商品名称">
              <template slot-scope="scope">
                <!-- <druglable :lable="scope.row.drugObject.specialClassify"></druglable> -->
                <span
                  v-if="scope.row.localSettingObject"
                >
                <wh-code-to-name
                  :showIcon="false"
                  :isExt="true"
                  :cType="3"
                  :patchObj="{
                    list: scope.row.localSettingObject.materialSkuObject.ext
                  }"
                ></wh-code-to-name>
                </span>
              </template>
            </el-table-column>
            <el-table-column align="center" width="80" label="单位">
              <template slot-scope="scope">
                <span
                  v-if="scope.row.localSettingObject"
                >
                <wh-single-code-to-name
                  :isExt="true"
                  :patchObj="{
                    list: scope.row.localSettingObject.materialSkuObject.ext,
                    code: PACKAGE_CODE
                  }"
                ></wh-single-code-to-name>
                </span>
              </template>
            </el-table-column>
            <el-table-column width="150" align="right" label="采购单价">
              <template slot-scope="scope">
                <div style="position: relative;">
                  <el-input-number
                    v-if="!objId"
                    class="priceInput"
                    placeholder="采购单价"
                    v-model="scope.row.price"
                    :controls="false"
                    :precision="4"
                    size="small"
                    @focus="handlePriceNum(scope.row.price)"
                    @blur="handlePrice(scope.row, scope.$index)"
                  ></el-input-number>
                  <span v-else>{{scope.row.price | formatToFinacial(4)}}</span>
                  <!-- <span v-if="scope.row.price" class="price">
                    &nbsp;元
                    <template v-if="scope.row.localSettingObject">
                      /<wh-single-code-to-name
                        :isExt="true"
                        :patchObj="{
                          list: scope.row.localSettingObject.materialSkuObject.ext,
                          code: PACKAGE_CODE
                        }"></wh-single-code-to-name>
                    </template>
                  </span> -->
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="num" label="采购数量" align="right" width="155">
              <template slot-scope="scope">
                <el-input-number
                  v-if="!objId"
                  placeholder="采购数量"
                  v-model="scope.row.num"
                  :controls="false"
                  :precision="CHINESE_MEDICINE_TYPE.includes(scope.row.localSettingObject && scope.row.localSettingObject.classifyId) ? 4 : 0"
                  size="small"
                  @focus="handleStorageNum(scope.row.num)"
                  @blur="handleNum(scope.row, scope.$index)"
                ></el-input-number>
                <span v-else>{{scope.row.num}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="totalPrice" width="150" align="right" label="采购总金额">
              <template slot-scope="scope">{{scope.row.totalPrice | formatToFinacial(4)}}</template>
            </el-table-column>
            <el-table-column v-if="!objId" prop align="center" width="80" label="操作">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="danger"
                  @click.native.prevent="handleDeleteRow(scope.row, scope.$index)"
                >删除</el-button>
              </template>
            </el-table-column>
            <el-table-column prop width="10" label></el-table-column>
          </el-table>
          <div v-if="!objId">
            <el-table
              v-if="obj.items.length"
              ref="additem"
              :class="[obj.purchaseOrderItemList.length ? 'additem2' : 'additem']"
              :data="obj.items"
              v-ever-bind-enter
              style="width: 100%"
            >
              <el-table-column prop label width="10"></el-table-column>
              <el-table-column prop label width="50"></el-table-column>
              <el-table-column prop="name" label="商品名称">
                <template slot-scope="scope">
                  <remote-select
                    ref="remoteselect"
                    :queryParams="queryParams"
                    apiName="purchaseList"
                    :api="getMaterialInfoApi"
                    @selectSave="handleSelect"
                    index="0"
                    :state="0"
                    :islocal="true"
                  ></remote-select>
                </template>
              </el-table-column>
              <el-table-column prop align="center" width="80" label="单位">
                <template slot-scope="scope">
                  <span
                    v-if="scope.row.localSettingObject.materialSkuObject"
                  >
                  <wh-single-code-to-name
                    :isExt="true"
                    :patchObj="{
                      list: scope.row.localSettingObject.materialSkuObject.ext,
                      code: PACKAGE_CODE
                    }"
                  ></wh-single-code-to-name>
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="price" align="right" width="150" label="采购单价">
                <template slot-scope="scope">
                  <el-input-number
                    size="small"
                    class="priceInput"
                    placeholder="采购单价"
                    v-model="scope.row.price"
                    :precision="4"
                    :controls="false"
                    @blur="handleTotalPrice(scope.row)"
                  ></el-input-number>
                  <!-- <span v-if="scope.row.price" class="price">
                    &nbsp;元
                    <template v-if="scope.row.localSettingObject.materialSkuObject">
                    /<wh-single-code-to-name
                      :isExt="true"
                      :patchObj="{
                        list: scope.row.localSettingObject.materialSkuObject.ext,
                        code: PACKAGE_CODE
                      }"
                    ></wh-single-code-to-name>
                    </template>
                  </span> -->
                </template>
              </el-table-column>
              <el-table-column prop="num" label="采购数量" align="right" width="155">
                <template slot-scope="scope">
                  <el-input-number
                    size="small"
                    placeholder="采购数量"
                    v-model="scope.row.num"
                    :controls="false"
                    :precision="CHINESE_MEDICINE_TYPE.includes(scope.row.localSettingObject && scope.row.localSettingObject.classifyId) ? 4 : 0"
                    @blur="handleTotalAmount(scope.row)"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column prop="totalPrice" width="150" align="center" label="采购总金额">
                <template slot-scope="scope">{{scope.row.totalPrice | formatToFinacial(4)}}</template>
              </el-table-column>
              <el-table-column prop="id" width="80" align="center" label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="primary"
                    @click.native.prevent="handleAddRow(scope.row)"
                  >添加</el-button>
                </template>
              </el-table-column>
              <el-table-column prop label width="10"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="panel-footer">
        <el-button
          type="primary"
          @click="submitForm('form')"
          v-if="!objId"
          :loading="unRepeatedBtn"
        >提交采购单</el-button>
        <el-button
          type="primary"
          @click="handleCancle"
          v-else-if="obj.arriveStatus == 6 && obj.status == 4 && objId"
        >取消</el-button>
        <el-button
          v-if="objId && printModel == 3"
          class="print_btn_01"
          type="primary"
          @click="printTable"
        >
          <i class="iconfont icon-dayinji-"></i> 打印
        </el-button>
      </div>
    </div>
    <div style="width: 700px; height: 0; overflow: hidden" id="print">
      <print-header
        id="print_header"
        :recordData="recordData.head"
        :printHeader="pHeader"
        title="采购单"
        :tableHead="tableHead"
      ></print-header>
      <print-body
        id="record_print"
        v-model="printData"
        :tableHead="tableHead"
        :recordData="recordData.head"
        :printHeader="pHeader"
      ></print-body>
      <print-footer
        id="print_footer"
        v-model="printFooterData"
        :footerArr="printFooter"
        :footerSign="footerSign"
        :createDate="createDate"
      ></print-footer>
    </div>
    <iframe
      style="position: absolute; width: 0px; height: 0px; left: -600px; top: -600px;"
      id="piframe"
    ></iframe>
    <tipDialog
      :title="dialogTitle"
      :content="dialogContent"
      @click="handleCancle"
      ref="dialog"
      :textCenter="true"
      :function="dialogFunction"
      :cancelFun="dialogCanclFun"
    ></tipDialog>
  </div>
</template>
<script>
import api from './purcheasenewapi'
import storageroomApi from '../../store/storageroomapi'
import supplierLocalApi from '../../store/supplierlocalapi'
import getMaterialInfoApi from '../../store/getmaterialinfoapi'
import { floatTool, FULL_STATE, debounce, drugOrMaterialType, GOLBAL_VAL_MATERIL_NAME, PACKAGE_CODE, parserComplex, parserJSON, patch, SPEC_CODE, CHINESE_MEDICINE_TYPE } from '@/util/common'
import setName from '@/util/setstatusname'
import remoteSelect from '../joinstorage/remoteselect'
import tipDialog from '@/warehouse/page/components/tipsdialog'
import printHeader from '../print/printheader'
import printFooter from '../print/printfooter-02'
import printBody from '../print/printbody-01'
import print from '../../schema/print'

let schema = []
let schemaItem = [
  {
    name: 'supplierLocalId',
    label: '供应商',
    comp: 'ever-remoteMethod',
    props: {
      api: supplierLocalApi,
      showName: 'supplierObject',
      initoptions: [],
      isSilentQuery: true
    },
    span: 8
  },
  {
    name: 'storageRoomId',
    label: '收货库房',
    comp: 'ever-remoteMethod',
    props: {
      api: storageroomApi,
      initoptions: [],
      // retain: materialTypeOption[0].id,
      params: {}
      // retainEqual: 'materialType',
      // isSilentQuery: true
    },
    span: 8
  },
  {
    name: 'contractNum',
    label: '合同编号',
    props: {},
    span: 8
  }
]
let readSchema = [
  {
    name: 'applyCode',
    label: '采购申请单：',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'code',
    label: '采购单号：',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'clinicName',
    label: '采购商：',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'operatorDate',
    label: '采购时间：',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'storageRoomName',
    label: '收货库房：',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'supplierName',
    label: '供应商：',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'operatorName',
    label: '采购人：',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'totalPrice',
    label: '采购金额：',
    comp: 'readonlyitem',
    props: { filter: 'formatToFinacial', filterParams: 4 },
    span: 8
  },
  {
    name: 'contractNum',
    label: '合同编号：',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'statusName',
    label: '采购单状态：',
    comp: 'readonlyitem',
    span: 8
  }
]
const float = /^(\+)?\d+(\.\d+)?/
const parse = /^(\+)?\d*$/
let tabCode = {
  localMaterialId: '',
  materialType: '',
  name: '',
  iname: '',
  unitId: '',
  localSettingObject: {},
  price: undefined,
  num: undefined,
  totalPrice: ''
}
export default {
  mixins: [setName, print],
  data () {
    schema = this.createObject().schema
    let obj = this.createObject().obj
    obj.purchaseOrderItemList = []
    obj.items = []
    return {
      materialTypeId: '',
      drugOrMaterialType,
      schema,
      obj,
      api,
      FULL_STATE,
      GOLBAL_VAL_MATERIL_NAME,
      CHINESE_MEDICINE_TYPE,
      PACKAGE_CODE,
      SPEC_CODE,
      supplierLocalApi,
      getMaterialInfoApi,
      tableCode: {},
      tabCode,
      objId: this.$route.params.id,
      dosageFormArr: [],
      typeArr: [],
      priceNum: '',
      storageNum: '',
      createDate: '',
      queryParams: { materialType: '', offset: 0, pagesize: 20, orderByClassify: true, splitFlag: 0 },
      rules: {
        storageRoomId: { required: true, message: '必填项', trigger: 'change' },
        supplierLocalId: { required: true, message: '必填项', trigger: 'change' }
      },
      oldMaterialTypeId: '',
      oldSupplierLocalId: '',
      dialogTitle: '',
      dialogContent: '',
      dialogFunction: '',
      dialogCanclFun: '',
      flag: true,
      pathTo: false,
      unRepeatedBtn: false, // 控制重复提交
      printModel: this.$ever.getClinicConfig().printModel // 打印机构类型
    }
  },
  created () {
    if (this.objId) {
      this.getDetail().then((res) => {
        Object.assign(this.obj, res)
      })
    } else {
      this.materialTypeId = this.drugOrMaterialType[0].id
      // this._info()
    }
  },
  methods: {
    printTable () {
      this.createPrint()
    },
    createPrint () {
      this.printFooterData.createDate = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      this.$nextTick(() => {
        var printTable = document.getElementById('print')
        var $iframe = document.getElementById('piframe')
        var doc = $iframe.contentWindow.document
        var win = $iframe.contentWindow
        doc.write(document.head.innerHTML)
        doc.write(printTable.innerHTML)
        setTimeout(function () {
          win.focus()
          win.print()
          doc.close()
        }, 300)
      })
    },
    createObject () {
      this.$route.params.id ? schema = readSchema : schema = schemaItem
      return {
        schema,
        obj: this.$ever.createObjFromSchema(schema)
      }
    },
    getDetail (id) {
      return new Promise((resolve, reject) => {
        api.getById({ id: id || this.objId }).then(res => {
          res.statusName = this.setName(FULL_STATE.purchase, res.status, true)
          res.items = []
          let totalMoney = 0
          this.printData = []
          if (this.printModel === 3) {
            this.pHeader[0].data = res.storageRoomName
            this.pHeader[1].data = res.supplierName
            this.pHeader[2].data = res.operatorDate
          }
          this.recordData.head.patientId = res.code
          for (let i = 0; i < res.purchaseOrderItemList.length; i++) {
            let item = res.purchaseOrderItemList[i]
            totalMoney += item.totalPrice
            this.printData.push(Object.assign({
              name: item.localSettingObject ? parserComplex({ propertys: GOLBAL_VAL_MATERIL_NAME.NAME_ONE, data: item.localSettingObject.materialSkuObject.ext }) : '',
              spec: item.localSettingObject ? parserComplex({ propertys: [SPEC_CODE], data: item.localSettingObject.materialSkuObject.ext }) : ''
            }, item, { unitId: item.localSettingObject ? parserJSON({ data: item.localSettingObject.materialSkuObject.ext, property: PACKAGE_CODE, }).trim() : '' }))
            // res.purchaseOrderItemList[i].drugObject = res.purchaseOrderItemList[i].localSettingObject.drugObject
          }
          this.printData.push({
            name: '总计',
            totalPrice: totalMoney
          })
          resolve(res)
        })
      })
    },
    submitForm: debounce(function (form) {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          if (!this.obj.purchaseOrderItemList.length) {
            this.$messageTips(this, 'warning', '采购单中还没有添加采购的商品信息，请添加完成后再提交')
            return
          }
          let params = Object.assign({}, this.obj)
          params.pageType = 'drugpurchease'
          delete params.items
          for (let n = 0; n < params.purchaseOrderItemList.length; n++) {
            params.purchaseOrderItemList[n].materialType = this.materialTypeId
            params.purchaseOrderItemList[n].unitId = this.obj.purchaseOrderItemList[n].localSettingObject.materialSkuObject ? parserJSON({ data: this.obj.purchaseOrderItemList[n].localSettingObject.materialSkuObject.ext, property: PACKAGE_CODE, key: 'id' }).trim() : ''
          }
          this.unRepeatedBtn = true
          this.api.createOrUpdate(params).then(res => {
            this.unRepeatedBtn = false
            if (res) this.$router.push('/goods/drugpurchease/' + res.id + '?look=' + res.id)
          })
        }
      })
    }),
    cancelForm: debounce(function () {
      this.api.createOrUpdate({ id: this.objId, status: 5 }).then(res => {
        if (res) {
          this.getDetail().then((res) => {
            this.obj = Object.assign({}, this.obj, res)
          })
        }
      })
    }),
    handleCancle (type) {
      if (type === 'materialTypeId') {
        this.dialogTitle = '确认是否修改物资类型'
        this.dialogContent = '采购单中已经添加当前物资类型的商品，如修改物资类型，将自动清空已添加的基本信息和商品信息'
        this.dialogFunction = this.confirmFormMI
        this.dialogCanclFun = this.cancelFormMI
      } else if (type === 'supplier') {
        this.dialogTitle = '确认是否修改采购供应商'
        this.dialogContent = '采购单中已经添加当前供应商的商品，如需修改采购供应商，将自动清空已添加的商品'
        this.dialogFunction = this.confirmFormSup
        this.dialogCanclFun = this.cancelFormSup
      } else {
        this.dialogTitle = '确认是否取消'
        this.dialogContent = '采购单取消后不能恢复，请确认是否取消？'
        this.dialogFunction = this.cancelForm
      }
      this.$refs.dialog.open()
    },
    confirmFormMI: debounce(function () {
      this.obj.purchaseOrderItemList = []
      this.obj.supplierLocalId = ''
      this.obj.storageRoomId = ''
      // this.changeMaterialTypeId = [this.materialTypeId]
      this._info()
      this._setList(false)
      this.obj.materialType = this.materialTypeId
      this.queryParams.materialType = this.materialTypeId
    }),
    cancelFormMI: debounce(function () {
      this.flag = false
      this.materialTypeId = this.oldMaterialTypeId
      this.obj.materialType = this.materialTypeId
      this.queryParams.materialType = this.materialTypeId
      // this.changeMaterialTypeId = [this.changeMaterialTypeId[0]]
    }),
    confirmFormSup: debounce(function () {
      this.obj.purchaseOrderItemList = []
      // this.oldSupplierLocalId = this.obj.supplierLocalId
    }),
    cancelFormSup: debounce(function () {
      this.flag = false
      this.obj.supplierLocalId = this.oldSupplierLocalId
      // supplierLocalApi.list({ name: '', offset: 0, pagesize: 20 }).then()
      // this.changeSupplierLocalId = [this.changeSupplierLocalId[0]]
    }),
    handleSelect (data, index, index2) {
      let code = Object.assign({}, tabCode)
      for (let key in code) {
        if (data.localMaterialId) {
          code[key] = data[key] ? data[key] : ''
        } else {
          code[key] = ''
        }
        if (key === 'price' || key === 'num') code[key] = undefined
      }
      this.$set(this.obj.items, 0, code)
    },
    handleTotalPrice (data) {
      if (data.price <= 0) {
        this.$messageTips(this, 'warning', '采购单价为0或未输入，请重新录入')
        return
      }
      data.totalPrice = floatTool.multiply(data.price, data.num)
    },
    handleTotalAmount (data) {
      if (data.num <= 0) {
        this.$messageTips(this, 'warning', '采购数量为0或未输入，请重新录入')
        return
      }
      let dataType = data.classifyId
      if (dataType !== '303' && dataType !== '304') {
        if (!parse.test(data.num)) {
          data.num = ''
          this.$messageTips(this, 'warning', '采购数量不能小于0并且不能有小数，请重新录入')
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
      } else {
        if (!float.test(data.num)) {
          data.num = ''
          this.$messageTips(this, 'warning', '采购数量不能小于0，请重新录入')
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
      }
      data.totalPrice = floatTool.multiply(data.price, data.num)
    },
    handlePrice (data, index) {
      if (data.price <= 0 || data.price === '') {
        this.$messageTips(this, 'warning', '采购单价为0或未输入，请重新录入')
        this.obj.purchaseOrderItemList[index].price = this.priceNum
        return
      }
      this.obj.purchaseOrderItemList[index].totalPrice = floatTool.multiply(this.obj.purchaseOrderItemList[index].price, data.num)
    },
    handleNum (data, index) {
      if (data.num <= 0 || data.num === '') this.obj.purchaseOrderItemList[index].num = this.storageNum
      let dataType = data.localSettingObject ? data.localSettingObject.classifyId : ''
      if (!CHINESE_MEDICINE_TYPE.includes(dataType)) {
        if (!parse.test(data.num)) {
          this.obj.purchaseOrderItemList[index].num = this.storageNum
          this.$messageTips(this, 'warning', '采购数量不能小于0并且不能有小数，请重新录入')
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
      } else {
        if (!float.test(data.num)) {
          this.obj.purchaseOrderItemList[index].num = this.storageNum
          this.$messageTips(this, 'warning', '采购数量不能小于0，请重新录入')
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
      }
      this.obj.purchaseOrderItemList[index].totalPrice = floatTool.multiply(this.obj.purchaseOrderItemList[index].price, data.num)
    },
    handleStorageNum (nums) {
      this.storageNum = nums
    },
    handlePriceNum (nums) {
      this.priceNum = nums
    },
    handleAddRow (data) {
      const rows = Object.assign({}, data)
      if (rows['num'] < 0 || rows['num'] === '' || rows['price'] < 0 || rows['price'] === '') {
        this.$messageTips(this, 'warning', '请填写采购数量或者采购单价后再添加')
        return
      }
      for (let n = 0; n < this.obj.purchaseOrderItemList.length; n++) {
        if (this.obj.purchaseOrderItemList[n].localMaterialId === rows.localMaterialId) return this.$messageTips(this, 'warning', '该商品已经添加，如想修改，请删除后再添加')
      }
      if (rows.localMaterialId) {
        this.obj.purchaseOrderItemList.push(rows)
        this.obj = JSON.parse(JSON.stringify(this.obj))
        this.$nextTick(function () {
          let code = Object.assign({}, tabCode)
          this.$set(this.obj.items, 0, code)
          this.$refs.remoteselect.select = ''
        })
      } else {
        this.$messageTips(this, 'warning', '此药品无效，请选择其他药品')
      }
    },
    handleDeleteRow (data, index) {
      this.obj.purchaseOrderItemList.splice(index, 1)
      this.obj = JSON.parse(JSON.stringify(this.obj))
    },
    _setStorageRoom (id) {
      this.queryParams.supplierLocalId = this.obj.supplierLocalId
      if (id && this.obj.supplierLocalId) {
        this._setList(true)
      } else {
        !this.$route.query.look && this._setList(false)
      }
    },
    _setList (flag) {
      if (flag) {
        let code = Object.assign({}, tabCode)
        this.obj.items[0] ? this.obj.items[0] = code : this.obj.items.push(code)
      } else {
        this.obj.items = []
      }
    },
    async _getStorageRoom (id) {
      await storageroomApi.list({ name: '', offset: 0, pagesize: 20 }).then(res => {
        if (res && res.list) {
          let storageroomArr = JSON.parse(JSON.stringify(res.list))
          this.$ever.getFieldFromSchema(this.schema, 'storageRoomId').props.initoptions = storageroomArr
        }
      })
    },
    _info () {
      // this.tableCode = Object.assign({}, this.tableCode, this.tabCode)
      this._getStorageRoom(this.materialTypeId)
    },
    ...patch
  },
  watch: {
    'materialTypeId' (type, oldType) {
      if (!this.objId) {
        this.oldMaterialTypeId = oldType
        if (type && this.flag && (this.obj.supplierLocalId || this.obj.storageRoomId || this.obj.purchaseOrderItemList.length)) {
          this.handleCancle('materialTypeId')
        } else {
          // this.materialTypeId = type
          this.queryParams.materialType = this.materialTypeId
          this.obj.materialType = this.materialTypeId
        }
        this.flag = true
        // this.changeMaterialTypeId.push(type)
        this._getStorageRoom(type)
      }
    },
    'obj.supplierLocalId' (val, oldval) {
      if (!this.objId) {
        this.queryParams.supplierLocalId = val
        this.oldSupplierLocalId = oldval
        if (this.obj.purchaseOrderItemList.length && this.flag) {
          this.handleCancle('supplier')
        }
        if (val && this.obj.storageRoomId) {
          this._setList(true)
        } else {
          this._setList(false)
        }
        this.flag = true
        // this.changeSupplierLocalId.push(val)
      }
    },
    'obj.storageRoomId' (val) {
      if (!this.objId) {
        if (val) {
          this._setStorageRoom(val)
          if (this.obj.supplierLocalId) this._setList(true)
        } else {
          this._getStorageRoom(this.materialTypeId)
        }
      }
    },
    '$route' (val) {
      this.objId = val.params.id
      if (this.objId) {
        this.schema = this.createObject().schema
        this.obj = this.createObject().obj
        this.getDetail().then((res) => {
          this.obj = Object.assign({}, this.obj, res)
          this.pathTo = true
        })
      }
    }
  },
  components: {
    printHeader,
    printFooter,
    printBody,
    remoteSelect,
    tipDialog
  }
}
</script>
<style lang="scss" scoped>
.table2 /deep/ .el-table__empty-block {
  height: 200px;
}
.readform /deep/ .el-form-item {
  margin-bottom: 0;
}
.unfinish_color {
  margin-left: 20px;
}
.finish_color {
  margin-left: 20px;
}
.status {
  display: none;
}
.main-head {
  padding: 0 0 20px 0;
}
.print_btn_01 i {
  font-size: 12px;
}
.ungenerated {
  color: #999999;
}
.type {
  font-size: 14px;
  color: #48576a;
  margin-left: 52px;
}
.type > span {
  margin-right: 6px;
}
.priceInput {
  width: 100%;
}
.price {
  line-height: 32px;
  position: absolute;
  top: 50%;
  margin-top: -16px;
  right: 13px;
}
.pricemargin{
  padding-right: 50px;
}
#purchease {
  /deep/ .is-without-controls {
    .el-input__inner{
      padding: 0;
    }
  }
}
</style>
