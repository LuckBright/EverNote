<template>
  <div class="register">
    <div class="otherarea">
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
                  :disabled="true"
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
              <template slot="patientNumber">
                <!-- insuranceOrgId:医保机构Id -->
                <ever-patient-select
                  @select="selectCheck"
                  v-model="queryObj.patientNumber"
                  placeholder="查询客户档案号"
                  :insuranceOrgId="otherModel.insuranceCompanyId"
                  :disabled="true"
                  :allowCreate="true"
                  :hideNo="true"
                  :searchParam="{
                    'temporary': 1
                  }"
                ></ever-patient-select>
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
          :isDisabled="isDisabled"
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
                :disabled="isDisabled"
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
                :disabled="isDisabled"
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
                :disabled="isDisabled"
              ></ever-select>
            </template>
            <template slot="admitWardId">
              <ever-select
                :options="admitWardIdSelect"
                v-model="hosModel.admitWardId"
                :filterable="true"
                :clearable="true"
                :disabled="isDisabled"
              ></ever-select>
            </template>
            <template slot="admitDoctorId">
              <ever-select
                :options="admitDoctorIdSelect"
                v-model="hosModel.admitDoctorId"
                :filterable="true"
                :clearable="true"
                :disabled="isDisabled"
              ></ever-select>
            </template>
          </ever-form2>
        </el-row>
      </div>
      <div class="item-box">
        <el-divider content-position="left">
          <h4>住院信息</h4>
        </el-divider>
        <el-row>
          <ever-form2
            :schema="inhospitalSchema"
            v-model="inhospitalModel"
            :rules="rules"
            labelWidth="100px"
          >
            <div solt="default"></div>
          </ever-form2>
        </el-row>
      </div>
      <div class="item-box">
        <el-divider content-position="left">
          <h4>出院信息</h4>
        </el-divider>
        <el-row>
          <ever-form2
            :schema="dischargeSchema"
            v-model="dischargeModel"
            :rules="rules"
            ref="dischargeform"
            labelWidth="100px"
          >
            <div solt="default"></div>
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
          <template slot="cureType">
            <ever-select
              :options="cureTypeList"
              v-model="otherModel.cureType"
              :filterable="true"
              :clearable="true"
              :disabled="isDisabled"
            ></ever-select>
          </template>
          <template slot="insuranceCompanyId">
            <ever-select
              :options="insuranceCompanySelect"
              v-model="otherModel.insuranceCompanyId"
              :filterable="true"
              :clearable="true"
              :disabled="isDisabled"
            ></ever-select>
          </template>
          <template slot="insuranceProductId">
            <ever-select
              :options="insuranceProductIdSelect"
              v-model="otherModel.insuranceProductId"
              :filterable="true"
              :clearable="true"
              :disabled="isDisabled"
            ></ever-select>
          </template>
          <template slot="introductionDeptId">
            <ever-select
              :options="introductionDeptIdSelect"
              v-model="otherModel.introductionDeptId"
              @change="getintroducer"
              :filterable="true"
              :clearable="true"
              :disabled="true"
            ></ever-select>
          </template>
          <template slot="introducerId">
            <ever-select
              :options="introducerIdSelect"
              v-model="otherModel.introducerId"
              :filterable="true"
              :clearable="true"
              :disabled="true"
            ></ever-select>
          </template>
          <template slot="source">
            <source-cascader v-model="otherModel.source" placeholder="请选择来源" ref="sourceRef" :disabled="isDisabled"></source-cascader>
          </template>
          <div solt="default"></div>
        </ever-form2>
      </div>
      <el-row>
        <el-button v-if="!isDisabled" class="ml10 mt10" type="primary" @click="submitCheck(['hosform', 'depositform'], true)" :loading="loading">保存</el-button>
      </el-row>
    </div>
  </div>
</template>
<script>
import patientBasic from '@/crm/components/patiententry_horizontal.vue'
import insuranceSelect from '@/components/insuranceorgselect'
import sysDiagnosis from '@/components/medical/sys.diagnosis'
import api from '@/adt/store/register'
import { formCheckPositiveInt } from '@/util/validate'
import SourceCascader from '@/crm/components/sourcecascader'
import { setTimeout } from 'timers'

export default {
  data () {
    let isDisabled = ![3, 4, 5, 6, 7, 12].includes(Number(this.$route.query.ipStatus))
    let querySchema = [
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
          type: 'number',
          disabled: isDisabled
        },
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
          placeholder: '患者医保卡号',
          disabled: true
        },
        span: 4
      },
      {
        label: '健康卡号',
        name: 'healthCard',
        props: {
          placeholder: '健康卡号',
          disabled: isDisabled
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
          code: 'CV07.10.005',
          disabled: isDisabled
        },
        span: 4
      },
      {
        label: '住院次数',
        name: 'admitNumber',
        props: {
          placeholder: '请输入住院次数',
          append: '次',
          type: 'number',
          disabled: isDisabled
        },
        span: 4
      },
      {
        label: '入院途径',
        name: 'admitRoute',
        comp: 'sys-type',
        props: {
          code: 'CV09.00.403',
          disabled: isDisabled
        },
        span: 4
      },
      {
        label: '入院病情',
        name: 'admitSituation',
        comp: 'sys-type',
        props: {
          code: 'THC_CPOE_ZYBQZT',
          disabled: isDisabled
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
    let inhospitalSchema = [
      {
        label: '住院天数',
        name: 'admitDays',
        props: {
          placeholder: '住院天数',
          disabled: true
        },
        span: 4
      },
      {
        label: '住院床位',
        name: 'inBedName',
        props: {
          placeholder: '住院床位',
          disabled: true
        },
        span: 4
      },
      {
        label: '在院科室',
        name: 'inDeptName',
        props: {
          placeholder: '在院科室',
          disabled: true
        },
        span: 4
      },
      {
        label: '在院病区',
        name: 'inWardName',
        props: {
          placeholder: '在院科室',
          disabled: true
        },
        span: 4
      }
    ]
    let dischargeSchema = [
      {
        label: '出院日期',
        name: 'dischargeTime',
        props: {
          placeholder: '出院日期',
          disabled: true
        },
        span: 4
      }
    ]
    let depositSchema = [
      {
        label: '入院押金',
        name: 'admitDeposit',
        comp: 'ever-price',
        props: {
          append: '￥',
          type: 'number',
          disabled: true
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
          ],
          disabled: true
        },
        labelWidth: '26px',
        span: 4
      },
      {
        label: '在院押金',
        name: 'totalDeposit',
        comp: 'ever-price',
        props: {
          append: '￥',
          type: 'number',
          disabled: true
        },
        span: 4
      },
      {
        label: '缴纳次数',
        name: 'payCount',
        comp: 'ever-price',
        props: {
          append: '次',
          type: 'number',
          disabled: true
        },
        span: 4
      },
      {
        label: '记账费用',
        name: 'accountBillFee',
        comp: 'ever-price',
        props: {
          append: '￥',
          type: 'number',
          disabled: true
        },
        span: 4
      },
      {
        label: '押金余额',
        name: 'depositBalance',
        comp: 'ever-price',
        props: {
          append: '￥',
          type: 'number',
          disabled: true
        },
        span: 4
      },
    ]
    let otherSchema = [
      {
        label: '医疗类别',
        name: 'cureType',
        comp: 'custom',
        span: 4
      },
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
        label: '审核状态',
        name: 'insuranceAuditStatus',
        comp: 'sys-type',
        props: {
          code: 'THC_RCM_SI_CHECK_STATUS',
          disabled: isDisabled
        },
        span: 4
      },
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
    let inhospitalModel = this.$ever.createObjFromSchema(inhospitalSchema)
    let dischargeModel = this.$ever.createObjFromSchema(dischargeSchema)
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
      inhospitalSchema,
      inhospitalModel,
      dischargeSchema,
      dischargeModel,
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
      loading: false,
      patientFlag: false,
      isDisabled,
      isFirstDept: 0,
      userModel: {}, // 姓名，出生地信息
      basicinfoList: {}, // 基本信息组建返回来的信息
      createHosObj: {}, // 入院登记基本信息
      id: '',
      orgId: '',
      macId: '',
      diagnosisArr: [],
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
            message: '请填写门诊诊断',
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
    this.$nextTick(_ => {
      this.selectCheck(this.$route.query.patientId, this.$route.query.id)
    })
  },
  watch: {
    'diagnosisArr': {
      handler (val) {
        this.hosModel.admitDiagnosis = val.length > 0 ? JSON.stringify(val) : null
      },
      deep: true
    },
    'otherModel.insuranceCompanyId': {
      handler (val) {
        if (val) {
          this.orgId = val
          this.insuranceProductIdSelect = []
          this.otherModel.insuranceProductId = ''
          this.insuranceCompanySelect.filter(item => {
            if (item.id === val) this.otherModel.corpType = item.corpType
          })
          this.getProduct()
        } else {
          this.otherModel.corpType = ''
        }
      },
      deep: true
    },
    'otherModel.insuranceProductId': {
      handler (val) {
        if (val) {
          this.insuranceProductIdSelect.forEach(item => {
            if (item.id === val) this.otherModel.insuranceProductName = item.name
          })
        } else {
          this.otherModel.insuranceProductName = ''
        }
      },
      deep: true
    }
  },
  methods: {
    async list (val, id) {
      let params = {
        patientId: val,
        id: id
      }
      api.getAdmitInfo(params).then(res => {
        if (res && res.head.errCode === 0) {
          this.showDetail(res.data)
        }
      })
    },
    // 清除表单
    clearData () {
      this.diagnosisArr = []
      this.$refs.form.resetForm()
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
    },
    // 格式化每个模块返回数据信息
    infoObj (obj, row) {
      for (let key in obj) {
        obj[key] = row[key]
      }
    },
    // 展示信息
    showDetail (row) {
      // 先清空
      this.clearData()
      // 给部分信息赋值
      this.patientId = row.patientId
      this.id = row.id
      this.patientId = row.patientId
      this.isFirstDept = row.isFirstDept
      this.$ever.getFieldFromSchema(this.titleSchema, 'admitRecordTime').props.value = row.admitRecordTime
      this.$nextTick(() => {
        this.infoObj(this.queryObj, row)
        this.infoObj(this.titleModel, row) // 基本信息
        this.infoObj(this.hosModel, row) // 入院信息
        this.infoObj(this.depositModel, row) // 押金信息
        this.infoObj(this.otherModel, row)
        this.infoObj(this.inhospitalModel, row)
        this.infoObj(this.dischargeModel, row)
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
        this.$nextTick(_ => {
          this.otherModel.insuranceProductId = row.insuranceProductId
        })
        this.otherModel.cureType = row.cureType ? row.cureType : '21'
        this.$refs.basicinfo.getUser()
        this.depositModel.isAdmitDeposit = (this.depositModel.isAdmitDeposit && ['1']) || []
        this.depositModel.admitDeposit = !row.admitDeposit ? '' : row.admitDeposit
        this.depositModel.totalDeposit = row.totalDeposit === 0 ? '0' : row.totalDeposit
        this.depositModel.depositBalance = row.depositBalance === 0 ? '0' : row.depositBalance
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
        if (this.otherModel.insuranceCompanyId && this.otherModel.insuranceProductId) {
          insuranceFlag = true
        } else if (!this.otherModel.insuranceCompanyId && !this.otherModel.insuranceProductId) {
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
      obj.birthday = obj.agebirthday.birthday
      obj.saveSource = 2 // 区分页面
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
      this.addInfoBtn(obj)
    },
    rulesHandle (flag) {
      Object.keys(this.rules).forEach(item => {
        this.rules[item][0].required = flag
      })
    },
    // 保存信息
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
    // 处理loading
    disposeEcho () {
      setTimeout(_ => {
        this.rulesHandle(true)
        this.loading = false
      }, 300)
    },
    // 入院登记
    createHosBtn (obj) {
      api.createHosInfo(obj).then(res => {
        if (res && res.head.errCode === 0) {
          this.$message({
            message: '登记成功',
            type: 'success'
          })
          this.clearData()
          if (res.data) {
            let queryParams = encodeURIComponent(JSON.stringify({ visitNumber: obj.hospitalizedNumber }))
            window.open(window.location.origin + this.$ever.adtIndex + '/adt/hospitalMedicalManage' + '?q=' + queryParams, '_blank')
          }
        }
      })
      this.disposeEcho()
    },
    // 入院诊断数据
    changeDiagnosis (val) {
      this.diagnosisArr = val
    },
    selectCheck (val, id) {
      val ? this.list(val, id) : this.clearData()
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
    getPatient (val) {
      let obj = {
        id: val.patientId
      }
      this.list(obj)
    }
  },
  components: {
    patientBasic,
    insuranceSelect,
    sysDiagnosis,
    SourceCascader
  },
}
</script>
<style scoped>
.register {
  height: calc(100% - 20px);
  background: white;
  padding: 0px 0px;
  overflow-y: auto;
}
.register .otherarea {
  height: 100%;
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
}
.footerBtn {
  display: flex;
  height: 36px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.23);
  line-height: 30px;
  background: #fff;
  padding-top:10px;
}
</style>
