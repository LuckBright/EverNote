<template>
  <el-select v-model="staff" :placeholder="placeholder || '请选择'" clearable filterable :disabled="disabled" @change="change">
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
</template>
<script>
  import staffApi from '@/warehouse/store/staffapi'
  export default {
    props: ['value', 'disabled', 'placeholder'],
    data () {
      return {
        options: []
      }
    },
    created () {
      staffApi.list()
        .then(result => {
          console.log(result)
          this.options = result.list
          // this.staff = this.value || this.options[0].id
        })
    },
    computed: {
      'staff': {
        set (newVal) {
          this.$emit('input', newVal)
        },
        get () {
          return this.value
        }
      }
    },
    methods: {
      change (val) {
        this.$emit('change', val)
      }
    }
  }
</script>
