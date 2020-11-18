<template>
  <ever-select
    :placeholder="placeholder"
    v-model="select"
    :options="options"
    :clearable="clearable"
    @change="handleChange"
  ></ever-select>
</template>

<script>
import { getMedicalOrgList } from '@/rcm/store/otmdiscomponent/insurancesignin.js'
import { mapState } from '@/healthinsurance/store/modules/insuraneCenter/publish.js'
export default {
  props: {
    value: {
      type: [String, Object],
      default: ''
    },
    defaultFirst: {
      type: [Boolean],
      default: false
    },
    clearable: {
      type: [Boolean],
      default: true
    },
    placeholder: String
  },
  data () {
    return {
      options: []
    }
  },
  computed: {
    ...mapState(['list']),
    select: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    async getMedicalOrgList () {
      let options
      // vuex 中如果存在医保中心数据，直接使用(兼容非医保工作站使用该组件的情况)
      if (this.list && this.list.length) {
        options = this.list
      } else {
        // vuex中不存在医保中心数据时，调取接口
        let params = {
          corpType: '0', // 基本医疗保险
          offset: 0,
          page: 1,
          pagesize: 20
        }
        const res = await getMedicalOrgList(params)
        try {
          options = res.data.map(item => ({ name: item.insuranceOrgCnName, id: item.id }))
        } catch (error) { }
      }
      this.options = options
      let defaultFirst = options.length ? options[0]['id'] : ''
      if (this.defaultFirst && defaultFirst) {
        this.$emit('input', defaultFirst)
        this.handleChange(defaultFirst)
      }
    },
    handleChange (val) {
      this.$emit('change', val)
    }
  },
  created () {
    this.getMedicalOrgList()
  },
}
</script>
