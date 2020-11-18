<template>
  <el-cascader
    :style="styled || 'width: 100%'"
    size="small"
    v-model="select"
    collapse-tags
    :options="options"
    :placeholder="placeholder || '请选择物资类型'"
    @active-item-change="handleItemChange"
    :props="props"
  ></el-cascader>
</template>
<script>
import classifyApi from '@/warehouse/page/groupmaterial/store/classifyapi'
import { STENCIL_TYPE } from '@/util/common'
// import {_findIndex} from '@/util/formcustom'
export default {
  props: {
    styled: String,
    systemType: Number,
    placeholder: String,
    useObject: Boolean,
    multiple: {
      type: Boolean,
      default: true
    },
    collapseTags: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      options: [],
      props: {
        label: 'name',
        value: 'id',
        multiple: this.multiple,
        children: 'children'
      }
    }
  },
  async created () {
    let params = {
      id: '',
      level: 1001
    }
    this.options = await this.list(params)
  },
  computed: {
    select: {
      set (newVal) {
        let val = this.useObject ? this.getCascaderObj(newVal, this.options) : newVal
        console.log(newVal, '===')
        this.$emit('input', val)
        this.$emit('change', val)
        this.$emit('update:data', val[val.length - 1])
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
            opt = itm.children
            return itm
          }
        }
        return null
      })
    },
    list (params) {
      params.systemType = this.systemType || STENCIL_TYPE[0].id
      return classifyApi.classifyChildren(params).then(result => {
        if (result.classifyList) {
          result.classifyList.forEach((item, i) => {
            if (item.child) item.children = []
          })
          return result.classifyList
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
    handleItemChange (val) {
      let vals = this.getCascaderObj(val, this.options)
      let len = vals.length - 1
      let params = {
        id: vals[len].id,
        level: vals[len].level + 1
      }
      this.getChildrenData(params).then(result => {
        this.setChildrenData(vals, result)
      })
    }
  }
}
</script>
