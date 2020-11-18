import Vue from 'vue'
import { tableColWidth } from '@/util/table-config'
import { dirTypes } from '../../enum'
const filters = Vue.options.filters
export const commonColumns = [{
  prop: 'dirType',
  label: '目录类别',
  width: tableColWidth.name4W80,
  formatter ({ value }) {
    return filters.formateValueToFnt(value, { list: dirTypes })
  },
},
{
  prop: 'dirCode',
  label: '项目编码',
  width: tableColWidth.name4W80
}]

export const drugColumns = [

  {
    prop: 'centralMedicinalCode',
    label: '中心端药品编码',
    width: tableColWidth.name4W80
  },
  {
    prop: 'cnName',
    label: '药品通用中文名称',
    width: tableColWidth.w200
  },
  {
    prop: 'enName',
    label: '药品英文名称',
    width: tableColWidth.w200
  },
  {
    prop: 'medicinalChargeTypeCode',
    label: '药品收费类别编码',
    width: tableColWidth.name4W80
  },
  {
    prop: 'rxFlag',
    label: '处方药标志',
    width: tableColWidth.name4W80
  },
  {
    prop: 'medicinalChargeLevel',
    label: '药品收费项目等级',
    width: tableColWidth.name4W80
  },
  {
    prop: 'medicinalMnemonicCode',
    label: '药品助记码',
    width: tableColWidth.name6W105
  },
  {
    prop: 'dosageUnit',
    label: '药品剂量单位',
    width: tableColWidth.name4W80
  },
  {
    prop: 'medicinalStandardPrice',
    label: '药品标准价格',
    width: tableColWidth.name4W80
  },
  {
    prop: 'medicinalPersonalPayRate',
    label: '药品自付比例',
    width: tableColWidth.name6W105
  },
  {
    prop: 'personalPaymentMode',
    label: '自付方式/使用范围',
    width: tableColWidth.name6W105
  },
  {
    prop: 'medicinalDoseCode',
    label: '药品剂型编码',
    width: tableColWidth.name4W80
  },
  {
    prop: 'medicinalPaymentLimit',
    label: '药品支付限额',
    width: tableColWidth.name4W80
  },
  {
    prop: 'alias',
    label: '药品别名',
    width: tableColWidth.name4W80
  },
  {
    prop: 'applicableDisease',
    label: '适用症',
    width: tableColWidth.name4W80
  },
  {
    prop: 'medicinalType',
    label: '药品类别',
    width: tableColWidth.name4W80
  },
  {
    prop: 'markupType',
    label: '加价类别',
    width: tableColWidth.name4W80
  },
  {
    prop: 'computerCodeProperties',
    label: '计算机编码属性',
    width: tableColWidth.name4W80
  },
  {
    prop: 'genericNameCode',
    label: '通用名编码',
    width: tableColWidth.name4W80
  },
  {
    prop: 'catalogueMedicinalType',
    label: '目录中药品分类',
    width: tableColWidth.name4W80
  },
  {
    prop: 'manufacturerDeclaredDosage',
    label: '厂家申报剂型',
    width: tableColWidth.name4W80
  },
  {
    prop: 'manufacturer',
    label: '生产企业',
    width: tableColWidth.name4W80
  },
  {
    prop: 'singleEffectiveIngredientMeasurementUnit',
    label: '单方有效成分计量单位',
    width: tableColWidth.name6W105
  },
  {
    prop: 'costPerformanceSort',
    label: '性价比排序',
    width: tableColWidth.name4W80
  },
  {
    prop: 'halfMonthRegularDosage',
    label: '半个月常规用量',
    width: tableColWidth.name4W80
  },
  {
    prop: 'halfMonthMaxDosage',
    label: '半个月最大用量',
    width: tableColWidth.name4W80
  },
  {
    prop: 'manufacturerDeclaredSpec',
    label: '厂家申报规格',
    width: tableColWidth.name4W80
  },
  {
    prop: 'medicinalAliasMnemonicCode',
    label: '药品别名助记码',
    width: tableColWidth.name4W80
  },
  {
    prop: 'catalogueCNName',
    label: '目录中中文名称',
    width: tableColWidth.name4W80
  },
  {
    prop: 'NDRCCeilingPrice',
    label: '发改委最高限价',
    width: tableColWidth.name4W80
  },
  {
    prop: 'NDRCCeilingPriceFileNo',
    label: '发改委最高限价文号',
    width: tableColWidth.name6W105
  },
  {
    prop: 'hospitalMaxRetailPrice',
    label: '医院最高零售价',
    width: tableColWidth.name4W80
  },
  {
    prop: 'activeIngredientsNumber',
    label: '有效成分数量',
    width: tableColWidth.name4W80
  },
  {
    prop: 'halfMonthMinDosage',
    label: '半个月最小用量',
    width: tableColWidth.name4W80
  },
  {
    prop: 'socialInsuranceMedicinalCode',
    label: '社保药品代码',
    width: tableColWidth.name4W80
  },
]

export const treatmentColumns = [
  {
    prop: 'treatmentItemCode',
    label: '诊疗项目编码',
    width: tableColWidth.name4W80
  },
  {
    prop: 'treatmentItemName',
    label: '诊疗项目名称',
    width: tableColWidth.w200
  },
  {
    prop: 'treatmentItemChargeTypeCode',
    label: '诊疗项目收费类别编码',
    width: tableColWidth.name6W105
  },
  {
    prop: 'treatmentItemChargeLevel',
    label: '诊疗项目收费项目等级',
    width: tableColWidth.name6W105
  },
  {
    prop: 'treatmentItemMnemonicCode',
    label: '诊疗项目助记码',
    width: tableColWidth.name4W80
  },
  {
    prop: 'treatmentItemStandardPrice',
    label: '诊疗项目标准价格',
    width: tableColWidth.name4W80
  },
  {
    prop: 'treatmentItemPersonalPayRate',
    label: '诊疗项目自付比例',
    width: tableColWidth.name4W80
  },
  {
    prop: 'treatmentItemPersonalPayMode',
    label: '诊疗项目自付方式',
    width: tableColWidth.name4W80
  },
  {
    prop: 'treatmentItemChargeType',
    label: '诊疗项目收费项目种类',
    width: tableColWidth.name6W105
  },
  {
    prop: 'treatmentItemPaymentLimit',
    label: '诊疗项目支付限额',
    width: tableColWidth.name4W80
  },
  {
    prop: 'treatmentItemChargeUnit',
    label: '诊疗项目计价单位',
    width: tableColWidth.name4W80
  },
  {
    prop: 'treatmentItemConnotation',
    label: '诊疗项目项目内涵',
    width: tableColWidth.name4W80
  },
  {
    prop: 'treatmentItemConnotationExceptContent',
    label: '诊疗项目项目内涵除外内容',
    width: tableColWidth.name6W105
  },
  {
    prop: 'treatmentItemDescribe',
    label: '诊疗项目描述',
    width: tableColWidth.name4W80
  },
  {
    prop: 'treatmentItemLimitPriceType',
    label: '诊疗项目限价类别',
    width: tableColWidth.name4W80
  },
  {
    prop: 'adjustScale',
    label: '诊疗项目调整比例',
    width: tableColWidth.name4W80
  },
  {
    prop: 'adjustPrice',
    label: '诊疗项目调整金额',
    width: tableColWidth.name4W80
  },
  {
    prop: 'material',
    label: '诊疗项目材料分类',
    width: tableColWidth.name4W80
  },
  {
    prop: 'manufacturer',
    label: '诊疗项目生产企业',
    width: tableColWidth.name4W80
  },
]

export const serviceColumns = [
  {
    prop: 'serviceFacilitiesCode',
    label: '服务设施编码',
    width: tableColWidth.name7W120
  },
  {
    prop: 'serviceFacilitiesName',
    label: '服务设施名称',
    width: tableColWidth.w200
  },
  {
    prop: 'serviceFacilitiesChargeTypeCode',
    label: '服务设施收费类别编码',
    width: tableColWidth.name7W120
  },
  {
    prop: 'serviceFacilitiesMnemonicCode',
    label: '服务设施助记码',
    width: tableColWidth.name7W120
  },
  {
    prop: 'medicinalStandardPrice',
    label: '标准价格',
    width: tableColWidth.name7W120
  },
  {
    prop: 'serviceFacilitiesBedLevel',
    label: '服务设施病床等级',
    width: tableColWidth.name7W120
  },
  {
    prop: 'serviceFacilitiesBasicPayStandard',
    label: '服务设施基础支付标准',
    width: tableColWidth.name7W120
  },
  {
    prop: 'serviceFacilitiesPersonalPayRate',
    label: '服务设施自付比例',
    width: tableColWidth.name4W80
  },
  {
    prop: 'serviceFacilitiesPersonalPayMode',
    label: '服务设施自付方式',
    width: tableColWidth.name4W80
  },
  {
    prop: 'chargeUnit',
    label: '服务设施计价单位',
    width: tableColWidth.name4W80
  },
  {
    prop: 'serviceFacilitiesConnotation',
    label: '服务设施项目内涵',
    width: tableColWidth.name7W120
  },
  {
    prop: 'serviceFacilitiesConnotationExceptContent',
    label: '服务设施内涵除外内容',
    width: tableColWidth.name7W120
  },
  {
    prop: 'serviceFacilitiesDescribe',
    label: '服务设施描述',
  },
  {
    prop: 'serviceFacilitiesLimitPriceType',
    label: '服务设施限价类别',
    width: tableColWidth.name4W80
  },
]
