<template>
  <div class="main">
    <p class="region">
      <span class="span-color">收入</span>
      <span>{{ '¥ ' + payObj.income }}</span>
      <span class="span-color" style="margin-left: 80px">支出</span>
      <span>{{ '¥ ' + payObj.disbursement }}</span>
    </p>
    <div class="region">
      <p>
        <span class="span-color">入账时间</span>
        <el-date-picker
          disabledDate
          size="small"
          v-model="searchObj.rzsj"
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
        <span class="span-color ml20">订单状态</span>
        <el-select v-model="searchObj.orderStatus" size="small">
          <el-option
            v-for="item in options.status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </p>
      <p class="search-p">
        <span class="span-color">支付方式</span>
        <el-select v-model="searchObj.channelSource" size="small">
          <el-option
            v-for="item in options.channelSource"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <span class="span-color lf">类型</span>
        <el-select v-model="searchObj.type" size="small">
          <el-option
            v-for="item in options.type"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <span class="span-color lf">单号</span>
        <el-input
          v-model="searchObj.transactionNo"
          placeholder="请输入单号/支付流水号"
          style="width: 217px"
          size="small"
        ></el-input>
        <el-button
          type="primary" size="small" class="lf" @click="searchInfo"
        >查询
        </el-button
        >
        <el-button size="small" @click="setInfo">重置</el-button>
        <el-button :disabled="exportBtn" size="small" @click="clickExport">导出</el-button>
      </p>
      <el-table :data="tableData" border v-loading="loading">
        <el-table-column width="120" prop="type" label="类型">
          <template slot-scope="scope">
            {{ typeObj[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column width="160" prop="tradeTimeEnd" label="入账时间"/>
        <el-table-column prop="amount" label="金额" width="150"/>
        <el-table-column width="90" prop="channelSource" label="支付方式"/>
        <el-table-column prop="transactionNo" label="支付流水"/>
        <el-table-column prop="orderNos" label="业务单号"/>
        <el-table-column prop="orderStatusTxt" label="订单状态" width="150"/>
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
  import api from './api'
  import pagination from '@/titanmall/mixins/pagination'
  import { exports } from '@/titanmall/components/export'

  export default {
    mixins: [ pagination ],
    data () {
      let self = this
      return {
        api,
        tableData: [],
        searchObj: {
          rzsj: '',
          channelSource: '',
          type: '',
          transactionNo: '',
          orderStatus: '',
        },
        options: {
          channelSource: [
            {
              value: '',
              label: '全部',
            },
            {
              value: '1',
              label: '支付宝',
            },
            {
              value: '2',
              label: '微信',
            },
          ],
          type: [
            {
              value: '',
              label: '全部',
            },
            {
              value: '2',
              label: '订单入账',
            },
            {
              value: '3',
              label: '订单退款',
            },
            {
              value: '1',
              label: '信息技术服务费',
            },
          ],
          status: [
            {
              value: '',
              label: '全部',
            },
            {
              value: 10,
              label: '待付款',
            },
            {
              value: 20,
              label: '待发货',
            },
            {
              value: 21,
              label: '部分发货',
            },
            {
              value: 22,
              label: '已发货',
            },
            {
              value: 30,
              label: '已完成',
            },
            {
              value: 40,
              label: '已取消',
            },
            {
              value: -20,
              label: '退款中',
            },
            {
              value: -30,
              label: '已退款',
            },
            {
              value: -40,
              label: '退款失败',
            },
          ],
        },
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
                self.dateStatus = 1
                picker.$emit('pick', [ start, end ])
              },
            },
            {
              text: '近七天',
              onClick (picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
                self.dateStatus = 2
                picker.$emit('pick', [ start, end ])
              },
            },
            {
              text: '近30天',
              onClick (picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
                self.dateStatus = 2
                picker.$emit('pick', [ start, end ])
              },
            },
          ],
        },
        payObj: {
          disbursement: '',
          income: '',
        },
        typeObj: {
          '1': '信息技术服务费',
          '2': '订单入账',
          '3': '订单退款',
        },
        loading: false,
        dateStatus: '',
        exportBtn: false,
      }
    },
    created () {
      let newDate = new Date()
      let lastTime = new Date(newDate.getTime() - 3600 * 1000 * 24 * 6)
      this.searchObj.rzsj = [ this.getTime(lastTime), this.getTime(newDate) ]
      this.getDataValues()
    },
    methods: {
      getTime (date) {
        let y = date.getFullYear()
        let m = date.getMonth() + 1
        let d = date.getDate()
        let time = y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d)
        return time
      },
      /**
       * 获取数据
       * */
      getDataValues () {
        this.loading = true
        let params = this.paramsInfo()
        this.api.capitalStatementList(params).then(res => {
          if (res) {
            this.totalCount = res.totalCount
            res.resultList.forEach(item => {
              item.orderNos = item.orderNos
                .split(',')
                .filter(items => !!items)
                .join(',')
              if (item.channelSource) {
                item.channelSource =
                  item.channelSource === 'wxpay' ? '微信' : '支付宝'
              } else {
                item.channelSource = '--'
              }
            })
            res.resultList.forEach(item => {
              item.amount = this.$_narrowPrice(item.amount, 100)
            })
            res.income = this.$_narrowPrice(res.income, 100)
            res.disbursement = this.$_narrowPrice(res.disbursement, 100)
            this.payObj = { ...this.payObj, ...res }
            this.tableData = res.resultList
            this.loading = false
          }
        })
      },
      // params 格式化
      paramsInfo () {
        let time = this.searchObj.rzsj
        let obj = { ...this.searchObj }
        if (this.searchObj.channelSource === '1') {
          obj.channelSource = 'alipay'
        } else if (this.searchObj.channelSource === '2') {
          obj.channelSource = 'wxpay'
        } else {
          obj.channelSource = ''
        }

        let params = {
          ...obj,
          beginDate: time ? time[0] + ' 00:00:00' : '',
          currentPage: this.current,
          pageSize: this.pagesize,
        }
        if (this.dateStatus === 1) {
          params.endDate = time ? time[1] + ' 00:00:00' : ''
        } else {
          params.endDate = time ? time[1] + ' 23:59:59' : ''
        }
        delete params.rzsj
        return params
      },

      // 查询
      searchInfo () {
        this.current = 1
        this.getDataValues()
      },

      // 重置条件
      setInfo () {
        let newDate = new Date()
        let lastTime = new Date(newDate.getTime() - 3600 * 1000 * 24 * 6)
        this.searchObj = Object.assign(this.searchObj, {
          rzsj: [ this.getTime(lastTime), this.getTime(newDate) ],
          channelSource: '',
          type: '',
          transactionNo: '',
          orderStatus: '',
        })
        this.current = 1
        this.getDataValues()
      },

      /**
       * 导出
       * */
      clickExport () {
        this.exportBtn = true
        let params = this.paramsInfo()
        params.config = {
          responseType: 'blob',
        }
        api.capitalStatementExport(params).then(res => {
          if (res) exports(res)
          setTimeout(() => {
            this.exportBtn = false
          }, 1000)
        })
      },
    },
  }
</script>
<style lang="less" scoped>
  .search-p {
    margin: 10px 0;

    .lf {
      margin-left: 20px;
    }
  }
</style>
