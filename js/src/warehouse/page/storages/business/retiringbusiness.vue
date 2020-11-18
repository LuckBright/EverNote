<template>
  <div>
    <ever-bread-crumb name="退库" showTitle="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4 v-if="!objId">第一步：基本信息</h4>
        <h4 v-else>基本信息</h4>
        <ever-form2 :class="{readform: objId}" :schema="schema" v-model="obj" ref="form" :span="12" :rules="rules" :nosubmit="true">
        </ever-form2>
        <div v-if="objId">
          <h4>执行情况</h4>
          <el-form ref="form" label-width="120px" :inline="true" class="readform">
            <el-form-item label="出库单：">
              <a class="blue cur" v-if="obj.outStockObject" @click="handleOutRoute">{{obj.outStockObject.code}}</a>
              <span v-if="obj.status == FULL_STATE.stockback[3].id" class="ml20">{{setName(FULL_STATE.outstock, obj.outStockStatus, true)}}</span>
              <span v-else-if="obj.status == FULL_STATE.stockback[4].id" class="ml20" :class="{ 'red': obj.outStockStatus === 24 }">{{obj.statusName}}</span>
              <span class="ungenerated" v-else>未生成</span>
            </el-form-item>
            <el-form-item label="入库单：">
              <a class="blue cur" v-if="obj.inStockObject && obj.outStockStatus == FULL_STATE.outstock[1].id" @click="handleIntRoute">{{obj.inStockObject.code}}</a>
              <span class="ml20" v-if="obj.outStockStatus == FULL_STATE.outstock[1].id" :class="{ 'red': obj.outStockStatus === 13 }">{{setName(FULL_STATE.instock, obj.inStockStatus, true)}}</span>
              <span class="ungenerated" v-else>未生成</span>
            </el-form-item>
          </el-form>
        </div>
        <h4 v-if="!objId">第二步：添加商品</h4>
        <h4 v-else>退库商品明细</h4>
        <div class="listinfo">
          <div class="table">
            <el-table
              :data="obj.cancelStockItems"
              style="width: 100%"
              :class="[(obj.items && obj.items.length) || $route.query.look ? '' : 'table2']"
              empty-text="请选择收货库房">
              <div class="back_none">
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
                <el-table-column
                  prop=""
                  width="120"
                  align="center"
                  label="规格">
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
                    <span v-if="scope.row.batchNum">{{scope.row.batchNum}}</span>
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
                <el-table-column show-overflow-tooltip
                  prop="usableNum"
                  width="80"
                  v-if="!objId"
                  align="right"
                  label="库存数量">
                </el-table-column>
              </div>
              <div>
                <el-table-column show-overflow-tooltip
                  prop="num"
                  label="退库数量"
                  align="right"
                  width="150">
                  <template slot-scope="scope">
                    {{scope.row.num}}
                    {{scope.row.unitName}}
                  </template>
                  </el-table-column>
              </div>
              <div>
                <el-table-column
                  v-if="!objId"
                  prop=""
                  align="center"
                  width="80"
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
                v-if="obj.items.length"
                ref="additem"
                :class="[obj.cancelStockItems.length ? 'additem2' : 'additem']"
                :data="obj.items"
                v-ever-bind-enter="{ cycle: true, updateDOM: true }"
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
                  <el-table-column show-overflow-tooltip
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
                  <el-table-column
                    prop=""
                    width="120"
                    align="center"
                    label="规格">
                    <template slot-scope="scope">
                      <span>{{scope.row.spec || '-'}}</span>
                    </template>
                  </el-table-column>
                </div>
                <div>
                  <el-table-column
                    prop=""
                    align="center"
                    label="生产批号"
                    width="150">
                    <template slot-scope="scope">
                      <ever-select
                        v-if="scope.row.localMaterialId && scope.row.isExpiryDate"
                        :index="scope.$index"
                        clearable="true"
                        v-model="scope.row.batchNum"
                        customValue="batchNum"
                        :options="scope.row.batchNumList"
                        size="small"
                        :filterable="true"
                        placeholder="生产批号"
                        @visibleChange="queryBatchNumList"
                        @change="selectBatchNumList"
                        @clear="clearBatchNumList">
                      </ever-select>
                      <span v-if="!scope.row.localMaterialId && !scope.row.isExpiryDate">{{'-'}}</span>
                    </template>
                  </el-table-column>
                </div>
                <div>
                  <el-table-column show-overflow-tooltip
                    prop=""
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
                  <el-table-column
                    prop="usableNum"
                    width="80"
                    align="right"
                    label="库存数量">
                  </el-table-column>
                </div>
                <div>
                  <el-table-column
                    align="right"
                    label="退库数量"
                    width="150">
                    <template slot-scope="scope">
                      <div class="quantity_input">
                        <el-input
                          placeholder="退库数量"
                          v-model="scope.row.num"
                          type="number"
                          size="small"
                          @blur="handleCheckNum(scope.row)">
                        </el-input>
                      </div>
                      <span>{{scope.row.unitName}}</span>
                    </template>
                  </el-table-column>
                </div>
                <div>
                  <el-table-column
                    prop=""
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
        <el-button v-if="!objId" type="primary" @click="submitForm('form')" :disabled="this.obj.cancelStockItems.length != 0 ? false : true" :loading="unRepeatedBtn">提交退库单</el-button>
        <el-button type="primary" @click="handleCancle" v-else-if="['20', '200', '24'].includes(`${obj.outStockStatus}`) && obj.status == 64 && objId">取消</el-button>
      </div>
    </div>
    <tipDialog :title="dialogTitle" :content="dialogContent" ref="dialog" :function="dialogFunction" :cancelFun="dialogCanclFun"></tipDialog>
  </div>
</template>
<script>
import api from '../store/retiringapi'
import inventoryqueryApi from '@/warehouse/store/getmaterialinfoapi'
import storageroomApi from '@/warehouse/store/storageroomapi'
import outputstockApi from '../../outputstorageroom/outputstockapi'
import { debounce, FULL_STATE, patch, SPEC_CODE, PACKAGE_CODE, GOLBAL_VAL_MATERIL_NAME } from '@/util/common'
import sysvalue from '@/warehouse/store/sysvalueapi'
import setName from '@/util/setstatusname'
import tipDialog from '@/warehouse/page/components/tipsdialog'
import getstorage from '@/warehouse/page/storages/util/getstorage'
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
    name: 'toStorageRoomId',
    label: '收货库房',
    comp: 'ever-remoteMethod',
    props: {
      api: storageroomApi,
      initoptions: [],
      // filter: '',
      // filterName: 'id',
      params: { storageRoomId: '' },
      // isSilentQuery: true
    },
    span: 6
  },
  {
    name: 'description',
    label: '退库原因',
    props: {},
    span: 6
  }
]
let readSchema = [
  {
    name: 'code',
    label: '退库单号:',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'requsitionStorageRoomObject.name',
    label: '申请库房:',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'createBy',
    label: '申请人:',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'statusName',
    label: '退库单状态:',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'toStorageRoomObject.name',
    label: '收货库房:',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'createDate',
    label: '申请时间:',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'descriptionText',
    label: '退库原因:',
    comp: 'readonlyitem',
    span: 24
  }
]
export default {
  mixins: [setName, getstorage],
  data () {
    schema = this.createObject().schema
    let obj = this.createObject().obj
    obj.cancelStockItems = []
    obj.items = []
    return {
      schema,
      obj,
      api,
      SPEC_CODE,
      PACKAGE_CODE,
      GOLBAL_VAL_MATERIL_NAME,
      REMOTE_METHODS_PLACEHOLDER,
      inventoryqueryApi,
      outputstockApi,
      tableCode: {},
      storage: {}, // 本库房
      FULL_STATE,
      dosageFormArr: [],
      objId: this.$route.params.id,
      queryParams: { materialType: '', offset: 0, pagesize: 20, state: 0 },
      rules: {
        // materialType: { required: true, message: '必填项', trigger: 'change' },
        toStorageRoomId: { required: true, message: '必填项', trigger: 'change' },
        description: { required: true, message: '必填项', trigger: 'blur' }
      },
      changeStorageRoomId: [],
      storageArr: [],
      createDate: '',
      dialogTitle: '',
      dialogContent: '',
      dialogFunction: '',
      dialogCanclFun: '',
      pathTo: false,
      unRepeatedBtn: false // 控制重复提交
    }
  },
  async created () {
    if (!this.objId) {
      this.$ever.getFieldFromSchema(this.schema, 'toStorageRoomId').props.retain = this.storageId
      this.$ever.getFieldFromSchema(this.schema, 'toStorageRoomId').props.params.storageRoomId = this.storageId
      this.$ever.getFieldFromSchema(this.schema, 'toStorageRoomId').props.params.isInvented = this.isInvented
      this.storageRoomMaterial()
    }
    this._info()
    if (this.objId) {
      this.getDetail().then((res) => {
        Object.assign(this.obj, res)
      })
    }
    sysvalue.listOnce('THC_WH_DRUG_FORM').then(res => {
      if (res) {
        this.dosageFormArr = res
      }
    })
    this._getStorageRoom()
  },
  methods: {
    handleOutRoute () {
      const id = this.obj.outStockObject.id
      const status = this.obj.outStockStatus
      this.$router.push(status === FULL_STATE.outstock[0].id ? `/storages/output/outputsee/${id}` : `/storages/output/outputedit/${id}?${status === 24 ? 'look' : 'look='}${id}`)
    },
    handleIntRoute () {
      const id = this.obj.inStockObject.id
      const status = this.obj.inStockStatus
      let isStorage = this.obj.toStorageRoomObject.id === this.storageId
      this.$router.push(status === FULL_STATE.instock[0].id ? `/storages/entry/entrysee/${id}` : `/storages/entry/entryedit/${id}?${status === 13 && isStorage ? 'look' : 'look='}${id}`)
    },
    queryBatchNumList (v) {
      if (v && this.obj.items[0].localMaterialId) {
        this.$set(this.obj.items[0], 'batchNumList', [])
        let params = {
          localMaterialId: this.obj.items[0].localMaterialId,
          // materialType: this.obj.materialType,
          storageRoomId: this.storageId
        }
        this.outputstockApi.stocklist(params).then(res => {
          this.obj.cancelStockItems.forEach(it => {
            res.forEach((its, index) => {
              if (it.localMaterialId + '' === this.obj.items[0].localMaterialId + '' && its.batchNum + '' === it.batchNum + '') {
                res.splice(index, 1)
              }
            })
          })
          res[0] && this.$set(this.obj.items[0], 'batchNumList', res)
        })
      }
    },
    clearBatchNumList (v) {
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
    handleCheckNum (data) {
      if (data.num <= 0) {
        this.$messageTips(this, 'warning', '退库数量为0或未输入，请重新录入')
        return
      }
      const float = /^(\+)?\d+(\.\d+)?/
      const parse = /^(\+)?\d*$/
      let dataType = data.classifyId || ''
      if (dataType !== '303' && dataType !== '304') {
        if (!parse.test(data.num)) {
          this.obj.items[0].num = ''
          this.$messageTips(this, 'warning', '退库数量不能小于0并且不能有小数，请重新录入')
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
      } else {
        if (!float.test(data.num)) {
          this.obj.items[0].num = ''
          this.$messageTips(this, 'warning', '退库数量不能小于0，请重新录入')
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
      }
      if (data.num > data.usableNum) {
        this.obj.items[0].num = ''
        this.$messageTips(this, 'warning', '当前实际库存已经更新，请重新核对退库数量')
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
          res.statusName = this.setName(FULL_STATE.stockback, res.status, true)
          res.descriptionText = res.description
          this.printData = []
          if (this.printModel === 3) {
            this.pHeader[0].data = res.toStorageRoomObject ? res.toStorageRoomObject.name : ''
            this.pHeader[1].data = res.requsitionStorageRoomObject ? res.requsitionStorageRoomObject.name : ''
            this.pHeader[2].data = res.createDate
          }
          this.recordData.head.patientId = res.code
          // for (let i = 0; i < res.cancelStockItems.length; i++) {
          //   let item = res.cancelStockItems[i]
          //   if (item && item.isManageAlone) {
          //     tempParams.batchNum = ''
          //     tempParams.validityDate = ''
          //   }
          // }
          resolve(res)
        })
      })
    },
    handleCancle () {
      this.dialogTitle = '确认是否取消'
      this.dialogContent = '退库单取消后不能恢复，请确认是否取消？'
      this.dialogFunction = this.submitCancel
      this.$refs.dialog.open()
    },
    submitCancel: debounce(function () {
      this.api.createOrUpdate({ id: this.objId }).then(res => {
        this.getDetail().then((res) => {
          this.obj = res
        })
      })
    }),
    submitForm: debounce(function (form) {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          if (!this.obj.cancelStockItems.length) {
            this.$messageTips(this, 'warning', '退库单中还未添加商品，请先添加商品再提交')
            return
          }
          let params = {}
          params = Object.assign({}, params, this.obj)
          params.pageType = 'storages/business/retiringbusiness'
          delete params.items
          params.requsitionStorageRoomId = this.storageId
          for (let n = 0; n < params.cancelStockItems.length; n++) {
            // 处理单位
            delete params.cancelStockItems[n].batchNumList
          }
          this.unRepeatedBtn = true
          this.api.createOrUpdate(params).then(res => {
            this.unRepeatedBtn = false
            if (res) this.$router.push('/storages/business/retiringbusiness/' + res + '?look=' + res)
          })
        }
      })
    }),
    handleDeleteRow (index) {
      this.obj.cancelStockItems.splice(index, 1)
      this.obj = JSON.parse(JSON.stringify(this.obj))
    },
    handleAddRow (data) {
      if (!data['batchNum'] && data.isExpiryDate) {
        this.$messageTips(this, 'warning', '请选择生产批号后再添加')
        return
      }
      if (Number(data['num']) <= 0 || data['num'] === '') {
        this.$messageTips(this, 'warning', '请填写退库数量后再添加')
        return
      }
      if (Number(data['num']) > Number(data['usableNum'])) {
        this.$messageTips(this, 'warning', '当前实际库存已经更新，请重新核对退库数量')
        data['num'] = ''
        this.obj.items[0].num = ''
        return
      }
      if (this.obj.cancelStockItems.length > 1) {
        for (let i = 0; i < this.obj.cancelStockItems.length; i++) {
          if (data.batchNum === this.obj.cancelStockItems[i].batchNum && data.localMaterialId === this.obj.cancelStockItems[i].localMaterialId) {
            this.$messageTips(this, 'warning', '该药品已经添加')
            return
          }
        }
      }
      if (data.localMaterialId) {
        this.obj.cancelStockItems.push(data)
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
    handleSelect (data) {
      if (data && data.isManageAlone) {
        return this.$messageTips(this, 'warning', '该商品属于唯一码管理，暂不支持')
      }
      if (data) {
        inventoryqueryApi.list(Object.assign(this.queryParams, { ifMoreThanZero: 0, localMaterialId: data.localMaterialId })).then(res => {
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
                if (key === 'materialSkuId') item[key] = data.materialSkuId
              } else {
                item[key] = ''
              }
            }
            if (row && !row.isManageAlone && !row.isExpiryDate) {
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
      // this.queryParams.materialType = this.obj.materialType
      this.queryParams.storageRoomId = this.storageId
      // if (this.schema[0] && this.schema[0].props) this.schema[0].props.retain = this.obj.materialType
      this.tableCode = Object.assign({}, this.tableCode, {
        localMaterialId: '',
        usableNum: '',
        isInvented: '',
        num: '',
        materialName: '',
        unitName: '',
        isExpiryDate: '',
        classifyId: '',
        batchNum: '',
        spec: '',
        unitId: '',
        batchNumList: [],
        freight: {},
        isManageAlone: '',
        materialSkuId: ''
      })
    },
    _setList (flag) {
      if (flag) {
        for (let key in this.tableCode) {
          this.tableCode[key] = ''
        }
        this.obj.items[0] ? this.obj.items[0] = this.tableCode : this.obj.items.push(this.tableCode)
      } else {
        this.obj.items = []
        if (!this.objId) this.obj.cancelStockItems = []
      }
    },
    async _getStorageRoom (id) {
      await storageroomApi.list({ storageRoomId: this.storageId, isInvented: this.isInvented, materialType: '', name: '', offset: 0, pagesize: 9999 }).then(res => {
        if (res && res.list) {
          let storageroomArr = JSON.parse(JSON.stringify(res.list))
          this.storageArr = storageroomArr
          this.storage = storageroomArr.filter(item => {
            return item.id === this.storageId
          })
          if (this.$ever.getFieldFromSchema(this.schema, 'toStorageRoomId')) {
            this.$ever.getFieldFromSchema(this.schema, 'toStorageRoomId').props.initoptions = storageroomArr.filter(item => {
              return item.id !== this.storageId
            })
          }
        }
      })
    },
    ...patch
  },
  watch: {
    '$route' (val) {
      this.objId = val.params.id
      this.taskId = val.query.taskId
      if (this.objId) {
        this.schema = this.createObject().schema
        this.obj = this.createObject().obj
        this.obj.cancelStockItems = []
        this.getDetail().then((res) => {
          this.obj = JSON.parse(JSON.stringify(Object.assign({}, this.obj, res)))
          this.pathTo = true
        })
      }
    },
    'obj.toStorageRoomId' (val) {
      if (this.objId) return
      if (val) {
        this._setList(!!val)
      } else {
        this._getStorageRoom()
        this._setList(!!val)
      }
      let newMaterialType = (this.storage && this.storage.length) ? JSON.parse(this.storage[0].materialType) : []
      let toStorageRoomMater
      let materArr = []
      this.storageArr.forEach(item => {
        if (item.id === val) toStorageRoomMater = JSON.parse(item.materialType)
      })
      toStorageRoomMater && toStorageRoomMater.map(mater => {
        const index = newMaterialType.findIndex(key => { return mater === key })
        if (~index) {
          materArr.push(newMaterialType[index])
        }
      })
      this.queryParams.classifyIds = materArr
    }
  },
  components: {
    printHeader,
    printFooter,
    printBody,
    tipDialog
  }
}
</script>
<style lang="scss" scoped>
table.table__header /deep/ .back_none { display: inline-block !important; }
.el-form-item /deep/ .el-form-item__content{line-height: 30px;}
</style>
