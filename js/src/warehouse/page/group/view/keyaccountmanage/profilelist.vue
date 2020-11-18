<template>
  <div class="layout_inner">
    <div class="main-head">
      <div class="containerLeft">
        <el-input
          v-model="queryObj.name"
          @keypress.native="handleKeyPress"
          placeholder="请输入客户名称"
          clearable
        ></el-input>
      </div>
      <el-button type="primary" @click="list">查询</el-button>
      <div class="containerRight">
        <router-link :to="{name: 'profileadd'}">
          <el-button type="primary">新建</el-button>
        </router-link>
      </div>
      <div class="clearfix"></div>
    </div>
    <div>
      <el-table :data="tableData" v-loading="loading">
        <el-table-column prop="number" label="客户编号" width="200"></el-table-column>
        <el-table-column prop="name" label="客户名称"></el-table-column>
        <el-table-column prop="englishName" label="英文名称"></el-table-column>
        <el-table-column prop="contactTelephone" label="客户电话"></el-table-column>
        <el-table-column prop="contactName" label="联系人姓名"></el-table-column>
        <el-table-column prop="expirationDate" label="失效时间" width="105">
          <template slot-scope="scope">
            {{$moment(scope.row.expirationDate).format('YYYY-MM-DD')}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button type="primary" @click="toEdit(scope.row.id)">编辑</el-button>
            <ever-confirm
            :msg="'确定要删除吗？'"
            @confirm="del(scope.row.id)"></ever-confirm>
          </template>
        </el-table-column>
      </el-table>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </div>
  </div>
</template>
<script>
import { profileApi } from '@/warehouse/page/group/store/keyaccountmanage'
import list from '@/util/list'
export default {
  mixins: [list],
  data () {
    return {
      api: profileApi,
      tableData: [],
      queryObj: { name: '' }
    }
  },
  methods: {
    handleKeyPress (e) {
      if (e.keyCode === 13) {
        this.list()
      }
    }
  }
}
</script>

<style scoped>
.containerLeft {
  float: left;
  margin-right: 15px;
}
.containerRight {
  float: right;
}
</style>
