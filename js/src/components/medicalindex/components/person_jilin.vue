<template>
  <el-select clearable  placeholder="—" filterable="" @focus="getPerson" :value="value[prop]" @change="change">
    <el-option
      v-for="item in persons"
      :key="item.id"
      :label="item.name"
      :value="item.name">
    </el-option>
  </el-select>
</template>

<script>
import api from '@/arrange/store/triageapi'
// const DOCTOR = 1
// const NURSE = 7
export default {
  created () {
  },
  props: {
    value: {
      type: Object
    },
    prop: String,
    index: [String, Number],
    dptId: String,
    type: Array
  },
  methods: {
    handleQueryChange (str) {
      this.persons.map(item => {
        if (item.name.includes(str)) {
          item.show = true
        } else {
          item.show = false
        }
      })
    },
    change (val) {
      this.$emit('change', this.prop, val, this.index)
    },
    getPerson () {
      if (this.init) return
      api
        .getSectionId({
          tenantSubjectIdList: [this.dptId],
          typeCodeList: this.type
        })
        .then(rs => {
          if (rs.head.errCode === 0) {
            if (Array.isArray(rs.data.resultList)) {
              rs.data.resultList.forEach(item => {
                this.$set(item, 'value', {name: item.name, code: item.jobNumber})
              })
              this.persons = rs.data.resultList
            }
          }
          this.init = true
        })
    }
  },
  data () {
    return {
      persons: [],
      init: false,
    }
  }
}
</script>
<style scoped lang="scss">
.small_font {
  font-size: 12px;
}
.mr {
  margin: 5px;
}
</style>
