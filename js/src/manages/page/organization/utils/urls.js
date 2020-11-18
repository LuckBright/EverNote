const prefix = '/thc-platform-core'
// const prefix = ''
export default {
  // 机构
  org: {
    loadByCode: { url: prefix + '/tsOrganization/loadByCode', isStatic: false },
    updateParentCodeRelationByIds: { url: prefix + '/tsOrganization/updateParentCodeRelationByIds', isStatic: false },
    loadWithChildsById: { url: prefix + '/tsOrganization/loadWithChildsById', isStatic: false },
    pageList: { url: prefix + '/tsOrganization/pageList', isStatic: false },
    load: { url: prefix + '/tsOrganization/load', isStatic: false },
    insert: { url: prefix + '/tsOrganization/insert', isStatic: false },
    delete: { url: prefix + '/tsOrganization/delete', isStatic: false },
    update: { url: prefix + '/tsOrganization/update', isStatic: false },
    loadByStaffId: { url: prefix + '/tsOrganization/loadByStaffId', isStatic: false },
    getOrgListByCondition: { url: prefix + '/out/organization/getOrgListByCondition', isStatic: false },
  },
  orgWebh: {
    load: { url: prefix + '/tsOrganizationWebHospital/load', isStatic: false },
    insert: { url: prefix + '/tsOrganizationWebHospital/insert', isStatic: false },
    delete: { url: prefix + '/tsOrganizationWebHospital/delete', isStatic: false },
    update: { url: prefix + '/tsOrganizationWebHospital/update', isStatic: false },
    tsHospitalConfigLoad: { url: prefix + '/tsHospitalConfig/load', isStatic: false },
    tsHospitalConfigInsert: { url: prefix + '/tsHospitalConfig/insert', isStatic: false },
    tsHospitalConfigUpdate: { url: prefix + '/tsHospitalConfig/update', isStatic: false },
    tsHospitalConfigDelete: { url: prefix + '/tsHospitalConfig/delete', isStatic: false },
  },
  // 部门
  dept: {
    loadByOrgIdAndCode: { url: prefix + '/tsDepartment/loadByOrgIdAndCode', isStatic: false },
    pageList: { url: prefix + '/tsDepartment/pageList', isStatic: false },
    load: { url: prefix + '/tsDepartment/load', isStatic: false },
    insert: { url: prefix + '/tsDepartment/insert', isStatic: false },
    delete: { url: prefix + '/tsDepartment/delete', isStatic: false },
    update: { url: prefix + '/tsDepartment/update', isStatic: false },
  },
  // 科室
  subject: {
    updateParentOrgSubjectCodeRelationByIds: { url: prefix + '/tsOrganizationSubject/updateParentOrgSubjectCodeRelationByIds', isStatic: false },
    loadOrgSubjectListByOrgId: { url: prefix + '/tsOrganizationSubject/loadOrgSubjectListByOrgId', isStatic: false },
    loadTenantSubjectListByOrgId: { url: prefix + '/tsOrganizationSubject/loadTenantSubjectListByOrgId', isStatic: false },
    loadByOrgIdAndCode: { url: prefix + '/tsOrganizationSubject/loadByOrgIdAndCode', isStatic: false },
    insertList: { url: prefix + '/tsOrganizationSubject/insertList', isStatic: false },
    pageList: { url: prefix + '/tsOrganizationSubject/pageList', isStatic: false },
    load: { url: prefix + '/tsOrganizationSubject/load', isStatic: false },
    insert: { url: prefix + '/tsOrganizationSubject/insert', isStatic: false },
    delete: { url: prefix + '/tsOrganizationSubject/delete', isStatic: false },
    update: { url: prefix + '/tsOrganizationSubject/update', isStatic: false },
    outGetTenantSubjectListByCondition: { url: prefix + '/out/subject/getTenantSubjectListByCondition', isStatic: false },
  },
  // 病区
  sickArea: {
    outGetSickAreaListByCondition: { url: prefix + '/out/sickArea/getSickAreaListByCondition', isStatic: false },
  },
  // 人员
  staff: {
    loadStaffListByOrgId: { url: prefix + '/tsStaff/loadStaffListByOrgId', isStatic: false },
    pageList: { url: prefix + '/tsStaff/pageList', isStatic: false },
    load: { url: prefix + '/tsStaff/load', isStatic: false },
    insert: { url: prefix + '/tsStaff/insert', isStatic: false },
    delete: { url: prefix + '/tsStaff/delete', isStatic: false },
    update: { url: prefix + '/tsStaff/update', isStatic: false },
    getStaffListByIdList: { url: prefix + '/out/staff/getStaffListByIdList', isStatic: false },
    getStaffListByCondition: { url: prefix + '/out/staff/getStaffListByCondition', isStatic: false },
  },
  staffWebh: {
    load: prefix + '/tsStaffWeb/load',
    insert: { url: prefix + '/tsStaffWeb/insert', isStatic: false },
    delete: { url: prefix + '/tsStaffWeb/delete', isStatic: false },
    update: { url: prefix + '/tsStaffWeb/update', isStatic: false },
    reportWebStaff: { url: prefix + '/tsStaffWeb/reportWebStaff', isStatic: false },
  },
  tsOrganizationSignHospital: {
    load: prefix + '/tsOrganizationSignHospital/load',
    insert: { url: prefix + '/tsOrganizationSignHospital/insert', isStatic: false },
    delete: { url: prefix + '/tsOrganizationSignHospital/delete', isStatic: false },
    update: { url: prefix + '/tsOrganizationSignHospital/update', isStatic: false },
  },
  staffWebCredit: {
    load: prefix + '/tsStaffWebCredit/load',
    loadByThcStaffId: prefix + '/tsStaffWebCredit/loadByThcStaffId',
    pageList: prefix + '/tsStaffWebCredit/pageList', // 暂未使用
    insert: { url: prefix + '/tsStaffWebCredit/insert', isStatic: false },
    delete: { url: prefix + '/tsStaffWebCredit/delete', isStatic: false },
    update: { url: prefix + '/tsStaffWebCredit/update', isStatic: false },
  },
  tsOrganizationTenantSubjectPermission: {
    loadByTenantSubjectCode: { url: prefix + '/tsOrganizationTenantSubjectPermission/loadByTenantSubjectCode', isStatic: false },
    loadByOrgId: { url: prefix + '/tsOrganizationTenantSubjectPermission/loadByOrgId', isStatic: false },
    insertList: { url: prefix + '/tsOrganizationTenantSubjectPermission/insertList', isStatic: false },
  },
  tsOrganizationStaffPermission: {
    loadByStaffId: { url: prefix + '/tsOrganizationStaffPermission/loadByStaffId', isStatic: false },
    insertList: { url: prefix + '/tsOrganizationStaffPermission/insertList', isStatic: false },
  },
  unify: {
    createOrUpdateUserInfo: prefix + '/unify/createOrUpdateUserInfo',
    getUserDetails: prefix + '/unify/getUserDetails',
    releaseUserLock: { url: prefix + '/unify/releaseUserLock', isStatic: false }
  },
  role: {
    loadByStaffId: prefix + '/sys/role/loadByStaffId',
  },
  shop: {
    getShopId: '/titan-mall/manage/shop/list'
  }
}
