<template>
  <div>
    <el-cascader
      v-model="sourceCascader"
      :placeholder="placeholder"
      :options="options"
      :props="{ value: 'id', checkStrictly: true, emitPath: false, label: 'text', multiple: multiple }"
      :style="{ width }"
      separator=" - "
      filterable
      clearable
      :disabled="disabled"
    >
    </el-cascader>
  </div>
</template>

<script>
import { crm } from '@/crm/store/api'

export default {
  props: {
    value: {
      type: [String, Array, Object],
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '渠道'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '100%'
    }
  },
  data () {
    return {
      options: []
    }
  },
  created () {
    this.searchTrees({}).then(res => {
      this.options = res
    })
  },
  computed: {
    sourceCascader: {
      set (newVal) {
        this.$emit('input', this.multiple ? newVal.join(',') : newVal)
      },
      get () {
        return this.value ? (this.multiple ? this.value.split(',') : this.value) : ''
      }
    }
  },
  methods: {
    async searchTrees ({ parentId, status, name }) {
      let params = {}
      if (parentId) Object.assign(params, { parentId })
      let resData = await crm.get('/memberChannel/searchTrees', { params }).then()
      if (resData && resData.data) return resData.data.resultList || []
      return []
    }
  }
}
</script>
