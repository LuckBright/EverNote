<template>
  <div class="address-box">
    <div>
      <div class="address-body">
        <p>
          <span class="lable-span">收货地址：</span>
          <b>{{values.province ? values.province : '---' }}</b>
          <b>{{values.city ? values.city : '---' }}</b>
          <b>{{values.county ? values.county : '---' }}</b>
          <b>{{values.addressDetail ? values.addressDetail : '---' }}</b>
        </p>
        <p>
          <span class="lable-span">收件姓名：</span>
          <b>{{values.name ? values.name : '---'}}</b>
        </p>
        <p>
          <span class="lable-span">手机号码：</span>
          <b>{{values.mobile ? values.mobile : '---'}}</b>
        </p>
      </div>
      <div>
        <div v-for="item in list" :key="item.id">
          <span class="expressNumber">
            <span class="lable-span">快递单号：</span>
            <b>{{item.expressNumber}}</b>
          </span>
          <span>
            <span class="lable-span">快递公司：</span>
            <b>{{item.expressComName}}</b>
          </span>
          <el-button class="tip-btn" @click="seeAddress(item)">查看物流</el-button>
        </div>
      </div>
    </div>
    <el-dialog title="物流进程" :visible.sync="dialogVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in details"
          :key="index"
          :timestamp="item.ftime"
        >{{item.context}}</el-timeline-item>
      </el-timeline>
      <!-- <span slot="footer" class="dialog-footer"></span> -->
    </el-dialog>
  </div>
</template>
<script>
import api from '@/titancare/api/orderdetail/index.js'
export default {
  props: ['values', 'list'],
  data () {
    return {
      api,
      dialogVisible: false,
      details: [],
      addressList: []
    }
  },
  methods: {
    seeAddress (item) {
      let params = { com: item.expressComCode, num: item.expressNumber }
      api.query(params).then(res => {
        if (!res.errCode) {
          this.dialogVisible = true
          this.details = res.data
        } else {
          this.$notify({
            title: '提示',
            message: '暂未查到物流信息',
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>
<style lang='less' scoped>
.address-box {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  .expressNumber {
    display: inline-block;
    width: 300px;
  }
  .lable-span {
    font-size: 14px;
    color: #999;
    line-height: 28px;
  }
  .tip-btn {
    width: 92px;
    height: 24px;
    line-height: 3px;
    font-size: 12px;
    color: #1c7bef;
    background: #fff;
    border: 1px solid #1c7bef;
    border-radius: 2px;
    margin-top: 3px;
    margin-left: 10px;
  }
  .address-body {
    width: 485px;
    padding: 10px 20px;
    background: #ffffff;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
  /deep/ .el-dialog .el-timeline-item__wrapper {
    line-height: 20px;
  }
}
</style>
