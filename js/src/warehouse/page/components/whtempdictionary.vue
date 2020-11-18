<template>
  <div class="flex_column_full_hidden"  style="overflow-y: auto">
    <div class="layout_inner">
      <div class="steps">
        <el-row :gutter="20" class="steps-box">
          <el-col :span="5"> &nbsp;</el-col>
          <el-col :span="14">
            <ul>
            <li class="active"><span class="circle">1</span>属性项设置</li>
            <li><span class="line"></span></li>
            <li><span class="circle">2</span>属性值设置</li>
          </ul>
          </el-col>
          <el-col :span="5"> &nbsp;</el-col>
        </el-row>
      </div>
      <div class="panel-body">
        <div class="content-box">
          <ever-form2 :schema="schema" v-model="obj" ref="form" :span="12" :rules="rules" @submit="submitForm()" :nosubmit="true">
            <template slot="classifyId">
              <div v-if="!objId">
                <ever-select v-model="obj.type1" filterable placeholder="一级分类" :clearable="true" :options="options1" class="queryClass"></ever-select>
                <ever-select v-if="obj.type1 && options2.length" v-model="obj.type2" filterable placeholder="二级分类" :clearable="true" :options="options2" class="queryClass"></ever-select>
                <ever-select v-if="obj.type2 && options3.length" v-model="obj.type3" filterable placeholder="三级分类" :clearable="true" :options="options3" class="queryClass"></ever-select>
              </div>
              <div v-else>
                {{obj.classifyName}}
              </div>
            </template>
            <div slot="default"></div>
          </ever-form2>
          <templet-monolayer-comp
            v-if="systemType != STENCIL_TYPE[0].id"
            :obj="obj"
            :attrs="attrs"
            :totalSelectData="totalSelectData"
            :propertyData="propertyData"
            @handleClose="handleClose"
            @handleTag="handleTag"
            @handlePopoverSelect="handlePopoverSelect"></templet-monolayer-comp>
          <templet-comp
            v-else
            :obj="obj"
            :attrs="attrs"
            :totalSelectData="totalSelectData"
            :propertyData="propertyData"
            @handleClose="handleClose"
            @handleTag="handleTag"
            @handlePopoverSelect="handlePopoverSelect"></templet-comp>
          <el-button class="ml120" type="primary" @click="submitForm('form')" size="large">下一步</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import classify from '@/warehouse/util/classify'
import { STENCIL_TYPE, getFirstRoutePath } from '@/util/common'
import classifyApi from '@/warehouse/page/groupmaterial/store/classifyapi'
import templetApi from '@/warehouse/page/groupmaterial/store/templetapi'
import { setUpClassifyName } from '@/util/formcustom'
import templetComp from '@/warehouse/page/components/templetcomp'
import templetMonolayerComp from '@/warehouse/page/components/templemonolayercomp'

let schema = [
  {
    name: 'classifyId',
    label: '类型：',
    comp: 'custom',
    span: 24
  },
  {
    name: 'name',
    label: '模版名称：'
  }
]
export default {
  props: ['customPathList', 'systemType', 'routePath', 'propertyPath'],
  mixins: [classify],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.classifyId = ''
    obj.type1 = ''
    obj.type2 = ''
    obj.type3 = ''
    obj.templetDictPropertiesForSpuCertainly = [] // spu 必要项
    obj.templetDictPropertiesForSpuNotCertainly = [] // spu 非必要项
    obj.templetDictPropertiesForSkuCertainly = [] // sku 必要项
    obj.templetDictPropertiesForSkuNotCertainly = [] // sku 非必要项
    obj.templetPropertiesForSpuCertainly = [] // spu 必要项
    obj.templetPropertiesForSpuNotCertainly = [] // spu 非必要项
    obj.templetPropertiesForSkuCertainly = [] // sku 必要项
    obj.templetPropertiesForSkuNotCertainly = [] // sku 非必要项
    return {
      obj,
      schema,
      objId: this.$route.params.id,
      classifyId: this.$route.query.classifyId,
      inUse: this.$route.query.inUse,
      source: this.$route.query.source,
      propertyData: [],
      totalSelectData: [],
      initCount: 0,
      tempClassifyId: '',
      attrs: {},
      cacheData: {},
      rules: {
        name: { required: true, message: '必填项', trigger: 'blur' }
      },
      STENCIL_TYPE
    }
  },
  created () {
    this._initAttrs()
    if (this.objId) {
      this.handlePropertyDetail(this.objId)
    }
    // 属性项获取
    this.handlePropertyList()
    // 新建模 => 查询物资类型信息
    this.handleClassifyName()
  },
  mounted () {
    this._deletePropert(this.source)
  },
  methods: {
    handleClassifyName () {
      if (!this.classifyId) return
      this.obj.classifyId = this.classifyId
      classifyApi.getById(this.classifyId).then(result => {
        if (result.flag) this.obj.classifyName = this.templateTypeName(result)
      })
    },
    handlePropertyDetail (id) {
      if (this.source === 'group') {
        templetApi.info({ id: id || this.objId, systemType: this.systemType }).then(result => {
          if (result && result.id) {
            let dataRes = this._sttributeSplit(result)
            if (!dataRes.templetPropertiesForSpuNotCertainly) {
              dataRes.templetPropertiesForSpuNotCertainly = []
            }
            if (!dataRes.templetPropertiesForSkuNotCertainly || Number(this.systemType) !== STENCIL_TYPE[0].id) {
              dataRes.templetPropertiesForSkuNotCertainly = []
            }
            if (!dataRes.templetPropertiesForSkuCertainly || Number(this.systemType) !== STENCIL_TYPE[0].id) {
              dataRes.templetPropertiesForSkuCertainly = []
            }
            this.tempObj = Object.assign({}, this._templateTypeId(dataRes))
            this.obj = this._templateTypeId(dataRes)
            this.tempClassifyId = this.obj.classifyId
            if (this.objId) this.obj.classifyName = setUpClassifyName(dataRes.classifyVoObject)
            this.cacheData = JSON.parse(JSON.stringify(dataRes))
          }
        })
      }
    },
    handlePropertyList () {
      templetApi.propertylist({ offset: 0, pagesize: 10000, systemType: this.systemType }).then(result => {
        if (result) {
          let res = result.list || result
          for (let i = 0; i < res.length; i++) {
            let item = res[i]
            item.propertyRealtionId = item.id
            item.propertyType = item.type
            delete item.code
            delete item.type
            delete item.id
          }
          this.propertyData = res
        }
      })
    },
    handlePopoverSelect ({ data, attr, type }) {
      data.type = type
      if (attr === 'templetDictPropertiesForSpuCertainly' || attr === 'templetDictPropertiesForSkuCertainly' || attr === 'templetPropertiesForSpuCertainly' || attr === 'templetPropertiesForSkuCertainly') {
        data.isMust = 1
      } else {
        data.isMust = 0
      }
      let index1 = this.cacheData[attr] && this.cacheData[attr].findIndex(item => {
        return item.propertyRealtionId === data.propertyRealtionId && item.propertyType === data.propertyType
      })
      if (index1 > -1) {
        this.obj[attr].push(this.cacheData[attr][index1])
      } else {
        this.obj[attr].push(data)
      }
    },
    handleClose ({ val, data, dataIndex, changeColor }) {
      data.splice(dataIndex, 1)
    },
    handleTag ({ val, data, dataIndex, changeColor, attr }) {
      // if (data[dataIndex].templetDictPropertyId) return // 全局定义数据不可切必填项
      if (changeColor) {
        let color = data[dataIndex].color
        if (color === 'info' || !color) {
          data[dataIndex].color = 'primary'
          data[dataIndex].isMust = 1
        } else {
          data[dataIndex].color = 'info'
          data[dataIndex].isMust = 0
        }
        this.obj[attr] = JSON.parse(JSON.stringify(this.obj[attr]))
      }
    },
    submitForm (form) {
      if (this.inUse === 'false' && this.tempClassifyId && !this.obj.classifyId) this.obj.classifyId = this.tempClassifyId
      if (!this.obj.classifyId) {
        this.$messageTips(this, 'warning', '请先选择好物资类型')
        return
      }
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.obj)
          params.classifyVoObject
          delete params.type1
          delete params.type2
          delete params.type3
          if (this.$route.query.iscopy === this.objId) delete params.id
          if ((this.obj.templetDictPropertiesForSpuCertainly && !this.obj.templetDictPropertiesForSpuCertainly.length) || (this.obj.templetPropertiesForSpuCertainly && !this.obj.templetPropertiesForSpuCertainly.length)) {
            Number(this.systemType) === STENCIL_TYPE[0].id ? this.$messageTips(this, 'warning', '请选择spu必要项') : this.$messageTips(this, 'warning', '请选择必要项')
            return
          }
          if (Number(this.systemType) === STENCIL_TYPE[0].id) {
            if ((this.obj.templetDictPropertiesForSkuCertainly && !this.obj.templetDictPropertiesForSkuCertainly.length) || (this.obj.templetPropertiesForSkuCertainly && !this.obj.templetPropertiesForSkuCertainly.length)) {
              this.$messageTips(this, 'warning', '请选择sku必要项')
              return
            }
          }
          if (params.templetDictPropertiesForSpuCertainly) {
            params.templetDictPropertiesForSpuNotCertainly.length && this._isMustReset(params.templetDictPropertiesForSpuNotCertainly)
            params.templetDictPropertiesForSkuNotCertainly.length && this._isMustReset(params.templetDictPropertiesForSkuNotCertainly)
            params.templetDictPropertiesForSpuCertainly.length && this._isMustReset(params.templetDictPropertiesForSpuCertainly, true)
            params.templetDictPropertiesForSkuCertainly.length && this._isMustReset(params.templetDictPropertiesForSkuCertainly, true)
            this._multipleExecution(params.templetDictPropertiesForSkuNotCertainly, params.templetDictPropertiesForSpuNotCertainly, params.templetDictPropertiesForSpuCertainly, params.templetDictPropertiesForSkuCertainly)
            this._mergeAttribute(params, 'templetDictPropertiesForSpuCertainly', 'templetDictPropertiesForSkuCertainly', 'templetDictPropertiesForSpuNotCertainly', 'templetDictPropertiesForSkuNotCertainly', 'dict')
          }
          if (params.templetPropertiesForSpuCertainly) {
            params.templetPropertiesForSpuNotCertainly && this._isMustReset(params.templetPropertiesForSpuNotCertainly)
            params.templetPropertiesForSkuNotCertainly && this._isMustReset(params.templetPropertiesForSkuNotCertainly)
            params.templetPropertiesForSpuCertainly && this._isMustReset(params.templetPropertiesForSpuCertainly, true)
            params.templetPropertiesForSkuCertainly && this._isMustReset(params.templetPropertiesForSkuCertainly, true)
            this._multipleExecution(params.templetPropertiesForSkuNotCertainly, params.templetPropertiesForSpuNotCertainly, params.templetPropertiesForSpuCertainly, params.templetPropertiesForSkuCertainly)
            this._mergeAttribute(params, 'templetPropertiesForSpuCertainly', 'templetPropertiesForSkuCertainly', 'templetPropertiesForSpuNotCertainly', 'templetPropertiesForSkuNotCertainly')
          }
          if (this.source === 'group') {
            templetApi.updateTemplet(params).then(result => {
              if (result && result.id) {
                let inUse = this.objId ? this.inUse : true
                this.$router.push(`/${getFirstRoutePath(this.$route.path, 1)}/${this.$route.query.propertyPath}/${result.id}?source=group&inUse=${inUse}&customPathList=${this.customPathList}&routePath=${this.routePath}&propertyPath=${this.propertyPath}&systemType=${this.systemType}`)
              }
            })
          }
        }
      })
    },
    _multipleExecution () {
      for (let i = 0; i < arguments.length; i++) {
        this._lineNumberSet(arguments[i])
      }
    },
    _lineNumberSet (arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i].lineNumber = i + 1
      }
    },
    _isMustReset (arr, flag) {
      for (let i = 0; i < arr.length; i++) {
        let item = arr[i]
        if (flag) item.isMust = 1
        if (!flag && item.isMust !== 1) item.isMust = 0
      }
    },
    _resetTotalSelectData () {
      if (this.source !== 'group') this.totalSelectData = [...this.obj.templetDictPropertiesForSpuCertainly, ...this.obj.templetDictPropertiesForSpuNotCertainly, ...this.obj.templetDictPropertiesForSkuCertainly, ...this.obj.templetDictPropertiesForSkuNotCertainly]
      if (this.source === 'group') this.totalSelectData = [...this.obj.templetPropertiesForSpuCertainly, ...this.obj.templetPropertiesForSpuNotCertainly, ...this.obj.templetPropertiesForSkuCertainly, ...this.obj.templetPropertiesForSkuNotCertainly]
    },
    _templateTypeId (data) {
      data.type1 = data.classifyVoObject.classifyObject ? data.classifyVoObject.classifyObject.id : ''
      data.type2 = data.type1 && data.classifyVoObject.classifyObject.classifyObject ? data.classifyVoObject.classifyObject.classifyObject.id : ''
      data.type3 = data.type2 && data.classifyVoObject.classifyObject.classifyObject.classifyObject ? data.classifyVoObject.classifyObject.classifyObject.classifyObject.id : ''
      this._initAttrs()
      return data
    },
    _initAttrs () {
      this.attrs = {
        spuCertainly: this.source === 'group' ? 'templetPropertiesForSpuCertainly' : 'templetDictPropertiesForSpuCertainly',
        spuNotCertainly: this.source === 'group' ? 'templetPropertiesForSpuNotCertainly' : 'templetDictPropertiesForSpuNotCertainly',
        skuCertainly: this.source === 'group' ? 'templetPropertiesForSkuCertainly' : 'templetDictPropertiesForSkuCertainly',
        skuNotCertainly: this.source === 'group' ? 'templetPropertiesForSkuNotCertainly' : 'templetDictPropertiesForSkuNotCertainly'
      }
    },
    _deletePropert (flag) {
      if (flag) {
        delete this.obj.templetDictPropertiesForSpuCertainly // spu 必要项
        delete this.obj.templetDictPropertiesForSpuNotCertainly // spu 非必要项
        delete this.obj.templetDictPropertiesForSkuCertainly // sku 必要项
        delete this.obj.templetDictPropertiesForSkuNotCertainly //
      } else {
        delete this.obj.templetPropertiesForSpuCertainly // spu 必要项
        delete this.obj.templetPropertiesForSpuNotCertainly // spu 非必要项
        delete this.obj.templetPropertiesForSkuCertainly // sku 必要项
        delete this.obj.templetPropertiesForSkuNotCertainly //
      }
    }
  },
  watch: {
    'obj': {
      handler (v) {
        this._resetTotalSelectData()
      },
      deep: true
    }
  },
  components: {
    templetComp,
    templetMonolayerComp
  }
}
</script>
<style scoped>
.queryClass {min-width: 220px; display: inline-block; margin-right: 5px}
.steps { padding: 30px 0; padding-bottom: 50px}
.steps-box ul li { display: inline; line-height: 24px; color: #999}
.steps-box ul li .line { background: #e9e9e9; height: 3px; display: inline-block; margin: 0 50px; margin-top: 10px; width: 40%}
.circle { width: 24px; height: 24px; border-radius: 50%; background: #e9e9e9; display: inline-block; text-align: center; color: #bbb; margin-right: 10px}
.steps-box ul li.active { color: #1C7BEF}
.steps-box ul li.active .circle, .steps-box ul li.active .line { background: #1C7BEF; color: #fff;}
</style>

