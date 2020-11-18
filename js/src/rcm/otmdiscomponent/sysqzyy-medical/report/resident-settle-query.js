let showSchema = [{
  label: '社保机构名称',
  name: 'orgName',
},
{
  label: '社保机构编号',
  name: 'orgCode',
},
{
  label: '医院名称',
  name: 'hospitalName',
},
{
  label: '医院等级',
  name: 'hospitalLevel',
},
{
  label: '姓名',
  name: 'name',
},
{
  label: '身份证号',
  name: 'idNo',
},
{
  label: '社会保障卡',
  name: 'socialSecurityCard',
},
{
  label: '民政救助类型',
  name: 'assistanceType',
},
{
  label: '性别',
  name: 'gender',
},
{
  label: '医保报销比例',
  name: 'reimbursementRatio',
},
{
  label: '个人编号',
  name: 'personalNo',
},
{
  label: '人员类别',
  name: 'personnelCategory',
},
{
  label: '医疗类别',
  name: 'medicalCategory',
},
{
  label: '联系电话',
  name: 'contactNumber',
},
{
  label: '住院或门诊号',
  name: 'visitNumber',
},
{
  label: '入院日期',
  name: 'admissionDate',
},
{
  label: '出院日期',
  name: 'dischargeDate',
},
{
  label: '住院天数',
  name: 'hospitalDays',
},
{
  label: '结算日期',
  name: 'settlementDate',
},
{
  label: '入院诊断编码',
  name: 'admissionDiagnosisCode',
},
{
  label: '入院诊断名称',
  name: 'admissionDiagnosisName',
},
{
  label: '出院诊断编码',
  name: 'dischargeDiagnosisCode',
},
{
  label: '出院诊断名称',
  name: 'dischargeDiagnosisName',
},
{
  label: '医疗费总额',
  name: 'totalFee',
},
{
  label: '起付标准',
  name: 'startingStandard',
},
{
  label: '自费金额',
  name: 'selfPay',
},
{
  label: '乙类自付金额',
  name: 'classBSelfPay',
},
{
  label: '进入统筹费用',
  name: 'inFundPay',
},
{
  label: '本次报销总额',
  name: 'reimbursementAmount',
},
{
  label: '医院垫付总额',
  name: 'hospitalPay',
},
{
  label: '患者自付总额',
  name: 'selfPocket',
},
{
  label: '个人现金支付',
  name: 'cashPay',
},
{
  label: '基本医疗保险',
  name: 'basicMedical',
},
{
  label: '居民大病保险',
  name: 'seriousIllInsurance',
},
{
  label: '民政救助',
  name: 'civilPay',
},
{
  label: '商业保险',
  name: 'insurancePay',
},
{
  label: '慈善会救助',
  name: 'charityAssistance',
},
{
  label: '中央分娩补贴',
  name: 'centralChildbirthSubsidy',
},
{
  label: '带量药差返还个人',
  name: 'quantityPurchasedReturnPersonal',
},
{
  label: '带量药差返还统筹',
  name: 'quantityPurchasedReturnFund',
},
{
  label: '带量药差返还医院',
  name: 'quantityPurchasedReturnPrice',
},
{
  label: '其他',
  name: 'otherPay',
},
{
  label: '医院垫付统筹标志',
  name: 'hospitalPayMark',
},
{
  label: '医院垫付大病标志',
  name: 'seriousDiseaseMark',
},
{
  label: '医院垫付民政救助标志',
  name: 'assistanceMark',
},
{
  label: '医院垫付商业保险标志',
  name: 'insurancePayMark',
},
{
  label: '医院垫付扶贫救助标志',
  name: 'charityPayMark',
},
{
  label: '医院担负分娩补贴标志',
  name: 'childbirthSubsidyMark',
},
{
  label: '医院垫付返还个人标志',
  name: 'returnPersonalMark',
},
{
  label: '医院垫付返还统筹标志',
  name: 'returnFundMark',
},
{
  label: '医院垫付返还医院标志',
  name: 'returnPriceMark',
},
{
  label: '医院垫付其他标志',
  name: 'otherMark',
},
{
  label: '经办人',
  name: 'operator',
}]
showSchema = showSchema.map(item => {
  item.comp = 'readonlyitem'
  return item
})
export { showSchema }
