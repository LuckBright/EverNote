<!-- 管理工作站中，新建业务实例通用组件 -->
<template>
  <el-container
    class="height"
    v-loading.fullscreen.lock="loadingfull"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 1)">
    <el-header>
      <h2 class="alg_c">{{objId ? mainTitle : formTitle}}</h2>
    </el-header>
    <el-tabs v-model="activeName" @tab-click="handleClick" v-if="!isClinic">
      <el-tab-pane label="档案信息" name="first">
        <slot name="materialheader"></slot>
        <!-- 1、分栏  多栏展示 start -->
        <template v-if="multiColumn">
          <el-container class="row pos_re" v-if="classifyId">
            <el-main class="flex_column_full box_style" id="boxMain" v-resize>
              <slot name="header"></slot>
              <!-- 1a、分栏左侧表格 => left start -->
              <div v-for="(form, index) in formSchemas" :key="index + idKey" :class="{pr50: true, block_style: form.schema && form.schema.length}">
                <h4 v-if="form.schema && form.schema.length" class="title">
                  <span class="alg_r inline-block" :style="{'width': `${labelWidth - 10}px`}">{{form.title || subTitle}}</span>
                  <span class="warning f12 cGray6" v-if="form.warning" v-html="form.warning"></span>
                </h4>
                <ever-form2
                  :label-width="labelWidth + 'px'"
                  :schema="form.schema"
                  v-model="obj"
                  ref="form"
                  :span="12"
                  :rules="rules"
                  @submit="submitForm()"
                  onsubmit="return false;"
                  :nosubmit="true">
                  <template v-for="slot in form.slot" :slot="slot">
                    <slot :name="slot"></slot>
                  </template>
                </ever-form2>
              </div>
              <!-- 1a、分栏左侧表格 => left end -->
            </el-main>
            <el-aside class="no-box-sha flex_column_full pos_ab right_style" style="right: 1px" width="32%">
              <!-- 1b、分栏右侧表格 => right start -->
              <h4 class="title alg_r" :style="{'width': `${labelWidth - 10}px`}" v-html="rightTitle"></h4>
              <ever-form2
                class="pr50"
                :label-width="labelWidthRight + 'px'"
                :schema="schemaRight"
                v-model="obj"
                ref="formRight"
                :span="24"
                :rules="rules"
                @submit="submitForm()"
                onsubmit="return false;"
                :nosubmit="true">
              </ever-form2>
              <!-- 1b、分栏右侧表格 => right end -->
            </el-aside>
          </el-container>
        </template>
        <!-- 1、分栏  多栏展示 start -->

        <!-- 2、简单模式（一个页面一个form表单）start -->
        <template v-else>
          <h4 v-if="showSubTitle" class="title alg_r" :style="{'width': `${labelWidth - 10}px`}" v-html="subTitle"></h4>
          <slot name="header"></slot>
          <ever-form2
            :label-width="labelWidth + 'px'"
            :schema="schema"
            v-model="obj"
            ref="form"
            :span="12"
            :rules="rules"
            @submit="submitForm()"
            onsubmit="return false;"
            :nosubmit="true">
          </ever-form2>
          <slot name="skuInfo"></slot>
        </template>
        <!-- 2、简单模式（一个页面一个form表单）end -->

        <!-- 3、操作按钮 start -->
        <el-footer class="df cls_footer" v-if="cacheObj.id || (schema.length && needSave)" height="32px">
          <template v-if="schema.length && needSave">
            <el-button
              type="primary"
              @click="submitForm()"
              v-if="showSave"
              size="small"
              class="pl30 pr30"
              :loading="saveLoading"
            >保存</el-button>
            <el-button
              v-else
              type="primary"
              @click="handlerEdit"
              size="small"
              :loading="saveLoading"
            >编辑</el-button>
            <el-button
              type="primary"
              @click="submitForm('reset')"
              v-if="showSave && !objId"
              size="small"
              :loading="saveLoading"
            >保存并新增</el-button>
          </template>
          <slot v-if="cacheObj.id" name="footer"></slot>
        </el-footer>
        <!-- 3、操作按钮 end -->
      </el-tab-pane>
      <el-tab-pane label="价格维护" name="second">
        <!-- 机构树 管理 -->
        <material-tree-table
          ref="treeTable"
          v-if="objId && serviceInfo"
          :key="serviceInfo.id"
          :isDateial="true"
          :priceManage="priceManage"
          :serviceInfo="serviceInfo"
          :serviceId="serviceInfo.serviceId"
          :isConcise="isConcise">
        </material-tree-table>
        <div v-else class="f_bold f16 alg_c cGray6" style="line-height: 150px">请先维护“档案信息”页面</div>
      </el-tab-pane>
    </el-tabs>
    <div v-if="isClinic">
        <slot name="materialheader"></slot>
        <!-- 1、分栏  多栏展示 start -->
        <template v-if="multiColumn">
          <el-container class="row pos_re" v-if="classifyId">
            <el-main class="flex_column_full box_style" id="boxMain" v-resize>
              <slot name="header"></slot>
              <!-- 1a、分栏左侧表格 => left start -->
              <div v-for="(form, index) in formSchemas" :key="index + idKey" :class="{pr50: true, block_style: form.schema && form.schema.length}">
                <h4 v-if="form.schema && form.schema.length" class="title">
                  <span class="alg_r inline-block" :style="{'width': `${labelWidth - 10}px`}">{{form.title || subTitle}}</span>
                  <span class="warning f12 cGray6" v-if="form.warning" v-html="form.warning"></span>
                </h4>
                <ever-form2
                  :label-width="labelWidth + 'px'"
                  :schema="form.schema"
                  v-model="obj"
                  ref="form"
                  :span="12"
                  :rules="rules"
                  @submit="submitForm()"
                  onsubmit="return false;"
                  :nosubmit="true">
                  <template v-for="slot in form.slot" :slot="slot">
                    <slot :name="slot"></slot>
                  </template>
                </ever-form2>
              </div>
              <!-- 1a、分栏左侧表格 => left end -->
            </el-main>
            <el-aside class="no-box-sha flex_column_full pos_ab right_style" style="right: 1px" width="32%">
              <!-- 1b、分栏右侧表格 => right start -->
              <h4 class="title alg_r" :style="{'width': `${labelWidth - 10}px`}" v-html="rightTitle"></h4>
              <ever-form2
                class="pr50"
                :label-width="labelWidthRight + 'px'"
                :schema="schemaRight"
                v-model="obj"
                ref="formRight"
                :span="24"
                :rules="rules"
                @submit="submitForm()"
                onsubmit="return false;"
                :nosubmit="true">
              </ever-form2>
              <!-- 1b、分栏右侧表格 => right end -->
            </el-aside>
          </el-container>
        </template>
        <!-- 1、分栏  多栏展示 start -->

        <!-- 2、简单模式（一个页面一个form表单）start -->
        <template v-else>
          <h4 v-if="showSubTitle" class="title alg_r" :style="{'width': `${labelWidth - 10}px`}" v-html="subTitle"></h4>
          <slot name="header"></slot>
          <ever-form2
            :label-width="labelWidth + 'px'"
            :schema="schema"
            v-model="obj"
            ref="form"
            :span="12"
            :rules="rules"
            @submit="submitForm()"
            onsubmit="return false;"
            :nosubmit="true">
          </ever-form2>
          <slot name="skuInfo"></slot>
        </template>
        <!-- 2、简单模式（一个页面一个form表单）end -->

        <!-- 3、操作按钮 start -->
        <el-footer class="df cls_footer" v-if="cacheObj.id || (schema.length && needSave)" height="32px">
          <template v-if="schema.length && needSave">
            <el-button
              type="primary"
              @click="submitForm()"
              v-if="showSave"
              size="small"
              class="pl30 pr30"
              :loading="saveLoading"
            >保存</el-button>
            <el-button
              v-else
              type="primary"
              @click="handlerEdit"
              size="small"
              :loading="saveLoading"
            >编辑</el-button>
            <el-button
              type="primary"
              @click="submitForm('reset')"
              v-if="showSave && !objId"
              size="small"
              :loading="saveLoading"
            >保存并新增</el-button>
          </template>
          <slot v-if="cacheObj.id" name="footer"></slot>
        </el-footer>
      </div>
  </el-container>
</template>

<script>
import * as formCustom from '@/util/formcustom'
import { debounce, parserJSON, defaultObjectKey } from '@/util/common'
import templateApi from '@/manages/api/template'
import storage from '@/util/storage'
import materialTreeTable from '@/manages/page/material/components/material.manage.vue'
const CURRENT_INDEX = 'CURRENT_INDEX' // 本地存储label => src/manages/mixin/selectioncheckboxmixin.js
export default {
  props: {
    isClinic: Boolean, // 机构属性（是否机构创建）
    multiColumn: Boolean, // 是否分栏展示，左右布局
    col: { // 分栏展示配置 -- 栅格化布局对象
      type: Object,
      default () {
        return {
          gutter: 20,
          left: 17,
          right: 7
        }
      }
    },
    getByIdFormData: {  //  外部传入 getById 获取的数据
      type: Object,
      default: () => ({})
    },
    customFormSchemas: { // 分栏展示，表单左侧：formSchemas （schema 或者属性值（属性值通过模板code生成schema）） => form configure list 表单配置列表
      type: Array,
      default: () => []
    },
    customRightSchema: { // 自定义右侧form表单， 如果有值，会被拼接进入schemaRight中
      type: Array,
      default: () => []
    },
    customLocalSchema: { // 自定义formschema中存在本地（机构属性），始终保持可以编辑状态
      type: Array,
      default: () => []
    },
    needSave: { // 机构下是否需要显示保存/编辑按钮
      type: Boolean,
      default: true
    },
    priceManage: Boolean,
    isConcise: {      //  是否是简洁列表页 过来
      type: Boolean,
      default: true
    },
    refTreeName: String,
    refTreeSaveRelation: String,
    isSimpleForm: Boolean, // 分栏展示，左侧模板展示纯接口模板数据（是否单表单 -- formSchemas.length = 1）（拼接进入formSchemas）
    rightTitle: { // 右侧表单标题名称
      type: String,
      default: ''
    },
    picConfig: { // 分栏展示， 右侧图片自定义配置展示
      type: Array,
      default: () => []
    },
    watchKeyCallback: Array, // 需要监听的字段[{key,cb}] key => 监听obj[key], cb => $watch(obj[key], cb) 回调函数
    idKey: { // 每个业务类型都有各自不一样的id名称，需要从外面传入过来
      type: String,
      default: 'id'
    },
    serviceInfo: {
      type: Object,
      default: () => {}
    },
    formMainTitle: Function, // 有objId时，显示表单内容标题
    showSubTitle: Boolean, // 是否展示副标题
    subTitle: { // 副标题名称
      type: String,
      default: '基本信息'
    },
    sourceKey: { // 模板属性数据源Key
      type: String,
      default: 'materialPropertys'
    },
    api: {
      type: Object,
      default: () => ({})
    },
    ignoreKey: { // ext数据paserJSON时， 不需要处理的字段
      type: Array,
      default: () => []
    },
    formTitle: String, // 表单默认标题
    labelWidth: { // 180 or 120 如有其它值，请添加对应的table-btn-ml_[name] class
      type: Number,
      default: 180
    },
    labelWidthRight: { // 分栏右侧表格label宽度
      type: Number,
      default: 120
    },
    classifyId: String, // 类型（物资、人员、科室等）：分类ID
    systemTypeObject: { // 枚举业务类型对象（同classifyId类似，具体业务类型参数）
      type: Object,
      default: () => ({})
    },
    everHook: { // hook 各自业务在不同节点需要处理的方法对象
      type: Object,
      default: () => ({})
    },
    submitDataObject: {   //  每个业务需要单独提交于 ext之外的key值
      type: Object,
      default: () => ({})
    },
    filterRightKey: {     //  右侧需要过滤掉的模版keyCode
      type: Array,
      default: () => []
    },
    routerQueryArray: {     //  创建成功过后 刷新当前页面 路由需要携带的参数
      type: Array,
      default: () => []
    },
    showSaveBtn: {    //  是否显示 保存按钮
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      loadingfull: false,
      reset: false,
      activeName: 'first',
      schema: [],
      formSchemas: [],
      schemaRight: [],
      unwatchs: [], // 存储所有取消监听函数
      schemaOtherTemplate: [], // 模板字段中，左侧挑剩的
      obj: {},
      rules: {},
      objId: this.$route.params.id,
      haveManage: !!(+this.$route.query.haveManage),
      saveLoading: false,
      onlyRead: false,
      changeObj: null,
      currentIndex: null,
      templateData: {}, // 模板数据
      cacheObj: {}, // 缓存一份obj数据
      mainTitle: ''
    }
  },
  created () {
    if (this.objId) {
      this.onlyRead = true
      this.loadingfull = true
      if (!this.isClinic) {
        this.onlyRead = false
      }
    }
    this.currentIndex = storage.getSessionStorage(CURRENT_INDEX)
  },
  directives: {
    resize: { // 轮询修改药理分类展开无法全部展示
      bind: function (el) {
        function set () {
          if (document.querySelector('#boxMain .cascader-multi')) el.scrollLeft = 2000
        }
        el.__vueReize__ = setInterval(set, 200)
      },
      unbind: function (el) {
        clearInterval(el.__vueReize__)
      }
    }
  },
  components: {
    materialTreeTable
  },
  computed: {
    showSave () {
      return (!this.onlyRead && !this.isClinic && !this.haveManage) || // 管理工作站中编辑状态非集中管控
        (this.haveManage && this.isClinic && !this.onlyRead) || // 机构中集中管控编辑状态展示保存
        (!this.haveManage && this.isClinic && this.onlyRead) || // 机构中非集中管控查看时展示保存
        (this.customLocalSchema.length && this.isClinic && this.onlyRead && !this.haveManage) || // todo: 机构没有编辑状态，只有查看状态， 机构只能编辑机构化属性
        (!this.onlyRead && !this.objId && !this.haveManage) || // 创建时展示保存
        (!this.onlyRead && this.objId && this.haveManage) // 集中管控编辑时展示保存
    }
  },
  methods: {
    handleClick () {

    },
    resetTempalteForm () {
      this.obj = {}
      this.schema = []
      this.rules = {}
      this.formSchemas = []
      this.everHook.afterSubmitForm('reset')
    },
    async handlerEdit () {
      this.onlyRead = false
      this.loadingfull = true
      await this.renderTemplate(this.templateData)
      this.obj = Object.assign(this.obj, this.cacheObj, this.cacheObj.ext)
      delete this.obj.ext
      setTimeout(() => {
        this.clearValidate()
      })
    },
    async getTemplate (classifyId) {
      // 解析模板数据
      const params = { classifyId, systemType: this.systemTypeObject.id }
      const template = templateApi.getSourceByTempletForCreateRecord(params)
      let objData
      if (this.objId) {
        // 区分管理工作站和机构工作站查询明细信息接口 =>  机构查询请在api.js 中命名’getLocalById‘、管理工作站命名’getById‘
        const name = this.isClinic ? 'getLocalById' : 'getById'
        if (this.getByIdFormData && this.getByIdFormData.id) {
          objData = Promise.resolve(this.getByIdFormData)
        } else {
          objData = this.api[name](this.objId)
        }
      } else {
        objData = Promise.resolve({})
      }
      Promise.all([template, objData]).then(([temp, obj]) => {
        this.templateData = temp // 缓存模板数据
        if (typeof obj.ext === 'string') obj.ext = JSON.parse(obj.ext)
        obj.ext && delete obj.ext.ext // 如果ext中包含ext（bugfix）
        this.$emit('update:obj', obj) // 同步通知父组件obj数据
        this.cacheObj = JSON.parse(JSON.stringify(obj)) // 缓存obj数据
        this.renderTemplate(this.templateData) // 需要先渲染模板，模板中会初始化obj -- 渲染模板
      })
    },
    simpleFormSchema (schema) {
      // 简单分栏页面，左侧只有一个表单的情况下， 把schema转换成一个数组给formSchemas生成表单
      this.formSchemas = [{ schema }]
    },
    createObjForCustomSchemaRight () {
      // 自定义schema 和 本身右侧form的schema 合并，并且生成obj merge this.obj中（可监听属性）
      const schemaOtherTemplate = JSON.parse(JSON.stringify(this.schemaOtherTemplate))
      const customRightSchema = JSON.parse(JSON.stringify(this.customRightSchema))
      this.schemaRight = [].concat(schemaOtherTemplate, customRightSchema)
      this.createOnlyReadSchema(this.schemaRight)
      this.dynamicCreateObj(this.schemaRight)
    },
    createOnlyReadSchema (from) { // 查看时，生成readonlyitem
      if (this.onlyRead && from) {
        from.forEach(schema => {
          const symbol = ':'
          if (schema.label && !['evereditor'].includes(schema.comp) && !this.customLocalSchema.includes(schema.name)) {
            schema.comp = 'readonlyitem'
            schema.label = schema.label + symbol
            schema.props = Object.assign({}, schema.props ? schema.props : {}, {
              defaultValue: '-'
            })
          }
        })
      }
    },
    createObjForCustomSchemas () {
      const customFormSchemas = JSON.parse(JSON.stringify(this.customFormSchemas))
      const leftSchemaKey = [].concat(this.filterRightKey) // 所有左侧已经使用过的模板key
      const allSchema = [] // merge all schema 用来生成obj
      this.formSchemas = []
      customFormSchemas.map(form => {
        let totalSpan = 0
        let formTemp = Object.create(form, { schema: { value: [] } }) // 初始化schema为空数组
        form.schema && form.schema.forEach(schema => {
          const newRow = !!(totalSpan % 24 === 0) // 计算所有span之和取余，决定是否单独占据一行
          if (schema instanceof Object) {
            totalSpan += schema.span || 12
            Object.assign(schema, { newRow })
            formTemp.schema.push(schema)
            allSchema.push(schema)
          } else {
            let [name, span = 0] = schema.split(':') // 模板字段拆分为name 和 span(字符串解析“:”)
            span = +span // form中span为Number
            const findV = this.schema.find(item => item.name === name)
            if (findV) {
              totalSpan += span || findV.span
              formTemp.schema.push(Object.assign({}, findV, { newRow, span: span || findV.span }))
              leftSchemaKey.push(name)
              allSchema.push(findV)
            }
          }
        })
        this.formSchemas.push(formTemp)
      })
      if (this.picConfig.length) { // 更改照片类schema
        this.picConfig.forEach(config => {
          const index = this.schema.findIndex(item => config.name === item.name)
          if (~index) {
            const curSchema = this.schema[index]
            config.props.disabled = this.onlyRead // 图片是否可编辑  跟随是否查看属性设置
            config.props = Object.assign({}, curSchema.props, config.props)
            const schema = Object.assign({}, curSchema, config)
            // sortPosition 在config中设置sortPosition 可以指定该schema项展示位置【指定图片展示位置】
            if (schema.hasOwnProperty('sortPosition')) {
              const position = schema.sortPosition - 1
              const sortPosition = position < 0 ? 0 : position // 如果排序位置小于0 那就放在第0位
              this.schema.splice(index, 1) // 先删除【防止重复】
              this.schema.splice(sortPosition, 0, schema) // 后插入
            } else {
              this.schema.splice(index, 1, schema)
            }
          }
        })
      }
      // 去除左侧form中挑选后剩下的模板内容，赋值给schemaOtherTemplate（模板内容 + 组件内部自定义自动生成分栏右侧form表单）
      this.schemaOtherTemplate = this.schema.filter(item => {
        const flag = !leftSchemaKey.includes(item.name)
        if (flag) item.span = 24 // 右侧获取模板字段span设置为24 【一行一列】
        return flag
      })
      if (this.onlyRead) {
        this.formSchemas.map(form => {
          this.createOnlyReadSchema(form.schema)
        })
      }
      this.dynamicCreateObj(allSchema)
    },
    dynamicCreateObj (schema) {
      // 所有schema生成一个obj
      const obj = this.$ever.createObjFromSchema(schema)
      this.obj = Object.assign({}, obj, this.obj, this.cacheObj)
      if (!this.objId) this.cacheObj = Object.assign({}, this.obj, this.cacheObj)
    },
    validateForms () {
      if (this.multiColumn && (!this.onlyRead || this.isClinic)) { // 分栏结构，检验左右两边form 在编辑状态或者机构下
        const forms = this.$refs.form
        const aValid = []
        forms.forEach(form => {
          aValid.push(new Promise((resolve, reject) => {
            form.$refs.form.validate(valid => {
              resolve(valid)
            })
          }))
        })
        aValid.push(new Promise((resolve, reject) => {
          this.$refs.formRight.$refs.form.validate(valid => {
            resolve(valid)
          })
        }))
        Promise.all([...aValid]).then((valid) => {
          if (valid.every(v => v)) {
            this.afterValidate(valid)
          } else {
            this.$messageTips(this, 'warning', '请检查您输入的内容是否有误，或者有必填项未填写')
          }
        }).catch((e) => {
          console.error(e, 'e')
        })
      } else {
        this.$refs.form.$refs.form.validate(valid => {
          this.afterValidate(valid)
        })
      }
    },
    afterValidate: debounce(function (valid) {
      // 如有拼接表单，即从父组件通过slot传递进来的form表单验证，可以在 everHook.beforeSubmitForm中校验
      let submitDataObject = {}
      if (this.everHook.beforeSubmitForm) {
        submitDataObject = this.everHook.beforeSubmitForm(this.obj)
      }
      if (valid) {
        if (!submitDataObject) return false
        // const groupId = this.$route.query.groupId
        this.saveLoading = true
        let params = {
          systemType: this.systemTypeObject.id, // 业务类型ID
          classifyId: this.classifyId,
          isClinic: this.isClinic,
          id: this.obj.id
        }
        // ext里面 value 为空的key 添加默认 数据类型的值
        // params.ext = defaultObjectKey(this.templateData.templetProperties, this.obj)
        params.ext = defaultObjectKey(this.templateData.templetPropertiesForSpu || this.templateData.templetDictPropertiesForSpu || this.templateData.templetProperties, this.obj)
        params = Object.assign({}, params, submitDataObject)
        if (this.objId && this.isClinic && !this.haveManage) { // 只有在机构集中管控编辑下才执行恢复原始数据
          params = Object.assign({}, params, this.cacheObj)
        }
        // 对提交的数据 进行处理
        if (this.everHook.submitParamsHandle) {
          params = this.everHook.submitParamsHandle(params)
        }
        delete params.ext.ext // 保存时，如果ext中包含ext只提交一个ext（bugfix）
        Promise.all([this.api.createOrUpdate(params)]).then(([template]) => {
          this.handlerFormSubmit(template)
        })
      }
    }),
    handlerFormSubmit (result) {
      if (result) {
        this.$messageTips(this, 'success', `${this.objId ? '修改成功' : '创建成功'}`)
        !this.objId && storage.setSessionStorage(CURRENT_INDEX, 0)
        if (this.everHook.setInputDisabled) this.everHook.setInputDisabled()
        setTimeout(() => { // es 有延迟，直接回到列表页面会存在新创建数据列表中查不到
          // "idKey" 然后端统一返回同一个字段
          // if ((this.isConcise || this.isClinic) && result[this.idKey]) {
          //   // 公用跳转路由处理
          //   this.handlerRouterPath(result)
          // } else {
          if (this.everHook.afterSubmitForm) {
            if (this.reset) {
              this.resetTempalteForm()
            } else {
              this.everHook.afterSubmitForm(result[this.idKey]) // 如果保存后需要其他操作，传递该方法执行
            }
          } else {
            this.$router.go(-1)
          }
          // }
          setTimeout(() => {
            this.saveLoading = false
          }, 1000)
        }, 1500)
      }
    },
    handlerRouterPath (result) {
      //  简洁列表页 创建 成功刷新当前页面  isConcise
      if (!this.objId) {
        let thisPath = this.$route.path
        let jumpPath = `/${thisPath.split('/')[1]}/routerback?backUrl=`
        if (this.isClinic) {
          jumpPath += `${thisPath}${result.localSectionId || result[this.idKey]}${this.handlerQueryString(result)}`
          this.$router.replace(jumpPath)
        } else {
          this.$router.replace(`${jumpPath}${thisPath}/${result[this.idKey]}?isConcise=1`)
        }
      }
    },
    handlerQueryString (result) {
      let obj = {}
      let queryStringArr = []
      let queryString = ''
      if (!this.routerQueryArray.length) return queryString
      this.routerQueryArray.forEach(item => {
        if (item.isFind) {
          obj[item.name] = result[item.value] || ''
        } else {
          obj[item.name] = item.value
        }
      })
      for (let key in obj) {
        queryStringArr.push(key + '=' + obj[key])
      }
      if (queryStringArr.length) {
        queryString = '?' + queryStringArr.join('&')
      }
      return encodeURIComponent(queryString)
    },
    renderTemplate (result) {
      let renderSpu = result.templetPropertiesForSpu || result.templetDictPropertiesForSpu || result.templetProperties
      const beforeFormData = {}
      // 获取表单数据之前可以手动添加一些数据（obj，schema，rules）
      this.everHook.beforeFormCreated && this.everHook.beforeFormCreated(beforeFormData, this.onlyRead, result)
      const ops = { comp: 'readonlyitem' }
      if (this.customLocalSchema.length) ops.ignore = this.customLocalSchema
      !this.multiColumn && Object.assign(ops, { label: ':' }) // 非分栏模式下查看详情lebal添加分号
      // 第四个参数true 设置新版本所有单选和多选存储数据结构为useObject类型
      const formData = formCustom.createdSchemaAndObjectValue(result.keysForSpu || result.keys, renderSpu, this.onlyRead ? ops : {}, true)
      // result[this.systemTypeObject.attributeName || 'templetProperties'] Todo: 后续其他业务取名动态传入
      // this.obj = formCustom.readonlyObjItem(formData.obj, result['templetProperties'], true)
      beforeFormData.schema && (formData.schema = beforeFormData.schema.concat(formData.schema))
      beforeFormData.rules && (formData.rules = Object.assign(formData.rules, beforeFormData.rules))
      beforeFormData.obj && (formData.obj = Object.assign(formData.obj, beforeFormData.obj))
      // 创建表单之前可以操作form数据（obj，schema，rules），
      this.everHook.formCreated && this.everHook.formCreated(formData, this.onlyRead, this.cacheObj)
      this.schema = formData.schema
      this.rules = formData.rules
      this.obj = JSON.parse(JSON.stringify(formData.obj))
      if (this.isSimpleForm) { // 分栏简洁模式（使用纯后端接口返回模板数据，单一form）
        this.simpleFormSchema(this.schema)
      } else if (this.customFormSchemas.length && this.multiColumn) { // 分栏自定义左侧表单布局（可以使用纯后端模板匹配和混插生成schema）「混插：包含属性项（生成schema）和单个schema」
        this.createObjForCustomSchemas()
      }
      this.multiColumn && this.createObjForCustomSchemaRight() // 外界传递进来自定义schema concat 生成schemaRight
      if (this.watchKeyCallback && !this.onlyRead) { // 设置watch监听器
        if (this.unwatchs.length) {
          this.unwatchs.forEach(unwatch => {
            unwatch()
          })
        }
        this.watchKeyCallback.forEach(watch => {
          const key = watch.key
          let cb = watch.cb
          if (!key) return
          if (typeof cb !== 'function') {
            cb = new Function()
            throw console.warn('监听参数没有添加cb方法，或者cb不是一个函数')
          }
          const unwatch = this.$watch('obj.' + key, async (newVal, oldVal) => {
            if (newVal && JSON.stringify(newVal) === JSON.stringify(oldVal) && !oldVal && this.objId) return
            this.updateCacheObj(key, newVal)
            await cb({ newVal, oldVal, obj: this.obj })
          })
          this.unwatchs.push(unwatch)
        })
      }
      if (this.cacheObj) {
        const objData = JSON.parse(JSON.stringify(this.cacheObj))
        // 解构ext数据
        if (objData.ext) {
          if (this.onlyRead) { // 查看状态下
            Object.keys(objData.ext).forEach(key => {
              if (!this.ignoreKey.includes(key)) {
                objData[key] = parserJSON({ data: objData.ext, property: key })
              }
            })
          } else { // 编辑状态下
            this.obj = Object.assign(this.obj, this.obj.ext, this.cacheObj.ext)
          }
        }
        if (this.objId) {
          this.everHook.beforeSeeObject ? this.everHook.beforeSeeObject(Object.assign(this.obj, objData), this.formSchemas) : Object.assign(this.obj, objData) // 当查看时，cache中存在接口返回数据，合并obj
        }
      }
      this.mainTitle = this.formMainTitle && this.formMainTitle(JSON.parse(JSON.stringify(this.obj))) // 设置标题
      this.$emit('update:formSchemas', this.formSchemas)
      this.$nextTick(() => {
        this.clearValidate()
        this.loadingfull = false
      })
    },
    submitForm: debounce(function (reset) {
      this.reset = reset
      if (this.objId && this.isClinic && !this.haveManage) { // 机构，集中管控下， 只有保存按钮，不校验表单
        this.afterValidate(true)
      } else {
        this.validateForms()
      }
    }),
    updateCacheObj (key, value) { // 更新缓存Obj数据
      if (this.cacheObj.ext && this.cacheObj.ext.hasOwnProperty(key) && (typeof this.cacheObj.ext[key] === typeof value)) {
        // 检测ext自有属性中有是否有key, 有更新缓存中变化的数据
        this.cacheObj.ext[key] = value
      }
      if (!this.objId || this.cacheObj.hasOwnProperty(key)) this.$set(this.cacheObj, key, value) // 检测自有属性中有是否有key, 有就更新更新缓存中变化的数据
    },
    clearValidate () {
      this.$nextTick(() => {
        const formRefs = this.$refs.form || []
        const rightRefs = this.$refs.formRight
        formRefs.length && formRefs.forEach(form => {
          form.$refs.form.clearValidate()
        })
        rightRefs && rightRefs.$refs.form.clearValidate()
      })
    }
  },
  watch: {
    classifyId: {
      handler (id) {
        // 初始化所有渲染数据
        this.obj = {}
        this.schema = []
        this.rules = {}
        if (id) {
          this.loadingfull = true
          this.getTemplate(id)
        }
        setTimeout(() => {
          this.clearValidate()
        })
      },
      deep: true,
      immediate: true
    },
    obj: {
      handler () {
        Object.keys(this.obj).forEach(key => {
          this.updateCacheObj(key, this.obj[key])
        })
        this.$emit('update:changeObj', this.obj) // 监听表单obj数据传递给父级组件，供需检测数据变化业务使用
        // this.everHook.formUpdated && this.everHook.formUpdated(this.obj)
      },
      deep: true
    },
    customFormSchemas: {
      handler: debounce(function (v) {
        if (v.length && this.templateData.id) {
          this.renderTemplate(this.templateData)
          if (!this.onlyRead && this.objId) this.obj = Object.assign(this.obj, this.cacheObj, this.cacheObj.ext)
        }
        this.clearValidate()
      }, 300),
      deep: true
    }
  }
}
</script>
<style scoped lang="less">
  @import '../../assets/css/app-variables.less';
  .height {
    height: 100%;
  }
  .box_style {
    flex: 0;
    flex-basis: auto;
    display: block;
    width: 68%;
    .block_style {
      border-bottom: 1px solid @col_g_09;
      &:last-child {
        border-bottom: none;
      }
    }
    background: #f8f8f8;
  }
  .right_style, .box_style {
    border: 1px solid @col_g_09;
  }
  .el-footer.cls_footer {
    margin: 10px 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-form /deep/.label-title{
    .el-form-item__label{
      font-weight: bold;
      font-size: 16px!important;
    }
  }
  .is-disabled /deep/ .el-input-group__append{
    border: 1px solid #e4e7ed!important;
  }
</style>
