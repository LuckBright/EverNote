<template>
  <div>
    <el-select
      v-model="select"
      ref="selectMater"
      filterable
      clearable
      class="remote-select"
      remote
      :remote-method="(query) => { remoteMethod(query) }"
      :loading="loading"
      @change="change"
      @clear="clear"
      :placeholder="placeholder"
      :disabled="disabled"
      :multiple="multiple"
      :collapse-tags="collapseTags"
      :value-key="'localMaterialId'"
      size="small"
      style="width:100%;">
      <el-option
        v-for="(option, i) in options"
        :key="i"
        :label="option.materialNameAll"
        :value="needObjFlag ? option : option.localMaterialId"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import api from '@/warehouse/store/getmaterialinfoapi.js'
export default {
  props: {
    value: {
      type: [Object, String]
    },
    // 查询物资传参参数
    params: {
      type: Object,
      default: () => {}
    },
    // 查询物资接口
    apiName: {
      type: String,
      default: 'getLocalSettingList'
    },
    // 是否返回Object对象 默认不返回
    needObjFlag: {
      type: Boolean,
      default: false
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 多选折叠显示
    collapseTags: {
      type: Boolean,
      default: false
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      options: [],
      selectArr: [],
      select: this.value,
      placeholder: '请输入通用名/商品名/首字母缩写/条形码/物资编码'
    }
  },
  methods: {
    // 远程查询物资数据方法
    remoteMethod (name) {
      if (!name) {
        if (!this.multiple) this.options = []
        return
      }
      let params = Object.assign({}, this.params)
      this.loading = true
      name.indexOf('-') > -1 ? delete params.name : delete params.ids
      api[this.apiName](Object.assign({}, params, {pagesize: 100, offset: 0}, name.indexOf('-') > -1 ? {ids: [name]} : {name})).then(results => {
        this.loading = false
        const res = results || []
        this.options = res.filter(item => !this.selectArr.some(child => child.localMaterialId === item.localMaterialId)).concat(this.selectArr)
      })
    },
    // 选择物资数据
    change (val) {
      if (this.needObjFlag && val instanceof Object) {
        let newVal = Object.assign({}, val)
        delete newVal.materialNameAll
        this.$emit('change', newVal)
      } else {
        if (this.multiple) {
          let find = this.options.find(item => item.localMaterialId === val[val.length - 1])
          find && !this.selectArr.some(item => item.localMaterialId === find.localMaterialId) && this.selectArr.push(find)
        }
        this.$emit('change', val)
      }
    },
    // 清除输入框数据
    clear () {
      this.$emit('clear', arguments[0])
      this.options = []
      this.selectArr = []
    }
  },
  watch: {
    'value': function (v) {
      this.select = this.value
      if (this.needObjFlag) {
        this.remoteMethod(v.id)
      } else {
        this.remoteMethod(v)
      }
    },
    'select': function (v) {
      this.$emit('input', this.select)
    }
  }
}
</script>

<style scoped lang="scss">
.remote-select {
  /deep/ .el-select__tags-text{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    max-width: 270px;
  }
  /deep/ .el-icon-close {
    right: -3px;
    top: -6px;
  }
}
</style>
