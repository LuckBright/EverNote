<template>
  <div>
    <ever-bread-crumb
      name="出库"
      showTitle="true"
    ></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4 class="pos_re">基础信息
          <!-- <el-button
            class="pos_ab"
            style="right: 20px;"
            type="text"
            v-if="!$route.query.look"
            @click="$router.push('/storages/output/outputnewedit/' + objId)"
          >切换到新版</el-button> -->
        </h4>
        <ever-form2
          :class="[objId ? 'readform' : '']"
          :schema="schema"
          v-model="obj"
          ref="form"
          :span="12"
          :rules="rules"
          :nosubmit="true">
          <!-- 审核意见 -->
          <template slot="auditOpinion">
            <tooltip-info :content="obj.auditOpinion"></tooltip-info>
          </template>
          <!-- 任务单号 -->
          <template v-if="objId" slot="code">
            <span>{{codeNum}}</span>
            <span class="status">{{statusName}}</span>
            <span v-if="!codeNum">无</span>
          </template>
        </ever-form2>
        <h4 class="pt10">物资明细</h4>
        <div class="listinfo">
          <!-- 采购退货 -->
          <el-table
            v-if="obj.outStockItemList && obj.type == '15'"
            :data="hanlderItems"
            style="width: 100%"
            border
            ref="table"
            :span-method="arraySpanMethod">
            <el-table-column prop="name" label="物资名称" align="center">
              <template slot-scope="scope">
                <material-show-name
                  class="fl"
                  v-if="scope.row.materialName && typeof scope.row.showName === 'undefined'"
                  :materialName="scope.row.materialName"
                  :icons="scope.row.icons">
                </material-show-name>
              </template>
            </el-table-column>
            <el-table-column prop label="规格" width="120" align="center">
              <template slot-scope="scope">
                {{scope.row.spec || '-'}}
              </template>
            </el-table-column>
            <el-table-column prop="batchNum" align="center" width="210" label="生产批号">
              <template slot-scope="scope">
                <span v-if="scope.row.batchNum">{{scope.row.batchNum || '-'}}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column width="180" label="采购入库单" prop="inStockCode">
              <template slot-scope="scope">
                <span v-if="scope.row.inStockCode">{{scope.row.inStockCode}}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column width="120" label="预计退货数量" prop="bedNum">
              <template slot-scope="scope">
                {{scope.row.expectNum}}{{scope.row.packagUnitName}}
              </template>
            </el-table-column>
            <el-table-column width="120" label="退货单价">
              <template slot-scope="scope">
                <span v-if="scope.row.inStockPrice != null">{{scope.row.inStockPrice | formatToFinacial(4)}}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column width="140" label="预计退货金额">
              <template slot-scope="scope">
                <span v-if="scope.row.expectNum != null && scope.row.inStockPrice != null">{{(scope.row.inStockPrice * scope.row.expectNum) | formatToFinacial(4)}}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column :align="obj.status == 22 ? 'center' : 'right'" label="实际退货数量" width="150">
              <template slot-scope="scope">
                <div
                  v-if="!$route.query.look && !scope.row.isManageAlone">
                  <el-input
                    placeholder="实际退货数量"
                    v-model="scope.row.num"
                    type="number"
                    size="small"
                    style="display: inline-block; width: 100px"
                    @blur="handleCheckNum(scope.row, scope.$index)"
                    clearable>
                  </el-input>
                  <span style="display: inline-block">{{scope.row.packagUnitName}}</span>
                </div>
                <ever-popover
                  v-if="scope.row.localMaterialId && scope.row.isManageAlone"
                  :show="$route.query.look ? true : false"
                  :data="scope.row.outStockItemDetailStockContainerList"
                  :index="scope.$index"
                  i="0">
                </ever-popover>
                <span v-else-if="$route.query.look">
                  <span v-if="obj.status !== 22 && scope.row.num">{{scope.row.num}}&nbsp;{{scope.row.packagUnitName}}</span>
                  <span v-else>-</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column width="120" label="实际退货金额">
              <template slot-scope="scope">
                <span v-if="scope.row.inStockPrice != null && scope.row.num != null && obj.status !== 22">{{(scope.row.inStockPrice * scope.row.num) | formatToFinacial(4)}}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column width="120" label="差异数量">
              <template slot-scope="scope">
                <span v-if="scope.row.expectNum != null && scope.row.num != null && scope.row.expectNum - scope.row.num != 0">{{floatTool.subtract(scope.row.expectNum, scope.row.num)}}{{scope.row.packagUnitName}}</span>
                <span v-else></span>
              </template>
            </el-table-column>
          </el-table>
          <!-- 非采购退货表格 -->
          <ever-table
            v-if="obj.outStockItemList && obj.type !== '15'"
            ref="table"
            border
            :data="hanlderItems"
            :table-default-cell-value="tableDefaultCellValue"
            :not-select-checkbox="true"
            :span-method="arraySpanMethod"
            :columns="tableColumns">
            <template :slot="column.slotName" v-for="column in renderColumns">
              <el-table-column
                :key="column.prop"
                :slot="column.prop"
                :align="column.align"
                :label="column.label"
                :width="column.width"
                :prop="column.prop">
                <template slot-scope="scope">
                  <in-and-out-functional
                    :row="scope.row"
                    v-if="!column.slot"
                    :index="scope.$index"
                    :render="column.render"
                    :td-key="column.prop">
                  </in-and-out-functional>
                  <div v-if="column.slotName === 'num'">
                    <span v-if="!$route.query.look && !scope.row.isManageAlone">
                      <el-input
                        class="quantity_input"
                        placeholder="出库数量"
                        v-model="scope.row.num"
                        type="number"
                        size="small"
                        @input="handleDiversityNum(scope.row, scope.$index)"
                        @blur="handleCheckNum(scope.row, scope.$index)"
                        clearable>
                      </el-input>
                      {{scope.row.packagUnitName}}
                    </span>
                    <ever-popover
                      v-if="scope.row.localMaterialId && scope.row.isManageAlone"
                      :show="$route.query.look ? true : false"
                      :data="scope.row.outStockItemDetailStockContainerList"
                      :index="scope.$index"
                      i="0">
                    </ever-popover>
                    <span v-if="!['22', '23'].includes(`${obj.status}`) && $route.query.look">
                      <span v-if="scope.row.num">
                        {{scope.row.num}}&nbsp;
                        {{scope.row.packagUnitName}}
                      </span>
                      <span v-else>-</span>
                    </span>
                  </div>
                  <div v-if="column.slotName === 'batchNumEdit'">
                    <span
                      class="aligin-items-center"
                      v-if="!$route.query.look && scope.row.localMaterialId && scope.row.isExpiryDate && !scope.row.isManageAlone && !['14', '15', '20'].includes(`${obj.type}`)">
                      <ever-select
                        filterable
                        v-model="scope.row.batchNum"
                        customValue="batchNum"
                        :options="scope.row.batchNumList"
                        clearable="true"
                        @change="selectBatchNumList"
                        @clear="clearBatchNumList"
                        @visibleChange="queryBatchNumList"
                        :index="scope.$index"
                        style="width: 120px; margin-right: 5px"
                        placeholder="生产批号"
                      ></ever-select>
                      <i
                        v-if="(scope.row.addFlag == undefined || scope.row.addFlag) && scope.row.last"
                        @click="handleAddBatch(scope.row, scope.$index)"
                        class="iconfont icon-tianjiabingli blue">
                        </i>
                    </span>
                    <span
                      v-else-if="$route.query.look && scope.row.localMaterialId && scope.row.isExpiryDate && !scope.row.isManageAlone"
                    >{{scope.row.batchNum || '-'}}</span>
                    <span
                      v-else-if="!$route.query.look && SPECIAL_STORAGE_ROOM_TYPE.includes(obj.type)"
                    >{{scope.row.batchNum || '-'}}</span>
                    <span v-else>-</span>
                  </div>
                  <template v-if="column.slotName === 'operation' && !$route.query.look && !SPECIAL_STORAGE_ROOM_TYPE.includes(obj.type)">
                    <i
                      class="iconfont icon-bingli-shanchu red cur"
                      v-if="!scope.row.id"
                      @click="handleDeleteRow(scope.row, scope.$index)">
                    </i>
                  </template>
                </template>
              </el-table-column>
            </template>
          </ever-table>
          <div class="totalprice" v-if="obj.type == 15">
            <span class="ml10">预计退货总金额：<span class="cOrange">{{obj.outTotalPrice | formatToFinacial(4)}}</span></span>
            <span class="ml10">实际退货总金额：<span class="cOrange" v-if="obj.status !== 22">{{obj.totalPrice | formatToFinacial(4)}}</span></span>
          </div>
        </div>
      </div>
      <div class="panel-footer" v-if="storageFlag">
        <span v-if="obj.type !== 16 && !['21', '22', '23'].includes(`${obj.status}`)">
          <el-button
          type="primary"
          size="small"
          @click="submitForm('form', 200)"
          v-if="examine && ['20', '24'].includes(`${obj.status}`)">提交</el-button>
          <el-button
            v-if="!examine && obj.status === 20"
            size="small"
            type="primary"
            @click="submitForm('form', 21)"
            :loading="unRepeatedBtn"
          >确认出库</el-button>
        </span>
        <el-button
          type="primary"
          size="small"
          v-if="outputExamine && obj.status === 200 && examine"
          @click="handlerExamin">审核</el-button>
        <el-button
          v-if="$route.query.look && obj.status === 21 && showBtn"
          class="print_btn_01"
          type="primary"
          size="small"
          @click="printTable">
          <i class="iconfont icon-dayinji-"></i> 打印
        </el-button>
      </div>
      <!-- 审核弹窗 -->
      <examine-dialog :visible.sync="visibleDialog" @handlerConsent="handlerConsent" :loding="unRepeatedBtn"></examine-dialog>
    </div>
  </div>
</template>
<script>
import api from '../store/outputapi'
import getMaterialInfoApi from '@/warehouse/store/getmaterialinfoapi'
import sysvalue from '@/warehouse/store/sysvalueapi'
import { floatTool, debounce, FULL_IN_OUT_TYPE, FULL_ORDER_NAME, PACKAGE_CODE, FULL_STATE, compare, GOLBAL_VAL_MATERIL_NAME, patch, SPEC_CODE, SPECIAL_STORAGE_ROOM_TYPE, WEST_MEDICINE_TYPE } from '@/util/common'
import setName from '@/util/setstatusname'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import tableExpand from '@/warehouse/page/storages/util/tableexpand'
import everPopover from '@/warehouse/page/components/popover'
import { everprint } from '@/util/print'
import accessStorageMixins from '@/warehouse/page/storages/mixins/accessstorage.mixins.js' // 出入库审核系列操作
import { BUSINESS_TYPE_COLLECT, COOD_TYPE_OUT } from '@/warehouse/views/util/constant.js'
import outAndInMixins from '@/warehouse/page/storages/mixins/outandin.mixins.js'
import storageroomapi from '@/warehouse/store/storageroomapi.js'
import { DECIMAL_FOUR, FLOAT_REG, PARSE_REG } from '@/warehouse/util/reg.js'
import storage from '@/util/storage'

let schema = [
  {
    name: 'code',
    label: '出库任务单',
    comp: 'custom',
    span: 6
  },
  {
    name: 'outStockTypeName',
    label: '出库类型',
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
    name: 'applyByName',
    label: '申请人',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'outStorageRoom',
    label: '发货库房',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'recipient',
    label: '收货库房',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'staffName',
    label: '出库人',
    props: {
      nocGray: true
    },
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'outStockTime',
    label: '出库时间',
    props: {
      nocGray: true
    },
    comp: 'readonlyitem',
    span: 6
  }
]
export default {
  mixins: [setName, getstorage, tableExpand, accessStorageMixins, outAndInMixins, storage],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.outStockItemList = []
    return {
      schema,
      obj,
      floatTool,
      api,
      SPEC_CODE,
      GOLBAL_VAL_MATERIL_NAME,
      getMaterialInfoApi,
      FULL_STATE,
      SPECIAL_STORAGE_ROOM_TYPE,
      WEST_MEDICINE_TYPE,
      FULL_IN_OUT_TYPE,
      FULL_ORDER_NAME,
      PACKAGE_CODE,
      COOD_TYPE_OUT,
      pathTo: false,
      dosageFormArr: [],
      objId: this.$route.params.id,
      isBatch: 0, // 定价模式
      queryParams: { materialType: '', offset: 0, pagesize: 20, storageRoomId: '' },
      rules: {},
      currentRows: 0,
      codeNum: '',
      statusName: '',
      createDate: '',
      storageFlag: false,
      visibleDialog: false,
      examine: false,
      outputExamine: this.$hasPermission('Auth_menu_treasury_businessmanagement_outputexamine'), // 是否有审核按钮权限
      schemaList: [], // 缓存的schema
      printCode: 1, // 1 普通样式 2 带批次样式
      warehousingType: '', // 出库类型type
      unRepeatedBtn: false // 控制重复提交
      // totalPirce: 0,
      // stotalPirce: 0
    }
  },
  created () {
    this._info()
    if (this.objId) {
      this.getDetail().then((res) => {
        Object.assign(this.obj, res)
      })
      this.schemaList = JSON.parse(JSON.stringify(this.schema))
    }
    sysvalue.listOnce('THC_WH_DRUG_FORM').then(res => {
      if (res) {
        this.dosageFormArr = res
      }
    })
  },
  computed: {
    showBtn () { // 已配置打印模板的展示打印按钮
      return !!COOD_TYPE_OUT[this.printCode][this.warehousingType]
    },
    // 计算需要合并的列
    columnIndes () {
      if (this.isBatch && this.obj.type !== '15') {
        return [0, 1, 2]
      } else {
        return ['14', '20', '22', '3', '25', '26', '36'].includes(this.obj.type) ? [0, 1, 2] : this.obj.type === '15' ? [0, 1] : !['24', '20', '21', '200'].includes(`${this.obj.status}`) ? [0, 1, 2, 6] : [0, 1, 2, 6, 8]
      }
    },
  },
  methods: {
    // 计算差异数量
    handleDiversityNum (row, index) {
      let nums = 0
      let findObj = null
      let diversityNum = 0
      let type = this.obj && ['14', '20'].includes(this.obj.type) || false
      if (!type && !this.isBatch) {
        this.obj.outStockItemList.forEach(item => {
          // 非西药类型的不校验生产批号
          let classifyId = WEST_MEDICINE_TYPE.includes(item.classifyId)
          if (item.localMaterialId === row.localMaterialId && ((classifyId && item.batchNum) || !classifyId)) {
            if (!findObj) findObj = item
            if (item.num) nums = floatTool.add(nums, Number(item.num))
          }
        })
      }
      if (findObj && findObj.expectNum || type || this.isBatch) {
        diversityNum = row.num || nums > 0 ? floatTool.subtract(type || this.isBatch ? row.expectNum : findObj.expectNum, type || this.isBatch ? row.num : nums) : 0
        if (diversityNum <= 0) diversityNum = ''
        this.$set(type || this.isBatch ? row : findObj, 'diversityNum', diversityNum)
      }
    },
    getColumns (type, status, pricingModel) {
      let column = JSON.parse(JSON.stringify(this.tableListColumn))
      column.map(col => {
        if (type === '15' && col.prop === 'expectNum') {
          col.show = false
        } else if (col.prop === 'expectNum') {
          col.show = true
        }
      })
      if (['21', '200', '22', '23'].includes(`${status}`)) {
        let index = column.findIndex(item => item.prop === 'operation')
        if (~index) column.splice(index, 1)
      }
      this.tableColumns = column.filter(item => {
        if (pricingModel && type !== '15') {
          return item.isBatch || item.outBatchEdit || (item.prop === 'diversityNum' && item.status && item.status.includes(`${status}`))
        } else {
          return item.show ||
          (item.status && item.status.includes(`${status}`)) ||
          (item.label === '货位号' && this.commoditylocation && type !== '15') ||
          (item.label === '单位' && !this.commoditylocation && type !== '15') ||
          (item.type && item.type.includes(type) && !['14', '20'].includes(type))
        }
      })
    },
    handlerExamin () {
      this.visibleDialog = true
    },
    handlerConsent: debounce(function (btn, val) { // 审核 || 驳回
      // btn 1: 审核 0: 驳回
      this.unRepeatedBtn = true
      let params = JSON.parse(JSON.stringify(this.obj))
      delete params.outStorageRoomObject
      delete params.inStorageRoomObject
      delete params.outStockItemList
      delete params.supplierObject
      delete params.user
      params.auditOpinion = val
      params.status = btn ? 21 : 24
      params.pricingModel = this.isBatch
      params.id = this.objId
      api.updateOutStockForAudit(params).then(res => {
        if (res) {
          this.everSuccess(`${btn ? '审核' : '驳回'}成功`)
          this.$router.push('/storages/output/outputs/20')
        }
        setTimeout(() => {
          this.unRepeatedBtn = false
          this.visibleDialog = false
        }, 300)
      })
    }),
    printTable () { // 打印
      let code = COOD_TYPE_OUT[this.printCode][this.warehousingType]
      everprint(code, { id: this.objId, stockPrint: this.printCode }, {
        preview: true,
        cb: _ => {
          console.log('打印完成')
        }
      })
    },
    async queryBatchNumList (v, i) {
      if (v) {
        this.currentRows = i
        this.$set(this.obj.outStockItemList[i], 'batchNumList', [])
        let params = {
          localMaterialId: this.obj.outStockItemList[i].localMaterialId,
          storageRoomId: this.obj.outStorageRoomId
        }
        await this.api.stocklist(params).then(res => {
          this.obj.outStockItemList.forEach(item => {
            if (!res[0]) return
            if (item.localMaterialId !== params.localMaterialId) return
            res.forEach((items, index) => {
              if (items.batchNum + '' === item.batchNum + '' && items.batchNum + '' !== this.obj.outStockItemList[i].batchNum + '') {
                res.splice(index, 1)
              }
            })
          })
          res[0] && this.$set(this.obj.outStockItemList[i], 'batchNumList', res)
        })
      }
    },
    clearBatchNumList (v, i) {
      this.currentRows = i
      this.$set(this.obj.outStockItemList[i], 'storageNum', '')
      this.$set(this.obj.outStockItemList[i], 'produceDate', '')
      this.$set(this.obj.outStockItemList[i], 'validityDate', '')
    },
    selectBatchNumList (v, i) {
      this._checkIsManageAlone()
      if (i === undefined) i = this.currentRows
      if (v === '') return
      let outPutNum = 0
      let produceDate = ''
      let validityDate = ''
      let index = this.obj.outStockItemList[i].batchNumList.findIndex(item => {
        return item.batchNum === v
      })
      outPutNum = index > -1 ? this.obj.outStockItemList[i].batchNumList[index].usableNum : ''
      produceDate = index > -1 ? this.obj.outStockItemList[i].batchNumList[index].produceDate : ''
      validityDate = index > -1 ? this.obj.outStockItemList[i].batchNumList[index].validityDate : ''
      this.$set(this.obj.outStockItemList[i], 'storageNum', outPutNum)
      this.$set(this.obj.outStockItemList[i], 'produceDate', produceDate)
      this.$set(this.obj.outStockItemList[i], 'validityDate', validityDate)
    },
    returnMessage (i, str) {
      this.obj.outStockItemList[i].num = ''
      this.obj = JSON.parse(JSON.stringify(this.obj))
      this.$messageTips(this, 'warning', str)
    },
    handleCheckNum (data, i) {
      const { isExpiryDate } = data || {}
      this._checkIsManageAlone()
      let amountNum = 0 // 同一批次物资出库数量总和
      let expectNum = 0 // 预期数量
      let expecList = [] // 同一批次物资
      this.obj.outStockItemList.forEach(item => {
        if (item.localMaterialId === data.localMaterialId) {
          expecList.push(item)
          amountNum += Number(item.num)
          if (item.expectNum) expectNum = item.expectNum
        }
      })
      const newF = expecList.every(item => { return item.expectNum }) // 是否走判断出库数量和的逻辑
      if (this.obj.outStockItemList[i].storageNum && Number(this.obj.outStockItemList[i].storageNum) < Number(data.num)) {
        this.returnMessage(i, '出库数量不能大于库存数量')
        return
      }
      // bugfix: 22007
      if (!data.batchNum && isExpiryDate) {
        this.returnMessage(i, '请选择批次号再填写出库数量')
        return
      }
      if (newF) {
        if (data.num > data.expectNum) {
          this.returnMessage(i, '出库数量必须小于等于出库预期数量，请重新录入')
          return
        }
      } else {
        if (amountNum > expectNum && expecList.length > 1) {
          this.returnMessage(i, '同一物资，批次出库数量之和必须小于等于出库预期数量，请重新录入')
          return
        }
      }
      if (data.num <= 0) {
        data.num = ''
        this.$messageTips(this, 'warning', '出库数量为0或未输入，请重新录入')
        return
      }
      let dataType = data.classifyId || ''
      if (dataType !== '303' && dataType !== '304') {
        if (!PARSE_REG.test(data.num)) {
          this.returnMessage(i, '出库数量不能小于0并且不能有小数，请重新录入')
          return
        }
      } else {
        if (!FLOAT_REG.test(data.num)) {
          this.returnMessage(i, '出库数量不能小于0，请重新录入')
          return
        }
        if (!DECIMAL_FOUR.test(data.num)) {
          this.returnMessage(i, '“中药饮片”和“中药颗粒”最多允许录入4位小数')
          return
        }
      }
      if (data.expectNum && Number(data.expectNum) < Number(data.num)) {
        this.returnMessage(i, '出库数量不能大于库存数量')
        return
      }
      // 采购退货出库单 outStockItemDetailStockContainerList outStockItemDetailStockSysBatchList num赋值
      if (this.obj.type === '15') {
        if (data.outStockItemDetailStockContainerList && data.outStockItemDetailStockContainerList.length) {
          data.outStockItemDetailStockContainerList[0].num = data.num
        }
        if (data.outStockItemDetailStockSysBatchList && data.outStockItemDetailStockSysBatchList.length) {
          data.outStockItemDetailStockSysBatchList[0].num = data.num
        }
      }
      this.obj = JSON.parse(JSON.stringify(this.obj))
    },
    async getExamine () {
      let type = BUSINESS_TYPE_COLLECT.find(type => { return type.id === this.warehousingType })
      if (type) {
        let settingItemLimits = []
        await storageroomapi.selectSystemSettingByClinicId().then(res => {
          // 根据出入库打印配置展示
          this.printCode = this.isBatch ? res.stockPrint : 1
          if (res && res.settingItemLimits) settingItemLimits = res.settingItemLimits
        })
        settingItemLimits.length && settingItemLimits.forEach(item => {
          if (`${item.orderType}` === type.examine) {
            this.examine = !item.status
          }
        })
      }
    },
    getDetail (id) {
      return new Promise((resolve, reject) => {
        api.getById(id || this.$route.params.id).then(res => {
          if (res.auditerName && !this.schemaList.find(key => { return key.label === '审核人' }) && ['15', '13', '31', '14', '2', '20'].includes(res.type)) {
            this.schemaList.push(...this.examineSchema)
          }
          this.isBatch = res.pricingModel
          this.schema = this.schemaList
          this.warehousingType = res.type
          let result = JSON.parse(JSON.stringify(res))
          result.createDate = result.createTime
          result.outStockTime = result.outDate || ''
          this.codeNum = result.code
          this.statusName = this.setName(FULL_STATE.outstock, result.status, true)
          result.recipient = res.type === '15' && res.supplierName ? res.supplierName : (res.type === '2' || res.type === '16') && res.sectionName ? res.sectionName : res.inStorageRoomObject ? res.inStorageRoomObject.name : ''
          result.outStorageRoom = result.outStorageRoomObject && result.outStorageRoomObject.name
          let findObject = this.schema.find(item => item.name === 'recipient')
          const keyObj = {
            2: {name: '领用科室'},
            15: {name: '接收方'}
          }
          if (keyObj[res.type]) {
            findObject.label = keyObj[res.type].name
          }
          if (result.type === FULL_ORDER_NAME.outtype[2].id) result.recipient = '盘点盘亏'
          result.outStockTypeName = this.setName(FULL_IN_OUT_TYPE.outtype, result.type, true)
          result.staffName = result.updatedByName && res.status === 21 ? result.updatedByName : ''
          result.outStockItemList.sort(compare('localMaterialId'))
          for (let i = 0; i < result.outStockItemList.length; i++) {
            let item = result.outStockItemList[i]
            for (let j = i + 1; j < result.outStockItemList.length; j++) {
              let ites = result.outStockItemList[j]
              // 退库 、退返、销毁、申领快捷出库 不做隐藏处理
              if (item.localMaterialId === ites.localMaterialId && !SPECIAL_STORAGE_ROOM_TYPE.includes(res.type)) {
                ites['showName'] = true
              }
            }
            // if ((result.type === '14') && !this.$route.query.look) result.outStockItemList[i].num = ''
            if (!item.batchNum) {
              item.batchNum = ''
              result.outStockItemList[i].batchNum = item.batchNum ? item.batchNum : item.stockContainerVo && item.stockContainerVo.batchNum
            }
            // 出库数量带上默认预期数量
            if (!item.num && !result.outStockItemList[i].num) {
              result.outStockItemList[i].num = item.expectNum
            }
            if (!item.batchNumList) {
              item.batchNumList = []
              if (item.stockContainerVo) {
                this.$set(result.outStockItemList[i], 'storageNum', item.stockContainerVo.usableNum)
                this.$set(result.outStockItemList[i], 'produceDate', item.stockContainerVo.produceDate)
                this.$set(result.outStockItemList[i], 'validityDate', item.stockContainerVo.validityDate)
              }
            }
            if (!this.isBatch) {
              for (let j = i + 1; j < result.outStockItemList.length; j++) {
                if (result.outStockItemList[i].localMaterialId === result.outStockItemList[j].localMaterialId) {
                  if (![...SPECIAL_STORAGE_ROOM_TYPE, '25', '28', '24', '29', '26', '36', '18', '19', '34'].includes(res.type)) {
                    delete result.outStockItemList[j].unitGroupItemObject
                    if (result.outStockItemList[j].expectNum) {
                      result.outStockItemList[i].expectNum = result.outStockItemList[j].expectNum
                    }
                    // delete result.outStockItemList[j].expectNum
                  }
                }
              }
            }
            setTimeout(() => {
              this.$nextTick(() => {
                this.handleDiversityNum(item)
              }, 300)
            }, 300)
          }
          this.getExamine()
          if (result.outStorageRoomObject && this.storageId === result.outStorageRoomObject.id) {
            this.storageFlag = true
          }
          resolve(result)
          this.getColumns(res.type, res.status, res.pricingModel)
        })
      })
    },
    submitForm: debounce(function (form, status) {
      if (!this._checkIsManageAlone()) { // 唯一码
        return
      }
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          if (!this.obj.outStockItemList.length) {
            this.$messageTips(this, 'warning', '出库单中还未添加商品，请先添加商品再提交')
            return
          }
          let params = JSON.parse(JSON.stringify(Object.assign({}, params, this.obj)))
          params.status = status
          params.pricingModel = this.isBatch
          // params.outStockItemList = []
          params.materialType = this.materialType
          for (let n = 0; n < this.obj.outStockItemList.length; n++) {
            let item = this.obj.outStockItemList[n]
            if (!item.batchNum && item.isExpiryDate) {
              this.$messageTips(this, 'warning', '请选择生产批号后再提交')
              return
            }
            if (!item.num) {
              this.$messageTips(this, 'warning', '请填写出库数量后再提交')
              return
            }
            if (item.num > item.storageNum) {
              this.$messageTips(this, 'warning', '出库数量不能大于库存数量，请修改后再提交')
              return
            }
            if (item.num < 0) {
              this.$messageTips(this, 'warning', '出库数量不允许为负数')
              return
            }
            params.outStockItemList[n] = (Object.assign({
              materialType: this.materialType
            }, item))
            params.outStockItemList[n].drugObject && delete params.outStockItemList[n].drugObject
            params.outStockItemList[n].consumptiveMaterialObject && delete params.outStockItemList[n].consumptiveMaterialObject
            params.outStockItemList[n].equipmentObject && delete params.outStockItemList[n].equipmentObject
            params.outStockItemList[n].unitGroupItemObject && delete params.outStockItemList[n].unitGroupItemObject
            params.outStockItemList[n].batchNumList && delete params.outStockItemList[n].batchNumList
          }
          delete params.inStorageRoomObject
          delete params.outStorageRoomObject
          delete params.staffObject
          // delete params.outStockItemList
          this.unRepeatedBtn = true
          this.api.createOrUpdate(params).then(res => {
            if (res) {
              if (this.$route.query && this.$route.query.look) {
                this.getDetail().then((res) => {
                  this.$nextTick(() => {
                    this.obj = Object.assign(this.obj, res)
                  })
                })
              }
              this.$router.push('/storages/output/outputedit/' + this.objId + '?look=' + this.objId)
            }
            this.unRepeatedBtn = false
          })
        }
      })
    }),
    // 删除
    handleDeleteRow (data, index) {
      if (data.addFlag) {
        this.obj.outStockItemList[index - 1] = Object.assign({}, this.obj.outStockItemList[index - 1], { addFlag: true })
      }
      this.obj.outStockItemList.splice(index, 1)
      let row = this.obj.outStockItemList.find(item => data.localMaterialId === item.localMaterialId)
      // 删除操作的时候如果物资还有明细的话就重新计算差异数量
      if (row) {
        this.$nextTick(() => {
          this.handleDiversityNum(row)
        }, 300)
      }
      this.obj = JSON.parse(JSON.stringify(this.obj))
    },
    async handleAddBatch (data, i) {
      let obj = this.obj.outStockItemList.find(item => !item.num || (WEST_MEDICINE_TYPE.includes(item.classifyId) && !item.batchNum))
      if (obj) return this.everWarning('请先完善当前资料')
      await this.queryBatchNumList(data, i)
      if (data.batchNumList.length === 1) return this.everWarning('当前物资没有可以添加的生产批号')
      let tempData = Object.assign({}, data)
      if (data.id || data.addFlag) {
        this.obj.outStockItemList[i] = Object.assign({}, this.obj.outStockItemList[i], { addFlag: false })
      }
      delete tempData.id
      delete tempData.drugObject
      delete tempData.unitGroupItemObject
      delete tempData.batchNumList
      tempData.addFlag = true
      tempData.storageNum = ''
      tempData.batchNum = ''
      tempData.produceDate = ''
      tempData.validityDate = ''
      tempData.num = ''
      tempData.expectNum = ''
      this.obj.outStockItemList.splice(i + 1, 0, tempData)
    },
    _checkIsManageAlone () {
      for (let i = 0; i < this.obj.outStockItemList.length; i++) {
        let item = this.obj.outStockItemList[i]
        if (item.isManageAlone) {
          this.$messageTips(this, 'warning', '该出库单存在唯一码管理商品，请点击右上角切换到新版页面操作入库')
          return false
        }
      }
      return true
    },
    _info () {
      this.queryParams.materialType = this.materialType
      this.queryParams.storageRoomId = this.storageId
    },

    ...patch
  },
  watch: {
    '$route' (val) {
      this.objId = val.params.id
      if (this.objId) {
        this.getDetail().then((res) => {
          this.$nextTick(() => {
            this.obj = Object.assign(this.obj, res)
          })
        })
        this.pathTo = true
      }
    },
    'obj.outStockItemList': {
      handler (v) {
        if (v.length && this.obj.type === '15') {
          this.obj.outTotalPrice = 0
          this.obj.totalPrice = 0
          v.forEach(item => {
            if (item.num > 0) {
              let toprice = floatTool.multiply(item.inStockPrice, item.num)
              let oldtoprice = floatTool.multiply(item.inStockPrice, item.expectNum)
              this.obj.totalPrice = floatTool.add(toprice, this.obj.totalPrice)
              this.obj.outTotalPrice = floatTool.add(oldtoprice, this.obj.outTotalPrice)
            }
          })
        }
      },
      deep: true
    }
  },
  components: {
    everPopover
  }
}
</script>
<style lang="scss" scoped>
span.blue {
  color: #1c7bef;
  cursor: pointer;
  margin-right: 20px;
}
span.blue:hover {
  text-decoration: underline;
}
.status {
  color: red;
  margin: 0 0 0 10px;
}
#table_expand /deep/ .el-table__expanded-cell .custom_popover span.pos_ab {
  left: 400px;
}
.totalprice {
  text-align: right;
  line-height: 40px;
  font-weight: bold;
  font-size: 16px;
}
.quantity_input /deep/ .el-input .el-input__inner {
  padding-right: 20px;
}
</style>
