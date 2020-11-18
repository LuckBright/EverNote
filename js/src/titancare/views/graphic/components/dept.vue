<!--  -->
<template>
  <div>
    <el-select
      class="mr10"
      style="width: 100%;"
      placeholder="请输入关键词"
      filterable
      clearable
      v-model="value"
      @change="add"
    >
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.tenantSubjectName"
        :value="item.id"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import api from '@/titancare/api/homemanage/homemanageapi'
const { getTenant, Updateicon } = api
export default {
  props: {},
  data () {
    return {
      value: '',
      loading: false,
      options: []
    }
  },
  created () {
    this._getTenant()
  },
  methods: {
    _getTenant (val) {
      let params = { type1CodeList: ['01'], offsaet: 0, pagesize: 10000, keyword: val }
      getTenant(params).then(res => {
        this.options = res.data && res.data.resultList ? res.data.resultList : []
      })
    },
    add () {
      this.loading = true
      Updateicon({ configKey: this.value, type: this.$route.query.tab === 'online' ? 3 : 2, configValue: '' }).then(res => {
        this.value = ''
        this.loading = false
        this.$emit('update')
      })
    }
  }
}
</script>
