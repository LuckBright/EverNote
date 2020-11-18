import Vue from 'vue'
import '@/inpatient/assets/common.head.less'
import headUrlMap from '@/manages/page/commonhead/urls'
import { request } from '@/util/req'
import commonUrl from '@/util/urls'
import socket from '@/inpatient/util/socket.js'
import { sourceTypeCodeMap, commonHeadEvent, ruleEngineMap, bizCodeMap } from '@/inpatient/components/common.head.model'
// todo 在此处引入自定义组件
// 引入所有的自定义组件 start
import CommonHeadName from '@/inpatient/components/common.head.component/common.head.name'
import CommonHeadHeight from '@/inpatient/components/common.head.component/common.head.height'
import CommonHeadWeight from '@/inpatient/components/common.head.component/common.head.weight'
import CommonHeadBloodPressure from '@/inpatient/components/common.head.component/common.head.bloodpressure'
import CommonHeadBloodOxygen from '@/inpatient/components/common.head.component/common.head.bloodoxygen'
import CommonHeadTemperature from '@/inpatient/components/common.head.component/common.head.temperature'
import CommonHeadPulse from '@/inpatient/components/common.head.component/common.head.pulse'
import CommonHeadBreath from '@/inpatient/components/common.head.component/common.head.breath'
import CommonHeadBmi from '@/inpatient/components/common.head.component/common.head.bmi'
import CommonHeadHeadCircumference from '@/inpatient/components/common.head.component/common.head.headcircumference'
import CommonHeadGestational from '@/inpatient/components/common.head.component/common.head.gestational'
import CommonHeadDrugAllergy from '@/inpatient/components/common.head.component/common.head.drugallergy'
import CommonHeadNonDrugAllergy from '@/inpatient/components/common.head.component/common.head.nondrugallergy'
import CommonHeadHeartRate from '@/inpatient/components/common.head.component/common.head.heartrate'
import CommonHeadDiagnose from '@/inpatient/components/common.head.component/common.head.diagnose'
import CommonHeadInfectiousDiseases from '@/inpatient/components/common.head.component/common.head.infectiousdiseases'
import CommonHeadSettlementButton from '@/inpatient/components/common.head.component/common.head.settlementbutton'
import CommonHeadBizInsurance from '@/inpatient/components/common.head.component/common.head.bizinsurance'
import CommonHeadDoctorAdviceSharing from '@/inpatient/components/common.head.component/common.head.doctoradvicesharing'
// 引入所有的自定义组件 end

let timer = null

export default Vue.component('common-head', {
  mixins: [socket],
  components: {
    // todo 在此处引入自定义组件
    CommonHeadName,
    CommonHeadHeight,
    CommonHeadWeight,
    CommonHeadBloodPressure,
    CommonHeadBloodOxygen,
    CommonHeadTemperature,
    CommonHeadPulse,
    CommonHeadBreath,
    CommonHeadBmi,
    CommonHeadHeadCircumference,
    CommonHeadGestational,
    CommonHeadDrugAllergy,
    CommonHeadNonDrugAllergy,
    CommonHeadHeartRate,
    CommonHeadDiagnose,
    CommonHeadInfectiousDiseases,
    CommonHeadSettlementButton,
    CommonHeadBizInsurance,
    CommonHeadDoctorAdviceSharing,
  },
  render (h) {
    return h('div', { class: 'common-head-box' + (this.isEmptyStation() ? ' is-empty-station' : '') }, [h('div', { class: `common-head-content${this.expand ? '' : ' not-expand'}` }, this.stationConfig.filter(item => !isExcept.bind(this)(item)).map((item, index) => h('span', {
      class: `common-head-item${item.paramKey === '-1' ? ' is-separate' : ''}${index === 0 ? ' is-first' : ''}`,
    }, [item.paramKey === '-1' ? '' : (item.type === 1 ? getCommonHeadText.bind(this)(h, item) : getCommonHeadCustom.bind(this)(h, item))]))), ...(this.showMore() ? [
      h('div', { class: 'common-head-more' }, [h('el-button', {
        class: 'common-head-more-btn',
        props: {
          size: 'mini',
        },
        on: {
          click: () => {
            this.expand = !this.expand
          },
        },
      }, ['更多', h('i', {
        class: `icon iconfont more ${this.expand ? 'icon-shang' : 'icon-xia'}`,
      }, [])])])
    ] : [])])
  },
  props: {
    // 患者档案号
    patientId: {
      type: String,
      required: true,
    },
    // todo 老代码中注释为门诊病案号 新接口查询患者信息需要"就诊流水号"，调用该组件时需要传就诊流水号 visitSerialNumber
    // 就诊流水号 || 门诊病案号 【优先解释为就诊流水号】
    visitNumber: {
      type: String,
    },
    // 工作站code
    code: {
      type: String,
      default: '001',
    },
    // hospitalizedNumber: String, // 住院病案号
    dptId: String, // 科室
  },
  data () {
    return {
      // 工作站配置信息
      stationConfig: [],
      // 患者信息 phr 接口获取的
      /**
       * 其中 visitSerialTypeCode 属性的含义
       * '1'：门诊
       * '2'：急诊
       * '3'：住院
       * '4'：体检
       * '5'：互联网
       * '9'：其他
       */
      patientInfo: {},
      // 患者信息 cunion 接口获取的
      cUnionPatientInfo: {},
      // 就诊流水号 由调用者传入组件
      // visitSerialNumber: this.visitNumber,
      expand: true,
      ruleList: [],
      insuranceData: [],
      // 就诊类型代码
      // visitSerialTypeCode: '',
      // 用于显示患者信息头的集合
      // headData: [],
      wsUrl: '/exchange/exchange.thc-msg.business.refresh_patient_head_info/routingKey.thc-msg.business.refresh_patient_head_info'
    }
  },
  watch: {
    patientId: {
      async handler (v) {
        await this.initData()
      },
    },
    visitNumber: {
      async handler (v) {
        // this.visitSerialNumber = v
        await this.initData()
      },
    },
  },
  async created () {
    // 1. 根据工作站code查询工作站的患者信息头部配置信息
    this.stationConfig = await this.searchStationConfig()
    this.stationConfig = this.stationConfig.map(item => ({
      // 加上value属性
      ...item, value: '',
    }))
    // console.log(this.stationConfig, 'this.stationConfig')
    // console.log(JSON.stringify(this.stationConfig), 'this.stationConfig')
    await this.initData()
    // 监听刷新
    this.$bus.$on(commonHeadEvent.refresh, this.initData)
    // 模拟刷新 test
    // setTimeout(() => {
    //   this.wscallback({
    //     biz: 'medical_record',
    //     patientId: '0C4gi8NIJrvXAwx1cJs',
    //     visitSerialNumber: 'BJOP202008067JT',
    //   })
    //   this.wscallback({
    //     biz: 'c-union',
    //     patientId: '0C4gi8NIJrvXAwx1cJs',
    //   })
    // }, 30000)
    // setTimeout(() => {
    //   this.wscallback({
    //     biz: 'rcm',
    //     patientId: 'DYysFbfFBHwP0grvmJ9',
    //     visitSerialNumber: 'IP20200603000054',
    //     visitSerialTypeCode: '2',
    //   })
    // }, 5000)
  },
  methods: {
    async initData () {
      clearTimeout(timer)
      timer = setTimeout(async () => {
        // 2. 根据患者id获取患者相关信息
        this.patientInfo = await this.searchPatientInfo()
        // this.$bus.$emit('headPatientInfo', this.patientInfo)
        // test start
        // this.patientInfo.visitSerialTypeCode = '1'
        // this.patientInfo.visitSerialTypeCode = '3'
        // test end
        this.cUnionPatientInfo = await this.searchCUnionPatientInfo()
        // 3. 赋值
        this.setConfigValue('thc-phr', this.patientInfo)
        // 3.1 获取所有配置项的类别
        const sourceTypeCodeListResult = await request(commonUrl.valueSet.getValueSetItems, { 'setCode': 'THC_SYS_PROJECT' })
        const sourceTypeCodeList = (sourceTypeCodeListResult ? sourceTypeCodeListResult.data : []).filter(item => item.code !== 'thc-phr').map(item => item.code)
        // 4. 根据 该工作站的配置信息 分别发送请求获取相应配置项的值
        await this.fetchAndSetHeadInfo(sourceTypeCodeList)
        // 请求商保数据
        await this.getInsurance()
      }, 200)
    },
    async getInsurance () {
      const res = await request(headUrlMap['c-union'].busiInsur, { patientId: this.patientId }, 'get')
      this.insuranceData = res.data
    },
    async searchStationConfig () {
      // .replace('THC_PATIENT_HEAD_', '')
      const res = await request(headUrlMap.thcPageHeadTemplateConfig.getDetailByCode, { code: this.code }, 'get')
      // 获取 是否展开 的初始值
      this.expand = res.data ? !!res.data.thcPageHeadTemplateConfig.isOpen : false
      return res.data ? (res.data.configs || []) : []
    },
    async searchPatientInfo () {
      // 过滤出 thc-phr 相关的配置项，获取该配置项的值，并且获取到 visitSerialTypeCode 作为其他接口的参数 所以要单独调用
      const res = await request(headUrlMap.headInfo['thc-phr'], {
        visitSerialNumber: this.visitNumber,
        paramKeys: this.getFilteredParamKeys('thc-phr'),
      })
      return res ? (res.data || {}) : {}
    },
    async searchCUnionPatientInfo () {
      // 显示身高，体重等曲线图时有用到 age sex birthday 等属性，需要从该接口中获取
      const res = await request(headUrlMap.headInfo['thc-c-union'], {
        patientId: this.patientId,
        orgId: this.patientInfo.orgId,
      })
      // 根据 birthday 计算月龄
      // 根据 sex 映射为 数字
      // console.log(res.data, 'res.data')
      // console.log(this.$moment().diff(res.data.birthday, 'months'))
      return res ? {
        sex: res.data.sex === '男性' ? 1 : 2,
        sexTxt: res.data.sex,
        birthday: res.data.birthday,
        age: this.$moment().diff(res.data.birthday, 'months'),
      } : {}
    },
    // 获取对应的值，并赋值到 this.stationConfig 上
    async fetchAndSetHeadInfo (sourceTypeCodeList) {
      // const sourceTypeCodeListResult = await request(commonUrl.valueSet.getValueSetItems, { 'setCode': 'THC_SYS_PROJECT' })
      // const sourceTypeCodeList = (sourceTypeCodeListResult ? sourceTypeCodeListResult.data : []).filter(item => item.code !== 'thc-phr').map(item => item.code)
      // todo 这里是循环发送请求，需要改为 promise.all 提升请求速度
      // for (const sourceTypeCode of sourceTypeCodeList) {
      //   // phr 已经查询过了，所以排除掉
      //   if (sourceTypeCode !== 'thc-phr') {
      //     const itemHeadInfo = await this.fetchItemHeadInfo(sourceTypeCode)
      //     this.setConfigValue(sourceTypeCode, itemHeadInfo)
      //   }
      // }
      // 使用promise.all
      try {
        const resList = await Promise.all(this.getItemHeadPromiseList(sourceTypeCodeList))
        const configObj = resList.map(res => res ? res.data : {}).reduce((p, c) => ({ ...p, ...c }), {})
        this.ruleList = []
        for (const k in configObj) {
          const value = configObj[k]
          if (k.includes('RuleEngine')) {
            this.ruleList = this.ruleList.concat(value || [])
          }
          const configItem = this.stationConfig.find(item => item.paramKey === k)
          if (configItem) {
            configItem.value = value
          }
        }
      } catch (e) {
        throw new Error(`发送请求时出现错误`)
      }
    },
    // async fetchItemHeadInfo (sourceTypeCode) {
    //   const paramKeys = this.getFilteredParamKeys(sourceTypeCode)
    //   if (paramKeys.length) {
    //     let res = { data: {} }
    //     try {
    //       res = await request(`${sourceTypeCodeMap[sourceTypeCode] || sourceTypeCode}/extend/patientHeadInfo`, {
    //         visitSerialNumber: this.visitNumber,
    //         paramKeys,
    //         patientId: this.patientId,
    //         visitSerialTypeCode: this.patientInfo.visitSerialTypeCode,
    //         tenantId: this.patientInfo.tenantId,
    //         orgId: this.patientInfo.orgId,
    //       })
    //     } catch (e) {
    //       throw new Error(`发送请求时出现错误，接口：${sourceTypeCodeMap[sourceTypeCode]}/extend/patientHeadInfo`)
    //     }
    //     return res.data
    //   } else {
    //     return {}
    //   }
    // },
    getItemHeadPromiseList (sourceTypeCodeList) {
      // 商保相关比较特殊，需要单独处理
      return sourceTypeCodeList.filter(sourceTypeCode => sourceTypeCode !== 'thc-insurance').map(sourceTypeCode => {
        const paramKeys = this.getFilteredParamKeys(sourceTypeCode)
        if (!paramKeys.length) {
          return false
        }
        return request(`${sourceTypeCodeMap[sourceTypeCode] || sourceTypeCode}/extend/patientHeadInfo`, {
          visitSerialNumber: this.visitNumber,
          paramKeys,
          patientId: this.patientId,
          visitSerialTypeCode: this.patientInfo.visitSerialTypeCode,
          tenantId: this.patientInfo.tenantId,
          orgId: this.patientInfo.orgId,
        })
      }).filter(item => item)
    },
    getFilteredParamKeys (sourceTypeCode) {
      return this.stationConfig.filter(item => item.sourceTypeCode === sourceTypeCode).map(item => item.paramKey)
    },
    // 设置相应的值
    setConfigValue (sourceTypeCode, data) {
      if (data && JSON.stringify(data) !== '{}') {
        const paramKeys = this.getFilteredParamKeys(sourceTypeCode)
        if (paramKeys.length) {
          for (const k of paramKeys) {
            const value = data[k]
            // if (value) {
            const configItem = this.stationConfig.find(item => item.paramKey === k)
            if (configItem) {
              configItem.value = value
            }
            // }
          }
        }
      }
    },
    // 461 的规则引擎
    getRuleEngine (paramKey) {
      const getRule = (ruleItem) => {
        if (ruleItem && ruleItem.ruleResultResDTOList && ruleItem.ruleResultResDTOList.length) {
          const rule = ruleItem.ruleResultResDTOList[0].outPutDesc
          return rule === 'high' ? 1 : (rule === 'low' ? -1 : 0)
        }
        return 0
      }
      // 处理特殊的规则
      if (paramKey === 'bloodPressure') {
        // 收缩压
        const systolicPressureRule = this.ruleList.find(rule => rule.ruleObjectCode === 'bodyCheckSystolicPressure')
        // 舒张压
        const diastolicPressureRule = this.ruleList.find(rule => rule.ruleObjectCode === 'bodyCheckDiastolicPressure')
        return {
          systolicPressure: getRule(systolicPressureRule),
          diastolicPressure: getRule(diastolicPressureRule),
        }
      }
      // 处理一般的规则
      const ruleCode = ruleEngineMap[paramKey]
      const ruleItem = this.ruleList.find(rule => rule.ruleObjectCode === ruleCode)
      return getRule(ruleItem)
    },
    // 451 的规则引擎 在461废弃
    getRule (paramKey) {
      // 映射不规则的命名
      if (paramKey === 'bmi') {
        paramKey = 'BMI'
      } else if (paramKey === 'breath') {
        paramKey = 'breathing'
      }
      const ruleItem = this.ruleList.find(rule => rule.vitalSignName === paramKey)
      if (ruleItem) {
        if (ruleItem[paramKey].includes('高')) {
          return 1
        } else if (ruleItem[paramKey].includes('低')) {
          return -1
        }
      } else {
        // 判断是否是特殊属性
        if (paramKey === 'bloodPressure') {
          // 收缩压
          const systolicPressureRule = this.ruleList.find(rule => rule.vitalSignName === 'systolicPressure')
          // 舒张压
          const diastolicPressureRule = this.ruleList.find(rule => rule.vitalSignName === 'diastolicPressure')
          return {
            systolicPressure: systolicPressureRule ? systolicPressureRule.systolicPressure.includes('高') ? 1 : systolicPressureRule.systolicPressure.includes('低') ? -1 : 0 : 0,
            diastolicPressure: diastolicPressureRule ? diastolicPressureRule.diastolicPressure.includes('高') ? 1 : diastolicPressureRule.diastolicPressure.includes('低') ? -1 : 0 : 0,
          }
        }
      }
      return 0
    },
    isEmptyStation () {
      return this.stationConfig.length === 0
    },
    showMore () {
      // 如果没有配置数据，则不显示更多按钮
      if (this.isEmptyStation()) {
        return false
      }
      // 根据元素的宽度判断是否显示更多按钮
      if (document.querySelector('.common-head-box') && document.querySelectorAll('.common-head-item')) {
        // contentWeight：内容部分的宽度最大
        const contentWeight = document.querySelector('.common-head-box').clientWidth
        const contentItemList = document.querySelectorAll('.common-head-item')
        // 计算所有项的宽度总合
        const contentItemWeight = Array.from(contentItemList).map(item => item.clientWidth).reduce((p, c) => p + c, 0)
        if (contentWeight >= contentItemWeight) {
          return false
        }
      }
      return true
    },
    async wscallback (data) {
      // console.log(data, 'wscallback')
      // 判断是否刷新的条件：患者id（patientId），就诊流水号（visitSerialNumber），就诊类型代码（visitSerialTypeCode）都相同
      if (!data) {
        return
      }
      if (!data.patientId && !data.visitSerialNumber && !data.visitSerialTypeCode) {
        return
      }
      // 若 patientId 为特殊值：__ALL__ 则直接进行刷新
      if (data.patientId !== '__ALL__') {
        if (data.patientId && data.patientId !== this.patientId) {
          return
        }
        if (data.visitSerialNumber && data.visitSerialNumber !== this.visitNumber) {
          return
        }
        if (data.visitSerialTypeCode && data.visitSerialTypeCode !== this.patientInfo.visitSerialTypeCode) {
          return
        }
      }
      const sourceTypeCode = bizCodeMap[data.biz]
      if (sourceTypeCode) {
        // 根据 data.biz 的值判断刷新哪个接口
        await this.fetchAndSetHeadInfo([ sourceTypeCode ])
      } else {
        // 特殊的组件刷新
        if (data.biz === 'c-union_busiInsur') {
          // 刷新商保
          await this.getInsurance()
        }
      }
    },
  },
})

/**
 * iconPosition
 * 1：标签左边 最常用
 * 2：值右边 次常用
 * 3：标签右边 不常用
 * 4：值左边 不常用
 */
// 通用文本数据显示
function getCommonHeadText (h, item) {
  // todo 根据 item 中的属性判断该如何显示该项
  return h('span', {
    class: `common-head-item-container${isBgContainer(item)}`,
    style: getStyle(item).container,
  }, [
    // 展示标签内容
    ...(item.isShowName ? [] : [
      h('span', {
        class: 'common-head-item-label',
        style: getLabelStyle(item),
      }, [...(item.iconPosition === 1 ? getIcon(h, item) : []), item.displayName + '：', ...(item.iconPosition === 3 ? getIcon(h, item) : [])]),
    ]), h('span', {
      class: `common-head-item-value`,
      style: getValueStyle(item),
    }, [...(item.iconPosition === 4 ? getIcon(h, item) : []), item.value !== null && item.value !== undefined && item.value !== '' ? item.value : '--', ...(item.iconPosition === 2 ? getIcon(h, item) : [])]),
  ])
}

function getStyle (item) {
  let styleObj = {}
  try {
    styleObj = JSON.parse(item.style)
  } catch (e) {
    styleObj = {}
  }
  const container = styleObj.container
  const label = styleObj.label
  const value = styleObj.value
  delete styleObj.container
  delete styleObj.label
  delete styleObj.value
  return {
    label: {
      ...styleObj,
      fontWeight: styleObj.fontWeight ? 'bold' : 'normal',
      fontFamily: '', // todo 由于设计稿中的字体 调整字体大小时无反应
      ...label,
    },
    value: {
      ...styleObj,
      fontWeight: styleObj.fontWeight ? 'bold' : 'normal',
      fontFamily: '',
      ...value,
    },
    container,
  }
}

function getLabelStyle (item) {
  return getStyle(item).label
}

function getValueStyle (item) {
  return getStyle(item).value
}

function isBgContainer (item) {
  const container = getStyle(item).container
  return container.backgroundColor ? ' is-bg-container' : ''
}

function getIcon (h, item) {
  return item.icon ? [h('span', {
    // 字体图标的颜色问题需要再次优化 2020-05-06
    class: `common-head-icon icon iconfont ${item.icon} common-head-icon-${item.paramKey}`,
  })] : []
}

function getCommonHeadCustom (h, item) {
  return (item.componentName ? h(item.componentName, {
    props: {
      // 该配置项的在页面中可以配置的属性，其中value属性表示后端返回的值
      itemConfig: item,
      // 该配置项的其他属性
      itemData: {
        // 患者id
        patientId: this.patientId,
        // 从 c-union 的接口中获取的患者的信息
        ...this.cUnionPatientInfo,
        // 用于判断该值显示规则的属性，例如血氧高于正常值该如何显示
        rule: this.getRuleEngine(item.paramKey),
        // 调用老的自定义组件时需要传入此属性，建议新的组件不要使用该属性，统一用 visitNumber 就诊流水号
        hospitalizedNumber: this.visitNumber,
        // 用于保险组件的数据 【仅用于该组件】
        insuranceData: this.insuranceData,
        // todo 此处可以按需添加新的属性以满足自定义组件的需求
        stationConfig: this.stationConfig
      },
    },
    class: `common-head-custom ${item.componentName}`,
  }, []) : '')
}

function isEmptyValue (item) {
  // 该值为true，表示
  // 组件的返回值为json，但是其真实值为空
  if (item.componentName === 'common-head-non-drug-allergy' || item.componentName === 'common-head-drug-allergy') {
    if (item.value) {
      const parseValue = JSON.parse(item.value)
      if (!(parseValue.guomin && parseValue.guomin.length && parseValue.guomin[0] && parseValue.guomin[0].allergen && parseValue.guomin[0].allergen.length && parseValue.guomin[0].allergen[0] && parseValue.guomin[0].allergen[0].name)) {
        return true
      }
    }
  }
  // if (item.componentName === 'common-head-drug-allergy') {
  //   if (item.value) {
  //     const parseValue = JSON.parse(item.value)
  //     if (!(parseValue.guomin && parseValue.guomin.length && parseValue.guomin[0] && parseValue.guomin[0].allergen && parseValue.guomin[0].allergen.length && parseValue.guomin[0].allergen[0] && parseValue.guomin[0].allergen[0].name)) {
  //       return true
  //     }
  //   }
  // }
  if (item.componentName === 'common-head-infectious-diseases') {
    if (item.value) {
      const parseValue = JSON.parse(item.value)
      if (!(parseValue[0] && parseValue[0].diseaseName)) {
        return true
      }
    }
  }
  // 特殊组件 在组件内部判断
  if (item.componentName === 'common-head-settlement-button' ||
    // item.componentName === 'common-head-doctor-advice-sharing' || // 隐藏医嘱共享信息 2020-04-30
    item.componentName === 'common-head-biz-insurance'
  ) {
    return false
  }
  if (item.paramKey === '-1') {
    return false
  }
  return item.value === null || item.value === undefined || item.value === ''
}

function isExcept (item) {
  // JSPT-297
  if (this.patientInfo.visitSerialTypeCode === '3') { // 若患者就诊类型为住院，则隐藏门诊病案号
    if (item.paramKey === 'outpatientNumberOrg' || item.paramKey === 'outpatientNumber') {
      return true
    }
  } else if (this.patientInfo.visitSerialTypeCode === '1') { // 若患者就诊类型为门诊，则隐藏住院病案号
    if (item.paramKey === 'inpatientNumberOrg' || item.paramKey === 'inpatientNumber') {
      return true
    }
  }
  // 判断在空值时，是否显示 "名称：--"
  if (!item.showNameIfDataEmpty) {
    // 判断当前值是否为空，若为空，则将其排除
    if (isEmptyValue(item)) {
      return true
    }
  }
  // 排除与性别相关的
  if (this.cUnionPatientInfo.sex === 1) {
    const list = [
      'gestational', // 孕周
      'lastMenstrualPeriod', // 末次月经
      'expectedDateOfChildbirth', // 预产期
    ]
    if (list.some(l => l === item.paramKey)) {
      return true
    }
  } else {
    const list = []
    if (list.some(l => l === item.paramKey)) {
      return true
    }
  }
  // 排除与年龄相关的
  if (this.cUnionPatientInfo.age >= 60) {
    const list = [
      'headCircumference', // 头围
    ]
    if (list.some(l => l === item.paramKey)) {
      return true
    }
  } else {
    const list = []
    if (list.some(l => l === item.paramKey)) {
      return true
    }
  }
  return false
}
