<template>
  <div>
    <div class="content-box">
      <ever-form2
        label-width="180px"
        :schema="schema"
        v-model="obj"
        ref="form"
        :span="12"
        :rules="rules"
        :nosubmit="true">
        <template slot="editInfo">
          <div class="primary-info" style="margin-left: 0; padding: 40px 0" v-if="showEditFlag">
            <el-button type="primary" @click="editdictionary" size="large">编辑基本信息</el-button>
          </div>
        </template>
        <template
          slot="primaryInfo"
          v-if="systemType == STENCIL_TYPE[0].id && getFirstRoutePath(backListRoute, 1) != 'warehouse'">
          <h3 class="primary-info">基本信息</h3>
        </template>
        <template slot="skuInfo" v-if="systemType == STENCIL_TYPE[0].id">
          <h3 class="primary-info">规格</h3>
          <el-button
            v-if="getFirstRoutePath(backListRoute, 1) != 'warehouse'"
            style="float:right;margin-top:-40px;"
            type="primary"
            @click="handleCreateSku"
          >创建规格</el-button>
          <div class="primary-info" style="margin-top: 20px;">
            <el-table
              :class="newdictionary ? '' : 'delitem'"
              style="width: 100%"
              :data="tempTableData"
              border>
              <!-- <el-table-column
                min-width="150px"
                label="物资编码">
              </el-table-column>-->
              <el-table-column v-if="resultObj.classifyId === BLOOD_CLASSIFYID" min-width="150px" label="创建医嘱项目">
                <template slot-scope="scope">
                  <el-row>
                    <el-col :span="1" class="mt10">
                      <span style="color: red">*</span>
                    </el-col>
                    <el-col :span="20" class="ml5">
                      <ever-select
                        style="width: 90%;"
                        v-model="medicalOrder"
                        :options="yesno"
                        placeholder="创建医嘱项目"
                        :disabled="scope.row.id && medicalOrder ? true : false"
                      ></ever-select>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
              <el-table-column v-if="resultObj.classifyId === BLOOD_CLASSIFYID" min-width="150px" label="基础价">
                <template slot-scope="scope">
                  <el-row>
                    <el-col :span="1" class="mt10">
                      <span style="color: red">*</span>
                    </el-col>
                    <el-col :span="20" class="ml5">
                      <sys-text
                        style="width: 90%;"
                        v-model="basePrice"
                        placeholder="基础价"
                        :disabled="scope.row.id && medicalOrder ? true : medicalOrder && medicalOrder === yesno[0].id ? true : false"
                      ></sys-text>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
              <el-table-column
                min-width="150px"
                :resizable="false"
                v-for="(item, index) in skuTableData"
                :key="index"
                :label="item.label">
                <template slot-scope="scope">
                  <div v-if="newdictionary">
                    <sku-table
                      :data="item"
                      v-model="scope.row[item.prop]"
                      :value="item.value"
                      :objId="scope.row.id"
                    ></sku-table>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                v-if="getFirstRoutePath(backListRoute, 1) != 'warehouse'"
                :resizable="false"
                label="操作"
                width="150"
                prop>
                <template slot-scope="scope">
                  <div>
                    <el-button
                      type="success"
                      size="small"
                      :loading="saveLoading"
                      @click="handleSaveSku(scope.row)"
                    >保存</el-button>
                    <el-button type="primary" size="small" @click="handleCancleSku(scope.row)">取消</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <!-- @selection-change="handleSelectionChange" -->
            <el-table
              :data="tableData"
              style="width: 100%; margin-top: -10px; z-index: 2; border-top: none"
              :show-header="false"
              border>
              <!-- <el-table-column
                min-width="150px"
                prop="code">
              </el-table-column>-->
              <el-table-column v-if="resultObj.classifyId === BLOOD_CLASSIFYID" min-width="150px" prop>
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
              <el-table-column v-if="resultObj.classifyId === BLOOD_CLASSIFYID" min-width="150px" prop="price"></el-table-column>
              <el-table-column
                min-width="150px"
                v-for="(item, index) in skuTableData"
                :key="index"
                :label="item.label"
                prop
              >
                <template slot-scope="scope">
                  <span>{{_setColumnName(scope.row.materialPropertys, item.prop)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="getFirstRoutePath(backListRoute, 1) != 'warehouse'"
                label="操作"
                width="150"
                prop
              >
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    size="small"
                    @click="handleEdit(scope.row, scope.$index)"
                  >编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
        <template slot="managementModel" v-if="obj.isNum">
          <div>
            <el-checkbox
              label="按有效期管理"
              v-model="obj.isExpiryDate"
              disabled
              :true-label="1"
              :false-label="0"
            ></el-checkbox>
            <el-checkbox
              label="按唯一码管理"
              v-model="obj.isManageAlone"
              disabled
              :true-label="1"
              :false-label="0"
            ></el-checkbox>
            <span
              class="ml20 pl20 light-gray"
              style="color: red;"
            >药品和医疗耗材必须勾选有效期管理，一物一码的物资还需要勾选唯一码管理</span>
          </div>
        </template>
        <div slot="default"></div>
      </ever-form2>
      <div v-if="schema.length != 0 && !slots" v-for="(item, i) in slotsData" :key="i">
        <ever-form2
          label-width="180px"
          :schema="item.schemaSlot"
          v-model="item.objSlot"
          :span="12"
          :nosubmit="true"
          class="mt20">
          <div slot="default"></div>
        </ever-form2>
      </div>
      <slot v-if="schema.length != 0 && slots" v-for="item in slots" :name="item"></slot>
      <!-- 在门急诊医生工作站 不显示编辑按钮 -->
      <div class="table-btn-ml_180 mt10" v-if="$route.path.indexOf('/workspace/drugdetail') == -1">
        <!-- {{$route.path.indexOf('/workspace/drugdetail')}} -->
        <el-button
          v-if="schema.length != 0 && warehouseEditFlag"
          type="primary"
          @click="editdictionary"
          size="large"
        >编辑基本信息</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import classify from '@/warehouse/util/classify'
import SkuTable from '@/warehouse/page/components/skutable'
import { PROPERTY_TYPE_FOR_TEMPLET, GLOBAL_ATTR, STENCIL_TYPE, getFirstRoutePath, PROPERTY_TYPE_FOR_TEMPLET_CERTAINLY, dateFormat, patch, CHECK_CODE, yesno, CUSTOM_MATERIAL_CODE, DRUGTYPE, whComFn, BLOOD_CLASSIFYID } from '@/util/common'
import { createdSchemaAndObjectValue, readonlyObjItem, setUpClassifyName, _findIndex } from '@/util/formcustom'
import templetApi from '@/warehouse/page/groupmaterial/store/templetapi'
let schemaMange = [
  {
    name: 'managementModel',
    label: '管理方式',
    comp: 'custom',
    span: 24
  }
]
let schemaEditInfo = [
  {
    name: 'editInfo',
    label: '',
    comp: 'custom',
    span: 24
  },
  {
    name: 'skuInfo',
    label: '',
    comp: 'custom',
    span: 24
  }
]
const rulesInfo = {
  managementModel: [
    { required: true, message: '必填项', trigger: 'blur' }
  ]
}
export default {
  props: ['systemType', 'customApi', 'customRouteEdit', 'customType', 'backListRoute', 'propertyName', 'propertyNameValues', 'slots', 'slotsData', 'breadName', 'titleCode', 'propertyParentName', 'relationName'],
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
      saveLoading: false,
      materialDictSkuId: '',
      options: [],
      skuTableData: [],
      tableData: [],
      tempTableData: [],
      thisKeysForSku: [],
      countId: 0,
      notUseDialog: false,
      inUseDialog: false,
      deleteId: 0,
      newdictionary: false,
      statusEdit: this.$route.query.status,
      STENCIL_TYPE,
      BLOOD_CLASSIFYID,
      showEditFlag: true,
      warehouseEditFlag: true,
      showSpuOrSku: true,
      getFirstRoutePath,
      schemaInfo: [
        {
          name: 'primaryInfo',
          label: '',
          comp: 'custom',
          span: 24
        }
      ],
      yesno,
      // 创建医嘱项目
      medicalOrder: '',
      // // 基础价
      basePrice: ''
    }
  },
  created () {
    // 请求药理分类数据
    templetApi.categoryList().then(res => {
      this.categoryList = whComFn.sectionMap(res, 'pharmacologyCategories')
    })
    if (getFirstRoutePath(this.backListRoute, 1) !== 'warehouse') {
      this.schemaInfo.push({
        name: 'classifyId',
        label: '类型',
        comp: 'readonlyitem',
        span: 24
      })
    } else if (getFirstRoutePath(this.backListRoute, 1) === 'warehouse' && (this.systemType === STENCIL_TYPE[0].id || this.systemType === STENCIL_TYPE[8].id)) {
      this.schemaInfo.push({
        name: 'classifyId',
        label: '类型',
        comp: 'readonlyitem',
        span: 24
      })
    }
    this.getDetail()
    // 判断是否是机构设置，且物资、机构、部门、科室不可编辑
    if (getFirstRoutePath(this.backListRoute, 1) === 'warehouse') {
      this.showEditFlag = false
      if (this.systemType === STENCIL_TYPE[0].id || this.systemType === STENCIL_TYPE[1].id || this.systemType === STENCIL_TYPE[4].id) {
        this.warehouseEditFlag = false
      }
    }
    if (getFirstRoutePath(this.backListRoute, 1) === 'group' || getFirstRoutePath(this.backListRoute, 1) === 'manages') {
      this.warehouseEditFlag = false
      let aCheckVal = []
      Array.prototype.slice.call([2, 5, 6, 7, 8]).forEach(i => {
        aCheckVal.push(STENCIL_TYPE[i].id)
      })
      if (aCheckVal.includes(this.systemType)) {
        this.showEditFlag = false
      }
    }
  },
  methods: {
    _clearTempTable () {
      for (let val in this.tempTableData[0]) {
        this.tempTableData[0][val] = ''
      }
    },
    handleCreateSku () {
      this.newdictionary = true
      this._clearTempTable()
      // 清空基础价格&医嘱项目
      if (this.resultObj.classifyId !== BLOOD_CLASSIFYID) { // 默认医嘱项为否
        this.medicalOrder = 1
      } else {
        this.medicalOrder = ''
      }
      this.basePrice = ''
    },
    handleCancleSku () {
      this._clearTempTable()
      this.newdictionary = false
      this.saveLoading = false
    },
    editdictionary () {
      if (Number(this.systemType) === STENCIL_TYPE[0].id) {
        this.$router.push(`/group/dictionary/${this.objId}?status=edit`)
      } else {
        this.$router.push(`/${getFirstRoutePath(this.$route.path, 1)}/${this.$route.query.routeEdit || this.customRouteEdit}/${this.objId || STENCIL_TYPE[3].id}?status=edit`)
      }
    },
    handleSelectionChange (tab) {
      this.obj.materialDictSku = tab
    },
    async getDetail (skuFalg) {
      this.customApi.getById(this.objId).then(res => {
        if (res && (res.id || res[this.propertyParentName])) {
          let result = this.propertyParentName ? res[this.propertyParentName] : res
          // 返回基础信息父组件
          this.$emit('obtainInfo', { data: result })
          // 机构关联关系需要往父级组件通信   目前临时解决方案
          let cacheRelation = getFirstRoutePath(this.backListRoute, 1) === 'warehouse' && (this.systemType === STENCIL_TYPE[1].id || this.systemType === STENCIL_TYPE[4].id) ? (res[this.relationName] ? res[this.relationName] : []) : (result[this.relationName] ? result[this.relationName] : [])
          this.$emit('typeSelectChange', { name: res.classifyId, code: res.code || '', data: cacheRelation, parentData: result })
          // 更新标题名称
          let json = { rows: this.propertyName ? result[this.propertyName] : result.materialPropertys || result.materialSkuObject.materialPropertys }
          // titleCode 外部传入需要标题名称code
          if (this.titleCode) json.code = this.titleCode
          this.$emit('update:breadName', this._resetMaterialName(json))
          if (getFirstRoutePath(this.backListRoute, 1) === 'warehouse') this.$emit('warehouseDetail', res)
          if (!skuFalg) {
            let renderSpu = result.templetPropertiesForSpu || result.templetProperties
            let SPU = createdSchemaAndObjectValue(result.keysForSpu || result.keys, renderSpu, { disabled: true })
            if (this.systemType === STENCIL_TYPE[0].id) {
              // 支持门急诊医生工作站展示物资明细
              if (this.showSpuOrSku && ['warehouse', 'workspace'].includes(getFirstRoutePath(this.backListRoute, 1))) {
                this.obj = readonlyObjItem(SPU.obj, result.materialPropertys, true)
              } else {
                this.obj = readonlyObjItem(SPU.obj, result.materialPropertys, true)
              }
            } else {
              this.obj = readonlyObjItem(SPU.obj, result[this.propertyName], true, this.propertyNameValues)
            }
            this.rules = Object.assign(SPU.rules, rulesInfo)
            this.obj.code = result.materialSkuObject ? result.materialSkuObject.code : result.code ? result.code : ''
            this.obj.classifyId = setUpClassifyName(result.classifyVoObject || '')
            this.resultObj = result
            if (this.systemType === STENCIL_TYPE[0].id) {
              if (this.showSpuOrSku && !this.propertyParentName) {
                this.schema = this.schemaInfo.concat(SPU.schema)
                this._customSchema({ schema: this.schema, obj: this.obj, type: CUSTOM_MATERIAL_CODE[0].name, dataRes: result })
                this.schema = [...this.schema, ...schemaMange, ...schemaEditInfo]
                this.obj.managementModel = 1
                this.obj.isNum = 1
                this.obj.isExpiryDate = result.isExpiryDate
                this.obj.isManageAlone = result.isManageAlone
                this.thisKeysForSku = result.keysForSku
                this.skuTableData = this._tableHeaders(result.keysForSku, result.templetPropertiesForSku)
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
                  this.tempTableData = [tempInit]
                  this.tableData = result.materialSkus
                  this.statusEdit ? this._getResultPropertysList(this.resultObj, true) : this._getResultPropertysList(this.tableData)
                }
              } else {
                this.schema = this.schemaInfo.concat(SPU.schema)
              }
            } else {
              this.schema = this.schemaInfo.concat(SPU.schema).concat(schemaEditInfo)
            }
            this.saveBtn = true
          } else {
            this.resultObj = result
            this.tableData = result.materialSkus
            this.handleCancleSku()
          }
        }
      })
    },
    _findPropertyType (val) {
      for (let i = 0; i < this.resultObj.templetPropertiesForSpu.length; i++) {
        let item = this.resultObj.templetPropertiesForSpu[i]
        if (item.propertyCode === val) return item
      }
      return ''
    },
    _findPropertySkuType (val) {
      for (let i = 0; i < this.resultObj.templetPropertiesForSku.length; i++) {
        let item = this.resultObj.templetPropertiesForSku[i]
        if (item.propertyCode === val) return item
      }
      return ''
    },
    _tableHeaders (keys, data) {
      let arr = []
      for (let i = 0; i < keys.length; i++) {
        let item = keys[i]
        let { label, options, type, value, isMust, certainly, apiUrl, globalFlag } = this._findPropertValue(item, data)
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
    _findPropertValue (id, data) {
      let index = data.findIndex(item => {
        return item.propertyCode === id
      })
      let label = data[index].propertyObject ? data[index].propertyObject.name : ''
      let options = []
      let isMust = data[index].isMust
      let certainly = data[index].certainly
      if (data[index].templetPropertyValues) {
        for (let i = 0; i < data[index].templetPropertyValues.length; i++) {
          let item = data[index].templetPropertyValues[i]
          options.push({
            id: item.propertyValueId,
            name: item.propertyValueObject ? item.propertyValueObject.name : '未命名属性值'
          })
        }
      }
      let apiUrl = data[index].propertyObject && data[index].propertyObject.valueUrl
      let type = data[index].propertyType
      let value = ''
      let globalFlag = data[index].certainly === PROPERTY_TYPE_FOR_TEMPLET_CERTAINLY[0].id
      if (type === GLOBAL_ATTR[3].id) value = []
      return { label, options, type, value, isMust, certainly, apiUrl, globalFlag }
    },
    _setColumnName (row, name) {
      let index1 = _findIndex(row, name, 'propertyCode')
      let value = ''
      if (index1 > -1) {
        if (row[index1].propertyType === GLOBAL_ATTR[2].id || row[index1].propertyType === GLOBAL_ATTR[3].id) {
          let tempArr = []
          let items = row[index1].materialPropertyValues
          for (let i = 0; i < items.length; i++) {
            let item = items[i] || items[i]
            tempArr.push(item.propertyValueObject ? item.propertyValueObject.name : '')
          }
          row[index1].propertyType === GLOBAL_ATTR[2].id ? value = tempArr.join(' ') : value = tempArr.join(',')
        } else if (row[index1].propertyType === GLOBAL_ATTR[5].id) {
          value = row[index1].specialName ? row[index1].specialName : row[index1].propertyValue ? row[index1].propertyValue : '-'
        } else if (row[index1].propertyType === GLOBAL_ATTR[6].id) {
          value = row[index1].propertyValue ? dateFormat(row[index1].propertyValue, 'YYYY-MM-DD') : ''
        } else if (row[index1].propertyType === GLOBAL_ATTR[10].id) {
          if (row[index1].propertyValue) {
            let cityStr = JSON.parse(row[index1].propertyValue)
            value += cityStr.citysName ? `${cityStr.citysName} ${cityStr.addressDetail}` : cityStr.addressDetail
          }
        } else {
          value = row[index1].propertyValue
        }
      }
      return value
    },
    handleSaveSku (data) {
      const tempData = JSON.parse(JSON.stringify(data)) // 获取列编辑数据
      let dataId = data.id
      delete data.id
      let params = {
        // materialSpuId: this.objId,
        code: '',
        materialSku: { materialPropertys: [] },
        keysForSku: this.thisKeysForSku,
        createOrUpdateId: ''
      }
      // 判断医嘱项目&基础价是否为空
      if (!this.medicalOrder) return this.$messageTips(this, 'warning', '医嘱项目必填，请核对后再保存')
      if (!this.basePrice && !data.id && this.medicalOrder === yesno[1].id) return this.$messageTips(this, 'warning', '基础价必填，请核对后再保存')
      let itemSku = []
      if (dataId) {
        params.createOrUpdateId = dataId
        // 获取当前数据是第几条
        let index = _findIndex(this.resultObj.materialSkus, dataId)
        if (index > -1) {
          itemSku = this.resultObj.materialSkus[index]
          // sku 编辑拼接字段主体
          Object.assign(params.materialSku, {
            id: itemSku.id, code: itemSku.code, materialSpuId: itemSku.materialSpuId, isDelete: itemSku.isDelete, createBy: itemSku.createBy, createTime: itemSku.createTime, source: itemSku.source, sourceId: itemSku.sourceId
          })
        }
      } else {
        Object.assign(params.materialSku, { materialSpuId: this.objId })
      }
      // 找出SKU必填字段(code)
      let requireKeys = ['id']
      for (let i = 0; i < this.skuTableData.length; i++) {
        let item = this.skuTableData[i]
        if (item.isMust) requireKeys.push(item.prop)
      }
      // 遍历当前行字段「key」
      for (let keys in data) {
        for (let i = 0; i < this.skuTableData.length; i++) {
          let item = this.skuTableData[i]
          if (item.prop === keys && item.isMust && !data[keys]) {
            this.$messageTips(this, 'warning', item.label + '必填，请核对后再保存')
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
              listParams.materialPropertyValues = this._findSingle(val, keys)
            } else {
              listParams.propertyValue = val
            }
          } else {
            listParams.materialPropertyValues = this._findMultiple(val, keys)
          }
        }
        params.systemType = this.systemType
        if (dataId) {
          if (keys !== 'data' && keys !== 'id' && keys !== 'index') {
            params.materialSku.materialPropertys.push(Object.assign({
              propertyCode: keys,
              propertyType: this._findPropertySkuType(keys).propertyType,
              propertyRelationCode: this._findPropertySkuType(keys).propertyRelationCode,
              type: PROPERTY_TYPE_FOR_TEMPLET[1].id
            }, listParams))
          }
        } else {
          params.materialSku.materialPropertys.push(Object.assign({
            propertyCode: keys,
            propertyType: this._findPropertySkuType(keys).propertyType,
            propertyRelationCode: this._findPropertySkuType(keys).propertyRelationCode,
            type: PROPERTY_TYPE_FOR_TEMPLET[1].id
          }, listParams))
        }
      }
      Object.assign(params.materialSku, { ifService: this.medicalOrder, price: this.basePrice })
      Object.assign(params, { code: data.code, id: data.id, systemType: this.systemType })
      if (this.medicalOrder === yesno[0].id) params.price = ''
      let tableDataList = [] // tableData 总数据结构 「key：value」
      this.tableData.forEach(data => {
        let tempInit = {}
        let row = data.materialDictPropertys ? data.materialDictPropertys : data.materialPropertys
        for (let i = 0; i < this.thisKeysForSku.length; i++) {
          let item = data.keysForSku && data.keysForSku[i].propertyCode ? data.keysForSku[i].propertyCode : this.thisKeysForSku[i]
          tempInit[item] = this._returnPropertyVal(item, row)
        }
        tempInit.id = data.id
        tempInit.code = data.code
        tableDataList.push(tempInit)
      })
      let requireKeysLen = requireKeys.length - 1 // 减去一个id
      for (let i = 0; i < tableDataList.length; i++) {
        const item = tableDataList[i]
        let isTrue = [] // 是否和已有的sku值一样
        for (let n = 0; n < requireKeys.length; n++) {
          const key = requireKeys[n]
          if (tempData[key] + '' === item[key] + '') isTrue.push(item[key])
        }
        if (tempData.id && tempData.id === item.id) isTrue.push(true) // 编辑状态下，添加一个节点，允许保存
        if (isTrue.length === requireKeysLen) {
          this.$messageTips(this, 'warning', '已存在相同的SKU，请重新添加', ' ')
          return
        }
      }
      this.saveLoading = true
      this.customApi.skuUpdateOrCreate(params).then(result => {
        if (result && result.id) {
          this.getDetail()
          this.saveLoading = false
        }
      })
      for (let val in this.tempTableData[0]) {
        this.tempTableData[0][val] = ''
      }
      // 清空基础价格 & 医嘱项目
      if (this.resultObj.classifyId !== BLOOD_CLASSIFYID) { // 默认医嘱项为否
        this.medicalOrder = 1
      } else {
        this.medicalOrder = ''
      }
      this.basePrice = ''
    },
    handleEdit (data) {
      this.newdictionary = true
      let tempInit = {}
      let row = data.materialDictPropertys ? data.materialDictPropertys : data.materialPropertys
      for (let i = 0; i < this.thisKeysForSku.length; i++) {
        let item = data.keysForSku && data.keysForSku[i].propertyCode ? data.keysForSku[i].propertyCode : this.thisKeysForSku[i]
        tempInit[item] = this._returnPropertyVal(item, row)
      }
      tempInit.id = data.id
      tempInit.code = data.code
      this.medicalOrder = data.ifService
      this.basePrice = data.price
      this.tempTableData = [tempInit]
    },
    _returnPropertyVal (name, data) {
      for (let i = 0; i < data.length; i++) {
        let item = data[i]
        let propertyName = item.materialPropertyValues || item.materialPropertys
        if (item.propertyCode === name) {
          if (item.propertyType === GLOBAL_ATTR[3].id || item.propertyType === GLOBAL_ATTR[2].id) {
            if (item.propertyType === GLOBAL_ATTR[2].id) {
              return propertyName[0] ? propertyName[0].propertyValueId : []
            } else {
              return this._getSkuIdList(propertyName) || []
            }
          } else {
            return item.propertyValue
          }
        }
      }
      return ''
    },
    // 自定义属性添加schema
    _customSchema ({ obj, type, schema, dataRes, isCreate }) {
      let isSchemaFlag = false
      if (dataRes && dataRes.classifyVoObject && dataRes.classifyVoObject.classifyObject.id === DRUGTYPE) isSchemaFlag = true
      if (isSchemaFlag && type === CUSTOM_MATERIAL_CODE[0].name) {
        CUSTOM_MATERIAL_CODE[0].props = { disabled: true, options: this.categoryList, searchPlaceholder: '请输入药理分类' }
        schema.push(CUSTOM_MATERIAL_CODE[0])
        const categoryMaterialRelations = []
        dataRes.categoryMaterialRelations && dataRes.categoryMaterialRelations.map(v => {
          v.levelRelation && categoryMaterialRelations.push(v.levelRelation)
        })
        this.obj = JSON.parse(JSON.stringify(Object.assign(this.obj, { categoryMaterialRelations: categoryMaterialRelations || [] })))
      }
    },
    ...patch
  },
  watch: {
    slotsData: {
      handler: (v) => {
        // console.log(v.name, v.name1)
      },
      deep: true
    }
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
  margin-left: -180px;
  padding: 20px 40px;
  border-radius: 4px;
}
.primary-info {
  margin: 0;
  margin-left: -100px;
  // margin-top: -20px;
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
.delitem /deep/ .el-table__body-wrapper {
  display: none;
}
</style>
