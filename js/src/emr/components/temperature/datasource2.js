import bloodData from './data/blood_pressure.json'
import date from './data/date.json'
import breathData from './data/breath.json'
import data from './data/normal.json'
import painData from './data/pain.json'
import temperatureData from './data/temperature.json'
export let dataSource = {
  'charType': '2',
  'chartData': temperatureData,
  painData,
  'statusUp': [{
    'datetime': '2020-04-20 05:01:00',
    'value': '手术'
  }, {
    'datetime': '2020-04-24 02:01:00',
    'value': '分娩'
  }],
  'statusDown': [{
    'datetime': '2020-04-20 02:01:00',
    'value': '外出'
  }, {
    'datetime': '2020-04-24 02:01:00',
    'value': '拒测'
  }],
  'patientInfo': {
    'header': [{
      'nameCn': '姓名',
      'nameEn': 'name'
    }, {
      'nameCn': '性别',
      'nameEn': 'sex'
    }, {
      'nameCn': '年龄',
      'nameEn': 'age'
    }, {
      'nameCn': '出生日期',
      'nameEn': 'birthday'
    }, {
      'nameCn': '科别',
      'nameEn': 'dptName'
    }, {
      'nameCn': '床号',
      'nameEn': 'bed'
    }, {
      'nameCn': '病案号',
      'nameEn': 'hospitalNum'
    }, {
      'nameCn': '入院日期',
      'nameEn': 'enterDate'
    }],
    'data': {
      'birthday': '2020-02-02',
      'bed': '1002',
      'enterDate': '2020-03-18 16:43:19',
      'dptName': '普外科',
      'sex': '男性',
      'hospitalNum': 'HZ00079939JG',
      'name': '体温单测试患者',
      'age': '1月16天'
    }
  },
  'dynamicTable': {
    'header': [{
      'nameCn': '日期',
      'nameEn': 'date'
    }, {
      'nameCn': '住院天数',
      'nameEn': 'zhuYuanTianshu'
    }, {
      'nameCn': '术后日数',
      'nameEn': 'shouShu'
    }, {
      'nameCn': '呼吸(次/min) ',
      'nameEn': 'hx'
    }, {
      'nameCn': '血压(mmHg)',
      'nameEn': 'xueYa'
    }, {
      'nameCn': '体重(kg)',
      'nameEn': 'TZ_TI_ZHONG'
    }, {
      'nameCn': '身高(cm)',
      'nameEn': 'TZ_SHEN_GAO'
    }, {
      'nameCn': '液体入量(ml)',
      'nameEn': 'YE_TI_RU_LIANG_ml'
    }, {
      'nameCn': '尿量(ml)',
      'nameEn': 'NIAO_LIANG_ml'
    }, {
      'nameCn': '大便次数',
      'nameEn': 'DA_BIAN_CI_SHU'
    }, {
      'nameCn': '皮试结果',
      'nameEn': 'PI_SHI_JIE_GUO'
    }, {
      'nameCn': '血糖(mmol/L)',
      'nameEn': 'TZ_XUE_TANG'
    }, {
      'nameCn': '特殊治疗',
      'nameEn': 'TE_SHU_ZHI_LIAO'
    }],
    'data': {
      'date': date,
      'xueYa': bloodData,
      'DA_BIAN_CI_SHU': data,
      'PI_SHI_JIE_GUO': data,
      'zhuYuanTianshu': data,
      'TZ_XUE_TANG': data,
      'TE_SHU_ZHI_LIAO': data,
      'hx': breathData,
      'shouShu': data,
      'NIAO_LIANG_ml': data,
      'TZ_TI_ZHONG': data,
      'TZ_SHEN_GAO': data,
      'YE_TI_RU_LIANG_ml': data
    }
  }
}

