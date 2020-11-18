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
            @click="$router.push('/storages/entry/entrynewother/' + objId)"
          >切换到新版</el-button> -->
        </h4>
        <ever-form2
          :schema="schema"
          v-model="obj"
          ref="form"
          :span="12"
          :rules="rules"
          :nosubmit="true"
          :class="[objId ? 'readform' : '']">
          <!-- 审核意见 -->
          <template slot="auditOpinion">
            <tooltip-info :content="obj.auditOpinion"></tooltip-info>
          </template>
          <!-- 入库任务单号 -->
          <template slot="code">
            <span>{{obj.code}}</span>
            <span class="status">{{obj.statusName}}</span>
            <span v-if="!obj.code">无</span>
          </template>
        </ever-form2>
        <h4>物资明细</h4>
        <div class="listinfo" v-for="(list, i) in obj.inStockItemList" :key="i">
          <div class="table">
          </div>
          <ever-table
            ref="table"
            border
            :data="hanlderItems"
            :not-select-checkbox="true"
            :span-method="arraySpanMethod"
            :table-default-cell-value="tableDefaultCellValue"
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
                  <div v-if="column.slotName === 'inNum'">
                    <div class="quantity_input" v-if="!$route.query.look && !['33', '40', '41'].includes(obj.type)">
                      <el-input
                        placeholder="入库数量"
                        v-model="scope.row.num"
                        type="number"
                        @input="handleDiversityNum(scope.row, scope.$index)"
                        @blur="handleCalcInboundNum(scope.row, scope.$index, i)"
                        clearable>
                      </el-input>
                    </div>
                    <span v-if="$route.query.look || ['33', '40', '41'].includes(obj.type)">{{scope.row.num}}</span>
                    {{scope.row.packagUnitName}}
                  </div>
                </template>
              </el-table-column>
            </template>
          </ever-table>
        </div>
      </div>
      <div class="panel-footer" v-if="objId && storageFlag">
        <span v-if="!['11', '100'].includes(`${obj.status}`) && !$route.query.look">
          <el-button
            v-if="examine && ['13', '10'].includes(`${obj.status}`)"
            type="primary"
            @click="submitForm('form', 100)"
            :loading="unRepeatedBtn">
            提交
          </el-button>
          <el-button
            v-if="!examine && obj.status === 10"
            type="primary"
            @click="submitForm('form', 11)"
            :loading="unRepeatedBtn">
            入库完成
          </el-button>
        </span>
        <el-button
          type="primary"
          v-if="entryexamine && obj.status === 100 && examine"
          @click="handlerExamine">审核</el-button>
        <el-button
          v-if="(obj.type == 10 || obj.type == 19) && $route.query.look && !this.obj.outSign && obj.status != 12 && !isInvented"
          type="primary"
          @click="handleOutStorageRoom"
        >快捷出库</el-button>
      </div>
    </div>
    <speed-out-storage ref="outStorageRoom" :data="obj" @handleVisible="handleVisible"></speed-out-storage>
    <!-- 审核弹窗 -->
    <examine-dialog :visible.sync="visibleDialog" @handlerConsent="handlerConsent" :loding="unRepeatedBtn"></examine-dialog>
  </div>
</template>
<script>
import api from '../store/enterapi'
import { floatTool, debounce, FULL_STATE, FULL_ORDER_NAME, FULL_IN_OUT_TYPE, PACKAGE_CODE, DRUGTYPE, EQUIPMENTTYPE, MATERIALTYPE, SPEC_CODE, patch } from '@/util/common'
import setName from '@/util/setstatusname'
import sysvalue from '@/warehouse/store/sysvalueapi'
import tipsDialog from '@/warehouse/page/components/tipsdialog'
import speedOutStorage from '../../enterstorageroom/speedoutstorageroom'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import { BUSINESS_TYPE_COLLECT } from '@/warehouse/views/util/constant'
import accessStorageMixins from '@/warehouse/page/storages/mixins/accessstorage.mixins.js' // 出入库审核系列操作
import outAndInMixins from '@/warehouse/page/storages/mixins/outandin.mixins.js'
import storageroomapi from '@/warehouse/store/storageroomapi.js'
import { DECIMAL_FOUR, FLOAT_REG, PARSE_REG } from '@/warehouse/util/reg'
import storage from '@/util/storage'

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
    props: {
      nocGray: true
    },
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'inStockTime',
    label: '入库时间',
    props: {
      nocGray: true
    },
    comp: 'readonlyitem',
    span: 6
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
  unitId: '',
  unitGroupItemObject: {},
  validityDate: ''
}
export default {
  mixins: [setName, getstorage, accessStorageMixins, outAndInMixins, storage],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.inStockItemList = [{ invoiceStatus: 0, invoiceNo: '', item: [], items: [] }]
    return {
      schema,
      obj,
      api,
      SPEC_CODE,
      tableCode,
      FULL_IN_OUT_TYPE,
      PACKAGE_CODE,
      FULL_STATE,
      FULL_ORDER_NAME,
      DRAFTP: false,
      pathTo: false,
      sysBatchId: '',
      currentRows: 0,
      objId: this.$route.params.id,
      dosageFormArr: [],
      temSupplierLocalId: '',
      isBatch: Number(storage.getStorageByClinic('IS_BATCHPRICE') || ''), // 定价模式
      queryParams: { materialType: '', offset: 0, pagesize: 20, storageRoomId: '' },
      rules: {},
      warehousingType: '', // 出库类型type
      submitFlag: true,
      examine: false,
      storageFlag: false,
      schemaList: [], // 缓存的一份schema
      columnIndes: [0, 1, 2],
      entryexamine: this.$hasPermission('Auth_menu_treasury_businessmanagement_entryexamine'), // 是否有审核按钮权限
      unRepeatedBtn: false // 控制重复提交
    }
  },
  created () {
    this._info()
    if (this.objId) {
      this.handleGetDetail()
      this.schemaList = JSON.parse(JSON.stringify(this.schema))
    }
    sysvalue.listOnce('THC_WH_DRUG_FORM').then(res => {
      if (res) {
        this.dosageFormArr = res
      }
    })
  },
  methods: {
    handleDiversityNum (row, index) {
      let inDiversityNum = ''
      inDiversityNum = row.num > 0 ? floatTool.subtract(row.expectNum, row.num) : ''
      if (inDiversityNum <= 0) inDiversityNum = ''
      this.$set(row, 'inDiversityNum', inDiversityNum)
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
      this.tableColumns = column.filter(item => {
        if (pricingModel && type !== '15') {
          return item.isBatch || item.intBatchEdit || (item.prop === 'inDiversityNum' && item.type && item.type.includes(type))
        } else {
          return item.show ||
          (item.status && item.status.includes(`${status}`)) ||
          (item.label === '货位号' && this.commoditylocation) ||
          (item.label === '单位' && !this.commoditylocation) ||
          (item.type && item.type.includes(type))
        }
      })
    },
    async getExamine () {
      let type = BUSINESS_TYPE_COLLECT.find(type => { return type.id === this.warehousingType })
      if (type) {
        let settingItemLimits = []
        await storageroomapi.selectSystemSettingByClinicId().then(res => {
          if (res && res.settingItemLimits) settingItemLimits = res.settingItemLimits
        })
        settingItemLimits.length && settingItemLimits.forEach(item => {
          if (`${item.orderType}` === type.examine) {
            this.examine = !item.status
          }
        })
      }
    },
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
    handleVisible () {
      this.handleGetDetail()
    },
    handleOutStorageRoom () {
      this.$refs.outStorageRoom.open('business/applybusiness')
    },
    getDetail (id) {
      return new Promise((resolve, reject) => {
        api.getById(id || this.objId).then(res => {
          // const result = JSON.parse(JSON.stringify(res))
          if (res.auditerName && !this.schemaList.find(key => { return key.label === '审核人' }) && ['10', '11', '32', '12', '33'].includes(res.type)) {
            this.schemaList.push(...this.examineSchema)
          }
          if (res.type === '32') {
            this.schemaList.splice(4, 0, ...this.staffSchema)
          }
          this.schema = this.schemaList
          this.warehousingType = res.type
          res.createDate = res.createTime
          res.inStockTime = res.inDate || ''
          res.statusName = this.setName(FULL_STATE.instock, res.status, true)
          res.inStockTypeName = this.setName(FULL_IN_OUT_TYPE.intype, res.type, true)
          res.staffName = res.status === 11 && res.staffObject ? res.staffObject.name : ''
          if (res.inStockItemList.length) {
            for (let i = 0; i < res.inStockItemList.length; i++) {
              let itemList = res.inStockItemList[i]
              for (let k = 0; k < itemList.item.length; k++) {
                if (!itemList.item[k].validityDate) itemList.item[k].validityDate = ''
                if (!itemList.item[k].produceDate) itemList.item[k].produceDate = ''
                if (itemList.item[k].expectNum && itemList.item[k].localMaterialId && !itemList.item[k].isManageAlone) {
                  if (!itemList.item[k].num) {
                    itemList.item[k].num = itemList.item[k].expectNum
                  }
                }
                setTimeout(() => {
                  this.$nextTick(() => {
                    this.handleDiversityNum(itemList.item[k])
                  }, 300)
                }, 300)
              }
              for (let n = 0; n < res.inStockItemList[i].item.length; n++) {
                for (var j = n + 1; j < res.inStockItemList[i].item.length; j++) {
                  if (res.inStockItemList[i].item[n].localMaterialId === res.inStockItemList[i].item[j].localMaterialId) {
                    delete res.inStockItemList[i].item[j].unitGroupItemObject
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
          this.getColumns(res.type, res.status, res.pricingModel)
        })
      })
    },
    submitForm: debounce(function (form, status) {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          if (!this.submitFlag) return
          if (!this.obj.inStockItemList[0].item.length) {
            this.$messageTips(this, 'warning', '入库单中还未添加物资，请先添加物资再提交')
            return
          }
          let params = JSON.parse(JSON.stringify(this.obj))
          delete params.inStockItemList
          params.inStockItemList = []
          params.status = status
          params.materialType = this.materialType
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
              if (item.num < 0 || item.num === '' || item.num === undefined) {
                this.$messageTips(this, 'warning', '存在物资入库明细入库数量小于0，请完成后再提交')
                return
              }
              if (item.localMaterialId && item.isExpiryDate && (!item.batchNum || !item.produceDate || !item.validityDate)) {
                this.$messageTips(this, 'warning', '存在物资入库明细生产批号、生产日期或有效期未添加，请添加后再提交')
                return
              }
              if (this.materialType === DRUGTYPE) {
                delete params.drugObject
              } else if (this.materialType === MATERIALTYPE) {
                delete params.consumptiveMaterialObject
              } else {
                delete params.equipmentObject
              }
              delete this.obj.inStockItemList[i].items
              delete params.unitGroupItemObject
              params.inStockItemList.push(Object.assign({
                materialType: this.materialType,
                storageRoomId: this.obj.storageRoomId,
                invoiceNo: this.obj.inStockItemList[i].invoiceNo
              }, this.obj.inStockItemList[i].item[n]))
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
      if (data.num <= 0) {
        this.$messageTips(this, 'warning', '入库数量为0或未输入，请重新录入')
        return
      }
      let dataType = data.classifyId || ''
      if (dataType === '303' || dataType === '304') {
        if (FLOAT_REG.test(data.num)) {
          // this.$messageTips(this, 'warning', '入库数量不能小于0，请重新录入')
          this.obj.inStockItemList[index].items[0].num = ''
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
      } else {
        if (!PARSE_REG.test(data.num)) {
          this.$messageTips(this, 'warning', '入库数量不能小于0并且不能有小数，请重新录入')
          this.obj.inStockItemList[index].items[0].num = ''
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
      }
      this.obj.inStockItemList[index].items[0].totalPrice = floatTool.multiply(this.obj.inStockItemList[index].items[0].price, data.num)
    },
    handleSelect (data, index, index2) {
      for (let key in this.obj.inStockItemList[index].items[0]) {
        let item = this.obj.inStockItemList[index].items[0]
        if (data.localMaterialId) {
          if (key === 'enableDate' || key === 'num') {
            item[key] = ''
          } else if (key === 'unitId') {
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
        this.$messageTips(this, 'warning', '该物资生产批号、生产日期或有效期信息未完成，请完成后再添加')
        return
      }
      for (let n = 0; n < this.obj.inStockItemList.length; n++) {
        for (let m = 0; m < this.obj.inStockItemList[n].item.length; m++) {
          if (this.obj.inStockItemList[n].item[m].localMaterialId === data.localMaterialId && this.obj.inStockItemList[n].item[m].batchNum === data.batchNum) {
            this.$messageTips(this, 'warning', '该生产批号的物资已经添加，如想修改，请删除后再添加')
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
        })
      }
    },
    handleCalcInboundNum (data, i, index) {
      if (!this._checkIsManageAlone()) return
      this.submitFlag = false
      if (data.num <= 0) {
        this.$messageTips(this, 'warning', '入库数量为0或未输入，请重新录入')
        data.num = ''
        return
      }
      let dataType = data.classifyId || ''
      if (dataType === '303' || dataType === '304') {
        if (!FLOAT_REG.test(data.num)) {
          this.$messageTips(this, 'warning', '入库数量不能小于0，请重新录入')
          data.num = ''
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
        if (!DECIMAL_FOUR.test(data.num)) {
          this.$messageTips(this, 'warning', '“中药饮片”和“中药颗粒”最多允许录入4位小数')
          data.num = ''
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
      } else {
        if (!PARSE_REG.test(data.num)) {
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
          if (item.expectNum < item.num) {
            this.$messageTips(this, 'warning', '同一个物资入库数量不能大于预期数量')
            data.item[i].num = ''
            this.obj = JSON.parse(JSON.stringify(this.obj))
            return
          }
        })
      })
      this.submitFlag = true
      this.obj = JSON.parse(JSON.stringify(this.obj))
    },
    _checkIsManageAlone () {
      for (let i = 0; i < this.obj.inStockItemList.length; i++) {
        for (let n = 0; n < this.obj.inStockItemList[i].item.length; n++) {
          let item = this.obj.inStockItemList[i].item[n]
          if (item.isManageAlone) {
            this.$messageTips(this, 'warning', '该入库单存在唯一码管理物资，请点击右上角切换到新版页面操作入库')
            return false
          }
        }
      }
      return true
    },
    _info () {
      this.queryParams.materialType = this.materialType
      this.queryParams.storageRoomId = this.storageId
      if (this.materialType === DRUGTYPE) {
        this.tableCode.drugObject = {}
      } else if (this.materialType === EQUIPMENTTYPE) {
        this.tableCode.materialCode = ''
      }
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
        this.handleGetDetail()
        this.pathTo = true
      }
    }
  },
  components: {
    speedOutStorage,
    tipsDialog,
  }
}
</script>

<style lang="less" scoped>
.status {
  color: red;
  margin: 0 0 0 10px;
}
.quantity_input /deep/ .el-input .el-input__inner {
  padding-right: 20px;
}
</style>

