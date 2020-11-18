<template>
  <div class="layout_inner">
    <div class="list-box">
      <div>
        <el-table :data="tableData" v-loading="loading">
          <!--            :height="getTableHeight()"-->
          <el-table-column prop="orderId" width="220" label="订单号"></el-table-column>
          <template v-if="type == 0">
            <el-table-column prop="operationTime"  width="220"  label="充值时间">
            </el-table-column>
            <el-table-column prop="money" label="充值金额"></el-table-column>
            <el-table-column  label="支付状态">
              <template slot-scope="scope">
                <span v-show="scope.row.operationStatus === 0">待支付</span>
                <span v-show="scope.row.operationStatus === 1">支付成功</span>
                <span v-show="scope.row.operationStatus === 2">支付失败</span>
              </template>
            </el-table-column>
            <el-table-column prop="creator" label="操作人"></el-table-column>
            <el-table-column label="支付方式">
              <template slot-scope="scope">
              <span v-if="scope.row.operationStatus !== 0">
                <span v-if="scope.row.rechargeType === 'wxpay'">微信</span>
                <span v-else-if="scope.row.rechargeType === 'alipay'">支付宝</span>
                <span v-else>线下</span>
              </span>
                <span v-else>
                未支付
              </span>
              </template>
            </el-table-column>
          </template>
          <template v-if="type == 1">
            <el-table-column prop="operationTime"   label="消费时间">
            </el-table-column>
            <el-table-column prop="money" label="消费金额"></el-table-column>
            <el-table-column label="消费类型">
              <template slot-scope="scope">
                <span v-if="scope.row.feeType == 2">短信扣费</span>
                <span v-else-if="scope.row.feeType == 3">查快递扣费</span>
                <span v-else-if="scope.row.feeType == 4">OCR费用</span>
              </template>
            </el-table-column>
          </template>
        </el-table>
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
          :current="current"
        ></ever-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { request } from '@/util/req'
import list from '@/util/list'
import globalUrlMap from '@/login/store/globalurls'

export default {
  mixins: [list],
  props: ['id', 'type'],
  data () {
    return {
      tableData: [],
      loading: false,
      activeName: 'first',
      minDate: null,
      api: {list: this.getRecordList},
      queryObj: {
        operationStatus: 1,
        type: this.type,
        tenantId: this.id,
      },
      notUseQuery: true,
      tenantName: '',
    }
  },
  methods: {
    getRecordList (params) {
      return request(globalUrlMap.account.getAccountBillPageList, params, 'post').then(res => {
        return res.data
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .label-text{
    font-size: 14px;
    color: #999;
    display: inline-block;
  }
  .list-title{
    height: 42px;
    background: #fff;
    line-height: 42px;
    padding-left: 30px;
    font-size: 14px;
    position: relative;
    border-bottom: solid 1px #DADCE0;
    &:after{
      content: '';
      display: block;
      height: 14px;
      width: 3px;
      background: #1C7BEF;
      position: absolute;
      left: 19px;
      top: 14px;
    }
  }
  .about-info-box{
    height: 64px;
    margin: 0 0 0px;
    background: #fff;
    overflow: hidden;
    padding: 20px;
    font-size: 14px;
    box-sizing: border-box;
    position: relative;
    &::after{
      content: '';
      display: block;
      height: 10px;
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
      background:#ebedef;
    }
    .customer-name{
      margin: 0 0 15px;
    }
    .money-info{
      .money-about{
        div{
          display: inline-block;
        }
        .money-text{
          font-size: 24px;
          color: #ee4433;
        }
        .money-btn{
          margin-left: 20px;
          vertical-align: top;
        }
        margin-bottom: 5px;
      }
      .money-tip{
        color: #EE4433;
        i{
          margin-right: 5px;
          position: relative;
          top: 1px;
        }
      }
    }

  }
  .list-box{
    .list-box-inner{
    }
  }
  .layout_inner{
    display: inline-block;
    padding: 0;
  }
  .sms-price{
    margin-bottom: 20px;
    font-size: 14px;
  }
  .title-text-box{
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    background: #F0F5FA;
    box-sizing: border-box;
    padding: 0 5px;
    margin-bottom: 15px;
  }
  .layout_inner .recharge-form /deep/ .el-form-item__content{
    margin-left: 0 !important;
  }
</style>
