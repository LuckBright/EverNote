<template>
  <div>
    <el-row class="title">
      <el-col :span="22">
        <span class="name">账户信息</span>
      </el-col>
      <el-col v-if="!isEdit" :span="2" align="right">
        <el-button type="text" @click="toEdit">
          <i class="el-icon-edit"></i> 编辑
        </el-button>
      </el-col>
    </el-row>
    <el-row v-if="!isEdit" class="table">
      <el-col v-if="userCardArr.length === 0" class="noCnt">暂未储值</el-col>
      <el-col v-else :span="3" v-for="(item, index) in userCardArr" :key="index">
        <div class="goldCard ml20">
          <div class="fontType" style="padding-top:40px;">预存卡:{{item.storedMoney+item.givedMoney}}</div>
          <!-- <div class="fontType" style="padding-top:20px;"></div> -->
        </div>
      </el-col>
    </el-row>
    <el-row v-else class="mgt15">
      <el-col :span="1" style="text-align:center;">
        <div style="margin-top:10px;">储值卡</div>
      </el-col>
      <el-col :span="6">
        <ever-number v-model="obj.money" number-type="number"></ever-number>
      </el-col>
      <el-col :span="15"></el-col>
    </el-row>
    <el-row v-if="isEdit" class="footer">
      <el-button type="primary" @click="append">确定</el-button>
      <el-button @click="cancle">取消</el-button>
    </el-row>
    <el-row class="title flow">
      <el-col :span="24">
        <span class="name">储值流水</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table :data="tableData" border align="center" style="width: 80%" min-height="300">
          <el-table-column width="80" prop type="index" label="序号" align="center"></el-table-column>
          <el-table-column align="center" prop="createTime" label="时间"></el-table-column>
          <el-table-column align="center" prop="changeType" label="交易类型" :formatter="formatTransaction"> </el-table-column>
          <el-table-column align="center" prop="chargeStatement" label="支付流水"></el-table-column>
          <el-table-column align="center" prop="usePatientName" label="消费人">
            <template slot-scope="scope">{{scope.row.usePatientName?scope.row.usePatientName:'--'}}</template>
          </el-table-column>
          <el-table-column align="center" prop="changeStoredMoney" label="交易金额"></el-table-column>
          <el-table-column align="center" prop="newStoredMoney" label="账户余额">
            <template slot-scope="scope">{{scope.row.newGivedMoney+scope.row.newStoredMoney}}</template>
          </el-table-column>
        </el-table>
        <ever-pagination
          style="width: 80%"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
          :current="current"
        ></ever-pagination>
      </el-col>
    </el-row>
    <paymethodstwo :dialogVisible.sync="paydialogVisible" :obj="payObj" @payStatus="paySuccess"></paymethodstwo>
  </div>
</template>
<script>
import mapi from '@/crm/store/integralapi'
import api from '@/crm/store/giftapi'
import list from '@/util/list'
export default {
  mixins: [list],
  data () {
    return {
      api,
      listApiName: 'getcardStatement',
      mapi,
      isEdit: false,
      userCardArr: [],
      patientId: this.$route.params.patientId,
      paydialogVisible: false,
      obj: {},
      payObj: {
        payType: 3
      },
      queryObj: {}
    }
  },
  created () {
    this.getCard()
  },
  methods: {
    getCard () {
      mapi.getCard({ 'patientId': this.patientId }).then(rs => {
        if (rs.head.errCode === 0) {
          this.userCardArr = rs.data ? [rs.data] : []
          if (rs && rs.data && rs.data.id) {
            this.queryObj.cardId = rs.data.id
            this.list(true)
          }
        }
      })
    },
    toEdit () {
      this.isEdit = true
    },
    cancle () {
      this.isEdit = false
    },
    append () {
      this.obj.patientId = this.patientId
      let request = this.mapi.createPay
      request(this.obj).then(rs => {
        if (rs.head.errCode === 0) {
          console.log('rs: ', rs)
          this.payObj['unexefee'] = rs.data.money
          this.payObj['id'] = rs.data.settlementBillId
          this.payObj['settleCode'] = rs.data.settleCode
          this.payObj['patientid'] = rs.data.patientId
          this.payObj['paymethodArr'] = []
          this.payObj['isRefund'] = false
          this.paydialogVisible = true
        }
      })
    },
    paySuccess () {
      this.paydialogVisible = false
      this.isEdit = false
      this.getCard()
    }
  }
}
</script>
<style lang="scss" scoped>
.footer {
  margin: 10px 0px 0px 10px;
}
.noCnt {
  height: 200px;
  font-size: 20px;
}
.goldCard {
  height: 100px;
  width: 178px;
  background-image: linear-gradient(-135deg, #231815 0%, #433727 100%);
  border-radius: 8px;
}
.mgt15 {
  margin-top: 15px;
}
.fontType {
  font-size: 16px;
  color: #e3dac7;
  letter-spacing: 3px;
  text-align: center;
}
.title.flow {
  margin-top: 20px;
}
</style>
