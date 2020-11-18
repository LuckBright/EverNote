<template>
  <div class="distribution-wrapper">
    <div>
      <span class="span-color">分销用户</span>
      <el-select v-model="searchForm.userType" size="small" width="180">
        <el-option
          v-for="item of option"
          :key="item.id"
          :label="item.label"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-input
        class="input-wd ml15"
        v-model="searchForm.userContent"
        size="small"
      />
      <span class="span-color ml15">完成购买时间</span>
      <el-date-picker
        v-model="searchForm.timeValue"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size="small"
      />
      <el-button class="ml15" type="primary" size="small" @click="() => {
        current = 1
        getDataValues()
      }">查询</el-button>
      <el-button size="small" @click="() => {
        current = 1
        searchForm = {...resetObj}
        getDataValues()
      }">重置</el-button>
    </div>
    <div class="tip-wrapper">
      <span class="tip-text">
        <i class="el-icon-question z-icon"/>
        列表中数据的记录条件为：下级成功购买商品，并且状态为买家确认收货时记录。
      </span>
    </div>
    <el-table
      :data="tableData"
      border
      max-height="600px"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column label="操作" width="200">
        <template slot-scope="scoped">
          <el-button type="text" @click="onSeeDetailsClick(scoped.row)">查看明细</el-button>
          <el-button type="text" @click="onOpenDialogClick(scoped.row)">查看下级信息</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="userPhone" label="用户手机号" width="110"/>
      <el-table-column prop="userName" label="用户昵称" width="110"/>
      <el-table-column prop="directCount" label="一级人数" width="100"/>
      <el-table-column prop="directBuyCount" label="一级商品销售件数"/>
      <el-table-column prop="directBuyAmount" label="一级商品销售额">
        <template slot-scope="scoped">
          {{scoped.row.directBuyAmount | resetPrice(that)}}
        </template>
      </el-table-column>
      <el-table-column prop="directAwardAmount" label="一级奖励金额" width="110">
        <template slot-scope="scoped">
          {{scoped.row.directAwardAmount | resetPrice(that)}}
        </template>
      </el-table-column>
      <el-table-column prop="indirectCount" label="二级人数" width="100"/>
      <el-table-column prop="indirectBuyCount" label="二级商品销售件数"/>
      <el-table-column prop="indirectBuyAmount" label="二级商品销售额">
        <template slot-scope="scoped">
          {{scoped.row.indirectBuyAmount | resetPrice(that)}}
        </template>
      </el-table-column>
      <el-table-column prop="indirectAwardAmount" label="二级奖励金额" width="110">
        <template slot-scope="scoped">
          {{scoped.row.indirectAwardAmount | resetPrice(that)}}
        </template>
      </el-table-column>
    </el-table>
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
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="50%">
      <second-info v-if="dialogVisible" :userInfo="dialogUserInfo"/>
    </el-dialog>
  </div>
</template>

<script>
  import pagination from '@/titanmall/mixins/pagination'
  import SecondInfo from './second.info'
  import api from '../api'
  export default {
    mixins: [pagination],
    name: 'distribution',
    components: {
      SecondInfo
    },
    filters: {
      resetPrice (value, that) {
        return `￥${that.$_narrowPrice(value, 100)}`
      }
    },
    data () {
      const searchObj = {
        userType: 1,
        userContent: '',
        timeValue: '',
      }
      return {
        that: this,
        tableData: [],
        searchForm: {...searchObj},
        resetObj: {...searchObj},
        option: [
          { id: 1, label: '用户手机号' },
          { id: 2, label: '用户昵称' },
        ],
        dialogVisible: false,
        dialogUserInfo: {}
      }
    },
    created () {
      if (this.$route.query.searchObj) {
        const searchObj = JSON.parse(this.$route.query.searchObj)
        this.current = searchObj.currentPage
        this.pagesize = searchObj.pageSize
        this.searchForm.userType = searchObj.userType
        this.searchForm.userContent = searchObj.userContent
        this.searchForm.timeValue = searchObj.timeValue
      }
      this.getDataValues()
    },
    methods: {
      getDataValues () {
        this.loading = true
        let startTime = ''
        let endTime = ''
        const timeArr = this.searchForm.timeValue
        if (timeArr && timeArr.length) {
          startTime = timeArr[0] + ' 00:00:00'
          endTime = timeArr[1] + ' 23:59:59'
        }
        const params = {
          currentPage: this.current,
          pageSize: this.pagesize,
          sortField: 'createTime',
          sortOrder: 'desc',
          startTime,
          endTime,
          ...this.searchForm
        }
        delete params.timeValue
        api.distributionOrderItem(params).then(rs => {
          this.loading = false
          if (rs) {
            this.totalCount = rs.totalCount
            this.tableData = rs.resultList
          }
        })
      },
      onSeeDetailsClick (row) {
        const {userId, userPhone, userName} = row
        const searchObj = {
          currentPage: this.current,
          pageSize: this.pagesize,
          ...this.searchForm,
          userId,
          userPhone,
          userName,
        }
        this.$router.push({name: 'distribution-detail', query: {searchObj: JSON.stringify(searchObj)}})
      },
      onOpenDialogClick (row) {
        const {userPhone, userName, userId} = row
        this.dialogUserInfo = {
          userPhone,
          userName,
          userId
        }
        this.dialogVisible = true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .distribution-wrapper {
    height: 100%;
    box-sizing: border-box;
    padding: 20px;
    background: #fff;
    .input-wd {
      width: 241px;
    }
    .ml15 {
      margin-left: 15px;
    }
    .tip-wrapper {
      margin: 20px 0 5px 0;
      .z-icon {
        color: #ccc;
        margin-right: 10px;
      }
      .tip-text {
        font-size: 14px;
        color: #333333;
        line-height: 14px;
      }
    }
  }

</style>
