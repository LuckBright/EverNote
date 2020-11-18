import axios from '@/util/http'
import { diction } from '@/store/common'
const CancelToken = axios.CancelToken
let source = ''
const residentUrl = diction.api
let resident = axios.create({
  baseURL: residentUrl,
  withCredentials: true
})
resident.interceptors.request.use(function (config) {
  if (!config.data) {
    config.data = {}
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

resident.interceptors.response.use(function (response) {
  if (!response) {
    return Promise.reject()
  }
  if (response.data.head && response.data.head.errCode !== 0) {
    return Promise.reject(response.data.head.errCode)
  }
  return response.data
})

// 入科
function hospitalizedEntranceMsgCreate (data) {
  return resident({
    url: '/workbench/hospitalizedEntranceMsg/createEntrance',
    method: 'post',
    data: data
  })
}

// 总床和空床
function getBedCountByAreaId (data) {
  return resident({
    url: '/workbench/hospitalizedApplianceRecord/getBedCountByAreaId',
    method: 'post',
    data: data
  })
}
// 出科信息回显
function getPatientMsgByHospitalizedNumber (data) {
  return resident({
    url: '/workbench/ipPatient/getInpatientbyHosNumber',
    method: 'post',
    data: data
  })
}
// 包床
function createOccupyBeds (data) {
  return resident({
    url: '/workbench/hospitalizedEntranceMsg/createOccupyBeds',
    method: 'post',
    data: data
  })
}

// 获取当前医生排过班的科室
function getArrangeDepts (data) {
  return resident({
    url: '/arrange/resourceArrange/getArrangeDepts',
    method: 'post',
    data: data
  })
}

// 根据上面接口查询到的科室查服务
function getArrangeServiceList (data) {
  return resident({
    url: '/arrange/resourceArrange/getArrangeServiceList',
    method: 'post',
    data: data
  })
}
// 针尖加号确认/arrange/appointment/create
function appointmentCreate (data) {
  return resident({
    url: '/arrange/appointment/create',
    method: 'post',
    data: data
  })
}
// 查询待入科患者
function getPendingSectionPatient (data) {
  return resident.post('/workbench/hospitalizedEntranceMsg/getPendingSectionPatient', data)
}

// 患者管理-医生&护士查询患者列表
function getHosPatientListByCondition (data) {
  if (source) source.cancel('多次重复请求取消')
  source = CancelToken.source()
  return resident.post('/workbench/hospitalizedApplianceRecord/getHosPatientListByCondition', data, {
    cancelToken: source.token
  }).catch(e => { })
}
// 病区管理 查询床位对应的人
function getBedListByCondition (data) {
  if (source) source.cancel('多次重复请求取消')
  source = CancelToken.source()
  return resident.post('/workbench/hospitalizedApplianceRecord/getBedListByCondition', data, {
    cancelToken: source.token
  }).catch(e => { })
}

// 获取登录医生或者护士id
function getCurrentUser (data) {
  return resident.post('/thc-platform-core/unify/getCurrentUser', data)
}

// 根据患者手机号，姓名啦啥的查询信息
function getAll (data) {
  return resident.post('/c-union/doctor/patient/getAll', data)
}

function searchFuzzy (data) {
  return resident.get(`/c-union/doctor/patient/searchFuzzy?keyword=${data.keyword}`)
}

// 获取病区列表
function getSpaceRecordVoListForService (data) {
  return resident.post('/warehouse/spaceRecord/getSpaceRecordVoListForService/', data)
}

// 查询未执行医嘱
function findByExectueMessage (data) {
  return resident.post('/workbench/hospitalizedDoctorAdvice/findByExectueMessage', data)
}

// 更新床位状态
function updateHospitalBedRelationData (data) {
  return resident.post('/warehouse/hospitalBedRelation/updateHospitalBedRelationData/', data)
}

// 更新床位状态
function wristbandManage (data) {
  return resident.post('/c-union/doctor/wristbandManage/create', data)
}

// 入科信息回显
function getAppliance2Entrance (data) {
  return resident.post('/workbench/hospitalizedApplianceRecord/getAppliance2Entrance', data)
}

// 待审核医嘱数量
function queryHospitalAdvice (data) {
  return resident.post('/workbench/hospitalizedDoctorAdvice/queryHospitalAdvice', data)
}

// 医嘱执行
function executeAdvice (data) {
  return resident.post('/sob/medicalOrder/executeAdvice', data)
}

// 医嘱待停止医嘱
function queryHospitalAdviceByHospitalNumber (data) {
  return resident.post('/sob/medicalOrder/queryHospitalAdviceByHospitalNumber', data)
}

// 左侧列表停止医嘱
function stopInpatientAdviceByHospitalizedNumber (data) {
  return resident.post('/sob/inpatientController/stopInpatientAdviceByHospitalizedNumber', data)
}

// 根据阶段实例id获取治疗工作实例列表信息
function listByStageInstanceId (data) {
  return resident.post('/clinical-pathway/treatmentInstance/listByStageInstanceId', data)
}

// 根据阶段实例id获取护理工作实例列表信息
function listByStageInstanceIdHl (data) {
  return resident.post('/clinical-pathway/nursingInstance/listByStageInstanceId', data)
}

// 变异查询
function getAbnormalRecords (data) {
  return resident.post('/clinical-pathway/abnormalRecord/getAbnormalRecords', data)
}

// 自动入经弹出框提示
function mappingPathway (data) {
  return resident.post('/clinical-pathway/pathwayLog/mappingPathway', data)
}

// 拒绝入经
function refuseEnterPathway (data) {
  return resident.post('/clinical-pathway/pathwayInstance/refuseEnterPathway', data)
}
// 完成路径
function finishPathway (data) {
  return resident.post('/clinical-pathway/pathwayInstance/finishPathway', data)
}
// 拒绝入经原因
function getConstantsByKey (data) {
  return resident.post('/clinical-pathway/clinicalPathway/getConstantsByKey', data)
}

// 变异类型下拉框列表接口
function getPathwayAbnormalCollections (data) {
  return resident.post('/clinical-pathway/pathwayAbnormalCollection/getPathwayAbnormalCollections', data)
}

// 变异原因,明细下拉框列表接口
function getPathwayAbnormalDictionarys (data) {
  return resident.post('/clinical-pathway/pathwayAbnormalDictionary/getPathwayAbnormalDictionaryReasons', data)
}

// 保存变异信息
function createAbnormalRecord (data) {
  return resident.post('/clinical-pathway/abnormalRecord/createAbnormalRecord', data)
}

// 确认入经
function enterPathway (data) {
  return resident.post('/clinical-pathway/pathwayInstance/enterPathway', data)
}

// 主动入径的路径列表展示
function getPathwayByPatient (data) {
  return resident.post('/clinical-pathway/clinicalPathway/getPathwayByPatient', data)
}

// 更新护理实例状态
function updateStatusBatchHl (data) {
  return resident.post('/clinical-pathway/nursingInstance/updateStatusBatch', data)
}

// 更新治疗实例状态
function updateStatusBatch (data) {
  return resident.post('/clinical-pathway/treatmentInstance/updateStatusBatch', data)
}

// 根据住院号获取阶段实例信息
function getPathwayStageInstanceInfo (data) {
  return resident.post('/clinical-pathway/commonInstance/getPathwayStageInstanceInfo', data)
}

// 根据住院号获取当前阶段ID
function getStageInstanceIdByHospitalizedNumber (data) {
  return resident.post('/clinical-pathway/stageInstance/getStageInstanceIdByHospitalizedNumber', data)
}

// 提交交叉配血医嘱
function createMatchingAdvice (data) {
  return resident.post('sob/medicalOrder/createMatchingAdvice', data)
}

// 退出路径接口
function exitPathway (data) {
  return resident.post('/clinical-pathway/pathwayInstance/exitPathway', data)
}

// 查询患者当前状态
function getPathwayStatus (data) {
  return resident.post('/clinical-pathway/pathwayLog/getPathwayStatus', data)
}
// 下一步变异信息弹窗
function updateStatusAndNext (data) {
  return resident.post('/clinical-pathway/stageInstance/updateStatusAndNext', data)
}

// 变异查询下拉框根据住院号获取阶段实例信息
function listByHospitalizedNumber (data) {
  return resident.post('/clinical-pathway/stageInstance/listByHospitalizedNumber', data)
}
// 返回母婴同床
function updateNeonateToBed (data) {
  return resident.post('/workbench/neonate/updateNeonateToBed', data)
}
// 终止手术
function terminationSurgery (data) {
  return resident.post('/workbench/surgeryNoticeController/terminationSurgery', data)
}
// 叫号
function callNumByGroupId (params) {
  return resident.post('/thc-queue/queueContent/callNumByGroupId', params)
}

// 获取科室名字
function queryServiceProvider (params) {
  return resident.post('/sob/serviceprovider/queryServiceProvider', params)
}

// 门诊护士获取科室名字
function getLocalSectionVoListForService (params) {
  return resident.post('/warehouse/localSectionRecord/getLocalSectionVoListForService/', params)
}
// 产房病区管理
function getBedList (params) {
  if (source) source.cancel('多次重复请求取消')
  source = CancelToken.source()
  return resident.post('/workbench/ipBed/getBedList', params, {
    cancelToken: source.token
  }).catch(e => { })
}
// 转出产房
function createOut (params) {
  return resident.post('/workbench/obstetric/createOut', params)
}
// 产房工作站患者列表
function getObstetricPatientList (params) {
  if (source) source.cancel('多次重复请求取消')
  source = CancelToken.source()
  return resident.post('/workbench/obstetric/getObstetricPatientList', params, {
    cancelToken: source.token
  }).catch(e => { })
}
// 产房分床
function createObstetric (params) {
  return resident.post('/workbench/obstetric/createObstetric', params)
}
// 转入产房
function createIn (params) {
  return resident.post('/workbench/obstetric/createIn', params)
}
// 查询全部医生
function getDoctorList (params) {
  return resident.post('/warehouse/staffRecord/getStaffRecordVoListForService/', params)
}

// 查询全部医生
function getStaffRecordVoListForBlocService (params) {
  return resident.post('/warehouse/staffRecord/getStaffRecordVoListForBlocService/', params)
}

// 根据学科专业（科室）查询条件返回学科专业（科室）的详细信息及人员信息接口
function getTenantSubjectListHasStaffByCondition (params) {
  return resident.post('/thc-platform-core/out/subject/getTenantSubjectListHasStaffByCondition', params)
}

// 入科分床
function entrance (params) {
  return resident.post('/workbench/ipPatient/entrance', params)
}

// 新生儿登记
function register (params) {
  return resident.post('/workbench/ipNeonate/register', params)
}

// 根据母亲住院号查询所有新生儿信息
function getByMotherHospitalizedNumber (params) {
  return resident.post('/workbench/ipNeonate/getByMotherHospitalizedNumber', params)
}

// 请假外出
function createLeave (params) {
  return resident.post('/workbench/ipLeave/createLeave', params)
}
// 请假返回
function updateLeave (params) {
  return resident.post('/workbench/ipLeave/updateLeave', params)
}

// 根据住院号查询最近一条请假外出的记录和其他所有的已完成请假记录
function getLatelyLeaveAndList (params) {
  return resident.post('/workbench/ipLeave/getLatelyLeaveAndList', params)
}

// 根据人员查病区
function getSickAreaListByCondition (params) {
  return resident.post('/thc-platform-core/out/sickArea/getSickAreaListByCondition', params)
}

// 根据病区查人员
function getStaffListByCondition (params) {
  return resident.post('/thc-platform-core/out/staff/getStaffListByCondition', params)
}

// 根据人员id获取人员信息和执业机构以及执业机构下的科室信息
function getWorkClinicAndSection (data) {
  return resident.post('/thc-platform-core/out/staff/getStaffListHasSubjectByCondition', data)
}

// 锁床
function lockBed (data) {
  return resident.post('/workbench/ipBed/lockBed', data)
}

// 取消锁床
function releaseBed (data) {
  return resident.post('/workbench/ipBed/releaseBed', data)
}

// 转科/转病区
function change (data) {
  return resident.post('/workbench/ipPatient/change', data).then(res => {
    return res
  }).catch(err => {
    return err
  })
}

// 取消转科/转病区
function cancelChange (data) {
  return resident.post('/workbench/ipPatient/cancelChange', data).then(res => {
    return res
  }).catch(err => {
    return err
  })
}

//
function getRoomNullBedList (data) {
  return resident.post('/workbench/ipBed/getRoomNullBedList', data)
}

// 包床
function packedBed (data) {
  return resident.post('/workbench/ipBed/packedBed', data)
}

// 取消包床
function cancelPackedBed (data) {
  return resident.post('/workbench/ipBed/cancelPackedBed', data)
}

// 根据床位id查询床位使用情况
function getBedById (data) {
  return resident.post('/workbench/ipBed/getBedById', data)
}

// 换床
function changeBed (data) {
  return resident.post('/workbench/ipBed/changeBed', data)
}

// 根据住院流水号查看患者床头卡信息
function getInpatientIconsbyHosNumber (data) {
  return resident.post('/workbench/ipPatient/getInpatientIconsbyHosNumber', data)
}

// 通过patientId查询是否存在入院申请单
function getApplyByHospitalizedNumberList (data) {
  return resident.post('/adt/doctor/admit/getApplyByHospitalizedNumberList', data)
}

// 更新入科信息
function updateEntrance (data) {
  return resident.post('/workbench/ipPatient/updateEntrance', data)
}

// 病区全部床列表
function getAllBedList (data) {
  return resident.post('/workbench/ipBed/getAllBedList', data)
}
// 病区床头卡顶栏信息
function getTopBars (data) {
  return resident.post('/workbench/ipBed/getTopBars', data)
}

// 查询某个患者的待入科信息
function getWaittingEntrance (data) {
  return resident.post('/workbench/ipPatient/getWaittingEntrance', data)
}

// 出科医嘱及执行单校验
function checkAdvicesAndExecutes (data) {
  return resident.post('/workbench/ipPatient/checkAdvicesAndExecutes', data)
}

// 出院
function leaveHospital (data) {
  return resident.post('/workbench/ipPatient/leaveHospital', data).then(res => {
    return res
  }).catch(err => {
    return err
  })
}

// 取消出院
function cancelLeaveHospital (data) {
  return resident.post('/workbench/ipPatient/cancelLeaveHospital', data).then(res => {
    return res
  }).catch(err => {
    return err
  })
}

// 取消入科
function cancelEntrance (data) {
  return resident.post('/workbench/ipPatient/cancelEntrance', data)
}

// 新生儿回显
function getNeonateById (data) {
  return resident.post('/workbench/ipNeonate/getNeonateById', data)
}

// 取消新生儿登记
function unregister (data) {
  return resident.post('/workbench/ipNeonate/unregister', data)
}

// 查询包床列表
function getPackedBed (data) {
  return resident.post('/workbench/ipBed/getPackedBed', data)
}

//  批量取消包床
function cancelPackedBedBatch (data) {
  return resident.post('/workbench/ipBed/cancelPackedBedBatch', data)
}

//  查看病区操作日志
function queryAreaOperateList (data) {
  return resident.post('/workbench/areaOperateLog/queryAreaOperateList', data)
}

function getStaffListHasOrgHasSubjectByCondition (data) {
  return resident.post('/thc-platform-core/out/staff/getStaffListHasOrgHasSubjectByCondition', data)
}
export default {
  queryAreaOperateList,
  cancelPackedBedBatch,
  getPackedBed,
  getNeonateById,
  unregister,
  getStaffListHasOrgHasSubjectByCondition,
  cancelEntrance,
  cancelLeaveHospital,
  leaveHospital,
  checkAdvicesAndExecutes,
  getWaittingEntrance,
  getAllBedList,
  updateEntrance,
  getApplyByHospitalizedNumberList,
  getInpatientIconsbyHosNumber,
  changeBed,
  getBedById,
  cancelPackedBed,
  packedBed,
  getRoomNullBedList,
  cancelChange,
  change,
  releaseBed,
  lockBed,
  getWorkClinicAndSection,
  getStaffListByCondition,
  getSickAreaListByCondition,
  updateLeave,
  getLatelyLeaveAndList,
  createLeave,
  getByMotherHospitalizedNumber,
  entrance,
  register,
  getTenantSubjectListHasStaffByCondition,
  getStaffRecordVoListForBlocService,
  createIn,
  createObstetric,
  getObstetricPatientList,
  createOut,
  getBedList,
  getLocalSectionVoListForService,
  finishPathway,
  queryServiceProvider,
  callNumByGroupId,
  terminationSurgery,
  updateNeonateToBed,
  listByHospitalizedNumber,
  updateStatusAndNext,
  getPathwayStatus,
  getConstantsByKey,
  exitPathway,
  listByStageInstanceId,
  getAbnormalRecords,
  mappingPathway,
  enterPathway,
  getPathwayStageInstanceInfo,
  createMatchingAdvice,
  getStageInstanceIdByHospitalizedNumber,
  updateStatusBatchHl,
  updateStatusBatch,
  getPathwayByPatient,
  refuseEnterPathway,
  getPathwayAbnormalDictionarys,
  getPathwayAbnormalCollections,
  listByStageInstanceIdHl,
  queryHospitalAdviceByHospitalNumber,
  stopInpatientAdviceByHospitalizedNumber,
  executeAdvice,
  queryHospitalAdvice,
  getAppliance2Entrance,
  wristbandManage,
  updateHospitalBedRelationData,
  createOccupyBeds,
  hospitalizedEntranceMsgCreate,
  getPatientMsgByHospitalizedNumber,
  getBedCountByAreaId,
  getPendingSectionPatient,
  getHosPatientListByCondition,
  getBedListByCondition,
  getCurrentUser,
  getSpaceRecordVoListForService,
  getArrangeDepts,
  getArrangeServiceList,
  appointmentCreate,
  getAll,
  searchFuzzy,
  findByExectueMessage,
  createAbnormalRecord,
  getDoctorList,
  getTopBars,
}
