// 广东广州本地程序接口地址
import fetch from './insurance.api'
let host = 'http://127.0.0.1:9099'
try {
  host = JSON.parse(localStorage.getItem('CLINICCONFIG'))['insurance_localhost'] || 'http://127.0.0.1:9099'
} catch (err) {
  console.log(err)
}

// 医保住院登记 - 查询
export const insuranceQuery = (data) => {
  return fetch({
    url: `${host}/insurance-local/zydj/query`,
    method: 'post',
    data: data
  })
}

// 医保住院登记 - 查询回调
export const insuranceQueryCall = (data) => {
  return fetch({
    url: `${host}/insurance-local/zydj/query/callback`,
    method: 'post',
    data: data
  })
}

// 预结算上传费用
export const costUpload = (data) => {
  return fetch({
    url: `${host}/insurance-local/his-cfxm/and/action`,
    method: 'post',
    data: data
  })
}

// 费用结算
export const costSettlement = (data) => {
  return fetch({
    url: `${host}/insurance-local/his-fyjs/action`,
    method: 'post',
    data: data
  })
}

// 删除结算
export const costDelete = (data) => {
  return fetch({
    url: `${host}/insurance-local/his-fyjs/delete/action`,
    method: 'post',
    data: data
  })
}

// 医保住院登记 - 登记（状态补偿）
export const register = (data) => {
  return fetch({
    url: `${host}/insurance-local/zydj/query/callback/bc`,
    method: 'post',
    data: data
  })
}

// 上传病案
export const uploadMedical = (data) => {
  return fetch({
    url: `${host}/insurance-local/his-snyd/action`,
    method: 'post',
    data: data
  })
}

// 撤销病案
export const cancelMedical = (data) => {
  return fetch({
    url: `${host}/insurance-local/his-snyd/cancel/action`,
    method: 'post',
    data: data
  })
}

// 上传费用 - 撤销
export const revocation = (data) => {
  return fetch({
    url: `${host}/insurance-local/his-cfxm/revocation/action`,
    method: 'post',
    data: data
  })
}

// 下载医保目录
export const downloadMedicare = () => {
  return fetch({
    url: `${host}/insurance-local/downloadMedicare`,
    method: 'post'
  })
}

// 下载对照关系
export const downloadMatch = () => {
  return fetch({
    url: `${host}/insurance-local/downloadMatch`,
    method: 'post'
  })
}
