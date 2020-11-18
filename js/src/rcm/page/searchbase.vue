<template>
  <span>
    <el-select v-model="select" clearable remote :placeholder="placeholder || '请输入关键词'" :remote-method="remoteMethod" @change="change" style="width: 100%" :filterable="true" value-key="code">
      <el-option v-for="item in baseOptions" :key="item.code" :label="item.name" :value="item">
      </el-option>
    </el-select>
  </span>
</template>
<script>
import { getKingdeeBaseArchives } from '../store/baseData'

export default {
  props: ['value', 'targetType', 'placeholder'],
  data () {
    return {
      baseOptions: [],
      inputselect: ''
    }
  },
  watch: {
    'targetType': {
      handler: function (val, oldVal) {
        this.remoteMethod('')
      }
    }
  },
  methods: {
    async remoteMethod (query) {
      query = query && String(query).trim()
      try {
        let params = {
          formId: this.targetType,
          filterString: query
        }
        let data = await getKingdeeBaseArchives(params)
        this.baseOptions = data.data
      } catch (err) {}
    },
    change (val) {
      this.$emit('change', val)
    }
  },
  computed: {
    select: {
      set (newVal) {
        this.$emit('input', newVal)
        this.$emit('select', newVal)
      },
      get () {
        return this.value
      }
    }
  },
  created () {
    this.remoteMethod()
  }
}
</script>
<style scoped>
.option-field {
  display: inline-block;
  margin-right: 10px;
}
</style>
