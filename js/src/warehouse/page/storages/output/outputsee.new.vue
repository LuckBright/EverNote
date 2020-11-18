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
          <div class="table">
            <el-table
              v-if="obj.type !== 15"
              :data="obj.outStockItemList"
              style="width: 100%"
              :class="[(obj.items && obj.items.length) || $route.query.look ? '' : 'table2']"
              empty-text="请先选择发货库房">
              <el-table-column
                prop="name"
                label="物资名称">
                <template slot-scope="scope">
                  <material-show-name v-if="scope.row.materialName" :materialName="scope.row.materialName" :icons="scope.row.icons"></material-show-name>
                </template>
              </el-table-column>
              <el-table-column
                prop label="规格"
                align="center"
                width="120">
                <template slot-scope="scope">
                  {{scope.row.spec || '-'}}
                </template>
              </el-table-column>
              <el-table-column
                v-if="$hasPermission('Auth_menu_treasury_businessmanagement_commoditylocation')"
                width="120"
                label="货位号">
                <template slot-scope="scope">
                  <span>{{scope.row.freight && scope.row.freight.code ? scope.row.freight.code : '无货位号'}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip
                v-else
                prop=""
                width="80"
                align="center"
                label="单位">
                  <template slot-scope="scope">
                    {{scope.row.unitName}}
                  </template>
              </el-table-column>
              <el-table-column
                prop="batchNum"
                v-if="obj.type == 14"
                width="200"
                label="生产批号">
                <template slot-scope="scope">
                  <span>{{scope.row.batchNum || '-'}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip
                align="center"
                v-if="obj.type == 14"
                width="100"
                label="生产日期">
                <template slot-scope="scope">
                  <span v-if="scope.row.batchNum && scope.row.produceDate">{{scope.row.produceDate | formatDateByExp('YYYY-MM-DD')}}</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip
                align="center"
                v-if="obj.type == 14"
                width="100"
                label="有效期">
                <template slot-scope="scope">
                  <span v-if="scope.row.batchNum && scope.row.validityDate">{{scope.row.validityDate | formatDateByExp('YYYY-MM-DD')}}</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip
                align="right"
                label="预期数量"
                width="150">
                <template slot-scope="scope">
                  <span>{{scope.row.expectNum}}{{scope.row.packagUnitName}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip
                prop="id"
                v-if="!objId"
                width="100">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="danger"
                    @click.native.prevent="handleDeleteRow(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 采购退货查看页 -->
            <el-table
              v-if="obj.type == 15"
              :data="hanlderItems"
              style="width: 100%"
              :span-method="arraySpanMethod"
              border
              :class="[(obj.items && obj.items.length) || $route.query.look ? '' : 'table2']"
              empty-text="请先选择发货库房">
              <el-table-column
                prop="name"
                v-if="obj.type"
                label="物资名称">
                <template slot-scope="scope">
                  <material-show-name v-if="scope.row.materialName" :materialName="scope.row.materialName" :icons="scope.row.icons"></material-show-name>
                </template>
              </el-table-column>
              <el-table-column
                prop label="规格"
                align="center"
                width="120"
                v-if="obj.type">
                <template slot-scope="scope">
                  {{scope.row.spec || '-'}}
                </template>
              </el-table-column>
              <el-table-column
                prop="batchNum"
                width="200"
                label="生产批号">
                <template slot-scope="scope">
                  <span>{{scope.row.batchNum || '-'}}</span>
                </template>
              </el-table-column>
              <el-table-column width="180" label="采购入库单" prop="inStockCode">
                <template slot-scope="scope">
                  {{scope.row.inStockCode}}
                </template>
              </el-table-column>
              <el-table-column width="120" label="预计退货数量" prop="bedNum">
                <template slot-scope="scope">
                  {{scope.row.expectNum}}{{scope.row.packagUnitName}}
                </template>
              </el-table-column>
              <el-table-column width="120" label="退货单价">
                <template slot-scope="scope">
                  <span v-if="scope.row.price != null">{{scope.row.price | formatToFinacial(4)}}</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column width="140" label="预计退货金额">
                <template slot-scope="scope">
                  <span v-if="scope.row.expectNum != null && scope.row.price != null">{{(scope.row.price * scope.row.expectNum) | formatToFinacial(4)}}</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
            </el-table>
            <!-- 查询添加商品 -->
            <div>
              <el-table
                v-if="obj.items.length"
                ref="additem"
                :class="[obj.outStockItemList.length ? 'additem2' : 'additem']"
                :data="obj.items"
                style="width: 100%"
                border>
                <el-table-column
                  prop=""
                  label=""
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
                      >
                    </material-select>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="$hasPermission('Auth_menu_treasury_businessmanagement_commoditylocation')"
                  width="120"
                  label="货位号">
                  <template slot-scope="scope">
                    <span>{{scope.row.freight && scope.row.freight.code ? scope.row.freight.code : '无货位号'}}</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip
                  v-else
                  prop=""
                  width="80"
                  align="center"
                  label="单位">
                    <template slot-scope="scope">
                      {{scope.row.unitName}}
                    </template>
                </el-table-column>
                <el-table-column
                  prop="usableNum"
                  width="150"
                  v-if="!objId"
                  align="right"
                  label="可用库存">
                </el-table-column>
                <el-table-column
                  label="预期数量"
                  align="right"
                  width="150">
                  <template slot-scope="scope">
                    <div class="quantity_input">
                      <el-input @blur="handleCheckNum(scope.row)" v-model="scope.row.num" type="number" placeholder="出库数量"></el-input>
                    </div>
                    {{scope.row.packagUnitName}}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="id"
                  width="100">
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
import remoteSelect from '../../joinstorage/remoteselect'
import getMaterialInfoApi from '@/warehouse/store/getmaterialinfoapi'
import { FULL_IN_OUT_TYPE, FULL_ORDER_NAME, FULL_STATE, PACKAGE_CODE, compare, patch, SPECIAL_STORAGE_ROOM_TYPE } from '@/util/common'
import sysvalue from '@/warehouse/store/sysvalueapi'
import setName from '@/util/setstatusname'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import accessStorageMixins from '@/warehouse/page/storages/mixins/accessstorage.mixins.js' // 出入库审核系列操作
import { REMOTE_METHODS_PLACEHOLDER } from '@/warehouse/views/util/constant'

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
  mixins: [setName, getstorage, accessStorageMixins],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.outStockItemList = []
    obj.items = []
    return {
      schema,
      obj,
      api,
      REMOTE_METHODS_PLACEHOLDER,
      getMaterialInfoApi,
      FULL_STATE,
      FULL_IN_OUT_TYPE,
      FULL_ORDER_NAME,
      PACKAGE_CODE,
      dosageFormArr: [],
      objId: this.$route.params.id,
      queryParams: { materialType: '', offset: 0, pagesize: 20, storageRoomId: '' },
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
    // 计算需要合并单元格的物资，记录物资 下标和length old
    hanlderItems () {
      return this.obj.outStockItemList.map((item, index) => {
        let childIndex = this.obj.outStockItemList.findIndex(child => child.localMaterialId === item.localMaterialId)
        const thisArr = this.obj.outStockItemList.filter(child => child.localMaterialId === item.localMaterialId)
        // 当前物资第一次出现的下标
        item.thisTableIndex = childIndex
        // 当前物资存在几条
        item.thisTableCount = thisArr.length
        // 当前物资的最后一条打上标记  last 需要显示添加批号按钮
        item.last = index === childIndex + thisArr.length - 1
        return item
      })
    }
  },
  methods: {
    // 合并表格
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      let columnIndes = [0, 1]
      if (columnIndes.includes(columnIndex) && this.obj.outStockItemList.length > 1) {
        if (((rowIndex - (row.thisTableIndex + row.thisTableCount)) % row.thisTableCount) === 0) {
          return {
            rowspan: row.thisTableCount,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    playOutStock () {
      this.$router.push('/storages/output/outputedit/' + this.objId)
    },
    handleCheckNum (data, i) {
      const float = /^(\+)?\d+(\.\d+)?/
      const parse = /^(\+)?\d*$/
      if (data.num <= 0) {
        this.$messageTips(this, 'warning', '出库数量为0或未输入，请重新录入')
        return
      }
      let dataType = data.classifyId
      if (dataType !== '303' && dataType !== '304') {
        if (!parse.test(data.num)) {
          this.obj.outStockItemList[i].num = ''
          this.$messageTips(this, 'warning', '出库数量不能小于0并且不能有小数，请重新录入')
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
      } else {
        if (!float.test(data.num)) {
          this.obj.outStockItemList[i].num = ''
          this.$messageTips(this, 'warning', '出库数量不能小于0，请重新录入')
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
      }
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
          res.outStockItemList.sort(compare('localMaterialId'))
          let resList = []
          res.outStockItemList.forEach(item => {
            let index = resList.findIndex(it => {
              return it.localMaterialId === item.localMaterialId
            })
            if (index === -1 || SPECIAL_STORAGE_ROOM_TYPE.includes(res.type)) resList.push(item)
          })
          res.outStockItemList = resList
          // 判断出库库房是否是当前库房
          if (res.outStorageRoomObject && this.storageId === res.outStorageRoomObject.id) {
            this.storageFlag = true
          }
          // res.address = res.inStorageRoomObject ? res.inStorageRoomObject.name : (res.inLocalDepartmentObject ? res.inLocalDepartmentObject.name : '' + res.staffObject ? res.staffObject.name : '')
          resolve(res)
        })
      })
    },
    handleSelect (data) {
      // Object.assign(this.obj.outStockItemList[index].items[0], data)
      // for (let key in this.obj.outStockItemList[index].items[0]) {
      //   let item = this.obj.outStockItemList[index].items[0]
      //   if (data.localMaterialId) {
      //     if (key === 'unitId') {
      //       item[key] = data['unitId']
      //     } else {
      //       item[key] = data[key] || data[key] === 0 ? data[key] : ''
      //     }
      //   } else {
      //     item[key] = ''
      //   }
      // }
    },
    _info () {
      this.queryParams.materialType = this.materialType
      this.queryParams.storageRoomId = this.storageId
    },
    ...patch
  },
  components: {
    remoteSelect
  }
}
</script>
<style lang="scss" scoped>
.status{color: red; margin: 0 0 0 10px;}
</style>
