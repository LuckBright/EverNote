<template>
  <div class="layout_inner f14">
    <el-container class="h oa">
      <el-aside width="200px" class="left no-box-sha common-el1">
        <el-button class="add" size="small" plain @click="addRules">新建规则</el-button>
        <ul class="nav">
          <li :class="{on: currentRules.id === item.id}" v-for="(item, i) in rulesList" :key="i" @click="setCurrentRules(item)">{{item.name}}</li>
        </ul>
      </el-aside>
      <el-main class="common-el1 ml-1">
        <template v-if="currentRules">
          <el-row class="right_head">
            <el-col :span="4" v-if="currentRules"><label>{{currentRules.name}}</label> <el-button type="text" @click="updateRulesName" class="ml20">修改</el-button></el-col>
            <el-col :span="20">
              <el-switch
                :disabled="!!currentRules.isInit"
                :active-value="1"
                :inactive-value="0"
                @change="changeConfigStatus"
                v-model="currentRules.status">
              </el-switch>
              <label style="margin-right:20px">{{currentRules.status ? '启用中' : '停用中'}}</label>
              <!--
              <el-switch
                :active-value="1"
                :inactive-value="0"
                @change="changeConfigCharge"
                v-model="currentRules.isExistCharge">
              </el-switch>
              <label>{{currentRules.isExistCharge ? '需要挂号费' : '无需挂号费'}}</label>
              -->
            </el-col>
          </el-row>
          <el-row class="pannel">
            <el-col :span="8" class="clearline">
              <div class="head bg_1">
                <i class="iconfont icon-bianji"></i>
                <strong>预约规则</strong>
              </div>
              <ul class="body" v-if="currentRules.normalCustomerRuleDetail.applyAppointmentRule.isEdit">
                <li>
                  <el-checkbox v-model="applyAppointmentRule.isAllow" :true-label="1" :false-label="0">可以预约</el-checkbox>
                </li>
                <li class="yellow">
                  <el-checkbox v-model="applyAppointmentRule.isFormalDocument" :true-label="1" :false-label="0" @change="changeApplyIsFormalDocumentCheckbox">需要患者正式档案</el-checkbox>
                  <el-checkbox v-model="applyAppointmentRule.isIdentityCardCheck" :disabled="!applyAppointmentRule.isFormalDocument" class="child" :true-label="1" :false-label="0" @change="changeApplyIsIdentityCardCheck">并且需要身份核对通过</el-checkbox>
                </li>
                <li>
                  <el-radio-group v-model="applyAppointmentRule.documentPayRel" :disabled="!applyAppointmentRule.isFormalDocument || !applyAppointmentRule.isPay">
                    <el-radio label="AND">并且</el-radio>
                    <el-radio label="OR">或者</el-radio>
                  </el-radio-group>
                </li>
                <li class="yellow mb20">
                  <el-checkbox v-model="applyAppointmentRule.isPay" :true-label="1" :false-label="0" @change="changeApplyIsPayCheckbox">需要支付</el-checkbox>
                  <!--
                  <el-radio-group style="display:block" v-model="applyAppointmentRule.payOption" :disabled="!applyAppointmentRule.isPay" @change="changeApplyPayOption">
                    <el-radio :label="1" class="child">全额支付</el-radio>

                    <el-radio :label="2" class="child">
                      部分支付
                      <el-input-number type="number" :controls="false" :min="1" :max="formalAppointmentRule.partPayProportion || 100" size="mini" style="width:50px" v-model="applyAppointmentRule.partPayProportion"></el-input-number> %
                    </el-radio>
                  </el-radio-group>
                  -->
                  <p>
                    限 <el-input-number type="number" :controls="false" :min="1" :max="5000" size="mini" style="width:50px" v-model="applyAppointmentRule.payTimeLimit" :disabled="!applyAppointmentRule.isPay"></el-input-number> 分钟内支付
                  </p>
                </li>
                <li class="yellow">
                  <el-checkbox v-model="applyAppointmentRule.isNeedCancellimit" :true-label="1" :false-label="0" @change="changeApplyNeedCancellimit">需要取消限制</el-checkbox>
                  <!--
                  <el-radio-group style="display:block" v-model="applyAppointmentRule.payOption" :disabled="!applyAppointmentRule.isPay" @change="changeApplyPayOption">
                    <el-radio :label="1" class="child">全额支付</el-radio>

                    <el-radio :label="2" class="child">
                      部分支付
                      <el-input-number type="number" :controls="false" :min="1" :max="formalAppointmentRule.partPayProportion || 100" size="mini" style="width:50px" v-model="applyAppointmentRule.partPayProportion"></el-input-number> %
                    </el-radio>
                  </el-radio-group>
                  -->
                  <p>
                    患者可在预约日期 <el-input-number type="number" :step-strictly="true" :controls="false" :min="1" :max="100" size="mini" style="width:50px" v-model="applyAppointmentRule.cancellimitDays" :disabled="!applyAppointmentRule.isNeedCancellimit"></el-input-number> 日前取消
                  </p>
                </li>
                <li>
                  <el-checkbox v-model="applyAppointmentRule.isTwoConfirm" :true-label="1" :false-label="0">需要人工确认</el-checkbox>
                </li>
                <li>
                  <el-button size="small" type="primary" @click="saveRules('applyAppointmentRule')">保存</el-button>
                </li>
              </ul>
              <ul class="body" v-else>
                <li>
                  <el-checkbox v-model="currentRules.normalCustomerRuleDetail.applyAppointmentRule.isAllow" :disabled="true" :true-label="1" :false-label="0"><strong style="color:#000">可以预约</strong></el-checkbox>
                </li>
                <li v-if="currentRules.normalCustomerRuleDetail.applyAppointmentRule.isFormalDocument">
                  <strong>需要患者正式档案</strong>
                  <label class="gray" v-if="currentRules.normalCustomerRuleDetail.applyAppointmentRule.isIdentityCardCheck">● 并且需要身份核对通过</label>
                </li>
                <li v-if="currentRules.normalCustomerRuleDetail.applyAppointmentRule.isPay">
                  <strong class="clearfix">
                    <em v-if="currentRules.normalCustomerRuleDetail.applyAppointmentRule.documentPayRel === 'AND'" class="fl">并且</em>
                    <em v-if="currentRules.normalCustomerRuleDetail.applyAppointmentRule.documentPayRel === 'OR'" class="fl">或者</em>
                    <em class="fl">需要支付</em>
                    <!--<em v-if="currentRules.normalCustomerRuleDetail.applyAppointmentRule.payOption === 1" class="fl">全额支付</em>-->
                    <!--<em v-if="currentRules.normalCustomerRuleDetail.applyAppointmentRule.payOption === 2" class="fl">部分支付</em>-->
                  </strong>
                  <label class="gray" v-if="currentRules.normalCustomerRuleDetail.applyAppointmentRule.isPayTimeLimit">● 限{{currentRules.normalCustomerRuleDetail.applyAppointmentRule.payTimeLimit}}分钟内支付 </label>
                  <!--
                  <label class="gray" v-if="currentRules.normalCustomerRuleDetail.applyAppointmentRule.payOption === 2">● 支付比例 {{currentRules.normalCustomerRuleDetail.applyAppointmentRule.partPayProportion}}% </label>
                  -->
                </li>
                <li v-if="currentRules.normalCustomerRuleDetail.applyAppointmentRule.isNeedCancellimit">
                  <strong>需要取消限制</strong>
                  <label class="gray">● 限预约日期{{currentRules.normalCustomerRuleDetail.applyAppointmentRule.cancellimitDays}}日前取消 </label>
                </li>
                <li v-if="currentRules.normalCustomerRuleDetail.applyAppointmentRule.isTwoConfirm">
                  <strong>需要人工确认</strong>
                </li>
                <li>
                  <el-button type="text" @click="editRules('applyAppointmentRule')">修改</el-button>
                </li>
              </ul>
            </el-col>
            <el-col :span="8">
              <div class="head bg_2">
                <i class="iconfont icon-wuziguanli"></i>
                <strong>挂号规则</strong>
              </div>
              <ul class="body"  v-if="currentRules.normalCustomerRuleDetail.formalAppointmentRule.isEdit">
                <li>
                  <el-checkbox v-model="formalAppointmentRule.isAllow" :true-label="1" :false-label="0">可以挂号</el-checkbox>
                </li>
                <li class="yellow">
                  <el-checkbox
                  v-model="formalAppointmentRule.isFormalDocument"
                  :true-label="1"
                  :false-label="0"
                  :disabled="true"
                  @change="changeFormalIsFormalDocumentCheckbox">需要患者正式档案</el-checkbox>
                  <el-checkbox
                  v-model="formalAppointmentRule.isIdentityCardCheck"
                  :disabled="true"
                  class="child"
                  :true-label="1"
                  :false-label="0"
                  @change="changeFormalIsIdentityCardCheck">并且需要身份核对通过</el-checkbox>
                </li>
                <li>
                  <el-radio-group v-model="formalAppointmentRule.documentPayRel" :disabled="!formalAppointmentRule.isFormalDocument || !formalAppointmentRule.isPay">
                    <el-radio label="AND">并且</el-radio>
                    <el-radio label="OR">或者</el-radio>
                  </el-radio-group>
                </li>
                <li class="yellow mb20">
                  <el-checkbox
                  v-model="formalAppointmentRule.isPay"
                  :true-label="1"
                  :false-label="0"
                  :disabled="!!applyAppointmentRule.isPay && !!formalAppointmentRule.isPay"
                  @change="changeFormalIsPayCheckbox">需要支付</el-checkbox>
                  <!---
                  <el-radio-group style="display:block" v-model="formalAppointmentRule.payOption" @change="changeFormalPayOption" :disabled="(!formalAppointmentRule.isPay || !!applyAppointmentRule.isPay) && applyAppointmentRule.payOption === 1">
                    <el-radio :label="1" class="child">全额支付</el-radio>
                    <el-radio :label="2" class="child">
                      部分支付
                      <el-input-number type="number" :controls="false" :min="applyAppointmentRule.partPayProportion || 1" :max="100" size="mini" style="width:50px" v-model="formalAppointmentRule.partPayProportion"></el-input-number> %
                    </el-radio>
                  </el-radio-group>
                  -->
                  <p>
                    限 <el-input-number type="number" :step-strictly="true" :controls="false" :min="1" :max="5000" size="mini" style="width:50px" v-model="formalAppointmentRule.payTimeLimit" :disabled="!formalAppointmentRule.isPay"></el-input-number> 分钟内支付
                  </p>
                </li>
                <li class="yellow">
                  <el-checkbox
                  v-model="formalAppointmentRule.isNeedCancellimit"
                  :true-label="1"
                  :false-label="0"
                  :disabled="!!applyAppointmentRule.isNeedCancellimit && !!formalAppointmentRule.isNeedCancellimit"
                   @change="changeFormalNeedCancellimit">需要取消限制</el-checkbox>
                  <!--
                  <el-radio-group style="display:block" v-model="applyAppointmentRule.payOption" :disabled="!applyAppointmentRule.isPay" @change="changeApplyPayOption">
                    <el-radio :label="1" class="child">全额支付</el-radio>

                    <el-radio :label="2" class="child">
                      部分支付
                      <el-input-number type="number" :controls="false" :min="1" :max="formalAppointmentRule.partPayProportion || 100" size="mini" style="width:50px" v-model="applyAppointmentRule.partPayProportion"></el-input-number> %
                    </el-radio>
                  </el-radio-group>
                  -->
                  <p>
                    患者可在预约日期 <el-input-number type="number" :step-strictly="true" :controls="false" :min="1" :max="100" size="mini" style="width:50px" v-model="formalAppointmentRule.cancellimitDays" :disabled="!formalAppointmentRule.isNeedCancellimit"></el-input-number> 日前取消
                  </p>
                </li>
                <li>
                  <el-checkbox v-model="formalAppointmentRule.isTwoConfirm" :true-label="1" :false-label="0">需要人工确认</el-checkbox>
                </li>
                <li>
                  <el-button size="small" type="primary" @click="saveRules('formalAppointmentRule')">保存</el-button>
                </li>
              </ul>
              <ul class="body" v-else>
                <li>
                  <el-checkbox v-model="currentRules.normalCustomerRuleDetail.formalAppointmentRule.isAllow" :disabled="true" :true-label="1" :false-label="0"><strong style="color:#000">可以挂号</strong></el-checkbox>
                </li>
                <li v-if="currentRules.normalCustomerRuleDetail.formalAppointmentRule.isFormalDocument">
                  <strong>需要患者正式档案</strong>
                  <label class="gray" v-if="currentRules.normalCustomerRuleDetail.formalAppointmentRule.isIdentityCardCheck">● 并且需要身份核对通过</label>
                </li>
                <li v-if="currentRules.normalCustomerRuleDetail.formalAppointmentRule.isPay">
                  <strong class="clearfix">
                    <em v-if="currentRules.normalCustomerRuleDetail.formalAppointmentRule.documentPayRel === 'AND'" class="fl">并且</em>
                    <em v-if="currentRules.normalCustomerRuleDetail.formalAppointmentRule.documentPayRel === 'OR'" class="fl">或者</em>
                    <em class="fl">需要支付</em>
                    <!--<em v-if="currentRules.normalCustomerRuleDetail.formalAppointmentRule.payOption === 1" class="fl">全额支付</em>-->
                    <!--<em v-if="currentRules.normalCustomerRuleDetail.formalAppointmentRule.payOption === 2" class="fl">部分支付</em>-->
                  </strong>
                  <label class="gray" v-if="currentRules.normalCustomerRuleDetail.formalAppointmentRule.isPayTimeLimit">● 限{{currentRules.normalCustomerRuleDetail.formalAppointmentRule.payTimeLimit}}分钟内支付 </label>
                  <!--
                  <label class="gray" v-if="currentRules.normalCustomerRuleDetail.formalAppointmentRule.payOption === 2">● 支付比例 {{currentRules.normalCustomerRuleDetail.formalAppointmentRule.partPayProportion}}% </label>
                  -->
                </li>
                <li v-if="currentRules.normalCustomerRuleDetail.formalAppointmentRule.isNeedCancellimit">
                  <strong>需要取消限制</strong>
                  <label class="gray">● 限预约日期{{currentRules.normalCustomerRuleDetail.formalAppointmentRule.cancellimitDays}}日前取消</label>
                </li>
                <li v-if="currentRules.normalCustomerRuleDetail.formalAppointmentRule.isTwoConfirm">
                  <strong>需要人工确认</strong>
                </li>
                <li>
                <el-button type="text" @click="editRules('formalAppointmentRule')">修改</el-button>
                </li>
              </ul>
            </el-col>
            <el-col :span="8">
              <div class="head bg_3">
                <i class="iconfont icon-menzhenyisheng"></i>
                <strong>到诊规则</strong>
              </div>
              <ul class="body" v-if="currentRules.normalCustomerRuleDetail.receptionRule.isEdit">
                <li>
                  <label>到诊要求</label>
                </li>
                <li class="yellow">
                  <el-checkbox
                  v-model="receptionRule.isFormalDocument"
                  :true-label="1" :false-label="0"
                  :disabled="true"
                  @change="changeReceptionIsFormalDocumentCheckbox">需要患者正式档案</el-checkbox>
                  <el-checkbox
                  v-model="receptionRule.isIdentityCardCheck"
                  class="child"
                  :disabled="true"
                  :true-label="1"
                  :false-label="0">并且需要身份核对通过</el-checkbox>
                </li>
                <li>
                  <el-radio-group v-model="receptionRule.documentPayRel" :disabled="!receptionRule.isFormalDocument || !receptionRule.isPay">
                    <el-radio label="AND">并且</el-radio>
                    <el-radio label="OR">或者</el-radio>
                  </el-radio-group>
                </li>
                <li class="yellow">
                  <el-checkbox
                  v-model="receptionRule.isPay"
                  :true-label="1"
                  :false-label="0"
                  :disabled="!!formalAppointmentRule.isPay && !!receptionRule.isPay"
                  @change="changeReceptionIsPayCheckbox">需要支付</el-checkbox>
                   <!--
                  <el-radio-group style="display:block" v-model="receptionRule.payOption" :disabled="(!receptionRule.isPay || !!formalAppointmentRule.isPay) && formalAppointmentRule.payOption === 1">
                    <el-radio :label="1" class="child">全额支付</el-radio>
                    <el-radio :label="2" class="child">
                      部分支付
                      <el-input-number type="number" :controls="false" :min="formalAppointmentRule.partPayProportion || 1" :max="100" size="mini" style="width:50px" v-model="receptionRule.partPayProportion"></el-input-number> %
                    </el-radio>
                  </el-radio-group>
                  <p>
                    限 <el-input-number type="number" :controls="false" :min="1" :max="5000" size="mini" style="width:50px" v-model="receptionRule.payTimeLimit" :disabled="!receptionRule.isPay"></el-input-number> 分钟内支付
                  </p>
                   -->
                </li>
                <li>
                  <div style="height:22px"></div>
                </li>
                <li>
                  <el-button size="small" type="primary" @click="saveRules('receptionRule')">保存</el-button>
                </li>
              </ul>
              <ul class="body" v-else>
              <li>
                <strong>到诊要求</strong>
              </li>
              <li v-if="currentRules.normalCustomerRuleDetail.receptionRule.isFormalDocument">
                <strong>需要患者正式档案</strong>
                <label class="gray" v-if="currentRules.normalCustomerRuleDetail.receptionRule.isIdentityCardCheck">● 并且需要身份核对通过</label>
              </li>
              <li v-if="currentRules.normalCustomerRuleDetail.receptionRule.isPay">
                <strong class="clearfix">
                  <em v-if="currentRules.normalCustomerRuleDetail.receptionRule.documentPayRel === 'AND'" class="fl">并且</em>
                  <em v-if="currentRules.normalCustomerRuleDetail.receptionRule.documentPayRel === 'OR'" class="fl">或者</em>
                  <em class="fl">需要支付</em>
                  <!--<em v-if="currentRules.normalCustomerRuleDetail.receptionRule.payOption === 1" class="fl">全额支付</em>-->
                  <!--<em v-if="currentRules.normalCustomerRuleDetail.receptionRule.payOption === 2" class="fl">部分支付</em>-->
                </strong>
                <!--
                <label class="gray" v-if="currentRules.normalCustomerRuleDetail.receptionRule.payOption === 2">● 支付比例 {{currentRules.normalCustomerRuleDetail.receptionRule.partPayProportion}}% </label>
                <label class="gray" v-if="currentRules.normalCustomerRuleDetail.receptionRule.isPayTimeLimit">● 限{{currentRules.normalCustomerRuleDetail.receptionRule.payTimeLimit}}分钟内支付 </label>
                -->
              </li>
              <li>
                <el-button type="text" @click="editRules('receptionRule')">修改</el-button>
              </li>
            </ul>
            </el-col>
          </el-row>
        </template>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import api from '@/arrange/store/rulesapi'
export default {
  data () {
    return {
      api,
      isOpen: true,
      rulesList: [],
      currentRules: '',
      applyAppointmentRule: {
        ruleConfigId: '',
        customerType: 1,
        ruleType: 1,
        isAllow: 1,
        isFormalDocument: 0,
        isIdentityCardCheck: 0,
        isNeedCancellimit: 0,
        documentPayRel: '',
        isPay: 0,
        payOption: 1,
        partPayProportion: '',
        isPayTimeLimit: 0,
        payTimeLimit: 10,
        isTwoConfirm: '',
        cancellimitDays: 1
      },
      formalAppointmentRule: {
        ruleConfigId: '',
        customerType: 1,
        ruleType: 2,
        isAllow: 1,
        isFormalDocument: 1,
        isIdentityCardCheck: 0,
        isNeedCancellimit: 0,
        documentPayRel: '',
        isPay: 0,
        payOption: 1,
        partPayProportion: '',
        isPayTimeLimit: 0,
        payTimeLimit: 10,
        isTwoConfirm: '',
        cancellimitDays: 1
      },
      receptionRule: {
        ruleConfigId: '',
        customerType: 1,
        ruleType: 3,
        isAllow: 1,
        isFormalDocument: 1,
        isIdentityCardCheck: 0,
        documentPayRel: '',
        isPay: 0,
        payOption: 1,
        partPayProportion: '',
        isPayTimeLimit: 0,
        payTimeLimit: 10,
        isTwoConfirm: ''
      }
    }
  },
  watch: {
    'currentRules' (val) {
      Object.assign(this.applyAppointmentRule, val.normalCustomerRuleDetail.applyAppointmentRule)
      Object.assign(this.formalAppointmentRule, val.normalCustomerRuleDetail.formalAppointmentRule)
      Object.assign(this.receptionRule, val.normalCustomerRuleDetail.receptionRule)
      this.applyAppointmentRule.ruleConfigId = this.currentRules.id
      this.formalAppointmentRule.ruleConfigId = this.currentRules.id
      this.receptionRule.ruleConfigId = this.currentRules.id
    }
  },
  created () {
    this.getRulesList()
  },
  methods: {
    addRules () {
      this.$prompt('请输入规则名称：', '新建规则', {
        inputPattern: /^[\w\S\s]{2,10}$/,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputErrorMessage: '请输入2-10个字符'
      }).then(({ value }) => {
        if (!value) {
          return false
        }
        this.api.saveRules({name: value}).then(rs => {
          if (!rs.head.errCode) {
            this.$messageTips(this, 'success', '规则保存成功')
            this.getRulesList()
            this.setCurrentRules(rs.data)
            this.$set(this.currentRules.normalCustomerRuleDetail.applyAppointmentRule, 'isEdit', 1)
            this.$set(this.currentRules.normalCustomerRuleDetail.formalAppointmentRule, 'isEdit', 1)
            this.$set(this.currentRules.normalCustomerRuleDetail.receptionRule, 'isEdit', 1)
          }
        })
      }).catch(() => {
        return false
      })
    },
    updateRulesName () {
      this.$prompt('请输入规则名称：', '修改规则名', {
        inputPattern: /^[\w\S\s]{2,10}$/,
        inputValue: this.currentRules.name,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputErrorMessage: '请输入2-10个字符'
      }).then(({ value }) => {
        if (!value) {
          return false
        }
        this.api.updateRulesName({id: this.currentRules.id, name: value}).then(rs => {
          if (!value) {
            return false
          }
          if (!rs.head.errCode) {
            this.$messageTips(this, 'success', '规则名修改成功')
            this.getRulesList()
            this.currentRules.name = value
          }
        })
      }).catch(() => {
        return false
      })
    },
    saveRules (val) {
      if (val === 'applyAppointmentRule') {
        this.api.updateRuleDetail(this.applyAppointmentRule).then(rs => {
          Object.assign(this.currentRules.normalCustomerRuleDetail.applyAppointmentRule, this.applyAppointmentRule)
          this.currentRules.normalCustomerRuleDetail.applyAppointmentRule.isEdit = 0
          this.getRulesList()
        })
      }
      if (val === 'formalAppointmentRule') {
        this.api.updateRuleDetail(this.formalAppointmentRule).then(rs => {
          Object.assign(this.currentRules.normalCustomerRuleDetail.formalAppointmentRule, this.formalAppointmentRule)
          this.currentRules.normalCustomerRuleDetail.formalAppointmentRule.isEdit = 0
          this.getRulesList()
        })
      }
      if (val === 'receptionRule') {
        this.api.updateRuleDetail(this.receptionRule).then(rs => {
          Object.assign(this.currentRules.normalCustomerRuleDetail.receptionRule, this.receptionRule)
          this.currentRules.normalCustomerRuleDetail.receptionRule.isEdit = 0
          this.getRulesList()
        })
      }
    },
    editRules (val) {
      if (!this.currentRules.status) {
        this.$messageTips(this, 'warning', '如需修改请先开启规则', '规则已停用')
        return false
      }
      if (val === 'applyAppointmentRule') {
        this.$set(this.currentRules.normalCustomerRuleDetail.applyAppointmentRule, 'isEdit', 1)
      }
      if (val === 'formalAppointmentRule') {
        this.$set(this.currentRules.normalCustomerRuleDetail.formalAppointmentRule, 'isEdit', 1)
      }
      if (val === 'receptionRule') {
        this.$set(this.currentRules.normalCustomerRuleDetail.receptionRule, 'isEdit', 1)
      }
    },
    getRulesList () {
      this.api.list().then(rs => {
        this.rulesList = rs.data
        if (!this.currentRules) {
          this.setCurrentRules(rs.data[0])
        }
      })
    },
    setCurrentRules (val) {
      if (!val.normalCustomerRuleDetail.applyAppointmentRule.payTimeLimit) {
        val.normalCustomerRuleDetail.applyAppointmentRule.payTimeLimit = 10
      }
      if (!val.normalCustomerRuleDetail.formalAppointmentRule.payTimeLimit) {
        val.normalCustomerRuleDetail.formalAppointmentRule.payTimeLimit = 10
      }
      if (!val.normalCustomerRuleDetail.receptionRule.payTimeLimit) {
        val.normalCustomerRuleDetail.receptionRule.payTimeLimit = 10
      }
      this.currentRules = val
    },
    changeApplyIsFormalDocumentCheckbox () {
      if (!this.applyAppointmentRule.isFormalDocument) {
        this.applyAppointmentRule.documentPayRel = ''
        this.applyAppointmentRule.isIdentityCardCheck = 0
      } else {
        // this.formalAppointmentRule.isFormalDocument = this.applyAppointmentRule.isFormalDocument
        this.applyAppointmentRule.documentPayRel = this.applyAppointmentRule.isPay ? 'AND' : ''
      }
      this.changeFormalIsFormalDocumentCheckbox()
    },
    changeFormalIsFormalDocumentCheckbox () {
      if (!this.formalAppointmentRule.isFormalDocument) {
        this.formalAppointmentRule.documentPayRel = ''
        this.formalAppointmentRule.isIdentityCardCheck = 0
      } else {
        // this.receptionRule.isFormalDocument = this.formalAppointmentRule.isFormalDocument
        this.formalAppointmentRule.documentPayRel = this.formalAppointmentRule.isPay ? 'AND' : ''
      }
      this.changeReceptionIsFormalDocumentCheckbox()
    },
    changeReceptionIsFormalDocumentCheckbox () {
      if (!this.receptionRule.isFormalDocument) {
        this.receptionRule.documentPayRel = ''
        this.receptionRule.isIdentityCardCheck = 0
      } else {
        this.receptionRule.documentPayRel = this.receptionRule.isPay ? 'AND' : ''
      }
    },
    changeApplyIsPayCheckbox () {
      if (!this.applyAppointmentRule.isPay) {
        this.applyAppointmentRule.documentPayRel = ''
        this.applyAppointmentRule.payOption = ''
        this.applyAppointmentRule.partPayProportion = ''
        this.applyAppointmentRule.payTimeLimit = 10
        this.applyAppointmentRule.isPayTimeLimit = 0
      } else {
        this.formalAppointmentRule.isPay = this.applyAppointmentRule.isPay
        this.applyAppointmentRule.isPayTimeLimit = 1
        this.applyAppointmentRule.payOption = 1
        this.applyAppointmentRule.documentPayRel = this.applyAppointmentRule.isFormalDocument ? 'AND' : ''
      }
      this.changeFormalIsPayCheckbox()
    },
    changeFormalIsPayCheckbox () {
      if (!this.formalAppointmentRule.isPay) {
        this.formalAppointmentRule.documentPayRel = ''
        this.formalAppointmentRule.payOption = ''
        this.formalAppointmentRule.partPayProportion = ''
        this.formalAppointmentRule.payTimeLimit = 10
        this.formalAppointmentRule.isPayTimeLimit = 0
      } else {
        this.receptionRule.isPay = this.formalAppointmentRule.isPay
        this.formalAppointmentRule.payOption = 1
        this.formalAppointmentRule.isPayTimeLimit = 1
        this.formalAppointmentRule.documentPayRel = this.formalAppointmentRule.isFormalDocument ? 'AND' : ''
      }
      this.changeReceptionIsPayCheckbox()
    },
    changeReceptionIsPayCheckbox () {
      if (!this.receptionRule.isPay) {
        this.receptionRule.documentPayRel = ''
        this.receptionRule.payOption = ''
        this.receptionRule.partPayProportion = ''
        this.receptionRule.payTimeLimit = 10
        this.receptionRule.isPayTimeLimit = 0
      } else {
        this.receptionRule.payOption = 1
        this.receptionRule.isPayTimeLimit = 1
        this.receptionRule.documentPayRel = this.receptionRule.isFormalDocument ? 'AND' : ''
      }
    },
    changeApplyIsIdentityCardCheck (val) {
      if (val) {
        // this.formalAppointmentRule.isIdentityCardCheck = val
      }
      this.changeFormalIsIdentityCardCheck(val)
    },
    changeFormalIsIdentityCardCheck (val) {
      if (val) {
        // this.receptionRule.isIdentityCardCheck = val
      }
    },
    changeApplyPayOption (val) {
      if (val) {
        this.formalAppointmentRule.payOption = val
      }
      this.changeFormalPayOption(val)
    },
    changeFormalPayOption (val) {
      if (val) {
        this.receptionRule.payOption = val
      }
    },
    changeConfigStatus (val) {
      let request = val ? this.api.enableRules : this.api.disableRules
      request({id: this.currentRules.id}).then(rs => {
        this.getRulesList()
      })
    },
    changeConfigCharge (val) {
      this.api.updateIsExistCharge({id: this.currentRules.id, isExistCharge: val}).then(rs => {
        this.getRulesList()
      })
    },
    changeApplyNeedCancellimit (val) {
      this.formalAppointmentRule.isNeedCancellimit = val
    },
    changeFormalNeedCancellimit (val) {
    }
  }
}
</script>

<style scoped lang="less">
.common-el1 {
  &.el-aside, &.el-main{
    border: 1px solid #c0ccd9;
  }
}
.left {background: #eee;}
.left .add {margin: 20px;}
.left .nav {padding: 0; margin: 0; list-style: none; }
.nav li {padding: 0 10px 0 20px; height: 33px; line-height: 33px; cursor: pointer;}
.nav li.on {background: #2980E0; color: #fff;}
/* .right{float: left; width: calc(100% - 241px); padding: 20px;} */
.right_head {line-height: 20px; margin-bottom: 20px;}
.right_head .el-button{color: #2980E0; display:inline-block;}
.right_head .el-switch{margin: 10px 0;}
.pannel {border: 1px solid #D0DBE4; max-width: 720px;}
.pannel .el-col{border-left: 1px solid #D0DBE4;}
.pannel .clearline { border-left: none;}
.pannel .head{text-align: center; padding: 50px 0; border-bottom: 1px solid #D0DBE4;}
.pannel .head .iconfont{font-size: 49px;}
.pannel .head strong {display: block; margin: 20px 0;}
.pannel .bg_1{background: #FAFFF6;}
.pannel .bg_2{background: #ECFFDC;}
.pannel .bg_3{background: #D6F5CE;}
.pannel .body{padding: 10px; list-style: none; margin: 0; min-height: 472px;}
.pannel .body li{padding: 10px; min-height: 20px;}
.pannel .body li em{font-style: normal;}
.pannel .body li.yellow{background: #FFFEEF; border: 1px solid #C4D0DA; border-radius: 4px;}
.pannel .body .child {margin-left: 24px; margin-top: 10px;}
.pannel .body label.gray {display: block; color: #666; margin-left: 1em; margin-top: 1em;}
.pannel /deep/ .el-radio__label,
.pannel /deep/ .el-checkbox__label{color: #000;}
.pannel /deep/ .el-input-number.is-without-controls .el-input__inner{padding: 0 5px;}
</style>
