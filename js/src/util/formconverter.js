export function createSchema (element, segment) {
  element = JSON.parse(JSON.stringify(element))
  return element.map(v => {
    let obj = { props: {} }
    try {
      Object.assign(obj, v)
      if (v.expression) {
        let body = v.expression.replace(/([a-zA-Z]\w*)\s*(?=[<=>])/g, 'obj.$1')
        body = 'return ' + body
        obj.if = new Function('obj', body)
      }
      if (v.code) {
        obj.comp = 'systype2'
        obj.props.id = v.code
      }
      if (v.innerContent) {
        if (
          ['select', 'radio', 'checkbox', 'autocomplete'].indexOf(v.comp) === -1
        ) {
          obj.plainContent = v.innerContent
        } else {
          obj.props.options = v.innerContent.split('\n').map(str => {
            return {
              id: str,
              value: str
            }
          })
        }
      }
      if (obj.comp === 'uploadFile') {
        Object.assign(obj.props, {
          uploadApiType: 'ucloud',
          btnSize: 'small',
          isMultiple: false
        })
      }
      if (obj.comp === 'doctor-select' || obj.comp === 'everStaffSelect') {
        obj.comp = 'everStaffSelect'
        Object.assign(obj.props, {
          clearable: true,
          multiple: true,
          type: 'select',
          fields: 'id',
          params: {
            typeCodeList: ['DOCTOR'],
            everQueryType: 'out',
          }
        })
      }
      if (obj.comp === 'date') {
        Object.assign(obj.props, {
          type: 'datetime',
          format: 'yyyy-MM-dd HH:mm',
          valueFormat: 'yyyy-MM-dd HH:mm'
        })
        obj.style = { width: '100%' }
      }
      obj.type = obj.rule.dataType
      if (!v.hasVal) {
        obj.class = 'no-input-form-item'
        obj.style = {
          textAlign: obj.align
        }
      }
      // if (['text', 'input', 'textarea', 'div'].indexOf(obj.comp) === -1) {
      //   obj.ref = 'selfvalidate'
      // }
      // if (v.element) {
      //   obj.comp = 'div'
      //   obj.children = createSchema(v.element, v)
      //   obj.class = 'segment clearfix el-row'
      // }
    } catch (err) {
      console.log('---createSchema err----', err)
    }
    return obj
  })
}

export function createRule (element) {
  return element.reduce((acc, curr) => {
    if (!curr.name && !curr.hasVal) {
      return acc
    }
    if (curr.element) {
      acc = Object.assign(acc, createRule(curr.element))
    }
    let currRule = curr.rule
    if (!currRule) {
      return acc
    }
    let rules = []
    if (currRule.required) {
      let rule = { trigger: 'change' }
      rule.required = currRule.required
      rule.message = '必填项'
      rules.push(rule)
    }
    if (currRule.dataType === 'number') {
      let rule = {
        type: 'number',
        message: '数值类型'
      }
      rules.push(rule)
    }

    if (currRule.min || currRule.max) { // 最大值最小值只针对数字类型，其他类型规则不生效
      let message = ''
      if (currRule.dataType === 'number') {
        if (currRule.min) {
          message = '最小值' + currRule.min
        }
        if (currRule.max) {
          message += ' 最大值' + currRule.max
        }
        rules.push({
          min: currRule.min,
          max: currRule.max,
          message: message,
          type: currRule.dataType
        })
      }
    }
    acc[curr.name] = rules
    return acc
  }, {})
}

export function createObj (schema) {
  var obj = {}
  for (let field of schema) {
    if (field.children) {
      Object.assign(obj, createObj(field.children))
    } else if (field.type === 'array') {
      obj[field.name] = []
    } else if (field.type === 'object') {
      obj[field.name] = null
    } else if (field.type === 'number') {
      obj[field.name] = null
    } else {
      obj[field.name] = field.defaultVal || ''
    }
  }
  return obj
}
export function getMixed (element) {
  let schema = createSchema(element)
  let rules = createRule(element)
  let obj = createObj(schema)
  return {
    schema,
    rules,
    obj
  }
}
