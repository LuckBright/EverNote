<template>
  <div>
    <ever-bread-crumb name="退供应商" showTitle="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4 v-if="!objId">第一步：基本信息</h4>
        <h4 v-else>基本信息</h4>
        <ever-form2 :class="[objId ? 'readform' : '']" :schema="schema" v-model="obj" ref="form" :span="12" :rules="rules" :nosubmit="true">
        </ever-form2>
        <div v-if="objId">
          <h4>执行情况</h4>
          <el-form ref="form" label-width="120px" class="readform">
            <el-form-item label="出库单：" style="line-height: 40px;">
              <a class="blue cur" @click="$router.push(obj.outStockStatus == FULL_STATE.return[6].id || obj.status == FULL_STATE.return[4].id ? `/storages/output/outputedit/${obj.outStockId}?look=${obj.outStockId}` : `/storages/output/outputsee/${obj.outStockId}`)">{{obj.outStockCode}}</a>
              <span v-if="obj.status == FULL_STATE.return[4].id" class="ml20">{{obj.statusName}}</span>
              <span v-else-if="obj.status == FULL_STATE.return[3].id" class="ml20">{{setName(FULL_STATE.return, obj.outStockStatus, true)}}</span>
              <span v-else class="ungenerated">未生成</span>
            </el-form-item>
          </el-form>
        </div>
        <h4 v-if="!objId">第二步：添加商品</h4>
        <h4 v-else>退供应商商品明细</h4>
        <div class="invoice">
          <el-form :inline="true" class="demo-form-inline" onsubmit="return false;" size="small">
            <el-form-item label="发票号：" ref="invoiceTitle">
              <el-input
                v-if="invoice == 1 || invoice == 3"
                placeholder="请输入发票号"
                v-model="billNum"
                size="small"
                clearable>
              </el-input>
              <span v-if="invoice == 2">{{billNum}}</span>
              <span v-if="invoice == 2 && (billNum == ' ' || billNum == '')">无发票</span>
            </el-form-item>
            <el-form-item style="width: 200px">
              <div v-if="!objId">
                <el-button type="text" v-if="invoice == 3 || invoice == 1" @click="handleSaveInvoice">保存</el-button>
                <el-button type="text" v-if="invoice == 2" @click="handleEditInvoice">修改</el-button>
                <el-button type="text" v-if="invoice == 3 || invoice == 1" @click="handleNoInvoice">无发票</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="listinfo">
          <div class="table">
            <el-table
              :data="obj.item"
              style="width: 100%"
              :class="[(obj.items && obj.items.length) || $route.query.look ? '' : 'table2']"
              empty-text="请选择供应商">
              <div>
                <el-table-column show-overflow-tooltip
                  prop=""
                  label=""
                  width="10">
                </el-table-column>
              </div>
              <div>
                <el-table-column show-overflow-tooltip
                  prop=""
                  label=""
                  width="50">
                  <template slot-scope="scope">
                    <span>{{scope.$index + 1}}</span>
                  </template>
                </el-table-column>
              </div>
              <div>
                <el-table-column
                  prop=""
                  label="商品名称">
                  <template slot-scope="scope">
                    <material-show-name v-if="scope.row.materialName" :materialName="scope.row.materialName" :icons="scope.row.icons"></material-show-name>
                  </template>
                </el-table-column>
              </div>
              <div>
                <el-table-column prop label="规格" align="center" width="80px">
                  <template slot-scope="scope">
                    <span>{{scope.row.spec || '-'}}</span>
                  </template>
                </el-table-column>
              </div>
              <div>
                <el-table-column show-overflow-tooltip
                  label="生产批号"
                  align="center"
                  width="150">
                  <template slot-scope="scope">
                    <span v-if="scope.row.batchNum">{{scope.row.batchNum}}</span>
                    <span v-else>{{'-'}}</span>
                  </template>
                </el-table-column>
              </div>
              <div>
                <el-table-column show-overflow-tooltip
                  align="center"
                  width="100"
                  label="生产日期">
                  <template slot-scope="scope">
                    <span v-if="scope.row.batchNum && scope.row.produceDate">{{scope.row.produceDate | formatDateByExp('YYYY-MM-DD')}}</span>
                    <span v-else>{{'-'}}</span>
                  </template>
                </el-table-column>
              </div>
              <div>
                <el-table-column show-overflow-tooltip
                  align="center"
                  width="100"
                  label="有效期">
                  <template slot-scope="scope">
                    <span v-if="scope.row.batchNum && scope.row.validityDate">{{scope.row.validityDate | formatDateByExp('YYYY-MM-DD')}}</span>
                    <span v-else>{{'-'}}</span>
                  </template>
                </el-table-column>
              </div>
              <div>
                <el-table-column show-overflow-tooltip
                  align="right"
                  prop="usableNum"
                  width="80"
                  v-if="!objId"
                  :formatter="formatter.numUintFormatter"
                  label="库存数量">
                </el-table-column>
              </div>
              <div>
                <el-table-column show-overflow-tooltip
                  align="right"
                  label="退返数量"
                  width="150">
                  <template slot-scope="scope">
                    <span :class="[scope.row.usableNum < scope.row.num ? 'red' : '']">{{scope.row.num}}</span>
                    <span>{{scope.row.unitName}}</span>
                  </template>
                </el-table-column>
              </div>
              <div>
                <el-table-column show-overflow-tooltip
                  v-if="!objId"
                  width="80"
                  align="center"
                  label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="small"
                      type="danger"
                      @click.native.prevent="handleDeleteRow(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </div>
              <div>
                <el-table-column
                  prop=""
                  width="10"
                  label="">
                </el-table-column>
              </div>
            </el-table>
            <!-- 查询添加商品 -->
            <div v-if="!objId">
              <el-table
                v-if="obj.items && obj.items.length"
                ref="additem"
                :class="[obj.item.length ? 'additem2' : 'additem']"
                :data="obj.items"
                v-ever-bind-enter="{ cycle: true }"
                style="width: 100%">
                <div>
                  <el-table-column show-overflow-tooltip
                    prop=""
                    label=""
                    width="10">
                  </el-table-column>
                </div>
                <div>
                  <el-table-column
                    prop=""
                    label=""
                    width="50">
                  </el-table-column>
                </div>
                 <!-- apiName='listlocal' -->
                <div>
                  <el-table-column
                    prop="name"
                    label="商品名称">
                    <template slot-scope="scope">
                      <material-select
                        ref="remoteselect"
                        :params="queryParams"
                        :needObjFlag="true"
                        @change="handleSelect">
                      </material-select>
                    </template>
                  </el-table-column>
                </div>
                <div>
                  <el-table-column prop label="规格" align="center" width="80px">
                    <template slot-scope="scope">
                      <span>{{scope.row.spec || '-'}}</span>
                    </template>
                  </el-table-column>
                </div>
                <div>
                  <el-table-column show-overflow-tooltip
                    prop=""
                    label="生产批号"
                    align="center"
                    width="150">
                    <template slot-scope="scope">
                      <ever-select
                        v-if="scope.row.isExpiryDate"
                        :index="scope.$index"
                        clearable="true"
                        v-model="scope.row.batchNum"
                        customValue="batchNum"
                        :options="scope.row.batchNumList"
                        size="small"
                        placeholder="生产批号"
                        :filterable="true"
                        @visibleChange="queryBatchNumList"
                        @change="selectBatchNumList"
                        @clear="clearBatchNumList">
                      </ever-select>
                      <span v-else>{{'-'}}</span>
                    </template>
                  </el-table-column>
                </div>
                <div>
                  <el-table-column show-overflow-tooltip
                    prop=""
                    width="100"
                    align="center"
                    label="生产日期">
                    <template slot-scope="scope">
                      <span v-if="scope.row.batchNum && scope.row.produceDate">{{scope.row.produceDate | formatDateByExp('YYYY-MM-DD')}}</span>
                      <span v-else>{{'-'}}</span>
                    </template>
                  </el-table-column>
                </div>
                <div>
                  <el-table-column show-overflow-tooltip
                    prop=""
                    width="100"
                    align="center"
                    label="有效期">
                    <template slot-scope="scope">
                      <span v-if="scope.row.batchNum && scope.row.validityDate">{{scope.row.validityDate | formatDateByExp('YYYY-MM-DD')}}</span>
                      <span v-else>{{'-'}}</span>
                    </template>
                  </el-table-column>
                </div>
                <div>
                  <el-table-column
                    prop=""
                    width="80"
                    v-if="!objId"
                    align="right"
                    :formatter="formatter.numUintFormatter"
                    label="库存数量">
                    <template slot-scope="scope">
                      <span>{{scope.row.usableNum || '-'}}</span>
                    </template>
                  </el-table-column>
                </div>
                <div>
                  <el-table-column
                    label="退返数量"
                    align="right"
                    width="150">
                    <template slot-scope="scope">
                      <el-input size="small" style="width:65%" @blur="handleCheckNum(scope.row)" v-model="scope.row.num" type="number" placeholder="退返数量"></el-input>
                      <span>{{scope.row.unitName}}</span>
                    </template>
                  </el-table-column>
                </div>
                <div>
                  <el-table-column
                    align="center"
                    width="80"
                    label="操作">
                    <template slot-scope="scope">
                      <el-button
                        size="small"
                        type="primary"
                        @click.native.prevent="handleAddRow(scope.row)">添加</el-button>
                    </template>
                  </el-table-column>
                </div>
                <div>
                  <el-table-column
                    prop=""
                    width="10"
                    label="">
                  </el-table-column>
                </div>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <div class="panel-footer">
        <el-button v-if="!objId" type="primary" @click="submitForm('form')" :disabled="this.obj.item.length !=0 ? false : true" :loading="unRepeatedBtn">提交退返单</el-button>
        <el-button v-else-if="obj.outStockStatus == 76 && obj.status == 74" type="primary" @click="handleCancle">取消</el-button>
      </div>
    </div>
    <tipDialog :title="dialogTitle" :content="dialogContent" @click="handleCancle" ref="dialog" :function="dialogFunction" :cancelFun="dialogCanclFun"></tipDialog>
  </div>
</template>
<script>
import api from '../store/givebackapi'
import supplierLocalApi from '@/warehouse/store/supplierlocalapi'
import remoteSelect from '../../joinstorage/remoteselect'
import { debounce, FULL_STATE, patch, GOLBAL_VAL_MATERIL_NAME, SPEC_CODE, PACKAGE_CODE } from '@/util/common'
import setName from '@/util/setstatusname'
import sysvalue from '@/warehouse/store/sysvalueapi'
import tipDialog from '@/warehouse/page/components/tipsdialog'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import * as formatter from '@/warehouse/util/formatter'
import storage from '@/util/storage'
import { REMOTE_METHODS_PLACEHOLDER } from '@/warehouse/views/util/constant'

let schema = []
let schemaItem = [
  // {
  //   name: 'materialType',
  //   label: '物资类型',
  //   comp: 'ever-select',
  //   props: {
  //     options: [],
  //     clearable: false
  //   },
  //   span: 6
  // },
  {
    name: 'supplierLocalId',
    label: '供应商',
    comp: 'ever-remoteMethod',
    props: {
      api: supplierLocalApi,
      showName: 'supplierObject',
      initoptions: [],
      params: { showflag: 1 },
      isSilentQuery: true
    },
    span: 6
  },
  {
    name: 'description',
    label: '退返原因',
    props: {},
    span: 6
  }
]
let readSchema = [
  {
    name: 'code',
    label: '退返申请单号:',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'supplierObject.name',
    label: '退返供应商:',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'applicant',
    label: '申请人:',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'statusName',
    label: '退返申请状态:',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'storageRoomObject.name',
    label: '发货库房:',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'createTime',
    label: '申请时间:',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'descriptionName',
    label: '退返原因:',
    comp: 'readonlyitem',
    span: 24
  }
]
export default {
  mixins: [setName, getstorage],
  data () {
    schema = this.createObject().schema
    let obj = this.createObject().obj
    obj.item = []
    obj.items = []
    return {
      schema,
      obj,
      api,
      formatter,
      SPEC_CODE,
      GOLBAL_VAL_MATERIL_NAME,
      PACKAGE_CODE,
      supplierLocalApi,
      tableCode: {},
      objId: this.$route.params.id,
      queryParams: { materialType: '', offset: 0, pagesize: 20, state: 0, splitFlag: 0 },
      rules: {
        supplierLocalId: { required: true, message: '必填项', trigger: 'change' },
        description: { required: true, message: '必填项', trigger: 'blur' }
      },
      changeSupplierLocalId: [],
      flag: true,
      dosageFormArr: [],
      FULL_STATE,
      createDate: '',
      dialogTitle: '',
      dialogContent: '',
      dialogFunction: '',
      REMOTE_METHODS_PLACEHOLDER,
      dialogCanclFun: '',
      pathTo: false,
      billNum: '',
      invoice: 1,
      unRepeatedBtn: false // 控制重复提交
    }
  },
  created () {
    if (!this.objId) {
      this.storageRoomMaterial()
    }
    this._info()
    if (this.objId) {
      this.getDetail().then((res) => {
        Object.assign(this.obj, res)
        this.invoice = 2
        this.billNum = this.obj.item[0].billNum ? this.obj.item[0].billNum : ''
      })
    }
    sysvalue.listOnce('THC_WH_DRUG_FORM').then(res => {
      if (res) {
        this.dosageFormArr = res
      }
    })
  },
  methods: {
    handleSaveInvoice () {
      if (!this.billNum.trim()) {
        this.$messageTips(this, 'warning', '请输入发票号')
      } else {
        this.invoice = 2
      }
    },
    handleEditInvoice () {
      this.invoice = 3
    },
    handleNoInvoice () {
      this.invoice = 2
      this.billNum = ''
    },
    handleCheckNum (data) {
      const float = /^(\+)?\d+(\.\d+)?/
      const parse = /^(\+)?\d*$/
      if (data.num <= 0) {
        this.$messageTips(this, 'warning', '退返供应商商品数量为0或未输入，请重新录入')
        return
      }
      let dataType = data.classifyId || ''
      if (dataType !== '303' && dataType !== '304') {
        if (!parse.test(data.num)) {
          this.obj.items[0].num = ''
          this.$messageTips(this, 'warning', '退返供应商商品数量不能小于0并且不能有小数，请重新录入')
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
      } else {
        if (!float.test(data.num)) {
          this.obj.items[0].num = ''
          this.$messageTips(this, 'warning', '退返供应商商品数量不能小于0，请重新录入')
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
      }
      if (!data.usableNum || data.num > data.usableNum) {
        this.obj.items[0].num = ''
        this.$messageTips(this, 'warning', '当前实际库存已经更新，请重新核对退返供应商商品数量')
        this.obj = JSON.parse(JSON.stringify(this.obj))
        return
      }
    },
    createObject () {
      schema = this.$route.params.id ? readSchema : schemaItem
      return {
        schema,
        obj: this.$ever.createObjFromSchema(schema)
      }
    },
    getDetail (id) {
      return new Promise((resolve, reject) => {
        api.getById({ id: this.objId }).then(res => {
          res.statusName = this.setName(FULL_STATE.return, res.status, true)
          res.descriptionName = res.description
          resolve(res)
        })
      })
    },
    submitForm: debounce(function (form) {
      if (this.invoice === 1 || this.invoice === 3) {
        this.$messageTips(this, 'warning', '还未录入或未保存发票信息，请完成后再提交')
        return
      }
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          if (!this.obj.item.length) {
            this.$messageTips(this, 'warning', '退返单中还未添加商品，请先添加商品再提交')
            return
          }
          let params = {}
          params = Object.assign({}, params, this.obj)
          delete params.items
          params.pageType = 'storages/business/returnbusiness'
          params.materialType = ''
          params.storageRoomId = this.storageId
          for (let n = 0; n < params.item.length; n++) {
            // 处理单位
            delete params.item[n].batchNumList
            params.item[n].billNum = this.billNum
          }
          this.unRepeatedBtn = true
          this.api.createOrUpdate(params).then(res => {
            this.unRepeatedBtn = false
            if (res && res.id) this.$router.push('/storages/business/returnbusiness/' + res.id + '?look=' + res.id)
          })
        }
      })
    }),
    cancelForm: debounce(function () {
      this.api.createOrUpdate({ id: this.objId, status: 75 }).then(res => {
        if (res) {
          this.getDetail().then((res) => {
            this.obj = Object.assign({}, this.obj, res)
          })
        }
      })
    }),
    handleCancle (type) {
      if (type === 'supplier') {
        this.dialogTitle = '确认是否修改退返供应商'
        this.dialogContent = '退返单中已经添加当前供应商的商品，如需修改退返供应商，将自动清空已添加的商品'
        this.dialogFunction = this.confirmFormSup
        this.dialogCanclFun = this.cancelFormSup
      } else {
        this.dialogTitle = '确认是否取消'
        this.dialogContent = '退返单取消后不能恢复，请确认是否取消？'
        this.dialogFunction = this.cancelForm
      }
      this.$refs.dialog.open()
    },
    confirmFormSup: function () {
      this.obj.item = []
      this.changeSupplierLocalId = [this.obj.supplierLocalId]
    },
    cancelFormSup: function () {
      this.flag = false
      supplierLocalApi.list({ name: '', offset: 0, pagesize: 20 }).then()
      this.obj.supplierLocalId = this.changeSupplierLocalId[0]
      this.changeSupplierLocalId = [this.changeSupplierLocalId[0]]
    },
    queryBatchNumList (v) {
      if (v && this.obj.items[0].localMaterialId) {
        this.$set(this.obj.items[0], 'batchNumList', [])
        let params = {
          localMaterialId: this.obj.items[0].localMaterialId,
          storageRoomId: this.storageId,
          supplierLocalId: this.obj.supplierLocalId
        }
        this.api.listQuery(params).then(res => {
          // console.log(res)
          let result = res.list[0].batchNumList
          this.obj.item.forEach(it => {
            result.forEach((its, index) => {
              if (it.localMaterialId + '' === this.obj.items[0].localMaterialId + '' && its.batchNum + '' === it.batchNum + '') {
                result.splice(index, 1)
              }
            })
          })
          // console.log(result)
          result[0] && this.$set(this.obj.items[0], 'batchNumList', result)
        })
      }
    },
    clearBatchNumList () {
      this.$set(this.obj.items[0], 'usableNum', '')
      this.$set(this.obj.items[0], 'produceDate', '')
      this.$set(this.obj.items[0], 'validityDate', '')
    },
    selectBatchNumList (v) {
      this.obj.items[0].num = ''
      this.obj = JSON.parse(JSON.stringify(this.obj))
      if (v === '') return
      let usableNum = ''
      let produceDate = ''
      let validityDate = ''
      let index = this.obj.items[0].batchNumList.findIndex(it => {
        return it.batchNum === v
      })
      usableNum = index > -1 ? this.obj.items[0].batchNumList[index].usableNum : ''
      produceDate = index > -1 ? this.obj.items[0].batchNumList[index].produceDate : ''
      validityDate = index > -1 ? this.obj.items[0].batchNumList[index].validityDate : ''
      this.$set(this.obj.items[0], 'usableNum', usableNum)
      this.$set(this.obj.items[0], 'produceDate', produceDate)
      this.$set(this.obj.items[0], 'validityDate', validityDate)
    },
    handleDeleteRow (index) {
      this.obj.item.splice(index, 1)
      this.obj = JSON.parse(JSON.stringify(this.obj))
    },
    handleAddRow (data) {
      if (!data['batchNum'] && data.isExpiryDate) {
        this.$messageTips(this, 'warning', '请选择生产批号后再添加')
        return
      }
      if (Number(data['num']) <= 0 || data['num'] === '') {
        this.$messageTips(this, 'warning', '请填写退返数量后再添加')
        return
      }
      for (let i = 0; i < this.obj.item.length; i++) {
        if (data.batchNum === this.obj.item[i].batchNum && data.localMaterialId === this.obj.item[i].localMaterialId) {
          this.$messageTips(this, 'warning', '该商品已经添加')
          return
        }
      }
      if (data.localMaterialId) {
        this.obj.item.push(data)
        this.$nextTick(function () {
          let temCode = JSON.parse(JSON.stringify(this.tableCode))
          for (let key in temCode) {
            temCode[key] = ''
          }
          this.$set(this.obj.items, 0, temCode)
          if (this.$refs.remoteselect) {
            this.$refs.remoteselect.select = ''
            this.$refs.remoteselect.options = []
          }
        })
      } else {
        this.$messageTips(this, 'warning', '此药品无效，请选择其他药品')
      }
    },
    handleSelect (data, index, index2) {
      if (data && data.isManageAlone) {
        this.$messageTips(this, 'warning', '该商品属于唯一码管理，暂不支持')
        return
      }
      if (data) {
        api.listQuery(Object.assign(this.queryParams, { localMaterialId: data.localMaterialId })).then(res => {
          if (res && res.list && res.list.length) {
            let row = res.list[0]
            if (this.obj.items[0].length && this.obj.items[0].num) {
              this.$set(this.obj.items[0], 'usableNum', '')
              this.$set(this.obj.items[0], 'num', '')
              this.$set(this.obj.items[0], 'batchNum', '')
              this.obj = JSON.parse(JSON.stringify(this.obj))
            }
            for (let key in this.obj.items[0]) {
              let item = this.obj.items[0]
              if (row.localMaterialId) {
                key === 'num' || key === 'usableNum' || key === 'batchNum' ? '' : item[key] = row[key] || row[key] === 0 ? row[key] : ''
                if (key === 'unitId') item[key] = data.unitId
                if (key === 'spec') item[key] = data.spec
              } else {
                item[key] = ''
              }
            }
            if (!data.isManageAlone && !row.isExpiryDate) {
              this.obj.items[0].usableNum = row.usableNum
            }
          }
        })
      } else {
        for (let key in this.obj.items[0]) {
          let item = this.obj.items[0]
          item[key] = ''
        }
      }
    },
    _info () {
      this.queryParams.storageRoomId = this.storageId
      let storageArr = JSON.parse(storage.getLocalStorage('STORAGE_ITEM'))
      if (storageArr && storageArr.length) {
        const storageObj = storageArr.filter(item => { return item.id === this.storageId })
        if (storageObj) this.queryParams.classifyIds = JSON.parse(storageObj[0].materialType)
      }
      this.tableCode = Object.assign({}, this.tableCode, {
        localMaterialId: '',
        num: '',
        batchNum: '',
        batchNumList: [],
        usableNum: '',
        isInvented: '',
        materialName: '',
        unitName: '',
        isExpiryDate: '',
        classifyId: '',
        spec: '',
        unitId: '',
        isManageAlone: '',
        freight: {}
      })
    },
    _setList (flag) {
      if (flag) {
        for (let key in this.tableCode) {
          this.tableCode[key] = ''
        }
        this.obj.items[0] ? this.obj.items[0] = this.tableCode : this.obj.items.push(this.tableCode)
        this.obj.item = []
        if (this.$refs.remoteselect) {
          this.$refs.remoteselect.select = ''
          this.$refs.remoteselect.options = []
        }
      } else {
        this.obj.items = []
        this.obj.item = []
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
        this.getDetail().then((res) => {
          this.obj = Object.assign({}, this.obj, res)
          this.pathTo = true
        })
      }
    },
    'obj.supplierLocalId' (val) {
      if (!this.objId) {
        this.queryParams.supplierLocalId = val
        if (val) {
          this._setList(true)
        } else {
          this._setList(false)
        }
      }
    }
  },
  components: {
    remoteSelect,
    tipDialog
  }
}
</script>
