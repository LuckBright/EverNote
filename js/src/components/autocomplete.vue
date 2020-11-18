<template>
  <el-autocomplete
    class="inline-input"
    v-model="selected"
    :fetch-suggestions="querySearch"
    :placeholder="placeholder"
    @select="handleSelect"
    :disabled="disabled||false"
  ></el-autocomplete>
</template>

<script>
  export default {
    props: ['id', 'value', 'options', 'placeholder', 'disabled'],
    computed: {
      selected: {
        set (val) {
          this.$emit('input', val)
          this.$emit('change', val)
        },
        get () {
          return this.value
        }
      }
    },
    watch: {
    },
    methods: {
      handleSelect (item) {
      },
      querySearch (queryString, cb) {
        var results = queryString ? this.options.filter(this.createFilter(queryString)) : this.options
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      createFilter (queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      }
    }
  }
</script>

