<template>
  <div class="z-extension">
    <p>
      <el-input v-model="searchObj.name" clearable class="z-input-wd" placeholder="请输入医生姓名"/>
      <el-input v-model="searchObj.mobile" clearable class="z-input-wd" placeholder="请输入医生手机号"/>
      <el-date-picker
        v-model="searchObj.time"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
      />
      <el-button class="ml20" type="primary" @click="_searchHandler">查询</el-button>
      <el-button @click="_resetHandler">重置</el-button>
      <el-button :disabled="disabled" type="primary" @click="_exportHanler">导出</el-button>
    </p>
    <el-table
      :data="tableData"
      border
      :max-height="800"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="姓名"
      />
      <el-table-column
        prop="sex"
        label="性别"
        />
      <el-table-column
        prop="mobile"
        label="登录账号" />
      <el-table-column prop="inviteDoctorNum" label="推荐医生数量">
        <template slot-scope="scope">
          <el-link type="primary" @click="_goDetails(scope.row, 'first')">{{scope.row.inviteDoctorNum}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="invitePatientNum" label="推荐患者数量">
        <template slot-scope="scope">
          <el-link type="primary" @click="_goDetails(scope.row, 'second')">{{scope.row.invitePatientNum}}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-link type="primary" @click="_goDetails(scope.row, 'first')">查看推荐详情</el-link>
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
      const formObj = {
        name: '',
        mobile: '',
        time: '',
        endTime: '',
        startTime: ''
      }
      return {
        formObj,
        searchObj: {...formObj},
        tableData: [],
        disabled: false
      }
    },
    created() {
      this.list()
    },
    methods: {
      list () {
        api.extensionSearch(this.setSearchInfo()).then(rs => {
          if (!rs.errCode) {
            this.totalCount = rs.data.totalCount
            this.tableData = rs.data.resultList
          }
        })
      },
      // 格式化查询/导出条件
      setSearchInfo() {
        if (this.searchObj.time) {
          this.searchObj.startTime = this.searchObj.time[0] + ' 00:00:00'
          this.searchObj.endTime = this.searchObj.time[1] + ' 23:59:59'
        } else {
          this.searchObj.startTime = ''
          this.searchObj.endTime = ''
        }
        let params = {
          ...this.searchObj,
          currentPage: this.current,
          pagesize: this.pagesize
        }
        return params
      },
      // 查询
      _searchHandler() {
        this.current = 1
        this.list()
      },
      // 重置
      _resetHandler() {
        this.searchObj = {...this.formObj}
      },
      // 导出
      _exportHanler() {
        this.disabled = true
        let params = this.setSearchInfo()
        api.extensionExport(params).then(rs => {
          if (!rs.errCode) {
            const data = rs.data
            const linkNode = document.createElement('a')
            linkNode.style.display = 'none'
            linkNode.href = data.domain + data.fileUrl
            document.body.appendChild(linkNode)
            linkNode.click()
            document.body.removeChild(linkNode)
          } else {
            this.$message.error('导出失败，请重新导出')
          }
          setTimeout(() => {
            this.disabled = false
          }, 1000)
        })
      },
      // 查看推荐详情
      _goDetails (val, tab) {
        const obj = JSON.stringify({
          ...val,
          tab,
          startTime: this.searchObj.startTime,
          endTime: this.searchObj.endTime
        })
        this.$router.push({path: 'extensiondetails', query: {obj}})
      }
    }
  }
</script>
<style lang="less" scoped>
  .z-extension {
    background: #fff;
    padding: 10px;
    box-sizing: border-box;
    .z-input-wd {
      width: 150px;
      margin-right: 20px;
    }

    .ml20 {
      margin-left: 20px;
    }
  }
</style>
