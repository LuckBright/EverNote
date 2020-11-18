<template>
  <div class="settlement_detail">
    <hr>
    <h4 class="settle_title">优惠详情
      <span style="float: right;" v-show="obj.settlecode">
        <el-button type="text" @click="dialogBenefitVisible1 = true">优惠详情</el-button><i class="iconfont icon-sales-qiehuanjiantou"></i>
      </span>
      <span style="float: right; padding-right: 20px;" v-show="obj.settlecode && obj.medInsurance">
        <el-button type="text" @click="showmedicalsettle">医保结算详情</el-button><i class="iconfont icon-sales-qiehuanjiantou"></i>
      </span>
    </h4>
    <div class="preferential" v-if="(obj.settlestatus === '0' && !!obj.settlementid && obj.paymethodradio === 2) || (obj.settlestatus === '0' && !obj.settlementid && obj.paymethodradio !== 2)">
      <div v-if="obj.memberCardLength || obj.benefitCardLength || obj.giftCardLength" style="display:inline-block;">
        <div class="preferential_title" v-if="obj.comInvChecked === 'true' || obj.medInv">
          <el-button type="text" v-show="obj.memberCardLength" @click="changeCardStaus(1)" :disabled="obj.memberCardStatus">储值卡<i class="el-icon-arrow-down" v-bind:class="{ active: obj.cardStatus === 1}"></i></el-button>
          <el-button type="text" v-show="obj.benefitCardLength" @click="changeCardStaus(2)" :disabled="obj.benefitCardStatus">身份卡<i class="el-icon-arrow-down" v-bind:class="{ active: obj.cardStatus === 2}"></i></el-button>
          <el-button type="text" v-show="obj.giftCardLength" @click="changeCardStaus(3)" :disabled="obj.giftCardStatus">优惠券<i class="el-icon-arrow-down" v-bind:class="{ active: obj.cardStatus === 3}"></i></el-button>
          <!-- <span class="gift_text benefit_text">抵用￥3000.00</span>
          <span class="gift_text giftcard_text">9折，省100元</span>
          <span class="gift_text member_text">满1000减100</span> -->
        </div>
        <div class="preferential_title" v-if="(obj.comInvChecked === 'false' || !obj.comInvChecked) && !obj.medInv">
          <el-button type="text" v-show="obj.benefitCardLength" @click="changeCardStaus(2)" :disabled="obj.benefitCardStatus">身份卡<i class="el-icon-arrow-down" v-bind:class="{ active: obj.cardStatus === 2}"></i></el-button>
          <el-button type="text" v-show="obj.giftCardLength" @click="changeCardStaus(3)" :disabled="obj.giftCardStatus">优惠券<i class="el-icon-arrow-down" v-bind:class="{ active: obj.cardStatus === 3}"></i></el-button>
          <el-button type="text" v-show="obj.memberCardLength" @click="changeCardStaus(1)" :disabled="obj.memberCardStatus">储值卡<i class="el-icon-arrow-down" v-bind:class="{ active: obj.cardStatus === 1}"></i></el-button>
          <!-- <span class="gift_text benefit_text">9折，省100元</span>
          <span class="gift_text giftcard_text">满1000减100</span>
          <span class="gift_text member_text">抵用￥3000.00</span> -->
        </div>
      </div>
      <div class="bindgitcard">
        <el-input v-model="bindgitcardcode" placeholder="请输入优惠券码">
          <el-button slot="append" class="bindgitcardbtn" @click="bindgitcardFn">绑券</el-button>
        </el-input>
      </div>
    </div>
    <patientbenefit :obj="obj" ref="patientbenefit" @selectSelfTariffs="selectSelfTariffs" @selfdiscountassign="selfdiscountassign"></patientbenefit>
    <dialogbenefit :obj="obj" :dialogBenefitVisible.sync="dialogBenefitVisible1"></dialogbenefit>
  </div>
</template>
<script>
  import patientbenefit from './patientbenefit'
  import dialogbenefit from './dialog-benefit'
  import api from '../../workspace/store/useraccountapi'
  export default {
    props: ['obj'],
    data () {
      return {
        dialogBenefitVisible1: false,
        bindgitcardcode: ''
      }
    },
    methods: {
      selfdiscountassign (serviceIds, itemType, array, discount) {
        this.$emit('selfdiscountassign', serviceIds, itemType, array, discount)
      },
      selectSelfTariffs (id, serviceIds) {
        this.$emit('selectSelfTariffs', id, serviceIds)
      },
      bindgitcardFn () {
        let that = this
        if (that.bindgitcardcode) {
          api.bind({
            code: that.bindgitcardcode,
            patientId: that.$route.query.pid
          }).then(result => {
            if (result.head.errCode === 0) {
              that.$refs.patientbenefit.getAllCard(that.$route.query.status)
            }
          })
        } else {
          that.$notify({message: '请填写优惠券码', type: 'error'})
        }
      },
      showmedicalsettle () {
        this.$emit('showmedicalsettle')
      },
      changeCardStaus (status) {
        if (status === this.obj.cardStatus) {
          this.obj.cardStatus = ''
        } else {
          this.obj.cardStatus = status
        }
      }
    },
    components: {
      patientbenefit,
      dialogbenefit
    },
    created () {
      let that = this
      if (that.obj.settlestatus === '3') {
        that.obj.benefitCardStatus = true
        that.obj.giftCardStatus = true
        that.obj.memberCardStatus = true
      }
    },
    watch: {
      '$route.query.status' (v) {
        let that = this
        if (v === '3') {
          that.obj.benefitCardStatus = true
          that.obj.giftCardStatus = true
          that.obj.memberCardStatus = true
        }
      }
    }
  }
</script>
<style type="text/css">
  .settle_title .el-button--text { text-decoration:underline; padding:0; }
  .settle_title .iconfont { font-size: 12px; color: #1C7BEF; }
  .bindgitcard { display: inline-block; padding-top: 20px; }
  .bindgitcard /deep/ .el-input-group__append button.el-button.bindgitcardbtn {background-color: #1c7bef; border-color: #1c7bef; color: #fff; border-radius: 0; }
</style>
