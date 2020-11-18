<template>
  <el-cascader
    v-model="medical"
    :options="medicalList"
    :show-all-levels="false"
    v-bind="$attrs"
    :props='props'
  ></el-cascader>
</template>
<script>
import sysvalue from '@/warehouse/store/sysvalueapi'

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    code: {
      type: String,
      default: 'THC_CPOE_ZYBASYFYLX'
    },
    props: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      medicalList: []
    }
  },
  computed: {
    medical: {
      set (newVal) {
        let val
        if (Array.isArray(newVal)) {
          val = newVal[newVal.length - 1]
        } else {
          val = newVal
        }
        this.$emit('input', val)
      },
      get () {
        return this.value
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      sysvalue.cascade(this.code).then(res => {
        if (res && res.length) {
          let data = res.filter(item => {
            return item.id.split('.').length < 2
          })
          this.medicalList = data
          return
        }
        this.medicalList = []
      }).catch(() => {
        this.medicalList = []
      })
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
