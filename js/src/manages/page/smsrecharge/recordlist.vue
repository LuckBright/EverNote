<template>
  <div class="layout_inner">
    <ever-bread-crumb name="充值记录"  :showTitle="true"></ever-bread-crumb>
    <div class="about-info-box">
      <div class="customer-name">
        <div class="label-text">客户名称：</div>
        {{ queryObj.tenantName }}
      </div>
    </div>
    <div class="list-box">
      <div class="list-title">
        充值记录
      </div>
      <div class="list-box-inner">
        <div>
          <el-table :data="tableData" v-loading="loading">
            <el-table-column prop="orderId" label="订单号"></el-table-column>
            <el-table-column prop="updateTime" label="充值时间">
            </el-table-column>
            <el-table-column prop="money" label="充值金额"></el-table-column>
            <el-table-column prop="creator" label="操作人"></el-table-column>
            <el-table-column  label="支付方式">
              <template slot-scope="scope">
                {{scope.row.rechargeType === 'alipay' ? '支付宝' : '微信'}}
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
    </div>
  </div>
</template>
<script>
import { request } from '@/util/req'
import list from '@/util/list'
export default {
  mixins: [list],
  data () {
    return {
      tableData: [],
      loading: false,
      activeName: 'first',
      minDate: null,
      api: {list: this.getRecordList},
      queryObj: {
        operationStatus: 1,
        type: 0,
        tenantId: this.$route.query.tenantId,
        tenantName: this.$route.query.tenantName
      },
      notUseQuery: true,
      tenantName: ''
    }
  },
  created () {
  },
  methods: {
    getRecordList (params) {
      return request({ url: '/msg/account/accountBill/getPageList', isStatic: false }, params, 'post').then(res => {
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
    background: #F8F8F8;
    .list-box-inner{
      padding: 20px;
    }
  }
  .layout_inner{
    display: inline-block;
    background: #ebedef;
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
