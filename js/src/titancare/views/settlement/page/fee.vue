<template>
  <div>
    <ever-bread-crumb name="退费详情" is-custom-back @back="close"></ever-bread-crumb>
    <div class="layout_inner f14">
      <!-- <p class="topClose">
        <span @click="close">&lt;&nbsp;&nbsp;返回</span>
      </p> -->
      <patientinfo :patientinfo="patientobj"></patientinfo>
      <p class="title">结算明细:</p>
      <div class="feedetail">
        <div class="feedetail_left"></div>
        <div class="feedetail_right">
          <!-- 药品 检查检验 -->
          <div class="min-box" v-for="(item,index) in recipeList" :key="index+'cf'">
            <div class="drug_left">
              <div
                class="status_box"
                v-if="item.refundUserApplyStatus === 2||item.refundUserApplyStatus === 3||item.refundUserApplyStatus === 4"
              >用户申请退款</div>
              <div class="drug_left_up" v-if="$route.query.settlementType !== 3 && $route.query.settlementType !== 5">
                <span>处方编号:</span>
                <span class="mr20">{{item.recipeCode}}</span>
                <span>开方时间:</span>
                <span class="mr20">{{item.recipeTime}}</span>
              </div>
              <div class="drug_left_down">
                <table class="table1">
                  <tr>
                    <th width="200">项目</th>
                    <th width="140">数量/单位</th>
                    <th width="48">单价</th>
                    <th width="48">折扣</th>
                    <th width="50">金额</th>
                    <th width="65">执行状态</th>
                  </tr>
                  <tr v-for="(k,index) in item.recipeItemList" :key="index+'_1'">
                    <td>{{k.itemName}}</td>
                    <td>{{k.quantity}}{{k.unit?'/'+k.unit:'次'}}</td>
                    <td>{{k.prePrice | formatToFinacial}}</td>
                    <td>{{toPercent(k.discount)}}</td>
                    <td>{{k.preFee | formatToFinacial}}</td>
                    <td>{{k.adviceStatusName}}</td>
                  </tr>
                  <tr>
                    <td>账单合计</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{{item.myFeeAfterBenefit | formatToFinacial}}</td>
                    <td></td>
                  </tr>
                </table>
              </div>
            </div>
            <div class="drug_right">
              <div>
                <el-button @click="goTo(item,'auto')">退款</el-button>
                <el-button
                  @click="goTo(item,'user')"
                  v-if="item.refundUserApplyStatus===2||item.refundUserApplyStatus===3||item.refundUserApplyStatus===4"
                >用户退款申请</el-button>
                <el-button @click="goTo(item,'history')">退款记录</el-button>
              </div>
            </div>
          </div>
          <!-- 优惠结算 -->
          <div
            class="min-box"
            v-if="alldata.ensurePlanName||alldata.promotionName||alldata.benefitcardName||alldata.giftcardName||alldata.membercardName"
          >
            <div class="drug_left">
              <div class="drug_left_up">优惠结算</div>
              <div class="drug_left_down">
                <div class="cut" v-if="alldata.ensurePlanName">
                  <div class="cut_left">保障计划/套餐</div>
                  <div class="cut_right">
                    <div>
                      <span>{{alldata.ensurePlanName}}</span>
                      <span>{{alldata.mealFee | formatToFinacial}}</span>
                    </div>
                  </div>
                </div>
                <div
                  class="cut"
                  v-if="alldata.promotionName||alldata.benefitcardName||alldata.giftcardName||alldata.membercardName"
                >
                  <div class="cut_left">活动优惠</div>
                  <div class="cut_right">
                    <div v-if="alldata.promotionName">
                      <span>{{alldata.promotionName}}</span>
                      <span>{{alldata.promotionFee | formatToFinacial}}</span>
                    </div>
                    <div v-if="alldata.benefitcardName">
                      <span>{{alldata.benefitcardName}}</span>
                      <span>{{alldata.benefitFee | formatToFinacial}}</span>
                    </div>
                    <div v-if="alldata.giftcardName">
                      <span>{{alldata.giftcardName}}</span>
                      <span>{{alldata.memberActCutFee | formatToFinacial}}</span>
                    </div>
                    <div v-if="alldata.membercardName">
                      <span>{{alldata.membercardName}}</span>
                      <span>{{alldata.memberGradeCutFee | formatToFinacial}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="drug_right"></div>
          </div>
          <!-- 快递费 -->
          <div class="min-box" v-if="kdfIhList[0]">
            <div class="drug_left">
              <div class="drug_left_up">
                <span>编号:</span>
                <span class="mr20">{{kdfIhList[0].recipeCode}}</span>
                <span>开方时间:</span>
                <span class="mr20">{{kdfIhList[0].recipeTime}}</span>
              </div>
              <div class="drug_left_down">
                <table class="table1">
                  <tr>
                    <th width="200">项目</th>
                    <th width="140">数量/单位</th>
                    <th width="48">单价</th>
                    <th width="48">折扣</th>
                    <th width="50">金额</th>
                    <th width="65">执行状态</th>
                  </tr>
                  <tr>
                    <td>快递费</td>
                    <td>{{kdfIhList[0].recipeItemList[0].quantity+'次'}}</td>
                    <td>{{'--'}}</td>
                    <td>{{toPercent(kdfIhList[0].recipeItemList[0].discount)}}</td>
                    <td>{{kdfIhList[0].recipeItemList[0].preFee | formatToFinacial}}</td>
                    <td>{{kdfIhList[0].recipeItemList[0].adviceStatus}}</td>
                  </tr>
                </table>
              </div>
            </div>
            <div class="drug_right">
              <div>
                <el-button @click="goTo(kdfIhList[0],'auto')">退款</el-button>
                <el-button
                  @click="goTo(kdfIhList[0],'user')"
                  v-if="kdfIhList[0].refundUserApplyStatus===2||kdfIhList[0].refundUserApplyStatus===3||kdfIhList[0].refundUserApplyStatus ===4"
                >用户退款申请</el-button>
                <el-button @click="goTo(kdfIhList[0],'history')">退款记录</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="totalfee">
        <span style="margin-left:119px">结算单合计</span>
        <span style="margin-left:396px">{{alldata.payedFee | formatToFinacial}}</span>
      </div>
      <div class="footer" v-if="ifshowallreject">
        <el-button type="warning" class="allno" @click="goTo(1,'allreject')">全部拒绝</el-button>
      </div>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="700px"
      height="500px"
      v-if="dialogVisible"
    >
      <autoFee
        v-if="chooseType === 'auto'"
        @getsuccess="getsuccess"
        :settlementIdobj="chooseobj"
        :orgId="orgId"
      ></autoFee>
      <userFee
        v-if="chooseType === 'user'"
        @getsuccess="getsuccess"
        :settlementIdobj="chooseobj"
        :orgId="orgId"
      ></userFee>
      <history v-if="chooseType === 'history'" @getsuccess="getsuccess"></history>
      <allreject v-if="chooseType === 'allreject'" @getsuccess="getsuccess"></allreject>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/titancare/api/settlement'
import autoFee from './auto-fee.vue'
import userFee from './user-fee.vue'
import allreject from './allreject.vue'
import history from './history.vue'
import patientinfo from './patientinfo.vue'
import storage from '@/util/storage'

export default {
  components: {
    autoFee,
    userFee,
    history,
    patientinfo,
    allreject
  },
  data () {
    return {
      storage,
      api,
      alldata: '',
      patientobj: '',
      recipeList: [],
      kdfIhList: [],
      orgId: '',
      dialogVisible: false,
      chooseobj: '',
      chooseType: '', // 控制显示弹窗种类
      title: '', // 弹窗title
      ifshowallreject: false
    }
  },
  mounted () {
    this.getOutpatientSettlementInfo()
  },
  methods: {
    // 显示百分比 如果是1 就为空  如果
    toPercent (point) {
      if (point === 1 || point === 0) {
        return ''
      }
      var str = Number(point * 100).toFixed()
      str += '%'
      return str
    },
    getOutpatientSettlementInfo () {
      this.api.getOutpatientSettlementInfo({ id: this.$route.query.id }).then(rs => {
        if (rs && rs.data) {
          this.patientobj = rs.data // 结算信息
          this.alldata = rs.data // 优惠券用
          this.recipeList = rs.data.recipeList || [] // 处方 检查检验
          this.kdfIhList = rs.data.kdfIhList || [] // 快递费
          this.orgId = rs.data.orgId
          this.ifshowallreject = rs.data.recipeList && rs.data.recipeList.find(item => item.refundUserApplyStatus === 2) // 列表中有用户申请退款的就显示全部退款按钮
        }
      })
    },
    goTo (val, type) {
      this.chooseType = type
      if (type === 'auto') {
        this.title = '客服退款'
        this.dialogVisible = true
        this.chooseobj = val
      } else if (type === 'user') {
        this.title = '退款申请'
        this.chooseobj = val
        this.dialogVisible = true
      } else if (type === 'history') {
        this.title = '退费记录'
        // this.$router.push({ path: '/titancare/graphic/refund/history', query: { settlementId: this.$route.query.id, recipeId: val.recipeId } })
        this.$router.push({ name: 'refundHistory', query: { settlementId: this.$route.query.id, recipeId: val.recipeId } })
      } else {
        // 全部拒绝
        this.title = '拒绝用户退款申请原因'
        this.dialogVisible = true
      }
    },
    getsuccess () {
      this.dialogVisible = false
      this.getOutpatientSettlementInfo()
    },
    close () {
      // let queryobj = JSON.parse(this.$route.query.queryobj)
      this.$router.push({ name: 'refund', query: { queryobj: this.$route.query.queryobj } })
    }
  }
}
</script>
<style lang='less' scoped>
.totalfee {
  background: #f0f5fa;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 7px;
}
.footer {
  text-align: center;
  .allno {
    margin: 20px;
  }
}
.status_box {
  background-color: #df912f;
  color: #ffffff;
  padding: 5px;
  width: 85px;
  border-radius: 4px;
  position: absolute;
  left: -118px;
  top: 0px;
}
.feedetail {
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  .feedetail_left {
    width: 120px;
    // > div {
    //   background-color: #df912f;
    //   // color: #333333;
    //   color: #ffffff;
    //   padding: 5px;
    //   width: 85px;
    //   border-radius: 4px;
    // }
  }
  .feedetail_right {
    flex: 1;
    .min-box {
      border-bottom: 1px solid #999999;
      padding-bottom: 10px;
      // padding-top: 10px;
      display: flex;
      .drug_left {
        width: 700px;
        padding: 5px;
        position: relative;
        .drug_left_up {
          font-size: 14px;
          color: #999999;
        }
        .drug_left_down {
          font-size: 14px;
          color: #333333;
          .cut {
            margin-top: 10px;
            .cut_left {
              display: inline-block;
              width: 100px;
              vertical-align: top;
              margin-right: 23px;
            }
            .cut_right {
              display: inline-block;
              vertical-align: top;
              width: 500px;
              > div {
                margin-bottom: 6px;
                span:nth-of-type(1) {
                  display: inline-block;
                  width: 100px;
                }
                span:nth-of-type(2) {
                  display: inline-block;
                  width: 100px;
                  margin-left: 179px;
                }
              }
            }
          }
          .table1 {
            margin-top: 10px;
            text-align: left;
            width: 600px;
            th {
              padding: 7px 7px 7px 0px;
            }
            tr {
              td {
                padding: 3px 3px 3px 0px;
              }
            }
            tr:last-child {
              td {
                padding: 7px 7px 7px 0px;
              }
            }
          }
        }
      }
      .drug_right {
        position: relative;
        flex: 1;
        > div {
          position: absolute;
          bottom: 0px;
        }
      }
    }
  }
}
// .mgl {
//   margin-left: 30px;
// }
// .mr20 {
//   margin-right: 20px;
// }
.title {
  color: #606266;
}
// .layout_inner {
//   padding: 20px;
//   margin-right: 20px;
//   background: #fff;
//   border-radius: 4px;
//   box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
// }
// .container1 {
//   font-size: 14px;
//   line-height: 14px;
//   margin-top: none;
//   // .topClose {
//   //   color: #666;
//   //   margin: 0;
//   //   span {
//   //     cursor: pointer;
//   //   }
//   //   &:hover {
//   //     color: #1c7bef;
//   //   }
//   // }
//   // .patient-info {
//   //   margin-top: 20px;
//   //   padding: 15px;
//   //   background: #f0f5fa;
//   //   span {
//   //     display: inline-block;
//   //   }
//   //   .label-info {
//   //     padding-top: 10px;
//   //     padding-bottom: 10px;
//   //     color: #999;
//   //   }
//   //   .value-info {
//   //     padding-top: 10px;
//   //     padding-bottom: 10px;
//   //     color: #333;
//   //     margin-right: 20px;
//   //   }
//   // }
// }
</style>
