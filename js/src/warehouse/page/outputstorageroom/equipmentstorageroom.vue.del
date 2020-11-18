<template>
  <div id="equipmentreceive">
    <ever-bread-crumb name="设备出库" :path="obj.status == 20 ? '/goods/equipmentoutputstoragerooms/20' : '/goods/equipmentoutputstoragerooms/21'" showTitle="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>基本信息</h4>
        <ever-form2 :class="[objId ? 'readform' : '']" :schema="schema" v-model="obj" ref="form" :span="12" :rules="rules" :nosubmit="true">
        </ever-form2>
        <!-- <div class="hr"></div> -->
        <h4>待出库商品明细</h4>
        <div class="listinfo">
          <div class="table">
            <el-table
              :data="obj.outStockItemList"
              style="width: 100%"
              :class="[(obj.items && obj.items.length) || $route.query.look ? '' : 'table2']"
              border
              empty-text="请先选择发货库房">
              <el-table-column show-overflow-tooltip
                prop=""
                label=""
                width="50">
                <template slot-scope="scope">
                  <span v-if="scope.row.id">{{scope.$index + 1}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="商品名称">
                <template slot-scope="scope">
                  <span v-if="scope.row.equipmentObject">{{`${scope.row.equipmentObject.name} ${scope.row.equipmentObject.byname ? '（' + scope.row.equipmentObject.byname + '）' : scope.row.equipmentObject.byname}${scope.row.equipmentObject.spec} ${setName(dosageFormArr, scope.row.equipmentObject.dosageForm, true)}`}}</span>
                  <span v-else>{{scope.row.name}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip
                prop="unitGroupItemObject"
                width="100"
                align="center"
                label="单位">
                <template slot-scope="scope">
                  <span v-if="scope.row.unitGroupItemObject">{{scope.row.unitGroupItemObject.name}}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="batchNum"
                v-if="obj.type == 14"
                width="200"
                label="生产批号">
              </el-table-column>
              <el-table-column show-overflow-tooltip
                align="center"
                prop=""
                v-if="obj.type == 14"
                width="100"
                label="生产日期">
                <template slot-scope="scope">
                  <span v-if="scope.row.validiproduceDatetyDate">{{scope.row.produceDate | formatDateByExp('YYYY-MM-DD')}}</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip
                align="center"
                prop=""
                v-if="obj.type == 14"
                width="100"
                label="有效期">
                <template slot-scope="scope">
                  <span v-if="scope.row.validityDate">{{scope.row.validityDate | formatDateByExp('YYYY-MM-DD')}}</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip
                prop=""
                align="right"
                label="预期数量"
                width="150">
                <template slot-scope="scope">
                  <span>{{scope.row.expectNum}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip
                prop="id"
                v-if="!objId"
                width="100"
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
                 <!-- apiName='listlocal' -->
                <el-table-column
                  prop="name"
                  label="商品名称">
                  <template slot-scope="scope">
                    <remote-select ref="remoteselect" :queryParams="queryParams" showName='equipmentObject' :api="getMaterialInfoApi" @selectSave="handleSelect" :value="scope.row.iname" :index="0" :index2="scope.$index"></remote-select>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="unitGroupItemId"
                  width="100"
                  align="center"
                  label="单位">
                  <template slot-scope="scope">
                    {{scope.row.unitGroupItemObject.name}}
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
                  prop=""
                  label="申领数量"
                  align="right"
                  width="150">
                  <template slot-scope="scope">
                    <el-input @blur="handleCheckNum(scope.row.num)" v-model="scope.row.num" type="number" placeholder="领用数量"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="id"
                  width="100"
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
      </div>
      <!-- <div class="panel-footer">
        <el-button type="primary" @click="playOutStock" v-if="obj.type != 16">开始出库</el-button>
      </div> -->
    </div>
  </div>
</template>
<script>
import api from './outputstockapi'
import remoteSelect from '../joinstorage/remoteselect'
import getMaterialInfoApi from '../../store/getmaterialinfoapi'
import { EQUIPMENTTYPE, FULL_IN_OUT_TYPE, FULL_ORDER_NAME, FULL_STATE, compare } from '@/util/common'
import sysvalue from '@/warehouse/store/sysvalueapi'
import setName from '@/util/setstatusname'
let schema = []
let readSchema = [
  {
    name: 'code',
    label: '出库单号:',
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
    name: 'createDate',
    label: '创建时间:',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'outStockTypeName',
    label: '出库类型:',
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
    label: '出库人:',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'statusName',
    label: '出库单状态:',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'outStorageRoomObject.name',
    label: '出库库房:',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'outStockTime',
    label: '出库时间:',
    comp: 'readonlyitem',
    span: 8
  }
  // {
  //   name: 'address',
  //   label: '收货信息:',
  //   comp: 'readonlyitem',
  //   span: 24
  // }
]
let tableCode = {
  localMaterialId: '',
  name: '',
  iname: '',
  unit: '',
  num: '',
  unitGroupItemObject: {},
  usableNum: ''
}
export default {
  mixins: [setName],
  data () {
    schema = this.createObject().schema
    let obj = this.createObject().obj
    obj.outStockItemList = []
    obj.items = []
    return {
      schema,
      obj,
      api,
      getMaterialInfoApi,
      tableCode,
      FULL_STATE,
      FULL_IN_OUT_TYPE,
      FULL_ORDER_NAME,
      dosageFormArr: [],
      objId: this.$route.params.id,
      queryParams: { materialType: EQUIPMENTTYPE, offset: 0, pagesize: 20, storageRoomId: '' },
      rules: {}
    }
  },
  created () {
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
  },
  methods: {
    playOutStock () {
      this.$router.push('/goods/equipmentoutputstorageroomedit/' + this.objId)
    },
    handleCheckNum (num) {
      num <= 0 && this.$messageTips(this, 'warning', '领用数量不能小于0，请重新填写')
    },
    createObject () {
      this.$route.params.id ? schema = readSchema : schema = []
      return {
        schema,
        obj: this.$ever.createObjFromSchema(schema)
      }
    },
    getDetail (id) {
      return new Promise((resolve, reject) => {
        api.getById(id || this.objId).then(res => {
          if (res.type === 16) res.outStockItemList = res.outStockItemDetailList || []
          res.outStockTime = res.outDate || ''
          res.statusName = this.setName(FULL_STATE.outstock, res.status, true)
          res.typeName = this.setName(FULL_ORDER_NAME.outtype, res.type, true)
          res.outStockTypeName = this.setName(FULL_IN_OUT_TYPE.outtype, res.type, true)
          res.staffName = res.status === 21 && res.staffObject ? res.staffObject.name : ''
          res.items = []
          res.outStockItemList.sort(compare('localMaterialId'))
          for (let i = 0; i < res.outStockItemList.length; i++) {
            for (var j = i + 1; j < res.outStockItemList.length; j++) {
              if (res.outStockItemList[i].localMaterialId === res.outStockItemList[j].localMaterialId) {
                delete res.outStockItemList[j].equipmentObject
                delete res.outStockItemList[j].id
              }
            }
          }
          res.address = res.inStorageRoomObject ? res.inStorageRoomObject.name : (res.inLocalDepartmentObject ? res.inLocalDepartmentObject.name : '' + res.staffObject ? res.staffObject.name : '')
          resolve(res)
        })
      })
    },
    handleSelect (data, index, index2) {
      for (let key in this.obj.outStockItemList[index].items[0]) {
        let item = this.obj.outStockItemList[index].items[0]
        if (data.localMaterialId) {
          if (key === 'unit') {
            item[key] = data['unitId']
          } else {
            item[key] = data[key] || data[key] === 0 ? data[key] : ''
          }
        } else {
          item[key] = ''
        }
      }
    }
  },
  components: {
    remoteSelect
  }
}
</script>
