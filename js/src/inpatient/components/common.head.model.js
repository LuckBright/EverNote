// 根据 值集中的 sourceTypeCode 对应上 接口中的项目名，若二者一样，则不要写在此处
// todo 当各个业务对应的接口都写完后在此补充完整
export const sourceTypeCodeMap = {
  'thc-c-union': 'c-union',
  'thc-adt': 'adt',
  'thc-workbench': 'workbench',
  'thc-arrange': 'arrange',
  'thc-medical-record': 'medical-record',
  'thc-rcm': 'rcm',
  'thc-insurance': 'insurance',
}
export const bizCodeMap = {
  'c-union': 'thc-c-union',
  'adt': 'thc-adt',
  'workbench': 'thc-workbench',
  'arrange': 'thc-arrange',
  'medical_record': 'thc-medical-record',
  'rcm': 'thc-rcm',
}
export const commonHeadEvent = {
  refresh: 'refresh',
}
export const ruleEngineMap = {
  temperature: 'patientBodyTemperatureCheckTable',
  bmi: 'bodyCheckBmi',
  breath: 'bodyCheckBreathing',
  pulse: 'bodyCheckPulse',
  heartRate: 'heartRate',
  bloodOxygen: 'bloodOxygen',
}
