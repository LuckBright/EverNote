<template>
  <div>
    <div></div>
    <ever-bread-crumb :name="'采购单'" @back="backTo" is-custom-back></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <div class="main-head">
          <!-- 基础信息 -->
          <h4 class="stripTips"><i class="fl strip"></i><span class="fl ml10">{{!objId || status ? '填写基础信息' : '基础信息'}}</span></h4>
          <ever-form2
            :class="objId && !status ? 'from' : 'newFrom'"
            :schema="schema"
            :nosubmit="true"
            ref="form"
            :labelWidth="'130px'"
            :rules="rules"
            v-model="obj">
            <!-- 取消原因 -->
            <template slot="abolitionReason">
              <el-tooltip placement="top-start">
              <div slot="content" style="max-width: 300px;">
                {{obj.abolitionReason}}
              </div>
              <div class="ellipsis">
                {{obj.abolitionReason}}
              </div>
            </el-tooltip>
            </template>
            <!-- 备注 -->
            <template slot="description">
              <el-tooltip placement="top-start" v-if="obj.description">
              <div slot="content" style="max-width: 300px;">
                {{obj.description}}
              </div>
              <div class="ellipsis">
                {{obj.description}}
              </div>
            </el-tooltip>
            <span v-else>无</span>
            </template>
            <template slot="inStockCode">
              <el-button
                type="text"
                class="f14"
                @click="$router.push(`/goods/drugenterstorageroomedit/${obj.inStockId}?look=${obj.inStockId}`)">{{obj.inStockCode}}</el-button>
              <span v-if="obj.status == 5" :class="'unfinish_color'">{{obj.statusName}}</span>
              <span
                v-else-if="obj.status == 4"
                class="ml20"
                :class="{ 'red': obj.arriveStatus === 13 }"
              >{{setName(FULL_STATE.instock, obj.arriveStatus, true)}}</span>
              <span v-else>未生成</span>
            </template>
          </ever-form2>
        </div>
        <!-- 添加物资 -->
        <div class="main-head">
          ----
          <h4 class="stripTips"><i class="fl strip"></i><span class="fl ml10">{{!objId || status ? '添加物资' : '物资明细'}}</span></h4>
          <el-table
            :border="true"
            v-ever-bind-enter="{resetHead: 2}"
            empty-text="请先填写基础信息"
            :data="tableData">
            <!-- <el-table-column prop label="物资编码" width="200" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.materialsCode">{{scope.row.materialsCode}}</span>
                <span v-else>-</span>
              </template>
            </el-table-column> -->
            <el-table-column prop="name" label="物资名称">
              <template slot-scope="scope" align="center">
                <remote-select
                  ref="remoteselect"
                  :queryParams="queryParams"
                  :apiName="'purchaseList'"
                  :islocal="true"
                  placeholder="请输入通用名／商品名／首字母缩写／物资编码"
                  :api="localApi"
                  :isSilentQuery="true"
                  @selectSave="handleSelect"
                  v-if="scope.$index === tableData.length - 1 && (!objId || status) && !scope.row.add"
                ></remote-select>
                <span v-else>
                  <wh-code-to-name
                    v-if="scope.row.localSettingObject"
                    :isExt="true"
                    :cType="3"
                    :patchObj="{
                      list: scope.row.localSettingObject.materialSkuObject.ext
                    }"
                  ></wh-code-to-name>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop label="规格" align="center" width="90px">
              <template slot-scope="scope">
                <wh-code-to-name
                  v-if="scope.row.localSettingObject"
                  :showIcon="false"
                  :isExt="true"
                  :patchObj="{
                    standard: true,
                    code: [[]],
                    list: scope.row.localSettingObject.materialSkuObject.ext,
                  }">
                </wh-code-to-name>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop label="采购数量" align="center" width="150px">
              <template slot-scope="scope">
                <div style="position: relative;line-height: 28px;" v-if="scope.row.localSettingObject">
                  <el-input
                    @blur="handleTotalAmount(scope.row)"
                    v-if="!objId || status"
                    v-model="scope.row.num"
                    type="number"
                    class="numInput fl"
                    style="width: 100px"
                    size="small"
                    placeholder="采购数量">
                  </el-input>
                  <span v-else>
                    {{scope.row.num}}
                    <wh-code-to-name
                      v-if="scope.row.localSettingObject &&  scope.row.localSettingObject.materialSkuObject"
                      :showIcon="false"
                      :isExt="true"
                      :patchObj="{
                        code: PACKAGE_CODE,
                        list: scope.row.localSettingObject.materialSkuObject.ext,
                      }">
                    </wh-code-to-name>
                  </span>
                  <span style="display: block;width:15px;height:19px;" class="fl" v-if="!objId || status">
                    <wh-code-to-name
                      class="ml5"
                      v-if="scope.row.localSettingObject &&  scope.row.localSettingObject.materialSkuObject"
                      :showIcon="false"
                      :isExt="true"
                      :patchObj="{
                        code: PACKAGE_CODE,
                        list: scope.row.localSettingObject.materialSkuObject.ext,
                      }">
                    </wh-code-to-name>
                  </span>
                </div>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop label="采购单价" align="center" width="100px">
              <template slot-scope="scope">
                <div style="position: relative;" v-if="scope.row.localSettingObject">
                  <el-input-number
                    class="priceInput"
                    placeholder="采购单价"
                    v-if="!objId || status"
                    v-model="scope.row.price"
                    :controls="false"
                    :disabled="queryParams.supplyMode === 2 && (tableData.length > 1 ? scope.$index !== tableData.length - 1 : true)"
                    size="small"
                    @change="handlePrice(scope.row, scope.$index)"
                    :precision="4">
                  </el-input-number>
                  <span v-else>
                    {{scope.row.price | formatToFinacial(4)}}
                  </span>
                </div>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop label="采购金额（元）" align="center" width="150px">
              <template slot-scope="scope">
                <span v-if="scope.row.totalPrice">{{scope.row.totalPrice | formatToFinacial(4)}}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="inStockNum" label="入库数量" align="center" width="100" v-if="objId && !status && obj.arriveStatus === 7 && !obj.summaryCode"></el-table-column>
            <el-table-column prop="differenceNum" label="差异" align="center" width="100" v-if="objId && !status && obj.arriveStatus === 7 && !obj.summaryCode">
              <template slot-scope="scope">
                <span v-if="scope.row.differenceNum">{{scope.row.differenceNum > 0 ? `+${scope.row.differenceNum}` : scope.row.differenceNum}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" v-if="status || !objId" align="center" width="100">
              <template slot-scope="scope">
                <i
                  class="iconfont icon-bingli-shanchu"
                  @click="handlerDelter(scope.$index)"
                  :class="{'mr15': scope.$index === tableData.length - 1, 'blue': !btnGray, 'cGray': btnGray}"
                  v-if="tableData.length > 1">
                </i>
                <el-button
                  type="text"
                  @click="handlerAdd(scope.row, scope.$index)"
                  v-if="scope.$index === tableData.length - 1"
                  >
                  <i
                  class="iconfont icon-tianjiabingli"
                  :class="{ 'blue': !btnGray, 'cGray': btnGray }">
                  </i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 金额合计 -->
          <div style="width: 100%;height: 30px;">
            <span class="fr"><span class="f14 con">采购总金额：</span><span class="fon">{{totalSum}}元</span></span>
          </div>
          <!-- 按钮组 -->
          <div>
            <el-button type="primary" size="small" v-if="!objId || status" :loading="btnLoading" class="w_100" :disabled="btnDsiabled" @click="submit(2)">提交</el-button>
            <el-button type="primary" size="small" v-if="!objId || status" :loading="btnLoading" :disabled="btnDsiabled" @click="submit(1)">暂存</el-button>
            <el-button size="small" v-if="obj.status === 4 && obj.arriveStatus === 6" :loading="btnLoading" @click="handleCancle">取消</el-button>
            <el-button size="small" v-if="!objId || status" @click="handlerCancel" :loading="btnLoading">返回</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 取消采购单 -->
    <cancel-drug ref="cancelDrug" @change="clickCancel"></cancel-drug>
  </div>
</template>

<script>
import remoteSelect from '@/warehouse/page/joinstorage/remoteselect.vue'
import storageroomApi from '@/warehouse/store/storageroomapi.js'
import supplierpriceapi from '@/warehouse/store/supplierpriceapi.js' // 获取机构下所有的供应商
import localApi from '@/warehouse/store/getmaterialinfoapi.js' // 查询物资接口
import api from '@/warehouse/page/purchease/purcheasenewapi.js'
import contrctApi from '../contract/api/contrct.js'
import setName from '@/util/setstatusname'
import cancelDrug from './canceldrug' // 取消采购单弹窗
import {
  SPEC_CODE,
  floatTool,
  FULL_STATE,
  PACKAGE_CODE,
  debounce,
  parserComplex,
  CHINESE_MEDICINE_TYPE,
  checkAmountIntensiveReading,
  GOLBAL_VAL_MATERIL_NAME} from '@/util/common'

let schema = []
let schemaItem = [
  {
    name: 'storageRoomId',
    label: '收货库房',
    comp: 'sys-select',
    labelWidth: '66px',
    props: {
      options: [],
      clearable: false
    },
    span: 7
  },
  {
    name: 'supplierLocalId',
    label: '供应商',
    labelWidth: '52px',
    comp: 'sys-select',
    props: {
      options: [],
      clearable: false
    },
    span: 7
  },
  {
    name: 'contractNum',
    label: '合同',
    labelWidth: '38px',
    comp: 'ever-select',
    props: {
      options: [],
      needObjFlag: true
    },
    span: 7
  },
  {
    name: 'description',
    label: '备注',
    span: 7,
    labelWidth: '66px',
    props: {
      maxlength: 100
    }
  }
]
let readSchema = [
  {
    name: 'code',
    label: '采购单号:',
    comp: 'readonlyitem',
    props: {
      nocGray: true
    },
    span: 6
  },
  {
    name: 'statusName',
    label: '采购单状态:',
    comp: 'readonlyitem',
    props: {
      nocGray: true
    },
    span: 6
  },
  {
    name: 'buyerName',
    label: '采购人:',
    comp: 'readonlyitem',
    props: {
      nocGray: true,
    },
    span: 6
  },
  {
    name: 'createTime',
    label: '采购单创建时间:',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'supplierName',
    label: '供应商:',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'contractName',
    label: '合同:',
    comp: 'readonlyitem',
    props: {
      nocGray: true
    },
    span: 6
  },
  {
    name: 'description',
    label: '备注:',
    comp: 'custom',
    span: 6
  },
  {
    name: 'applyCode',
    label: '采购申请单号:',
    comp: 'readonlyitem',
    props: {
      nocGray: true,
    },
    span: 6
  },
  {
    name: 'storageRoomName',
    label: '收货库房:',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'inStockCode',
    label: '采购入库任务单号:',
    comp: 'custom',
    span: 6
  }
]
const parse = /^(\+)?\d*$/ // 是否有小数
export default {
  mixins: [setName],
  data () {
    schema = this.createObject().schema
    let obj = this.createObject().obj
    return {
      schema,
      obj,
      localApi,
      totalSum: 0,
      tableData: [],
      SPEC_CODE,
      api,
      btn: '',
      FULL_STATE,
      contrctApi,
      storageroomApi,
      CHINESE_MEDICINE_TYPE,
      PACKAGE_CODE,
      rules: {
        storageRoomId: { required: true, message: '必填项', trigger: 'change' },
        supplierLocalId: { required: true, message: '必填项', trigger: 'change' }
      },
      paramsList: [], // 需要提交的物资
      queryParams: { offset: 0, splitFlag: 0, pagesize: 20, state: 0, orderByClassify: true, supplyMode: 1 },
      objId: this.$route.params.id,
      tipMsg: '',
      status: this.$route.query.status, // 为1则代表暂存页面
      contrcOptions: [], // 默认合同options
      oldVal: '',
      valKey: '',
      disposable: true,
      remoteObj: {},
      btnLoading: false,
      focus: this.$route.query.focus,
      defaultContrct: {}, // 默认合同
      cacheSchema: readSchema, // 缓存的randSchema
      supplierOptions: [] // 供应商options
    }
  },
  async created () {
    if (!this.objId || this.status) {
      storageroomApi.list().then(res => { // 获取库房
        if (res && res.list.length) {
          this.$ever.getFieldFromSchema(this.schema, 'storageRoomId').props.options = res.list
          if (res.list.length === 1 && !this.status) { // 只有一个库房时自动带出来
            this.obj.storageRoomId = res.list[0].id
          }
        }
      })
      await supplierpriceapi.queryLocal({ filterOverdueRecord: true }).then(res => { // 获取供应商
        if (res && res.length) {
          res = res.map(supplier => {
            return {
              id: supplier.id,
              name: supplier.supplierObject ? supplier.supplierObject.name : ''
            }
          })
          this.supplierOptions = res
          const suppOp = this.$ever.getFieldFromSchema(this.schema, 'supplierLocalId')
          if (suppOp.props) suppOp.props.options = res
          if (res.length === 1 && !this.status) {
            this.obj.supplierLocalId = res[0].id
          }
        }
      })
    }
    // 获取查看页面数据
    if (this.objId) {
      this.getDetail(this.objId)
    }
  },
  computed: {
    btnDsiabled () {
      if (this.tableData && this.tableData.length === 1) {
        return this.btnGray
      } else {
        return !this.tableData.length
      }
    },
    btnGray () {
      if (this.tableData && this.tableData.length && this.tableData.length === 1) {
        const data = this.tableData[0]
        let { localMaterialId, num, price } = data
        if (localMaterialId && num && (price === 0 || price)) {
          return false
        } else {
          return true
        }
      }
    }
  },
  watch: {
    tableData: { // 处理物资list
      handler (v) {
        if ((v) || this.objId) {
          this.countTotal(v)
          this.obj.purchaseOrderItemList = []
          const newList = [...v]
          newList.map(item => {
            this.obj.purchaseOrderItemList.push(item)
          })
        } else {
          this.totalSum = 0
        }
      },
      deep: true
    },
    defaultContrct: {
      handler (v) {
        if (v) {
          this.queryParams.contractId = v.id
          this.queryParams.supplyMode = v.purchaseSaleType
        }
      },
      deep: true
    },
    'obj.contractNum': {
      handler (v, oldval) {
        if (!this.objId || this.status) {
          this.oldVal = oldval
          setTimeout(() => {
            this.disposable = true
          }, 500)
          this.$nextTick(() => {
            if (!this.disposable && this.status) return
            this.getOpen(v ? v.id : '', oldval ? oldval.id : '', 'contractNum', '合同')
          })
        }
      },
      deep: true
    },
    'obj.supplierLocalId': { // 供应商联动合同
      handler (v, oldval) {
        if (this.status || !this.objId) {
          this.oldVal = oldval
          this.getOpen(v, oldval, 'supplierLocalId', '供应商')
          if (v) {
            this.getContrctList(true)
          } else {
            this.getContrctList(false)
          }
        }
      },
      deep: true
    },
    'obj.storageRoomId' (val, oldval) {
      this.oldVal = oldval
      this.getOpen(val, oldval, 'storageRoomId', '收货库房')
    },
    '$route' (val) {
      if (val.params.id) {
        this.objId = this.$route.params.id
        this.status = this.$route.query.status
        this.createObject()
        this.getDetail(val.params.id)
      }
    },
    obj: {
      handler (v) {
        if (!this.objId || this.status) {
          this.queryParams.storageRoomId = v.storageRoomId
          this.queryParams.supplierLocalId = v.supplierLocalId
          this.queryParams.contractId = v.contractNum ? v.contractNum.id : this.defaultContrct ? this.defaultContrct.id : ''
          this.queryParams.supplyMode = v.contractNum ? v.contractNum.purchaseSaleType : this.defaultContrct ? this.defaultContrct.purchaseSaleType : ''
          if (v.storageRoomId && v.supplierLocalId && !this.tableData.length) {
            this.tableData = [{ iName: '' }]
          }
        }
      },
      deep: true
    }
  },
  components: {
    remoteSelect,
    cancelDrug,
  },
  methods: {
    backTo () {
      const { drug, focus } = this.$route.query
      if (drug || focus) {
        this.$router.go(-1)
        this.$router.query = { drug: drug, focus: focus }
      } else {
        this.$router.push(`/goods/drugbuynews`)
      }
    },
    getOpen (val, oldval, valKey, msg) {
      if (this.tableData.length && !this.tableData[0].localMaterialId) {
        this.$refs.remoteselect.$refs.drugSelect.options = []
      }
      let flag = false
      this.tableData.forEach(item => { if (item.localMaterialId) flag = true })
      if (((val && oldval && val !== oldval) || (valKey === 'contractNum' && (!val || !oldval))) && flag) {
        this.tipMsg = `采购单中已经添加物资，如需修改${msg}，将自动清空所有物资`
        if (this.btn !== 7) { // 点击取消阻止触发弹窗
          let dom = document.querySelectorAll('.el-form .el-input__inner')
          if (dom && dom.length) dom.forEach(item => { item.blur() })
          this.$confirm(`采购单中已经添加物资，如需修改${msg}，将自动清空所有物资`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.tableData = []
            setTimeout(_ => { this.tableData = [{ iName: '' }] }, 100)
          }).catch(() => {
            this.handlerCancelStorage()
          })
          this.valKey = valKey
          this.btn = 4
        } else { // 还原btn状态
          this.btn = 0
        }
      }
    },
    handlerCancelStorage () { // 取消更换库房
      if (![0, 1, 2, 3, 5].includes(this.btn)) {
        this.obj[this.valKey] = this.oldVal ? this.oldVal : ''
        this.btn = 7
      }
    },
    handlerDelter (index) { // 删除
      if (this.btnGray) return
      this.tableData.splice(index, 1)
      this.$nextTick(() => { // 当物资搜索框已经选择物资，删除其他行物资的时候重新给物资搜索框赋值
        if (this.tableData[this.tableData.length - 1].localMaterialId && this.$refs.remoteselect && this.$refs.remoteselect.$refs.drugSelect) {
          this.showQuery = true
          const [name] = this.remoteObj.name // 解构物资名称，模拟首字搜索
          this.$refs.remoteselect.$refs.drugSelect.select = this.remoteObj
          this.$refs.remoteselect.$refs.drugSelect.query(name)
          setTimeout(() => {
            this.showQuery = false
          }, 500)
        }
      })
      if (!this.tableData.length) this.tableData = [{ iName: '' }]
    },
    handlerCancel () { // 返回
      this.btn = 3
      let cancel
      Object.keys(this.obj).forEach(key => {
        if ((!Array.isArray(this.obj[key]) && this.obj[key]) || (Array.isArray(this.obj[key]) && this.obj[key].length)) {
          cancel = true
        }
      })
      if (cancel) {
        this.$confirm('您填写的内容尚未提交，是否要离开页面？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push('/goods/drugbuynews/')
        }).catch(() => {})
      } else {
        this.$router.push('/goods/drugbuynews/')
      }
    },
    clickCancel (text) { // 确认取消采购单
      api.updateNewPurchaseOrder({ id: this.objId, status: 5, abolitionReason: text }).then(res => {
        if (res) this.getDetail(this.objId)
      })
    },
    handleCancle () { // 取消采购单
      this.$refs.cancelDrug.open()
    },
    getDetail (id) { // 查看页面数据
      api.getById({ id: id }).then(res => {
        if (res) {
          let data = Object.assign({}, res)
          data.statusName = this.setName(FULL_STATE.purchase, data.status, true)
          if (data.contractName) {
            // data.contractName = (data.supplyMode === 1 ? '（购销）' : '（代销）') + data.contractName
          }
          delete data.purchaseOrderItemList
          if (!this.status) { // 查看页面
            this.obj = Object.assign({}, data)
          } else { // 暂存页面
            this.obj.id = data.id
            this.obj.storageRoomId = data.storageRoomId
            const suoolierObj = this.supplierOptions.find(item => { return item.id === data.supplierLocalId })
            this.obj.supplierLocalId = suoolierObj ? suoolierObj.id : ''
            this.obj.description = data.description
            this.disposable = false
            setTimeout(_ => {
              if (this.obj.supplierLocalId) {
                this.obj.contractNum = this.contrcOptions.find(item => { return item.id === data.contractNum })
              }
            }, 1000)
          }
          let list = []
          res.purchaseOrderItemList && res.purchaseOrderItemList.map(item => {
            list.push({
              materialsCode: item.localSettingObject ? item.localSettingObject.materialSkuObject.code : '',
              name: item.localSettingObject ? parserComplex({ propertys: GOLBAL_VAL_MATERIL_NAME.NAME_ONE, data: item.localSettingObject.materialSkuObject.ext }) : '',
              localSettingObject: item.localSettingObject ? item.localSettingObject : {},
              num: item.num,
              localMaterialId: item.localMaterialId,
              price: item.price,
              differenceNum: item.differenceNum,
              inStockNum: item.inStockNum,
              purchaseOrderId: item.purchaseOrderId,
              totalPrice: floatTool.multiply(item.price, item.num),
              add: true
            })
          })
          if (this.status) {
            // list.push({ iName: '' })
          } else {
            let cantrcSchema = JSON.parse(JSON.stringify(readSchema))
            // 集中采购单展示汇总单号
            if (this.focus) {
              cantrcSchema.splice(7)
              cantrcSchema.push({
                name: 'summaryCode',
                label: '汇总单号:',
                comp: 'readonlyitem',
                span: 6
              })
            } else {
              cantrcSchema = JSON.parse(JSON.stringify(readSchema))
            }
            if (data.status === 5) { // 采购单状态为取消
              if (this.schema[2].label === '取消原因') return
              cantrcSchema.splice(2, 0, {
                name: 'abolitionReason',
                label: '取消原因:',
                comp: 'custom',
                span: 6
              }, {
                name: 'abolitionTime',
                label: '取消时间:',
                comp: 'readonlyitem',
                span: 6
              })
            }
            this.schema = cantrcSchema
          }
          this.tableData = list
        }
      })
    },
    countTotal (v) { // 计算总金额
      let count = ''
      let newObj = JSON.parse(JSON.stringify(v))
      count += this.calcTotalPrice(newObj, 'totalPrice')
      this.totalSum = count
    },
    calcTotalPrice (data, price) { // 计算总金额
      let totalPrice = 0
      let ids = []
      for (let i = 0; i < data.length; i++) {
        if ((!ids.includes(data[i].localMaterialId)) && data[i][price]) {
          totalPrice = floatTool.add(data[i][price] || 0, totalPrice)
          ids.push(data[i].localMaterialId)
        }
      }
      return !isNaN(totalPrice) ? this.$filters.formatToFinacial(String(totalPrice), 4) : 0.0000
    },
    submit (status) { // 处理提交的参数
      this.btn = status
      let flag = false
      this.obj.purchaseOrderItemList.forEach(key => {
        if (key.localMaterialId && (key.price === undefined || key.price === '' || key.num === undefined || key.num === '')) {
          flag = true
        }
      })
      if (!this.tableData[0].localMaterialId) {
        return this.$messageTips(this, 'warning', '采购单中还没有添加采购的商品信息，请添加完成后再提交')
      }
      if (flag) return this.$messageTips(this, 'warning', '采购单价或者采购数量为空，请填写后再提交')
      if (!this.obj.contractNum && status === 2) {
        this.$confirm(`没有选择合同，将按照无合同购销方式提交，是否确认提交？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.submitData(2)
        }).catch(() => {
        })
        this.btn = 5
      } else {
        this.submitData(status)
      }
    },
    submitData: debounce(function (status) { // 处理提交的数据
      let params = Object.assign({}, this.obj)
      params.status = status
      params.purchaseOrderItemList = params.purchaseOrderItemList.filter(item => { return item.localMaterialId })
      if (this.obj.id) {
        params.purchaseOrderItemList.forEach(item => {
          item.purchaseOrderId = this.obj.id
        })
      }
      params.supplyMode = params.contractNum ? params.contractNum.purchaseSaleType : this.defaultContrct.purchaseSaleType
      params.contractNum = params.contractNum ? params.contractNum.id : this.defaultContrct.id
      this.btnLoading = true
      api.createOrUpdate(params).then(res => {
        if (Object.keys(res).length) {
          this.$messageTips(this, 'success', `${status === 1 ? '保存' : '新建'}采购单成功`)
          if (status === 1) {
            this.$router.push(`/goods/drugpurcheaseadd/${res.id}?status="true"`)
          } else {
            setTimeout(_ => {
              this.$router.push(`/goods/drugpurcheaseadd/${res.id}`)
            }, 500)
          }
        }
        setTimeout(_ => {
          this.btnLoading = false
        }, 500)
      })
    }),
    getContrctList (flag) { // 获取合同
      if (flag) {
        let contrctParmas = {
          offset: 0,
          pagesize: 9999,
          status: 1,
          supplierLocalId: this.obj.supplierLocalId,
          isDefault: 1
        }
        contrctApi.queryList(contrctParmas).then(res => { // 没有选择合同的时候传默认合同
          if (res && res.length) {
            this.contrcOptions = JSON.parse(JSON.stringify(res)).filter(item => { // 只取合同状态为有效的
              // item.name = item.purchaseSaleType === 1 ? '（购销）' + item.name : '（代销）' + item.name
              return item.status === 1
            })
            this.$ever.getFieldFromSchema(this.schema, 'contractNum').props.options = this.contrcOptions
            this.defaultContrct = JSON.parse(JSON.stringify(res)).filter(item => !item.contractNo)[0]
          }
        })
      } else {
        this.$ever.getFieldFromSchema(this.schema, 'contractNum').props.options = []
      }
    },
    handleTotalAmount (data) { // 采购数量
      if (data.localMaterialId) {
        if (data.num <= 0 || data.num === '') {
          data.num = ''
          return this.$messageTips(this, 'warning', '采购数量不允许为0或负数，请重新录入')
        }
        let dataType = data.classifyId
        if (CHINESE_MEDICINE_TYPE.includes(dataType)) { // 中药类型
          const num = checkAmountIntensiveReading({ price: data.num.toString(), num: 4 })
          if (!num) {
            data.num = ''
            return this.$messageTips(this, 'warning', '中药类型采购数量最多四位小数，请重新录入')
          }
        } else {
          if (!parse.test(data.num)) {
            data.num = ''
            return this.$messageTips(this, 'warning', '采购数量必须为正整数，请重新录入')
          }
        }
        data.totalPrice = floatTool.multiply(data.price, data.num)
      }
    },
    handlePrice (v, index) { // 采购单价
      if (v.localMaterialId) {
        if (v.price < 0 || v.price === '' || v.price === undefined) {
          v.price = undefined
          return this.$messageTips(this, 'warning', '采购单价不允许为负数或者为空，请重新录入')
        }
        v.totalPrice = floatTool.multiply(v.price, v.num)
      }
    },
    handlerAdd (v, index) { // 添加物资
      if (v && !this.btnGray) {
        const rows = Object.assign({}, v)
        if (!rows.localMaterialId) return this.$messageTips(this, 'warning', '请选择物资再点击添加')
        if (rows['price'] < 0 || rows['price'] === '' || rows['num'] <= 0 || rows['num'] === '' || rows['num'] === undefined || rows['price'] === undefined) {
          return this.$messageTips(this, 'warning', '请填写采购单价或者采购数量后再添加')
        }
        const newRows = this.tableData.find((item, index) => { if (index !== this.tableData.length - 1) return item.localMaterialId === rows.localMaterialId })
        if (newRows) {
          return this.$messageTips(this, 'warning', '该物资已添加，请修改物资后再点击添加')
        } else {
          if (rows.localMaterialId) {
            this.tableData.push(rows)
            this.tableData[index].add = true // 代表已经添加的物资
            this.$set(this.tableData, this.tableData.length - 1, { iName: '' })
          }
        }
      }
    },
    handleSelect (v) { // 点击物资
      if (v) {
        if (this.showQuery) return
        const identical = this.tableData.find(item => { return item.localMaterialId === v.localMaterialId })
        if (identical) return this.$messageTips(this, 'warning', '该物资已经存在。')
        this.remoteObj = v
        let metaerObj = {
          materialsCode: v.materialSkuObject ? v.materialSkuObject.code : '', // 物资编码
          name: v.name, // 物资名称
          localMaterialId: v.localMaterialId,
          materialType: v.classifyId, // 物资类型
          localSettingObject: v, // 物资对象
          num: '', // 采购数量
          price: v.unitPrice ? v.unitPrice : undefined, // 采购金额
          totalPrice: '', // 采购总金额
        }
        this.$set(this.tableData, this.tableData.length - 1, metaerObj)
      } else {
        this.$set(this.tableData, this.tableData.length - 1, { iName: '' })
      }
    },
    createObject () {
      this.$route.query.status || !this.$route.params.id ? schema = schemaItem : schema = readSchema
      return {
        schema,
        obj: this.$ever.createObjFromSchema(schema)
      }
    }
  },
}

</script>
<style scoped lang="less">
.from /deep/ .el-form-item .el-form-item__label {
  color: #999;
}
.newFrom /deep/ .el-form-item {
  margin-left: 30px;
}
.priceInput {
  width: 80px;
  /deep/ .el-input__inner {
    padding: 0;
  }
}
.stripTips {
  height: 14px;
  line-height: 14px;
  color: #333333;
  font-size: 14px;
  .strip {
    width: 3px;
    height: 14px;
    background: #1C7BEF;
  }
}
.con {
  color: #919191;
}
.fon {
  color: #222222;
  font-size: 20px;
  font-family: PingFangSC-Medium;
}
.ellipsis{
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
</style>
