<template>
<span>
  <el-checkbox-group v-if="type === 'checkbox'" v-model="select">
    <el-checkbox
      v-for="option in options"
      :size="size"
      :key="option.code"
      :label="option.code"
      :value="option.code"
    >{{option | formatLang}}</el-checkbox>
  </el-checkbox-group>
  <el-radio-group v-else-if="type === 'radio'" v-model="select">
    <el-radio
      v-for="option in options"
      :size="size"
      :key="option.code"
      :label="option.code"
      :value="option.code"
    >{{option | formatLang}}</el-radio>
  </el-radio-group>
  <el-cascader
    v-else-if="type === 'cascader'"
    v-model="select"
    filterable
    :clearable="clearable"
    :options="options"
    :props="props"
    @change="changeCascader"
    :disabled="disabled">
  </el-cascader>
  <span v-else-if="type === 'tag'">
    <el-tag
      v-model="select"
      v-for="(option, index) in options"
      :size="size"
      :key="index"
      :label="option.code"
      :value="option.code"
      :ref="'tag' + index"
      class="pointer mr5"
      :effect="option.tagEffect ? 'dark' : 'plain'"
      @click="handleClick(option, index)">
      {{option | formatLang}}
    </el-tag>
  </span>
  <el-select
    v-else
    v-model="select"
    style="width: 100%"
    v-bind="{'multiple': multiple ? true : false}"
    ref="systype"
    filterable
    :size="size"
    :collapse-tags="collapseTags"
    :placeholder="placeholder"
    :value-key="'code'"
    :default-first-option="true"
    :disabled="disabled"
    :clearable="clearable"
    :filter-method="fun1"
    @change="change"
    @focus="options = optionsBak">
    <el-option
      v-for="option in options"
      :key="option.code"
      :label="option | formatLang"
      :value="useObject ? option : option.code"
    ></el-option>
  </el-select>
</span>
</template>

<script>
import sysvalue from '@/warehouse/store/sysvalueapi'

import { isNull, objFind } from '@/util/common'

export default {
  props: {
    'code': {
      type: String,
    },
    'filtercodes': {
      type: Array,
      default () {
        return []
      },
    },
    'value': {
      type: [String, Array, Object]
    },
    'type': {
      type: String,
    },
    'disabled': {
      type: Boolean,
      default: false
    },
    'placeholder': {
      type: String,
      default: '请选择'
    },
    'multiple': {
      type: Boolean,
      default: false
    },
    'useObject': {
      type: Boolean,
      default: false
    },
    'cache': {
      type: Boolean,
      default: false
    },
    'clearable': {
      type: Boolean,
      default: true
    },
    'firstDefault': {
      type: Boolean,
      default: false
    },
    'objName': {
      type: String
    },
    'objSimple': {
      type: Boolean,
      default: false
    },
    'filterid': {
      type: String,
    },
    'size': {
      type: String,
      default: 'small'
    },
    collapseTags: Boolean,
    // 只获取tag的name值
    'needTagName': {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      effect: 'plain',
      options: [],
      locading: false,
      isNull,
      optionsBak: [],
      props: {
        // 级联选择器增加多选的情况
        multiple: this.multiple,
      },
    }
  },
  mounted () {
    if (!this.setOptions) {
      if (this.type === 'cascader') {
        sysvalue.cascade(this.code, this.filtercodes).then(result => {
          this.options = result
          this.$emit('getOptions', result)
        })
      } else {
        if (this.filtercodes && this.filtercodes.length) {
          sysvalue.cascade(this.code, this.filtercodes).then(result => {
            this.options = result
            this.optionsBak = this.options.slice(0)
          })
        } else {
          sysvalue.listOnce(this.code).then(result => {
            if (result && result.length) {
              if (!this.filterid) {
                this.options = result
                this.optionsBak = this.options.slice(0)
              } else {
                this.options = result.filter(item => {
                  return this.filterid.includes(item.id)
                })
                this.optionsBak = this.options.slice(0)
              }
              if (this.firstDefault && !this.select) {
                this.select = this.useObject ? this.options[0] : this.options[0].code
              }
              if (this.cache) {
                sessionStorage.setItem(this.code, JSON.stringify({ options: result }))
              }
            }
          })
        }
      }
    }
    if (!this.multiple) {
      let el = this.$el
      let compThis = this
      el.onkeydown = function (e) {
        let keyNum = window.event ? e.keyCode : e.which
        if (keyNum === 13) {
          compThis.$refs.systype.visible = false
          compThis.$refs.systype.hoverIndex = -1
        }
      }
    }
  },
  watch: {
    'setOptions': function (val) {
      if (val) {
        this.options = val
      } else {
        this.options = []
      }
      this.optionsBak = this.options.slice(0)
    },
    'code': function () {
      sysvalue.listOnce(this.code).then(result => {
        this.options = result
        this.optionsBak = this.options.slice(0)
      })
    }
  },
  computed: {
    select: {
      set (newVal) {
        if (!newVal) {
          this.options = this.optionsBak
        }
        if (this.type === 'checkbox' || this.type === 'cascader' || this.multiple) {
          window.setTimeout(() => {
            this.$emit('input', newVal)
          }, 0)
        } else {
          let v
          if (this.useObject) {
            if (this.objSimple) {
              let newData
              if (this.multiple) { // 此条件适用于 multiple && objSimple 的情况
                newData = []
                newVal.forEach(item => {
                  newData.push({
                    id: item.code,
                    name: item.name,
                    code: item.code
                  })
                })
              } else {
                newData = {
                  id: newVal.code,
                  name: newVal.name,
                  code: newVal.code
                }
              }
              v = newData
            } else {
              v = newVal
            }
          } else {
            v = newVal === '' ? '' : newVal
          }
          window.setTimeout(() => {
            this.$emit('input', v)
          }, 0)
        }
      },
      get () {
        return this.value
      }
    },
  },
  methods: {
    // 点击tag项目的时候触发方法 4.11.1 by lvjiangtao@everjiankang.com
    handleClick (tag, index) {
      this.options.forEach(item => {
        item.tagEffect = false
      })
      tag.tagEffect = true
      if (this.needTagName) {
        this.$emit('input', tag.name)
      } else {
        this.$emit('input', {
          id: tag.id,
          name: tag.name,
          code: tag.code,
        })
      }
    },
    fun1 (val) {
      if (!val) {
        this.options = this.optionsBak
        return
      }
      this.options = this.optionsBak.filter(item => {
        if ((item.name && item.name.includes(val)) || (item.quanpin && item.quanpin.includes(val)) || (item.shoupin && item.shoupin.includes(val))) {
          return item
        }
      })
    },
    change (val) {
      let optionObj
      if (val) optionObj = objFind(this.options, { id: val })
      this.options = this.optionsBak
      this.$emit('change', val, this.objName, optionObj)
    },
    /* 增加一个可以获取对象的可能 */
    changeCascader (val) {
      if (!this.useObject) {
        return
      }
      let list = []
      if (val && val.length) {
        list = val.map(item => {
          if (this.multiple) {
            return item.map(i => findRecursion(this.options, i))
          } else {
            return findRecursion(this.options, item)
          }
        })
        if (this.objSimple) {
          list = list.map(item => {
            if (this.multiple) {
              return item.map(i => ({ id: i.id, code: i.code, name: i.name }))
            } else {
              return { id: item.id, code: item.code, name: item.name }
            }
          })
        }
      }
      this.$emit('value-change', list)
    },
  }
}
function findRecursion (list, code) {
  let res = null
  find(list, code)
  return res
  function find (innerList, innerCode) {
    for (let i = 0; i < innerList.length; i++) {
      const item = innerList[i]
      if (item.code === innerCode) {
        res = item
        return
      } else if (item.children && item.children.length) {
        find(item.children, innerCode)
      }
    }
  }
}
</script>
