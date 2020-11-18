<template>
  <div class="main layout_inner">
    <div class="manager-container">
      <div class="search_box">
        <p class="mb15">
          <span class="span-color">查找订单：</span>
          <el-input v-model.trim="searchForm.paramValue" class="mr15" style="width: 175px" size="small"></el-input>
          <el-select v-model="searchForm.paramType" size="small" style="width: 130px">
            <el-option
              v-for="item in paramTypeOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </p>
        <p class="mb15">
          <span class="span-color">订单属性：</span>
          <el-select
            v-model="searchForm.orderType"
            clearable
            size="small"
            class="mr15"
            style="width: 100px"
            placeholder="订单类型"
          >
            <el-option
              v-for="item in
              orderTypeOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="searchForm.stockType"
            clearable
            size="small"
            class="mr15"
            style="width: 130px"
            placeholder="库存类型"
          >
            <el-option
              v-for="item in stockTypeOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
          <span class="span-color">订单价格:</span>
          <el-input
            v-model.trim="searchForm.amountStart" size="small" placeholder="最低价" style="width:70px"
            oninput="value=value.replace(/[^\d.]/g,'')"/>
          ~
          <el-input
            v-model.trim="searchForm.amountEnd" size="small" placeholder="最高价" style="width:70px" class="mr15"
            oninput="value=value.replace(/[^\d.]/g,'')"/>
          <el-select v-model="searchForm.orderSourceId" clearable size="small" placeholder="订单来源">
            <el-option
              v-for="item in orderSourceIdOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </p>
        <p class="mb15">
          <span class="span-color">订单时间：</span>
          <span
            :class="{mr15: true, 'text-style': true, 'is-select': item.isSelect}"
            v-for="(item, index) in orderTimeArr"
            :key="index"
            @click="clickOrderTime(item, index)"
          >{{item.name}}</span>
          <el-date-picker
            disabledDate
            size="small"
            v-model="orderTimes"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </p>
        <p class="mb15">
          <span class="span-color">订单状态：</span>
          <span
            :class="{mr15: true, 'text-style': true, 'is-select': item.isSelect}"
            v-for="(item, index) in orderStatusArr"
            :key="index"
            @click="clickOrderStatus(item, index)"
          >{{item.name}}<span v-if="item.num" class="span-tip">{{item.num}}</span>
          </span>
        </p>
        <p class="mb15 search-btn">
          <el-button type="primary" @click="filterBtn" size="small">查询</el-button>
          <el-button @click="_resetForm" size="small">重置</el-button>
          <el-button @click="clickExport" :disabled="exportBtn" size="small">导出</el-button>
        </p>
      </div>
      <template>
        <el-table
          :data="tableData"
          v-loading="loading"
          border
          style="width: 100%"
          max-height="600"
          @sort-change="sortMethod"
        >
          <el-table-column label="操作" width="180" :resizable="false">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.refund"
                type="text"
                class="aLink"
                @click="go('/titanmall/ordermain/manager/returndetails', scope.row)"
              >退款处理
              </el-button
              >
              <el-button
                v-if="
                  scope.row.stockType === 1 &&
                    (scope.row.orderStatus === 20 ||
                      scope.row.orderStatus === 21)
                "
                type="text"
                class="aLink"
                @click="go('/titanmall/ordermain/manager/sendgoods', scope.row)"
              >发货
              </el-button
              >
              <el-button
                v-if="
                  scope.row.orderStatus === 10 || scope.row.orderStatus === 20
                "
                type="text"
                class="aLink"
                @click="
                  () => {
                    rowInfo = scope.row;
                    dialogVisible = true;
                  }
                "
              >取消订单
              </el-button
              >
              <el-button
                type="text"
                class="aLink"
                @click="go('/titanmall/ordermain/manager/orderdetails', scope.row)"
              >查看
              </el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="orderCode" label="订单号" width="180" :resizable="false"/>
          <el-table-column prop="orderTime" label="下单时间" width="170" sortable="custom" :resizable="false"/>
          <el-table-column
            label="收货人"
            width="74"
            show-overflow-tooltip
            :resizable="false"
          >
            <template slot-scope="scoped">
              {{scoped.row.consigneeName || '--'}}
            </template>
          </el-table-column>
          <el-table-column label="收货电话" width="119" :resizable="false">
            <template slot-scope="scoped">
              {{scoped.row.consigneePhone || '--'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="firstGoodsName"
            label="商品"
            show-overflow-tooltip
            width="294"
            :resizable="false"
          >
            <template slot-scope="scope">
              <div
                :class="{'span-count': true, 'span-count-bg': scope.row.goodsQuantity > 1}">
                <span v-if="scope.row.goodsQuantity > 1">共{{ scope.row.goodsQuantity }}件</span>
              </div>
              <el-button
                type="text"
                class="aLink goods-btn"
                @click="go('/titanmall/ordermain/manager/orderdetails', scope.row)"
              >{{ scope.row.firstGoodsName }}
              </el-button
              >
            </template>
          </el-table-column>

          <el-table-column
            prop="realPayAmount"
            label="实收金额（元）"
            width="125"
            :resizable="false"
          ></el-table-column>
          <el-table-column
            prop="stockTypeTxt"
            label="库存类型"
            width="90"
            :resizable="false"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="orderTypeTxt"
            label="订单类型"
            width="90"
            :resizable="false"
          ></el-table-column>
          <el-table-column
            prop="orderStatusTxt"
            label="订单状态"
            width="80"
            :resizable="false"
          ></el-table-column>
          <el-table-column
            prop="sourceName"
            label="订单来源"
            width="191"
            :resizable="false"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="订单备注"
            width="285"
            :resizable="false"
            show-overflow-tooltip
          >
            <template slot-scope="scoped">
              {{scoped.row.remark || '--'}}
            </template>
          </el-table-column>
        </el-table>
        <p class="footer">
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
        </p>
      </template>
    </div>
    <el-dialog title="取消订单" :visible.sync="dialogVisible" width="30%">
      <div>
        <p>取消订单前请与买家沟通避免争议</p>
        <p>取消订单后，已支付的订单钱款将会原路退回</p>
      </div>
      <div style="margin-top: 15px">
        <el-button
          size="small"
          type="primary"
          @click="outInfo"
          :disabled="btnLoading"
        >确 定
        </el-button
        >
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import pagination from '@/titanmall/mixins/pagination'
  import api from './api'
  import { exports } from '@/titanmall/components/export'

  export default {
    mixins: [ pagination ],
    data () {
      let _searchForm = {
        paramValue: '',
        paramType: 0,
        orderType: '',
        stockType: '',
        amountStart: '',
        amountEnd: '',
        orderSourceId: '',
        orderStatus: '',
        orderTimeType: ''
      }
      return {
        api,
        tableData: [],
        loading: false,
        dialogVisible: false,
        btnLoading: false,
        rowInfo: '',
        searchForm: { ..._searchForm },
        resetForm: { ..._searchForm },
        paramTypeOptions: [
          {
            value: 0,
            name: '订单号',
          },
          {
            value: 1,
            name: '收货人姓名',
          },
          {
            value: 2,
            name: '收货人电话',
          },
          {
            value: 3,
            name: '商品名称',
          },
        ],
        orderTypeOptions: [
          {
            value: 0,
            name: '商品',
          },
          {
            value: 1,
            name: '服务',
          },
        ],
        stockTypeOptions: [
          {
            value: 0,
            name: 'THC库存',
          },
          {
            value: 1,
            name: '非THC库存',
          },
        ],
        orderSourceIdOptions: [],
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() > Date.now()
          },
          shortcuts: [
            {
              text: '昨天',
              onClick (picker) {
                const end = new Date(new Date().toLocaleDateString())
                const start = new Date(new Date().toLocaleDateString())
                start.setTime(start.getTime() - 3600 * 1000 * 24)
                end.setTime(end.getTime() - 3600 * 1000 * 24)
                picker.$emit('pick', [ start, end ])
              },
            },
            {
              text: '近七天',
              onClick (picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
                picker.$emit('pick', [ start, end ])
              },
            },
            {
              text: '近30天',
              onClick (picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
                picker.$emit('pick', [ start, end ])
              },
            },
          ],
        },
        orderStatusArr: [
          {
            value: '',
            name: '全部',
            isSelect: true,
          },
          {
            value: 10,
            name: '待付款',
            isSelect: false,
          },
          {
            value: 20,
            name: '待发货',
            num: '',
            isSelect: false,
          },
          {
            value: 21,
            name: '部分发货',
            num: '',
            isSelect: false,
          },
          {
            value: -99,
            name: '待处理退款',
            num: '',
            isSelect: false,
          },
          {
            value: 22,
            name: '已发货',
            isSelect: false,
          },
          {
            value: 30,
            name: '已完成',
            isSelect: false,
          },
          {
            value: 40,
            name: '已取消',
            isSelect: false,
          },
          {
            value: -20,
            name: '退款中',
            isSelect: false,
          },
          {
            value: -30,
            name: '已退款',
            isSelect: false,
          },
          {
            value: -40,
            name: '退款失败',
            isSelect: false,
          },
          {
            value: 101,
            name: '未核销',
            isSelect: false,
          },
          {
            value: 102,
            name: '部分核销',
            isSelect: false,
          },
          {
            value: 103,
            name: '已核销',
            isSelect: false,
          },
        ],
        orderTimeArr: [
          { value: '', name: '全部', isSelect: true },
          { value: 0, name: '今天', isSelect: false },
          { value: 1, name: '本周', isSelect: false },
          { value: 2, name: '本月', isSelect: false },
        ],
        orderTimes: [],
        sortOrder: 'desc',
        exportBtn: false,
      }
    },
    created () {
      if (this.$route.query.searchObj) {
        // 回显搜索过滤的数据
        const searchForm = JSON.parse(this.$route.query.searchObj)
        this.current = searchForm.currentPage
        this.pagesize = searchForm.pageSize
        delete searchForm.currentPage
        delete searchForm.pageSize
        if (searchForm.amountEnd || searchForm.amountStart) {
          searchForm.amountEnd = this.$_narrowPrice(searchForm.amountEnd, 100)
          searchForm.amountStart = this.$_narrowPrice(searchForm.amountStart, 100)
        }
        // 订单状态样式改变
        let orderStatusIndex
        this.orderStatusArr.forEach((item, index) => {
          if (item.value === searchForm.orderStatus) orderStatusIndex = index
        })
        this.resetStyle('orderStatusArr', orderStatusIndex)
        // 订单时间
        if (searchForm.orderStartTime) {
          this.orderTimes = [searchForm.orderStartTime.split(' ')[0], searchForm.orderEndTime.split(' ')[0]]
        }
        let orderTimeIndex
        this.orderTimeArr.forEach((item, index) => {
          if (item.value === searchForm.orderTimeType) orderTimeIndex = index
        })
        this.resetStyle('orderTimeArr', orderTimeIndex)
        this.searchForm = {...searchForm}
      }
      this.getInfo()
      this.getOrderSourceList()
    },
    methods: {
      /**
       * getInfo
       * */
      getInfo () {
        this.getCountInfo()
        this.getDataValues()
      },
      /**
       * 获取订单状态提示数据
       * */
      getCountInfo () {
        api.orderCount().then(res => {
          if (!res.errCode) {
            this.orderStatusArr[2].num = res.notDeliveryCount
            this.orderStatusArr[3].num = res.portDeliveryCount
            this.orderStatusArr[4].num = res.pendingRefundCount
          }
        })
      },
      /**
       * 获取订单来源下拉列表
       */
      getOrderSourceList () {
        api.orderSourceList().then(res => {
          if (!res.errCode) {
            res.forEach(item => {
              item.name = item.sourceName
            })
            this.orderSourceIdOptions = [ ...res ]
          }
        })
      },
      setSearchInfo () {
        let params = {
          ...this.searchForm,
          currentPage: this.current,
          pageSize: this.pagesize,
          orderCode: '',
          consigneeName: '',
          consigneePhone: '',
          orderStartTime: '',
          orderEndTime: '',
          sortField: 'orderTime',
          sortOrder: this.sortOrder,
        }
        switch (this.searchForm.paramType) {
          case 0:
            params.orderCode = this.searchForm.paramValue
            break
          case 1:
            params.consigneeName = this.searchForm.paramValue
            break
          case 2:
            params.consigneePhone = this.searchForm.paramValue
            break
          case 3:
            params.goodsName = this.searchForm.paramValue
        }
        // delete params.paramType
        // delete params.paramValue
        params.amountStart = this.searchForm.amountStart
          ? this.$_enlargePrice(this.searchForm.amountStart, 100)
          : this.searchForm.amountStart
        params.amountEnd = this.searchForm.amountEnd
          ? this.$_enlargePrice(this.searchForm.amountEnd, 100)
          : this.searchForm.amountEnd
        if (this.orderTimes.length) {
          params.orderStartTime = this.orderTimes[0] + ' 00:00:00'
          params.orderEndTime = this.orderTimes[1] + ' 23:59:59'
          params.orderTimeType = ''
        }
        return params
      },
      /**
       * 获取表格数据
       */
      getDataValues () {
        this.loading = true
        let params = this.setSearchInfo()
        this.api.orderPage(params).then(res => {
          if (res) {
            this.totalCount = res.totalCount
            res.resultList.forEach(item => {
              item.realPayAmount = this.$_narrowPrice(item.realPayAmount, 100)
            })
            this.tableData = res.resultList
            this.loading = false
          }
        })
      },

      /**
       * 订单时间选择切换
       * */
      clickOrderTime (row, index) {
        if (this.orderTimes && this.orderTimes.length) {
          this.orderTimes = []
        }
        this.resetStyle('orderTimeArr', index)
        this.searchForm.orderTimeType = row.value
      },

      /**
       * 订单状态切换
       * */
      clickOrderStatus (row, index) {
        this.resetStyle('orderStatusArr', index)
        this.searchForm.orderStatus = row.value
      },

      /**
       *  切换状态样式
       * */
      resetStyle (arr, index) {
        this[arr].forEach(item => {
          item.isSelect = false
        })
        this[arr][index].isSelect = true
      },

      // 查询
      filterBtn () {
        this.current = 1
        this.getInfo()
      },

      // 重置
      _resetForm () {
        this.searchForm = { ...this.searchForm, ...this.resetForm }
        this.orderTimes = []
        this.resetStyle('orderStatusArr', 0)
        this.resetStyle('orderTimeArr', 0)
        this.filterBtn()
      },

      /**
       * 页面跳转
       */
      go (path, row) {
        let obj = {
          id: row.id,
          orderType: row.orderType,
          searchObj: JSON.stringify(this.setSearchInfo())
        }
        this.$router.push({ path, query: obj })
      },

      /**
       * 取消订单
       */
      outInfo () {
        this.btnLoading = true
        this.api.orderCancel(this.rowInfo.id).then(res => {
          if (res) {
            this.$message({
              message: '取消成功',
              type: 'success',
            })
          }
          this.getInfo()
          this.dialogVisible = false
          setTimeout(() => {
            this.btnLoading = false
          }, 1000)
        })
      },

      /**
       *  下单时间排序
       * */
      sortMethod (val) {
        this.sortOrder = val.order === 'descending' ? 'desc' : 'asc'
        this.getInfo()
      },

      /*
      *  导出
      */
      clickExport () {
        this.exportBtn = true
        let params = this.setSearchInfo()
        params.config = {
          responseType: 'blob',
        }
        api.orderExport(params).then(res => {
          if (res) exports(res)
          setTimeout(() => {
            this.exportBtn = false
          }, 1000)
        })
      },

    },
    watch: {
      orderTimes: {
        handler: function (n, o) {
          if (n && n.length) {
            this.orderTimeArr.forEach(item => {
              item.isSelect = false
            })
          } else if (n == null) {
            // 组件清空时为null， 默认为全部
            this.orderTimes = []
            this.orderTimeArr[0].isSelect = true
          }
        },
        deep: true,
      },
    },
  }
</script>
<style lang="less" scoped>
  .manager-container {
    .aLink {
      margin: 0 5px;
    }

    .goods-btn {
      /deep/ span {
        display: inline-block;
        width: 100%;
        overflow: hidden;
        text-align: left;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .span-count {
      display: inline-block;
      width: 49px;
      height: 23px;
      font-size: 12px;
      color: #000;
      border-radius: 3px;
      text-align: center;
    }

    .span-count-bg {
      background: #E7E7E7;
    }

    .mr15 {
      margin-right: 15px;
    }

    .mb15 {
      margin-bottom: 15px;
    }

    .search-btn {
      padding-left: 81px;
    }

    .text-style {
      font-size: 14px;
      font-weight: 900;
      cursor: pointer;
    }

    .span-tip {
      background: #FF0000;
      border-radius: 7.5px;
      color: #fff;
      font-size: 12px;
      padding: 0 4px;
      margin-left: 5px;
    }

    .is-select {
      background: #E5EFFB;
      border: 1px solid #167FEB;
      border-radius: 4px;
      color: #167FEB;
      padding: 5px;
    }

    .footer {
      text-align: right;
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
