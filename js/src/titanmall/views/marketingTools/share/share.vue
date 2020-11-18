<template>
  <div class="main share">
    <div class="region share-box">
      <p>
        <span class="span-color">推荐用户：</span>
        <el-select v-model="formObj.selectValue" size="small" style="width: 115px">
          <el-option
            v-for="(item, i) in options"
            :key="i"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input
          v-model="formObj.value"
          size="small"
          clearable
          class="input-wd ml"
          placeholder="请输入"
        ></el-input>
        <span class="span-color ml">推荐类型：</span>
        <el-select v-model="formObj.referrerType" size="small" style="width: 120px">
          <el-option
            v-for="item in recommendOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <span class="span-color ml">完成购买时间：</span>
        <el-date-picker
          v-model="formObj.date"
          type="daterange"
          align="right"
          size="small"
          clearable
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
        <el-button
          class="ml" size="small" type="primary" @click="searchBtn"
        >查询
        </el-button
        >
        <el-button size="small" @click="clearBtn">重置</el-button>
        <el-button :disabled="exportBtn" size="small" @click="clickExport">导出</el-button>
      </p>
      <p class="text-tip">
        <i class="el-icon-question i-bg"></i>
        <span
          class="tip"
        >列表中数据的记录条件为：商城登录用户分享给他人，他人成功购买（买家确认收货）。在商品管理功能中的商品可填写推荐奖励金额，填写后系统会自动进行推荐奖励金额的记录。</span
        >
      </p>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="referrerTypeTxt" label="推荐类型" width="110"/>
        <el-table-column prop="referrerPhone" label="推荐账户" width="110"/>
        <el-table-column prop="referrerName" label="账户昵称" width="80"/>
        <el-table-column prop="orderCode" label="订单号" width="180"/>
        <el-table-column
          prop="goodsName"
          label="商品"
          min-width="150"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-button class="goods-btn" type="text" @click="go(scope.row)">{{
              scope.row.goodsName
              }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="unitPrice" label="单价（元）" width="100"/>
        <el-table-column prop="quantity" label="购买数量" width="80"/>
        <el-table-column
          prop="realPayAmount"
          label="实收金额（元）"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="recommendedAward"
          label="推荐奖励（元）"
          width="120"
        >
        </el-table-column>
        <el-table-column prop="orderTypeTxt" label="订单类型" width="80"/>
        <el-table-column prop="finishTime" label="完成购买时间" width="170"/>
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
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import pagination from '@/titanmall/mixins/pagination'
  import api from '../api'
  import { exports } from '@/titanmall/components/export'

  export default {
    mixins: [ pagination ],
    data () {
      return {
        api,
        formObj: {
          selectValue: '1',
          date: '',
          value: '',
          referrerType: '',
        },
        options: [
          {
            value: '1',
            label: '账户手机号',
          },
          {
            value: '2',
            label: '昵称',
          },
        ],
        tableData: [],
        loading: false,
        recommendOption: [
          {
            value: '',
            label: '全部',
          },
          {
            value: '0',
            label: '商城推荐',
          },
          {
            value: '1',
            label: '医生端推荐',
          },
        ],
        exportBtn: false,
      }
    },
    created () {
      this.getDataValues()
    },
    methods: {
      getDataValues () {
        this.loading = true
        let params = this.setSearch()
        this.api.buyPage(params).then(res => {
          if (res) {
            res.resultList.forEach(item => {
              item.realPayAmount = priceInfo(item.realPayAmount)
              item.recommendedAward = priceInfo(item.recommendedAward)
              item.unitPrice = priceInfo(item.unitPrice)
            })
            this.totalCount = res.totalCount
            this.tableData = res.resultList
            this.loading = false
          }
        })
        let _this = this

        function priceInfo (val) {
          if (val) {
            return '¥ ' + _this.$_narrowPrice(val, 100)
          } else {
            return '-'
          }
        }
      },

      // 请求数据参数
      setSearch () {
        let date = this.formObj.date ? this.formObj.date : []
        let params = {
          pageSize: this.pagesize,
          currentPage: this.current,
          finishTimeEnd: date.length ? date[1] + ' 23:59:59' : '',
          finishTimeStart: date.length ? date[0] + ' 00:00:00' : '',
          referrerName: '',
          referrerPhone: '',
          referrerType: this.formObj.referrerType,
          sortOrder: 'desc',
          sortField: 'finishTime',
        }
        if (this.formObj.selectValue === '1') {
          params.referrerPhone = this.formObj.value
        } else {
          params.referrerName = this.formObj.value
        }
        return params
      },

      // 查询
      searchBtn () {
        this.current = 1
        this.getDataValues()
      },

      // 重置
      clearBtn () {
        this.current = 1
        this.formObj.date = ''
        this.formObj.value = ''
        this.formObj.referrerType = ''
        this.getDataValues()
      },

      /**
       * 导出
       */
      clickExport () {
        this.exportBtn = true
        let params = this.setSearch()
        params.config = {
          responseType: 'blob',
        }
        api.buyExport(params).then(res => {
          if (res) exports(res)
          setTimeout(() => {
            this.exportBtn = false
          }, 1000)
        })
      },

      // 跳转订单详情页
      go (row) {
        let obj = {
          id: row.orderId,
          orderType: row.orderType,
        }
        this.$router.push({ path: '/titanmall/ordermain/manager/orderdetails', query: obj })
      },
    },
  }
</script>
<style lang="less" scoped>
  .share {
    height: 100vh;

    .ml {
      margin-left: 20px;
    }

    .share-box {
      height: 94%;

      .input-wd {
        width: 200px;
      }
    }

    .text-tip {
      margin: 20px 0;

      .i-bg {
        color: #ccc;
        margin-right: 10px;
      }

      .tip {
        color: #333;
        font-size: 14px;
        line-height: 14px;
      }
    }

    .goods-btn {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
    }
  }
</style>
