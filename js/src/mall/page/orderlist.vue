<template>
  <div id="orderlist">
    <div class="layout_inner">
      <el-menu class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index>所有订单</el-menu-item>
        <el-menu-item index="0">待付款</el-menu-item>
        <el-menu-item index="1">待出货</el-menu-item>
        <el-menu-item index="3">已完成</el-menu-item>
        <el-menu-item index="4">已取消</el-menu-item>
        <!-- <el-menu-item index="7">退货/退款</el-menu-item> -->
      </el-menu>
      <ever-form2
        :schema="querySchema"
        v-model="queryObj"
        ref="form"
        :inline="true"
        :is-query="true"
        v-ever-bind-enter
        @query="list(true)"
      >
        <template slot="daterange">
          <ever-range-picker
            :start.sync="queryObj.startTime"
            :end.sync="queryObj.endTime"
            dateType="daterange"
            outformat="YYYY-MM-DD"
            startPlaceholder="_年_月_日"
            endPlaceholder="_年_月_日"
            autoWidth="true"
          ></ever-range-picker>
        </template>
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="list(true)">查询</el-button>
          </el-form-item>
        </template>
      </ever-form2>
      <el-row width="100%" class="tb-header" style="font-size:14px">
        <el-col :span="2" align="center">商品图片</el-col>
        <el-col :span="6" align="left">名称</el-col>
        <el-col :span="2" align="center">商品类型</el-col>
        <el-col :span="2" align="center">单价</el-col>
        <el-col :span="2" align="center">数量</el-col>
        <el-col :span="2" align="center">小计</el-col>
        <el-col :span="2" align="center"></el-col>
        <el-col :span="2" align="center">状态</el-col>
        <el-col :span="4" align="center">操作</el-col>
      </el-row>
      <div v-if="tableData && tableData.length">
        <el-row v-for="(item, i) in tableData" :key="i">
          <el-row class="tb-title">
            <el-col :span="12">
              <a :href="$ever.cardIndex + '/card/orderdetails/' + item.id">
                <span>{{item.createTime}}</span>
                <span>
                  <label>订单号：</label>
                  <em>{{item.sn}}</em>
                </span>
              </a>
            </el-col>
            <el-col :span="12" align="right">
              <span>
                订单金额：
                <em>¥{{item.totalPrice | formatToFinacial}}</em>
              </span>
              <span v-if="item.status != 8">
                实际支付金额：
                <em>¥{{item.payPrice | formatToFinacial}}</em>
              </span>
              <span v-if="item.status == 8">
                实际支付金额：
                <em>¥{{item.paidPrice | formatToFinacial}}</em>
              </span>
            </el-col>
          </el-row>
          <table width="100%" class="tb-table" cellspacing="0" cellpadding="0">
            <tbody>
              <tr v-for="(item1, j) in item.orderItems" :key="j">
                <td width="8.33333%" align="center">
                  <div class="cell">
                    <el-image style="width: 80px; height: 60px;" v-if="item1.product.images" :src="`${$ever.fileUrl2}${item1.product.images.split('#')[0]}`" :preview-src-list="item1.product.images.split('#')"></el-image>
                    <el-image style="width: 80px; height: 60px;" v-else src=""></el-image>
                  </div>
                </td>
                <td width="25%">
                  <div class="cell">{{item1.product.name}}</div>
                </td>
                <td width="8.33333%" align="center">
                  <div class="cell">
                    <span
                      class="cRed"
                    >{{item1.parentCategoryName ? item1.parentCategoryName : '--'}} > {{item1.productCategoryName ? item1.productCategoryName : '--'}}</span>
                  </div>
                </td>
                <td width="8.33333%" align="center">
                  <div class="cell">¥{{(item1.singleOrigPrice) | formatToFinacial}}</div>
                </td>
                <td width="8.33333%" align="center">
                  <div class="cell">{{item1.amount}}</div>
                </td>
                <td width="8.33333%" align="center">
                  <div class="cell">¥{{(item1.amount * item1.singleOrigPrice) | formatToFinacial}}</div>
                </td>
                <td width="8.33333%" align="center">
                  <a
                    href="javascript:void(0)"
                    @click="orderReturn(item.id, item1.id, item)"
                    v-if="item.status == 3 && item1.product.type != 3"
                  >申请售后</a>
                </td>
                <td
                  width="8.33333%"
                  rowspan="2"
                  :rowspan="item.orderItems.length"
                  align="center"
                  class="line"
                  v-if="j == 0"
                >
                  <div class="cell">
                    <span class="cRed">
                      <sys-value type="THC_MALL_ORDER_STATUS" :code="item.status"></sys-value>
                    </span>
                  </div>
                </td>
                <td
                  width="16.6667%"
                  rowspan="2"
                  :rowspan="item.orderItems.length"
                  align="center"
                  class="line"
                  v-if="j == 0"
                >
                  <div class="cell">
                    <el-button
                      size="small"
                      @click="sendGoods(item.id, item.sn)"
                      v-if="item.status == 1"
                      :loading="sendloading"
                      type="primary"
                    >出货</el-button>
                    <el-button
                      size="small"
                      @click="returnMoney(item.id)"
                      :loading="returnloading"
                      v-if="(item.status == 1 || item.status == 8) && item.payPrice != 0"
                      type="primary"
                    >退款</el-button>
                    <el-button
                      size="small"
                      @click="cancleOrder(item.id)"
                      v-if="item.status == 0"
                      type="primary"
                    >取消订单</el-button>
                    <el-popover
                      ref="messagepop"
                      placement="bottom"
                      trigger="hover"
                      class="payBtn"
                      v-if="item.status == 8"
                      v-model="popshow"
                    >
                      <p>总额：{{item.payPrice | formatToFinacial}}</p>
                      <p>已支付金额：{{item.paidPrice | formatToFinacial}}</p>
                      <p>还需支付金额：{{(item.payPrice - item.paidPrice) | formatToFinacial}}</p>
                      <el-button slot="reference" size="small" type="text">付款详情</el-button>
                    </el-popover>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </el-row>
      </div>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </div>
    <dialog-return ref="dialogreturn" :curOrderObj="orderObj" @aftersave="list"></dialog-return>
  </div>
</template>
<script>
import api from '../store/orderapi'
import list from '@/util/list'
import dialogReturn from './dialog-return'
let querySchema = [
  {
    label: '下单时间',
    name: 'daterange',
    comp: 'custom'
  },
  {
    name: 'sn',
    label: '订单编号',
    placeholder: '请输入订单编号'
  },
  {
    name: 'productName',
    label: '商品名称',
    placeholder: '请输入商品名称'
  }
]
export default {
  mixins: [list],
  data () {
    let obj = this.$ever.createObjFromSchema(querySchema)
    obj.startTime = ''
    obj.endTime = ''
    obj.status = ''
    return {
      api,
      querySchema: querySchema,
      queryObj: obj,
      messageBox: '',
      tableData: [],
      orderObj: {},
      popshow: false,
      returnloading: false,
      sendloading: false
    }
  },
  created () {
  },
  methods: {
    msgShow (item) {
      this.messageBox = item
      this.isNeed = true
    },
    orderReturn (orderId, orderItemId, orderObj) {
      this.orderObj = orderObj
      this.$refs.dialogreturn.open(orderId, orderItemId)
    },
    sendGoods (id, payStatement) {
      this.sendloading = true
      this.$confirm('您确定要出货吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.sendGoods(id, payStatement).then(result => {
          this.sendloading = false
          this.list()
        })
      }).catch(() => {
        this.sendloading = false
        return false
      })
    },
    returnMoney (id) {
      this.returnloading = true
      this.$confirm('您确定要退款吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.refund(id).then(result => {
          this.returnloading = false
          this.list()
        })
      }).catch(() => {
        this.returnloading = false
        return false
      })
    },
    cancleOrder (id) {
      this.$confirm('您确定要取消订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.cancel(id).then(result => {
          this.list()
        })
      }).catch(() => {
        return false
      })
    },
    handleSelect (key, keyPath) {
      let param
      if (key === '') {
        param = {
          offset: 0,
          pagesize: 20
        }
        this.queryObj.status = ''
      } else {
        param = {
          status: key,
          offset: 0,
          pagesize: 20
        }
        this.queryObj.status = key
      }
      Object.assign(this.queryObj, param)
      this.list(true)
    }
  },
  watch: {
    'queryObj.startTime' (val) {
      val ? this.queryObj.queryTimeType = 0 : this.queryObj.queryTimeType && delete this.queryObj.queryTimeType
    }
  },
  components: {
    dialogReturn
  }
}
</script>
<style scoped>
.el-menu {
  margin-bottom: 20px;
}
.el-menu--horizontal .el-menu-item {
  padding: 0 20px;
}
.payDetail {
  border: 1px solid #eee;
  position: absolute;
  background-color: #fff;
  z-index: 99;
  padding: 20px;
  right: 50px;
}
#orderlist .tb-header {
  background: #f8f8f8;
  border: 1px solid #eeeeee;
  margin-bottom: 10px;
  font-size: 14px;
}
#orderlist .tb-header .el-col {
  height: 50px;
  line-height: 50px;
  padding: 0 10px;
}
#orderlist .tb-title .el-col {
  padding: 10px 0;
  font-size: 12px;
}
#orderlist .tb-title .el-col:first-child span {
  margin-right: 20px;
  color: #999;
}
#orderlist .tb-title .el-col:first-child span em {
  font-style: normal;
  color: #151515;
}
#orderlist .tb-title .el-col:last-child span {
  margin-left: 20px;
  vertical-align: bottom;
  color: #000;
  display: inline-block;
  height: 18px;
  line-height: 18px;
}
#orderlist .tb-title .el-col:last-child span em {
  font-style: normal;
  color: #f7ba2a;
  font-size: 16px;
}
#orderlist .tb-table {
  border: 1px solid #eeeeee;
  border-collapse: separate;
  border-bottom: none;
  font-size: 14px;
  margin-bottom: 10px;
}
#orderlist .tb-table tr td {
  border-bottom: 1px solid #eeeeee;
}
#orderlist .tb-table tr td.line {
  border-left: 1px solid #eeeeee;
}
#orderlist .tb-table tr:first-child td:last-child {
  border-right: 0;
}
#orderlist .tb-table tr td > .cell {
  padding: 10px;
  vertical-align: bottom;
}
#orderlist .tb-table .el-button--danger {
  color: #fa5555;
  background: #fee;
  border-color: #fdbbbb;
}
</style>
