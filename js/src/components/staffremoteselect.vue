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
    :disabled="disabled"
    :showKeys="showKeys"
    :value-key="obj ? 'id' : 'value'"
    style="width:100%">
    <el-option
      v-for="option in options"
      :key="option.id"
      :label="option.name"
      :value="obj ? option : option.id">
      <div class="font1" v-if="showKeys">
        <span class="font" v-for="(key, i) in showKeys" :key="i">
          <span v-if="key == 'departmentName'" class="width smallwidth">{{ (option.departmentObject ? option.departmentObject.name : '') }}</span>
          <span v-else-if="key == 'sex'" class="width">{{ setName(sexOption, option[key], true) }}</span>
          <span v-else class="width">{{ option[key] }}</span>
        </span>
      </div>
    </el-option>
  </el-select>
</template>

<script>
import sysvalue from '@/warehouse/store/sysvalueapi'
import setName from '@/util/setstatusname'
export default {
  mixins: [setName],
  props: ['value', 'remoteMethod', 'remote', 'obj', 'placeholder', 'size', 'disabled', 'showKeys', 'params', 'initoptions', 'delOptions'],
  data () {
    return {
      loading: false,
      options: this.initoptions || [],
      select: this.value,
      selectOption: [],
      sexOption: []
    }
  },
  watch: {
    'value': function () {
      this.select = this.value
    },
    'select': function () {
      this.$emit('input', this.select)
    },
    'remoteMethod' () {
      this.options = []
    },
    'initoptions' () {
      this.options = this.initoptions
    },
    'delOptions' (arr) {
      if (arr.length) {
        this._filterOption(this.options, arr)
      }
    },
    'options' (arr) {
      if (arr.length) {
        this._filterOption(arr, this.delOptions)
      }
    }
  },
  created () {
    sysvalue.listOnce('GBT.2261.1').then(res => {
      if (res) {
        this.sexOption = res
      }
    })
  },
  methods: {
    query (condition) {
      if (!condition.trim()) { return false }
      let obj = this.params ? Object.assign({ nameList: condition }, this.params) : { nameList: condition }
      this.remoteMethod(obj).then(results => {
        if (!results.success) return
        if (results.list) {
          this.options = results.list
        } else if (results.data && results.data.resultList) {
          this.options = results.data.resultList
        } else if (results.data) {
          this.options = results.data
        } else {
          this.options = results
        }
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
      })
    },
    change () {
      this.$emit('change', arguments[0])
    },
    clear () {
      this.$emit('clear', arguments[0])
    },
    // 过滤已关联人员
    _filterOption (filterArr, comparisonArr) {
      // comparisonArr.forEach(item => {
      //   filterArr.forEach((item1, index) => {
      //     if (item.staffId === item1.id) {
      //       filterArr.splice(index, 1)
      //     }
      //   })
      // })
    }
  },
  mounted () {
    this.initOptions()
  }
}
</script>
<style scoped lang="less">
  .font { font-size: 14px; color: #666666;}
  .font {width: 60px; display: inline-block; padding: 0 10px;}
  .font1:hover .font {
    color: #fff;
  }
  .font1 span:nth-child(1) {width: 80px;}
  .font1 span:nth-child(2) {width: 80px;}
  .font1 span:nth-child(3) {width: 30px;}
  .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
     .font1 .font {
        color: #fff;
      }
  }
</style>

