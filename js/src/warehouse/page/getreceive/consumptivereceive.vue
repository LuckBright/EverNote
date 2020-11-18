<template>
  <div id="">
    <ever-bread-crumb name="领用申请" @back="backTo"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <div v-if="dismarntleFlag">
          <div>
            <h4>基础信息</h4>
            <ever-form2
              :class="{readform: objId}"
              :schema="schema"
              v-model="obj"
              ref="form"
              :span="12"
              :rules="rules"
              :nosubmit="true">
            </ever-form2>
          </div>
          <div v-if="objId">
            <h4>执行情况</h4>
            <el-form ref="form" label-width="120px">
              <el-form-item label="出库单" v-if="obj.outStockObject" class="line30">
                <el-button size="small" style="padding: 0" type="text" v-if="obj.outStockObject && obj.outStockObject.code" @click="handleRouterTo(1)">{{obj.outStockObject.code}}</el-button>
                <span class="ungenerated" v-else>未生成</span>
                <span v-if="obj.outStockObject">{{setName(FULL_STATE.outstock, obj.outStockObject.status, true)}}</span>
              </el-form-item>
            </el-form>
          </div>
          <h4 v-if="!objId">第二步：添加物资</h4>
          <h4 v-else>领用商品明细</h4>
          <div class="listinfo">
            <div class="table">
              <el-table
                :data="obj.applyItemList"
                :class="[obj.items && obj.items.length ? '' : 'table2']"
                empty-text="请先选择发货库房">
                <el-table-column
                  width="50">
                  <template slot-scope="scope">
                    <span>{{scope.$index + 1}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="物资名称">
                  <template slot-scope="scope">
                    <material-show-name v-if="scope.row.materialName" :materialName="scope.row.materialName" :icons="scope.row.icons"></material-show-name>
                  </template>
                </el-table-column>
                <el-table-column prop label="规格" align="center" width="80px">
                  <template slot-scope="scope">
                    <span>{{scope.row.spec || '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  width="80"
                  align="center"
                  label="单位">
                  <template slot-scope="scope">
                    {{scope.row.unitName}}
                  </template>
                </el-table-column>
                <el-table-column
                  align="right"
                  v-if="!objId"
                  prop="usableNum"
                  width="80"
                  label="可用库存">
                </el-table-column>
                <el-table-column
                  prop=""
                  align="right"
                  label="领用数量"
                  width="150">
                  <template slot-scope="scope">
                    <span :class="[scope.row.num > scope.row.usableNum ? 'red' : '']">{{scope.row.num}}</span>
                    {{scope.row.packagUnitName}}
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  v-if="!objId"
                  width="80"
                  label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="small"
                      type="danger"
                      @click.native.prevent="handleDeleteRow(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 查询添加商品 -->
              <el-table
                v-if="obj.items.length && !objId"
                ref="additem"
                :class="[obj.applyItemList.length ? 'additem2' : 'additem']"
                :data="obj.items"
                v-ever-bind-enter="{ cycle: true }"
                :show-header="false">
                <el-table-column
                  width="50">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="物资名称">
                  <template slot-scope="scope">
                    <material-select
                      ref="remoteselect"
                      :params="queryParams"
                      @change="handleSelect"
                      :needObjFlag="true">
                    </material-select>
                  </template>
                </el-table-column>
                <el-table-column prop label="规格" align="center" width="80px">
                  <template slot-scope="scope">
                    <span>{{scope.row.spec || '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="unitGroupItemId"
                  width="80"
                  align="center"
                  label="单位">
                  <template slot-scope="scope">
                    {{scope.row.unitName}}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="usableNum"
                  width="80"
                  align="right"
                  label="可用库存">
                </el-table-column>
                <el-table-column
                  label="领用数量"
                  align="right"
                  width="150">
                  <template slot-scope="scope">
                    <el-input style="width: 100px" @blur="handleCheckNum(scope.row)" v-model="scope.row.num" type="number" placeholder="领用数量"></el-input><span class="fr ml5">{{scope.row.packagUnitName}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  width="80"
                  label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="small"
                      type="primary"
                      @click.native.prevent="handleAddRow(scope.row)">添加</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div v-else-if="!dismarntleFlag">
          <p class="success">领用单提交成功！</p>
          <span v-if="!dismantleFailList.length" class="success_text">您领用的物品已经收到，我们会尽快完成物品的配送。</span>
          <div v-else class="demerge success_text">
            <span v-if="!dismarntleSuccessList.length && dismantleFailList.length">
              您领用的商品暂时库存不足，我们会尽快补足库存并配送。
            </span>
            <span v-if="dismarntleSuccessList.length && dismantleFailList.length">
              您领用的商品中，有部分物品暂时库存不足，所以拆分为以下单据分开配送。库存不足的物品，我们会尽快补足库存并配送。
            </span>
          </div>
          <div>
            <div class="table" v-if="dismarntleSuccessList.length && dismarntleSuccessList[0].shortSupply == 0">
              <div class="main-option clearfloat">
                <h4 class="fl">领用的商品详情</h4>
                <div class="number fl">
                  <span>单号：</span>
                  <el-button type="text" @click="handleRouterTo(3, dismantleSuccess)">{{dismarntleSuccessList[0].code}}</el-button>
                </div>
              </div>
              <el-table :data="dismarntleSuccessList[0].applyItemList">
                <el-table-column
                  width="50">
                  <template slot-scope="scope">
                    <span>{{scope.$index + 1}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="物资名称">
                  <template slot-scope="scope">
                    <material-show-name v-if="scope.row.materialName" :materialName="scope.row.materialName" :icons="scope.row.icons"></material-show-name>
                  </template>
                </el-table-column>
                <el-table-column prop label="规格" align="center" width="80px">
                  <template slot-scope="scope">
                    <span>{{scope.row.spec || '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="unitGroupItemObject"
                  width="100"
                  align="center"
                  label="单位">
                  <template slot-scope="scope">
                    {{scope.row.unitName}}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="num"
                  align="right"
                  label="领用数量"
                  width="150">
                  <template slot-scope="scope">
                    <span>{{scope.row.num}}{{scope.row.packagUnitName}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div v-if="dismantleFailList.length && dismantleFailList[0].shortSupply == 1">
              <div class="main-option clearfloat">
                <h4 class="fl">领用的商品详情</h4>
                <div class="number fl">
                  <span>单号：</span>
                  <el-button type="text" @click="handleRouterTo(3, dismantleFail)">{{dismantleFailList[0].code}}</el-button>
                </div>
              </div>
              <el-table :data="dismantleFailList[0].applyItemList">
                <el-table-column
                  width="50">
                  <template slot-scope="scope">
                    <span>{{scope.$index + 1}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="物资名称">
                  <template slot-scope="scope">
                    <material-show-name v-if="scope.row.materialName" :materialName="scope.row.materialName" :icons="scope.row.icons"></material-show-name>
                  </template>
                </el-table-column>
                <el-table-column prop label="规格" align="center" width="80px">
                  <template slot-scope="scope">
                    <span>{{scope.row.spec || '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="unitGroupItemObject"
                  width="100"
                  align="center"
                  label="单位">
                  <template slot-scope="scope">
                    {{scope.row.unitName}}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="num"
                  align="right"
                  label="领用数量"
                  width="150">
                  <template slot-scope="scope">
                    <span class="red">{{scope.row.num}}{{scope.row.packagUnitName}}</span>
                    <span class="bg_OOS lack_goods">
                      {{ 23 | formateValueToFnt({
                      list: FULL_STATE.outstock
                      }) }}
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <div v-if="dismarntleFlag" class="panel-footer">
        <el-button size="small" v-if="!objId" type="primary" @click="submitForm('form')" :disabled="this.obj.applyItemList[0] ? false : true" :loading="unRepeatedBtn">提交领用单</el-button>
        <span v-if="obj.outStockObject && objId">
          <el-button size="small"
            type="primary"
            @click="handleCancle"
            v-if="obj.status == 54 && obj.source != 469 && obj.outStockObject && (obj.outStockObject.status == 20 || obj.outStockObject.status == 23)">取消</el-button></span>
        <el-button size="small" v-if="taskId && obj.status == 52" type="primary" @click="switchForm">我知道</el-button>
        <!-- 暂时注释，业务单据打印未完成 -->
        <!-- <el-button size="small" v-if="objId && obj.status == 54 && obj.outStockObject && obj.outStockObject.status != 23" class="print_btn_01 ml10" type="primary" @click="printTable"><i class="iconfont icon-dayinji-"></i> 打印</el-button> -->
      </div>
    </div>
  </div>
</template>
<script>
import api from './receiveapi'
import storageroomApi from '../../store/storageroomapi'
// import departmentApi from '@/sob/store/departmentapi'
import tipDialog from '@/warehouse/page/components/tipsdialog'
import remoteSelect from '../joinstorage/remoteselect'
import getMaterialInfoApi from '../../store/getmaterialinfoapi'
import { debounce, FULL_STATE, SPEC_CODE, patch, PACKAGE_CODE, GOLBAL_VAL_MATERIL_NAME, CHINESE_MEDICINE_TYPE, checkAmountIntensiveReading } from '@/util/common'
import sysvalue from '@/warehouse/store/sysvalueapi'
import setName from '@/util/setstatusname'
import supplyapi from '@/warehouse/page/supplyapi/supplyapi.js'
import selectInquireList from '@/warehouse/util/selectinquirelist'
import storage from '@/util/storage'
import { everprint } from '@/util/print'
import { REMOTE_METHODS_PLACEHOLDER } from '@/warehouse/views/util/constant'
let schema = []
let schemaItem = [
  {
    name: 'sectionId',
    label: '领用科室',
    comp: 'ever-select',
    props: {
      options: [],
      clearable: true
    },
    span: 8
  },
  {
    name: 'storageRoomId',
    label: '发货库房',
    comp: 'ever-select',
    props: {
      options: [],
      clearable: true
    },
    span: 8
  },
  {
    name: 'description',
    label: '备注',
    props: {},
    span: 8
  }
]
let readSchema = [
  {
    name: 'code',
    label: '领用申请单号:',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'sectionName',
    label: '领用科室:',
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
    label: '领用申请状态:',
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
    name: 'createDate',
    label: '申请时间:',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'description',
    label: '领用原因:',
    comp: 'readonlyitem',
    span: 24
  }
]
export default {
  mixins: [setName, selectInquireList],
  data () {
    schema = this.createObject().schema
    let obj = this.createObject().obj
    obj.applyItemList = []
    obj.items = []
    return {
      materialTypeId: '',
      schema,
      obj,
      SPEC_CODE,
      api,
      PACKAGE_CODE,
      GOLBAL_VAL_MATERIL_NAME,
      getMaterialInfoApi,
      CHINESE_MEDICINE_TYPE,
      tableCode: {},
      REMOTE_METHODS_PLACEHOLDER,
      FULL_STATE,
      dosageFormArr: [],
      queryParams: { materialType: '', offset: 0, pagesize: 20, storageRoomId: '', state: 0, isNeedStock: true },
      rules: {
        storageRoomId: { required: true, message: '必填项', trigger: 'change' },
        sectionId: { required: true, message: '必填项', trigger: 'change' }
      },
      objId: this.$route.params.id,
      taskId: this.$route.query.taskId,
      oldMaterialTypeId: [],
      changeStorage: [],
      flag: true,
      pathTo: false,
      supplyapi, // 查机构科室
      dismarntleFlag: true,
      dismarntleSuccessList: [],
      dismantleFailList: [],
      createDate: '',
      dismantleSuccess: '',
      dismantleFail: '',
      pathName: '',
      sectionOptions: [], // 领用科室
      submitTemplate: { // 提交弹窗模版
        content1: '领用单中已经添加当前物资类型的商品，如修改物资类型，将自动清空已添加的基本信息和商品信息',
        content2: '领用单中已经添加当前库房的商品，如需修改发货库房，将自动清空已添加的商品',
        content3: '领用单取消后不能恢复，请确认是否取消？'
      },
      unRepeatedBtn: false // 控制重复提交
    }
  },
  created () {
    this._initPath(this.$route.path)
    if (this.objId) {
      this.getDetail().then((res) => {
        Object.assign(this.obj, res)
      })
    } else {
      this._getStorageRoom()
      this.materialTypeId = ''
      this._info()
      let params = {
        orgIdList: [storage.getStorageByClinic('CLINICID') || ''],
        pagesize: 10000,
        offset: 0,
        usePermissionStatus: 'Y'
      }
      supplyapi.getTenantSubjectListByCondition(params).then(res => {
        if (res && res.data) {
          res.data.resultList.map(item => {
            this.sectionOptions.push({
              id: item.id,
              name: item.orgSubjectName
            })
          })
          this.$ever.getFieldFromSchema(this.schema, 'sectionId').props.options = this.sectionOptions
        }
      })
    }
    sysvalue.listOnce('THC_WH_DRUG_FORM').then(res => {
      if (res) {
        this.dosageFormArr = res
      }
    })
  },
  methods: {
    backTo () {
      if (this.pathName === '/csa/warehouseuses') {
        this.$router.push(this.pathName)
      } else {
        this.$router.go(-1)
      }
    },
    _initPath (path) {
      if (path.indexOf('/csa/warehouse') > -1) {
        this.pathName = '/csa/warehouseuses'
      } else {
        this.pathName = '/goods/consumptivereceives'
      }
    },
    handleRouterTo (source, id) {
      // 在手术工作站不跳转
      if (this.$route.path === '/csa/warehouseuse') return
      if (source === 1) {
        this.$router.push(this.obj.outStockObject.status === 20 ? '/goods/consumptiveoutputstorageroom/' + this.obj.outStockObject.id : '/goods/consumptiveoutputstorageroomedit/' + this.obj.outStockObject.id + '?look=' + this.obj.outStockObject.id)
      } else {
        if (this.$route.path.indexOf('/goods/') > -1) {
          this.$router.push('/goods/consumptivereceive/' + id)
        } else {
          this.$router.push('/csa/warehouseuse/' + id)
        }
      }
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
        api.getById(id || this.objId).then(res => {
          res.statusName = this.setName(FULL_STATE.use, res.status, true)
          res.items = []
          resolve(res)
        })
      })
    },
    printTable () {
      let code = 'WARHOUSE_ACQUISITION_DEPOSIT'
      everprint(code, { id: this.objId }, {
        preview: true,
        cb: _ => {
          console.log('打印完成')
        }
      })
    },
    precisionNum (row) {
      if (!row.num) row.num = undefined
      if (row.localMaterialId) {
        const dataType = row.classifyId || ''
        if (CHINESE_MEDICINE_TYPE.includes(dataType)) {
          return 4
        } else {
          return 0
        }
      }
    },
    handleCheckNum (data) {
      if (data.localMaterialId) {
        if (data.num <= 0 || data.num === '') {
          data.num = ''
          return this.$messageTips(this, 'warning', '领用数量不允许为0或负数，请重新录入')
        }
        let parse = /^(\+)?\d*$/ // 是否有小数
        let dataType = data.classifyId || ''
        if (CHINESE_MEDICINE_TYPE.includes(dataType)) { // 中药类型
          const num = checkAmountIntensiveReading({ price: data.num.toString(), num: 4 })
          if (!num) {
            data.num = ''
            return this.$messageTips(this, 'warning', '中药类型领用数量最多有四位小数，请重新录入')
          }
        } else {
          if (!parse.test(data.num)) {
            data.num = ''
            return this.$messageTips(this, 'warning', '领用数量必须为正整数，请重新录入')
          }
        }
      }
    },
    switchForm: debounce(function () {
      let params = {
        id: this.$route.params.id,
        type: 0,
        billType: this.obj.code
      }
      this.api.updateSwitch(params).then(res => {
        if (res) this.$router.push('/goods/consumptivereceive/' + this.objId + '?look=' + this.objId)
      })
    }),
    submitForm: debounce(function (form) {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          if (!this.obj.applyItemList.length) {
            this.$messageTips(this, 'warning', '领用单中还未添加商品，请先添加商品再提交')
            return
          }
          let params = {}
          params = Object.assign({}, params, this.obj)
          params.pageType = 'consumptivereceive'
          delete params.items
          params.materialType = ''
          for (let n = 0; n < params.applyItemList.length; n++) {
            delete params.applyItemList[n].unitGroupItemObject
            delete params.applyItemList[n].drugObject
            delete params.applyItemList[n].consumptiveMaterialObject
            delete params.applyItemList[n].equipmentObject
          }
          this.unRepeatedBtn = true
          this.api.createOrUpdate(params).then(res => {
            this.unRepeatedBtn = false
            if (res && res.list) {
              this.pathTo = true
              this.dismarntleFlag = false
              let result = JSON.parse(JSON.stringify(res.list))
              for (let i = 0; i < result.length; i++) {
                if (Number(result[i].shortSupply) === 0) {
                  this.dismantleSuccess = result[i].id
                  this.dismarntleSuccessList.push(result[i])
                } else {
                  this.dismantleFail = result[i].id
                  this.dismantleFailList.push(result[i])
                }
              }
            }
          })
        }
      })
    }),
    submitCancel: debounce(function () {
      this.api.cancle(this.objId).then(res => {
        this.getDetail().then((res) => {
          this.obj = Object.assign({}, this.obj, res)
        })
      })
    }),
    confirmFormMI: debounce(function () {
      this.obj.applyItemList = []
      this.obj.sectionId = ''
      this.obj.storageRoomId = ''
      // this.changeMaterialTypeId = [this.materialTypeId]
      this._info()
      this._setList(false)
      this.obj.materialType = this.materialTypeId
      this.queryParams.materialType = this.materialTypeId
    }),
    cancelFormMI: debounce(function () {
      this.flag = false
      // this.materialTypeId = this.oldMaterialTypeId
      this.obj.materialType = this.materialTypeId
      this.queryParams.materialType = this.materialTypeId
      // this.changeMaterialTypeId = [this.changeMaterialTypeId[0]]
    }),
    confirmFormSI: debounce(function () {
      this.obj.applyItemList = []
      this.obj.items = []
      setTimeout(() => {
        this._setList(true)
      }, 300)
      this.queryParams.storageRoomId = this.obj.storageRoomId
      // this.changeStorage = [this.obj.storageRoomId]
    }),
    cancelFormSI: debounce(function () {
      this.flag = false
      // storageroomApi.list({ name: '', offset: 0, pagesize: 20 }).then()
      // this.changeStorage = this.oldStorageRoomId
      this.obj.storageRoomId = this.oldStorageRoomId
      this.queryParams.storageRoomId = this.oldStorageRoomId
    }),
    handleCancle (type) {
      if (type === 'materialTypeId') {
        this.$confirm(this.submitTemplate.content1, '确认是否修改物资类型', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.confirmFormMI()
        }).catch(() => {
          this.cancelFormMI()
        })
      } else if (type === 'supplier') {
        this.$confirm(this.submitTemplate.content2, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.confirmFormSI()
        }).catch(() => {
          this.cancelFormSI()
        })
      } else {
        this.$confirm(this.submitTemplate.content3, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.submitCancel()
        }).catch(() => { })
      }
    },
    handleDeleteRow (index) {
      this.obj.applyItemList.splice(index, 1)
      this.obj = JSON.parse(JSON.stringify(this.obj))
    },
    handleAddRow (data) {
      if (!data['num'] || data['num'] < 0) {
        this.$messageTips(this, 'warning', '请填写领用数量后再添加(领用数量不能小于0)')
        return
      }
      for (let i = 0; i < this.obj.applyItemList.length; i++) {
        if (data.localMaterialId === this.obj.applyItemList[i].localMaterialId) {
          this.$messageTips(this, 'warning', '该商品已经添加')
          return
        }
      }
      if (data.localMaterialId) {
        this.obj.applyItemList.push(data)
        this.obj = JSON.parse(JSON.stringify(this.obj))
        this.$nextTick(function () {
          let temCode = this.tableCode
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
        this.$messageTips(this, 'warning', '该物资在发货库房无存在记录')
      }
    },
    handleSelect (data) {
      for (let key in this.obj.items[0]) {
        let item = this.obj.items[0]
        if (data.localMaterialId) {
          if (key === 'num') {
            item[key] = ''
          } else if (key === 'unitId') {
            item[key] = data.unitId || ''
          } else if (key === 'materialType') {
            item[key] = data.classifyId || ''
          } else {
            item[key] = data[key] || ''
          }
          if (item.usableNum === '') {
            item.usableNum = 0
          }
        } else {
          item[key] = ''
        }
      }
      Object.assign(this.obj.items[0], data)
    },
    _setStorageRoom (id) {
      // if (!this.obj.applyItemList.length) this.oldStorageRoomId = id
      if ((this.obj.applyItemList.length || (this.obj.items[0] && this.obj.items[0].localMaterialId)) && this.flag) {
        let dom = document.querySelectorAll('.el-form .el-input__inner')
        if (dom && dom.length) dom.forEach(item => { item.blur() })
        this.handleCancle('supplier')
      }
      // this.queryParams.storageRoomId = id
      if (id) {
        if (!this.obj.items[0]) {
          this._setList(true)
        }
      } else {
        !this.$route.query.look && this._setList(false)
      }
      this.flag = true
      // this.changeStorage.push(id)
    },
    _setList (flag) {
      if (flag) {
        for (let key in this.tableCode) {
          this.tableCode[key] = ''
        }
        this.obj.items[0] ? this.obj.items[0] = this.tableCode : this.obj.items.push(this.tableCode)
      } else {
        this.obj.items = []
      }
    },
    async _getStorageRoom (id) {
      if (this.objId) return
      await storageroomApi.list({ materialType: '', name: '', isInvented: 0, offset: 0, pagesize: 99999 }).then(res => {
        if (res && res.list) {
          let storageroomArr = JSON.parse(JSON.stringify(res.list))
          this.$ever.getFieldFromSchema(this.schema, 'storageRoomId').props.options = storageroomArr
        }
      })
    },
    _info () {
      this.tableCode = Object.assign({}, this.tableCode, {
        localMaterialId: '',
        name: '',
        iname: '',
        unitId: '',
        num: '',
        usableNum: '',
        materialType: ''
      })
      // this._getStorageRoom(this.materialTypeId)
    },
    ...patch
  },
  watch: {
    '$route' (val) {
      this._initPath(val.path)
      this.objId = val.params.id
      this.taskId = val.query.taskId
      if (this.objId) {
        this.schema = this.createObject().schema
        this.obj = this.createObject().obj
        this.getDetail().then((res) => {
          this.obj = Object.assign({}, this.obj, res)
          this.pathTo = true
          this.dismarntleFlag = true
        })
      }
    },
    'materialTypeId' (type, oldType) {
      if (!this.objId) {
        this.oldMaterialTypeId = oldType
        if (type && this.flag && (this.obj.sectionId || this.obj.storageRoomId || this.obj.applyItemList.length)) {
          this.handleCancle('materialTypeId')
        } else {
          this.queryParams.materialType = this.materialTypeId
          this.obj.materialType = this.materialTypeId
        }
        this.flag = true
      }
    },
    'obj.storageRoomId' (val, oldval) {
      if (!this.objId) {
        this.oldStorageRoomId = oldval
        this.queryParams.storageRoomId = val
        if (val) {
          this._setStorageRoom(val)
        } else {
          this.obj.items = []
          this.obj.applyItemList = []
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
<style lang="scss" scoped>
.priceInput {
  width: 80px;
  /deep/ .el-input__inner {
    padding: 0;
  }
}
.success {color: #16C277;}
.success_text {font-size: 14px; color: #666666;}
.demerge {padding: 10px 20px; background-color: #ffffcc;}
.demerge span {line-height: 22px;}
.main-head {padding: 0 0 20px 0;}
.main-option h4 { margin: 0 !important;line-height: 36px; }
.main-option .number {margin: 0 0 0 20px;line-height: 36px;}
.clearfloat:after{content: ''; text-overflow: ellipsis; clear:both;}
.clearfloat{zoom:1;}
.type {font-size: 14px; color: #48576a; margin-left: 52px;}
.type > span {margin-right: 6px;}
.line30 /deep/ .el-form-item__content{line-height: 30px}
</style>
