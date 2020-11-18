<!--发药管理医嘱详情表格组件 -->
<template>
  <div>
    <p class='label-tip'>
      <span class='value-info'>{{name}}</span>
    </p>
    <el-table
      v-if="name === '西药' || name === '中成药'"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      show-summary
      :summary-method="getSummariesXiyao"
      @selection-change="handleSelectionChange">
      <el-table-column
        v-if='isShowCheckBox'
        :selectable="checkboxT"
        type="selection"
        width="80">
      </el-table-column>
      <el-table-column
        prop='doctorAdviceName'
        show-overflow-tooltip
        label='医嘱名称'
      >
      <template slot-scope="scope">
        {{scope.row.doctorAdviceName}}
      </template>
      </el-table-column>
      <el-table-column
        prop='advicePrice'
        show-overflow-tooltip
        label='金额'
        width='80'
      >
        <template slot-scope="scope">
          {{scope.row.advicePrice + '元'}}
        </template>
      </el-table-column>
      <el-table-column
        prop='count'
        label='数量'
        width='80'
      >
      </el-table-column>
      <el-table-column
        prop='spec'
        label='规格'
        width='80'
      >
      </el-table-column>
      <el-table-column
        label='剂量'
        width='80'
      >
        <template slot-scope="scope">
          {{scope.row.measure}}{{scope.row.measureUnitName}}
        </template>
      </el-table-column>
      <el-table-column
        prop='employName'
        label='用法'
        width='80'
      >
      </el-table-column>
      <el-table-column
        prop='useFreqName'
        label='频次'
        width='80'
      >
      </el-table-column>
      <el-table-column
        prop='useDay'
        label='用药天数'
        width='80'
      >
      </el-table-column>
    </el-table>
    <el-table
      v-else
      ref="multipleTable"
      :data="details"
      tooltip-effect="dark"
      style="width: 100%"
      show-summary
      :summary-method="getSummaries"
      @selection-change="handleSelectionChange">
      <el-table-column
        v-if='isShowCheckBox'
        :selectable='checkbox'
        type="selection"
        width="80">
      </el-table-column>
      <el-table-column
        prop='name'
        show-overflow-tooltip
        label='药品名称'
      >
        <template slot-scope="scope">
          {{scope.row.serviceName}}、{{scope.row.count}}{{scope.row.countUnitName}}、
          <sys-value type="THC_SYS_DECOCTINGMETHOD" :code="scope.row.footnote"></sys-value>
        </template>
      </el-table-column>
      <el-table-column
        prop='advicePrice'
        show-overflow-tooltip
        label='金额'
        width='80'
      >
        <template slot-scope="scope">
          {{scope.row.advicePrice + '元'}}
        </template>
      </el-table-column>
      <el-table-column
        prop='count'
        label='剂数'
        width='80'
      >
      </el-table-column>
      <el-table-column
        prop='useFreqName'
        label='频次'
        width='80'
      >
      </el-table-column>
      <el-table-column
        label='用法'
        show-overflow-tooltip=""
        width='80'
      >
      <template slot-scope="scope">
        {{scope.row.employName}}
      </template>
      </el-table-column>
      <el-table-column
        prop="decoct"
        label='煎法'
        width='80'
      >
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    name: String,
    isShow: {
      type: Boolean,
      default: true
    },
    isShowCheckBox: {
      type: Boolean,
      default: false
    },
    resultData: {
      type: Array,
      default: []
    }
  },
  created () {
    console.log('111', this.resultData)
    this.setInfo(this.resultData)
  },
  data () {
    return {
      tableData: [],
      details: [],
      allSelection: []
    }
  },
  methods: {
    handleSelectionChange (rows) {
      this.allSelection = rows
    },
    setInfo (val) {
      this.tableData.length = 0
      this.details.length = 0
      val.forEach(items => {
        if (items.serviceType === '301' || items.serviceType === '302') {
          items.adviceFeesDtoList.forEach(item => {
            let obj = {}
            obj.advicePrice = (item.count * item.price).toFixed(2)
            obj.sumPrice = items.advicePrice.toFixed(2)
            obj.doctorAdviceName = items.adviceJson.doctorAdviceName
            obj.count = items.count
            obj.spec = item.countUnitName
            obj.measure = items.measure
            obj.measureUnitName = items.adviceJson.measureUnitName
            obj.useFreqName = items.adviceJson.useFreqName
            obj.employName = items.adviceJson.employName
            obj.useDay = items.useDay
            obj.doctorAdviceId = items.doctorAdviceId
            obj.dispensingStatus = items.dispensingStatus
            this.tableData.push(obj)
          })
        } else if (items.serviceType === '303' || items.serviceType === '304') {
          items.adviceFeesDtoList.forEach(item => {
            let obj = {}
            obj.advicePrice = (item.count * item.price).toFixed(2)
            obj.sumPrice = items.advicePrice.toFixed(2)
            obj.count = item.count
            obj.useFreqName = items.adviceJson.useFreqName
            obj.employName = items.adviceJson.employName
            obj.decoct = items.adviceJson.decoctName
            obj.serviceName = item.serviceName
            obj.count = items.count
            obj.countUnitName = item.countUnitName
            obj.footnote = item.footnote
            obj.doctorAdviceId = items.doctorAdviceId
            obj.dispensingStatus = items.dispensingStatus
            this.details.push(obj)
          })
        }
      })
    },
    checkboxT (row, index) {
      if (this.tableData.length) {
        return this.tableData[index].dispensingStatus !== 1
      } else {
        return true
      }
    },
    checkbox (row, index) {
      if (this.details.length) {
        return this.details[index].dispensingStatus !== 1
      } else {
        return true
      }
    },
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (this.isShowCheckBox) {
          if (index === 1) {
            sums[index] = '总价'
          }
          if (index === 2 && data[0].sumPrice) {
            sums[index] = data[0].sumPrice + '元'
          }
        } else {
          if (index === 0) {
            sums[index] = '总价'
          }
          if (index === 1 && data[0].sumPrice) {
            sums[index] = data[0].sumPrice + '元'
          }
        }
      })
      return sums
    },
    getSummariesXiyao (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (this.isShowCheckBox) {
          if (index === 1) {
            sums[index] = '总价'
            return
          }
          if (index === 2) {
            const values = data.map(item => Number(item[column.property]))
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return prev + curr
                } else {
                  return prev
                }
              }, 0)
              sums[index] = sums[index].toFixed(2) + '元'
            } else {
              sums[index] = 'N/A'
            }
          }
        } else {
          if (index === 0) {
            sums[index] = '总价'
            return
          }
          if (index === 1) {
            const values = data.map(item => Number(item[column.property]))
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return prev + curr
                } else {
                  return prev
                }
              }, 0)
              sums[index] = sums[index].toFixed(2) + '元'
            } else {
              sums[index] = 'N/A'
            }
          }
        }
      })
      return sums
    },
  },
  watch: {
    resultData: {
      handler (v) {
        this.setInfo(v)
      },
      deep: true
    }
  }
}
</script>
<style lang='less' scoped>
.label-tip{
  line-height: 16px;
  margin-bottom: 10px;
  &:before{
    content: '';
    display: inline-block;
    position: relative;
    top: 4px;
    height: 14px;
    margin-right: 5px;
    border: 2px solid #1c7bef;
    border-radius: 2px;
  }
}
.value-info{
  font-size: 14px;
  line-height: 14px;
  color: #333;
  margin-right: 20px;
}
</style>
