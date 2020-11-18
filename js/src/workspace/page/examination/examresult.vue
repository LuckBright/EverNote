<template>
  <div class="exam_result">
    <el-card class="box-card" v-if="info.length">
      <div slot="header" class="clearfix">
        <span>检验结果信息</span>
      </div>
      <el-row>
        <el-col :span="4">{{info[0].providerName}}</el-col>
        <el-col :span="8">检查时间：{{info[0].reportTime}}</el-col>
        <el-col :span="4">检查医生：{{info[0].doctorName}}</el-col>
      </el-row>
      <el-table :data="info[0].resultItem" height="250" style="width: 100%">
        <el-table-column label="项目名称" width="180">
          <template slot-scope="scope">{{scope.row.inspectUnitName}}</template>
        </el-table-column>
        <el-table-column label="结果">
          <template slot-scope="scope">{{scope.row.quantityValue}}</template>
        </el-table-column>
        <el-table-column label="单位">
          <template slot-scope="scope">{{scope.row.unit}}</template>
        </el-table-column>
        <el-table-column label="提示">
          <template slot-scope="scope">{{resultStatus(scope.row.resultStatus)}}</template>
        </el-table-column>
        <el-table-column label="参考区间">
          <template slot-scope="scope">{{scope.row.refValue}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="quote(scope.row)">引用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <everNoData v-else></everNoData>
    <!-- 全部引用 -->
    <el-row>
      <el-col :span="2" :offset="21">
        <el-button type="primary" @click="quoteAll" v-if="info.length">全部引用</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: ['info'],
  computed: {
    resultStatus (val) {
      return function (val) {
        if (val === 'L') {
          return '↓'
        } else if (val === 'H') {
          return '↑'
        }
      }
    }
  },
  data () {
    return {
      content: ''
    }
  },
  methods: {
    quote (obj) {
      let val = `${obj.inspectUnitName}:${obj.quantityValue}, `
      this.$emit('quote', val)
    },
    quoteAll () {
      this.content = ''
      this.info[0].resultItem.forEach(item => {
        this.content += `${item.inspectUnitName}:${item.quantityValue},`
      })
      this.$emit('quoteAll', this.content)
    }
  }
}
</script>
<style lang="scss" scoped>
.el-row {
  margin-top: 15px;
}
</style>

