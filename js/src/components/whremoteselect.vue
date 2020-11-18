<template>
  <div>
    <el-select
      v-model="select"
      filterable
      clearable
      class="remote-select"
      :remote="remote"
      :remote-method="query"
      :loading="loading"
      @change="change"
      @clear="clear"
      :placeholder="placeholder"
      :size="size"
      :disabled="disabled"
      :value-key="obj ? 'id' : 'value'"
      style="width:100%;"
    >
      <el-option
        v-for="(option, i) in options"
        :key="i"
        :label="option.name || option.code"
        :value="obj ? option : option.id"
      >
        <span style="float: left">{{ option.name || option.code }}</span>
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { patch, SEARCH_CODE, MATERILA_PINYIN_CODE, GOLBAL_VAL_MATERIL_NAME, parserComplex } from '@/util/common'
export default {
  props: ['value', 'remoteMethod', 'remote', 'obj', 'placeholder', 'size', 'disabled', 'params', 'splitFlag', 'initoptions', 'focus', 'showName', 'state', 'islocal'],
  data () {
    return {
      loading: false,
      options: this.initoptions || [],
      select: this.value
    }
  },
  watch: {
    'value': function (val) {
      this.select = val
    },
    'select': function (val) {
      this.$emit('input', val)
      this.$emit('change', val)
    },
    'remoteMethod' () {
      this.options = []
    },
    'initoptions' () {
      this.options = this.initoptions
    }
  },
  methods: {
    query (condition) {
      if (!condition) return
      let splitFlag = Number(this.splitFlag)
      let state = Number(this.state)
      let codeQuery = [...MATERILA_PINYIN_CODE, ...SEARCH_CODE]
      // islocal判断是否需要localSettingSearch 不传默认是undefined 代表需要
      let obj = this.params
        ? Object.assign(!this.islocal
          ? { localSettingSearch: { codesMatchValues: [{ codes: codeQuery, value: condition }] } }
          : { codesMatchValues: [{ codes: codeQuery, value: condition }] }, this.params)
        : { name: condition }
      if (this.params && typeof this.params.name !== 'undefined') { obj.name = condition }
      // 添加物资禁用启用查询 0 - 启用（关闭） 1 - 禁用（开启）建辉告诉我的
      if (!isNaN(state) && this.params) {
        if (obj.localSettingSearch) {
          obj.localSettingSearch.state = state
        } else {
          obj.state = state
        }
      }
      // splitFlag 是否查询拆零物资 0/不查拆零 1/查询拆零
      if (!isNaN(splitFlag) && this.params) {
        if (obj.localSettingSearch) {
          obj.localSettingSearch.splitFlag = splitFlag
        }
      }
      // Object.assign(obj, this.params, {offset: 0, pagesize: 20})
      this.loading = true
      this.remoteMethod(obj).then(results => {
        this.loading = false
        if (results && results.list) {
          this.options = results.list
        } else if (results.data && results.data.resultList) {
          this.options = results.data.resultList
        } else if (results.data) {
          this.options = results.data
        } else if (results.localSettingList) {
          this.options = results.localSettingList
        } else {
          this.options = results
        }
        this.resetOpts(this.options || [])
      })
    },
    change () {
      this.options = []
    },
    clear () {
      this.$emit('clear', arguments[0])
      this.options = []
    },
    resetOpts (opts) {
      opts.forEach(item => {
        if (item.localSettingObject || item.materialSkuObject) {
          const data = item.localSettingObject ? item.localSettingObject.materialSkuObject.ext : item.materialSkuObject.ext
          item.name = parserComplex({ data, standard: true, propertys: GOLBAL_VAL_MATERIL_NAME.NAME_ONE })
        }
      })
    },
    ...patch
  }
}
</script>
<style scoped>
.font {
  font-size: 12px;
  color: #999;
  padding-left: 10px;
}
.el-select /deep/ .el-input__inner {
  cursor: text !important;
}
</style>
