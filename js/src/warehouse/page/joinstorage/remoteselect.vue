<template>
  <div id="remoteselect">
    <!-- islocal判断是否需要localSettingSearch 不传默认是false 代表需要 -->
    <ever-wh-remote-select
      v-model="select"
      :remote-method="queryRemote"
      :params="queryParams"
      filterable
      remote
      :islocal="islocal"
      :state="state"
      :disabled="disabled"
      :showName='showName'
      width="100%"
      :newName="newName"
      :splitFlag="splitFlag"
      @change="handleSelect"
      @clear="handleClear"
      :placeholder="placeholder || '请输入商品名称／编码／通用名'"
      obj="true"
      size="small"
      ref="drugSelect">
    </ever-wh-remote-select>
  </div>
</template>
<script>
export default {
  props: ['queryParams', 'showName', 'api', 'value', 'index', 'index2', 'apiName', 'disabled', 'isSeachSelect', 'isObj', 'state', 'placeholder', 'islocal', 'splitFlag', 'ifMoreThan', 'newName'],
  data () {
    return {
      select: this.value
    }
  },
  watch: {
    'value': function () {
      this.select = this.value
    },
    'select': function () {
      this.$emit('input', this.select)
    }
  },
  methods: {
    async handleSelect (obj) {
      let objSelect = ''
      if (obj.localSettingObject) {
        obj.id = obj.localSettingObject.id
      }
      if (this.isSeachSelect && obj.localMaterialId) {
        let params = {}
        // ifMoreThan 是否查询库存小于0的数据
        let ifMoreThan = this.ifMoreThan ? this.ifMoreThan : 0
        Object.assign(params, this.queryParams, { localMaterialId: obj.localMaterialId, ifMoreThanZero: ifMoreThan })
        let dataSelect = await this.api.list(params).then()
        if (dataSelect && dataSelect.list && dataSelect.list.length) objSelect = dataSelect.list[0]
        if (this.isObj && !objSelect) objSelect = obj
      } else {
        objSelect = obj
      }
      this.$emit('selectSave', objSelect, this.index, this.index2)
    },
    handleClear (obj) {
      if (!obj) this.$emit('selectSave', '', this.index, this.index2)
    },
    queryRemote (query) {
      if (this.apiName) {
        return this.api[this.apiName](query)
      }
      return this.api.list(query)
    }
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
</style>
