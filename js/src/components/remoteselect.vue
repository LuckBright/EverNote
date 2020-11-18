<template>
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
    :default-first-option="true"
    :disabled="disabled"
    :value-key="valueKey ? 'id' : 'value'"
    style="width:100%"
  >
    <el-option
      v-for="option in options"
      :key="option.id"
      :label="option.name"
      :value="valueKey ? option : option.id"
    >
    </el-option>
  </el-select>
</template>

<script>
import sysvalue from '@/warehouse/store/sysvalueapi'
export default {
  props: ['value', 'remoteMethod', 'remote', 'obj', 'useObject', 'placeholder', 'size', 'disabled', 'params', 'initoptions', 'focus', 'showName'],
  data () {
    return {
      loading: false,
      options: this.initoptions || [],
      select: this.value,
      dosageFormArr: [],
      selectOption: []
    }
  },
  computed: {
    valueKey () {
      if (this.obj || this.useObject) return true
      return false
    }
  },
  watch: {
    'value': function (val) {
      this.select = val
    },
    'select': function (val) {
      this.$emit('input', val)
    },
    'remoteMethod' () {
      this.options = []
    },
    'initoptions' () {
      this.options = this.initoptions
    }
  },
  created () {
    if (this.obj && this.value) this.options.push(this.value)
    sysvalue.listOnce('THC_WH_DRUG_FORM').then(res => {
      if (res) {
        this.dosageFormArr = res
      }
    })
  },
  methods: {
    query (condition) {
      condition = condition.trim()
      if (!condition) { return false }
      this.loading = true
      let obj = this.params ? Object.assign({ name: condition }, this.params) : { name: condition }
      this.remoteMethod(obj).then(results => {
        if (results.list) {
          this.options = results.list
        } else if (results.data && results.data.resultList) {
          this.options = results.data.resultList
        } else if (results.data) {
          this.options = results.data
        } else {
          this.options = results
        }
        this.loading = false
        this.options = this._resetOptions(this.options)
      })
    },
    initOptions () {
      if (this.remote || !this.remoteMethod) { return false }
      this.remoteMethod(this.params).then(results => {
        this.options = results.list || results.data || results
        if (results.data && results.data.resultList) {
          this.options = results.data.resultList
        } else if (results.data) {
          this.options = results.data
        } else if (results.list) {
          this.options = results.list
        } else {
          this.options = results
        }
        this.options = this._resetOptions(this.options)
      })
    },
    change () {
      this.$emit('change', arguments[0])
    },
    clear () {
      this.$emit('clear', arguments[0])
    },
    _resetOptions (result) {
      if (this.showName) {
        for (let key in result) {
          if (!result[key].name) {
            result[key] = Object.assign({}, result[key], { name: '' })
          }
          result[key].name = result[key][this.showName] ? result[key][this.showName].name : ''
        }
      }
      result = result.map(item => {
        return { id: item.id, name: item.name }
      })
      return result
    }
  },
  mounted () {
    this.initOptions()
  }
}
</script>
<style scoped>
.font {
  font-size: 12px;
  color: #999;
  padding-left: 10px;
}
</style>
