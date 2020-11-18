
let rowHeight = 20
const configData = [{
  'nameCn': '日期',
  'nameEn': 'date',
  'top': 0,
  'width': 570 / 7,
  'height': rowHeight,
  'stepX': 24,
  'defaultName': '日期'
}, {
  'nameCn': '住院天数',
  'nameEn': 'zhuYuanTianshu',
  'top': rowHeight,
  'width': 570 / 7,
  'height': rowHeight,
  'stepX': 24,
  'data': null,
  'defaultName': '住院天数'
}, {
  'nameCn': '术后日数',
  'nameEn': 'shouShu',
  'top': rowHeight,
  'height': rowHeight,
  'stepX': 24,
  'defaultName': '术后日数'
}, {
  'nameCn': '时间轴',
  'nameEn': 'time',
  'top': rowHeight,
  'height': rowHeight,
  'stepX': 4,
  'timeBarType': 'start2of24'
},
{
  'nameCn': '体温脉搏',
  'nameEn': 'temperatureAndPulse',
  'top': rowHeight,
  'stepX': 4,
  // 'pulseRange': {'pulseMin': 12, 'pulseMax': 180},
  // 'temperatureRange': {'temperatureMin': 33.6, 'temperatureMax': 42},
  // "data":temperatureData,
  // 'statusUp': [{
  //   'datetime': '2020-04-20 05:01:00',
  //   'value': '手术'
  // }, {
  //   'datetime': '2020-04-24 02:01:00',
  //   'value': '分娩'
  // }],
  // 'statusDown': [{
  //   'datetime': '2020-04-20 02:01:00',
  //   'value': '外出'
  // }, {
  //   'datetime': '2020-04-24 02:01:00',
  //   'value': '拒测'
  // }]
},
{
  'nameCn': '疼痛等级',
  'nameEn': 'pain',
  'stepX': 4,
  // "data":painData,
  'show': true,
  'defaultName': '疼痛等级'
},
{
  'nameCn': '呼吸(次/min) ',
  'nameEn': 'hx',
  'height': rowHeight * 2,
  'stepX': 4,
  'defaultName': '呼吸(次/min)'
  // "data":breathData
}
// {
//   'nameCn': '血压(mmHg)',
//   'nameEn': 'xueYa',
//   'top': rowHeight * 2,
//   'height': rowHeight,
//   'stepX': 12,
//   'defaultName': '血压(mmHg)'
//   // "data":bloodData
// },
// {
//   'nameCn': '体重(kg)',
//   'nameEn': 'TZ_TI_ZHONG',
//   'top': rowHeight,
//   'height': rowHeight,
//   'stepX': 24,
//   'defaultName': '体重(kg)'
// }, {
//   'nameCn': '身高(cm)',
//   'nameEn': 'TZ_SHEN_GAO',
//   'top': rowHeight,
//   'height': rowHeight,
//   'stepX': 24,
//   'defaultName': '身高(cm)'
// }, {
//   'nameCn': '液体入量(ml)',
//   'nameEn': 'YE_TI_RU_LIANG_ml',
//   'top': rowHeight,
//   'height': rowHeight,
//   'stepX': 24,
//   'defaultName': '液体入量(ml)'
// }, {
//   'nameCn': '尿量(ml)',
//   'nameEn': 'NIAO_LIANG_ml',
//   'top': rowHeight,
//   'height': rowHeight,
//   'stepX': 24,
//   'defaultName': '尿量(ml)'
// }, {
//   'nameCn': '大便次数',
//   'nameEn': 'DA_BIAN_CI_SHU',
//   'top': rowHeight,
//   'height': rowHeight,
//   'stepX': 24,
//   'defaultName': '大便次数'
// }, {
//   'nameCn': '皮试结果',
//   'nameEn': 'PI_SHI_JIE_GUO',
//   'top': rowHeight,
//   'height': rowHeight,
//   'stepX': 24,
//   'defaultName': '皮试结果'
// }, {
//   'nameCn': '血糖(mmol/L)',
//   'nameEn': 'TZ_XUE_TANG',
//   'top': rowHeight,
//   'height': rowHeight,
//   'stepX': 24,
//   'defaultName': '血糖(mmol/L)'
// }, {
//   'nameCn': '特殊治疗',
//   'nameEn': 'TE_SHU_ZHI_LIAO',
//   'top': rowHeight,
//   'height': rowHeight,
//   'stepX': 24,
//   'defaultName': '特殊治疗'
// }
]

configData.forEach((item) => {
    // item.data=item.data||data
  item.width = 570 / 7
})
const defaultItemConfig = {
  'nameCn': '',
  'nameEn': '',
  'top': rowHeight,
  'width': 570 / 7,
  'height': rowHeight,
  'stepX': 24,
  'defaultName': '',
  'show': true
}
const components = [
  'render_time_bar',
  'render_cooling',
  'render_temperature',
  'render_pulse',
  'render_heart',
  'render_event',
  'render_axis_y_pulse',
  'render_axis_y_temperature',
  'axis',
  'render_zt',
  'render_axis_y_pain',
  'render_pain',
  'render_breath',
  'render_blood_pressure',
  'render_axis', // getData
  'render_axis_x', // getData
  'layout', // getData
  'render_normal7'
]
export {configData, defaultItemConfig, components}
