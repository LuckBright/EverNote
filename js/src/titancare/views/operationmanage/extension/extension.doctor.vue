<template>
  <div class="z-extension-doctor">
    <p class="z-doctor-top">
      <el-select v-model="selectObj" placeholder="请选择" clearable>
        <el-option
          v-for="item in selectOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-button type="primary" class="ml10" @click="searchHandler">查询</el-button>
      <span class="z-doctor-label ml10">推荐医生数量：</span>
      {{doctorNum}}
    </p>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column prop="doctorName" label="姓名">
        <template slot-scope="scope">
          <el-link type="primary" @click="goDoctor(scope.row.docAccountId)">{{scope.row.doctorName}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="doctorSex" label="性别">
        <template slot-scope="scope">
          {{scope.row.doctorSex && (scope.row.doctorSex === '1' ? '男性' : '女性')}}
        </template>
      </el-table-column>
      <el-table-column prop="doctorPhone" label="登录账号" />
      <el-table-column prop="pracHospital" label="申请提交医院" />
      <el-table-column prop="applyTime" label="注册时间" />
      <el-table-column prop="status" label="申请状态">
        <template slot-scope="scope">
          {{status[scope.row.status]}}
        </template>
      </el-table-column>
    </el-table>
    <p style="text-align: right">
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        background
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </p>
  </div>
</template>
<script>
  import list from '@/titancare/mixins/list.js'
  import api from '@/titancare/api/operation/extension'
  export default {
    mixins: [list],
    data () {
      return {
        selectObj: '',
        selectOptions: [
          {name: '未处理', id: 1},
          {name: '已通过', id: 2},
          {name: '已拒绝', id: 3},
          {name: '已注册', id: 4},
        ],
        doctorNum: 0,
        tableData: [],
        doctorObj: null,
        status: {
          1: '未处理',
          2: '已通过',
          3: '已拒绝',
          4: '已注册'
        }
      }
    },
    created() {
      this.doctorObj = JSON.parse(this.$route.query.obj)
      this.doctorNum = this.doctorObj.inviteDoctorNum
      this.list()
    },
    methods: {
      list () {
        let params = {
          doctorId: this.doctorObj.doctorId,
          startTime: this.doctorObj.startTime,
          endTime: this.doctorObj.endTime,
          currentPage: this.current,
          pagesize: this.pagesize,
          status: this.selectObj
        }
        api.getdoctorListByDoctorId(params).then(rs => {
          if (!rs.errCode) {
            this.totalCount = rs.data.totalCount
            this.tableData = rs.data.resultList
          }
        })
      },
      searchHandler() {
        this.current = 1
        this.list()
      },
      goDoctor(id) {
        this.$router.push({
          path: '/titancare/operation/doctor/doctordetails',
          query: { id, source: 'extension' }
        })
      }
    },
  }
</script>
<style lang="less" scoped>
  .z-extension-doctor {
    .z-doctor-top {
      .z-doctor-label {
        display: inline-block;
        font-size: 12px;
      }
    }
    .ml10 {
      margin-left: 10px;
    }
  }
</style>
