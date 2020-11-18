<template>
  <div class="service-query">
    <el-select
      v-show="!noHasService"
      style="width:100%"
      reserve-keyword
      filterable
      remote
      clearable
      v-model="service"
      :remote-method="remoteMethod"
      :loading="loading"
      placeholder="请选择收费项"
      class="select"
      :disabled="disabled"
      value-key="id"
      @clear="remoteMethod('')"
    >
      <el-option 
        class="service-option"
        v-for="item in options"
        :key="item.id + item.name"
        :label="item.name || item.byname"
        :value="item"></el-option>
    </el-select>
    <div v-if="noHasService">
      <el-input :value="service.name" clearable @input="change"></el-input>
      <span class="error-status">(已停用/无使用权)</span>
    </div>
  </div>
</template>
<script>
import api from '@/sob/store/surcharge'
import { objFind } from '@/util/common'

export default {
  props: {
    value: Object | String,
    types: {
      type: Array,
      default: () => []
    },
    filterServiceClassificationList: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      options: [],
      loading: false,
      service: {},
      noHasService: false
    }
  },
  created () {
    this.key = Math.random().toString().slice(2)
    this.remoteMethod(this.value && this.value.name || '').then(res => {
      if (this.value && this.value.id && !objFind(res, {id: this.value.id})) {
        this.noHasService = true
      }
    })
  },
  methods: {
    async remoteMethod (query) {
      this.loading = true
      let res = await api.queryService({
        name: query,
        filterServiceClassificationList: this.filterServiceClassificationList,
        serviceClassificationList: this.types,
        isAdviceList: [11, 1],
        isValid: 1,
        usePermission: 1,
        offset: 0,
        pagesize: 100
      }, this.key)
      this.options = res || []
      this.loading = false
      this.noHasService = false
      return this.options
    },
    change () {
      this.service = ''
      this.noHasService = false
      this.remoteMethod('')
    }
  },
  watch: {
    value: {
      handler (val) {
        this.service = val
      },
      deep: true,
      immediate: true
    },
    service: {
      handler (val) {
        this.$emit('input', val)
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
  .service-option {
    color: #444444;
    &.hover{
      color: #ffffff;
    }
  }
  .error-status {
    color: red;
  }
</style>
