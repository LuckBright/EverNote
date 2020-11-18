<template>
  <div>
    <el-dialog
    title=""
    id="dialogFast"
    :visible.sync="showDialog"
    :show-close="false"
    :close-on-click-modal="false"
    :append-to-body="true"
    width="820px">
    <el-row v-if="showDialog" class="main">
      <el-col :span="11">
        <el-form label-width="92px" ref="headpatient" key="headpatient">
          <el-form-item label="">
            <el-row>
              <el-col :span="24" align="right">
                <el-button type="primary" plain size="mini" class="addbutton" @click="createPatient">新建档案</el-button>
              </el-col>
            </el-row>
            <!--
            <el-radio-group v-model="patientType">
              <el-radio :label="1">已建档患者</el-radio>
              <el-radio :label="0">新建档患者</el-radio>
            </el-radio-group>
            -->
          </el-form-item>
        </el-form>
        <el-alert
          v-if="isShowWarning"
          class="mb10"
          center
          :closable="false"
          :title="warningText"
          type="error">
        </el-alert>
        <el-form :model="form.patient" ref="oldpatient" key="oldpatient" label-width="92px" v-if="patientType">
          <el-form-item label="患者：" prop="id" :rules="rules.patient">
            <div class="btline">
              <ever-patient-select
                size="small"
                v-model.trim="patientName"
                :get-membercard-flag="true"
                :allow-create="true"
                :grey-denies-dialog-show="true"
                :insurance-org-id="insuranceOrg.id"
                :show-attr-type="false"
                :scence="0"
                @medicalInfo="setMedicalInfo"
                @memberdata="selectPatient"
              ></ever-patient-select>
            </div>
          </el-form-item>
          <el-form-item label="性别：">
            <div class="btline">
              <span v-if="form.patient.sex">{{form.patient.sex | formatSex}}</span>
              <span v-else>--</span>
            </div>
          </el-form-item>
          <el-form-item label="出生日期：">
            <div class="btline">
              <span>{{form.patient.birthday ? $moment(form.patient.birthday).format('YYYY-MM-DD') : '--'}}</span>
              <span class="ml10">{{form.patient.ageShowText}}</span>
            </div>
          </el-form-item>
          <el-form-item label="手机号：">
            <div class="btline">{{form.patient.mobile || '--'}}</div>
          </el-form-item>
          <el-form-item label="身份证号：">
            <div class="btline">{{form.patient.idNo || '--'}}</div>
          </el-form-item>
          <el-form-item label="就诊卡号：">
            <div class="btline">{{form.patient.visitCards | formatVisitNo}}</div>
          </el-form-item>
          <el-form-item label="患者标签：">
            <div class="btline">
              <template v-if="isHaveTaochan">
                <em class="mr10 lab green">套餐</em>
              </template>
              <template v-if="form.patient.busiInsur">
                <a
                  :class="getBusiInsurColor(form.patient.busiInsur)"
                  :href="$ever.crmIndex + '/crm/memberinfo/userinfo/userinsuranceinfo/' + form.patient.id"
                  target="_blank"
                  class="lab"
                  v-if="form.patient.busiInsur.busiInsurFlag">
                  商保
                </a>
                <a
                  :href="$ever.crmIndex + '/crm/memberinfo/userinfo/userinsuranceinfo/' + form.patient.id"
                  target="_blank"
                  class="ml10 lab"
                  :class="getBusiSupplInsurColor(form.patient.busiInsur)"
                  v-if="form.patient.busiInsur.busiSupplInsurFlag">
                  商补
                </a>
              </template>
              <template v-if="form.patient.member && form.patient.member.objLabelList">
                <em class="mr10 lab red" :style="{background: item.color}" v-for="(item, i) in form.patient.member.objLabelList" :key="i">{{item.labelName}}</em>
              </template>
              <template v-if="noLabels">--</template>
            </div>
          </el-form-item>
          <el-form-item label="患者身份：">
            <div class="btline">
              <label v-if="!form.patient.benefit">--</label>
              <template v-else>
                <em class="mr10 lab yellow" v-for="(item, i) in form.patient.benefit.split(',')" :key="i">{{item}}</em>
              </template>
            </div>
          </el-form-item>
          <el-form-item label="预约提示：">
            <div class="btline">{{form.patient.appointRemind || '--'}}</div>
          </el-form-item>
        </el-form>
        <!--
        <el-form :model="newPatient" ref="newpatient" key="newpatient" label-width="92px" v-else>
          <el-form-item label="">
            <div class="input-title">创建临时档案</div>
          </el-form-item>
          <el-form-item label="姓名：" prop="name" :rules="rules.required">
            <div class="btline">
              <el-input v-model.trim="newPatient.name" :disabled="isShowWarning || isReadIdNo" @change="setRepeatPatientName" size="small">
                <template slot="suffix">
                  <idcard-read @getData="getIdcardData"></idcard-read>
                </template>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item label="身份证号：" prop="idNo" :rules="!patientRules.includes('idNo') ? rules.optionalCardId : rules.checkCardId">
            <div class="btline">
              <el-input v-model.trim="newPatient.idNo" size="small" :disabled="isReadIdNo"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="性别：" prop="sex" :rules="!patientRules.includes('sex') ? rules.optional : rules.required">
            <div class="btline">
              <el-radio-group v-model="newPatient.sex" :disabled="isShowWarning || isReadIdNo || isValidIdNo">
                <el-radio label="1">男</el-radio>
                <el-radio label="2">女</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item label="出生日期：" prop="birthday" :rules="!patientRules.includes('birthday') ? rules.optional : rules.required">
            <div class="btline">
              <age v-model="newPatient.birthday" :disabled="isShowWarning || isReadIdNo || isValidIdNo"></age>
            </div>
          </el-form-item>
          <el-form-item label="手机号码：" prop="mobile" :rules="!patientRules.includes('mobile') ? rules.optionalMobile : rules.checkMobile">
            <div class="btline">
              <el-input v-model="newPatient.mobile" size="small" :disabled="isShowWarning" placeholder="请输入手机号" prefix-icon="el-icon-phone-outline" class="el-date-editor" style="width: 100%"></el-input>
            </div>
          </el-form-item>
        </el-form>
        -->
      </el-col>
      <el-col :span="13" class="right">
        <el-form :model="form" ref="register" label-width="102px">
          <el-form-item label="初复诊：">
            <el-radio-group v-model="form.subsequentVisit">
              <el-radio :label="0">初诊</el-radio>
              <el-radio :label="1">复诊</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="科室：" prop="deptId" :rules="rules.required">
            <el-select size="small" v-model="selectDept" value-key="deptId" placeholder="请选择科室" @change="changeDept" style="width:100%" :clearable="false">
              <el-option v-for="(item, i) in arrangeDeptList" :key="i" :value="item" :label="item.deptName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="医生：" prop="resourceId" :rules="rules.required">
            <el-select size="small" v-model="selectResource" value-key="resourceId" placeholder="请选择医生" @change="changeResource" style="width:100%" :clearable="false">
              <el-option v-for="(item, i) in arrangeResourceList" :key="i" :value="item" :label="item.resourceName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务：" prop="serviceId" :rules="rules.required">
            <el-select size="small" v-model="selectService" :clearable="false" @change="changeService" value-key="serviceId" style="width:100%">
              <el-option v-for="(item, i) in arrangeServiceList" :key="i" :value="item" :label="item.serviceName || '科室号'"></el-option>
            </el-select>
          </el-form-item>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="挂号类别：" prop="registerTypeCode" :rules="rules.required">
                <sys-type code="CT05.10.004" :clearable="false" v-model="form.registerTypeCode" :multiple="false"></sys-type>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="就诊类型："><span>{{this.visitType}}</span></el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="挂号方式：" prop="registerWayCode" :rules="rules.required">
            <sys-type code="CT05.10.005" :clearable="false" v-model="form.registerWayCode" :multiple="false"></sys-type>
          </el-form-item>
          <el-form-item label="费别：">
            <el-select v-model="form.insuranceType" @change="changeInsuranceType" :disabled="!patientType" size="small" style="width:100%">
              <el-option label="自费" :value="0"></el-option>
              <el-option label="医保" :value="1"></el-option>
              <el-option label="商保" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="保险机构：" prop="useInsurance.insuranceOrgId" :rules="rules.required" v-if="form.insuranceType">
            <el-select size="small" v-model="insuranceOrg" value-key="id" style="width:100%" @change="changeInsuranceOrg" clearable>
              <el-option v-for="(item, i) in insuranceOrgList" :key="i" :label="item.insureOrgShortName" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="保险产品：" prop="useInsurance.insuranceProductId" :rules="rules.required" v-if="form.insuranceType"> 
            <el-select size="small" v-model="insuranceProduct" value-key="id" style="width:100%" @change="changeInsuranceProduct" clearable>
              <el-option v-for="(item, i) in insuranceProductList" :key="i" :label="item.productName" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="套餐及保障计划：">
            <el-select
              size="small"
              style="width:100%"
              :disabled="!!form.insuranceType"
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
          <el-form-item label="备注：">
            <el-input type="textarea" v-model="form.symptom" size="small" :maxlength="200" :rows="3"></el-input>
          </el-form-item>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="免单：">
                <el-switch
                  :disabled="!!form.insuranceType"
                  :active-value="1"
                  :inactive-value="0"
                  v-model="form.freeSheet">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="免单原因：">
                <el-input v-model="form.freeReason" :maxlength="200" size="small" placeholder="请输入免单原因" :disabled="!form.freeSheet"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="" class="mt10">
            <el-button type="primary" size="small" @click="submitQuicKRegister" :disabled="isSubmit || isShowWarning">挂号</el-button>
            <el-button type="primary" size="small" plain="" @click="closeDialog">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    </el-dialog>
    <create-patient ref="createpatient" page-type="2" @getArchivesObj="setCreatePatient"></create-patient>
    <select-patient :show.sync="isShowSelectPaitent" :name="repeatPatientName" @select="selectRepeatPatient"></select-patient>
    <paymethodstwo
    :dialogVisible.sync="payVisible"
    :obj="yzsParams"
    @payStatus="payStatus"
    @closedialog="closePayDialog"
    ></paymethodstwo>
  </div>
</template>

<script>
import { validatePhone, validateIden } from '@/util/validate'
import api from '@/arrange/store/appointmentapi'
import age from '@/components/age'
import selectPatient from '@/arrange/page/appoint/selectpatient.vue'
import IdcardRead from '@/components/readdevice/idcard/idcard'
import createPatient from '@/crm/components/createarchivesdialog.vue'
import storage from '@/util/storage'
import { everprint } from '@/util/print'
export default {
  props: ['show', 'organ', 'dept', 'resource', 'service'],
  components: { age, selectPatient, IdcardRead, createPatient },
  data () {
    return {
      api,
      showDialog: false,
      patientType: 1,
      isHaveTaochan: false,
      isShowPrice: false,
      isExistCharge: false,
      isShowWarning: false,
      isShowSelectPaitent: false,
      isReadIdNo: false,
      isValidIdNo: false,
      isSubmit: false,
      payVisible: false,
      warningText: '',
      patientValue: '',
      patientName: '',
      repeatPatientName: '',
      servicePrice: '',
      feeTypePrice: '',
      apolloValue: '',
      insuranceOrg: '',
      insuranceProduct: '',
      selectDept: '',
      selectResource: '',
      selectService: '',
      serviceSetList: [],
      arrangeServiceList: [],
      insuranceOrgList: [],
      insuranceProductList: [],
      arrangeDeptList: [],
      arrangeResourceList: [],
      patientRules: '',
      currentLogin: storage.getLocalStorage('CLINICID'),
      visitType: '门诊',
      newPatient: {
        id: '',
        name: '',
        sex: '',
        birthday: '',
        mobile: ''
      },
      form: {
        id: '',
        isSceneAppoint: 1,
        subsequentVisit: 0,
        date: this.$moment().format('YYYY-MM-DD'),
        organId: this.organ ? this.organ.organId : this.currentLogin,
        organName: this.organ ? this.organ.organName : '',
        deptId: this.dept ? this.dept.deptId : '',
        deptName: this.dept ? this.dept.deptName : '',
        apptType: 2,
        resourceId: this.resource ? this.resource.resourceId : '',
        resourceName: this.resource ? this.resource.resourceName : '',
        serviceId: this.service ? this.service.serviceId : '',
        serviceName: this.service ? this.service.serviceName : '',
        shopSetItemId: -1,
        settlementInfo: '',
        appointmentInfo: '',
        feeType: '',
        freeSheet: 0,
        freeReason: '',
        patientId: '',
        patientName: '',
        patient: {
          id: '',
          name: '',
          sex: '',
          birthday: '',
          mobile: '',
          // agebirthday: {
          //   age: '',
          //   birthday: ''
          // }
        },
        channelId: '',
        isSmsRemind: 0,
        showStyle: 4,
        symptom: '',
        discount: '',
        benefitId: '',
        jiuZhenCard: 0,
        medicalRecordBook: 0,
        isEmergency: 0,
        insuranceType: 0,
        registerTypeCode: '1',
        appointWayCode: '1',
        registerWayCode: '1',
        dataSource: 'Quick_Register',
        questionIds: [],
        useInsurance: {
          macId: '',
          cureType: 11,
          insuranceOrgId: '',
          insuranceOrgName: '',
          insuranceProductId: '',
          insuranceProductName: '',
          medPersonInfo: ''
        }
      },
      rules: {
        optional: [
          {required: false}
        ],
        patient: [
          { required: true, message: '请选择已建档患者', trigger: ['change', 'blur'] }
        ],
        required: [
          { required: true, message: '必填项', trigger: ['change'] }
        ],
        requiredArray: [
          { required: true, message: '必填项', trigger: ['change'], type: 'array' }
        ],
        requiredDate: [
          { required: true, message: '必填项', trigger: ['change'], type: 'date' }
        ],
        checkMobile: [
          {required: true, validator: validatePhone, trigger: ['change']}
        ],
        optionalMobile: [
          {required: false, validator: validatePhone, trigger: ['change']}
        ],
        checkCardId: [
          {required: true, validator: validateIden, trigger: ['change']}
        ],
        optionalCardId: [
          {required: false, validator: validateIden, trigger: ['change']}
        ]
      },
      yzsParams: {
        iscallback: true, // 外层loading
        loading: false,
        patientid: '', // 患者id
        id: '', // 结算单id
        orderId: '', // 订单ID
        settleCode: '', // 结算单号
        unexefee: 0, // 还需支付
        exefee: 0, // 已收金额
        totalFee: 0, // 总额
        payType: '4', // 0一站式挂号 1门诊 2住院(押金) 3商城(营销)5无处方结算写死的
        paymethodArr: [], // 支付方式
        isValited: false, // 押金是false,费用为true
        isDeposit: 0, // 是否押金(押金传1)
        isRefund: false,  // 是否退费(退费传true)
        isChange: false,
        visitNumber: '',
        medInsurPubPayFee: '',
        medInsurOwnPayFee: ''
      },
      deptParams: {
        status: 'Y',
        orgIdList: storage.getLocalStorage('CLINICID') ? [storage.getLocalStorage('CLINICID')] : [],
        type1CodeList: ['01'],
        type2CodeList: ['01.02', '01.03']
      },
      resourceParams: {
        everQueryType: 'out',
        typeCodeList: ['DOCTOR'],
        tenantSubjectIdList: this.dept ? [this.dept.deptId] : []
      }
    }
  },
  watch: {
    'show' (val) {
      this.showDialog = val
      if (val) {
        this.resetForm()
        this.getApolloConfig()
        this.getInsuranceOrg()
        this.getServicePrice()
        this.getArrangeDeptList()
      }
    },
    'showDialog' (val) {
      this.$emit('update:show', val)
    },
    'patientValue' (val) {
      this.form.patientId = val ? val.id : ''
      if (val) {
        this.form.symptom = val.appointRemark
      }
      this.form.patient = val || {
        id: '',
        name: '',
        sex: '',
        birthday: '',
        mobile: ''
      }
    },
    'patientName' (val) {
      if (!val) {
        this.patientValue = ''
      }
    },
    'patientType' (val) {
      if (!val) {
        this.form.insuranceType = 0
        let receptionRule = this.useRules.receptionRule
        let con = receptionRule && receptionRule.isAllow && receptionRule.isFormalDocument && receptionRule.documentPayRel !== 'OR'
        if (con) {
          this.warningText = '非正式建档患者，不可预约此号'
          this.isShowWarning = true
        }
      } else {
        this.warningText = ''
        this.isShowWarning = false
      }
    },
    'form.registerTypeCode' (val) {
      if (['1', '4', '5', '6', '7', '11', '12'].includes(val)) {
        this.visitType = '门诊'
      }
      if (['2', '21', '22'].includes(val)) {
        this.visitType = '急诊'
      }
      if (['3', '31', '32', '33'].includes(val)) {
        this.visitType = '体检'
      }
      if (['99'].includes(val)) {
        this.visitType = '其他'
      }
      this.form.useInsurance.cureType = val
    },
    'selectDept' (val) {
      this.form.deptId = val ? val.deptId : ''
      this.form.deptName = val ? val.deptName : ''
      if (val) {
        this.getArrangeResourceList()
      } else {
        this.arrangeResourceList = []
      }
    },
    'selectResource' (val) {
      this.form.resourceId = val ? val.resourceId : ''
      this.form.resourceName = val ? val.resourceName : ''
      if (val) {
        this.getArrangeServiceList()
      } else {
        this.arrangeServiceList = []
      }
    },
    'selectService' (val) {
      this.form.serviceId = val ? val.serviceId : ''
      this.form.serviceName = val ? val.serviceName : ''
      if (val) {
        this.setUseRules()
        this.getPatientServiceSet()
      }
    },
    'form.insuranceType' (val) {
      if (!val) {
        this.insuranceOrg = ''
        this.insuranceProduct = ''
        this.form.useInsurance = {
          macId: '',
          cureType: 11,
          insuranceOrgId: '',
          insuranceOrgName: '',
          insuranceProductId: '',
          insuranceProductName: ''
        }
      } else {
        this.form.freeSheet = 0
        this.form.shopSetItemId = -1
      }
      this.getInsuranceOrg()
    },
    'form.freeSheet' (val) {
      if (!val) {
        this.form.freeReason = ''
      }
    },
    'insuranceOrg' (val) {
      if (val) {
        this.getInsuranceProduct()
      } else {
        this.insuranceProductList = []
      }
      this.getServicePrice()
    },
    'newPatient.idNo' (val) {
      let submitform = this.$refs.newpatient
      return val && submitform && submitform.validateField('idNo', valid => {
        if (valid === '身份证格式不正确') {
          this.isValidIdNo = false
          return false
        }
        let myId = this.changeIdNo(val)
        if (myId.birthday && myId.sex) {
          this.newPatient.birthday = myId.birthday
          this.newPatient.sex = myId.sex
          this.isValidIdNo = true
        }
      })
    },
  },
  created () {
    this.$bus.$off('appointfast:pay')
    this.$bus.$on('appointfast:pay', val => {
      this.yzsParams.orderId = val.orderid || val.orderId
      this.yzsParams.patientid = val.patientid
      this.yzsParams.id = val.id
      this.yzsParams.accountbillId = val.accountbillId
      this.yzsParams.settleCode = val.settleCode
      this.yzsParams.unexefee = val.unexefee
      this.yzsParams.exefee = val.exefee
      this.yzsParams.totalFee = val.totalFee
      this.yzsParams.isRefund = val.isRefund
      this.yzsParams.visitNumber = val.visitNumber
      this.yzsParams.medInsurPubPayFee = val.medInsurPubPayFee
      this.yzsParams.medInsurOwnPayFee = val.medInsurOwnPayFee
      this.payVisible = true
      this.payAction = val.action
    })
    this.$bus.$off('fastpay:success')
    this.$bus.$on('fastpay:success', action => {
      this.$bus.$emit('appoint:question', this.appointmentInfo)
      this.$bus.$emit('appointfast:success', this.appointmentInfo, action)
    })
    this.$bus.$off('appointfast:success')
    this.$bus.$on('appointfast:success', (val, action) => {
      if (action === 'add') {
        this.$bus.$emit('yihu:autoAdmission', this.appointmentInfo)
        this.$messageTips(this, 'success', '挂号成功', '提示')
        this.showDialog = false
        this.resetForm()
      }
      /*
      if (typeof val === 'object' && val.isSceneAppoint) {
        this.print(val)
      }
      */
    })
    this.$bus.$on('onError', val => {
      this.isSubmit = false
    })
  },
  methods: {
    changeIdNo (IdNO) {
      let data = {
        birthday: '',
        sex: ''
      }
      let birthday = ''
      if (!IdNO) {
        return data
      }
      if (IdNO.length === 18) {
        birthday = IdNO.substr(6, 8)
        data.birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-')
        data.sex = IdNO.charAt(16) % 2 === 0 ? '2' : '1'
      } else if (IdNO.length === 15) {
        birthday = '19' + IdNO.substr(6, 6)
        data.birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-')
        data.sex = IdNO.charAt(14) % 2 === 0 ? '2' : '1'
      }
      return data
    },
    resetForm () {
      this.isSubmit = false
      this.isHaveTaochan = false
      this.isReadIdNo = false
      this.selectDept = this.dept
      this.selectResource = this.resource
      this.selectService = this.service
      this.patientValue = ''
      this.patientName = ''
      this.patientType = 1
      this.newPatient = {
        id: '',
        name: '',
        sex: '',
        birthday: '',
        mobile: '',
        idNo: ''
      }
      this.form = {
        id: '',
        isSceneAppoint: 1,
        subsequentVisit: 0,
        date: this.$moment().format('YYYY-MM-DD'),
        organId: this.organ ? this.organ.organId : this.currentLogin,
        organName: this.organ ? this.organ.organName : '',
        deptId: this.dept ? this.dept.deptId : '',
        deptName: this.dept ? this.dept.deptName : '',
        apptType: 2,
        resourceId: this.resource ? this.resource.resourceId : '',
        resourceName: this.resource ? this.resource.resourceName : '',
        serviceId: this.service ? this.service.serviceId : '',
        serviceName: this.service ? this.service.serviceName : '',
        shopSetItemId: -1,
        feeType: '',
        freeSheet: 0,
        freeReason: '',
        patientId: '',
        patientName: '',
        patient: {
          id: '',
          name: '',
          sex: '',
          birthday: '',
          mobile: ''
        },
        channelId: '',
        isSmsRemind: 0,
        showStyle: 4,
        symptom: '',
        discount: '',
        benefitId: '',
        jiuZhenCard: 0,
        medicalRecordBook: 0,
        isEmergency: 0,
        insuranceType: 0,
        registerTypeCode: '1',
        appointWayCode: '1',
        registerWayCode: '1',
        dataSource: 'Quick_Register',
        questionIds: [],
        useInsurance: {
          macId: '',
          cureType: 11,
          insuranceOrgId: '',
          insuranceOrgName: '',
          insuranceProductId: '',
          insuranceProductName: '',
          medPersonInfo: ''
        }
      }
      if (this.$refs.oldpatient) {
        this.$refs.oldpatient.resetFields()
      }
      if (this.$refs.newpatient) {
        this.$refs.newpatient.resetFields()
      }
      if (this.$refs.register) {
        this.$refs.register.resetFields()
      }
      this.setPatientRules()
    },
    selectPatient (val) {
      if (val.birthday) {
        val.birthday = this.$moment(val.birthday).format('YYYY-MM-DD')
      }
      this.patientValue = val
      this.form.patient = val
      this.form.symptom = val.appointRemark
      this.getIsTaoChan(val.id)
      this.getPatientServiceSet()
      this.getDiscountList()
      if (val.patientNumber === 'temporary') {
        let receptionRule = this.useRules.receptionRule
        let con = receptionRule.isAllow && receptionRule.isFormalDocument && receptionRule.documentPayRel !== 'OR'
        if (con) {
          this.warningText = '非正式建档患者，不可预约此号'
          this.isShowWarning = true
          return false
        }
      } else {
        this.warningText = ''
        this.isShowWarning = false
      }
      this.$refs.oldpatient.clearValidate()
    },
    createPatient () {
      this.$refs.createpatient.open()
    },
    setCreatePatient (val) {
      this.patientName = val.patient ? val.patient.name : val.name
      this.selectPatient(val.patient ? val.patient : val)
    },
    setUseRules () {
      if (!this.form.serviceId) {
        this.isExistCharge = false
        this.useRules = ''
        return false
      }
      this.api.getUseRules({
        organId: this.form.organId,
        deptType: 1,
        deptId: this.form.deptId,
        resourceId: this.form.resourceId,
        resourceType: 'DOCTOR',
        serviceId: this.form.serviceId
      }).then(rs => {
        this.isExistCharge = rs.data.isExistCharge
        this.useRules = rs.data.normalCustomerRuleDetail
        this.getIsShowPrice()
      })
    },
    setPatientRules () {
      this.api.getPatientParams({type: 2}).then(rs => {
        this.patientRules = rs.data
      })
    },
    getIsTaoChan (val) {
      if (val) {
        this.api.getOrderSet({patientId: val}).then(rs => {
          this.isHaveTaochan = rs.data && rs.data[0]
        })
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
          } else {
            this.discountList = []
            this.discountCard = {id: '', name: '无折扣'}
          }
        })
      }
    },
    getArrangeDeptList () {
      this.api.getArrangeDepts({
        orgId: this.currentLogin,
        startDate: this.form.date,
        endDate: this.form.date,
        categoryCode: 'OUTPATIENT_DOCTOR'
      }).then(rs => {
        if (rs.data && rs.data[0]) {
          this.arrangeDeptList = rs.data.map(item => {
            return {deptId: item.tenantDeptId, deptName: item.tenantDeptName}
          })
        }
      })
    },
    getArrangeResourceList () {
      this.api.getArrangeResource({
        orgId: this.currentLogin,
        startDate: this.form.date,
        endDate: this.form.date,
        tenantDeptId: this.selectDept.deptId,
        categoryCode: 'OUTPATIENT_DOCTOR'
      }).then(rs => {
        if (rs.data && rs.data[0]) {
          this.arrangeResourceList = rs.data.filter(item => {
            return item.serviceId !== '-1' || !item.serviceName
          })
        }
      })
    },
    getArrangeServiceList () {
      if (!this.form.deptId || !this.form.resourceId) {
        this.arrangeServiceList = []
        return false
      }
      this.api.getArrangeService({
        orgId: this.form.organId,
        startDate: this.form.date,
        endDate: this.form.date,
        tenantDeptId: this.form.deptId,
        resourceId: this.form.resourceId,
        categoryCode: 'OUTPATIENT_DOCTOR'
      }).then(rs => {
        if (rs.data && rs.data[0]) {
          this.arrangeServiceList = rs.data
          this.selectService = rs.data[0]
        }
      })
    },
    getServicePrice () {
      if (!this.form.serviceId || !this.form.organId) {
        this.servicePrice = 0
        return false
      }
      this.api.getServicePrice(
        this.form.organId,
        this.form.serviceId,
        this.form.serviceName,
        this.insuranceOrg.id
      ).then(rs => {
        if (!rs.data || !rs.data.itemPriceList[0]) {
          this.servicePrice = 0
          return false
        }
        this.servicePrice = rs.data.itemPriceList[0].price
      })
    },
    setMedicalInfo (val) {
      this.form.useInsurance.medPersonInfo = val
      this.form.useInsurance.macId = val.macId
    },
    getPatientServiceSet () {
      this.serviceSetList = []
      if (this.patientValue.id && this.selectDept.deptId && this.selectService.serviceId) {
        this.api.getServiceSetList({
          patientId: this.patientValue.id,
          dptId: this.selectDept.deptId,
          serviceId: this.selectService.serviceId
        }).then(rs => {
          if (rs.head.errCode || !rs.data) {
            this.serviceSetList = []
            this.form.shopSetItemId = -1
            return false
          }
          this.serviceSetList = rs.data
        })
      } else {
        this.serviceSetList = []
        this.form.shopSetItemId = -1
      }
    },
    getIsShowPrice () {
      if (!this.useRules) {
        return false
      }
      let receptionRule = this.useRules.receptionRule
      this.isShowPrice = true
      if (receptionRule.isPay && receptionRule.isFormalDocument && receptionRule.documentPayRel === 'OR') {
        this.isShowPrice = false
      }
    },
    changeDept (val) {
      this.selectResource = ''
    },
    changeResource (val) {
      this.selectService = ''
    },
    changeService (val) {
      return val
    },
    getApolloConfig () {
      this.api.getApolloValue({key: 'ARRANGE_FEIBIE', defaultValue: 1}).then(rs => {
        this.apolloValue = rs.data
        this.form.insuranceType = this.apolloValue === '1' ? 1 : 0
      })
    },
    changeInsuranceType () {
      this.insuranceOrg = ''
      this.insuranceProduct = ''
      this.form.useInsurance = {
        macId: '',
        cureType: 11,
        insuranceOrgId: '',
        insuranceOrgName: '',
        insuranceProductId: '',
        insuranceProductName: ''
      }
    },
    getInsuranceOrg () {
      if (!this.form.insuranceType) {
        this.insuranceOrgList = []
        return false
      }
      this.api.getInsuranceOrg({corpType: this.form.insuranceType === 2 ? 1 : 0}).then(rs => {
        this.insuranceOrgList = rs.data
        this.insuranceOrg = rs.data[0]
        this.changeInsuranceOrg(rs.data[0])
      })
    },
    getInsuranceProduct () {
      this.api.getInsuranceProduct({id: this.insuranceOrg.id}).then(rs => {
        this.insuranceProductList = rs.data
        this.insuranceProduct = rs.data[0]
        this.changeInsuranceProduct(rs.data[0])
      })
    },
    changeInsuranceOrg (val) {
      this.form.useInsurance.insuranceOrgId = val ? val.id : ''
      this.form.useInsurance.insuranceOrgName = val ? val.insureOrgShortName : ''
      this.insuranceProduct = ''
      this.changeInsuranceProduct()
    },
    changeInsuranceProduct (val) {
      this.form.useInsurance.insuranceProductId = val ? val.id : ''
      this.form.useInsurance.insuranceProductName = val ? val.productName : ''
    },
    closeDialog () {
      this.showDialog = false
    },
    setRepeatPatientName (val) {
      this.repeatPatientName = val
    },
    selectRepeatPatient (val) {
      if (!val || !val.id) {
        return false
      }
      this.patientType = 1
      this.$nextTick(_ => {
        this.patientName = val.name
        this.selectPatient(val)
      })
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
    submitQuicKRegister () {
      if (!this.patientType) {
        this.form.patient = this.newPatient
      }
      let patientForm = this.patientType ? this.$refs.oldpatient : this.$refs.newpatient
      patientForm.validate(valid => {
        if (!valid) {
          return false
        }
        return this.$refs.register.validate(isValid => {
          if (!isValid) {
            return false
          }
          this.isSubmit = true
          this.api.createQuickRegister(this.form).then(rs => {
            if (rs.data.checkResultVO && !rs.data.checkResultVO.passed) {
              this.$bus.$emit('appoint:error', rs.data.checkResultVO.message)
              return false
            }
            this.settlementInfo = rs.data.settlementInfo
            this.appointmentInfo = rs.data.appointmentInfo
            if (this.isShowPrice && this.isExistCharge && this.settlementInfo && Object.keys(this.settlementInfo).length) {
              this.settlementInfo.action = 'add'
              this.$bus.$emit('appointfast:pay', this.settlementInfo)
              return false
            }
            this.$bus.$emit('appointfast:success', this.appointmentInfo, 'add')
            this.isSubmit = false
          })
        })
      })
    },
    payStatus (val) {
      this.$bus.$emit('fastpay:success', this.payAction)
    },
    print (val) {
      let params = {queryApptNum: true}
      if (val.visitNumber) {
        params.visitNumber = val.visitNumber
      }
      if (val.patientId) {
        params.patientId = val.patientId
      }
      if (this.yzsParams.settleCode) {
        params.id = this.yzsParams.settleCode
      }
      if (this.yzsParams.orderId) {
        params.orderId = this.yzsParams.orderId
      }
      everprint('registform', params, {
        preview: true,
        cb: _ => {
          console.log('打印完成')
        }
      })
    },
    closePayDialog (val) {
      this.payVisible = false
      this.$messageTips(this, 'success', '挂号成功 (未支付)', '提示')
      this.resetForm()
    },
    getIdcardData (val) {
      if (!val || !val.idCode) {
        this.$messageTips(this, 'error', '请连接身份证读卡设备')
        return false
      }
      this.isReadIdNo = true
      this.newPatient.name = val.name
      this.newPatient.agebirthday = {
        birthday: this.$moment(val.birthday).format('YYYY-MM-DD')
      }
      if (val.sex === '男') {
        this.newPatient.sex = '1'
      } else if (val.sex === '女') {
        this.newPatient.sex = '2'
      }
      this.newPatient.idNo = val.idCode
    }
  },
  filters: {
    formatVisitNo (value) {
      if (!value || !value[0]) {
        return '--'
      }
      let strArr = value.map(val => {
        return val.no
      })
      return strArr.join('，')
    },
    formatAppointDate (value) {
      if (!value || !value[0]) {
        return ''
      }
      let week = ['日', '一', '二', '三', '四', '五', '六']
      let date = new Date(value)
      return value + ' 周' + week[date.getDay()]
    }
  },
  computed: {
    discountPrice () {
      if (this.form.discount !== '' && this.servicePrice) {
        return (this.servicePrice - this.servicePrice * this.form.discount / 100).toFixed(2)
      } else {
        return 0
      }
    },
    currentPrice () {
      if (this.form.shopSetItemId !== -1) {
        return 0
      } else {
        return this.servicePrice
      }
    },
    noLabels () {
      let noHaveBusiInsur = !this.form.patient.busiInsur || (!this.form.patient.busiInsur.busiInsurFlag && !this.form.patient.busiInsur.busiSupplInsurFlag)
      let noHaveLabels = !this.form.patient.member || !this.form.patient.member.objLabelList
      return !this.form.patient.id || (!this.isHaveTaochan && noHaveBusiInsur && noHaveLabels)
    },
    isAllowInsurance () {
      return this.currentLogin === this.form.organId
    }
  }
}
</script>

<style scoped>
  #dialogFast /deep/ .el-dialog__header{padding: 0;}
  #dialogFast /deep/ .el-dialog__body {padding: 0; }
  #dialogFast .el-form-item {margin-bottom: 0;}
  #dialogFast .el-form /deep/ .el-form-item__label {height: 40px;}
  #dialogFast .el-form /deep/ .el-form-item__content {line-height: 40px; min-height: 40px;}
  #dialogFast .right {border-left: 1px solid #ddd; min-height: 500px; background: #f2f2f2;}
  #dialogFast .main > .el-col {padding: 20px;}
  #dialogFast .btline {border-bottom: 1px solid #D8D8D8; min-height: 40px;}
  #dialogFast .fontblue {color: #1C7BEF;}
  #dialogFast .fontgray {color: #AAAAAA;}
  #dialogFast .lab {display: inline-block; height: 20px; line-height: 20px; font-size: 12px; color: #fff; font-style: normal; padding: 0 5px; border-radius: 2px; text-align: center;}
  #dialogFast .lab.blue {background: #1c7bef;}
  #dialogFast .lab.green {background: #61a812;}
  #dialogFast .lab.yellow {background: #E6E3B4;height: 18px; line-height: 18px; border:1px solid #CFCC9E; color: #575100;}
  #dialogFast .lab.orange {background: #e38748;}
  #dialogFast .lab.red {background: #ee4433;}
  #dialogFast .lab.violet {background: #bd10e0;}
  #dialogFast .lab.gray {background: #666666;}
  #dialogFast .lab.deepblue {background: #366298;}
  #dialogFast .input-title{padding: 0 10px; height: 32px; line-height: 32px; position: relative; top:12px; background:#C0CCD9 ; border-radius: 5px 5px 0 0;}
</style>
