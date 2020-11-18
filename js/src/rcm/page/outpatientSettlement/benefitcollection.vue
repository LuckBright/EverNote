<template>
  <div class="benefitContainer">
    <div class="header">
      <div class="settle_title">
        优惠详情
        <i :class="{icon:true,iconfont:true,downArrow:true,'icon-shang':toggleBtn,'icon-xia':!toggleBtn}" @click="toggleBtn=!toggleBtn"></i>
      </div>
      <div class="recommendCom">
        <div class="bindgitcard">
          <el-input v-model="bindgitcardcode" placeholder="请输入优惠券码">
            <el-button class="bindgitcardbtn" slot="append" @click="bindgitcardFn">绑券</el-button>
          </el-input>
        </div>
        <div class="bindgitcard">
          <el-button type="primary" @click="getBestBenefit" :disabled="recommendDis">推荐组合</el-button>
        </div>
      </div>
    </div>
    <div class="footer" v-if="toggleBtn">
      <el-tabs ref="benefittab" v-model="activeName">
        <el-tab-pane label="用户管理" name="activitys">
          <template slot="label">
            活动
            <div class="hasSelected" v-if="obj.benefitInfo.promotionId"></div>
          </template>
          <template>
            <activitys ref="activitys" :data="benefitCollectObj.activityObj.tableData" @activityChanged="benefitChange"></activitys>
          </template>
        </el-tab-pane>
        <el-tab-pane label="储值卡" name="cards">
          <template slot="label">
            储值卡
            <div class="hasSelected" v-if="obj.benefitInfo.memberCardId"></div>
          </template>
          <cards ref="cards" :data="benefitCollectObj.cardsObj.tableData" @cards:changed="benefitChange"></cards>
        </el-tab-pane>
        <el-tab-pane label="角色管理" name="IDCard">
          <template slot="label">
            身份卡
            <div class="hasSelected" v-if="obj.benefitInfo.benefitCardId"></div>
          </template>
          <IDCard ref="idCard" :data="benefitCollectObj.IDcardObj.tableData" @idcards:changed="benefitChange"></IDCard>
        </el-tab-pane>
        <el-tab-pane label="定时任务补偿" name="benefitCard">
          <template slot="label">
            优惠券
            <div class="hasSelected" v-if="obj.benefitInfo.giftcardIds.length>0"></div>
          </template>
          <benefitCard ref="benefitCard" :data="benefitCollectObj.benefitCardObj.tableData"  @benefitcards:changed="benefitChange"></benefitCard>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!--优惠活动的总计-->
    <div class="totalCount" v-if="benefitDiscount>0">
      <template>
        <span class="itemName">金额抵用:￥</span>
        <span class="cRed">{{benefitDiscount|formatToFinacial}}</span>
      </template>
      <!--活动-->
      <template v-if="obj.benefitInfo.promotionId">
        <span class="general">{{`, 使用活动券${1}张，优惠￥`}}{{obj.benefitInfo.promotionFee|formatToFinacial}}元</span>
      </template>
      <!-- 储值卡 -->
      <template v-if="obj.benefitInfo.memberCardId">
        <span class="general">{{` | 使用储值卡${1}张，优惠￥`}}{{obj.benefitInfo.membergradecutfee|formatToFinacial}}元</span>
      </template>
      <!-- 身份卡  -->
      <template v-if="obj.benefitInfo.benefitCardId">
        <span class="general">{{` | 使用身份卡${1}张，优惠￥`}}{{obj.benefitInfo.benefitFee|formatToFinacial}}元</span>
      </template>
      <!-- 优惠卡  -->
      <template v-if="obj.benefitInfo.giftcardIds.length>0">
        <span class="general">{{` | 使用优惠卡${obj.benefitInfo.giftcardIds.length}张，优惠￥`}}{{obj.benefitInfo.memberactcutfee|formatToFinacial}}元</span>
      </template>
    </div>
  </div>
</template>
<script>
import {getAllMarketInfoByPatientIdAndDpt, getBestBenefit} from '@/rcm/store/outpatient/outpatient'
import bindApi from '@/workspace/store/useraccountapi'
import activitys from './activitys'
import cards from './cards'
import IDCard from './idcard'
import benefitCard from './benefitcard'
import insurancePrice from './computeinsunance.js'
export default {
  mixins: [insurancePrice],
  props: {
    obj: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      bindgitcardcode: '',
      toggleBtn: true,
      recommendDis: false,
      activeName: 'activitys',
      benefitCollectObj: {
        // 活动
        activityObj: {
          tableData: [],
          selectedArr: [] // 默认推荐
        },
        // 储值卡
        cardsObj: {
          tableData: [],
          selectedArr: [] // 默认推荐
        },
        // 身份卡
        IDcardObj: {
          tableData: [],
          selectedArr: [] // 默认推荐
        },
        // 优惠券
        benefitCardObj: {
          tableData: [],
          selectedArr: [] // 默认推荐
        },
      }
    }
  },
  computed: {
    'benefitDiscount': function () {
      return this.obj.benefitInfo.promotionFee + this.obj.benefitInfo.membergradecutfee + this.obj.benefitInfo.benefitFee + this.obj.benefitInfo.memberactcutfee
    }
  },
  watch: {
    '$route.query.patientId': {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.queryMarketInfo()
        }
      },
      immediate: true
    }
  },
  components: {
    activitys,
    cards,
    IDCard,
    benefitCard
  },
  methods: {
    bindgitcardFn () {
      if (this.bindgitcardcode) {
        bindApi.bind({
          code: this.bindgitcardcode,
          patientId: this.$route.query.patientId
        }).then(result => {
          if (result.head.errCode === 0) {
            this.$messageTips(this, 'success', '绑定成功')
            this.queryMarketInfo()
          }
        })
      } else {
        this.$messageTips(this, 'error', '请填写优惠券码')
      }
    },
    async getBestBenefit () {
      if (this.obj.recollect || this.obj.writeOff) {
        return
      }
      this.clearAllSelection()
      this.recommendDis = true
      let params = {
        patientId: this.$route.query.patientId, // 患者id
        deptId: this.$route.query.dptId, // 科室id
        mergedReceiptData: this.obj.multipleSelection, // 得从外面传过来
        salePolicy: '',
        comInsurance: !!this.obj.settlementComInsurDetID // 是否使用商保
      }
      try {
        let data = await getBestBenefit(params)
        if (data && data.data) {
          let {type, index} = {...data.data}
          switch (type) {
            case 0:
            // 活动
              this.benefitCollectObj.activityObj.tableData[index].activechecked = true
              this.$refs.activitys.activeCardArrSelectionChange(true, index)
              break
            case 1:
              // 身份卡
              this.benefitCollectObj.IDcardObj.tableData[index].activechecked = true
              this.$refs.idCard.idCardArrSelectionChange(true, index)
              break
            case 2:
              // 优惠券
              this.benefitCollectObj.benefitCardObj.tableData[index].activechecked = true
              this.$refs.benefitCard.benefitArrSelectionChange(true, index)
              break
            case 3:
              // 会员卡
              this.benefitCollectObj.cardsObj.tableData[index].activechecked = true
              this.$refs.cards.userCardArrSelectionChange(true, index)
              break
            default:
              break
          }
        } else {
          this.computeBenefit()
        }
        this.recommendDis = false
      } catch (err) {
        this.recommendDis = false
      }
    },
    benefitChange (arr, item) {
      this.$refs.benefittab.$refs.nav.$forceUpdate()
      if (item === 'giftcardIds') {
        this.obj.benefitInfo[item] = arr.map(item => item.id)
      } else {
        this.obj.benefitInfo[item] = (arr[0] && arr[0].id) || ''
      }
      // settlementMemberDet: [], // 储值卡
      // settlementBenefitDet: [], // 身份卡
      // settlementCouponDet: [], // 优惠券
      // settlementPromotion: [],  // 活动优惠
      switch (item) {
        // 活动
        case 'promotionId':
          this.obj.details.settlementPromotion = arr.map(item => {
            item.promotionId = item.id
            return item
          })
          break
        // 储值卡
        case 'memberCardId':
          this.obj.details.settlementMemberDet = arr
          this.obj.details.settlementMemberDet.forEach(v => {
            v.memberCardID = v.id
            v.name = v.memberCardBatch && v.memberCardBatch.name
          })
          break
        // 身份卡
        case 'benefitCardId':
          this.obj.details.settlementBenefitDet = arr
          // 字段对应调整
          this.obj.details.settlementBenefitDet.forEach(v => {
            v.name = v.benefit && v.benefit.name
            v.benefitId = v.id
            v.discountRule = v.benefit.discountRule
          })
          break
        // 优惠券
        case 'giftcardIds':
          this.obj.details.settlementCouponDet = arr
          // 字段对应调整
          this.obj.details.settlementCouponDet.forEach(v => {
            v.couponName = v.giftBatch && v.giftBatch.name
            v.type = v.giftBatch.type
            v.couponID = v.id
          })
          break
      }
      this.computeBenefit()
    },
    queryMarketInfo () {
      let params = {
        patientId: this.$route.query.patientId, // 患者id
        dptrange: this.$route.query.dptId // 患者所在科室
      }
      getAllMarketInfoByPatientIdAndDpt(params).then(res => {
        this.benefitCollectObj.activityObj.tableData = res.data.activity.map(item => {
          item.activechecked = false
          return item
        })
        this.benefitCollectObj.benefitCardObj.tableData = res.data.giftcard.map(item => {
          item.activechecked = false
          return item
        })
        this.benefitCollectObj.cardsObj.tableData = res.data.memberCard.map(item => {
          item.activechecked = false
          return item
        })
        this.benefitCollectObj.IDcardObj.tableData = res.data.benefit.map(item => {
          item.activechecked = false
          return item
        })
      })
    },
    clearAllSelection () {
      Object.keys(this.benefitCollectObj).map(item => {
        this.benefitCollectObj[item].tableData.map(v => {
          v.activechecked = false
        })
      })
      // 清空benefitInfo与营销相关的信息
      Object.assign(this.obj.benefitInfo, {
        promotionId: '', // 活动id
        promotionFee: 0, // 活动优惠金额
        benefitCardId: '', // 身份卡id
        benefitFee: '', // 身份卡优惠金额
        giftcardIds: [], // 优惠券id
        memberactcutfee: 0, // 优惠券优惠金额
        memberCardId: '', // 储值卡id
        membergradecutfee: 0, // 储值卡优惠金额
        selfDiscountFee: 0 // 自费金额
      })
      // 清空obj.details信息
      this.obj.details.settlementPromotion = []
      this.obj.details.settlementMemberDet = []
      this.obj.details.settlementBenefitDet = []
      this.obj.details.settlementCouponDet = []
      this.$refs.benefittab.$refs.nav.$forceUpdate()
    }
  }
}
</script>

<style lang="less" scoped>
.benefitContainer {
  margin-top: 15px;
  .header {
    height: 40px;
    .settle_title {
      display: inline-block;
      height: 16px;
      line-height: 16px;
      padding-left: 10px;
      border-left: 3px solid #1c7bef;
      margin: 3px 0 3px;
      font-weight: bold;
      .downArrow{
        font-size:5px;
        line-height: 16px;
        vertical-align: 0;
        color:#aaa;
      }
    }
    .recommendCom {
      float: right;
      .bindgitcard {
        display: inline-block;
        height: 28px;
        padding:0;
        .bindgitcardbtn {
          color: white;
          background: #1c7bef;
          border: 1px solid #1c7bef;
          border-radius: 0 2px 2px 0;
        }
      }
      .bindgitcard + .bindgitcard {
        margin-left: 10px;
      }
    }
  }
  .header::after {
    content: "";
    clear: both;
  }
  .footer {
    margin-top: 10px;
    .el-tabs--top{
      .el-tabs__item.is-top{
        .hasSelected {
          border-radius: 50%;
          padding: 5px;
          background: #f56c6c;
          display: inline-block;
          position: absolute;
          right: 0;
          top: 0;
        }
      }
      .el-tabs__item.is-top:last-child{
        .hasSelected{
          right:-10px;
        }
      }
    }
    
  }
  .totalCount{
    padding:7px 11px;
    background-color: #eee;
    font-size:14px;
    line-height: 16px;
    .itemName{
      font-weight: bold;
      color:#000;
    }
    .general{
      color:#666;
    }
  }
}
</style>

