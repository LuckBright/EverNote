/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-05-07 12:35:22
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-07-03 18:37:50
 * 医保管理 -- 定点机构信息
 */
<template>
  <div class="layout_inner flex_col_1_auto" v-loading="loading">
    <ever-form2 :schema="schema" label-width="200px" v-model="obj" ref="form" :span="8" :nosubmit="true" class="readform"></ever-form2>
  </div>
</template>

<script>
import { getDesignnatedOrgConfigParams } from '@/rcm/store/otmdiscomponent/hlj-api.js'
const schema = [
  {
    name: 'medicalServiceOrgNo',
    label: '医疗服务机构编号:',
    comp: 'readonlyitem'
  },
  {
    name: 'designnatedMedicalOrgCategory',
    label: '定点医疗机构类别:',
    comp: 'readonlyitem'
  },
  {
    name: 'medicalServiceOrgType',
    label: '医疗服务机构类型:',
    comp: 'readonlyitem'
  },
  {
    name: 'orgCode',
    label: '组织机构代码:',
    comp: 'readonlyitem'
  },
  {
    name: 'medicalServiceOrgName',
    label: '医疗服务机构名称:',
    comp: 'readonlyitem'
  },
  {
    name: 'hospitalLevel',
    label: '医院等级:',
    comp: 'readonlyitem'
  },
  {
    name: 'economyType',
    label: '经济类型:',
    comp: 'readonlyitem'
  },
  {
    name: 'contactsName',
    label: '联系人姓名:',
    comp: 'readonlyitem'
  },
  {
    name: 'contactsPhone',
    label: '联系电话:',
    comp: 'readonlyitem'
  },
  {
    name: 'address',
    label: '地址:',
    comp: 'readonlyitem',
    span: 16
  },
  {
    name: 'postcode',
    label: '邮政编码:',
    comp: 'readonlyitem'
  },
  {
    name: 'bankCode',
    label: '银行代码:',
    comp: 'readonlyitem'
  },
  {
    name: 'accountName',
    label: '户名:',
    comp: 'readonlyitem'
  },
  {
    name: 'bankAccountNumber',
    label: '银行账号:',
    comp: 'readonlyitem'
  },
  {
    name: 'medicalServiceOrgLegalPersonName',
    label: '医疗服务机构法定代表人姓名:',
    comp: 'readonlyitem'
  },
  {
    name: 'basicMedicalInsuranceManageDept',
    label: '基本医疗保险管理部门:',
    comp: 'readonlyitem'
  },
  {
    name: 'medicalOrgPracticingLicenseNo',
    label: '医疗机构执业许可证号:',
    comp: 'readonlyitem'
  },
  {
    name: 'drugManageCompanyCertificateNo',
    label: '药品经营企业合格证号:',
    comp: 'readonlyitem'
  },
  {
    name: 'medicalServiceRange',
    label: '医疗服务范围:',
    comp: 'readonlyitem'
  },
  {
    name: 'medicalServiceContent',
    label: '医疗服务内容:',
    comp: 'readonlyitem'
  },
  {
    name: 'medicalServiceCrowd',
    label: '医疗服务人群:',
    comp: 'readonlyitem'
  },
  {
    name: 'approveDesignnatedDate',
    label: '批准定点日期:',
    comp: 'readonlyitem'
  },
  {
    name: 'designnatedAgreementValidDate',
    label: '定点协议有效截止日期:',
    comp: 'readonlyitem'
  },
  {
    name: 'medicalServiceOrgParent',
    label: '上级医疗服务机构:',
    comp: 'readonlyitem'
  },
  {
    name: 'specialPersonnelContractMark',
    label: '特殊人员包干标志:',
    comp: 'readonlyitem'
  },
  {
    name: 'insuredPersonReferralHospitalMark',
    label: '参保人员转诊转院医院标志:',
    comp: 'readonlyitem'
  },
  {
    name: 'specialPersonSettledAllopatryHospitalMark',
    label: '特殊人员异地定居医院标志:',
    comp: 'readonlyitem'
  },
  {
    name: 'designatedPsychiatricHospitalMark',
    label: '精神病定点医院标志:',
    comp: 'readonlyitem'
  },
  {
    name: 'designatedIndustrialInjuryHospitalMark',
    label: '工伤定点医院标志:',
    comp: 'readonlyitem'
  },
  {
    name: 'firstReferralHospitalMark',
    label: '转院首诊医院标志:',
    comp: 'readonlyitem'
  },
  {
    name: 'referralHospitalAllowedType',
    label: '转院允许转出类型:',
    comp: 'readonlyitem',
    span: 16
  },
  {
    name: 'elementaryOthers',
    label: '初级其他人数:',
    comp: 'readonlyitem'
  },
  {
    name: 'intermediateOthers',
    label: '中级其他人数:',
    comp: 'readonlyitem'
  },
  {
    name: 'seniorOthers',
    label: '高级其他人数:',
    comp: 'readonlyitem'
  },
  {
    name: 'elementaryMedicalTechnicians',
    label: '初级医技人数:',
    comp: 'readonlyitem'
  },
  {
    name: 'intermediateMedicalTechnicians',
    label: '中级医技人数:',
    comp: 'readonlyitem'
  },
  {
    name: 'seniorMedicalTechnicians',
    label: '高级医技人数:',
    comp: 'readonlyitem'
  },
  {
    name: 'elementaryNurses',
    label: '初级护士人数:',
    comp: 'readonlyitem'
  },
  {
    name: 'intermediateNurses',
    label: '中级护士人数:',
    comp: 'readonlyitem'
  },
  {
    name: 'seniorNurses',
    label: '高级护士人数:',
    comp: 'readonlyitem'
  },
  {
    name: 'elementaryDoctors',
    label: '初级医生人数:',
    comp: 'readonlyitem'
  },
  {
    name: 'intermediateDoctors',
    label: '中级医生人数:',
    comp: 'readonlyitem'
  },
  {
    name: 'seniorDoctors',
    label: '高级医生人数:',
    comp: 'readonlyitem'
  },
  {
    name: 'specialPersonnelReferralHospitalMark',
    label: '特殊人员转诊医院标志:',
    comp: 'readonlyitem'
  },
  {
    name: 'medicalServiceOrgLegalPersonIdCard',
    label: '医疗服务机构法定代表人身份证号:',
    comp: 'readonlyitem'
  },
  {
    name: 'closeAccountMark',
    label: '封账标志:',
    comp: 'readonlyitem'
  },
  {
    name: 'chronicDiseaseSiteMark',
    label: '慢性病定点标志:',
    comp: 'readonlyitem'
  },
  {
    name: 'specialDiseaseSiteMark',
    label: '特殊疾病(治疗)定点标志:',
    comp: 'readonlyitem'
  },
  {
    name: 'outpatientReturnSettlementDays',
    label: '门诊退结算天数:',
    comp: 'readonlyitem'
  },
  {
    name: 'inpatientReturnSettlementDays',
    label: '住院退结算天数:',
    comp: 'readonlyitem'
  },
  {
    name: 'emergencyInpatientRegisterEarlierDays',
    label: '急诊住院登记入院日期提前天数:',
    comp: 'readonlyitem'
  },
  {
    name: 'medicalInsuranceDesignatedMark',
    label: '医疗保险定点标志:',
    comp: 'readonlyitem'
  },
  {
    name: 'drugsIncludedChargeTypes',
    label: '药品包含的收费类别:',
    comp: 'readonlyitem'
  },
  {
    name: 'medicalServiceFacilitiesIncludedTypes',
    label: '医疗服务设施包含类别:',
    comp: 'readonlyitem'
  },
  {
    name: 'drugstoresCanMedicalTypes',
    label: '药店可开展的医疗类别:',
    comp: 'readonlyitem'
  },
  {
    name: 'outpatientCanMedicalTypes',
    label: '门诊可开展的医疗类别:',
    comp: 'readonlyitem'
  },
  {
    name: 'designnatedCanReadCardModes',
    label: '该定点可以使用的读卡方式:',
    comp: 'readonlyitem'
  },
  {
    name: 'designnatedMedicalServiceOrgNeedSuperviseCode',
    label: '定点医疗服务机构是否需要监督:',
    comp: 'readonlyitem'
  },
  {
    name: 'threeDirectoriesUseLocalDatabaseCode',
    label: '三项目录是否使用本地数据库:',
    comp: 'readonlyitem'
  },
  {
    name: 'outpatientChronicDiseaseAccountPaymentCode',
    label: '门诊慢性病是否可选账户支付:',
    comp: 'readonlyitem'
  },
  {
    name: 'outpatientSpecialDiseaseAccountPaymentCode',
    label: '门诊特殊疾病(治疗)是否可选账户支付:',
    comp: 'readonlyitem'
  },
  {
    name: 'useTransferRegisterCode',
    label: '是否使用转院登记功能:',
    comp: 'readonlyitem'
  },
  {
    name: 'allowModifyLocalAdmissionDateCode',
    label: '是否允许修改本地入院日期:',
    comp: 'readonlyitem'
  },
  {
    name: 'mustSelectSetDiagnosisCode',
    label: '是否必须选择设定的诊断:',
    comp: 'readonlyitem'
  },
  {
    name: 'useDefaultICCardPasswordCode',
    label: '是否使用默认的IC卡密码:',
    comp: 'readonlyitem'
  },
  {
    name: 'useTheFirstVisitSystemDesignatedHospitalsForInpatientCode',
    label: '是否使用定点医院首诊制进行住院:',
    comp: 'readonlyitem'
  },
  {
    name: 'useLocalDiagnosisCode',
    label: '是否使用本地诊断:',
    comp: 'readonlyitem'
  },
  {
    name: 'useLeaveHospitalSettlementPreRegisterCode',
    label: '是否使用出院结算前登记:',
    comp: 'readonlyitem'
  },
  {
    name: 'industrialInjuryInsuranceCloseAccountMark',
    label: '工伤保险封帐标志:',
    comp: 'readonlyitem'
  },
  {
    name: 'childbirthInpatientMode',
    label: '生育住院方式:',
    comp: 'readonlyitem'
  },
  {
    name: 'leaveHospitalSettlementPreOptionalAccountPaymentCode',
    label: '出院结算是否可选账户支付:',
    comp: 'readonlyitem'
  },
  {
    name: 'otherPolicyParameters',
    label: '其他政策参数:',
    comp: 'readonlyitem'
  }
]
export default {
  data () {
    const obj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      obj,
      loading: true
    }
  },
  created () {
    getDesignnatedOrgConfigParams({
      insuranceTypeCode: 3,
      versionNo: 'V1.1',
      macId: this.macId
    }).then(res => {
      const { data = {} } = res
      if (data) Object.assign(this.obj, data)
    }).finally(_ => {
      this.loading = false
    })
  }
}
</script>

