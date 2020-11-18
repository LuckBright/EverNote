import { medicalType, personType, belongSys, medicalCategory, fundType, residentMark, Areas, personIdentity, medicalStatus } from '@/rcm/otmdiscomponent/config-js/sysqzyy-config.js'

export const formatters = {
  medicalType (val) {
    return medicalType[val]
  },
  personType (val) {
    return personType[val]
  },
  belongSys (val) {
    return belongSys[val]
  },
  medicalCategory (val) {
    return medicalCategory[val]
  },
  fundType (val) {
    return fundType[val]
  },
  residentMark (val) {
    return residentMark[val]
  },
  Areas (val) {
    return Areas[val]
  },
  personIdentity (val) {
    return personIdentity[val]
  },
  medicalStatus (val) {
    return medicalStatus[val]
  }
}
export const schema = [
  {
    label: '个人编号',
    name: 'personNo',
    comp: 'readonlyitem',
    col: {
      cla: 'firstRow'
    }
  },
  {
    label: '单位编号',
    name: 'companyCode',
    comp: 'readonlyitem',
    col: {
      cla: 'firstRow'
    }
  },
  {
    label: '身份证号',
    name: 'idNo',
    comp: 'readonlyitem',
    col: {
      cla: 'firstRow'
    }
  },
  {
    label: '姓名',
    name: 'name',
    comp: 'readonlyitem',
  },
  {
    label: '性别',
    name: 'gender',
    comp: 'readonlyitem',
    props: {
      filter: 'formatSex'
    },
  },
  {
    label: '民族',
    name: 'nation',
    comp: 'custom',
  },
  {
    label: '出生日期',
    name: 'birthday',
    comp: 'readonlyitem'
  },
  {
    label: '社会保障卡卡号',
    name: 'socialCardNo',
    comp: 'readonlyitem'
  },
  {
    label: '人员身份',
    name: 'personnelIdentity',
    comp: 'readonlyitem',
    props: {
      formatter: formatters.personIdentity
    },
  },
  {
    label: '统筹区号',
    name: 'fundAreaCode',
    comp: 'readonlyitem',
    props: {
      formatter: formatters.Areas
    }
  },
  {
    label: '医疗人员类别',
    name: 'medicalPersonnelCategory',
    comp: 'readonlyitem',
    props: {
      formatter: formatters.personType
    }
  },
  {
    label: '医疗证号',
    name: 'medicalCertificateNo',
    comp: 'readonlyitem',
  },
  {
    label: '参保状态',
    name: 'insuredStatus',
    comp: 'readonlyitem',
    props: {
      formatter: formatters.medicalStatus
    },
  },
  {
    label: '异地人员标志',
    name: 'offSiteFlag',
    comp: 'readonlyitem',
    props: {
      formatter: (val) => {
        return val > 0 ? '是' : '否'
      }
    },
  },
  {
    label: '基金类型',
    name: 'fundType',
    comp: 'readonlyitem',
    props: {
      formatter: formatters.fundType
    }
  },
  {
    label: '年度',
    name: 'year',
    comp: 'readonlyitem'
  },
  {
    label: '在院状态',
    name: 'hosStatus',
    comp: 'readonlyitem',
    props: {
      formatter: (status) => {
        switch (status) {
          case '0':
            return '不在院'
          case '1':
            return '在院'
          case '':
            return ''
          default:
            return ''
        }
      }
    },
  },
  {
    label: '帐户余额',
    name: 'accountBalance',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '本年医疗费累计',
    name: 'yearCumulative',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '本年帐户支出累计',
    name: 'yearAccountCumulative',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '本年统筹支出累计',
    name: 'yearOverallCumulative',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '本年门诊大病统筹支出累计',
    name: 'yearBigCumulative',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '伤残军人补助累计',
    name: 'disabledSoliderCumulative',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '进入统筹费用累计',
    name: 'inFundCumulative',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '进入大病费用累计',
    name: 'inBigCumulative',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '进入公补费用累计',
    name: 'inPublicCumulative',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '本年起付标准累计',
    name: 'yearStartStandardPayment',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '本年住院次数累计',
    name: 'yearHospitalizationCount',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '公补自付累计',
    name: 'yearPublicSelfPaymentCumulative',
    comp: 'readonlyitem',
  },
  {
    label: '所属系统标识',
    name: 'systemId',
    comp: 'readonlyitem',
    props: {
      formatter: formatters.belongSys
    }
  },
  {
    label: '单位名称',
    name: 'companyName',
    comp: 'readonlyitem',
  },
  {
    label: '参保类别',
    name: 'insuredCategory',
    comp: 'readonlyitem',
    props: {
      formatter: formatters.medicalCategory
    }
  },
  {
    label: '公务员标识',
    name: 'officialMark',
    comp: 'readonlyitem',
  },
  {
    label: '医疗待遇类别',
    name: 'medicalTreatmentCategory',
    comp: 'readonlyitem',
    props: {
      formatter: formatters.medicalType
    }
  },
  {
    label: '居民标识',
    name: 'residentMark',
    comp: 'readonlyitem',
    props: {
      formatter: formatters.residentMark
    }
  },
  {
    label: '本年公补支付累计',
    name: 'yearPublicPaymentCumulative',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '本年进入公补费用累计(住院)',
    name: 'yearInIPPublicPaymentCumulative',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '本年进入公补费用累计(门诊)',
    name: 'yearInOPPublicPaymentCumulative',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '本年未进入公补的基本医疗起付线以下自付累计',
    name: 'yearPersonalPaymentCumulative',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '本年公补自付累计(住院)',
    name: 'yearIPPublicPaymentCumulative',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '本年公补自付累计(门诊)',
    name: 'yearOPPublicPaymentCumulative',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '个人自付比例',
    name: 'selfPaymentRatio',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  }]
