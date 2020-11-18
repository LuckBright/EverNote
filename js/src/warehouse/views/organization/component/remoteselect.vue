/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-05-21 09:14:40
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-05-26 11:23:37
 * 根据接口一次查询出所有数据
 */
<template>
  <el-select
    ref="select"
    v-model="select"
    filterable
    reserve-keyword
    default-first-option
    value-key="id"
    :disabled="disabled"
    :placeholder="placeholder"
    :loading="loading"
    :size="size"
    :clearable="clearable"
    @clear="clear"
    v-bind="{'multiple': multiple ? true : false, 'collapse-tags': collapsetags ? true : false}">
    <el-option
      v-for="option in options"
      :key="option.id"
      :label="field.useName ? option[field.useName] : option.name"
      :value="(useObject || (field && field.useObject)) ? option : option.id"
    ></el-option>
  </el-select>
</template>

<script>
import { base as axios } from '@/components/baseapi'
import { string2Array } from '@/util/common'
const cache = {}
export default {
  name: 'RemoteSelect',
  props: {
    value: [String, Number, Object, Array],
    apiUrl: String,
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    multiple: Boolean,
    collapsetags: Boolean,
    placeholder: String,
    size: {
      type: String,
      default: 'small'
    },
    useObject: Boolean,
    field: {
      type: Object,
      default: () => ({})
    },
    format: {
      type: Object,
      default: () => ({})
    },
    params: {
      type: Object,
      default: () => ({})
    },
    beforeQuery: Function,
    afterQuery: Function,
    notCache: Boolean
  },
  data () {
    return {
      loading: false,
      options: []
    }
  },
  created () {
    this.remoteMethod()
  },
  computed: {
    select: {
      set (newVal) {
        if ((this.useObject || (this.field.useObject))) {
          this.$emit('input', newVal)
        } else {
          this.$emit('input', newVal || '')
        }
      },
      get () {
        if ((this.useObject || (this.field.useObject))) {
          return this.value
        } else {
          let arr = this.multiple && this.value ? string2Array(this.value) : []
          return this.multiple ? arr : this.value
        }
      }
    }
  },
  methods: {
    clear () {
      this.$emit('clear', arguments[0])
    },
    remoteMethod (name) {
      name = name || ''
      let params = Object.assign({}, this.params)
      if (this.beforeQuery) {
        params = this.beforeQuery(params)
      }
      const key = this.apiUrl + JSON.stringify(params)
      const cacheData = cache[key]
      if (!this.notCache && cacheData) {
        this.options = cache[key]
        return
      }
      this.loading = true
      axios.post(this.apiUrl, params).then(result => {
        if (result) {
          try {
            this.options = (result.list || result).map(item => Object.assign(item, {
              id: item[this.format.id] || item.id,
              name: item[this.format.name] || item.name
            }))
            if (this.afterQuery) {
              this.options = this.afterQuery(this.options)
            }
            if (!cacheData) {
              cache[key] = this.options
            }
          } catch (error) { }
        } else {
          this.options = []
        }
      }).finally(_ => {
        this.loading = false
      })
    }
  }
}
</script>

