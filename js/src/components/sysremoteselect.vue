<template>
  <el-select
    style="width: 100%;"
    ref="select"
    v-model="select"
    filterable
    remote
    :disabled="disabled"
    reserve-keyword
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    value-key="id"
    :loading="loading"
    :size="size"
    :clearable="clearable"
    v-bind="{'multiple': multiple ? true : false, 'collapse-tags': collapsetags ? true : false}"
  >
    <el-option
      v-for="option in optionsArr"
      :key="option.id"
      :label="field && field.useName ? option[field.useName] : option.name"
      :value="(useObject || (field && field.useObject)) ? option : option.id"
    ></el-option>
  </el-select>
</template>
<script>
import { base as axios } from './baseapi'
import { string2Array } from '@/util/common'
export default {
  /**
   * props                        字段含义
   * @param isAutoSeach           是否自动查询(主要针对warehouse生产厂商回显) （Boolean）
   */
  props: ['apiUrl', 'value', 'disabled', 'useObject', 'options', 'multiple', 'collapsetags', 'field', 'isAutoSeach', 'size', 'isInitOptions', 'clearable', 'isParams'],
  data () {
    return {
      loading: false,
      optionsArr: this.options || [],
      objId: this.$route.params.id
    }
  },
  created () {
    if (this.value) {
      if (Array.isArray(this.value) && (this.useObject || (this.field && this.field.useObject))) {
        this.optionsArr = this.value
      } else {
        let name = this.field && this.field.useName ? this.value[this.field.useName] : this.value.name
        if (name && (!this.optionsArr || !this.optionsArr.length)) {
          this.remoteMethod(name)
        }
      }
    } else {
      if (this.isInitOptions) {
        this.remoteMethod()
      }
    }
  },
  computed: {
    select: {
      set (newVal) {
        if ((this.useObject || (this.field && this.field.useObject))) {
          this.$emit('input', newVal)
        } else {
          this.$emit('input', newVal ? (this.multiple ? newVal.join(',') : newVal) : '')
        }
      },
      get () {
        if (this.isAutoSeach && this.value) this.remoteMethod(this.value)
        if ((this.useObject || (this.field && this.field.useObject))) {
          return this.value
        } else {
          let arr = this.multiple && this.value ? string2Array(this.value) : []
          return this.multiple ? arr : this.value
        }
      }
    }
  },
  methods: {
    remoteMethod (name) {
      name = name || ''
      this.loading = true
      let params = Object.assign({}, this.params)
      if (!this.isInitOptions) {
        params.offset = 0
        params.pagesize = 20
      }
      if (this.field && this.field.useName) {
        params[this.field.useName] = name
      } else {
        params.name = name
      }
      if (this.isParams) {
        params.name = ''
      }
      axios.post(this.apiUrl, params).then(result => {
        this.loading = false
        if (result) {
          if (result.list) {
            this.optionsArr = result.list.slice(0).map(item => {
              if (item.code && this.isParams) item.id = item.code
              return item
            })
          } else {
            this.optionsArr = result.slice(0).map(item => {
              if (item.code && this.isParams) item.id = item.code
              return item
            })
          }
        } else {
          this.optionsArr = []
        }
      })
    }
  },
  watch: {
    'optionsArr' (arr) {
      if (this.isAutoSeach && arr.length) {
        if (arr[0].name === this.value) this.$emit('input', arr[0].id)
      }
    }
  }
}
</script>
<style scoped>
.el-select /deep/ .el-input__inner {
  cursor: text !important;
}
</style>
