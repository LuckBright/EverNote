<template>
  <div class="register">
    <div class="otherarea">
      <div class="item-box">
        <el-divider content-position="left">
          <h4>登记信息</h4>
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
                ></el-input>
              </template>
            </ever-form2>
          </el-col>
        </el-row>
        <el-divider content-position="left">
          <h4>基本信息</h4>
        </el-divider>
        <el-row>
          <patient-basic
            :id="patientId"
            :isBloodEdit="true"
            :value="userModel"
            ref="basicinfo"
            @formChange1="getBasicInfo"
            :isDisabled="true"
          ></patient-basic>
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
            <template slot="dischargeDiagnosis">
              <sys-diagnosis
                :value="leaveDiagnosisArr"
                :check="true"
                :key="Math.random()"
                :disabled="isDisabled"
                :showLeave="true"
                :only="true"
                @input="leaveDiagnosis"
              ></sys-diagnosis>
            </template>
            <template slot="dischargeOtherDiagnosis">
              <sys-diagnosis
                :value="ohterDiagnosisArr"
                :check="true"
                :key="Math.random()"
                :disabled="isDisabled"
                :showLeave="true"
                @input="otherChange"
              ></sys-diagnosis>
            </template>
             <template slot="dischargeZyDiagnosis">
              <sys-diagnosis
                :value="tcmDiagnosisArr"
                :diseaseType="1"
                :check="true"
                :key="Math.random()"
                :disabled="isDisabled"
                :showLeave="true"
                :only="true"
                @input="tcmChange"
              ></sys-diagnosis>
            </template>
             <template slot="dischargeZyOtherDiagnosis">
              <sys-diagnosis
                :value="tcmOtherDiagnosisArr"
                :diseaseType="1"
                :check="true"
                :key="Math.random()"
                :disabled="isDisabled"
                :showLeave="true"
                @input="tcmOtherChange"
              ></sys-diagnosis>
            </template>
            <template slot="diagnosisTime">
              <el-date-picker
                v-model="dischargeModel.diagnosisTime"
                type="date"
                :disabled="isDisabled || isDiaDisabled"
                :picker-options="diagnoOptions"
                :value-format="'yyyy-MM-dd'"
                placeholder="选择日期">
              </el-date-picker>
            </template>
            <template slot="autopsyTime">
              <el-date-picker
                v-model="dischargeModel.autopsyTime"
                type="datetime"
                :disabled="isDisabled || isAutoDisabled"
                :picker-options="diagnoOptions"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期">
              </el-date-picker>
            </template>
          </ever-form2>
        </el-row>
      </div>
      <div class="item-box">
        <el-divider content-position="left">
          <h4>费用信息</h4>
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
              :disabled="isDisabled"
            ></ever-select>
          </template>
          <template slot="introducerId">
            <ever-select
              :options="introducerIdSelect"
              v-model="otherModel.introducerId"
              :filterable="true"
              :clearable="true"
              :disabled="isDisabled"
            ></ever-select>
          </template>
          <template slot="source">
            <source-cascader v-model="otherModel.source" placeholder="请选择来源" ref="sourceRef" :disabled="isDisabled"></source-cascader>
          </template>
          <div solt="default"></div>
        </ever-form2>
      </div>
      <el-row>
        <el-button v-if="!isDisabled" class="ml10 mt10" type="primary" @click="save" :loading="loading">保存</el-button>
        <el-button v-if='!inpatientRow.id' class="ml10 mt10" type="primary" @click="linkLeave" :disabled="!isSaveSuccess">出院结算</el-button>
      </el-row>
    </div>
  </div>
</template>
<script>
import patientBasic from './leave.patient.vue'
import insuranceSelect from '@/components/insuranceorgselect'
import sysDiagnosis from '@/components/medical/sys.diagnosis'
import api from '@/adt/store/register'
import SourceCascader from '@/crm/components/sourcecascader'
import { setTimeout } from 'timers'
let pickerOptions = {
  disabledDate (time) {
    return time.getTime() >= Date.now()
  }
}
export default {
  data () {
    let isDisabled = [9].includes(Number(this.$route.query.ipStatus))
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
          disabled: true
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
    let dischargeSchema = [
      {
        label: '出院诊断',
        name: 'dischargeDiagnosis',
        comp: 'custom',
        span: 24,
        newRow: true
      },
      {
        label: '其他诊断',
        name: 'dischargeOtherDiagnosis',
        comp: 'custom',
        props: {
          placeholder: '其他诊断'
        },
        span: 24,
        newRow: true
      },
      {
        label: '中医诊断',
        name: 'dischargeZyDiagnosis',
        comp: 'custom',
        props: {
          placeholder: '中医诊断'
        },
        span: 24,
        newRow: true
      },
      {
        label: '中医其他诊断',
        name: 'dischargeZyOtherDiagnosis',
        comp: 'custom',
        props: {
          placeholder: '中医其他诊断'
        },
        span: 24,
        newRow: true
      },
      {
        label: '离院方式',
        comp: 'sys-type',
        name: 'dischargeMethod',
        props: {
          code: 'CT05.10.002',
          placeholder: '离院方式',
          disabled: isDisabled
        },
        span: 4
      },
      {
        label: '出院日期',
        name: 'dischargeTime',
        comp: 'el-date-picker',
        props: {
          placeholder: '出院日期',
          pickerOptions: pickerOptions,
          'value-format': 'yyyy-MM-dd',
          disabled: true
        },
        span: 4
      },
      {
        label: '出院科室',
        name: 'dischargeDeptName',
        props: {
          placeholder: '出院科室',
          disabled: true
        },
        span: 4
      },
      {
        label: '出院病房',
        name: 'dischargeBedWardName',
        props: {
          placeholder: '出院病房',
          disabled: true
        },
        span: 4
      },
      {
        label: '确诊',
        name: 'isDiagnosis',
        comp: 'el-select',
        props: {
          options: [
            {
              value: '0',
              label: '否'
            },
            {
              value: '1',
              label: '是'
            }
          ],
          disabled: isDisabled
        },
        span: 4
      },
      {
        label: '确诊时间',
        name: 'diagnosisTime',
        comp: 'custom',
        span: 4
      },
      {
        label: '尸检',
        name: 'isAutopsy',
        comp: 'el-select',
        props: {
          options: [
            {
              value: '0',
              label: '否'
            },
            {
              value: '1',
              label: '是'
            }
          ],
          disabled: isDisabled
        },
        span: 4
      },
      {
        label: '死亡时间',
        name: 'autopsyTime',
        comp: 'custom',
        span: 4
      },
      {
        label: '随诊',
        name: 'isFollowUp',
        comp: 'el-select',
        props: {
          options: [
            {
              value: '0',
              label: '否'
            },
            {
              value: '1',
              label: '是'
            }
          ],
          disabled: isDisabled
        },
        span: 4
      },
      {
        label: '住院天数',
        name: 'admitDays',
        props: {
          placeholder: '住院天数',
          disabled: true
        },
        span: 4
      },
    ]
    let depositSchema = [
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
        label: '保险公司',
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
    let titlemodel = this.$ever.createObjFromSchema(titleSchema)
    let depositmodel = this.$ever.createObjFromSchema(depositSchema)
    let othermodel = this.$ever.createObjFromSchema(otherSchema)
    let dischargeModel = this.$ever.createObjFromSchema(dischargeSchema)
    dischargeModel.autopsyTime = ''
    return {
      api,
      titleSchema: titleSchema,
      titleModel: titlemodel,
      basicInfo: {},
      depositSchema: depositSchema,
      depositModel: depositmodel,
      otherSchema: otherSchema,
      otherModel: othermodel,
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
      leaveDiagnosisArr: [], // 出院诊断
      ohterDiagnosisArr: [], // 其他诊断
      tcmDiagnosisArr: [], // 中医诊断
      tcmOtherDiagnosisArr: [], // 中医其他诊断
      titleFlag: false,
      loading: false,
      patientFlag: false,
      isFirstDept: 0,
      isDiaDisabled: true,
      isAutoDisabled: true,
      isDisabled,
      userModel: {}, // 姓名，出生地信息
      basicinfoList: {}, // 基本信息组建返回来的信息
      createHosObj: {}, // 入院登记基本信息
      id: '',
      orgId: '',
      rules: {},
      isSaveSuccess: false,
      diagnoOptions: {
        disabledDate (time) {
          return time.getTime() >= Date.now() + 0.001
        }
      },
      inpatientRow: {}
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
    this.list()
  },
  watch: {
    'leaveDiagnosisArr': {
      handler (val) {
        this.dischargeModel.dischargeDiagnosis = val.length > 0 ? JSON.stringify(val) : null
      },
      deep: true
    },
    'ohterDiagnosisArr': {
      handler (val) {
        this.dischargeModel.dischargeOtherDiagnosis = val.length > 0 ? JSON.stringify(val) : null
      },
      deep: true
    },
    'tcmDiagnosisArr': {
      handler (val) {
        this.dischargeModel.dischargeZyDiagnosis = val.length > 0 ? JSON.stringify(val) : null
      },
      deep: true
    },
    'tcmOtherDiagnosisArr': {
      handler (val) {
        this.dischargeModel.dischargeZyOtherDiagnosis = val.length > 0 ? JSON.stringify(val) : null
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
            if (item.id === val) {
              this.otherModel.insuranceCompanyName = item.name
              this.otherModel.corpType = item.corpType
            }
          })
          this.getProduct()
        } else {
          this.otherModel.corpType = ''
          this.otherModel.insuranceCompanyName = ''
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
    },
    'otherModel.introductionDeptId': {
      handler (val) {
        if (val) {
          this.introductionDeptIdSelect.forEach(item => {
            if (item.id === val) {
              this.otherModel.introductionDeptName = item.name
            }
          })
        } else {
          this.otherModel.introductionDeptName = ''
        }
      },
      deep: true
    },
    'otherModel.introducerId': {
      handler (val) {
        if (val) {
          this.introducerIdSelect.forEach(item => {
            if (item.id === val) {
              this.otherModel.introducerName = item.name
            }
          })
        } else {
          this.otherModel.introducerName = ''
        }
      }
    },
    'dischargeModel.isDiagnosis': {
      handler (val) {
        this.isDiaDisabled = val === '0'
        this.dischargeModel.diagnosisTime = val === '0' ? '' : this.dischargeModel.diagnosisTime
      },
      deep: true
    },
    'dischargeModel.isAutopsy': {
      handler (val) {
        this.isAutoDisabled = val === '0'
        this.dischargeModel.autopsyTime = val === '0' ? '' : this.dischargeModel.autopsyTime
      }
    }
  },
  methods: {
    forminPatient(row = {}) {
      this.inpatientRow = row
      this.list(row.hospitalizedNumber)
    },
    async list (hospitalizedNumber) {
      let params = {
        hospitalizedNumber: hospitalizedNumber || this.$route.query.ipNo
      }
      api.getDischargeInfo(params).then(res => {
        if (res && res.head.errCode === 0) {
          this.showDetail(res.data)
        }
      })
    },
    // 清除表单
    clearData () {
      this.$refs.basicinfo.$refs.form.resetForm()
      // 基本信息组件里有些数据手动清空
      this.$refs.basicinfo.obj.agebirthday = ''
      this.$refs.basicinfo.isShowBirthdayIcon = false
      this.$refs.otherform.resetForm() // 清除其它信息
      this.$refs.depositform.resetForm() // 清除押金信息
      this.$nextTick(() => {
        this.$refs.titleform.resetForm()
      })
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
        this.infoObj(this.titleModel, row) // 基本信息
        this.infoObj(this.depositModel, row) // 押金信息
        this.infoObj(this.otherModel, row)
        this.infoObj(this.dischargeModel, row)
        this.userModel = Object.assign({}, row) // 患者信息
        this.userModel.agebirthday = {
          age: row.age,
          isMonth: row.ageMonth,
          isDay: row.ageDay,
          birthday: row.birthday,
          isHour: row.ageHour
        }
        this.$nextTick(_ => {
          this.otherModel.insuranceProductId = row.insuranceProductId
        })
        this.$refs.basicinfo.getUser()
        this.depositModel.totalDeposit = row.totalDeposit === 0 ? '0' : row.totalDeposit
        this.depositModel.depositBalance = row.depositBalance === 0 ? '0' : row.depositBalance
        this.getintroducer(this.otherModel.introductionDeptId, true)
        // 出院信息
        this.leaveDiagnosisArr = row.dischargeDiagnosisArray || []
        this.ohterDiagnosisArr = row.dischargeOtherDiagnosisArray || []
        this.tcmDiagnosisArr = row.dischargeZyDiagnosisArray || []
        this.tcmOtherDiagnosisArr = row.dischargeZyOtherDiagnosisArray || []
      })
    },
    // 获取患者基本信息
    getBasicInfo (basicinfo) {
      this.basicinfoList = basicinfo
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
    save (formName) {
      this.loading = true
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
      this.dischargeModel.hospitalizedNumber = this.inpatientRow.hospitalizedNumber || this.$route.query.ipNo
      this.dischargeModel.id = this.inpatientRow.id || this.$route.query.id
      this.$refs.dischargeform.$refs.form.validate(valid => {
        if (valid) {
          let obj = Object.assign({}, this.otherModel, this.dischargeModel)
          this.addInfoBtn(obj)
        }
      })
    },
    addInfoBtn (obj) {
      this.api.saveDischargeInfo(obj).then(rs => {
        if (rs && rs.head.errCode === 0) {
          this.isSaveSuccess = true
          this.$message({
            message: '出院登记成功',
            type: 'success'
          })
          this.$emit('close')
        }
      })
      this.disposeEcho()
    },
    // 处理loading
    disposeEcho () {
      setTimeout(_ => {
        this.loading = false
      }, 300)
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
    leaveDiagnosis (val) {
      this.leaveDiagnosisArr = val
    },
    changeDiagnosis (val) {
      this.diagnosisArr = val
    },
    otherChange (val) {
      this.ohterDiagnosisArr = val
    },
    tcmChange (val) {
      this.tcmDiagnosisArr = val
    },
    tcmOtherChange (val) {
      this.tcmOtherDiagnosisArr = val
    },
    linkLeave () {
      this.$router.push({
        path: '/adt/hospitalSettle/settlementPay/detail',
        query: {
          ...this.$route.query
        }
      })
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
  overflow-y:auto;
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
.register /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner{
  width:210px;
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
