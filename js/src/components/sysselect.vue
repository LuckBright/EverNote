<template>
  <div>
    <el-radio-group v-if="type === 'radio'" v-model="input" :disabled="disabled" @change="change">
      <el-radio v-for="option in options" :key="option[valueKey || 'id']" :label="option[valueKey || 'id']">
        {{option | formatLang}}
        <icons style="margin-left: 10px;" :addOrDelette="option.addOrDelette"></icons>
      </el-radio>
    </el-radio-group>
    <el-checkbox-group v-else-if="type === 'checkbox'" v-model="input" @change="change">
      <el-checkbox
        :disabled="disabled"
        v-for="option in options"
        :key="option[valueKey || 'id']"
        :label="option[valueKey || 'id']"
      >
        {{option | formatLang}}
        <icons style="margin-left: 10px;" :addOrDelette="option.addOrDelette"></icons>
      </el-checkbox>
    </el-checkbox-group>
    <el-checkbox
      v-else-if="type === 'singleCheckbox'"
      v-model="input"
      :disabled="disabled"
      :true-label="labelNumber ? 1 : true"
      :false-label="labelNumber ? 0 : false"
      @change="change"
    ></el-checkbox>
    <el-select
      ref="comp"
      style="width: 100%"
      :size="size"
      v-else
      :value="input"
      @input="inputVal"
      v-bind="{'multiple': (field && field.multiple) ? true : false, 'collapse-tags': (field && field.collapsetags) ? true : false}"
      filterable
      :multiple-limit="(field && field.multipleLimit) || 0"
      :clearable="(clearable || clearable === undefined) ? true : false"
      :placeholder="placeholder || '请选择'"
      :value-key="(field && field.useObject) ? 'id' : 'value'"
      :default-first-option="defaultFirst"
      :disabled="disabled"
      @change="change"
      :filter-method="filterMethod"
      @focus="focusFn"
    >
      <el-option
        :class="optionsClassName ? 'option_class' : ''"
        v-for="option in optionsArr"
        :key="option[valueKey || 'id'] || ''"
        :label="option | formatLang"
        :disabled="option.disabled || false"
        :value="(field && field.useObject) ? option : option[valueKey || 'id']"
      >
        <template>{{ option | formatLang }}</template>
      </el-option>
    </el-select>
  </div>
</template>

<script>
/**
 * 多选增加字段  下拉框扩展不同样式
 * optionsClassName: true/false  值为 true 给 option 增加 option_class 样式
 */
import { base as axios } from './baseapi'
import { objKeyBy, objFind, isNull } from '@/util/common'
import icons from './icons'
import { convertCharToPinyin } from '@/components/pinyin.js'
import selfApi from './self.com.api'

const escapeRegexpString = (value = '') => String(value).replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
export default {
  data () {
    return {
      loading: false,
      optionsArr: [],
      initObj: {},
      postdata: {},
      input: this.value || '',
      optionsCopy: [],
      defaultFirst: false // 是否选择默认第一项，用变量主要是解决没有过滤搜索的时候，回车会被第一个值覆盖
    }
  },
  props: ['value', 'type', 'disabled', 'options', 'placeholder', 'field', 'apiUrl', 'apiParams', 'obj', 'clearable', 'labelNumber', 'isInitModel', 'size', 'optionsClassName', 'format', 'valueKey', 'hasNot'], // format自定义id和name字段 valueKey自定义option的key值 hasNot当options没有时是否清空
  created () {
    if (!this.isInitModel) this.initObj = this.$parent.elForm ? this.$parent.elForm.model : {}
    if (this.options && this.options.length) {
      this.optionsArr = this.options
      this.optionsArr.map(item => {
        if (item && !isNull(item.id)) {
          item.id = String(item.id)
        }
        return item
      })
      // 默认选中第一项
      if (this.field && this.field.firstSelect) {
        if (this.field.useObject) {
          this.input = this.optionsArr[0]
        } else {
          this.input = this.optionsArr[0][this.valueKey || 'id']
        }
      }
    } else {
      this.optionsArr = []
    }
    if (this.apiUrl) {
      if (this.apiParams) {
        // form model有默认值的情况下请求联动接口
        this.apiSearch(this.initObj)
      } else {
        this.remoteMethod()
      }
    }
  },
  mounted () {
    let el = this.$el
    let compThis = this
    el.onkeydown = function (e) {
      let keyNum = window.event ? e.keyCode : e.which
      if (keyNum === 13) {
        if (compThis.$root.everBindEnterDom && compThis.$root.everBindEnterDom.length && compThis.$root.everBindEnterIndex) {
          // let nextIndex = compThis.$root.everBindEnterIndex + 1
          setTimeout(() => {
            // 常宁波注释掉的，有问题请联系
            // compThis.$root.everBindEnterDom[nextIndex] && compThis.$root.everBindEnterDom[nextIndex].focus()
            compThis.$root.everBindEnterIndex = compThis.$root.everBindEnterIndex + 1
            compThis.$refs.comp.visible = false
          }, 300)
        }
      }
    }
  },
  computed: {
    select: {
      set (newVal) {
        this.$emit('input', newVal)
        this.optionsArr = this.optionsCopy
      },
      get () {
        return this.value
      }
    }
  },
  components: {
    icons
  },
  methods: {
    inputVal (val) {
      this.optionsArr = this.optionsCopy
      window.setTimeout(() => {
        this.input = val
      }, 0)
    },
    focusFn () {
      if (this.optionsCopy.length) {
        this.optionsArr = this.optionsCopy
      }
    },
    addPinyin (arr) {
      arr.map(item => {
        if (item.name) { // 处理name = undefined
          Object.assign(item, {
            quanpin: convertCharToPinyin(item.name).quanpin,
            shoupin: convertCharToPinyin(item.name).shoupin
          })
        }
      })
    },
    filterMethod (val) {
      // 有过滤值的时候默认选择第一项，没有过滤的时候不做默认选择
      if (val) {
        this.defaultFirst = true
      } else {
        this.defaultFirst = false
      }
      this.optionsArr = []
      this.$nextTick(_ => {
        if (!val.trim()) {
          this.optionsArr = this.optionsCopy
          return
        }
        this.optionsArr = this.optionsCopy.filter(item => {
          if (new RegExp(escapeRegexpString(val), 'i').test(item.name) || new RegExp(escapeRegexpString(val), 'i').test(item.quanpin) || new RegExp(escapeRegexpString(val), 'i').test(item.shoupin)) {
            return item
          }
        })
      })
    },
    async remoteMethod (data) {
      let params = data || {}
      params = Object.assign({}, params, this.field.params || {})
      if (this.apiUrl) {
        this.loading = true
        let options = []
        this.optionsArr = []
        let result
        if (selfApi[this.apiUrl]) { // 对接口请求做本地处理
          result = await selfApi[this.apiUrl](params)
        } else {
          result = await axios.post(this.apiUrl, params)
        }
        this.loading = false
        if (result) {
          if (result.list && result.list.length) {
            options = result.list.slice(0)
          } else if (result.length) {
            options = result.slice(0)
          } else {
            this.optionsArr = []
          }
          if (options && options.length) {
            let format = this.format || {}
            options.forEach(item => {
              let opt = {
                id: (format.id && item[format.id]) || item.id,
                name: (format.name && item[format.name]) || (item.name || item.displayName || item.position),
                nameEn: item.nameEn,
                code: item.code,
                value: item.num
              }
              this.optionsArr.push(opt)
            })
          }
          if (this.optionsArr && this.optionsArr.length) {
            // 默认选中第一项
            if (this.field) {
              if (this.field.firstSelect) {
                if (this.field.useObject) {
                  this.input = this.optionsArr[0]
                } else {
                  // valueKey是自定义value的键值
                  this.input = this.optionsArr[0][this.valueKey || 'id']
                }
              }
              if (this.field.useObject && this.value && typeof this.value === 'string') {
                let obj = {}
                obj[this.valueKey || 'id'] = this.value
                let val = objFind(this.optionsArr, obj)
                this.input = val
              }
              if (this.field.cacheName) {
                sessionStorage.setItem(this.field.cacheName, JSON.stringify({ options: this.optionsArr }))
              }
            }
          }
        } else {
          this.optionsArr = []
        }
        this.hasNot && this.isHas()
      }
      this.optionsArr.length && this.addPinyin(this.optionsArr)
      this.optionsCopy = this.optionsArr
    },
    apiSearch (val) {
      // 动态判断组件接口访问
      if (this.apiParams && this.apiParams.length && val) {
        let params = objKeyBy(this.apiParams, 'value')
        let paramsKey = Object.keys(params)
        let postdataLen = 0
        paramsKey.forEach(item => {
          if (val[item]) {
            this.postdata[params[item].code] = (val[item] instanceof Object) ? val[item].id : val[item]
            postdataLen += 1
          }
        })
        // 满足条件查询, 不满足重新加载初始数据
        if (postdataLen === paramsKey.length) {
          this.remoteMethod(this.postdata)
        } else {
          this.remoteMethod(this.apiParams[0])
        }
      }
    },
    change (val) {
      this.$emit('change', val)
    },
    // 远程获取options时，有初始值但不在options内，清空
    isHas () {
      let opt = {}
      if (this.field && this.field.useObject) {
        opt = this.value
      } else {
        opt[this.valueKey || 'id'] = this.value
      }
      if (!objFind(this.optionsArr, opt)) {
        this.$emit('input', '')
      }
    }
  },
  watch: {
    'obj': {
      handler (val) {
        this.apiSearch(val)
      },
      deep: false
    },
    'options': {
      handler (val) {
        if (val && val.length) {
          this.addPinyin(val)
          this.optionsArr = val
          this.optionsCopy = val
        } else {
          this.optionsArr = []
          // 解决级联select，options数据为[]时,选择项不清空的问题
          this.optionsCopy = []
        }
      },
      immediate: true
    },
    'value': {
      handler (val) {
        this.input = val || ''
      },
      deep: true
    },
    'input': {
      handler (val) {
        val = val || ''
        this.$emit('input', val)
        this.change(val)
      },
      deep: true
    },
    'field': {
      handler (val) {
        this.remoteMethod()
      }
    }
  }
}
</script>
<style scoped>
.el-select-dropdown__list {
  max-width: 1400px!important;
}
.el-select-dropdown__list .option_class {
  display: inline-block;
  cursor: pointer;
  margin-left: 10px;
  margin-bottom: 5px;
  margin-top: 5px;
  height: 34px;
  font-size: 12px;
  border-radius: 4px;
  border: 1px solid rgba(28, 123, 239, 0.2);
}

/* .el-select-dropdown.is-multiple .el-select-dropdown__item.option_class.selected,
.el-select-dropdown.is-multiple
  .el-select-dropdown__item.option_class.selected.hover {
  color: #fff !important;
  background-color: #1c7bef !important;
} */
.el-select-dropdown.is-multiple .el-select-dropdown__item.option_class::after {
  right: -10px;
  display: none;
}
</style>
