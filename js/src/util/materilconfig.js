import { get } from 'lodash'
export const GLOBAL_ATTR = [
  { id: 10001, name: '单行文本', default: '' },
  { id: 10002, name: '多行文本', default: '' },
  { id: 10003, name: '单选', default: {} },
  { id: 10004, name: '多选', default: [] },
  { id: 10005, name: '单行数字文本', default: '' },
  { id: 10006, name: '固定组件-全局指向', default: {} },
  { id: 10007, name: '日期', default: '' },
  { id: 10008, name: '单张图片', default: '' },
  { id: 10009, name: '固定组件多选-全局指向', default: [] },
  { id: 10010, name: '资质证照', default: '' },
  { id: 10011, name: '省市区三级联动', default: '' },
  { id: 10012, name: '系统计算展示', default: '' },
  { id: 10013, name: '固定组件-本地指向', default: {} },
  { id: 10014, name: '固定组件多选-本地指向', default: [] },
  { id: 10015, name: '多张图片', default: [] },
  { id: 10016, name: '富文本', default: '' }
]
// 西药类型
export const WEST_MEDICINE_TYPE = ['301', '302']
// 中药类型
export const CHINESE_MEDICINE_TYPE = ['303', '304']
// 耗材
export const CONSUMABLES_TYPE = ['299', '300', '10008']
// 血液
export const BLOOD_IDTYPE = ['c9a969e9-1962-4bfd-a9aa-093f1c6fd362']
// 在manages／config／index中重复定义：在历史枚举方法中需要使用，不导入是为了不造成间接引用进入公共包文件
// 商品、耗材字段定义
const MODEL_SPECIFICATION = 'SXX000008' // 型号规格 \ 规格
// const CHINESE_MODEL_SPECIFICATION = 'SXX000049' // 中药规格
// 计量单位 （包装单位）
export const WARES_PACKAGE_CODE = [MODEL_SPECIFICATION, PACKAGE_CODE] // 商品、耗材包装规格
export const CHINESE_MEDICINE_PACKAGE_CODE = [PACKAGE_CODE] // 中药包装规格
export const PACKAGE_MUSTER = { // 物资单位集合（中药、耗材、商品）
  WARES_PACKAGE_CODE,
  CHINESE_MEDICINE_PACKAGE_CODE
}

// 卓正药签名中文
export const ZZ_DRUG_NAME_CH = 'SXX180922000148kvMT'
// 卓正药签英文
export const ZZ_DRUG_NAME_CN = 'SXX180922000158kW5e'
// 用药指导中文
export const DRUG_GUIDANCE_CH = 'SXX180922000168kZwZ'
// 用药指导英文
export const DRUG_GUIDANCE_CN = 'SXX19032000004AHHwp'
// 药品标识码
export const IDENTIFICATION_CODE = 'SXX18111400001AzKfO'
// 用药注意事项
export const DRUG_WARN_CODE = 'SXX19031800003B0oow'
// 咨询电话
export const TELEPHONE_CODE = 'SXX000069'
// 批准文号
export const APPROVAL_CODE = 'SXX000001'
// 注册证号
export const SIGNUP_CODE = 'SXX000002'
// 包装单位code
export const PACKAGE_CODE = 'SXX000048'
// 制剂单位code
export const ZHIJI_CODE = 'SXX000047'
// 条码编号code
export const BAR_CODE = 'SXX000050'
// 生产厂商
export const PRODUCER = 'SXX000009'
// 剂型
export const DOSAGE = 'SXX000007'
// 是否皮试
export const SKIN_TEST_CODE = 'SXX181002000037QiH'
// 通用名
export const GENERAL_CODE = 'SXX000003'
// 商品名
export const TRADE_NAME = 'SXX000005'
// 包装转换比
export const PACKAGE_TRANSFORM_CODE = 'SXX000049'
// 说明书规格（手动录入字段）
export const SPEC = 'SXX000008'
// 剂量
export const DOSE = 'SXX000010'
// 是否允许复用
export const MULTIPLEX_CODE = 'SXX19011500001zpMoy'
// 成药规格
export const MEDICINE_SPEC_CODE = 'SXX18090500001zsshk'
// 成分规格
export const COMPONENT_SPEC_CODE = 'SXX18090500002zsOBI'
// 频次
export const FREQUENCY_CODE = 'SXX000017'
// 科室类型
export const SENTENCE = 'SXX000118'
// 临床类型
export const CLINICAL = 'SXX190116000017V5Fl'
// 全局物资查询code
export const SEARCH_CODE = [GENERAL_CODE, TRADE_NAME]
// 物资名称显示code
export const MATERILA_CODE = [...SEARCH_CODE, SPEC] // 去掉规格和生产厂商（生产厂商放整个名称最后）todo 煤老板说的 10.02 20:16 --- 楠姐又让加上规格  10.25
// 物资规格code
export const SPEC_CODE = [PACKAGE_TRANSFORM_CODE, ZHIJI_CODE, PACKAGE_CODE, DOSAGE]
// 物资名称
export const MATERILA_NAME_CODE = [...SEARCH_CODE, DOSAGE]
// 物资spu包装规格
export const SPU_SPEC_CODE = [PACKAGE_TRANSFORM_CODE, ZHIJI_CODE, PACKAGE_CODE]
// 物资拼音码批准文号
export const MATERILA_PINYIN_CODE = [APPROVAL_CODE, 'SXX000004', 'SXX000006']
// 贮藏说明
export const STORAGE_EXPLAIN = 'SXX18111000001DIiMV'
// 特殊告知
export const SPECIAL_NOTIFICATION = 'SXX18111000002DIugu'
// 注意事项
export const WARN_CODE = 'SXX000025'
// 功能主治（目前对应适应症显示）
export const INDICATION = 'SXX000021'
// 血液RH(D)血型code
export const SPECIAL_BLOOD_TYPE = 'SXX18090600003zyb46'
// 血型code
export const BLOOD_TYPE = ['SXX18090600001zy3Qw', 'SXX18090600002zyKs2', 'SXX18090600003zyb46']
// 血液规格
export const BLOOD_SPECIFICATION = ['SXX18090600004zyfhW', 'SXX18090600005zyhD']
// 人员code
export const STAFF_CODE = ['SXX000083', 'SXX000085', 'SXX000086', 'SXX000094', 'SXX000084']
// 机构code
export const MECHANISM_CODE = ['SXX000055', 'SXX000059', 'SXX000057', 'SXX000061']
// 部门code
export const DEPARTMENT_CODE = ['SXX000080', 'SXX000081']
// 建筑code
export const BUILDING_CODE = ['SXX000095', 'SXX000096', 'SXX000099', 'SXX000101']
// 房间code
export const ROOM_CODE = ['SXX000103', 'SXX000102', 'SXX000105', 'SXX000106', 'SXX000104', 'SXX000107', 'SXX000108', 'SXX000099', 'SXX181002000016BqnC']
// 床位code
export const BED_CODE = ['SXX000109', 'SXX000111', 'SXX000112', 'SXX000113', 'SXX000126']
// 科室code
export const SENTENCE_CODE = ['SXX000117', 'SXX000116', SENTENCE]
// 病区code
export const SPACE_CODE = ['SXX000120', 'SXX000121', 'SXX000123']

// =================== 新建物资 SPU + SKU =======================
// 门诊 、住院销售单位
const SALES_UNIT_CODE = ['SXX19030700004BLxfN', 'SXX19030700003BLuIE']
// 医嘱
const DOCTOR_ADVICE_CODE = 'SXX19030700005Ba2K'
// 创建物资模版
export const MATERIALTEMPLATE = {
  WEST_TEMPLATE: [ // 西药/中成药
    { // 基础信息
      title: '基础信息',
      schema: ['SXX000003', 'SXX000004', TRADE_NAME, 'SXX000006', 'SXX000001', 'SXX000009', { name: 'materialBarCodes', label: '商品条形码', comp: 'custom' }, 'SXX000007', 'SXX000008',
        {
          name: 'markupPercentage',
          label: '加成率',
          comp: 'custom'
        }, 'SXX000051', 'SXX2009240000165TqS'
      ],
      slot: ['materialBarCodes', 'markupPercentage']
    },
    { // 标志信息 (categoryRelations为药理分类，需要特殊处理，暂时使用categoryRelations占位)
      title: '标志信息',
      schema: ['SXX000014', 'SXX000013', 'SXX000012', 'categoryMaterialRelationList', 'SXX19030700002B0q3b', 'SXX181002000037QiH', 'SXX20021700001AFMaJ']
    },
    { // 财务信息
      title: '财务信息',
      schema: ['SXX19030500001ATTD']
    },
    { // 医嘱信息
      title: '医嘱信息',
      warning: `注意：以下内容，请依据临床医嘱实际情况填写`,
      schema: ['SXX000011'],
      slot: ['pictureDescribe']
    },
    {
      title: '包装规格',
      schema: [{
        name: 'spec',
        comp: 'custom',
        span: 24
      }],
      slot: ['spec']
    }
  ],
  WEST_OPTIONS: { // 西药/中成药 - 自定义option
    SPECSCHEMAARR: { 'SXX000049': '', 'SXX000048': '', 'price': '', 'SXX000050': '', 'ceilingPrice': '' }, // 规格
    MEDICINEOPTIONS: { // 制剂单位区分 成药/成分/制剂
      '03': [ZHIJI_CODE, 'SXX000054', 'SXX18090500001zsshk', DOSE, 'SXX000016', 'SXX000017', ...SALES_UNIT_CODE, MULTIPLEX_CODE, DOCTOR_ADVICE_CODE],
      '01': [ZHIJI_CODE, 'SXX000053', 'SXX18090500002zsOBI', DOSE, 'SXX000016', 'SXX000017', ...SALES_UNIT_CODE, MULTIPLEX_CODE, DOCTOR_ADVICE_CODE],
      '02': [ZHIJI_CODE, DOSE, 'SXX000016', 'SXX000017', ...SALES_UNIT_CODE, MULTIPLEX_CODE, DOCTOR_ADVICE_CODE]
    },
    MEDICINEIMGS: { // 图例 成药/成分/制剂
      '03': [require('@/assets/img/materialexample/chengyao1.png'), require('@/assets/img/materialexample/chengyao2.png'), require('@/assets/img/materialexample/chengyao3.png')],
      '01': [require('@/assets/img/materialexample/chengfen.png')],
      '02': [require('@/assets/img/materialexample/zhiji.png')]
    }
  },
  CHINESE_TEMPLATE: [ // 中药饮片/中药颗粒
    { // 基础信息
      title: '基础信息',
      schema: ['SXX000003', 'SXX000004', TRADE_NAME, 'SXX000006', 'SXX000001', 'SXX000009', 'SXX000007', 'SXX000008',
        {
          name: 'markupPercentage',
          label: '加成率',
          comp: 'custom'
        }, 'SXX000051', 'SXX2009240000165TqS'
      ],
      slot: ['markupPercentage']
    },
    { // 标志信息 (categoryRelations为药理分类，需要特殊处理，暂时使用categoryRelations占位)
      title: '标志信息',
      schema: ['SXX000014', 'SXX000013', 'SXX000012', 'categoryMaterialRelationList', 'SXX19030700002B0q3b', 'cdssRuleRelation']
    },
    { // 财务信息
      title: '财务信息',
      schema: ['SXX19030500001ATTD']
    },
    { // 医嘱信息
      title: '医嘱信息',
      schema: ['SXX000011', ZHIJI_CODE]
    }
    // ,
    // {
    //   title: '包装单位',
    //   schema: [{
    //     name: 'spec',
    //     comp: 'custom',
    //     span: 24
    //   }],
    //   slot: ['spec']
    // }
  ],
  CHINESE_OPTIONS: { // 中药饮片/中药颗粒 - 自定义option
    SPECSCHEMAARR_ONE: { 'SXX000008': '', 'SXX000048': '', 'SXX000049': '1', 'price': '', 'ceilingPrice': '' }, // 中药饮片规格 (包装单位默认为 1)
    SPECSCHEMAARR_TWO: { 'SXX000008': '', 'SXX000048': '', 'SXX000049': '1', 'price': '', 'SXX000052': '', 'ceilingPrice': '' }, // 中药颗粒规格 (包装单位默认为 1)
    MEDICINEOPTIONS: {
      '02': [DOSE, 'SXX000016', 'SXX000017', ...SALES_UNIT_CODE, MULTIPLEX_CODE, DOCTOR_ADVICE_CODE]
    }
  },
  CONSUMABLES_TEMPLATE: [ // 耗材 - 医疗耗材
    { // 基础信息
      title: '基础信息',
      schema: [TRADE_NAME, 'SXX000006', 'SXX000003', 'SXX000004', 'SXX000002', 'SXX000009',
        {
          name: 'materialBarCodes',
          label: '商品条形码',
          comp: 'custom'
        },
        {
          name: 'markupPercentage',
          label: '加成率',
          comp: 'custom'
        }
      ],
      slot: ['materialBarCodes', 'markupPercentage']
    },
    { // 管理信息 (isExpiryDate为按有效期管理，需要特殊处理，暂时使用isExpiryDate占位, isManageAlone为一物一码管理，需要特殊处理，暂时使用isManageAlone占位)
      title: '管理信息',
      schema: [
        {
          name: 'isExpiryDate',
          comp: 'sys-select',
          label: '按有效期管理',
          props: {
            options: [
              {
                id: '0',
                name: '否'
              },
              {
                id: '1',
                name: '是'
              }
            ]
          },
          style: 'width:100%',
          span: 12
        },
        // {
        //   name: 'isManageAlone',
        //   comp: 'select',
        //   label: '按唯一码管理',
        //   props: {
        //     options: [
        //       {
        //         id: 0,
        //         label: '否'
        //       },
        //       {
        //         id: 1,
        //         label: '是'
        //       }
        //     ]
        //   },
        //   style: 'width:100%',
        //   span: 12
        // }
      ]
    },
    { // 销售信息 (ifService为生成医嘱项，需要特殊处理，暂时使用ifService占位)
      title: '销售信息',
      schema: [
        {
          name: 'ifService',
          comp: 'select',
          label: '生成医嘱项',
          props: {
            options: [{
              id: 1,
              label: '否'
            }, {
              id: 2,
              label: '是'
            }]
          },
          style: 'width:100%',
          span: 12
        },
        {
          name: 'ifCharge',
          comp: 'select',
          label: '生成收费项',
          props: {
            options: [{
              id: 0,
              label: '否'
            }, {
              id: 1,
              label: '是'
            }]
          },
          style: 'width:100%',
          span: 12
        }
      ]
    },
    {
      title: '包装规格',
      schema: [{
        name: 'spec',
        comp: 'custom',
        span: 24
      }],
      slot: ['spec']
    }
  ],
  CONSUMABLES_TEMPLATE2: [ // 耗材 - 其他耗材
    { // 基础信息
      title: '基础信息',
      schema: [TRADE_NAME, 'SXX000006', 'SXX000009', {
        name: 'materialBarCodes',
        label: '商品条形码',
        comp: 'custom'
      }, {
        name: 'markupPercentage',
        label: '加成率',
        comp: 'custom'
      }],
      slot: ['materialBarCodes', 'markupPercentage']
    },
    {
      title: '包装规格',
      schema: [{
        name: 'spec',
        comp: 'custom',
        span: 24
      }],
      slot: ['spec']
    }
  ],
  CONSUMABLES_OPTIONS: { // 耗材 - 自定义option
    SPECSCHEMAARR_ONE: { 'SXX000008': '', 'SXX000048': '', 'price': '', 'SXX000050': '', 'ceilingPrice': '' }, // 生成医嘱项规格
    SPECSCHEMAARR_TWO: { 'SXX000008': '', 'SXX000048': '', 'SXX000050': '', 'ceilingPrice': '' }, // 不生成医嘱项规格
    STATUS_ONE: [{ id: 0, name: '否' }, { id: 1, name: '是' }], // 按有效期管理/一物一码管理 option
    STATUS_TWO: [{ id: 1, name: '否' }, { id: 2, name: '是' }], // 生成医嘱项 option
    IFSERVICE: {
      1: [],
      2: ['SXX19030500001ATTD', ...SALES_UNIT_CODE, DOCTOR_ADVICE_CODE]
    }
  }
}

export const MATERIALFORM = {
  BASIC: { // 基础信息
    TITLE: {
      name: 'basicInfo'
    },
    INFO: ['SXX000003', 'SXX000004', TRADE_NAME, 'SXX000006', 'SXX000001', 'SXX000009', 'SXX000007', 'SXX000008'
    ]
  },
  SIGN: { // 标志信息
    TITLE: {
      name: 'signInfo'
    },
    INFO: ['SXX000014', 'SXX000013', 'SXX000012', 'categoryRelations', 'SXX19030700002B0q3b', 'SXX181002000037QiH/'
    ]
  },
  FINANCE: { // 财务信息
    TITLE: { name: 'financeInfo' },
    INFO: ['SXX19030500001ATTD+']
  },
  MEDICINE: { // 医嘱信息
    TITLE: {
      name: 'doctorAdvice'
    },
    INFO: ['SXX000011'
    ],
    SUB: {
      name: 'pictureDescribe',
      span: 16,
      attrs: {
        class: 'doctorAdvice'
      }
    }
  }
}
export const MATERIA_TYPE_OPTIONS = [ // 物资分类
  {
    id: '',
    name: '全部',
    value: ''
  },
  {
    id: '301',
    name: '西药',
    value: '301'
  },
  {
    id: '302',
    name: '中成药',
    value: '302'
  },
  {
    id: '303',
    name: '中药饮片',
    value: '303'
  },
  {
    id: '304',
    name: '中药颗粒',
    value: '304'
  },
  {
    id: '10008',
    name: '商品',
    value: '10008'
  },
  {
    id: '299',
    name: '办公耗材',
    value: '299'
  },
  {
    id: '300',
    name: '医疗耗材',
    value: '300'
  }
]
// 全局物资名称配置
export const GOLBAL_VAL_MATERIL_NAME = {
  // 使用场景：采购申请（申请采购物资、管理工作站物资列表）
  // 用于商品展示 -> 通用名（商品名）、说明书规格、批准文、生产厂商
  // 用于商品搜索 -> 通用名（商品名）、说明书规格、拼接规格（standard: true）、批准文、生产厂商
  NAME_ONE: [...MATERILA_CODE, [], APPROVAL_CODE, PRODUCER],
  // 用于商品搜索 + standard: true，展示拼接规格 2019-11-20 安百强添加 用来区分拆零物资
  // 单独展示拼接规则时，传递 code: [[]] 并且添加 standard: true 会自动生成拼接规则
  // 通用名、商品名、规格、物资规格code()
  NAME_TWO: [...MATERILA_CODE, SPEC_CODE],
  // name匹配规则 产品现在要求药品显示通用名（商品名）-说明书规格-批准文号
  NAME_THREE: [...MATERILA_CODE, [], APPROVAL_CODE],
}
export const patch = {
  /**
   *
   * 设置物资名称
   * @param {array} rows            物资字段数组
   * @param {array} [code=[]]       需要转义的字段默认为一个空数组，也可为字符串code
   * @param {string} attributeValue 属性Value值
   * @param {string} [mark=' - ']   分隔符
   * @param {boolean} isInfo        是否需要默认code（默认为真）
   * @returns String
   */
  _resetMaterialName ({ rows, code = [], attributeValue, mark = ' - ', isInfo = true }) {
    let returnName = ''
    if (!attributeValue && isInfo) {
      // 添加批准文号 APPROVAL_CODE
      code = MATERILA_CODE.concat(code).concat([PRODUCER]).concat([APPROVAL_CODE])
    }
    if (Array.isArray(code) && code.length) {
      let arr = []
      for (let i = 0; i < code.length; i++) {
        let tempCode = code[i]
        if (Array.isArray(tempCode)) {
          let aArr = []
          tempCode.forEach(item => {
            depend({ rows, arr: aArr, tempCode: item, attributeValue })
          })
          aArr.length === 1 ? aArr[0].replace(/\//g, ' ') : aArr
          aArr.join('') && arr.push(aArr.join(''))
        } else {
          depend({ rows, arr, tempCode })
        }
        arr.forEach((item, i) => {
          if (!item) arr.splice(i, 1)
        })
      }
      returnName = arr.length > 1 ? arr.join(mark) : arr.join(' ')
    } else {
      let index = rows.findIndex(item => {
        return item.propertyCode === code
      })
      if (rows[index] && rows[index].propertyValue) returnName = returnName = rows[index].propertyValue
    }
    returnName = returnName || ''
    return returnName
  },
  /**
   * 查找物资中某个字段的值
   *
   * @param {array}   arr       物资字段数组
   * @param {string}  code      需要查找的字段值
   * @param {string}  field     取name或者其他
   * @returns String
   */
  findBasesourceCode ({ arr, field, code = PACKAGE_CODE, addressOptions, defaultLabel }) {
    let baseSource = []
    depend({ rows: arr, arr: baseSource, tempCode: code, field, addressOptions, defaultLabel })
    return baseSource.length ? baseSource[0] : ''
    // 不明真相的注释 -- substring
    // return (code === PACKAGE_CODE && baseSource.length) ? baseSource[0].substring(1) || '' : baseSource[0] || ''
  },
  /**
   * isSkinTestMaterial 判断是否含有皮试属性的物资
   * @param {Object} item 物资数据对象
   * @returns Boolean 是/否
   */
  isSkinTestMaterial (item) {
    return findSkinTestMaterial(item)
  }
}

/**
 * findSkinTestMaterial 查找是否含有皮试属性的物资
 * @param {Object} item 物资数据对象
 * @returns Boolear 是/否
 */

const findSkinTestMaterial = item => {
  const arr = item.localSettingObject.materialSkuObject.ext
  const skintest = parserJSON({
    data: arr,
    property: SKIN_TEST_CODE
  })
  return skintest === '是'
}

/**
 * 设置物资名称依赖方法   ----- “ 别没事在后面加 空格 ”
 *
 * @param {array} rows             物资字段数组
 * @param {array} arr              暂存转义后内容
 * @param {string} tempCode        具体需要查找的字段
 * @param {string} attributeValue  具体需要查找的对应object
 * @param {string}  field          取name或者其他
 * @param {string}  defaultLabel   制剂单位末尾添加分隔符
 */

function depend ({ rows, arr, tempCode, attributeValue, field = 'name', defaultLabel = '/' }) {
  if (!rows) return
  let name = ''
  let index = rows && rows.length && rows.findIndex(item => {
    return item.propertyCode === tempCode
  })
  if (index > -1) {
    if (!rows[index]) return
    if (rows[index].propertyType === GLOBAL_ATTR[2].id || rows[index].propertyType === GLOBAL_ATTR[3].id) {
      let propertyName
      if (attributeValue) {
        propertyName = rows[index][attributeValue]
      } else {
        propertyName = rows[index].templetPropertyValues || rows[index].materialPropertyValues || rows[index].materialDictPropertys || rows[index].materialPropertys
      }
      if (propertyName) {
        for (let m = 0; m < propertyName.length; m++) {
          if (propertyName[m].propertyValueObject) {
            name += propertyName[m].propertyValueObject[field] || ''
          } else if (propertyName[m].propertyObject) {
            name += propertyName[m].propertyObject[field] || ''
          } else {
            name += propertyName[m][field]
          }
          // 制剂单位 ||  RH(D)血型
          // || tempCode === SPECIAL_BLOOD_TYPE
          if (tempCode === ZHIJI_CODE) name += defaultLabel
          // 血液品种
          if (tempCode === BLOOD_TYPE[0]) name += ' '
          if (tempCode === BED_CODE[2]) name += '  '
          if (tempCode === DOSAGE) name = ' ' + name
        }
      }
    } else if (rows[index].propertyType === GLOBAL_ATTR[5].id) {
      name = rows[index].specialName ? rows[index].specialName : rows[index].propertyValue ? rows[index].propertyValue : ''
    } else if (rows[index].propertyType === GLOBAL_ATTR[10].id) {
      name = rows[index].propertyValue
      // if (rows[index].propertyValue) {
      // let addressObj = JSON.parse(rows[index].propertyValue)
      // const province = addressObj.province // 省
      // const city = addressObj.city // 市
      // const county = addressObj.county // 县
      // const address = addressObj.addressDetail // 详细地址
      // name = multValues(name, addressOptions, [province, city, county]) + address
      // }
    } else if (rows[index].propertyValue) {
      name += rows[index].propertyValue
    }
    arr.push(name)
  }
}
/**
 *  获取省市区地址
 *
 * @param {*} name      原值
 * @param {*} list      元数据
 * @param {*} args      参数（需要查找的）
 * @returns String  （原值 + 新值）
 */
// function multValues (name, list, args) {
//   if (!list || !args) return name
//   const val = args.shift()
//   const obj = list.find(item => item.value === val)
//   name += (obj && obj.label || '') + ' '
//   if (obj && obj.children && obj.children.length) return multValues(name, obj.children, args)
//   return name
// }
/**
 *  解析新版本json数据格式展示内容
 *
 * @param {*} data            数据源对象
 * @param {*} property        属性值
 * @param {*} key             取name还是id(key)
 * @returns
 */
export const parserJSON = function ({ data, property = PACKAGE_CODE, key = 'name', split = ' - ', connect = ',' }) {
  if (!data || !data[property]) return ''
  const curValue = data[property]
  if (Array.isArray(curValue)) {
    let name = ''
    curValue.map(item => {
      name += (typeof item === 'string' ? item : item[key]) + connect
    })
    return name ? name.substring(0, name.length - 1) || split : ''
  } else if (curValue instanceof Object) {
    return curValue[key] || ''
  } else {
    return curValue || ''
  }
}

/**
 *  解析新版本json数据格式展示内容（二维数组解析）
 * standard: 是否展示自拼接规则数据
 * @param {Object} { data, propertys, key = 'name', split = '-', standard = false }
 * @param {Array} propertys    属性值 - 二维数组（暂时支持）
 * @returns
 */
export const parserComplex = function ({ data, propertys, key = 'name', split = ' - ', classifyId, standard = false }) {
  let name = ''
  if (typeof propertys === 'string') { // 字符串转数组
    propertys = [propertys]
  }
  const oldStandard = standard // 记录外界是否传入需要显示拼接规格标识
  const classify = get(data, 'classifyObject.id', '') || classifyId
  // 非西药，并且未传入 standard = true 初始化为true
  if (!WEST_MEDICINE_TYPE.includes(classify) && !standard) standard = true
  const newPropertys = JSON.stringify(propertys)
  if (newPropertys === '[[]]' && standard && CONSUMABLES_TYPE.includes(classify)) { // 商品、耗材不展示规格
    return '-'
  }
  if (Array.isArray(propertys) && propertys.length) {
    propertys.forEach(property => { // 暂不考虑三维数组，只支持到二维数据（在家coding）
      if (Array.isArray(property) && standard) { // 进入二次循环获取规格单位
        let modifier = false // 是否需要添加修饰符 ”／“
        // 重置所有包装规格展示
        if (WEST_MEDICINE_TYPE.includes(classify)) {
          modifier = true
          property = SPU_SPEC_CODE
        } else if (BLOOD_IDTYPE.includes(classify)) {
          property = BLOOD_SPECIFICATION
        } else if (CHINESE_MEDICINE_TYPE.includes(classify)) { // 中药展示制剂单位 2019-11-22 安百强去掉中药制剂单位展示
          if (oldStandard && String(propertys) !== '[[]]') {
            property = [ZHIJI_CODE]
          } else {
            property = []
          }
        } else {
          // 其他类型展示规则 | 耗材 | 商品 计量单位（包装单位）
          property = PACKAGE_MUSTER.CHINESE_MEDICINE_PACKAGE_CODE
        }
        let str = ''
        const space = ' '
        property.forEach(twoProperty => {
          const temp = parserJSON({ data, property: twoProperty, key, split: space })
          // 包装单位前加 "/"
          if (modifier && twoProperty === PACKAGE_CODE && data[PACKAGE_CODE]) {
            str += '/' + temp
          } else if ([BLOOD_TYPE[0], BED_CODE[2]].includes(twoProperty)) {
            str += temp + space
          } else if (twoProperty === DOSAGE && data[DOSAGE]) {
            str += space + temp
          } else {
            str += temp
          }
          // 血液品种
          // if (twoProperty === BLOOD_TYPE[0] && data[BLOOD_TYPE[0]]) str += space
          // if (twoProperty === BED_CODE[2] && data[BED_CODE[2]]) str += space
        })
        name += str ? `${str}${split}` : ''
      } else {
        // 非西药并且code为型号规格 \ 规格 - SPEC （去掉非西药下的spu规格展示）啥都不干
        if (!WEST_MEDICINE_TYPE.includes(classify) && property === SPEC) {
          // do nothing
        } else {
          const tempName = parserJSON({ data, property, key, split })
          if (CONSUMABLES_TYPE.includes(classify) && tempName) { // 商品、办公耗材、医疗耗材
            // 有啥显示啥（根据标准展示规则GOLBAL_VAL_MATERIL_NAME.NAME_ONE）
            name += tempName + split
          } else { // 西药 | 中药
            if (property === TRADE_NAME && tempName) {
              name = name.substring(0, name.length - split.length) + `（${tempName}）${split}`
            } else if (tempName) {
              name += tempName + split
            }
          }
        }
      }
    })
  }
  const strLen = name.length - split.length
  if (name.lastIndexOf(split) === strLen) {
    return name.substr(0, strLen)
  }
  return name
}

/*
此方法用来处理提交的ext对象里面值为空 但是提交的数据类型不对
templateData  模版数据
ext           提交的ext对象
*/

export const defaultObjectKey = (templateData, ext) => {
  let newExt = Object.assign({}, ext)
  for (let key in newExt) {
    templateData.forEach(item => {
      if (!newExt[key] && item.propertyCode === key) {
        let propertyType = item.propertyType
        GLOBAL_ATTR.map(global => {
          if (global.id === propertyType) newExt[key] = global.default
        })
      }
    })
  }
  return newExt
}
