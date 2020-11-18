/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-02-05 21:25:28
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-02-26 16:38:42
 */
<template>
  <ever-form2
    onsubmit="return false;"
    :schema="querySchema"
    v-model="queryObj"
    ref="form"
    class="query-style custom-form-item"
    :inline="true"
    :is-query="true"
    :input-query="true"
    @query="list">
    <template slot="default">
      <el-form-item :class="{'ml20': showSlot}">
        <slot></slot>
      </el-form-item>
    </template>
  </ever-form2>
</template>

<script>
const querySchema = [
  {
    name: 'searchCode',
    props: {
      placeholder: '请输入姓名、订单编号',
      clearable: true,
      'suffix-icon': 'el-icon-search'
    },
  }
]
export default {
  props: {
    value: {
      type: String
    },
    showSlot: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      input: '',
      querySchema,
      queryObj: {
        searchCode: ''
      }
    }
  },
  watch: {
    'queryObj.searchCode': function (newVal) {
      this.$emit('update:value', newVal)
    }
  },
  methods: {
    list () {
      console.log(this.value)
      this.$emit('query', this.queryObj.searchCode)
    },
  }
}
</script>

