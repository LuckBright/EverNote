<template>
  <div class="layout_inner">
    <!-- 查询 -->
    <el-row>
      <el-col>
        <hospital-case-query @query="query"></hospital-case-query>
      </el-col>
    </el-row>
    <!-- 病历管理列表 -->
    <el-row>
      <!-- <el-col :span="24">
        <h2 class="list title">病历列表</h2>
      </el-col>-->
      <el-col :span="24">
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column label="患者档案号" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.patientSn}}</span>
            </template>
          </el-table-column>
          <el-table-column label="住院病案号" width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.medicalSn}}</span>
            </template>
          </el-table-column>
          <el-table-column label="患者姓名" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="性别" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.sex==1?'男':'女'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="年龄" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.age}}岁</span>
            </template>
          </el-table-column>
          <el-table-column label="入院时间" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.admissionTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="出院时间" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.dischargeTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="主诊断" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.diagnosis}}</span>
            </template>
          </el-table-column>
          <el-table-column label="患者状态">
            <template slot-scope="scope">
              <span>{{scope.row.patientStatus==1?'在院':'出院'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="归档状态">
            <template slot-scope="scope">
              <span>{{scope.row.opStatus==0?'未归档':'已归档'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="归档日期" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.lockTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <!-- <el-button size="mini">查看</el-button> -->
              <el-button size="mini" @click="recall(scope.row)" v-if="scope.row.opStatus==1">病历召回</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
          :current="current"
        ></ever-pagination>
      </el-col>
    </el-row>
    <!-- 召回弹框 -->
    <dialog-apply :open="dialogVisible" :rowData="rowData" @close="close" @submit="submit"></dialog-apply>
  </div>
</template>
<script>
import list from '@/util/list'
import api from '../store/casemgtapi.js'
import dialogApply from './casedialog/dialogapply'
import hospitalCaseQuery from './hospitalquery/hospital.case.query'

export default {
  mixins: [list],
  data () {
    return {
      api,
      objId: this.$route.params.id,
      num: this.$route.params.num,
      tableData: [],
      dialogVisible: false,
      rowData: {},
      queryObj: {},
      listApiName: 'recordManage'
    }
  },
  created () {
    this.searchApi()
  },
  methods: {
    // 查询接口
    searchApi () {
      let age = {
        maxAge: this.queryObj.age && this.queryObj.age.max,
        minAge: this.queryObj.age && this.queryObj.age.min
      }
      this.queryObj = Object.assign({}, this.queryObj, age)
      delete this.queryObj.age

      this.list()
    },
    // 查询
    query (val) {
      this.queryObj = val
      this.searchApi()
    },
    // 关闭弹框
    close (val) {
      this.dialogVisible = val
    },
    // 点击‘病历召回’
    recall (row) {
      this.dialogVisible = true
      this.rowData = row
    },
    // 召回申请
    submit (val) {
      let params = {
        recordManageId: this.rowData.id,
        createComment: val,
        type: 2
      }
      api.recordReqAuditCreate(params).then(res => {
        this.dialogVisible = false
        this.searchApi()
      })
    }
  },
  components: {
    dialogApply,
    hospitalCaseQuery
  }
}
</script>
<style lang="scss" scoped>
@import "../assets/case.scss";
.reason_box {
  margin-top: 30px;
}
.el-textarea /deep/ .el-textarea__inner {
  height: 100px;
}
</style>
