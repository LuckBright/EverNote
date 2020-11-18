<template>
  <div id="equipmentreceive">
    <ever-bread-crumb name="设备出库" :path="obj.status == 20 ? '/goods/equipmentoutputstoragerooms/20' : '/goods/equipmentoutputstoragerooms/21'" showTitle="true" :pathTo="pathTo"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>基本信息</h4>
        <ever-form2 :class="[objId ? 'readform' : '']" :schema="schema" v-model="obj" ref="form" :span="12" :rules="rules" :nosubmit="true">
        </ever-form2>
        <!-- <div class="hr"></div> -->
        <h4>商品出库明细</h4>
        <div class="listinfo">
          <div class="table">
            <el-table
              v-if="obj.outStockItemList"
              :data="obj.outStockItemList"
              style="width: 100%"
              border>
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
                  <span v-if="scope.row.equipmentObject">{{`${scope.row.equipmentObject.name || ''} ${scope.row.equipmentObject.byname ? '（' + scope.row.equipmentObject.byname + '）' : scope.row.equipmentObject.byname || ''}${scope.row.equipmentObject.spec || ''} ${setName(dosageFormArr, scope.row.equipmentObject.dosageForm, true)}`}}</span>
                  <span v-else>{{scope.row.name}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip
                prop="unitGroupItemObject"
                width="80"
                align="center"
                label="单位">
                <template slot-scope="scope">
                  <span v-if="scope.row.unitGroupItemObject">{{scope.row.unitGroupItemObject.name}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip
                prop="expectNum"
                align="right"
                label="预期数量"
                width="100">
              </el-table-column>
              <el-table-column
                align="center"
                prop="batchNum"
                width="200"
                label="生产批号">
                <template slot-scope="scope">
                  <span v-if="$route.query.look || obj.type != 13 || obj.type != 2">{{scope.row.batchNum}}</span>
                  <span v-if="!$route.query.look">
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
                      style="width: 120px; float: left; margin-right: 5px"
                      placeholder="生产批号">
                    </ever-select>
                    <el-button v-if="scope.row.addFlag == undefined || scope.row.addFlag" type="text" @click="handleAddBatch(scope.row, scope.$index)">新增</el-button>
                  </span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip
                align="center"
                prop=""
                width="100"
                label="生产日期">
                <template slot-scope="scope">
                  <span v-if="scope.row.produceDate">{{$moment(scope.row.produceDate).format('YYYY-MM-DD')}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip
                align="center"
                prop=""
                width="100"
                label="有效期">
                <template slot-scope="scope">
                  <span v-if="scope.row.validityDate">{{$moment(scope.row.validityDate).format('YYYY-MM-DD')}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip
                prop="storageNum"
                width="100"
                align="right"
                v-if="obj.status < 21 && (obj.type > 15 || obj.type < 14)"
                label="库存">
                <template slot-scope="scope">
                  {{scope.row.storageNum || '-'}}
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip
                prop="num"
                align="right"
                label="出库数量"
                width="100">
                <template slot-scope="scope">
                  <span v-if="$route.query.look">{{scope.row.num}}</span>
                  <span v-if="!$route.query.look"><el-input @blur="handleCheckNum(scope.row.num, scope.row.equipmentObject.equipmentType, scope.row.expectNum, scope.$index)" v-model="scope.row.num" type="number" placeholder="出库数量"></el-input></span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip
                width="80"
                align="center"
                v-if="!$route.query.look && obj.type != 14"
                label="操作">
                <template slot-scope="scope">
                  <el-button
                    v-if="!scope.row.id"
                    size="small"
                    type="danger"
                    @click.native.prevent="handleDeleteRow(scope.row, scope.$index)">删除</el-button>
                </template>
              </el-table-column>
              <el-table-column
                width="80"
                v-else
                align="center"
                label="">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="panel-footer">
        <!-- <el-button v-if="obj.status < 21 && obj.type !== 16" type="primary" @click="submitForm('form', 21)">确认出库</el-button> -->
        <el-button v-if="objId && obj.status >= 21 && (obj.type == 2 || obj.type == 13)" class="print_btn_01" type="primary" @click="printTable"><i class="iconfont icon-dayinji-"></i> 打印</el-button>
      </div>
      <div style="width: 700px;height:0;overflow: hidden">
        <print-header id="print_header" :recordData="recordData.head" :printHeader="pHeader" title="出库单" :tableHead="tableHead"></print-header>
        <print-body id="record_print" v-model="printData" :tableHead="tableHead"></print-body>
        <print-footer id="print_footer" v-model="printFooterData" :footerArr="printFooter"></print-footer>
      </div>
    </div>
  </div>
</template>
<script>
import api from './outputstockapi'
import remoteSelect from '../joinstorage/remoteselect'
import getMaterialInfoApi from '../../store/getmaterialinfoapi'
import { EQUIPMENTTYPE, CHINESE_MEDICINE_TYPE, debounce, FULL_IN_OUT_TYPE, FULL_ORDER_NAME, FULL_STATE, doPrint, compare } from '@/util/common'
import sysvalue from '@/warehouse/store/sysvalueapi'
import setName from '@/util/setstatusname'
import printHeader from '../print/printheader'
import printFooter from '../print/printfooter'
import printBody from '../print/printbody'
import print from '../../schema/print'
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
export default {
  mixins: [setName, print],
  data () {
    schema = this.createObject().schema
    let obj = this.createObject().obj
    obj.outStockItemList = []
    return {
      schema,
      obj,
      api,
      getMaterialInfoApi,
      FULL_STATE,
      FULL_IN_OUT_TYPE,
      FULL_ORDER_NAME,
      pathTo: false,
      dosageFormArr: [],
      objId: this.$route.params.id,
      queryParams: { materialType: EQUIPMENTTYPE, offset: 0, pagesize: 20, storageRoomId: '' },
      rules: {},
      currentRows: 0
    }
  },
  created () {
    if (this.objId) {
      this.getDetail().then((res) => {
        Object.assign(this.obj, res)
        this.queryParams.storageRoomId = this.obj.storageRoomId
      })
    }
    sysvalue.listOnce('THC_WH_DRUG_FORM').then(res => {
      if (res) {
        this.dosageFormArr = res
      }
    })
  },
  methods: {
    printTable () {
      let pageObj = {
        pagination: true,
        fixedHeader: true,
        fixedFooter: true,
        size: 'P2',
        margin: [1]
      }
      doPrint(this, 'record_print', pageObj, 'print_header', 'print_footer')
    },
    queryBatchNumList (v, i) {
      if (v) {
        this.currentRows = i
        this.$set(this.obj.outStockItemList[i], 'batchNumList', [])
        let params = {
          localMaterialId: this.obj.outStockItemList[i].localMaterialId,
          materialType: this.obj.outStockItemList[i].materialType,
          storageRoomId: this.obj.outStorageRoomId
        }
        this.api.stocklist(params).then(res => {
          this.obj.outStockItemList.forEach(item => {
            if (!res[0]) return
            res.forEach((items, index) => {
              if (item.localMaterialId + '' === this.obj.outStockItemList[i].localMaterialId + '' && items.batchNum + '' === item.batchNum + '') {
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
      if (i === undefined) i = this.currentRows
      if (v === '') return
      let num = 0
      let produceDate = ''
      let validityDate = ''
      let index = this.obj.outStockItemList[i].batchNumList.findIndex(item => {
        return item.batchNum === v
      })
      num = index > -1 ? this.obj.outStockItemList[i].batchNumList[index].num : ''
      produceDate = index > -1 ? this.obj.outStockItemList[i].batchNumList[index].produceDate : ''
      validityDate = index > -1 ? this.obj.outStockItemList[i].batchNumList[index].validityDate : ''
      this.$set(this.obj.outStockItemList[i], 'storageNum', num)
      this.$set(this.obj.outStockItemList[i], 'produceDate', produceDate)
      this.$set(this.obj.outStockItemList[i], 'validityDate', validityDate)
    },
    handleCheckNum (num, equipmentType, expectNum, i) {
      const float = /^(\+)?\d+(\.\d+)?/
      const parse = /^(\+)?\d*$/
      if (!CHINESE_MEDICINE_TYPE.includes(equipmentType)) {
        if (!parse.test(num)) {
          this.obj.outStockItemList[0].num = ''
          this.$messageTips(this, 'warning', '入库数量不能小于0并且不能有小数，请重新录入')
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
      } else {
        if (!float.test(num)) {
          this.obj.outStockItemList[0].num = ''
          this.$messageTips(this, 'warning', '入库数量不能小于0，请重新录入')
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
      }
      if (Number(expectNum) < Number(num)) {
        this.obj.outStockItemList[i].num = ''
        this.$messageTips(this, 'warning', '出库数量不能大于预期数量')
        this.obj = JSON.parse(JSON.stringify(this.obj))
        return
      }
      if (this.obj.outStockItemList[i].storageNum && Number(this.obj.outStockItemList[i].storageNum) < Number(num)) {
        this.obj.outStockItemList[i].num = ''
        this.$messageTips(this, 'warning', '出库数量不能大于库存数量')
        this.obj = JSON.parse(JSON.stringify(this.obj))
        return
      }
      if ((this.obj.type === 2 || this.obj.type === 13)) {
        this.obj.outStockItemList.forEach(item => {
          let expectNum = 0
          this.obj.outStockItemList.forEach(items => {
            if (item.localMaterialId === items.localMaterialId) {
              if (items.num) expectNum += items.num
              if (item.expectNum && item.expectNum < expectNum) {
                this.$messageTips(this, 'warning', '同一个商品出库数量不能大于预期数量')
                this.obj.outStockItemList[i].num = ''
                return
              }
            }
          })
        })
      }
      this.obj = JSON.parse(JSON.stringify(this.obj))
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
          let result = JSON.parse(JSON.stringify(res))
          result.createDate = this.$moment(result.createTime).format('YYYY-MM-DD HH:mm:ss')
          result.outStockTime = result.outDate ? this.$moment(result.outDate).format('YYYY-MM-DD HH:mm:ss') : ''
          result.statusName = this.setName(FULL_STATE.outstock, result.status, true)
          result.typeName = this.setName(FULL_ORDER_NAME.outtype, result.type, true)
          result.outStockTypeName = this.setName(FULL_IN_OUT_TYPE.outtype, result.type, true)
          result.staffName = result.status === 21 && result.staffObject ? result.staffObject.name : ''
          this.printData = []
          this.pHeader[0].data = result.inLocalDepartmentObject ? result.inLocalDepartmentObject.name : ''
          this.pHeader[1].data = result.staffObject && result.staffObject ? result.staffObject.name : ''
          this.pHeader[2].data = result.createDate
          this.recordData.head.patientId = result.code
          result.outStockItemList.sort(compare('localMaterialId'))
          for (let i = 0; i < res.outStockItemList.length; i++) {
            let item = res.outStockItemList[i]
            if ((result.type === 14 || result.type === 15) && !this.$route.query.look) result.outStockItemList[i].num = ''
            if (!item.batchNum) {
              item.batchNum = ''
            }
            if (!item.batchNumList) {
              item.batchNumList = []
            }
            for (var j = i + 1; j < result.outStockItemList.length; j++) {
              if (result.outStockItemList[i].localMaterialId === result.outStockItemList[j].localMaterialId) {
                delete result.outStockItemList[j].equipmentObject
                delete result.outStockItemList[j].unitGroupItemObject
                delete result.outStockItemList[j].id
                delete result.outStockItemList[j].expectNum
                result.outStockItemList[j].equipmentObject = {}
                result.outStockItemList[j].equipmentObject.equipmentType = res.outStockItemList[j].equipmentObject.equipmentType
              }
            }
            this.printData.push(Object.assign({
              name: item.equipmentObject.name,
              spec: item.equipmentObject.spec,
              unit: item.unitGroupItemObject && item.unitGroupItemObject.name
            }, item))
          }
          result.address = result.inStorageRoomObject ? result.inStorageRoomObject.name : (result.inLocalDepartmentObject ? result.inLocalDepartmentObject.name : '' + result.staffObject ? result.staffObject.name : '')
          resolve(result)
        })
      })
    },
    submitCancel: debounce(function () {
      this.api.cancle(this.objId).then(res => {
        this.getDetail().then((res) => {
          this.obj = Object.assign({}, this.obj, res)
        })
      })
    }),
    submitForm: debounce(function (form, status) {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          if (!this.obj.outStockItemList.length) {
            this.$messageTips(this, 'warning', '出库单中还未添加商品，请先添加商品再提交')
            return
          }
          let params = JSON.parse(JSON.stringify(Object.assign({}, params, this.obj)))
          params.status = status
          params.itemList = []
          params.materialType = EQUIPMENTTYPE
          for (let n = 0; n < params.outStockItemList.length; n++) {
            let item = params.outStockItemList[n]
            if (!item.batchNum) {
              this.$messageTips(this, 'warning', '请选择生产批号后再提交')
              return
            }
            if (!item.num) {
              this.$messageTips(this, 'warning', '请填写入库数量后再提交')
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
            delete params.outStockItemList[n].unitGroupItemObject
            delete params.outStockItemList[n].batchNumList
            delete params.outStockItemList[n].equipmentObject
            delete params.outStockItemList[n].localSettingObject
            params.itemList.push(Object.assign({
              materialType: EQUIPMENTTYPE
            }, params.outStockItemList[n]))
          }
          delete params.inStorageRoomObject
          delete params.outStorageRoomObject
          delete params.staffObject
          delete params.outStockItemList
          this.api.createOrUpdate(params).then(res => {
            if (res) this.$router.push('/goods/equipmentoutputstorageroomedit/' + this.objId + '?look=' + this.objId)
          })
        }
      })
    }),
    handleDeleteRow (data, index) {
      if (data.addFlag) {
        this.obj.outStockItemList[index - 1] = Object.assign({}, this.obj.outStockItemList[index - 1], { addFlag: true })
      }
      this.obj.outStockItemList.splice(index, 1)
      this.obj = JSON.parse(JSON.stringify(this.obj))
    },
    handleAddBatch (data, i) {
      let tempData = Object.assign({}, data)
      if (data.id || data.addFlag) {
        this.obj.outStockItemList[i] = Object.assign({}, this.obj.outStockItemList[i], { addFlag: false })
      }
      delete tempData.id
      delete tempData.equipmentObject
      // delete tempData.unitGroupItemObject
      delete tempData.batchNumList
      tempData.addFlag = true
      tempData.storageNum = ''
      tempData.batchNum = ''
      tempData.produceDate = ''
      tempData.validityDate = ''
      tempData.num = ''
      tempData.equipmentObject = {}
      tempData.equipmentObject.equipmentType = data.equipmentObject.equipmentType
      this.obj.outStockItemList.splice(i + 1, 0, tempData)
    }
  },
  watch: {
    '$route' (val) {
      this.objId = val.params.id
      if (this.objId) {
        this.schema = this.createObject().schema
        this.obj = this.createObject().obj
        this.getDetail().then((res) => {
          this.$nextTick(() => {
            this.obj = JSON.parse(JSON.stringify(Object.assign(this.obj, res)))
            this.pathTo = true
          })
        })
      }
    }
  },
  components: {
    printHeader,
    printFooter,
    printBody,
    remoteSelect
  }
}
</script>
