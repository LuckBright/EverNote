<template>
  <el-cascader
    v-model="select"
    :options="options"
    :placeholder="placeholder ? placeholder : '药理分类'"
    @change="handleChange"
    @active-item-change="handleChange"
    :props="phprops"
    :disabled="disabled ? true : false"
    filterable
    :clearable="true">
    </el-cascader>
</template>
<script>
export default {
  props: ['customApi', 'placeholder', 'isValueArr', 'disabled'],
  data () {
    return {
      options: [],
      phprops: {
        label: 'name',
        value: 'id',
        children: 'children'
      }
    }
  },
  async created () {
    let params = {}
    let optionArr = []
    optionArr = await this.list(params)
    if (optionArr && optionArr.length) this.options = optionArr
  },
  computed: {
    select: {
      set (newVal) {
        if (this.isValueArr) {
          this.$emit('input', newVal)
          this.$emit('change', newVal)
        } else {
          this.$emit('input', { id: newVal, idOptions: this.options })
          this.$emit('change', { id: newVal, idOptions: this.options })
        }
      },
      get () {
        return this.value || []
      }
    }
  },
  methods: {
    getCascaderObj (val, opt) {
      return val.map(function (value, index, array) {
        for (var itm of opt) {
          if (itm.id === value) {
            opt = itm.pharmacologyCategories || []
            return itm
          }
        }
        return null
      })
    },
    list (params) {
      Object.assign(params, { offset: 0, pagesize: 20 })
      return this.customApi.list(params).then(result => {
        if (result && result.length) {
          result.forEach((item, i) => {
            if (item.pharmacologyCategories && item.pharmacologyCategories.length) item.children = item.pharmacologyCategories
          })
          return result
        }
      })
    },
    setChildrenData (rows, data) {
      [rows.pop()].map(function (value) {
        value.children = data
      })
    },
    async getChildrenData (params) {
      return await this.list(params)
    },
    handleChange (val) {
      // let vals = this.getCascaderObj(val, this.options)
      // console.log(vals, val, this.options)
      // this.setChildrenData(vals, vals.pharmacologyCategories || [])
      // if (vals.length) {
      //   let len = vals.length - 1
      //   let params = { id: vals[len].id }
      //   this.getChildrenData(params).then(result => {
      //     if (result && result.length) {
      //       this.setChildrenData(vals, result)
      //     }
      //   })
      // } else {
      //   this.getChildrenData({})
      // }
    }
  }
}
</script>
