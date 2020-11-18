<template>
	<div class="patient_card setHover">
    <div class="patient_member patient_icon" v-bind:class="{patient_icon_1: !(obj.comInvChecked === 'true') && !obj.medInv}" v-show="obj.cardStatus === 1">
      <el-table
        :data="userCardArr">
        <el-table-column
          label="选择"
          width="60"
          align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.userchecked" @change="userCardArrSelectionChange(scope.row, scope.$index, scope.row.userchecked)" :disabled="scope.row.canuserselect"></el-checkbox>
          </template>
          </el-table-column>
        <el-table-column show-overflow-tooltip
          prop="memberCardBatch.name"
          label="名称"
          align="center">
        </el-table-column>
        <el-table-column show-overflow-tooltip
          label="类型"
          align="center">
          <template slot-scope="scope">
            {{ scope.row.memberCardBatch.type === 1 ? '储值卡' : '打折卡' }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip
          prop="endDate"
          label="有效期"
          align="center">
        </el-table-column>
        <el-table-column show-overflow-tooltip
          prop="storedMoney"
          label="可用余额"
          align="center">
        </el-table-column>
        <el-table-column show-overflow-tooltip
          prop="givedMoney"
          label="可用点卡"
          align="center">
        </el-table-column>
        <el-table-column show-overflow-tooltip
          label="可用共享金额"
          align="center">
          <template slot-scope="scope">
            {{ scope.row.memberCardShare ? (scope.row.memberCardShare.maxShareMoney - scope.row.memberCardShare.usedShareMoney || 0) : '' }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="patient_benefit patient_icon patient_benefit_icon" v-bind:class="{patient_icon_2: !(obj.comInvChecked === 'true') && !obj.medInv}" v-show="obj.cardStatus === 2">
      <el-table
      :data="benefitCardArr"
      style="width: 100%">
        <el-table-column
        label="选择"
        width="60"
        align="center">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.benefitchecked" @change="benefitCardArrSelectionChange(scope.row, scope.$index, scope.row.benefitchecked)"></el-checkbox>
        </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip
          prop="benefit.name"
          label="名称"
          align="center">
        </el-table-column>
        <el-table-column show-overflow-tooltip
          prop="endDate"
          label="有效期"
          align="center">
        </el-table-column>
        <el-table-column show-overflow-tooltip
          prop="benefit.discount"
          label="单一折扣"
          align="center">
        </el-table-column>
        <el-table-column show-overflow-tooltip
          label="折扣规则"
          align="center">
          <template slot-scope="scope">
          {{obj.selftariffsObj[scope.row.benefit.discountRule]}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip
          prop="benefit.overlayGiftcard"
          label="是否和优惠券同时使用"
          align="center">
          <template slot-scope="scope">{{ scope.row.benefit && (scope.row.benefit.overlayGiftcard === 1 ? '是' : '否')}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip
          prop="benefit.overlayMemberCard"
          label="是否和储蓄卡同时使用"
          align="center">
          <template slot-scope="scope">{{scope.row.benefit && (scope.row.benefit.overlayMemberCard === 1 ? '是' : '否')}}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="patient_gift patient_icon patient_gift_icon" v-bind:class="{patient_icon_3: !(obj.comInvChecked === 'true') && !obj.medInv}" v-show="obj.cardStatus === 3">
      <el-row>
        <el-col :sm="12" :md="8" :lg="6" v-for="(item,i) in giftCardArr" :key="i">
          <div class="giftcard_item" v-bind:class="{ giftcard_item1: item.giftBatch.type === 3 , giftcard_item3: item.giftBatch.type === 2 , giftcard_item_active: item.itemclass, giftcard_item2: item.unableclass}" @click="giftcardSelect(item, i)">
            <div class="gift_num">
              <span class="giftcard_icon">￥</span>
              <span class="giftcard_money">{{item.giftBatch.money}}</span>
            </div>
            <div class="giftcard_con">
              {{giftcardStr[item.giftBatch.type]}} {{item.giftBatch.name}}
            </div>
            <div class="giftcard_date">
              {{dateformate(item.giftBatch.useStartTime)}}-{{dateformate(item.giftBatch.useEndTime)}}
            </div>
            <i class="iconfont icon-Selected"></i>
          </div>
        </el-col>
      </el-row>
    </div>
	</div>
</template>
<script>
import api from '../../workspace/store/useraccountapi'
import selftariffsapi from '@/rcm/store/tariffs/selftariffsapi'
export default {
  props: ['obj'],
  data () {
    return {
      api,
      objId: this.$route.query.pid,
      giftCardArr: [],
      userCardArr: [],
      benefitCardArr: [],
      activeStatus: '',
      giftcardStr: {
        1: '满减券',
        2: '立减券',
        3: '体验券'
      }
    }
  },
  methods: {
    dateformate (str) {
      return str.substring(0, 10).replace(/-/g, '/')
    },
    giftcardSelect (val, i) {
      // 优惠券选择
      var that = this
      if (that.giftCardArr[i].itemclass) {
        that.obj.details.settlementCouponDet.forEach(function (item, index) {
          if (val.id === item.id) {
            that.obj.details.settlementCouponDet.splice(index, 1)
          }
        })
        that.giftCardArr[i].itemclass = false
        if (that.giftCardArr[i].giftBatch.type === 1) {
          that.giftCardArr.forEach(function (v) {
            v.unableclass = false
          })
        } else if (that.giftCardArr[i].giftBatch.type === 2) {
          if (that.obj.details.settlementCouponDet.length === 0) {
            that.giftCardArr.forEach(function (v) {
              v.unableclass = false
            })
          }
        } else if (that.giftCardArr[i].giftBatch.type === 3) {
          if (that.obj.details.settlementCouponDet.length === 0) {
            that.giftCardArr.forEach(function (v) {
              v.unableclass = false
            })
          }
        }
      } else {
        if (val.giftBatch.type === 1) {
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
          that.obj.details.settlementCouponDet.push(val)
        } else if (val.giftBatch.type === 2) {
          that.obj.details.settlementCouponDet.forEach(function (item, index) {
            if (item.giftBatch.type !== 2) {
              that.obj.details.settlementCouponDet.splice(index, 1)
            }
          })
          that.giftCardArr.forEach(function (v, k) {
            if (k === i) {
              v.itemclass = true
            }
            if (v.giftBatch.type === 2) {
              v.unableclass = false
            } else {
              v.itemclass = false
              v.unableclass = true
            }
          })
          that.obj.details.settlementCouponDet.push(val)
        } else if (val.giftBatch.type === 3) {
          that.giftCardArr.forEach(function (value, key) {
            if (that.giftCardArr[i].giftBatch.overlay === 1) {
              that.obj.details.settlementCouponDet.forEach(function (item, index) {
                if (item.giftBatch.type !== 3 || (item.giftBatch.type === 3 && !item.giftBatch.overlay)) {
                  that.obj.details.settlementCouponDet.splice(index, 1)
                }
              })
              if (key === i) {
                value.itemclass = true
              }
              if (value.giftBatch.type === 3 && value.giftBatch.overlay === 1) {
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
          that.obj.details.settlementCouponDet.push(val)
        }
      }
    },
    userCardArrSelectionChange (val, index, checkstatus) {
      // 会员卡储值卡 选择
      let that = this
      that.obj.details.settlementCouponDet.forEach(function (item) {
        if (item.giftBatch && item.giftBatch.type !== 3) {
          that.$message({
            message: '储值卡不能和满减券、立减券同时使用',
            type: 'warning'
          })
          return false
        }
      })
      that.obj.details.settlementMemberDet = []
      if (!checkstatus) {
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
          if (that.obj.details.settlementCouponDet && that.obj.details.settlementCouponDet.length > 0) {
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
          if (that.obj.details.settlementMemberDet && that.obj.details.settlementMemberDet.length > 0) {
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
        val.discountRule = val.benefit.discountRule
        val.overlayGiftcard = val.benefit.overlayGiftcard
        val.overlayMemberCard = val.benefit.overlayMemberCard
        val.serviceIds = val.benefit.serviceIds
        val.benefitId = val.id
        if (val.benefit.discountRule) {
          that.$emit('selectSelfTariffs', val.benefit.discountRule, val.benefit.serviceIds)
        } else if (val.benefit.discount || val.benefit.discount === 0) {
          that.$emit('selfdiscountassign', val.benefit.serviceIds, '', null, val.benefit.discount)
        }
        let valObj = Object.assign({}, val)
        delete valObj.benefit
        delete valObj.id
        that.obj.details.settlementBenefitDet.push(valObj)
      }
    },
    async getAllCard (v) {
      let that = this
      // if (v === '0' && that.obj.settlementid) {
      //   that.obj.benefitCardStatus = true
      //   that.obj.giftCardStatus = true
      //   that.obj.memberCardStatus = true
      // }
      let selfres = await selftariffsapi.list()
      if (selfres.head.errCode === 0) {
        selfres.data.forEach(function (item) {
          that.obj.selftariffsObj[item.id] = item.masterName
        })
        that.obj.selfTariffs = selfres.data
      }
      if (v === '0') {
        api.getRcmUserCard(this.objId).then(result => {
          // 会员卡 储值卡
          let that = this
          if (result.data && result.data.length > 0) {
            result.data.forEach(function (v) {
              v.userchecked = false
            })
            that.userCardArr = result.data
            that.obj.memberCardStatus = false
            that.obj.memberCardLength = result.data.length
          } else {
            that.userCardArr = []
            that.obj.memberCardStatus = true
            that.obj.memberCardLength = 0
          }
        })
        api.getRcmGiftCard(this.objId).then(result => {
          // 1 满减 2 立减 3 体验
          let that = this
          if (result.data) {
            result.data.forEach(function (item) {
              item.itemclass = false
              item.unableclass = false
            })
            that.giftCardArr = result.data
            that.obj.giftCardStatus = false
            that.obj.giftCardLength = result.data.length
          } else {
            that.giftCardArr = []
            that.obj.giftCardStatus = true
            that.obj.giftCardLength = 0
          }
        })
        api.getRcmBenefitCard(this.objId).then(result => {
          // 身份卡
          if (result.data) {
            result.data.forEach(function (v) {
              v.benefitchecked = false
            })
            that.benefitCardArr = result.data
            that.obj.benefitCardStatus = false
            that.obj.benefitCardLength = result.data.length
          } else {
            that.benefitCardArr = []
            that.obj.benefitCardStatus = true
            that.obj.benefitCardLength = 0
          }
        })
      }
    }
  },
  created () {
    let that = this
    that.getAllCard(that.$route.query.status)
  },
  watch: {
    '$route.query.status' (v) {
      this.getAllCard(v)
    },
    '$route.path' (v, n) {
      let that = this
      if (v !== n && that.obj.settlestatus === '0') {
        that.getAllCard(that.obj.settlestatus)
      }
    },
    'obj.salePolicy' (value) {
      let that = this
      that.benefitCardArr.forEach(function (v) {
        v.benefitchecked = false
      })
      that.userCardArr.forEach(function (v) {
        v.userchecked = false
        v.canuserselect = false
        if (value === 0) {
          if (v.memberCardBatch.type === 1) {
            v.canuserselect = true
          } else {
            v.canuserselect = false
          }
        }
      })
      that.giftCardArr.forEach(function (item) {
        item.itemclass = false
        item.unableclass = false
      })
    }
  }
}
</script>

<style type="text/css">
 #app .setHover /deep/ .el-button.is-disabled:focus, .el-button.is-disabled:hover, .el-main .el-button.is-disabled{
      border-color:none;
}
 #app .container .setHover /deep/ .el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover{
  border-color:#fff;
}

.patient_card { position: relative; }
.patient_card .el-table { margin: 0; }
.patient_gift_icon {
  border: 1px solid #ddd;
  max-height: 300px;
  min-height: 122px;
  overflow-y: auto;
  overflow-x: hidden;
}
.giftcard_item { height: 140px; width: 220px; margin: 20px; background: url(../../assets/img/giftbatch2.png) no-repeat 100% 100%;  border-radius: 10px; overflow: hidden; }
.giftcard_item3 { background-image: url(../../assets/img/giftbatch4.png); }
.giftcard_item1 { background-image: url(../../assets/img/giftbatch1.png); }
.giftcard_item2 { background-image: url(../../assets/img/giftbatch3.png); }
.gift_num { text-align: center; padding-top: 12px; color: #151515;}
.gift_num .giftcard_icon { color: #fff; display: inline-block; font-size: 14px; line-height: 20px; border-radius: 50%; height: 20px; width: 20px; background: #009E8E; vertical-align: middle; }
.giftcard_item3 .gift_num .giftcard_icon { background: #f36767; }
.giftcard_item1 .gift_num .giftcard_icon { background: #BF9653; }
.giftcard_item2 .gift_num .giftcard_icon { background: #ccc; }
.gift_num .giftcard_money { display: inline-block; line-height: 52px; font-size: 48px; vertical-align: middle; }
.giftcard_item2 .gift_num .giftcard_money { color: #ccc; }
.giftcard_con { padding: 8px 0px 10px 20px; font-size: 14px; color: #000; height: 20px; line-height: 20px; }
.giftcard_date { height: 38px; line-height: 38px; font-size: 12px; color: #fff; text-align: center;}
.giftcard_item_active { border: 2px solid #1C7BEF; margin: 18px; border-radius: 0; position: relative; }
.giftcard_item_active .icon-Selected { font-size: 26px; position: absolute; height: 26px; width: 26px; right:0; bottom: 0; color: #1C7BEF; }
</style>
