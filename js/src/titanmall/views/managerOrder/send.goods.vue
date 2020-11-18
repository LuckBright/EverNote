<template>
  <div class="send-goods-container">
    <div>
      <el-page-header @back="goBack" content="发货详情"></el-page-header>
    </div>
    <div class="details-container">
      <el-row class="detail-row">
        <el-col :span="6">
          <span class="span-color">订单编号</span>
          {{ orderObj.orderCode }}
        </el-col>
        <el-col :span="5">
          <span class="span-color">下单时间</span>
          {{ orderObj.orderTime }}
        </el-col>
      </el-row>
      <el-row class="detail-row">
        <el-col>
          <span class="span-color">订单备注</span>
          {{ orderObj.remark || '--' }}
        </el-col>
      </el-row>
      <el-table
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          :selectable="checkboxT"
        ></el-table-column>

        <el-table-column prop="goodsName" label="商品">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.num">包裹 {{ scope.row.num }}</el-tag>
            {{ scope.row.goodsName }}
          </template>
        </el-table-column>
        <el-table-column
          prop="specification"
          label="规格"
          width="150px"
        ></el-table-column>
        <el-table-column
          prop="unitPrice"
          label="单价"
          width="150px"
        ></el-table-column>
        <el-table-column
          prop="quantity"
          label="数量"
          width="150px"
        ></el-table-column>
        <el-table-column
          prop="totalAmount"
          label="商品总价"
          width="150px"
        ></el-table-column>
        <el-table-column prop="deliveryStatus" label="订单状态" width="150px">
          <template slot-scope="scope">
            {{ scope.row.deliveryStatus === 0 ? '未发货' : '已发货' }}
          </template>
        </el-table-column>
      </el-table>
      <el-divider></el-divider>
      <div>
        <el-row v-for="(items, index) in deliver" :key="index">
          <el-col :span="6">
            <span class="span-color">快递公司</span>
            <el-select
              v-model="items.info"
              filterable
              placeholder="请搜索快递公司"
              :filter-method="filterSelect"
              size="small"
              clearable
              value-key="label"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.label"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <span class="span-color">快递编号</span>
            <el-input
              v-model="items.logisticsOrderCode"
              style="width:230px"
              size="small"
            ></el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="text" @click="addBtn">添加</el-button>
            <el-button
              v-if="deliver.length > 1"
              type="text"
              @click="deleteBtn(index)"
            >删除
            </el-button
            >
            <el-button
              v-if="index === 0"
              :disabled="sendGoodsBtn"
              size="small"
              type="primary"
              @click="sendBtn"
            >发货
            </el-button
            >
          </el-col>
        </el-row>
        <p>
          <el-row v-for="(items, i) in parcels" :key="i">
            <el-col :span="6">
              <span class="span-color">包裹{{ ++i }}</span>
              {{ items.logisticsOrderCode }}
            </el-col>
            <el-col :span="5">
              <span class="span-color">快递公司</span>
              {{ items.logisticsCompany }}
            </el-col>
            <el-col :span="3">
              <el-button
                style="padding: 0" type="text" @click="getQuery(items)"
              >查看物流
              </el-button
              >
            </el-col>
          </el-row>
        </p>
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
      </div>
    </div>
  </div>
</template>
<script>
  import api from './api'

  export default {
    data () {
      return {
        api,
        tableData: [],
        allSelection: [],
        dialogVisible: false,
        activities: [],
        deliver: [
          {
            logisticsCompany: '',
            logisticsOrderCode: '',
            logisticsCompanyCode: '',
            info: '',
          },
        ],
        orderObj: {
          orderCode: '',
          remark: '',
          orderTime: '',
        },
        parcels: [],
        options: [],
        timer: '',
        rules: {
          info: [ { required: true, message: '请选择活动区域', trigger: 'change' } ],
        },
        sendGoodsBtn: false,
      }
    },
    created () {
      this.getList()
      this.filterSelect('')
    },
    methods: {
      /**
       * 发货多选
       */
      handleSelectionChange (val) {
        this.allSelection = val
      },
      /**
       * 默认选中
       */
      allSelectionChagne () {
        this.$nextTick(() => {
          this.tableData.forEach(items => {
            if (items.deliveryStatus === 0 && items.refundStatus === 10) {
              this.$refs.multipleTable.toggleRowSelection(items)
            }
          })
        })
      },
      // 禁止选中
      checkboxT (row, index) {
        if (row.refundStatus !== 10 || row.deliveryStatus === 1) {
          return 0
        } else {
          return 1
        }
      },
      /**
       * 返回订单页
       */
      goBack () {
        this.$router.push({name: 'manager', query: {searchObj: this.$route.query.searchObj}})
      },
      /**
       获取发货信息
       */
      getList () {
        this.api.parcelView(this.$route.query.id).then(res => {
          if (res) {
            this.resultInfo(res)
          }
        })
      },

      // 请求接口返回数据
      resultInfo (res) {
        this.orderObj = res
        res.orderDetails.forEach(items => {
          items.unitPrice = this.$_narrowPrice(items.unitPrice, 100)
          items.totalAmount = this.$_narrowPrice(items.totalAmount, 100)
          items.num = ''
          if (items.parcelIds.length) {
            res.parcels.forEach((item, index) => {
              if (items.parcelIds[0] === item.id) items.num = ++index
            })
          }
        })
        this.tableData = res.orderDetails
        this.parcels = res.parcels
        this.allSelectionChagne()
      },

      // 搜索快递公司
      filterSelect (val) {
        if (this.timer) clearTimeout(this.timer)
        let params = {
          name: val,
          offset: 0,
          pagesize: 10,
        }
        this.timer = setTimeout(() => {
          this.api.expressQueryCom(params).then(res => {
            if (res) {
              res.resultList.forEach(item => {
                item.label = item.com
              })
              this.options = res.resultList
            }
          })
        }, 800)
      },
      /**
       添加快递公司
       */
      addBtn () {
        let obj = {
          logisticsCompany: '',
          logisticsOrderCode: '',
          logisticsCompanyCode: '',
          info: '',
        }
        this.deliver.push(obj)
      },
      /**
       删除快递公司
       */
      deleteBtn (index) {
        this.deliver.splice(index, 1)
      },
      /**
       发货
       */
      sendBtn () {
        this.sendGoodsBtn = true
        let logistics = []
        this.deliver.forEach(item => {
          item.logisticsCompany = item.info.com
          item.logisticsCompanyCode = item.info.comCode
          logistics.push(item)
        })
        let orderDetailIds = []
        this.allSelection.forEach(item => {
          orderDetailIds.push(item.id)
        })
        let params = {
          logistics,
          orderDetailIds,
          orderId: this.orderObj.id,
        }
        this.api.parcelDelivery(params).then(res => {
          if (res) {
            this.$message({
              message: '发货成功',
              type: 'success',
            })
            this.deliver.length = 0
            this.deliver.push({
              logisticsCompany: '',
              logisticsOrderCode: '',
              logisticsCompanyCode: '',
              info: '',
            })
            this.resultInfo(res)
          }
          setTimeout(() => {
            this.sendGoodsBtn = false
          }, 1000)
        })
      },

      // 查看物流
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
  .send-goods-container {
    margin: 10px;
    .details-container {
      margin-top: 5px;
      background-color: #fff;
      padding: 20px;

      /deep/ .el-form .el-row .el-form-item_label {
        color: #999;
        font-size: 14px;
      }

      .detail-row {
        margin-bottom: 10px;
      }
    }
  }
</style>
