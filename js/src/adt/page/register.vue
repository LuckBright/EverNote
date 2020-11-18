<template>
  <div class="register">
    <hospatient-list ref="hospatientlist" @showDetail="showDetail"></hospatient-list>
    <div class="otherarea" @click="togglePatientList">
      <el-button type="primary" @click="eazyCreateMember">快速建档</el-button>
      <div class="item-box">
        <el-divider content-position="left">
          <h4>基本信息</h4>
        </el-divider>
        <el-row>
          <el-col :span="24">
            <ever-form2
              :schema="titleSchema"
              v-model="titleModel"
              :rules="rules"
              ref="titleform"
              labelWidth="100px"
            >
              <div solt="default"></div>
              <template slot="inpatientNumber">
                <el-input
                  v-model="titleModel.inpatientNumber"
                  placeholder="病案号"
                  :disabled="isFirstDept !== 1"
                  @change="inpatientChange"
                ></el-input>
              </template>
            </ever-form2>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
          <el-col>
            <ever-form2
              :schema="querySchema"
              v-model="queryObj"
              ref="form"
              :is-query="true"
              labelWidth="100px"
            >
              <div solt="default"></div>
              <template slot="cureType">
                <ever-select
                  :options="cureTypeList"
                  v-model="queryObj.cureType"
                  :filterable="true"
                  :clearable="true"
                ></ever-select>
              </template>
              <template slot="insuranceCompanyId">
                <ever-select
                  :options="insuranceCompanySelect"
                  v-model="queryObj.insuranceCompanyId"
                  :filterable="true"
                  :clearable="true"
                ></ever-select>
              </template>
              <template slot="insuranceProductId">
                <ever-select
                  :options="insuranceProductIdSelect"
                  v-model="queryObj.insuranceProductId"
                  :filterable="true"
                  :clearable="true"
                ></ever-select>
              </template>
              <template slot="patientNumber">
                <!-- insuranceOrgId:医保机构Id -->
                <ever-patient-select
                  @select="selectCheck"
                  @medicalInfo="getMedicalInfo"
                  v-model="queryObj.patientNumber"
                  placeholder="查询客户档案号"
                  :insuranceOrgId="queryObj.insuranceCompanyId"
                  :allowCreate="true"
                  :hideNo="true"
                  :searchParam="{
                    'temporary': 1
                  }"
                ></ever-patient-select>
              </template>
              <template slot="button">
                <el-button @click="btnReset()" style="margin:0 0 0 10px;">重置</el-button>
              </template>
              <template slot="issync">
                <el-button @click="pullData()" style="margin:0 0 0 10px;" :disabled="isSync">同步医保信息</el-button>
              </template>
            </ever-form2>
          </el-col>
        </el-row>
        <patient-basic
          :id="patientId"
          :isBloodEdit="true"
          :value="userModel"
          ref="basicinfo"
          @formChange1="getBasicInfo"
        ></patient-basic>
      </div>
      <div class="item-box">
        <el-divider content-position="left">
          <h4>入院信息</h4>
        </el-divider>
        <el-row>
          <ever-form2
            :schema="hosSchema"
            v-model="hosModel"
            :rules="rules"
            ref="hosform"
            labelWidth="100px"
          >
            <div solt="default"></div>
            <template slot="admitDiagnosis">
              <sys-diagnosis
                :type="'1'"
                :value="diagnosisArr"
                :check="true"
                :key="Math.random()"
                @input="changeDiagnosis"
                ref="diagnosisRef"
              ></sys-diagnosis>
            </template>
            <template slot="admitTime">
              <el-date-picker
                v-model="hosModel.admitTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
              ></el-date-picker>
            </template>
            <template slot="admitDeptId">
              <ever-select
                :options="admitDeptIdSelect"
                v-model="hosModel.admitDeptId"
                @change="getWard"
                :placeholder="'入院科室'"
                :filterable="true"
                :clearable="true"
              ></ever-select>
            </template>
            <template slot="admitWardId">
              <ever-select
                :options="admitWardIdSelect"
                v-model="hosModel.admitWardId"
                :filterable="true"
                :clearable="true"
              ></ever-select>
            </template>
            <template slot="admitDoctorId">
              <ever-select
                :options="admitDoctorIdSelect"
                v-model="hosModel.admitDoctorId"
                :filterable="true"
                :clearable="true"
              ></ever-select>
            </template>
          </ever-form2>
        </el-row>
      </div>
      <div class="item-box">
        <el-divider content-position="left">
          <h4>押金信息</h4>
        </el-divider>
        <ever-form2
          :schema="depositSchema"
          v-model="depositModel"
          :rules="rules"
          ref="depositform"
          labelWidth="100px"
        >
          <div solt="default"></div>
        </ever-form2>
      </div>
      <div class="item-box">
        <el-divider content-position="left">
          <h4>其它信息</h4>
        </el-divider>
        <ever-form2
          :schema="otherSchema"
          v-model="otherModel"
          :rules="rules"
          ref="otherform"
          labelWidth="100px"
        >
          <template slot="introductionDeptId">
            <ever-select
              :options="introductionDeptIdSelect"
              v-model="otherModel.introductionDeptId"
              @change="getintroducer"
              :filterable="true"
              :clearable="true"
            ></ever-select>
          </template>
          <template slot="introducerId">
            <ever-select
              :options="introducerIdSelect"
              v-model="otherModel.introducerId"
              :filterable="true"
              :clearable="true"
            ></ever-select>
          </template>
          <template slot="source">
            <source-cascader v-model="otherModel.source" placeholder="请选择来源" ref="sourceRef"></source-cascader>
          </template>
          <div solt="default"></div>
        </ever-form2>
      </div>
      <el-row>
        <el-col :span="2">
          <el-button
            @click="submitCheck(['hosform', 'depositform'], false)"
            :disabled="!(isDisabled === 2 || isDisabled === 3)"
            :loading="loading"
          >保存信息</el-button>
        </el-col>
        <el-col :span="2">
          <el-button
            @click="submitCheck(['hosform', 'depositform'], true)"
            :disabled="!(isDisabled === 2)"
            :loading="loading"
          >入院登记</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="cancelBtn" :disabled="!(isDisabled === 3)" :loading="loading">取消登记</el-button>
        </el-col>
        <el-col :span="2" :offset="16">
          <el-button
            @click="deleteBtn"
            :disabled="!(isDisabled === 2 || isDisabled === 3)"
            :loading="loading"
          >退院</el-button>
        </el-col>
      </el-row>
      <pay-after-register :obj="payparams" @getdata="afterpay" :dialogVisible.sync="modalshow"></pay-after-register>
      <create-archives ref="createMember" :pageType="'4'" @getArchivesObj="getPatient"></create-archives>
      <el-dialog
        :visible.sync="checkVisible"
        width="30%">
        <el-table
          :data="tableData"
          border
          align="center"
          style="width: 100%">
          <el-table-column
            prop="content"
            label="校验内容"
            width="180">
          </el-table-column>
          <el-table-column
            prop="hospital"
            label="医院信息"
            width="180">
          </el-table-column>
          <el-table-column
            prop="medical"
            label="医保信息">
          </el-table-column>
          <el-table-column
            prop="check"
            label="校验结果">
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary"  @click="linkCrm">修改信息</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import hospatientList from './hospatientlist'
import patientBasic from '@/crm/components/patiententry_horizontal.vue'
import payAfterRegister from '@/rcm/page/pay/payhospitalization'
import insuranceSelect from '@/components/insuranceorgselect'
import sysDiagnosis from '@/components/medical/sys.diagnosis'
import createArchives from '@/crm/components/createarchivesdialog.vue'
import api from '@/adt/store/register'
import { insuranceQuery, insuranceQueryCall } from '@/rcm/store/otmdiscomponent/gd.localhost.api.js'
import { everprint } from '@/util/common'
import { formCheckPositiveInt } from '@/util/validate'
import SourceCascader from '@/crm/components/sourcecascader'
import { setTimeout } from 'timers'
import { getMacAddress } from '@/rcm/store/otmdiscomponent/insurancesignin.js'
import { adtJumpUrl } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
let querySchema = [
  {
    label: '保险机构',
    name: 'insuranceCompanyId',
    comp: 'custom',
    span: 4
  },
  {
    label: '保险产品',
    name: 'insuranceProductId',
    comp: 'custom',
    span: 4
  },
  {
    comp: 'div',
    style: 'height:36px',
    span: 16
  },
  {
    label: '患者档案号',
    name: 'patientNumber',
    comp: 'custom',
    props: {
      clearable: true,
      filterable: true
    },
    span: 4
  },
  {
    name: 'button',
    comp: 'custom',
    span: 1,
    labelWidth: '15px'
  },
  {
    name: 'issync',
    comp: 'custom',
    span: 3,
    labelWidth: '10px'
  },
  {
    label: '状态',
    name: 'status',
    comp: 'select',
    props: {
      disabled: true,
      placeholder: '状态',
      options: [
        { id: 2, name: '待入院' },
        { id: 3, name: '待入科' },
        {
          id: 4, name: '已入科'
        },
        {
          id: 5, name: '待转科'
        },
        {
          id: 6, name: '待出科'
        },
        {
          id: 7, name: '已出科'
        },
        {
          id: 8, name: '办理出院'
        },
        {
          id: 9, name: '出院已结算'
        },
        {
          id: 12, name: '退科'
        }
      ]
    },
    span: 4
  },
  {
    label: '体重',
    name: 'admitWeight',
    comp: 'ever-price',
    props: {
      placeholder: '请输入体重',
      append: 'kg',
      type: 'number'
    },
    span: 4
  },
  {
    label: '医疗类别',
    name: 'cureType',
    comp: 'custom',
    span: 4
  }
]
let titleSchema = [
  {
    label: '住院号',
    name: 'hospitalizedNumber',
    props: {
      placeholder: '住院号',
      disabled: true
    },
    span: 4
  },
  {
    label: '医保卡号',
    name: 'cardno',
    props: {
      placeholder: '患者医保卡号'
    },
    span: 4
  },
  {
    label: '健康卡号',
    name: 'healthCard',
    props: {
      placeholder: '健康卡号'
    },
    span: 4
  },
  {
    label: '病案号',
    name: 'inpatientNumber',
    comp: 'custom',
    span: 4
  },
  {
    label: '登记时间',
    name: 'admitRecordTime',
    comp: 'datePicker',
    props: {
      type: 'datetime',
      value: new Date().getTime(),
      disabled: true
    },
    span: 4
  }
]
let hosSchema = [
  {
    label: '付费方式',
    name: 'admitPaymentMethod',
    comp: 'sys-type',
    props: {
      code: 'CV07.10.005'
    },
    span: 4
  },
  {
    label: '住院次数',
    name: 'admitNumber',
    props: {
      placeholder: '请输入住院次数',
      append: '次',
      type: 'number'
    },
    span: 4
  },
  {
    label: '入院途径',
    name: 'admitRoute',
    comp: 'sys-type',
    props: {
      code: 'CV09.00.403'
    },
    span: 4
  },
  {
    label: '入院病情',
    name: 'admitSituation',
    comp: 'sys-type',
    props: {
      code: 'THC_CPOE_ZYBQZT'
    },
    span: 4
  },
  {
    label: '入院科室',
    name: 'admitDeptId',
    comp: 'custom',
    span: 4
  },
  {
    label: '入院病区',
    name: 'admitWardId',
    comp: 'custom',
    span: 4
  },
  {
    label: '门诊诊断',
    name: 'admitDiagnosis',
    comp: 'custom',
    props: {
      rows: 1
    },
    span: 24,
    newRow: true
  },
  {
    label: '入院时间',
    name: 'admitTime',
    comp: 'custom',
    span: 6
  },
  {
    label: '门诊医师',
    name: 'admitDoctorId',
    comp: 'custom',
    span: 4
  }
]
let depositSchema = [
  {
    label: '入院押金',
    name: 'admitDeposit',
    comp: 'ever-number',
    props: {
      append: '￥',
      type: 'number',
      toFixedLen: 2,
      disabled: false
    },
    span: 4
  },
  {
    name: 'isAdmitDeposit',
    comp: 'checkbox',
    initValue: [],
    props: {
      options: [
        {
          label: '1',
          value: '不交押金'
        }
      ]
    },
    labelWidth: '26px',
    span: 4
  }
]
let otherSchema = [
  {
    name: 'source',
    label: '渠道来源',
    span: 4,
    comp: 'custom',
    newRow: true
  },
  {
    label: '介绍科室',
    name: 'introductionDeptId',
    comp: 'custom',
    span: 4
  },
  {
    label: '介绍人',
    name: 'introducerId',
    comp: 'custom',
    span: 4
  },
]

export default {
  data () {
    let validateAdmitDeposit = (rule, value, callback) => {
      if (Number(value) <= 0 && !this.depositModel.isAdmitDeposit.length) {
        callback(new Error('押金金额必须大于0'))
      } else {
        callback()
      }
    }
    let queryobj = this.$ever.createObjFromSchema(querySchema)
    let titlemodel = this.$ever.createObjFromSchema(titleSchema)
    let hosmodel = this.$ever.createObjFromSchema(hosSchema)
    let depositmodel = this.$ever.createObjFromSchema(depositSchema)
    let othermodel = this.$ever.createObjFromSchema(otherSchema)
    return {
      api,
      querySchema: querySchema,
      queryObj: queryobj,
      titleSchema: titleSchema,
      titleModel: titlemodel,
      basicInfo: {},
      hosSchema: hosSchema,
      hosModel: hosmodel,
      depositSchema: depositSchema,
      depositModel: depositmodel,
      otherSchema: otherSchema,
      otherModel: othermodel,
      preregistration: false,
      patientId: '',
      admitDeptIdSelect: [], // 入院科室
      admitWardIdSelect: [], // 入院病区
      admitDoctorIdSelect: [], // 收治医生
      insuranceCompanySelect: [], // 保险公司
      insuranceProductIdSelect: [], // 保险产品
      introductionDeptIdSelect: [], // 介绍科室
      introducerIdSelect: [], // 介绍人
      // 根据科室查询入院病区下拉列表
      admitWardSelect: [],
      basicinfoValidFlag: false,
      hosValidFlag: 0,
      titleFlag: false,
      modalshow: false,
      PayMethodTwoDialogVisible: false,
      loading: false,
      patientFlag: false,
      isDisabled: 0,
      isFirstDept: 0,
      checkVisible: false,
      payparams: {
        id: '',
        patientId: '',
        totalFee: 0,
        // 方式2中，0一站式挂号 1门诊 2住院(押金) 3商城(营销)写死的
        payType: 2,
        // 弹窗类型1押金2收费
        FeeType: 1,
        isDeposit: 1,
        isRegister: 1,
        unexefee: 0,
        exefee: 0,
        isValited: true,
        paymethodArr: [],
        payObj: {
          flowfee: '',
          paymethod: 1,
          remark: '',
          auth_code: ''
        },
        scenes: 'admitRegistrationPay' // 针对入院登记的入院申请单被删除的情况
      },
      oldpatientId: '',
      userModel: {}, // 姓名，出生地信息
      basicinfoList: {}, // 基本信息组建返回来的信息
      createHosObj: {}, // 入院登记基本信息
      id: '',
      orgId: '',
      macId: '',
      diagnosisArr: [],
      tableData: [],
      cureTypeList: [
        {
          id: '21',
          name: '普通住院'
        },
        {
          id: '25',
          name: '门诊住院'
        }
      ],
      insuranceOrgId: '', // 读卡保险机构
      insuranceProductId: '',
      isSync: true,
      rules: {
        admitPaymentMethod: [
          {
            required: true,
            message: '请填入付费方式',
            trigger: 'change'
          }
        ],
        admitNumber: [
          {
            required: true,
            validator: formCheckPositiveInt,
            maxValue: 999999999,
            minValue: 0,
            trigger: 'change'
          }
        ],
        admitRoute: [
          {
            required: true,
            message: '请选择入院途径',
            trigger: 'change'
          }
        ],
        admitSituation: [
          {
            required: true,
            message: '请选择入院病情',
            trigger: 'change'
          }
        ],
        admitWardId: [
          {
            required: true,
            message: '请选择入院病区',
            trigger: 'change'
          }
        ],
        admitDiagnosis: [
          {
            required: true,
            message: '请填写入院诊断',
            trigger: 'change'
          }
        ],
        admitDeptId: [
          {
            required: true,
            message: '请填写入院科室',
            trigger: 'change'
          }
        ],
        admitDeposit: [
          {
            required: true,
            validator: validateAdmitDeposit,
            trigger: 'change'
          }
        ],
        inpatientNumber: [
          {
            required: true,
            message: '请填写正确的入院编号',
            trigger: 'change'
          }
        ]
      },
    }
  },
  mounted () {
    if (this.$store.state.macAddress) {
      this.macId = this.$store.state.macAddress
    } else {
      getMacAddress().then(res => {
        this.$store.commit('setMacAddress', res.data || '')
        this.macId = res.data
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created () {
    // 获取保险公司列表
    api.getOrgList().then(res => {
      if (res && res.head.errCode === 0) {
        res.data.forEach(items => {
          let obj = {}
          obj.id = items.id
          obj.name = items.insuranceOrgCnName
          obj.corpType = items.corpType
          this.insuranceCompanySelect.push(obj)
        })
      }
    })
    // 获取入院科室列表
    api.getTenantList(
      {
        orgIdList: [this.$store.state.currentUser.organizationId],
        type2CodeList: ['01.01'],
        status: 'Y',
        usePermissionStatus: 'Y'
      }).then(res => {
        if (res.head && res.head.errCode === 0) {
          res.data.resultList.forEach(item => {
            let obj = {}
            obj.id = item.tenantSubjectCode
            obj.name = item.tenantSubjectName
            this.admitDeptIdSelect.push(obj)
          })
        }
      })
    // 获取介绍科室
    api.getTenantList().then(res => {
      if (res.head && res.head.errCode === 0) {
        res.data.resultList.forEach(item => {
          let obj = {}
          obj.id = item.id
          obj.name = item.tenantSubjectName
          this.introductionDeptIdSelect.push(obj)
        })
      }
    })
  },
  watch: {
    // 根据不交押金checkbox判断是否禁用押金输入
    'depositModel.isAdmitDeposit': function (val) {
      this.$ever.getFieldFromSchema(this.depositSchema, 'admitDeposit').props.disabled = !!val.length
    },
    'diagnosisArr': {
      handler (val) {
        this.hosModel.admitDiagnosis = val.length > 0 ? JSON.stringify(val) : null
      },
      deep: true
    },
    'queryObj.insuranceCompanyId': {
      handler (val) {
        if (val) {
          this.orgId = val
          this.insuranceProductIdSelect = []
          this.queryObj.insuranceProductId = ''
          this.insuranceCompanySelect.filter(item => {
            if (item.id === val) this.queryObj.corpType = item.corpType
          })
          this.getProduct()
          if (this.userModel.idno) this.isSync = false
        } else {
          this.queryObj.corpType = ''
          this.isSync = true
        }
      },
      deep: true
    },
    'queryObj.insuranceProductId': {
      handler (val) {
        if (val) {
          this.insuranceProductIdSelect.forEach(item => {
            if (item.id === val) this.queryObj.insuranceProductName = item.name
          })
        } else {
          this.queryObj.insuranceProductName = ''
        }
      },
      deep: true
    },
    'userModel.idno': {
      handler (val) {
        if (val) {
          if (this.queryObj.insuranceCompanyId) this.isSync = false
        } else {
          this.isSync = true
        }
      },
      deep: true
    }
  },
  methods: {
    async list (val) {
      let params = { patientId: val.id }
      api.getAdmitInfo(params).then(res => {
        if (res && res.head.errCode === 0) {
          this.showDetail(res.data)
        }
      })
    },
    btnReset () {
      this.$refs.form.resetForm()
      this.clearData()
    },
    // 清除表单
    clearData () {
      this.diagnosisArr = []
      // this.$refs.form.resetForm()
      this.queryObj.patientNumber = ''
      this.$refs.basicinfo.$refs.form.resetForm()
      // 基本信息组件里有些数据手动清空
      this.$refs.basicinfo.obj.agebirthday = ''
      this.$refs.basicinfo.isShowBirthdayIcon = false
      // 清空基本信息籍贯
      this.$refs.basicinfo.addressTemp = []
      this.$refs.basicinfo.obj.householdAddress = ''
      this.$refs.basicinfo.obj.familyMember = [] // 清空联系人组件信息
      this.$refs.hosform.resetForm() // 清除入院信息
      this.$refs.otherform.resetForm() // 清除其它信息
      this.$refs.depositform.resetForm() // 清除押金信息
      this.$refs.diagnosisRef.resetInput()
      this.$nextTick(() => {
        this.$refs.titleform.resetForm()
        this.$refs.basicinfo.$refs.contacts.setObj()
      })
      this.basicinfoValidFlag = false
      this.isDisabled = 0
    },
    // 格式化每个模块返回数据信息
    infoObj (obj, row) {
      for (let key in obj) {
        if (row[key]) {
          obj[key] = row[key]
        }
      }
    },
    showDetail (row) {
      // 先清空
      this.clearData()
      // 给部分信息赋值
      this.patientId = row.patientId
      this.payparams.patiengId = row.patiengId
      this.id = row.id
      this.patientId = row.patientId
      this.payparams.patientId = row.patientId
      this.isFirstDept = row.isFirstDept
      this.$ever.getFieldFromSchema(this.titleSchema, 'admitRecordTime').props.value = row.admitRecordTime
      this.$nextTick(_ => {
        this.infoObj(this.queryObj, row)
        this.infoObj(this.titleModel, row) // 基本信息
        this.infoObj(this.hosModel, row) // 入院信息
        this.infoObj(this.depositModel, row) // 押金信息
        this.infoObj(this.otherModel, row)

        this.userModel = Object.assign({}, row) // 患者信息
        this.userModel.country = !this.userModel.country ? 'CHN' : this.userModel.country
        this.userModel.marry = !this.userModel.marry ? '10' : this.userModel.marry
        this.userModel.nation = !this.userModel.nation ? '1' : this.userModel.nation
        this.userModel.career = !this.userModel.career ? '90' : this.userModel.career
        this.userModel.bloodType = !this.userModel.bloodType ? '5' : this.userModel.bloodType
        this.userModel.agebirthday = {
          age: row.age,
          isMonth: row.ageMonth,
          isDay: row.ageDay,
          birthday: row.birthday,
          isHour: row.ageHour
        }
        this.hosModel.admitRoute = !row.admitRoute ? '' : row.admitRoute
        this.hosModel.admitSituation = !row.admitSituation ? '' : row.admitSituation
        this.hosModel.admitPaymentMethod = !this.hosModel.admitPaymentMethod ? '07' : this.hosModel.admitPaymentMethod
        this.hosModel.admitTime = !this.hosModel.admitTime ? this.$moment().format('YYYY-MM-DD HH:mm:ss') : this.hosModel.admitTime
        this.queryObj.insuranceCompanyId = this.insuranceOrgId ? this.insuranceOrgId : row.insuranceCompanyId ? row.insuranceCompanyId : this.queryObj.insuranceCompanyId
        this.$nextTick(_ => {
          this.queryObj.insuranceProductId = this.insuranceProductId ? this.insuranceProductId : row.insuranceProductId ? row.insuranceProductId : this.queryObj.insuranceProductId
        })
        this.queryObj.cureType = row.cureType ? row.cureType : '21'
        this.queryObj.insuranceHospitalizedNumber = row.insuranceHospitalizedNumber ? row.insuranceHospitalizedNumber : ''
        this.$refs.basicinfo.getUser()
        this.depositModel.AdmitDeposit = !row.AdmitDeposit ? '' : row.AdmitDeposit
        this.depositModel.isAdmitDeposit = row.isAdmitDeposit ? ['1'] : []
        this.isDisabled = row.status
        this.diagnosisArr = row.admitDiagnosisArray ? row.admitDiagnosisArray : []
        this.getWard(this.hosModel.admitDeptId, true)
        this.getintroducer(this.otherModel.introductionDeptId, true)
        this.inpatientChange(row.inpatientNumber)
      })
    },
    // 获取患者基本信息
    getBasicInfo (basicinfo) {
      this.basicinfoList = basicinfo
    },
    // 获取入院病区和收治医生
    getWard (providerId, isClear) {
      if (isClear === undefined) {
        this.hosModel.admitWardId = ''
      }
      this.admitWardIdSelect = []
      let params = {
        tenantSubjectId: providerId
      }
      // 查询病区
      api.getAdmitWardSelect(params).then(res => {
        if (res && res.head.errCode === 0) {
          res.data.forEach(item => {
            let obj = {}
            obj.id = item.id
            obj.name = item.sickAreaName
            this.admitWardIdSelect.push(obj)
          })
        }
      })
      // 查询收治医生
      let doctorParams = {
        outSubjectGetTenantSubjectListByConditionReqDTO: {},
        outStaffGetStaffListByConditionReqDTO: {
          typeCodeList: ['DOCTOR']
        }
      }
      this.admitDoctorIdSelect = []
      api.getDoctorSelect(doctorParams).then(res => {
        if (res && res.head.errCode === 0) {
          res.data.resultList && res.data.resultList.forEach(items => {
            items.tsStaffList && items.tsStaffList.forEach(item => {
              let obj = {}
              obj.id = item.id
              obj.name = item.name
              this.admitDoctorIdSelect.push(obj)
            })
          })
          let tempObj = {}
          this.admitDoctorIdSelect = this.admitDoctorIdSelect && this.admitDoctorIdSelect.reduce((cur, next) => {
            tempObj[next.id] ? '' : tempObj[next.id] = true && cur.push(next)
            return cur
          }, [])
        }
      })
    },
    // 获取介绍人
    getintroducer (id, isClear) {
      if (isClear === undefined) {
        this.otherModel.introducerId = ''
      }
      let params = {
        outSubjectGetTenantSubjectListByConditionReqDTO: {
          idList: [id]
        }
      }
      this.introducerIdSelect = []
      api.getDoctorSelect(params).then(res => {
        if (res && res.head.errCode === 0) {
          res.data.resultList.forEach(items => {
            items.tsStaffList.forEach(item => {
              let obj = {}
              obj.id = item.id
              obj.name = item.name
              this.introducerIdSelect.push(obj)
            })
          })
        }
      })
    },
    // 校验form
    submitCheck (formName, isCreated) {
      this.rulesHandle(isCreated)
      this.loading = true
      this.$refs.titleform.rules.inpatientNumber[0].required = !!isCreated
      if (isCreated) {
        let isContinue = true
        if (this.$refs.basicinfo.obj.familyMember) {
          this.$refs.basicinfo.obj.familyMember.forEach(item => {
            if (!item.type || !item.name) {
              this.$messageTips(this, 'warning', '请完善联系人信息')
              isContinue = false
            } else {
              isContinue = true
            }
          })
        }
        if (!this.patientFlag) {
          this.$messageTips(this, 'warning', '请输入正确的病案号')
          isContinue = this.patientFlag
        }
        if (!isContinue) {
          this.loading = false
          return isContinue
        }
        let insuranceFlag = false
        if (this.queryObj.insuranceCompanyId && this.queryObj.insuranceProductId) {
          insuranceFlag = true
        } else if (!this.queryObj.insuranceCompanyId && !this.queryObj.insuranceProductId) {
          insuranceFlag = true
        } else {
          insuranceFlag = false
        }
        if (!insuranceFlag) {
          this.$messageTips(this, 'warning', '请完善医保信息')
          this.loading = false
          return
        }
        this.$refs.basicinfo.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            this.basicinfoValidFlag = valid
          } else {
            this.basicinfoValidFlag = false
            this.loading = false
          }
        })
        this.$refs.titleform.$refs.form.validate(valid => {
          if (valid) {
            this.titleFlag = valid
          } else {
            this.titleFlag = false
            this.loading = false
          }
        })
        formName = this.depositModel.isAdmitDeposit.length > 0 ? ['hosform'] : ['hosform', 'depositform']
        let num = 0
        formName.forEach(name => {
          this.$refs[name].$refs.form.validate(valid => {
            if (valid) {
              num++
              this.loading = false
            }
          })
        })
        this.hosValidFlag = num
      } else {
        this.basicinfoValidFlag = false
      }
      isCreated ? this.extract(this.hosValidFlag, isCreated) : this.commonData(isCreated)
    },
    extract (flag, isCreated) {
      if ((this.depositModel.isAdmitDeposit.length > 0 ? flag === 1 : flag === 2) && this.basicinfoValidFlag && this.titleFlag) {
        this.commonData(isCreated)
      } else {
        this.$messageTips(this, 'warning', '请完善信息后再进行操作')
        this.loading = false
        return false
      }
    },
    commonData (isCreated) {
      let obj = Object.assign({}, this.basicinfoList, this.queryObj, this.titleModel, this.hosModel, this.depositModel, this.otherModel)
      obj.isNewborn = obj.isNewborn.length ? 1 : 0
      obj.familyMember = JSON.stringify(obj.familyMember)
      obj.otherIdno = JSON.stringify(obj.otherIdno)
      obj.isAdmitDeposit = obj.isAdmitDeposit.length ? 1 : 0
      // macid
      obj.macId = this.macId
      obj.saveSource = 1

      obj.birthday = obj.agebirthday.birthday
      this.admitDeptIdSelect.forEach(item => {
        if (item.id === obj.admitDeptId) obj.admitDeptName = item.name
      })
      this.admitWardIdSelect.forEach(item => {
        if (item.id === obj.admitWardId) obj.admitWardName = item.name
      })
      this.admitDoctorIdSelect.forEach(item => {
        if (item.id === obj.admitDoctorId) obj.admitDoctorName = item.name
      })
      this.insuranceCompanySelect.forEach(item => {
        if (item.id === obj.insuranceCompanyId) obj.insuranceCompanyName = item.name
      })
      this.introductionDeptIdSelect.forEach(item => {
        if (item.id === obj.introductionDeptId) obj.introductionDeptName = item.name
      })
      this.introducerIdSelect.forEach(item => {
        if (item.id === obj.introducerId) obj.introducerName = item.name
      })
      this.$refs.sourceRef.options.forEach(item => {
        if (item.id === obj.source) obj.sourceName = item.text
      })
      isCreated ? this.createBillSettle(obj) : this.addInfoBtn(obj)
    },
    rulesHandle (flag) {
      Object.keys(this.rules).forEach(item => {
        this.rules[item][0].required = flag
      })
    },
    // 创建结算单
    createBillSettle (allInfo) {
      if (allInfo.isAdmitDeposit) {
        this.createHosBtn(allInfo, false)
      } else {
        let params = {
          'details': [{
            'patientId': allInfo.patientId,
            'ipNo': allInfo.hospitalizedNumber,
            'ipTime': +new Date(),
            'ipDept': allInfo.admitDeptId,
            'berth': '',
            'doctorId': allInfo.admitDoctorId,
            'orderId': +new Date(),
            'orderType': 0,
            'unitPrice': allInfo.admitDeposit,
            'quantity': 1,
            'fee': allInfo.admitDeposit,
            'orderDetailId': +new Date()
          }]
        }
        api.createBill(params).then(res => {
          if (res && res.head.errCode === 0) {
            this.payparams.id = res.data.split(',')[0]
            this.payparams.settleCode = res.data.split(',')[1]
            this.payparams.payObj.flowfee = allInfo.admitDeposit
            this.createHosObj = allInfo
            this.modalshow = true
            this.clearData()
          }
        })
        this.disposeEcho()
      }
    },
    // 支付返回信息
    afterpay (result) {
      if (result) {
        this.modalshow = false
        this.loading = false
        this.createHosBtn(this.createHosObj, true)
      }
    },
    async settlePrint (settlementId) {
      everprint('thc_rcm.ipdepositprint', { id: settlementId }, { preview: true })
    },
    togglePatientList () {
      if (this.$refs.hospatientlist.isShow) {
        this.$refs.hospatientlist.isShow = false
      }
    },
    addInfoBtn (obj) {
      this.api.setSaveInfo(obj).then(rs => {
        if (rs && rs.head.errCode === 0) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
      this.disposeEcho()
    },
    disposeEcho () {
      setTimeout(_ => {
        this.rulesHandle(true)
        this.loading = false
      }, 300)
    },
    createHosBtn (obj, isPrint) {
      api.createHosInfo(obj).then(res => {
        if (res && res.head.errCode === 0) {
          this.$message({
            message: '登记成功',
            type: 'success'
          })
          isPrint && this.settlePrint(this.payparams.id)
          this.clearData()
          this.isDisabled = 0
          insuranceQueryCall(obj).then(rs => rs.data)
          if (res.data) {
            // 跳转路由
            this.jumpRouter(obj.insuranceCompanyId, obj.hospitalizedNumber)
          }
        }
      })
      this.disposeEcho()
    },
    // 跳转医保登记页面
    jumpRouter (insuranceOrgId, visitNumber) {
      let queryParams = encodeURIComponent(JSON.stringify({ insuranceOrgId: insuranceOrgId, visitNumber: visitNumber }))
      window.open(`${this.$ever.hiIndex + adtJumpUrl}?q=${queryParams}`, '_blank')
    },
    // 取消登记
    cancelBtn () {
      this.loading = true
      let params = {
        id: this.id,
        maxId: this.macId
      }
      api.cancelInfo(params).then(res => {
        if (res && res.head.errCode === 0) {
          this.$message({
            message: '取消登记成功',
            type: 'success'
          })
          this.clearData()
        }
      })
      this.disposeEcho()
    },
    deleteBtn () {
      let params = {
        id: this.id,
        maxId: this.macId
      }
      api.deleteInfo(params).then(res => {
        if (res && res.head.errCode === 0) {
          this.$message({
            message: '退院成功',
            type: 'success'
          })
          this.clearData()
        }
      })
      this.disposeEcho()
    },
    changeDiagnosis (val) {
      this.diagnosisArr = val
    },
    selectCheck (val) {
      val.id ? this.list(val) : this.clearData()
    },
    getMedicalInfo (val) {
      // 处理医保读卡返回的信息
      if (val.insuranceOrgId) {
        this.insuranceOrgId = val.insuranceOrgId
        this.insuranceProductId = val.insuranceProductId
      }
    },
    inpatientChange (val) {
      this.api.modifyInpatientNumber({
        id: this.patientId,
        number: val,
        orgId: this.$store.state.currentUser.organizationId,
      }).then(rs => {
        if (rs.head.errCode === 0) {
          this.patientFlag = true
        }
      }).catch(_ => {
        this.patientFlag = false
      })
    },
    getProduct () {
      // 获取保险产品列表
      api.getListByOrgId({
        id: this.orgId
      }).then(res => {
        if (res && res.head.errCode === 0) {
          res.data.forEach(items => {
            let obj = {}
            obj.id = items.id
            obj.name = items.productName
            this.insuranceProductIdSelect.push(obj)
          })
        }
      })
    },
    eazyCreateMember () {
      this.$refs.createMember.open()
    },
    getPatient (val) {
      let obj = {
        id: val.patientId ? val.patientId : val.id
      }
      this.list(obj)
    },
    pullData () {
      // todo 调用同步接口
      let obj = Object.assign({}, this.basicinfoList, this.queryObj, this.titleModel, this.hosModel, this.depositModel, this.otherModel)
      obj.isNewborn = obj.isNewborn.length ? 1 : 0
      obj.familyMember = JSON.stringify(obj.familyMember)
      obj.otherIdno = JSON.stringify(obj.otherIdno)
      obj.isAdmitDeposit = obj.isAdmitDeposit.length ? 1 : 0
      // macid
      obj.macId = this.macId
      obj.saveSource = 1
      obj.birthday = obj.agebirthday.birthday
      insuranceQuery(obj).then(rs => {
        if (rs.head.errCode === 0) {
          if (rs.data && rs.data.exist) {
            // 校验医保中心数据与crm数据是否一致
            if (rs.data.patientName === obj.patientName && rs.data.sex === obj.sex && rs.data.idno === obj.idno) {
              this.showDetail(rs.data)
              this.$messageTips(this, 'success', '同步信息成功')
            } else {
              // showdialog
              this.tableData = [
                {
                  content: '姓名',
                  hospital: obj.patientName,
                  medical: rs.data.patientName,
                  check: rs.data.patientName === obj.patientName ? '有效' : '失效'
                },
                {
                  content: '性别',
                  hospital: obj.sex,
                  medical: rs.data.sex,
                  check: rs.data.sex === obj.sex ? '有效' : '失效'
                },
                {
                  content: '生日日期',
                  hospital: obj.birthday,
                  medical: rs.data.birthday,
                  check: rs.data.birthday === obj.birthday ? '有效' : '失效'
                }
              ]
              this.checkVisible = true
            }
          } else {
            this.$messageTips(this, 'warning', '医保数据库未查到患者信息，请先在医保客户端进行登记')
          }
        }
      })
    },
    linkCrm () {
      window.open(this.$ever.crmIndex + '/crm/memberadd', '_blank')
    }
  },
  components: {
    hospatientList,
    patientBasic,
    payAfterRegister,
    insuranceSelect,
    sysDiagnosis,
    SourceCascader,
    createArchives
  },
}
</script>
<style scoped>
.register {
  height: calc(100% - 20px);
  background: white;
  padding: 10px 5px;
}
.register .otherarea {
  height: 100%;
  overflow-y: scroll;
}
.el-dialog__header {
  font-weight: bold;
}
.register /deep/ .el-form-item__label {
  height: 32px;
}
.register /deep/ .el-form-item__content {
  line-height: 30px;
}
.register /deep/ .el-input__inner {
  border: 1px solid #bbb;
  height: 32px !important;
  padding: auto;
}
.register /deep/ .is-disabled .el-input__inner,
.register /deep/ .is-disabled .el-input-group__append,
.register /deep/ .is-disabled .el-textarea__inner {
  color: #000;
  background: #ccc !important;
  border: 1px solid #bbb;
}
.register /deep/ .el-textarea__inner {
  min-height: 32px !important;
}
.register /deep/ .el-cascader {
  height: 32px;
  line-height: 32px;
}
.register /deep/ .el-input__icon {
  line-height: 32px;
}
.register /deep/ .is-disabled .el-input__icon {
  color: #666;
}
.register /deep/ .is-disabled .el-icon-arrow-up {
  color: #999;
}
.el-button {
  padding: 8px 10px;
}
.register /deep/ .is-disabled input::-webkit-input-placeholder {
  color: #000;
}
.register .item-box {
  border: 1px solid #ccc;
  border-top: none;
  margin: 30px 0;
}
</style>
