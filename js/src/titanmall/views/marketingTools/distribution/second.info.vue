<template>
  <div>
    <div class="user-info">
      <span class="span-color">分销用户:</span>
      <span class="user-phone">{{userInfo.userPhone}}</span>
      <span class="span-color">用户昵称:</span>
      <span>{{userInfo.userName}}</span>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="一级信息" name="first">
        <el-table :data="tableData">
          <el-table-column prop="userPhone" label="用户手机号" />
          <el-table-column prop="userName" label="用户昵称" />
          <el-table-column prop="directCount" label="下级人数" />
          <el-table-column prop="inviteTime" label="成为下级时间" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="二级信息" name="second">
        <el-table :data="tableData">
          <el-table-column prop="upUserPhone" label="上级用户" />
          <el-table-column prop="upUserName" label="上级用户昵称" />
          <el-table-column prop="userPhone" label="用户手机号" />
          <el-table-column prop="userName" label="用户昵称" />
          <el-table-column prop="inviteTime" label="成为下级时间" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-sizes="pageSize"
      :page-size="pagesize"
      :layout="pageLayout"
      :total="totalCount"
      background
    />
  </div>
</template>

<script>
  import pagination from '@/titanmall/mixins/pagination'
  import api from '../api'
  export default {
    name: 'secondInfo',
    mixins: [pagination],
    props: {
      userInfo: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        activeName: 'first',
        tableData: []
      }
    },
    created () {
      this.getDataValues()
    },
    methods: {
      getDataValues() {
        const params = {
          currentPage: this.current,
          pageSize: this.pagesize,
          patientId: this.userInfo.userId,
          levelType: this.activeName === 'first' ? 1 : 2,
          sortField: 'createTime',
          sortOrder: 'desc'
        }
        api.getLowerLevels(params).then(rs => {
          if (rs) {
            this.totalCount = rs.totalCount
            this.tableData = rs.resultList
          }
        })
      },
      handleClick() {
        this.current = 1
        this.getDataValues()
      }
    }
  }
</script>

<style lang="scss" scoped>
.user-info {
  margin-bottom: 20px;
  .user-phone {
    margin-right: 20px;
  }
}
</style>
