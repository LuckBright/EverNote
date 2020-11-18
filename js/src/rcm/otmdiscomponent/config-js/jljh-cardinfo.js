import { hosStatus, medicalStatus, unitType, aidMedicalType, careType, mainInsruance, personStatus, personType } from '@/rcm/otmdiscomponent/config-js/jljh-regInfo-config.js'
const formatAidStatus = (map, str, typeArr) => {
  let result = ''
  let strarr = str.split('')
  for (let i = 0; i < strarr.length; i++) {
    result += (typeArr[i] + ':')
    result += ((map[strarr[i]] || '') + ',')
  }
  return result.replace(/[,:]*$/, '')
}
export const formatters = {
  formatBirthday (val) {
    return val && val.substring(0, 8)
  },
  hosStatus (val) {
    return hosStatus[val]
  },
  medicalStatus (val) {
    return medicalStatus[val] || '未参保'
  },
  careType (val) {
    return careType[val]
  },
  aidType (val) {
    return val && formatAidStatus(medicalStatus, val, aidMedicalType)
  },
  mainInsruance (val) {
    return val && formatAidStatus(medicalStatus, val, mainInsruance)
  },
  unitType (val) {
    return unitType[val]
  },
  personStatus (val) {
    return personStatus[val]
  },
  personType (val) {
    return personType[val]
  }
}
export const schema = [
  {
    label: '账户余额',
    name: 'accountBalance',
    comp: 'readonlyitem',
    col: {
      cla: 'firstRow'
    },
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '所属区号',
    name: 'areaCode',
    comp: 'readonlyitem',
    col: {
      cla: 'firstRow'
    }
  },
  {
    label: '医疗辅助险种参保情况',
    name: 'auxiliaryType',
    comp: 'readonlyitem',
    props: {
      formatter: formatters.aidType
    },
    col: {
      cla: 'firstRow'
    }
  },
  {
    label: '出生日期',
    name: 'birthday',
    comp: 'readonlyitem',
    props: {
      formatter: formatters.formatBirthday
    }
  },
  {
    label: '生育主险种参保情况',
    name: 'brithMainType',
    comp: 'readonlyitem',
    props: {
      formatter: formatters.medicalStatus
    }
  },
  {
    label: '社会保障卡卡号',
    name: 'cardno',
    comp: 'readonlyitem'
  },
  {
    label: '经济类型',
    name: 'econType',
    comp: 'readonlyitem'
  },
  {
    label: '在院次数',
    name: 'hosNum',
    comp: 'readonlyitem'
  },
  {
    label: '在院状态',
    name: 'hosStatus',
    comp: 'readonlyitem',
    props: {
      formatter: formatters.hosStatus
    }
  },
  {
    label: '身份证号',
    name: 'idno',
    comp: 'readonlyitem'
  },
  {
    label: '工伤主险种参保情况',
    name: 'inJuryJobmainType',
    comp: 'readonlyitem',
    props: {
      formatter: formatters.medicalStatus
    },
  },
  {
    label: '照顾类别',
    name: 'lookAfterType',
    comp: 'readonlyitem',
    props: {
      formatter: formatters.careType
    }
  },
  {
    label: '医疗主险种参保情况',
    name: 'mainType',
    comp: 'readonlyitem',
    props: {
      formatter: formatters.mainInsruance
    }
  },
  {
    label: '民族',
    name: 'nationSys',
    comp: 'custom',
  },
  {
    label: '异地人员标志',
    name: 'offSiteFlag',
    comp: 'readonlyitem',
    props: {
      formatter: (val) => {
        return val ? '是' : '否'
      }
    },
  },
  {
    label: '姓名',
    name: 'personname',
    comp: 'readonlyitem'
  },
  {
    label: '个人编号',
    name: 'personno',
    comp: 'readonlyitem'
  },
  {
    label: '性别',
    name: 'sex',
    comp: 'readonlyitem',
    props: {
      filter: 'formatSex'
    },
  },
  {
    label: '人员状态',
    name: 'status',
    comp: 'readonlyitem',
    props: {
      formatter: formatters.personStatus
    },
  },
  {
    label: '隶属关系',
    name: 'subordination',
    comp: 'readonlyitem'
  },
  {
    label: '医疗待遇类别',
    name: 'treatType',
    comp: 'readonlyitem',
    props: {
      formatter: formatters.personType
    },
  },
  {
    label: '单位名称',
    name: 'unitName',
    comp: 'readonlyitem'
  },
  {
    label: '单位编号',
    name: 'unitNo',
    comp: 'readonlyitem'
  },
  {
    label: '单位类型',
    name: 'unitType',
    comp: 'readonlyitem',
    props: {
      formatter: formatters.unitType
    },
  },
  {
    label: '男职工配偶 年龄',
    name: 'wifeAge',
    comp: 'readonlyitem'
  },
  {
    label: '男职工配偶 出生日期',
    name: 'wifeBirthday',
    comp: 'readonlyitem'
  },
  {
    label: '男职工配偶 身份证号',
    name: 'wifeIdno',
    comp: 'readonlyitem'
  },
  {
    label: '男职工配偶 姓名',
    name: 'wifeName',
    comp: 'readonlyitem'
  },
  {
    label: '男职工配偶 性别',
    name: 'wifeSex',
    comp: 'readonlyitem',
    props: {
      filter: 'formatSex'
    },
  },
  {
    label: '年度',
    name: 'year',
    comp: 'readonlyitem'
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
    label: '本年门诊大病统筹支出累计',
    name: 'yearBigCumulative',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '本年生育统筹支出累计',
    name: 'yearBrithCumulative',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '本年门诊慢性病统筹支出累计',
    name: 'yearChronicCumulative',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '本年门诊慢性病起付标准自付累计',
    name: 'yearChronicSelfCumulative',
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
    label: '本年事业工伤统筹支出累计',
    name: 'yearGovJobCumulative',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '本年住院公务员补助支出累计',
    name: 'yearHosFunctionaryCumulative',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '本年工伤统筹支出累计',
    name: 'yearJobCumulative',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '本年离休统筹支出累计',
    name: 'yearLeaveCumulative',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '本年照顾费统筹支出累计',
    name: 'yearLookCumulative',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '本年现金支出累计',
    name: 'yearMoneyCumulative',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '本年门诊公务员补助支出累计',
    name: 'yearOutFunctionaryCumulative',
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
    label: '本年普通城镇居民目录内医疗费支出累计',
    name: 'yearResidentCumulative',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '本年救助金支出累计',
    name: 'yearSalvageCumulative',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '本年学生意外伤害门诊目录内医疗费支出累计',
    name: 'yearStudentAccidentCumulative',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '本年学生目录内医疗费支出累计',
    name: 'yearStudentCumulative',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '城镇居民缴费年限',
    name: 'yearsNum',
    comp: 'readonlyitem'
  }]
