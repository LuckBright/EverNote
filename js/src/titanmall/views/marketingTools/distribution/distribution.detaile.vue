<template>
  <div>
    <div>
      <el-page-header @back="goBack" content="分销明细"></el-page-header>
    </div>
    <div class="distribution-detail">
      <div>
        <span class="span-color">购买用户</span>
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
        <div :class="activeName === 'second' ? 'user-type-block' : 'user-type-inline'">
          <template v-if="activeName === 'second'">
            <span class="span-color">上级用户</span>
            <el-select v-model="searchForm.upUserType" size="small" width="180">
              <el-option
                v-for="item of option"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-input
              class="input-wd ml15"
              v-model="searchForm.upUserContent"
              size="small"
            />
          </template>
          <span>
            <el-button class="ml15" type="primary" size="small" @click="() => {
              current = 1
              getDataValues()
            }">查询</el-button>
            <el-button size="small" @click="() => {
              current = 1
              searchForm = {...resetObj}
              getDataValues()
            }">重置</el-button>
          </span>
        </div>
      </div>
      <div class="user-info-tip">
        <span class="span-color">分销用户</span>
        <span class="user-text">{{userObj.userPhone}}</span>
        <span class="span-color ml30">用户昵称</span>
        <span class="user-text">{{userObj.userName}}</span>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="一级销售明细" name="first">
          <el-table :data="tableData" v-loading="loading">
            <el-table-column prop="userPhone" label="购买用户" />
            <el-table-column prop="userName" label="用户昵称" />
            <el-table-column prop="orderCode" label="订单号" />
            <el-table-column prop="goodsName" label="商品" />
            <el-table-column label="单价(元)">
              <template slot-scope="scoped">
                {{scoped.row.unitPrice | resetPrice(that)}}
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="购买数量" />
            <el-table-column label="实收金额(元)">
              <template slot-scope="scoped">
                {{scoped.row.realPayAmount | resetPrice(that)}}
              </template>
            </el-table-column>
            <el-table-column label="奖励金额(元)">
              <template slot-scope="scoped">
                {{scoped.row.awardAmount | resetPrice(that)}}
              </template>
            </el-table-column>
            <el-table-column prop="orderType" label="订单类型" />
            <el-table-column prop="finishTime" label="完成购买时间" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="二级销售明细" name="second">
          <el-table :data="tableData" v-loading="loading">
            <el-table-column prop="upUserPhone" label="上级用户" />
            <el-table-column prop="upUserName" label="上级用户昵称" />
            <el-table-column prop="userPhone" label="购买用户" />
            <el-table-column prop="userName" label="用户昵称" width="90"/>
            <el-table-column prop="orderCode" label="订单号" width="200"/>
            <el-table-column prop="goodsName" label="商品" show-overflow-tooltip/>
            <el-table-column label="单价(元)" width="100">
              <template slot-scope="scoped">
                {{scoped.row.unitPrice | resetPrice(that)}}
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="购买数量" width="80"/>
            <el-table-column label="实收金额(元)">
              <template slot-scope="scoped">
                {{scoped.row.realPayAmount | resetPrice(that)}}
              </template>
            </el-table-column>
            <el-table-column label="奖励金额(元)">
              <template slot-scope="scoped">
                {{scoped.row.awardAmount | resetPrice(that)}}
              </template>
            </el-table-column>
            <el-table-column prop="orderType" label="订单类型" width="90"/>
            <el-table-column prop="finishTime" label="完成购买时间" />
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
  </div>
</template>

<script>
  import pagination from '@/titanmall/mixins/pagination'
  import api from '../api'
  export default {
    name: 'distributionDetaile',
    mixins: [pagination],
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
        upUserType: 1,
        upUserContent: ''
      }
      return {
        that: this,
        searchForm: {...searchObj},
        resetObj: {...searchObj},
        option: [
          { id: 1, label: '用户手机号' },
          { id: 2, label: '用户昵称' },
        ],
        activeName: 'first',
        tableData: [],
        userObj: {}
      }
    },
    created () {
      this.userObj = JSON.parse(this.$route.query.searchObj)
      this.getDataValues()
    },
    methods: {
      goBack () {
        this.$router.push({name: 'distribution', query: {searchObj: this.$route.query.searchObj}})
      },
      getDataValues () {
        this.loading = true
        let startTime = ''
        let endTime = ''
        const timeArr = this.searchForm.timeValue
        if (timeArr && timeArr.length) {
          startTime = timeArr[0] + ' 00:00:00'
          endTime = timeArr[0] + ' 23:59:59'
        }
        const params = {
          currentPage: this.current,
          pageSize: this.pagesize,
          itemType: this.activeName === 'first' ? 1 : 2,
          patientId: this.userObj.userId,
          sortField: 'createTime',
          sortOrder: 'desc',
          startTime,
          endTime,
          ...this.searchForm
        }
        delete params.timeValue
        api.getItems(params).then(rs => {
          this.loading = false
          if (rs) {
            this.totalCount = rs.totalCount
            this.tableData = rs.resultList
          }
        })
      },
      handleClick () {
        this.searchForm = { ...this.resetObj }
        this.current = 1
        this.getDataValues()
      }
    }
  }
</script>

<style lang="scss" scoped>
.distribution-detail {
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 20px;
  margin-top: 10px;
  .input-wd {
    width: 241px;
  }

  .user-info-tip {
    margin: 30px 0 15px 0;
    .user-text {
      font-size: 14px;
    }
  }
  .user-type-inline {
    display: inline-block;
  }
  .user-type-block {
    display: block;
    margin-top: 10px;
  }

  .ml30 {
    margin-left: 30px;
  }
}
</style>
