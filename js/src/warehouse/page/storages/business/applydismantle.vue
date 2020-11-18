<template>
  <div>
    <ever-bread-crumb
      name="申领"
      showTitle="true"
    ></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <div v-if="dismarntleFlag">
          <h4>第一步：基本信息</h4>
          <ever-form2
            :schema="schema"
            v-model="obj"
            ref="form"
            :span="12"
            :rules="rules"
            :nosubmit="true"
          ></ever-form2>
          <h4>第二步：添加商品</h4>
          <div class="listinfo">
            <div class="table">
              <el-table
                :data="obj.purchaseRequisitionItem"
                style="width: 100%"
                :class="[obj.items && obj.items.length ? '' : 'table2']"
                empty-text="请选择发货库房"
              >
                <div>
                  <el-table-column show-overflow-tooltip prop label width="10"></el-table-column>
                </div>
                <div>
                  <el-table-column show-overflow-tooltip prop label width="50">
                    <template slot-scope="scope">
                      <span>{{scope.$index + 1}}</span>
                    </template>
                  </el-table-column>
                </div>
                <div>
                  <el-table-column prop="name" label="商品名称">
                    <template slot-scope="scope">
                      <material-show-name v-if="scope.row.materialName" :materialName="scope.row.materialName" :icons="scope.row.icons"></material-show-name>
                    </template>
                  </el-table-column>
                </div>
                <div>
                  <el-table-column
                    prop=""
                    width="120"
                    label="规格">
                      <template slot-scope="scope">
                        <span>{{scope.row.spec || '-'}}</span>
                    </template>
                  </el-table-column>
                </div>
                <div>
                  <el-table-column show-overflow-tooltip prop width="80" align="center" label="单位">
                    <template slot-scope="scope">
                      <span>{{scope.row.unitName || '-'}}</span>
                    </template>
                  </el-table-column>
                </div>
                <div>
                  <el-table-column
                    show-overflow-tooltip
                    align="right"
                    prop="usableNum"
                    width="100"
                    label="可用库存"
                  ></el-table-column>
                </div>
                <div>
                  <el-table-column
                    show-overflow-tooltip
                    prop
                    align="right"
                    label="申领数量"
                    width="140"
                  >
                    <template slot-scope="scope">
                      <el-input
                        placeholder="申领数量"
                        v-model="scope.row.num"
                        type="number"
                        size="small"
                        @focus="handleStorageNum(scope.row.num)"
                        @blur="handleNum(scope.row, scope.$index)"
                      ></el-input>
                    </template>
                  </el-table-column>
                </div>
                <div>
                  <el-table-column prop label width="70">
                    <template slot-scope="scope">
                      <span class="bg_OOS" v-if="(scope.row.usableNum || scope.row.usableNum === 0) && scope.row.num > scope.row.usableNum">
                        {{ (scope.row.usableNum || scope.row.usableNum === 0) && scope.row.num > scope.row.usableNum ? 23 : '' | formateValueToFnt({
                        list: FULL_STATE.outstock
                        }) }}
                      </span>
                    </template>
                  </el-table-column>
                </div>
                <div>
                  <el-table-column show-overflow-tooltip prop width="80" label="操作">
                    <template slot-scope="scope">
                      <el-button
                        size="small"
                        type="danger"
                        @click.native.prevent="handleDeleteRow(obj.purchaseRequisitionItem, scope.$index)"
                      >删除</el-button>
                    </template>
                  </el-table-column>
                </div>
                <div>
                  <el-table-column prop width="10" label></el-table-column>
                </div>
              </el-table>
              <!-- 查询添加商品 -->
              <div>
                <el-table
                  v-if="obj.items.length"
                  ref="additem"
                  :class="[obj.purchaseRequisitionItem.length ? 'additem2' : 'additem']"
                  :data="obj.items"
                  v-ever-bind-enter="{ cycle: true }"
                  style="width: 100%">
                  <div>
                    <el-table-column prop width="10" label></el-table-column>
                  </div>
                  <div>
                    <el-table-column prop label width="50"></el-table-column>
                  </div>
                  <div>
                    <el-table-column prop="name" label="商品名称">
                      <template slot-scope="scope">
                        <material-select
                          ref="remoteselect"
                          :params="queryParams"
                          :needObjFlag="true"
                          @change="handleSelect"
                        ></material-select>
                      </template>
                    </el-table-column>
                  </div>
                  <div>
                    <el-table-column
                      prop=""
                      width="120"
                      label="规格">
                      <template slot-scope="scope">
                        <span>{{scope.row.spec || '-'}}</span>
                      </template>
                    </el-table-column>
                  </div>
                  <div>
                    <el-table-column
                      show-overflow-tooltip
                      prop
                      width="80"
                      align="center"
                      label="单位"
                    >
                      <template slot-scope="scope">
                        <span>{{scope.row.unitName || ''}}</span>
                      </template>
                    </el-table-column>
                  </div>
                  <div>
                    <el-table-column
                      show-overflow-tooltip
                      prop="usableNum"
                      width="100"
                      align="right"
                      label="可用库存"
                    ></el-table-column>
                  </div>
                  <div>
                    <el-table-column
                      show-overflow-tooltip
                      prop
                      label="申领数量"
                      align="right"
                      width="140"
                    >
                      <template slot-scope="scope">
                        <el-input
                          size="small"
                          @blur="handleJudgeAmount(scope.row)"
                          v-model="scope.row.num"
                          type="number"
                          placeholder="申领数量"
                        ></el-input>
                      </template>
                    </el-table-column>
                  </div>
                  <div>
                    <el-table-column prop label width="70"></el-table-column>
                  </div>
                  <div>
                    <el-table-column show-overflow-tooltip prop width="80" label="操作">
                      <template slot-scope="scope">
                        <el-button
                          size="small"
                          type="primary"
                          @click.native.prevent="handleAddRow(scope.row)"
                        >添加</el-button>
                      </template>
                    </el-table-column>
                  </div>
                  <div>
                    <el-table-column prop width="10" label></el-table-column>
                  </div>
                </el-table>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="!dismarntleFlag">
          <p class="success">申领单提交成功！</p>
          <span v-if="!dismantleFailList.length" class="success_text">您申领的物品已经收到，我们会尽快完成物品的配送。</span>
          <div v-else class="demerge success_text">
            <span v-if="!dismarntleSuccessList.length && dismantleFailList.length">
              您申领的商品暂时库存不足，我们会尽快补足库存并配送。
            </span>
            <span v-if="dismarntleSuccessList.length && dismantleFailList.length">
              您申领的商品中，有部分物品暂时库存不足，所以拆分为以下单据分开配送。库存不足的物品，我们会尽快补足库存并配送。
            </span>
          </div>
          <div>
            <div class="table" v-if="dismarntleSuccessList.length && dismarntleSuccessList[0].shortSupply == 0">
              <div class="clearfloat">
                <h4 class="fl">申领的商品详情</h4>
                <div class="number fl">
                  <span>单号：</span>
                  <a
                    class="blue cur"
                    @click="$router.push('/storages/business/applybusiness/' + dismantleSuccess)"
                  >{{dismarntleSuccessList[0].code}}</a>
                </div>
              </div>
              <el-table
                :data="dismarntleSuccessList[0].purchaseRequisitionItem"
                style="width: 100%">
                <el-table-column show-overflow-tooltip prop label width="50">
                  <template slot-scope="scope">
                    <span>{{scope.$index + 1}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="商品名称">
                  <template slot-scope="scope">
                    <material-show-name v-if="scope.row.materialName" :materialName="scope.row.materialName" :icons="scope.row.icons"></material-show-name>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  width="120"
                  label="规格">
                  <template slot-scope="scope">
                    <span>{{scope.row.spec || '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop width="100" align="center" label="单位">
                  <template slot-scope="scope">
                    <span>{{scope.row.unitName || ''}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="num"
                  align="right"
                  label="申领数量"
                  width="100"
                ></el-table-column>
              </el-table>
            </div>
            <div v-if="dismantleFailList.length && dismantleFailList[0].shortSupply == 1">
              <div class="clearfloat">
                <h4 class="fl">申领的商品详情</h4>
                <div class="number fl">
                  <span>单号：</span>
                  <a class="blue cur"
                    @click="$router.push('/storages/business/applybusiness/' + dismantleFail)"
                  >{{dismantleFailList[0].code}}</a>
                </div>
              </div>
              <el-table
                :data="dismantleFailList[0].purchaseRequisitionItem"
                style="width: 100%">
                <el-table-column show-overflow-tooltip prop label width="50">
                  <template slot-scope="scope">
                    <span>{{scope.$index + 1}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="商品名称">
                  <template slot-scope="scope">
                    <material-show-name v-if="scope.row.materialName" :materialName="scope.row.materialName" :icons="scope.row.icons"></material-show-name>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  width="120"
                  label="规格">
                  <template slot-scope="scope">
                    <span>{{scope.row.spec || '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop width="100" align="center" label="单位">
                  <template slot-scope="scope">
                    <span>{{scope.row.unitName || ''}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="num"
                  align="right"
                  label="申领数量"
                  width="100"
                >
                  <template slot-scope="scope">
                    <span class="red">{{scope.row.num}}</span>
                    <span class="bg_OOS">
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
        <el-button
          type="primary"
          size="small"
          @click="submitForm('form')"
          :disabled="this.obj.purchaseRequisitionItem.length != 0 ? false : true"
          :loading="unRepeatedBtn"
        >提交申领单</el-button>
      </div>
    </div>
    <loading-cover :loading="loading">
      <h2 slot="title">院内申领单系统生成中</h2>
    </loading-cover>
  </div>
</template>
<script>
import api from '../store/applyapi'
// import departmentApi from '@/sob/store/departmentapi'
import inventoryqueryApi from '@/warehouse/store/getmaterialinfoapi'
// import inventoryqueryApi from '../store/inventoryapi'
import storageroomApi from '@/warehouse/store/storageroomapi'
import tipDialog from '@/warehouse/page/components/tipsdialog'
import { FULL_STATE, debounce, patch, SPEC_CODE, PACKAGE_CODE } from '@/util/common'
import sysvalue from '@/warehouse/store/sysvalueapi'
import setName from '@/util/setstatusname'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import storage from '@/util/storage'
import selectInquireList from '@/warehouse/util/selectinquirelist'
import loadingCover from '@/warehouse/page/components/procurement/loadingcover'
import { REMOTE_METHODS_PLACEHOLDER } from '@/warehouse/views/util/constant'

let schema = [
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
    label: '发货库房',
    comp: 'ever-remoteMethod',
    props: {
      api: storageroomApi,
      initoptions: [],
      filter: '',
      filterName: 'id',
      params: { materialType: '' },
      isSilentQuery: true
    },
    span: 6
  },
  // {
  //   name: 'sectionId',
  //   label: '科室',
  //   comp: 'ever-remoteMethod',
  //   props: {
  //     api: departmentApi,
  //     otherOption: true,
  //     initoptions: []
  //   },
  //   span: 8
  // },
  // {
  //   name: 'sectionId',
  //   label: '申领科室',
  //   comp: 'ever-select',
  //   props: {
  //     options: [],
  //     clearable: true
  //   },
  //   span: 6
  // },
  {
    name: 'description',
    label: '备注',
    props: {
      maxlength: 50
    },
    span: 6
  }
]
const float = /^(\+)?\d+(\.\d+)?/
const parse = /^(\+)?\d*$/
export default {
  mixins: [setName, getstorage, selectInquireList],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.purchaseRequisitionItem = []
    obj.items = []
    return {
      schema,
      obj,
      api,
      SPEC_CODE,
      FULL_STATE,
      PACKAGE_CODE,
      inventoryqueryApi,
      tableCode: {},
      dosageFormArr: [],
      float,
      parse,
      materialTypeArr: [],
      REMOTE_METHODS_PLACEHOLDER,
      queryParams: { materialType: '', offset: 0, pagesize: 20, state: 0 },
      rules: {
        // materialType: { required: true, message: '必填项', trigger: 'change' },
        toStorageRoomId: { required: true, message: '必填项', trigger: 'change' },
        // sectionId: { required: true, message: '必填项', trigger: 'change' }
      },
      storageArr: [], // 所有的库房数据
      changeStorageRoomId: [],
      dismarntleFlag: true,
      dismarntleSuccessList: [],
      dismantleFailList: [],
      dismantleSuccess: '',
      dismantleFail: '',
      loading: false,
      unRepeatedBtn: false // 控制重复提交
    }
  },
  created () {
    // 查询申领详情
    this.storageRoomMaterial()
    this.$ever.getFieldFromSchema(this.schema, 'toStorageRoomId').props.params = Object.assign({ isInvented: this.isInvented, storageRoomId: this.storageId }, this.queryParams)
    this.$ever.getFieldFromSchema(this.schema, 'toStorageRoomId').props.params.pagesize = 9999
    if (this.$route.params.id !== 'new') this.getInfoById(this.$route.params.id)
    this._info()
    sysvalue.listOnce('THC_WH_DRUG_FORM').then(res => {
      if (res) {
        this.dosageFormArr = res
      }
    })
    // this._sentenceSelect(true).then(res => {
    //   this.$ever.getFieldFromSchema(this.schema, 'sectionId').props.options = res
    // })
    this._getStorageRoom()
    // 预警 - 申领
    if (this.$route.query.alert) {
      this.loading = true
      this.defaultStorageRoom({ roomId: this.storageId }).then(res => {
        this.schema[0].props.initoptions = [res]
        this.obj.toStorageRoomId = res.storageRoomId
        this.queryParams.storageRoomId = res.storageRoomId
      })
    }
    this.materialTypeArr = storage.getLocalStorage('MATERIAL_TYPE')
  },
  methods: {
    // 初始化数据
    _info () {
      // this.queryParams.materialType = this.obj.materialType
      this.queryParams.storageRoomId = this.storageId
      // this.schema[0].props.retain = this.obj.materialType
      this.tableCode = Object.assign({}, this.tableCode, {
        materialName: '',
        localMaterialId: '',
        spec: '',
        unitName: '',
        packagUnitName: '',
        usableNum: '',
        isManageAlone: '',
        isExpiryDate: '',
        num: '',
        unitId: '',
        classifyId: ''
      })
    },
    // 处理表格数据
    async _setList (flag) {
      if (flag && this.$route.query.alert) {
        const applyOrder = await this.createApplyOrder({
          applyRoomId: this.storageId,
          deliveredRoomId: this.queryParams.storageRoomId
        })
        this.loading = false
        if (applyOrder && applyOrder.length) {
          this.obj.purchaseRequisitionItem = applyOrder
          this.obj.purchaseRequisitionItem.forEach(v => {
            v.num = v.applyNum
          })
        }
        for (let key in this.tableCode) {
          this.tableCode[key] = ''
        }
        this.obj.items[0] ? this.obj.items[0] = this.tableCode : this.obj.items.push(this.tableCode)
      } else if (flag) {
        for (let key in this.tableCode) {
          this.tableCode[key] = ''
        }
        this.obj.items[0] ? this.obj.items[0] = this.tableCode : this.obj.items.push(this.tableCode)
      } else {
        this.obj.items = []
        this.obj.purchaseRequisitionItem = []
      }
    },
    // 根据id获取申领单详情
    getInfoById (id) {
      // this.api.getMoreById({ id }).then(res => {
      //   this.handleInfo(res)
      // })
    },
    // 处理详情数据
    handleInfo (data) {
      Object.assign(this.obj, data)
      this.obj.purchaseRequisitionItem = data.purchaseRequisitionItem
      // this.obj.toStorageRoomId = data.requsitionStorageRoomId
      delete this.obj.id
    },
    // 预警 - 申领 - 获取默认库房
    async defaultStorageRoom (params) {
      return await this.api.defaultStorageRoom(params)
    },
    // 预警 - 申领 - 获取物资列表
    async createApplyOrder (params) {
      return await this.api.createApplyOrder(params)
    },
    submitForm: debounce(function (form) {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          if (!this.obj.purchaseRequisitionItem.length) {
            this.$messageTips(this, 'warning', '申领单中还未添加商品，请先添加商品再提交')
            return
          }
          let params = {}
          params = Object.assign({}, params, this.obj)
          params.pageType = 'storages/business/applybusiness'
          delete params.items
          // params.purchaseRequisitionItem = []
          params.materialType = ''
          params.requsitionStorageRoomId = this.storageId
          // for (let n = 0; n < params.purchaseRequisitionItem.length; n++) {
          //   params.purchaseRequisitionItem[n].materialType = this.obj.materialType
          // }
          this.unRepeatedBtn = true
          this.api.createOrUpdate(params).then(result => {
            this.unRepeatedBtn = false
            if (Array.isArray(result)) {
              this.dismarntleFlag = false
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
    handleDeleteRow (data, index) {
      this.obj.purchaseRequisitionItem.splice(index, 1)
      this.obj = JSON.parse(JSON.stringify(this.obj))
    },
    handleNum (data, index) {
      if (!data.localMaterialId) return this.$messageTips(this, 'warning', '该物资在发货库房无存在记录')
      if (data.num <= 0 || data.num === '') this.obj.purchaseRequisitionItem[index].num = this.storageNum
      let dataType = data.classifyId || ''
      if (dataType !== '303' && dataType !== '304') {
        if (!parse.test(data.num)) {
          this.obj.purchaseRequisitionItem[index].num = this.storageNum
        }
      } else {
        if (!float.test(data.num)) {
          this.obj.purchaseRequisitionItem[index].num = this.storageNum
        }
      }
      if (data.num > data.usableNum) {
        this.$messageTips(this, 'warning', '缺货商品会提醒发货库房尽快补货')
      }
    },
    handleStorageNum (num) {
      this.storageNum = num
    },
    handleJudgeAmount (data) {
      if (!data.localMaterialId) return this.$messageTips(this, 'warning', '该物资在发货库房无存在记录')
      if (data.num <= 0) {
        this.obj.items[0].num = ''
        this.$messageTips(this, 'warning', '申领数量为0或未输入，请重新录入')
        this.obj = JSON.parse(JSON.stringify(this.obj))
        return
      }
      let dataType = data.classifyId || ''
      if (dataType !== '303' && dataType !== '304') {
        if (!parse.test(data.num)) {
          this.obj.items[0].num = ''
          this.$messageTips(this, 'warning', '申领数量不能小于0并且不能有小数，请重新录入')
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
      } else {
        if (!float.test(data.num)) {
          this.obj.items[0].num = ''
          this.$messageTips(this, 'warning', '申领数量不能小于0，请重新录入')
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
      }
      if (data.num > data.usableNum) {
        this.$messageTips(this, 'warning', '缺货商品会提醒发货库房尽快补货')
      }
    },
    handleAddRow (data) {
      if (!data.localMaterialId) return this.$messageTips(this, 'warning', '该物资在发货库房无存在记录')
      if (data['num'] <= 0 || data['num'] === '') {
        this.$messageTips(this, 'warning', '请填写申领数量后再添加')
        return
      }
      for (let i = 0; i < this.obj.purchaseRequisitionItem.length; i++) {
        if (data.localMaterialId === this.obj.purchaseRequisitionItem[i].localMaterialId) {
          this.$messageTips(this, 'warning', '该商品已经添加')
          return
        }
      }
      if (data.localMaterialId) {
        if (!data.usableNum) data.usableNum = 0
        this.obj.purchaseRequisitionItem.push(data)
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
        this.$messageTips(this, 'warning', '该物资在发货库房无存在记录')
      }
    },
    handleSelect (data) {
      for (let key in this.obj.items[0]) {
        let item = this.obj.items[0]
        item[key] = ''
      }
      if (data) {
        inventoryqueryApi.list(Object.assign(this.queryParams, { ifMoreThanZero: 0, localMaterialId: data.localMaterialId })).then(res => {
          if (res && res.list && res.list.length) {
            for (let key in this.obj.items[0]) {
              let item = this.obj.items[0]
              if (key === 'num') {
                item[key] = ''
              } else if (key === 'unitId') {
                item[key] = data.unitId
              } else {
                item[key] = res.list[0][key] || ''
              }
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
    // 取消选择
    handleCancle () {
      this.obj.purchaseRequisitionItem = []
    },
    async _getStorageRoom (id) {
      await storageroomApi.list({ materialType: '', name: '', offset: 0, pagesize: 10000, isInvented: this.isInvented, storageRoomId: this.storageId }).then(res => {
        if (res && res.list) {
          let storageroomArr = JSON.parse(JSON.stringify(res.list))
          this.storageArr = storageroomArr
          this.$ever.getFieldFromSchema(this.schema, 'toStorageRoomId').props.initoptions = storageroomArr.filter(item => {
            return item.id !== this.storageId
          })
        }
      })
    },
    ...patch
  },
  watch: {
    'obj.toStorageRoomId' (val) {
      this.queryParams.storageRoomId = val
      if (this.materialTypeArr) {
        let newMaterialType = JSON.parse(this.materialTypeArr)
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
      } else {
      }
      if (val && !this.obj.purchaseRequisitionItem.length) {
        this._setList(true)
      } else {
        if (!this.$route.params.id || this.$route.params.id === 'new') {
          this._setList(false)
        } else {
          this._setList(true)
        }
        // this._getStorageRoom(this.obj.materialType)
      }
    }
  },
  components: {
    tipDialog,
    loadingCover
  }
}
</script>
<style lang="scss" scoped>
.success {
  color: #16c277;
}
.success_text {
  font-size: 14px;
  color: #666666;
}
.demerge {
  padding: 10px 20px;
  background-color: #ffffcc;
}
.demerge span {
  line-height: 22px;
}
// .main-option h4 {
//   margin: 0 !important;
//   line-height: 36px;
// }
.number {
  margin: 0 0 0 20px;
  line-height: 36px;
}
.clearfloat:after {
  content: "";
  text-overflow: ellipsis;
  clear: both;
}
.clearfloat {
  zoom: 1;
}
</style>
