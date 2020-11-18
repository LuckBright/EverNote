<template>
  <div class="patient_card setHover">
    <!-- 身份卡 -->
    <div class="patient_benefit patient_icon patient_benefit_icon" v-show="obj.cardStatus === 2">
      <el-table :data="benefitCardArr" style="width: 100%">
        <el-table-column label="选择" width="60" align="center">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.benefitchecked"
              @change="benefitCardArrSelectionChange(scope.row, scope.$index, scope.row.benefitchecked)"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="benefit.name" label="名称" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="endDate" label="有效期" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="benefit.discount" label="折扣" align="center"></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="benefit.overlayGiftcard"
          label="是否和优惠券同时使用"
          align="center"
        >
          <template slot-scope="scope">{{ scope.row.benefit.overlayGiftcard === 1 ? '是' : '否'}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="benefit.overlayMemberCard"
          label="是否和储蓄卡同时使用"
          align="center"
        >
          <template slot-scope="scope">{{ scope.row.benefit.overlayMemberCard === 1 ? '是' : '否'}}</template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 优惠券 -->
    <div class="patient_gift patient_icon patient_gift_icon" v-show="obj.cardStatus === 3">
      <el-row>
        <el-col :sm="12" :md="8" :lg="6" v-for="(item,i) in giftCardArr" :key="i">
          <!-- giftcard_item_active:选中， giftcard_item1:,giftcard_item2:不可用,giftcard_item3:-->
          <div
            class="giftcard_item"
            :class="{ 'giftcard_item1': item.giftBatch.type === '3' , 'giftcard_item3': item.giftBatch.type === '2' , 'giftcard_item_active': item.itemclass, 'giftcard_item2': item.unableclass}"
            @click="giftcardSelect(item, i)"
          >
            <div class="gift_num">
              <span class="giftcard_icon">￥</span>
              <span class="giftcard_money">{{item.giftBatch.money}}</span>
            </div>
            <div class="giftcard_con">{{giftcardStr[item.giftBatch.type]}} {{item.giftBatch.name}}</div>
            <div
              class="giftcard_date"
            >{{dateformate(item.giftBatch.useStartTime)}}-{{dateformate(item.giftBatch.useEndTime)}}</div>
            <i class="iconfont icon-Selected"></i>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 储值卡 -->
    <div class="patient_member patient_icon" v-show="obj.cardStatus === 1">
      <el-table :data="userCardArr">
        <el-table-column label="选择" width="60" align="center">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.userchecked"
              @change="userCardArrSelectionChange(scope.row, scope.$index, scope.row.userchecked)"
              :disabled="scope.row.canuserselect"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="memberCardBatch.name"
          label="名称"
          align="center"
        ></el-table-column>
        <el-table-column show-overflow-tooltip label="类型" align="center">
          <template slot-scope="scope">{{ scope.row.memberCardBatch.type === 1 ? '储值卡' : '打折卡' }}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="endDate" label="有效期" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="storedMoney" label="可用余额" align="right">
          <template slot-scope="scope">{{scope.row.storedMoney | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="givedMoney" label="可用点卡" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip label="可用共享金额" align="right">
          <template
            slot-scope="scope"
          >{{ (scope.row.memberCardShare ? (scope.row.memberCardShare.maxShareMoney - scope.row.memberCardShare.usedShareMoney || 0) : '') | formatToFinacial}}</template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 活动 -->
    <div class="patient_member patient_icon" v-show="obj.cardStatus === 4">
      <el-table :data="activeArr">
        <el-table-column label="选择" width="60" align="center">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.activechecked"
              @change="activeCardArrSelectionChange(scope.row, scope.$index, scope.row.activechecked)"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="name" label="名称" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="startDate" label="活动开始时间" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="endDate" label="活动结束时间" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="discount" label="活动折扣(%)" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.discount">{{`${scope.row.discount}%`}}</span>
            <span v-if="scope.row.discountRuleName">{{`${scope.row.discountRuleName}`}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="saleMoney" label="活动金额(元)" align="right">
          <template slot-scope="scope">
            <span v-if="scope.row.saleMoney">{{scope.row.saleMoney | formatToFinacial}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="remarks" label="备注" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remarks" v-if="scope.row.remark&&scope.row.activechecked"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getBestBenfit, getAllMarketInfoByPatientIdAndDpt } from '@/rcm/store/outpatient/outpatient'
export default {
  props: ['obj', 'reset'],
  data () {
    return {
      objId: this.$route.query.patientId,
      giftCardArr: [],
      userCardArr: [],
      benefitCardArr: [],
      activeArr: [],
      activeStatus: '',
      giftcardStr: {
        1: '满减券',
        2: '立减券',
        3: '体验券'
      },
      status: this.$route.query.status
    }
  },
  methods: {
    dateformate (str) {
      return str.substring(0, 10).replace(/-/g, '/')
    },
    giftcardSelect (val, i) {
      // giftcard_item_active:选中，item.itemclass
      // giftcard_item1:满减,item.giftBatch.type === '3'
      // giftcard_item2:立减,item.unableclass
      // giftcard_item3:体验券 item.giftBatch.type === '2'
      // 优惠券选择
      var that = this
      if (that.giftCardArr[i].itemclass) {
        that.obj.details && that.obj.details.settlementCouponDet && that.obj.details.settlementCouponDet.forEach(function (item, index) {
          if (val.id === item.id) {
            that.obj.details && that.obj.details.settlementCouponDet && that.obj.details.settlementCouponDet.splice(index, 1)
          }
        })
        that.giftCardArr[i].itemclass = false
        if (that.giftCardArr[i].giftBatch.type === 1) {
          that.giftCardArr.forEach(function (v) {
            v.unableclass = false
          })
        } else if (that.giftCardArr[i].giftBatch.type === 2) {
          if (that.obj.details && that.obj.details.settlementCouponDet && that.obj.details.settlementCouponDet.length === 0) {
            that.giftCardArr.forEach(function (v) {
              v.unableclass = false
            })
          }
        } else if (that.giftCardArr[i].giftBatch.type === 3) {
          if (that.obj.details && that.obj.details.settlementCouponDet && that.obj.details.settlementCouponDet.length === 0) {
            that.giftCardArr.forEach(function (v) {
              v.unableclass = false
            })
          }
        }
      } else {
        if (val.giftBatch.type === '1') {
          that.obj.details.settlementCouponDet = []
          that.giftCardArr.forEach(function (item, index) {
            if (index === i) {
              item.itemclass = true
              item.unableclass = false
            } else {
              item.itemclass = false
              item.unableclass = true
            }
          })
          that.obj.details && that.obj.details.settlementCouponDet && that.obj.details.settlementCouponDet.push(val)
        } else if (val.giftBatch.type === '2') {
          that.obj && that.obj.details && that.obj.details.settlementCouponDet && that.obj.details.settlementCouponDet.forEach(function (item, index) {
            if (item.giftBatch.type !== '2') {
              that.obj.details && that.obj.details.settlementCouponDet && that.obj.details.settlementCouponDet.splice(index, 1)
            }
          })
          that.giftCardArr.forEach(function (v, k) {
            if (k === i) {
              v.itemclass = true
            }
            if (v.giftBatch.type === '2') {
              v.unableclass = false
            } else {
              v.itemclass = false
              v.unableclass = true
            }
          })
          that.obj.details && that.obj.details.settlementCouponDet && that.obj.details.settlementCouponDet.push(val)
        } else if (val.giftBatch.type === '3') {
          that.giftCardArr.forEach(function (value, key) {
            if (that.giftCardArr[i].giftBatch.overlay === 1) {
              that.obj.details && that.obj.details.settlementCouponDet && that.obj.details.settlementCouponDet.forEach(function (
                item,
                index
              ) {
                if (
                  item.giftBatch.type !== '3' ||
                  (item.giftBatch.type === '3' && !item.giftBatch.overlay)
                ) {
                  that.obj.details && that.obj.details.settlementCouponDet && that.obj.details.settlementCouponDet.splice(index, 1)
                }
              })
              if (key === i) {
                value.itemclass = true
              }
              if (value.giftBatch.type === '3' && value.giftBatch.overlay === 1) {
                value.unableclass = false
              } else {
                value.itemclass = false
                value.unableclass = true
              }
            } else {
              that.obj.details.settlementCouponDet = []
              if (key === i) {
                value.itemclass = true
                value.unableclass = false
              } else {
                value.itemclass = false
                value.unableclass = true
              }
            }
          })
          that.obj.details && that.obj.details.settlementCouponDet && that.obj.details.settlementCouponDet.push(val)
        }
      }
    },
    // 活动
    activeCardArrSelectionChange (val, index, checkstatus) {
      let that = this
      that.obj.details.settlementPromotion = []
      if (!checkstatus) {
        val.activechecked = false
      } else {
        val.promotionId = val.id
        that.obj.details.settlementPromotion.push(val)
        that.activeArr.forEach(function (v, i) {
          v.activechecked = false
          if (i === index) {
            v.activechecked = true
          } else {
          }
        })
      }
    },
    userCardArrSelectionChange (val, index, checkstatus) {
      // 会员卡储值卡 选择
      let that = this
      that.obj.details.settlementCouponDet && that.obj.details.settlementCouponDet.forEach(function (item) {
        if (item.giftBatch.type !== '3') {
          that.$message({
            message: '储值卡不能和满减券、立减券同时使用',
            type: 'warning'
          })
          return false
        }
      })
      that.obj.details.settlementMemberDet = []
      if (!checkstatus) {
        // that.obj.details.settlementMemberDet = []
        val.userchecked = false
        val.canuserselect = false
      } else {
        val.memberCardID = val.id
        val.type = val.memberCardBatch.type
        that.obj.details.settlementMemberDet.push(val)
        that.userCardArr.forEach(function (v, i) {
          v.userchecked = false
          if (i === index) {
            v.userchecked = true
          }
        })
      }
    },
    benefitCardArrSelectionChange (val, index, checkstatus) {
      // 身份卡选择
      let that = this
      that.benefitCardArr.forEach(function (v, i) {
        v.benefitchecked = false
        if (i === index) {
          v.benefitchecked = true
        }
      })
      that.obj.details.settlementBenefitDet = []
      if (!checkstatus) {
        val.benefitchecked = false
        if (that.userCardArr.length !== 0) {
          that.obj.memberCardStatus = false
        }
        if (that.giftCardArr.length !== 0) {
          that.obj.giftCardStatus = false
        }
      } else {
        if (val.benefit.overlayGiftcard === 0) {
          // 身份卡 优惠券 使用判断
          if (
            that.obj.details.settlementCouponDet &&
            that.obj.details.settlementCouponDet.length > 0
          ) {
            that.$message({
              message: '本身份卡不能和优惠券同时使用',
              type: 'warning'
            })
            return false
          } else {
            that.obj.giftCardStatus = true
          }
        }
        if (val.benefit.overlayMemberCard === 0) {
          // 身份卡 储值卡 使用判断
          if (
            that.obj.details.settlementMemberDet &&
            that.obj.details.settlementMemberDet.length > 0
          ) {
            that.$message({
              message: '本身份卡不能和储值卡同时使用',
              type: 'warning'
            })
            return false
          } else {
            that.obj.memberCardStatus = true
          }
        }
        val.name = val.benefit.name
        val.validPeriod = val.benefit.validPeriod
        val.discount = val.benefit.discount
        val.overlayGiftcard = val.benefit.overlayGiftcard
        val.overlayMemberCard = val.benefit.overlayMemberCard
        val.serviceIds = val.benefit.serviceIds
        that.obj.details.settlementBenefitDet.push(val)
      }
    },
    // 计算最优组合
    async computeBenfit () {
      this.computeBenfitLoading = true
      let params = {
        settleType: 1, // 结算类型 0 门诊，1住院
        patientId: this.$route.query.patientId, // 患者id
        deptId: this.obj.ipDept, // 科室id
        billDetails: this.obj.details.ipSettlementDetail,
        insuranceType: this.obj.insuranceType
      }
      try {
        let data = await getBestBenfit(params)
        if (data && data.data) {
          this.benfitfee = data.data.benefitFee
          let { type, index } = { ...data.data }
          switch (type) {
            case 0:
              // 活动
              this.activeCardArrSelectionChange(this.obj.benfitArr.activeArr && this.obj.benfitArr.activeArr[index], index, true)
              break
            case 1:
              // 身份卡
              this.benefitCardArrSelectionChange(this.obj.benfitArr.benefitCardArr && this.obj.benfitArr.benefitCardArr[index], index, true)
              break
            case 2:
              // 优惠券
              this.giftcardSelect(this.obj.benfitArr.giftCardArr && this.obj.benfitArr.giftCardArr[index], index)
              break
            case 3:
              // 会员卡
              this.userCardArrSelectionChange(this.obj.benfitArr.userCardArr && this.obj.benfitArr.userCardArr[index], index, true)
              break
            default:
              break
          }
        }
        this.computeBenfitLoading = false
      } catch (err) {
        this.computeBenfitLoading = false
      }
    },
    queryMarketInfo (flag) {
      let params = {
        patientId: this.$route.query.patientId, // 患者id
        dptrange: this.$route.query.providerId // 患者所在科室
      }
      if (!params.patientId || !params.dptrange) {
        return false
      }
      getAllMarketInfoByPatientIdAndDpt(params).then(res => {
        // 身份卡
        res.data.memberCard.forEach(function (v) {
          v.userchecked = false
        })
        this.userCardArr = res.data.memberCard
        this.obj.benfitArr.userCardArr = res.data.memberCard
        this.obj.memberCardStatus = !(this.userCardArr.length > 0)
        this.obj.memberCardLength = res.data.memberCard.length
        // 活动
        res.data.activity.forEach(function (v) {
          v.activechecked = false
        })
        this.activeArr = res.data.activity
        this.obj.benfitArr.activeArr = res.data.activity
        this.obj.activeCardStatus = !(this.activeArr.length > 0)
        this.obj.activeCardLength = res.data.activity.length
        // 储值卡
        res.data.giftcard.forEach(function (item) {
          item.itemclass = false
          item.unableclass = false
        })
        this.giftCardArr = res.data.giftcard
        this.obj.benfitArr.giftCardArr = res.data.giftcard
        this.obj.giftCardStatus = !(this.giftCardArr.length > 0)
        this.obj.giftCardLength = res.data.giftcard.length
        // 身份卡
        res.data.benefit.forEach(function (v) {
          v.benefitchecked = false
        })
        this.benefitCardArr = res.data.benefit
        this.obj.benfitArr.benefitCardArr = res.data.benefit
        this.obj.benefitCardStatus = !(this.benefitCardArr.length > 0)
        this.obj.benefitCardLength = res.data.benefit.length
        // 自动推荐最优组合
        if (flag) {
          if (res.data.memberCard || res.data.activity || res.data.giftcard || res.data.benefit) {
            this.computeBenfit()
          }
        }
      })
    },
  },
  created () {
    this.queryMarketInfo(true)
  },
  watch: {
    'reset': {
      handler: function (val, oldval) {
        if (!val) {
          return false
        }
        console.log('reset')
        // 身份卡
        this.benefitCardArr.map(v => (v.benefitchecked = false))
        this.obj.details.settlementBenefitDet = []
        // 优惠券
        this.giftCardArr.map(v => (v.itemclass = false))
        this.obj.details.settlementCouponDet = []
        // 活动
        this.activeArr.map(v => (v.activechecked = false))
        this.obj.details.settlementPromotion = []
        // 储值卡
        this.userCardArr.map(v => (v.userchecked = false))
        this.obj.details.settlementMemberDet = []
      }
    }
  }
}
</script>

<style type="text/css">
#app .el-main .setHover /deep/ .el-button.is-disabled:focus,
.el-button.is-disabled:hover,
.el-main .el-button.is-disabled {
  border-color: none;
  border-color: #fff;
}

.patient_card {
  position: relative;
}
.patient_card .el-table {
  margin: 0;
}
.giftcard_item {
  height: 140px;
  width: 220px;
  margin: 20px;
  background: url(../../../assets/img/giftbatch2.png) no-repeat 100% 100%;
  border-radius: 10px;
  overflow: hidden;
}
.giftcard_item3 {
  background-image: url(../../../assets/img/giftbatch4.png);
}
.giftcard_item1 {
  background-image: url(../../../assets/img/giftbatch1.png);
}
.giftcard_item2 {
  background-image: url(../../../assets/img/giftbatch3.png);
}
.gift_num {
  text-align: center;
  padding-top: 12px;
  color: #151515;
}
.gift_num .giftcard_icon {
  color: #fff;
  display: inline-block;
  font-size: 14px;
  line-height: 20px;
  border-radius: 50%;
  height: 20px;
  width: 20px;
  background: #009e8e;
  vertical-align: middle;
}
.giftcard_item3 .gift_num .giftcard_icon {
  background: #f36767;
}
.giftcard_item1 .gift_num .giftcard_icon {
  background: #bf9653;
}
.giftcard_item2 .gift_num .giftcard_icon {
  background: #ccc;
}
.gift_num .giftcard_money {
  display: inline-block;
  line-height: 52px;
  font-size: 48px;
  vertical-align: middle;
}
.giftcard_item2 .gift_num .giftcard_money {
  color: #ccc;
}
.giftcard_con {
  padding: 8px 0px 10px 20px;
  font-size: 14px;
  color: #000;
  height: 20px;
  line-height: 20px;
}
.giftcard_date {
  height: 38px;
  line-height: 38px;
  font-size: 12px;
  color: #fff;
  text-align: center;
}
.giftcard_item_active {
  border: 2px solid #1c7bef;
  margin: 18px;
  border-radius: 0;
  position: relative;
}
.giftcard_item_active .icon-Selected {
  font-size: 26px;
  position: absolute;
  height: 26px;
  width: 26px;
  right: 0;
  bottom: 0;
  color: #1c7bef;
}
</style>
