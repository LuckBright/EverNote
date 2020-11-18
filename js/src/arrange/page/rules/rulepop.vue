<template>
  <el-dialog
  title="选择规则"
  width="1000px"
  :visible.sync="dialogVisible"
  class="ui_dialog_02 spe">
    <div class="clearfix" style="height:100%" v-if="show">
      <div class="left">
        <el-radio-group v-model="currentRules" value-key="id">
          <el-radio v-for="(item, i) in rulesList" :key="i" :label="item">{{item.name}}</el-radio>
        </el-radio-group>
      </div>
      <div class="right"> 
        <template v-if="currentRules">
          <el-row class="pannel">
            <el-col :span="8" class="clearline">
              <div class="head bg_1">
                <i class="iconfont icon-bianji"></i>
                <p>预约规则</p>
              </div>
              <ul class="body">
                <li>
                  <el-checkbox v-model="currentRules.normalCustomerRuleDetail.applyAppointmentRule.isAllow" :true-label="1" :false-label="0">可以申请预约</el-checkbox>
                </li>
                <li v-if="currentRules.normalCustomerRuleDetail.applyAppointmentRule.isFormalDocument">
                  <strong>需要患者正式档案</strong>
                  <label class="gray" v-if="currentRules.normalCustomerRuleDetail.applyAppointmentRule.isIdentityCardCheck">并且需要身份核对通过</label>
                </li>
                <li v-if="currentRules.normalCustomerRuleDetail.applyAppointmentRule.isPay">
                  <strong class="clearfix">
                    <em v-if="currentRules.normalCustomerRuleDetail.applyAppointmentRule.documentPayRel === 'AND'" class="fl">并且</em>
                    <em v-if="currentRules.normalCustomerRuleDetail.applyAppointmentRule.documentPayRel === 'OR'" class="fl">或者</em>
                    <em class="fl">需要</em>
                    <em v-if="currentRules.normalCustomerRuleDetail.applyAppointmentRule.payOption === 1" class="fl">全额支付</em>
                    <em v-if="currentRules.normalCustomerRuleDetail.applyAppointmentRule.payOption === 2" class="fl">部分支付</em>
                  </strong>
                  <label class="gray" v-if="currentRules.normalCustomerRuleDetail.applyAppointmentRule.payOption === 2">● 支付比例 {{currentRules.normalCustomerRuleDetail.applyAppointmentRule.partPayProportion}}% </label>
                  <label class="gray" v-if="currentRules.normalCustomerRuleDetail.applyAppointmentRule.payTimeLimit">● 限{{currentRules.normalCustomerRuleDetail.applyAppointmentRule.payTimeLimit}}分钟内支付 </label>       
                </li>
                <li v-if="currentRules.normalCustomerRuleDetail.applyAppointmentRule.isTwoConfirm">
                  <strong>需要人工确认</strong>
                </li>
                <li v-if="currentRules.normalCustomerRuleDetail.applyAppointmentRule.isNeedCancellimit">
                  <strong>需要取消限制</strong>
                  <label class="gray">● 限预约日期{{currentRules.normalCustomerRuleDetail.applyAppointmentRule.cancellimitDays}}日前取消</label>
                </li>                                       
              </ul> 
            </el-col>
            <el-col :span="8">
              <div class="head bg_2">
                <i class="iconfont icon-wuziguanli"></i>
                <p>挂号规则</p>
              </div>
              <ul class="body">
                <li>
                  <el-checkbox v-model="currentRules.normalCustomerRuleDetail.formalAppointmentRule.isAllow" :true-label="1" :false-label="0">可以正式预约</el-checkbox>
                </li>
                <li v-if="currentRules.normalCustomerRuleDetail.formalAppointmentRule.isFormalDocument">
                  <strong>需要患者正式档案</strong>
                  <label class="gray" v-if="currentRules.normalCustomerRuleDetail.formalAppointmentRule.isIdentityCardCheck">并且需要身份核对通过</label>
                </li>
                <li v-if="currentRules.normalCustomerRuleDetail.formalAppointmentRule.isPay">
                  <strong class="clearfix">
                    <em v-if="currentRules.normalCustomerRuleDetail.formalAppointmentRule.documentPayRel === 'AND'" class="fl">并且</em>
                    <em v-if="currentRules.normalCustomerRuleDetail.formalAppointmentRule.documentPayRel === 'OR'" class="fl">或者</em>
                    <em class="fl">需要</em>
                    <em v-if="currentRules.normalCustomerRuleDetail.formalAppointmentRule.payOption === 1" class="fl">全额支付</em>
                    <em v-if="currentRules.normalCustomerRuleDetail.formalAppointmentRule.payOption === 2" class="fl">部分支付</em>
                  </strong>
                  <label class="gray" v-if="currentRules.normalCustomerRuleDetail.formalAppointmentRule.payOption === 2">● 支付比例 {{currentRules.normalCustomerRuleDetail.formalAppointmentRule.partPayProportion}}% </label>
                  <label class="gray" v-if="currentRules.normalCustomerRuleDetail.formalAppointmentRule.payTimeLimit">● 限{{currentRules.normalCustomerRuleDetail.formalAppointmentRule.payTimeLimit}}分钟内支付 </label>       
                </li>
                <li v-if="currentRules.normalCustomerRuleDetail.formalAppointmentRule.isTwoConfirm">
                  <strong>需要人工确认</strong>
                </li>
                <li v-if="currentRules.normalCustomerRuleDetail.formalAppointmentRule.isNeedCancellimit">
                  <strong>需要取消限制</strong>
                  <label class="gray">● 限预约日期{{currentRules.normalCustomerRuleDetail.formalAppointmentRule.cancellimitDays}}日前取消</label>
                </li>                                               
              </ul>  
            </el-col>
            <el-col :span="8">
              <div class="head bg_3">
                <i class="iconfont icon-menzhenyisheng"></i>
                <p>到诊规则</p>
              </div>
              <ul class="body">
                <li>
                  <label>到诊要求</label>
                </li>
                <li v-if="currentRules.normalCustomerRuleDetail.receptionRule.isFormalDocument">
                  <strong>需要患者正式档案</strong>
                  <label class="gray" v-if="currentRules.normalCustomerRuleDetail.receptionRule.isIdentityCardCheck">并且需要身份核对通过</label>
                </li>
                <li v-if="currentRules.normalCustomerRuleDetail.receptionRule.isPay">
                  <strong class="clearfix">
                    <em v-if="currentRules.normalCustomerRuleDetail.receptionRule.documentPayRel === 'AND'" class="fl">并且</em>
                    <em v-if="currentRules.normalCustomerRuleDetail.receptionRule.documentPayRel === 'OR'" class="fl">或者</em>
                    <em class="fl">需要</em>
                    <em v-if="currentRules.normalCustomerRuleDetail.receptionRule.payOption === 1" class="fl">全额支付</em>
                    <em v-if="currentRules.normalCustomerRuleDetail.receptionRule.payOption === 2" class="fl">部分支付</em>
                  </strong>
                  <label class="gray" v-if="currentRules.normalCustomerRuleDetail.receptionRule.payOption === 2">● 支付比例 {{currentRules.normalCustomerRuleDetail.receptionRule.partPayProportion}}% </label>
                  <label class="gray" v-if="currentRules.normalCustomerRuleDetail.receptionRule.payTimeLimit">● 限{{currentRules.normalCustomerRuleDetail.receptionRule.payTimeLimit}}分钟内支付 </label>       
                </li>                                   
              </ul>         
            </el-col>
          </el-row>
        </template>     
      </div>      
    </div>
    <el-row style="padding: 20px;" slot="footer">
      <el-col :span="24" align="left">
        <el-button size="small" @click="confirm" type="primary">确定</el-button>
      </el-col>
    </el-row>    
  </el-dialog>
</template>

<script>
import api from '@/arrange/store/rulesapi'
export default {
  props: ['value', 'show'],
  data () {
    return {
      api,
      dialogVisible: false,
      currentRules: '',
      rulesList: []
    }
  },
  watch: {
    'show' (val) {
      this.dialogVisible = val
    },
    'dialogVisible' (val) {
      this.$emit('update:show', val)
    },
    'value' (val) {
      this.currentRules = this.rulesList.filter(item => {
        return item.id === val.id
      })[0]
    }
  },
  created () {
    this.getRulesList()
  },
  methods: {
    getRulesList () {
      this.api.list({status: 1}).then(rs => {
        this.rulesList = rs.data
        if (!this.currentRules) {
          this.currentRules = rs.data[0]
        }
      })
    },
    confirm () {
      this.$emit('input', this.currentRules)
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
  .left {width: 200px; height: 492px; border-right: 1px solid #ddd; background: #eee; float: left; overflow: auto;}
  .left .el-radio {line-height: 33px; padding-left: 10px; display: block;}
  .right{float: left; padding: 0 20px;}
  .pannel {width: 720px; border: 1px solid #D0DBE4; float: left;}
  .pannel .el-col{border-left: 1px solid #D0DBE4;}
  .pannel .clearline { border-left: none;}
  .pannel .head{text-align: center; padding: 50px 0; border-bottom: 1px solid #D0DBE4;}
  .pannel .head .iconfont{font-size: 49px;}
  .pannel .bg_1{background: #FAFFF6;}
  .pannel .bg_2{background: #ECFFDC;}
  .pannel .bg_3{background: #D6F5CE;}
  .pannel .body{padding: 10px; list-style: none; margin: 0; min-height: 270px;}
  .pannel .body li{padding: 10px; min-height: 22px;}
  .pannel .body li em{font-style: normal;}
  .pannel .body .child {margin-left: 24px; margin-top: 10px;}
  .pannel .body label.gray {display: block; color: #666; margin-left: 1em; margin-top: 1em;}
</style>
