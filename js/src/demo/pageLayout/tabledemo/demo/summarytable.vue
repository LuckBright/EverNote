<template>
  <div class="layout_inner">
    <el-row>
      <el-col :span="24">
        <p>表尾合计行表格，在右侧有固定列时的表现</p>
        <el-table
          :data="tableData"
          border
          height="200"
          :summary-method="getSummaries"
          show-summary>
        <el-table-column
          prop="id"
          label="ID"
          width="380">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="380">
        </el-table-column>
        <el-table-column
          prop="amount1"
          label="数值 1（元）"
          width="380">
        </el-table-column>
        <el-table-column
          prop="amount2"
          label="数值 2（元）"
          width="380">
        </el-table-column>
        <el-table-column
          fixed="right"
          prop="amount3"
          label="数值 3（元）"
          width="380">
        </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
      </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        tableData: [{
          id: '12987122',
          name: '王小虎',
          amount1: '234',
          amount2: '3.2',
          amount3: 10,
        }, {
          id: '12987123',
          name: '王小虎',
          amount1: '165',
          amount2: '4.43',
          amount3: 12,
        }, {
          id: '12987124',
          name: '王小虎',
          amount1: '324',
          amount2: '1.9',
          amount3: 9,
        }, {
          id: '12987125',
          name: '王小虎',
          amount1: '621',
          amount2: '2.2',
          amount3: 17,
        }, {
          id: '12987126',
          name: '王小虎',
          amount1: '539',
          amount2: '4.1',
          amount3: 15,
        }],
      }
    },
    methods: {
      getSummaries (param) {
        const {columns, data} = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总价'
            return
          }
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
            sums[index] += ' 元'
          } else {
            sums[index] = 'N/A'
          }
        })

        return sums
      },
    },
  }
</script>
<style scoped>
</style>

