import {regs} from '@/manages/page/organization/utils/model'
import { statusList } from '@/manages/page/organization/views/staff/model'
export const orgSchema = [
  // {
  //   name: 'titleBaseInfo',
  //   comp: 'custom',
  //   span: 24,
  // },
  {
    name: 'parentCode',
    label: '父机构编码',
    props: {
      disabled: true,
    },
    span: 12,
  },
  {
    name: 'parentName',
    label: '父机构名称',
    props: {
      disabled: true,
    },
    span: 12,
  },
  {
    name: 'code',
    label: '机构编码',
    comp: 'custom',
    props: {
      disabled: false,
    },
    span: 12,
  },
  {
    name: 'name',
    label: '机构名称',
    span: 12,
  },
  {
    name: 'nameEnglish',
    label: '机构英文名称',
    span: 12,
  },
  {
    name: 'shortName',
    label: '机构简称',
    span: 12,
  },
  {
    name: 'shortNameEnglish',
    label: '机构英文简称',
    span: 12,
  },
  {
    name: 'addressJson',
    label: '营业地址',
    comp: 'custom',
    span: 12,
  },
  {
    name: 'enableStatus',
    label: '机构状态',
    comp: 'select',
    parentClass: 'w',
    props: {
      options: statusList
    },
    span: 12,
  },
  {
    name: 'creditCode',
    label: '社会统一信用代码',
    span: 12,
  },
  {
    name: 'medicalInstitutionCode',
    label: '医疗机构代码',
    span: 12,
  },
  {
    name: 'medicalInstitutionPreparationLicence',
    label: '医疗机构制剂许可证',
    span: 12,
  },
  {
    name: 'medicalInstitutionPracticeLicence',
    label: '医疗机构执业许可证',
    span: 12,
  },
  {
    name: 'businessLicence',
    label: '营业执照',
    span: 12,
  },
  {
    name: 'necip',
    label: '国家企业信用信息公示',
    span: 12,
  },
  {
    name: 'openAccountLicence',
    label: '开户许可证',
    span: 12,
  },
  {
    name: 'orgPriority',
    label: '机构优先级',
    span: 12,
  },
  {
    name: 'businessStatus',
    label: '营业状态',
    comp: 'sys-type',
    props: {
      code: 'THC_SERVICE_STATE',
      useObject: true,
      objSimple: true,
    },
    span: 12,
  },
  {
    name: 'registeAddress',
    label: '注册地址',
    forceFullline: true,
  },
  {
    name: 'longitude',
    label: '经度',
    props: {
      disabled: true,
    },
    span: 12,
  },
  {
    name: 'latitude',
    label: '纬度',
    props: {
      disabled: true,
    },
    span: 12,
  },
  {
    name: 'lnglat',
    label: '选择位置',
    comp: 'custom',
    span: 24,
  },
  {
    name: 'services',
    label: '服务项目',
    span: 12,
  },
  {
    name: 'servicesEnglish',
    label: '服务项目英文',
    span: 12,
  },
  {
    name: 'businessTime',
    label: '营业时间',
    props: {
      placeholder: '例如：08:00-18:00'
    },
    span: 12,
  },
  {
    name: 'businessTimeEnglish',
    label: '营业时间英文',
    span: 12,
  },
  {
    name: 'servicesLanguage',
    label: '服务语言',
    comp: 'sys-type',
    props: {
      code: 'THC_SYS_LANGUAGE',
      multiple: true,
      useObject: true,
    },
    span: 12,
  },
  // {
  //   name: 'servicesLanguageEnglish',
  //   label: '服务语言英文',
  //   comp: 'sys-type',
  //   props: {
  //     code: 'THC_SYS_LANGUAGE',
  //     multiple: true,
  //     useObject: true,
  //     objSimple: true,
  //   },
  //   span: 12,
  // },
  {
    name: 'emergencyPhone',
    label: '急诊电话',
    span: 12,
  },
  {
    name: 'consultationPhone',
    label: '咨询电话',
    span: 12,
  },
  {
    name: 'consultationPhoneEnglish',
    label: '咨询电话英文',
    span: 12,
  },
  {
    name: 'busLine',
    label: '乘车路线',
    span: 12,
  },
  {
    name: 'busLineEnglish',
    label: '乘车路线英文',
    span: 12,
  },
  {
    name: 'note',
    label: '备注',
    props: {
      type: 'textarea',
    },
    span: 24,
  },
  {
    name: 'photo',
    label: '机构Logo',
    comp: 'custom',
  },
  {
    name: 'noteJson1',
    label: '机构图片',
    comp: 'custom',
  },
]
export const orgRules = {
  code: [
    {required: true, message: '必填项', trigger: 'change'},
    {pattern: regs.orgCode, message: '机构编码必须是三位数字', trigger: 'change'},
  ],
  name: [
    {required: true, message: '必填项', trigger: 'change'}
  ],
  addressJson: [
    {required: true, message: '必填项', trigger: 'change'}
  ],
  longitude: [
    {pattern: regs.longitude, message: '请输入-180.0到180.0之间到数字，必须输入1到5位小数', trigger: 'change'}
  ],
  latitude: [
    {pattern: regs.latitude, message: '请输入-90.0到90.0之间到数字，必须输入1到5位小数', trigger: 'change'}
  ],
  enableStatus: [
    {required: true, message: '必填项', trigger: 'change'}
  ],
}
export const webhSchema = [
  {
    name: 'orgCode',
    label: '医疗机构编码',
    props: {
      // disabled: true,
    }
  },
  {
    name: 'orgName',
    label: '医疗机构名称',
    props: {
      disabled: false,
    }
  },
  {
    name: 'orgAddress',
    label: '通信地址',
  },
  {
    name: 'orgContactName',
    label: '联系人姓名',
  },
  {
    name: 'orgTel',
    label: '联系电话',
  },
  {
    name: 'orgPrincipaName',
    label: '法人代表',
  },
  {
    name: 'dateRange',
    label: '执业许可证有效期',
    comp: 'date',
    parentClass: 'w',
    props: {
      type: 'daterange',
    }
  },
  {
    name: 'economicAttribute',
    label: '经济属性',
    comp: 'select',
    parentClass: 'w',
    props: {
      options: ['政府公立', '国企医院', '国有与民营合资', '民营', '外资'].map(item => ({id: item, name: item}))
    }
  },
  {
    name: 'orgCategory',
    label: '机构类别',
    comp: 'select',
    parentClass: 'w',
    props: {
      options: ['综合医院', '中医医院', '中西医结合医院', '民族医院', '专科医院', '康复医院', '妇幼保健院', '其他'].map(item => ({id: item, name: item}))
    }
  },
  {
    name: 'orgLevel',
    label: '机构级别',
    comp: 'select',
    parentClass: 'w',
    props: {
      options: ['三级', '二级', '一级'].map(item => ({id: item, name: item}))
    }
  },
  {
    name: 'orgGrade',
    label: '机构等次',
    comp: 'select',
    parentClass: 'w',
    props: {
      options: ['特等', '甲等', '乙等', '丙等', '未定等次'].map(item => ({id: item, name: item}))
    }
  },
  {
    name: 'authBeds',
    label: '编制床位',
  },
  {
    name: 'avgActualBeds',
    label: '平均开放床位',
  },
  {
    name: 'orgComment',
    label: '机构简介',
  },
  {
    name: 'deptComment',
    label: '诊疗科目列表',
    comp: 'custom',
  },
  {
    name: 'hosDigitalSign',
    label: '互联网医院备案-电子签章',
    parentClass: 'custom-form-item',
    comp: 'custom',
  },
  {
    name: 'recordFeasibility',
    label: '互联网医院备案-可行性报告',
    parentClass: 'custom-form-item',
    comp: 'custom',
  },
  {
    name: 'recordProve',
    label: '互联网医院执业许可证',
    parentClass: 'custom-form-item',
    comp: 'custom',
  },
  {
    name: 'recordRulesList',
    label: '互联网医院备案-医疗机构规章制度列表',
    parentClass: 'custom-form-item',
    comp: 'custom',
  },
  {
    name: 'recordTopology',
    label: '互联网医院备案-网络拓扑图',
    parentClass: 'custom-form-item',
    comp: 'custom',
  },
  {
    name: 'fileList',
    label: '资质文件列表',
    parentClass: 'custom-form-item',
    comp: 'custom',
  },
]
export const webhRules = webhSchema.filter(item => item.name !== 'fileList').map(item => ({[item.name]: [{required: true, message: '必填项', trigger: 'change'}]})).reduce((p, c) => ({
  ...p, ...c
}), {})
