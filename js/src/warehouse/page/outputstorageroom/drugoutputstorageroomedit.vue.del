<template>
  <div id="drugreceive">
    <ever-bread-crumb name="出库" showTitle="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>基本信息</h4>
        <ever-form2 :class="[objId ? 'readform' : '']" :schema="schema" v-model="obj" ref="form" :span="12" :rules="rules" :nosubmit="true">
          <template v-if="objId" slot="code">
            <span>{{codeNum}}</span>
            <span class="status" :class="{'red': obj.status == 22}">{{statusName}}</span>
            <span v-if="!codeNum">无</span>
          </template>
          <template v-if="objId" slot="applyDepartment">
            <span>{{applyDepartmentName}}</span>
            <span>{{departmentName || '-'}}</span>
            <span v-if="!applyDepartmentName && !departmentName">无</span>
          </template>
        </ever-form2>
        <!-- <div class="hr"></div> -->
        <h4>商品出库明细</h4>
        <div class="listinfo">
          <div class="table">
            <el-table
              v-if="obj.outStockItemList"
              :data="obj.outStockItemList">
              <el-table-column
                width="50">
                <template slot-scope="scope">
                  <span v-if="scope.row.id">{{scope.$index + 1}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="商品名称">
                <template slot-scope="scope">
                  <span v-if="scope.row.localSettingObject">
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
              <el-table-column
                prop=""
                width="80"
                align="center"
                label="单位">
                <template slot-scope="scope">
                  <span v-if="scope.row.localSettingObject">
                    <wh-single-code-to-name
                    :isExt="true"
                    :patchObj="{
                      list: scope.row.localSettingObject.materialSkuObject.ext,
                      code: PACKAGE_CODE
                    }"
                  ></wh-single-code-to-name>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="expectNum"
                align="right"
                label="预期数量"
                width="100">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
   <div style="width: 700px;height:0;overflow: hidden">
     <print-header id="print_header" :recordData="recordData.head" :printHeader="pHeader" title="出库单" :tableHead="tableHead"></print-header>
     <print-body id="record_print" v-model="printData" :tableHead="tableHead"></print-body>
     <print-footer id="print_footer" v-model="printFooterData" :footerArr="printFooter"></print-footer>
   </div>
  </div>
</template>
<script>
import api from './outputstockapi'
import remoteSelect from '../joinstorage/remoteselect'
import getMaterialInfoApi from '../../store/getmaterialinfoapi'
import { DRUGTYPE, CHINESE_MEDICINE_TYPE, GOLBAL_VAL_MATERIL_NAME, parserJSON, parserComplex, PACKAGE_CODE, debounce, FULL_IN_OUT_TYPE, FULL_ORDER_NAME, FULL_STATE, doPrint, compare, SPEC_CODE, patch } from '@/util/common'
// floatTool
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
    comp: 'custom',
    span: 8
  },
  {
    name: 'outStockTypeName',
    label: '出库类型:',
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
    name: 'billCode',
    label: '来源单号:',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'applyStaff',
    label: '申请人:',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'applyDepartment',
    label: '申请部门:',
    comp: 'custom',
    span: 8
  },
  {
    name: 'recipient',
    label: '接收方:',
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
    name: 'outStockTime',
    label: '出库时间:',
    comp: 'readonlyitem',
    span: 8
  }
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
      SPEC_CODE,
      getMaterialInfoApi,
      FULL_STATE,
      FULL_IN_OUT_TYPE,
      FULL_ORDER_NAME,
      GOLBAL_VAL_MATERIL_NAME,
      PACKAGE_CODE,
      pathTo: false,
      dosageFormArr: [],
      objId: this.$route.params.id,
      queryParams: { materialType: DRUGTYPE, offset: 0, pagesize: 20, storageRoomId: '' },
      rules: {},
      currentRows: 0,
      codeNum: '',
      statusName: '',
      applyDepartmentName: '',
      departmentName: ''
      // totalPirce: 0,
      // stotalPirce: 0
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
    handleCheckNum (num, drugType, expectNum, i) {
      const float = /^(\+)?\d+(\.\d+)?/
      const parse = /^(\+)?\d*$/
      if (!CHINESE_MEDICINE_TYPE.includes(drugType)) {
        if (!parse.test(num)) {
          this.obj.outStockItemList[i].num = ''
          this.$messageTips(this, 'warning', '入库数量不能小于0并且不能有小数，请重新录入')
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
      } else {
        if (!float.test(num)) {
          this.obj.outStockItemList[i].num = ''
          this.$messageTips(this, 'warning', '入库数量不能小于0，请重新录入')
          this.obj = JSON.parse(JSON.stringify(this.obj))
          return
        }
      }
      if (expectNum && Number(expectNum) < Number(num)) {
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
      if ((this.obj.type === '2' || this.obj.type === '13')) {
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
      // 数组去重
      function unique (arr) {
        if (arr.length === 1) return arr
        let res = []
        for (var i = 0; i < arr.length; i++) {
          for (let name in arr[i]) {
            if (name === 'localMaterialId') {
              if (!unique1(res, arr[i][name])) {
                res.push(arr[i])
              }
            }
          }
        }
        return res
      }
      function unique1 (arr, id) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].localMaterialId === id) {
            return true
          }
        }
        return false
      }
      let printModel = this.$ever.getClinicConfig().printModel
      return new Promise((resolve, reject) => {
        api.getById(id || this.objId).then(res => {
          let result = JSON.parse(JSON.stringify(res))
          let resultPrint = JSON.parse(JSON.stringify(res))
          let print = []
          for (let i = 0; i < resultPrint.outStockItemList.length; i++) {
            let item = resultPrint.outStockItemList[i]
            item.unit = parserJSON({ data: item.localSettingObject.materialSkuObject.ext, property: PACKAGE_CODE }).trim()
            print.push(Object.assign({
              name: parserComplex({ data: item.localSettingObject.materialSkuObject.ext, propertys: GOLBAL_VAL_MATERIL_NAME.NAME_ONE }),
              spec: parserComplex({ propertys: [SPEC_CODE], data: item.localSettingObject.materialSkuObject.ext })
            }, item))
          }
          // if (result.type === 16) result.outStockItemList = result.outStockItemDetailList || []
          result.createDate = result.createTime
          result.outStockTime = result.outDate || ''
          this.codeNum = result.code
          this.departmentName = result.sectionName ? result.sectionName : ''
          this.statusName = this.setName(FULL_STATE.outstock, result.status, true)
          this.applyDepartmentName = result.applyLocalDepartmentObject ? result.applyLocalDepartmentObject.name : ''
          this.applyDepartmentName = result.staffObject && result.staffObject.localDepartmentObject ? result.staffObject.localDepartmentObject.name : ''
          result.recipient = result.type === '15' && result.supplierObject ? result.supplierObject.name : (result.type === '2' || result.type === '16') && result.sectionName ? result.sectionName : result.inStorageRoomObject ? result.inStorageRoomObject.name : ''
          result.applyStaff = result.applyStaffObject ? result.applyStaffObject.name : ''
          // result.typeName = this.setName(FULL_ORDER_NAME.outtype, result.type, true)
          result.outStockTypeName = this.setName(FULL_IN_OUT_TYPE.outtype, result.type, true)
          result.staffName = result.status === 21 && result.staffObject ? result.staffObject.name : ''
          this.printData = []
          this.pHeader[0].data = result.inLocalDepartmentObject ? result.inLocalDepartmentObject.name : ''
          // this.pHeader[1].data = result.staffObject && result.staffObject ? result.staffObject.name : ''
          this.pHeader[1].data = result.createDate
          this.recordData.head.patientId = result.code
          result.outStockItemList = result.outStockItemList.filter(item => {
            return typeof item.expectNum === 'number'
          })
          result.outStockItemList.sort(compare('localMaterialId'))
          for (let i = 0; i < res.outStockItemList.length; i++) {
            let item = res.outStockItemList[i]
            if ((result.type === '14') && !this.$route.query.look) result.outStockItemList[i].num = ''
            if (!item.batchNum) {
              item.batchNum = ''
            }
            if (!item.batchNumList) {
              item.batchNumList = []
            }
            if (printModel !== 2) {
              item.unit = parserJSON({ data: item.localSettingObject.materialSkuObject.ext, property: PACKAGE_CODE }).trim()
              this.printData.push(Object.assign({
                name: parserComplex({ data: item.localSettingObject.materialSkuObject.ext, propertys: GOLBAL_VAL_MATERIL_NAME.NAME_ONE }),
                spec: parserComplex({ propertys: [SPEC_CODE], data: item.localSettingObject.materialSkuObject.ext })
              }, item))
            }
            for (let j = i + 1; j < result.outStockItemList.length; j++) {
              if (result.outStockItemList[i].localMaterialId === result.outStockItemList[j].localMaterialId) {
                delete result.outStockItemList[j].drugObject
                delete result.outStockItemList[j].id
                if (res.type !== '15' && res.type !== '14') {
                  delete result.outStockItemList[j].unitGroupItemObject
                  delete result.outStockItemList[j].expectNum
                }
                // result.outStockItemList[j].drugObject = {}
                // result.outStockItemList[j].drugObject.drugType = res.outStockItemList[j].drugObject.drugType
              }
            }
          }
          if (printModel === 2) {
            for (let i = 0; i < print.length; i++) {
              let item = print[i]
              for (let j = i + 1; j < print.length; j++) {
                let items = print[j]
                if (item.localMaterialId === items.localMaterialId) {
                  item.num += items.num
                }
              }
            }
            let arr = unique(print)
            this.printData = arr
          }
          // this.printData.push({name: '总计', totalPirce: this.totalPirce, stotalPirce: this.stotalPirce})
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
          params.materialType = DRUGTYPE
          for (let n = 0; n < this.obj.outStockItemList.length; n++) {
            let item = this.obj.outStockItemList[n]
            if (!item.batchNum) {
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
            delete params.outStockItemList[n].unitGroupItemObject
            delete params.outStockItemList[n].batchNumList
            delete params.outStockItemList[n].drugObject
            delete params.outStockItemList[n].localSettingObject
            params.itemList.push(Object.assign({
              materialType: DRUGTYPE
            }, params.outStockItemList[n]))
          }
          delete params.inStorageRoomObject
          delete params.outStorageRoomObject
          delete params.staffObject
          delete params.outStockItemList
          this.api.createOrUpdate(params).then(res => {
            if (res) this.$router.push('/goods/drugoutputstorageroomedit/' + this.objId + '?look=' + this.objId)
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
      // tempData.drugObject = {}
      // tempData.drugObject.drugType = data.drugObject.drugType
      this.obj.outStockItemList.splice(i + 1, 0, tempData)
    },
    ...patch
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
