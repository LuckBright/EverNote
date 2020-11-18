<template>
  <el-popover
    v-model="show"
    :open-delay="50"
    placement="right"
    popper-class="p0"
    :width="820"
    trigger="click">
    <div class="mainbox">
      <el-row class="wrap" v-if="appoint && showModel !== ''">
        <el-col :span="11">
          <el-form :model="form" label-width="86px" :show-message="true" label-position="right" ref="patientform" key="patient_form">
            <template>
              <el-form-item label="患者：">
                <span>{{appoint.patient.name}}</span>
                <span class="ml10" v-if="appoint.patient.patientNumber !== 'temporary'">{{appoint.patient.patientNumber}}</span>
              </el-form-item>
              <el-form-item label="标签：">
                <template v-if="appoint.patient.busiInsur">
                  <a
                    :class="getBusiInsurColor(appoint.patient.busiInsur)"
                    :href="$ever.crmIndex + '/crm/memberinfo/userinfo/userinsuranceinfo/' + appoint.patient.id"
                    target="_blank"
                    class="mr10 lab"
                    v-if="appoint.patient.busiInsur.busiInsurFlag">
                    商保
                  </a>
                  <a
                    :href="$ever.crmIndex + '/crm/memberinfo/userinfo/userinsuranceinfo/' + appoint.patient.id"
                    target="_blank"
                    class="mr10 lab"
                    :class="getBusiSupplInsurColor(appoint.patient.busiInsur)"
                    v-if="appoint.patient.busiInsur.busiSupplInsurFlag">
                    商补
                  </a>
                </template>
                <template v-if="isHaveTaochan">
                  <em class="mr10 lab green">套餐</em>
                </template>
                <template v-if="appoint.patient.member && appoint.patient.member.objLabelList">
                  <em class="mr10 lab red" :style="{background: item.color}" v-for="(item, i) in appoint.patient.member.objLabelList" :key="i">{{item.labelName}}</em>
                </template>
                <template v-if="!appoint.patient.busiInsur.busiInsurFlag && !appoint.patient.busiInsur.busiSupplInsurFlag && !isHaveTaochan && (!appoint.patient.member || !appoint.patient.member.objLabelList)">
                  <label>--</label>
                </template>
              </el-form-item>
              <el-form-item label="内部备注：" v-if="appoint.patient.internalRemark">
                <span style="color: orange">{{appoint.patient.internalRemark}}</span>
              </el-form-item>
              <el-form-item label="预约提示：" v-if="appoint.patient.appointRemind">
                <span style="color: orange">{{appoint.patient.appointRemind}}</span>
              </el-form-item>
              <el-form-item label="性别：">
                <span class="mr10">{{appoint.patient.sex | formatSex}}</span>
              </el-form-item>
              <el-form-item label="出生日期：">
                <span>{{appoint.patient.birthday ? $moment(appoint.patient.birthday).format('YYYY-MM-DD') : '--'}}</span>
                <span class="mr0">{{appoint.patientAgeText}}</span>
              </el-form-item>
              <el-form-item label="手机号码：">
                <span v-if="appoint.patient.id && appoint.patient.mobile">{{appoint.patient.mobile}}</span>
                <span v-else>--</span>
              </el-form-item>
              <el-form-item label="身份证号：">
                <span v-if="appoint.patient.id && appoint.patient.idNo">{{appoint.patient.idNo}}</span>
                <span v-else>--</span>
              </el-form-item>
              <!--
              <el-form-item label="来源渠道：" prop="channelId" v-if="!patientType" :rules="patientType || !patientRules.includes('source') ? rules.optional : rules.required">
                <el-cascader
                  style="width:100%"
                  size="small"
                  :disabled="!!editAppoint || isShowWarning"
                  v-model="form.channelId"
                  :props="channelOption"
                  :options="channelList">
                </el-cascader>
              </el-form-item>
              -->
            </template>
          </el-form>
        </el-col>
        <el-col :span="13" class="right">
          <el-form :model="form" label-width="92px" :show-message="true" label-position="right" ref="payform" :key="showModel + '_2'" v-if="showModel === 'pay' && useRules.formalAppointmentRule">
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="科室：">
                  {{form.deptName}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="医生：">
                  {{form.resourceName}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col>
                <el-form-item label="时间：">
                  {{form.date}} {{form.startTimeStr}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="14">
                <el-form-item label="服务：">
                  {{form.serviceName}}
                </el-form-item>
              </el-col>
              <el-col :span="10" align="right" v-if="servicePrice || servicePrice === 0">
                <el-form-item>
                  ￥ {{servicePrice ? servicePrice.toFixed(2) : '0.00'}}
                </el-form-item>
              </el-col>
              <el-col :span="10" align="right" v-else>
                <el-form-item>
                  暂未找到对应的价格，请选择其他费用类型
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="14">
                <el-form-item label="套餐及保障计划：">
                  <el-select
                    size="small"
                    v-model="form.shopSetItemId"
                    placeholder="套餐信息">
                    <el-option :value="-1" label="不使用"></el-option>
                    <el-option
                      :value="item.setmealOrderDetailId"
                      :label="item.setMealName"
                      v-for="(item, i) in serviceSetList"
                      :key="i"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10" align="right">
                <el-form-item>
                  <span class="fontgreen">- ￥ {{servicePrice && form.shopSetItemId !== -1 ? servicePrice.toFixed(2) : '0.00'}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="14">
                <el-form-item label="折扣：">
                  <el-select v-model="discountCard" value-key="id" size="small">
                    <el-option :value="{id: '', name: '无折扣'}" label="无折扣"></el-option>
                    <el-option
                      :label="item.name"
                      :value="item"
                      v-for="(item, i) in discountList"
                      :key="i"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10"></el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="14">
                <el-form-item label="">
                  <el-checkbox v-model="form.jiuZhenCard" :true-label="1" :false-label="0">就诊卡</el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="10" align="right" v-if="jiuZhenCardPrice">
                <el-form-item>
                  <span class="fontgreen">+ ￥{{jiuZhenCardPrice.toFixed(2)}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="14">
                <el-form-item label="">
                  <el-checkbox v-model="form.medicalRecordBook" :true-label="1" :false-label="0">病历本</el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="10" align="right" v-if="recordBookPrice">
                <el-form-item>
                  <span class="fontgreen">+ ￥{{recordBookPrice.toFixed(2)}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="合计：">
                  <strong class="fontred" style="font-size: 18px;"  v-if="servicePrice || servicePrice === 0">￥{{(currentPrice - discountPrice + recordBookPrice + jiuZhenCardPrice).toFixed(2)}}</strong>
                  <span class="fontred" v-else>暂未找到对应的价格，请选择其他费用类型</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="">
                  <div style="padding-top: 10px">
                    <el-button size="small" type="primary" :disabled="isSubmit" @click="submitAppoint(false)">挂号收费</el-button>
                    <el-button size="small" type="primary" plain @click="closePopover">关闭</el-button>
                    <el-button size="small" type="primary" plain @click="returnNumberForm">返回</el-button>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-form :model="form" label-width="92px" :show-message="true" label-position="right" ref="form" :key="showModel + '_3'" v-else>
            <el-row :gutter="10" v-if="showModel === 'cancel'">
              <el-col :span="24">
                <el-alert :title="'要取消' + cancelText + '吗？'" center :closable="false" type="error" class="title"></el-alert>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="科室："><span>{{form.deptName}}</span></el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="医生："><span>{{form.resourceName}}</span></el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="时间：">
                  <el-row type="flex" :gutter="5">
                    <el-col :span="8"><i class="el-icon-edit" style="vertical-align:initial; cursor: pointer" @click="openEditModel" v-if="!isChangeNumber && isAllowChange && !appoint.orderId && appoint.apptType === 1 && showModel !== 'cancel'"></i> {{form.date}}</el-col>
                    <el-col :span="6">
                      <el-input size="mini" v-model="form.startTimeStr" style="width:60px" v-if="showModel === 'update'" :maxlength="5"></el-input>
                      <span v-else>{{form.startTimeStr}}</span>
                    </el-col>
                    <el-col :span="10">
                      <el-input size="mini" v-model="form.timeLength" style="width:60px" v-if="showModel === 'update'" type="number"></el-input>
                      <span v-else>{{form.timeLength}}</span>
                      <label class="ml10">分钟</label>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="费别：">
                  <span>{{form.insuranceType === 1 ? '医保' : '自费'}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item  label="初复诊：" prop="subsequentVisit">
                  <span>{{form.subsequentVisit === 1 ? '复诊' : '初诊'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="费用类型：">
                  <sys-value type="THC_QJFYLX" :code="form.feeType" v-if="form.feeType"></sys-value>
                  <span v-else>无</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="挂号类别：">
                  <sys-value type="CT05.10.004" :code="form.registerTypeCode"></sys-value>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="就诊类型："><span>{{this.visitType}}</span></el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="预约途径：" v-if="appoint.apptType === 1">
                  <span>{{appoint.appointWayName}}</span>
                </el-form-item>
                <el-form-item label="挂号方式：" v-if="appoint.apptType === 2">
                  <span>{{appoint.registerWayName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="标注颜色：">
                  <el-dropdown @command="handleCommand" trigger="click" class="colors">
                    <span class="el-dropdown-link">
                      <i class="currclolr" :style="{background: predefineColors[form.showStyle]}"></i>
                      <i class="el-icon-arrow-down"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :command="i" v-for="(item, i) in predefineColors" :key="i">
                        <span class="color" :style="{background: item}"></span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="备注：">
                  <el-input type="textarea" v-model="form.symptom" :autosize="{ minRows: 2, maxRows: 4}" :maxlength="200" v-if="showModel === 'update'"></el-input>
                  <span v-else>{{form.symptom}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-form-item label="发送短信：">
                <el-switch
                  v-model="sendMessage">
                </el-switch>
                <span class="ml20" style="color:#666;">手工发送：</span>
                <el-switch
                  :disabled="!sendMessage"
                  :active-value="0"
                  :inactive-value="1"
                  v-model="form.isSmsRemind">
                </el-switch>
              </el-form-item>
            </el-row>
            <el-row :gutter="10" v-if="showModel === 'cancel'">
              <el-col :span="24">
                <el-form-item label="取消原因：" prop="cancelReason" :rules="rules.required">
                  <el-input type="textarea" v-model="form.cancelReason" :maxlength="200" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" v-if="isExistCharge && appoint.orderId && appoint.isSceneAppoint">
              <el-col>
                <el-form-item label="支付：">
                  <span class="mr10">￥{{appoint.serviceOrder.totalPrice.toFixed(2)}}</span>
                  <em class="mr10 lab green" v-if="appoint.serviceOrder.isPaid">已支付</em>
                  <em class="mr10 lab orange" v-if="!appoint.serviceOrder.isPaid">待支付</em>
                  <em class="mr10 lab green" v-if="appoint.insuranceType">医保</em>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" v-if="appoint.apptType === 1 && appoint.visitStatus !==2 && isAllowToRegister && showModel !== 'cancel'">
              <el-col :span="24">
                <el-form-item>
                  <el-checkbox v-model="isChangeNumber" :disabled="appoint.organId !== storage.getLocalStorage('CLINICID')">转挂号</el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item>
                  <div style="padding: 20px 0;" v-if="showModel === 'cancel'">
                    <el-button type="primary"  size="small" @click="submitCannel" :disabled="isSubmit">{{isSubmit ? '取消中' : '确定'}}</el-button>
                    <el-button type="" size="small" @click="show=false">取消</el-button>
                  </div>
                  <div style="padding: 20px 0;" v-if="showModel === 'update'">
                    <template v-if="appoint.appointmentState === 0">
                      <el-button type="primary" size="small" @click="toExamine">通过审核</el-button>
                    </template>
                    <template v-else>
                      <el-button type="primary" size="small" @click="toPay" v-if="isExistCharge && isPay && isChangeNumber">结算</el-button>
                      <!--<el-button type="primary" size="small" @click="continuePay" v-else-if="isExistCharge && isPay && !appoint.serviceOrder.isPaid">支付</el-button>-->
                      <el-button type="primary"  size="small" @click="submitAppoint" :disabled="isSubmit || !isAllowChange" v-else>{{isSubmit ? '更新中' : '确定'}}</el-button>
                    </template>
                    <el-button type="primary"  size="small" plain v-if="(appoint.appointmentState === 0 || appoint.appointmentState === 1 || appoint.appointmentState === -2) && appoint.organId === storage.getLocalStorage('CLINICID')" @click="cannelAppoint('预约')">取消预约</el-button>
                    <el-button type="" size="small" @click="show=false">关闭</el-button>
                  </div>
                  <div style="padding: 20px 0;" v-if="showModel === 'info'">
                      <el-button type="primary" size="small" @click="toPay" v-if="isExistCharge && isPay && isChangeNumber">结算</el-button>
                      <!--<el-button type="primary" size="small" @click="continuePay" v-else-if="isExistCharge && isPay && !appoint.serviceOrder.isPaid">支付</el-button>-->
                      <el-button type="primary" size="small" v-if="appoint.organId === storage.getLocalStorage('CLINICID')" @click="cannelAppoint('挂号')">退号</el-button>
                    <el-button type="" size="small" @click="show=false">关闭</el-button>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div slot="reference" class="area" :style="{display: inline ? 'inline-block': 'block'}">
      <slot></slot>
    </div>
  </el-popover>
</template>
<script>
import api from '@/arrange/store/appointmentapi'
import sobapi from '@/sob/store/serviceapi'
import { APPOINT_STATUS } from '@/util/common'
import { getMacAddress } from '@/rcm/store/otmdiscomponent/insurancesignin.js'
import { validatePhone } from '@/util/validate'
import storage from '@/util/storage'
export default {
  props: ['appointId', 'patient', 'isShow', 'firstPannel', 'inline'],
  data () {
    return {
      api,
      sobapi,
      storage,
      show: false,
      showModel: '',
      isSubmit: false,
      sendMessage: true,
      appoint: '',
      isHaveTaochan: false,
      isChangeNumber: false,
      isAllowChange: true,
      warnMessage: '',
      servicePrice: 0,
      recordBookPrice: 0,
      jiuZhenCardPrice: 0,
      discountCard: { id: 0, name: '无折扣' },
      serviceSetList: [],
      discountList: [],
      stateStyle: APPOINT_STATUS,
      predefineColors: [
        '#8703da',
        '#0312DA',
        '#A05B00',
        '#0F92BD',
        '#5EAA45'
      ],
      form: {
        id: '',
        isSceneAppoint: 0,
        date: '',
        startTimeStr: '',
        endTimeStr: '',
        timeLength: 40,
        organId: '',
        organName: '',
        deptId: '',
        deptName: '',
        resourceId: '',
        resourceName: '',
        jiuZhenCard: 0,
        medicalRecordBook: 0,
        patient: {
          name: '',
          sex: '1',
          birthday: '',
          mobile: ''
        },
        showStyle: '',
        isSmsRemind: 0,
        symptom: '',
        cancelReason: ''
      },
      useRules: '',
      isExistCharge: '',
      patientRules: [],
      rules: {
        optional: [
          { required: false }
        ],
        required: [
          { required: true, message: '必填项', trigger: ['change'] }
        ],
        checkMobile: [
          { required: false, validator: validatePhone, trigger: ['change'] }
        ]
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      settlementInfo: '',
      appointmentInfo: '',
      cancelText: '预约',
      visitType: ''
    }
  },
  watch: {
    'isShow' (val) {
      this.show = val
    },
    'show' (val) {
      if (val) {
        if (this.firstPannel) {
          this.showModel = this.firstPannel
        }
        this.isChangeNumber = false
        this.isExistCharge = false
        this.sendMessage = true
        this.setPatientRules()
        this.getAppoint()
        this.$bus.$emit('appoint:showinfo', true)
      } else {
        this.isHaveTaochan = false
        this.showModel = ''
      }
      this.isSubmit = false
      this.$emit('update:isShow', val)
    },
    'appoint' (val) {
      this.form = Object.assign(this.form, {
        id: val.id,
        isSceneAppoint: val.isSceneAppoint,
        date: val.dateStr,
        startTimeStr: val.startTimeStr,
        endTimeStr: val.endTimeStr,
        timeLength: this._timeLength,
        organId: val.organId,
        organName: val.organName,
        deptId: val.deptId,
        deptName: val.deptName,
        resourceId: val.resourceId,
        resourceName: val.resourceName,
        serviceId: val.serviceId,
        serviceName: val.serviceName,
        patient: val.patient,
        showStyle: val.showStyle,
        isSmsRemind: 0,
        registerTypeCode: val.registerTypeCode,
        appointWayCode: val.appointWayCode,
        registerWayCode: val.registerWayCode,
        insuranceType: val.insuranceType,
        subsequentVisit: val.subsequentVisit,
        jiuZhenCard: 0,
        discount: '',
        benefitId: '',
        medicalRecordBook: 0,
        shopSetItemId: -1,
        dataSource: 'Super_Appt',
        symptom: val.symptom || val.patient.appointRemark
      })
      if (val.appointmentState !== 0 && val.appointmentState !== 1 && val.appointmentState !== -2) {
        this.showModel = 'info'
      } else {
        this.showModel = 'update'
      }
      if (['1', '4', '5', '6', '7', '11', '12'].includes(val.registerTypeCode)) {
        this.visitType = '门诊'
      }
      if (['2', '21', '22'].includes(val.registerTypeCode)) {
        this.visitType = '急诊'
      }
      if (['3', '31', '32', '33'].includes(val.registerTypeCode)) {
        this.visitType = '体检'
      }
      if (['99'].includes(val.registerTypeCode)) {
        this.visitType = '其他'
      }
      this.getServicePrice()
      this.getIsTaoChan(val.patient.id)
    },
    'sendMessage' (val) {
      if (!val) {
        this.form.isSmsRemind = 0
      }
    },
    'isChangeNumber' (val) {
      this.form.isSceneAppoint = val ? 1 : 0
      this.sendMessage = !val
    },
    'discountCard' (val) {
      this.form.discount = val ? val.value : 100
      this.form.benefitId = val ? val.id : ''
    },
    'form.medicalRecordBook' (val) {
      if (!val) {
        this.recordBookPrice = 0
      } else {
        this.getItemPrice('bingliben').then(price => {
          this.recordBookPrice = price
        })
      }
    },
    'form.jiuZhenCard' (val) {
      if (!val) {
        this.jiuZhenCardPrice = 0
      } else {
        this.getItemPrice('jiuzhenka').then(price => {
          this.jiuZhenCardPrice = price || 0
        })
      }
    },
    'appointmentInfo' (val) {
      this.$bus.$off('pay:success')
      this.$bus.$on('pay:success', action => {
        if (this.sendMessage && !this.form.isSmsRemind) {
          this.$bus.$emit('appoint:sendsms', val)
        }
        if (action === 'update') {
          this.$messageTips(this, 'success', '预约/挂号已变更', '提示')
        }
        if (action === 'cancel') {
          this.$messageTips(this, 'success', '预约/挂号已取消', '提示')
        }
        this.$bus.$emit('appoint:success', val, action)
      })
    }
  },
  created () {
    if (this.firstPannel) {
      this.showModel = this.firstPannel
    }
    this.$bus.$on('onError', val => {
      this.isSubmit = false
    })
  },
  methods: {
    getAppoint () {
      this.api.getAppointData({ id: this.appointId }).then(rs => {
        this.appoint = rs.data
        if (!this.appoint.showStyle) {
          this.appoint.showStyle = 4
        }
        this.setAllowChange()
        this.setUseRules()
      })
    },
    handleCommand (val) {
      this.form.showStyle = val
      this.setColor(val)
    },
    setColor (val) {
      if (this.showModel === 'info') {
        this.api.updateShowStyle({ id: this.appoint.id, showStyle: this.form.showStyle }).then(rs => {
          this.$bus.$emit('appoint:success', true)
        })
      }
    },
    closePopover () {
      this.show = false
      this.$emit('close', true)
    },
    setendTimeStr () {
      if (this.form.startTimeStr && this.form.timeLength) {
        let endTime = this.$moment(this.form.date + ' ' + this.form.startTimeStr).add(this.form.timeLength, 'm').format('HH:mm')
        this.form.endTimeStr = endTime
      }
    },
    submitAppoint () {
      let submitform
      if (this.showModel === 'pay') {
        submitform = this.$refs.payform
      } else {
        submitform = this.$refs.form
      }
      return submitform && submitform.validate(valid => {
        if (!valid) {
          return false
        }
        this.isSubmit = true
        this.setendTimeStr()
        let request = this.isChangeNumber ? this.api.changeAppoint : this.api.updateAppoint
        if (this.form.patient.mobile) {
          this.addAppointEvent(request)
          return false
        }
        if (this.sendMessage) {
          this.$prompt('请输入手机号码', '提示', {
            closeOnClickModal: false,
            confirmButtonText: '确定',
            cancelButtonText: '暂不填写',
            inputPattern: /^1(3|4|5|7|8)\d{9}$/,
            inputErrorMessage: '手机号码格式错误'
          }).then(({ value }) => {
            this.form.patient.mobile = value
            this.addAppointEvent(request)
          }).catch(() => {
            this.sendMessage = false
            this.addAppointEvent(request)
          })
        } else {
          this.$confirm('尚未填写手机号码，是否确认建档并且继续挂号？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.addAppointEvent(request)
          }).catch(() => {
            this.isSubmit = false
            return false
          })
        }
      })
    },
    addAppointEvent (request) {
      request(this.form).then(rs => {
        rs.data.appointmentInfo.patient = this.appoint.patient
        this.show = false
        this.isSubmit = false
        this.appointmentInfo = rs.data.appointmentInfo
        this.settlementInfo = rs.data.settlementInfo
        if (this.isPay && this.settlementInfo && Object.keys(this.settlementInfo).length) {
          this.settlementInfo.action = 'udpate'
          this.$bus.$emit('appoint:pay', this.settlementInfo)
          return false
        } else if (this.sendMessage && !this.form.isSmsRemind) {
          this.$bus.$emit('appoint:sendsms', this.appointmentInfo)
        }
        this.$messageTips(this, 'success', '预约已更新', '提示')
        this.$bus.$emit('appoint:success', this.appointmentInfo, 'update')
      })
    },
    continuePay () {
      this.api.getSettlementInfo({ id: this.appoint.id, returnFlag: 0 }).then(rs => {
        this.settlementInfo = rs.data
        if (this.isPay && this.settlementInfo && Object.keys(this.settlementInfo).length) {
          this.settlementInfo.action = 'pay'
          this.$bus.$emit('appoint:pay', this.settlementInfo)
          return false
        }
      })
    },
    cannelAppoint (text) {
      this.cancelText = text || '预约'
      this.showModel = 'cancel'
      this.sendMessage = false
      console.log(this.form)
    },
    submitCannel () {
      this.$refs.form.validate(valid => {
        if (!valid) {
          this.isSubmit = false
          return false
        }
        this.isSubmit = true
        let macId = storage.getLocalStorage('macId')
        if (this.appoint.insuranceType !== 1) {
          this.submitCannelEvent('')
        } else if (macId) {
          this.submitCannelEvent(macId)
        } else {
          getMacAddress().then(mac => {
            this.submitCannelEvent(mac.data)
          })
        }
      })
    },
    submitCannelEvent (macId) {
      this.api.cannelAppoint({
        id: this.form.id,
        macId: macId,
        cancelReason: this.form.cancelReason
      }).then(rs => {
        this.show = false
        this.isSubmit = false
        this.appointmentInfo = rs.data.appointmentInfo
        this.settlementInfo = rs.data.settlementInfo
        if (this.settlementInfo && Object.keys(this.settlementInfo).length) {
          this.settlementInfo.action = 'cancel'
          this.settlementInfo.isRefund = 1
          this.$bus.$emit('appoint:pay', this.settlementInfo)
          return false
        } else if (this.sendMessage && !this.form.isSmsRemind) {
          this.$bus.$emit('appoint:sendsms', this.appoint)
        }
        this.$bus.$emit('appoint:success', this.appointmentInfo, 'cancel')
        this.$messageTips(this, 'success', '预约已取消', '提示')
      })
    },
    editAppoint () {
      this.showModel = 'update'
      this.sendMessage = true
    },
    openEditModel () {
      if (this.appoint.insuranceType) {
        this.$messageTips(this, 'warning', '该患者为医保患者，请退号后重新挂号')
        return false
      }
      this.show = false
      this.$bus.$emit('appoint:edit', this.appoint)
    },
    getBusiInsurColor (val) {
      if (val.busiInsurAllExpire) {
        return 'gray'
      } else if (val.busiInsurExpire) {
        return 'red'
      } else {
        return 'green'
      }
    },
    getBusiSupplInsurColor (val) {
      if (val.busiSupplInsurAllExpire) {
        return 'gray'
      } else if (val.busiSupplInsurExpire) {
        return 'red'
      } else {
        return 'green'
      }
    },
    getServicePrice () {
      if (!this.appoint.serviceId || !this.appoint.organId) {
        this.servicePrice = 0
        return false
      }
      this.api.getServicePrice(
        this.appoint.organId,
        this.appoint.serviceId,
        this.appoint.serviceName
      ).then(rs => {
        if (!rs.data || !rs.data.itemPriceList || !rs.data.itemPriceList[0]) {
          this.servicePrice = 0
          return false
        }
        this.servicePrice = rs.data.itemPriceList[0].price
      })
    },
    getItemPrice (code) {
      return this.sobapi.listByCode({ code: code }).then(rs => {
        if (!rs.head.errCode && rs.data) {
          return this.api.getServicePrice(
            this.appoint.organId,
            rs.data.id,
            rs.data.name
          ).then(rs => {
            return !rs.head.errCode && rs.data.itemPriceList[0].price ? rs.data.itemPriceList[0].price : 0
          })
        } else {
          return 0
        }
      })
    },
    getIsTaoChan (val) {
      this.api.getOrderSet({ patientId: val }).then(rs => {
        this.isHaveTaochan = rs.data && rs.data[0]
      })
    },
    setPatientRules () {
      this.api.getPatientParams({ type: this.appoint.apptType === 1 ? 6 : 2 }).then(rs => {
        this.patientRules = rs.data
      })
    },
    setUseRules () {
      this.api.getUseRules({
        organId: this.appoint.organId,
        deptType: 1,
        deptId: this.appoint.deptId,
        resourceId: this.appoint.resourceId,
        resourceType: 'DOCTOR',
        serviceId: this.appoint.serviceId
      }).then(rs => {
        this.isExistCharge = rs.data.isExistCharge
        this.useRules = rs.data.normalCustomerRuleDetail
      })
    },
    getPatientServiceSet () {
      this.serviceSetList = []
      if (this.form.patient.id && this.form.deptId && this.form.serviceId) {
        this.api.getServiceSetList({
          patientId: this.form.patient.id,
          dptId: this.dept.deptId,
          serviceId: this.service.serviceId
        }).then(rs => {
          if (rs.head.errCode || !rs.data) {
            this.form.shopSetItemId = -1
            return false
          }
          this.serviceSetList = rs.data
        })
      } else {
        this.form.shopSetItemId = -1
      }
    },
    getDiscountList () {
      if (this.form.patient.id && this.form.serviceId) {
        this.api.getPatientDiscounts({ patientId: this.form.patient.id, itemId: this.form.serviceId }).then(rs => {
          if (!rs.head.errCode && rs.data[0]) {
            this.discountList = rs.data.map(item => {
              item.name = (item.discount / 10).toFixed(1) + '折'
              item.value = item.discount
              item.id = item.patientBenefitId
              return item
            })
          }
        })
      }
    },
    toPay () {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }
        this.showModel = 'pay'
      })
    },
    toExamine () {
      this.api.confirmAppoint({ id: this.appoint.id }).then(rs => {
        this.$messageTips(this, 'success', '预约审核成功', '提示')
        this.$bus.$emit('appoint:success', this.appointmentInfo, 'examine')
      })
    },
    setAllowChange () {
      if (!this.appoint) {
        return false
      }
      if (this.appoint.benefitId || (this.appoint.shopSetItemId && this.appoint.shopSetItemId !== '-1')) {
        this.warnMessage = '因原预约已使用套餐或其他优惠减免，不允许变更此号，请取消原预约后重新预约新号。'
        this.isAllowChange = false
      } else if (this.appoint.serviceOrder && !this.appoint.serviceOrder.isPaid) {
        this.warnMessage = '此次预约/挂号未支付，不允许变更此号，如需变更请先取消后重新预约新号。'
        this.isAllowChange = false
      } else {
        this.isAllowChange = true
      }
    },
    returnNumberForm () {
      this.showModel = 'update'
    }
  },
  computed: {
    _timeLength () {
      let startTime = new Date(this.appoint.dateStr + ' ' + this.appoint.startTimeStr).getTime()
      let endTime = new Date(this.appoint.dateStr + ' ' + this.appoint.endTimeStr).getTime()
      let diff = Math.floor((endTime - startTime) / 1000 / 60)
      return diff
    },
    discountPrice () {
      if (this.form.discount !== '' && this.servicePrice) {
        return (this.servicePrice - this.servicePrice * this.form.discount / 100).toFixed(2)
      } else {
        return '0.00'
      }
    },
    currentPrice () {
      if (this.form.shopSetItemId !== -1) {
        return 0
      } else {
        return this.servicePrice
      }
    },
    isAllowToRegister () { // 是否允许转挂号
      if (!this.appoint || !this.appoint.orderId || !this.appoint.serviceOrder || this.appoint.serviceOrder.isPaid || !this.useRules || !this.useRules.applyAppointmentRule.isPay || this.useRules.applyAppointmentRule.payOption !== 1) {
        return true
      } else {
        return false
      }
    },
    isPay () { // 是否需要支付
      if (!this.appoint || !this.useRules) {
        return false
      } else if (this.isChangeNumber && this.appoint.dateStr !== this.$moment().format('YYYY-MM-DD')) {
        return this.useRules.formalAppointmentRule.isPay && this.useRules.formalAppointmentRule.payOption === 1
      } else if (this.isChangeNumber && this.appoint.dateStr === this.$moment().format('YYYY-MM-DD')) {
        return this.useRules.receptionRule.isPay && this.useRules.receptionRule.payOption === 1
      } else if (this.appoint.orderId && this.appoint.serviceOrder && this.appoint.dateStr !== this.$moment().format('YYYY-MM-DD')) {
        return this.useRules.formalAppointmentRule.isPay && this.useRules.formalAppointmentRule.payOption === 1 && !this.appoint.serviceOrder.isPaid
      } else if (this.appoint.orderId && this.appoint.serviceOrder && this.appoint.dateStr === this.$moment().format('YYYY-MM-DD')) {
        return this.useRules.receptionRule.isPay && this.useRules.receptionRule.payOption === 1 && !this.appoint.serviceOrder.isPaid
      } else {
        return false
      }
    }
  }
}
</script>

<style scoped>
  .area {height: 100%;}
  .mainbox { min-height: 380px; overflow: auto;}
  .mainbox .el-form-item {margin-bottom: 7px; font-size: 14px; color: #000; }
  .mainbox .el-form-item p {margin: 0; padding: 0 12px 0 0;}
  .mainbox /deep/ .el-form-item__label {color: #999;}
  .mainbox /deep/ .el-form-item__content {line-height: 32px;}
  .title{text-align:center; font-size: 18px; padding: 10px 0;}
  .patient{padding-top: 10px;}
  .patient ul{padding: 0; margin: 0; list-style: none; line-height: 33px;}
  .patient ul li .userlab {background: #000; color: #FFE018;}
  .patient ul li label{color: #1c7bef;}
  .el-icon-loading {font-size: 24px; position: absolute; left: 50%; margin-left: -12px; top: 50%; margin-top: -12px;}
  
  .fontblue {color: #1c7bef;}
  .colors{cursor: pointer;}
  .color {display: inline-block; padding: 0; width: 14px; height: 14px; border-radius: 50%; cursor: pointer;}
  .currclolr {display: inline-block; width: 14px; height: 14px; position: relative; border-radius: 50%;}
  .colors .el-icon-arrow-down {vertical-align: middle; position: relative; top: -3px; margin-left: 0;}
  .popperitem {width: 240px; padding: 0 10px;}

  .el-popper .gray{color: #999;}
  .el-form-item .fontred{color: #ee4433; font-size: 14px;}
  .el-form-item .fontgreen{color: #00B636; font-size: 14px;}
  .el-form-item .el-icon-warning{color: #ee4433; line-height: inherit;margin-right: 5px;}
  .el-form-item em{font-style: normal;}
  .editing {position: absolute; left: 0; right: 0; top: 0; background: #FFD7D7; text-align: center; height: 55px; line-height: 55px; z-index: 999;}
  .mainbox /deep/ .el-dialog__header{padding: 0;}
  .mainbox /deep/ .el-dialog__body {padding: 0; }
  .mainbox .el-form-item {margin-bottom: 0;}
  .mainbox .el-form /deep/ .el-form-item__label {height: 40px;}
  .mainbox .el-form /deep/ .el-form-item__content {line-height: 40px; min-height: 40px;}
  .mainbox .right {border-left: 1px solid #ddd; min-height: 500px; background: #f2f2f2;}
  .mainbox .wrap {box-shadow: 0 5px 5px 0 #D8D8D8}
  .mainbox .wrap > .el-col {padding: 20px;}
  .mainbox .btline {border-bottom: 1px solid #D8D8D8; min-height: 40px;}
  .mainbox .fontblue {color: #1C7BEF;}
  .mainbox .fontgray {color: #AAAAAA;}
  .mainbox .lab {display: inline-block; height: 20px; line-height: 20px; font-size: 12px; color: #fff; font-style: normal; padding: 0 5px; border-radius: 2px; text-align: center;}
  .mainbox .lab.blue {background: #1c7bef;}
  .mainbox .lab.green {background: #61a812;}
  .mainbox .lab.yellow {background: #E6E3B4;height: 18px; line-height: 18px; border:1px solid #CFCC9E; color: #575100;}
  .mainbox .lab.orange {background: #e38748;}
  .mainbox .lab.red {background: #ee4433;}
  .mainbox .lab.violet {background: #bd10e0;}
  .mainbox .lab.gray {background: #666666;}
  .mainbox .lab.deepblue {background: #366298;}
  .mainbox .input-title{padding: 0 10px; height: 32px; line-height: 32px; position: relative; top:3px; background:#C0CCD9 ; border-radius: 5px 5px 0 0;}
  .mainbox .icon-login-password {font-size: 120px; position: absolute; left: 120px; top: 120px; color: #999;}
</style>
