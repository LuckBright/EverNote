<template>
  <div>
    <ever-bread-crumb v-if="isNew" name="价格管理" path="/goods/suppliers"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h2 class="alg_c" v-if="isNew">{{obj.name}}</h2>
        <div class="hr" v-if="isNew">
          <el-row :gutter="20">
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="6" v-if="obj.code">编码：{{obj.code}}</el-col>
            <el-col :span="17" v-if="obj.unifiedCode">社会统一信用代码：{{obj.unifiedCode}}</el-col>
          </el-row>
        </div>
        <div v-if="objId">
          <div class="main-head pos_re mt10">
            <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
          </div>
          <el-table :data="priceData">
            <el-table-column prop width="450" label="物资名称">
              <template slot-scope="scope">
                <div v-if="scope.row.id">
                  <div v-if="scope.row.localSettingObject">
                    <span v-if="scope.row.localSettingObject.classifyId == BLOOD_CLASSIFYID">
                      <wh-code-to-name
                        :isExt="true"
                        :patchObj="{
                            code: GENERAL_CODE,
                            list: scope.row.localSettingObject.materialSkuObject.ext,
                            attributeValue: 'materialPropertyValues',
                            isInfo: false
                          }"
                      ></wh-code-to-name>
                    </span>
                    <span v-else>
                      <wh-code-to-name
                        :isExt="true"
                        :patchObj="{
                            code: MATERILA_NAME_CODE,
                            list: scope.row.localSettingObject.materialSkuObject.ext,
                            isInfo: false
                          }"
                      ></wh-code-to-name>
                    </span>
                  </div>
                </div>
                <div v-else>
                  <el-select
                    style="width: 100%"
                    v-model="tempName"
                    filterable
                    :default-first-option="true"
                    clearable
                    remote
                    value-key="id"
                    @change="handleSelect"
                    placeholder="请输入商品名／编码／通用名"
                    :remote-method="handleRemoteMethodQuery"
                    :loading="loading"
                  >
                    <el-option
                      v-for="(item, i) in options"
                      :key="i"
                      :label="item.name"
                      :value="item"
                    >
                      <span style="float: left">{{ item.name }}</span>
                    </el-option>
                  </el-select>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop align="center" width="150" label="物资分类">
              <template slot-scope="scope">
                <span v-if="scope.row.localSettingObject">{{getMaterialType(scope.row.localSettingObject.classifyId)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop align="center" width="150" label="批准文号/注册证号" v-if="isNew">
              <template slot-scope="scope">
                <span v-if="scope.row.id">
                  <wh-single-code-to-name
                    v-if="scope.row.localSettingObject"
                    :isExt="true"
                    :patchObj="{
                      list: scope.row.localSettingObject.materialSkuObject.ext,
                      code: APPROVAL_CODE
                    }"
                  ></wh-single-code-to-name>
                  <wh-single-code-to-name
                    v-if="scope.row.localSettingObject"
                    :isExt="true"
                    :patchObj="{
                      list: scope.row.localSettingObject.materialSkuObject.ext,
                      code: SIGNUP_CODE
                    }"
                  ></wh-single-code-to-name>
                </span>
                <span v-else>{{scope.row.ratify}}{{scope.row.signup}}</span>
              </template>
            </el-table-column>
            <el-table-column prop align="center" label="规格">
              <template slot-scope="scope">
                <div v-if="scope.row.id">
                  <div v-if="scope.row.localSettingObject">
                    <span v-if="scope.row.localSettingObject.classifyId == BLOOD_CLASSIFYID">
                      <wh-code-to-name
                        :showIcon="false"
                        :isExt="true"
                        :patchObj="{
                          code: [BLOOD_SPECIFICATION],
                          list: scope.row.localSettingObject.materialSkuObject.ext,
                          attributeValue: 'materialPropertyValues',
                          isInfo: false
                        }"
                      ></wh-code-to-name>
                    </span>
                    <span v-else>
                      <wh-code-to-name
                        :showIcon="false"
                        :isExt="true"
                        :patchObj="{
                          code: [SPU_SPEC_CODE],
                          list: scope.row.localSettingObject.materialSkuObject.ext,
                          isInfo: false
                        }"
                      ></wh-code-to-name>
                    </span>
                  </div>
                </div>
                <span v-else>{{scope.row.spec}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop align="center" label="包装单位">
              <template slot-scope="scope">
                <div
                  v-if="scope.row.id"
                >
                <wh-single-code-to-name
                    v-if="scope.row.localSettingObject"
                    :isExt="true"
                    :patchObj="{
                      list: scope.row.localSettingObject.materialSkuObject.ext,
                      code: PACKAGE_CODE
                    }"
                  ></wh-single-code-to-name>
                </div>
                <div v-else>{{scope.row.pack}}</div>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="price"
              align="right"
              width="120"
              label="采购单价(元)"
            >
              <template slot-scope="scope">
                <div
                  v-if="scope.row.id && !scope.row.feState"
                >{{scope.row.price | formatToFinacial(4)}}</div>
                <div v-else>
                  <el-input-number v-model="scope.row.price" style="width: 100%" size="mini" :controls="false" :precision="4"></el-input-number>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="tradePrice"
              align="right"
              width="120"
              label="批发单价(元)"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.id && !scope.row.feState">
                  <span v-if="scope.row.tradePrice">
                    {{scope.row.tradePrice | formatToFinacial(4)}}
                  </span>
                  <span v-else>-</span>
                </div>
                <div v-else>
                  <el-input-number v-model="scope.row.tradePrice" style="width: 100%" size="mini" :controls="false" :precision="4"></el-input-number>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="300" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.id && !scope.row.feState">
                  <el-button size="small" type="info" @click="handleDetail(scope.row)">调价记录</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="handleModifyPrice(scope.row, scope.$index)"
                  >调价</el-button>
                </div>
                <div v-else>
                  <el-button size="small" type="primary" @click="handleSave(scope.row)">保存</el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="handleCancel(scope.row, scope.$index)"
                  >取消</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-row type="flex" justify="end" v-if="priceData.length">
            <ever-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :totalCount="totalCount"
              :current="current"
            ></ever-pagination>
          </el-row>
        </div>
      </div>
    </div>
    <el-dialog
      :title="!feStatus ? '启用' : '禁用'"
      ref="startAndStop"
      :visible.sync="startAndStopStatus"
      class="ui_dialog_02 spe"
    >
      <div style="height:100px;text-align: center;font-size: 20px; padding: 50px 0">
        <p>确定{{!feStatus ? '启用' : '禁用'}}该物资与供应商的供应关系？</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="startAndStopStatus = !startAndStopStatus">
          <i class="iconfont icon-quxiao"></i>取消
        </el-button>
        <el-button @click="handleStartOrStopSubmit" type="primary">
          <i class="iconfont icon-tijiao"></i>确认
        </el-button>
      </span>
    </el-dialog>
    <sup-detail ref="detail" :goodData="selectData"></sup-detail>
  </div>
</template>

<script>
import api from '../store/supplierapi'
import priceapi from '../store/supplierpriceapi'
import contrcApi from '@/warehouse/page/purchease/contract/api/contrct.js'
import localDrugSettingApi from '../store/localdrugsettingapi'
// import manufacturerapi from '../store/manufacturerapi'
import supDetail from '@/warehouse/page/purchease/contract/component/suppdetail.vue' // 调价记录
import { REMOTE_METHODS_PLACEHOLDER, REMOTE_METHODS_WIDTH } from '@/warehouse/views/util/constant'
import { patch,
  SPEC_CODE,
  APPROVAL_CODE,
  GOLBAL_VAL_MATERIL_NAME,
  parserComplex,
  parserJSON,
  PACKAGE_CODE,
  SIGNUP_CODE,
  SEARCH_CODE,
  BLOOD_CLASSIFYID,
  GENERAL_CODE,
  MATERILA_NAME_CODE,
  SPU_SPEC_CODE,
  BLOOD_SPECIFICATION,
  MATERILA_PINYIN_CODE,
  CONSUMABLES_MEDICAL_TYPE,
  CONSUMABLES_OFFICE_TYPE,
  CHINESE_PATENT_MEDICINE,
  TRADITIONAL_CHINESE_MEDICINE,
  MATERILA_CODE } from '@/util/common'
let tempRelationData = {
  localMaterialId: '',
  price: '',
  tradePrice: '',
  description: '',
  spec: '',
  pack: '',
  ratify: '',
  status: 0
}
var querySchema = [
  {
    name: 'localMaterialId',
    label: '商品名称',
    placeholder: REMOTE_METHODS_PLACEHOLDER,
    type: 'remotemethod',
    api: localDrugSettingApi,
    newName: true,
    showKeys: true,
    isLocalSettingSearch: true,
    style: REMOTE_METHODS_WIDTH,
  }
]

export default {
  props: {
    isNew: {
      type: Boolean,
      default: true
    }
  },
  data () {
    var queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.supplierLocalId = this.$route.params.supplierId
    let obj = {}
    obj.item = []
    return {
      querySchema,
      queryObj,
      contrcApi,
      PACKAGE_CODE,
      GOLBAL_VAL_MATERIL_NAME,
      CONSUMABLES_MEDICAL_TYPE,
      CONSUMABLES_OFFICE_TYPE,
      CHINESE_PATENT_MEDICINE,
      TRADITIONAL_CHINESE_MEDICINE,
      BLOOD_CLASSIFYID,
      loading: false,
      obj,
      api,
      localId: 0,
      priceapi,
      type: '',
      supplierLocalId: this.$route.params.supplierId,
      materialType: '',
      goodsName: '',
      supName: '',
      priceData: [],
      objId: this.$route.params.id,
      supplierId: this.$route.params.supplierId,
      intelligenceId: this.$route.params.intelligenceId,
      offset: 0,
      current: 1,
      pagesize: 20,
      totalCount: 0,
      pageSizes: [10, 20, 50, 100],
      pageLayout: 'total, sizes, prev, pager, next, jumper',
      rules: {},
      options: [],
      relationFlag: true,
      tempName: '',
      selectData: {},
      feData: {},
      startAndStopStatus: false,
      feStatus: 0,
      SPEC_CODE,
      SIGNUP_CODE,
      MATERILA_NAME_CODE,
      SPU_SPEC_CODE,
      APPROVAL_CODE,
      GENERAL_CODE,
      BLOOD_SPECIFICATION,
      defaultObj: {} // 默认合同
    }
  },
  methods: {
    getMaterialType (id) {
      let type = {
        '301': '西药',
        '302': '中成药',
        [CONSUMABLES_MEDICAL_TYPE]: '医疗耗材',
        [CONSUMABLES_OFFICE_TYPE]: '办公耗材',
        '10008': '商品',
        [CHINESE_PATENT_MEDICINE]: '中药颗粒',
        [TRADITIONAL_CHINESE_MEDICINE]: '中药饮片',
        [BLOOD_CLASSIFYID]: '血液'
      }
      return type[id] ? type[id] : ''
    },
    handleStartOrStopSubmit () {
      this.priceapi.updateLocal(this.feData).then(result => {
        if (result) {
          this.list()
          this.startAndStopStatus = false
        }
      })
    },
    handleSelect (data) {
      // 存储一份原始数据， 防止数据污染
      let tempRelation = Object.assign({}, tempRelationData)
      if (!data) this.$set(this.priceData, 0, tempRelationData)
      if (!this.tempName) return
      data.localMaterialId = data.id
      data.spec = parserComplex({ data: data.materialSkuObject.ext, propertys: [SPEC_CODE] })
      data.pack = parserJSON({ data: data.materialSkuObject.ext, property: PACKAGE_CODE }).trim()
      data.ratify = parserJSON({ data: data.materialSkuObject.ext, property: APPROVAL_CODE }).trim()
      data.signup = parserJSON({ data: data.materialSkuObject.ext, property: SIGNUP_CODE }).trim()
      delete data.id
      this.$set(this.priceData, 0, Object.assign(this.priceData[0], data))
      this.options = []
      tempRelationData = tempRelation
    },
    handleRemoteMethodQuery (query) {
      if (query !== '') {
        let codeQuery = []
        // // 判断是否是血液
        // if (this.obj.classifyId === BLOOD_CLASSIFYID) {
        //   codeQuery = GENERAL_CODE
        //   this.queryPlaceholder = '血液品种 / ABO血型 / RH(D)血型'
        // } else {
        //   codeQuery = MATERILA_PINYIN_CODE.concat(SEARCH_CODE)
        //   this.queryPlaceholder = '通用名 / 商品名 / 批准文号'
        // }
        codeQuery = MATERILA_PINYIN_CODE.concat(SEARCH_CODE)
        let params = {
          name: query,
          codesMatchValues: [
            {
              codes: codeQuery,
              value: query
            }
          ],
          systemType: 101
        }
        localDrugSettingApi.list(params).then(result => {
          if (result && result.list) {
            result.list.forEach(item => {
              item.name = parserComplex({ data: item.materialSkuObject.ext, propertys: GOLBAL_VAL_MATERIL_NAME.NAME_ONE })
            })
            this.options = result.list
          }
        })
      } else {
        this.options = []
      }
    },
    handleSave (data) {
      // 保存 -btn
      let tempData = Object.assign({}, data)
      delete tempData.drugObject
      delete tempData.consumptiveMaterialObject
      delete tempData.equipmentObject
      delete tempData.unitGroupItemObject
      delete tempData.manufacturerObject
      delete tempData.materialSkuObject
      delete tempData.classifyVoObject
      delete tempData.classifyVoObject
      if (!data.feState) { // 关联物资
        if (!data.localMaterialId) return this.$messageTips(this, 'warning', '请选择物资名称', '提示')
        if (!data.price || data.price < 0) return this.$messageTips(this, 'warning', '请检查输入的物资单价不能小于0，请核对', '提示')
        if (data.tradePrice && data.tradePrice < 0) return this.$messageTips(this, 'warning', '请检查输入的批发价格不能小于0，请核对', '提示')
        tempData.status = 0
        tempData.supplierLocalId = this.supplierLocalId
        this.priceapi.createLocal(tempData).then(result => {
          if (result) {
            this.priceData[0] = Object.create(null)
            this.$set(this.priceData, 0, tempRelationData)
            this.tempName = ''
            this.relationFlag = true
            this.list()
          }
        })
      } else { // 调价
        if (!data.price || data.price < 0) return this.$messageTips(this, 'warning', '请检查输入的物资单价不能小于0，请核对', '提示')
        if (data.tradePrice && data.tradePrice < 0) return this.$messageTips(this, 'warning', '请检查输入的批发价格不能小于0，请核对', '提示')
        if (data.fePrice !== data.price || data.feTradePrice !== data.tradePrice) {
          this.priceapi.createLocal(tempData).then(result => {
            if (result) {
              this.list()
              this.relationFlag = true
            }
          })
        }
      }
    },
    handleCancel (data, index) {
      // 取消-btn
      if (!data.feState) { // 关联物资
        this.tempName = ''
        this.$set(this.priceData, 0, {})
        this.priceData.shift()
        this.relationFlag = true
      } else { // 调价
        this.priceData[index].price = this.priceData[index].fePrice
        this.priceData[index].tradePrice = this.priceData[index].feTradePrice
        this.priceData[index].description = ''
        this.priceData[index].feState = 0
      }
    },
    handleDetail (row) {
      this.selectData = {
        materialsId: row.id,
        packingUnit: row.localSettingObject ? parserComplex({ data: row.localSettingObject.materialSkuObject.ext, propertys: PACKAGE_CODE }) : '',
        specification: row.localSettingObject ? parserComplex({ data: row.localSettingObject.materialSkuObject.ext, propertys: [SPEC_CODE] }) : '', // 规格
        materialsName: row.localSettingObject ? parserComplex({ data: row.localSettingObject.materialSkuObject.ext, propertys: [...MATERILA_CODE, APPROVAL_CODE] }) : '', // 物资名称
      }
      this.$refs.detail.open()
    },
    handleModifyPrice (row, index) {
      this.priceData.forEach(item => {
        item.feState = 0
      })
      this.priceData[index].feState = 1
    },
    query: function (queryObject) {
      queryObject.supplierLocalId = this.supplierId
      this.queryObj = queryObject
      this.handleCurrentChange(1)
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.offset = (this.current - 1) * this.pagesize
      this.list()
    },
    handleCurrentChange (val) {
      this.current = val
      this.offset = (val - 1) * this.pagesize
      this.list()
    },
    list (param) {
      let params = param || {}
      params = Object.assign(params, this.queryObj, this.listParams)
      for (let key in params) {
        if (params[key] === '') {
          delete params[key]
        }
      }
      params.offset = this.offset
      params.pagesize = this.pagesize
      this.priceapi.list(params).then(res => {
        if (res.list) {
          res.list.forEach(item => {
            item.supplierId = item.id
            item.feState = 0
            item.fePrice = item.price
            item.feTradePrice = item.tradePrice
            item.description = ''
          })
          this.priceData = res.list
        } else {
          this.priceData = []
        }
        this.totalCount = res.totalCount || 0
      })
    },
    ...patch
  },
  created () {
    this.obj.supplierId = this.objId
    this.api.getById(this.objId).then(res => {
      this.type = res.type
      delete res.id
      this.obj = Object.assign(this.obj, res)
      this.supName = this.obj.name
    })
    if (this.supplierId) {
      this.priceapi.getById(this.supplierId).then(res => {
        this.localId = res.id
        this.obj = Object.assign(this.obj, res)
      })
    }
    this.$watch('localId', (val) => {
      if (val) {
        var params = { supplierLocalId: val }
        this.list(params)
      }
    })
    this.$watch('type', (val) => {
      this.queryObj = Object.assign({}, this.queryObj, { type: val })
    })
    contrcApi.queryList({ contractNo: '', supplierLocalId: this.supplierLocalId, status: 5, offset: 0, pagesize: 20, isDefault: 1 }).then(res => {
      if (res && res.length) {
        this.defaultObj = res[0]
      }
    })
    if (!this.isNew) this.list()
  },
  components: {
    supDetail,
  }
}
</script>
<style scoped>
.hr {
  padding: 20px 0;
}
.relation {
  top: 0;
  right: 0;
}
.main-head /deep/ .form.el-form {
  border-bottom: none !important;
}
</style>
