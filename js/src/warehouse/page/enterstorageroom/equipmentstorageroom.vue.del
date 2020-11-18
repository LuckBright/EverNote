<template>
  <div>
    <ever-bread-crumb
      name="设备入库"
      :path="obj.status == 10 ? '/goods/equipmententerstoragerooms/10' : '/goods/equipmententerstoragerooms/11'"
      showTitle="true"
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
          :class="[objId ? 'readform' : '']"
        ></ever-form2>
        <!-- <div class="hr"></div> -->
        <h4>待入库商品明细</h4>
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
                <div v-if="!objId">
                  <el-button
                    type="text"
                    v-if="list.invoice == 3 || list.invoice == 1"
                    @click="handleSaveInvoice(list.invoiceNo, i)"
                  >保存</el-button>
                  <el-button type="text" v-if="list.invoice == 2" @click="handleEditInvoice(i)">修改</el-button>
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
            <div v-if="!objId">
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
                    }"
                  ></wh-single-code-to-name>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="batchNum"
                width="150"
                align="center"
                v-if="obj.type > 10"
                label="生产批号"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop
                width="150"
                align="center"
                v-if="obj.type > 10"
                label="生产日期"
              >
                <template slot-scope="scope">
                  <span
                    v-if="scope.row.produceDate || obj.type == 11"
                  >{{scope.row.produceDate | formatDateByExp('YYYY-MM-DD')}}</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop
                width="150"
                align="center"
                v-if="obj.type > 10"
                label="有效期"
              >
                <template slot-scope="scope">
                  <span
                    v-if="scope.row.validityDate || obj.type == 11"
                  >{{scope.row.validityDate | formatDateByExp('YYYY-MM-DD')}}</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="expectNum"
                label="预期数量"
                align="right"
                width="100"
              ></el-table-column>
            </el-table>
            <!-- 查询添加商品 -->
            <div v-if="!objId">
              <el-table
                v-if="list.items && list.items.length"
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
                      :placeholder="REMOTE_METHODS_PLACEHOLDER"
                      showName="equipmentObject"
                      :api="getMaterialInfoApi"
                      @selectSave="handleSelect"
                      :value="scope.row.iname"
                      :index="i"
                      :index2="scope.$index"
                    ></remote-select>
                  </template>
                </el-table-column>
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
                      @change="calcInboundNum(scope.row.num, i)"
                      clearable
                    ></el-input>
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
                      v-model="scope.row.enableDate"
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
                      v-model="scope.row.overdueDate"
                      align="right"
                      type="date"
                      placeholder="选择日期"
                      :outformat="'yyyy-MM-dd'"
                    ></date-picker>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="id" width="100" label="操作">
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
          <div v-if="!objId">
            <el-button
              v-if="list.item && list.item.length && i >= obj.inStockItemList.length - 1"
              @click="handleAddInvoice(i)"
              type="text"
              icon="icon iconfont icon-tianjia"
            >添加发票</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from './getinstockapi'
import supplierLocalApi from '../../store/supplierlocalapi'
import getMaterialInfoApi from '../../store/getmaterialinfoapi'
import { floatTool, debounce, SPEC_CODE, patch } from '@/util/common'
import { EQUIPMENTTYPE, FULL_STATE, FULL_ORDER_NAME, PACKAGE_CODE, FULL_IN_OUT_TYPE } from '@/util/warehouseconfig'
import setName from '@/util/setstatusname'
import sysvalue from '@/warehouse/store/sysvalueapi'
import remoteSelect from '../joinstorage/remoteselect.vue'
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
  enableDate: '',
  unit: '',
  overdueDate: ''
}
export default {
  mixins: [setName],
  data () {
    schema = this.createObject().schema
    let obj = this.createObject().obj
    obj.inStockItemList = [{ invoice: 1, invoiceNo: '', item: [], items: [] }]
    return {
      schema,
      obj,
      api,
      SPEC_CODE,
      getMaterialInfoApi,
      supplierLocalApi,
      tableCode,
      FULL_IN_OUT_TYPE,
      REMOTE_METHODS_PLACEHOLDER,
      PACKAGE_CODE,
      FULL_STATE,
      FULL_ORDER_NAME,
      DRAFTP: false,
      objId: this.$route.params.id,
      typeArr: [],
      dosageFormArr: [],
      temSupplierLocalId: '',
      queryParams: { materialType: EQUIPMENTTYPE, offset: 0, pagesize: 20, storageRoomId: '' },
      rules: {}
    }
  },
  created () {
    if (this.objId) {
      this.api.getById(this.objId).then(res => {
        res.inStockTime = res.inDate || ''
        res.statusName = this.setName(FULL_STATE.instock, res.status, true)
        res.typeName = this.setName(FULL_ORDER_NAME.intype, res.type, true)
        res.inStockTypeName = this.setName(FULL_IN_OUT_TYPE.intype, res.type, true)
        res.staffName = res.status === 11 && res.staffObject ? res.staffObject.name : ''
        for (let i = 0; i < res.inStockItemList.length; i++) {
          res.inStockItemList[i].invoice = 2
          res.inStockItemList[i].items = []
          for (let n = 0; n < res.inStockItemList[i].item.length; n++) {
            for (var j = n + 1; j < res.inStockItemList[i].item.length; j++) {
              if (res.inStockItemList[i].item[n].localMaterialId === res.inStockItemList[i].item[j].localMaterialId) {
                delete res.inStockItemList[i].item[j].equipmentObject
                // delete res.inStockItemList[i].item[j].unitGroupItemObject
                delete res.inStockItemList[i].item[j].id
              }
            }
          }
        }
        this.obj = Object.assign({}, this.obj, res)
      })
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
    playOutStock () {
      this.$router.push('/goods/equipmententerstorageroomedit/' + this.objId)
    },
    createObject () {
      this.$route.params.id ? schema = readSchema : schema = []
      return {
        schema,
        obj: this.$ever.createObjFromSchema(schema)
      }
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
          if (!this.obj.inStockItemList[0].item.length) {
            this.$messageTips(this, 'warning', '入库单中还未添加商品，请先添加商品再提交')
            return
          }
          let params = { status }
          params = Object.assign({}, this.obj, params)
          delete params.inStockItemList
          params.item = []
          params.materialType = EQUIPMENTTYPE
          for (let i = 0; i < this.obj.inStockItemList.length; i++) {
            if (this.obj.inStockItemList[i].invoice === 1) {
              this.$messageTips(this, 'warning', '还未录入发票信息，请完成后再提交')
              return
            }
            if (!this.obj.inStockItemList[i].item.length) {
              this.$messageTips(this, 'warning', '存在没有入库明细的发票，请录入明细或者删除发票后再提交')
              return
            }
            for (let n = 0; n < this.obj.inStockItemList[i].item.length; n++) {
              delete this.obj.inStockItemList[i].item[n].equipmentObject
              params.item.push(Object.assign({
                materialType: EQUIPMENTTYPE,
                storageRoomId: this.obj.storageRoomId,
                invoiceNo: this.obj.inStockItemList[i].invoiceNo
              }, this.obj.inStockItemList[i].item[n]))
            }
          }
          this.api.createNew(params).then(res => {
            if (res && !res.id) this.$messageTips(this, 'warning', '保存失败，请重新操作')
            if (status === 31) {
              this.$messageTips(this, 'success', '当前录入的内容已经保存，您可以稍后继续录入', '保存成功')
              return
            }
            this.$router.push('/goods/equipmentinboundstorage/' + res.id + '?look=' + res.id)
          })
        }
      })
    }, 1000),
    calcInboundNum (num, index) {
      this.obj.inStockItemList[index].items[0].totalPrice = floatTool.multiply(this.obj.inStockItemList[index].items[0].price, num)
    },
    handleAddInvoice (i) {
      if (this.obj.inStockItemList[i].invoice === 1) {
        this.$messageTips(this, 'warning', '请填写并保存发票号')
        return
      }
      this.obj.inStockItemList.push({ invoice: 1, item: [], items: [this.tableCode] })
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
      if (!data['batchNum'] || !data['enableDate'] || !data['overdueDate'] || !data['num']) {
        this.$messageTips(this, 'warning', '该商品生产批次、生产日期和有效期信息未完成，请完成后再添加')
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
        this.obj.inStockItemList[i].item.push(data)
        this.obj = JSON.parse(JSON.stringify(this.obj))
        this.$nextTick(function () {
          let temCode = this.tableCode
          for (let key in temCode) {
            temCode[key] = ''
          }
          this.$set(this.obj.inStockItemList[i].items, 0, temCode)
          this.$refs.remoteselect[i].select = ''
        })
      }
    },
    handleSaveInvoice (data, index) {
      for (let i = 0; i < this.obj.inStockItemList.length; i++) {
        if (i === index) continue
        if (this.obj.inStockItemList[i].invoiceNo.toString() === data.toString()) {
          this.$messageTips(this, 'warning', '您提交的发票号已经在本入库单中填写过，请检查后重新录入')
          return
        }
      }
      if (data) {
        this.api.getBillNum(data).then(res => {
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
        this.obj.inStockItemList[0].items = [this.tableCode]
      } else {
        this.obj.inStockItemList[0].items = []
      }
    },
    ...patch
  },
  watch: {
    'obj.supplierLocalId' (val) {
      this.queryParams.supplierLocalId = val
      this.queryParams.storageRoomId = this.obj.storageRoomId
      if (val && this.obj.storageRoomId) {
        this._setList(true)
      } else {
        this._setList(false)
      }
    },
    'obj.storageRoomId' (val) {
      this.queryParams.storageRoomId = val
      this.queryParams.supplierLocalId = this.obj.supplierLocalId
      if (val && this.obj.supplierLocalId) {
        this._setList(true)
      } else {
        this._setList(false)
      }
    }
  },
  components: {
    remoteSelect
  }
}
</script>
