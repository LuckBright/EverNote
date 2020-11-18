// 吉林省长春市
export const jlccybCode = '46608aa3ef1d438da3806167a5a0761c'
// 吉林省保
export const jlssbCode = 'a77b1eb78eee447ebbe429bc5b1bb6b2'
// 黑龙江
export const hljybCode = '873a1a554e2c4746afedb75842fd9aaa'
// 吉林蛟河
export const jljhCode = '307cb17330944ff5ba1969453eb92f82'
// 三亚世侨
export const sysqzyyCode = '87b42a90-b453-11ea-ae1e-0242ac110010'
// 广州
export const gdcfybCode = 'c5562a82-f1b2-11ea-bd8d-0242ac110002'
// // 长春市保住院医保管理
// import hospitalMedicalManage from '@/rcm/otmdiscomponent/jlcc-medical-manage/jlcc-hospital-medical-manage.vue'
// // 吉林省保住院医保管理
// import jlsbHosMedicalManage from '@/rcm/otmdiscomponent/jlsb-medical-manage/jlsb-hospital-medical-manage.vue'
// // 黑龙江
// import jljhHosMedicalManage from '@/rcm/otmdiscomponent/jljhmedical/jljh-medical-manage/jljh-hospital-medical-manage.vue'
// // 三亚
// import sysqzyyHosMedicalManage from '@/rcm/otmdiscomponent/sysqzyy-medical/hospital-manage/sysq-hospital-medical-manage.vue'
// 山东乐陵
export const sdllCode = '21946387-c6ce-4e56-8015-4c1ede583dc8'

export var orgList = {}
// 吉林长春
orgList[jlccybCode] = {
  code: 'jlccyb',
  passwordValid: false,
  componentName: 'jlccHospitalMedicalManage'
}
// 吉林省保
orgList[jlssbCode] = {
  code: 'jlssb',
  passwordValid: false,
  componentName: 'jlsbHospitalMedicalManage'
}
orgList[hljybCode] = {
  code: 'hljyb',
  passwordValid: true
}
orgList[jljhCode] = {
  code: 'jljhyb',
  passwordValid: false,
  HosCode: 'H1739',
  componentName: 'jljhHospitalMedicalManage'
}
orgList[sysqzyyCode] = {
  code: 'sysqzyy',
  passwordValid: false,
  componentName: 'sysqHospitalMedicalManage'
}
orgList[gdcfybCode] = {
  code: 'gzyb',
  passwordValid: false,
  componentName: 'gdgzHospitalMedicalManage'
}
orgList[sdllCode] = {
  code: 'sdllyb',
  passwordValid: false,
  componentName: 'sdllHospitalMedicalManage'
}

// 入院登记后的跳转地址
export var routerMap = {}
routerMap[jlccybCode] = '/hi/control/controlhospitalization'
routerMap[jlssbCode] = '/hi/control/controlhospitalization'
routerMap[jljhCode] = '/hi/control/controlhospitalization'
routerMap[sysqzyyCode] = '/hi/control/controlhospitalization'
routerMap[gdcfybCode] = '/hi/control/controlhospitalization'

// 入院登记后的跳转地址
export const adtJumpUrl = '/hi/control/controlhospitalization'
