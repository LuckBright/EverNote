<!--
  各类型物资 SKU 查看/添加/修改
-->
<template>
  <div>
    <el-table
    :data="skuDataList">
      <el-table-column
      v-for="(item, index) in skuRowObject"
      :key="index">
        <template slot="header" slot-scope="scope">
          {{item.label}}
        </template>
        <template slot-scope="scope">
          {{item.code}}
          {{scope.row[item.code]}}
          <el-input v-model="scope.row[item.code]"></el-input>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import * as enumConfig from '@/util/common'
export default {
  props: {
    // 物资类型 ID
    classifyId: {
      type: String,
      default: ''
    },
    // 物资SKU列表list数据
    specTableData: {
      type: Array,
      default: () => []
    },
    // 物资 需要展示的 SKU 具体code list
    skuCodeList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      enumConfig,
      skuRowObject: [],
      skuDataList: this.specTableData
    }
  },
  methods: {
    findCodeLabel (code) {
      let label = ''
      switch (code) {
        case 'SXX000049' :
          label = '包装单位'
          break
        case 'SXX000050' :
          label = '条码'
          break
        case 'price' :
          label = '价格'
          break
        case 'ope' :
          label = '操作'
          break
        default :
          label = ''
      }
      return label
    }
  },
  watch: {
    'specTableData' (v) {
      this.skuDataList = v
    },
    'skuCodeList' (v) {
      this.skuRowObject = []
      v.forEach(item => {
        let obj = {}
        obj.code = item
        obj.label = this.findCodeLabel(item)
        this.skuRowObject.push(obj)
      })
    },
    'skuDataList' (v) {
      console.log(v, '-----')
    }
  }
}
</script>
