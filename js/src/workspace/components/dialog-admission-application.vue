<template>
  <el-dialog
  :visible.sync="flag"
  class='admission_application'
  width="1040px">
    <span slot="title">
      <strong>入院申请管理</strong>
    </span>
    <el-input class="input" v-model="message" placeholder="输入患者基本信息"></el-input>
    <el-date-picker
      v-model="data"
      class="input"
      type="daterange"
      value-format="yyyy-MM-dd"
      range-separator="至"
       start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
     <el-button @click='open(1)'>查询</el-button>
    <el-table
      :data="tableData"
      :stripe="false"
      style="width: 100%">
      <el-table-column
        show-overflow-tooltip
        prop="status"
        label="入院登记"
        width="100">
        <template slot-scope="scope">
         {{scope.row.status | ipStatusConvert}}
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="patientName"
        label="患者姓名"
        width="90">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="visitNumber"
        width="150"
        label="门诊档案号">
        <template slot-scope="scope">
          <span>{{scope.row.outpatientNumber || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="sex"
        width="55"
        label="性别">
        <template slot-scope="scope">
          {{scope.row.sex |formatSex}}
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        width="120"
        prop="mobile"
        label="联系电话">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="diagnosis"
        width="100"
        label="门诊诊断">
         <template slot-scope="scope">
          <span>{{scope.row.diagnosis}}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="admitRoute"
        width="100"
        label="入院途径">
        <template slot-scope="scope">
          <sys-value type="CV09.00.403" :code="scope.row.admitRoute"></sys-value>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="adviseAdmitTime"
        width="140"
        label="建议入院时间">
        <template slot-scope="scope">
          {{scope.row.adviseAdmitTime?$moment(scope.row.adviseAdmitTime).format('YYYY-MM-DD HH:mm'):'--'}}
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="status"
        width="140"
        label="操作">
        <template slot-scope="scope">
          <div v-if='[1].indexOf(scope.row.status) >  -1'>
            <el-button type="primary" plain @click="modify(scope.row)">修改</el-button>
            <el-button type="danger" plain @click="callback(scope.row)">撤回</el-button>
          </div>
          <div v-else>
           --
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
    <el-pagination
      background
      :current-page.sync='currentPage'
      layout="prev, pager, next, jumper"
      @current-change='open'
      :total="total">
    </el-pagination>
    </div>
  </el-dialog>
</template>

<script>
import api from '../store/mainheaderapi'
import { isJsonString } from '@/util/common'
export default {
  props: [],
  data () {
    return {
      flag: false,
      total: 0,
      message: '',
      tableData: [],
      data: '',
      currentPage: 1
    }
  },
  components: { },
  created () {

  },
  methods: {
    async modify (row) {
      this.flag = false
      this.$emit('modify', row)
    },
    async callback (row) {
      let result = await api.cancel({
        id: row.id
      })
      this.$notify({
        title: result.head.errCode === 0 ? '成功' : '错误',
        message: result.head.errCode === 0 ? '撤回入院申请成功' : '撤回入院申请失败',
        type: result.head.errCode === 0 ? 'success' : 'error'
      })
      this.open(this.currentPage)
    },
    close () {
      this.flag = false
    },
    async open (page) {
      page = page || 1
      this.currentPage = page
      this.flag = true
      let time = this.data || []
      let obj = {
        patientMsg: this.message,
        offset: (page - 1) * 10 + '',
        pagesize: 10 + ''
      }
      if (time.length > 0) {
        obj.startDate = time[0] + ' 00:00:00'
        obj.endDate = time[1] + '  00:00:00'
      }
      let result = await api.getAdmissionApplication(obj)
      if (result.data) {
        let arr = result.data.resultList || []
        arr.forEach(element => {
          let data = isJsonString(element.diagnosis) ? JSON.parse(element.diagnosis) : []
          element.diagnosis = '--'
          if (data.length > 0) {
            element.diagnosis = data[0].diseaseName
          }
        })
        this.total = result.data.totalCount
        this.tableData = []
        this.tableData = result.data.resultList
      }
    }
  },
  computed: {
    patientObj () {
      return this.indepartObj.patient || {}
    }
  },
  filters: {
    ipStatusConvert (val) {
      let curVal = Number(val)
      if (curVal === 1) {
        return '未登记'
      } else {
        return '已登记'
      }
    }
  }
}
</script>
<style lang='scss' scoped>
 .admission_application{
    .el-table{
      border:none;
    }
    .input{
      width: 250px;
      margin-right: 15px;
      vertical-align: middle;
    }
    .el-button--primary,.el-button--danger{
      padding: 5px 10px;
      font-size: 14px;
    }
    .el-button--primary.is-plain {
      color: #1c7bef;
      background: #e8f2fd;
      border-color: #a4caf9;
    }
    /deep/ .el-dialog__header{
      padding: 10px 20px 0;
    }
    /deep/ .el-dialog__body{
      padding:10px 20px 30px;
    }
 }
</style>
