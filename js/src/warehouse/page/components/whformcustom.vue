<template>
  <div>
    <div class="layout_inner">
      <h2 class="alg_c">{{breadCrumbName}}</h2>
      <div class="content-box">
        <ever-form2
          label-width="180px"
          :schema="schema"
          v-model="obj"
          ref="form"
          :span="12"
          :rules="rules"
          @submit="submitForm()"
          :nosubmit="true"
        >
          <template
            slot="classifyId"
            v-if="STENCIL_TYPE[0].id == systemType || STENCIL_TYPE[8].id == systemType || STENCIL_TYPE[2].id == systemType"
          >
            <ever-select
              v-model="obj.type1"
              filterable
              placeholder="一级分类"
              :clearable="true"
              :options="options1"
              class="queryClass"
            ></ever-select>
            <ever-select
              v-if="obj.type1 && options2.length"
              v-model="obj.type2"
              filterable
              placeholder="二级分类"
              :clearable="true"
              :options="options2"
              class="queryClass"
            ></ever-select>
            <ever-select
              v-if="obj.type2 && options3.length"
              v-model="obj.type3"
              filterable
              placeholder="三级分类"
              :clearable="true"
              :options="options3"
              class="queryClass"
            ></ever-select>
          </template>
          <template slot="queryModel">
            <!--  v-if="obj.classifyId" -->
            <div class="query-model" v-if="obj.classifyId && saveBtn">
              <div>请先尝试搜索您需要的物资</div>
              <el-select
                v-model="queryVal"
                filterable
                clearable
                :default-first-option="true"
                style="width: 70%"
                remote
                @change="handelChange"
                value-key="id"
                :placeholder="queryPlaceholder"
                :remote-method="remoteMethod"
                :loading="loading"
              >
                <el-option
                  v-for="(option, i) in options"
                  :key="i"
                  :label="option.name"
                  :value="option"
                ></el-option>
              </el-select>
            </div>
          </template>
          <template slot="primaryInfo" v-if="saveBtn">
            <h3 class="primary-info">基本信息</h3>
          </template>
          <template slot="skuInfo">
            <div class="hr primary-info"></div>
            <h3 class="primary-info">规格</h3>
            <div class="primary-info" style="margin-top: 20px;">
              <el-table class="hide-table-body" style="width: 100%" :data="tempTableData" border>
                <el-table-column width="50"></el-table-column>
                <el-table-column v-if="objId" min-width="150px" label="物资编码" prop="code"></el-table-column>
                <el-table-column min-width="150px" label="创建医嘱项目">
                  <template slot-scope="scope">
                    <ever-select
                      class="is-required"
                      style="width: 90%;"
                      v-model="medicalOrder"
                      :options="yesno"
                      placeholder="创建医嘱项目"
                    ></ever-select>
                  </template>
                </el-table-column>
                <el-table-column min-width="150px" label="基础价">
                  <template slot-scope="scope">
                    <sys-text
                      class="is-required"
                      v-if="medicalOrder && medicalOrder === yesno[1].id"
                      style="width: 90%;"
                      v-model="basePrice"
                      placeholder="基础价"
                    ></sys-text>
                  </template>
                </el-table-column>
                <el-table-column
                  min-width="150px"
                  :resizable="false"
                  v-for="(item, index) in skuTableData"
                  :key="index"
                  :label="item.label"
                >
                  <template slot-scope="scope">
                    <div>
                      <sku-table
                        :data="item"
                        v-model="scope.row[item.prop]"
                        :value="item.value"
                        :objId="scope.row.id"
                      ></sku-table>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :resizable="false" label="操作" width="150" prop>
                  <template slot-scope="scope">
                    <el-button type="success" size="small" @click="handleSaveSku(scope.row)">保存</el-button>
                    <el-button type="primary" size="small" @click="handleCancleSku(scope.row)">取消</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-table
                :data="tableData"
                style="width: 100%; margin-top: -10px; z-index: 2; border-top: none"
                :show-header="false"
                border
                @selection-change="handleSelectionChange"
                :stripe="false"
              >
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column v-if="objId" min-width="150px" prop="code"></el-table-column>
                <el-table-column min-width="150px" prop>
                  <template slot-scope="scope">
                    <ever-select
                      style="width: 90%;"
                      v-model="scope.row.ifService"
                      :options="yesno"
                      placeholder="创建医嘱项目"
                      :disabled="true"
                    ></ever-select>
                  </template>
                </el-table-column>
                <el-table-column min-width="150px" prop="price"></el-table-column>
                <el-table-column
                  min-width="150px"
                  v-for="(item, index) in skuTableData"
                  :key="index"
                  :label="item.label"
                  prop
                >
                  <template slot-scope="scope">{{_setColumnName(scope.row, item.prop)}}</template>
                </el-table-column>
                <el-table-column label="操作" width="150" prop>
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      size="small"
                      @click="handleEdit(scope.row, scope.$index)"
                    >编辑</el-button>
                    <el-button
                      type="danger"
                      size="small"
                      @click="handleDelete(scope.row, scope.$index)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
          <template slot="managementModel">
            <!-- <el-checkbox
              label="按数量管理"
              v-model="obj.isNum"
              disabled
              :true-label="1"
              :false-label="0"
            ></el-checkbox>-->
            <el-checkbox label="按有效期管理" v-model="obj.isExpiryDate" :true-label="1" :false-label="0"></el-checkbox>
            <el-checkbox
              label="按唯一码管理"
              v-model="obj.isManageAlone"
              :true-label="1"
              :false-label="0"
            ></el-checkbox>
            <span
              class="ml20 pl20 light-gray"
              style="color: red;"
            >药品和医疗耗材必须勾选有效期管理，一物一码的物资还需要勾选唯一码管理</span>
          </template>
          <div slot="default"></div>
        </ever-form2>
        <div v-if="schema.length && !slots && saveBtn">
          <div v-for="(item, i) in slotsData" :key="i">
            <div class="hr"></div>
            <ever-form2
              label-width="180px"
              class="mt20"
              :schema="item.schemaSlot"
              v-model="item.objSlot"
              :ref="item.formSlot"
              :span="12"
              :rules="item.rulesSlot"
              :nosubmit="true"
            >
              <div slot="default"></div>
            </ever-form2>
          </div>
        </div>
        <div v-if="schema.length && slots">
          <slot v-for="item in slots" :name="item"></slot>
        </div>
        <div class="ml180">
          <el-button
            v-if="saveBtn || objId"
            type="primary"
            @click="submitForm()"
            size="large"
            :loading="submitDisableBtn"
          >保存</el-button>
        </div>
        <!-- <el-dialog :visible.sync="inUseDialog" width="400" custom-class="ui_dialog_01 w_01">
          <div style="height:160px;padding: 0 25px;text-align: center; font-size: 20px">
            <h4 style="margin-bottom: 0">删除</h4>
            <p style="font-size: 16px; color: #000;">该包装信息已被机构关联，不能删除</p>
          </div>
          <span slot="footer" class="dialog-footer"><el-button @click="handleInUse" type="primary">关闭</el-button></span>
        </el-dialog>
        <el-dialog :visible.sync="notUseDialog" width="400" custom-class="ui_dialog_01 w_01">
          <div style="height:160px;padding: 0 25px;text-align: center; font-size: 20px">
            <h4 style="margin-bottom: 0">删除</h4>
            <p style="font-size: 16px; color: #000;">确认删除该包装信息？</p>
          </div>
          <span slot="footer" class="dialog-footer"><el-button @click="handleNotUse" type="primary">取消</el-button><el-button @click="handleInUseConfirm" type="primary">确认</el-button></span>
        </el-dialog>-->
      </div>
    </div>
  </div>
</template>
<script>
import classify from '@/warehouse/util/classify'
import SkuTable from '@/warehouse/page/components/skutable'
import { debounce, PROPERTY_TYPE_FOR_TEMPLET, GLOBAL_ATTR, STENCIL_TYPE, PROPERTY_TYPE_FOR_TEMPLET_CERTAINLY, dateFormat, patch, CHECK_CODE, getFirstRoutePath, MECHANISM_CODE, MATERILA_PINYIN_CODE, SEARCH_CODE, BLOOD_CLASSIFYID, GENERAL_CODE, yesno, MATERIALTYPE, DRUGTYPE, CUSTOM_MATERIAL_CODE_DICT, CUSTOM_MATERIAL_CODE, whComFn, STAFF_RELATION_TYPE } from '@/util/common'
import templetApi from '@/warehouse/page/groupmaterial/store/templetapi'
import { createdSchemaAndObjectValue, readonlyObjItem, setUpClassifyName, _findIndex } from '@/util/formcustom'
let schemaInfo = [
  // {
  //   name: 'code',
  //   label: '物资编码',
  //   comp: 'readonlyitem',
  //   span: 24
  // },
  {
    name: 'classifyId',
    label: '类型',
    comp: 'readonlyitem',
    span: 24
  }
]
const rulesInfo = {
  managementModel: [
    { required: true, message: '必填项', trigger: 'blur' }
  ]
}
export default {
  props: ['systemType', 'parentSchema', 'customApi', 'customType', 'isSearch', 'backListRoute', 'propertyName', 'propertyNameValues', 'organization', 'slots', 'slotsData', 'titleCode', 'propertyParentName', 'relationName', 'relationType', 'isSubmitForm'],
  mixins: [classify],
  data () {
    return {
      queryVal: '',
      obj: {},
      schema: [],
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
      categoryList: [],
      countId: 0,
      notUseDialog: false,
      inUseDialog: false,
      deleteId: 0,
      statusEdit: this.$route.query.status,
      STENCIL_TYPE,
      STAFF_RELATION_TYPE,
      cacheResult: {},
      schemaInfo,
      spuObj: {},
      // 编辑缓存关联关系
      cacheRelation: [],
      // 查询placeholder
      queryPlaceholder: '通用名 / 商品名 / 批准文号',
      breadCrumbName: '',
      yesno,
      // 创建医嘱项目
      medicalOrder: '',
      submitDisableBtn: false, // 保存按钮loading
      // 基础价
      basePrice: ''
    }
  },
  created () {
    // 请求药理分类数据
    templetApi.categoryList().then(res => {
      this.categoryList = whComFn.sectionMap(res, 'pharmacologyCategories')
    })
    if (!this.objId) {
      // this.schemaInfo[0].name = 'classifyId'
      this.breadCrumbName = '新建' + this.customType
      let schema = []
      if (STENCIL_TYPE[0].id === this.systemType || STENCIL_TYPE[8].id === this.systemType || STENCIL_TYPE[2].id === this.systemType) {
        schema.push({
          name: 'classifyId',
          label: '类型',
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
    // if (this.customType) {
    //   this.$ever.getFieldFromSchema(this.schemaInfo, 'code').label = `${this.customType}编码:`
    // }
  },
  methods: {
    handleInUseConfirm () {
      this.$messageTips(this, 'success', '删除成功', '删除')
      this.tableData.splice(this.deleteId, 1)
      this.handleNotUse()
    },
    handleInUse () {
      this.inUseDialog = !this.inUseDialog
    },
    handleNotUse () {
      this.notUseDialog = !this.notUseDialog
    },
    handleDelete (data, index) {
      // if (data.isInUse) {
      //   this.handleInUse()
      //   return
      // }
      // this.deleteId = index
      this.tableData.splice(this.deleteId, 1)
      // this.handleNotUse()
    },
    async handelChange (v) {
      this.materialDictSkuId = ''
      this.schema = this.tempSchema
      this.tempTableData = []
      if (v) {
        this.materialDictSkuId = v.id
        this._dataNewRendering({ result: this.cacheResult })
        this.obj = readonlyObjItem(this.obj, v.materialDictPropertys, true)
        this._filterSchema(this.spuObj)
        let materialArr = await this.customApi.getthismaterialinfo(this.materialDictSkuId, this.obj.classifyId).then()
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
    _dataNewRendering ({ result, flag, change }) {
      let bedIndex = -1
      if (this.slotsData && result.classifyId && this.slotsData.BED_CLASSIFYID) bedIndex = _findIndex(this.slotsData.BED_CLASSIFYID, result.classifyId)
      let renderSpu = result.templetPropertiesForSpu || result.templetDictPropertiesForSpu || result.templetProperties
      let SPU
      if (flag) {
        SPU = createdSchemaAndObjectValue(result.keysForSpu || result.keys, renderSpu)
      } else {
        SPU = createdSchemaAndObjectValue(result.keysForSpu || result.keys, renderSpu, { certainly: true })
      }
      // 存储spu propertyCode
      this.spuObj = SPU.obj
      let index = this.schema.findIndex(item => {
        return item.name === 'primaryInfo'
      })
      if (index > 0) this.schema.splice(index, 1)
      this.schema.push({
        name: 'primaryInfo',
        label: '',
        comp: 'custom',
        span: 24
      })
      this.schema = this.schema.concat(SPU.schema).concat(this.parentSchema || [])
      // 添加管理方式
      if (this.systemType === STENCIL_TYPE[0].id) {
        if (!change) this._customSchema({ schema: this.schema, obj: this.obj, dataRes: this.obj })
        this.schema.push({ name: 'managementModel', label: '管理方式', comp: 'custom', span: 24 })
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
      this.obj = Object.assign({}, this.obj, SPU.obj)
      this.rules = Object.assign(SPU.rules, rulesInfo)
      this.resultObj = Object.assign({}, result, this.obj)
      this.saveBtn = true
      // 机构关联关系需要往父级组件通信   目前临时解决方案
      if (bedIndex > -1) this.$emit('typeSelectChange', { name: result.classifyId, code: result.code || '' })
    },
    objectFilter (array, key) {
      let inow = true
      for (let i = 0; i < array.length; i++) {
        if (key === array[i]) {
          inow = false
        }
      }
      return inow
    },
    submitForm: debounce(function () {
      if (!this.obj.classifyId && !this.organization) {
        return this.$messageTips(this, 'warning', '请先选择好物资类型', ' ')
      }
      // 创建编辑机构营业地址不校验的临时解决办法
      if ((this.backListRoute === '/manages/collections' || this.backListRoute === '/warehouse/agencymechanismsee') && this.obj['SXX000059']) {
        let addressDetail = JSON.parse(this.obj['SXX000059'])
        if (!addressDetail.province || !addressDetail.addressDetail) {
          return this.$messageTips(this, 'warning', '请检查您填写的营业地址')
        }
      }
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          if (!this.statusEdit && (this.obj.materialDictSku === undefined || this.obj.materialDictSku.length === 0) && this.systemType === STENCIL_TYPE[0].id) {
            return this.$messageTips(this, 'warning', '请先选择规格', ' ')
          }
          if (this.obj.materialDictSku && this.obj.materialDictSku.length) {
            this.obj.materialDictSku.forEach(item => {
              if (!item.ifService) {
                return this.$messageTips(this, 'warning', '已选规格中有医嘱项目必填，请核对后再保存', ' ')
              }
              if (!item.price && !this.objId && item.ifService && item.ifService === yesno[1].id) {
                return this.$messageTips(this, 'warning', '已选规格中有基础价必填，请核对后再保存', ' ')
              }
            })
          }
          let params = {}
          // 关联关系表单验证
          let slotFlag = true
          let slotArr = {}
          if (this.relationName) {
            params[this.relationName] = []
            if (!this.slots) {
              slotFlag = false
              this.slotsData.forEach(formItem => {
                this.$refs[formItem.formSlot][0].$refs.form.validate(validSlot => {
                  if (validSlot) {
                    slotFlag = true
                    if (this.relationType) {
                      for (let slotkye in formItem.objSlot) {
                        slotArr[slotkye] = this._relationFilterData({ key: slotkye, data: formItem.objSlot[slotkye] })
                        params[this.relationName] = [...params[this.relationName], ...slotArr[slotkye]]
                      }
                    }
                  }
                })
              })
            } else {
              if (!this.slotsData.hospitalBedRelationList.length) return this.$messageTips(this, 'warning', '请添加床号、床态、关联病区等信息')
              // 床位关联关系
              this.slotsData.hospitalBedRelationList.forEach((bedItem, index) => {
                if (this.slotsData.hospitalBedRelationList.length > 1 && index > 0) {
                  if (!bedItem.bedNum && !bedItem.relationId && !bedItem.ifAvailable) {
                    slotFlag = true
                    params[this.relationName] = [...this.slotsData.hospitalBedRelationList]
                    params[this.relationName].splice(index, 1)
                  } else {
                    if (!bedItem.bedNum || !bedItem.relationId || !bedItem.ifAvailable) {
                      slotFlag = false
                      return this.$messageTips(this, 'warning', '当前关联关系中必填项录入，请录入后再保存', ' ')
                    } else {
                      slotFlag = true
                      params[this.relationName] = [...this.slotsData.hospitalBedRelationList]
                    }
                  }
                } else {
                  if (!bedItem.bedNum || !bedItem.relationId || !bedItem.ifAvailable) {
                    slotFlag = false
                    return this.$messageTips(this, 'warning', '当前关联关系中必填项录入，请录入后再保存', ' ')
                  } else {
                    slotFlag = true
                    params[this.relationName] = [...this.slotsData.hospitalBedRelationList]
                  }
                }
              })
            }
            if (this.cacheRelation.length && params[this.relationName].length) {
              this.cacheRelation.forEach(rItem => {
                params[this.relationName].forEach((sItem, i) => {
                  if (this.systemType === STENCIL_TYPE[8].id) {
                    if (sItem.id && rItem.id === sItem.id) Object.assign(rItem, sItem)
                  } else {
                    if (sItem.relationId && rItem.relationId === sItem.relationId) Object.assign(rItem, sItem)
                  }
                })
              })
            }
            params.serviceId = this.slotsData.serviceId
          }
          // 床位保存校验
          if (this.isSubmitForm && this.systemType === STENCIL_TYPE[8].id) return
          // 关联关系必填校验
          if (this.relationName && !slotFlag) return
          let materialSpu
          if (this.systemType === STENCIL_TYPE[0].id) {
            materialSpu = this.statusEdit ? params.materialSpu = {} : params.materialDictSpu = {}
            if (this.statusEdit === 'edit') {
              Object.assign(materialSpu, {
                materialPropertys: [],
                source: this.resultObj.source,
                sourceId: this.resultObj.sourceId,
                classifyId: this.obj.classifyId,
                templetId: this.resultObj.templetId || this.resultObj.templetDictId,
                isNum: this.resultObj.isNum,
                isExpiryDate: this.resultObj.isExpiryDate,
                isManageAlone: this.resultObj.isManageAlone
              })
            } else {
              Object.assign(materialSpu, {
                materialDictSkus: this.obj.materialDictSku,
                materialDictPropertys: [],
                classifyId: this.obj.classifyId,
                templetId: this.resultObj.templetId || this.resultObj.templetDictId,
                isNum: this.obj.isNum,
                isExpiryDate: this.obj.isExpiryDate,
                isManageAlone: this.obj.isManageAlone
              })
            }
          } else {
            Object.assign(params, { templetId: this.resultObj.templetId || this.resultObj.templetDictId, classifyId: this.obj.classifyId || this.resultObj.classifyId || this.organization })
            materialSpu = params[this.propertyName] = []
            materialSpu[this.propertyNameValues] = []
          }
          if (this.materialDictSkuId && !this.objId) {
            Object.assign(materialSpu, { id: this.materialDictSkuId })
          }
          if (this.objId) {
            if (this.systemType !== STENCIL_TYPE[0].id) {
              Object.assign(params, { templetId: this.resultObj.templetId || this.resultObj.templetDictId, classifyId: this.obj.classifyId || this.resultObj.classifyId || this.organization, createBy: this.resultObj.createBy, createTime: this.resultObj.createTime, isDelete: this.resultObj.isDelete, sourceId: this.resultObj.sourceId, source: this.resultObj.source, statue: this.resultObj.statue })
              if (this.systemType !== STENCIL_TYPE[1].id && this.systemType !== STENCIL_TYPE[3].id && this.systemType !== STENCIL_TYPE[6].id) {
                Object.assign(params, { clinicId: this.resultObj.clinicId })
              }
              if (this.systemType === STENCIL_TYPE[3].id) {
                Object.assign(params, { code: this.resultObj.code })
              }
            }
            params.classifyId = this.resultObj.classifyId
            params.id = this.objId
            params.code = this.resultObj.code
            if (materialSpu) {
              materialSpu.classifyId = this.resultObj.classifyId
              materialSpu.id = this.resultObj.id
              materialSpu.code = this.resultObj.code
            }
          }
          for (let key in this.obj) {
            let array = ['classifyId', 'type1', 'type2', 'type3', 'code', 'classifyVoObject', 'templetPropertiesForSpu', 'keysForSpu'].concat(this.parentObj || [])
            if (this.systemType === STENCIL_TYPE[0].id && !this.objId) {
              array.push('managementModel', 'templetPropertiesForSku', 'keysForSku', 'materialDictSku', 'isNum', 'isExpiryDate', 'isManageAlone', 'queryModel')
            }
            if (this.objectFilter(array, key)) {
              let val = this.obj[key]
              let listParams = {}
              if (this._findPropertyType(key).propertyType === GLOBAL_ATTR[2].id || this._findPropertyType(key).propertyType === GLOBAL_ATTR[3].id) {
                if (val.constructor !== Array) {
                  listParams[this.propertyNameValues] = {}
                  if (this.systemType === STENCIL_TYPE[0].id) {
                    this.objId ? listParams.materialPropertyValues = this._findSingle(val, key, true) : listParams.materialDictPropertyValues = this._findSingle(val, key, true)
                  } else {
                    listParams[this.propertyNameValues] = this._findSingle(val, key, true)
                  }
                } else {
                  if (this.systemType === STENCIL_TYPE[0].id) {
                    this.objId ? listParams.materialPropertyValues = this._findMultiple(val, key, true) : listParams.materialDictPropertyValues = this._findMultiple(val, key, true)
                  } else {
                    listParams[this.propertyNameValues] = this._findMultiple(val, key, true)
                  }
                }
              } else {
                listParams.propertyValue = val
                if (this.systemType === STENCIL_TYPE[3].id && key === MECHANISM_CODE[0]) {
                  params.name = val
                }
              }
              if (this.systemType === STENCIL_TYPE[0].id) {
                let isDictOrNotDict = ''
                this.objId ? isDictOrNotDict = 'materialPropertys' : isDictOrNotDict = 'materialDictPropertys'
                if ((key === CUSTOM_MATERIAL_CODE_DICT[0].name || key === CUSTOM_MATERIAL_CODE[0].name) && listParams.propertyValue.length) {
                  listParams.propertyValue.forEach(item => {
                    item.idName && delete item.idName
                    item.idOptions && delete item.idOptions
                    item.pharmacologyCategoryObject && delete item.pharmacologyCategoryObject
                    item.idLists && delete item.idLists
                  })
                  this.objId ? materialSpu.categoryMaterialRelations = listParams.propertyValue : materialSpu.categoryMaterialDictRelations = listParams.propertyValue
                } else {
                  if (this._findPropertyType(key).propertyCode === key) {
                    materialSpu[isDictOrNotDict].push(Object.assign({
                      propertyCode: key,
                      propertyType: this._findPropertyType(key).propertyType,
                      propertyRelationCode: this._findPropertyType(key).propertyRelationCode,
                      type: PROPERTY_TYPE_FOR_TEMPLET[0].id
                    }, listParams))
                  }
                }
                if (this.objId && this.cacheResult.materialPropertys.length) {
                  this.cacheResult.materialPropertys.forEach(item => {
                    materialSpu[isDictOrNotDict].forEach(itemSpu => {
                      if (item.propertyCode === itemSpu.propertyCode && item.propertyCode === key) Object.assign(itemSpu, item, listParams)
                    })
                  })
                }
              } else {
                if (this._findPropertyType(key).propertyCode === key) {
                  materialSpu.push(Object.assign({
                    propertyCode: key,
                    propertyType: this._findPropertyType(key).propertyType,
                    propertyRelationCode: this._findPropertyType(key).propertyRelationCode
                  }, listParams))
                }
                if (this.objId && this.cacheResult[this.propertyName].length) {
                  this.cacheResult[this.propertyName].forEach(item => {
                    materialSpu.forEach(itemSpu => {
                      if (item.propertyCode === itemSpu.propertyCode && item.propertyCode === key) Object.assign(itemSpu, item, listParams)
                    })
                  })
                }
              }
            }
          }
          params.systemType = this.systemType
          if (this.statusEdit === 'edit') {
            if (this.systemType === STENCIL_TYPE[0].id) {
              this.submitDisableBtn = true
              this.customApi.spuUpdateOrCreate(params).then(result => {
                if (result) {
                  this.submitDisableBtn = false
                  this.$messageTips(this, 'success', '修改成功', ' ')
                  this.$router.push(this.backListRoute)
                }
              })
            } else {
              // 机构科室&部门特殊处理接口
              if (getFirstRoutePath(this.backListRoute, 1) === 'warehouse' && (this.systemType === STENCIL_TYPE[1].id || this.systemType === STENCIL_TYPE[4].id)) {
                this.submitDisableBtn = true
                if (this.systemType === STENCIL_TYPE[1].id) {
                  if (params.localDepartmentRelations.every(item => item.relationId === '')) {
                    params.localDepartmentRelations = []
                  }
                  let index = params.localDepartmentRelations.findIndex(it => {
                    return it.relationId === ''
                  })
                  if (index > -1) params.localDepartmentRelations.splice(index, 1)
                } else if (this.systemType === STENCIL_TYPE[4].id) {
                  if (params.localSectionRelations.every(item => item.relationId === '')) {
                    params.localSectionRelations = []
                  }
                  let index = params.localSectionRelations.findIndex(it => {
                    return it.relationId === ''
                  })
                  if (index > -1) params.localSectionRelations.splice(index, 1)
                }
                this.customApi.updateRelation(params).then(result => {
                  if (result) {
                    this.submitDisableBtn = false
                    this.$messageTips(this, 'success', '修改成功', ' ')
                    this.$router.push(this.backListRoute)
                  }
                })
              } else {
                this.submitDisableBtn = true
                this.customApi.createOrUpdate(params).then(result => {
                  if (result) {
                    this.submitDisableBtn = false
                    this.$messageTips(this, 'success', '修改成功', ' ')
                    this.$router.push(this.backListRoute)
                  }
                })
              }
            }
          } else {
            if (this.systemType === STENCIL_TYPE[0].id) {
              this.submitDisableBtn = true
              templetApi.createOrUpdate(params).then(result => {
                if (result) {
                  this.submitDisableBtn = false
                  this.$messageTips(this, 'success', '创建成功', ' ')
                  this.$router.push(this.backListRoute)
                }
              })
            } else {
              this.submitDisableBtn = true
              this.customApi.createOrUpdate(params).then(result => {
                if (result) {
                  this.submitDisableBtn = false
                  this.$messageTips(this, 'success', '创建成功', ' ')
                  // 机构人员创建成功需调整至查看页=》证书信息
                  if (this.systemType === STENCIL_TYPE[2].id) {
                    this.$router.push(`/warehouse/agencystaffsee/${result.id}?routeEdit=agencystaff&lookInfo=accountInfo`)
                  } else {
                    this.$router.push(this.backListRoute)
                  }
                }
              })
            }
          }
        } else {
          this.$messageTips(this, 'warning', '必填字段未填写，请检查填写后再保存', ' ')
        }
      })
    }),
    // 关联关系处理数据 stat
    _relationArr2Json (arr, type) {
      let resArr = []
      if (type === STAFF_RELATION_TYPE[1].id) { // 单选所属科室按type类型分类，只取最末级id
        if (Array.isArray(arr) && arr[arr.length - 1]) { // 关联科室处理（级联）
          resArr.push({ relationType: type, relationId: arr[arr.length - 1] })
        }
      } else {
        arr.length && arr.forEach(item => {
          if (Array.isArray(item) && item[item.length - 1]) { // 病区多选数据处理
            resArr.push({ relationType: type, relationId: item[item.length - 1] })
          } else {
            resArr.push({ relationType: type, relationId: item })
          }
        })
      }
      return resArr
    },
    _relationFilterData ({ key, data }) {
      let backRelation = []
      if (!data) return backRelation
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
    _queryDictModel (val) {
      templetApi.queryDictModel({ classifyId: val, systemType: this.systemType }).then(result => {
        if (result && result.flag) {
          this.cacheResult = result
          this._dataNewRendering({ result, flag: true })
        } else {
          this.saveBtn = false
        }
      })
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
      const categoryMaterialRelations = []
      if (isSchemaFlag) {
        if (!this.objId) {
          dataRes.categoryMaterialDictRelations && dataRes.categoryMaterialDictRelations.map(v => {
            v.levelRelation && categoryMaterialRelations.push(v.levelRelation)
          })
          CUSTOM_MATERIAL_CODE_DICT[0].props = { disabled: false, options: this.categoryList, searchPlaceholder: '请输入药理分类' }
          schema.push(CUSTOM_MATERIAL_CODE_DICT[0])
          this.obj = JSON.parse(JSON.stringify(Object.assign(this.obj, { categoryMaterialDictRelations: categoryMaterialRelations || [] })))
        } else {
          dataRes.categoryMaterialRelations && dataRes.categoryMaterialRelations.map(v => {
            v.levelRelation && categoryMaterialRelations.push(v.levelRelation)
          })
          CUSTOM_MATERIAL_CODE[0].props = { disabled: false, options: this.categoryList, searchPlaceholder: '请输入药理分类' }
          schema.push(CUSTOM_MATERIAL_CODE[0])
          this.obj = JSON.parse(JSON.stringify(Object.assign(this.obj, { categoryMaterialRelations: categoryMaterialRelations || [] })))
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
    }
    // end
  },
  components: {
    SkuTable
  }
}
</script>
<style lang="scss" scoped>
.query-model {
  background: #f4f4f4;
  width: calc(100% + 40px);
  margin-left: -120px;
  padding: 20px 40px;
  border-radius: 4px;
}
.primary-info {
  margin: 0;
  margin-left: -100px;
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
// .hr {width: calc(100% + 180px); margin-left: -180px;}
</style>
