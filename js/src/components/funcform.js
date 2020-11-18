import Vue from 'vue'
import i18n from '@/assets/locals/index'

let timer
let timerQuery
let compMap = {
  input: 'el-input',
  text: 'el-input',
  select: 'el-select',
  textarea: 'el-input',
  date: 'el-date-picker',
  checkbox: 'el-checkbox-group',
  radio: 'el-radio-group',
  metacode: 'systype2'
}

let defaultProps = {
  'el-select': {
    clearable: true
  },
  'ever-select': {
    clearable: true
  }
}

let savebtn = `
  <el-col class="submit-zone">
    <el-form-item>
      <el-button :disabled="disabled" type="primary" @click="submitForm()" v-if="!objId">创建</el-button>
      <el-button :disabled="disabled" type="primary" @click="submitForm()" v-if="objId">保存</el-button>
      <el-button @click="resetForm()" v-if="!objId">重置</el-button>
    </el-form-item>
  </el-col>`
let querybtn = `<el-form-item><el-button type="primary" @click="query()">查询</el-button></el-form-item>`

function setProp (obj, path, value) {
  if (!path) {
    return
  }
  var pList = path.split('.')
  var len = pList.length
  for (var i = 0; i < len - 1; i++) {
    var elem = pList[i]
    if (!obj[elem]) obj[elem] = {}
    obj = obj[elem]
  }
  obj[pList[len - 1]] = value
}

function getProp (obj, prop) {
  return prop.reduce((xs, x) => {
    if (xs && xs[x] && (typeof xs[x] === 'string')) {
      return xs[x]
    } else {
      return (xs && typeof xs[x] !== 'undefined') ? xs[x] : null
    }
  }, obj)
}

function createEle (obj, item, createElement, form) {
  let name = item.name || ''
  let comp = item.comp || 'text'
  let props = item.props || {}
  if (comp === 'textarea') {
    props.type = 'textarea'
    // 设置文本域自适应高度
    props.autosize = props.autosize || { minRows: 2 }
  }
  let comp1 = compMap[comp] || comp
  if (comp1 === 'el-select') {
    props.clearable = true
  }
  let slots = []
  if (item.slots) {
    slots = item.slots.map(slot => {
      return createElement(
        Vue.extend({
          template: slot.template
        }),
        { slot: slot.name }
      )
    })
  }

  if (props.options && props.options.length) {
    if (['el-select'].indexOf(comp1) > -1) {
      slots = props.options.map(option => {
        return createElement('el-option', {
          props: {
            key: option.id || option.value,
            label: i18n.t(option.name || option.label),
            value: 'id' in option ? option.id : option.value
          },
          attrs: {
            disabled: option.disabled || false
          }
        })
      })
    } else if (comp1 === 'el-radio-group') {
      slots = props.options.map(option => {
        return createElement(
          'el-radio',
          {
            props: {
              key: option.id || option.value,
              label: i18n.t(option.name || option.label || option.value)
            }
          },
          option.id || option.value
        )
      })
    } else if (comp1 === 'el-checkbox-group') {
      slots = props.options.map(option => {
        return createElement(
          'el-checkbox',
          {
            props: {
              disabled: option.disabled || false,
              key: option.id || option.value,
              label: i18n.t(option.name || option.label || option.value)
            }
          },
          option.id || option.value
        )
      })
    }
  }
  let extralProps = {}
  try {
    extralProps = item.extralProps ? JSON.parse(item.extralProps) : {}
  } catch (err) {
    console.log('--extralProps-error-', item.extralProps)
  }
  props = Object.assign(
    {
      value: getProp(obj, name.split('.'))
    },
    defaultProps[comp1],
    props,
    extralProps
  )
  if (item.children) {
    slots = createFormItems(item.children, obj, createElement, {})
  }
  if (item.plainContent) {
    slots = item.plainContent
  }
  let extandAttrs = {}
  if (props) extandAttrs.placeholder = i18n.t(props.placeholder || item.label)

  if (comp === 'input' && item.type === 'number') {
    extandAttrs.title = ''
  }
  // 设置默认单行和多行输入框的最大输入长度，需要产品定逻辑，如果需要全局控制可以在这里控制

  // if (comp1 === 'el-input' && props) {
  //   if (props.type === 'textarea') {
  //     props.maxlength = props.maxlength || 20000
  //   } else {
  //     props.maxlength = props.maxlength || 500
  //   }
  // }

  if (props && props.maxlength) extandAttrs.maxlength = props.maxlength
  props.size = form.size || form.formSize || ''
  props.disabled = props.disabled || form.allDisabled
  if (comp1 === 'el-input' && item.type === 'number') {
    props.type = 'number'
    // comp1 = 'el-input-number'
    // props['controls-position'] = 'right'
  }
  if (comp1 === 'el-input') {
    props.clearable = true
  }
  let ele = createElement(
    comp1,
    {
      on: {
        input: function (val) {
          if (item.type === 'number') {
            try {
              if (val === '') {
                val = null
              } else {
                val = Number(val)
              }
            } catch (e) { }
          }
          setProp(obj, name, val)
          // input 只有在用户有输入时候触发，这点与 change 事件不同
          if (
            ele.context.isQuery &&
            (comp1 !== 'el-input' || !!ele.context.inputQuery)
          ) {
            clearTimeout(timerQuery)
            timerQuery = setTimeout(function () {
              ele.context.query.call(this)
            }, 300)
          }
        },
        focus: e => {
          form.$emit('focus', name, obj)
        },
        clear: e => {
          form.$emit('clear', name, obj)
        }
      },
      nativeOn: {
        keyup: e => {
          if (ele.context.isQuery && e.keyCode === 13) {
            ele.context.query()
          }
        }
      },
      props: props,
      attrs: Object.assign({}, extandAttrs, item.attrs),
      style: item.style,
      class: item.class,
      ref: item.ref || extralProps.ref,
      refInFor: true
    },
    slots
  )
  return ele
}

function createFormItems (schema, obj, createElement, form) {
  return schema
    .filter(v => {
      // 为了管理方便  模版维护页面不走规则逻辑
      if (form.isManage) return true
      try {
        if (v.if && obj) {
          return v.if(obj)
        }
      } catch (err) {
        return true
      }
      return true
    })
    .map(v => {
      let name = v.name
      let comp = v.comp
      let ele
      if (form.readonly) {
        ele = obj[name]
        if (['object', 'array'].indexOf(v.rule.dataType) > -1) {
          var ComponentClass = Vue.component(compMap[v.comp] || v.comp)
          if (ComponentClass) {
            var instance = new ComponentClass({
              propsData: { value: obj[name] },
              parent: form
            })
            if (instance.getStringVal) {
              ele = instance.getStringVal() || '--'
            }
          }
        }
      } else {
        if (comp === 'custom') {
          ele = form.$slots[name]
          if (v.noWrap) {
            return ele
          }
        } else {
          ele = createEle(obj, v, createElement, form)
        }
      }
      let formItem = null
      if (v.isInput === false) {
        formItem = ele
      } else {
        formItem = createElement(
          'el-form-item',
          {
            key: name,
            props: {
              label: i18n.t(v.label),
              prop: name,
              labelWidth: v.labelWidth
            },
            class: v.parentClass || '',
            nativeOn: {
              click: e => {
                form.$emit('click', name, obj)
              }
            }
          },
          [ele]
        )
      }
      if (form.inline) {
        return formItem
      } else {
        let colProps = Object.assign({ span: v.span || form.span || 24 }, v.col)
        if (form.forceFullline) {
          colProps.span = 24
        }
        colProps.newRow = v.newRow
        colProps.style = colProps.style || {}
        let col = createElement(
          'el-col',
          {
            props: colProps,
            style: colProps.style,
            class: colProps.cla
          },
          [formItem]
        )
        return col
      }
    })
}

function createRows (formItems, createElement, gutter, rowFlex) {
  let rowItems = formItems.reduce((acc, curr) => {
    if (
      !acc.length ||
      (curr && curr.data && curr.data.props && curr.data.props.newRow)
    ) {
      acc.push([])
    }
    acc[acc.length - 1].push(curr)
    return acc
  }, [])
  return rowItems.map(v => {
    let rowProps = {
      gutter: gutter || 0
    }
    if (rowFlex) rowProps.type = 'flex'
    return createElement('el-row', { props: rowProps }, v)
  })
}

export default Vue.component('everForm2', {
  render: function (createElement) {
    let obj = this.value
    this.formSize = this.size || 'small'
    let formItems = createFormItems(this.schema, obj, createElement, this)
    if (!this.nosubmit) {
      let formComp = this
      formItems.push(
        this.$slots['default'] ||
        createElement(
          Vue.extend({
            props: ['disabled'],
            template: this.isQuery ? querybtn : savebtn,
            data () {
              return {
                objId: formComp.objId
              }
            },
            methods: {
              submitForm () {
                formComp.submitForm()
              },
              resetForm () {
                formComp.resetForm()
              },
              query () {
                formComp.query()
              }
            }
          }),
          {
            props: {
              disabled: formComp.disabled
            }
          }
        )
      )
    }

    // 如果查询后面还需要附加其他按钮在这里处理（场景可能会很少）by lvjiangtao@everjiankang.com
    if (this.hasExt) {
      let extbtn = `
        <el-form-item class="${this.extClassName}">
          <el-button type="primary" @click="extAction()">${
        this.extBtnString
        }</el-button>
        </el-form-item>
      `
      let formComp = this
      formItems.push(
        createElement(
          Vue.extend({
            props: ['disabled'],
            template: extbtn,
            data () {
              return {
                objId: formComp.objId
              }
            },
            methods: {
              extAction () {
                formComp.extAction()
              }
            }
          }),
          {
            props: {
              disabled: formComp.disabled
            }
          }
        )
      )
    }

    let formProps = {
      rules: this.rules,
      inline: this.inline,
      model: this.value,
      size: this.size || 'small',
      disabled: this.allDisabled,
      validateOnRuleChange:
        this.validateOnRuleChange === undefined
          ? true
          : this.validateOnRuleChange,
      showMessage: this.showMessage === undefined ? true : this.showMessage,
      hideRequiredAsterisk: !(this.hideRequiredAsterisk === false) // thc系统内不需要星号，如果单独表单需要星号，请自己扩展这块，把值动态传进来
    }
    let formChild = formItems

    if (!this.inline) {
      formProps = Object.assign(formProps, {
        labelWidth: this.labelWidth || '120px',
        labelPosition: this.labelPosition || 'right'
      })
      formChild = createRows(
        formItems,
        createElement,
        this.gutter,
        this.rowFlex
      )
    }
    return createElement(
      'el-form',
      {
        props: formProps,
        ref: 'form'
      },
      formChild
    )
  },
  props: [
    'schema',
    'rules',
    'value',
    'labelWidth',
    'labelPosition',
    'inline',
    'span',
    'gutter',
    'rowFlex',
    'nosubmit',
    'api',
    'info',
    'isQuery',
    'inputQuery', // 是否支持input输入自动查询
    'readonly',
    'allDisabled',
    'hasExt',
    'extBtnString',
    'extClassName',
    'size',
    'validateOnRuleChange',
    'showMessage',
    'forceFullline',
    'hideRequiredAsterisk',
    'isManage' // 是否为管理界面
  ],
  data () {
    return {
      objId:
        this.value.id ||
        (this.$route && this.$route.params && this.$route.params.id),
      disabled: false
    }
  },
  methods: {
    submitForm () {
      this.disabled = true
      let isValid = true
      if (this.$refs.selfvalidate) {
        let comps = this.$refs.selfvalidate
        if (!Array.isArray(comps)) {
          comps = [comps]
        }
        for (let i = 0; i < comps.length; i++) {
          if (comps[i] && comps[i].$refs.form) {
            if (Array.isArray(comps[i].$refs.form)) {
              for (let j = 0; j < comps[i].$refs.form.length; j++) {
                if (comps[i].$refs.form[j] && comps[i].$refs.form[j].validate) {
                  comps[i].$refs.form[j].validate(valid => {
                    if (!valid) {
                      isValid = false
                    }
                  })
                }
              }
            } else if (comps[i].$refs.form.validate) {
              comps[i].$refs.form.validate(valid => {
                if (!valid) {
                  isValid = false
                }
              })
            }
          }
        }
      }
      if (!isValid) {
        this.disabled = false
        return
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.api) {
            this.api.createOrUpdate(this.value).then(
              result => {
                this.disabled = false
                this.$emit('objsaved', result)
              },
              _ => {
                this.disabled = false
              }
            )
          }
        } else {
          this.disabled = false
          this.autofocus()
          return false
        }
      })
    },
    // 第一个出错元素获得焦点
    autofocus () {
      setTimeout(() => {
        var isError = document.getElementsByClassName('is-error')
        if (isError.length) {
          if (isError[0].querySelector('input')) {
            isError[0].querySelector('input').focus()
          }
        }
      }, 1)
    },
    /**
     * @Description: 重置表单数据新增两个可选参数
     * @param forceClear 是否强制清空 即直接将表单的没个值都设置为 空字符串
     * @param excludedList 需要配排除在外的字段 有些字段不希望被设置为空时，可以放在此参数中
     * @author fuyongbo@everjiankang.com
     * @date 2019-06-10
     */
    resetForm (forceClear = false, excludedList = []) {
      this.disabled = false
      this.$refs.form.resetFields()
      if (forceClear) {
        // 强制将每一个值都设置为空
        Object.keys(this.value).forEach(p => {
          if (!excludedList.some(item => item === p)) {
            this.value[p] = ''
          }
        })
      }
    },
    getDetail: function (id) {
      this.api.getById(id || this.objId).then(result => {
        if (result && result.id) {
          Object.assign(this.value, result)
        }
      })
    },
    query () {
      this.$emit('query')
    },
    extAction () {
      this.$emit('extAction')
    }
  },
  created: function () {
    if (this.api && this.objId && this.objId !== '-1' && this.objId !== -1 && !this.info) {
      // info true 不调getById
      this.getDetail()
    }
  },
  mounted () {
    //   console.log('updated执行次数')
    //   // 延迟3000ms再监听 延迟1000ms 不能监听到整个页面所有的form表单 有些表单需要些时间才能加载到dom上
    //   clearTimeout(this.timer)
    setTimeout(() => {
      observer()
    }, 2000)
    // }
    // 减少 observer 的执行次数，同时保证 执行 observer 时，dom加载完成，能够监听到当前页面所有到控件
    // document.addEventListener('DOMContentLoaded', function () {
    //   observer()
    // })
  }
})

function observer () {
  clearTimeout(timer)
  timer = setTimeout(() => {
    // 监听`.el-form-item.is-required .el-form-item__content` 的子元素，如果子元素新增了 .el-form-item__error节点
    // 判断其'[class*="__inner"]'元素的值，如果值为空，将.el-form-item__error设置为隐藏 否则设置为显示
    const observe = new MutationObserver(ms => {
      ms.forEach(m => {
        // 当前mutation是添加了一个错误提示节点
        // console.log('监听mutation', m)
        if (
          m.type === 'childList' &&
          m.addedNodes.length === 1 &&
          m.addedNodes[0].className &&
          m.addedNodes[0].className.includes('el-form-item__error')
        ) {
          toggleError(m.target)
        } else if (m.type === 'characterData') {
          // 对错误提示语对变化进行监听，当错误提示从文本错误提示变化为必填提示时会触发
          if (
            m.target &&
            m.target.parentNode &&
            m.target.parentNode.className &&
            m.target.parentNode.className.includes('el-form-item__error')
          ) {
            toggleError(m.target.parentNode.parentNode)
          }
        }
      })
    })
    const allRequiredItems = document.querySelectorAll(
      `.el-form:not(.custom-form) .el-form-item.is-required .el-form-item__content`
    )
    Array.from(allRequiredItems).forEach(item => {
      observe.observe(item, {
        childList: true,
        characterData: true,
        subtree: true
      })
    })
  }, 1000)
}
/**
 * @Description: 处理错误提示的展现样式
 * 如果是 checkbox radio 穿梭框 以及其他特殊控件 使用默认的提示样式
 * 否则 如果是 由于值为空导致的错误 则将其错误提示隐藏
 * @author fuyongbo@everjiankang.com
 * @date 2019-05-18
 */
function toggleError (content) {
  const isCascader = content.querySelector('.el-cascader')
  const isRadio = !isCascader && content.querySelector('.el-radio') // 只要该控件中有radio，则将其视为radio 不考虑即包含了radio又包含input的复杂情况
  const isRadioBtn = !isCascader && content.querySelector('.el-radio-button')
  const isTransfer = content.querySelector('.el-transfer')
  const isCheckboxGroup =
    !isCascader && !isTransfer && content.querySelector('.el-checkbox-group')
  const isSwitch = content.querySelector('.el-switch')
  const isTree = content.querySelector('.el-tree')
  if (
    isTree ||
    isRadio ||
    isRadioBtn ||
    isTransfer ||
    isCheckboxGroup ||
    isSwitch
  ) {
    if (
      content.parentNode.className &&
      !content.parentNode.className.includes('custom-form-item')
    ) {
      content.parentNode.className =
        content.parentNode.className + ' custom-form-item'
      if (isTree) {
        content.parentNode.className =
          content.parentNode.className + ' custom-form-item-tree'
      } else if (isRadio) {
        content.parentNode.className =
          content.parentNode.className + ' custom-form-item-radio'
      } else if (isRadioBtn) {
        content.parentNode.className =
          content.parentNode.className + ' custom-form-item-radio-button'
      } else if (isTransfer) {
        content.parentNode.className =
          content.parentNode.className + ' custom-form-item-transfer'
      } else if (isCheckboxGroup) {
        content.parentNode.className =
          content.parentNode.className + ' custom-form-item-checkbox-group'
      } else if (isSwitch) {
        content.parentNode.className =
          content.parentNode.className + ' custom-form-item-switch'
      }
    }
  } else {
    // 如果该表单元素是日期区间数组格式，则判断其每一个.el-range-input有没有值，如果有一个没有值，则将其视为未填，需要隐藏错误提示
    let isRangeRequired = false
    const rangeInputs = content.querySelectorAll('.el-range-input')
    if (rangeInputs.length) {
      if (Array.from(rangeInputs).some(item => item.value === '')) {
        isRangeRequired = true
      }
    }
    // 判断该元素下的输入框是否有值，如果没有值，则将其隐藏
    if (
      !content.querySelector('[class*="__inner"]') || // 某些情况下没有__inner
      (content.querySelector('[class*="__inner"]') &&
        content.querySelector('[class*="__inner"]').value === '') ||
      isRangeRequired
    ) {
      if (content.querySelector('.el-form-item__error')) {
        content.querySelector('.el-form-item__error').style.display = 'none'
      }
    } else {
      if (content.querySelector('.el-form-item__error')) {
        content.querySelector('.el-form-item__error').style.display = 'block'
      }
    }
  }
}
