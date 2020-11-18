<template>
  <div class="table">
    <!-- 提示 -->
    <el-row>
      <el-col :span="12">
        <div class="title" :class="{'title_margin': showExport}">{{title || '申请采购物资'}}</div>
      </el-col>
      <el-col :span="12" v-if="showTips">
        <div class="tips">
          <el-tooltip placement="left" effect="light">
            <i class="iconfont icon-zhuyuan-yizhu-shuomi"></i>
            <div slot="content">
              <div class="tips_content">
                <el-row class="tips_row"><el-col :span="4">采购数量</el-col><el-col :span="1">=</el-col><el-col :span="19">(安全库存-可用库存) + 缺货数量</el-col></el-row>
                <el-row class="tips_row"><el-col :span="4">安全库存</el-col><el-col :span="1">=</el-col><el-col :span="19">日均消耗量 X (补货周期 + 安全周期)</el-col></el-row>
                <el-row class="tips_row"><el-col :span="4">缺货数量</el-col><el-col :span="1">=</el-col><el-col :span="19">已申领数量大于当前可用库存的数量</el-col></el-row>
                <el-row class="tips_row"><el-col :span="4">可用库存</el-col><el-col :span="1">=</el-col><el-col :span="19">当前实际可使用库存数</el-col></el-row>
                <el-row class="tips_row"><el-col :span="24">建议：</el-col></el-row>
                <el-row class="tips_row"><el-col :span="24">1：针对库存已预警的物资尽快创建采购申请；</el-col></el-row>
                <el-row class="tips_row"><el-col :span="24">2：定期进行日常补货采购计划，确保物资数量稳定在安全库存区间内。</el-col></el-row>
              </div>
            </div>
          </el-tooltip>
          采购数量计算说明
        </div>
      </el-col>
      <el-col :span="12" v-if="showExport">
        <div class="tips">
          <doc-download size="small" v-if="currentTableData.length" @downFile="exportTable" ref="exportProcurment" btnTxt="导出申请单"></doc-download>
        </div>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      ref="proTable"
      style="width: 100%;"
      :data="currentTableData"
      @selection-change="handleSelectionChange">
      <el-table-column
        v-if="edit && !notSelection"
        width="30"
        type="selection">
      </el-table-column>
      <el-table-column
        prop="name"
        label="商品名称\规格\生产厂商">
        <template slot-scope="scope">
          <div class="t-show" v-if="scope.row.localSettingObject && scope.row.localSettingObject.materialSkuObject">
            <p class="name">
              <wh-code-to-name
                :isExt="true"
                :cType="3"
                :patchObj="{
                  list: scope.row.localSettingObject.materialSkuObject.ext
                }"
              ></wh-code-to-name>
            </p>
            <p>
              <wh-code-to-name
                :showIcon="false"
                :isExt="true"
                :patchObj="{
                  code: [SPU_SPEC_CODE],
                  list: scope.row.localSettingObject.materialSkuObject.ext
                }"
              ></wh-code-to-name>
            </p>
            <p>
              <wh-code-to-name
                :showIcon="false"
                :isExt="true"
                :patchObj="{
                  code: [PRODUCER],
                  list: scope.row.localSettingObject.materialSkuObject.ext
                }"
              ></wh-code-to-name>
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="200"
        :align="edit ? '' : 'right'"
        label="采购数量">
        <template slot-scope="scope">
          <el-input v-if="edit && scope.row.localSettingObject" style="width: 120px;" :class="Number(scope.row.num) > 0 && judementNumberFormat(scope.row.localSettingObject.classifyId, scope.row.num) ? '' : 'error_num'" v-model="scope.row.num"></el-input>
          <div v-else>{{scope.row.num}} <span v-if="scope.row.localSettingObject.materialSkuObject">
            <wh-single-code-to-name
              :isExt="true"
              :patchObj="{
                list: scope.row.localSettingObject.materialSkuObject.ext,
                code: PACKAGE_CODE
              }">
            </wh-single-code-to-name>
          </span></div>
          <exception-log v-if="edit && scope.row.records && scope.row.records.length" :logData="scope.row.records"></exception-log>
        </template>
      </el-table-column>
      <el-table-column
        width="300"
        prop="num"
        :align="edit ? '' : 'left'"
        label="供应商">
        <template slot-scope="scope">
          <supply-info v-if="edit" :supplyData="scope.row.supplierLocals" :supplyValue="scope.row.supplierLocalId" @update:supplyValue="val => {handleUpdateSupply(val, scope.$index)}" :value="scope.row.supplierLocalId" :showError="true"></supply-info>
          <div v-else-if="scope.row.supplierLocal">{{scope.row.supplierLocal.supplierObject.name}}</div>
        </template>
      </el-table-column>
      <el-table-column
        width="160"
        prop="num"
        align="right"
        label="采购单价（元）">
        <template slot-scope="scope">
          <el-input-number v-if="edit && editPrice" :controls="false" :precision="4" :class="Number(scope.row.price) > 0 && judementPriceFormat(scope.row.price) ? '' : 'error_num'" v-model="scope.row.price"></el-input-number>
          <span v-else>{{scope.row.price | formatToFinacial(CHINESE_MEDICINE_TYPE.includes(scope.row.localSettingObject && scope.row.localSettingObject.classifyId) ? 4 : 2)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="150"
        prop="num"
        align="right"
        label="采购总金额（元）">
        <template slot-scope="scope">
          <span v-if="edit">{{computeTotalPrice(scope.row.price, scope.row.num) | formatToFinacial(CHINESE_MEDICINE_TYPE.includes(scope.row.localSettingObject && scope.row.localSettingObject.classifyId) ? 4 : 2)}}</span>
          <span v-else>{{scope.row.totalPrice | formatToFinacial(CHINESE_MEDICINE_TYPE.includes(scope.row.localSettingObject && scope.row.localSettingObject.classifyId) ? 4 : 2)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="notSelection"
        width="150"
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="removeFromTable(scope.row.localMaterialId, scope.row.supplierLocalId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 提交合计 -->
    <el-row v-if="currentTableData.length">
      <el-col :span="24">
        <div class="show_msg f18">
          <p>数量：<span>{{totalNumber > 0 ? totalNumber : 0}}</span></p>
          <p>合计：<span>{{totalPrice > 0 ? totalPrice : 0 | formatToFinacial(4)}}元</span></p>
        </div>
      </el-col>
    </el-row>
    <!-- 提交数据 -->
    <el-row v-if="edit && queryParams.storageRoomId" class="submit" :gutter="20">
      <el-col :span="4">
        <remote-select ref="remoteselect" :disabled="storageParams && noStorage" :queryParams="comQueryParams" placeholder="请输入条码／通用名／商品名称" :api="getMaterialInfoApi" apiName="listwithoutsplit" @selectSave="handleMaterialSelect" :value="meterialValue" :isSeachSelect="false" :isObj="true" :state="0"></remote-select>
      </el-col>
      <el-col :span="4">
        <supply-info :supplyData="supplyData" :supplyValue.sync="itemData.supplierLocalId" :value="itemData.supplierLocalId"></supply-info>
      </el-col>
      <el-col :span="4">
        <el-input v-model="itemData.num" type="number" :min="0"  :class="(Number(itemData.num) > 0 || itemData.num === '') && judementNumberFormat(drugType, itemData.num) ? '' : 'error_num'" placeholder="请输入采购数量"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button :disabled="!canAdd" type="primary" @click="addToTable">添加选择</el-button>
      </el-col>
    </el-row>
    <!-- 提交按钮 -->
    <el-row v-if="(edit || cancel) && queryParams.storageRoomId" class="submit">
      <el-col :span="12">
        <el-button v-if="edit" type="primary" :disabled="!canSubmit" @click="submitTable">提交</el-button>
        <el-button v-if="cancel" type="primary" @click="cancelTable">取消申请</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import supplyInfo from './supplyinfo'
import exceptionLog from './exceptionlog'
import remoteSelect from '@/warehouse/page/joinstorage/remoteselect'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import getMaterialInfoApi from '@/warehouse/store/getmaterialinfoapi'
import api from '@/warehouse/page/storages/store/procurementapi'
import { DOWNLOAD_FILE } from '@/warehouse/views/util/constant.js'
import { patch, debounce, SPU_SPEC_CODE, PRODUCER, PACKAGE_CODE, floatTool, GOLBAL_VAL_MATERIL_NAME, CHINESE_MEDICINE_TYPE } from '@/util/common'
export default {
  /**
   * title              标题
   * id                 申请单id
   * tableData          传入的表格数据
   * showTips           显示采购数量计算说明
   * edit               能否编辑表格
   * editPrice          能否编辑单价
   * cancel             能否取消申请
   * showExport         是否显示导出按钮
   * storageParams      查询物资传入的动态库房参数
   * extraParams        额外参数
   * notSelection       不显示checkbox
   */
  props: ['title', 'id', 'tableData', 'showTips', 'edit', 'editPrice', 'cancel', 'showExport', 'storageParams', 'extraParams', 'notSelection'],
  mixins: [getstorage],
  data () {
    return {
      SPU_SPEC_CODE,
      CHINESE_MEDICINE_TYPE,
      PRODUCER,
      PACKAGE_CODE,
      GOLBAL_VAL_MATERIL_NAME,
      getMaterialInfoApi, // 物资api
      currentTableData: [], // 表格数据
      chooseTableData: [], // 选择的表格数据
      queryParams: { materialType: '', offset: 0, pagesize: 20 }, // 物资参数
      itemData: { // 添加到表格的数据
        localMaterialId: '',
        supplierLocalId: '',
        num: '',
        localSettingObject: null
      },
      meterialValue: '', // 选择的物资
      drugType: '', // 药品类型
      supplyData: [] // 供应商数据
    }
  },
  mounted () {
    if (!this.storageParams) this.initData()
  },
  computed: {
    // 数量合计
    'totalNumber' () {
      let totalNumber = 0
      if (this.notSelection || !this.edit) {
        this.currentTableData.forEach(v => {
          if (!isNaN(Number(v.num))) totalNumber = floatTool.add(totalNumber, v.num)
        })
      } else {
        this.chooseTableData.forEach(v => {
          if (!isNaN(Number(v.num))) totalNumber = floatTool.add(totalNumber, v.num)
        })
      }
      return Number(totalNumber)
    },
    // 金额合计
    'totalPrice' () {
      let totalPrice = 0
      if (this.notSelection) {
        this.currentTableData.forEach(v => {
          totalPrice = floatTool.add(totalPrice, this.computeTotalPrice(v.price, v.num))
        })
      } else if (!this.edit) {
        this.currentTableData.forEach(v => {
          totalPrice = floatTool.add(totalPrice, v.totalPrice)
        })
      } else {
        this.chooseTableData.forEach(v => {
          totalPrice = floatTool.add(totalPrice, this.computeTotalPrice(v.price, v.num))
        })
      }
      return Number(totalPrice)
    },
    // 可否添加
    'canAdd' () {
      return this.itemData.localMaterialId && this.itemData.supplierLocalId && Number(this.itemData.num) > 0 && this.judementNumberFormat(this.drugType, this.itemData.num)
    },
    // 可否提交
    'canSubmit' () {
      let flag = false
      if (this.notSelection) {
        flag = this.currentTableData.length > 0 && !this.haveInvoidNumber(this.currentTableData, true) && this.haveChooseSupply(this.currentTableData)
      } else {
        flag = this.chooseTableData.length > 0 && !this.haveInvoidNumber(this.chooseTableData, true) && this.haveChooseSupply(this.chooseTableData)
      }
      return flag
    },
    // 查询物资参数
    'comQueryParams' () {
      let tempParams = JSON.parse(JSON.stringify(Object.assign(this.queryParams, { splitFlag: 0 })))
      // delete tempParams.storageRoomId
      return tempParams
    },
    // 没有选择库房
    'noStorage' () {
      return !this.storageParams.materialType && !this.storageParams.storageRoomId
    }
  },
  methods: {
    // 获取物资信息
    initData (data) {
      if (data) {
        // this.queryParams.materialType = data.materialType
        this.queryParams.storageRoomId = data.storageRoomId
      } else {
        // this.queryParams.materialType = this.materialType
        this.queryParams.storageRoomId = this.storageId
      }
    },
    // 根据供应商选择，获取单价
    getPriceBySupplier (rows, id) {
      if (rows) {
        let price
        rows.forEach(v => {
          if (v.supplierLocalId === id) price = v.price
        })
        return price
      }
    },
    // 计算总额
    computeTotalPrice (price, num) {
      if (floatTool.multiply(price, num) > 0) {
        return floatTool.multiply(price, num)
      } else {
        return 0
      }
    },
    // 选择物资
    handleMaterialSelect (data) {
      if (data) {
        this.drugType = data.classifyId // 药品类型：301、302 西药；303、304 中药
        this.itemData.localMaterialId = data.localMaterialId
        this.itemData.localSettingObject = data
        this.getSupplierInfo(data.localMaterialId)
      } else {
        this.resetData()
      }
    },
    // 根据物资id获取供应商信息
    getSupplierInfo (id) {
      if (id) {
        api.getSupplierLocalProductListByLocalSettingId({ localMaterialId: id }).then(res => {
          if (res.list && res.list.length) {
            this.supplyData = res.list
            this.itemData.supplierLocals = res.list
            this.itemData.supplierLocalId = res.list[0].supplierLocalId
          } else {
            this.supplyData = []
            this.itemData.supplierLocals = []
          }
        })
      }
    },
    // 添加数据到表格
    addToTable: debounce(function () {
      let tempObj = this.checkExistData(this.itemData)
      if (tempObj.exist) {
        this.currentTableData.forEach(v => {
          if (v.localMaterialId === tempObj.targetId) {
            v.num = floatTool.add(v.num, this.itemData.num)
          }
        })
      } else {
        this.itemData.price = this.getPriceBySupplier(this.itemData.supplierLocals, this.itemData.supplierLocalId)
        this.currentTableData.push(JSON.parse(JSON.stringify(this.itemData)))
        // 新加的数据 直接选中
        this.$refs.proTable.toggleRowSelection(this.currentTableData[this.currentTableData.length - 1])
      }
      // 重置
      this.$nextTick(() => {
        this.resetData()
      })
    }),
    // 重置数据
    resetData () {
      this.$nextTick(() => {
        this.itemData.localMaterialId = ''
        this.itemData.supplierLocalId = ''
        this.itemData.num = ''
        this.itemData.localSettingObject = null
        this.supplyData = []
        this.drugType = ''
        if (this.$refs.remoteselect) this.$refs.remoteselect.select = ''
      })
    },
    // 重置表格数据
    resetTable () {
      this.currentTableData = []
    },
    // 检查表格中是否已有要添加的数据
    checkExistData (item) {
      let tempArr = this.currentTableData.filter(v => {
        return v.localMaterialId === item.localMaterialId && v.supplierLocalId === item.supplierLocalId
      })
      return {
        exist: tempArr.length,
        targetId: item.localMaterialId
      }
    },
    // 删除表格数据
    removeFromTable: debounce(function (id, supId) {
      this.currentTableData = this.currentTableData.filter(v => {
        return v.localMaterialId !== id || v.supplierLocalId !== supId
      })
    }),
    // 选中表格数据
    handleSelectionChange (val) {
      this.chooseTableData = val
    },
    // 检查是否含有非法数字
    haveInvoidNumber (data, judement) {
      let flag = false
      data.forEach(v => {
        if (isNaN(Number(v.num)) || Number(v.num) <= 0) {
          flag = true
        } else if (judement) {
          if (v.localSettingObject && !this.judementNumberFormat(v.localSettingObject.classifyId, v.num)) {
            flag = true
          }
        }
      })
      return flag
    },
    // 根据物资类型判断数量格式
    judementNumberFormat (type, num) {
      let flag = true
      if (type === '301' || type === '302') { // 西药
        if (String(num).includes('.')) {
          flag = false
        }
      } else {
        if (String(num).includes('.') && String(num).split('.')[1] && String(num).split('.')[1].length > 4) {
          flag = false
        }
      }
      return flag
    },
    // 判断价格输入是否正确
    judementPriceFormat (price) {
      if (!price || price === '0') return false
      let flag = true
      if (isNaN(Number(price)) || Number(price) < 0) { // 非数字或负数
        flag = false
      } else { // 数字
        if (String(price).includes('.') && String(price).split('.')[1] && String(price).split('.')[1].length > 6) { // 小数
          flag = false
        }
      }
      return flag
    },
    // 检查是否选择了供应商
    haveChooseSupply (data) {
      let flag = true
      data.forEach(v => {
        if (!v.supplierLocalId || !this.judementPriceFormat(v.price)) flag = false
      })
      return flag
    },
    // 更新供应商选择
    handleUpdateSupply (val, index) {
      if (this.currentTableData[index].supplierLocal && val === this.currentTableData[index].supplierLocal.id) {
        this.currentTableData[index].supplierLocalId = this.currentTableData[index].supplierLocal.id
        this.currentTableData[index].price = this.currentTableData[index].supplierLocal.price
      } else {
        this.currentTableData[index].supplierLocalId = val
        this.currentTableData[index].price = this.getPriceBySupplier(this.currentTableData[index].supplierLocals, val)
      }
    },
    // 提交数据
    submitTable: debounce(function () {
      let tempTable = []
      if (this.notSelection) {
        tempTable = this.currentTableData
      } else {
        tempTable = this.chooseTableData
      }
      let tempArr = []
      tempTable.forEach(v => {
        let tempObj = {}
        tempObj.localMaterialId = v.localMaterialId
        tempObj.num = v.num
        tempObj.supplierLocalId = v.supplierLocalId
        tempObj.unitId = v.localSettingObject.materialVoObject.packagUnitId
        tempObj.price = v.price
        tempObj.materialType = v.localSettingObject.materialType
        tempObj.totalPrice = this.computeTotalPrice(tempObj.price, v.num)
        tempArr.push(tempObj)
      })
      let tempData = {
        num: this.totalNumber,
        totalPrice: this.totalPrice,
        // materialType: this.queryParams.materialType,
        storageRoomId: this.queryParams.storageRoomId,
        items: tempArr
      }
      this.$emit('submit', tempData)
    }),
    // 取消数据
    cancelTable: debounce(function () {
      this.$emit('cancel')
    }),
    // 导出数据
    exportTable: debounce(function () {
      api.exportPurchaseApplyInfo({ id: this.id }).then(res => {
        if (res) {
          this.$refs.exportProcurment.downfile(DOWNLOAD_FILE + res.fileName)
          this.$messageTips(this, 'success', '申请单导出成功')
        }
      })
    }),
    // 默认选中
    selectTableAll: debounce(function () {
      if (!this.notSelection && this.chooseTableData.length === 0 && this.currentTableData.length) { // 默认全选
        this.$nextTick(() => {
          this.currentTableData.forEach(v => {
            this.$refs.proTable.toggleRowSelection(v)
          })
        })
      }
    }),
    ...patch
  },
  filters: {
    // 格式化金额，两位小数
    moneyFormatFloat (val) {
      if (!isNaN(Number(val)) && !String(val).includes('.')) {
        val = `${String(val)}.00`
      }
      return val
      // if (String(val).match(/\..*/) && String(val).match(/\..*/)[0].slice(1).length === 1) {
      //   val = `${String(val)}0`
      // }
    }
  },
  watch: {
    'tableData' (val) {
      if (val && val.length) {
        this.currentTableData = val
        this.currentTableData.forEach(v => {
          if (v.supplierLocal) v.supplierLocal.price = v.price
          if (!v.hasOwnProperty('price') || !v.price) v.price = this.getPriceBySupplier(v.supplierLocals, v.supplierLocalId)
        })
        this.selectTableAll()
      }
    },
    storageParams: {
      handler (val) {
        // 初始化物资数据
        this.initData(val)
        // 重置
        this.resetData()
        // 清空已添加物资的表格
        this.resetTable()
      },
      deep: true
    },
    extraParams: {
      handler (val) {
        this.queryParams.materialType = val.materialType
        this.queryParams.storageRoomId = val.storageRoomId
      },
      deep: true
    }
  },
  components: {
    supplyInfo,
    exceptionLog,
    remoteSelect
  }
}
</script>

<style lang="scss" scoped>
  .table {
    margin-top: 15px;
  }
  .t-show {
    p {
      font-size: 14px;
      color: #666;
      margin: 0;
    }
    .name {
      color: #333;
    }
  }
  .title {
    font-size: 16px;
    color: #333;
    font-weight: bold;
    border-left: 3px solid #1C7BEF;
    padding-left: 10px;
  }
  .title_margin {
    margin-top: 10px;
  }
  .tips {
    text-align: right;
    margin-bottom: 5px;
    color: #666;
    font-size: 14px;
    line-height: 16px;
    .iconfont {
      margin-right: 6px;
      opacity: 0.99;
      color: #bbb;
    }
  }
  .tips_content {
    width: 375px;
    border-radius: 4px;
    font-size: 14px;
    color: #333;
    padding: 5px;
    .tips_row {
      padding: 5px 0;
    }
    .col_r {
      text-align: right;
    }
  }
  .submit {
    padding-top: 15px;
  }
  .show_msg {
    display: flex;
    color: #333;
    justify-content: flex-end;
    p {
      margin: 0;
      width: 300px;
      text-align: right;
      span {
        color: #EE4433;
        font-weight: bold;
      }
    }
    p:last-child {
      padding-right: 20px;
    }
  }
  .error_num {
    /deep/ .el-input__inner {
      border: 1px solid #EE4433;
    }
  }
  .table /deep/ .el-table__empty-block {
    display: block;
    height: 200px;
    .el-table__empty-text {
      line-height: 200px;
    }
  }
  .el-table__body-wrapper {
    .is-without-controls /deep/ .el-input__inner{
      padding: 0;
      width: 100px;
    }
  }
</style>
