import { whiteOrBlack, yidiFlag, isPoor, peopleType, savePersonType } from '@/rcm/otmdiscomponent/config-js/sdll-baseconfig.js'

export const formatters = {
  whiteOrBlack (val) {
    return whiteOrBlack[val]
  },
  yidiFlag (val) {
    return yidiFlag[val]
  },
  isPoor (val) {
    return isPoor[val]
  },
  peopleType (val) {
    return peopleType[val]
  },
  savePersonType (val) {
    return savePersonType[val]
  }
}
export const schemaInfo = [
  {
    label: '姓名',
    name: 'xm',
    comp: 'readonlyitem',
    col: {
      cla: 'firstRow'
    }
  },
  {
    label: '性别',
    name: 'xb',
    comp: 'readonlyitem',
    col: {
      cla: 'firstRow'
    },
    props: {
      filter: 'formatSex'
    }
  },
  {
    label: '社会保障号码',
    name: 'grbh',
    comp: 'readonlyitem',
    col: {
      cla: 'firstRow'
    }
  },
  {
    label: '支付标志(灰名单标志)',
    name: 'zfbz',
    comp: 'readonlyitem',
    props: {
      formatter: formatters.whiteOrBlack
    },
  },
  {
    label: '支付说明(灰名单原因)',
    name: 'zfsm',
    comp: 'readonlyitem'
  },
  {
    label: '单位名称',
    name: 'dwmc',
    comp: 'readonlyitem'
  },
  {
    label: '医疗人员类别',
    name: 'ylrylb',
    comp: 'readonlyitem'
  },
  {
    label: '异地标志',
    name: 'ydbz',
    comp: 'readonlyitem',
    props: {
      formatter: formatters.yidiFlag
    },
  },
  {
    label: '疾病编码',
    name: 'mzdbjbs',
    comp: 'readonlyitem'
  },
  {
    label: '门诊大病备注',
    name: 'mzdbbz',
    comp: 'readonlyitem'
  },
  {
    label: '社保局编码',
    name: 'sbjgbh',
    comp: 'readonlyitem'
  },
  {
    label: '有无15(医保参数控制)天内的住院记录',
    name: 'zhzybz',
    comp: 'readonlyitem'
  },
  {
    label: '15(医保参数控制)天内的住院记录说明',
    name: 'zhzysm',
    comp: 'readonlyitem'
  },
  {
    label: '转出医院名称',
    name: 'zcyymc',
    comp: 'readonlyitem'
  },
  {
    label: '转出医院出院日期',
    name: 'zccyrq',
    comp: 'readonlyitem'
  },
  {
    label: '人群类别',
    name: 'rqlb',
    comp: 'readonlyitem',
    props: {
      formatter: formatters.peopleType
    },
  },
  {
    label: '出生日期',
    name: 'csrq',
    comp: 'readonlyitem'
  },
  {
    label: '优抚对象标志',
    name: 'yfdxbz',
    comp: 'readonlyitem',
    props: {
      formatter: (val) => {
        return +val ? '是' : '否'
      }
    },
  },
  {
    label: '优抚对象类别',
    name: 'yfdxlb',
    comp: 'readonlyitem'
  },
  {
    label: '参保地市编号',
    name: 'cbdsbh',
    comp: 'readonlyitem'
  },
  {
    label: '参保机构名称',
    name: 'cbjgmc',
    comp: 'readonlyitem'
  },
  {
    label: '多社保局标志',
    name: 'multisbj',
    comp: 'readonlyitem'
  },
  {
    label: '多社保局信息',
    name: 'multisbjds',
    comp: 'readonlyitem'
  },
  {
    label: '门诊定点标志',
    name: 'mzddbz',
    comp: 'readonlyitem',
    props: {
      formatter: (val) => {
        return +val ? '是' : '否'
      }
    },
  },
  {
    label: '门诊定点说明',
    name: 'mzddsm',
    comp: 'readonlyitem'
  },
  {
    label: '普通门诊慢性病备案疾病',
    name: 'ptmzjbs',
    comp: 'readonlyitem'
  },
  {
    label: '余额',
    name: 'ye',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    }
  },
  {
    label: '救助人员类别',
    name: 'jzrylb',
    comp: 'readonlyitem',
    props: {
      formatter: formatters.savePersonType
    },
  },
  {
    label: '贫困人口标志',
    name: 'pkrkbz',
    comp: 'readonlyitem',
    props: {
      formatter: formatters.isPoor
    },
  },
  {
    label: '单位性质名称',
    name: 'dwxzmc',
    comp: 'readonlyitem'
  },
  {
    label: '居民两病备案疾病编码',
    name: 'lbjbbm',
    comp: 'readonlyitem'
  },
  {
    label: '工伤检查信息',
    name: 'gsjcxx',
    comp: 'readonlyitem'
  },
]
