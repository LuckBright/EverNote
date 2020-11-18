<template>
  <el-table :data="tableData" :stripe="false" style>
    <el-table-column label="类型">
      <template slot-scope="scope">{{adviceType(scope.row.adviceType)}}</template>
    </el-table-column>
    <el-table-column label="项目名称" width="100">
      <template slot-scope="scope">{{scope.row.serviceName}}</template>
    </el-table-column>
    <el-table-column label="状态">
      <template slot-scope="scope">{{setStatus(scope.row.status)}}</template>
    </el-table-column>
    <el-table-column label="执行科室">
      <template slot-scope="scope">{{scope.row.providerName}}</template>
    </el-table-column>
    <el-table-column label="医生">
      <template slot-scope="scope">{{scope.row.doctorName}}</template>
    </el-table-column>
    <el-table-column label="报告日期" width="180">
      <template slot-scope="scope" v-if="scope.row.reportTime">
        <!-- {{scope.row.reportTime}} -->
        {{$moment(scope.row.reportTime).format('YYYY/MM/DD')}}
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope" v-if="scope.row.status==1">
        <!-- v-if="scope.row.status==1" -->
        <i class="iconfont icon-yichang cRed" v-if="scope.row.isException===1"></i>
        <el-button type="text" @click="check(scope.row)">查看报告</el-button>
        <!-- <el-button type="text" @click="print(scope.row)" v-if="scope.row.isPrint==1">打印</el-button> -->
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import storage from '@/util/storage'
// import { frPrint } from '@/util/print'
export default {
  props: ['tableData'],
  data () {
    return {
    }
  },
  watch: {
    tableData: function (val) {
      storage.setLocalStorage('examData', JSON.stringify(val))
    }
  },
  computed: {
    adviceType (val) {
      return function (val) {
        if (val === '800') {
          return '检查'
        } else if (val === '801') {
          return '检验'
        }
      }
    },
    setStatus (val) {
      return function (val) {
        if (val === 0) {
          return '未完成'
        } else if (val === 1) {
          return '已完成'
        }
      }
    }
  },
  methods: {
    check (data) {
      this.$emit('checkReport', data)
    },
    // print (row) {
    //   let obj = row.medicalRecord
    //   frPrint(obj.printCode, {
    //     visitId: obj.visitId,
    //     patientId: obj.patientId,
    //     id: obj.id
    //   })
    // }
  }
}
</script>
<style lang="scss" scoped>
.el-table {
  width: 100%;
  min-width: 800px;
  overflow: auto;
}
</style>

