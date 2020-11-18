/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-03-07 15:27:45
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-03-07 15:28:06
 */
// 所有库房流程 路由路径映射
// 多库房统一发药路由
const routeMap = {
  audit: 'prescriptionaudit',
  receive: 'prescriptionreceive',
  task: 'prescriptiontask',
  lack: 'prescriptionlack',
  back: 'prescriptionback',
  record: 'prescriptionrecord',
  settings: 'settings',
}
const focusRouteMap = {
  focustask: 'focustask',
  focussend: 'focussend',
  focuslack: 'focuslack',
  focusback: 'focusback',
  focusrecord: 'focusrecord',
  setrule: 'focustask/setrule',
  recorddetail: 'focusrecord/detail',
  focussettings: 'focussettings',
}
// 超市收银
const cashierRouteMap = {
  cashierrecord: 'record',
  cashierback: 'back',
}
// 互联网商城
const internetRouteMap = {
  internetrecord: 'record',
  internettask: 'task',
  internetlack: 'lack',
}
// 路由名称定义
export const routeName = {
  ...focusRouteMap,
  ...routeMap,
  ...cashierRouteMap,
  ...internetRouteMap,
  uddprint: 'uddprint',
  uddtask: 'uddtask',
  uddlack: 'uddlack',
  uddrecord: 'uddrecord',
  uddback: 'uddback',
}
