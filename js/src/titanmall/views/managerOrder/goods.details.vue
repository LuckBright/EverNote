<template>
  <div class="goods-details-container">
    <div class="region">
      <div class="topTitle">
        <span>订单详情</span>
      </div>
      <el-row class="details-row">
        <el-col :span="6">
          <span class="span-color">订单编号</span>
          {{ order.orderCode || '--' }}
        </el-col>
        <el-col :span="5">
          <span class="span-color">下单时间</span>
          {{ order.orderTime || '--' }}
        </el-col>
        <el-col :span="5">
          <span class="span-color">支付时间</span>
          {{ order.payTime || '--' }}
        </el-col>
        <el-col :span="4">
          <span class="span-color">支付方式</span>
          {{ order.payTypeTxt || '--' }}
        </el-col>
      </el-row>
      <el-row class="details-row">
        <el-col>
          <span class="span-color">订单备注</span>
          {{ order.remark || '--' }}
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        :span-method="spanMethod"
      >
        <el-table-column
          prop="goodsName"
          label="商品"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="specification"
          label="规格"
          width="120px"
        ></el-table-column>
        <el-table-column label="单价" width="120px">
          <template slot-scope="scope">
            <span>￥</span>
            {{ scope.row.unitPrice }}
          </template>
        </el-table-column>
        <el-table-column
          prop="quantity"
          label="数量"
          width="120px"
        ></el-table-column>
        <el-table-column label="商品总价" width="120px">
          <template slot-scope="scope">
            <span>￥</span>
            {{ scope.row.totalAmount }}
          </template>
        </el-table-column>
        <el-table-column label="快递费用" width="120px">
          <template slot-scope="scope">
            <span>￥</span>
            {{ scope.row.freight }}
          </template>
        </el-table-column>
        <el-table-column label="优惠" width="120px">
          <template slot-scope="scope">
            <span
              v-if="
                scope.row.totalPreferentialAmount &&
                  scope.row.totalPreferentialAmount !== '0.00'
              "
            >- ￥{{ scope.row.totalPreferentialAmount }}</span
            >
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="订单总价" width="120px">
          <template slot-scope="scope">
            <span>￥</span>
            {{ scope.row.totalOrderAmount }}
          </template>
        </el-table-column>
        <el-table-column label="实付款" width="120px">
          <template slot-scope="scope">
            <span>￥</span>
            {{ scope.row.realPayAmount }}
          </template>
        </el-table-column>
        <el-table-column
          prop="orderStatusTxt"
          label="订单状态"
          width="120px"
        ></el-table-column>
      </el-table>
    </div>
    <div class="region">
      <div class="topTitle">
        <span>物流信息</span>
      </div>
      <div class="logistics">
        <div class="logistics-inof">
          <el-row class="details-row">
            <el-col>
              <span class="span-color">收货地址</span>
              {{ order.consigneeAddress }}
            </el-col>
          </el-row>
          <el-row class="details-row">
            <el-col>
              <span class="span-color">收件姓名</span>
              {{ order.consigneeName }}
            </el-col>
          </el-row>
          <el-row class="details-row">
            <el-col>
              <span class="span-color">手机号码</span>
              {{ order.consigneePhone }}
            </el-col>
          </el-row>
        </div>
        <div>
          <el-row
            class="details-row"
            v-for="(key, index) in parcels"
            :key="index"
          >
            <el-col :span="9">
              <span class="span-color">包裹{{ ++index }}</span>
              {{ key.logisticsOrderCode }}
            </el-col>
            <el-col :span="9">
              <span class="span-color">快递公司</span>
              {{ key.logisticsCompany }}
            </el-col>
            <el-col :span="5">
              <el-button
                class="btn-style" type="text" @click="getQuery(key)"
              >查看物流
              </el-button
              >
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="region" v-if="outTableData.length">
      <div class="topTitle">
        <span>退款信息</span>
      </div>
      <div
        class="details-info bg-color"
        v-for="(items, index) in outTableData"
        :key="index"
      >
        <el-row class="details-row">
          <el-col :span="6">
            <span class="span-color">退款编号</span>
            {{ items.refundCode }}
          </el-col>
          <el-col :span="5">
            <span class="span-color">申请时间</span>
            {{ items.applyTime }}
          </el-col>
          <el-col :span="4" v-if="items.logisticsOrderCode">
            <el-button
              class="btn-style" type="text" @click="getQuery(items)"
            >查看物流
            </el-button
            >
          </el-col>
        </el-row>
        <el-row class="details-row">
          <el-col>
            <span class="span-color">退款原因</span>
            {{ items.refundReason }}
          </el-col>
        </el-row>
        <el-row class="details-row">
          <el-col>
            <span class="span-color">退款说明</span>
            {{ items.refundDescription || '--' }}
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <span
              v-for="(item, index) in items.newImg"
              :key="index"
              style="margin-right: 10px"
            >
              <el-image
                style="width: 100px; height: 160px"
                :src="items.newImg[index]"
                :preview-src-list="items.newImg"
              >
              </el-image>
            </span>
          </el-col>
        </el-row>
        <el-table :data="items.arr" style="width: 100%" border>
          <el-table-column label="操作" width="150px">
            <template slot-scope="scope">
              <div v-if="scope.row.applyStatus == 0">
                <el-button
                  type="text"
                  @click="
                    () => {
                      returnId = scope.row.id;
                      dialogRefuseVisible = true;
                    }
                  "
                >拒绝退款申请
                </el-button
                >
                <el-button
                  type="text" @click="okReturnPrice(scope.row, 1)"
                >同意退款申请
                </el-button
                >
              </div>
              <div
                v-else-if="
                  scope.row.applyStatus == 1 && scope.row.logisticsOrderCode
                "
              >
                <el-button
                  type="text"
                  @click="
                    () => {
                      returnId = scope.row.id;
                      noPriceDialog = true;
                    }
                  "
                >拒绝退款
                </el-button
                >
                <el-button
                  type="text" @click="okReturnPrice(scope.row, 0)"
                >确认收货并退款
                </el-button
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="goodsName"
            label="商品"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="specification"
            label="规格"
            width="200px"
          ></el-table-column>
          <el-table-column label="单价" width="90px">
            <template slot-scope="scope">
              <span>￥</span>
              {{ scope.row.unitPrice }}
            </template>
          </el-table-column>
          <el-table-column
            prop="quantity"
            label="数量"
            width="90px"
          ></el-table-column>
          <el-table-column label="商品总价" width="90px">
            <template slot-scope="scope">
              <span>￥</span>
              {{ scope.row.totalAmount }}
            </template>
          </el-table-column>
          <el-table-column label="退款金额" width="90px">
            <template slot-scope="scope">
              <span>￥</span>
              {{ scope.row.applyAmount }}
            </template>
          </el-table-column>
          <el-table-column
            prop="refundTypeTxt"
            label="订单状态"
            width="170px"
          ></el-table-column>
          <el-table-column
            prop="applyStatusTxt"
            label="退款状态"
            width="120px"
          ></el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog title="物流信息" :visible.sync="dialogVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.ftime"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
    <el-dialog
      title="拒绝退款申请"
      :visible.sync="dialogRefuseVisible"
      width="30%"
    >
      <el-input
        v-model="refuseValues"
        type="textarea"
        :rows="4"
        placeholder="请输入拒绝申请原因"
      ></el-input>
      <div style="margin-top: 10px">
        <el-button type="primary" @click="applyApprove">确 定</el-button>
        <el-button @click="dialogRefuseVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="同意退款申请" :visible.sync="okAndRefuse" width="30%">
      <p>{{ tipName }}</p>
      <div style="margin-top: 10px">
        <el-button type="primary" @click="okReturnBtn">确 定</el-button>
        <el-button @click="okAndRefuse = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="拒绝退款" :visible.sync="noPriceDialog" width="30%">
      <el-input
        v-model="noPriceValues"
        type="textarea"
        :rows="4"
        placeholder="请输入拒绝退款原因"
      ></el-input>
      <div style="margin-top: 10px">
        <el-button type="primary" @click="noPriceBtn">确 定</el-button>
        <el-button @click="noPriceDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="确认收货并退款" :visible.sync="okPriceDialog" width="30%">
      <div>钱款将原路退回给买家</div>
      <p>{{ tipName }}</p>
      <div style="margin-top: 10px">
        <el-button type="primary" @click="okBtn">确 定</el-button>
        <el-button @click="okPriceDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import api from './api'

  export default {
    props: [ 'id' ],
    data () {
      return {
        api,
        order: {},
        tableData: [],
        dialogVisible: false,
        srcList: [],
        outTableData: [],
        parcels: [],
        activities: [],
        dialogRefuseVisible: false, // 退款拒绝申请弹框
        refuseValues: '', // 拒绝原因
        okAndRefuse: false, // 确认收货并退款弹框
        tipName: '',
        noPriceDialog: false,
        noPriceValues: '',
        okPriceDialog: false,
        returnId: '',
        imgCdn: localStorage.getItem('IMGCDN'),
      }
    },
    created () {
      this.getList()
    },
    methods: {
      /**
       * 表格合并
       */
      spanMethod ({ rowIndex, columnIndex }) {
        if (columnIndex > 4) {
          if (rowIndex % 1 === rowIndex) {
            return {
              rowspan: this.tableData.length,
              colspan: 1,
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0,
            }
          }
        }
      },

      /**
       获取数据
       */
      getList () {
        this.api.orderView(this.id).then(res => {
          if (res) {
            this.order = res.order
            this.parcels = res.parcels
            res.orderDetails.forEach(item => {
              item.orderStatusTxt = res.order.orderStatusTxt
              item.unitPrice = this.$_narrowPrice(item.unitPrice, 100)
              item.totalAmount = this.$_narrowPrice(item.totalAmount, 100)
              item.freight = this.$_narrowPrice(res.order.freight, 100)
              item.totalOrderAmount = this.$_narrowPrice(
                res.order.totalOrderAmount,
                100,
              )
              item.realPayAmount = this.$_narrowPrice(
                res.order.realPayAmount,
                100,
              )
              // 优惠
              item.totalPreferentialAmount = this.$_narrowPrice(
                res.order.totalPreferentialAmount,
                100,
              )
            })
            res.refundOrders.forEach(items => {
              if (items.picture && items.picture.length) {
                let urls = []
                items.picture.forEach(item => {
                  let url
                  if (item.includes('http')) {
                    url = item
                  } else {
                    url = this.imgCdn + item
                  }
                  urls.push(url)
                })
                items.newImg = [ ...urls ]
              }
              items.unitPrice = this.$_narrowPrice(items.unitPrice, 100)
              items.totalAmount = this.$_narrowPrice(items.totalAmount, 100)
              items.applyAmount = this.$_narrowPrice(items.applyAmount, 100)
              let arr = [ { ...items } ]
              items.arr = arr
            })
            this.outTableData = res.refundOrders
            this.tableData = res.orderDetails
          }
        })
      },

      // 拒绝退款申请
      applyApprove () {
        if (!this.refuseValues) {
          this.$message({
            message: '请输入拒绝申请原因',
            type: 'error',
          })
          return
        }
        let params = {
          approveType: 1,
          refundId: this.returnId,
          reason: this.refuseValues,
        }
        this.api.applyApprove(params).then(res => {
          if (res) {
            this.$message({
              message: '退款申请成功',
              type: 'success',
            })
            this.getList()
            this.dialogRefuseVisible = false
          }
        })
      },

      // 同意退款弹框
      okReturnPrice (row, status) {
        this.returnId = row.id
        this.tipName = row.goodsName + ' ' + row.specification
        if (status) {
          this.okAndRefuse = true
        } else {
          this.okPriceDialog = true
        }
      },

      // 同意退款
      okReturnBtn () {
        let params = {
          approveType: 0,
          refundId: this.returnId,
          reason: '',
        }
        this.api.applyApprove(params).then(res => {
          if (res) {
            this.$message({
              message: '同意退款成功',
              type: 'success',
            })
            this.getList()
            this.okAndRefuse = false
          }
        })
      },

      // 拒绝退款
      noPriceBtn () {
        if (!this.noPriceValues) {
          this.$message({
            message: '请输入拒绝退款原因',
            type: 'error',
          })
          return
        }
        let params = {
          approveType: 1,
          reason: this.noPriceValues,
          refundId: this.returnId,
        }
        this.api.refundApprove(params).then(res => {
          if (res) {
            this.$message({
              message: '拒绝成功',
              type: 'success',
            })
            this.getList()
            this.noPriceDialog = false
          }
        })
      },

      // 收货并退款
      okBtn () {
        let params = {
          approveType: 0,
          reason: '',
          refundId: this.returnId,
        }
        this.api.refundApprove(params).then(res => {
          if (res) {
            this.$message({
              message: '确认收货并退款成功',
              type: 'success',
            })
            this.getList()
            this.okPriceDialog = false
          }
        })
      },

      // 获取物流信息
      getQuery (items) {
        let params = {
          com: items.logisticsCompanyCode,
          num: items.logisticsOrderCode,
        }
        this.api.expressQuery(params).then(res => {
          if (res) {
            this.activities = res.data
            this.dialogVisible = true
          }
        })
      },
    },
  }
</script>
<style lang="less" scoped>
  .goods-details-container {
    .details-row {
      margin-bottom: 10px;
    }

    .details-info {
      padding: 20px;
    }

    .logistics {
      display: flex;
      justify-content: space-between;

      & > div {
        width: 50%;
      }

      .logistics-inof {
        padding-left: 10px;
        padding-right: 80px;
        margin-right: 80px;
        border-right: 1px solid #ccc;
      }
    }

    .btn-style {
      padding: 0 !important;
    }
  }
</style>
