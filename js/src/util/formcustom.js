import { GLOBAL_ATTR, COMP_SETTINGS, objFind, objSortBy, isNull, PROPERTY_TYPE_FOR_TEMPLET_CERTAINLY, MECHANISM_CODE, CHECK_CODE, editorBaseOpts } from '@/util/common'
import config from '@/store/config'
import { base as axios } from '@/components/baseapi'
import { MOBILE_PATRN } from '@/util/validate'

const simpleOpts = {
  // 编辑器内容实时更新
  htmlSync: true,
  // 图片上传配置
  ...editorBaseOpts
}
// 富文本工具菜单栏
const toolbars = ['Undo', 'Redo', 'Table', 'Image', 'Link', 'Bold', 'Italic', 'Strike', 'Underline', 'fontSize', 'fontFamily', 'Text Color', 'Text Background Color', 'Align Left', 'Align Center', 'Align Right', 'Align Justify']
/**
 * 根据后端模版生成表单属性（schema、obj、rules）
 * @param {arr} keys            模板perterty字段
 * @param {arr} renderData      模板源数据
 * @param {Object} opts         配置信息
 * @param {Boolean} newVersion  是否是新版本， 新版本所有单选和多选都存储对象数据使用useObject
 * @return {{schema: Array, obj: {}, rules: {}}}
 */
export const createdSchemaAndObjectValue = function (keys, renderData, opts = {}, newVersion = false) {
  let schema = []
  let obj = {}
  let rules = {}
  let totalSpan = 0
  for (let i = 0; i < keys.length; i++) {
    let item = keys[i]
    let {
      comp,
      label,
      type,
      span,
      initOptions,
      value,
      rule,
      addOrDelette,
      apiUrl,
      disabled,
      enMode,
      whImg,
      outformat,
      multiple,
      global,
      useObject,
      isGroupShow,
      autosize,
      isAutoSeach,
      isInitOptions,
      isImgMultiple
    } = _passageTypeReturnComp(renderData, item, { optsComp: opts.comp, optsCertainly: opts.certainly, optsSpan: opts.span }, newVersion)
    // opts.ignore.includes(item) (ignore中存在item 就忽略外部传入的组件名)
    if (!opts.ignore || !opts.ignore.includes(item)) {
      comp = opts.comp ? !whImg ? opts.comp : comp : comp
    }
    label = opts.label ? label + opts.label : label
    disabled = opts.disabled || disabled || false
    let props = {
      disabled,
      initOptions,
      placeholder: `请输入${label}`,
      type,
      addOrDelette,
      apiUrl,
      enMode,
      whImg,
      outformat,
      multiple,
      global,
      useObject,
      isGroupShow,
      autosize,
      isAutoSeach,
      isInitOptions,
      isImgMultiple
    }
    obj[item] = value
    if (rule.trigger || rule.change) rules[item] = rule
    if (props.type === 'text') {
      props.maxlength = 200
    } else if (props.type === 'textarea') {
      props.maxlength = 2000
    }
    let newRow = totalSpan % 24 === 0
    totalSpan += span
    if (type === 'editor') { // 富文本编辑器单独定义schema
      schema.push(Object.assign({
        name: item,
        label,
        comp: 'evereditor',
        span,
        newRow,
        props: Object.assign({}, props, { options: simpleOpts, editable: !disabled, contextmenu: false, menu: 'base', toolbars })
      }, opts.params || {}))
    } else {
      schema.push(Object.assign({
        name: item,
        label,
        comp,
        span,
        newRow,
        props: Object.assign({}, props)
      }, opts.params || {}))
    }
  }
  return {
    schema,
    obj,
    rules
  }
}

/**
 * 根据后端模版生成表单属性
 * @param arr
 * @param opts
 * @returns {{schema: Array, obj: {}, rules: {}}}
 */
export const createSchemaByItems = (arr, opts) => {
  opts = opts || {}
  let schema = []
  let obj = {}
  let rules = {}
  if (arr && arr.length) {
    // 通过lineNumber字段排序 确定DOM顺序
    let itemsArr = objSortBy(arr, 'lineNumber')
    itemsArr.forEach(item => {
      if (item.propertyObject && item.propertyObject.valueSetPropertyObject && opts.setValue) {
        let parr = [item.propertyObject.valueSetPropertyObject, item]
        parr.forEach(sitem => {
          let { sobj, srules, schemaObj } = setPropertyObject(sitem, opts)
          rules = Object.assign(rules, srules)
          obj = Object.assign(obj, sobj)
          schemaObj && schema.push(schemaObj)
        })
      } else {
        // 在模版中不显示某些项目
        if (opts.tplHide) {
          if (!item.tplHide) {
            let { sobj, srules, schemaObj } = setPropertyObject(item, opts)
            rules = Object.assign(rules, srules)
            obj = Object.assign(obj, sobj)
            schemaObj && schema.push(schemaObj)
          }
        } else {
          let { sobj, srules, schemaObj } = setPropertyObject(item, opts)
          rules = Object.assign(rules, srules)
          obj = Object.assign(obj, sobj)
          schemaObj && schema.push(schemaObj)
        }
      }
    })
  }
  return {
    schema,
    obj,
    rules
  }
}

function setPropertyObject (item, opts) {
  let sobj = {}
  let srules = {}
  let schemaObj = {}
  let disabled = opts.disabled || false
  let showItems = opts.showItems || []
  // 依次为：组件  UI占位  组件选项  组件默认属性  表单验证规则  组件api请求参数  组件编码  组件标识
  let [comp, span, options, defaultProps, rule, apiParams, code, name] = ['sys-text', 12, [], {}, []]
  let valueObj
  let props = {
    disabled
  }
  if (item.propertyObject) {
    code = item.propertyObject.code
    name = item.propertyObject.name
    span = item.propertyObject.proportion ? Number(item.propertyObject.proportion) : 8
    if (item.propertyObject.param) apiParams = item.propertyObject.param
    let values = item.templetDictPropertyValues || item.templetPropertyValues
    if (values) options = _setPropertyValuesKey(values)
    if (Number(item.isMust)) {
      rule = [{
        required: true,
        message: '必填项',
        trigger: ['blur', 'change']
      }]
      props.clearable = false
    }
    props.display = Number(item.display)
    // 数字组件form验证
    let field = item.propertyObject.field
    if (field && Number(item.isMust)) {
      let numRule = { trigger: ['blur', 'change'] }
      if (!isNull(field.max)) numRule.max = field.max
      if (!isNull(field.min)) numRule.min = field.min
      if (!isNull(field.max) || !isNull(field.min)) {
        if (!isNull(field.min) && !isNull(field.max)) {
          numRule.message = `${field.min}-${field.max}之间的数字`
        } else if (!isNull(field.min) && isNull(field.max)) {
          numRule.message = `大于${field.min}的数字`
        } else if (isNull(field.min) && !isNull(field.max)) {
          numRule.message = `小于${field.max}的数字`
        }
        numRule.type = 'number'
        rule.push(numRule)
      }
    }
    let propertyType = objFind(COMP_SETTINGS, { id: item.propertyObject.type })
    comp = (propertyType && propertyType.comp) || comp
    defaultProps = (propertyType && propertyType.props) || {}
  }
  if (rule) srules[code] = rule
  if (!opts || !opts.noPlaceholder) {
    props.placeholder = `请输入${name}`
  }
  // 模糊查询组件值回显处理（后端需要同时保存id&name）
  if (item.propertyObject.nCode) {
    if (item.propertyObject.defValue) {
      valueObj = {
        id: item.propertyObject.defValue,
        name: item.propertyObject.defNameValue || ''
      }
    } else {
      valueObj = ''
    }
    sobj[code] = valueObj
    props.useObject = true
    options = valueObj ? [valueObj] : []
  } else {
    sobj[code] = item.propertyObject.defValue || ''
  }
  if (apiParams && apiParams.length) {
    props.apiParams = apiParams
    props.obj = sobj
  }
  if (options && options.length) props.options = options
  if (item.propertyObject.field) {
    props.field = item.propertyObject.field
    for (let sitem in props.field) {
      if (props.field.hasOwnProperty(sitem)) {
        props[sitem] = props.field[sitem]
      }
    }
  }
  if (opts && !isNull(opts.disabled)) {
    props.disabled = disabled // 防止field中disabled属性覆盖
    props.field = props.field || {}
    props.field.disabled = disabled
  }
  if (item.propertyObject.append) props.append = item.propertyObject.append
  if (item.propertyObject && item.propertyObject.valueUrl) props.apiUrl = item.propertyObject.valueUrl
  if (item.propertyObject.valueSetCode) props.code = item.propertyObject.valueSetCode
  props = Object.assign({}, defaultProps, props)
  // 如果设置显示项  值添加显示项
  if (showItems && showItems.length) {
    if (showItems.includes(code)) {
      schemaObj = { name: code, label: name, comp, props, span: 6 }
    } else {
      schemaObj = null
    }
  } else {
    schemaObj = { name: code, label: name, comp, props, span }
  }
  return {
    sobj,
    srules,
    schemaObj
  }
}
const validate = function (rule, value, callback) {
  if (!value) return callback(new Error('必填项'))
  if (value.length === undefined && !value.id) return callback(new Error('必填项'))
  if (Array.isArray(value) && !value.length) return callback(new Error('必填项'))
  callback()
}
function _passageTypeReturnComp (arr, code, { optsComp, optsCertainly, optsSpan }, newVersion) {
  let comp = 'sys-text'
  let label = ''
  let type = 'text'
  let span = optsSpan || 12
  let initOptions = []
  let value = ''
  let rule = {}
  let addOrDelette = ''
  let apiUrl = ''
  let disabled = false
  let autosize
  let global = false
  let useObject = false
  let multiple = false
  let whImg = ''
  let outformat = ''
  let isGroupShow = false
  let isAutoSeach = false
  let isInitOptions = false
  let isImgMultiple = false
  // 营业地址英文
  let enMode = ''
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i]
    if (item.propertyCode === code) {
      label = item.propertyName || (item.propertyObject && item.propertyObject.name)
      // todo：新版值集改造去掉了propertyObject
      if (item.propertyObject && item.propertyObject.valueUrl) {
        if (item.propertyType === GLOBAL_ATTR[5].id || item.propertyType === GLOBAL_ATTR[8].id) {
          apiUrl = item.propertyObject.valueUrl
        } else {
          apiUrl = config.api + item.propertyObject.valueUrl
        }
      }
      if (item.valueUrl) {
        apiUrl = item.valueUrl
      }
      addOrDelette = item.addOrDelette
      let values = item.templetDictPropertyValues || item.templetPropertyValues
      if (values) initOptions = _setPropertyValuesKey(values)
      if (item.isMust) {
        rule = {
          required: true,
          validator: validate,
          trigger: 'change'
        }
      }
      if (optsCertainly && item.certainly === PROPERTY_TYPE_FOR_TEMPLET_CERTAINLY[0].id) disabled = true
      if (item.propertyCode === MECHANISM_CODE[3]) {
        enMode = true
      } else {
        enMode = false
      }
      if (optsComp === 'readonlyitem' && ([GLOBAL_ATTR[7].id, GLOBAL_ATTR[15].id].includes(item.propertyType))) disabled = true // 单张图片和富文本编辑器修改是否可以编辑状态
      switch (item.propertyType) {
        case GLOBAL_ATTR[0].id:
          type = 'text'
          break
        case GLOBAL_ATTR[15].id:
          type = 'editor'
          span = 24
          break
        case GLOBAL_ATTR[1].id:
          type = 'textarea'
          span = 24
          break
        case GLOBAL_ATTR[2].id:
          comp = 'sysSingleMulti'
          if (newVersion) useObject = true
          global = true
          isGroupShow = true
          break
        case GLOBAL_ATTR[3].id:
          comp = 'sysSingleMulti'
          if (newVersion) useObject = true
          global = true
          multiple = true
          if (!optsComp) value = []
          isGroupShow = true
          break
        case GLOBAL_ATTR[4].id:
          comp = 'text'
          type = 'number'
          break
        case GLOBAL_ATTR[5].id:
          isAutoSeach = true
          comp = 'sys-remote-select'
          if (newVersion) useObject = true
          break
        case GLOBAL_ATTR[6].id:
          comp = 'date-picker'
          outformat = 'yyyy-MM-dd'
          type = 'date'
          break
        case GLOBAL_ATTR[7].id:
          comp = 'ever-wh-uploadFile'
          whImg = 'true'
          span = 24
          break
        case GLOBAL_ATTR[10].id:
          comp = 'ever-address'
          if (item.propertyCode === MECHANISM_CODE[3]) {
            enMode = true
          } else {
            enMode = false
          }
          break
        case GLOBAL_ATTR[12].id:
          if (newVersion) useObject = true
          comp = 'sys-remote-select'
          break
        case GLOBAL_ATTR[14].id:
          comp = 'ever-whUploadFile'
          isImgMultiple = true
          span = 24
          break
      }
      // 去重校验
      CHECK_CODE.forEach(checkItem => {
        if (checkItem.code === item.propertyCode) {
          let searchUrl = config.api + checkItem.api
          let key = checkItem.searchCode
          let validateCheckRule = (rule, value, callback) => {
            if (value === '' && (rule.required || value === '')) {
              callback(new Error('必填项'))
            } else {
              if (checkItem.code === CHECK_CODE[1].code && !MOBILE_PATRN.test(value)) {
                callback(new Error('请输入11位数手机号码 例如：13012345678'))
                return
              }
              axios.post(searchUrl, { [key]: value }).then(res => {
                !res[checkItem.parameter] ? callback() : callback(new Error('您输入的' + checkItem.name + '重复，请重新输入'))
              })
            }
          }
          rule = { required: rule.required || false, validator: validateCheckRule, trigger: 'blur' }
          comp = 'sys-text'
          type = 'text'
        }
      })
    }
  }
  return {
    comp,
    label,
    type,
    span,
    initOptions,
    value,
    rule,
    addOrDelette,
    apiUrl,
    disabled,
    whImg,
    enMode,
    outformat,
    multiple,
    global,
    useObject,
    isGroupShow,
    autosize,
    isAutoSeach,
    isInitOptions,
    isImgMultiple
  }
}
function _setPropertyValuesKey (arr) {
  let tempArr = []
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i]
    let name = item.valueSetItemName || item.propertyValueObject && item.propertyValueObject.name
    let id = item.valueSetItemCode || item.propertyValueId
    let addOrDelette = item.addOrDelette
    const obj = {
      name,
      id,
      addOrDelette
    }
    if (item.photo) obj.photo = item.photo
    tempArr.push(obj)
  }
  return tempArr
}
// 创建是否只读Obj
export const readonlyObjItem = function (obj, data, flag, valueList) {
  for (let key in obj) {
    for (let i = 0; i < data.length; i++) {
      let item = data[i]
      if (key === item.propertyCode) {
        if (item.propertyType === GLOBAL_ATTR[2].id || item.propertyType === GLOBAL_ATTR[3].id) {
          let itemsValues
          if (valueList) {
            itemsValues = item[valueList]
          } else {
            itemsValues = item.materialPropertyValues || item.materialDictPropertyValues
          }
          if (flag && item.propertyType === GLOBAL_ATTR[2].id) obj[key] = itemsValues.length && itemsValues[0].propertyValueId || ''
          if (flag && item.propertyType === GLOBAL_ATTR[3].id) {
            let elementItem = []
            if (item.propertyType === GLOBAL_ATTR[3].id && itemsValues.length) {
              itemsValues.forEach(element => {
                elementItem.push(element.propertyValueId)
              })
              obj[key] = elementItem
            } else {
              obj[key] = elementItem
            }
          }
          if (!flag && itemsValues.length) obj[key] = _setVals(itemsValues)
        } else if (item.propertyType === GLOBAL_ATTR[5].id && key !== CHECK_CODE[0].code) { // 去除条码
          obj[key] = item.specialName || ''
        } else if (item.propertyType === GLOBAL_ATTR[10].id) {
          if (item.propertyValue) {
            let cityStr = JSON.parse(item.propertyValue)
            obj[key] = flag ? item.propertyValue : cityStr.citysName ? `${cityStr.citysName} ${cityStr.addressDetail}` : cityStr.addressDetail
          }
        } else {
          obj[key] = item.propertyValue
        }
      }
    }
  }
  return obj
}

function _setVals (values) {
  let name = []
  for (let i = 0; i < values.length; i++) {
    let item = values[i]
    name.push(item.propertyValueObject && item.propertyValueObject.name)
  }
  return name.join(',')
}
// 设置物资分类名称
export const setUpClassifyName = function (data, loopName, keyName, keyValue) {
  let name = []
  if (loopName) {
    const setUpClassifyNames = function (data) {
      for (let key in data) {
        if (key === keyValue || key === 'name') {
          name.push(data[keyValue] || data[key])
        }
        if (['classifyObject', 'pharmacologyCategorySonObject', keyName].includes(key)) {
          setUpClassifyNames(data[keyName] || data[key])
        }
      }
    }
    setUpClassifyNames(data)
  } else {
    if (data.classifyObject) name = [data.classifyObject.name]
    if (data.classifyObject && data.classifyObject.classifyObject) name = [data.classifyObject.classifyObject.name]
    if (data.classifyObject && data.classifyObject.classifyObject && data.classifyObject.classifyObject.classifyObject) name = [data.classifyObject.classifyObject.classifyObject.name]
  }
  return loopName ? name.join('>') : name.join('')
}
// 查找数组中存在的数据 返回索引
export const _findIndex = function (tableData, id, name) {
  name = name || 'id'
  let index = tableData.findIndex(item => {
    return item[name] === id
  })
  return index
}
