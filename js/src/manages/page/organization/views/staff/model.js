import { regs } from '@/manages/page/organization/utils/model'
import { isManages } from '@/manages/page/organization/utils/fns'
import { listDestValue, validatePassword } from '@/util/common'
export const statusList = [
  {
    id: 'Y',
    name: '启用'
  },
  {
    id: 'N',
    name: '禁用'
  },
]
export const simpleList = [
  {
    id: '0',
    name: '否',
  },
  {
    id: '1',
    name: '是',
  },
]
export const staffColumns = [
  {
    prop: 'name',
    label: '姓名',
    slot: 'name',
  },
  {
    prop: 'jobNumber',
    label: '工号',
  },
  {
    prop: 'username',
    label: '登录账号',
    width: 115,
    formatter ({ value }) {
      return value || '未开通'
    },
  },
  {
    prop: 'webHospitalDoctor',
    label: '是否开通互联网医院',
    formatter ({ value }) {
      return listDestValue(simpleList, value)
    },
  },
  {
    prop: 'outpatientDoctor',
    label: '是否外院医生',
    formatter ({ value }) {
      return listDestValue(simpleList, value)
    },
  },
  {
    prop: 'genderName',
    label: '性别',
  },
  {
    prop: 'typeName',
    label: '类型',
  },
  {
    prop: 'statusName',
    label: '在职状态',
  },
  {
    prop: 'op',
    label: '操作',
    width: 360,
    type: 'btns',
    btns ({ row }) {
      return [
        // {prop: 'viewDetail', label: '查看'},
        'edit',
        { prop: 'account', label: row.username ? '修改账号' : '开通账号' },
        ...(isManages() ? [{ prop: 'webh', label: '互联网信息' }] : []),
        ...(isManages() ? [{ prop: 'punish', label: '奖惩信息' }] : []),
        { prop: 'unlock', label: '解锁账号' },
        { prop: 'dochelp', label: '医助信息' },
        // 'del',
      ]
    },
  },
]
export const staffSchema = [
  {
    name: 'titleBaseInfo',
    comp: 'custom',
    span: 24,
  },
  {
    name: 'type',
    label: '人员类型',
    comp: 'custom',
    span: 12,
  },
  {
    name: 'org',
    label: '组织机构',
    parentClass: 'w',
    comp: 'custom',
    span: 12,
  },
  {
    name: 'dept',
    label: '部门',
    parentClass: 'w',
    comp: 'custom',
    span: 12,
  },
  {
    name: 'jobNumber',
    label: '工号',
    span: 12,
  },
  {
    name: 'name',
    label: '姓名',
    span: 12,
  },
  {
    name: 'gender',
    label: '性别',
    comp: 'sys-type',
    props: {
      code: 'GBT.2261.1',
      useObject: true,
      objSimple: true,
    },
    span: 12,
  },
  {
    name: 'mobile',
    label: '手机号',
    span: 12,
  },
  {
    name: 'status',
    label: '在职状态',
    comp: 'sys-type',
    props: {
      code: 'THC_WH_PERSON_STATUS',
      useObject: true,
      objSimple: true,
    },
    span: 12,
  },
  {
    name: 'enableStatus',
    label: '状态',
    comp: 'select',
    parentClass: 'w',
    props: {
      options: statusList
    },
    span: 12,
  },
  {
    name: 'titlePracticeInfo', // 执业信息
    comp: 'custom',
    span: 24,
  },
  {
    name: 'orgList',
    label: '执业机构',
    comp: 'custom',
    span: 24,
  },
  {
    name: 'subjectList',
    label: '执业学科专业',
    comp: 'custom',
    span: 24,
  },
  // {
  //   name: 'tsStaffSickAreaDTOList',
  //   label: '关联病区',
  //   comp: 'custom',
  //   span: 24,
  // },
  {
    name: 'skillsTitle',
    label: '专业职称',
    comp: 'custom',
    span: 12,
  },
  {
    name: 'ageRange',
    label: '接诊年龄限制',
    comp: 'custom',
    span: 12,
  },
  // {
  //   name: 'outpatientDoctor',
  //   label: '是否本院医生',
  //   comp: 'select',
  //   parentClass: 'w',
  //   props: {
  //     options: simpleList
  //   },
  //   span: 12,
  // },
  // {
  //   name: 'webHospitalDoctor',
  //   label: '是否开通互联网医院',
  //   comp: 'select',
  //   parentClass: 'w',
  //   props: {
  //     options: simpleList
  //   },
  //   span: 12,
  // },
  {
    name: 'titlePrescriptionInfo', // 处方权信息
    comp: 'custom',
    span: 24,
  },
  {
    name: 'recipePermissionValue',
    label: '启用处方权',
    comp: 'custom',
    span: 24,
  },
  {
    name: 'tsStaffPermission',
    label: '特殊权限',
    comp: 'custom',
    span: 24,
  },
  {
    name: 'surgicalOperation',
    label: '手术级别',
    comp: 'sys-type',
    props: {
      code: 'CV05.10.024',
      useObject: true,
      objSimple: true,
      // filtercodes: ['03.02', '03.03', '03.04', '03.05']
    },
    span: 24,
  },
  {
    name: 'titleOtherInfo', // 其他信息
    comp: 'custom',
    span: 24,
  },
  {
    name: 'namePinyin',
    label: '姓名拼音',
    span: 12,
  },
  {
    name: 'nameEnglish',
    label: '英文名',
    span: 12,
  },
  {
    name: 'position',
    label: '职位',
    span: 12,
  },
  {
    name: 'servicesLanguage',
    label: '语言',
    comp: 'sys-type',
    props: {
      code: 'THC_SYS_LANGUAGE',
      multiple: true,
      useObject: true,
      objSimple: true,
    },
    span: 12,
  },
  {
    name: 'appointmentNote',
    label: '预约注意事项',
    props: {
    },
    span: 24,
  },
  {
    name: 'appointmentRemind',
    label: '预约提示内容',
    props: {
    },
    span: 24,
  },
  {
    name: 'infoText',
    label: '擅长详情',
    comp: 'custom',
    span: 24,
  },
  {
    name: 'infoRemark',
    label: '个人简介',
    props: {
      type: 'textarea',
    },
    span: 24,
  },
  {
    name: 'tsStaffFiles',
    label: '证件信息',
    comp: 'custom',
    span: 24,
  },
  {
    name: 'iPhoto',
    label: '个人图文详情',
    comp: 'custom',
    span: 24,
  },
]
export const staffRules = {
  org: [{ required: true, message: '必填项', trigger: 'change' }],
  // dept: [{ required: true, message: '必填项', trigger: 'change' }],
  jobNumber: [
    { required: true, message: '必填项', trigger: 'change' },
    { pattern: regs.jobNumber, message: '工号必须是长度不大于8位的字母或者数字的组合', trigger: 'change' },
  ],
  name: [
    { required: true, message: '必填项', trigger: 'change' },
    { min: 1, max: 40, message: '长度不正确', trigger: 'change' },
  ],
  skillsTitle: [ { required: true, message: '必填项', trigger: 'blur' } ],
  gender: [ { required: true, message: '必填项', trigger: 'change' } ],
  mobile: [
    { required: true, message: '必填项', trigger: 'change' },
    { pattern: regs.mobile, message: '请输入正确的手机号码' },
  ],
  type: [{ required: true, message: '必填项', trigger: 'change' }],
  status: [{ required: true, message: '必填项', trigger: 'change' }],
  subjectList: [{ required: true, message: '必填项', trigger: 'change' }],
}
export const staffPersonalRules = {
  email: [
    { pattern: regs.email, message: '请输入正确的电子邮箱', trigger: 'change' },
  ],
  cardNumber: [
  ]
}
export const staffPersonalSchema = [
  {
    name: 'birthday',
    label: '出生日期',
    comp: 'custom',
    span: 24,
  },
  // {
  //   name: 'card',
  //   label: '证件类型',
  //   comp: 'sys-type',
  //   props: {
  //     code: 'CV02.01.101',
  //     useObject: true,
  //     objSimple: true,
  //   },
  //   span: 24,
  // },
  {
    name: 'card',
    label: '证件类型',
    comp: 'custom',
    span: 24,
  },
  {
    name: 'cardNumber',
    label: '证件号码',
    span: 24,
  },
  {
    name: 'email',
    label: '电子邮箱',
    span: 24,
  },
]
// todo 缺少的字段
// appointmentNote
// appointmentRemind
// infoPhoto
export const accountSchema = [
  {
    name: 'loginName',
    label: '登录账号',
    props: {
      disabled: true,
    },
    span: 24,
  },
  {
    name: 'nickname',
    label: '登录别名',
    props: {
      disabled: false,
    },
    span: 24,
  },
  {
    name: 'displayName',
    label: '显示昵称',
    parentClass: 'dn',
    props: {
      disabled: true,
    },
    span: 24,
  },
  {
    name: 'password',
    label: '密码',
    props: {
      disabled: false,
    },
    span: 24,
  },
]
export const accountRules = {
  loginName: [{ required: true, message: '必填项', trigger: 'change' }],
  nickname: [{ required: true, message: '必填项', trigger: 'change' }],
  displayName: [{ required: false, message: '必填项', trigger: 'change' }],
  password: [
    { required: true, message: '必填项', trigger: 'change' },
    { validator: validatePassword, trigger: 'change' },
  ],
}
// 值集字段
export const geList = [
  {
    id: '1',
    name: '男',
  },
  {
    id: '2',
    name: '女',
  },
]
// export const naList = [{ 'id': '01', 'name': '汉族' }, { 'id': '02', 'name': '蒙古族' }, { 'id': '03', 'name': '回族' }, {
//   'id': '04',
//   'name': '藏族',
// }, { 'id': '05', 'name': '维吾尔族' }, { 'id': '06', 'name': '苗族' }, { 'id': '07', 'name': '彝族' }, {
//   'id': '08',
//   'name': '壮族',
// }, { 'id': '09', 'name': '布依族' }, { 'id': '10', 'name': '朝鲜族' }, { 'id': '11', 'name': '满族' }, {
//   'id': '12',
//   'name': '侗族',
// }, { 'id': '13', 'name': '瑶族' }, { 'id': '14', 'name': '白族' }, { 'id': '15', 'name': '土家族' }, {
//   'id': '16',
//   'name': '哈尼族',
// }, { 'id': '17', 'name': '哈萨克族' }, { 'id': '18', 'name': '傣族' }, { 'id': '19', 'name': '黎族' }, {
//   'id': '20',
//   'name': '傈僳族',
// }, { 'id': '21', 'name': '佤族' }, { 'id': '22', 'name': '畲族' }, { 'id': '23', 'name': '高山族' }, {
//   'id': '24',
//   'name': '拉祜族',
// }, { 'id': '25', 'name': '水族' }, { 'id': '26', 'name': '东乡族' }, { 'id': '27', 'name': '纳西族' }, {
//   'id': '28',
//   'name': '景颇族',
// }, { 'id': '29', 'name': '柯尔克孜族' }, { 'id': '30', 'name': '土族' }, { 'id': '31', 'name': '达斡尔族' }, {
//   'id': '32',
//   'name': '仫佬族',
// }, { 'id': '33', 'name': '羌族' }, { 'id': '34', 'name': '布朗族' }, { 'id': '35', 'name': '撒拉族' }, {
//   'id': '36',
//   'name': '毛难族',
// }, { 'id': '37', 'name': '仡佬族' }, { 'id': '38', 'name': '锡伯族' }, { 'id': '39', 'name': '阿昌族' }, {
//   'id': '40',
//   'name': '普米族',
// }, { 'id': '41', 'name': '塔吉克族' }, { 'id': '42', 'name': '怒族' }, { 'id': '43', 'name': '乌孜别克族' }, {
//   'id': '44',
//   'name': '俄罗斯族',
// }, { 'id': '45', 'name': '鄂温克族' }, { 'id': '46', 'name': '崩龙族' }, { 'id': '47', 'name': '保安族' }, {
//   'id': '48',
//   'name': '裕固族',
// }, { 'id': '49', 'name': '京族' }, { 'id': '50', 'name': '塔塔尔族' }, { 'id': '51', 'name': '独龙族' }, {
//   'id': '52',
//   'name': '鄂伦春族',
// }, { 'id': '53', 'name': '赫哲族' }, { 'id': '54', 'name': '门巴族' }, { 'id': '55', 'name': '珞巴族' }, {
//   'id': '56',
//   'name': '基诺族',
// }, { 'id': '97', 'name': '其他' }, { 'id': '98', 'name': '外国血统' }]
export const titleList = [
  { name: '医师', id: '1' },
  { name: '医士', id: '2' },
  { name: '住院医师', id: '3' },
  { name: '主治医师', id: '4' },
  { name: '副主任医师', id: '5' },
  { name: '主任医师', id: '6' },
  { name: '药士', id: '7' },
  { name: '药师', id: '8' },
  { name: '主管药师', id: '9' },
  { name: '副主任药师', id: '10' },
  { name: '主任药师', id: '11' },
]
export const healthList = [
  {
    name: '健康', id: '健康'
  },
  {
    name: '良好', id: '良好'
  },
  {
    name: '一般', id: '一般'
  },
]
export const docEduList = [
  {
    name: '无',
    id: '无',
  },
  {
    name: '传统医学师承和确有专长',
    id: '传统医学师承和确有专长',
  },
  {
    name: '中专',
    id: '中专',
  },
  {
    name: '专科',
    id: '专科',
  },
  {
    name: '本科',
    id: '本科',
  },
  {
    name: '硕士研究生',
    id: '硕士研究生',
  },
  {
    name: '博士研究生',
    id: '博士研究生',
  },
]
export const userTypeList = [
  {
    name: '审方药师',
    id: '审方药师',
  },
  {
    name: '诊疗医师',
    id: '诊疗医师',
  },
]
export const levelList = [
  {
    name: '执业医师',
    id: '执业医师',
  },
  {
    name: '执业助理医',
    id: '执业助理医',
  },
  {
    name: '执业药师',
    id: '执业药师',
  },
]
export const hospitalList = [
  { name: '搜狗互联网医院', id: 'WEBH001' },
  { name: '步洛健康互联网医院', id: 'WEBH002' },
  { name: '众安互联网医院', id: 'WEBH003' },
  { name: '顺慈互联网医院', id: 'WEBH004' },
  { name: '海南高济互联网医院', id: 'WEBH005' },
  { name: '海南阿里健康互联网医院', id: 'WEBH006' },
  { name: '海南宜贰叁互联网医院', id: 'WEBH007' },
  { name: '海南健康乐互联网医院', id: 'WEBH008' },
  { name: '施强药业', id: 'WEBH009' },
  { name: '海南妙医佳互联网医院', id: 'WEBH010' },
  { name: '海南中医在线互联网医院', id: 'WEBH011' },
  { name: '海南宝石花互联网医院', id: 'WEBH012' },
  { name: '健康云', id: 'WEBH013' },
  { name: '思派互联网医院', id: 'WEBH014' },
  { name: '智云', id: 'WEBH015' },
  { name: '通用环球集团', id: 'WEBH016' },
  { name: '康爱多', id: 'WEBH017' },
  { name: '叮当快药', id: 'WEBH018' },
  { name: '袋鼠健康', id: 'WEBH019' },
  { name: '微脉互联网医院', id: 'WEBH020' },
  { name: '明医明诊', id: 'WEBH021' },
  { name: '普络', id: 'WEBH022' },
  { name: '小鹿中医互联网医院', id: 'WEBH023' },
  { name: '卓健', id: 'WEBH024' },
  { name: '腾讯', id: 'WEBH025' },
  { name: '幺零贰四互联网医院', id: 'WEBH026' },
  { name: '海南医云互联网医院', id: 'WEBH027' },
  { name: '格格健康', id: 'WEBH028' },
]
// 互联网医院信息
export const staffWebhSchema = [
  { name: 'orgCode', label: '签约医疗机构编码', props: { disabled: false }, parentClass: 'w' },
  { name: 'orgName', label: '签约医疗机构名称', props: { disabled: false }, parentClass: 'w' },
  { name: 'orgRegNo', label: '机构登记号', props: { disabled: false }, parentClass: 'w' },
  { name: 'orgAddress', label: '执业机构地址', props: { disabled: false }, parentClass: 'w' },
  { name: 'orgPostalCode', label: '机构地址邮编', props: { disabled: false }, parentClass: 'w' },
  { name: 'orgTel', label: '单位电话', props: { disabled: false }, parentClass: 'w' },
  { name: 'inDocCode', label: '机构内人员编码' },
  { name: 'docType', label: '人员类型', comp: 'custom', },
  { name: 'docName', label: '姓名' },
  { name: 'geCode', label: '性别', comp: 'select', props: { options: geList }, parentClass: 'w' },
  { name: 'nationCode', label: '民族', comp: 'sys-type', props: { code: 'GBT.3304' }, parentClass: 'w' },
  { name: 'nationalityCode', label: '国籍', comp: 'sys-type', props: { code: 'GBT.2659' }, parentClass: 'w' },
  { name: 'docBirthdate', label: '出生日期', comp: 'date', parentClass: 'w' },
  { name: 'docAddress', label: '家庭地址' },
  { name: 'docPostalCode', label: '家庭地址邮编' },
  { name: 'docEdu', label: '学历', comp: 'select', props: { options: docEduList }, parentClass: 'w' },
  { name: 'graduateSchool', label: '毕业学校' },
  { name: 'docPosition', label: '行政职务' },
  { name: 'docComment', label: '个人简介' },
  { name: 'titleCode', label: '职称', comp: 'select', props: { options: titleList }, parentClass: 'w' },
  { name: 'healthCondition', label: '健康状况', comp: 'select', props: { options: healthList }, parentClass: 'w' },
  { name: 'appraisalContent', label: '业务水平', props: { type: 'textarea', placeholder: '业务水平考核机构或组织名称、考核培训时间及结果' }, parentClass: 'w' },
  { name: 'punishContent', label: '处罚信息', props: { type: 'textarea', placeholder: '何时何地因何种原因受过何种处罚或处分' }, parentClass: 'w' },
  { name: 'otherContent', label: '其它要说明的问题', props: { type: 'textarea' }, parentClass: 'w' },
  { name: 'workExperienceList', label: '个人工作经历列表', comp: 'custom', parentClass: 'w' },
  { name: 'workInstCode', label: '医师第一执业机构编码' },
  { name: 'workInstName', label: '医师第一执业机构名称' },
  { name: 'docDept', label: '编制科室', comp: 'custom' },
  { name: 'docTel', label: '联系手机号' },
  { name: 'idCard', label: '身份证号' },
  { name: 'pracNo', label: '执业证号' },
  { name: 'pracRecDate', label: '执业证取得时间', comp: 'date', parentClass: 'w' },
  { name: 'licenseIssuingAuthority', label: '执业证书发证机关' },
  { name: 'certNo', label: '资格证号' },
  { name: 'certRecDate', label: '资格证取得时间', comp: 'date', parentClass: 'w' },
  { name: 'certificateIssuingAuthority', label: '资格证书发证机关' },
  { name: 'pracLevel', label: '医师执业级别', comp: 'select', props: { options: levelList }, parentClass: 'w' },
  { name: 'titleNo', label: '职称证号' },
  { name: 'titleRecDate', label: '职称证取得时间', comp: 'date', parentClass: 'w' },
  { name: 'qualificationCertificateForDoctor', label: '医师资格证书类别' },
  { name: 'pracType', label: '医师执业类别' },
  { name: 'pracScopeApproval', label: '医师执业范围' },
  { name: 'physicianQualificationCategory', label: '医师资格类别' },
  { name: 'professional', label: '医师擅长专业' },
  { name: 'docMultiSitedDateRange', label: '医师执业起始时间', comp: 'date', parentClass: 'w', props: { type: 'daterange' } },
  { name: 'hosOpinion', label: '申请拟执业医疗机构意见' },
  { name: 'hosOpinionDate', label: '申请拟执业医疗机构意见时间', comp: 'date', parentClass: 'w' },
  { name: 'medPriceList', label: '医师诊疗活动价格列表', comp: 'custom' },
  { name: 'hosDigitalSign', label: '申请拟执业医疗机构-电子章', comp: 'custom', parentClass: 'custom-form-item' },
  { name: 'employFilesList', label: '互联网医院聘任合同列表(适合多张合同照片的情形)', comp: 'custom', parentClass: 'custom-form-item' },
  { name: 'digitalSign', label: '医师数字签名留样', comp: 'custom', parentClass: 'custom-form-item' },
  { name: 'idCardList', label: '医师身份证文件列表', comp: 'custom', parentClass: 'id-card-list custom-form-item' },
  { name: 'certDocPracList', label: '医师执业证文件列表', comp: 'custom', parentClass: 'custom-form-item' },
  { name: 'titleCertList', label: '医师职称证文件列表', comp: 'custom', parentClass: 'custom-form-item' },
  { name: 'docCertList', label: '医师资格证文件列表', comp: 'custom', parentClass: 'custom-form-item' },
  { name: 'docPhoto', label: '医师认证照片文件', comp: 'custom', parentClass: 'custom-form-item' },
  { name: 'docMultiSitedRecordList', label: '医师执业备案文件列表', comp: 'custom', parentClass: 'custom-form-item' },
  {
    name: 'qualifyOrNot',
    label: '',
    comp: 'checkbox',
    props: { options: [{ id: '最近连续两个周期的医师定期考核合格是否合格', label: 'label', value: 'value' }] },
  },
  {
    name: 'hosConfirmFlag',
    label: '',
    comp: 'checkbox',
    props: { options: [{ id: '医院是否已确认', label: 'label', value: 'value' }] },
  },
  {
    name: 'recordFlag',
    label: '',
    comp: 'checkbox',
    props: { options: [{ id: '海南是否已备案', label: 'label', value: 'value' }] },
  },
  {
    name: 'presRecordFlag',
    label: '',
    comp: 'checkbox',
    props: { options: [{ id: '海南处方开具权是否备案', label: 'label', value: 'value' }] },
  },
  {
    name: 'agreeTerms',
    label: '',
    comp: 'checkbox',
    props: { options: [{ id: '是否同意以上条款', label: 'label', value: 'value' }] },
  },
]
// 互联网人员非必填字段
export const staffWebhRules = staffWebhSchema.filter(item => item.name !== 'docMultiSitedRecordList' &&
  item.name !== 'qualifyOrNot' &&
  item.name !== 'hosConfirmFlag' &&
  item.name !== 'recordFlag' &&
  item.name !== 'presRecordFlag' &&
  item.name !== 'nationalityCode' &&
  item.name !== 'graduateSchool' &&
  item.name !== 'licenseIssuingAuthority' &&
  item.name !== 'certificateIssuingAuthority' &&
  item.name !== 'qualificationCertificateForDoctor' &&
  item.name !== 'physicianQualificationCategory' &&
  item.name !== 'agreeTerms',
).map(item => ({ [item.name]: [{ required: true, message: '必填项', trigger: 'change' }] })).reduce((p, c) => ({
  ...p, ...c,
}), {})
export const staffWebCreditColumns = [
  {
    prop: 'orgName',
    label: '处罚医院名称',
  },
  {
    prop: 'punishReason',
    label: '处罚原因',
  },
  {
    prop: 'punishResult',
    label: '处罚结果',
  },
  {
    prop: 'punishTime',
    label: '处罚时间',
  },
  {
    prop: 'op',
    label: '操作',
    type: 'btns',
    btns: [
      'edit',
      // 'del',
    ],
  },
]
