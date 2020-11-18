<template>
  <div>
    <ever-bread-crumb name="出库" showTitle="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>基础信息</h4>
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
          <template v-if="objId" slot="code">
            <span>{{codeNum}}</span>
            <span class="status">{{statusName}}</span>
            <span v-if="!codeNum">无</span>
          </template>
          <template v-if="objId" slot="applyDepartment">
            <span v-if="applyDepartmentName && departmentName">{{applyDepartmentName + '-' + departmentName}}</span>
            <span v-else-if="applyDepartmentName && !departmentName">{{applyDepartmentName}}</span>
            <span v-else-if="!applyDepartmentName && departmentName">{{departmentName}}</span>
            <span v-else>无</span>
          </template>
        </ever-form2>
        <h4>物资明细</h4>
        <div class="listinfo">
          <ever-table 
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
                </template>
              </el-table-column>
            </template>
          </ever-table>
        </div>
      </div>
      <div class="panel-footer" v-if="storageFlag">
        <!-- 出库类型为处方出库和缺货状态不显示开始出库按钮 -->
        <el-button
          type="primary"
          size="small"
          @click="playOutStock"
          v-if="obj.type != 16 && obj.status != 23">开始出库</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../store/outputapi'
import getMaterialInfoApi from '@/warehouse/store/getmaterialinfoapi'
import { FULL_IN_OUT_TYPE, FULL_ORDER_NAME, FULL_STATE, PACKAGE_CODE, compare, patch, SPECIAL_STORAGE_ROOM_TYPE } from '@/util/common'
import sysvalue from '@/warehouse/store/sysvalueapi'
import setName from '@/util/setstatusname'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import accessStorageMixins from '@/warehouse/page/storages/mixins/accessstorage.mixins.js' // 出入库审核系列操作
import outAndInMixins from '@/warehouse/page/storages/mixins/outandin.mixins.js'
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
  mixins: [setName, getstorage, accessStorageMixins, outAndInMixins, storage],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.outStockItemList = []
    obj.items = []
    return {
      schema,
      obj,
      api,
      getMaterialInfoApi,
      FULL_STATE,
      FULL_IN_OUT_TYPE,
      FULL_ORDER_NAME,
      PACKAGE_CODE,
      dosageFormArr: [],
      objId: this.$route.params.id,
      queryParams: { materialType: '', offset: 0, pagesize: 20, storageRoomId: '' },
      isBatch: Number(storage.getStorageByClinic('IS_BATCHPRICE') || ''), // 定价模式
      rules: {},
      codeNum: '',
      statusName: '',
      applyDepartmentName: '',
      departmentName: '',
      storageFlag: false,
      schemaList: [], // 缓存的schema
    }
  },
  created () {
    this._info()
    if (this.objId) {
      this.getDetail().then((res) => {
        Object.assign(this.obj, res)
        this.obj.type = Number(this.obj.type)
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
    columnIndes () {
      return Number(this.obj.type) === 15 ? [0, 1] : [0, 1, 2]
    },
  },
  methods: {
    getColumns (type, pricingModel) {
      let column = JSON.parse(JSON.stringify(this.tableListColumn))
      column.map(col => {
        if (type === '15' && col.prop === 'expectNum') {
          col.show = false
        } else if (col.prop === 'expectNum') {
          col.show = true
        }
        let index = column.findIndex(item => item.prop === 'diversityNum')
        if (~index) column.splice(index, 1)
      })
      this.tableColumns = column.filter(item => {
        if (type !== '15' && pricingModel) {
          return item.isBatch
        } else {
          return item.show ||
          (item.label === '货位号' && this.commoditylocation && type !== '15') ||
          (item.label === '单位' && !this.commoditylocation && type !== '15') ||
          (item.type && item.type.includes(type) && ['15', '14', '20'].includes(type))
        }
      })
    },
    playOutStock () {
      this.$router.push('/storages/output/outputedit/' + this.objId)
    },
    getDetail (id) {
      return new Promise((resolve, reject) => {
        api.getById(id || this.objId).then(res => {
          if (res.auditerName && !this.schemaList.find(key => { return key.label === '审核人' }) && ['15', '13', '31', '14', '2', '20'].includes(res.type)) {
            this.schemaList.push(...this.examineSchema)
          }
          this.schema = this.schemaList
          res.createDate = res.createTime
          res.outStockTime = res.outDate || ''
          this.codeNum = res.code
          this.statusName = this.setName(FULL_STATE.outstock, res.status, true)
          this.applyDepartmentName = res.applyLocalDepartmentObject ? res.applyLocalDepartmentObject.name : ''
          this.applyDepartmentName = res.applyStaffObject && res.applyStaffObject.localDepartmentObject ? res.applyStaffObject.localDepartmentObject.name : ''
          this.departmentName = res.sectionName ? res.sectionName : ''
          res.recipient = res.type === '15' && res.supplierName ? res.supplierName : (res.type === '2' || res.type === '16') && res.sectionName ? res.sectionName : res.inStorageRoomObject ? res.inStorageRoomObject.name : ''
          res.outStorageRoom = res.outStorageRoomObject && res.outStorageRoomObject.name
          let findObject = this.schema.find(item => item.name === 'recipient')
          const keyObj = {
            2: {name: '领用科室'},
            15: {name: '接收方'}
          }
          if (keyObj[res.type]) {
            findObject.label = keyObj[res.type].name
          }
          res.applyStaff = res.applyByName ? res.applyByName : ''
          res.outStockTypeName = this.setName(FULL_IN_OUT_TYPE.outtype, res.type, true)
          res.staffName = res.status === 21 && res.staffObject ? res.staffObject.name : ''
          res.items = []
          res.outStockItemList && res.outStockItemList.sort(compare('localMaterialId'))
          let resList = []
          if (this.isBatch) {
          } else {
            res.outStockItemList.forEach(item => {
              let index = resList.findIndex(it => {
                return it.localMaterialId === item.localMaterialId
              })
              if (index === -1 || SPECIAL_STORAGE_ROOM_TYPE.includes(res.type)) resList.push(item)
            })
            res.outStockItemList = resList
          }
          // 判断出库库房是否是当前库房
          if (res.outStorageRoomObject && this.storageId === res.outStorageRoomObject.id) {
            this.storageFlag = true
          }
          // res.address = res.inStorageRoomObject ? res.inStorageRoomObject.name : (res.inLocalDepartmentObject ? res.inLocalDepartmentObject.name : '' + res.staffObject ? res.staffObject.name : '')
          resolve(res)
          this.getColumns(res.type, res.pricingModel)
        })
      })
    },
    _info () {
      this.queryParams.materialType = this.materialType
      this.queryParams.storageRoomId = this.storageId
    },
    ...patch
  },
}
</script>
<style lang="scss" scoped>
.status{color: red; margin: 0 0 0 10px;}
</style>
