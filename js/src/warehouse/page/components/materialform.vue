<template>
  <div>
    <div class="layout_inner">
      <!-- 返回栏 -->
      <h2 class="alg_c">{{breadCrumbName}}</h2>
      <!-- 分类查询区域 start -->
      <!-- <ever-form2
        label-width="120px"
        :schema="classifySchema"
        v-model="obj"
        ref="form"
        class="bg_col_02 pt10"
        :span="10"
        :rules="rules"
        @submit="submitForm()"
        :nosubmit="true">
        <template
          slot="classifyId"
          v-if="[STENCIL_TYPE[0].id, STENCIL_TYPE[2].id, STENCIL_TYPE[8].id].includes(systemType)">
          <ever-select
            v-model="obj.type1"
            filterable
            placeholder="一级分类"
            :clearable="true"
            :options="options1"
            class="queryClass">
          </ever-select>
          <ever-select
            v-if="obj.type1 && options2.length"
            v-model="obj.type2"
            filterable
            placeholder="二级分类"
            :clearable="true"
            :options="options2"
            class="queryClass">
          </ever-select>
          <ever-select
            v-if="obj.type2 && options3.length"
            v-model="obj.type3"
            filterable
            placeholder="三级分类"
            :clearable="true"
            :options="options3"
            class="queryClass">
          </ever-select>
          <div class="query-model" v-if="obj.classifyId && saveBtn">
            <el-select
              v-model="queryVal"
              filterable
              clearable
              style="width: 100%"
              remote
              @change="handelChange"
              value-key="id"
              :placeholder="queryPlaceholder"
              :remote-method="remoteMethod"
              :loading="loading">
              <el-option
                v-for="(option, i) in options"
                :key="i"
                :label="option.name"
                :value="option">
              </el-option>
            </el-select>
          </div>
        </template>
      </ever-form2>
      <el-row class="mt15">
        <el-col :span="16" class="bg_col_02">
          <div v-for="schema in groupSchema" :key="schema.title">
            <h3 class="primary-title">{{schema.title}}<span class="f14 ml20 f_nor">{{schema.subTitle}}</span></h3>
            <ever-form2
              label-width="120px"
              :schema="schema.schema"
              v-model="obj"
              ref="form"
              class="bg_col_02 pt10"
              :span="10"
              :rules="rules"
              @submit="submitForm()"
              :nosubmit="true"></ever-form2>
          </div>
        </el-col>
        <el-col :span="8">
          2
        </el-col>
      </el-row> -->
      <!-- 分类查询区域 end -->
      <!-- 顶部搜索区域 -->
      <div class="content-top">
        <ever-form2
          label-width="0px"
          :schema="schema"
          v-model="obj"
          ref="form"
          :span="10"
          :rules="rules"
          @submit="submitForm()"
          :nosubmit="true"
          style="background-color: #F5F5F5; height: 40px; padding: 10px 200px;">
          <template
            slot="classifyId"
            v-if="[STENCIL_TYPE[0].id, STENCIL_TYPE[2].id, STENCIL_TYPE[8].id].includes(systemType)">
            <ever-select
              v-model="obj.type1"
              filterable
              placeholder="一级分类"
              :clearable="true"
              :options="options1"
              class="queryClass">
            </ever-select>
            <ever-select
              v-if="obj.type1 && options2.length"
              v-model="obj.type2"
              filterable
              placeholder="二级分类"
              :clearable="true"
              :options="options2"
              class="queryClass">
            </ever-select>
            <ever-select
              v-if="obj.type2 && options3.length"
              v-model="obj.type3"
              filterable
              placeholder="三级分类"
              :clearable="true"
              :options="options3"
              class="queryClass">
            </ever-select>
            <div class="query-model" v-if="obj.classifyId && saveBtn">
              <el-select
                v-model="queryVal"
                filterable
                clearable
                :default-first-option="true"
                style="width: 100%"
                remote
                @change="handelChange"
                value-key="id"
                :placeholder="queryPlaceholder"
                :remote-method="remoteMethod"
                :loading="loading">
                <el-option
                  v-for="(option, i) in options"
                  :key="i"
                  :label="option.name"
                  :value="option">
                </el-option>
              </el-select>
            </div>
          </template>
        </ever-form2>
      </div>
      <!-- 中间schema表单区域 -->
      <div class="content-center">
        <el-row class="mt15 row-container">
          <!-- 左侧内容区域 -->
          <el-col :span="16">
            <div class="content-center-left" :class="{'content-center-left-bottom': saveBtn}">
              <ever-form2
                ref="formLeft"
                :schema="schemaLeft"
                v-model="objLeft"
                :rules="rulesLeft"
                @submit="submitForm()"
                :nosubmit="true">
                <template slot="basicInfo" v-if="saveBtn">
                  <h3 class="primary-info primary-title">基本信息</h3>
                </template>
                <template slot="signInfo" v-if="saveBtn">
                  <h3 class="primary-info primary-title">标志信息</h3>
                </template>
                <template slot="financeInfo" v-if="saveBtn">
                  <h3 class="primary-info primary-title">财务信息</h3>
                </template>
                <template slot="doctorAdvice" v-if="saveBtn">
                  <h3 class="primary-info primary-title">医嘱信息
                    <span class="doctor-tip">以下内容，请依据临床医嘱实际情况填写</span>
                    <span class="test-data">检查数据正确性</span>
                  </h3>
                </template>
                <template slot="pictureDescribe" v-if="saveBtn">
                  <div class="showpicture">
                    <span>图例说明</span>
                  </div>
                </template>
                <template slot="doctorWords" v-if="saveBtn">
                  <div>
                    <el-input></el-input>
                  </div>
                </template>
              </ever-form2>
              <!-- 规格表格 -->
              <div class="content-center-table" v-if="saveBtn">
                <el-table
                  :data="specTableData">
                  <el-table-column
                    label="规格"
                    width="300">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row['SXX000049']"></el-input>
                      <span class="unit-span">{{showLabel('SXX000047', objLeft['SXX000047'])}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    width="120">
                    <template slot-scope="scope">
                      <ever-select
                        v-model="scope.row['SXX000048']"
                        :options="specSchemaData.schema[1].props.initOptions">
                      </ever-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="销售单价">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row['SXX190309000018h4dd']"></el-input>
                      <span class="unit-span">元</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="条码">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row['SXX000050']"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="right"
                    width="100">
                    <template slot-scope="scope">
                      <el-button
                        type="danger"
                        size="small"
                        class="spec-button"
                        @click="removeSpecData(scope.$index)">删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-table
                  :data="specExtraTableData"
                  class="extra-table">
                  <el-table-column width="420">
                    <template slot-scope="scope">{{scope.row.title}}</template>
                  </el-table-column>
                  <el-table-column>
                    <template slot-scope="scope">
                      <el-input type="number" v-model="scope.row.extraPrice"></el-input>
                      <span class="unit-span">元</span>
                    </template>
                  </el-table-column>
                  <el-table-column></el-table-column>
                  <el-table-column width="100"></el-table-column>
                </el-table>
                <div class="add-specifications">
                  <span class="add-tips" @click="addSpecData">添加规格</span>
                  <div class="checked">
                    <el-checkbox v-model="specExtraPrice" :disabled="specTableData.length === 0"></el-checkbox>
                    允许按制剂单位销售
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <!-- 右侧内容区域 -->
          <el-col :span="8" class="row-right">
            <div class="content-center-right" v-if="saveBtn">
              <p class="right-title">说明书信息</p>
              <div class="right-content">
                <ever-form2
                  ref="formRight"
                  :schema="schemaRight"
                  v-model="objRight"
                  :rules="rulesRight"
                  @submit="submitForm()"
                  :nosubmit="true">
                </ever-form2>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 底部按钮区域 -->
      <div class="table-btn-ml_80" v-if="saveBtn">
        <el-button
          v-if="saveBtn || objId"
          type="primary"
          @click="submitForm()"
          size="large"
          :loading="submitDisableBtn">
          保存
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { MATERIALFORM, MEDICINEOPTIONS } from '@/util/warehouseconfig'
import classify from '@/warehouse/util/classify'
import SkuTable from '@/warehouse/page/components/skutable'
import { debounce, PROPERTY_TYPE_FOR_TEMPLET, GLOBAL_ATTR, STENCIL_TYPE, PROPERTY_TYPE_FOR_TEMPLET_CERTAINLY, dateFormat, patch, CHECK_CODE, getFirstRoutePath, MECHANISM_CODE, MATERILA_PINYIN_CODE, SEARCH_CODE, BLOOD_CLASSIFYID, GENERAL_CODE, yesno, MATERIALTYPE, DRUGTYPE, CUSTOM_MATERIAL_CODE_DICT, CUSTOM_MATERIAL_CODE } from '@/util/common'
import templetApi from '@/warehouse/page/groupmaterial/store/templetapi'
import { createdSchemaAndObjectValue, readonlyObjItem, setUpClassifyName, _findIndex } from '@/util/formcustom'
let schemaInfo = [
  // {
  //   name: 'code',
  //   label: '物资编码',
  //   comp: 'readonlyitem',
  //   span: 24
  // },
  // {
  //   name: 'classifyId',
  //   label: '类型',
  //   comp: 'readonlyitem',
  //   span: 24
  // }
]
const classifySchema = [{
  name: 'classifyId',
  label: '',
  comp: 'custom',
  span: 24
}]
const rulesInfo = {
  managementModel: [
    { required: true, message: '必填项', trigger: 'blur' }
  ]
}
// 左侧列表多个schame
const groupSchema = [
  {
    title: '基础信息',
    schema: [],
    keys: ['SXX000003', 'SXX000004', 'SXX000005', 'SXX000006', 'SXX000001', 'SXX000009', 'SXX000007', 'ZDY000001']
  },
  {
    title: '标志信息',
    schema: [],
    keys: ['SXX000014', 'ZDY000001', 'SXX000012', 'ZDY000001', 'ZDY000001', 'ZDY000001']
  },
  {
    title: '财务信息',
    schema: [],
    keys: ['ZDY000001', 'ZDY000001', 'ZDY000001', 'ZDY000001', 'ZDY000001', 'ZDY000001']
  },
  {
    title: '医嘱信息',
    subTitle: '注意：以下内容，请依据临床医嘱实际情况填写',
    schema: []
  }
]
export default {
  props: ['systemType', 'parentSchema', 'customApi', 'customType', 'isSearch', 'backListRoute', 'propertyName', 'propertyNameValues', 'organization', 'slots', 'slotsData', 'titleCode', 'propertyParentName', 'relationName', 'relationType', 'isSubmitForm'],
  mixins: [classify],
  data () {
    return {
      queryVal: '',
      obj: {},
      schema: [],
      classifySchema,
      groupSchema,
      tempObj: {},
      resultObj: {},
      tempSchema: [],
      objId: this.$route.params.id,
      rules: {},
      saveBtn: false,
      loading: false,
      materialDictSkuId: '',
      options: [],
      skuTableData: [],
      tableData: [],
      tempTableData: [],
      thisKeysForSku: [],
      thisKeysForSpu: [],
      countId: 0,
      notUseDialog: false,
      inUseDialog: false,
      deleteId: 0,
      statusEdit: this.$route.query.status,
      STENCIL_TYPE,
      cacheResult: {},
      schemaInfo,
      spuObj: {},
      // 编辑缓存关联关系
      cacheRelation: [],
      // 查询placeholder
      queryPlaceholder: '请先尝试搜索您需要的物资',
      breadCrumbName: '',
      yesno,
      // 创建医嘱项目
      medicalOrder: '',
      submitDisableBtn: false, // 保存按钮loading
      // 基础价
      basePrice: '',
      // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      arraySpu: [], // 后台返回的spu数据
      arraySku: [], // 后台返回的sku数据
      propertiesSpuSku: [], // 后台返回的spu+sku的properties数据
      // 左侧form表单Schema
      fixedCodeArr: [], // 左侧固定模版
      fixedSchema: [], // 左侧固定模版
      fixedObj: {}, // 左侧固定模版
      fixedRules: {}, // 左侧固定模版
      leftCodeArr: [], // 左侧code集合
      schemaLeft: [],
      objLeft: {},
      rulesLeft: {},
      // 规格表格数据
      specSchemaArr: ['SXX000049', 'SXX000048', 'SXX190309000018h4dd', 'SXX000050'],
      specSchemaData: {},
      specRowData: {
        'SXX000049': '',
        'SXX000048': '',
        'SXX190309000018h4dd': '',
        'SXX000050': ''
      },
      specTableData: [],
      specExtraPrice: false, // 是否允许按制剂单位销售
      specExtraRowData: {
        title: '以制剂单位销售',
        extraPrice: ''
      },
      specExtraTableData: [], // 以制剂单位销售的价格
      // 右侧form表单Schema
      schemaRight: [],
      objRight: {},
      rulesRight: {}
    }
  },
  created () {
    if (!this.objId) {
      this.breadCrumbName = '新建' + this.customType
      let schema = []
      if (STENCIL_TYPE[0].id === this.systemType || STENCIL_TYPE[8].id === this.systemType || STENCIL_TYPE[2].id === this.systemType) {
        schema.push({
          name: 'classifyId',
          label: '',
          comp: 'custom',
          span: 24
        })
      }
      if (this.isSearch) schema.push({ name: 'queryModel', label: '', comp: 'custom', span: 24 })
      this.schema = schema
      this.obj = this.$ever.createObjFromSchema(schema)
      this.obj.classifyId = ''
      this.obj.type1 = ''
      this.obj.type2 = ''
      this.obj.type3 = ''
      this.obj = Object.assign({}, this.obj)
      this.tempObj = Object.assign({}, this.obj)
      if (this.systemType === STENCIL_TYPE[0].id) {
        this.obj.isExpiryDate = 0
        this.obj.isManageAlone = 0
      }
      this.tempSchema = this.schema
      if (this.organization) {
        this._queryDictModel(this.organization)
      }
    } else {
      this.breadCrumbName = '编辑' + this.customType
      this.schemaInfo.splice(0, 1)
      if (getFirstRoutePath(this.backListRoute, 1) !== 'warehouse') {
        this.schemaInfo.push({
          name: 'classifyName',
          label: '类型',
          comp: 'readonlyitem',
          span: 24
        })
      } else if (getFirstRoutePath(this.backListRoute, 1) === 'warehouse' && (this.systemType === STENCIL_TYPE[0].id || this.systemType === STENCIL_TYPE[8].id || this.systemType === STENCIL_TYPE[2].id)) {
        this.schemaInfo.push({
          name: 'classifyName',
          label: '类型',
          comp: 'readonlyitem',
          span: 24
        })
      }
      this.obj.classifyId = ''
      this.getDetail()
    }
  },
  methods: {
    async handelChange (v) {
      this.materialDictSkuId = ''
      this.schema = this.tempSchema
      this.tempTableData = []
      if (v) {
        this.materialDictSkuId = v.id
        this._dataNewRendering({ result: this.cacheResult })
        this.obj = readonlyObjItem(this.obj, v.materialDictPropertys, true)
        this._filterSchema(this.spuObj)
        let materialArr = await this.customApi.getthismaterialinfo(this.materialDictSkuId).then()
        if (materialArr && materialArr.flag) {
          let resultList = JSON.parse(JSON.stringify(materialArr))
          if ((this.obj.type1 === DRUGTYPE || this.obj.type1 === MATERIALTYPE || this.obj.type1 === BLOOD_CLASSIFYID) && resultList.materialDictSkus && resultList.materialDictSkus.length) {
            resultList.materialDictSkus.forEach(item => {
              item.ifService = ''
              item.price = ''
            })
          }
          // 全局药理分类字典
          if (resultList.categoryMaterialDictRelations) {
            this.$ever.getFieldFromSchema(this.schema, 'categoryMaterialDictRelations').props.valueArray = resultList.categoryMaterialDictRelations
            this.obj.categoryMaterialDictRelations = resultList.categoryMaterialDictRelations
          }
          this.tableData = resultList.materialDictSkus ? resultList.materialDictSkus : []
        }
      } else {
        this.queryVal = ''
        this.tableData = []
        this._dataNewRendering({ result: this.cacheResult, flag: true })
      }
    },
    remoteMethod (query) {
      let codeQuery = []
      // 判断是否是血液
      if (this.obj.classifyId === BLOOD_CLASSIFYID) {
        codeQuery = GENERAL_CODE
        this.queryPlaceholder = '血液品种 / ABO血型 / RH(D)血型'
      } else {
        codeQuery = MATERILA_PINYIN_CODE.concat(SEARCH_CODE)
        this.queryPlaceholder = '通用名 / 商品名 / 批准文号'
      }
      let params = {
        classifyId: this.obj.classifyId,
        codesMatchValues: [{ codes: codeQuery, value: query }],
        offset: 0,
        pagesize: 20
      }
      templetApi.materialList(params).then(result => {
        if (result) {
          result.forEach(item => {
            if (this.obj.classifyId === BLOOD_CLASSIFYID) {
              item.name = this._resetMaterialName({ rows: item.materialDictPropertys, code: GENERAL_CODE, attributeValue: 'materialDictPropertyValues', isInfo: false })
            } else {
              item.name = this._resetMaterialName({ rows: item.materialDictPropertys, code: [MATERILA_PINYIN_CODE[0]] })
            }
          })
          this.options = result
        } else {
          this.options = []
        }
      })
    },
    handleSelectionChange (tab) {
      this.obj.materialDictSku = tab
    },
    getDetail () {
      let statedit = this.statusEdit === 'edit' ? 'edit' : ''
      if (getFirstRoutePath(this.backListRoute, 1) === 'warehouse' && this.systemType === STENCIL_TYPE[3].id) {
        this.customApi.getById().then(result => {
          if (result) {
            this.objId = result.id
            this._dataRendering(result)
          }
        })
      } else {
        this.customApi.getById(this.objId, statedit).then(result => {
          if (result && (result.flag || result.id)) {
            this._dataRendering(result)
          }
        })
      }
    },
    _dataRendering (results) {
      let result = results[this.propertyParentName] || results
      // 缓存update数据
      this.cacheResult = result
      // 更新标题名称
      let json = { rows: this.propertyName ? result[this.propertyName] : result.materialPropertys }
      // titleCode 外部传入需要标题名称code
      if (this.titleCode) json.code = this.titleCode
      this.breadCrumbName = this._resetMaterialName(json)
      let renderSpu = result.templetPropertiesForSpu || result.templetProperties
      // 除物资其它必要项可修改
      let certainly
      this.systemType === STENCIL_TYPE[0].id ? certainly = true : certainly = false
      // 机构编辑部门or科室只能查看
      let SPU
      getFirstRoutePath(this.backListRoute, 1) === 'warehouse' && (this.systemType === STENCIL_TYPE[1].id || this.systemType === STENCIL_TYPE[4].id) ? SPU = createdSchemaAndObjectValue(result.keys, renderSpu, { disabled: true }) : SPU = createdSchemaAndObjectValue(result.keysForSpu || result.keys, renderSpu, { certainly })
      // 存储spu propertyCode
      this.spuObj = SPU.obj
      if (this.systemType === STENCIL_TYPE[0].id) {
        this.statusEdit === 'edit' ? this.obj = readonlyObjItem(SPU.obj, result.materialPropertys, true) : this.obj = readonlyObjItem(SPU.obj, result.materialPropertys, true)
        // 注释处理缓存代码
        // this._getResultPropertysList(result.materialPropertys)
      } else {
        this.statusEdit === 'edit' ? this.obj = readonlyObjItem(SPU.obj, result[this.propertyName], true, this.propertyNameValues) : this.obj = readonlyObjItem(SPU.obj, result[this.propertyName], true)
        // 注释处理缓存代码
        // this._getResultPropertysList(result[this.propertyName], false, this.propertyNameValues)
      }
      this.rules = Object.assign(SPU.rules, rulesInfo)
      this.schema = schemaInfo.concat(SPU.schema)
      if (this.systemType === STENCIL_TYPE[0].id) this._customSchema({ schema: this.schema, obj: this.obj, dataRes: result })
      this.obj.code = result.code
      this.obj.classifyName = setUpClassifyName(result.classifyVoObject)
      this.obj.classifyId = result.classifyId
      this.resultObj = result
      // 机构关联关系部门&科室取值
      if (getFirstRoutePath(this.backListRoute, 1) === 'warehouse' && (this.systemType === STENCIL_TYPE[1].id || this.systemType === STENCIL_TYPE[4].id)) {
        this.cacheRelation = results[this.relationName] ? results[this.relationName] : []
      } else {
        // 机构编辑关联关系部门&科室无须判断必要项是否为空
        this._filterSchema(this.spuObj)
        this.cacheRelation = result[this.relationName] ? result[this.relationName] : []
      }
      this.saveBtn = true
      // 机构关联关系需要往父级组件通信   目前临时解决方案
      this.$emit('typeSelectChange', { name: results.classifyId, code: results.code || '', data: this.cacheRelation, parentData: result })
    },
    // 选择类型
    _queryDictModel (val) {
      templetApi.queryDictModel({ classifyId: val, systemType: this.systemType }).then(result => {
        if (result && result.flag) {
          this.cacheResult = result
          // this._dataNewRendering({ result, flag: true })
          this._dataNewRendering2({ result, flag: true })
          // this._dataNewRendering3({ result, flag: true })
        } else {
          this.saveBtn = false
        }
      })
    },
    _dataNewRendering3 ({ result, flag, change }) {
      let renderSpu = result.templetPropertiesForSpu || result.templetDictPropertiesForSpu || result.templetProperties
      this.groupSchema.map(item => {
        console.log(item)
        if (Array.isArray(item.keys)) {
          item.schema = createdSchemaAndObjectValue(item.keys || result.keys, renderSpu).schema
        }
      })
      console.log(this.groupSchema)
    },
    _dataNewRendering2 ({ result, flag, change }) {
      this.fixedSchemaByCodes(result)
    },
    _dataNewRendering ({ result, flag, change }) {
      let bedIndex = -1
      if (this.slotsData && result.classifyId && this.slotsData.BED_CLASSIFYID) bedIndex = _findIndex(this.slotsData.BED_CLASSIFYID, result.classifyId)
      let renderSpu = result.templetPropertiesForSpu || result.templetDictPropertiesForSpu || result.templetProperties
      let SPU1
      let SPU2
      let SPU3
      let SPU4
      let SPU5
      // 基础信息（ZDY000001开头需要后期替换）
      let tempSpu1 = ['SXX000003', 'SXX000004', 'SXX000005', 'SXX000006', 'SXX000001', 'SXX000009', 'SXX000007', 'ZDY000001']
      // 标志信息
      let tempSpu2 = ['SXX000014', 'ZDY000001', 'SXX000012', 'ZDY000001', 'ZDY000001', 'ZDY000001']
      // 财务信息
      let tempSpu3 = ['ZDY000001', 'ZDY000001', 'ZDY000001', 'ZDY000001', 'ZDY000001', 'ZDY000001']
      // 医嘱信息
      let tempSpu4 = ['ZDY000001']
      let tempSpu5 = ['SXX000047', 'SXX000053', 'ZDY000001', 'ZDY000001', 'ZDY000001', 'ZDY000001']
      if (flag) {
        // SPU = createdSchemaAndObjectValue(result.keysForSpu || result.keys, renderSpu)
        SPU1 = createdSchemaAndObjectValue(tempSpu1 || result.keys, renderSpu)
        SPU2 = createdSchemaAndObjectValue(tempSpu2 || result.keys, renderSpu)
        SPU3 = createdSchemaAndObjectValue(tempSpu3 || result.keys, renderSpu)
        SPU4 = createdSchemaAndObjectValue(tempSpu4 || result.keys, renderSpu)
        SPU5 = createdSchemaAndObjectValue(tempSpu5 || result.keys, renderSpu)
      } else {
        // SPU = createdSchemaAndObjectValue(result.keysForSpu || result.keys, renderSpu, { certainly: true })
        SPU1 = createdSchemaAndObjectValue(tempSpu1 || result.keys, renderSpu, { certainly: true })
        SPU2 = createdSchemaAndObjectValue(tempSpu2 || result.keys, renderSpu, { certainly: true })
        SPU3 = createdSchemaAndObjectValue(tempSpu3 || result.keys, renderSpu, { certainly: true })
        SPU4 = createdSchemaAndObjectValue(tempSpu4 || result.keys, renderSpu, { certainly: true })
        SPU5 = createdSchemaAndObjectValue(tempSpu5 || result.keys, renderSpu, { certainly: true })
      }
      // 存储spu propertyCode
      this.spuObj = SPU1.obj
      let index = this.schema.findIndex(item => {
        return item.name === 'basicInfo'
      })
      if (index > 0) this.schema.splice(index, 1)
      this.schema.push({
        name: 'basicInfo',
        label: '',
        comp: 'custom',
        span: 24
      })
      this.schema = this.schema.concat(SPU1.schema)
      this.schema.push({
        name: 'signInfo',
        label: '',
        comp: 'custom',
        span: 24
      })
      this.schema = this.schema.concat(SPU2.schema).concat(this.parentSchema || [])
      this.schema.push({
        name: 'financeInfo',
        label: '',
        comp: 'custom',
        span: 24
      })
      this.schema = this.schema.concat(SPU3.schema).concat(this.parentSchema || [])
      this.schema.push({
        name: 'doctorAdvice',
        label: '',
        comp: 'custom',
        span: 24
      })
      this.schema = this.schema.concat(SPU4.schema).concat(this.parentSchema || [])
      this.schema.push({
        name: 'pictureDescribe',
        label: '',
        comp: 'custom',
        span: 12,
        attrs: {
          class: 'doctorAdvice'
        }
      })
      this.schema = this.schema.concat(SPU5.schema).concat(this.parentSchema || [])
      this.schema.push({
        name: 'doctorWords',
        label: '医嘱',
        comp: 'custom',
        span: 16,
        attrs: {
          class: 'doctorWords'
        }
      })
      // 添加管理方式
      if (this.systemType === STENCIL_TYPE[0].id) {
        if (!change) this._customSchema({ schema: this.schema, obj: this.obj, dataRes: this.obj })
        // this.schema.push({ name: 'managementModel', label: '管理方式', comp: 'custom', span: 24 })
        this.schema.push({ name: 'skuInfo', label: '', comp: 'custom', span: 24 })
        this.obj.managementModel = 1
        this.obj.isNum = 1
        this.obj.isExpiryDate = 0
        this.obj.isManageAlone = 0
        if (result.keysForSku && result.keysForSku.length) {
          this.skuTableData = this._tableHeaders(result.keysForSku, result.templetPropertiesForSku || result.templetDictPropertiesForSku, flag)
          this.thisKeysForSku = result.keysForSku
          let tempInit = {}
          for (let i = 0; i < this.skuTableData.length; i++) {
            let item = this.skuTableData[i]
            // sku去重判断增加属性当前index,和code
            CHECK_CODE.forEach((checkItem, i) => {
              if (item.prop === checkItem.code) {
                item.checkIndex = i
                item.checkCode = checkItem.code
              }
            })
            tempInit[item.prop] = item.value
          }
          this.tempTableData = [tempInit]
        }
        // this.remoteMethod('')
        if (result.length > 1) {
          this.tableData = result
          this.tableData.splice(0, 1)
          // this._getResultPropertysList(this.tableData)
        }
      }
      this.obj = Object.assign({}, this.obj, SPU1.obj, SPU2.obj, SPU3.obj, SPU4.obj, SPU5.obj)
      this.rules = Object.assign(SPU1.rules, SPU2.rules, SPU3.rules, SPU4.rules, SPU5.rules, rulesInfo)
      this.resultObj = Object.assign({}, result, this.obj)
      this.saveBtn = true
      // 机构关联关系需要往父级组件通信   目前临时解决方案
      if (bedIndex > -1) this.$emit('typeSelectChange', { name: result.classifyId, code: result.code || '' })
    },
    // 根据固定模版查找SPU+SKU 返回schema数据
    fixedSchemaByCodes (resultObj) {
      this.resultObj = Object.assign({}, resultObj)
      // 拼合 后台数据返回properties
      this.propertiesSpuSku = resultObj.templetPropertiesForSpu.concat(resultObj.templetPropertiesForSku)
      this.arraySpu = resultObj.keysForSpu
      this.arraySku = resultObj.keysForSku
      // 拼合 基础信息/标志信息/财务信息/医嘱信息
      this.fixedCodeArr = [] // 获取左侧所有code集合（用来过滤后台返回的SPU+SKU，未匹配到的均为右侧form表单schema）
      let tempObj = {} // 待拼合数据对象，格式为：标题 + 基础 + 标题 + 标志 + 标题 + 财务 + 标题 + 医嘱
      for (let key in MATERIALFORM) {
        this.fixedCodeArr = this.fixedCodeArr.concat(MATERIALFORM[key].INFO)
        tempObj[key] = createdSchemaAndObjectValue(MATERIALFORM[key].INFO, this.propertiesSpuSku)
      }
      // 拼合左侧schema对象
      this.fixedSchema = []
      for (let key in MATERIALFORM) {
        // 添加标题
        if (MATERIALFORM[key].TITLE) {
          this.fixedSchema.push({
            name: MATERIALFORM[key].TITLE.name,
            comp: 'custom',
            span: MATERIALFORM[key].TITLE.span || 24,
            attrs: MATERIALFORM[key].TITLE.attrs || {}
          })
        }
        // 添加内容
        this.fixedSchema = this.fixedSchema.concat(tempObj[key].schema)
        this.fixedObj = Object.assign({}, this.fixedObj, tempObj[key].obj)
        this.fixedRules = Object.assign({}, this.fixedRules, tempObj[key].rules)
        // 添加后补内容
        if (MATERIALFORM[key].SUB) {
          this.fixedSchema.push({
            name: MATERIALFORM[key].SUB.name,
            comp: 'custom',
            span: MATERIALFORM[key].SUB.span || 24,
            attrs: MATERIALFORM[key].SUB.attrs || {}
          })
        }
      }
      // 医嘱剂量单位设置宽度
      this.fixedSchema.forEach(v => {
        if (v.name === 'SXX000011') {
          v.span = 8
          v.props.clearable = false
        }
      })
      this.objLeft = Object.assign({}, this.fixedObj)
      this.rulesLeft = Object.assign({}, this.fixedRules)
      this.objLeft['SXX000011'] = 'f49cff24-4c96-4be7-9f79-889b423ae975' // 默认剂量单位 - 成分单位
    },
    // 非固定schema
    dynamicSchemaByCodes (id) {
      // 默认成份单位，id：f49cff24-4c96-4be7-9f79-889b423ae975
      let medicineOption = createdSchemaAndObjectValue(MEDICINEOPTIONS[id || 'f49cff24-4c96-4be7-9f79-889b423ae975'], this.propertiesSpuSku)
      medicineOption.schema.forEach((v, i) => {
        v.span = 8 // 设置一行三个
        if (i === medicineOption.schema.length - 1) v.span = 24 // 最后一个占满一行
      })
      this.schemaLeft = this.fixedSchema.concat(medicineOption.schema)
      this.objLeft = Object.assign({}, this.objLeft, medicineOption.obj)
      Object.assign(this.rulesLeft, medicineOption.rules)
      // 规格表格
      this.specSchemaData = createdSchemaAndObjectValue(this.specSchemaArr, this.propertiesSpuSku)
      // 拼合右侧Schema
      this.leftCodeArr = this.fixedCodeArr.concat(MEDICINEOPTIONS[id || 'f49cff24-4c96-4be7-9f79-889b423ae975'])
      let tempCodeArrRight = this.arraySpu.filter(v => {
        return !this.leftCodeArr.includes(v)
      })
      this.schemaRight = createdSchemaAndObjectValue(tempCodeArrRight, this.propertiesSpuSku).schema
      this.schemaRight.forEach(v => {
        v.span = 24 // 设置占满一行
      })
      this.objRight = createdSchemaAndObjectValue(tempCodeArrRight, this.propertiesSpuSku).obj
      this.rulesRight = createdSchemaAndObjectValue(tempCodeArrRight, this.propertiesSpuSku).rules
      this.saveBtn = true
    },
    // 添加规格
    addSpecData: debounce(function () {
      this.specTableData.push(JSON.parse(JSON.stringify(this.specRowData)))
    }),
    // 删除规格
    removeSpecData: debounce(function (index) {
      this.specTableData.splice(index, 1)
    }),
    // 显示规格单位
    showLabel (code, id) {
      let tempSchema = this.schemaLeft.filter(v => {
        return v.name === code
      })
      let tempResult = tempSchema[0].props.initOptions.filter(v => {
        return v.id === id
      })
      if (tempResult[0]) {
        return tempResult[0].name
      } else {
        return ''
      }
    },
    // 聚合待提交的数据
    mergeFormData () {
      // 获取form表单数据
      let allFormData = Object.assign({}, this.objLeft, this.objRight)
      // ===========处理SPU=============
      let paramsSpu = {}
      let materialSpu = {}
      paramsSpu.materialDictSpu = {}
      Object.assign(materialSpu, {
        materialDictSkus: this.objLeft.materialDictSku,
        materialDictPropertys: [],
        classifyId: this.obj.classifyId,
        splitflag: this.specExtraPrice ? 1 : 0,
        price: this.specExtraPrice ? Number(this.specExtraRowData.extraPrice) : ''
      })
      // 搜索的物资
      if (this.materialDictSkuId && !this.objId) {
        Object.assign(materialSpu, { id: this.materialDictSkuId })
      }
      for (let key in allFormData) {
        let val = allFormData[key]
        let listParams = {}
        if (this._findPropertyType(key).propertyType === GLOBAL_ATTR[2].id || this._findPropertyType(key).propertyType === GLOBAL_ATTR[3].id) { // 单选或者多选
          if (val.constructor !== Array) {
            listParams.materialDictPropertyValues = this._findSingle(val, key, true)
          } else {
            listParams.materialDictPropertyValues = this._findMultiple(val, key, true)
          }
        } else { // 普通文本
          listParams.propertyValue = val
        }
        if ((key === CUSTOM_MATERIAL_CODE_DICT[0].name || key === CUSTOM_MATERIAL_CODE[0].name) && listParams.propertyValue.length) { // 处理药理分类
          listParams.propertyValue.forEach(item => {
            item.idName && delete item.idName
            item.idOptions && delete item.idOptions
            item.pharmacologyCategoryObject && delete item.pharmacologyCategoryObject
            item.idLists && delete item.idLists
          })
          materialSpu.categoryMaterialDictRelations = listParams.propertyValue
        } else {
          if (this._findPropertyType(key).propertyCode === key) {
            materialSpu['materialDictPropertys'].push(Object.assign({
              propertyCode: key,
              propertyType: this._findPropertyType(key).propertyType,
              propertyRelationCode: this._findPropertyType(key).propertyRelationCode,
              type: PROPERTY_TYPE_FOR_TEMPLET[0].id
            }, listParams))
          }
        }
      }
      paramsSpu.materialDictSpu = materialSpu
      paramsSpu.systemType = this.systemType
      let params = JSON.parse(JSON.stringify(paramsSpu))
      params.materialDictSpu.materialDictSkus = []
      // ===========处理SKU=============
      this.specTableData.forEach(data => {
        let paramsSku = {
          materialDictPropertys: []
        }
        for (let keys in data) {
          let val = data[keys]
          let listParams = {}
          if (!val) {
            if (this._findPropertySkuType(keys).propertyType === GLOBAL_ATTR[2].id || this._findPropertySkuType(keys).propertyType === GLOBAL_ATTR[3].id) { // 单选或者多选
              listParams.materialDictPropertyValues = []
            } else {
              listParams.propertyValue = ''
            }
          } else {
            if (val.constructor !== Array) {
              if (this._findPropertySkuType(keys).propertyType === GLOBAL_ATTR[2].id) {
                listParams.materialDictPropertyValues = this._findSingle(val, keys)
              } else {
                listParams.propertyValue = val
              }
            } else {
              listParams.materialDictPropertyValues = this._findMultiple(val, keys)
            }
          }
          paramsSku.materialDictPropertys.push(Object.assign({
            propertyCode: keys,
            propertyType: this._findPropertySkuType(keys).propertyType,
            propertyRelationCode: this._findPropertySkuType(keys).propertyRelationCode,
            type: PROPERTY_TYPE_FOR_TEMPLET[1].id
          }, listParams))
        }
        params.materialDictSpu.materialDictSkus.push(paramsSku)
      })
      // ===========提交数据=============
      this.submitDisableBtn = true
      templetApi.createOrUpdate(params).then(result => {
        if (result) {
          this.submitDisableBtn = false
          this.$messageTips(this, 'success', '创建成功', ' ')
          this.$router.push(this.backListRoute)
        }
      })
    },
    // 提交
    submitForm: debounce(function () {
      if (!this.obj.classifyId && !this.organization) {
        return this.$messageTips(this, 'warning', '请先选择好物资类型', ' ')
      }
      // ============================================================
      // // 获取所有表单校验结果
      // const aValid = []
      // this.$refs.form.map(item => {
      //   item.$refs.form.validate(valid => aValid.push(valid))
      // })
      // if (aValid.every(flag => flag === true)) {
      //   // todo:校验通过，执行后续操作
      //   console.log(MECHANISM_CODE)
      // }
      // ============================================================
      this.$refs.form.$refs.form.validate(valid => { // 校验顶部类型
        if (valid) {
          this.$refs.formLeft.$refs.form.validate(validLeft => { // 校验左侧form
            if (validLeft) {
              if (this.specTableData.length === 0) {
                return this.$messageTips(this, 'warning', '请先添加规格', ' ')
              }
              if (this.specTableData.length) {
                let validSpec = true
                this.specTableData.forEach(item => {
                  for (let key in item) {
                    if (!item[key]) {
                      validSpec = false
                    }
                  }
                })
                if (!validSpec) return this.$messageTips(this, 'warning', '请先添加规格', ' ')
              }
              this.$refs.formRight.$refs.form.validate(validRight => { // 校验右侧form
                if (validLeft) {
                  this.mergeFormData()
                  console.log(MECHANISM_CODE)
                } else {
                  this.$messageTips(this, 'warning', '必填字段未填写，请检查填写后再保存', ' ')
                }
              })
            } else {
              this.$messageTips(this, 'warning', '必填字段未填写，请检查填写后再保存', ' ')
            }
          })
          // if (this.obj.materialDictSku && this.obj.materialDictSku.length) {
          //   this.obj.materialDictSku.forEach(item => {
          //     if (!item.ifService) {
          //       return this.$messageTips(this, 'warning', '已选规格中有医嘱项目必填，请核对后再保存', ' ')
          //     }
          //     if (!item.price && !this.objId && item.ifService && item.ifService === yesno[1].id) {
          //       return this.$messageTips(this, 'warning', '已选规格中有基础价必填，请核对后再保存', ' ')
          //     }
          //   })
          // }
          // let params = {}
          // // 关联关系表单验证
          // let slotFlag = true
          // let slotArr = {}
          // if (this.relationName) {
          //   params[this.relationName] = []
          //   if (!this.slots) {
          //     slotFlag = false
          //     this.slotsData.forEach(formItem => {
          //       this.$refs[formItem.formSlot][0].$refs.form.validate(validSlot => {
          //         if (validSlot) {
          //           slotFlag = true
          //           if (this.relationType) {
          //             for (let slotkye in formItem.objSlot) {
          //               slotArr[slotkye] = this._relationFilterData({ key: slotkye, data: formItem.objSlot[slotkye] })
          //               params[this.relationName] = [...params[this.relationName], ...slotArr[slotkye]]
          //             }
          //           }
          //         }
          //       })
          //     })
          //   } else {
          //     if (!this.slotsData.hospitalBedRelationList.length) return this.$messageTips(this, 'warning', '请添加床号、床态、关联病区等信息')
          //     // 床位关联关系
          //     this.slotsData.hospitalBedRelationList.forEach((bedItem, index) => {
          //       if (this.slotsData.hospitalBedRelationList.length > 1 && index > 0) {
          //         if (!bedItem.bedNum && !bedItem.relationId && !bedItem.ifAvailable) {
          //           slotFlag = true
          //           params[this.relationName] = [...this.slotsData.hospitalBedRelationList]
          //           params[this.relationName].splice(index, 1)
          //         } else {
          //           if (!bedItem.bedNum || !bedItem.relationId || !bedItem.ifAvailable) {
          //             slotFlag = false
          //             return this.$messageTips(this, 'warning', '当前关联关系中必填项录入，请录入后再保存', ' ')
          //           } else {
          //             slotFlag = true
          //             params[this.relationName] = [...this.slotsData.hospitalBedRelationList]
          //           }
          //         }
          //       } else {
          //         if (!bedItem.bedNum || !bedItem.relationId || !bedItem.ifAvailable) {
          //           slotFlag = false
          //           return this.$messageTips(this, 'warning', '当前关联关系中必填项录入，请录入后再保存', ' ')
          //         } else {
          //           slotFlag = true
          //           params[this.relationName] = [...this.slotsData.hospitalBedRelationList]
          //         }
          //       }
          //     })
          //   }
          //   if (this.cacheRelation.length && params[this.relationName].length) {
          //     this.cacheRelation.forEach(rItem => {
          //       params[this.relationName].forEach((sItem, i) => {
          //         if (this.systemType === STENCIL_TYPE[8].id) {
          //           if (sItem.id && rItem.id === sItem.id) Object.assign(rItem, sItem)
          //         } else {
          //           if (sItem.relationId && rItem.relationId === sItem.relationId) Object.assign(rItem, sItem)
          //         }
          //       })
          //     })
          //   }
          //   params.serviceId = this.slotsData.serviceId
          // }
          // // 床位保存校验
          // if (this.isSubmitForm && this.systemType === STENCIL_TYPE[8].id) return
          // // 关联关系必填校验
          // if (this.relationName && !slotFlag) return
          // let materialSpu
          // if (this.systemType === STENCIL_TYPE[0].id) {
          //   materialSpu = this.statusEdit ? params.materialSpu = {} : params.materialDictSpu = {}
          //   if (this.statusEdit === 'edit') {
          //     Object.assign(materialSpu, {
          //       materialPropertys: [],
          //       source: this.resultObj.source,
          //       sourceId: this.resultObj.sourceId,
          //       classifyId: this.obj.classifyId,
          //       templetId: this.resultObj.templetId || this.resultObj.templetDictId,
          //       isNum: this.resultObj.isNum,
          //       isExpiryDate: this.resultObj.isExpiryDate,
          //       isManageAlone: this.resultObj.isManageAlone
          //     })
          //   } else {
          //     Object.assign(materialSpu, {
          //       materialDictSkus: this.obj.materialDictSku,
          //       materialDictPropertys: [],
          //       classifyId: this.obj.classifyId,
          //       templetId: this.resultObj.templetId || this.resultObj.templetDictId,
          //       isNum: this.obj.isNum,
          //       isExpiryDate: this.obj.isExpiryDate,
          //       isManageAlone: this.obj.isManageAlone
          //     })
          //   }
          // } else {
          //   Object.assign(params, { templetId: this.resultObj.templetId || this.resultObj.templetDictId, classifyId: this.obj.classifyId || this.resultObj.classifyId || this.organization })
          //   materialSpu = params[this.propertyName] = []
          //   materialSpu[this.propertyNameValues] = []
          // }
          // if (this.materialDictSkuId && !this.objId) {
          //   Object.assign(materialSpu, { id: this.materialDictSkuId })
          // }
          // if (this.objId) {
          //   if (this.systemType !== STENCIL_TYPE[0].id) {
          //     Object.assign(params, { templetId: this.resultObj.templetId || this.resultObj.templetDictId, classifyId: this.obj.classifyId || this.resultObj.classifyId || this.organization, createBy: this.resultObj.createBy, createTime: this.resultObj.createTime, isDelete: this.resultObj.isDelete, sourceId: this.resultObj.sourceId, source: this.resultObj.source, statue: this.resultObj.statue })
          //     if (this.systemType !== STENCIL_TYPE[1].id && this.systemType !== STENCIL_TYPE[3].id && this.systemType !== STENCIL_TYPE[6].id) {
          //       Object.assign(params, { clinicId: this.resultObj.clinicId })
          //     }
          //     if (this.systemType === STENCIL_TYPE[3].id) {
          //       Object.assign(params, { code: this.resultObj.code })
          //     }
          //   }
          //   params.classifyId = this.resultObj.classifyId
          //   params.id = this.objId
          //   params.code = this.resultObj.code
          //   if (materialSpu) {
          //     materialSpu.classifyId = this.resultObj.classifyId
          //     materialSpu.id = this.resultObj.id
          //     materialSpu.code = this.resultObj.code
          //   }
          // }
          // for (let key in this.obj) {
          //   let array = ['classifyId', 'type1', 'type2', 'type3', 'code', 'classifyVoObject', 'templetPropertiesForSpu', 'keysForSpu'].concat(this.parentObj || [])
          //   if (this.systemType === STENCIL_TYPE[0].id && !this.objId) {
          //     array.push('managementModel', 'templetPropertiesForSku', 'keysForSku', 'materialDictSku', 'isNum', 'isExpiryDate', 'isManageAlone', 'queryModel')
          //   }
          //   if (this.objectFilter(array, key)) {
          //     let val = this.obj[key]
          //     let listParams = {}
          //     if (this._findPropertyType(key).propertyType === GLOBAL_ATTR[2].id || this._findPropertyType(key).propertyType === GLOBAL_ATTR[3].id) {
          //       if (val.constructor !== Array) {
          //         listParams[this.propertyNameValues] = {}
          //         if (this.systemType === STENCIL_TYPE[0].id) {
          //           this.objId ? listParams.materialPropertyValues = this._findSingle(val, key, true) : listParams.materialDictPropertyValues = this._findSingle(val, key, true)
          //         } else {
          //           listParams[this.propertyNameValues] = this._findSingle(val, key, true)
          //         }
          //       } else {
          //         if (this.systemType === STENCIL_TYPE[0].id) {
          //           this.objId ? listParams.materialPropertyValues = this._findMultiple(val, key, true) : listParams.materialDictPropertyValues = this._findMultiple(val, key, true)
          //         } else {
          //           listParams[this.propertyNameValues] = this._findMultiple(val, key, true)
          //         }
          //       }
          //     } else {
          //       listParams.propertyValue = val
          //       if (this.systemType === STENCIL_TYPE[3].id && key === MECHANISM_CODE[0]) {
          //         params.name = val
          //       }
          //     }
          //     if (this.systemType === STENCIL_TYPE[0].id) {
          //       let isDictOrNotDict = ''
          //       this.objId ? isDictOrNotDict = 'materialPropertys' : isDictOrNotDict = 'materialDictPropertys'
          //       if ((key === CUSTOM_MATERIAL_CODE_DICT[0].name || key === CUSTOM_MATERIAL_CODE[0].name) && listParams.propertyValue.length) {
          //         listParams.propertyValue.forEach(item => {
          //           item.idName && delete item.idName
          //           item.idOptions && delete item.idOptions
          //           item.pharmacologyCategoryObject && delete item.pharmacologyCategoryObject
          //           item.idLists && delete item.idLists
          //         })
          //         this.objId ? materialSpu.categoryMaterialRelations = listParams.propertyValue : materialSpu.categoryMaterialDictRelations = listParams.propertyValue
          //       } else {
          //         if (this._findPropertyType(key).propertyCode === key) {
          //           materialSpu[isDictOrNotDict].push(Object.assign({
          //             propertyCode: key,
          //             propertyType: this._findPropertyType(key).propertyType,
          //             propertyRelationCode: this._findPropertyType(key).propertyRelationCode,
          //             type: PROPERTY_TYPE_FOR_TEMPLET[0].id
          //           }, listParams))
          //         }
          //       }
          //       if (this.objId && this.cacheResult.materialPropertys.length) {
          //         this.cacheResult.materialPropertys.forEach(item => {
          //           materialSpu[isDictOrNotDict].forEach(itemSpu => {
          //             if (item.propertyCode === itemSpu.propertyCode && item.propertyCode === key) Object.assign(itemSpu, item, listParams)
          //           })
          //         })
          //       }
          //     } else {
          //       if (this._findPropertyType(key).propertyCode === key) {
          //         materialSpu.push(Object.assign({
          //           propertyCode: key,
          //           propertyType: this._findPropertyType(key).propertyType,
          //           propertyRelationCode: this._findPropertyType(key).propertyRelationCode
          //         }, listParams))
          //       }
          //       if (this.objId && this.cacheResult[this.propertyName].length) {
          //         this.cacheResult[this.propertyName].forEach(item => {
          //           materialSpu.forEach(itemSpu => {
          //             if (item.propertyCode === itemSpu.propertyCode && item.propertyCode === key) Object.assign(itemSpu, item, listParams)
          //           })
          //         })
          //       }
          //     }
          //   }
          // }
          // params.systemType = this.systemType
          // if (this.statusEdit === 'edit') {
          //   if (this.systemType === STENCIL_TYPE[0].id) {
          //     this.submitDisableBtn = true
          //     this.customApi.spuUpdateOrCreate(params).then(result => {
          //       if (result) {
          //         this.submitDisableBtn = false
          //         this.$messageTips(this, 'success', '修改成功', ' ')
          //         this.$router.push(this.backListRoute)
          //       }
          //     })
          //   } else {
          //     // 机构科室&部门特殊处理接口
          //     if (getFirstRoutePath(this.backListRoute, 1) === 'warehouse' && (this.systemType === STENCIL_TYPE[1].id || this.systemType === STENCIL_TYPE[4].id)) {
          //       this.submitDisableBtn = true

          //       if (this.systemType === STENCIL_TYPE[1].id) {
          //         let ever = params.localDepartmentRelations.every(item => {
          //           return item.relationId === ''
          //         })
          //         if (ever) {
          //           params.localDepartmentRelations = []
          //         }
          //         params.localDepartmentRelations.map(it => {
          //           let index = params.localDepartmentRelations.findIndex(it => {
          //             return it.relationId === ''
          //           })
          //           if (index !== -1) params.localDepartmentRelations.splice(index, 1)
          //         })
          //       } else if (this.systemType === STENCIL_TYPE[4].id) {
          //         let ever = params.localSectionRelations.every(item => {
          //           return item.relationId === ''
          //         })
          //         if (ever) {
          //           params.localSectionRelations = []
          //         }
          //         params.localSectionRelations.map(it => {
          //           let index = params.localSectionRelations.findIndex(it => {
          //             return it.relationId === ''
          //           })
          //           if (index !== -1) params.localSectionRelations.splice(index, 1)
          //         })
          //       }
          //       this.customApi.updateRelation(params).then(result => {
          //         if (result) {
          //           this.submitDisableBtn = false
          //           this.$messageTips(this, 'success', '修改成功', ' ')
          //           this.$router.push(this.backListRoute)
          //         }
          //       })
          //     } else {
          //       this.submitDisableBtn = true
          //       this.customApi.createOrUpdate(params).then(result => {
          //         if (result) {
          //           this.submitDisableBtn = false
          //           this.$messageTips(this, 'success', '修改成功', ' ')
          //           this.$router.push(this.backListRoute)
          //         }
          //       })
          //     }
          //   }
          // } else {
          //   if (this.systemType === STENCIL_TYPE[0].id) {
          //     this.submitDisableBtn = true
          //     templetApi.createOrUpdate(params).then(result => {
          //       if (result) {
          //         this.submitDisableBtn = false
          //         this.$messageTips(this, 'success', '创建成功', ' ')
          //         this.$router.push(this.backListRoute)
          //       }
          //     })
          //   } else {
          //     this.submitDisableBtn = true
          //     this.customApi.createOrUpdate(params).then(result => {
          //       if (result) {
          //         this.submitDisableBtn = false
          //         this.$messageTips(this, 'success', '创建成功', ' ')
          //         // 机构人员创建成功需调整至查看页=》证书信息
          //         if (this.systemType === STENCIL_TYPE[2].id) {
          //           this.$router.push(`/warehouse/agencystaffsee/${result.id}?routeEdit=agencystaff&lookInfo=accountInfo`)
          //         } else {
          //           this.$router.push(this.backListRoute)
          //         }
          //       }
          //     })
          //   }
          // }
        } else {
          this.$messageTips(this, 'warning', '必填字段未填写，请检查填写后再保存', ' ')
        }
      })
    }),
    objectFilter (array, key) {
      let inow = true
      for (let i = 0; i < array.length; i++) {
        if (key === array[i]) {
          inow = false
        }
      }
      return inow
    },
    // 关联关系处理数据 stat
    _relationArr2Json (arr, type) {
      let resArr = []
      arr.length && arr.forEach(item => {
        // if (item.idName) {
        if (Array.isArray(item)) { // 关联科室处理（级联多选）
          resArr.push({ relationType: type, relationId: item[item.length - 1] })
        } else {
          resArr.push({ relationType: type, relationId: item })
        }
      })
      return resArr
    },
    _relationFilterData ({ key, data }) {
      let backRelation = []
      this.relationType.forEach(tItem => {
        if (key === tItem.relation) {
          if (Array.isArray(data)) {
            backRelation = this._relationArr2Json(data, tItem.id)
          } else {
            backRelation = [{ relationType: tItem.id, relationId: data }]
          }
        }
      })
      return backRelation
    },
    // end
    _findPropertyType (val) {
      let obj = this.resultObj.templetPropertiesForSpu || this.resultObj.templetDictPropertiesForSpu || this.resultObj.templetProperties
      for (let i = 0; i < obj.length; i++) {
        let item = obj[i]
        if (item.propertyCode === val) return item
      }
      return ''
    },
    _findPropertySkuType (val) {
      let obj = this.resultObj.templetPropertiesForSku || this.resultObj.templetDictPropertiesForSku
      for (let i = 0; i < obj.length; i++) {
        let item = obj[i]
        if (item.propertyCode === val) return item
      }
      return ''
    },
    _tableHeaders (keys, data, flag) {
      let arr = []
      for (let i = 0; i < keys.length; i++) {
        let item = keys[i]
        let { label, options, type, value, isMust, certainly, apiUrl, globalFlag } = this._findPropertValue(item, data, flag)
        arr.push({
          label,
          prop: item,
          options,
          type,
          value,
          isMust,
          certainly,
          apiUrl,
          globalFlag
        })
      }
      return arr
    },
    _findPropertValue (id, data, flag) {
      let index = data.findIndex(item => {
        return item.propertyCode === id
      })
      let label = data[index].propertyObject ? data[index].propertyObject.name : ''
      let options = []
      let isMust = data[index].isMust
      let certainly = data[index].certainly
      let propertyValues = data[index].templetPropertyValues || data[index].templetDictPropertyValues
      if (propertyValues) {
        for (let i = 0; i < propertyValues.length; i++) {
          let item = propertyValues[i]
          options.push({
            id: item.propertyValueId,
            name: item.propertyValueObject ? item.propertyValueObject.name : '未知'
          })
        }
      }
      let apiUrl = data[index].propertyObject && data[index].propertyObject.valueUrl
      let type = data[index].propertyType
      let value = ''
      let globalFlag = false
      if (!flag) globalFlag = data[index].certainly === PROPERTY_TYPE_FOR_TEMPLET_CERTAINLY[0].id
      if (type === GLOBAL_ATTR[3].id) value = []
      return { label, options, type, value, isMust, certainly, apiUrl, globalFlag }
    },
    _setColumnName (data, name) {
      let row = data.materialDictPropertys ? data.materialDictPropertys : data.materialPropertys
      let index = row.findIndex(item => {
        return item.propertyCode === name
      })
      let value = ''
      if (index > -1) {
        if ((row[index].propertyType === GLOBAL_ATTR[2].id || row[index].propertyType === GLOBAL_ATTR[3].id) && row[index].materialDictPropertyValues && row[index].materialDictPropertyValues.length) {
          let tempArr = []
          for (let i = 0; i < row[index].materialDictPropertyValues.length; i++) {
            let item = row[index].materialDictPropertyValues[i]
            tempArr.push((item.propertyValueObject && item.propertyValueObject.name) || '')
          }
          row[index].propertyType === GLOBAL_ATTR[2].id ? value = tempArr.join(' ') : value = tempArr.join(',')
        } else if (row[index].propertyType === GLOBAL_ATTR[5].id) {
          value = row[index].specialName ? row[index].specialName : row[index].propertyValue ? row[index].propertyValue : '-'
        } else if (row[index].propertyType === GLOBAL_ATTR[6].id) {
          value = row[index].propertyValue ? dateFormat(row[index].propertyValue, 'YYYY-MM-DD') : ''
        } else if (row[index].propertyType === GLOBAL_ATTR[10].id) {
          if (row[index].propertyValue) {
            let cityStr = JSON.parse(row[index].propertyValue)
            value += cityStr.citysName ? `${cityStr.citysName} ${cityStr.addressDetail}` : cityStr.addressDetail
          }
        } else {
          value = row[index].propertyValue
        }
      }
      return value
    },
    handleCancleSku (row) {
      for (let val in this.tempTableData[0]) {
        this.tempTableData[0][val] = ''
      }
      // 清空基础价格&医嘱项目
      this.medicalOrder = ''
      this.basePrice = ''
    },
    handleSaveSku (data) {
      let params = {
        code: '',
        materialDictSpuId: this.objId || '',
        materialDictPropertys: [],
        keysForSku: this.thisKeysForSku
      }
      // 判断医嘱项目&基础价是否为空
      if (!this.medicalOrder) return this.$messageTips(this, 'warning', '医嘱项目必填，请核对后再保存', ' ')
      if (!this.basePrice && this.medicalOrder === yesno[1].id) return this.$messageTips(this, 'warning', '基础价必填，请核对后再保存', ' ')
      // 遍历当前行字段「key」
      for (let keys in data) {
        for (let i = 0; i < this.skuTableData.length; i++) {
          let item = this.skuTableData[i]
          if (item.prop === keys && item.isMust && !data[keys]) {
            this.$messageTips(this, 'warning', item.label + '必填，请核对后再保存', ' ')
            return
          }
        }
        let val = data[keys]
        let listParams = {}
        if (!val) {
          if (this._findPropertySkuType(keys).propertyType === GLOBAL_ATTR[2].id || this._findPropertySkuType(keys).propertyType === GLOBAL_ATTR[3].id) {
            listParams.materialDictPropertyValues = []
          } else {
            listParams.propertyValue = ''
          }
        } else {
          if (val.constructor !== Array) {
            if (this._findPropertySkuType(keys).propertyType === GLOBAL_ATTR[2].id) {
              listParams.materialDictPropertyValues = this._findSingle(val, keys)
            } else {
              listParams.propertyValue = val
            }
          } else {
            listParams.materialDictPropertyValues = this._findMultiple(val, keys)
          }
        }
        params.materialDictPropertys.push(Object.assign({
          propertyCode: keys,
          propertyType: this._findPropertySkuType(keys).propertyType,
          propertyRelationCode: this._findPropertySkuType(keys).propertyRelationCode,
          type: PROPERTY_TYPE_FOR_TEMPLET[1].id
        }, listParams))
      }
      // 基础价格&医嘱项目
      Object.assign(params, { ifService: this.medicalOrder, price: this.basePrice, id: data.id })
      if (this.medicalOrder === yesno[0].id) params.price = ''
      !params.materialDictSpuId && delete params.materialDictSpuId
      if (this.tempTableData[0].index) {
        this.$set(this.tableData, this.tempTableData[0].index - 1, params)
      } else {
        this.tableData.unshift(params)
      }
      for (let val in this.tempTableData[0]) {
        this.tempTableData[0][val] = ''
      }
      // 清空基础价格&医嘱项目
      this.medicalOrder = ''
      this.basePrice = ''
    },
    handleEdit (data, index) {
      let tempInit = {}
      let row = data.materialDictPropertys ? data.materialDictPropertys : data.materialPropertys
      for (let i = 0; i < this.thisKeysForSku.length; i++) {
        let item = data.keysForSku && data.keysForSku[i].propertyCode ? data.keysForSku[i].propertyCode : this.thisKeysForSku[i]
        tempInit[item] = this._returnPropertyVal(item, row)
      }
      tempInit.id = data.id
      tempInit.index = index + 1
      tempInit.code = data.code
      this.medicalOrder = data.ifService
      this.basePrice = data.price
      this.tempTableData = [tempInit]
    },
    _setCertainly (name, itemValues) {
      if (itemValues.length) {
        itemValues.forEach(el => {
          if (el.propertyCode === name) return el.certainly
        })
      }
    },
    _returnPropertyVal (name, data) {
      for (let i = 0; i < data.length; i++) {
        let item = data[i]
        if (item.propertyCode === name) {
          if (item.propertyType === GLOBAL_ATTR[3].id || item.propertyType === GLOBAL_ATTR[2].id) {
            if (item.propertyType === GLOBAL_ATTR[2].id) {
              return item.materialDictPropertyValues[0].propertyValueId || []
            } else {
              return this._getSkuIdList(item.materialDictPropertyValues) || []
            }
          } else {
            return item.propertyValue
          }
        }
      }
      return ''
    },
    _filterSchema (cacheObj) {
      // 判断必要项是否为空
      if (Object.keys(cacheObj).length) {
        for (let key in cacheObj) {
          if (!this.obj[key] && this.$ever.getFieldFromSchema(this.schema, key) && this.$ever.getFieldFromSchema(this.schema, key).props) {
            this.$ever.getFieldFromSchema(this.schema, key).props.disabled = false
          }
        }
      }
    },
    // 自定义属性添加schema
    _customSchema ({ obj, schema, dataRes }) {
      let isSchemaFlag = false
      if ((dataRes && dataRes.classifyVoObject && dataRes.classifyVoObject.classifyObject.id === DRUGTYPE) || (dataRes && dataRes.type1 === DRUGTYPE)) isSchemaFlag = true
      if (isSchemaFlag) {
        if (!this.objId) {
          CUSTOM_MATERIAL_CODE_DICT[0].props = { disabled: false }
          schema.push(CUSTOM_MATERIAL_CODE_DICT[0])
          this.obj = JSON.parse(JSON.stringify(Object.assign(this.obj, { categoryMaterialDictRelations: dataRes.categoryMaterialDictRelations || [] })))
        } else {
          CUSTOM_MATERIAL_CODE[0].props = { disabled: false }
          schema.push(CUSTOM_MATERIAL_CODE[0])
          this.obj = JSON.parse(JSON.stringify(Object.assign(this.obj, { categoryMaterialRelations: dataRes.categoryMaterialRelations || [] })))
        }
      }
    },
    ...patch
  },
  watch: {
    'obj.type1' (val) {
      if (this.statusEdit !== 'edit') this.schema = this.tempSchema
      this.tempTableData = []
      this.saveBtn = false
    },
    'obj.type2' (val) {
      if (this.statusEdit !== 'edit') this.schema = this.tempSchema
      this.tempTableData = []
      this.saveBtn = false
    },
    'obj.classifyId' (val) {
      this.queryVal = ''
      if (!val) {
        this.saveBtn = false
        // 机构关联关系需要往父级组件通信   目前临时解决方案
        this.$emit('typeSelectChange', { name: val })
      }
      if (this.statusEdit !== 'edit') this.schema = this.tempSchema
      if (val && !this.objId) {
        // 清除搜索框规格数据
        this.tableData = []
        this._queryDictModel(val)
      }
    },
    // 除物资&床位&人员系统自动查询功能 start
    'options1' (val) {
      if (STENCIL_TYPE[0].id !== this.systemType && STENCIL_TYPE[8].id !== this.systemType && STENCIL_TYPE[2].id !== this.systemType && !this.organization && val.length) {
        this._watchCoding(val[0].id, 'obj', 1)
      }
    },
    'options2' (val) {
      if (STENCIL_TYPE[0].id !== this.systemType && STENCIL_TYPE[8].id !== this.systemType && STENCIL_TYPE[2].id !== this.systemType && !this.organization && val.length) {
        this._watchCoding(val[0].id, 'obj', 2)
      }
    },
    'options3' (val) {
      if (STENCIL_TYPE[0].id !== this.systemType && STENCIL_TYPE[8].id !== this.systemType && STENCIL_TYPE[2].id !== this.systemType && !this.organization && val.length) {
        this.obj.classifyId = val[0].id
      }
    },
    // end
    'objLeft.SXX000011' (val) { // 监控剂量单位
      if (val) {
        setTimeout(() => {
          this.dynamicSchemaByCodes(val)
        }, 0)
      }
    },
    'specExtraPrice' (val) { // 监控是否以制剂单位销售
      if (val) {
        this.specExtraRowData.extraPrice = Number((this.specTableData[0]['SXX190309000018h4dd'] / this.specTableData[0]['SXX000049']).toFixed(2))
        this.specExtraTableData.push(this.specExtraRowData)
      } else {
        this.specExtraTableData = []
      }
    }
  },
  components: {
    SkuTable
  }
}
</script>
<style lang="scss" scoped>
.content-box{
  float: left;
  border: 1px solid #ddd;
  border-top: none;
  background-color: #f5f5f5;
}
.tableContents{
  background-color: #f5f5f5;
  margin: 15px;
}
.right-content-box{
  width: 340px;
  margin: 75px 15px 0;
  float: right;
  height: 200px;
  background-color: aqua;
}
.query-model {
  background: #f4f4f4;
  width: calc(100% - 860px);
  border-radius: 4px;
  display: inline-block;
}
.primary-info {
  margin: 0;
  margin-left: -120px;
  margin-top: 10px;
  font-size: 14px!important;
}
.primary-title{
  border-left: 3px solid #1C7BEF;
  height: 14px;
  line-height: 14px;
  padding-left: 5px;
}
.doctor-tip{
  font-size: 12px;
  color: #000000;
  line-height: 14px;
  font-weight: normal;
  margin-left: 10px;
}
.hr.primary-info {
  margin: 0;
  margin-left: -180px;
  margin-top: 10px;
  margin-bottom: 30px;
  width: calc(100% + 180px);
}
.red {
  color: #e43;
}
.necessary {
  margin: 0 20px;
  min-height: 30px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 10px 20px;
  .title {
    line-height: 30px;
    height: 30px;
    font-size: 14px;
    color: #999;
    .require {
      color: #000;
    }
    span:last-child {
      padding-left: 30px;
    }
  }
  .content {
    ul.list {
      padding-bottom: 10px;
    }
    .el-tag {
      margin-bottom: 10px;
    }
  }
}
.necessary /deep/ .el-tag,
.list-item.fl /deep/ .el-tag {
  height: 30px;
  line-height: 28px;
  padding: 0;
  padding-right: 10px;
  span {
    display: inline-block;
    padding-left: 10px;
  }
}
.queryClass {
  min-width: 220px;
  display: inline-block;
  margin-right: 5px;
}
// ul, li {list-style-type: none; margin: 0; padding: 0}
.steps {
  padding: 30px 0;
  padding-bottom: 50px;
}
.steps-box ul li {
  display: inline;
  line-height: 24px;
  color: #999;
}
.steps-box ul li .line {
  background: #e9e9e9;
  height: 3px;
  display: inline-block;
  margin: 0 50px;
  margin-top: 10px;
  width: 50%;
}
.circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e9e9e9;
  display: inline-block;
  text-align: center;
  color: #bbb;
  margin-right: 10px;
}
.steps-box ul li.active {
  color: #1c7bef;
}
.steps-box ul li.active .circle,
.steps-box ul li.active .line {
  background: #1c7bef;
  color: #fff;
}
.titleBtn {
  transform: rotate(180deg);
  display: inline-block;
  margin-left: 5px;
  .iconfont {
    font-size: 12px;
  }
}
.titleBtn.active {
  transform: rotate(270deg);
  animation: animated 0.35s;
}
.titleBtn.visited {
  transform: rotate(180deg);
  animation: animated_back 0.35s;
}
.list-item.fl {
  margin-top: 10px;
  margin-right: 10px;
}
@keyframes animated {
  from {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(270deg);
  }
}
@keyframes animated_back {
  from {
    transform: rotate(270deg);
  }
  to {
    transform: rotate(180deg);
  }
}
.el-form--label-right {
  /deep/ .parent_label {
    border-top: 1px solid #ccc;
    margin-top: 30px;
    padding-top: 30px;
  }
}
.table-btn-ml_80 {
  margin-left: 44px;
  width: 100%;
  float: left;
  margin-top: 15px;
  .el-button{
    width: 180px;
    height: 36px;
  }
}
// .hr {width: calc(100% + 180px); margin-left: -180px;}
</style>
<style lang="scss" scoped>
  .layout_inner{
    padding: 15px;
    overflow: hidden;
  }
  .alg_c {
    height: 30px;
    margin: 0;
    font-size: 24px;
    line-height: 30px;
    padding-bottom: 15px;
  }
  .content-top {
    /deep/ .el-form-item {
      margin-bottom: 0;
      .el-form-item__content {
        display: flex;
        .query-model {
          flex: 1;
        }
      }
    }
  }
  .content-center {
    .content-center-left {
      background-color: #F5F5F5;
      padding-right: 45px;
      .test-data{
        font-size: 14px;
        color: #1C7BEF;
        text-align: right;
        line-height: 14px;
        cursor: pointer;
        float: right;
      }
      .showpicture{
        margin-left: -110px;
        font-size: 14px;
        color: #1C7BEF;
        span {
          cursor: pointer;
        }
      }
      .content-center-table {
        margin-left: 45px;
        border: 1px solid #BBB;
        > div {
          margin: 0;
        }
        .extra-table /deep/ .has-gutter, /deep/ .el-table__empty-block {
          display: none;
        }
        .add-specifications{
          padding: 10px 15px;
          background: #E5E5E5;
          .checked{
            margin-left: 30px;
            display: inline-block;
            font-size: 14px;
            color: #000;
            text-align: center;
            line-height: 14px;
          }
          .add-tips{
            font-size: 14px;
            color: #1C7BEF;
            line-height: 14px;
            cursor: pointer;
          }
        }
      }
      /deep/ .has-gutter > tr > th, /deep/ .has-gutter > tr > th > div, /deep/ .el-table__row, /deep/ .el-table__empty-block {
        background: #E5E5E5;
      }
      /deep/ .el-table__row td > div {
        display: flex;
        align-items: center;
        .unit-span {
          white-space: nowrap;
          margin-left: 5px;
        }
      }
      /deep/ .el-table__row .is-right > div {
        display: block;
      }
    }
    .content-center-left-bottom {
      padding-bottom: 15px;
    }
    .row-container {
      position: relative;
      .row-right {
        position: absolute;
        right: 0;
        height: 100%;
        overflow: auto;
      }
    }
    .content-center-right {
      margin-left: 15px;
      border-top: 1px solid #ddd;
      .right-title {
        font-size: 14px;
        font-weight: bold;
        padding: 15px 0;
        margin: 0;
      }
      .right-content {
        padding: 0 15px;
      }
    }
  }
</style>

