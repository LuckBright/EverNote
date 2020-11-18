<template>
  <div>
    <ever-bread-crumb name="物资信息" :path="path" showTitle="true" pathTo="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body pos_re">
        <h2 class="alg_c">
          <span v-if="obj">
            {{obj.name}}
            <span v-if="obj.byname">({{obj.byname}})</span>
          </span>
        </h2>
        <el-tabs class="tabs" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="物资信息" name="info">
            <ever-form2
              :schema="schema"
              labelWidth="180px"
              v-model="obj"
              ref="form"
              :span="12"
              :rules="rules"
              @submit="submitForm()"
            >
              <div slot="default"></div>
            </ever-form2>
            <el-button
              type="primary"
              @click="submitForm()"
              v-if="reset == 1"
              class="ml180"
            >保存</el-button>
            <el-button
              type="primary"
              @click="handleEdit"
              v-if="reset != 1"
              class="ml180"
            >编辑</el-button>
          </el-tab-pane>
          <el-tab-pane label="设置" name="setting">
            <div v-if="source != 'drugs'">
              <h4>基本信息</h4>
              <el-form label-width="180px" :model="submitObj">
                <el-form-item label="管理方式:">
                  <el-checkbox
                    label="按有效期管理"
                    v-model="submitObj.isExpiryDate"
                    :true-label="1"
                    :false-label="0"
                    style="margin-right: 50px"
                  ></el-checkbox>
                  <el-checkbox
                    label="按唯一码管理"
                    v-model="submitObj.isManageAlone"
                    :true-label="1"
                    :false-label="0"
                  ></el-checkbox>
                </el-form-item>
              </el-form>
            </div>
            <div class>
              <h4>
                <el-button
                  style="float:right"
                  size="small"
                  type="primary"
                  @click.native.prevent="handleAddSupplier()"
                >添加供应商</el-button>供应商信息
              </h4>
              <el-table style="width: 100%" :data="supplierTableData" border>
                <el-table-column show-overflow-tooltip prop="name" label="供应商名称"></el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="supplierName"
                  align="center"
                  label="供应商简称"
                ></el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="unifiedCode"
                  align="center"
                  label="社会统一信用代码"
                ></el-table-column>
                <el-table-column show-overflow-tooltip align="right" width="200" label="采购价格">
                  <template slot-scope="scope">
                    <span
                      style="margin-right: 0"
                      v-if="scope.row.supplierId && scope.row.id"
                    >{{scope.row.price | formatToFinacial(4)}}</span>
                    <el-input
                      v-model="scope.row.price"
                      placeholder="请输入"
                      style="width:100px"
                      v-else
                    ></el-input>
                    <span v-if="scope.row.price" style="padding-left: 5px; color: #999">元</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip align="right" width="200" label="批发价格">
                  <template slot-scope="scope">
                    <span
                      style="margin-right: 0"
                      v-if="scope.row.supplierId && scope.row.id"
                    >{{scope.row.tradePrice >= 0 ? (scope.row.tradePrice | formatToFinacial) : '-'}}</span>
                    <el-input
                      v-model="scope.row.tradePrice"
                      placeholder="请输入"
                      style="width:100px"
                      v-else
                    ></el-input>
                    <span v-if="scope.row.tradePrice" style="padding-left: 5px; color: #999">元</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip width="100" label>
                  <template slot-scope="scope">
                    <el-button
                      v-if="!scope.row.price && !scope.row.id"
                      size="small"
                      type="danger"
                      @click="handleDelete(scope.$index, scope.row)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class>
              <!-- <h4>
              单位信息
            </h4>
            <el-table
              style="width: 100%"
              border
              :data="unitTableData"
              v-if="unitTableData.length"
              :stripe="false">
              <el-table-column show-overflow-tooltip
                prop="unitTypeName"
                label="单位类型">
              </el-table-column>
              <el-table-column show-overflow-tooltip
                label="选择单位">
                <template slot-scope="scope">
                  <ever-select v-model="scope.row.unitId" :options="unitArr" size="small">
                  </ever-select>
                </template>
              </el-table-column>
              </el-table>-->
              <el-button style="margin-top: 20px" type="primary" @click="handleSettingSubmit">保存</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="医嘱项目" name="charge">
            <el-table
              class="pos_re"
              :data="serviceTableData"
              style="width: 100%"
              border
              :stripe="false"
            >
              <el-table-column :resizable="false" prop="name" label="医嘱项目名称">
                <template slot-scope="scope">
                  <el-input v-if="chargeBtn" v-model="scope.row.name" placeholder="请输入医嘱项目名称"></el-input>
                  <span v-else>{{scope.row.name}}</span>
                </template>
              </el-table-column>
              <el-table-column :resizable="false" prop="pinyinCode" label="拼音码">
                <template slot-scope="scope">
                  <el-input v-if="chargeBtn" v-model="scope.row.pinyinCode" placeholder="请输入拼音码"></el-input>
                  <span v-else>{{scope.row.pinyinCode}}</span>
                </template>
              </el-table-column>
              <el-table-column label="项目类型">
                <template slot-scope="scope">
                  <sys-type
                    v-if="chargeBtn"
                    :firstDefault="!chargeSaveOrEditStatus || chargeBtn ? true : false"
                    code="THC_SOB_SERVICE_TYPE"
                    placeholder="请选择项目类型"
                    filterable="true"
                    :useValue="true"
                    v-model="scope.row.serviceType"
                  ></sys-type>
                  <sys-value v-else type="THC_SOB_SERVICE_TYPE" :code="scope.row.serviceType"></sys-value>
                </template>
              </el-table-column>
              <el-table-column label="财务分类">
                <template slot-scope="scope">
                  <sys-type
                    v-if="chargeBtn"
                    code="THC_RCM_FIN_TYPE"
                    placeholder="请选择财务分类"
                    filterable="true"
                    :useValue="true"
                    v-model="scope.row.finType"
                  ></sys-type>
                  <sys-value v-else type="THC_RCM_FIN_TYPE" :code="scope.row.finType"></sys-value>
                </template>
              </el-table-column>
              <el-table-column :resizable="false" prop="price" label="价格">
                <template slot-scope="scope">
                  <ever-price
                    v-if="chargeBtn"
                    v-model="scope.row.price"
                    style="width: 70%; display: inline-block"
                    placeholder="请输入价格"
                  ></ever-price>
                  <span v-else>{{ scope.row.price | formatToFinacial }}</span> 元
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" align="left">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    size="small"
                    v-if="(scope.row.id && !chargeSaveOrEditStatus)"
                    @click="handleChargeEdit(scope.row)"
                  >编辑</el-button>
                  <el-button
                    type="primary"
                    size="small"
                    v-if="chargeBtn"
                    @click="handleChargeSave(scope.row)"
                  >保存</el-button>
                  <el-button
                    size="small"
                    type="info"
                    v-if="chargeBtn"
                    @click="handleChargeCancel(scope.row)"
                  >取消</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="mt40 ptb20"></div>
            <h4 v-if="chargeServiceId" class="mt40">价格体系</h4>
            <el-table
              class="pos_re price-list"
              v-if="chargeServiceId"
              :data="saleTableData"
              style="width: 50%"
              empty-text="暂无价格体系"
              border
            >
              <el-table-column :resizable="false" min-width="150" label="价目表名称">
                <template slot-scope="scope">
                  <span>{{scope.row.priceTableName}}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column
              :resizable="false"
              prop="clinicid"
              label="机构">
              <template slot-scope="scope">
                <span v-if="scope.row.clinicid == -1">全部机构</span>
                <span v-else>{{setName(clinicArr, scope.row.clinicid)}}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(item, index) in saleHead"
              :key="index"
              :resizable="false"
              :prop="item.dimension_code"
              :label="item.dimension_name">
              <template slot-scope="scope">
                <span v-if="item.dimension_code == 'insuranceOrg'">{{setName(corpType, scope.row[item.th_to_column])}}</span>
                <span v-if="item.dimension_code == 'insuranceType'">{{setName(insuranceArr, scope.row[item.th_to_column])}}</span>
                <span v-if="item.dimension_code == 'cityCode'">{{setName(cityArr, scope.row[item.th_to_column])}}</span>
              </template>
            </el-table-column>
            <el-table-column
              :resizable="false"
              prop="priorityLevel"
              label="优先级">
            </el-table-column>
            <el-table-column
              :resizable="false"
              prop="priceTableModeName"
              label="价目表模式名称">
            </el-table-column>
            <el-table-column
              :resizable="false"
              prop="withBasePriceTableName"
              label="参考的基础价格">
            </el-table-column>
            <el-table-column
              :resizable="false"
              prop="calculateTypeValue"
              label="折扣">
              <template slot-scope="scope">
                <el-input v-if="scope.row.saleStatus && scope.row.priceTableMode != 1" v-model="scope.row.calculateTypeValue"></el-input>
                <span v-else>{{scope.row.calculateTypeValue}}</span>
              </template>
              </el-table-column>-->
              <el-table-column :resizable="false" prop="currentPrice" label="价格">
                <template slot-scope="scope">
                  <ever-price
                    v-if="scope.row.saleStatus && scope.row.priceTableMode == 1"
                    v-model="scope.row.currentPrice"
                  ></ever-price>
                  <span v-else>{{scope.row.currentPrice | formatToFinacial(4)}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" align="left">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    v-if="!scope.row.saleStatus"
                    size="small"
                    @click="handleSalePriceEdit(scope.row)"
                  >调价</el-button>
                  <el-button
                    type="primary"
                    size="small"
                    v-if="scope.row.saleStatus"
                    @click="handleSalePriceSave(scope.row)"
                  >保存</el-button>
                  <el-button
                    size="small"
                    type="info"
                    v-if="scope.row.saleStatus"
                    @click="handleSalePriceCancel(scope.row)"
                  >取消</el-button>
                  <!-- <el-button
                  size="small"
                  type="danger"
                  v-if="!scope.row.saleStatus" @click="handleSalePriceCancel(scope.row)">删除</el-button>-->
                </template>
              </el-table-column>
            </el-table>
            <el-button
              type="text"
              v-if="localMaterialId == 0"
              class="alg_c pos_ab"
              @click="hangdleToSetting"
            >请先完成“设置”，再设置“医嘱项目”</el-button>
            <el-button
              v-if="serviceTableData.length == 0 && localMaterialId != 0"
              class="pos_ab charge"
              type="primary"
              @click="handleChargeAdd"
            >+ 新增医嘱项目</el-button>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <supplier-dialog ref="supplierdialog" @selectedSupplier="handleSupplier"></supplier-dialog>
  </div>
</template>
<script>
import drugApi from '@/warehouse/store/drugapi'
import materCustomApi from '@/warehouse/store/matercustomapi'
import equipmentApi from '@/warehouse/store/equipmengtapi'
import localDrugSettingApi from '@/warehouse/store/localdrugsettingapi'
import clinicApi from '@/warehouse/store/clinicapi'
import serviceApi from '@/sob/store/serviceapi'
import { MATERIALTYPE_TYPE, debounce } from '@/util/common'
import { DRUG_SCHEMA, CHINESE_DRUG_SCHEMA, DRUG_SCHEMA_EDIT, CHINESE_DRUG_SCHEMA_EDIT, MEDICAL_CONSUMABLES, MEDICAL_CONSUMABLES_EDIT, OTHER_RULES, DRUG_RULES, OTHER_DRUG_RULES } from './materialschema.js'
import setname from '@/util/setstatusname'
import supplierDialog from '@/warehouse/page/drugbehospitalized/supplierdialog'
import tariffsDetailApi from '@/rcm/store/tariffs/mdtariffsdetailapi'
import priceManageDetailApi from '@/rcm/store/tariffs/priceManageDetail'
import insuranceorgApi from '@/insurance/store/insuranceorgapi'
import insuranceInfoManageApi from '@/rcm/store/insuranceInfoManageApi'
let payService = {
  name: '',
  byname: '',
  serviceType: '',
  finType: '',
  price: '',
  serviceClassification: '',
  localMaterialId: '',
  spec: '',
  unit: '',
  materialType: MATERIALTYPE_TYPE[0].id
}
export default {
  mixins: [setname],
  data () {
    let obj = this.$ever.createObjFromSchema(DRUG_SCHEMA)
    return {
      path: '/warehouse/materialtables/drugs',
      activeName: 'info',
      schema: DRUG_SCHEMA,
      obj,
      currentTabs: 'info',
      submitObj: {},
      api: {},
      chargeServiceId: '',
      MATERIALTYPE_TYPE,
      saleBtn: false,
      chargeBtn: false,
      chargeSaveOrEditStatus: false,
      objId: this.$route.params.id,
      source: this.$route.query.source,
      reset: this.$route.query.reset,
      goTo: this.$route.query.goTo,
      drugType: this.$route.query.drugType,
      localMaterialId: this.$route.query.localId,
      supplierTableData: [],
      saleTableData: [],
      saleOptions: [],
      saleHead: [],
      clinicArr: [],
      serviceTableData: [],
      cityArr: [],
      insuranceArr: [],
      originObj: {},
      corpType: insuranceorgApi.corpType,
      rules: {}
    }
  },
  created () {
    clinicApi.list().then(result => {
      if (result && result[0]) this.clinicArr = result
    })
    insuranceInfoManageApi.getBackList(2).then(result => {
      let arr = []
      result[0] && result.forEach(item => {
        arr.concat(item.children)
      })
      this.cityArr = arr
    })
    insuranceorgApi.list().then(result => {
      if (result && result[0]) this.insuranceArr = result.data
    })
    this.init()
    this._getSalePriceInit()
  },
  methods: {
    handleDelete (index, row) {
      this.supplierTableData.splice(index, 1)
    },
    hangdleToSetting () {
      this.activeName = 'setting'
    },
    handleSalePriceCancel (v) {
      v.currentPrice = this.originObj.currentPrice
      v.saleStatus = false
    },
    handleSalePriceEdit (v) {
      v.saleStatus = true
      this.originObj = Object.assign({}, v)
    },
    handleSalePriceSave: debounce(function (data) {
      this._isNum(data)
      this.loading = true
      let explainDate = new Date()
      let saleParams = {
        priceTableId: data.priceTableId,
        priceTableName: data.priceTableName,
        dataFrom: data.dataFrom,
        explain: `warehouse调整销售价格${explainDate}`,
        executionDatetime: explainDate,
        importType: 'PART',
        itemArray: [
          {
            priceTableDetailId: data.id,
            currentPrice: data.currentPrice
          }
        ]
      }
      this._createCurrentPrice(saleParams, data)
    }),
    _isApproval (id, data) {
      let params = {
        priceAdjustTableId: id
      }
      priceManageDetailApi.submit(params).then(res => {
        if (!res) {
          this.loading = false
          data.currentPrice = this.originObj.currentPrice
          this.$messageTips(this, 'warning', '销售价格修改失败，请重新申请')
        } else {
          data.saleStatus = false
          this.$messageTips(this, 'success', '价格修改成功', '提示')
        }
      })
    },
    _updateCurrentPrice (data, orginData) {
      let updateDate = new Date()
      let params = {
        priceAdjustTableId: data.master.id,
        explain: `warehouse调整销售价格${updateDate}`,
        executionDatetime: updateDate,
        itemArray: [
          {
            id: data.details[0].id,
            priceTableDetailId: data.details[0].priceTableDetailId,
            currentPrice: orginData.currentPrice
          }
        ]
      }
      priceManageDetailApi.update(params).then(res => {
        if (res && res.data) {
          this._isApproval(data.master.id, orginData)
        } else {
          this.loading = false
          this.$messageTips(this, 'warning', '销售价格修改失败，请重新申请')
        }
      })
    },
    _getList (id, data) {
      let params = {
        pmSalePriceAdjustTableId: id
      }
      priceManageDetailApi.list(params).then(res => {
        if (res && res.data) {
          this._updateCurrentPrice(res.data, data)
        } else {
          this.loading = false
          this.$messageTips(this, 'warning', '销售价格修改失败，请重新申请')
        }
      })
    },
    _createCurrentPrice (params, data) {
      priceManageDetailApi.loadDetail(params).then(res => {
        if (res && res.data && res.data.mid) {
          this._getList(res.data.mid, data)
          // 新建医嘱项目的时候调用启动同步基础价目表线程
          if (!params.id) tariffsDetailApi.doSynchronizeFromSob().then()
        } else {
          this.loading = false
          this.$messageTips(this, 'warning', res.data.exsitRepeatMessage)
        }
      })
    },
    handleChargeEdit (v) {
      this._resetAllStatus()
    },
    handleChargeCancel (v) {
      if (!v.id) this.serviceTableData = []
      this._resetAllStatus()
    },
    handleChargeSave (v) {
      serviceApi.createOrUpdate(v).then(result => {
        if (result && result.head && result.head.errCode === 0) {
          if (v.id) {
            this.$messageTips(this, 'success', '修改医嘱项目成功', '提示')
          } else {
            this.$messageTips(this, 'success', '创建医嘱项目成功', '提示')
          }
          this._getService()
          this._resetAllStatus()
        }
      })
    },
    handleChargeAdd () {
      this.serviceTableData.push(payService)
      this._resetAllStatus()
    },
    handleSettingSubmit () {
      if (this.source === 'drugs') this.submitObj.materialType = this.MATERIALTYPE_TYPE[0].id
      if (this.source === 'expandables') this.submitObj.materialType = this.MATERIALTYPE_TYPE[1].id
      if (this.source === 'equipments') this.submitObj.materialType = this.MATERIALTYPE_TYPE[2].id
      this.submitObj.globalMaterialId = this.obj.globalMaterialId
      // 管理方式 默认为数量管理 1
      this.submitObj.isNum = 1
      let supplierArr = []
      if (this.supplierTableData && this.supplierTableData.length) {
        for (let i = 0; i < this.supplierTableData.length; i++) {
          if (!this.supplierTableData[i].price) {
            this.$messageTips(this, 'warning', '请填写供应商采购价格或者采购价格')
            return
          }
          supplierArr.push({
            id: this.supplierTableData[i].id ? this.supplierTableData[i].id : '',
            supplierLocalId: this.supplierTableData[i].supplierLocalId ? this.supplierTableData[i].supplierLocalId : '',
            supplierId: this.supplierTableData[i].supplierId,
            price: this.supplierTableData[i].price,
            tradePrice: this.supplierTableData[i].tradePrice
          })
        }
      }
      this.submitObj.supplierLocalProductVos = supplierArr
      if (this.localMaterialId && this.localMaterialId !== '0') this.submitObj.id = this.localMaterialId
      localDrugSettingApi.createOrUpdate(this.submitObj).then(res => {
        if (res) {
          this.init()
          this.$messageTips(this, 'success', '保存成功', '提示')
        }
      })
    },
    handleSupplier (data) {
      this.supplierTableData.push(data)
    },
    handleAddSupplier () {
      this.$refs.supplierdialog.open(this.supplierTableData)
    },
    handleEdit () {
      if (this.drugType) {
        this.$router.push(`/warehouse/materialsee/${this.objId}?source=${this.source}&localId=${this.localMaterialId}&reset=1&drugType=${this.drugType}`)
      } else {
        this.$router.push(`/warehouse/materialsee/${this.objId}?source=${this.source}&localId=${this.localMaterialId}&reset=1`)
      }
    },
    handleClick (tab, e) {
      for (let key in payService) {
        payService[key] = ''
      }
      payService.materialType = MATERIALTYPE_TYPE[0].id
      this.currentTabs = tab.name
      if (this.source === 'expandables') {
        payService.serviceClassification = this.obj.consumptiveType
      }
      if (this.source === 'equipments') {
        payService.serviceClassification = this.obj.equipmentType
      }
      // payService.unit = this.obj.packageUnitId
      if (this.submitObj.item && this.submitObj.item.length) {
        this.submitObj.item.forEach(item => {
          if (item.unitType === '293') {
            payService.unit = item.unitId
          }
        })
      }
      if (this.source === 'drugs') {
        payService.serviceClassification = this.obj.drugType
      }
      // get收费服务项目
      if (tab.name === 'charge' && this.localMaterialId) {
        payService.localMaterialId = this.localMaterialId
        payService.displayName = this.obj.byname
        payService.name = this.obj.name
        payService.isValid = 1
        payService.spec = this.obj.spec
        this.localMaterialId && this._getService()
      }
    },
    submitForm () {
      this.obj.id = this.$route.params.id
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          // 保存药品信息
          if (this.source === 'drugs') {
            drugApi.updateGroup(this.obj).then(result => {
              if (result && result.id) this._reload()
            })
          }
          // 保存耗材信息
          if (this.source === 'expandables') {
            materCustomApi.createOrUpdate(this.obj).then(result => {
              if (result && result.id) this._reload()
            })
          }
          // 保存设备信息
          if (this.source === 'equipments') {
            equipmentApi.createOrUpdate(this.obj).then(result => {
              if (result && result.id) this._reload()
            })
          }
        }
      })
    },
    _reload () {
      if (this.drugType) {
        this.$router.push(`/warehouse/materialsee/${this.objId}?source=${this.source}&localId=${this.localMaterialId}&drugType=${this.drugType}`)
      } else {
        this.$router.push(`/warehouse/materialsee/${this.objId}?source=${this.source}&localId=${this.localMaterialId}`)
      }
    },
    getLocalSetting (id) {
      let index = 0
      if (this.source === 'expandables') index = 1
      if (this.source === 'equipments') index = 2
      localDrugSettingApi.getById(id).then(res => {
        this.submitObj = res
        this.submitObj.typeName = this.MATERIALTYPE_TYPE[index].name
        this.supplierTableData = res.supplierLocalProductVos ? res.supplierLocalProductVos : []
      })
    },
    getDrugInfo (id) {
      return drugApi.getById(id).then(res => {
        this._getInfoSetData(0, res)
      })
    },
    _getInfoSetData (index, res) {
      this.obj.globalMaterialId = res.id
      this.obj = Object.assign(this.obj, res)
      this.obj.unit = this.obj.unit
      this.obj.typeName = this.MATERIALTYPE_TYPE[index].name
    },
    _getService () {
      serviceApi.queryServiceByLocalMaterialId(this.localMaterialId).then(result => {
        if (result && result.head && result.head.errCode === 0 && result.data) {
          this.chargeServiceId = result.data.id
          result.data.finType = result.data.finType.toString()
          result.data.serviceType = result.data.serviceType.toString()
          this.serviceTableData = [result.data]
          this._getSalePriceList()
        } else {
          this.serviceTableData = []
        }
      })
    },
    _isNum (data) {
      if (data.currentPrice < 0) {
        data.currentPrice = ''
        return this.$messageTips(this, 'warning', '销售价格为空或小于0，请重新输入')
      }
      if (data.tradePrice < 0) {
        data.tradePrice = ''
        return this.$messageTips(this, 'warning', '批发价格为空或小于0，请重新输入')
      }
      if (data.price < 0) {
        data.price = ''
        return this.$messageTips(this, 'warning', '采购价格为空或小于0，请重新输入')
      }
    },
    _getSalePriceInit () {
      tariffsDetailApi.inithead().then(result => {
        if (result && result.head && result.head.errCode === 0) this.saleHead = result.data
      })
    },
    _getSalePriceList () {
      this.chargeServiceId && tariffsDetailApi.getChargingItems(this.chargeServiceId).then(result => {
        if (result && result.head && result.head.errCode === 0) {
          result.data.forEach(item => {
            item.saleStatus = false
          })
          this.saleTableData = result.data
        }
      })
    },
    init () {
      let initObj = {
        isExpiryDate: 0,
        isManageAlone: 0
      }
      // let drugRes = false
      this.objId = this.$route.params.id
      this.source = this.$route.query.source
      this.reset = this.$route.query.reset
      this.drugType = this.$route.query.drugType
      this.localMaterialId = this.$route.query.localId
      this.goTo = this.$route.query.goTo
      if (this.goTo === '1') this.activeName = 'setting'
      // 查询药品信息
      if (this.source === 'drugs') {
        this.path = '/warehouse/materialtables/drugs'
        if (this.reset === '1' && !this.drugType) {
          this.schema = DRUG_SCHEMA_EDIT
          this.rules = DRUG_RULES
        }
        if (!this.reset && !this.drugType) this.schema = DRUG_SCHEMA
        if (this.reset === '1' && this.drugType) this.schema = CHINESE_DRUG_SCHEMA_EDIT
        if (!this.reset && this.drugType) this.schema = CHINESE_DRUG_SCHEMA
        if (this.reset === '1' && this.drugType) this.rules = OTHER_DRUG_RULES
        this.obj = this.$ever.createObjFromSchema(this.schema)
        this.getDrugInfo(this.objId)
        // drugRes = await this.getDrugInfo(this.objId)
      } else {
        // 查询耗材信息
        // drugRes = true
        if (this.reset === '1') {
          this.rules = OTHER_RULES
          this.schema = MEDICAL_CONSUMABLES_EDIT
        }
        if (!this.reset) this.schema = MEDICAL_CONSUMABLES
        this.obj = this.$ever.createObjFromSchema(this.schema)
        this.obj = Object.assign({}, this.obj, initObj)
        if (this.source === 'expandables') {
          this.path = '/warehouse/materialtables/expandables'
          this._getConsumptiveDetail()
        }
        // 查询设备信息
        if (this.source === 'equipments') {
          this.path = '/warehouse/materialtables/equipments'
          this._getEquipmentDetail()
        }
      }
      this.$nextTick(() => {
        this.$refs.form.resetForm()
      })
      // drugRes && this.localMaterialId && this.localMaterialId !== '0' && this.getLocalSetting(this.localMaterialId)
      this.localMaterialId && this.localMaterialId !== '0' && this.getLocalSetting(this.localMaterialId)
    },
    _getEquipmentDetail () {
      equipmentApi.getById(this.objId).then(result => {
        if (result) this._getInfoSetData(2, result)
      })
    },
    _getConsumptiveDetail () {
      materCustomApi.getById(this.objId).then(result => {
        if (result) this._getInfoSetData(1, result)
      })
    },
    _resetAllStatus () {
      this.chargeBtn = !this.chargeBtn
      this.chargeSaveOrEditStatus = !this.chargeSaveOrEditStatus
    },
    _setSchema () {
      let index = this.schema.findIndex(item => {
        return item.name === 'herbalType'
      })
      return index
    }
  },
  watch: {
    '$route' (v) {
      this.init()
    },
    'obj.herbalType' (val) {
      if (!this.reset) return
      if (val === '2') {
        let index = this._setSchema()
        this.schema[index + 1].props.disabled = false
      } else {
        let index = this.schema.findIndex(item => {
          return item.name === 'drugRatio'
        })
        if (index > -1) {
          let index2 = this._setSchema()
          this.obj.drugRatio = 1
          this.schema[index2 + 1].props.disabled = true
        }
      }
    }
  },
  components: {
    supplierDialog
  }
}
</script>
<style lang="scss" scoped>
.hr.title {
  border-bottom: 1px solid #ccc;
}
.hr.line {
  margin-left: -180px;
  width: calc(100% + 180px);
}
.charge,
.alg_c {
  top: 75px;
  left: 50%;
  margin-left: -60px;
}
.pos_ab.alg_c {
  background: #fff;
  margin-left: -120px;
}
</style>
